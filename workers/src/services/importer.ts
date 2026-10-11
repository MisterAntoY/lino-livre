// Importer service for Cloudflare Workers (D1 SQLite + Web Fetch)

export async function executarImportacaoD1(db: D1Database, jobId: number, fonteSlug: string, query: string): Promise<void> {
  try {
    await db.prepare("UPDATE import_jobs SET status = 'em_curso' WHERE id = ?").bind(jobId).run();

    const fonte = await db.prepare("SELECT id, slug FROM fontes WHERE slug = ?").bind(fonteSlug).first<{ id: number; slug: string }>();
    if (!fonte) throw new Error(`Fonte '${fonteSlug}' não encontrada no sistema`);

    let itens: any[] = [];
    if (fonteSlug === 'gutenberg') {
      itens = await buscarGutenberg(query);
    } else if (fonteSlug === 'openlibrary') {
      itens = await buscarOpenLibrary(query);
    } else {
      throw new Error(`Importador para fonte '${fonteSlug}' não suportado na Edge`);
    }

    await db.prepare("UPDATE import_jobs SET total = ? WHERE id = ?").bind(itens.length, jobId).run();

    let processados = 0;

    for (const item of itens) {
      // 1. Resolver autor
      let autorId: number | null = null;
      if (item.autor_nome) {
        const autor = await db.prepare("SELECT id FROM autores WHERE nome = ?").bind(item.autor_nome).first<{ id: number }>();
        if (!autor) {
          const resAut = await db.prepare("INSERT INTO autores (nome) VALUES (?)").bind(item.autor_nome).run();
          autorId = resAut.meta.last_row_id;
        } else {
          autorId = autor.id;
        }
      }

      // 2. Inserir ou atualizar livro de forma idempotente
      const insertLivro = db.prepare(`
        INSERT INTO livros (
          titulo, subtitulo, idioma, sinopse, capa_url, ano_publicacao,
          autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, conteudo_texto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(fonte_id, fonte_id_externo) DO UPDATE SET
          titulo = excluded.titulo,
          capa_url = COALESCE(excluded.capa_url, livros.capa_url),
          sinopse = COALESCE(excluded.sinopse, livros.sinopse)
      `);

      const resLivro = await insertLivro.bind(
        item.titulo,
        item.subtitulo || null,
        item.idioma || 'pt',
        item.sinopse || null,
        item.capa_url || null,
        item.ano_publicacao || null,
        autorId,
        null,
        fonte.id,
        String(item.id_externo),
        item.licenca || 'dominio-publico',
        item.conteudo_texto || null
      ).run();

      const livroId = resLivro.meta.last_row_id || (await db.prepare("SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?").bind(fonte.id, String(item.id_externo)).first<{ id: number }>())?.id;

      // 3. Inserir links de formatos
      if (livroId && Array.isArray(item.links)) {
        const insertLink = db.prepare(`
          INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
          VALUES (?, ?, ?, ?, 1)
          ON CONFLICT(livro_id, formato) DO UPDATE SET url = excluded.url
        `);

        for (const link of item.links) {
          if (['epub', 'pdf', 'txt', 'html', 'audiobook'].includes(link.formato) && link.url) {
            await insertLink.bind(livroId, link.formato, link.url, link.tamanho_bytes || 0).run();
          }
        }
      }

      processados++;
      await db.prepare("UPDATE import_jobs SET processados = ? WHERE id = ?").bind(processados, jobId).run();
    }

    await db.prepare("UPDATE import_jobs SET status = 'concluido' WHERE id = ?").bind(jobId).run();
  } catch (err: any) {
    await db.prepare("UPDATE import_jobs SET status = 'erro', erro = ? WHERE id = ?").bind(err.message || String(err), jobId).run();
  }
}

async function buscarGutenberg(query: string) {
  const url = `https://gutendex.com/books/?search=${encodeURIComponent(query || 'literatura')}&languages=pt`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LinoLivre/2.0 (contato@linolivre.workers.dev)' }
  });
  if (!res.ok) throw new Error(`Gutendex respondeu status ${res.status}`);
  const data: any = await res.json();

  const resultados: any[] = [];
  for (const b of (data.results || [])) {
    const autorNome = b.authors && b.authors[0] ? inverterNomeAutor(b.authors[0].name) : 'Autor Desconhecido';
    const links: any[] = [];

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

async function buscarOpenLibrary(query: string) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&has_fulltext=true&limit=10`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LinoLivre/2.0 (contato@linolivre.workers.dev)' }
  });
  if (!res.ok) throw new Error(`Open Library respondeu status ${res.status}`);
  const data: any = await res.json();

  const resultados: any[] = [];
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
      sinopse: doc.subtitle || 'Registro de acervo aberto na Open Library.',
      links
    });
  }

  return resultados;
}

function inverterNomeAutor(str: string) {
  if (!str) return '';
  const partes = str.split(',').map(s => s.trim());
  if (partes.length === 2) {
    return `${partes[1]} ${partes[0]}`;
  }
  return str;
}
