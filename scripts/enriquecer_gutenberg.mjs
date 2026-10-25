#!/usr/bin/env node
/**
 * Enriquecedor Gutendex — Lino Livre
 *
 * Percorre o catálogo oficial de metadados do Project Gutenberg via
 * Gutendex (https://gutendex.com) numa passagem sequencial e enriquece
 * o acervo local com:
 *
 *   1. SINOPSES REAIS (summaries) — substitui apenas o texto-base
 *      gerado na ingestão; conserva as sinopses curadas à mão;
 *   2. CAPAS VERIFICADAS (formats['image/jpeg']) — apenas quando a
 *      obra não tem capa, garantindo zero imagens quebradas;
 *   3. LINKS DE DOWNLOAD (PDF / EPUB / TXT) — URLs oficiais por
 *      formato reportadas pelo Gutendex, sem adivinhação de padrão.
 *
 * Conformidade AGENTS.md: metadados apenas, links externos 302,
 * zero coleta de ficheiros, idempotente e retomável (checkpoint).
 *
 * Uso:
 *   node scripts/enriquecer_gutenberg.mjs                 # retoma do checkpoint
 *   node scripts/enriquecer_gutenberg.mjs --max-pages 50  # execução parcial
 */

import fs from 'node:fs';
import path from 'node:path';

const CHECKPOINT = path.resolve('.scratch/gutenberg-enrich.json');
const PAGINA_PAUSA_MS = 1050;  // polidez: ≥ 1 req/s
const CHECKPOINT_DE_CADA = 20; // páginas por checkpoint
const MAX_FALHAS_SEGUIDAS = 5;

const args = process.argv.slice(2);
const idxMax = args.indexOf('--max-pages');
const maxPaginas = idxMax !== -1 ? Math.max(1, parseInt(args[idxMax + 1], 10) || 50) : Infinity;

const { initDatabase, closeDatabase } = await import('../src/database/index.js');
const db = initDatabase('./biblioteca.db', {});
try { db.exec('PRAGMA journal_mode = WAL;'); } catch { /* noop */ }

function lerCk() {
  try { return JSON.parse(fs.readFileSync(CHECKPOINT, 'utf-8')); }
  catch {
    return { page: 1, obras: 0, sinopses: 0, capas: 0, capasRemovidas: 0, links: 0, faltantes: 0, faltantesIds: [] };
  }
}
const ck = lerCk();
if (!Array.isArray(ck.faltantesIds)) ck.faltantesIds = [];
if (typeof ck.capasRemovidas !== 'number') ck.capasRemovidas = 0;
const guardar = () => fs.writeFileSync(CHECKPOINT, JSON.stringify(ck, null, 2));

const TEMPLATE_SINOPSE = 'Obra clássica em domínio público preservada pelo Project Gutenberg.';
const CAPA_CEGA_RE = /^https:\/\/www\.gutenberg\.org\/cache\/epub\/\d+\/pg\d+\.cover\.medium\.jpg$/;

const updSinopse = db.prepare('UPDATE livros SET sinopse = ? WHERE id = ?');
const updCapa = db.prepare('UPDATE livros SET capa_url = ? WHERE id = ?');
const insLink = db.prepare(
  'INSERT OR IGNORE INTO links_livros (livro_id, formato, url, link_externo) VALUES (?, ?, ?, 1)'
);

function buscaObra(pgId) {
  return db.prepare(
    `SELECT id, sinopse, capa_url
       FROM livros
      WHERE fonte_id = 5 AND (fonte_id_externo = ? OR fonte_id_externo = ?)
      LIMIT 1`
  ).get(`pg-${pgId}`, String(pgId));
}

function primeiroTxtPlain(formats) {
  for (const [mime, url] of Object.entries(formats)) {
    if (mime.startsWith('text/plain') && typeof url === 'string') return url;
  }
  return null;
}

function ehUrlSegura(url) {
  return typeof url === 'string' && url.startsWith('https://') && url.length < 2048;
}

const T0 = Date.now();
let paginas = 0;
let falhasSeguidas = 0;

for (;;) {
  if (paginas >= maxPaginas) { console.log(`⏸ Limite de ${maxPaginas} páginas desta execução atingido.`); break; }

  let json;
  try {
    const res = await fetch(`https://gutendex.com/books/?page=${ck.page}`, {
      signal: AbortSignal.timeout(20000),
      headers: { 'User-Agent': 'LinoLivre/1.0 (catalogacao educacional; intermediario de links)' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    json = await res.json();
    falhasSeguidas = 0;
  } catch (err) {
    falhasSeguidas++;
    guardar();
    console.error(`⚠ Falha na página ${ck.page} (${err.message.slice(0, 60)}); tentativa ${falhasSeguidas}/${MAX_FALHAS_SEGUIDAS}`);
    if (falhasSeguidas >= MAX_FALHAS_SEGUIDAS) {
      console.error('⛔ Interrupção segura — retome mais tarde com o mesmo comando.');
      process.exitCode = 0;
      break;
    }
    await new Promise(r => setTimeout(r, 8000));
    continue;
  }

  let sin = 0, cap = 0, capRemovidas = 0, lnk = 0, falt = 0;
  for (const b of json.results) {
    const obra = buscaObra(b.id);
    if (!obra) { falt++; ck.faltantesIds.push(b.id); continue; }

    // 1. sinopse real (só substitui o texto-base da ingestão em massa)
    const resumo = (b.summaries || []).find(s => typeof s === 'string' && s.trim().length > 40);
    if (resumo && obra.sinopse && obra.sinopse.startsWith(TEMPLATE_SINOPSE)) {
      updSinopse.run(resumo.trim().slice(0, 700), obra.id);
      sin++;
    }

    // 2. capa verificada — substitui o padrão-cego da ingestão antiga
    //    (gerava URLs possíveis de 404) pela URL oficial auditável do
    //    Gutendex; se não existir capa, anula a URL cega para o
    //    frontend usar o fallback local (zero imagens quebradas).
    const capaGutendex = b.formats && b.formats['image/jpeg'];
    const cega = obra.capa_url && CAPA_CEGA_RE.test(obra.capa_url);
    if (ehUrlSegura(capaGutendex) && (cega || !obra.capa_url)) {
      updCapa.run(capaGutendex, obra.id);
      cap++;
    } else if (!capaGutendex && cega) {
      updCapa.run(null, obra.id);
      capRemovidas++;
    }

    // 3. links oficiais por formato (UNIQUE(livro_id, formato) protege)
    for (const [formato, urlL] of [
      ['pdf', b.formats && b.formats['application/pdf']],
      ['epub', b.formats && b.formats['application/epub+zip']],
      ['txt', b.formats && primeiroTxtPlain(b.formats)]
    ]) {
      if (ehUrlSegura(urlL)) {
        const r = insLink.run(obra.id, formato, urlL);
        if (r.changes > 0) lnk++;
      }
    }
  }

  ck.obras += json.results.length;
  ck.sinopses += sin; ck.capas += cap; ck.capasRemovidas = (ck.capasRemovidas || 0) + capRemovidas;
  ck.links += lnk; ck.faltantes += falt;

  const totalPaginas = json.count ? Math.ceil(json.count / 32) : '?';
  const minutos = ((Date.now() - T0) / 60000).toFixed(1);
  console.log(`p${ck.page}/${totalPaginas} · ${json.results.length} obras · +${sin} sin · +${cap} capas · -${capRemovidas} cegas · +${lnk} links · falt ${falt} · ${minutos} min`);

  paginas++;
  if (!json.next) { console.log('🏁 Fim do Gutendex alcançado.'); ck.page = ck.page + 1; guardar(); break; }
  ck.page += 1;
  if (ck.page % CHECKPOINT_DE_CADA === 0) guardar();
  await new Promise(r => setTimeout(r, PAGINA_PAUSA_MS));
}

guardar();
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`✅ Execução encerrada na página ${ck.page}.`);
console.log(`   Obras analisadas (acumulado): ${ck.obras}`);
console.log(`   Sinopses reais:               ${ck.sinopses}`);
console.log(`   Capas adicionadas:            ${ck.capas}`);
console.log(`   Capas cegas removidas:        ${ck.capasRemovidas || 0}`);
console.log(`   Links PDF/EPUB/TXT:           ${ck.links}`);
console.log(`   Obras só no Gutendex:         ${ck.faltantes}`);
if ((ck.faltantesIds || []).length) {
  fs.writeFileSync(path.resolve('.scratch/gutenberg-faltantes.json'), JSON.stringify(ck.faltantesIds, null, 2));
  console.log(`   → ids faltantes gravados em .scratch/gutenberg-faltantes.json`);
}
closeDatabase();
