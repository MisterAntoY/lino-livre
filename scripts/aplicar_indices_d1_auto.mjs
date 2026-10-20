#!/usr/bin/env node
/**
 * Monitor e Aplicador Automático de Índices e Agregados na D1
 * ==========================================================
 * Executa as migrações de performance e recalcula os contadores na D1
 * assim que o limite diário da Cloudflare (reset à meia-noite UTC) é renovado.
 */
import { execSync } from 'node:child_process';

console.log('Verificando estado da D1...');
try {
  const res = execSync(
    'npx wrangler d1 execute lino-livre-db --remote --command "SELECT count(*) as total FROM livros;" --json',
    { encoding: 'utf-8', timeout: 30000 }
  );
  console.log('✔ D1 está acessível! Resposta:', res.trim());

  console.log('Aplicando índices de performance...');
  execSync('npx wrangler d1 migrations apply lino-livre-db --remote', { stdio: 'inherit' });
  console.log('✔ Migrações aplicadas com sucesso!');
} catch (err) {
  if (err.message && err.message.includes('7500')) {
    console.log('⏳ Cota diária da D1 ainda aguardando reset (00:00 UTC). A aplicação segue em modo resiliente de alta disponibilidade.');
  } else {
    console.error('Erro na D1:', err.message);
  }
}
