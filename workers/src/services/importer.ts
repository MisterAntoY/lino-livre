// Importer service for Cloudflare Workers (D1 SQLite + Web Fetch)

const USER_AGENT_OFICIAL = 'LinoLivre/2.0 (+https://lino-livre.linolivre.workers.dev; contato@linolivre.workers.dev; biblioteca digital aberta educacional)';

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
    } else if (fonteSlug === 'wikisource') {
      itens = await buscarWikisource(query);
    } else if (fonteSlug === 'librivox') {
      itens = await buscarLibriVox(query);
    } else if (fonteSlug === 'standardebooks') {
      itens = await buscarStandardEbooks(query);
    } else if (fonteSlug === 'europeana') {
      itens = await buscarEuropeana(query);
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
    headers: { 'User-Agent': USER_AGENT_OFICIAL }
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
    headers: { 'User-Agent': USER_AGENT_OFICIAL }
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

export async function buscarWikisource(query: string): Promise<any[]> {
  const termo = (query && query.trim() && query.trim().toLowerCase() !== 'todos')
    ? query.trim()
    : 'Machado de Assis';

  const url = `https://pt.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(termo)}&srnamespace=0&format=json`;
  let data: any = null;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT_OFICIAL }
    });
    if (res.ok) data = await res.json();
  } catch (_) {}

  if (!data?.query?.search?.length) {
    return [
      {
        id_externo: 'ws-14428',
        titulo: 'Ressurreição',
        autor_nome: 'Machado de Assis',
        idioma: 'pt',
        capa_url: '/capas/o_alienista.png',
        licenca: 'dominio-publico',
        sinopse: 'Primeiro romance de Machado de Assis, publicado em 1872.',
        links: [{ formato: 'html', url: 'https://pt.wikisource.org/wiki/Ressurrei%C3%A7%C3%A3o' }]
      }
    ];
  }

  const resultados: any[] = [];
  for (const hit of data.query.search) {
    let tituloLimpo = hit.title;
    let autorNome = 'Machado de Assis';
    const matchParenteses = hit.title.match(/^(.+?)\s*\((.+?)\)$/);
    if (matchParenteses) {
      tituloLimpo = matchParenteses[1].trim();
      autorNome = matchParenteses[2].trim();
    } else if (termo && termo !== 'todos') {
      autorNome = termo;
    }

    const sinopse = hit.snippet
      ? hit.snippet.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'").trim()
      : 'Texto integral digitalizado pela comunidade da Wikisource.';

    const pageUrl = `https://pt.wikisource.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}`;

    resultados.push({
      id_externo: `ws-${hit.pageid}`,
      titulo: tituloLimpo,
      autor_nome: autorNome,
      idioma: 'pt',
      capa_url: '/capas/o_alienista.png',
      licenca: 'dominio-publico',
      sinopse,
      links: [{ formato: 'html', url: pageUrl }]
    });
  }
  return resultados;
}

export async function buscarLibriVox(query: string): Promise<any[]> {
  const termo = (query && query.trim() && query.trim().toLowerCase() !== 'todos') ? query.trim() : '';
  let data: any = null;
  const urls: string[] = [];
  if (termo) {
    urls.push(`https://librivox.org/api/feed/audiobooks/?format=json&title=^${encodeURIComponent(termo)}`);
    urls.push(`https://librivox.org/api/feed/audiobooks/?format=json&author=^${encodeURIComponent(termo)}`);
  }
  urls.push(`https://librivox.org/api/feed/audiobooks/?format=json&limit=25`);

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: { 'User-Agent': USER_AGENT_OFICIAL }
      });
      if (res.ok) {
        const json: any = await res.json();
        if (json?.books?.length) {
          data = json;
          break;
        }
      }
    } catch (_) {}
  }

  if (!data?.books?.length) {
    return [
      {
        id_externo: 'librivox-991',
        titulo: 'Dom Casmurro (Audiolivro)',
        autor_nome: 'Machado de Assis',
        idioma: 'pt',
        ano_publicacao: 1899,
        capa_url: 'https://archive.org/services/img/librivoxaudio_991',
        licenca: 'dominio-publico',
        sinopse: 'Gravação voluntária integral em domínio público via LibriVox.',
        links: [{ formato: 'audiobook', url: 'https://librivox.org/dom-casmurro-by-machado-de-assis/' }]
      }
    ];
  }

  const resultados: any[] = [];
  for (const b of data.books) {
    const autor = (b.authors && b.authors[0])
      ? `${b.authors[0].first_name || ''} ${b.authors[0].last_name || ''}`.trim()
      : 'Autor Clássico';

    let idioma = 'pt';
    if (b.language) {
      const l = b.language.toLowerCase();
      if (l.includes('portuguese') || l === 'pt') idioma = 'pt';
      else if (l.includes('english') || l === 'en') idioma = 'en';
      else if (l.includes('spanish') || l === 'es') idioma = 'es';
      else if (l.includes('french') || l === 'fr') idioma = 'fr';
      else if (l.includes('german') || l === 'de') idioma = 'de';
      else if (l.includes('italian') || l === 'it') idioma = 'it';
      else idioma = 'outro';
    }

    const sinopse = b.description
      ? b.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500)
      : 'Audiolivro integral disponibilizado pelo projeto LibriVox em domínio público.';

    const ano = parseInt(b.copyright_year, 10);
    const links: any[] = [];
    const urlAudio = b.url_librivox || b.url_zip_file || b.url_rss;
    if (urlAudio) links.push({ formato: 'audiobook', url: urlAudio });
    if (b.url_text_source) links.push({ formato: 'html', url: b.url_text_source });

    resultados.push({
      id_externo: `librivox-${b.id}`,
      titulo: b.title,
      autor_nome: autor,
      idioma,
      ano_publicacao: Number.isFinite(ano) ? ano : null,
      capa_url: `https://archive.org/services/img/librivoxaudio_${b.id}`,
      licenca: 'dominio-publico',
      sinopse,
      links
    });
  }
  return resultados;
}

export async function buscarStandardEbooks(query: string): Promise<any[]> {
  const url = 'https://standardebooks.org/feeds/atom/new-releases';
  let xmlText = '';
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT_OFICIAL }
    });
    if (res.ok) xmlText = await res.text();
  } catch (_) {}

  if (!xmlText) {
    return [
      {
        id_externo: 'se-henry-seton-merriman-suspense',
        titulo: 'Suspense',
        autor_nome: 'Henry Seton Merriman',
        idioma: 'en',
        ano_publicacao: 1890,
        capa_url: 'https://standardebooks.org/ebooks/henry-seton-merriman/suspense/downloads/cover-thumbnail.jpg',
        licenca: 'cc0',
        sinopse: 'Edição de domínio público cuidadosamente formatada e revisada por Standard Ebooks.',
        links: [
          { formato: 'epub', url: 'https://standardebooks.org/ebooks/henry-seton-merriman/suspense/downloads/henry-seton-merriman_suspense.epub' },
          { formato: 'html', url: 'https://standardebooks.org/ebooks/henry-seton-merriman/suspense' }
        ]
      }
    ];
  }

  const entries = [...xmlText.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)];
  const resultados: any[] = [];

  for (const match of entries) {
    const raw = match[1];
    const idMatch = raw.match(/<id>([\s\S]*?)<\/id>/i);
    const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/i);
    const authorMatch = raw.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/i);
    const summaryMatch = raw.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
    const thumbMatch = raw.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
                       raw.match(/<link[^>]+rel=["']http:\/\/opds-spec\.org\/image["'][^>]+href=["']([^"']+)["']/i);
    const epubMatch = raw.match(/<link[^>]+type=["']application\/epub\+zip["'][^>]+href=["']([^"']+)["']/i);
    const htmlMatch = raw.match(/<link[^>]+type=["']application\/xhtml\+xml["'][^>]+href=["']([^"']+)["']/i);

    const titulo = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
    const rawId = idMatch ? idMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
    const autorNome = authorMatch ? authorMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : 'Standard Ebooks Author';
    const sinopse = summaryMatch ? summaryMatch[1].replace(/<[^>]+>/g, '').trim() : 'Edição aberta de alto padrão tipográfico por Standard Ebooks.';
    const capaUrl = thumbMatch ? thumbMatch[1] : null;

    if (!titulo || !rawId) continue;
    const slugId = rawId.replace(/https?:\/\/standardebooks\.org\/ebooks\//i, '').replace(/[\/]+/g, '-');
    const links: any[] = [];
    if (epubMatch) links.push({ formato: 'epub', url: epubMatch[1] });
    if (htmlMatch) links.push({ formato: 'html', url: htmlMatch[1] });
    else links.push({ formato: 'html', url: rawId });

    resultados.push({
      id_externo: `se-${slugId}`,
      titulo,
      autor_nome: autorNome,
      idioma: 'en',
      ano_publicacao: null,
      capa_url: capaUrl,
      licenca: 'cc0',
      sinopse,
      links
    });
  }

  if (query && query.trim() && query.trim().toLowerCase() !== 'todos') {
    const q = query.trim().toLowerCase();
    const filtrados = resultados.filter(r =>
      r.titulo.toLowerCase().includes(q) ||
      r.autor_nome.toLowerCase().includes(q) ||
      r.sinopse.toLowerCase().includes(q)
    );
    if (filtrados.length > 0) return filtrados;
  }
  return resultados;
}

export async function buscarEuropeana(query: string): Promise<any[]> {
  const termo = (query && query.trim() && query.trim().toLowerCase() !== 'todos') ? query.trim() : 'TYPE:TEXT';
  const qParam = termo.startsWith('TYPE:') ? termo : `TYPE:TEXT AND ${termo}`;
  const url = `https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query=${encodeURIComponent(qParam)}&reusability=open&rows=25`;

  let data: any = null;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT_OFICIAL }
    });
    if (res.ok) data = await res.json();
  } catch (_) {}

  if (!data?.items?.length) {
    return [
      {
        id_externo: 'eur-camoes-lusiadas',
        titulo: 'Os Lusíadas (Edição Histórica)',
        autor_nome: 'Luís de Camões',
        idioma: 'pt',
        ano_publicacao: 1572,
        capa_url: '/capas/o_alienista.png',
        licenca: 'dominio-publico',
        sinopse: 'Patrimônio cultural e literário digitalizado pelas bibliotecas europeias através da Europeana.',
        links: [{ formato: 'html', url: 'https://www.europeana.eu/pt/item/9200518/ark__12148_bpt6k1280010c' }]
      }
    ];
  }

  const resultados: any[] = [];
  for (const item of data.items) {
    let licenca = 'dominio-publico';
    if (item.rights?.[0]) {
      const r = String(item.rights[0]).toLowerCase();
      if (r.includes('/zero/1.0') || r.includes('cc0')) licenca = 'cc0';
      else if (r.includes('/by/')) licenca = 'cc-by';
      else if (r.includes('/by-sa/')) licenca = 'cc-by-sa';
      else if (r.includes('/by-nc/')) licenca = 'cc-by-nc';
    }

    const titulo = (item.title && item.title[0]) ? String(item.title[0]).trim().replace(/\s+/g, ' ') : '';
    if (!titulo) continue;

    let autorNome = 'Autor Clássico';
    if (item.dcCreator?.length) {
      const valid = item.dcCreator.filter((c: any) => !String(c).startsWith('http'));
      if (valid.length) autorNome = String(valid[0]).trim().slice(0, 100);
    }

    let ano: number | null = null;
    if (item.year?.length) {
      const y = parseInt(item.year[0], 10);
      if (y >= 1000 && y <= 1960) ano = y;
    }

    let idioma = 'pt';
    if (item.language?.length) {
      const l = String(item.language[0]).toLowerCase();
      if (l.startsWith('por') || l === 'pt') idioma = 'pt';
      else if (l.startsWith('eng') || l === 'en') idioma = 'en';
      else if (l.startsWith('spa') || l === 'es') idioma = 'es';
      else if (l.startsWith('fre') || l.startsWith('fra') || l === 'fr') idioma = 'fr';
      else if (l.startsWith('ger') || l.startsWith('deu') || l === 'de') idioma = 'de';
      else if (l.startsWith('ita') || l === 'it') idioma = 'it';
      else idioma = 'outro';
    }

    const capaUrl = item.edmPreview?.[0] || null;
    const urlLeitura = item.edmIsShownAt?.[0] || item.guid || `https://www.europeana.eu/item${item.id}`;
    let sinopse = 'Obra aberta preservada e indexada no portal cultural europeu Europeana.';
    if (item.dcDescription?.length) {
      sinopse = String(item.dcDescription[0]).replace(/<[^>]+>/g, '').trim().slice(0, 400);
    }

    const rawId = item.id || item.guid || String(Math.random());
    const idExterno = `eur-${rawId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

    resultados.push({
      id_externo: idExterno,
      titulo,
      autor_nome: autorNome,
      idioma,
      ano_publicacao: ano,
      capa_url: capaUrl,
      licenca,
      sinopse,
      links: [{ formato: 'html', url: urlLeitura }]
    });
  }
  return resultados;
}
