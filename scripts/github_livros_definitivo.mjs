/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SELEÇÃO DEFINITIVA — repositórios GitHub de livros
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Três vias de aceitação, todas com evidência concreta:
 *   A) ACERVO      → README lista ≥3 ficheiros de livro (epub/pdf/txt/mobi)
 *   B) CANÓNICO    → lista/coleção/corpus de livros (linguagem editorial)
 *   C) AUTORIA     → ferramenta cujo produto final é o livro (bookdown, epub…)
 *
 * Rejeita software de leitura/gestão/convertimento e homónimos enganadores
 * (ex.: python-poetry/poetry é um gestor de pacotes, NÃO um acervo).
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const casa = (padroes, texto) => padroes.some(p => p.test(texto));

const cur = JSON.parse(fs.readFileSync('.scratch/gh-livros-curados.json', 'utf-8'));
const ver = JSON.parse(fs.readFileSync('.scratch/gh-livros-verificados.json', 'utf-8'));
const vmap = new Map(ver.map(v => [v.full_name, v]));

const existentes = new Set(
  execSync(`sqlite3 biblioteca.db "SELECT url FROM links_livros WHERE url LIKE 'https://github.com/%';"`,
    { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })
    .split('\n').map(s => s.trim()).filter(Boolean)
    .map(u => u.replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '').toLowerCase())
);

// ── Assinatura de SOFTWARE (forte → rejeita) ───────────────────────────────
const SOFTWARE_RE = [
  /\b(reader|reader app)\b/i, /\bmanager\b/i, /\bserver\b/i, /\bself-?hosted\b/i,
  /\bplugin\b/i, /\bconverter\b/i, /\bconvert(er|ing)?\b/i, /\bparser\b/i,
  /\bdownloader\b/i, /\bbot\b/i, /\be-?reader firmware\b/i, /\bfirmware\b/i,
  /\bdesktop app\b/i, /\bandroid app\b/i, /\bmobile app\b/i, /\bflutter\b/i,
  /\bchrome extension\b/i, /\bbrowser extension\b/i, /\buserscript\b/i,
  /\bdiscord\b/i, /\btelegram\b/i, /\bopds server\b/i, /\bcalibre plugin\b/i,
  /\bkindle plugin\b/i, /\bkoreader plugin\b/i, /\blibrary management\b/i,
  /\bopac\b/i, /\bcirculation\b/i, /\bmetadata extractor\b/i, /\bcover extractor\b/i,
  /\ban audiobook\b/i, /\baudiobookshelf\b/i, /\bgenerate audiobooks\b/i,
  /\btext-to-speech\b/i, /\btts\b/i, /\bvoice cloning\b/i,
  /\bePub reader\b/i, /\bMobi reader\b/i, /\bPDF reader\b/i, /\bcomic reader\b/i,
  /\bmanga reader\b/i, /\bnovel reader\b/i, /\bbook reader\b/i,
  /\bnote-?taking\b/i, /\bscreenshot\b/i, /\bfile( )?minif/i, /\bcrash safe\b/i,
  /\blog(ger|ging)\b/i, /\bemail\b/i, /\bshell extension\b/i,
  /\bsave as ebook\b/i, /\bsend(ing)? (web)?pages\b/i, /\bto kindle\b/i,
  /\bword wise\b/i, /\bflashcards?\b/i, /\bword lists?\b/i,
  /\bpackage manager\b/i, /\bdependency manager\b/i, /\btask runner\b/i,
  /\bpython packaging\b/i, /\bconformance checker\b/i, /\btooltip\b/i,
  /\btranslate\b/i, /\btranslation\b/i, /\bcorrupted\b/i
];

// ── Assinatura de LIVRO (forte → aceita) ───────────────────────────────────
const LIVRO_RE = [
  /\bbook(s)?\b/i, /\bebook(s)?\b/i, /\bepub\b/i, /\bmobi\b/i, /\bliterature\b/i,
  /\bnovel(s)?\b/i, /\bpoetry\b/i, /\bpoesia\b/i, /\bpoems?\b/i, /\bprose\b/i,
  /\bfiction\b/i, /\btextbook(s)?\b/i, /\bbookshelf\b/i, /\bbookshelf\b/i,
  /\bclassics?\b/i, /\bromance\b/i, /\bpublic domain\b/i, /\bdominio publico\b/i,
  /\bdomínio público\b/i, /\bgutenberg\b/i, /\bstandard ?ebooks\b/i,
  /\bopenlibrary\b/i, /\bcorpus\b/i, /\bmanuscript\b/i, /\banthology\b/i,
  /\bshort stories\b/i, /\breading list\b/i, /\bcurated list of (the best )?books\b/i,
  /\bawesome books\b/i, /\bfree (books|ebooks)\b/i, /\bbook collection\b/i,
  /\blivros?\b/i, /\blivro\b/i, /\bbiblioteca\b/i, /\bbibliotheque\b/i,
  /\bliteratura\b/i, /\bcontos\b/i, /\bpoemas\b/i, /\btextbooks?\b/i,
  /\bbooks\b/i, /\bacervo\b/i, /\bcomics?\b/i, /\bmanga\b/i, /\baudiolivros?\b/i,
  /\bbookdata\b/i, /\bbook data\b/i, /\bbook metadata\b/i, /\bbookscovers\b/i
];

// ── Ferramentas de AUTORIA (aceite mesmo sem acervo) ──────────────────────
const AUTORIA_RE = [
  /bookdown/i, /honkit/i, /crowbook/i, /asciidoctor-epub3/i, /novelwriter/i,
  /epubcheck/i, /epub-press/i, /standard ?ebooks/i, /bookbindery/i,
  /mkdocs/i, /epub ?js/i, /ebook-?press/i, /manuscript/i
];

function classificar(r) {
  const v = vmap.get(r.full_name);
  const readme = (v?.sinais || []).join(' ');
  const nLivro = parseInt((readme.match(/(\d+) ficheiros de livro/) || [])[1] || '0', 10);

  const desc = `${r.nome || ''} ${r.descricao || ''}`;
  const topics = (r.topics || []).join(' ');

  const via = [];
  if (nLivro >= 3) via.push('A');
  if (casa(LIVRO_RE, desc) || casa(LIVRO_RE, topics)) via.push('B');
  if (casa(AUTORIA_RE, desc) || casa(AUTORIA_RE, topics)) via.push('C');

  // software → rejeita (mesmo que tenha sinal de livro)
  if (casa(SOFTWARE_RE, desc)) return null;

  // precisa de sinal de livro por TOPICS ou descrição forte
  const sinalForte = casa(LIVRO_RE, desc) || (r.topics || []).some(t =>
    /book|ebook|epub|literature|literatura|livro|novel|poetry|poesia|textbook|classics|romance|gutenberg|openlibrary|public-domain|comic|manga|audiobook|corpus|bibliography|bookshelf/.test(t.toLowerCase()));
  if (!sinalForte) return null;

  // score
  let score = 0;
  score += Math.min(r.estrelas / 40, 35);
  score += nLivro >= 3 ? 25 + Math.min(nLivro / 40, 25) : 0;
  if (r.licenca && r.licenca !== 'NOASSERTION') score += 12;
  if (r.descricao) score += 4;
  if (r.tamanho_kb > 2000) score += 12;
  else if (r.tamanho_kb > 500) score += 6;
  if (r.atualizado && Date.now() - new Date(r.atualizado) < 730 * 86400e3) score += 6;
  const nTopicosLivro = (r.topics || []).filter(t =>
    /book|ebook|epub|literature|livro|novel|poetry|textbook|classics|gutenberg|openlibrary|public-domain|comic|manga|audiobook|corpus|bookshelf/.test(t.toLowerCase())).length;
  score += nTopicosLivro * 4;

  return { score: Math.round(score), via: via.join('') || 'B', nLivro };
}

const vistos = new Set();
const finais = [];
for (const r of cur) {
  const chave = r.full_name.toLowerCase();
  if (vistos.has(chave)) continue;
  if (existentes.has(chave)) continue;
  const c = classificar(r);
  if (!c) continue;
  vistos.add(chave);
  finais.push({ ...r, ...c });
}
finais.sort((a, b) => b.score - a.score || b.estrelas - a.estrelas);

console.log(`Selecionados: ${finais.length}`);
const vias = {};
for (const f of finais) vias[f.via] = (vias[f.via] || 0) + 1;
console.log('Vias:', vias, '\n');
console.log('═'.repeat(128));
finais.slice(0, 140).forEach((r, i) => {
  console.log(`${String(i + 1).padStart(3)}. [${r.via}] ${r.full_name.padEnd(42)} ⭐${String(r.estrelas).padStart(6)} ${(r.licenca || 'n/a').padEnd(12)} ${String(r.score).padStart(4)} ${(r.descricao || '').slice(0, 58)}`);
});

fs.writeFileSync('.scratch/gh-livros-definitivo.json', JSON.stringify(finais, null, 2));
console.log(`\n✔ ${finais.length} → .scratch/gh-livros-definitivo.json`);
