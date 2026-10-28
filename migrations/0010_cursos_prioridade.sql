-- ============================================================
-- Coluna prioridade indexada na tabela cursos
-- ============================================================
-- Substitui a ordenação dinâmica ORDER BY CASE por ordenação indexada
-- e suporta paginação eficiente sem varreduras completas.
-- prioridade = 0 para parceiros em destaque (Guia de TI, Roadmap.sh)
-- prioridade = 1 para catálogo padrão
-- ============================================================

ALTER TABLE cursos ADD COLUMN prioridade INTEGER DEFAULT 1;

UPDATE cursos SET prioridade = 0 WHERE plataforma LIKE '%Guia de TI%';
UPDATE cursos SET prioridade = 0 WHERE tipo = 'roadmap' AND plataforma LIKE '%Roadmap.sh%';
UPDATE cursos SET prioridade = 1 WHERE tipo = 'roadmap' AND plataforma LIKE '%Trilha Info%';

CREATE INDEX IF NOT EXISTS idx_cursos_prioridade_id
  ON cursos(prioridade, id);

CREATE INDEX IF NOT EXISTS idx_cursos_tipo_prioridade_id
  ON cursos(tipo, prioridade, id);
