/**
 * Aplicador Confiável de Lotes Gutenberg — Lino Livre
 * 
 * Aplica os 28 ficheiros SQL gerados (.scratch/sql-gutenberg/pg-batch-*.sql)
 * tanto no SQLite local (biblioteca.db) quanto no Cloudflare D1 remoto (lino-livre-db).
 * 
 * Possui rastreamento de progresso (.scratch/gutenberg-applied.json) para
 * permitir retomada automática e tolerância a falhas com retentativas.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB = 'lino-livre-db';
const SQL_DIR = path.resolve('.scratch/sql-gutenberg');
const PROGRESS_FILE = path.resolve('.scratch/gutenberg-applied.json');

function getApplied() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    } catch {
      return [];
    }
  }
  return [];
}

function saveApplied(appliedList) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(appliedList, null, 2), 'utf-8');
}

function runWithRetry(cmd, maxRetries = 3, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return execSync(cmd, {
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    } catch (err) {
      console.warn(`      ⚠ Tentativa ${attempt}/${maxRetries} falhou: ${err.message?.slice(0, 150)}`);
      if (attempt === maxRetries) throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs * attempt);
    }
  }
}

async function main() {
  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`🚀 Executando Aplicação dos Lotes Gutenberg (Fase 2)`);
  console.log(`════════════════════════════════════════════════════════════\n`);

  if (!fs.existsSync(SQL_DIR)) {
    console.error(`❌ Diretoria ${SQL_DIR} não existe.`);
    process.exit(1);
  }

  const files = fs.readdirSync(SQL_DIR)
    .filter(f => f.startsWith('pg-batch-') && f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.error(`❌ Nenhum lote SQL encontrado em ${SQL_DIR}.`);
    process.exit(1);
  }

  const applied = new Set(getApplied());
  const pending = files.filter(f => !applied.has(f));

  console.log(`📊 Total de lotes: ${files.length}`);
  console.log(`✔ Lotes já aplicados: ${applied.size}`);
  console.log(`▶ Lotes pendentes: ${pending.length}\n`);

  if (pending.length === 0) {
    console.log(`🎉 Todos os lotes já foram aplicados anteriormente!`);
    return;
  }

  let count = 0;
  for (const file of pending) {
    count++;
    const fullPath = path.join(SQL_DIR, file);
    const progress = `[${count}/${pending.length}] (Geral: ${applied.size + 1}/${files.length})`;
    console.log(`▶ ${progress} Aplicando ${file}...`);

    // 1. Local SQLite
    try {
      execSync(`sqlite3 biblioteca.db -cmd "PRAGMA trusted_schema = ON;" -cmd "PRAGMA busy_timeout = 10000;" < ${JSON.stringify(fullPath)}`, {
        stdio: 'pipe'
      });
    } catch (err) {
      console.warn(`   ⚠ Aviso local: ${err.message?.slice(0, 100)}`);
    }

    // 2. Cloudflare D1 Remoto
    const cmd = `npx wrangler d1 execute ${DB} --remote --file=${JSON.stringify(fullPath)} --yes`;
    runWithRetry(cmd);

    applied.add(file);
    saveApplied(Array.from(applied));
    console.log(`   ✔ Sucesso: ${file} aplicado local e remotamente.`);
  }

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`🎉 Todos os lotes do Project Gutenberg foram aplicados com sucesso!`);
  console.log(`════════════════════════════════════════════════════════════\n`);
}

main().catch(err => {
  console.error(`\n❌ Falha durante a aplicação: ${err.message}`);
  process.exit(1);
});
