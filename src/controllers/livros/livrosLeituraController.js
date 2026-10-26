const { getDatabase } = require('../../database');
const { validarUrlRedirecionamento } = require('../../utils/urlValidator');
const { normalizarCapaUrl, normalizarUrlSegura } = require('./livrosHelpers');

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
    console.error('[livros.obterPorId]', err);
    res.status(500).json({ erro: 'Erro interno ao carregar livro' });
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

    // Não contar na cota: leitura de URLs web locais (ex.: obras em domínio
    // público com texto integral) também é leitura.
    const contarLeitura = () => {
      db.prepare('UPDATE livros SET leituras = leituras + 1 WHERE id = ?').run(id);
    };

    // Redirect 302 para a fonte externa após validação estrita. A validação
    // acontece ANTES do incremento: leitura bloqueada não conta leituras.
    if (link.url) {
      const urlDestino = normalizarUrlSegura(validarUrlRedirecionamento(link.url));
      contarLeitura();
      return res.redirect(302, urlDestino);
    }

    contarLeitura();

    // Se for formato web local
    res.json({
      mensagem: 'Leitura iniciada',
      url: link.url,
      conteudo_texto: link.conteudo_texto
    });
  } catch (err) {
    // Violações de URL (SSRF/política de compliance) são 400, com paridade
    // com o Cloudflare Worker — nunca um 500 interno com stack vazada.
    if (err && err.codigoHttp) {
      return res.status(err.codigoHttp).json({ erro: err.message });
    }
    console.error('[livros.lerRedirect]', err);
    res.status(500).json({ erro: 'Erro interno ao processar leitura' });
  }
}

module.exports = {
  obterPorId,
  lerRedirect
};
