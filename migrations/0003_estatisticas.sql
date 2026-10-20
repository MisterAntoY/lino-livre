-- ============================================================
-- Agregados pré-calculados para reduzir leituras na D1
--
-- Problema: COUNT(*)/GROUP BY sobre 104k livros consomem o limite
-- diário de linhas lidas do plano gratuito da D1 (5M/dia) em poucas
-- dezenas de cache misses.
--
-- Solução: estatisticas (totais) e contadores (por dimensão) são
-- recalculados 1x/dia pelo cron do Worker (00:10 UTC, logo após o
-- reset da cota). As rotas de leitura passam a ler ~300 linhas em
-- vez de ~700k por pedido.
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

CREATE INDEX IF NOT EXISTS idx_contadores_dimensao
  ON contadores(dimensao, total DESC);

-- Sementes calculadas dinamicamente com base no estado real das tabelas.
INSERT INTO estatisticas (chave, valor) VALUES
  ('total_livros', (SELECT COUNT(*) FROM livros)),
  ('total_autores', (SELECT COUNT(*) FROM autores)),
  ('total_categorias', (SELECT COUNT(*) FROM categorias)),
  ('total_cursos', (SELECT COUNT(*) FROM cursos)),
  ('total_fontes', (SELECT COUNT(*) FROM fontes WHERE ativa = 1)),
  ('total_leituras', (SELECT COALESCE(SUM(leituras), 0) FROM livros))
ON CONFLICT(chave) DO NOTHING;
