/**
 * Controller de Sugestões da Comunidade — Lino Livre
 * Permite que visitantes sugiram obras abertas para moderação.
 */
const { getDatabase } = require('../database');
const { verificarUrlConformidade, validarUrlRedirecionamento } = require('../utils/urlValidator');

const sugestoesController = {
  criar(req, res) {
    try {
      const { titulo, autor_nome, ano_publicacao, categoria_id, licenca, formato, url_link, capa_url, sinopse } = req.body;

      if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 2) {
        return res.status(400).json({ erro: 'Título da obra é obrigatório' });
      }

      if (!url_link || typeof url_link !== 'string') {
        return res.status(400).json({ erro: 'URL de leitura pública ou página do acervo é obrigatória' });
      }

      // Validar segurança e conformidade da URL
      let urlValida;
      try {
        urlValida = validarUrlRedirecionamento(url_link);
      } catch (err) {
        return res.status(400).json({ erro: 'URL inválida: ' + err.message });
      }

      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO sugestoes (
          titulo, autor_nome, ano_publicacao, categoria_id, licenca, formato,
          url_link, capa_url, sinopse, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
      `);

      const resultado = stmt.run(
        titulo.trim().slice(0, 250),
        autor_nome ? String(autor_nome).trim().slice(0, 150) : null,
        ano_publicacao ? parseInt(ano_publicacao, 10) : null,
        categoria_id ? parseInt(categoria_id, 10) : null,
        licenca || 'outro',
        formato || 'html',
        urlValida,
        capa_url ? String(capa_url).trim().slice(0, 500) : null,
        sinopse ? String(sinopse).trim().slice(0, 1000) : null
      );

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Sugestão recebida com sucesso! Passará pela curadoria do Lino Livre antes de ser publicada.',
        id: resultado.lastInsertRowid
      });
    } catch (err) {
      console.error('[sugestoes] Erro ao registrar sugestão:', err);
      return res.status(500).json({ erro: 'Erro interno ao processar sugestão' });
    }
  },

  listar(req, res) {
    try {
      const db = getDatabase();
      const status = req.query.status || 'pendente';
      const sugestoes = db.prepare('SELECT * FROM sugestoes WHERE status = ? ORDER BY criado_em DESC LIMIT 50').all(status);
      return res.json(sugestoes);
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao listar sugestões: ' + err.message });
    }
  }
};

module.exports = sugestoesController;
