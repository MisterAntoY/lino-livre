#!/usr/bin/env node
/**
 * Utilitário de Geração de Chave Administrativa Mestre — Lino Livre
 * Gera uma chave criptograficamente segura (256 bits / 64 caracteres hexadecimais)
 * para uso em ADMIN_API_KEY no servidor local (.env) e no Cloudflare Workers.
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const novaChave = crypto.randomBytes(32).toString('hex');

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║ 🔑 CHAVE ADMINISTRATIVA MESTRE GERADA (256 BITS DE ENTROPIA)     ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');
console.log(`Chave: ${novaChave}\n`);
console.log('Para configurar em produção no Cloudflare Workers, execute:');
console.log(`  npx wrangler secret put ADMIN_API_KEY\n  (e cole a chave acima quando solicitado)\n`);
console.log('Para configurar no ambiente local (.env):');
console.log(`  ADMIN_API_KEY=${novaChave}\n`);

// Se solicitado via flag --salvar-env, atualiza ou adiciona no .env local se existir
if (process.argv.includes('--salvar-env')) {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf-8');
    if (/^ADMIN_API_KEY=/m.test(envContent)) {
      envContent = envContent.replace(/^ADMIN_API_KEY=.*$/m, `ADMIN_API_KEY=${novaChave}`);
    } else {
      envContent += `\nADMIN_API_KEY=${novaChave}\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.log('✅ ADMIN_API_KEY atualizada com sucesso no arquivo .env!');
  } else {
    fs.writeFileSync(envPath, `ADMIN_API_KEY=${novaChave}\n`, 'utf-8');
    console.log('✅ Arquivo .env criado com ADMIN_API_KEY configurada!');
  }
}
