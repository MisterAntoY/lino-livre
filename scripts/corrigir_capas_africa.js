const fs = require('node:fs');
const path = require('node:path');

const capasDir = path.join(__dirname, '../public/capas');
const arquivosFisicos = fs.readdirSync(capasDir);

const mapaArquivos = new Map();
for (const f of arquivosFisicos) {
  const base = path.parse(f).name; // ex: 'africa_pt_sangue_negro'
  mapaArquivos.set(base, f);        // ex: 'africa_pt_sangue_negro.png'
}

let sql = '-- Atualização de URLs de capa para extensões reais (.jpg e .png)\n';

for (const [base, arquivoReal] of mapaArquivos.entries()) {
  if (base.startsWith('africa_')) {
    const urlAntigaSvg = `/capas/${base}.svg`;
    const urlReal = `/capas/${arquivoReal}`;
    sql += `UPDATE livros SET capa_url = '${urlReal}' WHERE capa_url = '${urlAntigaSvg}';\n`;
  }
}

const sqlDir = path.join(__dirname, 'sql');
if (!fs.existsSync(sqlDir)) fs.mkdirSync(sqlDir, { recursive: true });
const outputPath = path.join(sqlDir, 'atualizar_capas_africa.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Gerado scripts/sql/atualizar_capas_africa.sql com ${mapaArquivos.size} verificações.`);
