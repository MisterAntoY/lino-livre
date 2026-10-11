/**
 * Importador de Fontes Abertas — Lino Livre
 *
 * Importa APENAS METADADOS (título, autor, idioma, licença, capa URL, sinopse)
 * e URLs EXTERNAS de leitura. Nenhum ficheiro de obra é baixado ou hospedado —
 * em conformidade com AGENTS.md (servidor intermediário, redirect 302).
 *
 * Fontes:
 *   asp               African Storybook (global-asp/asp-raw-db) — 12k histórias
 *   science           EbookFoundation/free-science-books (CC0)
 *   standardebooks    Standard Ebooks (domínio público, 1.5k obras)
 *   openstax          OpenStax (CC-BY) — manuais universitários
 *   chinese           chinese-poetry/chinese-poetry (MIT / domínio público)
 *   todas             todas as anteriores
 *
 * Uso:
 *   node scripts/importar_fontes_abertas.mjs <fonte>            # dry-run: gera SQL
 *   node scripts/importar_fontes_abertas.mjs <fonte> --apply    # gera + executa na D1 remota
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';
import { Readable } from 'node:stream';

const DB = 'lino-livre-db';
const SQL_DIR = path.resolve('.scratch/sql-importacao');
const TMP_DIR = path.resolve('.scratch/fontes');
const BATCH = 400; // registos por ficheiro SQL (limite seguro do D1)

// ───────────────────────── utilidades ─────────────────────────

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function wrangler(cmd) {
  return execSync(`npx wrangler d1 execute ${DB} --remote ${cmd}`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
}

/** INSERTs/DDL com emoji passam por ficheiro --file (imune a quoting de shell). */
let tmpSeq = 0;
function execFileSql(linhas) {
  fs.mkdirSync(SQL_DIR, { recursive: true });
  const f = path.join(SQL_DIR, `tmp-${process.pid}-${tmpSeq++}.sql`);
  fs.writeFileSync(f, (Array.isArray(linhas) ? linhas : [linhas]).join('\n') + '\n');
  try { wrangler(`--file ${JSON.stringify(f)} --yes`); }
  finally { try { fs.unlinkSync(f); } catch {} }
}

async function sqlJson(command) {
  // SELECTs são ASCII puro; --command é seguro aqui
  const oneLine = command.replace(/\s+/g, ' ').trim();
  const out = wrangler(`--command ${JSON.stringify(oneLine)} --json`);
  return JSON.parse(out)[0].results;
}

function applyFile(file) {
  console.log(`   ▶ a aplicar ${path.basename(file)} ...`);
  try {
    execSync(`sqlite3 biblioteca.db -cmd "PRAGMA trusted_schema = ON;" < ${JSON.stringify(file)}`, { stdio: 'pipe' });
  } catch (err) {
    console.warn(`   ⚠ Aviso local: ${err.message}`);
  }
  wrangler(`--file ${JSON.stringify(file)} --yes`);
}

async function garantirFonte(fonte) {
  // fonte: { slug, nome, tipo, url_base }
  execFileSql(`INSERT OR IGNORE INTO fontes (slug, nome, tipo, url_base, ativa)
               VALUES (${esc(fonte.slug)}, ${esc(fonte.nome)}, ${esc(fonte.tipo)}, ${esc(fonte.url_base)}, 1);`);
  const rows = await sqlJson(`SELECT id FROM fontes WHERE slug = ${esc(fonte.slug)};`);
  const id = rows[0].id;
  try {
    execSync(`sqlite3 biblioteca.db "INSERT OR IGNORE INTO fontes (id, slug, nome, tipo, url_base, ativa) VALUES (${id}, ${esc(fonte.slug)}, ${esc(fonte.nome)}, ${esc(fonte.tipo)}, ${esc(fonte.url_base)}, 1);"`, { stdio: 'ignore' });
  } catch {}
  return id;
}

async function garantirCategoria(nome, descricao) {
  execFileSql(`INSERT OR IGNORE INTO categorias (nome, descricao) VALUES (${esc(nome)}, ${esc(descricao)});`);
  const rows = await sqlJson(`SELECT id FROM categorias WHERE nome = ${esc(nome)};`);
  const id = rows[0].id;
  try {
    execSync(`sqlite3 biblioteca.db "INSERT OR IGNORE INTO categorias (id, nome, descricao) VALUES (${id}, ${esc(nome)}, ${esc(descricao)});"`, { stdio: 'ignore' });
  } catch {}
  return id;
}

async function mapaAutoresExistentes() {
  const rows = await sqlJson('SELECT id, nome FROM autores;');
  const mapa = new Map();
  for (const r of rows) mapa.set(r.nome.trim().toLowerCase(), r.id);
  return mapa;
}

async function maxId(tabela) {
  const rows = await sqlJson(`SELECT COALESCE(MAX(id), 0) AS m FROM ${tabela};`);
  return rows[0].m;
}

/** Testa 5 URLs aleatórias do lote (regra da ESPECIFICACAO-INTEGRACAO-GITHUB.md §6). */
async function verificarAmostra(entries, campo, n = 5) {
  const comUrl = entries.filter(e => e[campo]);
  const amostra = [];
  const passo = Math.max(1, Math.floor(comUrl.length / n));
  for (let i = 0; amostra.length < n && i < comUrl.length; i += passo) amostra.push(comUrl[i]);
  let ok = 0;
  for (const e of amostra) {
    try {
      const r = await fetch(e[campo], { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'LinoLivre-Importer/1.0 (educacional)' } });
      console.log(`     ${r.status} ${e[campo].slice(0, 90)}`);
      if (r.status < 400) ok++;
    } catch (err) {
      console.log(`     ERRO ${e[campo].slice(0, 90)} (${err.message})`);
    }
  }
  console.log(`   ✔ verificação de URLs: ${ok}/${amostra.length} OK`);
  return ok === amostra.length;
}

/** Escreve os registos em ficheiros SQL por lote e devolve os ficheiros. */
function gerarSqlLotes(tabelas, prefixo) {
  fs.mkdirSync(SQL_DIR, { recursive: true });
  // limpa lotes anteriores deste prefixo
  for (const f of fs.readdirSync(SQL_DIR)) if (f.startsWith(prefixo)) fs.unlinkSync(path.join(SQL_DIR, f));
  const ficheiros = [];
  const total = tabelas.livros.length;
  for (let inicio = 0; inicio < total; inicio += BATCH) {
    const fim = Math.min(inicio + BATCH, total);
    const linhas = [];
    for (const a of tabelas.autores.slice(inicio, fim)) linhas.push(a);
    for (const l of tabelas.livros.slice(inicio, fim)) linhas.push(l);
    for (const lk of tabelas.links.slice(inicio, fim)) linhas.push(lk);
    const n = String(Math.floor(inicio / BATCH) + 1).padStart(3, '0');
    const f = path.join(SQL_DIR, `${prefixo}-${n}.sql`);
    fs.writeFileSync(f, linhas.join('\n') + '\n');
    ficheiros.push(f);
  }
  console.log(`   ✔ ${total} registos → ${ficheiros.length} ficheiros SQL em ${path.relative(process.cwd(), SQL_DIR)}`);
  return ficheiros;
}

// ───────────────────────── mapeamento de idiomas ─────────────────────────

const IDIOMAS = {
  english: 'en', ingles: 'en', 'inglês': 'en',
  french: 'fr', francais: 'fr', 'français': 'fr', francês: 'fr',
  portuguese: 'pt', portugues: 'pt', 'português': 'pt',
  german: 'de', deutsch: 'de', alemao: 'de', 'alemão': 'de',
  chinese: 'zh', mandarin: 'zh', '中文': 'zh',
  kiswahili: 'sw', swahili: 'sw', suahili: 'sw',
  isizulu: 'zu', zulu: 'zu', isixhosa: 'xh', xhosa: 'xh',
  amharic: 'am', amarico: 'am', hausa: 'ha', yoruba: 'yo', igbo: 'ig',
  somali: 'so', oromo: 'om', kinyarwanda: 'rw', kirundi: 'rn',
  malagasy: 'mg', akan: 'ak', twi: 'ak', wolof: 'wo', lingala: 'ln',
  kikongo: 'kg', sango: 'sg', sesotho: 'st', setswana: 'tn',
  chichewa: 'ny', nyanja: 'ny', shona: 'sn', silozi: 'loz',
  tshivenda: 've', xitsonga: 'ts', siswati: 'ss', 'sepedi': 'nso',
  fulfulde: 'ff', fula: 'ff', ewe: 'ee', ga: 'gaa', dagbani: 'dag',
  gurene: 'gur', buili: 'bxk', luganda: 'lg', luba: 'lu',
  'kikuyu': 'ki', embu: 'ebu',
  meru: 'mer', kimeru: 'mer', 'gikuyu': 'ki', luo: 'luo',
  'north sotho': 'nso', northernsotho: 'nso', 'southern sotho': 'st',
  spanish: 'es', espanhol: 'es', 'espanhol': 'es',
  arabic: 'ar', arabe: 'ar', 'arábico': 'ar', ar: 'ar',
  hindi: 'hi', russian: 'ru', russo: 'ru', japanese: 'ja', japones: 'ja',
  italian: 'it', italiano: 'it', latin: 'la', latim: 'la',
};

function normalizarIdioma(nome) {
  if (!nome) return 'outro';
  const chave = nome.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
  return IDIOMAS[chave] || chave.replace(/\s+/g, '-');
}

/** Mapeia a licença descritiva para o vocabulário CHECK do esquema. */
function mapearLicenca(texto) {
  if (!texto) return 'outro';
  const t = texto.toLowerCase();
  if (t.includes('public domain') || t.includes('domínio público') || t.includes('cc0')) return 'dominio-publico';
  if (t.includes('attribution-noncommercial') || t.includes('attribution noncommercial') ||
      t.includes('cc-by-nc') || t.includes('cc by-nc') || t.includes('cc by nc')) return 'cc-by-nc';
  if (t.includes('attribution-sharealike') || t.includes('cc-by-sa') || t.includes('cc by-sa')) return 'cc-by-sa';
  if (t.includes('attribution') || t.includes('cc-by') || t.includes('cc by')) return 'cc-by';
  return 'outro';
}

// ───────────────────────── construtor de registos ─────────────────────────

function novoConstrutor(fonteId, categoriaId) {
  return {
    // registos estruturados; o SQL é gerado só no fechar(), com ids reais
    novosAutores: [],   // { nome }
    livrosRegistos: [], // { ...campos, autorRelKey }
    linksRegistos: [],  // { livroIdx, formato, url }
    mapaAutores: null,  // chave(normalizada) -> id real (existente) ou 'REL:n' (novo)
    relSeq: 0,
    async preparar() { this.mapaAutores = await mapaAutoresExistentes(); },
    /**
     * @param {object} r { titulo, autor, ilustrador, idioma, licenca, capaUrl, sinopse, ano, urlLeitura, formato, fonteIdExterno }
     */
    add(r) {
      if (!r.titulo || !r.urlLeitura) return false;
      // atribuição CC-BY: ilustrador registado na sinopse (não há campo próprio no esquema)
      let sinopse = r.sinopse || '';
      if (r.ilustrador) sinopse += (sinopse ? ' ' : '') + `Ilustração: ${r.ilustrador}.`;
      let autorChave = null;
      if (r.autor && r.autor.trim()) {
        const chave = r.autor.trim().toLowerCase();
        if (!this.mapaAutores.has(chave)) {
          const relKey = `REL:${++this.relSeq}`;
          this.mapaAutores.set(chave, relKey);
          this.novosAutores.push({ nome: r.autor.trim(), relKey });
        }
        autorChave = chave;
      }
      this.livrosRegistos.push({
        titulo: r.titulo, idioma: r.idioma, sinopse: sinopse.trim() || null,
        capaUrl: r.capaUrl || null, ano: r.ano || null, licenca: r.licenca,
        fonteIdExterno: r.fonteIdExterno, autorChave,
      });
      this.linksRegistos.push({ livroIdx: this.livrosRegistos.length - 1, formato: r.formato || 'html', url: r.urlLeitura });
      return true;
    },
    async fechar() {
      const [maxA, maxL, maxK] = [await maxId('autores'), await maxId('livros'), await maxId('links_livros')];
      // resolve id real de cada autor novo (REL:n -> maxA + n)
      const idAutorRel = new Map();
      for (const a of this.novosAutores) idAutorRel.set(a.relKey, maxA + Number(a.relKey.split(':')[1]));
      const resolveAutor = (chave) => {
        if (!chave) return null;
        const v = this.mapaAutores.get(chave);
        return typeof v === 'number' ? v : idAutorRel.get(v); // existente = id real; novo = offset
      };
      const autores = this.novosAutores.map(a =>
        `INSERT OR IGNORE INTO autores (id, nome) VALUES (${idAutorRel.get(a.relKey)}, ${esc(a.nome)});`);
      const livros = this.livrosRegistos.map((l, i) =>
        `INSERT OR IGNORE INTO livros (id, titulo, idioma, sinopse, capa_url, ano_publicacao, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras, conteudo_texto) VALUES ` +
        `(${maxL + i + 1}, ${esc(l.titulo)}, ${esc(l.idioma)}, ${esc(l.sinopse)}, ${esc(l.capaUrl)}, ${esc(l.ano)}, ${esc(resolveAutor(l.autorChave))}, ${categoriaId}, ${fonteId}, ${esc(l.fonteIdExterno)}, ${esc(l.licenca)}, 0, NULL);`);
      // Links: resolve o livro pela chave estável (fonte_id, fonte_id_externo), nunca por offset.
      // Assim a importação é retomável — se um livro já existe (INSERT OR IGNORE saltou-o),
      // o link ainda aponta para o registo correto em vez de um id calculado que pode não existir.
      // O id auto-incrementa (sem offset frágil de maxK).
      const links = this.linksRegistos.map((lk) => {
        const l = this.livrosRegistos[lk.livroIdx];
        return `INSERT OR IGNORE INTO links_livros (livro_id, formato, url, link_externo) ` +
          `SELECT id, ${esc(lk.formato)}, ${esc(lk.url)}, 1 FROM livros ` +
          `WHERE fonte_id = ${fonteId} AND fonte_id_externo = ${esc(l.fonteIdExterno)};`;
      });
      return { autores, livros, links };
    },
  };
}

// ───────────────────────── 1. AFRICAN STORYBOOK ─────────────────────────

async function importarAsp(aplicar) {
  console.log('\n🦁 AFRICAN STORYBOOK (global-asp/asp-raw-db)');
  const dir = path.join(TMP_DIR, 'asp-raw-db');
  if (!fs.existsSync(path.join(dir, 'data'))) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('   ⬇ a baixar repositório de metadados (tarball)…');
    const res = await fetch('https://codeload.github.com/global-asp/asp-raw-db/tar.gz/refs/heads/master',
      { headers: { 'User-Agent': 'LinoLivre-Importer/1.0' } });
    if (!res.ok) throw new Error('Falha ao baixar asp-raw-db: HTTP ' + res.status);
    const tarball = path.join(TMP_DIR, 'asp-raw-db.tar.gz');
    const ws = fs.createWriteStream(tarball);
    await pipeline(Readable.fromWeb(res.body), ws);
    execSync(`tar -xzf ${JSON.stringify(tarball)} -C ${JSON.stringify(dir)} --strip-components=1`);
    fs.unlinkSync(tarball);
  }

  const arquivos = fs.readdirSync(path.join(dir, 'data')).filter(f => f.endsWith('.txt'));
  console.log(`   ✔ ${arquivos.length} ficheiros de metadados encontrados`);

  const fonteId = await garantirFonte({ slug: 'african-storybook', nome: 'African Storybook Project', tipo: 'manual', url_base: 'https://africanstorybook.org' });
  const catId = await garantirCategoria('🌍 Contos Infantis de África', 'Histórias infantis ilustradas do African Storybook Project — CC-BY / CC-BY-NC, leitura no site oficial');

  const c = novoConstrutor(fonteId, catId);
  await c.preparar();

  let ignorados = 0;
  for (const arq of arquivos) {
    const txt = fs.readFileSync(path.join(dir, 'data', arq), 'utf-8');
    const campo = (k) => {
      const m = txt.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'));
      return m ? m[1].trim() : '';
    };
    const id = campo('id');
    const titulo = campo('title');
    const url = campo('url');
    if (!id || !titulo || !url) { ignorados++; continue; }
    const autor = campo('author');
    const artista = campo('artist');
    const lang = campo('lang');
    const level = campo('level');
    const lic = campo('lic');
    const thumb = campo('thumb');
    const desc = campo('desc');

    let sinopse = desc || '';
    if (level) sinopse += (sinopse ? ' ' : '') + `Nível: ${level}.`;
    sinopse = sinopse.trim() || null;

    const ok = c.add({
      titulo, autor, ilustrador: artista || null, idioma: normalizarIdioma(lang),
      licenca: mapearLicenca(lic), capaUrl: thumb || null,
      sinopse, ano: null, urlLeitura: url, formato: 'html',
      fonteIdExterno: `asp-${id}`,
    });
    if (!ok) ignorados++;
  }
  console.log(`   ✔ ${c.livrosRegistos.length} histórias prontas${ignorados ? ` (${ignorados} ignoradas por metadados incompletos)` : ''}`);

  const urlsOk = await (async () => {
    const exemplos = [];
    const passo = Math.max(1, Math.floor(c.linksRegistos.length / 5));
    for (let i = 0; i < c.linksRegistos.length && exemplos.length < 5; i += passo) {
      exemplos.push({ urlLeitura: c.linksRegistos[i].url });
    }
    return verificarAmostra(exemplos, 'urlLeitura', 5);
  })();
  if (!urlsOk) { console.log('   ⚠ URLs com falha — a importar mesmo assim (serão revistas no lote).'); }

  const tabelas = await c.fechar();
  const ficheiros = gerarSqlLotes(tabelas, 'asp');
  if (aplicar) ficheiros.forEach(applyFile);
  return c.livrosRegistos.length;
}

// ───────────────────────── 2. FREE-SCIENCE-BOOKS ─────────────────────────

async function importarScience(aplicar) {
  console.log('\n🔬 FREE-SCIENCE-BOOKS (EbookFoundation, CC0)');
  // a lista real está em free-science-books.md; o README é só a intro
  const res = await fetch('https://raw.githubusercontent.com/EbookFoundation/free-science-books/master/free-science-books.md',
    { headers: { 'User-Agent': 'LinoLivre-Importer/1.0' } });
  if (!res.ok) throw new Error('Falha ao baixar README: HTTP ' + res.status);
  const md = await res.text();

  const fonteId = await garantirFonte({ slug: 'ebookfoundation-science', nome: 'EbookFoundation Free Science Books', tipo: 'manual', url_base: 'https://github.com/EbookFoundation/free-science-books' });
  const catId = await garantirCategoria('🔬 Ciências & Matemática', 'Livros abertos de ciências exatas e naturais, curados pela Ebook Foundation (CC0)');

  const c = novoConstrutor(fonteId, catId);
  await c.preparar();

  for (const linha of md.split('\n')) {
    const m = linha.match(/^\s*[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:[-–—]\s*(.*))?$/);
    if (!m) continue;
    const [, titulo, url, resto] = m;
    if (!/^https?:\/\//.test(url)) continue;
    const autorM = resto && resto.match(/\(([^)]+)\)\s*$/);
    c.add({
      titulo: titulo.trim(),
      autor: autorM ? autorM[1].trim() : 'Vários',
      idioma: 'en',
      licenca: mapearLicenca(resto || 'free'),
      capaUrl: null,
      sinopse: resto ? resto.trim() : 'Livro aberto de ciências. Fonte: Free Science Books (Ebook Foundation).',
      ano: null, urlLeitura: url, formato: 'html',
      fonteIdExterno: url,
    });
  }
  console.log(`   ✔ ${c.livrosRegistos.length} livros prontos`);

  const tabelas = await c.fechar();
  const ficheiros = gerarSqlLotes(tabelas, 'science');
  if (aplicar) ficheiros.forEach(applyFile);
  return c.livrosRegistos.length;
}

/** A API do GitHub tem limite de 60 pedidos/hora sem token; o HTML não tem.
 *  Tenta a API primeiro e cai para o HTML quando recebe 403. */
async function ghJson(url) {
  const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'LinoLivre-Importer/1.0' } });
  if (r.status === 403) return { rateLimited: true, data: null };
  if (!r.ok) return { rateLimited: false, data: null };
  return { rateLimited: false, data: await r.json() };
}

// ───────────────────────── 3. STANDARD EBOOKS ─────────────────────────

async function importarStandardEbooks(aplicar) {
  console.log('\n📚 STANDARD EBOOKS (domínio público)');
  const nomes = [];
  let pagina = 1;
  let rateLimited = false;
  // tenta API; se o limite bater, passa ao HTML do GitHub (sem limite)
  while (!rateLimited) {
    const { rateLimited: rl, data: lote } = await ghJson(`https://api.github.com/orgs/standardebooks/repos?per_page=100&page=${pagina}`);
    if (rl) { rateLimited = true; break; }
    if (!lote || !lote.length) break;
    nomes.push(...lote.map(r => r.name));
    pagina++;
    if (pagina > 20) break;
  }
  if (rateLimited) {
    console.log('   ⚠ limite da API do GitHub — a usar HTML do GitHub como fallback');
    nomes.length = 0;
    for (let p = 1; p <= 16; p++) { // ~1533 repos ÷ 100 por página
      const r = await fetch(`https://github.com/orgs/standardebooks/repositories?page=${p}&per_page=100`,
        { headers: { 'User-Agent': 'LinoLivre-Importer/1.0' } });
      if (!r.ok) break;
      const html = await r.text();
      const achados = [...html.matchAll(/standardebooks\/([a-z0-9-]+_[a-z0-9-]+)"/g)].map(m => m[1]);
      if (!achados.length) break;
      nomes.push(...new Set(achados));
    }
  }
  // filtra repositórios de ferramentas/docs — os de obra têm 2 slugs no nome
  const obras = [...new Set(nomes)].filter(n => /^[a-z0-9-]+_[a-z0-9-]+$/.test(n));
  console.log(`   ✔ ${obras.length} obras encontradas`);

  const fonteId = await garantirFonte({ slug: 'standardebooks', nome: 'Standard Ebooks', tipo: 'manual', url_base: 'https://www.standardebooks.org' });
  const catId = await garantirCategoria('📚 Clássicos Mundiais', 'Clássicos da literatura em domínio público, formatados pela Standard Ebooks (dedicação CC0)');

  const c = novoConstrutor(fonteId, catId);
  await c.preparar();

  const titleCase = (s) => s.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  for (const nomeObra of obras) {
    const [autorSlug, obraSlug] = nomeObra.split('_');
    c.add({
      titulo: titleCase(obraSlug),
      autor: titleCase(autorSlug),
      idioma: 'en', // maior parte esmagadora; obras noutros idiomas ficam marcadas em sinopse
      licenca: 'dominio-publico',
      capaUrl: null,
      sinopse: `Obra em domínio público formatada pela Standard Ebooks. Fonte oficial com EPUB e leitura online.`,
      ano: null,
      urlLeitura: `https://www.standardebooks.org/ebooks/${autorSlug}/${obraSlug}`,
      formato: 'epub',
      fonteIdExterno: nomeObra,
    });
  }
  console.log(`   ✔ ${c.livrosRegistos.length} obras prontas`);

  const tabelas = await c.fechar();
  const ficheiros = gerarSqlLotes(tabelas, 'se');
  if (aplicar) ficheiros.forEach(applyFile);
  return c.livrosRegistos.length;
}

// ───────────────────────── 4. OPENSTAX ─────────────────────────

async function importarOpenstax(aplicar) {
  console.log('\n🎓 OPENSTAX (CC-BY)');
  // A API antiga (/api/v2/books) foi descontinuada; a atual é o CMS Wagtail.
  const BASE = 'https://openstax.org/apps/cms/api/v2/pages/?type=books.book';
  const res = await fetch(`${BASE}&limit=200`, { headers: { 'User-Agent': 'LinoLivre-Importer/1.0' } });
  if (!res.ok) throw new Error('API OpenStax HTTP ' + res.status);
  const json = await res.json();
  const resumo = json.items || [];
  console.log(`   ✔ ${json.meta?.total_count ?? resumo.length} manuais no índice — a ir buscar detalhes`);

  const fonteId = await garantirFonte({ slug: 'openstax', nome: 'OpenStax', tipo: 'api', url_base: 'https://openstax.org' });
  const catId = await garantirCategoria('🎓 Manuais Universitários Abertos', 'Textos universitários CC-BY da OpenStax (Rice University) — download e leitura oficiais');

  const c = novoConstrutor(fonteId, catId);
  await c.preparar();

  let falhas = 0;
  for (const item of resumo) {
    // detalhe por livro (autores, sinopse, capa, disciplinas)
    let b = item;
    try {
      const dr = await fetch(item.detail_url || `https://openstax.org/apps/cms/api/v2/pages/${item.id}/`,
        { headers: { 'User-Agent': 'LinoLivre-Importer/1.0' } });
      if (dr.ok) b = await dr.json();
    } catch { /* usa o resumo */ }
    // autores OpenStax: [{type:'author', value:{name:...}}]
    const autores = Array.isArray(b.authors) && b.authors.length
      ? b.authors.map(a => typeof a === 'string' ? a : (a?.value?.name || a?.name)).filter(Boolean).join(', ')
      : 'OpenStax';
    const disciplinas = Array.isArray(b.book_subjects)
      ? b.book_subjects.map(s => s.subject_name).filter(Boolean).join(', ') : '';
    let sinopse = b.description || b.search_description || b.meta?.search_description || '';
    sinopse = String(sinopse).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
    if (!sinopse) sinopse = `Manual universitário aberto${disciplinas ? ` (${disciplinas})` : ''}. CC-BY.`;
    const slugLivro = b.meta?.slug || item.meta?.slug;
    const ok = c.add({
      titulo: b.title || item.title,
      autor: autores,
      idioma: 'en',
      licenca: 'cc-by',
      capaUrl: b.cover_url || null,
      sinopse,
      ano: b.publish_date ? Number(String(b.publish_date).slice(0, 4)) || null : null,
      urlLeitura: b.webview_link || `https://openstax.org/details/books/${slugLivro}`,
      formato: 'html',
      fonteIdExterno: `ox-${item.id}`,
    });
    if (!ok) falhas++;
  }
  console.log(`   ✔ ${c.livrosRegistos.length} manuais prontos${falhas ? ` (${falhas} ignorados)` : ''}`);

  const tabelas = await c.fechar();
  const ficheiros = gerarSqlLotes(tabelas, 'ox');
  if (aplicar) ficheiros.forEach(applyFile);
  return c.livrosRegistos.length;
}

// ───────────────────────── 5. CHINESE POETRY ─────────────────────────

async function importarChino(aplicar) {
  console.log('\n🇨🇳 CHINESE POETRY (domínio público clássico)');
  // O repositório organiza-se em diretórios (cada um = uma coleção literária).
  // Importamos o ÍNDICE de coleções; o texto integral fica hospedado no GitHub.
  const r = await fetch('https://github.com/chinese-poetry/chinese-poetry', { headers: { 'User-Agent': 'Mozilla/5.0 (LinoLivre)' } });
  if (!r.ok) throw new Error('GitHub HTML HTTP ' + r.status);
  const html = await r.text();
  const dirs = [...new Set([...html.matchAll(/\/chinese-poetry\/chinese-poetry\/tree\/master\/([^"\\]+)/g)].map(m => m[1]))]
    .map(d => decodeURIComponent(d));

  // nomes próprios (chinês + português) para as coleções literárias; ignora .github/images/loader/rank/strains
  const COLECOES = {
    '全唐诗': '全唐诗 (Quán Tángshī) — Poesia Completa da Dinastia Tang',
    '御定全唐詩': '御定全唐詩 — Poesia Tang Imperiale (trad. caracteres trad.)',
    '宋词': '宋词 (Sòngcí) — Versos Ci da Dinastia Song',
    '五代诗词': '五代诗词 (Wǔdài Shīcí) — Poesia dos Cinco Dinastias',
    '元曲': '元曲 (Yuánqǔ) — Drama e Versos da Dinastia Yuan',
    '诗经': '诗经 (Shījīng) — O Clássico da Poesia',
    '楚辞': '楚辞 (Chǔcí) — Elegias de Chu',
    '论语': '论语 (Lúnyǔ) — As Analectas de Confúcio',
    '四书五经': '四书五经 (Sìshū Wǔjīng) — Quatro Livros e Cinco Clássicos',
    '曹操诗集': '曹操诗集 (Cáo Cāo Shījí) — Poesia de Cao Cao',
    '纳兰性德': '纳兰性德 (Nàlán Xìngdé) — Poesia de Nalan Xingde',
    '幽梦影': '幽梦影 (Yōu Mèng Yǐng) — Sombras de um Sonho',
    '水墨唐诗': '水墨唐诗 (Shuǐmò Tángshī) — Poesia Tang em Tinta',
    '蒙学': '蒙学 (Méngxué) — Textos Elementares Clássicos',
  };
  const colecoes = dirs.filter(d => COLECOES[d]);
  console.log(`   ✔ ${colecoes.length} coleções literárias encontradas`);

  const fonteId = await garantirFonte({ slug: 'chinese-poetry', nome: 'Chinese Poetry (GitHub)', tipo: 'manual', url_base: 'https://github.com/chinese-poetry/chinese-poetry' });
  const catId = await garantirCategoria('🏛️ Literatura Clássica Chinesa', 'Poesia e prosa clássica chinesa (dinastias Tang, Song…) em domínio público, hospedada no GitHub');

  const c = novoConstrutor(fonteId, catId);
  await c.preparar();

  for (const dir of colecoes) {
    c.add({
      titulo: COLECOES[dir],
      autor: 'Vários autores clássicos',
      idioma: 'zh',
      licenca: 'dominio-publico',
      capaUrl: null,
      sinopse: 'Colecção de literatura clássica chinesa em domínio público. Texto integral (ficheiros JSON) hospedado no repositório GitHub oficial — leitura e download no próprio GitHub.',
      ano: null,
      urlLeitura: `https://github.com/chinese-poetry/chinese-poetry/tree/master/${encodeURIComponent(dir)}`,
      formato: 'html',
      fonteIdExterno: `cp-${dir}`,
    });
  }
  console.log(`   ✔ ${c.livrosRegistos.length} coleções prontas`);

  const tabelas = await c.fechar();
  const ficheiros = gerarSqlLotes(tabelas, 'zh');
  if (aplicar) ficheiros.forEach(applyFile);
  return c.livrosRegistos.length;
}

// ─────────────── PROJECT GUTENBERG via Gutendex (domínio público) ───────────────
// Livros do Project Gutenberg (todos domínio público / PD), via API Gutendex.
// Dedup: usa o ID do Gutenberg como fonteIdExterno = mesmo formato dos já importados.
// Modelo intermediário: guardamos metadados e link de leitura em gutenberg.org (302).
async function importarGutenberg(aplicar) {
  const UA = { 'User-Agent': 'LinoLivre/1.0 (educacional; lino-livre)' };
  const buscar = async (params) => {
    const out = [];
    let page = 1;
    for (;;) {
      const url = 'https://gutendex.com/books/?' + new URLSearchParams({ ...params, page });
      let j = null;
      // retries pacientes com backoff exponencial (Gutendex faz rate-limit em série)
      for (let a = 0; a < 6; a++) {
        try {
          const ctl = new AbortController();
          const to = setTimeout(() => ctl.abort(), 25000);
          const r = await fetch(url, { headers: UA, signal: ctl.signal });
          clearTimeout(to);
          if (r.ok) { j = await r.json(); break; }
          if (r.status === 429) { await new Promise(s => setTimeout(s, 2000 * (a + 1))); continue; }
          // outro erro transitório: espera e tenta de novo
          await new Promise(s => setTimeout(s, 1500 * (a + 1)));
        } catch { await new Promise(s => setTimeout(s, 1500 * (a + 1))); }
      }
      if (!j) {
        // não abandonar tudo: espera extra e tenta mais uma vez esta página
        await new Promise(s => setTimeout(s, 4000));
        for (let a = 0; a < 3 && !j; a++) {
          try {
            const ctl = new AbortController();
            const to = setTimeout(() => ctl.abort(), 25000);
            const r = await fetch(url, { headers: UA, signal: ctl.signal });
            clearTimeout(to);
            if (r.ok) { j = await r.json(); break; }
          } catch {}
          await new Promise(s => setTimeout(s, 3000 * (a + 1)));
        }
      }
      if (!j) { console.warn(`   ⚠ página ${page} (${params.search || params.languages}) desistiu — a saltar`); page++; continue; }
      out.push(...(j.results || []));
      if (!j.next) break;
      page++;
      await new Promise(s => setTimeout(s, 1200)); // respeitar rate limits
    }
    return out;
  };

  console.log('📚 PROJECT GUTENBERG (Gutendex, domínio público)');
  const consultas = [
    { rotulo: 'africanos/tema África', params: { search: 'african' } },
    { rotulo: 'portugueses (pt)', params: { languages: 'pt' } },
  ];
  const fonteId = await garantirFonte({ slug: 'gutenberg', nome: 'Project Gutenberg', tipo: 'api', url_base: 'https://gutendex.com' });
  const catId = await garantirCategoria('📚 Project Gutenberg (Domínio Público)', 'Literatura e obras em domínio público do Project Gutenberg, incluindo títulos sobre África e literatura portuguesa. Leitura e download no próprio Gutenberg (redirect).');

  const c = novoConstrutor(fonteId, catId);
  await c.preparar();
  const vistos = new Set();
  let totalBruto = 0;

  for (const { rotulo, params } of consultas) {
    const books = await buscar(params);
    totalBruto += books.length;
    let n = 0;
    for (const b of books) {
      if (vistos.has(b.id)) continue;
      vistos.add(b.id);
      // só domínio público (copyright=false); ignora áudio/imagem
      if (b.copyright !== false || b.media_type !== 'Text') continue;
      const fmt = b.formats || {};
      const leitura = fmt['text/html'] || fmt['text/plain; charset=utf-8'] || Object.values(fmt).find(u => /\.html?$|\.txt/i.test(u));
      if (!leitura) continue;
      const capa = fmt['image/jpeg'] || null;
      const idioma = (b.languages && b.languages[0]) || 'en';
      const autor = (b.authors && b.authors[0] && b.authors[0].name) || 'Autor desconhecido';
      // inverter "Sobrenome, Primeiro" → "Primeiro Sobrenome" para display
      const autorDisplay = autor.includes(',') ? autor.split(',').map(s => s.trim()).reverse().join(' ') : autor;
      const sinopse = (b.summaries && b.summaries[0]) ? b.summaries[0].replace(/\s*\(This is an automatically generated summary\.\)\s*$/i, '').trim() : null;
      c.add({
        titulo: b.title, autor: autorDisplay, idioma, licenca: 'dominio-publico',
        capaUrl: capa, sinopse, ano: b.authors?.[0]?.birth_year || null,
        urlLeitura: leitura, formato: 'html', fonteIdExterno: String(b.id),
      });
      n++;
    }
    console.log(`   ✔ ${rotulo}: ${books.length} obtidos, ${n} novos elegíveis`);
  }
  console.log(`   ✔ ${c.livrosRegistos.length} livros prontos (de ${totalBruto} brutos, ${vistos.size} únicos)`);

  const tabelas = await c.fechar();
  const ficheiros = gerarSqlLotes(tabelas, 'gutenberg');
  if (aplicar) ficheiros.forEach(applyFile);
  return c.livrosRegistos.length;
}

// ───────────────── SIYAVULA (manuais sul-africanos, CC-BY) ─────────────────
// Siyavula publica manuais de ciência e matemática do ensino sul-africano
// em acesso aberto CC-BY. Não armazenamos ficheiros: guardamos metadados e
// apontamos para a leitura online em siyavula.com (redirect 302).
async function importarSiyavula(aplicar) {
  const UA = { 'User-Agent': 'LinoLivre/1.0 (educacional; lino-livre)' };
  const fetchTexto = async (url) => {
    for (let a = 0; a < 3; a++) {
      try {
        const ctl = new AbortController();
        const to = setTimeout(() => ctl.abort(), 15000);
        const r = await fetch(url, { headers: UA, signal: ctl.signal });
        clearTimeout(to);
        if (r.ok) return await r.text();
        if (r.status === 429) { await new Promise(r2 => setTimeout(r2, 2000)); continue; }
        return null;
      } catch { await new Promise(r2 => setTimeout(r2, 1200)); }
    }
    return null;
  };

  console.log('🇿🇦 SIYAVULA (manuais CC-BY da África do Sul)');
  const htmlRead = await fetchTexto('https://www.siyavula.com/read');
  if (!htmlRead) throw new Error('não consegui ler a página /read do Siyavula');
  const disciplinas = new Map();
  for (const m of htmlRead.matchAll(/\/read\/za\/([a-z-]+)\/(grade-\d+)/g)) {
    disciplinas.set(m[0], { subj: m[1], grade: m[2] });
  }
  const rotulos = {
    mathematics: 'Matemática', 'mathematical-literacy': 'Alfabetização Matemática',
    'physical-sciences': 'Ciências Físicas', 'natural-sciences': 'Ciências Naturais',
    'life-sciences': 'Ciências da Vida', 'computer-applications-technology': 'Tecnologia de Aplicações Informáticas',
    'information-technology': 'Tecnologia da Informação',
  };
  console.log(`   ✔ ${disciplinas.size} manuais encontrados`);
  const fonteId = await garantirFonte({ slug: 'siyavula', nome: 'Siyavula', tipo: 'manual', url_base: 'https://www.siyavula.com' });
  const catId = await garantirCategoria('🇿🇦 Ciência & Matemática Sul-Africana', 'Manuais de ciência e matemática do ensino da África do Sul, em acesso aberto CC-BY, hospedados no Siyavula — leitura online com redirect.');
  const c = novoConstrutor(fonteId, catId);
  await c.preparar();

  let n = 0;
  for (const [path, { subj, grade }] of disciplinas) {
    const url = 'https://www.siyavula.com' + path;
    const pagina = await fetchTexto(url);
    const tituloReal = pagina ? (pagina.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '').replace(/\s*\|\s*Siyavula\s*$/i, '').replace(/\s*Table of Contents\s*$/i, '').trim() : null;
    const titulo = tituloReal || `${rotulos[subj] || subj} ${grade.replace('grade-', '')}`;
    c.add({
      titulo, autor: 'Siyavula (equipa editorial)', idioma: 'en', licenca: 'cc-by',
      capaUrl: null,
      sinopse: `Manual ${rotulos[subj] || subj} (${grade.replace('grade-', '')}º ano) do ensino sul-africano, em acesso aberto CC-BY. Texto integral hospedado no Siyavula — leitura online no próprio site.`,
      ano: null, urlLeitura: url, formato: 'html', fonteIdExterno: `siy-${subj}-${grade}`,
    });
    n++;
    if (n % 5 === 0) console.log(`     … ${n}/${disciplinas.size} processados`);
    await new Promise(r2 => setTimeout(r2, 500));
  }
  console.log(`   ✔ ${c.livrosRegistos.length} manuais prontos`);
  const tabelas = await c.fechar();
  const ficheiros = gerarSqlLotes(tabelas, 'siyavula');
  if (aplicar) ficheiros.forEach(applyFile);
  return c.livrosRegistos.length;
}

// ───────────────────────── main ─────────────────────────

const FONTES = {
  asp: importarAsp,
  science: importarScience,
  standardebooks: importarStandardEbooks,
  openstax: importarOpenstax,
  chinese: importarChino,
  gutenberg: importarGutenberg,
  siyavula: importarSiyavula,
};

const escolhida = process.argv[2] || 'todas';
const aplicar = process.argv.includes('--apply');

console.log(`\n═══ Importador de Fontes Abertas — Lino Livre ═══`);
console.log(`Modo: ${aplicar ? 'APLICAR na D1 remota' : 'dry-run (só gera SQL)'}`);

const alvos = escolhida === 'todas' ? Object.keys(FONTES) : [escolhida];
let total = 0;
for (const nome of alvos) {
  if (!FONTES[nome]) { console.error(`❌ fonte desconhecida: ${nome} (opções: ${Object.keys(FONTES).join(', ')}, todas)`); process.exit(1); }
  try {
    total += (await FONTES[nome](aplicar)) || 0;
  } catch (err) {
    console.error(`❌ erro na fonte ${nome}: ${err.message}`);
  }
}
console.log(`\n═══ Concluído: ${total} registos ${aplicar ? 'importados para a D1 remota' : 'gerados em SQL'} ═══`);
