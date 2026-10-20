/**
 * 2ª recolha — consultas muito específicas para repositórios que CONTÊM
 * livros (acervo de texto, coleções, listas canónicas de livros, corpora).
 */
import fs from 'node:fs';

const UA = 'LinoLivre-GitHub-Harvester/1.0 (biblioteca digital aberta; educacional)';
const PAUSA_MS = 6500;

const CONSULTAS = [
  // ── Coleções / acervos ──
  'awesome-books in:name stars:>40',
  'awesome books in:description stars:>60',
  'free-ebooks in:name stars:>10',
  'ebook-collection in:name stars:>5',
  'ebooks-collection in:name stars:>5',
  'public-domain-books in:name stars:>5',
  'book-collection in:name stars:>20',
  'books-in-md in:name stars:>5',
  'library of books in:description stars:>40',
  'digital library books in:description stars:>60',
  'epub collection in:description stars:>30',
  'complete works in:description stars:>20',
  'public domain literature in:description stars:>20',
  'gutenberg corpus in:description stars:>10',
  'openlibrary in:name,description stars:>20',
  'standardebooks in:name,description stars:>3',
  'internet archive books in:description stars:>30',
  'mirror of books in:description stars:>20',
  // ── Literatura e autores ──
  'topic:literature stars:>40',
  'topic:poetry stars:>80',
  'topic:classical-literature stars:>10',
  'topic:world-literature stars:>5',
  'topic:african-literature stars:>2',
  'topic:portuguese-literature stars:>2',
  'topic:lusofonia stars:>2',
  'topic:lusophone stars:>2',
  'topic:chinese-literature stars:>5',
  'topic:arabic-books stars:>5',
  'topic:persian-books stars:>5',
  'topic:indian-books stars:>5',
  'topic:book-data stars:>10',
  'topic:bookscovers stars:>10',
  'topic:metadata-books stars:>5',
  // ──Livros técnicos / didáticos (coerente com a restante coleção) ──
  'topic:ebook-reader stars:>1000',
  'topic:open-access-book stars:>5',
  'topic:textbook stars:>30',
  'topic:free-books stars:>5',
  'topic:ebooks-reader stars:>20',
  'topic:audiobook-collection stars:>5',
  'topic:comic-books stars:>30',
  'topic:manga-collection stars:>5',
  'topic:novel-collection stars:>5',
  'topic:short-stories stars:>20',
  'topic:fantasy-books stars:>10',
  'topic:history-books stars:>10',
  'topic:science-books stars:>10'
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function buscar(termo, pagina = 1) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(termo)}` +
    `&sort=stars&order=desc&per_page=100&page=${pagina}`;
  for (let t = 1; t <= 4; t++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
      });
      if (res.status === 403 || res.status === 429) {
        console.warn(`   ⚠ rate-limit — aguarda 20s`);
        await sleep(20000);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (t === 4) throw e;
      await sleep(4000 * t);
    }
  }
  return { items: [] };
}

const norm = (r) => ({
  full_name: r.full_name,
  nome: r.name,
  descricao: r.description || '',
  url: r.html_url,
  homepage: r.homepage || '',
  estrelas: r.stargazers_count,
  forks: r.forks_count,
  watchers: r.watchers_count,
  linguagem: r.language || '',
  licenca: r.license?.spdx_id || '',
  topics: r.topics || [],
  tamanho_kb: r.size,
  atualizado: r.pushed_at,
  criado: r.created_at,
  open_issues: r.open_issues_count,
  default_branch: r.default_branch
});

async function main() {
  console.log('═'.repeat(78));
  console.log('📚 Recolha-directional — repositórios de livros');
  console.log('═'.repeat(78));

  const pool = new Map();
  for (let i = 0; i < CONSULTAS.length; i++) {
    const termo = CONSULTAS[i];
    process.stdout.write(`   [${String(i + 1).padStart(2)}/${CONSULTAS.length}] ${termo.slice(0, 48).padEnd(50)}`);
    try {
      const json = await buscar(termo);
      const items = json.items || [];
      let n = 0;
      for (const r of items) {
        if (pool.has(r.full_name)) continue;
        pool.set(r.full_name, norm(r));
        n++;
      }
      console.log(`${String(items.length).padStart(4)} (+${n} novos)`);
    } catch (e) {
      console.log(`⚠ ${String(e.message).slice(0, 50)}`);
    }
    if (i < CONSULTAS.length - 1) await sleep(PAUSA_MS);
  }

  fs.writeFileSync('.scratch/gh-livros-pool2.json', JSON.stringify([...pool.values()], null, 2));
  console.log(`\n✔ Pool #2: ${pool.size} repositórios → .scratch/gh-livros-pool2.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
