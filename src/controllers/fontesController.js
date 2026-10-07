const { getDatabase } = require('../database');
const { executarImportacao } = require('../services/importer');

function listar(req, res) {
  try {
    const db = getDatabase();
    const fontes = db.prepare('SELECT id, slug, nome, tipo, url_base, ativa FROM fontes WHERE ativa = 1 ORDER BY id ASC').all();
    res.json(fontes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar fontes: ' + err.message });
  }
}

function iniciarImportacao(req, res) {
  try {
    const db = getDatabase();
    const { fonte_id, fonte: fonteInput, query } = req.body;

    let fonte;
    if (fonte_id) {
      fonte = db.prepare('SELECT * FROM fontes WHERE id = ?').get(fonte_id);
    } else if (fonteInput) {
      fonte = db.prepare('SELECT * FROM fontes WHERE slug = ? OR nome = ?').get(fonteInput, fonteInput);
    } else {
      // Default para Project Gutenberg se não especificado
      fonte = db.prepare("SELECT * FROM fontes WHERE slug = 'gutenberg'").get();
    }

    if (!fonte) {
      return res.status(400).json({ erro: 'Fonte informada não existe ou está inativa' });
    }

    const termoBusca = (query || 'literatura').trim();

    const insertJob = db.prepare(`
      INSERT INTO import_jobs (fonte_id, query, status, total, processados)
      VALUES (?, ?, 'pendente', 0, 0)
    `);
    const jobResult = insertJob.run(fonte.id, termoBusca);
    const jobId = jobResult.lastInsertRowid;

    // Disparar importação assíncrona sem travar a resposta HTTP
    setImmediate(() => {
      executarImportacao(jobId, fonte.slug, termoBusca).catch(err => {
        console.error(`Erro no job ${jobId}:`, err);
      });
    });

    res.status(202).json({
      job_id: jobId,
      status: 'pendente',
      fonte: fonte.slug,
      query: termoBusca
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao iniciar importação: ' + err.message });
  }
}

function obterStatusImportacao(req, res) {
  try {
    const db = getDatabase();
    const job = db.prepare(`
      SELECT j.*, f.slug AS fonte_slug, f.nome AS fonte_nome
      FROM import_jobs j
      LEFT JOIN fontes f ON f.id = j.fonte_id
      WHERE j.id = ?
    `).get(req.params.id);

    if (!job) {
      return res.status(404).json({ erro: 'Job de importação não encontrado' });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao consultar status da importação: ' + err.message });
  }
}

module.exports = {
  listar,
  iniciarImportacao,
  obterStatusImportacao
};
