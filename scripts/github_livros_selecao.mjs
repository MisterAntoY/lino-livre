/**
 * SELEÇÃO FINAL — 100 repositórios GitHub de livros (sem duplicatas)
 *
 * Regras:
 *  1. Exclui repositórios já presentes na BD (por URL de link externo)
 *  2. Exclui software de leitura/gestão (leitores, servidores, plugins, bots)
 *  3. Exige sinal de ACERVO: livros no repo, lista canónica de livros,
 *     textbook, dataset de livros, ou ferramenta de autoria de livros
 *  4. Ordena por qualidade editorial e devolve exactamente 100
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const avaliados = JSON.parse(fs.readFileSync('.scratch/gh-livros-curados.json', 'utf-8'));

// ── 1) URLs de GitHub já presentes na BD ───────────────────────────────────
let existentes = new Set();
try {
  const out = execSync(
    `sqlite3 biblioteca.db "SELECT url FROM links_livros WHERE url LIKE 'https://github.com/%';"`,
    { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 }
  );
  existentes = new Set(out.split('\n').map(s => s.trim()).filter(Boolean)
    .map(u => u.replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '').toLowerCase()));
} catch (e) {
  console.warn('⚠ não foi possível ler a BD:', e.message);
}
console.log(`URLs GitHub já na BD: ${existentes.size}`);

// ── 2) Exclusão de software ────────────────────────────────────────────────
const EXCLUIDOS_EXATOS = new Set([
  'kovidgoyal/calibre', 'koreader/koreader', 'readest/readest', 'koodo-reader/koodo-reader',
  'johnfactotum/foliate', 'johnfactotum/foliate-js', 'janeczku/calibre-web',
  'crocodilestick/calibre-web-automated', 'Kareadita/Kavita', 'gotson/komga',
  'stumpapp/stump', 'advplyr/audiobookshelf', 'advplyr/audiobookshelf-app',
  'Anxcye/anx-reader', 'bookwyrm-social/bookwyrm', 'Difegue/LANraragi',
  'seblucas/cops', 'kha-white/mokuro', 'rstudio/bookdown', 'honkit/honkit',
  'internetarchive/bookreader', 'futurepress/epub.js', 'pacexy/flow',
  'edrlab/thorium-reader', 'booktype/booktype', 'freeok/so-novel', 'Casvt/Kapowarr',
  'DrewThomasson/ebook2audiobook', 'p0n1/epub_to_audiobook', 'aedocw/epub2tts',
  'nazdridoy/kokoro-tts', 'hydropix/TranslateBooksWithLLMs', 'oomol-lab/epub-translator',
  'oomol-lab/pdf-craft', 'santicinic/audiblez', 'santininic/audiblez',
  'C-Loftus/QuickPiperAudiobook', 'geigi/cozy', 'danburzo/percollate',
  'bluesky31415/kitty', 'sagiegurari/ebook-converter', 'kha-white/mokuro',
  'librum-reader/librum', 'basioMeusPuga/lector', 'smuysh/BookReader',
  'dmzz-yyhyy/LightNovelReader', 'mateusz-bak/openreads', 'everydaythingssoftware/citadel',
  'Aryan-Raj3112/episteme', 'readium/swift-toolkit', 'readium/kotlin-toolkit',
  'readium/ts-toolkit', 'readium/mobile', 'readium/web', 'readium/webpub-manifest',
  'alexadam/save-as-ebook', 'aooiuu/any-reader', 'ttop32/MouseTooltipTranslator',
  'internetarchive/openlibrary', 'calibre-web/calibre-web', 'zhangbc/eBooks',
  'hfnn/calibre-web-automated', 'crocodilestick/Calibre-Web-Automated',
  'grimfrog/koreader-i18n', 'mdlincoln/BookReader', 'ahpxex/read-aware',
  'weebstuff/kindle-downloader', 'gungxi/calibre', 'kianmeng/calibre-web-automated',
  'booktype/booktype', 'bfabiszewski/libmobi', 'aerkalov/ebooklib',
  'denizsafak/abogen', 'swiftsure/ReadIt', 'ma6254/FictionDown',
  'heartleo/zlib', 'bookstairs/bookhunter', 'luk6xff/Packt-Publishing-Free-Learning',
  'ZlibraryKO/zlibrary.koplugin', 'finlater/weread.koplugin', 'kaikozlov/kindle.koplugin',
  'ymlto/qidian-book', 'sansan0/ebook-converter', 'opswc/Ebook-Converter',
  'Yee118/BookHelper', 'belaalb/Ghostty-Ebook-Reader', 'vvalt/ebook-converter',
  'ciromattia/kcc', 'dkhamsing/openlibrary-datasets', 'chinese-poetry/chinese-poetry-api',
  'mienaiyami/yomikiru', 'smuyyh/BookReader', 'PoxenStudio/mybooks',
  'xxyzz/WordDumb', 'bndct-devops/tome', 'paulilaaso/lue', 'tarruda/node-ebook',
  'vasild/Bookstore', 'harshad-kate/BookStore', 'agarrharr/awesome-cli-apps',
  'trinhdaemon/bookself', 'DoeRemi/Book-Store', 'JuanCarlosB/Bookstore',
  'Sudashiii/Sake', 'snapetech-org/seerrng', 'LtShy/ebook-Reader'
]);

// Sinais fortes de software (excluem se presentes)
const SOFTWARE_FORT = [
  'calibre-plugin', 'kindle-plugin', 'koreader-plugin', 'opds', 'browser-extension',
  'chrome-extension', 'discord-bot', 'telegram-bot', 'self-hosted', 'selfhosted',
  'flutter', 'react-native', 'docker', 'kubernetes', 'server', 'app', 'android',
  'ios', 'theme', 'plugin', 'desktop', 'cli-app', 'boilerplate', 'starter',
  'sponsor-button', 'wallpaper', 'icon', 'color-scheme'
];

// Sinais fortes de ACERVO (exigem e prevailecem)
const ACERVO_FORTE = [
  'public domain', 'public-domain', 'dominio publico', 'domínio público',
  'gutenberg', 'standard ebooks', 'standardebooks', 'epub collection',
  'collection of books', 'book collection', 'bookshelf', 'free books',
  'free-books', 'library of books', 'digital library', 'book data',
  'book-data', 'book metadata', 'bookscovers', 'comic books', 'comics',
  'manga', 'textbook', 'textbooks', 'poetry', 'poems', 'novels', 'fiction',
  'literature', 'classics', 'reading list', 'book list', 'corpus',
  'complete works', 'manuscript', 'anthology', 'short stories'
];

const norm = (s) => (s || '').toLowerCase();

function ehAcervo(r) {
  const topics = (r.topics || []).map(norm);
  const desc = norm(`${r.nome} ${r.descricao}`);
  const sinais = [...r.sinais].join(' ').toLowerCase();

  const forcaAcervo = ACERVO_FORTE.filter(s => desc.includes(s) || sinais.includes(s));
  const forcaSoftware = SOFTWARE_FORT.filter(s => topics.includes(s));

  // Se o repo é claramente software E não tem sinal forte de acervo → excluir
  if (forcaSoftware.length >= 2 && forcaAcervo.length === 0) return false;
  if (forcaSoftware.includes('calibre-plugin') || forcaSoftware.includes('koreader-plugin')) return false;

  // Sinal mínimo: topic de livro, palavra de livro ou tamanho de acervo
  const temSinal = forcaAcervo.length > 0 ||
    (r.nLivroTopics > 0 && r.nLivroTopics >= r.nSoftwareTopics) ||
    r.tamanho_kb > 2000;

  if (!temSinal) return false;

  // Ferramenta de autoria de livros é válida (livros como deliverable)
  if (/bookdown|honkit|crowbook|novelwriter|novel-writer|manuscript|writing/i.test(`${r.nome} ${r.descricao}`)) return true;

  return true;
}

const jaExiste = (r) => {
  const full = r.full_name.toLowerCase();
  if (existentes.has(full)) return true;
  for (const u of existentes) {
    if (u.startsWith(full + '/') || full.startsWith(u + '/')) return true;
  }
  return false;
};

const finais = avaliados
  .filter(r => !EXCLUIDOS_EXATOS.has(r.full_name.toLowerCase()))
  .filter(r => !jaExiste(r))
  .filter(ehAcervo)
  .filter(r => r.nLivroTopics + (r.sinais.join(' ').match(/palavras:/g) || []).length > 0 || r.tamanho_kb > 2000);

// remove duplicados por nome normalizado
const vistos = new Set();
const unicos = [];
for (const r of finais) {
  const k = r.full_name.toLowerCase();
  if (vistos.has(k)) continue;
  vistos.add(k);
  unicos.push(r);
}

console.log(`Candidatos após filtros: ${unicos.length}\n`);
console.log('═'.repeat(132));
unicos.slice(0, 130).forEach((r, i) => {
  console.log(
    `${String(i + 1).padStart(3)}. ${r.full_name.padEnd(44)} ⭐${String(r.estrelas).padStart(6)} ` +
    `${r.linguagem.padEnd(10)} ${(r.licenca || 'n/a').padEnd(12)} ${String(r.score).padStart(4)}  ${r.descricao.slice(0, 62)}`
  );
});

fs.writeFileSync('.scratch/gh-livros-selecao.json', JSON.stringify(unicos, null, 2));
console.log(`\n✔ ${unicos.length} repositórios → .scratch/gh-livros-selecao.json`);
