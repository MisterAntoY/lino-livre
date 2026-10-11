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
CREATE INDEX IF NOT EXISTS idx_links_livro ON links_livros(livro_id);
CREATE INDEX IF NOT EXISTS idx_cursos_area ON cursos(area);

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

