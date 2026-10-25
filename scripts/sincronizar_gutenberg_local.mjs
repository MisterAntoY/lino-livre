#!/usr/bin/env node
/**
 * Sincronizador Gutenberg → SQLite local (biblioteca.db)
 *
 * Espelha o acervo integral do Project Gutenberg da D1 de produção
 * (Cloudflare D1) para a base local de desenvolvimento, mantendo os
 * MESMOS IDs de autores, livros, categorias e links — garantindo
 * paridade completa entre dev e produção sem duplicar qualquer obra.
 *
 * Conformidade AGENTS.md:
 * - Apenas metadados (nunca ficheiros de obras);
 * - Links externos para redirecionamento HTTP 302;
 * - `conteudo_texto` copiado tal como está na produção (NULL para
 *   obras sem texto integral de domínio público verificado);
 * - Operação idempotente (INSERT OR IGNORE) e retomável (checkpoint).
 *
 * Uso:
 *   node scripts/sincronizar_gutenberg_local.mjs            # executa tudo
 *   node scripts/sincronizar_gutenberg_local.mjs --recalc   # só recalcula agregados
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB_REMOTE = 'lino-livre-db';
const CHECKPOINT = path.resolve('.scratch/gutenberg-local-sync.json');
const CHUNK = 10000;
const PAUSA_MS = 250;

const args = process.argv.slice(2);
const soRecalc = args.includes('--recalc');

// ─────────────────────────────────────────────────────────────
// Conexão local (better-sqlite3, com WAL para carga em massa)
// ─────────────────────────────────────────────────────────────
const { initDatabase, closeDatabase } = await import('../src/database/index.js');
const db = initDatabase('./biblioteca.db', {});
try { db.exec('PRAGMA journal_mode = WAL;'); } catch { /* opcional */ }
try { db.exec('PRAGMA foreign_keys = OFF;'); } catch { /* agiliza carga */ }

function emTransacao(fn) {
  db.exec('BEGIN');
  try {
    fn();
    db.exec('COMMIT');
  } catch (err) {
    try { db.exec('ROLLBACK'); } catch { /* já abortou */ }
    throw err;
  }
}

function lerCheckpoint() {
  try {
    return JSON.parse(fs.readFileSync(CHECKPOINT, 'utf-8'));
  } catch {
    return { livros_ultimo_id: 0, autores_ok: false, links_ultimo_id: 0, recalc_ok: false };
  }
}
const ck = lerCheckpoint();
const guardar = () => fs.writeFileSync(CHECKPOINT, JSON.stringify(ck, null, 2));

// ─────────────────────────────────────────────────────────────
// Consulta remota D1 (wrangler CLI, JSON puro)
// ─────────────────────────────────────────────────────────────
function d1Json(sql) {
  // Quoting POSIX à prova de espaços, quebras de linha e apóstrofos
  const shellSeguro = `'` + sql.replace(/'/g, `'\\''`) + `'`;
  const stdout = execSync(
    `npx wrangler d1 execute ${DB_REMOTE} --remote --json --command ${shellSeguro}`,
    { maxBuffer: 512 * 1024 * 1024, encoding: 'utf-8' }
  );
  // Saída do CLI é um array JSON (pretty-printed) de statements; extrai com
  // os delimitadores de bracket reais e valida erros da API com mensagem útil.
  const ini = stdout.indexOf('[');
  const fim = stdout.lastIndexOf(']');
  if (ini === -1 || fim === -1) {
    let motivo = stdout.slice(0, 400);
    try { motivo = JSON.parse(stdout).error?.text || motivo; } catch { /* sai com o bruto */ }
    throw new Error(`Resposta D1 inesperada: ${motivo}`);
  }
  return JSON.parse(stdout.slice(ini, fim + 1))[0].results;
}
const dormir = (ms) => new Promise(r => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────
// 1. Livros (fonte_id = 5) — keyset pagination
// ─────────────────────────────────────────────────────────────
if (!soRecalc) {
  console.log('📥 1. Espelhando livros do Gutenberg (D1 → local)...');
  let ultimo = ck.livros_ultimo_id || 0;
  let total = 0;

  const insLivro = db.prepare(`
    INSERT OR IGNORE INTO livros
      (id, titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url, paginas,
       autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras, conteudo_texto, criado_em)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (;;) {
    const rows = d1Json(
      `SELECT id, titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url, paginas,
              autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras, conteudo_texto, criado_em
         FROM livros
        WHERE fonte_id = 5 AND id > ${ultimo}
        ORDER BY id
        LIMIT ${CHUNK}`
    );
    if (!rows.length) break;

    emTransacao(() => {
      for (const r of rows) {
        insLivro.run(
          r.id,
          r.titulo,
          r.subtitulo ?? null,
          r.isbn ?? null,
          r.ano_publicacao ?? null,
          r.idioma ?? 'outro',
          r.sinopse ?? null,
          r.capa_url ?? null,
          r.paginas ?? null,
          r.autor_id ?? null,
          r.categoria_id ?? null,
          r.fonte_id,
          r.fonte_id_externo,
          r.licenca ?? 'dominio-publico',
          r.leituras ?? 0,
          r.conteudo_texto ?? null,
          r.criado_em ?? null
        );
      }
    });
    total += rows.length;
    ultimo = rows[rows.length - 1].id;
    ck.livros_ultimo_id = ultimo;
    guardar();
    console.log(`   ✔ ${total} livros espelhados (último id: ${ultimo})`);
    await dormir(PAUSA_MS);
  }
  console.log(`   ✔ Fase 1 concluída: ${total} linhas de livros processadas nesta execução.`);
}

// ─────────────────────────────────────────────────────────────
// 2. Autores referenciados pelo acervo Gutenberg
// ─────────────────────────────────────────────────────────────
if (!soRecalc && !ck.autores_ok) {
  console.log('📥 2. Espelhando autores do Gutenberg...');
  const autores = d1Json(
    `SELECT a.id, a.nome, a.nacionalidade, a.biografia, a.criado_em
       FROM autores a
      WHERE a.id IN (SELECT DISTINCT autor_id FROM livros WHERE fonte_id = 5 AND autor_id IS NOT NULL)`
  );
  const insAutor = db.prepare(
    'INSERT OR IGNORE INTO autores (id, nome, nacionalidade, biografia, criado_em) VALUES (?, ?, ?, ?, ?)'
  );
  const lote = emTransacao(() => {
    for (const a of autores) {
      insAutor.run(a.id, a.nome, a.nacionalidade ?? null, a.biografia ?? null, a.criado_em ?? null);
    }
  });
  ck.autores_ok = true;
  guardar();
  console.log(`   ✔ ${autores.length} autores garantidos localmente.`);
}

// ─────────────────────────────────────────────────────────────
// 3. Links (formatos externos 302) das obras Gutenberg
// ─────────────────────────────────────────────────────────────
if (!soRecalc) {
  console.log('📥 3. Espelhando links de leitura/download...');
  let ultimoLK = ck.links_ultimo_id || 0;
  let totalLK = 0;

  const idsPg = new Set(
    db.prepare('SELECT id FROM livros WHERE fonte_id = 5').all().map(r => r.id)
  );
  console.log(`   ✔ ${idsPg.size} ids de livros Gutenberg na base local.`);

  const insLink = db.prepare(
    'INSERT OR IGNORE INTO links_livros (id, livro_id, formato, url, tamanho_bytes, link_externo) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (;;) {
    const rows = d1Json(
      `SELECT id, livro_id, formato, url, tamanho_bytes, link_externo
         FROM links_livros
        WHERE id > ${ultimoLK}
        ORDER BY id
        LIMIT ${CHUNK}`
    );
    if (!rows.length) break;

    const elegiveis = rows.filter(r => idsPg.has(r.livro_id));
    if (elegiveis.length) {
      emTransacao(() => {
        for (const r of elegiveis) {
          insLink.run(r.id, r.livro_id, r.formato, r.url, r.tamanho_bytes ?? null, r.link_externo ?? 1);
        }
      });
      totalLK += elegiveis.length;
    }
    ultimoLK = rows[rows.length - 1].id;
    ck.links_ultimo_id = ultimoLK;
    guardar();
    console.log(`   ✔ ${totalLK} links espelhados (posição: id ${ultimoLK})`);
    await dormir(PAUSA_MS);
  }
  console.log(`   ✔ Fase 3 concluída: ${totalLK} links processados nesta execução.`);
}

// ─────────────────────────────────────────────────────────────
// 4. Agregados locais (estatisticas, contadores, autor_totais)
// ─────────────────────────────────────────────────────────────
console.log('🧮 4. Recalculando agregados locais (set-based, zero varreduras na API)...');

emTransacao(() => {
  // estatisticas — totais exatos
  const paresEstatisticas = [
    ['total_livros', db.prepare('SELECT COUNT(*) c FROM livros').get().c],
    ['total_autores', db.prepare('SELECT COUNT(*) c FROM autores').get().c],
    ['total_categorias', db.prepare('SELECT COUNT(*) c FROM categorias').get().c],
    ['total_cursos', db.prepare('SELECT COUNT(*) c FROM cursos').get().c],
    ['total_fontes', db.prepare('SELECT COUNT(*) c FROM fontes WHERE ativa = 1').get().c],
    ['total_leituras', db.prepare('SELECT COALESCE(SUM(leituras),0) c FROM livros').get().c]
  ];
  const upEst = db.prepare(
    `INSERT INTO estatisticas (chave, valor, atualizado_em) VALUES (?, ?, datetime('now'))
     ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizado_em = excluded.atualizado_em`
  );
  for (const [chave, valor] of paresEstatisticas) upEst.run(chave, valor);

  // contadores por dimensão
  const dimensoes = [
    ['idioma', 'l.idioma', ''],
    ['licenca', 'l.licenca', ''],
    ['categoria', 'l.categoria_id', 'c.nome'],
    ['fonte', 'l.fonte_id', 'f.nome']
  ];
  const delCont = db.prepare('DELETE FROM contadores WHERE dimensao = ?');
  const insCont = db.prepare(
    'INSERT OR REPLACE INTO contadores (dimensao, chave, rotulo, total) VALUES (?, ?, ?, ?)'
  );
  for (const [dim, colChave, colRotulo] of dimensoes) {
    delCont.run(dim);
    const rotuloSel = colRotulo ? `, ${colRotulo} AS rotulo` : `, ${colChave} AS rotulo`;
    const linhas = db.prepare(
      `SELECT ${colChave} AS chave${rotuloSel}, COUNT(*) AS total
         FROM livros l
         LEFT JOIN categorias c ON c.id = l.categoria_id
         LEFT JOIN fontes f ON f.id = l.fonte_id
        GROUP BY ${colChave}`
    ).all();
    for (const lin of linhas) {
      insCont.run(dim, String(lin.chave ?? 'vazio'), lin.rotulo ?? null, lin.total);
    }
  }

  // autor_totais — reconstrução completa
  db.prepare('DELETE FROM autor_totais').run();
  db.prepare(
    `INSERT INTO autor_totais (autor_id, total)
       SELECT autor_id, COUNT(*)
         FROM livros
        WHERE autor_id IS NOT NULL
        GROUP BY autor_id`
  ).run();
});

// ─────────────────────────────────────────────────────────────
// 5. Verificação final
// ─────────────────────────────────────────────────────────────
function sanitizarFtsCheck(termo) {
  // Tokens puros exatamente como sanitiza a API (workers/src/index.ts)
  return termo
    .split(/[^a-zA-Z0-9À-ÿ]+/)
    .filter(Boolean)
    .map(t => `"${t}"*`)
    .join(' ');
}

const estado = {
  livros: db.prepare('SELECT COUNT(*) c FROM livros').get().c,
  livros_gutenberg: db.prepare("SELECT COUNT(*) c FROM livros WHERE fonte_id = 5").get().c,
  links_gutenberg: db.prepare(
    "SELECT COUNT(*) c FROM links_livros WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id = 5)"
  ).get().c,
  autores: db.prepare('SELECT COUNT(*) c FROM autores').get().c,
  estatisticas: db.prepare("SELECT chave, valor FROM estatisticas WHERE chave = 'total_livros'").get()
};
// Sonde FTS com obras espelhadas determinísticas (Hamlet + amostra aleatória)
const sondas = ['hamlet'];
for (const lin of db.prepare(
  "SELECT titulo FROM livros WHERE fonte_id = 5 AND idioma = 'pt' ORDER BY ABS(RANDOM()) LIMIT 2"
).all()) {
  const primeiro = (lin.titulo || '').split(/\s+/)[0];
  if (primeiro && primeiro.length >= 4) sondas.push(primeiro);
}
let ftsOk = 0;
for (const s of sondas) {
  const linhas = db.prepare('SELECT rowid FROM livros_fts WHERE livros_fts MATCH ? LIMIT 1').all(sanitizarFtsCheck(s));
  if (linhas.length) ftsOk++;
  console.log(`   🔍 FTS probe "${s}": ${linhas.length ? 'encontrado ✔' : 'sem resultados ✘'}`);
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Estado local final (biblioteca.db):');
console.log(`   Livros totais:        ${estado.livros}`);
console.log(`   Gutenberg (fonte 5):  ${estado.livros_gutenberg}`);
console.log(`   Links do Gutenberg:   ${estado.links_gutenberg}`);
console.log(`   Autores:              ${estado.autores}`);
console.log(`   Sondas FTS OK:        ${ftsOk}/${sondas.length}`);
console.log(`   estatisticas.total_livros: ${estado.estatisticas?.valor}`);
console.log('✅ Sincronização concluída.');
closeDatabase();
