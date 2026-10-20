/**
 * Controller de Busca Federada (Fase 4)
 *
 * Motor distribuído que interroga múltiplos catálogos abertos em paralelo
 * e funde os resultados num ranking único (Reciprocal Rank Fusion).
 *
 * AGENTS.md: apenas metadados — nenhum ficheiro de obra é transferido
 * ou armazenado. Os links externos são devolvidos para redireccionamento 302.
 */
const { MotorFederado } = require('../services/federacaoBusca');
const { DOMINIOS_PROIBIDOS } = require('../utils/urlValidator');

function urlValidaParaFederacao(u) {
  if (!u || !/^https?:\/\//i.test(String(u))) return null;
  const lower = String(u).toLowerCase();
  for (const dom of DOMINIOS_PROIBIDOS) {
    if (lower.includes(dom)) return null;
  }
  return u;
}

let motor = null;

function obterMotor() {
  if (!motor) {
    motor = new MotorFederado({
      timeoutMs: parseInt(process.env.FEDERACAO_TIMEOUT_MS || '6000', 10),
      limitePorUpstream: parseInt(process.env.FEDERACAO_LIMITE_UPSTREAM || '20', 10),
      limiteFinal: parseInt(process.env.FEDERACAO_LIMITE_FINAL || '50', 10)
    });
  }
  return motor;
}

async function buscar(req, res) {
  try {
    const q = req.query.q || req.query.busca || req.query.termo || '';
    const limite = req.query.limite ? parseInt(req.query.limite, 10) : undefined;

    if (!String(q).trim()) {
      return res.status(400).json({ erro: 'Parâmetro "q" (termo de busca) é obrigatório' });
    }

    const m = obterMotor();
    const resultado = await m.buscar(String(q), { timeoutMs: undefined, limite });

    // Sanitização de output (defesa em profundidade)
    const seguros = (resultado.resultados || []).map(r => ({
      id: String(r.id || ''),
      titulo: String(r.titulo || '').replace(/[<>\"']/g, ''),
      autor: r.autor ? String(r.autor).replace(/[<>\"']/g, '') : null,
      ano: Number.isFinite(r.ano) ? r.ano : null,
      idioma: r.idioma ? String(r.idioma).slice(0, 12) : null,
      fonte: r.fonte,
      fontes: r.fontes,
      url: urlValidaParaFederacao(r.url),
      capa: /^https?:\/\//i.test(String(r.capa || '')) ? r.capa : null,
      sinopse: r.sinopse ? String(r.sinopse).replace(/[<>\"']/g, '').slice(0, 300) : null,
      licenca: r.licenca,
      score: r.score
    })).filter(r => r.url); // só resultados com link válido (redireccionamento 302)

    res.json({
      q: String(q).slice(0, 200),
      total: seguros.length,
      resultados: seguros,
      upstreams: resultado.upstreams,
      duracao_ms: resultado.duracao_ms,
      degradado: resultado.degradado,
      cache: resultado.cache === true,
      motor: 'federado-distribuido-rrf',
      k: 60
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro na busca federada: ' + err.message });
  }
}

function diagnostico(req, res) {
  try {
    const m = obterMotor();
    res.json({
      motor: 'federado-distribuido-rrf',
      k: 60,
      upstreams: m.diagnostico()
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no diagnóstico: ' + err.message });
  }
}

module.exports = { buscar, diagnostico };
