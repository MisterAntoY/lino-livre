#!/usr/bin/env node
/**
 * Aplica supabase/schema.sql via ligação Postgres direta (DIRECT_URL).
 *
 * Uso:
 *   npm run supabase:schema             # aplica o schema
 *   npm run supabase:schema -- --verificar   # só verifica o que existe
 *
 * Requer no .env:
 *   DIRECT_URL=postgresql://postgres.<ref>:<password>@...pooler.supabase.com:5432/postgres
 *
 * Se a password estiver errada: Dashboard → Project Settings → Database →
 * Reset database password, e atualize o .env. Alternativa sem password:
 * colar supabase/schema.sql no SQL Editor do Supabase.
 *
 * O schema é idempotente: pode ser aplicado várias vezes.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

const RAIZ = path.resolve(__dirname, '..');
const FICHEIRO_SCHEMA = path.join(RAIZ, 'supabase', 'schema.sql');
const SO_VERIFICAR = process.argv.includes('--verificar');

const TABELAS = [
  'fontes', 'categorias', 'autores', 'livros', 'links_livros', 'cursos',
  'import_jobs', 'podcasts_shows', 'podcasts_episodios',
  'estatisticas', 'contadores', 'autor_totais'
];
const VIEWS = ['livros_api', 'cursos_api', 'podcasts_api'];
const FUNCOES = [
  'buscar_livros', 'contar_livros', 'incrementar_leitura',
  'incrementar_reproducao', 'recalcular_estatisticas'
];

function carregarEnv() {
  const env = { ...process.env };
  const ficheiro = path.join(RAIZ, '.env');
  if (!fs.existsSync(ficheiro)) return env;
  for (const linha of fs.readFileSync(ficheiro, 'utf8').split(/\r?\n/)) {
    if (!linha || linha.trim().startsWith('#')) continue;
    const i = linha.indexOf('=');
    if (i < 0) continue;
    const k = linha.slice(0, i).trim();
    const v = linha.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in env)) env[k] = v;
  }
  return env;
}

async function main() {
  const env = carregarEnv();
  const ligacao = env.DIRECT_URL || env.DATABASE_URL;

  if (!ligacao) {
    console.error('✗ Falta DIRECT_URL (ou DATABASE_URL) no .env.');
    console.error('  Dashboard → Project Settings → Database → Connection string.');
    process.exit(1);
  }

  let host = '?';
  try {
    host = new URL(ligacao).hostname;
  } catch (_) {}

  console.log('Supabase:', host);

  const client = new Client({
    connectionString: ligacao,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
  });

  try {
    await client.connect();
  } catch (err) {
    const msg = String(err.message || err);
    console.error('\n✗ Não foi possível ligar ao Postgres:', msg);
    if (/password authentication failed/i.test(msg)) {
      console.error('\n  A password em DIRECT_URL/DATABASE_URL está errada ou foi alterada.');
      console.error('  1. Dashboard → Project Settings → Database → Reset database password');
      console.error('  2. Atualize DIRECT_URL e DATABASE_URL no .env');
      console.error('  3. Ou cole supabase/schema.sql no SQL Editor (não precisa de password).');
    } else if (/ENOTFOUND|EAI_AGAIN/i.test(msg)) {
      console.error('\n  Host não encontrado. Confirme o host/região da connection string.');
    }
    process.exit(1);
  }

  try {
    if (!SO_VERIFICAR) {
      const sql = fs.readFileSync(FICHEIRO_SCHEMA, 'utf8');
      console.log('A aplicar supabase/schema.sql …');
      await client.query(sql);
      console.log('✓ Schema aplicado (idempotente).');
    }

    const { rows: tabelas } = await client.query(`
      select table_name from information_schema.tables
      where table_schema = 'public' and table_type = 'BASE TABLE'
      order by table_name
    `);
    const { rows: views } = await client.query(`
      select table_name from information_schema.views
      where table_schema = 'public' order by table_name
    `);
    const { rows: funcoes } = await client.query(`
      select routine_name from information_schema.routines
      where routine_schema = 'public' order by routine_name
    `);

    const nomesTabelas = new Set(tabelas.map((r) => r.table_name));
    const nomesViews = new Set(views.map((r) => r.table_name));
    const nomesFuncoes = new Set(funcoes.map((r) => r.routine_name));

    const faltamTabelas = TABELAS.filter((t) => !nomesTabelas.has(t));
    const faltamViews = VIEWS.filter((v) => !nomesViews.has(v));
    const faltamFuncoes = FUNCOES.filter((f) => !nomesFuncoes.has(f));

    console.log('\nTabelas:');
    for (const t of TABELAS) {
      if (!nomesTabelas.has(t)) {
        console.log(`  ${t.padEnd(22)} AUSENTE`);
        continue;
      }
      const { rows } = await client.query(`select count(*)::int as n from "${t}"`);
      console.log(`  ${t.padEnd(22)} ${rows[0].n}`);
    }

    console.log('\nViews:', VIEWS.map((v) => (nomesViews.has(v) ? '✓ ' + v : '✗ ' + v)).join('  '));
    console.log('Funções:', FUNCOES.map((f) => (nomesFuncoes.has(f) ? '✓ ' + f : '✗ ' + f)).join('  '));

    if (faltamTabelas.length || faltamViews.length || faltamFuncoes.length) {
      console.error('\n✗ Faltam objetos:');
      if (faltamTabelas.length) console.error('  tabelas:', faltamTabelas.join(', '));
      if (faltamViews.length) console.error('  views:', faltamViews.join(', '));
      if (faltamFuncoes.length) console.error('  funções:', faltamFuncoes.join(', '));
      process.exitCode = 1;
    } else {
      console.log('\n✓ Schema completo.');
    }
  } catch (err) {
    console.error('\n✗ Erro ao aplicar o schema:', err.message);
    if (err.position) console.error('  posição no SQL:', err.position);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('✗ Falha inesperada:', err.message);
  process.exit(1);
});
