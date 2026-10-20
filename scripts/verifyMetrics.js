const { getDatabase } = require('../src/database/index');
const db = getDatabase();

const q = db.prepare(`
  SELECT COUNT(*) AS total,
    SUM(CASE WHEN capa_url IS NULL OR capa_url = '' THEN 1 ELSE 0 END) AS sem_capa,
    SUM(CASE WHEN sinopse IS NULL OR sinopse = '' THEN 1 ELSE 0 END) AS sem_sinopse,
    SUM(CASE WHEN ano_publicacao IS NULL THEN 1 ELSE 0 END) AS sem_ano,
    SUM(CASE WHEN paginas IS NULL OR paginas = 0 THEN 1 ELSE 0 END) AS sem_paginas
  FROM livros`).get();

const semLink = db.prepare(
  'SELECT COUNT(*) AS c FROM livros l WHERE NOT EXISTS (SELECT 1 FROM links_livros ll WHERE ll.livro_id = l.id)'
).get().c;

console.log('=== INTEGRIDADE DO ACERVO ===');
console.log('Total de livros:', q.total);
console.log('Sem capa:      ', q.sem_capa);
console.log('Sem sinopse:   ', q.sem_sinopse);
console.log('Sem ano:       ', q.sem_ano);
console.log('Sem link:      ', semLink);
console.log('Sem paginas:   ', q.sem_paginas, '(normalizado: guias/awesome-lists nao tem paginas)');
console.log('');
console.log('Fontes ativas:  ', db.prepare('SELECT COUNT(*) AS c FROM fontes WHERE ativa = 1').get().c);
console.log('Fontes inativas:', db.prepare('SELECT COUNT(*) AS c FROM fontes WHERE ativa = 0').get().c);
console.log('');
console.log('=== FONTES COM 0 LIVROS (devem estar inactivas) ===');
db.prepare(`
  SELECT f.slug, f.nome, f.ativa, COUNT(l.id) AS c
  FROM fontes f LEFT JOIN livros l ON l.fonte_id = f.id
  GROUP BY f.id HAVING c = 0
`).all().forEach(r => console.log(' ', r.slug, '| ativa:', r.ativa, '|', r.nome));
