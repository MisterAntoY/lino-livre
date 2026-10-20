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

-- Sementes conhecidas. O cron substitui pelos valores exatos.
INSERT INTO estatisticas (chave, valor) VALUES
  ('total_livros', 104848),
  ('total_autores', 37919),
  ('total_categorias', 29),
  ('total_cursos', 7501),
  ('total_fontes', 32),
  ('total_leituras', 0)
ON CONFLICT(chave) DO NOTHING;
