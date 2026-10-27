#!/usr/bin/env node
/**
 * Sanitizador de URLs e Prevenção de Mixed Content — Lino Livre
 *
 * Atualiza registros na Cloudflare D1 e no SQLite local para garantir:
 * 1. Nenhuma capa aponta para africanstorybook.org (certificado expirado / 404).
 * 2. Todas as capas utilizam HTTPS estrito.
 * 3. Todos os links de leitura externos utilizam HTTPS estrito.
 */

import { execSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_LOCAL_PATH = path.resolve(__dirname, '../biblioteca.db');

const args = process.argv.slice(2);
const isRemote = args.includes('--remote') || !args.includes('--local-only');
const isLocalOnly = args.includes('--local-only');

console.log('🔒 INICIANDO SANITIZAÇÃO DE PROTOCOLO HTTPS (ZERO MIXED CONTENT)\n');

// 1. Sanitização no SQLite Local
if (fs.existsSync(DB_LOCAL_PATH)) {
  console.log(`📁 Sanitizando base SQLite local: ${DB_LOCAL_PATH}`);
  try {
    const db = new DatabaseSync(DB_LOCAL_PATH);
    
    // Contagem prévia
    const prevAsp = db.prepare("SELECT COUNT(*) as c FROM livros WHERE capa_url LIKE '%africanstorybook.org%'").get().c;
    const prevHttpCapa = db.prepare("SELECT COUNT(*) as c FROM livros WHERE capa_url LIKE 'http://%'").get().c;
    const prevHttpLink = db.prepare("SELECT COUNT(*) as c FROM links_livros WHERE url LIKE 'http://%'").get().c;
    
    console.log(`   - Capas African Storybook a anular: ${prevAsp}`);
    console.log(`   - Capas HTTP a migrar para HTTPS: ${prevHttpCapa}`);
    console.log(`   - Links de leitura HTTP a migrar para HTTPS: ${prevHttpLink}`);

    db.exec(`
      UPDATE livros SET capa_url = NULL WHERE capa_url LIKE '%africanstorybook.org%';
      UPDATE livros SET capa_url = REPLACE(capa_url, 'http://', 'https://') WHERE capa_url LIKE 'http://%';
      UPDATE links_livros SET url = REPLACE(url, 'http://', 'https://') WHERE url LIKE 'http://%';
    `);

    console.log('   ✔ SQLite local sanitizado com sucesso!\n');
  } catch (err) {
    console.error(`   ❌ Erro ao sanitizar SQLite local: ${err.message}\n`);
  }
} else {
  console.log('ℹ SQLite local não encontrado, pulando etapa local.\n');
}

// 2. Sanitização no Cloudflare D1 Remote
if (isRemote) {
  console.log('☁️ Sanitizando Cloudflare D1 (lino-livre-db --remote)...');
  
  const comandos = [
    {
      nome: 'Anulação de capas inválidas africanstorybook.org',
      sql: "UPDATE livros SET capa_url = NULL WHERE capa_url LIKE '%africanstorybook.org%';"
    },
    {
      nome: 'Upgrade de capas HTTP para HTTPS',
      sql: "UPDATE livros SET capa_url = REPLACE(capa_url, 'http://', 'https://') WHERE capa_url LIKE 'http://%';"
    },
    {
      nome: 'Upgrade de links_livros HTTP para HTTPS',
      sql: "UPDATE links_livros SET url = REPLACE(url, 'http://', 'https://') WHERE url LIKE 'http://%';"
    }
  ];

  for (const cmd of comandos) {
    console.log(`   ⚡ Executando: ${cmd.nome}...`);
    try {
      const out = execSync(`npx wrangler d1 execute lino-livre-db --remote --command="${cmd.sql}"`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
      console.log(`   ✔ Sucesso`);
    } catch (err) {
      console.error(`   ❌ Falha ao executar "${cmd.nome}":`, err.stderr || err.message);
    }
  }

  // Verificação final
  console.log('\n🔎 Verificando conformidade final na D1...');
  try {
    const checkSql = "SELECT 'capas_inseguras' as tipo, COUNT(*) as total FROM livros WHERE capa_url LIKE '%africanstorybook.org%' OR capa_url LIKE 'http://%' UNION ALL SELECT 'links_inseguros' as tipo, COUNT(*) as total FROM links_livros WHERE url LIKE 'http://%';";
    const res = execSync(`npx wrangler d1 execute lino-livre-db --remote --command="${checkSql}"`, {
      encoding: 'utf-8'
    });
    console.log(res);
  } catch (err) {
    console.error('Falha na checagem final D1:', err.stderr || err.message);
  }
}

console.log('🎉 PROCESSO CONCLUÍDO!');
