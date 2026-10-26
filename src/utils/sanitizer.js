/**
 * Utilitários puros de sanitização e proteção de entradas para SQL e FTS5.
 * Previne SQL injection, DoS por wildcard flood e quebras de sintaxe no FTS5.
 */

const FTS_MAX_CARACTERES = 120;
const FTS_MAX_TERMOS = 8;

/**
 * Escapa metacaracteres de LIKE (% e _).
 * Sem isto, `busca=%a%b%c...` transforma o filtro em varredura com múltiplos wildcards (DoS de CPU).
 */
function escaparLike(valor) {
  return String(valor || '').slice(0, 120).replace(/[\\%_]/g, '\\$&');
}

/**
 * Sanitiza termos para busca no SQLite FTS5.
 * Neutraliza caracteres especiais e operadores (AND, OR, NOT, NEAR, aspas, dois pontos, asteriscos, parênteses)
 * evitando exceções de sintaxe (SQLITE_ERROR: fts5: syntax error near ...) e ataques de DoS via busca.
 */
function sanitizarFts5(termo) {
  if (!termo || typeof termo !== 'string') return null;
  const tokens = String(termo)
    .slice(0, FTS_MAX_CARACTERES)
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const unicos = [...new Set(tokens)].slice(0, FTS_MAX_TERMOS);
  if (unicos.length === 0) return null;
  return unicos.map((t) => `"${t.replace(/"/g, '""')}"*`).join(' ');
}

module.exports = {
  escaparLike,
  sanitizarFts5,
  FTS_MAX_CARACTERES,
  FTS_MAX_TERMOS
};
