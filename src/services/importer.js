const { getDatabase } = require('../database');

/**
 * Importador assíncrono para fontes abertas (Gutenberg via Gutendex e Open Library).
 */
async function executarImportacao(jobId, fonteSlug, query) {
  const db = getDatabase();

  try {
    db.prepare(`UPDATE import_jobs SET status = 'em_curso' WHERE id = ?`).run(jobId);

    const fonte = db.prepare('SELECT id, slug FROM fontes WHERE slug = ?').get(fonteSlug);
    if (!fonte) throw new Error(`Fonte '${fonteSlug}' não encontrada no sistema`);

    let itens = [];
    if (fonteSlug === 'gutenberg') {
      itens = await buscarGutenberg(query);
    } else if (fonteSlug === 'openlibrary') {
      itens = await buscarOpenLibrary(query);
    } else {
      throw new Error(`Importador para fonte '${fonteSlug}' não implementado`);
    }

    db.prepare(`UPDATE import_jobs SET total = ? WHERE id = ?`).run(itens.length, jobId);

    let processados = 0;

    for (const item of itens) {
      // 1. Resolver autor
      let autorId = null;
      if (item.autor_nome) {
        let autor = db.prepare('SELECT id FROM autores WHERE nome = ?').get(item.autor_nome);
        if (!autor) {
          const resAut = db.prepare('INSERT INTO autores (nome) VALUES (?)').run(item.autor_nome);
          autorId = resAut.lastInsertRowid;
        } else {
          autorId = autor.id;
        }
      }

      // 2. Inserir livro de forma idempotente
      const insertLivro = db.prepare(`
        INSERT INTO livros (
          titulo, subtitulo, idioma, sinopse, capa_url, ano_publicacao,
          autor_id, fonte_id, fonte_id_externo, licenca, conteudo_texto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(fonte_id, fonte_id_externo) DO UPDATE SET
          titulo = excluded.titulo,
          capa_url = COALESCE(excluded.capa_url, livros.capa_url)
      `);

      const resLivro = insertLivro.run(
        item.titulo,
        item.subtitulo || null,
        item.idioma || 'pt',
        item.sinopse || null,
        item.capa_url || null,
        item.ano_publicacao || null,
        autorId,
        fonte.id,
        String(item.id_externo),
        item.licenca || 'dominio-publico',
        item.conteudo_texto || null
      );

      // Obter id do livro (novo ou existente)
      const livroId = resLivro.lastInsertRowid || db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fonte.id, String(item.id_externo))?.id;

      // 3. Inserir links de formatos
      if (livroId && Array.isArray(item.links)) {
        const insertLink = db.prepare(`
          INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
          VALUES (?, ?, ?, ?, 1)
          ON CONFLICT(livro_id, formato) DO UPDATE SET url = excluded.url
        `);

        for (const link of item.links) {
          if (['epub', 'pdf', 'txt', 'html', 'audiobook'].includes(link.formato) && link.url) {
            insertLink.run(livroId, link.formato, link.url, link.tamanho_bytes || 0);
          }
        }
      }

      processados++;
      db.prepare(`UPDATE import_jobs SET processados = ? WHERE id = ?`).run(processados, jobId);
    }

    db.prepare(`UPDATE import_jobs SET status = 'concluido' WHERE id = ?`).run(jobId);
  } catch (err) {
    db.prepare(`UPDATE import_jobs SET status = 'erro', erro = ? WHERE id = ?`).run(err.message, jobId);
  }
}

async function buscarGutenberg(query) {
  const url = `https://gutendex.com/books/?search=${encodeURIComponent(query || 'literatura')}&languages=pt`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LinoLivre/1.0 (biblioteca@escola.gov.br)' }
  });
  if (!res.ok) throw new Error(`Gutendex respondeu status ${res.status}`);
  const data = await res.json();

  const resultados = [];
  for (const b of (data.results || [])) {
    const autorNome = b.authors && b.authors[0] ? inverterNomeAutor(b.authors[0].name) : 'Autor Desconhecido';
    const links = [];

    if (b.formats['application/epub+zip']) {
      links.push({ formato: 'epub', url: b.formats['application/epub+zip'] });
    }
    if (b.formats['application/pdf']) {
      links.push({ formato: 'pdf', url: b.formats['application/pdf'] });
    }
    if (b.formats['text/html']) {
      links.push({ formato: 'html', url: b.formats['text/html'] });
    }
    if (b.formats['text/plain; charset=utf-8']) {
      links.push({ formato: 'txt', url: b.formats['text/plain; charset=utf-8'] });
    }

    resultados.push({
      id_externo: `pg-${b.id}`,
      titulo: b.title,
      autor_nome: autorNome,
      idioma: b.languages && b.languages[0] ? b.languages[0] : 'pt',
      capa_url: b.formats['image/jpeg'] || null,
      licenca: 'dominio-publico',
      sinopse: `Obra clássica disponibilizada pelo Project Gutenberg (ID: ${b.id}).`,
      links
    });
  }

  return resultados;
}

async function buscarOpenLibrary(query) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&has_fulltext=true&limit=10`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LinoLivre/1.0 (biblioteca@escola.gov.br)' }
  });
  if (!res.ok) throw new Error(`Open Library respondeu status ${res.status}`);
  const data = await res.json();

  const resultados = [];
  for (const doc of (data.docs || [])) {
    const autorNome = doc.author_name ? doc.author_name[0] : 'Autor Clássico';
    const idExterno = doc.key ? doc.key.replace('/works/', '') : `ol-${Math.random()}`;
    const capaId = doc.cover_i;
    const capaUrl = capaId ? `https://covers.openlibrary.org/b/id/${capaId}-L.jpg` : null;

    const links = [
      { formato: 'html', url: `https://openlibrary.org${doc.key}` }
    ];

    resultados.push({
      id_externo: idExterno,
      titulo: doc.title,
      autor_nome: autorNome,
      idioma: doc.language ? doc.language[0] : 'pt',
      ano_publicacao: doc.first_publish_year || null,
      capa_url: capaUrl,
      licenca: 'dominio-publico',
      sinopse: doc.subtitle || `Registro de acervo aberto na Open Library.`,
      links
    });
  }

  return resultados;
}

function inverterNomeAutor(str) {
  if (!str) return '';
  const partes = str.split(',').map(s => s.trim());
  if (partes.length === 2) {
    return `${partes[1]} ${partes[0]}`;
  }
  return str;
}

module.exports = {
  executarImportacao,
  buscarGutenberg,
  buscarOpenLibrary
};
