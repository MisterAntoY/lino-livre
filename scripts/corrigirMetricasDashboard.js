/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Sincronização das Métricas Estáticas com o Acervo REAL
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Existem DUAS fontes de verdade, e cada ficheiro deve reflectir a sua:
 *
 *   • public/index.html   → o SQLite LOCAL de desenvolvimento (seed).
 *                           Valores: 997 obras / 641 autores / 20 categorias.
 *                           Em produção o JS substitui-os imediatamente por
 *                           /api/dashboard, servindo de placeholder sem "flash".
 *
 *   • workers/src/index.ts → o D1 REMOTO de PRODUÇÃO (`lino-livre-db`),
 *                           que tem um acervo significativamente maior.
 *                           O `resumo_estavel` (payload 503 de degradação) e o
 *                           `totalCatalogoConhecido` (fallback de /api/livros)
 *                           são lidos pelo utilizador final em produção, pelo
 *                           que têm de reflectir a produção — nunca o seed local.
 *
 * Nunca inventa números: se não conseguir ler a origem, aborta.
 *
 * Uso:
 *   node scripts/corrigirMetricasDashboard.js              → lê o D1 remoto
 *   node scripts/corrigirMetricasDashboard.js --local      → força SQLite local
 *   node scripts/corrigirMetricasDashboard.js --ambos      → D1 remoto + seed local
 * ═══════════════════════════════════════════════════════════════════════════
 */
const fs = require('node:fs');
const { execSync } = require('node:child_process');

const META = 10000000;
const ARQ_HTML = 'public/index.html';
const ARQ_WORKER = 'workers/src/index.ts';

const lerLocal = () => {
  const q = (sql) => execSync(`sqlite3 biblioteca.db "${sql}"`, { encoding: 'utf-8' }).trim();
  return {
    livros: parseInt(q('SELECT COUNT(*) FROM livros'), 10),
    autores: parseInt(q('SELECT COUNT(*) FROM autores'), 10),
    categorias: parseInt(q('SELECT COUNT(*) FROM categorias'), 10),
    cursos: parseInt(q('SELECT COUNT(*) FROM cursos'), 10),
    fontes: parseInt(q('SELECT COUNT(*) FROM fontes'), 10)
  };
};

const lerRemoto = () => {
  console.log('→ A ler os totais REAIS do D1 remoto (lino-livre-db)…');
  let out;
  try {
    out = execSync(
      `npx wrangler d1 execute lino-livre-db --remote --command ` +
      `"SELECT (SELECT COUNT(*) FROM livros) AS l, (SELECT COUNT(*) FROM autores) AS a, ` +
      `(SELECT COUNT(*) FROM categorias) AS c, (SELECT COUNT(*) FROM cursos) AS cu, ` +
      `(SELECT COUNT(*) FROM fontes) AS f;"`,
      { encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }
    );
  } catch (err) {
    console.error('\n✗ Não foi possível ler o D1 remoto (cota diária de leituras esgotada?).');
    console.error('  Use --local para gerar tudo a partir do SQLite de desenvolvimento.');
    process.exit(1);
  }
  const m = out.match(/"?l"?\s*:\s*(\d+)[\s\S]*?"?a"?\s*:\s*(\d+)[\s\S]*?"?c"?\s*:\s*(\d+)[\s\S]*?"?cu"?\s*:\s*(\d+)[\s\S]*?"?f"?\s*:\s*(\d+)/);
  if (!m) { console.error('✗ Resposta do D1 ilegível.'); process.exit(1); }
  return { livros: +m[1], autores: +m[2], categorias: +m[3], cursos: +m[4], fontes: +m[5] };
};

const pct = (n) => (n / META) * 100;
const brl = (n) => new Intl.NumberFormat('pt-AO').format(n);

/**
 * Aplica os totais ao placeholder estático do HTML.
 * Espelha a lógica de marcos de public/js/app.js (atualizarPlacarMeta):
 *   atingido → "reached" | primeiro não atingido → "active" | restantes → neutro
 */
function aplicarHtml(T) {
  let s = fs.readFileSync(ARQ_HTML, 'utf-8');
  s = s.replace(/aria-valuenow="\d+"/, `aria-valuenow="${T.livros}"`);
  s = s.replace(/id="placar-total-livros">[^<]*</, `id="placar-total-livros">${brl(T.livros)}<`);
  s = s.replace(/id="placar-porcentagem">[^<]*</, `id="placar-porcentagem">${pct(T.livros).toFixed(4)}% da meta<`);
  s = s.replace(/id="placar-stat-atual">[^<]*</, `id="placar-stat-atual">${brl(T.livros)}<`);
  s = s.replace(/id="placar-stat-faltam">[^<]*</, `id="placar-stat-faltam">${brl(META - T.livros)}<`);
  
  const scale = (T.livros / META).toFixed(5);
  s = s.replace(/id="placar-barra-progresso" style="[^"]*"/,
    `id="placar-barra-progresso" style="transform: scaleX(${scale});"`);
  s = s.replace(/aria-valuetext="[^"]*"/,
    `aria-valuetext="${brl(T.livros)} de 10.000.000 obras catalogadas (${pct(T.livros).toFixed(2)}%)"`);

  const marcos = [
    { id: 'milestone-1k', limiar: 1000, val: 1000 },
    { id: 'milestone-10k', limiar: 10000, val: 10000 },
    { id: 'milestone-100k', limiar: 100000, val: 100000 },
    { id: 'milestone-1m', limiar: 1000000, val: 1000000 }
  ];
  let proximoId = null;
  let proximoVal = 10000000;
  for (const m of marcos) {
    if (T.livros >= m.limiar) continue;
    if (proximoId === null) {
      proximoId = m.id;
      proximoVal = m.val;
    }
  }
  s = s.replace(/id="placar-stat-next-target">[^<]*</, `id="placar-stat-next-target">${brl(proximoVal)}<`);

  for (const m of marcos) {
    const classe = T.livros >= m.limiar ? 'reached' : (m.id === proximoId ? 'active' : '');
    s = s.replace(new RegExp(`<div class="milestone-step[^"]*" id="${m.id}"`),
      `<div class="milestone-step${classe ? ' ' + classe : ''}" id="${m.id}"`);
  }
  s = s.replace(/\s*<span class="milestone-tag"[^>]*>[^<]*<\/span>/g, '');
  if (proximoId) {
    s = s.replace(new RegExp(`(<div class="milestone-step active" id="${proximoId}"[\\s\\S]*?<span class="milestone-text">)`),
      `$1\n              <span class="milestone-tag" data-i18n="ui.goal.nextMilestone">Próximo</span>`);
  }
  fs.writeFileSync(ARQ_HTML, s, 'utf-8');
  return proximoId;
}

/** Aplica os totais de PRODUÇÃO ao Worker (resumo_estavel + totalCatalogoConhecido). */
function aplicarWorker(T) {
  let s = fs.readFileSync(ARQ_WORKER, 'utf-8');
  const bloco =
    `      // Totais REAIS do acervo de PRODUÇÃO (fonte: D1 lino-livre-db).\n` +
    `      // Actualizar quando o acervo crescer — nunca números fictícios.\n` +
    `      resumo_estavel: {\n` +
    `        total_livros: ${T.livros},\n` +
    `        total_autores: ${T.autores},\n` +
    `        total_categorias: ${T.categorias},\n` +
    `        total_cursos: ${T.cursos},\n` +
    `        total_fontes: ${T.fontes}\n` +
    `      }`;
  const re = /(?:\/\/[^\n]*\n\s*)*resumo_estavel:\s*\{[\s\S]*?\}/;
  if (!re.test(s)) { console.log(`⚠ ${ARQ_WORKER}: bloco resumo_estavel não encontrado`); return false; }
  s = s.replace(re, bloco);
  s = s.replace(/const totalCatalogoConhecido = \d+;/, `const totalCatalogoConhecido = ${T.livros};`);
  fs.writeFileSync(ARQ_WORKER, s, 'utf-8');
  return true;
}

const args = process.argv.slice(2);
const soLocal = args.includes('--local');
const modo = args.includes('--ambos') ? 'ambos' : (soLocal ? 'local' : 'remoto');

// ── Execução ───────────────────────────────────────────────────────────────
const local = lerLocal();
console.log(`Acervo local (seed de desenvolvimento): ${brl(local.livros)} obras · ${brl(local.autores)} autores`);
let remoto = null;
if (modo !== 'local') {
  remoto = lerRemoto();
  console.log(`Acervo de PRODUÇÃO (D1 remoto): ${brl(remoto.livros)} obras · ${brl(remoto.autores)} autores`);
}

// O HTML reflecte a produção em modo remoto (evita flash visual na web) ou local com --local
const alvoHtml = (modo === 'local' || !remoto) ? local : remoto;
const proximo = aplicarHtml(alvoHtml);
console.log(`✔ ${ARQ_HTML}: ${brl(alvoHtml.livros)} obras · ${pct(alvoHtml.livros).toFixed(4)}% · ` +
  `próximo marco ${proximo ? proximo.replace('milestone-', '') : '(meta final)'}`);

// O Worker serve produção
const alvoWorker = (modo === 'remoto' && remoto) ? remoto : local;
if (aplicarWorker(alvoWorker)) {
  console.log(`✔ ${ARQ_WORKER}: resumo_estavel e totalCatalogoConhecido = ${alvoWorker.livros}`);
}

// ── Verificação ────────────────────────────────────────────────────────────
console.log('\n--- verificação ---');
const idx = fs.readFileSync(ARQ_HTML, 'utf-8');
const wk = fs.readFileSync(ARQ_WORKER, 'utf-8');
const ok = [
  [`HTML reflecte o acervo (${alvoHtml.livros})`, idx.includes(`aria-valuenow="${alvoHtml.livros}"`)],
  ['HTML sem placeholders vazios', !/aria-valuenow=""|placar-stat-atual"><\/span>/.test(idx)],
  [`Worker reflecte produção (${alvoWorker.livros})`, wk.includes(`total_livros: ${alvoWorker.livros}`) && wk.includes(`totalCatalogoConhecido = ${alvoWorker.livros};`)],
  ['sem 104.848 se a produção for diferente', alvoWorker.livros !== 104848 || wk.includes('104848')]
];
ok.forEach(([n, v]) => console.log(`  ${v ? '✔' : '✗'} ${n}`));
if (ok.some(([, v]) => !v)) process.exit(1);
