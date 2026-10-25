-- ============================================================
-- Migração 0008: corrigir capas do ranking mundial
-- ============================================================
-- Contexto: 40 obras do ranking mundial (world-hist-* e
-- world-top100-*) partilhavam a mesma capa placeholder
-- (Open Library cover ID 8232000), que corresponde à edição
-- polaca de "The Book of Three" de Lloyd Alexander. A capa
-- não correspondia ao conteúdo das obras.
--
-- Esta migração substitui apenas capa_url; não altera links,
-- licenças, títulos ou qualquer outro metadado. Os novos IDs
-- foram validados contra a API de capas da Open Library
-- (HTTP 200, content-type image/jpeg).
-- ============================================================

UPDATE livros
SET capa_url = CASE fonte_id_externo
    WHEN 'world-hist-4' THEN 'https://covers.openlibrary.org/b/id/15047576-L.jpg'
    WHEN 'world-hist-5' THEN 'https://covers.openlibrary.org/b/id/12779381-L.jpg'
    WHEN 'world-top100-3' THEN 'https://covers.openlibrary.org/b/id/15024346-L.jpg'
    WHEN 'world-top100-6' THEN 'https://covers.openlibrary.org/b/id/11172296-L.jpg'
    WHEN 'world-top100-11' THEN 'https://covers.openlibrary.org/b/id/8441376-L.jpg'
    WHEN 'world-top100-17' THEN 'https://covers.openlibrary.org/b/id/490280-L.jpg'
    WHEN 'world-top100-21' THEN 'https://covers.openlibrary.org/b/id/6924878-L.jpg'
    WHEN 'world-top100-25' THEN 'https://covers.openlibrary.org/b/id/271801-L.jpg'
    WHEN 'world-top100-26' THEN 'https://covers.openlibrary.org/b/id/6450196-L.jpg'
    WHEN 'world-top100-27' THEN 'https://covers.openlibrary.org/b/id/846825-L.jpg'
    WHEN 'world-top100-29' THEN 'https://covers.openlibrary.org/b/id/12961708-L.jpg'
    WHEN 'world-top100-33' THEN 'https://covers.openlibrary.org/b/id/6573238-L.jpg'
    WHEN 'world-top100-36' THEN 'https://covers.openlibrary.org/b/id/14598487-L.jpg'
    WHEN 'world-top100-40' THEN 'https://covers.openlibrary.org/b/id/706712-L.jpg'
    WHEN 'world-top100-41' THEN 'https://covers.openlibrary.org/b/id/296653-L.jpg'
    WHEN 'world-top100-42' THEN 'https://covers.openlibrary.org/b/id/9353109-L.jpg'
    WHEN 'world-top100-46' THEN 'https://covers.openlibrary.org/b/id/9541476-L.jpg'
    WHEN 'world-top100-47' THEN 'https://covers.openlibrary.org/b/id/8293225-L.jpg'
    WHEN 'world-top100-48' THEN 'https://covers.openlibrary.org/b/id/11279169-L.jpg'
    WHEN 'world-top100-50' THEN 'https://covers.openlibrary.org/b/id/568844-L.jpg'
    WHEN 'world-top100-53' THEN 'https://covers.openlibrary.org/b/id/8767961-L.jpg'
    WHEN 'world-top100-54' THEN 'https://covers.openlibrary.org/b/id/6558221-L.jpg'
    WHEN 'world-top100-58' THEN 'https://covers.openlibrary.org/b/id/8252454-L.jpg'
    WHEN 'world-top100-60' THEN 'https://covers.openlibrary.org/b/id/698900-L.jpg'
    WHEN 'world-top100-64' THEN 'https://covers.openlibrary.org/b/id/6617761-L.jpg'
    WHEN 'world-top100-67' THEN 'https://covers.openlibrary.org/b/id/1043590-L.jpg'
    WHEN 'world-top100-69' THEN 'https://covers.openlibrary.org/b/id/6508657-L.jpg'
    WHEN 'world-top100-74' THEN 'https://covers.openlibrary.org/b/id/10620807-L.jpg'
    WHEN 'world-top100-76' THEN 'https://covers.openlibrary.org/b/id/5004689-L.jpg'
    WHEN 'world-top100-80' THEN 'https://covers.openlibrary.org/b/id/4807684-L.jpg'
    WHEN 'world-top100-82' THEN 'https://covers.openlibrary.org/b/id/6880996-L.jpg'
    WHEN 'world-top100-84' THEN 'https://covers.openlibrary.org/b/id/7278994-L.jpg'
    WHEN 'world-top100-86' THEN 'https://covers.openlibrary.org/b/id/772161-L.jpg'
    WHEN 'world-top100-87' THEN 'https://covers.openlibrary.org/b/id/915193-L.jpg'
    WHEN 'world-top100-88' THEN 'https://covers.openlibrary.org/b/id/693116-L.jpg'
    WHEN 'world-top100-90' THEN 'https://covers.openlibrary.org/b/id/5944471-L.jpg'
    WHEN 'world-top100-92' THEN 'https://covers.openlibrary.org/b/id/1019938-L.jpg'
    WHEN 'world-top100-94' THEN 'https://covers.openlibrary.org/b/id/50842-L.jpg'
    WHEN 'world-top100-95' THEN 'https://covers.openlibrary.org/b/id/14570213-L.jpg'
    WHEN 'world-top100-99' THEN 'https://covers.openlibrary.org/b/id/15023229-L.jpg'
    ELSE capa_url
  END
WHERE fonte_id_externo IN (
    'world-hist-4',
    'world-hist-5',
    'world-top100-3',
    'world-top100-6',
    'world-top100-11',
    'world-top100-17',
    'world-top100-21',
    'world-top100-25',
    'world-top100-26',
    'world-top100-27',
    'world-top100-29',
    'world-top100-33',
    'world-top100-36',
    'world-top100-40',
    'world-top100-41',
    'world-top100-42',
    'world-top100-46',
    'world-top100-47',
    'world-top100-48',
    'world-top100-50',
    'world-top100-53',
    'world-top100-54',
    'world-top100-58',
    'world-top100-60',
    'world-top100-64',
    'world-top100-67',
    'world-top100-69',
    'world-top100-74',
    'world-top100-76',
    'world-top100-80',
    'world-top100-82',
    'world-top100-84',
    'world-top100-86',
    'world-top100-87',
    'world-top100-88',
    'world-top100-90',
    'world-top100-92',
    'world-top100-94',
    'world-top100-95',
    'world-top100-99'
  );
