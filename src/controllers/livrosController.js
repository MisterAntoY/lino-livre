const { getDatabase } = require('../database');
const { validarUrlRedirecionamento, verificarUrlConformidade, DOMINIOS_PROIBIDOS } = require('../utils/urlValidator');

const LICENCAS_VALIDAS = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];

/**
 * Sanitiza termos para busca no SQLite FTS5.
 * Neutraliza caracteres especiais e operadores (AND, OR, NOT, NEAR, aspas, dois pontos, asteriscos, parênteses)
 * evitando exceções de sintaxe (SQLITE_ERROR: fts5: syntax error near ...) e ataques de DoS via busca.
 */
function sanitizarFts5(termo) {
  if (!termo || typeof termo !== 'string') return null;
  const tokens = termo
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return null;
  return tokens.map((t) => `"${t.replace(/"/g, '""')}"*`).join(' ');
}

function normalizarCapaUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.toLowerCase().includes('africanstorybook.org')) return null;
  if (trimmed.startsWith('http://')) {
    return 'https://' + trimmed.slice(7);
  }
  return trimmed;
}

function normalizarUrlSegura(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://')) {
    return 'https://' + trimmed.slice(7);
  }
  return trimmed;
}

// Dimensões pequenas (fontes/categorias) em cache: evita LIKE e JOINs na tabela livros
let cacheDimensoes = null;
let cacheDimensoesEm = 0;
const DIMENSOES_TTL = 5 * 60 * 1000;

function obterDimensoes(db) {
  const agora = Date.now();
  if (cacheDimensoes && agora - cacheDimensoesEm < DIMENSOES_TTL) return cacheDimensoes;
  cacheDimensoes = {
    fontes: db.prepare('SELECT id, slug FROM fontes').all(),
    categorias: db.prepare('SELECT id, nome FROM categorias').all()
  };
  cacheDimensoesEm = agora;
  return cacheDimensoes;
}

function listar(req, res) {
  try {
    const db = getDatabase();
    const { 
      busca, categoria_id, autor_id, idioma, formato, licenca, fonte, fonte_slug, colecao
    } = req.query;

    const rawPage = req.query.pagina || req.query.page || 1;
    const rawLimit = req.query.limite || req.query.limit || 24;

    const numPage = Math.max(1, parseInt(rawPage, 10) || 1);
    const numLimit = Math.min(100, Math.max(1, parseInt(rawLimit, 10) || 24));
    const offset = (numPage - 1) * numLimit;

    // Filtros aplicados exclusivamente sobre livros (sem JOINs e sem LIKE).
    // Permite COUNT(*) — em vez de COUNT(DISTINCT l.id) — e o uso dos índices
    // compostos de popularidade (leituras DESC, titulo ASC).
    const filtros = [];
    const params = [];

    // Busca FTS5 se o termo de busca for informado
    if (busca && busca.trim()) {
      const matchQuery = sanitizarFts5(busca);
      if (matchQuery) {
        filtros.push(`l.id IN (
          SELECT rowid FROM livros_fts WHERE livros_fts MATCH ?
        )`);
        params.push(matchQuery);
      }
    }

    const isTop100 = (categoria_id && (
      categoria_id === '🌟 Mais Lidos do Mundo' ||
      categoria_id === 'Mais Lidos do Mundo' ||
      String(categoria_id).includes('Mais Lidos') ||
      categoria_id === 'top100' ||
      categoria_id === 'mais_lidos'
    )) || (colecao === 'top100' || colecao === 'mais_lidos');

    if (isTop100) {
      filtros.push("(l.fonte_id_externo LIKE 'world-%')");
    } else if (categoria_id) {
      if (/^\d+$/.test(categoria_id)) {
        filtros.push('l.categoria_id = ?');
        params.push(categoria_id);
      } else {
        const ids = obterDimensoes(db).categorias
          .filter((cat) => cat.nome === categoria_id)
          .map((cat) => cat.id);
        if (ids.length === 0) {
          filtros.push('1=0');
        } else {
          filtros.push(`l.categoria_id IN (${ids.map(() => '?').join(',')})`);
          params.push(...ids);
        }
      }
    }

    if (autor_id) {
      filtros.push('l.autor_id = ?');
      params.push(autor_id);
    }

    if (idioma) {
      filtros.push('l.idioma = ?');
      params.push(idioma);
    }

    if (licenca) {
      filtros.push('l.licenca = ?');
      params.push(licenca);
    }

    const fonteFiltro = fonte_slug || fonte;
    let fonteIds = [];
    if (fonteFiltro) {
      const termo = String(fonteFiltro).toLowerCase();
      const dim = obterDimensoes(db);
      let ids = dim.fontes.filter((f) => f.slug.toLowerCase() === termo).map((f) => f.id);
      if (ids.length === 0) {
        ids = dim.fontes.filter((f) => f.slug.toLowerCase().includes(termo)).map((f) => f.id);
      }
      fonteIds = ids;
      if (ids.length === 0) {
        filtros.push('1=0');
      } else {
        filtros.push(`l.fonte_id IN (${ids.map(() => '?').join(',')})`);
        params.push(...ids);
      }
    }

    if (formato) {
      filtros.push('l.id IN (SELECT livro_id FROM links_livros WHERE formato = ?)');
      params.push(formato.toLowerCase());
    }

    const whereSql = filtros.length ? ` AND ${filtros.join(' AND ')}` : '';

    // Total para paginação: usa agregados pré-calculados quando o filtro é
    // simples (evita varrer 104k linhas). Fallback seguro se as tabelas
    // estatisticas/contadores ainda não existirem.
    let total = null;
    try {
      const semSubquery = filtros.filter((f) => !f.startsWith('l.id IN'));
      const simples = !busca && !formato;
      if (filtros.includes('1=0')) {
        total = 0;
      } else if (simples && semSubquery.length === 0) {
        const r = db.prepare("SELECT valor FROM estatisticas WHERE chave = 'total_livros'").get();
        if (r) total = Number(r.valor);
      } else if (simples && semSubquery.length === 1 && idioma) {
        const r = db.prepare("SELECT total FROM contadores WHERE dimensao = 'idioma' AND chave = ?").get(idioma);
        if (r) total = Number(r.total);
      } else if (simples && semSubquery.length === 1 && licenca) {
        const r = db.prepare("SELECT total FROM contadores WHERE dimensao = 'licenca' AND chave = ?").get(licenca);
        if (r) total = Number(r.total);
      } else if (simples && semSubquery.length === 1 && categoria_id && /^\d+$/.test(categoria_id)) {
        const r = db.prepare("SELECT total FROM contadores WHERE dimensao = 'categoria' AND chave = ?").get(String(categoria_id));
        if (r) total = Number(r.total);
      } else if (simples && semSubquery.length === 1 && fonteFiltro && fonteIds.length === 1) {
        const r = db.prepare("SELECT total FROM contadores WHERE dimensao = 'fonte' AND chave = ?").get(String(fonteIds[0]));
        if (r) total = Number(r.total);
      }
    } catch (_) {
      // Agregados indisponíveis: segue para a contagem exata.
    }
    if (total === null) {
      const totalRow = db.prepare(`SELECT COUNT(*) AS total FROM livros l WHERE 1=1${whereSql}`).get(...params);
      total = totalRow ? totalRow.total : 0;
    }

    const orderByClause = isTop100
      ? `CASE 
           WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN 0 
           WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN CAST(SUBSTR(l.fonte_id_externo, 14) AS INTEGER) 
           ELSE 9999 
         END ASC, l.leituras DESC, l.titulo ASC`
      : `l.leituras DESC, 
         CASE 
           WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN 1 
           WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN 2 
           WHEN l.categoria_id = 1 THEN 3 
           WHEN l.categoria_id = 19 THEN 4 
           WHEN l.categoria_id = 16 THEN 5 
           WHEN l.categoria_id = 12 THEN 6 
           ELSE 10 
         END ASC, 
         CASE 
           WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN CAST(SUBSTR(l.fonte_id_externo, 12) AS INTEGER) 
           WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN CAST(SUBSTR(l.fonte_id_externo, 14) AS INTEGER) 
           ELSE l.id 
         END ASC, 
         l.titulo ASC`;

    // Buscar itens paginados
    const selectQuery = `
      SELECT 
        l.id, l.titulo, l.subtitulo, l.isbn, l.ano_publicacao, l.idioma,
        l.sinopse, l.capa_url, l.paginas, l.licenca, l.leituras, l.criado_em,
        l.fonte_id_externo,
        a.id AS autor_id, a.nome AS autor_nome,
        c.id AS categoria_id, c.nome AS categoria_nome,
        f.slug AS fonte_slug, f.nome AS fonte_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      LEFT JOIN fontes f ON f.id = l.fonte_id
      WHERE 1=1${whereSql}
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    const livros = db.prepare(selectQuery).all(...params, numLimit, offset);

    // Anexar links para cada livro (otimizado: busca única em vez de N+1 queries)
    if (livros.length > 0) {
      const placeholders = livros.map(() => '?').join(',');
      const links = db.prepare(`
        SELECT livro_id, id, formato, url, tamanho_bytes, link_externo
        FROM links_livros
        WHERE livro_id IN (${placeholders})
      `).all(...livros.map(l => l.id));
      
      const linksPorLivro = {};
      for (const link of links) {
        if (!linksPorLivro[link.livro_id]) linksPorLivro[link.livro_id] = [];
        linksPorLivro[link.livro_id].push({
          id: link.id,
          formato: link.formato,
          url: normalizarUrlSegura(link.url),
          tamanho_bytes: link.tamanho_bytes,
          link_externo: link.link_externo
        });
      }
      for (const livro of livros) {
        livro.capa_url = normalizarCapaUrl(livro.capa_url);
        livro.links = linksPorLivro[livro.id] || [];
      }
    } else {
      for (const livro of livros) {
        livro.capa_url = normalizarCapaUrl(livro.capa_url);
      }
    }

    res.json({
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total,
      total_pages: Math.ceil(total / numLimit),
      total_paginas: Math.ceil(total / numLimit),
      data: livros
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar livros: ' + err.message });
  }
}

function obterPorId(req, res) {
  try {
    const db = getDatabase();
    const livro = db.prepare(`
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
    `).get(req.params.id);

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    livro.capa_url = normalizarCapaUrl(livro.capa_url);
    const linksBrutos = db.prepare('SELECT id, formato, url, tamanho_bytes, link_externo FROM links_livros WHERE livro_id = ?').all(livro.id);
    livro.links = linksBrutos.map(lnk => ({ ...lnk, url: normalizarUrlSegura(lnk.url) }));

    res.json(livro);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar livro: ' + err.message });
  }
}

function lerRedirect(req, res) {
  try {
    const db = getDatabase();
    const { id, linkId } = req.params;

    const link = db.prepare(`
      SELECT ll.*, l.titulo, l.conteudo_texto
      FROM links_livros ll
      JOIN livros l ON l.id = ll.livro_id
      WHERE ll.livro_id = ? AND ll.id = ?
    `).get(id, linkId);

    if (!link) {
      return res.status(404).json({ erro: 'Link de leitura não encontrado' });
    }

    // Incrementar contador de leituras atômico
    db.prepare('UPDATE livros SET leituras = leituras + 1 WHERE id = ?').run(id);

    // Redirect 302 para a fonte externa após validação estrita
    if (link.url) {
      const urlDestino = normalizarUrlSegura(validarUrlRedirecionamento(link.url));
      return res.redirect(302, urlDestino);
    }

    // Se for formato web local
    res.json({
      mensagem: 'Leitura iniciada',
      url: link.url,
      conteudo_texto: link.conteudo_texto
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao processar leitura: ' + err.message });
  }
}

function criar(req, res) {
  try {
    const { 
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca,
      conteudo_texto, links 
    } = req.body;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ erro: 'O título do livro é obrigatório' });
    }

    if (!licenca || !LICENCAS_VALIDAS.includes(licenca)) {
      return res.status(400).json({ 
        erro: `Licença inválida ou obrigatória. Valores aceitos: ${LICENCAS_VALIDAS.join(', ')}` 
      });
    }

    try {
      if (capa_url) {
        if (/^https?:\/\//i.test(capa_url)) {
          validarUrlRedirecionamento(capa_url);
        } else {
          verificarUrlConformidade(capa_url);
        }
      }
      if (Array.isArray(links)) {
        for (const l of links) {
          if (l?.url) validarUrlRedirecionamento(l.url);
        }
      }
    } catch (confErr) {
      return res.status(400).json({ erro: confErr.message });
    }

    const db = getDatabase();
    const insertLivro = db.prepare(`
      INSERT INTO livros (
        titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
        paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, conteudo_texto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertLivro.run(
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
    );

    const livroId = result.lastInsertRowid;

    // Inserir links se fornecidos
    if (Array.isArray(links)) {
      const insertLink = db.prepare(`
        INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const l of links) {
        if (l.formato && l.url) {
          insertLink.run(livroId, l.formato.toLowerCase(), l.url, l.tamanho_bytes || 0, l.link_externo ?? 1);
        }
      }
    }

    const novo = db.prepare('SELECT * FROM livros WHERE id = ?').get(livroId);
    novo.links = db.prepare('SELECT * FROM links_livros WHERE livro_id = ?').all(livroId);

    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar livro: ' + err.message });
  }
}

function atualizar(req, res) {
  try {
    const { 
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, licenca, conteudo_texto 
    } = req.body;

    const db = getDatabase();
    const livroAtual = db.prepare('SELECT id FROM livros WHERE id = ?').get(req.params.id);
    if (!livroAtual) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ erro: 'O título do livro é obrigatório' });
    }

    if (licenca && !LICENCAS_VALIDAS.includes(licenca)) {
      return res.status(400).json({ 
        erro: `Licença inválida. Valores aceitos: ${LICENCAS_VALIDAS.join(', ')}` 
      });
    }

    try {
      if (capa_url) {
        if (/^https?:\/\//i.test(capa_url)) {
          validarUrlRedirecionamento(capa_url);
        } else {
          verificarUrlConformidade(capa_url);
        }
      }
    } catch (confErr) {
      return res.status(400).json({ erro: confErr.message });
    }

    db.prepare(`
      UPDATE livros
      SET titulo = ?, subtitulo = ?, isbn = ?, ano_publicacao = ?, idioma = ?,
          sinopse = ?, capa_url = ?, paginas = ?, autor_id = ?, categoria_id = ?,
          licenca = COALESCE(?, licenca), conteudo_texto = ?
      WHERE id = ?
    `).run(
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
      req.params.id
    );

    const atualizado = db.prepare('SELECT * FROM livros WHERE id = ?').get(req.params.id);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar livro: ' + err.message });
  }
}

function gerarDestaqueBadge(livro) {
  if (!livro) return '⭐ Muito Procurado';
  const fExt = livro.fonte_id_externo || '';
  if (fExt === 'world-hist-1') return '🔥 #1 Mais Lido da História';
  if (fExt === 'world-hist-2') return '🔥 > 500M de Leitores';
  if (fExt === 'world-hist-3') return '📜 Tratado Histórico';
  if (fExt === 'world-hist-4') return '📖 Livro Histórico';
  if (fExt === 'world-hist-5') return '📖 Texto Sagrado Histórico';
  if (fExt === 'world-top100-1') return '⭐ > 200M de Cópias';
  if (fExt === 'world-top100-2') return '⭐ > 150M de Cópias';
  if (fExt === 'world-top100-3') return '🌟 > 140M de Leitores';
  if (fExt === 'world-top100-4') return '⭐ > 120M de Leitores';
  if (fExt === 'world-top100-5') return '⭐ > 100M de Cópias';
  if (fExt === 'world-top100-6') return '⭐ > 100M de Leitores';
  if (fExt === 'world-top100-7') return '⭐ > 100M de Leitores';
  if (fExt === 'world-top100-8') return '⭐ > 100M de Leitores';
  if (fExt === 'world-top100-11') return '⭐ > 80M de Leitores';
  if (fExt === 'world-top100-13') return '⭐ > 65M de Cópias';
  if (fExt === 'world-top100-14') return '⭐ > 50M de Cópias';
  if (fExt === 'world-top100-15') return '🌟 Distopia Universal';
  if (fExt === 'world-top100-17') return '🌟 Clássico Universal';

  const tit = (livro.titulo || '').toLowerCase();
  if (tit.includes('casmurro')) return '🏆 Obra-Prima da Lusofonia';
  if (tit.includes('brás cubas') || tit.includes('bras cubas')) return '📜 Marco do Realismo';
  if (tit.includes('lusíadas') || tit.includes('lusiadas')) return '⚓ Epopeia Nacional';
  if (tit.includes('cortiço') || tit.includes('cortico')) return '🏛️ Clássico do Naturalismo';
  if (tit.includes('iracema')) return '🌿 Clássico Indianista';
  if (tit.includes('mensagem')) return '📜 O Grande Épico Moderno';
  if (tit.includes('cidade e as serras')) return '📖 Clássico Realista';
  if (tit.includes('alienista')) return '🎭 Sátira Genial';

  if (livro.categoria_id === 1 || livro.categoria_id === 19) return '📜 Clássico Universal';
  if (livro.categoria_id >= 12 && livro.categoria_id <= 18) return '🌍 Tesouro de África';
  if (livro.categoria_id >= 6 && livro.categoria_id <= 11) return '💻 Manual de Referência';
  return '⭐ Muito Procurado';
}

function destaques(req, res) {
  try {
    const db = getDatabase();
    const tipo = (req.query.tipo || 'todos').toLowerCase();
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limite || req.query.limit || 12, 10)));

    let whereSql = '';
    let orderBySql = '';
    const params = [];

    if (tipo === 'lusofonia' || tipo === 'classicos') {
      whereSql = 'WHERE (l.categoria_id IN (1, 19) OR l.id IN (1, 2, 3, 4, 5, 828, 838))';
      orderBySql = 'ORDER BY l.leituras DESC, l.id ASC';
    } else if (tipo === 'africa') {
      whereSql = "WHERE (l.categoria_id IN (12, 13, 14, 15, 16, 17, 18) OR l.fonte_id_externo LIKE 'africa-%')";
      orderBySql = 'ORDER BY l.leituras DESC, l.id ASC';
    } else if (tipo === 'tech' || tipo === 'tecnologia') {
      whereSql = "WHERE (l.categoria_id IN (6, 7, 8, 9, 10, 11) OR l.fonte_id_externo LIKE 'github-%')";
      orderBySql = 'ORDER BY l.leituras DESC, l.id ASC';
    } else {
      // 'todos' ou 'mundo': Obras Mais Populares e Procuradas da História
      whereSql = `WHERE (
        l.fonte_id_externo LIKE 'world-hist-%' 
        OR l.fonte_id_externo LIKE 'world-top100-%'
        OR l.id IN (1, 2, 3)
      )`;
      orderBySql = `ORDER BY 
        CASE 
          WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN CAST(SUBSTR(l.fonte_id_externo, 12) AS INTEGER) 
          WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN 10 + CAST(SUBSTR(l.fonte_id_externo, 14) AS INTEGER) 
          WHEN l.id = 1 THEN 11 
          WHEN l.id = 2 THEN 12 
          ELSE 999 
        END ASC,
        l.leituras DESC, l.titulo ASC`;
    }

    const selectQuery = `
      SELECT 
        l.id, l.titulo, l.subtitulo, l.isbn, l.ano_publicacao, l.idioma,
        l.sinopse, l.capa_url, l.paginas, l.licenca, l.leituras, l.criado_em,
        l.fonte_id_externo,
        a.id AS autor_id, a.nome AS autor_nome,
        c.id AS categoria_id, c.nome AS categoria_nome,
        f.slug AS fonte_slug, f.nome AS fonte_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      LEFT JOIN fontes f ON f.id = l.fonte_id
      ${whereSql}
      ${orderBySql}
      LIMIT ?
    `;

    const livros = db.prepare(selectQuery).all(...params, limit);

    // Anexar links
    if (livros.length > 0) {
      const placeholders = livros.map(() => '?').join(',');
      const links = db.prepare(`
        SELECT livro_id, id, formato, url, tamanho_bytes, link_externo
        FROM links_livros
        WHERE livro_id IN (${placeholders})
      `).all(...livros.map(l => l.id));

      const linksPorLivro = {};
      for (const link of links) {
        if (!linksPorLivro[link.livro_id]) linksPorLivro[link.livro_id] = [];
        linksPorLivro[link.livro_id].push({
          id: link.id,
          formato: link.formato,
          url: normalizarUrlSegura(link.url),
          tamanho_bytes: link.tamanho_bytes,
          link_externo: link.link_externo
        });
      }
      for (const livro of livros) {
        livro.capa_url = normalizarCapaUrl(livro.capa_url);
        livro.links = linksPorLivro[livro.id] || [];
        livro.destaque_badge = gerarDestaqueBadge(livro);
      }
    } else {
      for (const livro of livros) {
        livro.capa_url = normalizarCapaUrl(livro.capa_url);
      }
    }

    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    return res.json({
      status: 'ok',
      tipo,
      total: livros.length,
      data: livros
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao obter livros em destaque: ' + err.message });
  }
}

function remover(req, res) {
  try {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM livros WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }
    res.json({ mensagem: 'Livro e links removidos com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover livro: ' + err.message });
  }
}

module.exports = {
  listar,
  destaques,
  obterPorId,
  lerRedirect,
  criar,
  atualizar,
  remover
};
