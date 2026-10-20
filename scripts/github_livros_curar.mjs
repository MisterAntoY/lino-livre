/**
 * Curadoria — funde os pools, classifica por TOPICS (sinal primário) e
 * exclui software conhecido. Produz a lista final de candidatos a
 * repositório de livros, ordenada por qualidade editorial.
 */
import fs from 'node:fs';

const p1 = JSON.parse(fs.readFileSync('.scratch/gh-livros.json', 'utf-8'));
const p2 = JSON.parse(fs.readFileSync('.scratch/gh-livros-pool2.json', 'utf-8'));

const pool = new Map();
for (const r of [...p1, ...p2]) if (!pool.has(r.full_name)) pool.set(r.full_name, r);

// ── Topics que indicam genuinamente ACERVO/LITERATURA ─────────────────────
const TOPIC_LIVRO = new Set([
  'ebooks', 'ebook', 'epub', 'mobi', 'kindle', 'books', 'book', 'bookshelf',
  'library', 'literature', 'literatura', 'livros', 'libros', 'libro', 'biblioteca',
  'textbook', 'textbooks', 'poetry', 'poesia', 'poem', 'novels', 'novel',
  'fiction', 'ficcao', 'ficção', 'public-domain', 'publicdomain', 'gutenberg',
  'standardebooks', 'openlibrary', 'audiobook', 'audiobooks', 'book-data',
  'bookscovers', 'metadata-books', 'book-metadata', 'free-books', 'reading',
  'reader', 'read', 'comic-books', 'comics', 'manga', 'manhwa', 'manhua',
  'short-stories', 'fantasy-books', 'history-books', 'science-books',
  'chinese-literature', 'chinese-poetry', 'classical-literature',
  'world-literature', 'african-literature', 'portuguese-literature',
  'lusofonia', 'lusophone', 'open-access', 'open-access-book', 'archiv',
  'archive', 'webarchive', 'ebooks-reader', 'ebook-reader', 'calibre',
  'book-collection', 'novel-collection', 'manga-collection', 'audiobook-collection',
  'classics', 'romance', 'horror-books', 'scifi-books', 'mystery-books',
  'biography', 'philosophy-books', 'history', 'science', 'technology',
  'programming-books', 'books-free', 'epub-books', 'ebooks-library',
  'book-index', 'bibliography', 'dictionaries', 'dictionaries-books'
]);

// ── Topics que indicam SOFTWARE (excluir se dominarem) ─────────────────────
const TOPIC_SOFTWARE = new Set([
  'android', 'ios', 'app', 'apps', 'application', 'plugin', 'plugins', 'theme',
  'themes', 'docker', 'kubernetes', 'server', 'self-hosted', 'selfhosted',
  'frontend', 'backend', 'api', 'sdk', 'cli', 'cli-app', 'terminal', 'desktop',
  'cross-platform', 'electron', 'flutter', 'react', 'vue', 'python', 'javascript',
  'typescript', 'golang', 'rust-lang', 'java', 'kotlin', 'swift', 'dart',
  'csharp', 'php', 'ruby', 'rails', 'wordpress', 'chrome-extension',
  'browser-extension', 'userscript', 'discord-bot', 'telegram-bot', 'opds',
  'calibre-plugin', 'kindle-plugin', 'koreader-plugin', 'regex', 'awesome-list',
  'awesome-lists', 'awesome', 'curated-list', 'tutorial', 'tutorials',
  'learning-resources', 'interview-questions', 'algorithms', 'leetcode',
  'cheatsheet', 'roadmap', 'interview', 'learning', 'tutorial-repo', 'examples'
]);

// ── Palavras-chave do título/descrição ─────────────────────────────────────
const PALAVRAS_LIVRO = [
  'book', 'books', 'ebook', 'ebooks', 'epub', 'mobi', 'literature', 'novel',
  'novels', 'poetry', 'poetry', 'poesia', 'poemas', 'poems', 'prose', 'fiction',
  'classics', 'classic', 'textbook', 'library', 'bookshelf', 'anthology',
  'gutenberg', 'standard ebooks', 'standardebooks', 'public domain', 'livros',
  'livro', 'biblioteca', 'literatura', 'romance', 'crónica', 'cronica', 'conto',
  'contos', 'novela', 'poesia', 'acervo', 'leitura', 'reader', 'read',
  'book', 'readme', 'manuscript', 'corpus', 'biblio', 'bibliography', 'canon',
  'obras', 'complete works', 'full text'
];

const PALAVRAS_SOFTWARE = [
  'reader for', 'ebook reader', 'epub reader', 'converter', 'convert ', 'parser',
  'plugin for', 'calibre plugin', 'app for', 'application for', 'server for',
  'tool to', 'library for', 'cli for', 'telegram bot', 'discord bot', 'browser extension',
  'chrome extension', 'downloader', 'download', 'sync your', 'manager',
  'bookshelf app', 'theme', 'icon set', 'color scheme', 'wallpaper',
  'sdk', 'framework', 'backend', 'boilerplate', 'starter kit', 'template'
];

const norm = (s) => (s || '').toLowerCase();

function classificar(r) {
  const topics = (r.topics || []).map(norm);
  const desc = norm(`${r.nome} ${r.descricao}`);
  const sinais = [];
  let score = 0;

  // 1) Topics de livro
  const tl = topics.filter(t => TOPIC_LIVRO.has(t));
  const ts = topics.filter(t => TOPIC_SOFTWARE.has(t));
  if (tl.length) { score += tl.length * 9; sinais.push(`topics: ${tl.slice(0, 4).join(', ')}`); }
  if (ts.length && tl.length === 0) { score -= ts.length * 10; }
  else if (ts.length > tl.length) { score -= (ts.length - tl.length) * 6; }

  // 2) Palavras-chave
  const pl = PALAVRAS_LIVRO.filter(p => desc.includes(p));
  const ps = PALAVRAS_SOFTWARE.filter(p => desc.includes(p));
  if (pl.length) { score += pl.length * 7; sinais.push(`palavras: ${pl.slice(0, 3).join(', ')}`); }
  if (ps.length) { score -= ps.length * 9; sinais.push(`(software: ${ps.slice(0, 2).join(', ')})`); }

  // 3) Tamanho do acervo (livros stored = repo grande)
  if (r.tamanho_kb > 5000) { score += 18; sinais.push(`acervo ${(r.tamanho_kb / 1024).toFixed(0)} MB`); }
  else if (r.tamanho_kb > 800) { score += 10; sinais.push(`${(r.tamanho_kb / 1024).toFixed(0)} MB`); }
  else if (r.tamanho_kb > 150) { score += 4; }

  // 4) Qualidade editorial
  score += Math.min(r.estrelas / 40, 35);
  if (r.licenca && r.licenca !== 'NOASSERTION') score += 12;
  if (r.descricao) score += 4;
  if (r.atualizado && Date.now() - new Date(r.atualizado) < 730 * 86400e3) score += 8;

  return { score: Math.round(score), sinais, nLivroTopics: tl.length, nSoftwareTopics: ts.length };
}

const avaliados = [...pool.values()]
  .filter(r => !r.fork && !r.archived && r.estrelas >= 8)
  .map(r => ({ ...r, ...classificar(r) }))
  .filter(r => r.score > 12)
  .sort((a, b) => b.score - a.score || b.estrelas - a.estrelas);

fs.writeFileSync('.scratch/gh-livros-curados.json', JSON.stringify(avaliados, null, 2));

console.log(`Pool fundido: ${pool.size} | Candidatos: ${avaliados.length}\n`);
console.log('═'.repeat(130));
avaliados.slice(0, 200).forEach((r, i) => {
  console.log(
    `${String(i + 1).padStart(3)}. ${r.full_name.padEnd(44)} ⭐${String(r.estrelas).padStart(6)} ` +
    `${r.linguagem.padEnd(10)} ${(r.licenca || 'n/a').padEnd(12)} ${String(r.score).padStart(4)}  ${r.sinais.slice(0, 2).join(' | ').slice(0, 58)}`
  );
});
