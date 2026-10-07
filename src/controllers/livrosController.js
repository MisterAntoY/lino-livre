const { getDatabase } = require('../database');

function listar(req, res) {
  try {
    const db = getDatabase();
    const { busca, categoria_id, autor_id, formato } = req.query;

    let query = `
      SELECT 
        l.id, l.titulo, l.subtitulo, l.sinopse, l.isbn, l.ano_publicacao,
        l.formato, l.arquivo_url, l.capa_url, l.tamanho_mb,
        l.downloads_count, l.leituras_count, l.autor_id, l.categoria_id,
        a.nome AS autor_nome,
        c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE 1=1
    `;
    const params = [];

    if (busca && busca.trim()) {
      query += ` AND (l.titulo LIKE ? OR l.subtitulo LIKE ? OR l.sinopse LIKE ? OR a.nome LIKE ?)`;
      const term = `%${busca.trim()}%`;
      params.push(term, term, term, term);
    }

    if (categoria_id) {
      query += ` AND l.categoria_id = ?`;
      params.push(categoria_id);
    }

    if (autor_id) {
      query += ` AND l.autor_id = ?`;
      params.push(autor_id);
    }

    if (formato) {
      query += ` AND l.formato = ?`;
      params.push(formato);
    }

    query += ` ORDER BY l.downloads_count + l.leituras_count DESC, l.titulo ASC`;

    const livros = db.prepare(query).all(...params);
    res.json(livros);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar catálogo digital: ' + err.message });
  }
}

function obterPorId(req, res) {
  try {
    const db = getDatabase();
    const livro = db.prepare(`
      SELECT 
        l.*,
        a.nome AS autor_nome,
        c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE l.id = ?
    `).get(req.params.id);

    if (!livro) {
      return res.status(404).json({ erro: 'Livro digital não encontrado' });
    }

    res.json(livro);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar livro digital: ' + err.message });
  }
}

function criar(req, res) {
  try {
    const { 
      titulo, subtitulo, sinopse, isbn, ano_publicacao, formato, 
      arquivo_url, capa_url, conteudo_texto, tamanho_mb, autor_id, categoria_id 
    } = req.body;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ erro: 'O título do livro é obrigatório' });
    }

    const fmt = formato && ['PDF', 'EPUB', 'Web'].includes(formato) ? formato : 'PDF';
    const db = getDatabase();

    const result = db.prepare(`
      INSERT INTO livros (
        titulo, subtitulo, sinopse, isbn, ano_publicacao, formato,
        arquivo_url, capa_url, conteudo_texto, tamanho_mb, autor_id, categoria_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      titulo.trim(),
      subtitulo ? subtitulo.trim() : null,
      sinopse ? sinopse.trim() : null,
      isbn ? isbn.trim() : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      fmt,
      arquivo_url ? arquivo_url.trim() : null,
      capa_url ? capa_url.trim() : null,
      conteudo_texto ? conteudo_texto.trim() : null,
      tamanho_mb ? parseFloat(tamanho_mb) : 1.5,
      autor_id || null,
      categoria_id || null
    );

    const novo = db.prepare(`
      SELECT l.*, a.nome AS autor_nome, c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE l.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(novo);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ erro: 'Já existe um livro digital cadastrado com este ISBN' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar livro digital: ' + err.message });
  }
}

function atualizar(req, res) {
  try {
    const { 
      titulo, subtitulo, sinopse, isbn, ano_publicacao, formato, 
      arquivo_url, capa_url, conteudo_texto, tamanho_mb, autor_id, categoria_id 
    } = req.body;

    const db = getDatabase();
    const livroAtual = db.prepare('SELECT id FROM livros WHERE id = ?').get(req.params.id);
    if (!livroAtual) {
      return res.status(404).json({ erro: 'Livro digital não encontrado' });
    }

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ erro: 'O título do livro é obrigatório' });
    }

    const fmt = formato && ['PDF', 'EPUB', 'Web'].includes(formato) ? formato : 'PDF';

    db.prepare(`
      UPDATE livros
      SET titulo = ?, subtitulo = ?, sinopse = ?, isbn = ?, ano_publicacao = ?, formato = ?,
          arquivo_url = ?, capa_url = ?, conteudo_texto = ?, tamanho_mb = ?, autor_id = ?, categoria_id = ?
      WHERE id = ?
    `).run(
      titulo.trim(),
      subtitulo ? subtitulo.trim() : null,
      sinopse ? sinopse.trim() : null,
      isbn ? isbn.trim() : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      fmt,
      arquivo_url ? arquivo_url.trim() : null,
      capa_url ? capa_url.trim() : null,
      conteudo_texto ? conteudo_texto.trim() : null,
      tamanho_mb ? parseFloat(tamanho_mb) : 1.5,
      autor_id || null,
      categoria_id || null,
      req.params.id
    );

    const atualizado = db.prepare(`
      SELECT l.*, a.nome AS autor_nome, c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE l.id = ?
    `).get(req.params.id);

    res.json(atualizado);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ erro: 'Já existe um livro digital cadastrado com este ISBN' });
    }
    res.status(500).json({ erro: 'Erro ao atualizar livro digital: ' + err.message });
  }
}

function remover(req, res) {
  try {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM livros WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Livro digital não encontrado' });
    }
    res.json({ mensagem: 'Livro digital removido do catálogo com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover livro digital: ' + err.message });
  }
}

// ----------------------------------------------------------------------
// Distribuição Digital: Download e Leitura Online
// ----------------------------------------------------------------------
function registrarDownload(req, res) {
  try {
    const db = getDatabase();
    const livroId = req.params.id;
    const { aluno_nome, aluno_turma } = req.body || {};

    const livro = db.prepare('SELECT id, titulo, formato, arquivo_url, downloads_count FROM livros WHERE id = ?').get(livroId);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro digital não encontrado' });
    }

    // Incrementar contador de downloads
    db.prepare('UPDATE livros SET downloads_count = downloads_count + 1 WHERE id = ?').run(livroId);

    // Registrar log de acesso digital
    db.prepare(`
      INSERT INTO acessos_digitais (livro_id, tipo_acesso, aluno_nome, aluno_turma)
      VALUES (?, 'download', ?, ?)
    `).run(livroId, aluno_nome ? aluno_nome.trim() : 'Aluno Escolar', aluno_turma ? aluno_turma.trim() : null);

    res.json({
      mensagem: 'Download iniciado com sucesso!',
      arquivo_url: livro.arquivo_url || '#',
      titulo: livro.titulo,
      formato: livro.formato,
      total_downloads: livro.downloads_count + 1
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao processar download: ' + err.message });
  }
}

function lerOnline(req, res) {
  try {
    const db = getDatabase();
    const livroId = req.params.id;
    const { aluno_nome, aluno_turma } = req.body || {};

    const livro = db.prepare(`
      SELECT l.*, a.nome AS autor_nome, c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE l.id = ?
    `).get(livroId);

    if (!livro) {
      return res.status(404).json({ erro: 'Livro digital não encontrado' });
    }

    // Incrementar contador de leituras online
    db.prepare('UPDATE livros SET leituras_count = leituras_count + 1 WHERE id = ?').run(livroId);

    // Registrar log de acesso digital
    db.prepare(`
      INSERT INTO acessos_digitais (livro_id, tipo_acesso, aluno_nome, aluno_turma)
      VALUES (?, 'leitura_online', ?, ?)
    `).run(livroId, aluno_nome ? aluno_nome.trim() : 'Aluno Escolar', aluno_turma ? aluno_turma.trim() : null);

    res.json({
      livro: {
        id: livro.id,
        titulo: livro.titulo,
        subtitulo: livro.subtitulo,
        autor_nome: livro.autor_nome,
        categoria_nome: livro.categoria_nome,
        ano_publicacao: livro.ano_publicacao,
        formato: livro.formato,
        arquivo_url: livro.arquivo_url,
        conteudo_texto: livro.conteudo_texto || 'Conteúdo para leitura disponibilizado no formato ' + livro.formato + '.',
        leituras_count: livro.leituras_count + 1
      }
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao abrir livro para leitura: ' + err.message });
  }
}

module.exports = {
  listar,
  obterPorId,
  criar,
  atualizar,
  remover,
  registrarDownload,
  lerOnline
};
