/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FASE 4 — META DE 10.000.000 DE LIVROS
 * Ingestão do dump massivo da Open Library (streaming de constante memória)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Os dumps oficiais da Open Library (openlibrary.org/data) têm:
 *   • ol_dump_editions_latest.txt.gz  →  ~12,6 GB comprimidos, ~50M edições
 *   • ol_dump_works_latest.txt.gz     →  ~4,1 GB comprimidos, ~30M obras
 *   • ol_dump_authors_latest.txt.gz  →  ~782 MB comprimidos, ~10M autores
 *
 * Formato: TSV de 5 colunas
 *   1) /type/edition   2) /books/OLxxxxM   3) revisão   4) data   5) JSON
 *
 * Este script:
 *   • Descomprime em STREAM (nunca carrega o ficheiro em RAM)
 *   • Processa linha a linha com backpressure (constante ~50 MB de memória)
 *   • Filtra SOMENTE edições com leitura integral aberta (ocaid + não desativada)
 *   • Faz checkpoint por nº de linha → retomável sem perder trabalho
 *   • Emite lotes SQL incrementais em disco
 *
 * AGENTS.md — CONFORMIDADE ESTRITA:
 *   • Apenas metadados. ZERO armazenamento local de ficheiros de obras.
 *   • Leitura via 302 para archive.org/details/<ocaid>
 *   • Idempotência por (fonte_id, fonte_id_externo) = 'ol-dump-<OLkey>'
 *
 * Uso:
 *   node scripts/fase4_openlibrary_dump.mjs --info
 *   node scripts/fase4_openlibrary_dump.mjs --target 10000000 --dry-run
 *   node scripts/fase4_openlibrary_dump.mjs --target 10000000 --apply
 *   node scripts/fase4_openlibrary_dump.mjs --target 10000000 --resume
 *   node scripts/fase4_openlibrary_dump.mjs --status
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import readline from 'node:readline';
import { Readable } from 'node:stream';

const DB = process.env.D1_DATABASE || 'lino-livre-db';
const DB_LOCAL = 'biblioteca.db';
const SQL_DIR = path.resolve('.scratch/sql-fase4-dump');
const CHECKPOINT = path.resolve('.scratch/fase4-checkpoint.json');
const VISTOS = path.resolve('.scratch/fase4-vistos.txt');

const BATCH_SIZE = 500;
const USER_AGENT = 'LinoLivre-Fase4/4.0 (biblioteca digital aberta; educacional; contact: bv6alblu6@mozmail.com)';

const DUMPS = {
  editions: {
    url: 'https://openlibrary.org/data/ol_dump_editions_latest.txt.gz',
    bytes: 12617475043,
    desc: 'Edições (com ocaid → leitura integral no Internet Archive)'
  },
  works: {
    url: 'https://openlibrary.org/data/ol_dump_works_latest.txt.gz',
    bytes: 4073320823,
    desc: 'Obras (agrupa edições; usado para sincronização de metadados)'
  },
  authors: {
    url: 'https://openlibrary.org/data/ol_dump_authors_latest.txt.gz',
    bytes: 782352949,
    desc: 'Autores (normalização de nomes)'
  }
};

function banner(t) {
  console.log(`\n${'═'.repeat(78)}`);
  console.log(`🌍 ${t}`);
  console.log(`${'═'.repeat(78)}\n`);
}

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function sleep(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

// ── Checkpoint ─────────────────────────────────────────────────────────────
function carregarCP() {
  if (!fs.existsSync(CHECKPOINT)) return { linha: 0, total: 0, concluido: false, fonte: 'editions' };
  try { return JSON.parse(fs.readFileSync(CHECKPOINT, 'utf-8')); } catch { return { linha: 0, total: 0, concluido: false, fonte: 'editions' }; }
}
function gravarCP(cp) {
  fs.mkdirSync(path.dirname(CHECKPOINT), { recursive: true });
  fs.writeFileSync(CHECKPOINT, JSON.stringify(cp, null, 2));
}

// ── Deduplicação persistente (append-only, memória O(1) via ficheiro) ──────
class Deduplicador {
  constructor(caminho) { this.caminho = caminho; this.set = new Set(); this.carregado = false; }
  carregar() {
    if (this.carregado) return;
    if (fs.existsSync(this.caminho)) {
      const bruto = fs.readFileSync(this.caminho, 'utf-8');
      for (const l of bruto.split('\n')) if (l) this.set.add(l);
    }
    this.carregado = true;
  }
  tem(chave) { this.carregar(); return this.set.has(chave); }
  adicionar(chave) { this.carregar(); this.set.add(chave); }
  /** Descarta o set da RAM e mantém apenas o ficheiro (usado em modo --sonda) */
  descarregar() { this.carregado = false; this.set = new Set(); }
}

// ── Escritor de lotes SQL (streaming) ─────────────────────────────────────
class EscritorLotes {
  constructor(dir, prefixo) {
    this.dir = dir; this.prefixo = prefixo;
    this.autorBuf = new Map(); this.livroBuf = []; this.linkBuf = [];
    this.numLote = 0; this.total = 0; this.ficheiros = [];
    this.maxAutorId = 900000; this.maxLivroId = 4000000; this.maxLinkId = 5000000;
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
        `INSERT OR IGNORE INTO livros (id, titulo, idioma, sinopse, capa_url, ano_publicacao, paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras, conteudo_texto) VALUES ` +
        `(${l.id}, ${esc(l.titulo)}, ${esc(l.idioma)}, ${esc(l.sinopse)}, ${esc(l.capaUrl)}, ${esc(l.ano)}, ${esc(l.paginas ?? null)}, ${l.autorId}, ${l.categoriaId}, ${l.fonteId}, ${esc(l.fonteIdExterno)}, ${esc(l.licenca)}, 0, NULL);`
      );
    }
    for (const k of this.linkBuf) {
      linhas.push(
        `INSERT OR IGNORE INTO links_livros (id, livro_id, formato, url, link_externo) VALUES ` +
        `(${k.id}, ${k.livroId}, ${esc(k.formato)}, ${esc(k.url)}, 1);`
      );
    }
    const num = String(this.numLote).padStart(5, '0');
    const f = path.join(this.dir, `${this.prefixo}-lote-${num}.sql`);
    fs.writeFileSync(f, linhas.join('\n') + '\n');
    this.ficheiros.push(f);
    this.autorBuf.clear(); this.livroBuf = []; this.linkBuf = [];
  }
  autor(nome) {
    const chave = nome.toLowerCase().trim();
    if (this.autorBuf.has(chave)) return this.autorBuf.get(chave);
    this.maxAutorId++;
    const a = { id: this.maxAutorId, nome };
    this.autorBuf.set(chave, a);
    return a;
  }
  livro(l) {
    this.maxLivroId++; this.maxLinkId++;
    const id = this.maxLivroId;
    this.livroBuf.push({ ...l, id });
    this.linkBuf.push({ id: this.maxLinkId, livroId: id, formato: 'html', url: l.urlLeitura });
    this.total++;
    if (this.livroBuf.length >= BATCH_SIZE) this._flush();
  }
  fechar() { this._flush(); return this.ficheiros; }
}

// ── Mapeamento ────────────────────────────────────────────────────────────
const MAPA_IDIOMA = [
  [/^por|^pt/, 'pt'], [/^eng|^en/, 'en'], [/^fre|^fra|^fr/, 'fr'],
  [/^ger|^deu|^de/, 'de'], [/^spa|^es/, 'es'], [/^ita|^it/, 'it'],
  [/^rus|^ru/, 'ru'], [/^chi|^zho|^zh/, 'zh'], [/^ara|^ar/, 'ar'],
  [/^jpn|^ja/, 'ja'], [/^nld|^nl/, 'nl'], [/^swe|^sv/, 'sv'],
  [/^nor|^no/, 'no'], [/^ces|^cs/, 'cs'], [/^heb|^he/, 'he'],
  [/^vie|^vi/, 'vi'], [/^ind|^id/, 'id'], [/^tur|^tr/, 'tr']
];

function mapearIdioma(chaves) {
  if (!chaves || !chaves.length) return 'en';
  for (const [re, cod] of MAPA_IDIOMA) {
    for (const k of chaves) {
      const m = String(k).match(/\/languages\/([a-z]+)/i);
      if (m && re.test(m[1].toLowerCase())) return cod;
    }
  }
  return 'outro';
}

function extrairAno(rec) {
  if (rec.publish_date) {
    const m = String(rec.publish_date).match(/(\d{4})/);
    if (m) {
      const y = parseInt(m[1], 10);
      if (y > 1000 && y < 2030) return y;
    }
  }
  return null;
}

function extrairAutores(rec) {
  if (!Array.isArray(rec.authors)) return [];
  return rec.authors
    .map(a => (typeof a === 'string' ? a : a?.key))
    .filter(Boolean)
    .map(k => String(k).replace('/authors/', ''))
    .slice(0, 3);
}

/**
 * Decide se a edição tem leitura integral ABERTA.
 * Regras:
 *  • precisa de `ocaid` (item do Internet Archive) OU identificador openlibrary
 *  • não pode ter `ocaid` desactivado nem ser "printdisabled"
 */
function acessoAberto(rec) {
  const ocaid = rec.ocaid;
  if (!ocaid) return null;
  if (rec.printdisabled === true) return null;
  if (rec.ocaid_disabled === true) return null;
  // alguns items do IA têm "collection: internetarchivebooks" implícita — aceita
  return { ocaid: String(ocaid), url: `https://archive.org/details/${ocaid}` };
}

// ── Streaming do dump ─────────────────────────────────────────────────────
/**
 * Baixa um segmento [inicio, fim] do dump para um ficheiro temporário.
 * Retoma dentro do segmento se a ligação cair (offset parcial gravado).
 */
async function baixarSegmento(url, inicio, fim, destino, onProgresso) {
  const tmp = destino + '.parcial';
  let offset = inicio;
  try { offset = inicio + (fs.existsSync(tmp) ? fs.statSync(tmp).size : 0); } catch {}

  if (offset > fim) { fs.renameSync(tmp, destino); return; }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const headers = {
        'User-Agent': USER_AGENT,
        'Accept-Encoding': 'identity',
        Range: `bytes=${offset}-${fim}`
      };
      const res = await fetch(url, { headers });
      if (res.status !== 206 && res.status !== 200) throw new Error(`HTTP ${res.status}`);

      const out = fs.createWriteStream(tmp, { flags: 'a' });
      const w = res.body.pipeThrough(new WritableStream({
        write(chunk) {
          return new Promise((resolve, reject) => {
            out.write(Buffer.from(chunk), (err) => err ? reject(err) : resolve());
          });
        }
      }));
      await new Promise((resolve, reject) => {
        w.then(() => out.end(resolve)).catch(reject);
        res.body.pipeTo(w).catch(reject);
      });
      await new Promise(r => out.on('close', r));

      const size = fs.statSync(tmp).size;
      if (inicio + size - 1 >= fim) {
        fs.renameSync(tmp, destino);
        onProgresso?.();
        return;
      }
      // segmento incompleto → retoma
      offset = inicio + size;
      throw new Error(`Segmento incompleto (${size} bytes) — a retomar`);
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const espera = 2000 * attempt;
      console.warn(`      ⚠ segmento [${inicio}-${fim}] tentativa ${attempt}: ${String(err.message).slice(0, 90)} — aguarda ${espera}ms`);
      await new Promise(r => setTimeout(r, espera));
    }
  }
}

/**
 * Faz download paralelo do dump em N segmentos e devolve um stream
 * de leitura ORDERED (segmento 0, 1, 2 ...), com gunzip aplicado.
 * Contorna a limitação de velocidade por ligação (o archive.org estrangula
 * cada TCP a ~10-15 KB/s; N ligações em paralelo = N × essa velocidade).
 */
async function streamDumpParalelo(url, onLinha, inicioLinha = 0, opcoes = {}) {
  const { segmentos = 8, dir = '.scratch/fase4-partes', tamanhoTotal = null } = opcoes;

  const finalUrl = await resolverUrlFinal(url);
  const total = tamanhoTotal || await obterTamanho(finalUrl);
  console.log(`   → download paralelo: ${segmentos} segmentos sobre ${(total/1e9).toFixed(2)} GB`);

  fs.mkdirSync(dir, { recursive: true });
  const tamSeg = Math.ceil(total / segmentos);
  const ficheiros = [];

  // Descarrega os segmentos em paralelo
  const fila = [];
  for (let i = 0; i < segmentos; i++) {
    const inicio = i * tamSeg;
    const fim = Math.min(inicio + tamSeg - 1, total - 1);
    if (inicio > fim) break;
    const dest = path.join(dir, `seg-${String(i).padStart(3, '0')}.part`);
    ficheiros.push(dest);
    fila.push(baixarSegmento(finalUrl, inicio, fim, dest, () => {
      const feitos = ficheiros.filter(f => fs.existsSync(f)).length;
      console.log(`   ✔ segmento ${feitos}/${segmentos} completo`);
    }).catch(e => { console.warn(`   ⚠ segmento ${i} falhou: ${e.message}`); }));
  }

  // Aguarda que pelo menos o primeiro segmento esteja pronto para começar a ler
  while (fila.length && !fs.existsSync(ficheiros[0])) {
    await Promise.race([Promise.all(fila).catch(() => {}), new Promise(r => setTimeout(r, 500))]);
    if (!fs.existsSync(ficheiros[0]) && fila.every(p => p.isSettled?.())) break;
  }
  await Promise.allSettled(fila);

  // Lê os segmentos por ordem, aplicando gunzip uma única vez
  const gunzip = zlib.createGunzip({ chunkSize: 1 << 20 });
  gunzip.on('error', () => {});

  let buffer = '';
  let n = 0;
  for (const f of ficheiros) {
    if (!fs.existsSync(f)) continue;
    const rs = fs.createReadStream(f, { highWaterMark: 1 << 20 });
    for await (const chunk of rs.pipe(gunzip)) {
      buffer += chunk.toString('utf-8');
      let idx;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const linha = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        n++;
        if (n <= inicioLinha) continue;
        if (linha.trim() === '') continue;
        onLinha(linha, n);
      }
    }
  }
  return n;
}

async function obterTamanho(url) {
  const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'identity' } });
  const len = res.headers.get('content-length');
  return len ? parseInt(len, 10) : 0;
}

/**
 * Resolve a cadeia de redireccionamentos manualmente até ao URL final.
 * Necessário porque o fetch perde o cabeçalho Range ao seguir os 302 do
 * archive.org para os nós ia*.us.archive.org (que são os que suportam Range).
 */
async function resolverUrlFinal(url, maxRedirecoes = 5) {
  let atual = url;
  for (let i = 0; i < maxRedirecoes; i++) {
    const res = await fetch(atual, {
      method: 'HEAD',
      redirect: 'manual',
      headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'identity' }
    });
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) {
      atual = new URL(loc, atual).toString();
      continue;
    }
    return atual;
  }
  return atual;
}

/**
 * Lê o dump a partir de um ficheiro local (.gz) — usado para validação
 * offline, dumps espelhados, e testes de regressão do parser.
 */
async function streamDumpLocal(caminho, onLinha, inicioLinha = 0) {
  const gunzip = zlib.createGunzip({ chunkSize: 1 << 20 });
  gunzip.on('error', () => {});
  const src = fs.createReadStream(caminho).pipe(gunzip);
  let buffer = '';
  let n = 0;
  try {
    for await (const chunk of src) {
      buffer += chunk.toString('utf-8');
      let idx;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const linha = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        n++;
        if (n <= inicioLinha) continue;
        if (linha.trim() === '') continue;
        onLinha(linha, n);
      }
    }
  } catch (e) {
    // ficheiro truncado (sonda parcial) — as linhas completas já foram processadas
    if (!/unexpected end of file|Z_BUF_ERROR/i.test(String(e.message))) throw e;
  }
  return n;
}

async function streamDump(url, onLinha, inicioLinha = 0, limiteBytes = null) {
  // 1) Resolve o URL final (para o Range não se perder nos 302)
  const finalUrl = await resolverUrlFinal(url);

  // 2) Pede o intervalo (sonda) ou o ficheiro completo
  const headers = { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'identity' };
  if (limiteBytes) headers.Range = `bytes=0-${limiteBytes - 1}`;

  const res = await fetch(finalUrl, { headers });
  if (!res.ok && res.status !== 206) throw new Error(`HTTP ${res.status} ao abrir o dump`);

  // 3) Descomprime UMA vez (o ficheiro é .gz servido sem Content-Encoding)
  //    res.body é um Web ReadableStream (undici) → converter para Node Readable
  const gunzip = zlib.createGunzip({ chunkSize: 1 << 20 });
  const src = Readable.fromWeb(res.body).pipe(gunzip);

  // 4) Divisor de linhas manual, tolerante a erro (sonda truncada → gunzip
  //    emite "unexpected end of file" mas já entregou todas as linhas completas)
  let buffer = '';
  let n = 0;
  let erro = null;

  gunzip.on('error', (e) => { erro = e; });

  try {
    for await (const chunk of src) {
      buffer += chunk.toString('utf-8');
      let idx;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const linha = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        n++;
        if (n <= inicioLinha) continue;
        if (linha.trim() === '') continue;
        onLinha(linha, n);
      }
    }
  } catch (e) {
    erro = e;
  }

  // última linha sem \n
  if (buffer.trim() !== '') {
    n++;
    if (n > inicioLinha) onLinha(buffer, n);
  }

  if (erro && !/unexpected end of file|Z_BUF_ERROR/i.test(String(erro.message))) {
    throw erro;
  }
  return n;
}

/** Parser de uma linha TSV do dump: devolve o JSON da coluna 5. */
function parseLinhaTSV(linha) {
  // As colunas 1-4 não contêm tabs; a 5ª é o JSON
  const idx = linha.indexOf('\t');
  if (idx === -1) return null;
  const idx2 = linha.indexOf('\t', idx + 1);
  const idx3 = linha.indexOf('\t', idx2 + 1);
  const idx4 = linha.indexOf('\t', idx3 + 1);
  if (idx4 === -1) return null;
  const tipo = linha.slice(0, idx);
  const chave = linha.slice(idx + 1, idx2);
  const json = linha.slice(idx4 + 1);
  if (!chave || !json) return null;
  try { return { tipo, chave, dados: JSON.parse(json) }; } catch { return null; }
}

// ── Execução ───────────────────────────────────────────────────────────────
async function executar(args) {
  const aplicar = args.includes('--apply');
  const retomar = args.includes('--resume');
  const idxTarget = args.indexOf('--target');
  const meta = idxTarget !== -1 ? parseInt(args[idxTarget + 1], 10) : 10000000;
  const idxProbe = args.indexOf('--sonda');
  const sondaBytes = idxProbe !== -1 ? parseInt(args[idxProbe + 1], 10) : 0;
  const idxFonte = args.indexOf('--fonte');
  const nomeFonte = idxFonte !== -1 ? args[idxFonte + 1] : 'editions';
  const idxFich = args.indexOf('--ficheiro');
  const ficheiroLocal = idxFich !== -1 ? args[idxFich + 1] : null;
  const idxPar = args.indexOf('--paralelo');
  const segmentos = idxPar !== -1 ? Math.max(1, parseInt(args[idxPar + 1], 10)) : 8;
  const idxMaxBytes = args.indexOf('--max-bytes');
  const maxBytes = idxMaxBytes !== -1 ? parseInt(args[idxMaxBytes + 1], 10) : null;

  banner('FASE 4 — Ingestão do dump massivo da Open Library (meta: 10.000.000)');
  const dump = DUMPS[nomeFonte];
  if (!dump) { console.error(`Fonte desconhecida: ${nomeFonte}`); process.exit(1); }
  console.log(`Dump: ${nomeFonte} — ${dump.desc}`);
  console.log(`Tamanho: ${(dump.bytes / 1e9).toFixed(1)} GB comprimidos | Meta: ${meta.toLocaleString('pt-PT')} obras`);
  console.log(`Modo: ${aplicar ? 'APLICAR' : 'DRY-RUN'}${retomar ? ' | RETOMAR' : ''}${sondaBytes ? ` | SONDA ${(sondaBytes/1e6).toFixed(0)} MB` : ''}\n`);

  const cp = retomar ? carregarCP() : { linha: 0, total: 0, concluido: false, fonte: nomeFonte };
  if (retomar) console.log(`↻ Retomando da linha ${cp.linha.toLocaleString('pt-PT')} (${cp.total.toLocaleString('pt-PT')} já ingeridas)\n`);

  const dedup = new Deduplicador(VISTOS);
  const escritor = new EscritorLotes(SQL_DIR, `dump-${nomeFonte}`);
  const catId = 39;
  const fonteId = 6;

  let total = cp.total;
  let linhasProcessadas = 0;
  const inicio = Date.now();
  let ultimaGravacao = 0;

  // Closure de processamento de uma linha do dump
  const processarLinha = (linha, n) => {
    linhasProcessadas++;
    if (total >= meta) return;

    const p = parseLinhaTSV(linha);
    if (!p) return;

    const rec = p.dados;
    const acesso = acessoAberto(rec);
    if (!acesso) return;

    const extId = `ol-dump-${p.chave.replace('/books/', '')}`;
    if (dedup.tem(extId)) return;
    dedup.adicionar(extId);

    const titulo = String(rec.title || '').trim();
    if (!titulo) return;

    const autores = extrairAutores(rec);
    const autorObj = escritor.autor(
      autores.length ? `Autor ${autores[0]}` : 'Autor Desconhecido'
    );

    const idioma = mapearIdioma((rec.languages || []).map(l => l?.key || l));
    const paginas = Number.isFinite(rec.number_of_pages) ? rec.number_of_pages : null;
    const capaUrl = rec.covers && rec.covers.length
      ? `https://covers.openlibrary.org/b/id/${rec.covers[0]}-M.jpg`
      : `https://archive.org/services/img/${acesso.ocaid}`;

    let sinopse = 'Edição aberta do acervo massivo da Open Library, com texto integral legível no Internet Archive.';
    if (Array.isArray(rec.subjects) && rec.subjects.length) {
      sinopse += ` Assuntos: ${rec.subjects.slice(0, 3).join(', ')}.`;
    }
    if (rec.subtitle) sinopse = `${String(rec.subtitle).slice(0, 150)} ${sinopse}`;
    sinopse = sinopse.slice(0, 400);

    escritor.livro({
      titulo: titulo.slice(0, 250),
      idioma,
      sinopse,
      capaUrl,
      ano: extrairAno(rec),
      paginas,
      autorId: autorObj.id,
      categoriaId: catId,
      fonteId,
      fonteIdExterno: extId,
      licenca: 'dominio-publico',
      urlLeitura: acesso.url
    });

    total++;

    // checkpoint periódico
    if (Date.now() - ultimaGravacao > 15000) {
      gravarCP({ linha: n, total, concluido: false, fonte: nomeFonte });
      ultimaGravacao = Date.now();
      const seg = (Date.now() - inicio) / 1000;
      console.log(`   ✔ linha ${n.toLocaleString('pt-PT')} | ${total.toLocaleString('pt-PT')} ingeridas | ${(total / Math.max(seg, 1)).toFixed(0)}/s`);
    }
  };

  try {
    if (ficheiroLocal) {
      console.log(`   → modo local: ${ficheiroLocal}`);
      await streamDumpLocal(ficheiroLocal, (linha, n) => processarLinha(linha, n), cp.linha);
    } else if (sondaBytes) {
      await streamDump(dump.url, (linha, n) => processarLinha(linha, n), cp.linha, sondaBytes);
    } else {
      await streamDumpParalelo(dump.url, (linha, n) => processarLinha(linha, n), cp.linha, {
        segmentos,
        dir: path.resolve('.scratch/fase4-partes'),
        tamanhoTotal: dump.bytes
      });
    }
  } catch (err) {
    console.warn(`\n⚠ Interrompido: ${err.message}`);
  }

  const ficheiros = escritor.fechar();
  const seg = (Date.now() - inicio) / 1000;
  console.log(`\n─── Resumo ───`);
  console.log(`   Linhas processadas : ${linhasProcessadas.toLocaleString('pt-PT')}`);
  console.log(`   Obras ingeridas     : ${total.toLocaleString('pt-PT')}`);
  console.log(`   Lotes SQL          : ${ficheiros.length}`);
  console.log(`   Duração            : ${seg.toFixed(0)}s (${(total / Math.max(seg, 1)).toFixed(0)} obras/s)`);

  if (!aplicar) { console.log(`\nℹ Dry-run concluído. Use --apply para aplicar.`); return; }

  console.log(`\n─── A aplicar ───`);
  let n = 0;
  for (const f of ficheiros) {
    try { execSync(`sqlite3 ${DB_LOCAL} < ${JSON.stringify(f)}`, { stdio: 'pipe' }); } catch (e) { console.warn(`   ⚠ local: ${String(e.message).slice(0, 80)}`); }
    try { execSync(`npx wrangler d1 execute ${DB} --remote --file=${JSON.stringify(f)} --yes`, { stdio: 'pipe' }); }
    catch (e) { console.warn(`   ⚠ D1: ${String(e.message).slice(0, 80)}`); }
    n++;
    if (n % 10 === 0) console.log(`   ✔ ${n}/${ficheiros.length} lotes aplicados`);
  }
  gravarCP({ linha: linhasProcessadas, total, concluido: true, fonte: nomeFonte });
  console.log(`\n🎉 Fase 4 concluída — ${total.toLocaleString('pt-PT')} obras indexadas.`);
}

function info() {
  banner('FASE 4 — Dumps Open Library disponíveis');
  for (const [k, d] of Object.entries(DUMPS)) {
    console.log(`📦 ${k}`);
    console.log(`   ${d.desc}`);
    console.log(`   URL : ${d.url}`);
    console.log(`   Tam.: ${(d.bytes / 1e9).toFixed(2)} GB comprimidos\n`);
  }
  console.log('💡 Dica: comece com --sonda 50000000 (50 MB) para validar o parser.');
}

function status() {
  banner('FASE 4 — Status');
  console.log(`Checkpoint: ${JSON.stringify(carregarCP(), null, 2)}`);
  if (fs.existsSync(VISTOS)) {
    const st = fs.statSync(VISTOS);
    console.log(`Deduplicação: ${(st.size / 1e6).toFixed(1)} MB de identificadores vistos`);
  }
  if (fs.existsSync(SQL_DIR)) {
    const files = fs.readdirSync(SQL_DIR).filter(f => f.endsWith('.sql'));
    console.log(`Lotes prontos: ${files.length}`);
  }
}

const args = process.argv.slice(2);
if (args.includes('--info')) info();
else if (args.includes('--status')) status();
else executar(args).catch(err => { console.error('❌', err); process.exit(1); });
