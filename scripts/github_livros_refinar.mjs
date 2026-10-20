/**
 * Refinamento do pool GitHub: separa repositórios que CONTÊM livros
 * de ferramentas/aplicações de leitura (que são software, não acervo).
 */
import fs from 'node:fs';

const pool = JSON.parse(fs.readFileSync('.scratch/gh-livros.json', 'utf-8'));

// Sinais de "contém livros/acervo"
const CONTEUDO = [
  'book', 'livro', 'livros', 'ebook', 'ebooks', 'epub', 'mobi', 'azw3',
  'literature', 'literatura', 'novel', 'romance', 'poetry', 'poesia', 'poem',
  'textbook', 'libro', 'libri', 'biblio', 'shelf', 'bookshelf', 'library',
  'readings', 'leitor', 'leitura', 'biblioteca', 'classic', 'clássico', 'clássicos',
  'manuscript', 'text', 'corpus', 'prose', 'fiction', 'ficção', 'ficcao',
  'anthology', 'collection', 'acervo', 'public domain', 'domínio público',
  'dominio publico', 'gutenberg', 'openlibrary', 'story', 'stories', 'autor',
  'author', 'writers', 'writers', 'bookseller', 'bookmark', 'isbn'
];

// Sinais de "é software/ferramenta de leitura" (excluir)
const FERRAMENTA = [
  'reader for', 'ebook reader', 'ebook reader', 'reader app', 'reader that',
  'application to read', 'app to read', 'tool to read', 'software to read',
  'converter', 'convert ', 'parser', 'library for', 'library to',
  'plugin for calibre', 'calibre plugin', 'downloader', 'server for',
  'backend', 'api for', 'sdk', 'framework', 'theme', 'font', 'icon set',
  'color scheme', 'browser extension', 'telegram bot', 'discord bot',
  'management system', 'catalog manager', 'metadata editor', 'bookmark',
  'opds server', 'sync', 'backup'
];

const pareceConteudo = (r) => {
  const t = `${r.nome} ${r.descricao} ${(r.topics || []).join(' ')}`.toLowerCase();
  if (FERRAMENTA.some(s => t.includes(s))) return false;
  return CONTEUDO.some(s => t.includes(s));
};

const software = pool.filter(r => !pareceConteudo(r));
const conteudo = pool.filter(r => pareceConteudo(r));

console.log(`Total pool: ${pool.length}`);
console.log(`→ Possuem livros/acervo: ${conteudo.length}`);
console.log(`→ Ferramentas/software:  ${software.length}\n`);

console.log('═'.repeat(120));
console.log('CANDIDATOS A REPOSITÓRIO DE LIVROS (ordenado por qualidade)');
console.log('═'.repeat(120));
conteudo.forEach((r, i) => {
  console.log(
    `${String(i + 1).padStart(3)}. ${r.full_name.padEnd(48)} ⭐${String(r.estrelas).padStart(6)} ` +
    `${r.linguagem.padEnd(11)} ${(r.licenca || 'n/a').padEnd(13)} ${r.descricao.slice(0, 62)}`
  );
});

fs.writeFileSync('.scratch/gh-livros-conteudo.json', JSON.stringify(conteudo, null, 2));
fs.writeFileSync('.scratch/gh-livros-software.json', JSON.stringify(software, null, 2));
console.log('\n✔ .scratch/gh-livros-conteudo.json e .scratch/gh-livros-software.json');
