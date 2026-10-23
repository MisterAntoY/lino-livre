/**
 * Controller de Sugestões da Comunidade — Lino Livre
 * Permite que visitantes sugiram obras abertas para moderação.
 */
const { getDatabase } = require('../database');
const { verificarUrlConformidade, validarUrlRedirecionamento } = require('../utils/urlValidator');

const LICENCAS_SUGERIVEIS = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];
const FORMATOS_SUGERIVEIS = ['pdf', 'epub', 'txt', 'html', 'mp3', 'mp4', 'outro'];

const sugestoesController = {
  criar(req, res) {
    try {
      const { titulo, autor_nome, ano_publicacao, categoria_id, licenca, formato, url_link, capa_url, sinopse } = req.body || {};

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

      // A capa também é um URL externo: sem validação poderia apontar para a
      // rede interna (e ser posteriormente buscada por proxies/ferramentas).
      let capaValida = null;
      if (capa_url) {
        try {
          capaValida = validarUrlRedirecionamento(String(capa_url).slice(0, 500));
        } catch (_) {
          return res.status(400).json({ erro: 'URL da capa inválida ou não autorizada' });
        }
      }

      const licencaFinal = LICENCAS_SUGERIVEIS.includes(licenca) ? licenca : 'outro';
      const formatoFinal = FORMATOS_SUGERIVEIS.includes(String(formato).toLowerCase())
        ? String(formato).toLowerCase()
        : 'outro';

      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO sugestoes (
          titulo, autor_nome, ano_publicacao, categoria_id, licenca, formato,
          url_link, capa_url, sinopse, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
      `);

      const anoNum = parseInt(ano_publicacao, 10);
      const anoFinal = Number.isInteger(anoNum) && anoNum > 0 && anoNum <= 2100 ? anoNum : null;
      const categoriaNum = parseInt(categoria_id, 10);
      const categoriaFinal = Number.isInteger(categoriaNum) && categoriaNum > 0 ? categoriaNum : null;

      const resultado = stmt.run(
        titulo.trim().slice(0, 250),
        autor_nome ? String(autor_nome).trim().slice(0, 150) : null,
        anoFinal,
        categoriaFinal,
        licencaFinal,
        formatoFinal,
        urlValida,
        capaValida,
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
      console.error('[sugestoesController]', err);
      return res.status(500).json({ erro: 'Erro ao listar sugestões' });
    }
  }
};

module.exports = sugestoesController;
