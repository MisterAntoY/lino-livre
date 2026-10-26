const { getDatabase } = require('../../database');
const { validarUrlRedirecionamento, verificarUrlConformidade } = require('../../utils/urlValidator');
const { LICENCAS_VALIDAS } = require('./livrosHelpers');

function criar(req, res) {
  try {
    const { 
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca,
      conteudo_texto, links 
    } = req.body || {};

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

    // Regra inviolável (AGENTS.md §1.4): texto integral só para domínio público.
    if (conteudo_texto && String(conteudo_texto).trim() && licenca !== 'dominio-publico') {
      return res.status(400).json({
        erro: 'O texto integral (conteudo_texto) só é permitido para obras em domínio público. Use licenca="dominio-publico" ou disponibilize apenas metadados e o link externo.'
      });
    }

    const db = getDatabase();
    const insertLivro = db.prepare(`
      INSERT INTO livros (\n        titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,\n        paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, conteudo_texto\n      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    `);

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
    console.error('[livros.criar]', err);
    res.status(500).json({ erro: 'Erro interno ao cadastrar livro' });
  }
}

function atualizar(req, res) {
  try {
    const { 
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, licenca, conteudo_texto 
    } = req.body || {};

    const db = getDatabase();
    const livroAtual = db.prepare('SELECT id, licenca FROM livros WHERE id = ?').get(req.params.id);
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

    // Regra inviolável (AGENTS.md §1.4): manter a licença coerente com o texto.
    const licencaEfetiva = licenca || livroAtual.licenca;
    if (conteudo_texto !== undefined && conteudo_texto !== null && String(conteudo_texto).trim() && licencaEfetiva !== 'dominio-publico') {
      return res.status(400).json({
        erro: 'O texto integral (conteudo_texto) só é permitido para obras em domínio público (licenca="dominio-publico").'
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
    console.error('[livros.atualizar]', err);
    res.status(500).json({ erro: 'Erro interno ao atualizar livro' });
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
    console.error('[livros.remover]', err);
    res.status(500).json({ erro: 'Erro interno ao remover livro' });
  }
}

module.exports = {
  criar,
  atualizar,
  remover
};
