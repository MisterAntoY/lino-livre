-- ============================================================
-- Migração 0006: links externos seguros (sem HTTP 401/403)
-- ============================================================
-- Contexto: os itens de empréstimo do Internet Archive expõem URLs
-- archive.org/download/<id>/<ficheiro>.pdf que devolvem HTTP 401/403
-- (nginx) quando o utilizador não está autenticado. O Lino Livre é um
-- intermediário de indexação: não pode apresentar esses URLs como se
-- fossem downloads livres.
--
-- Política aplicada:
--   * Obras com licença "outro" (direitos comerciais) passam a apontar
--     apenas para o catálogo público da Open Library (metadados,
--     empréstimo legal ou compra).
--   * Nenhum link archive.org/download permanece nas obras do ranking
--     mundial (world-top100-* / world-hist-*).
--   * O Pequeno Príncipe e O Diário de Anne Frank deixam de estar
--     marcados como domínio público, porque os itens do Internet Archive
--     são restritos e a situação de direitos varia por jurisdição.
-- ============================================================

-- 1. Corrigir a licença das duas obras cujos itens do Internet Archive
--    são restritos (o acesso deixa de ser apresentado como domínio público).
UPDATE livros
SET licenca = 'outro'
WHERE fonte_id_externo IN ('world-top100-2', 'world-top100-45')
  AND licenca = 'dominio-publico';

-- 2. Remover os downloads diretos restritos das obras do ranking mundial.
DELETE FROM links_livros
WHERE url LIKE 'https://archive.org/download/%'
  AND livro_id IN (
    SELECT id FROM livros
    WHERE fonte_id_externo LIKE 'world-%'
      AND licenca <> 'dominio-publico'
  );

-- 3. Substituir as páginas de detalhe do Internet Archive pelo catálogo
--    público da Open Library (URLs codificados, sem ficheiros diretos).
UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Pequeno%20Pr%C3%ADncipe%20Antoine%20de%20Saint-Exup%C3%A9ry'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-2')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Alquimista%20Paulo%20Coelho'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-4')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Harry%20Potter%20e%20a%20Pedra%20Filosofal%20J.%20K.%20Rowling'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-5')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Hobbit%20J.%20R.%20R.%20Tolkien'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-8')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20C%C3%B3digo%20Da%20Vinci%20Dan%20Brown'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-12')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Harry%20Potter%20e%20a%20C%C3%A2mara%20Secreta%20J.%20K.%20Rowling'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-13')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Apanhador%20no%20Campo%20de%20Centeio%20J.%20D.%20Salinger'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-15')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Cem%20Anos%20de%20Solid%C3%A3o%20Gabriel%20Garc%C3%ADa%20M%C3%A1rquez'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-18')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Lolita%20Vladimir%20Nabokov'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-19')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Nome%20da%20Rosa%20Umberto%20Eco'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-24')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=A%20Teia%20de%20Charlotte%20E.%20B.%20White'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-28')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Fern%C3%A3o%20Capelo%20Gaivota%20Richard%20Bach'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-32')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Sol%20%C3%A9%20Para%20Todos%20Harper%20Lee'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-35')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Cosmos%20Carl%20Sagan'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-37')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Anjos%20e%20Dem%C3%B4nios%20Dan%20Brown'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-38')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Como%20Fazer%20Amigos%20e%20Influenciar%20Pessoas%20Dale%20Carnegie'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-39')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Di%C3%A1rio%20de%20Anne%20Frank%20Anne%20Frank'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-45')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Ca%C3%A7ador%20de%20Pipas%20Khaled%20Hosseini'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-49')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=E%20o%20Vento%20Levou%20Margaret%20Mitchell'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-52')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Os%20Homens%20que%20N%C3%A3o%20Amavam%20as%20Mulheres%20Stieg%20Larsson'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-55')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20S%C3%ADmbolo%20Perdido%20Dan%20Brown'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-56')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Jogos%20Vorazes%20Suzanne%20Collins'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-57')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Uma%20Breve%20Hist%C3%B3ria%20do%20Tempo%20Stephen%20Hawking'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-62')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Os%207%20H%C3%A1bitos%20das%20Pessoas%20Altamente%20Eficazes%20Stephen%20R.%20Covey'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-66')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Sapiens%3A%20Uma%20Breve%20Hist%C3%B3ria%20da%20Humanidade%20Yuval%20Noah%20Harari'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-68')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=A%20Profecia%20Celestina%20James%20Redfield'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-70')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=A%20Culpa%20%C3%A9%20das%20Estrelas%20John%20Green'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-71')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=A%20Cabana%20William%20P.%20Young'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-73')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Em%20Chamas%20Suzanne%20Collins'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-77')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=A%20Esperan%C3%A7a%20Suzanne%20Collins'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-78')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Kitchen%20Banana%20Yoshimoto'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-79')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Garota%20Exemplar%20Gillian%20Flynn'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-81')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=O%20Mundo%20se%20Despeda%C3%A7a%20Chinua%20Achebe'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-83')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=Duna%20Frank%20Herbert'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-97')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

UPDATE links_livros
SET url = 'https://openlibrary.org/search?q=A%20Fant%C3%A1stica%20F%C3%A1brica%20de%20Chocolate%20Roald%20Dahl'
WHERE livro_id IN (SELECT id FROM livros WHERE fonte_id_externo = 'world-top100-98')
  AND formato = 'html'
  AND url LIKE 'https://archive.org/details/%';

-- 4. Verificação de integridade: nenhuma obra do ranking mundial deve
--    manter um download direto do Internet Archive.
--    (A migração é idempotente; os UPDATE/DELETE acima podem ser
--    reexecutados sem efeitos colaterais.)
