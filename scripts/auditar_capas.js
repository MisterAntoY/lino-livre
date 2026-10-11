const fs = require('node:fs');
const path = require('node:path');
const { getDatabase } = require('../src/database');

const db = getDatabase();
const capasDir = path.join(__dirname, '../public/capas');
const arquivosFisicos = new Set(fs.readdirSync(capasDir));

console.log(`=== AUDITORIA COMPLETA DE CAPAS — LINO LIVRE ===\n`);
console.log(`Total de arquivos de capa físicos em public/capas/: ${arquivosFisicos.size}`);

const livros = db.prepare(`
  SELECT id, titulo, capa_url, fonte_id, fonte_id_externo
  FROM livros
  ORDER BY id ASC
`).all();

console.log(`Total de livros analisados no banco: ${livros.length}\n`);

let locaisCorretos = 0;
let locaisExtensaoDivergente = [];
let locaisNaoEncontrados = [];
let capasRemotas = 0;
let capasNulas = 0;

for (const l of livros) {
  if (!l.capa_url) {
    capasNulas++;
    continue;
  }

  if (l.capa_url.startsWith('http://') || l.capa_url.startsWith('https://')) {
    capasRemotas++;
    continue;
  }

  if (l.capa_url.startsWith('/capas/')) {
    const nomeArquivo = path.basename(l.capa_url);
    if (arquivosFisicos.has(nomeArquivo)) {
      locaisCorretos++;
    } else {
      // Verificar se existe o mesmo arquivo com outra extensão (.jpg, .png, .svg)
      const nomeBase = path.parse(nomeArquivo).name;
      const extensoesPossiveis = ['.jpg', '.png', '.jpeg', '.svg', '.webp'];
      let encontradoComOutraExtensao = null;

      for (const ext of extensoesPossiveis) {
        if (arquivosFisicos.has(nomeBase + ext)) {
          encontradoComOutraExtensao = nomeBase + ext;
          break;
        }
      }

      if (encontradoComOutraExtensao) {
        locaisExtensaoDivergente.push({
          id: l.id,
          titulo: l.titulo,
          cadastrado: l.capa_url,
          sugerido: `/capas/${encontradoComOutraExtensao}`
        });
      } else {
        locaisNaoEncontrados.push({
          id: l.id,
          titulo: l.titulo,
          cadastrado: l.capa_url
        });
      }
    }
  }
}

console.log(`-----------------------------------------------`);
console.log(`📊 RESULTADO DA AUDITORIA:`);
console.log(`   ✅ Capas locais 100% corretas no disco: ${locaisCorretos}`);
console.log(`   🌐 Capas com URLs remotas válidas: ${capasRemotas}`);
console.log(`   ⚠️ Capas com EXTENSÃO DIVERGENTE (.svg vs .jpg/.png): ${locaisExtensaoDivergente.length}`);
console.log(`   ❌ Capas locais com arquivo inexistente: ${locaisNaoEncontrados.length}`);
console.log(`   ⚪ Livros sem capa informada (NULL): ${capasNulas}`);
console.log(`-----------------------------------------------\n`);

if (locaisExtensaoDivergente.length > 0) {
  console.log(`⚠️ DETALHE DAS CAPAS COM EXTENSÃO DIVERGENTE (${locaisExtensaoDivergente.length} livros):`);
  for (const item of locaisExtensaoDivergente) {
    console.log(`   [ID ${item.id}] "${item.titulo}"`);
    console.log(`      Banco atual: ${item.cadastrado}`);
    console.log(`      Arquivo real em disco: ${item.sugerido}\n`);
  }

  // Gerar SQL de correção
  let sqlFix = '-- Correção automática de extensões de capa para D1 e SQLite\n';
  for (const item of locaisExtensaoDivergente) {
    sqlFix += `UPDATE livros SET capa_url = '${item.sugerido}' WHERE id = ${item.id} AND capa_url = '${item.cadastrado}';\n`;
  }
  const fixFile = path.join(__dirname, '../fix_capas.sql');
  fs.writeFileSync(fixFile, sqlFix, 'utf8');
  console.log(`💾 Script de correção SQL gerado em: ${fixFile}`);
}

if (locaisNaoEncontrados.length > 0) {
  console.log(`❌ CAPAS LOCAIS NÃO ENCONTRADAS:`);
  console.log(JSON.stringify(locaisNaoEncontrados, null, 2));
}
