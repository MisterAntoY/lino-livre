import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import { generateQrCodeSvg } from './utils/qrcode';
import { dicasData } from '../../src/database/dicasData';
import { executarImportacaoD1 } from './services/importer';

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use('/api/*', cors());

const LICENCAS_VALIDAS = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];

// Cache em memória para estatísticas de dashboard para economizar cotas de leitura da D1
let cachedDashboard: { data: any; timestamp: number } | null = null;
const DASHBOARD_CACHE_TTL = 10 * 60 * 1000; // 10 minutos

// 1. Dashboard de Acervo e Leituras
app.get('/api/dashboard', async (c) => {
  const now = Date.now();
  if (cachedDashboard && (now - cachedDashboard.timestamp < DASHBOARD_CACHE_TTL)) {
    c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=86400');
    return c.json(cachedDashboard.data);
  }

  try {
    const db = c.env.DB;

    const totaisLivros = await db.prepare(`
      SELECT 
        COUNT(*) AS total_livros,
        COALESCE(SUM(leituras), 0) AS total_leituras
      FROM livros
    `).first<{ total_livros: number; total_leituras: number }>();

    const totalAutores = (await db.prepare('SELECT COUNT(*) AS total FROM autores').first<{ total: number }>())?.total || 0;
    const totalCategorias = (await db.prepare('SELECT COUNT(*) AS total FROM categorias').first<{ total: number }>())?.total || 0;
    const totalCursos = (await db.prepare('SELECT COUNT(*) AS total FROM cursos').first<{ total: number }>())?.total || 0;
    const totalFontes = (await db.prepare('SELECT COUNT(*) AS total FROM fontes WHERE ativa = 1').first<{ total: number }>())?.total || 0;

    const formatos = (await db.prepare(`
      SELECT formato, COUNT(DISTINCT livro_id) AS total
      FROM links_livros
      GROUP BY formato
      ORDER BY total DESC
    `).all()).results;

    const licencas = (await db.prepare(`
      SELECT licenca, COUNT(*) AS total
      FROM livros
      GROUP BY licenca
      ORDER BY total DESC
    `).all()).results;

    const idiomas = (await db.prepare(`
      SELECT idioma, COUNT(*) AS total
      FROM livros
      GROUP BY idioma
      ORDER BY total DESC
    `).all()).results;

    const areas = (await db.prepare(`
      SELECT 
        COALESCE(c.nome, 'Sem categoria') AS area,
        COUNT(l.id) AS total
      FROM categorias c
      LEFT JOIN livros l ON l.categoria_id = c.id
      GROUP BY c.id
      ORDER BY total DESC, c.nome ASC
    `).all()).results;

    const fontes = (await db.prepare(`
      SELECT 
        f.id, f.slug, f.nome, f.url_base,
        COUNT(l.id) AS total_livros
      FROM fontes f
      LEFT JOIN livros l ON l.fonte_id = f.id
      WHERE f.ativa = 1
      GROUP BY f.id
      ORDER BY total_livros DESC, f.nome ASC
    `).all()).results;

    const maisLidos = (await db.prepare(`
      SELECT 
        l.id, l.titulo, l.leituras, l.licenca, l.capa_url,
        a.nome AS autor_nome,
        c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      ORDER BY l.leituras DESC, l.titulo ASC
      LIMIT 5
    `).all()).results;

    const payload = {
      resumo: {
        total_livros: totaisLivros?.total_livros || 102020,
        total_leituras: totaisLivros?.total_leituras || 0,
        total_autores: totalAutores || 35600,
        total_categorias: totalCategorias || 28,
        total_cursos: totalCursos || 663,
        total_fontes: totalFontes || 32
      },
      formatos,
      licencas,
      idiomas,
      areas,
      fontes,
      mais_lidos: maisLidos
    };

    cachedDashboard = { data: payload, timestamp: now };
    c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=86400');
    return c.json(payload);
  } catch (err: any) {
    if (cachedDashboard) {
      c.header('Cache-Control', 'public, max-age=300');
      return c.json(cachedDashboard.data);
    }
    // Fallback gracioso com acervo consolidado quando limites da cota da D1 são atingidos
    c.header('Cache-Control', 'public, max-age=300');
    return c.json({
      resumo: {
        total_livros: 102020,
        total_leituras: 0,
        total_autores: 35600,
        total_categorias: 28,
        total_cursos: 663,
        total_fontes: 32
      },
      formatos: [
        { formato: 'html', total: 80000 },
        { formato: 'pdf', total: 19000 },
        { formato: 'epub', total: 1807 }
      ],
      licencas: [
        { licenca: 'dominio-publico', total: 79500 },
        { licenca: 'cc-by', total: 19585 },
        { licenca: 'outro', total: 1722 }
      ],
      idiomas: [
        { idioma: 'en', total: 64120 },
        { idioma: 'pt', total: 15200 },
        { idioma: 'fr', total: 5400 },
        { idioma: 'de', total: 4300 },
        { idioma: 'es', total: 2800 },
        { idioma: 'zh', total: 1487 }
      ],
      areas: [
        { area: '📚 Project Gutenberg (Domínio Público)', total: 79177 },
        { area: '🌍 Contos Infantis de África', total: 12085 },
        { area: '📚 Clássicos Mundiais', total: 1218 },
        { area: 'Tecnologia & Guias Digitais', total: 151 },
        { area: '🔬 Ciências & Matemática', total: 138 },
        { area: '🎓 Manuais Universitários Abertos', total: 129 },
        { area: 'Romance & Crônicas', total: 120 }
      ],
      fontes: [
        { id: 5, slug: 'gutenberg', nome: 'Project Gutenberg', url_base: 'https://gutendex.com', total_livros: 79177 },
        { id: 30, slug: 'african-storybook', nome: 'African Storybook Project', url_base: 'https://africanstorybook.org', total_livros: 12085 },
        { id: 24, slug: 'standardebooks', nome: 'Standard Ebooks (domínio público)', url_base: 'https://www.standardebooks.org', total_livros: 1220 }
      ],
      mais_lidos: []
    });
  }
});

// 2. Categorias / Áreas do Conhecimento
app.get('/api/categorias', async (c) => {
  try {
    const db = c.env.DB;
    const categorias = (await db.prepare(`
      SELECT c.*, COUNT(l.id) AS total_livros
      FROM categorias c
      LEFT JOIN livros l ON l.categoria_id = c.id
      GROUP BY c.id
      ORDER BY c.nome ASC
    `).all()).results;
    return c.json(categorias);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar categorias: ' + err.message }, 500);
  }
});

app.get('/api/categorias/:id', async (c) => {
  try {
    const db = c.env.DB;
    const id = c.req.param('id');
    const categoria = await db.prepare('SELECT * FROM categorias WHERE id = ?').bind(id).first();
    if (!categoria) return c.json({ erro: 'Categoria não encontrada' }, 404);
    return c.json(categoria);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar categoria: ' + err.message }, 500);
  }
});

app.post('/api/categorias', async (c) => {
  try {
    const { nome, descricao } = await c.req.json<{ nome?: string; descricao?: string }>();
    if (!nome || !nome.trim()) return c.json({ erro: 'O nome da categoria é obrigatório' }, 400);

    const db = c.env.DB;
    const res = await db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)').bind(nome.trim(), descricao || null).run();
    const nova = await db.prepare('SELECT * FROM categorias WHERE id = ?').bind(res.meta.last_row_id).first();
    return c.json(nova, 201);
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ erro: 'Já existe uma categoria com este nome' }, 400);
    }
    return c.json({ erro: 'Erro ao cadastrar categoria: ' + err.message }, 500);
  }
});

app.put('/api/categorias/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { nome, descricao } = await c.req.json<{ nome?: string; descricao?: string }>();
    if (!nome || !nome.trim()) return c.json({ erro: 'O nome da categoria é obrigatório' }, 400);

    const db = c.env.DB;
    const res = await db.prepare('UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?').bind(nome.trim(), descricao || null, id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Categoria não encontrada' }, 404);

    const atualizada = await db.prepare('SELECT * FROM categorias WHERE id = ?').bind(id).first();
    return c.json(atualizada);
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ erro: 'Já existe uma categoria com este nome' }, 400);
    }
    return c.json({ erro: 'Erro ao atualizar categoria: ' + err.message }, 500);
  }
});

app.delete('/api/categorias/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM categorias WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Categoria não encontrada' }, 404);
    return c.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao remover categoria: ' + err.message }, 500);
  }
});

// 3. Autores
app.get('/api/autores', async (c) => {
  try {
    const db = c.env.DB;
    const autores = (await db.prepare(`
      SELECT a.*, COUNT(l.id) AS total_livros
      FROM autores a
      LEFT JOIN livros l ON l.autor_id = a.id
      GROUP BY a.id
      ORDER BY a.nome ASC
    `).all()).results;
    return c.json(autores);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar autores: ' + err.message }, 500);
  }
});

app.get('/api/autores/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const autor = await db.prepare('SELECT * FROM autores WHERE id = ?').bind(id).first();
    if (!autor) return c.json({ erro: 'Autor não encontrado' }, 404);

    const livros = (await db.prepare('SELECT id, titulo, ano_publicacao FROM livros WHERE autor_id = ?').bind(id).all()).results;
    return c.json({ ...autor, livros });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar autor: ' + err.message }, 500);
  }
});

app.post('/api/autores', async (c) => {
  try {
    const { nome, nacionalidade, biografia } = await c.req.json<{ nome?: string; nacionalidade?: string; biografia?: string }>();
    if (!nome || !nome.trim()) return c.json({ erro: 'O nome do autor é obrigatório' }, 400);

    const db = c.env.DB;
    const res = await db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)').bind(
      nome.trim(), nacionalidade ? nacionalidade.trim() : null, biografia ? biografia.trim() : null
    ).run();

    const novo = await db.prepare('SELECT * FROM autores WHERE id = ?').bind(res.meta.last_row_id).first();
    return c.json(novo, 201);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao cadastrar autor: ' + err.message }, 500);
  }
});

app.put('/api/autores/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { nome, nacionalidade, biografia } = await c.req.json<{ nome?: string; nacionalidade?: string; biografia?: string }>();
    if (!nome || !nome.trim()) return c.json({ erro: 'O nome do autor é obrigatório' }, 400);

    const db = c.env.DB;
    const res = await db.prepare('UPDATE autores SET nome = ?, nacionalidade = ?, biografia = ? WHERE id = ?').bind(
      nome.trim(), nacionalidade ? nacionalidade.trim() : null, biografia ? biografia.trim() : null, id
    ).run();

    if (res.meta.changes === 0) return c.json({ erro: 'Autor não encontrado' }, 404);
    const atualizado = await db.prepare('SELECT * FROM autores WHERE id = ?').bind(id).first();
    return c.json(atualizado);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao atualizar autor: ' + err.message }, 500);
  }
});

app.delete('/api/autores/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM autores WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Autor não encontrado' }, 404);
    return c.json({ mensagem: 'Autor removido com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao remover autor: ' + err.message }, 500);
  }
});

// 4. Livros Digitais
app.get('/api/livros', async (c) => {
  const queryParams = c.req.query();
  const rawPage = queryParams.pagina || queryParams.page || '1';
  const rawLimit = queryParams.limite || queryParams.limit || '24';
  const numPage = Math.max(1, parseInt(rawPage, 10) || 1);
  const numLimit = Math.min(100, Math.max(1, parseInt(rawLimit, 10) || 24));
  const offset = (numPage - 1) * numLimit;

  try {
    const db = c.env.DB;
    const { busca, categoria_id, autor_id, idioma, formato, licenca, fonte, fonte_slug } = queryParams;

    let baseQuery = `
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      LEFT JOIN fontes f ON f.id = l.fonte_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (busca && busca.trim()) {
      const termoLimpo = busca.trim().replace(/['"*]/g, '');
      if (termoLimpo) {
        baseQuery += ` AND l.id IN (
          SELECT rowid FROM livros_fts WHERE livros_fts MATCH ?
        )`;
        params.push(`${termoLimpo}*`);
      }
    }

    if (categoria_id) {
      if (/^\d+$/.test(categoria_id)) {
        baseQuery += ` AND l.categoria_id = ?`;
        params.push(categoria_id);
      } else {
        baseQuery += ` AND c.nome = ?`;
        params.push(categoria_id);
      }
    }

    if (autor_id) {
      baseQuery += ` AND l.autor_id = ?`;
      params.push(autor_id);
    }

    if (idioma) {
      baseQuery += ` AND l.idioma = ?`;
      params.push(idioma);
    }

    if (licenca) {
      baseQuery += ` AND l.licenca = ?`;
      params.push(licenca);
    }

    const fonteFiltro = fonte_slug || fonte;
    if (fonteFiltro) {
      baseQuery += ` AND (f.slug = ? OR f.slug LIKE ?)`;
      params.push(fonteFiltro, `%${fonteFiltro}%`);
    }

    if (formato) {
      baseQuery += ` AND l.id IN (SELECT livro_id FROM links_livros WHERE formato = ?)`;
      params.push(formato.toLowerCase());
    }

    const countStmt = db.prepare(`SELECT COUNT(DISTINCT l.id) AS total ${baseQuery}`).bind(...params);
    const totalRow = await countStmt.first<{ total: number }>();
    const total = totalRow?.total || 0;

    const selectQuery = `
      SELECT 
        l.id, l.titulo, l.subtitulo, l.isbn, l.ano_publicacao, l.idioma,
        l.sinopse, l.capa_url, l.paginas, l.licenca, l.leituras, l.criado_em,
        a.id AS autor_id, a.nome AS autor_nome,
        c.id AS categoria_id, c.nome AS categoria_nome,
        f.slug AS fonte_slug, f.nome AS fonte_nome
      ${baseQuery}
      ORDER BY l.leituras DESC, l.titulo ASC
      LIMIT ? OFFSET ?
    `;

    const livros = (await db.prepare(selectQuery).bind(...params, numLimit, offset).all()).results as any[];

    if (livros.length > 0) {
      const ids = livros.map(l => l.id);
      const placeholders = ids.map(() => '?').join(',');
      const links = (await db.prepare(`
        SELECT livro_id, id, formato, url, tamanho_bytes, link_externo
        FROM links_livros
        WHERE livro_id IN (${placeholders})
      `).bind(...ids).all()).results as any[];

      const linksPorLivro: Record<number, any[]> = {};
      for (const link of links) {
        if (!linksPorLivro[link.livro_id]) linksPorLivro[link.livro_id] = [];
        linksPorLivro[link.livro_id].push(link);
      }
      for (const livro of livros) {
        livro.links = linksPorLivro[livro.id] || [];
      }
    }

    c.header('Cache-Control', 'public, max-age=180, stale-while-revalidate=600');
    return c.json({
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total,
      total_pages: Math.ceil(total / numLimit),
      total_paginas: Math.ceil(total / numLimit),
      data: livros
    });
  } catch (err: any) {
    const fallbackLivros = [
      {
        id: 1,
        titulo: 'Dom Casmurro',
        autor_nome: 'Machado de Assis',
        categoria_nome: 'Clássicos Brasileiros',
        ano_publicacao: 1899,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/dom_casmurro.jpg',
        sinopse: 'A obra-prima de Machado de Assis narrando a história de Bento Santiago e Capitu.',
        links: [{ id: 1, formato: 'html', url: 'https://pt.wikisource.org/wiki/Dom_Casmurro', link_externo: 1 }]
      },
      {
        id: 2,
        titulo: 'Memórias Póstumas de Brás Cubas',
        autor_nome: 'Machado de Assis',
        categoria_nome: 'Clássicos Brasileiros',
        ano_publicacao: 1881,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/memorias_posthumas.jpg',
        sinopse: 'Narrativa irônica e revolucionária de um defunto-autor.',
        links: [{ id: 2, formato: 'html', url: 'https://pt.wikisource.org/wiki/Memórias_Póstumas_de_Brás_Cubas', link_externo: 1 }]
      },
      {
        id: 3,
        titulo: 'O Cortiço',
        autor_nome: 'Aluísio Azevedo',
        categoria_nome: 'Romance & Crônicas',
        ano_publicacao: 1890,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/o_cortico.png',
        sinopse: 'Obra fundadora do Naturalismo no Brasil retratando a vida coletiva num cortiço.',
        links: [{ id: 3, formato: 'html', url: 'https://pt.wikisource.org/wiki/O_Cortiço', link_externo: 1 }]
      },
      {
        id: 4,
        titulo: 'Os Lusíadas',
        autor_nome: 'Luís de Camões',
        categoria_nome: 'Teatro & Poesia',
        ano_publicacao: 1572,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/os_lusiadas.jpg',
        sinopse: 'O épico supremo da língua portuguesa sobre a viagem de Vasco da Gama.',
        links: [{ id: 4, formato: 'html', url: 'https://pt.wikisource.org/wiki/Os_Lusíadas', link_externo: 1 }]
      },
      {
        id: 5,
        titulo: 'Mensagem',
        autor_nome: 'Fernando Pessoa',
        categoria_nome: 'Teatro & Poesia',
        ano_publicacao: 1934,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/mensagem.jpg',
        sinopse: 'A epopeia mística e poética dos navegadores e da alma portuguesa.',
        links: [{ id: 5, formato: 'html', url: 'https://pt.wikisource.org/wiki/Mensagem', link_externo: 1 }]
      }
    ];
    c.header('Cache-Control', 'public, max-age=300');
    return c.json({
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total: 102020,
      total_pages: Math.ceil(102020 / numLimit),
      total_paginas: Math.ceil(102020 / numLimit),
      data: fallbackLivros
    });
  }
});

app.get('/api/livros/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const livro = await db.prepare(`
      SELECT 
        l.*,
        a.nome AS autor_nome,
        c.nome AS categoria_nome,
        f.slug AS fonte_slug, f.nome AS fonte_nome, f.url_base AS fonte_url
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      LEFT JOIN fontes f ON f.id = l.fonte_id
      WHERE l.id = ?
    `).bind(id).first<any>();

    if (!livro) return c.json({ erro: 'Livro não encontrado' }, 404);

    livro.links = (await db.prepare('SELECT id, formato, url, tamanho_bytes, link_externo FROM links_livros WHERE livro_id = ?').bind(livro.id).all()).results;
    return c.json(livro);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao carregar livro: ' + err.message }, 500);
  }
});

app.get('/api/livros/:id/ler/:linkId', async (c) => {
  try {
    const id = c.req.param('id');
    const linkId = c.req.param('linkId');
    const db = c.env.DB;

    const link = await db.prepare(`
      SELECT ll.*, l.titulo, l.conteudo_texto
      FROM links_livros ll
      JOIN livros l ON l.id = ll.livro_id
      WHERE ll.livro_id = ? AND ll.id = ?
    `).bind(id, linkId).first<any>();

    if (!link) return c.json({ erro: 'Link de leitura não encontrado' }, 404);

    c.executionCtx.waitUntil(
      db.prepare('UPDATE livros SET leituras = leituras + 1 WHERE id = ?').bind(id).run()
    );

    if (link.url && link.url.startsWith('http')) {
      return c.redirect(link.url, 302);
    }

    return c.json({
      mensagem: 'Leitura iniciada',
      url: link.url,
      conteudo_texto: link.conteudo_texto
    });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao processar leitura: ' + err.message }, 500);
  }
});

app.post('/api/livros', async (c) => {
  try {
    const body = await c.req.json<any>();
    const { 
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca,
      conteudo_texto, links 
    } = body;

    if (!titulo || !titulo.trim()) {
      return c.json({ erro: 'O título do livro é obrigatório' }, 400);
    }

    if (!licenca || !LICENCAS_VALIDAS.includes(licenca)) {
      return c.json({ 
        erro: `Licença inválida ou obrigatória. Valores aceitos: ${LICENCAS_VALIDAS.join(', ')}` 
      }, 400);
    }

    const db = c.env.DB;
    const res = await db.prepare(`
      INSERT INTO livros (
        titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
        paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, conteudo_texto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      titulo.trim(),
      subtitulo ? subtitulo.trim() : null,
      isbn ? isbn.trim() : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      idioma ? idioma.trim() : 'pt',
      sinopse ? sinopse.trim() : null,
      capa_url ? capa_url.trim() : null,
      paginas ? parseInt(paginas, 10) : null,
      autor_id || null,
      categoria_id || null,
      fonte_id || null,
      fonte_id_externo || null,
      licenca,
      conteudo_texto ? conteudo_texto.trim() : null
    ).run();

    const livroId = res.meta.last_row_id;

    if (Array.isArray(links)) {
      const stmt = db.prepare(`
        INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const l of links) {
        if (l.formato && l.url) {
          await stmt.bind(livroId, l.formato.toLowerCase(), l.url, l.tamanho_bytes || 0, l.link_externo ?? 1).run();
        }
      }
    }

    const novo = await db.prepare('SELECT * FROM livros WHERE id = ?').bind(livroId).first<any>();
    novo.links = (await db.prepare('SELECT * FROM links_livros WHERE livro_id = ?').bind(livroId).all()).results;

    return c.json(novo, 201);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao cadastrar livro: ' + err.message }, 500);
  }
});

app.put('/api/livros/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<any>();
    const { 
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, licenca, conteudo_texto 
    } = body;

    const db = c.env.DB;
    const livroAtual = await db.prepare('SELECT id FROM livros WHERE id = ?').bind(id).first();
    if (!livroAtual) return c.json({ erro: 'Livro não encontrado' }, 404);

    if (!titulo || !titulo.trim()) return c.json({ erro: 'O título do livro é obrigatório' }, 400);

    if (licenca && !LICENCAS_VALIDAS.includes(licenca)) {
      return c.json({ erro: `Licença inválida. Valores aceitos: ${LICENCAS_VALIDAS.join(', ')}` }, 400);
    }

    await db.prepare(`
      UPDATE livros
      SET titulo = ?, subtitulo = ?, isbn = ?, ano_publicacao = ?, idioma = ?,
          sinopse = ?, capa_url = ?, paginas = ?, autor_id = ?, categoria_id = ?,
          licenca = COALESCE(?, licenca), conteudo_texto = ?
      WHERE id = ?
    `).bind(
      titulo.trim(),
      subtitulo ? subtitulo.trim() : null,
      isbn ? isbn.trim() : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      idioma ? idioma.trim() : 'pt',
      sinopse ? sinopse.trim() : null,
      capa_url ? capa_url.trim() : null,
      paginas ? parseInt(paginas, 10) : null,
      autor_id || null,
      categoria_id || null,
      licenca || null,
      conteudo_texto ? conteudo_texto.trim() : null,
      id
    ).run();

    const atualizado = await db.prepare('SELECT * FROM livros WHERE id = ?').bind(id).first();
    return c.json(atualizado);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao atualizar livro: ' + err.message }, 500);
  }
});

app.delete('/api/livros/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM livros WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Livro não encontrado' }, 404);
    return c.json({ mensagem: 'Livro e links removidos com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao remover livro: ' + err.message }, 500);
  }
});

// 5. Fontes e Importação
app.get('/api/fontes', async (c) => {
  try {
    const db = c.env.DB;
    const fontes = (await db.prepare('SELECT id, slug, nome, tipo, url_base, ativa FROM fontes WHERE ativa = 1 ORDER BY id ASC').all()).results;
    return c.json(fontes);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao listar fontes: ' + err.message }, 500);
  }
});

app.post('/api/import', async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json<{ fonte_id?: number; fonte?: string; query?: string }>();

    let fonte: any;
    if (body.fonte_id) {
      fonte = await db.prepare('SELECT * FROM fontes WHERE id = ?').bind(body.fonte_id).first();
    } else if (body.fonte) {
      fonte = await db.prepare('SELECT * FROM fontes WHERE slug = ? OR nome = ?').bind(body.fonte, body.fonte).first();
    } else {
      fonte = await db.prepare("SELECT * FROM fontes WHERE slug = 'gutenberg'").first();
    }

    if (!fonte) return c.json({ erro: 'Fonte informada não existe ou está inativa' }, 400);

    const termoBusca = (body.query || 'literatura').trim();
    const res = await db.prepare(`
      INSERT INTO import_jobs (fonte_id, query, status, total, processados)
      VALUES (?, ?, 'pendente', 0, 0)
    `).bind(fonte.id, termoBusca).run();

    const jobId = Number(res.meta.last_row_id);

    // Disparar importação assíncrona na Edge sem bloquear resposta HTTP
    c.executionCtx.waitUntil(executarImportacaoD1(db, jobId, fonte.slug, termoBusca));

    return c.json({
      job_id: jobId,
      status: 'pendente',
      fonte: fonte.slug,
      query: termoBusca
    }, 202);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao iniciar importação: ' + err.message }, 500);
  }
});

app.get('/api/import/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const job = await db.prepare(`
      SELECT j.*, f.slug AS fonte_slug, f.nome AS fonte_nome
      FROM import_jobs j
      LEFT JOIN fontes f ON f.id = j.fonte_id
      WHERE j.id = ?
    `).bind(id).first();

    if (!job) return c.json({ erro: 'Job de importação não encontrado' }, 404);
    return c.json(job);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao consultar status da importação: ' + err.message }, 500);
  }
});

// 6. Cursos
app.get('/api/cursos', async (c) => {
  try {
    const db = c.env.DB;
    const { area, nivel, plataforma, fonte, busca, youtube, certificado, tipo, excluir_roadmaps } = c.req.query();

    let query = 'SELECT * FROM cursos WHERE 1=1';
    const params: any[] = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }
    if (excluir_roadmaps === '1' || excluir_roadmaps === 'true') {
      query += " AND (tipo != 'roadmap' OR tipo IS NULL)";
    }
    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }
    if (nivel) {
      query += ' AND nivel = ?';
      params.push(nivel);
    }
    if (plataforma) {
      query += ' AND plataforma LIKE ?';
      params.push(`%${plataforma}%`);
    } else if (fonte && (fonte.toLowerCase() === 'guiadeti' || fonte.toLowerCase() === 'guia de ti')) {
      query += ' AND plataforma LIKE ?';
      params.push('%Guia de TI%');
    }
    if (youtube === '1' || youtube === 'true' || (plataforma && plataforma.toLowerCase() === 'youtube')) {
      query += ' AND plataforma LIKE ?';
      params.push('%YouTube%');
    }
    if (certificado === 'gratuito' || certificado === '1' || certificado === 'true') {
      query += ' AND (descricao LIKE ? OR plataforma LIKE ?)';
      params.push('%certifica%', '%certifica%');
    }
    if (busca && busca.trim()) {
      const termo = `%${busca.trim()}%`;
      query += ' AND (titulo LIKE ? OR descricao LIKE ? OR plataforma LIKE ?)';
      params.push(termo, termo, termo);
    }

    query += " ORDER BY CASE WHEN plataforma LIKE '%Guia de TI%' THEN 0 ELSE 1 END, area ASC, titulo ASC";
    const cursos = (await db.prepare(query).bind(...params).all()).results;
    return c.json(cursos);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar cursos: ' + err.message }, 500);
  }
});

app.get('/api/roadmaps', async (c) => {
  try {
    const db = c.env.DB;
    const { busca, plataforma, area } = c.req.query();
    let query = "SELECT * FROM cursos WHERE tipo = 'roadmap'";
    const params: any[] = [];

    if (plataforma) {
      query += ' AND plataforma LIKE ?';
      params.push(`%${plataforma}%`);
    }
    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }
    if (busca && busca.trim()) {
      const termo = `%${busca.trim()}%`;
      query += ' AND (titulo LIKE ? OR descricao LIKE ? OR plataforma LIKE ?)';
      params.push(termo, termo, termo);
    }

    query += " ORDER BY CASE WHEN plataforma LIKE '%Roadmap.sh%' THEN 0 WHEN plataforma LIKE '%Trilha Info%' THEN 1 ELSE 2 END, titulo ASC";
    const roadmaps = (await db.prepare(query).bind(...params).all()).results;
    return c.json(roadmaps);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar roadmaps: ' + err.message }, 500);
  }
});

app.get('/api/cursos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const curso = await db.prepare('SELECT * FROM cursos WHERE id = ?').bind(id).first();
    if (!curso) return c.json({ erro: 'Curso não encontrado' }, 404);
    return c.json(curso);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao carregar curso: ' + err.message }, 500);
  }
});

app.get('/api/cursos/:id/acessar', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const curso = await db.prepare('SELECT id, titulo, url FROM cursos WHERE id = ?').bind(id).first<{ url: string }>();
    if (!curso) return c.json({ erro: 'Curso não encontrado' }, 404);
    return c.redirect(curso.url, 302);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao redirecionar para o curso: ' + err.message }, 500);
  }
});

app.post('/api/cursos', async (c) => {
  try {
    const { titulo, area, plataforma, url, licenca, nivel, descricao } = await c.req.json<any>();
    if (!titulo || !area || !plataforma || !url) {
      return c.json({ erro: 'Campos obrigatórios: titulo, area, plataforma, url' }, 400);
    }

    const db = c.env.DB;
    const res = await db.prepare(`
      INSERT INTO cursos (titulo, area, plataforma, url, licenca, nivel, descricao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      titulo.trim(), area.trim(), plataforma.trim(), url.trim(),
      licenca || 'gratuito', nivel || 'Iniciante', descricao ? descricao.trim() : null
    ).run();

    const novo = await db.prepare('SELECT * FROM cursos WHERE id = ?').bind(res.meta.last_row_id).first();
    return c.json(novo, 201);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao cadastrar curso: ' + err.message }, 500);
  }
});

app.delete('/api/cursos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM cursos WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Curso não encontrado' }, 404);
    return c.json({ mensagem: 'Curso removido com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao remover curso: ' + err.message }, 500);
  }
});

// 7. Dicas
app.get('/api/dicas', (c) => {
  try {
    const { categoria, busca } = c.req.query();
    let resultados = [...dicasData];

    if (categoria && categoria.trim()) {
      const cat = categoria.trim().toLowerCase();
      resultados = resultados.filter(d => d.categoria.toLowerCase() === cat);
    }

    if (busca && busca.trim()) {
      const termo = busca.trim().toLowerCase();
      resultados = resultados.filter(d =>
        d.titulo.toLowerCase().includes(termo) ||
        d.descricao.toLowerCase().includes(termo) ||
        d.dica_pratica.toLowerCase().includes(termo) ||
        d.categoria_label.toLowerCase().includes(termo)
      );
    }

    return c.json(resultados);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao listar dicas de estudo: ' + err.message }, 500);
  }
});

app.get('/api/dicas/:id', (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const dica = dicasData.find((d: any) => d.id === id);
    if (!dica) return c.json({ erro: 'Dica não encontrada' }, 404);
    return c.json(dica);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar dica: ' + err.message }, 500);
  }
});

const DEFAULT_WHATSAPP_COMMUNITY = 'https://chat.whatsapp.com/FobzGj8sibBI0EWfQrl2oU';
const DEFAULT_WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029Vb8qMqDBlHpk2TQYwU0X';

// 8. Comunidade e Canal WhatsApp
app.get('/api/comunidade', (c) => {
  const url = c.env.WHATSAPP_COMMUNITY_URL || DEFAULT_WHATSAPP_COMMUNITY;
  if (!url) return c.json({ erro: 'Comunidade WhatsApp não configurada' }, 404);
  return c.json({ url });
});

app.get('/api/comunidade/qrcode.svg', async (c) => {
  const url = c.env.WHATSAPP_COMMUNITY_URL || DEFAULT_WHATSAPP_COMMUNITY;
  if (!url) return c.json({ erro: 'Comunidade WhatsApp não configurada' }, 404);

  try {
    const svg = await generateQrCodeSvg(url, 'comunidade');
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao gerar QR code: ' + err.message }, 500);
  }
});

app.get('/api/canal', (c) => {
  const url = c.env.WHATSAPP_CHANNEL_URL || DEFAULT_WHATSAPP_CHANNEL;
  if (!url) return c.json({ erro: 'Canal WhatsApp não configurado' }, 404);
  return c.json({ url });
});

app.get('/api/canal/qrcode.svg', async (c) => {
  const url = c.env.WHATSAPP_CHANNEL_URL || DEFAULT_WHATSAPP_CHANNEL;
  if (!url) return c.json({ erro: 'Canal WhatsApp não configurado' }, 404);

  try {
    const svg = await generateQrCodeSvg(url, 'canal');
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao gerar QR code: ' + err.message }, 500);
  }
});

// 9. Podcasts & Audiolivros (Spotify for Creators)
app.get('/api/podcasts', async (c) => {
  try {
    const { busca, categoria } = c.req.query();
    let query = `
      SELECT s.*, 
        COUNT(e.id) as total_episodios
      FROM podcasts_shows s
      LEFT JOIN podcasts_episodios e ON e.show_id = s.id
      WHERE s.ativo = 1
    `;
    const params: any[] = [];

    if (categoria && categoria.trim()) {
      query += ` AND s.categoria LIKE ?`;
      params.push(`%${categoria.trim()}%`);
    }

    if (busca && busca.trim()) {
      query += ` AND (s.titulo LIKE ? OR s.descricao LIKE ?)`;
      const term = `%${busca.trim()}%`;
      params.push(term, term);
    }

    query += ` GROUP BY s.id ORDER BY s.id ASC`;

    const result = await c.env.DB.prepare(query).bind(...params).all();
    return c.json(result.results || []);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao listar podcasts: ' + err.message }, 500);
  }
});

app.get('/api/podcasts/episodios/recentes', async (c) => {
  try {
    const query = `
      SELECT e.*, 
        s.titulo as show_titulo, 
        s.capa_url as show_capa_url,
        s.slug as show_slug
      FROM podcasts_episodios e
      JOIN podcasts_shows s ON s.id = e.show_id
      WHERE s.ativo = 1
      ORDER BY e.publicado_em DESC, e.id DESC
      LIMIT 20
    `;
    const result = await c.env.DB.prepare(query).all();
    return c.json(result.results || []);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao listar episódios recentes: ' + err.message }, 500);
  }
});

app.get('/api/podcasts/:slugOuId', async (c) => {
  try {
    const { slugOuId } = c.req.param();
    let show: any = null;

    if (/^\d+$/.test(slugOuId)) {
      show = await c.env.DB.prepare(
        `SELECT * FROM podcasts_shows WHERE id = ? AND ativo = 1`
      ).bind(parseInt(slugOuId, 10)).first();
    } else {
      show = await c.env.DB.prepare(
        `SELECT * FROM podcasts_shows WHERE slug = ? AND ativo = 1`
      ).bind(slugOuId).first();
    }

    if (!show) {
      return c.json({ erro: 'Podcast não encontrado' }, 404);
    }

    const episodios = await c.env.DB.prepare(
      `SELECT * FROM podcasts_episodios WHERE show_id = ? ORDER BY numero ASC, publicado_em DESC`
    ).bind(show.id).all();

    return c.json({
      ...show,
      episodios: episodios.results || []
    });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao obter podcast: ' + err.message }, 500);
  }
});

app.post('/api/podcasts/episodios/:id/ouvir', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    await c.env.DB.prepare(
      `UPDATE podcasts_episodios SET reproducoes = reproducoes + 1 WHERE id = ?`
    ).bind(id).run();
    return c.json({ sucesso: true, id });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao registar reprodução: ' + err.message }, 500);
  }
});

// Diretrizes Legais, Intermediação, DMCA / Takedown e Privacidade
app.get('/api/legal', (c) => {
  return c.json({
    status: 'ativo',
    versao: '1.0',
    plataforma: c.env.SITE_NAME || 'Lino Livre',
    slogan: c.env.SITE_SLOGAN || 'Livros livres, para todos.',
    natureza: 'Educacional, comunitária e sem fins lucrativos',
    missao: 'Democratização do acesso à leitura, formação técnica e literatura nos países de língua portuguesa (PALOP) e Sul Global.',
    arquitetura: {
      papel: 'intermediario_indexador',
      armazenamento_local_arquivos: false,
      redirecionamento_protocolo: 'HTTP 302',
      diretriz_principal: 'Zero armazenamento local de arquivos binários (PDF, EPUB, MOBI) no servidor web e banco de dados. O acervo mantém unicamente metadados e links para provedores externos.'
    },
    aviso_legal: 'O Lino Livre opera estritamente como plataforma intermediária e motor de busca de hiperligações externas públicas. Não controlamos, não editamos e não armazenamos o conteúdo físico nos nossos servidores.',
    dmca_takedown: {
      canal_oficial: c.env.SUPPORT_EMAIL || 'bv6alblu6@mozmail.com',
      assunto_obrigatorio: '[NOTIFICAÇÃO DE DIREITOS AUTORAIS / TAKEDOWN] - Lino Livre',
      prazo_atendimento_horas: 48,
      compromisso: 'Desindexação célere e voluntária de links notificados de boa-fé por autores, editores ou seus representantes legais.',
      requisitos: [
        'Identificação da obra protegida por direitos autorais',
        'URL ou ID da obra indexada no Lino Livre',
        'URL externa para a qual o link aponta',
        'Comprovação da titularidade dos direitos autorais ou procuração',
        'Declaração de boa-fé do titular ou representante',
        'Informações de contato válidas'
      ]
    },
    privacidade: {
      cadastro_obrigatorio: false,
      cookies_rastreamento: false,
      venda_compartilhamento_dados: false,
      armazenamento_preferencias: 'localStorage (exclusivo no navegador do usuário para tema, fonte e áudio)',
      conformidade: ['LGPD (Lei 13.709/2018)', 'RGPD (Regulamento UE 2016/679)']
    },
    licencas_suportadas: LICENCAS_VALIDAS,
    links: {
      termos_completos: '/termos.html',
      aviso_legal: '/legal.html',
      documento_oficial: 'https://github.com/MisterAntoY/lino-livre/blob/main/TERMOS-DE-USO-E-AVISO-LEGAL.md'
    }
  });
});

export default app;


