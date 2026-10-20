-- Esquema do Banco de Dados — Lino Livre (Biblioteca Digital)

CREATE TABLE IF NOT EXISTS fontes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,        -- gutenberg | openlibrary | dominiopublico | wikisource | manual
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('api','opds','rss','csv','scraping','manual')),
    url_base TEXT,
    ativa INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS autores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    nacionalidade TEXT,
    biografia TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    subtitulo TEXT,
    isbn TEXT,
    ano_publicacao INTEGER,
    idioma TEXT DEFAULT 'pt',
    sinopse TEXT,
    capa_url TEXT,
    paginas INTEGER,
    autor_id INTEGER REFERENCES autores(id) ON DELETE SET NULL,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    fonte_id INTEGER REFERENCES fontes(id) ON DELETE SET NULL,
    fonte_id_externo TEXT,
    licenca TEXT NOT NULL CHECK (licenca IN ('dominio-publico','cc0','cc-by','cc-by-sa','cc-by-nc','outro')),
    leituras INTEGER NOT NULL DEFAULT 0,
    conteudo_texto TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (fonte_id, fonte_id_externo)
);

CREATE TABLE IF NOT EXISTS links_livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    livro_id INTEGER NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
    formato TEXT NOT NULL CHECK (formato IN ('epub','pdf','txt','html','audiobook')),
    url TEXT NOT NULL,
    tamanho_bytes INTEGER,
    link_externo INTEGER NOT NULL DEFAULT 1,
    UNIQUE (livro_id, formato)
);

CREATE TABLE IF NOT EXISTS import_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fonte_id INTEGER NOT NULL REFERENCES fontes(id),
    query TEXT,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','em_curso','concluido','erro')),
    total INTEGER DEFAULT 0,
    processados INTEGER DEFAULT 0,
    erro TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    tipo TEXT DEFAULT 'curso',
    area TEXT NOT NULL,
    plataforma TEXT NOT NULL,
    url TEXT NOT NULL,
    licenca TEXT DEFAULT 'gratuito',
    nivel TEXT DEFAULT 'Iniciante',
    descricao TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Virtual FTS5 para busca textual ultra-rápida
CREATE VIRTUAL TABLE IF NOT EXISTS livros_fts USING fts5(
    titulo,
    autor_nome,
    sinopse,
    content='livros',
    content_rowid='id'
);

-- Triggers para sincronização do FTS5
CREATE TRIGGER IF NOT EXISTS livros_ai AFTER INSERT ON livros BEGIN
  INSERT INTO livros_fts(rowid, titulo, autor_nome, sinopse)
  VALUES (new.id, new.titulo, (SELECT nome FROM autores WHERE id = new.autor_id), new.sinopse);
END;

CREATE TRIGGER IF NOT EXISTS livros_ad AFTER DELETE ON livros BEGIN
  INSERT INTO livros_fts(livros_fts, rowid, titulo, autor_nome, sinopse)
  VALUES ('delete', old.id, old.titulo, (SELECT nome FROM autores WHERE id = old.autor_id), old.sinopse);
END;

CREATE TRIGGER IF NOT EXISTS livros_au AFTER UPDATE ON livros BEGIN
  INSERT INTO livros_fts(livros_fts, rowid, titulo, autor_nome, sinopse)
  VALUES ('delete', old.id, old.titulo, (SELECT nome FROM autores WHERE id = old.autor_id), old.sinopse);
  INSERT INTO livros_fts(rowid, titulo, autor_nome, sinopse)
  VALUES (new.id, new.titulo, (SELECT nome FROM autores WHERE id = new.autor_id), new.sinopse);
END;

-- Índices relacionais
CREATE INDEX IF NOT EXISTS idx_livros_autor ON livros(autor_id);
CREATE INDEX IF NOT EXISTS idx_livros_categoria ON livros(categoria_id);
CREATE INDEX IF NOT EXISTS idx_livros_fonte ON livros(fonte_id);
CREATE INDEX IF NOT EXISTS idx_livros_idioma ON livros(idioma);
CREATE INDEX IF NOT EXISTS idx_livros_licenca ON livros(licenca);
CREATE INDEX IF NOT EXISTS idx_links_livro ON links_livros(livro_id);
CREATE INDEX IF NOT EXISTS idx_cursos_area ON cursos(area);
CREATE INDEX IF NOT EXISTS idx_cursos_plataforma ON cursos(plataforma);
CREATE INDEX IF NOT EXISTS idx_cursos_tipo ON cursos(tipo);
CREATE INDEX IF NOT EXISTS idx_fontes_slug ON fontes(slug);
CREATE INDEX IF NOT EXISTS idx_autores_nome ON autores(nome);

-- Índices de performance para o acesso ao acervo (listagem, ordenação e filtros)
-- Cobrem o ORDER BY leituras DESC, titulo ASC usado na API e evitam full scan + sort.
CREATE INDEX IF NOT EXISTS idx_livros_popularidade ON livros(leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_idioma_popularidade ON livros(idioma, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_fonte_popularidade ON livros(fonte_id, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_categoria_popularidade ON livros(categoria_id, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_autor_popularidade ON livros(autor_id, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_licenca_popularidade ON livros(licenca, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_links_formato_livro ON links_livros(formato, livro_id);
CREATE INDEX IF NOT EXISTS idx_cursos_url ON cursos(url);
-- Busca exacta de autor (independente de maiúsculas/minúsculas)
CREATE INDEX IF NOT EXISTS idx_autores_nome_nocase ON autores(nome COLLATE NOCASE);

-- Contagem de livros por autor, pré-computada (cron diário do Worker).
-- Evita o LEFT JOIN sobre a tabela de livros em /api/autores.
CREATE TABLE IF NOT EXISTS autor_totais (
  autor_id INTEGER PRIMARY KEY,
  total    INTEGER NOT NULL DEFAULT 0
);

-- Módulo de Podcasts & Audiolivros (Spotify for Creators)
CREATE TABLE IF NOT EXISTS podcasts_shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descricao TEXT,
    capa_url TEXT,
    spotify_url TEXT,
    spotify_uri TEXT,
    categoria TEXT DEFAULT 'Educação & Literatura',
    idioma TEXT DEFAULT 'pt',
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS podcasts_episodios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL REFERENCES podcasts_shows(id) ON DELETE CASCADE,
    numero INTEGER,
    titulo TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descricao TEXT,
    duracao_minutos INTEGER,
    spotify_url TEXT,
    spotify_embed_url TEXT,
    audio_url TEXT,
    publicado_em DATE,
    reproducoes INTEGER NOT NULL DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_podcasts_episodios_show ON podcasts_episodios(show_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_shows_slug ON podcasts_shows(slug);


-- ============================================================
-- Agregados pré-calculados (ver migrations/0003_estatisticas.sql)
-- Recalculados 1x/dia pelo cron do Worker; evitam varreduras de
-- 104k linhas em cada cache miss das rotas de leitura.
-- ============================================================
CREATE TABLE IF NOT EXISTS estatisticas (
  chave         TEXT PRIMARY KEY,
  valor         INTEGER NOT NULL DEFAULT 0,
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contadores (
  dimensao TEXT NOT NULL,
  chave    TEXT NOT NULL,
  rotulo   TEXT,
  total    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (dimensao, chave)
);

CREATE INDEX IF NOT EXISTS idx_contadores_dimensao ON contadores(dimensao, total DESC);

-- Fila de Moderação e Sugestões da Comunidade
CREATE TABLE IF NOT EXISTS sugestoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor_nome TEXT,
    ano_publicacao INTEGER,
    categoria_id INTEGER,
    licenca TEXT DEFAULT 'outro',
    formato TEXT DEFAULT 'html',
    url_link TEXT NOT NULL,
    capa_url TEXT,
    sinopse TEXT,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sugestoes_status ON sugestoes(status);

