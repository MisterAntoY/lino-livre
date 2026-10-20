/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GitHub — Recolha de Repositórios de Livros (pool para curadoria)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Interroga a Search API do GitHub com um conjunto de consultas focadas em
 * livros (ebooks, domínio público, literatura, textbooks, bibliotecas
 * digitais), recolhe um pool grande de candidatos e filtra por qualidade:
 *
 *   • sem forks
 *   • sem repositórios arquivados
 *   • com licença declarada
 *   • com popularity mínima (estrelas)
 *   • sem duplicatas por full_name
 *
 * O resultado é um JSON intermédio para curadoria manual — este script
 * NÃO escreve na base de dados. A inserção é feita pelo seed data.
 *
 * AGENTS.md: apenas METADADOS. Nenhum ficheiro de livro é transferido.
 *
 * Uso:
 *   node scripts/github_livros_harvester.mjs
 *   node scripts/github_livros_harvester.mjs --out .scratch/gh-livros.json
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';

const UA = 'LinoLivre-GitHub-Harvester/1.0 (biblioteca digital aberta; educacional)';
const OUT = (() => {
  const i = process.argv.indexOf('--out');
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : '.scratch/gh-livros.json';
})();

const ESTRELAS_MIN = 12;
const PAUSA_MS = 6500;   // ~9 buscas/min → dentro do limite de 10/min

// ── Consultas ──────────────────────────────────────────────────────────────
// Cada consulta visa um segmento diferente do universo "livros no GitHub".
const CONSULTAS = [
  'topic:ebooks stars:>20',
  'topic:ebook stars:>15',
  'topic:free-books stars:>10',
  'topic:public-domain stars:>10',
  'topic:ebooks-collection stars:>5',
  'topic:ebook-collection stars:>5',
  'topic:books-collection stars:>10',
  'topic:literature stars:>50',
  'topic:textbooks stars:>80',
  'topic:libros stars:>5',
  'topic:livros stars:>5',
  'topic:biblioteca stars:>5',
  'topic:kindle stars:>20',
  'topic:calibre stars:>20',
  'topic:epub stars:>40',
  'topic:comics stars:>100',
  'topic:audiobooks stars:>30',
  'topic:lectura stars:>5',
  'topic:livros-digitais stars:>2',
  'topic:ebook-reader stars:>300',
  'topic:poetry stars:>100',
  'topic:novels stars:>50',
  'topic:scifi-books stars:>10',
  'topic:openlibrary stars:>10',
  'topic:gutenberg stars:>10',
  'topic:standardebooks stars:>5',
  'epub books collection in:name,description stars:>20',
  'public domain books in:name,description stars:>25',
  'ebooks library in:description stars:>40',
  'corpus books text in:description stars:>20',
  'livros digitais isbn in:description stars:>5',
  'free books library offline in:description stars:>30',
  'book dataset download in:description stars:>50'
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function buscar(termo, pagina = 1) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(termo)}` +
    `&sort=stars&order=desc&per_page=100&page=${pagina}`;
  for (let tentativa = 1; tentativa <= 4; tentativa++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
      });
      if (res.status === 403 || res.status === 429) {
        const espera = 20000 * tentativa;
        console.warn(`   ⚠ rate-limit (${res.status}) — aguarda ${espera / 1000}s`);
        await sleep(espera);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (tentativa === 4) throw err;
      await sleep(4000 * tentativa);
    }
  }
  return { items: [] };
}

/** Verifica se o repositório contém de facto livros (heurística sobre metadados). */
function pareceLivros(repo) {
  const texto = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
  const sinais = [
    'book', 'livro', 'livros', 'ebook', 'ebooks', 'epub', 'mobi', 'kindle',
    'literature', 'literatura', 'novel', 'romance', 'poetry', 'poesia', 'poem',
    'textbook', 'library', 'biblioteca', 'read', 'reader', 'gutenberg', 'shelf',
    'bookshelf', 'libri', 'biblio', 'reading', 'author', 'autor', 'story',
    'stories', 'ficção', 'ficcao', 'fantasy', 'sci-fi', 'poemas', 'crónica', 'cronica'
  ];
  return sinais.some(s => texto.includes(s));
}

function qualidade(repo) {
  let q = 0;
  q += Math.min(repo.stargazers_count / 50, 40);          // popularidade
  if (repo.license) q += 15;                              // licença declarada
  if (repo.description) q += 5;
  if (repo.pushed_at && Date.now() - new Date(repo.pushed_at) < 365 * 86400e3) q += 10;
  if (repo.size > 100) q += 5;                            // conteúdo substancial
  if (repo.topics && repo.topics.length >= 3) q += 5;
  if (repo.homepage) q += 3;
  return q;
}

async function main() {
  console.log('═'.repeat(78));
  console.log('📚 GitHub — Recolha de Repositórios de Livros');
  console.log('═'.repeat(78));
  console.log(`Consultas: ${CONSULTAS.length} | Estrelas mínimas: ${ESTRELAS_MIN}\n`);

  const pool = new Map();   // full_name → repo
  const porConsulta = {};

  for (let i = 0; i < CONSULTAS.length; i++) {
    const termo = CONSULTAS[i];
    process.stdout.write(`   [${String(i + 1).padStart(2)}/${CONSULTAS.length}] ${termo.slice(0, 46).padEnd(48)}`);
    try {
      const json = await buscar(termo);
      const items = json.items || [];
      let novos = 0;
      for (const r of items) {
        if (pool.has(r.full_name)) continue;
        pool.set(r.full_name, r);
        novos++;
      }
      porConsulta[termo] = { total: items.length, novos };
      console.log(`${String(items.length).padStart(4)} results (+${novos} novos)`);
    } catch (err) {
      console.log(`⚠ ${String(err.message).slice(0, 60)}`);
    }
    if (i < CONSULTAS.length - 1) await sleep(PAUSA_MS);
  }

  // ── Filtros de qualidade ───────────────────────────────────────────────
  const filtrados = [...pool.values()].filter(r =>
    !r.fork &&
    !r.archived &&
    r.stargazers_count >= ESTRELAS_MIN &&
    r.license &&
    pareceLivros(r)
  );

  filtrados.sort((a, b) => qualidade(b) - qualidade(a));

  console.log(`\n─── Pool bruto: ${pool.size} repositórios ───`);
  console.log(`─── Após filtros: ${filtrados.length} repositórios ───`);

  const linguagens = {};
  for (const r of filtrados) linguagens[r.language || 'n/a'] = (linguagens[r.language || 'n/a'] || 0) + 1;
  console.log('\nLinguagens:', Object.entries(linguagens).sort((a, b) => b[1] - a[1]).slice(0, 14)
    .map(([k, v]) => `${k}:${v}`).join('  '));

  const saida = filtrados.map(r => ({
    full_name: r.full_name,
    nome: r.name,
    descricao: r.description || '',
    url: r.html_url,
    homepage: r.homepage || '',
    estrelas: r.stargazers_count,
    forks: r.forks_count,
    linguagem: r.language || '',
    licenca: r.license?.spdx_id || '',
    topics: r.topics || [],
    tamanho_kb: r.size,
    atualizado: r.pushed_at,
    criado: r.created_at,
    qualidade: Math.round(qualidade(r))
  }));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(saida, null, 2), 'utf-8');
  console.log(`\n✔ ${saida.length} repositórios gravados em ${OUT}`);

  console.log('\n─── Top 40 ───');
  saida.slice(0, 40).forEach((r, i) => {
    console.log(`${String(i + 1).padStart(3)}. ${r.full_name.padEnd(46)} ⭐${String(r.estrelas).padStart(6)}  ${r.linguagem.padEnd(12)} ${r.licenca.padEnd(12)} ${r.descricao.slice(0, 54)}`);
  });
}

main().catch(err => { console.error('❌', err); process.exit(1); });
