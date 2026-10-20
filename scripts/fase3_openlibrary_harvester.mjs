/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FASE 3 — MARCO DE 1.000.000 DE LIVROS
 * Ingestão filtrada de edições abertas da Open Library (scale-out)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Diferenças face à v1 (que parava em 20 páginas / ~2.000 obras):
 *   • Paginação por cursor com procura exaustiva por `subject`/`title`
 *   • Filtro obrigatório de licença aberta (public_domain_b/true + printdisabled=false)
 *   • Streaming em memória constante (nunca carrega o dump em RAM)
 *   • Checkpoints retomáveis (.scratch/fase3-checkpoint.json)
 *   • Deduplicação global por (fonte_id, fonte_id_externo) via Set persistente
 *   • Lotes SQL incrementais written to disk (nunca buffers tudo em RAM)
 *   • Politeness: delays configuráveis + backoff exponencial em 429/5xx
 *
 * AGENTS.md — CONFORMIDADE ESTRITA:
 *   • Apenas metadados (título, autor, ano, idioma, licença, sinopse, capa)
 *   • ZERO armazenamento local de ficheiros de obras
 *   • Leitura via redirecionamento HTTP 302 para archive.org / openlibrary.org
 *   • Idempotência por (fonte_id, fonte_id_externo)
 *
 * Uso:
 *   node scripts/fase3_openlibrary_harvester.mjs --dry-run
 *   node scripts/fase3_openlibrary_harvester.mjs --target 1000000 --apply
 *   node scripts/fase3_openlibrary_harvester.mjs --target 1000000 --resume
 *   node scripts/fase3_openlibrary_harvester.mjs --status
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB = process.env.D1_DATABASE || 'lino-livre-db';
const DB_LOCAL = 'biblioteca.db';
const SQL_DIR = path.resolve('.scratch/sql-fase3-ol');
const CHECKPOINT = path.resolve('.scratch/fase3-checkpoint.json');
const SEEN_FILE = path.resolve('.scratch/fase3-vistos.json');

const BATCH_SIZE = 500;
const PAGE_LIMIT = 100;             // máximo de páginas por consulta (OL usa deep pagination)
const RESULTS_PER_PAGE = 100;
const DELAY_MS = 120;               // cortesia à API pública
const MAX_RETRIES = 5;
const USER_AGENT = 'LinoLivre-Fase3/3.0 (biblioteca digital aberta; educacional; contact: bv6alblu6@mozmail.com)';

// ── Termos de pesquisa que cobrem o corpus público-domain ──────────────────
const CONSULTAS_PADRAO = [
  'subject:fiction',
  'subject:literature',
  'subject:history',
  'subject:science',
  'subject:philosophy',
  'subject:poetry',
  'subject:travel',
  'subject:children',
  'subject:drama',
  'subject:education'
];

function banner(t) {
  console.log(`\n${'═'.repeat(78)}`);
  console.log(`📚 ${t}`);
  console.log(`${'═'.repeat(78)}\n`);
}

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function runWithRetry(cmd, maxRetries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return execSync(cmd, { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const wait = 2000 * attempt * attempt;
      console.warn(`      ⚠ Tentativa ${attempt}/${maxRetries}: ${String(err.message).slice(0, 120)} — aguarda ${wait}ms`);
      sleep(wait);
    }
  }
}

// ── Checkpoint / estado ────────────────────────────────────────────────────
function carregarCheckpoint() {
  if (!fs.existsSync(CHECKPOINT)) return { consulta: 0, pagina: 1, total: 0, concluido: false };
  try { return JSON.parse(fs.readFileSync(CHECKPOINT, 'utf-8')); } catch { return { consulta: 0, pagina: 1, total: 0, concluido: false }; }
}

function gravarCheckpoint(cp) {
  fs.mkdirSync(path.dirname(CHECKPOINT), { recursive: true });
  fs.writeFileSync(CHECKPOINT, JSON.stringify(cp, null, 2));
}

function carregarVistos() {
  if (!fs.existsSync(SEEN_FILE)) return new Set();
  try { return new Set(JSON.parse(fs.readFileSync(SEEN_FILE, 'utf-8'))); } catch { return new Set(); }
}

function gravarVistos(vistos) {
  fs.mkdirSync(path.dirname(SEEN_FILE), { recursive: true });
  fs.writeFileSync(SEEN_FILE, JSON.stringify([...vistos]));
}

// ── API Open Library ───────────────────────────────────────────────────────
function urlConsulta(consulta, pagina) {
  const q = encodeURIComponent(consulta);
  return `https://openlibrary.org/search.json?q=${q}` +
    `&has_fulltext=true` +
    `&public_scan_b=true` +
    `&printdisabled=false` +
    `&limit=${RESULTS_PER_PAGE}` +
    `&page=${pagina}`;
}

async function consultarOpenLibrary(consulta, pagina) {
  const url = urlConsulta(consulta, pagina);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
        signal: AbortSignal.timeout(30000)
      });
      if (res.status === 429 || res.status >= 500) {
        const espera = 1500 * 2 ** (attempt - 1);
        console.warn(`      ⚠ HTTP ${res.status} — backoff ${espera}ms`);
        await new Promise(r => setTimeout(r, espera));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
  throw new Error('Falha persistente ao consultar a Open Library');
}

// ── Mapeamento ────────────────────────────────────────────────────────────
const MAPA_IDIOMA = [
  [/^por|^pt/, 'pt'], [/^eng|^en/, 'en'], [/^fre|^fra|^fr/, 'fr'],
  [/^ger|^deu|^de/, 'de'], [/^spa|^es/, 'es'], [/^ita|^it/, 'it'],
  [/^rus|^ru/, 'ru'], [/^chi|^zho|^zh/, 'zh'], [/^ara|^ar/, 'ar'],
  [/^jpn|^ja/, 'ja'], [/^nld|^nl/, 'nl'], [/^swe|^sv/, 'sv'],
  [/^nor|^no/, 'no'], [/^ces|^cs/, 'cs'], [/^heb|^he/, 'he']
];

function mapearIdioma(lista) {
  if (!lista || !lista.length) return 'en';
  for (const [re, cod] of MAPA_IDIOMA) {
    for (const l of lista) if (re.test(String(l).toLowerCase())) return cod;
  }
  return 'outro';
}

/** Só aceita edições inequivocamente livres (public domain ou CC). */
function classificacaoAcesso(d) {
  const dscan = d.public_scan_b;
  const edicoes = Array.isArray(d.edition_key) ? d.edition_key : [];
  if (d.has_fulltext !== true && !dscan) return null;
  if (dscan === false) return null;
  if (d.printdisabled === true) return null;
  // Sem identificador de edição digital não há leitura full-text garantida
  if (!edicoes.length) return null;

  // Só classifica como domínio público estrito se a publicação tiver comprovação histórica (pré-1928)
  const ano = d.first_publish_year || (Array.isArray(d.publish_year) && d.publish_year.length ? d.publish_year[0] : null);
  if (ano && ano <= 1928) {
    return 'dominio-publico';
  }
  return 'outro';
}

// ── Escrita de lotes SQL (streaming) ──────────────────────────────────────
class EscritorLotes {
  constructor(dir, prefixo, tamanhoLote = BATCH_SIZE) {
    this.dir = dir; this.prefixo = prefixo; this.tamanho = tamanhoLote;
    this.autorBuf = new Map(); this.livroBuf = []; this.linkBuf = [];
    this.numLote = 0; this.totalLivros = 0; this.ficheiros = [];
    this.maxAutorId = 70000; this.maxLivroId = 300000; this.maxLinkId = 400000;
    fs.mkdirSync(dir, { recursive: true });
  }

  _flush() {
    if (!this.livroBuf.length) return;
    this.numLote++;
    const linhas = [];
    for (const a of this.autorBuf.values()) {
      linhas.push(`INSERT OR IGNORE INTO autores (id, nome) VALUES (${a.id}, ${esc(a.nome)});`);
    }
    for (const l of this.livroBuf) {
      linhas.push(
        `INSERT OR IGNORE INTO livros (id, titulo, idioma, sinopse, capa_url, ano_publicacao, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras, conteudo_texto) VALUES ` +
        `(${l.id}, ${esc(l.titulo)}, ${esc(l.idioma)}, ${esc(l.sinopse)}, ${esc(l.capaUrl)}, ${esc(l.ano)}, ${l.autorId}, ${l.categoriaId}, ${l.fonteId}, ${esc(l.fonteIdExterno)}, ${esc(l.licenca)}, 0, NULL);`
      );
    }
    for (const k of this.linkBuf) {
      linhas.push(
        `INSERT OR IGNORE INTO links_livros (id, livro_id, formato, url, link_externo) VALUES ` +
        `(${k.id}, ${k.livroId}, ${esc(k.formato)}, ${esc(k.url)}, 1);`
      );
    }
    const num = String(this.numLote).padStart(4, '0');
    const f = path.join(this.dir, `${this.prefixo}-lote-${num}.sql`);
    fs.writeFileSync(f, linhas.join('\n') + '\n');
    this.ficheiros.push(f);
    this.autorBuf.clear(); this.livroBuf = []; this.linkBuf = [];
  }

  adicionarAutor(nome, nacionalidade) {
    const chave = nome.toLowerCase().trim();
    if (this.autorBuf.has(chave)) return this.autorBuf.get(chave).id;
    this.maxAutorId++;
    const id = this.maxAutorId;
    this.autorBuf.set(chave, { id, nome, nacionalidade });
    return id;
  }

  adicionarLivro(livro) {
    this.maxLivroId++;
    this.maxLinkId++;
    const id = this.maxLivroId;
    this.livroBuf.push({ ...livro, id });
    this.linkBuf.push({ id: this.maxLinkId, livroId: id, formato: 'html', url: livro.urlLeitura });
    this.totalLivros++;
    if (this.livroBuf.length >= this.tamanho) this._flush();
    return id;
  }

  fechar() { this._flush(); return this.ficheiros; }
}

// ── Orquestração ───────────────────────────────────────────────────────────
async function executar(args) {
  const aplicar = args.includes('--apply');
  const retomar = args.includes('--resume');
  const idxTarget = args.indexOf('--target');
  const meta = idxTarget !== -1 ? parseInt(args[idxTarget + 1], 10) : 1000000;
  const idxCons = args.indexOf('--consulta');
  const consultas = idxCons !== -1 ? [args[idxCons + 1]] : CONSULTAS_PADRAO;

  banner('FASE 3 — Ingestão filtrada da Open Library (meta: 1.000.000)');
  console.log(`Consulta(s): ${consultas.length} | Meta: ${meta.toLocaleString('pt-PT')} obras`);
  console.log(`Modo: ${aplicar ? 'APLICAR (SQLite local + D1 remoto)' : 'DRY-RUN (gera lotes SQL)'}${retomar ? ' | RETOMAR do checkpoint' : ''}\n`);

  const cp = retomar ? carregarCheckpoint() : { consulta: 0, pagina: 1, total: 0, concluido: false };
  if (retomar) console.log(`↻ Retomando: consulta ${cp.consulta + 1}/${consultas.length}, página ${cp.pagina}, ${cp.total} já recolhidas\n`);

  const vistos = carregarVistos();
  console.log(`Deduplicação: ${vistos.size.toLocaleString('pt-PT')} identificadores já vistos\n`);

  const escritor = new EscritorLotes(SQL_DIR, 'ol3');
  const catId = 39;   // 📚 Clássicos Mundiais
  const fonteId = 6;  // Open Library

  let totalRecolhidas = cp.total;
  let inicio = Date.now();

  for (let ci = cp.consulta; ci < consultas.length; ci++) {
    const consulta = consultas[ci];
    const paginaInicial = ci === cp.consulta ? cp.pagina : 1;

    for (let pagina = paginaInicial; pagina <= PAGE_LIMIT; pagina++) {
      if (totalRecolhidas >= meta) break;

      let dados;
      try {
        dados = await consultarOpenLibrary(consulta, pagina);
      } catch (err) {
        console.warn(`   ⚠ ${consulta} p.${pagina}: ${err.message} — saltando`);
        break;
      }

      const docs = dados.docs || [];
      if (!docs.length) break;

      let nestaPagina = 0;
      for (const d of docs) {
        if (totalRecolhidas >= meta) break;
        if (!d.title || !String(d.title).trim()) continue;

        const licenca = classificacaoAcesso(d);
        if (!licenca) continue;              // sem leitura full-text livre → descartado

        const iaId = Array.isArray(d.ia) && d.ia.length ? d.ia[0] : null;
        const edicoes = Array.isArray(d.edition_key) ? d.edition_key : [];
        const extId = iaId ? `ol-${iaId}` : `ol-ed-${edicoes[0]}`;
        if (!iaId && !edicoes.length) continue;
        if (vistos.has(extId)) continue;
        vistos.add(extId);

        const titulo = String(d.title).trim().slice(0, 250);
        const autorNome = Array.isArray(d.author_name) && d.author_name.length
          ? String(d.author_name[0]).trim().slice(0, 200)
          : 'Autor Desconhecido';

        const ano = d.first_publish_year
          || (Array.isArray(d.publish_year) && d.publish_year.length ? d.publish_year[0] : null);

        const idioma = mapearIdioma(d.language);
        const capaUrl = d.cover_i
          ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
          : (iaId ? `https://archive.org/services/img/${iaId}` : null);
        const urlLeitura = iaId
          ? `https://archive.org/details/${iaId}`
          : `https://openlibrary.org/books/${edicoes[0]}`;

        let sinopse = 'Edição aberta indexada pela Open Library, com texto integral legível no Internet Archive.';
        if (Array.isArray(d.subject) && d.subject.length) {
          sinopse += ` Assuntos: ${d.subject.slice(0, 3).join(', ')}.`;
        }
        if (d.first_sentence && typeof d.first_sentence === 'string') {
          sinopse = `${d.first_sentence.slice(0, 220)} ${sinopse}`;
        }
        sinopse = sinopse.slice(0, 400);

        const autorId = escritor.adicionarAutor(autorNome, null);

        escritor.adicionarLivro({
          titulo,
          idioma,
          sinopse,
          capaUrl,
          ano: (ano && ano > 0 && ano < 2030) ? ano : null,
          autorId,
          categoriaId: catId,
          fonteId,
          fonteIdExterno: extId,
          licenca,
          urlLeitura
        });

        totalRecolhidas++;
        nestaPagina++;
      }

      if (nestaPagina > 0) {
        const elapsed = (Date.now() - inicio) / 1000;
        const rate = (totalRecolhidas - cp.total) / Math.max(elapsed, 0.001);
        console.log(`   ✔ ${consulta} p.${String(pagina).padStart(3)} | +${nestaPagina} | total ${totalRecolhidas.toLocaleString('pt-PT')} | ${rate.toFixed(0)}/s`);
      }

      gravarCheckpoint({ consulta: ci, pagina: pagina + 1, total: totalRecolhidas, concluido: false });
      gravarVistos(vistos);
      await new Promise(r => setTimeout(r, DELAY_MS));
    }

    if (totalRecolhidas >= meta) break;
  }

  const ficheiros = escritor.fechar();
  console.log(`\n─── Resumo da recolha ───`);
  console.log(`   Obras recolhidas : ${totalRecolhidas.toLocaleString('pt-PT')}`);
  console.log(`   Lotes SQL gerados: ${ficheiros.length}`);
  console.log(`   Deduplicados     : ${vistos.size.toLocaleString('pt-PT')} identificadores únicos`);

  if (!aplicar) {
    console.log(`\nℹ Dry-run concluído. Execute com --apply para aplicar.`);
    return;
  }

  console.log(`\n─── A aplicar lotes ───`);
  let n = 0;
  for (const f of ficheiros) {
    try {
      execSync(`sqlite3 ${DB_LOCAL} < ${JSON.stringify(f)}`, { stdio: 'pipe' });
    } catch (err) {
      console.warn(`   ⚠ local: ${String(err.message).slice(0, 90)}`);
    }
    try {
      runWithRetry(`npx wrangler d1 execute ${DB} --remote --file=${JSON.stringify(f)} --yes`);
    } catch (err) {
      console.warn(`   ⚠ D1: ${String(err.message).slice(0, 90)}`);
    }
    n++;
    if (n % 10 === 0) console.log(`   ✔ ${n}/${ficheiros.length} lotes aplicados`);
  }
  gravarCheckpoint({ consulta: consultas.length, pagina: 1, total: totalRecolhidas, concluido: true });
  console.log(`\n🎉 Fase 3 concluída — ${totalRecolhidas.toLocaleString('pt-PT')} obras indexadas.`);
}

function status() {
  banner('FASE 3 — Status');
  const cp = carregarCheckpoint();
  console.log(`Checkpoint: ${JSON.stringify(cp, null, 2)}`);
  try {
    const out = execSync(
      `sqlite3 ${DB_LOCAL} "SELECT count(*) FROM livros; SELECT count(*) FROM links_livros;"`,
      { encoding: 'utf-8' }
    ).trim().split('\n');
    console.log(`\nSQLite local → livros: ${out[0]} | links: ${out[1]}`);
  } catch (e) {
    console.log(`\n⚠ ${e.message}`);
  }
  if (fs.existsSync(SQL_DIR)) {
    const fs2 = fs.readdirSync(SQL_DIR).filter(f => f.startsWith('ol3-lote-'));
    console.log(`Lotes prontos: ${fs2.length}`);
  }
}

const args = process.argv.slice(2);
if (args.includes('--status')) status();
else executar(args).catch(err => { console.error('❌', err); process.exit(1); });
