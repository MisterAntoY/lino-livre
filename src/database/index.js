const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

// Carregar variáveis de ambiente do .env se existir
try {
  const envPath = path.join(__dirname, '../../.env');
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
  }
} catch (_) {}

let instance = null;

function initDatabase(dbPath = null, setAsInstance = true) {
  const targetPath = dbPath || process.env.DATABASE_PATH || path.join(__dirname, '../../biblioteca.db');
  const db = new DatabaseSync(targetPath);

  // Ativar verificação de chaves estrangeiras e resiliência a concorrência
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');

  // Migração defensiva: se houver tabela 'livros' antiga sem a coluna 'licenca', resetar
  try {
    const colunas = db.prepare("PRAGMA table_info(livros)").all();
    if (colunas.length > 0 && !colunas.some(c => c.name === 'licenca')) {
      db.exec(`
        DROP TABLE IF EXISTS links_livros;
        DROP TABLE IF EXISTS import_jobs;
        DROP TABLE IF EXISTS cursos;
        DROP TABLE IF EXISTS livros_fts;
        DROP TABLE IF EXISTS livros;
        DROP TABLE IF EXISTS fontes;
      `);
    }
  } catch (_) {}

  // Carregar e executar o esquema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);

  if (setAsInstance) {
    instance = db;
  }
  return db;
}

function closeDatabase() {
  if (instance) {
    try { instance.close(); } catch (_) {}
    instance = null;
  }
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
  initDatabase,
  closeDatabase
};
