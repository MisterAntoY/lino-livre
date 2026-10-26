const LICENCAS_VALIDAS = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];
const PAGINA_MAXIMA = 2000;

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

module.exports = {
  LICENCAS_VALIDAS,
  PAGINA_MAXIMA,
  normalizarCapaUrl,
  normalizarUrlSegura,
  obterDimensoes
};
