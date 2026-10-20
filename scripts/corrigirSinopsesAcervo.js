/**
 * Correcção de corrupção textual nas sinopses do gerador do Acervo GitHub.
 * Aplica substituições determinísticas ao ficheiro do gerador e regenera.
 */
const fs = require('node:fs');

const P = 'scripts/gerarGithubLivrosSeed.js';
let s = fs.readFileSync(P, 'utf-8');

// ── 1) Categorias inválidas ────────────────────────────────────────────────
const CATS = [
  ["['Cência de Dados & Inteligência Artificial'", "['Ciência de Dados & Inteligência Artificial'"],
  ["['Apoio Pedagógica & Filosofia'", "['Apoio Pedagógico & Filosofia'"],
  ["['Apoio Pedagógico &Philosophia'", "['Apoio Pedagógico & Filosofia'"]
];

// ── 2) Corrupções de texto ─────────────────────────────────────────────────
const TEXTO = [
  // bartbussmann
  ["Biblioteca de eBooks da comunidade LessWrong:Zz reunindoUZ obras sobre racionalidade, epistemologia, decisionismo ephilosophia técnica.",
   "Biblioteca de eBooks da comunidade LessWrong, reunindo obras sobre racionalidade, epistemologia, decisionismo e filosofia técnica."],
  // grimoire-kindle
  ["Coleção de mais de mil livros eletrónicos preparados para Kindle, 才 catalogados por género e nível de dificuldade.",
   "Coleção de mais de mil livros eletrónicos preparados para Kindle, catalogados por género e nível de dificuldade."],
  // zhangbc/eBooks
  ["Coleção de eBooks chineses clássicos de informática, com foco em classics de TI como o、内部 de(kernel) e redes.",
   "Coleção de eBooks chineses clássicos de informática, com foco em kernels, redes e arquitectura de sistemas."],
  // napkin
  ["que explica a análise infinitesimal de forma prática e可视化.",
   "que explica a análise infinitesimal de forma prática e visual."],
  // ThinkPython
  ["com exercícios eoly cada capítulo.", "com exercícios em cada capítulo."],
  // google-sre-ebook
  ["— a.ops manual de engenharia de fiabilidade de sites do Google,",
   "— o manual de engenharia de fiabilidade de sites do Google,"],
  // Data-Science-Books
  ["com foco em análise exploratória, visualização e学问 estatística aplicada.",
   "com foco em análise exploratória, visualização e estatística aplicada."],
  // mkdocs
  ["Lista de projectos e pluginsurine MkDocs,", "Lista de projectos e plugins MkDocs,"],
  // typemill
  ["com plugin de，左右 exportación e tema editorial.",
   "com plugin de exportação e tema editorial."],
  // PatMorin/ods
  ["com走近 implementação e análise de complexidade.",
   "com implementação prática e análise de complexidade."],
  // ghazal
  ["com o corpus deVehicle ghazal em formato legível por máquina.",
   "com o corpus de ghazal em formato legível por máquina."],
  // LiX
  ["capaz de produzir dissertações,papers, manuais, romances e jornais",
   "capaz de produzir dissertações, papers, manuais, romances e jornais"],
  // phodal/fe
  ["um livro sobre a carreira de engenheiro frontend: competências,inating e crescimento no ecossistema web.",
   "um livro sobre a carreira de engenheiro frontend: competências, attitude e crescimento no ecossistema web."],
  // phodal/growth-ebook
  ["Growth Engineering: The Definitive Guide — guia definitivo de engenharia de crescimento em frontend, backend e dados.",
   "Growth Engineering: The Definitive Guide — guia definitivo de engenharia de crescimento em frontend, backend e dados."],
  // chinese-poetry-api
  ["诗泉 — API de alto desempenho para poesia clássica chinesa, com pesquisa full-text e metadados de cada poema.",
   "诗泉 — API de alto desempenho para a poesia clássica chinesa, com pesquisa de texto integral e metadados de cada poema."]
];

let aplicadas = 0;
let falhas = [];

for (const [de, para] of [...CATS, ...TEXTO]) {
  if (s.includes(de)) { s = s.replace(de, para); aplicadas++; }
  else falhas.push(de.slice(0, 60));
}

fs.writeFileSync(P, s, 'utf-8');
console.log(`✔ ${aplicadas} correcções aplicadas ao gerador`);
if (falhas.length) {
  console.log(`⚠ ${falhas.length} padrões não encontrados:`);
  falhas.forEach(f => console.log('   •', f));
}
