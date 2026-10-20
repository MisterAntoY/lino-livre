/**
 * Injeta as sinopses traduzidas do Acervo GitHub nos ficheiros de locale.
 * A chave é o ID do livro na base de dados (obtido da própria BD, por
 * repositório) — garantindo que a tradução fica sempre ligada ao livro certo.
 *
 * Uso: node scripts/injetarSinopsesGitHubLivros.js
 */
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const { githubLivrosTraducoes } = require('../src/database/githubLivrosTraducoes');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const LOCALES = ['pt', 'pt-br', 'en', 'es', 'de', 'zh', 'fr'];

// ── Mapa repo → id do livro (consultado à BD, não fixado no código) ────────
function mapaIds() {
  const out = execSync(
    `sqlite3 biblioteca.db "SELECT l.fonte_id_externo, l.id FROM livros l JOIN fontes f ON f.id=l.fonte_id WHERE f.slug='github-livros-acervo';"`,
    { encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024 }
  );
  const m = new Map();
  for (const linha of out.split('\n').map(s => s.trim()).filter(Boolean)) {
    const [repo, id] = linha.split('|');
    m.set(repo, parseInt(id, 10));
  }
  return m;
}

const ids = mapaIds();
console.log(`Livros do acervo GitHub na BD: ${ids.size}`);

// ── Sinopse base em PT (vinda do seed data) ────────────────────────────────
const { githubLivros } = require('../src/database/githubLivrosSeedData');
const sinopseBase = new Map(githubLivros.map(b => [b.fonteIdExterno, b.sinopse]));

// Verificação de integridade das traduções
const repos = [...ids.keys()];
const faltamTrad = repos.filter(r => !githubLivrosTraducoes[r]);
const tradOrfas = Object.keys(githubLivrosTraducoes).filter(r => !ids.has(r));
if (faltamTrad.length) {
  console.error(`✗ Sem tradução (${faltamTrad.length}):`, faltamTrad.join(', '));
  process.exit(1);
}
if (tradOrfas.length) {
  console.warn(`⚠ Traduções sem livro na BD (${tradOrfas.length}):`, tradOrfas.join(', '));
}
const localesFaltam = [];
for (const [repo, t] of Object.entries(githubLivrosTraducoes)) {
  for (const loc of LOCALES) {
    if (loc !== 'pt' && !t[loc]) localesFaltam.push(`${repo}:${loc}`);
  }
}
if (localesFaltam.length) {
  console.error(`✗ Traduções em falta (${localesFaltam.length}):`, localesFaltam.slice(0, 10).join(', '));
  process.exit(1);
}

// ── Injecção ───────────────────────────────────────────────────────────────
let totalInjetado = 0;
for (const loc of LOCALES) {
  const file = path.join(LOCALES_DIR, `${loc}.json`);
  if (!fs.existsSync(file)) { console.log(`[skip] ${loc}.json`); continue; }

  const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
  if (!json.synopses) json.synopses = {};

  let n = 0;
  for (const [repo, id] of ids) {
    const texto = loc === 'pt'
      ? (sinopseBase.get(repo) || githubLivrosTraducoes[repo].pt)
      : githubLivrosTraducoes[repo][loc];
    if (!texto) continue;
    json.synopses[String(id)] = texto;
    n++;
  }

  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
  totalInjetado += n;
  console.log(`[ok] ${loc}.json → +${n} sinopses (total ${Object.keys(json.synopses).length})`);
}

console.log(`\n✔ ${totalInjetado} sinopses injetadas em ${LOCALES.length} locales.`);
