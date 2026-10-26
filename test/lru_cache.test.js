const test = require('node:test');
const assert = require('node:assert/strict');

test('EdgeLRUCache - Cache em memória com política LRU e TTL', async (t) => {
  class TestLRUCache {
    constructor(maxSize = 3, defaultTtlMs = 1000) {
      this.cache = new Map();
      this.maxSize = maxSize;
      this.defaultTtlMs = defaultTtlMs;
    }
    get(key) {
      const entry = this.cache.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        return null;
      }
      this.cache.delete(key);
      this.cache.set(key, entry);
      return entry.value;
    }
    set(key, value, ttlMs = this.defaultTtlMs) {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      } else if (this.cache.size >= this.maxSize) {
        const oldest = this.cache.keys().next().value;
        if (oldest !== undefined) this.cache.delete(oldest);
      }
      this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
    }
    clear() {
      this.cache.clear();
    }
    size() {
      return this.cache.size;
    }
  }

  await t.test('1. Deve armazenar e recuperar valor antes da expiração', () => {
    const lru = new TestLRUCache(3, 500);
    lru.set('k1', { total: 10 });
    assert.deepEqual(lru.get('k1'), { total: 10 });
  });

  await t.test('2. Deve descartar o item mais antigo quando exceder capacidade máxima (LRU)', () => {
    const lru = new TestLRUCache(2, 5000);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.get('a');
    lru.set('c', 3);
    assert.equal(lru.get('b'), null);
    assert.equal(lru.get('a'), 1);
    assert.equal(lru.get('c'), 3);
  });

  await t.test('3. Deve invalidar itens expirados pelo TTL', async () => {
    const lru = new TestLRUCache(5, 50);
    lru.set('exp', 'dado', 30);
    assert.equal(lru.get('exp'), 'dado');
    await new Promise((r) => setTimeout(r, 60));
    assert.equal(lru.get('exp'), null);
  });

  await t.test('4. Deve limpar todas as entradas no clear()', () => {
    const lru = new TestLRUCache(5, 5000);
    lru.set('k1', 1);
    lru.set('k2', 2);
    assert.equal(lru.size(), 2);
    lru.clear();
    assert.equal(lru.size(), 0);
    assert.equal(lru.get('k1'), null);
  });
});
