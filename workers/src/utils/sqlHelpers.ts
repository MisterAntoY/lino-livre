const cacheTabelas = new WeakMap<object, { tabelas: Set<string>; timestamp: number }>();
const TABELAS_CACHE_TTL = 10 * 60 * 1000;

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
