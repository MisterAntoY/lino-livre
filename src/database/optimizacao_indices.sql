-- Lino Livre — Otimizações de acesso ao acervo (idempotente)
-- Aplicar em bancos já existentes (SQLite local e Cloudflare D1):
--   sqlite3 biblioteca.db < src/database/optimizacao_indices.sql
--   npx wrangler d1 execute lino-livre-db --remote --file=src/database/optimizacao_indices.sql -y
--
-- Objetivo: eliminar full scan + sort na listagem de livros (104k+ registos),
-- suportar os filtros mais usados (idioma, fonte, categoria, autor, licença)
-- e acelerar a deduplicação de cursos por URL.

-- Ordenação padrão da API: ORDER BY leituras DESC, titulo ASC
CREATE INDEX IF NOT EXISTS idx_livros_popularidade
  ON livros(leituras DESC, titulo ASC);

-- Filtros combinados com a ordenação padrão
CREATE INDEX IF NOT EXISTS idx_livros_idioma_popularidade
  ON livros(idioma, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_fonte_popularidade
  ON livros(fonte_id, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_categoria_popularidade
  ON livros(categoria_id, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_autor_popularidade
  ON livros(autor_id, leituras DESC, titulo ASC);
CREATE INDEX IF NOT EXISTS idx_livros_licenca_popularidade
  ON livros(licenca, leituras DESC, titulo ASC);

-- Filtro por formato (subquery em links_livros)
CREATE INDEX IF NOT EXISTS idx_links_formato_livro
  ON links_livros(formato, livro_id);

-- Deduplicação idempotente de cursos (INSERT ... WHERE NOT EXISTS url = ?)
CREATE INDEX IF NOT EXISTS idx_cursos_url ON cursos(url);
