const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

let instance = null;

function initDatabase(dbPath = null) {
  const targetPath = dbPath || path.join(__dirname, '../../biblioteca.db');
  const db = new DatabaseSync(targetPath);

  // Ativar verificação de integridade referencial
  db.exec('PRAGMA foreign_keys = ON;');

  // Carregar e executar o esquema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);

  // Atualizar status de empréstimos vencidos automaticamente
  atualizarStatusAtrasos(db);

  return db;
}

function atualizarStatusAtrasos(db) {
  const hoje = new Date().toISOString().split('T')[0];
  const updateStmt = db.prepare(`
    UPDATE emprestimos
    SET status = 'atrasado'
    WHERE status = 'ativo' AND data_devolucao_prevista < ?
  `);
  updateStmt.run(hoje);
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
  atualizarStatusAtrasos
};
