const { listar } = require('./livros/livrosListarController');
const { obterPorId, lerRedirect } = require('./livros/livrosLeituraController');
const { criar, atualizar, remover } = require('./livros/livrosMutacaoController');
const { destaques, gerarDestaqueBadge } = require('./livros/livrosDestaquesController');
const {
  LICENCAS_VALIDAS,
  PAGINA_MAXIMA,
  normalizarCapaUrl,
  normalizarUrlSegura,
  obterDimensoes
} = require('./livros/livrosHelpers');

module.exports = {
  listar,
  destaques,
  obterPorId,
  lerRedirect,
  criar,
  atualizar,
  remover,
  // Exportações auxiliares mantidas para retrocompatibilidade
  gerarDestaqueBadge,
  LICENCAS_VALIDAS,
  PAGINA_MAXIMA,
  normalizarCapaUrl,
  normalizarUrlSegura,
  obterDimensoes
};
