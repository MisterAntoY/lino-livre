-- Migração 0002: Tabelas de Podcasts e Episódios (Integração Spotify)
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
