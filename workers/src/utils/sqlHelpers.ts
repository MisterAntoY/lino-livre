const cacheTabelas = new WeakMap<object, { tabelas: Set<string>; timestamp: number }>();
const TABELAS_CACHE_TTL = 10 * 60 * 1000;

const FTS_MAX_CARACTERES = 120;
const FTS_MAX_TERMOS = 8;

export function sanitizarFts5(termo: string | undefined | null): string | null {
  if (!termo || typeof termo !== 'string') return null;
  const tokens = termo
    .slice(0, FTS_MAX_CARACTERES)
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const unicos = [...new Set(tokens)].slice(0, FTS_MAX_TERMOS);
  if (unicos.length === 0) return null;
  return unicos.map((t) => `"${t.replace(/"/g, '""')}"*`).join(' ');
}

export function escaparLike(valor: any): string {
  return String(valor || '').slice(0, 120).replace(/[\\%_]/g, '\\$&');
}

export function normalizarCapaUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.toLowerCase().includes('africanstorybook.org')) return null;
  if (trimmed.startsWith('http://')) {
    return 'https://' + trimmed.slice(7);
  }
  return trimmed;
}

export function normalizarUrlSegura(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://')) {
    return 'https://' + trimmed.slice(7);
  }
  return trimmed;
}

export async function tabelaExiste(db: any, nome: string): Promise<boolean> {
  const chave = db && typeof db === 'object' ? (db as object) : null;
  let reg = chave ? cacheTabelas.get(chave) : null;
  if (!reg || Date.now() - reg.timestamp > TABELAS_CACHE_TTL) {
    try {
      const res = await db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
      reg = {
        tabelas: new Set(((res.results || []) as any[]).map((r) => String(r.name).toLowerCase())),
        timestamp: Date.now()
      };
      if (chave) cacheTabelas.set(chave, reg);
    } catch {
      return false;
    }
  }
  return reg!.tabelas.has(nome.toLowerCase());
}

export async function registrarMutacaoAcervo(db: any): Promise<void> {
  if (!db || typeof db.prepare !== 'function') return;
  try {
    await db.prepare(`
      INSERT INTO estatisticas (chave, valor) VALUES ('versao_mutacoes', 1)
      ON CONFLICT(chave) DO UPDATE SET valor = valor + 1
    `).run();
  } catch (_) {}
}

export async function lerEstatistica(db: any, chave: string): Promise<number | null> {
  if (!db || typeof db.prepare !== 'function') return null;
  try {
    const row = await db.prepare('SELECT valor FROM estatisticas WHERE chave = ?').bind(chave).first();
    return row ? Number(row.valor) : null;
  } catch {
    return null;
  }
}

export async function lerContador(db: any, dimensao: string, chave: string): Promise<number | null> {
  if (!db || typeof db.prepare !== 'function') return null;
  try {
    const row = await db.prepare('SELECT total FROM contadores WHERE dimensao = ? AND chave = ?')
      .bind(dimensao, String(chave)).first();
    return row ? Number(row.total) : null;
  } catch {
    return null;
  }
}

export async function contarNaFts(db: any, termo: string): Promise<number | null> {
  if (!termo || !db || typeof db.prepare !== 'function') return null;
  const matchQuery = sanitizarFts5(termo);
  if (!matchQuery) return null;
  try {
    const row = await db.prepare(
      'SELECT COUNT(*) AS total FROM livros_fts WHERE livros_fts MATCH ?'
    ).bind(matchQuery).first();
    return row ? Number((row as any).total) : null;
  } catch {
    return null;
  }
}

export async function contadoresDe(db: any, dimensao: string): Promise<any[]> {
  if (!db || typeof db.prepare !== 'function') return [];
  try {
    const res = await db.prepare('SELECT chave, rotulo, total FROM contadores WHERE dimensao = ? ORDER BY total DESC')
      .bind(dimensao).all();
    return (res.results || []) as any[];
  } catch {
    return [];
  }
}
