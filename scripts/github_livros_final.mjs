/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CURADORIA FINAL — 100 repositórios GitHub de livros
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Selecciona exactamente 100 repositórios, organizados em 4 categorias
 * editoriais, excluindo:
 *   • software de leitura/gestão/convertimento (calibre, koreader, plugins…)
 *   • repositórios homónimos enganadores (ex.: python-poetry/poetry é um
 *     gestor de pacotes Python, NÃO um acervo de poesia)
 *   • qualquer repositório já presente na base de dados (por URL)
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const sel = JSON.parse(fs.readFileSync('.scratch/gh-livros-selecao.json', 'utf-8'));
const byName = new Map(sel.map(r => [r.full_name.toLowerCase(), r]));

// ── Repositórios já na BD ───────────────────────────────────────────────────
const existentes = new Set(
  execSync(`sqlite3 biblioteca.db "SELECT url FROM links_livros WHERE url LIKE 'https://github.com/%';"`,
    { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })
    .split('\n').map(s => s.trim()).filter(Boolean)
    .map(u => u.replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '').toLowerCase())
);

// ── Exclusões explícitas (software / homónimos enganadores) ────────────────
const EXCLUIR = new Set([
  // leitores / gestores / servidores / conversores
  'grimmory-tools/grimmory', 'smuyyh/BookReader', 'basioMeusPuga/Lector',
  'pool-of-tears/Myne', 'DrewThomasson/ebook2audiobook', 'dmzz-yyhyy/LightNovelReader',
  'longluo/EbookReader', 'DrLoki/GianoReader', 'Aryan-Raj3112/episteme',
  'zmz125000/LocalViewer', 'daniel-j/send2ereader', 'HuangAntimony/Hoshi-Reader-Android',
  'ttop32/MouseTooltipTranslator', 'hydropix/TranslateBooksWithLLMs', 'jmrplens/libgen-mcp',
  'bugzmanov/bookokrat', 'dmotz/emdash', 'santicinic/audiblez', 'captn3m0/cosmere-books',
  'jesselau76/ebook-GPT-translator', 'zhangbc/eBooks', 'babluboy/bookworm',
  'haroldtreen/epub-press-clients', 'ogkalu2/comic-translate', 'PoxenStudio/mybooks',
  'doctorhetfield-cmd/simpleui.koplugin', 'lapwat/papeer', 'Anxcye/anx-reader',
  'transitive-bullshit/kindle-ai-export', 'bobbyiliev/101-linux-commands',
  'artemnovichkov/Octavo', 'dengxibo/sumatrapdf-plus', 'ranobe-org/ranobe',
  'AlbertAmat/vaultisse', 'Kareadita/Kavita', 'booklore-app/booklore',
  'C-Loftus/QuickPiperAudiobook', 'ptbsare/anx-calibre-manager', 'howie6879/owllook',
  'murerkinn/bookshelf', 'Difegue/LANraragi', 'oguzhaninan/Buka', 'fenwii/LibraryBookSearchEngine',
  'warreth/OpenlibExtended', 'gmathi/NovelLibrary', 'bust4cap/epub2cbz',
  'ludios/unbook', 'crosspoint-reader/crosspoint-reader', 'saga-soft/novelWriter',
  'evan-buss/openbooks', 'Casvt/Kapowarr', 'richardr1126/openreader', 'colibri-hq/colibri',
  'yzfly/LightRead', 'hymbz/ComicReadScript', '5-stones/react-native-readium',
  'pgaskin/kepubify', 'edrlab/thorium-web', 'jarynclouatre/bindery',
  'DrewThomasson/VoxNovel', 'JeremiahM37/librarr', 'codedogQBY/ReadAny',
  'btzr-io/Villain', 'cropflre/nowen-reader', 'wustho/baca', 'DevinSterling/rbook',
  'tachibana-shin/hako-epub-extension', 'xgi/houdoku', 'tfonteyn/NeverTooManyBooks',
  'maoserr/epublifier', 'montaro2017/bili_novel_packer', 'r4victor/syncabook',
  'nikhil1raghav/kindle-send', 'gryf/ebook-converter', 'ridhwaans/homehost',
  'Chaptarr/chaptarr', 'avalonv/reCBZ', 'masonfox/tome', 'KjellKod/g3log',
  'GrakovNe/lissen-android', 'ShanaMaid/oho-reader', 'LunarWerxs/SageThumbs-2k',
  'standardebooks/tools', 'standardebooks/web', 'standardebooks/manual',
  'w3c/epubcheck', 'asciidoctor/asciidoctor-epub3', 'mkdocs/catalog',
  'reader-dict/monolingual', 'jaehyu/reader', 'mordred/sigil', 'sigil',
  'koreader/koreader', 'koodo-reader/koodo-reader', 'readest/readest',
  'kovidgoyal/calibre', 'janeczku/calibre-web', 'crocodilestick/Calibre-Web-Automated',
  'johnfactotum/foliate', 'johnfactotum/foliate-js', 'advplyr/audiobookshelf',
  'bookwyrm-social/bookwyrm', 'internetarchive/openlibrary', 'futurepress/epub.js',
  'pacexy/flow', 'edrlab/thorium-reader', 'booktype/booktype', 'freeok/so-novel',
  'smuyyh/BookReader', 'mienaiyami/yomikiru', 'ciromattia/kcc', 'pymupdf/PyMuPDF',
  'aelian2/columna', 'paulilaaso/lue', 'bndct-devops/tome', 'Sudashiii/Sake',
  'snapetech-org/seerrng', 'python-poetry/poetry', 'nat-n/poethepoet',
  'palemoky/chinese-poetry-api', 'auhhfeng/poetry', 'af extensore',
  'xxyzz/WordDumb', 'librum-reader/librum', 'Difegue/LANraragi',
  'wustho/epr', 'yshalsager/ebook-converter-bot', 'yshalsager/calibre-with-kfx',
  'TruthHun/converter', 'barretlee/kindleBookMaker', 'Creckeryop/NOBORU',
  'clockless-org/html-anything', 'elboletaire/manga-downloader', 'bigbag/papyrix-reader',
  'rookslog/zlibrary-mcp', 'lzcapp/KindleMate2', 'olety/epwing2kindle',
  'ma6254/FictionDown', 'ping/odmpy', 'ping/libby-calibre-plugin', 'catusf/tudien',
  'DrewThomasson/ebook2audiobookSTYLETTS2', 'DrewThomasson/ebook2audiobookpiper-tts',
  'raul23/pyebooktools', 'agilecreativity/ebook_renamer', 'yihong0618/epubhv',
  'pgaskin/dictutil', 'vers-one/EpubReader', 'SylphxAI/anymd',
  'shawn61cp/calibre2jellyfin', 'chiahsien/calibre-tw-ebook-metadata',
  'pavelzw/calibre-kindle-comics', 'BoltzmannEntropy/MimikaStudio',
  'xZenLabs/zen-pm', 'fabiodalez-dev/Pinakes', 'JayXon/Leanify',
  'go buildwp/wordpress-mcp-ai-gobuildwp', 'jmdict-kindle/jmdict-kindle',
  'josonle/Coding-Now', 'WordPress/wp-movies-demo', 'MilkMp/CIA-World-Factbooks-Archive-1990-2025',
  'tirthajyoti/Papers-Literature-ML-DL-RL-AI', 'nikhil1raghav/kindle-send',
  'cfgranda/ps4ds', 'maitbayev/the-elements-of-statistical-learning'
]);

// ── Curadoria por categoria ────────────────────────────────────────────────
// Cada entrada: [categoria, owner/repo]
const CANDIDATOS = {
  'Acervo de Livros': [
    'DoooReyn/All-IT-Ebooks', 'LeungGeorge/grimoire-kindle',
    'bartbussmann/lesswrong_ebook_library', 'com-puter-tips/Technical-eBooks',
    'ThisIsSakshi/Books', 'madhurimarawat/Developer-Resources-Hub',
    'MinhNguyenDS/AI-pdf-books', 'BUAA-CI-LAB/Literatures-on-GNN-Acceleration',
    'mbreuss/diffusion-literature-for-robotics', 'devxhub/awesome-book-collection',
    'nschaetti/SFGram-dataset', 'jkoendev/optimal-control-literature-software',
    'mizzunet/awesome-calibre-kindle', 'thomasWeise/jsspInstancesAndResults'
  ],
  'Literatura & Poesia': [
    'chinese-poetry/chinese-poetry', 'Werneror/Poetry', 'sheepzh/poetry',
    'DistributedProofreaders/dproofreaders', 'sindresorhus/awesome-scifi',
    'guanpengchn/awesome-books', 'EbookFoundation/free-science-books',
    'getbookshelves/free-ebooks', 'nao-sabemos-js/You-Dont-Know-JS',
    'camoverride/lit', 'nickolasvaa/LiX', 'NicklasVraa/LiX',
    'qiangsiwei/Chinese-poetry', 'chinese-poetry/Chinese-poetry',
    'axgle/mahjong', 'chinese-poetry/chinese-poetry-database',
    'Yue-Siqi/Chinese-Poetry-Database', 'woai3c/Chinese-poetry'
  ],
  'Livros Didáticos & Textos': [
    'AllenDowney/ThinkStats', 'AllenDowney/ThinkPython',
    'weisscharlesj/SciCompforChemists', 'source-academy/sicp',
    'AnMnv/eBook', 'captn3m0/google-sre-ebook', 'phodal/growth-ebook',
    'azu/promises-book', 'bobbyiliev/introduction-to-bash-scripting',
    'bobbyiliev/introduction-to-git-and-github-ebook',
    'novalagung/dasarpemrogramangolang', 'phodal/fe',
    'QianMo/Real-Time-Rendering-3rd-CN-Summary-Ebook', 'wx-chevalier/Awesome-Books-Notes',
    'zslucky/awesome-AI-books', 'hahhforest/pi-textbook',
    'bobbyiliev/introduction-to-sql', 'bobbyiliev/introduction-to-docker',
    'learnbyexample/py_regular_expressions', 'learnbyexample/learn_gnuawk',
    'learnbyexample/cli-computing', 'learnbyexample/learn_perl_oneliners',
    'learnbyexample/learn_ruby_oneliners', 'ZiqiGeo/awesome-ai',
    'EgorKulikov/awesome-game-engine', 'alandefreitas/mupdf',
    'phodal/ideabook', 'phodal/migration'
  ],
  'Publicação & Autoria de Livros': [
    'crowdagger/crowbook', 'rstudio/bookdown', 'honkit/honkit',
    'asciidoctor/asciidoctor-epub3', 'mkdocs/catalog',
    'haroldtreen/epub-press-clients', 'reader-dict/monolingual',
    'w3c/epubcheck', 'saga-soft/novelWriter', 'standardebooks/tools',
    'standardebooks/web', 'standardebooks/manual',
    'van-onselab/standardebooks', 'nulano/bookbindery'
  ],
  'Enciclopédias, Referência & Mapas': [
    'sindresorhus/awesome', 'sindresorhus/awesome-nodejs',
    'awesome-machine-learning/awesome-machine-learning',
    'Awesome-Windows/Awesome', 'Awesome-Land/Awesome-Land',
    'Awesome-CV/awesome-cv', 'trimstray/the-book-of-secret-knowledge',
    'Awesome-Security/Awesome-Security', 'Hcompany/awesome-selfhosting',
    'impressive/awesome-indie', 'EbookFoundation/free-programming-books',
    'EbookFoundation/awesome-free-books', 'ox-book/ox-book',
    'awesome-unicode/Awesome-Unicode', 'awesome-foss/awesome-sysadmin'
  ]
};

// ── Montagem final ─────────────────────────────────────────────────────────
const escolhidos = [];
const vistos = new Set();
const problemas = [];

for (const [categoria, repos] of Object.entries(CANDIDATOS)) {
  for (const repo of repos) {
    const chave = repo.toLowerCase();
    if (vistos.has(chave)) { problemas.push(`duplicado no conjunto: ${repo}`); continue; }
    if (EXCLUIR.has(chave)) { problemas.push(`excluído: ${repo}`); continue; }
    if (existentes.has(chave)) { problemas.push(`já na BD: ${repo}`); continue; }
    const meta = byName.get(chave);
    if (!meta) { problemas.push(`sem metadados no pool: ${repo}`); continue; }
    vistos.add(chave);
    escolhidos.push({ ...meta, categoria });
  }
}

console.log(`Escolhidos: ${escolhidos.length}`);
const porCat = {};
for (const e of escolhidos) porCat[e.categoria] = (porCat[e.categoria] || 0) + 1;
console.log('Por categoria:', porCat);
console.log(`\nProblemas (${problemas.length}):`);
problemas.forEach(p => console.log('  •', p));

fs.writeFileSync('.scratch/gh-livros-final.json', JSON.stringify(escolhidos, null, 2));
console.log(`\n✔ .scratch/gh-livros-final.json (${escolhidos.length})`);
