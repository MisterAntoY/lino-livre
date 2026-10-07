-- Esquema do Banco de Dados - Plataforma de Distribuição de Livros Digitais

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
    sinopse TEXT,
    isbn TEXT UNIQUE,
    ano_publicacao INTEGER,
    formato TEXT NOT NULL DEFAULT 'PDF' CHECK (formato IN ('PDF', 'EPUB', 'Web')),
    arquivo_url TEXT,
    capa_url TEXT,
    conteudo_texto TEXT,
    tamanho_mb REAL DEFAULT 1.5,
    downloads_count INTEGER NOT NULL DEFAULT 0,
    leituras_count INTEGER NOT NULL DEFAULT 0,
    autor_id INTEGER,
    categoria_id INTEGER,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS acessos_digitais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    livro_id INTEGER NOT NULL,
    tipo_acesso TEXT NOT NULL CHECK (tipo_acesso IN ('download', 'leitura_online')),
    aluno_nome TEXT,
    aluno_turma TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_livros_categoria ON livros(categoria_id);
CREATE INDEX IF NOT EXISTS idx_livros_autor ON livros(autor_id);
CREATE INDEX IF NOT EXISTS idx_livros_formato ON livros(formato);
CREATE INDEX IF NOT EXISTS idx_acessos_livro ON acessos_digitais(livro_id);
CREATE INDEX IF NOT EXISTS idx_acessos_tipo ON acessos_digitais(tipo_acesso);
