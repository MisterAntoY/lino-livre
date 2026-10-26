/**
 * Cache LRU em memória de borda (isolate worker) com expiração por TTL.
 * Armazena consultas idênticas por 60 segundos economizando leituras na Cloudflare D1.
 */
export class EdgeLRUCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();
  private readonly maxSize: number;
  private readonly defaultTtlMs: number;

  constructor(maxSize = 200, defaultTtlMs = 60_000) {
    this.maxSize = maxSize;
    this.defaultTtlMs = defaultTtlMs;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    // Reordena chave para o final do Map (mais recentemente usada)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const livrosLruCache = new EdgeLRUCache<any>(200, 60_000);
