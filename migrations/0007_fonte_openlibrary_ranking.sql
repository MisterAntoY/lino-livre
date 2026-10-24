-- ============================================================
-- Migração 0007: atribuição correta da fonte Open Library
-- ============================================================
-- Contexto: o seed mapeava a fonte lógica "openlibrary" para o fallback
-- Project Gutenberg porque a chave não existia em fonteMap. Assim, 76
-- obras do ranking mundial apareciam no catálogo como "Project Gutenberg"
-- apesar de os seus links apontarem para openlibrary.org.
--
-- Esta migração corrige apenas a atribuição da fonte; não altera links,
-- licenças, títulos ou qualquer outro metadado.
-- ============================================================

UPDATE livros
SET fonte_id = COALESCE(
  (SELECT id FROM fontes WHERE slug = 'openlibrary'),
  fonte_id
)
WHERE fonte_id_externo IN (
    'world-hist-4',
    'world-hist-5',
    'world-top100-2',
    'world-top100-3',
    'world-top100-4',
    'world-top100-5',
    'world-top100-6',
    'world-top100-8',
    'world-top100-11',
    'world-top100-12',
    'world-top100-13',
    'world-top100-15',
    'world-top100-16',
    'world-top100-17',
    'world-top100-18',
    'world-top100-19',
    'world-top100-21',
    'world-top100-24',
    'world-top100-25',
    'world-top100-26',
    'world-top100-27',
    'world-top100-28',
    'world-top100-29',
    'world-top100-30',
    'world-top100-32',
    'world-top100-33',
    'world-top100-35',
    'world-top100-36',
    'world-top100-37',
    'world-top100-38',
    'world-top100-39',
    'world-top100-41',
    'world-top100-45',
    'world-top100-46',
    'world-top100-47',
    'world-top100-48',
    'world-top100-49',
    'world-top100-50',
    'world-top100-52',
    'world-top100-53',
    'world-top100-54',
    'world-top100-55',
    'world-top100-56',
    'world-top100-57',
    'world-top100-58',
    'world-top100-61',
    'world-top100-62',
    'world-top100-64',
    'world-top100-66',
    'world-top100-67',
    'world-top100-68',
    'world-top100-70',
    'world-top100-71',
    'world-top100-72',
    'world-top100-73',
    'world-top100-75',
    'world-top100-76',
    'world-top100-77',
    'world-top100-78',
    'world-top100-79',
    'world-top100-81',
    'world-top100-82',
    'world-top100-83',
    'world-top100-84',
    'world-top100-85',
    'world-top100-86',
    'world-top100-87',
    'world-top100-88',
    'world-top100-90',
    'world-top100-92',
    'world-top100-94',
    'world-top100-95',
    'world-top100-96',
    'world-top100-97',
    'world-top100-98',
    'world-top100-99'
  )
  AND fonte_id <> COALESCE(
    (SELECT id FROM fontes WHERE slug = 'openlibrary'),
    fonte_id
  );
