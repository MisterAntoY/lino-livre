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

async function sqlJson(command) {
  // colapsa quebras de linha: comandos multi-linha quebram o quoting do shell
  const oneLine = command.replace(/\s+/g, ' ').trim();
  const out = wrangler(`--command ${JSON.stringify(oneLine)} --json`);
  return JSON.parse(out)[0].results;
}

function applyFile(file) {
  console.log(`   ▶ a aplicar ${path.basename(file)} ...`);
  wrangler(`--file ${JSON.stringify(file)} --yes`);
}

async function garantirFonte(fonte) {
  // fonte: { slug, nome, tipo, url_base }
  await sqlJson(`INSERT OR IGNORE INTO fontes (slug, nome, tipo, url_base, ativa)
                 VALUES (${esc(fonte.slug)}, ${esc(fonte.nome)}, ${esc(fonte.tipo)}, ${esc(fonte.url_base)}, 1);`);
  const rows = await sqlJson(`SELECT id FROM fontes WHERE slug = ${esc(fonte.slug)};`);
  return rows[0].id;
}

async function garantirCategoria(nome, descricao) {
  await sqlJson(`INSERT OR IGNORE INTO categorias (nome, descricao) VALUES (${esc(nome)}, ${esc(descricao)});`);
  const rows = await sqlJson(`SELECT id FROM categorias WHERE nome = ${esc(nome)};`);
  return rows[0].id;
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
      const links = this.linksRegistos.map((lk, i) =>
        `INSERT OR IGNORE INTO links_livros (id, livro_id, formato, url, link_externo) VALUES ` +
        `(${maxK + i + 1}, ${maxL + lk.livroIdx + 1}, ${esc(lk.formato)}, ${esc(lk.url)}, 1);`);
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
  const res = await fetch('https://raw.githubusercontent.com/EbookFoundation/free-science-books/main/README.md',
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
  const res = await fetch('https://openstax.org/api/v2/books?format=json',
    { headers: { 'User-Agent': 'LinoLivre-Importer/1.0' } });
  if (!res.ok) throw new Error('API OpenStax HTTP ' + res.status);
  const json = await res.json();
  const books = json.items || json.books || (Array.isArray(json) ? json : []);
  console.log(`   ✔ ${books.length} manuais encontrados`);

  const fonteId = await garantirFonte({ slug: 'openstax', nome: 'OpenStax', tipo: 'api', url_base: 'https://openstax.org' });
  const catId = await garantirCategoria('🎓 Manuais Universitários Abertos', 'Textos universitários CC-BY da OpenStax (Rice University) — download e leitura oficiais');

  const c = novoConstrutor(fonteId, catId);
  await c.preparar();

  for (const b of books) {
    const autores = Array.isArray(b.authors) && b.authors.length
      ? b.authors.map(a => a.name).join(', ') : 'OpenStax';
    c.add({
      titulo: b.title + (b.salesforce_name && b.salesforce_name !== b.title ? '' : ''),
      autor: autores,
      idioma: 'en',
      licenca: 'cc-by',
      capaUrl: b.cover_url || null,
      sinopse: b.synopsis ? String(b.synopsis).replace(/<[^>]+>/g, ' ').trim().slice(0, 400) : `Manual universitário aberto (${b.subjects ? b.subjects.join(', ') : 'ensino superior'}). CC-BY.`,
      ano: b.published || null,
      urlLeitura: b.web_view_rex_link ? `https://openstax.org/apps/books/${b.id}` : `https://openstax.org/details/books/${b.book_ident}`,
      formato: 'html',
      fonteIdExterno: String(b.id),
    });
  }
  console.log(`   ✔ ${c.livrosRegistos.length} manuais prontos`);

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

// ───────────────────────── main ─────────────────────────

const FONTES = {
  asp: importarAsp,
  science: importarScience,
  standardebooks: importarStandardEbooks,
  openstax: importarOpenstax,
  chinese: importarChino,
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
