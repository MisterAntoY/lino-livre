/**
 * Verificação de repositórios GitHub por leitura do README (raw.githubusercontent)
 * — identifica repos que contêm de facto LIVROS (ficheiros .epub/.pdf/.txt/
 * .djvu/.mobi ou pastas de obras), separando-os de simples ferramentas.
 */
import fs from 'node:fs';

const pool = JSON.parse(fs.readFileSync('.scratch/gh-livros.json', 'utf-8'));
const UA = 'Mozilla/5.0 (compatible; LinoLivre/1.0)';

// Extensões que indicam conteúdo de livro dentro do README (menções/listas)
const EXT = /\.(epub|mobi|azw3|djvu|pdf|fb2|chm|opus|zip|rar|7z)\b/gi;
// Extensões de texto completo transcrito
const TXT = /\.(txt|md|tex|org)\b/gi;

const strong = [
  'collection of books', 'collections of books', 'book collection', 'bookshelf',
  'public domain', 'domínio público', 'dominio publico', 'free ebooks',
  'free books', 'ebook collection', 'ebook library', 'digital library',
  'library of books', 'textbook', 'textbooks', 'open access books',
  'gutenberg project', 'standard ebooks', 'livre de', 'livros grátis',
  'livros gratis', 'biblioteca digital', 'book corpus', 'book metadata',
  'epub collection', 'epub books', 'audiobook', 'audiobooks', 'manuscript',
  'read the book', 'read online', 'novels', 'short stories', 'poetry collection',
  'complete works', 'complete text', 'outras obras', 'textbook of'
];

const weak = [
  'awesome', 'list of', 'curated', 'resources', 'tool', 'app', 'reader app',
  'converter', 'plugin', 'server', 'library for', 'tutorial', 'course', 'how to'
];

async function lerReadme(repo) {
  const ramos = ['main', 'master'];
  for (const ramo of ramos) {
    for (const nome of ['README.md', 'readme.md', 'README.MD', 'Readme.md', 'README.rst', 'README']) {
      const url = `https://raw.githubusercontent.com/${repo.full_name}/${ramo}/${nome}`;
      try {
        const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(12000) });
        if (res.ok) {
          const txt = await res.text();
          if (txt.length > 80) return txt;
        }
      } catch (_) { /* tenta próxima combinação */ }
    }
  }
  return null;
}

function classificar(repo, readme) {
  if (!readme) return { score: -1, sinais: [], temLivros: false };
  const baixo = readme.toLowerCase();
  const desc = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();

  const extLivro = (readme.match(EXT) || []).length;
  const extTexto = (readme.match(TXT) || []).length;

  let score = 0;
  const sinais = [];

  if (extLivro >= 5) { score += 40; sinais.push(`${extLivro} ficheiros de livro`); }
  else if (extLivro >= 1) { score += 20; sinais.push(`${extLivro} ficheiros de livro`); }

  const strongHits = strong.filter(s => desc.includes(s) || baixo.includes(s));
  if (strongHits.length) { score += strongHits.length * 6; sinais.push(...strongHits.slice(0, 3)); }

  // penaliza software
  const toolHits = weak.filter(s => {
    const re = new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return re.test(desc);
  });
  if (toolHits.length) { score -= toolHits.length * 7; sinais.push(`(software: ${toolHits.slice(0, 2).join(', ')})`); }

  if (extTexto >= 20) { score += 12; sinais.push(`${extTexto} ficheiros de texto/markdown`); }
  if (extTexto >= 60) { score += 10; sinais.push('massa de texto (manuscritos)'); }

  const temLivros = score > 12;
  return { score, sinais, temLivros };
}

async function main() {
  console.log(`A verificar ${pool.length} repositórios via README (raw.githubusercontent)...\n`);

  const out = [];
  const CONC = 12;
  let i = 0;

  async function worker(idx) {
    const repo = pool[idx];
    let readme = null;
    try { readme = await lerReadme(repo); } catch (_) {}
    const c = classificar(repo, readme);
    if (c.score > 0) {
      out.push({
        full_name: repo.full_name,
        nome: repo.nome,
        descricao: repo.descricao,
        url: repo.url,
        homepage: repo.homepage,
        estrelas: repo.estrelas,
        forks: repo.forks,
        linguagem: repo.linguagem,
        licenca: repo.licenca,
        topics: repo.topics,
        tamanho_kb: repo.tamanho_kb,
        atualizado: repo.atualizado,
        score: c.score,
        sinais: c.sinais,
        temLivros: c.temLivros,
        readme_len: readme ? readme.length : 0
      });
    }
  }

  const indices = [...pool.keys()];
  await Promise.all(Array.from({ length: CONC }, async (_, w) => {
    while (i < indices.length) {
      const idx = indices[i++];
      await worker(idx);
      if (i % 50 === 0) process.stdout.write(`   ...${i}/${pool.length}\n`);
    }
  }));

  out.sort((a, b) => b.score - a.score || b.estrelas - a.estrelas);
  fs.writeFileSync('.scratch/gh-livros-verificados.json', JSON.stringify(out, null, 2));

  const livros = out.filter(r => r.temLivros);
  console.log(`\nVerificados com README: ${out.length}/${pool.length}`);
  console.log(`Classificados como repositório DE LIVROS: ${livros.length}\n`);
  console.log('═'.repeat(125));
  livros.forEach((r, i) => {
    console.log(`${String(i + 1).padStart(3)}. ${r.full_name.padEnd(46)} ⭐${String(r.estrelas).padStart(6)} ${r.linguagem.padEnd(11)} ${(r.licenca || 'n/a').padEnd(13)} ${r.sinais.slice(0, 2).join(' | ').slice(0, 50)}`);
  });
}

main().catch(e => { console.error(e); process.exit(1); });
