-- ============================================================
-- Migração 0009: Corrigir capas divergentes do ranking mundial
-- ============================================================
-- Corrige as 16 obras cujas capas apontavam para IDs incorretos
-- ou títulos divergentes no Gutenberg e Open Library:
--
-- 1.  world-top100-3   -> The Lord of the Rings (J.R.R. Tolkien) #14625765
-- 2.  world-top100-14  -> Think and Grow Rich (Napoleon Hill) #14542536
-- 3.  world-top100-27  -> The Hite Report (Shere Hite) #4615281
-- 4.  world-top100-30  -> The Purpose-Driven Life (Rick Warren) #5057338
-- 5.  world-top100-33  -> The Very Hungry Caterpillar (Eric Carle) #7835968
-- 6.  world-top100-34  -> A Message to Garcia (Elbert Hubbard) #779431
-- 7.  world-top100-41  -> Fear of Flying (Erica Jong) #46711
-- 8.  world-top100-46  -> Your Erroneous Zones (Wayne Dyer) #5266788
-- 9.  world-top100-53  -> Rebecca (Daphne du Maurier) #8238729
-- 10. world-top100-59  -> Ben-Hur (Lew Wallace) #13829487
-- 11. world-top100-63  -> Paul et Virginie (Bernardin de Saint-Pierre) #8243325
-- 12. world-top100-87  -> The Women's Room (Marilyn French) #2405877
-- 13. world-top100-93  -> Osudy dobrého vojáka Švejka (Jaroslav Hašek) #9314448
-- 14. world-top100-95  -> The Power of Positive Thinking (Norman Vincent Peale) #14570194
-- 15. world-top100-99  -> The Naked Ape (Desmond Morris) #12887819
-- 16. world-top100-100 -> Kokoro (Natsume Soseki) #3970410
-- ============================================================

UPDATE livros
SET capa_url = CASE fonte_id_externo
    WHEN 'world-top100-3'   THEN 'https://covers.openlibrary.org/b/id/14625765-L.jpg'
    WHEN 'world-top100-14'  THEN 'https://covers.openlibrary.org/b/id/14542536-L.jpg'
    WHEN 'world-top100-27'  THEN 'https://covers.openlibrary.org/b/id/4615281-L.jpg'
    WHEN 'world-top100-30'  THEN 'https://covers.openlibrary.org/b/id/5057338-L.jpg'
    WHEN 'world-top100-33'  THEN 'https://covers.openlibrary.org/b/id/7835968-L.jpg'
    WHEN 'world-top100-34'  THEN 'https://covers.openlibrary.org/b/id/779431-L.jpg'
    WHEN 'world-top100-41'  THEN 'https://covers.openlibrary.org/b/id/46711-L.jpg'
    WHEN 'world-top100-46'  THEN 'https://covers.openlibrary.org/b/id/5266788-L.jpg'
    WHEN 'world-top100-53'  THEN 'https://covers.openlibrary.org/b/id/8238729-L.jpg'
    WHEN 'world-top100-59'  THEN 'https://covers.openlibrary.org/b/id/13829487-L.jpg'
    WHEN 'world-top100-63'  THEN 'https://covers.openlibrary.org/b/id/8243325-L.jpg'
    WHEN 'world-top100-87'  THEN 'https://covers.openlibrary.org/b/id/2405877-L.jpg'
    WHEN 'world-top100-93'  THEN 'https://covers.openlibrary.org/b/id/9314448-L.jpg'
    WHEN 'world-top100-95'  THEN 'https://covers.openlibrary.org/b/id/14570194-L.jpg'
    WHEN 'world-top100-99'  THEN 'https://covers.openlibrary.org/b/id/12887819-L.jpg'
    WHEN 'world-top100-100' THEN 'https://covers.openlibrary.org/b/id/3970410-L.jpg'
    ELSE capa_url
  END
WHERE fonte_id_externo IN (
    'world-top100-3',
    'world-top100-14',
    'world-top100-27',
    'world-top100-30',
    'world-top100-33',
    'world-top100-34',
    'world-top100-41',
    'world-top100-46',
    'world-top100-53',
    'world-top100-59',
    'world-top100-63',
    'world-top100-87',
    'world-top100-93',
    'world-top100-95',
    'world-top100-99',
    'world-top100-100'
);
