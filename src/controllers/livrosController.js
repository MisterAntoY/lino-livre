const { getDatabase } = require('../database');

const LICENCAS_VALIDAS = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];

function listar(req, res) {
  try {
    const db = getDatabase();
    const { 
      busca, categoria_id, autor_id, idioma, formato, licenca, fonte, fonte_slug
    } = req.query;

    const rawPage = req.query.pagina || req.query.page || 1;
    const rawLimit = req.query.limite || req.query.limit || 24;

    const numPage = Math.max(1, parseInt(rawPage, 10) || 1);
    const numLimit = Math.min(100, Math.max(1, parseInt(rawLimit, 10) || 24));
    const offset = (numPage - 1) * numLimit;

    let baseQuery = `
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      LEFT JOIN fontes f ON f.id = l.fonte_id
      WHERE 1=1
    `;
    const params = [];

    // Busca FTS5 se o termo de busca for informado
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

    // Contar total para paginação
    const totalRow = db.prepare(`SELECT COUNT(DISTINCT l.id) AS total ${baseQuery}`).get(...params);
    const total = totalRow ? totalRow.total : 0;

    // Buscar itens paginados
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

    const livros = db.prepare(selectQuery).all(...params, numLimit, offset);

    // Anexar links para cada livro
    const getLinksStmt = db.prepare('SELECT id, formato, url, tamanho_bytes, link_externo FROM links_livros WHERE livro_id = ?');
    for (const livro of livros) {
      livro.links = getLinksStmt.all(livro.id);
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

    livro.links = db.prepare('SELECT id, formato, url, tamanho_bytes, link_externo FROM links_livros WHERE livro_id = ?').all(livro.id);

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

    // Redirect 302 para a fonte externa
    if (link.url && link.url.startsWith('http')) {
      return res.redirect(302, link.url);
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
  obterPorId,
  lerRedirect,
  criar,
  atualizar,
  remover
};
