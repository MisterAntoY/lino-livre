const fs = require('fs');
const path = require('path');
const { getDatabase } = require('../src/database/index');

const db = getDatabase();
const books = db.prepare('SELECT titulo, capa_url FROM livros').all();
const coverMap = new Map();
books.forEach(b => {
  coverMap.set(b.titulo.trim().toLowerCase(), b.capa_url);
});

console.log(`Carregadas ${coverMap.size} capas verificadas do banco de dados.`);

const files = [
  'romanceClassicsSeedData.js',
  'githubDeBooksSeedData.js',
  'githubFrBooksSeedData.js',
  'githubZhBooksSeedData.js',
  'githubEnBooksSeedData.js',
  'filosofiaSeedData.js',
  'literaturaAlemaSeedData.js'
];

files.forEach(fileName => {
  const filePath = path.join(__dirname, '../src/database', fileName);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let updatedCount = 0;

  // Substituir capaUrl para cada objeto no array
  // Padrão: "titulo": "...", seguido em algum lugar antes do próximo objeto de "capaUrl": "..."
  const regex = /"titulo":\s*"([^"]+)"[\s\S]*?"capaUrl":\s*"([^"]+)"/g;

  content = content.replace(regex, (match, titulo, oldCapa) => {
    const key = titulo.trim().toLowerCase();
    const newCapa = coverMap.get(key);
    if (newCapa && newCapa !== oldCapa) {
      updatedCount++;
      return match.replace(`"capaUrl": "${oldCapa}"`, `"capaUrl": "${newCapa}"`);
    }
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Arquivo ${fileName}: ${updatedCount} capas sincronizadas.`);
});

console.log('Sincronização dos arquivos de seed concluída com sucesso!');
