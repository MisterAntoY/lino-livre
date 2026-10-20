-- Migração 0004: Tabela de sugestões da comunidade (moderação) e trigger FTS para autores

-- 1. Tabela para moderação de sugestões enviadas por visitantes
CREATE TABLE IF NOT EXISTS sugestoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor_nome TEXT,
    ano_publicacao INTEGER,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    licenca TEXT DEFAULT 'outro',
    formato TEXT DEFAULT 'html',
    url_link TEXT NOT NULL,
    capa_url TEXT,
    sinopse TEXT,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
    moderado_por TEXT,
    moderado_em DATETIME,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sugestoes_status ON sugestoes(status);

-- 2. Trigger de sincronização de renomeação de autores no FTS5
CREATE TRIGGER IF NOT EXISTS autores_au AFTER UPDATE OF nome ON autores BEGIN
  UPDATE livros_fts SET autor_nome = new.nome WHERE rowid IN (SELECT id FROM livros WHERE autor_id = new.id);
END;
