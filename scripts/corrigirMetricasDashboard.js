const fs = require('node:fs');
const { execSync } = require('node:child_process');

// ── Valores REAIS actuais (verificados na BD) ──────────────────────────────
const q = (sql) => execSync(`sqlite3 biblioteca.db "${sql}"`, { encoding: 'utf-8' }).trim();
const REAL = {
  livros: parseInt(q('SELECT COUNT(*) FROM livros'), 10),
  autores: parseInt(q('SELECT COUNT(*) FROM autores'), 10),
  categorias: parseInt(q('SELECT COUNT(*) FROM categorias'), 10),
  cursos: parseInt(q('SELECT COUNT(*) FROM cursos'), 10),
  fontes: parseInt(q('SELECT COUNT(*) FROM fontes'), 10)
};
const META = 10000000;
const faltam = META - REAL.livros;
console.log('Valores reais:', JSON.stringify(REAL), '| faltam:', faltam);

// ═══════════════════════════════════════════════════════════════════════════
// 1) workers/src/index.ts — resumo_estavel com valores REAIS
// ═══════════════════════════════════════════════════════════════════════════
{
  const p = 'workers/src/index.ts';
  let s = fs.readFileSync(p, 'utf-8');
  const antigo = `      resumo_estavel: {
        total_livros: 104848,
        total_autores: 37919,
        total_cursos: 8541,
        total_fontes: 34
      }`;
  const novo = `      // Valores REAIS do acervo (fonte: seed local). Actualizar quando o
      // acervo crescer, para que o painel nunca apresente números fictícios.
      resumo_estavel: {
        total_livros: ${REAL.livros},
        total_autores: ${REAL.autores},
        total_categorias: ${REAL.categorias},
        total_cursos: ${REAL.cursos},
        total_fontes: ${REAL.fontes}
      }`;
  if (s.includes(antigo)) { s = s.replace(antigo, novo); fs.writeFileSync(p, s, 'utf-8'); console.log('✔ workers/src/index.ts: resumo_estavel com valores reais'); }
  else console.log('⚠ workers/src/index.ts: padrão não encontrado');
}

// ═══════════════════════════════════════════════════════════════════════════
// 2) public/js/app.js — remover distribuições FICTÍCIAS e阈值 real
// ═══════════════════════════════════════════════════════════════════════════
{
  const p = 'public/js/app.js';
  let s = fs.readFileSync(p, 'utf-8');
  const ini = s.indexOf('      // Resiliência de exibição: se os agregados em tempo real estiverem em recálculo');
  const fim = s.indexOf('      const totalLivros = r.total_livros || 0;');
  if (ini !== -1 && fim !== -1 && fim > ini) {
    const novo = `      // Resiliência de exibição: se os agregados em tempo real estiverem em
      // recálculo, usa o resumo estável devolvido pelo servidor (valores REAIS
      // do acervo). Nunca se fabricam distribuições por idioma/formato/área —
      // apresentar números inventados como métrica real seria falso.
      if (!r.total_livros) {
        const estavel = data.resumo_estavel || null;
        if (estavel && estavel.total_livros) {
          r = { ...estavel };
        }
      }

`;
    s = s.slice(0, ini) + novo + s.slice(fim);
    console.log('✔ public/js/app.js: fallback sem dados fictícios');
  } else {
    console.log('⚠ public/js/app.js: bloco de resiliência não encontrado');
  }

  // limiares: qualquer total positivo é dado real
  s = s.split('if (tot && tot >= 1000) {').join('if (tot && tot > 0) {');
  s = s.split('if (tot && tot >= 1000) {').join('if (tot && tot > 0) {');
  s = s.split("if (json && typeof json.total === 'number' && json.total >= 1000) {")
    .join("if (json && typeof json.total === 'number' && json.total > 0) {");
  s = s.split('this.atualizarPlacarMeta(this.totalLivrosAcervo || 104848);')
    .join(`this.atualizarPlacarMeta(this.totalLivrosAcervo || ${REAL.livros});`);
  s = s.split('if (!total || total < 1000) total = this.totalLivrosAcervo || 104848;')
    .join(`if (!total || total < 1) total = this.totalLivrosAcervo || ${REAL.livros};`);
  s = s.split('totalLivrosAcervo: 104848,').join(`totalLivrosAcervo: ${REAL.livros},`);
  fs.writeFileSync(p, s, 'utf-8');
  console.log('✔ public/js/app.js: limiares e valores reais');
}

// ═══════════════════════════════════════════════════════════════════════════
// 3) public/index.html — placeholders e marcos REAIS
// ═══════════════════════════════════════════════════════════════════════════
{
  const p = 'public/index.html';
  let s = fs.readFileSync(p, 'utf-8');
  s = s.split('aria-valuenow="104848"').join(`aria-valuenow="${REAL.livros}"`);
  s = s.split('aria-valuenow="897"').join(`aria-valuenow="${REAL.livros}"`);
  s = s.split('id="placar-stat-atual">104.848<').join(`id="placar-stat-atual">${REAL.livros.toLocaleString('pt-PT').replace(/,/g, '.')}<`);
  s = s.split('id="placar-stat-atual">897<').join(`id="placar-stat-atual">${REAL.livros.toLocaleString('pt-PT').replace(/,/g, '.')}<`);
  s = s.split('id="placar-stat-faltam">9.895.152<').join(`id="placar-stat-faltam">${faltam.toLocaleString('pt-PT').replace(/,/g, '.')}<`);
  s = s.split('id="placar-stat-faltam">9.999.103<').join(`id="placar-stat-faltam">${faltam.toLocaleString('pt-PT').replace(/,/g, '.')}<`);

  // marcos: 1.000 NÃO foi atingido (997); 10k/100k também não
  s = s.replace(/<div class="milestone-step reached" id="milestone-1k"/, '<div class="milestone-step active" id="milestone-1k"');
  s = s.replace(/(<div class="milestone-step active" id="milestone-1k"[^>]*>\s*<span class="milestone-dot"><\/span>\s*<span class="milestone-text">1\.000<\/span>)/,
    '$1\n              <span class="milestone-tag" data-i18n="ui.goal.nextMilestone">Próximo</span>');
  s = s.replace(/<div class="milestone-step reached" id="milestone-10k"/, '<div class="milestone-step" id="milestone-10k"');
  s = s.replace(/<div class="milestone-step reached" id="milestone-100k"/, '<div class="milestone-step" id="milestone-100k"');
  // remove a etiqueta "Próximo" do marco de 1.000.000 (que não é o próximo)
  s = s.replace(/(<div class="milestone-step active" id="milestone-1m"[^>]*>\s*<span class="milestone-dot"><\/span>\s*<span class="milestone-text">1\.000\.000<\/span>)\s*<span class="milestone-tag"[^>]*>Próximo<\/span>/,
    '$1');

  // barra de progresso coerente
  const pct = ((REAL.livros / META) * 100).toFixed(2);
  s = s.replace(/id="placar-barra-progresso" style="width: [\d.]+%;"/, `id="placar-barra-progresso" style="width: ${pct}%;"`);
  s = s.replace(/id="placar-barra-progresso" style="width: 1%;"/, `id="placar-barra-progresso" style="width: ${pct}%;"`);

  fs.writeFileSync(p, s, 'utf-8');
  console.log('✔ public/index.html: placeholders e marcos reais');
}

// ── Verificação ────────────────────────────────────────────────────────────
console.log('\n--- verificação ---');
const js = fs.readFileSync('public/js/app.js', 'utf-8');
const idx = fs.readFileSync('public/index.html', 'utf-8');
const wk = fs.readFileSync('workers/src/index.ts', 'utf-8');
const verifica = [
  ['app.js sem 104848', !js.includes('104848')],
  ['app.js sem limiar arbitrario tot >= 1000', !js.includes('tot >= 1000')],
  ['app.js sem distribuição fictícia', !js.includes('total: 78430')],
  ['index.html sem 104848', !idx.includes('104848')],
  ['index.html com valor real', idx.includes(`aria-valuenow="${REAL.livros}"`)],
  ['worker com total real', wk.includes(`total_livros: ${REAL.livros}`)],
  ['worker sem 37919', !wk.includes('37919')]
];
verifica.forEach(([nome, ok]) => console.log(`  ${ok ? '✔' : '✗'} ${nome}`));
