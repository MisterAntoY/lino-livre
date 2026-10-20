-- ============================================================
-- Índices de performance e contagens pré-computadas por autor
-- ============================================================
-- Problema: as rotas de leitura ordenam por popularidade
-- (ORDER BY leituras DESC, titulo ASC) e filtram por idioma/fonte/
-- categoria/autor/licença sobre 104.848 livros. Sem índice composto,
-- cada cache miss varre e ordena a tabela inteira (~104.848 linhas
-- lidas por pedido — foi o que esgotou a cota diária da D1: 15,6 M
-- linhas lidas em 24 h com apenas 124 pedidos).
--
-- Os índices abaixo já existiam no banco local de desenvolvimento
-- (src/database/optimizacao_indices.sql) mas nunca foram levados às
-- migrações do D1 — por isso a base remota operava sem eles.
--
-- Nota: a criação de índices é uma escrita na D1, mas não consome
-- a cota de "linhas lidas" (que é o limite esgotado, erro 7500).
-- ============================================================

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

-- Listagem de autores por nome (evita ordenar 37.919 linhas)
CREATE INDEX IF NOT EXISTS idx_autores_nome
  ON autores(nome);

-- Busca exacta de autor por nome (independente da maiúscula/minúscula):
-- o índice binário acima não serve para `nome = ? COLLATE NOCASE`.
CREATE INDEX IF NOT EXISTS idx_autores_nome_nocase
  ON autores(nome COLLATE NOCASE);

-- Deduplicação idempotente de cursos (INSERT ... WHERE NOT EXISTS url = ?)
CREATE INDEX IF NOT EXISTS idx_cursos_url
  ON cursos(url);

-- ============================================================
-- Contagem de livros por autor, pré-computada
-- ============================================================
-- /api/autores fazia `LEFT JOIN livros GROUP BY a.id` para contar os
-- livros de cada autor: uma varredura dos 104.848 livros por pedido
-- (o maior ofensor depois do dashboard). A tabela abaixo é recalculada
-- 1x/dia pelo cron do Worker (00:10 UTC) e consultada por índice.
--
-- A tabela é criada aqui mas deixada vazia de propósito: semear 37.919
-- linhas numa migração gastaria quase 40% da cota diária de escritas
-- (100.000/dia no plano gratuito). Quem a popula é o cron, que já faz
-- uma única varredura agrupada por dia. Até o primeiro cron, /api/autores
-- conta apenas os autores devolvidos (índice por autor_id), o que
-- também é barato.
CREATE TABLE IF NOT EXISTS autor_totais (
  autor_id INTEGER PRIMARY KEY,
  total    INTEGER NOT NULL DEFAULT 0
);
