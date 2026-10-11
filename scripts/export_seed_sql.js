const fs = require('node:fs');
const path = require('node:path');
const { getDatabase } = require('../src/database');

const db = getDatabase();

let sql = `-- Seed SQL dump for Cloudflare D1
DELETE FROM links_livros;
DELETE FROM podcasts_episodios;
DELETE FROM podcasts_shows;
DELETE FROM import_jobs;
DELETE FROM cursos;
DELETE FROM livros;
DELETE FROM autores;
DELETE FROM categorias;
DELETE FROM fontes;
`;

function escapeString(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  return "'" + val.toString().replace(/'/g, "''") + "'";
}

// 1. Fontes
const fontes = db.prepare('SELECT id, slug, nome, tipo, url_base, ativa FROM fontes').all();
for (const f of fontes) {
  sql += `INSERT INTO fontes (id, slug, nome, tipo, url_base, ativa) VALUES (${f.id}, ${escapeString(f.slug)}, ${escapeString(f.nome)}, ${escapeString(f.tipo)}, ${escapeString(f.url_base)}, ${f.ativa});\n`;
}

// 2. Categorias
const categorias = db.prepare('SELECT id, nome, descricao FROM categorias').all();
for (const c of categorias) {
  sql += `INSERT INTO categorias (id, nome, descricao) VALUES (${c.id}, ${escapeString(c.nome)}, ${escapeString(c.descricao)});\n`;
}

// 3. Autores
const autores = db.prepare('SELECT id, nome, nacionalidade, biografia FROM autores').all();
for (const a of autores) {
  sql += `INSERT INTO autores (id, nome, nacionalidade, biografia) VALUES (${a.id}, ${escapeString(a.nome)}, ${escapeString(a.nacionalidade)}, ${escapeString(a.biografia)});\n`;
}

// 4. Livros
const livros = db.prepare('SELECT id, titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url, paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras, conteudo_texto FROM livros').all();
for (const l of livros) {
  sql += `INSERT INTO livros (id, titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url, paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras, conteudo_texto) VALUES (${l.id}, ${escapeString(l.titulo)}, ${escapeString(l.subtitulo)}, ${escapeString(l.isbn)}, ${escapeString(l.ano_publicacao)}, ${escapeString(l.idioma)}, ${escapeString(l.sinopse)}, ${escapeString(l.capa_url)}, ${escapeString(l.paginas)}, ${escapeString(l.autor_id)}, ${escapeString(l.categoria_id)}, ${escapeString(l.fonte_id)}, ${escapeString(l.fonte_id_externo)}, ${escapeString(l.licenca)}, ${l.leituras}, ${escapeString(l.conteudo_texto)});\n`;
}

// 5. Links
const links = db.prepare('SELECT id, livro_id, formato, url, tamanho_bytes, link_externo FROM links_livros').all();
for (const l of links) {
  sql += `INSERT INTO links_livros (id, livro_id, formato, url, tamanho_bytes, link_externo) VALUES (${l.id}, ${l.livro_id}, ${escapeString(l.formato)}, ${escapeString(l.url)}, ${escapeString(l.tamanho_bytes)}, ${l.link_externo});\n`;
}

// 6. Cursos
const cursos = db.prepare('SELECT id, titulo, tipo, area, plataforma, url, licenca, nivel, descricao FROM cursos').all();
for (const c of cursos) {
  sql += `INSERT INTO cursos (id, titulo, tipo, area, plataforma, url, licenca, nivel, descricao) VALUES (${c.id}, ${escapeString(c.titulo)}, ${escapeString(c.tipo)}, ${escapeString(c.area)}, ${escapeString(c.plataforma)}, ${escapeString(c.url)}, ${escapeString(c.licenca)}, ${escapeString(c.nivel)}, ${escapeString(c.descricao)});\n`;
}

// 7. Podcasts Shows & Episódios
try {
  const shows = db.prepare('SELECT id, titulo, slug, descricao, capa_url, spotify_url, spotify_uri, categoria, idioma, ativo FROM podcasts_shows').all();
  for (const s of shows) {
    sql += `INSERT INTO podcasts_shows (id, titulo, slug, descricao, capa_url, spotify_url, spotify_uri, categoria, idioma, ativo) VALUES (${s.id}, ${escapeString(s.titulo)}, ${escapeString(s.slug)}, ${escapeString(s.descricao)}, ${escapeString(s.capa_url)}, ${escapeString(s.spotify_url)}, ${escapeString(s.spotify_uri)}, ${escapeString(s.categoria)}, ${escapeString(s.idioma)}, ${s.ativo});\n`;
  }

  const episodios = db.prepare('SELECT id, show_id, numero, titulo, slug, descricao, duracao_minutos, spotify_url, spotify_embed_url, audio_url, publicado_em, reproducoes FROM podcasts_episodios').all();
  for (const ep of episodios) {
    sql += `INSERT INTO podcasts_episodios (id, show_id, numero, titulo, slug, descricao, duracao_minutos, spotify_url, spotify_embed_url, audio_url, publicado_em, reproducoes) VALUES (${ep.id}, ${ep.show_id}, ${ep.numero || 'NULL'}, ${escapeString(ep.titulo)}, ${escapeString(ep.slug)}, ${escapeString(ep.descricao)}, ${ep.duracao_minutos || 'NULL'}, ${escapeString(ep.spotify_url)}, ${escapeString(ep.spotify_embed_url)}, ${escapeString(ep.audio_url)}, ${escapeString(ep.publicado_em)}, ${ep.reproducoes});\n`;
  }
} catch (e) {
  console.log('Skipping podcasts table export:', e.message);
}

const outputPath = path.join(__dirname, '../seed.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Generated seed.sql successfully at ${outputPath} (${sql.length} bytes)`);
