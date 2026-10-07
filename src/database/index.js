const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

let instance = null;

function initDatabase(dbPath = null) {
  const targetPath = dbPath || path.join(__dirname, '../../biblioteca.db');
  const db = new DatabaseSync(targetPath);

  // Ativar verificação de chaves estrangeiras
  db.exec('PRAGMA foreign_keys = ON;');

  // Migração defensiva: se houver tabela 'livros' antiga sem a coluna 'formato', resetar estrutura
  try {
    const colunas = db.prepare("PRAGMA table_info(livros)").all();
    if (colunas.length > 0 && !colunas.some(c => c.name === 'formato')) {
      db.exec(`
        DROP TABLE IF EXISTS emprestimos;
        DROP TABLE IF EXISTS acessos_digitais;
        DROP TABLE IF EXISTS livros;
      `);
    }
  } catch (_) {}

  // Carregar e executar o esquema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);

  return db;
}

function getDatabase(dbPath = null) {
  if (dbPath) {
    return initDatabase(dbPath);
  }
  if (!instance) {
    instance = initDatabase();
  }
  return instance;
}

module.exports = {
  getDatabase,
  initDatabase
};
