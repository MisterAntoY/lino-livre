#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FASE 4 — FEDERAÇÃO GLOBAL DE BUSCA (CLI)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Interroga múltiplos catálogos abertos em paralelo e funde os resultados
 * num ranking único por Reciprocal Rank Fusion (RRF).
 *
 *   ┌──────────────┐
 *   │ COORDENADOR │  ← este processo
 *   └──┬─┬─┬─┬─┬──┘
 *      │ │ │ │ │        fan-out paralelo
 *   ┌──┘ │ │ │ └──┐
 *   ▼    ▼ ▼ ▼    ▼
 *  OL  IA  CR  OA  OAx      ← nós de busca
 *
 * Uso:
 *   node scripts/fase4_federacao_busca.mjs "camões lusíadas"
 *   node scripts/fase4_federacao_busca.mjs "python" --limite 20 --json
 *   node scripts/fase4_federacao_busca.mjs --diagnostico
 *   node scripts/fase4_federacao_busca.mjs "termo" --upstreams openlibrary,crossref
 *
 * AGENTS.md: apenas METADADOS. Nenhum ficheiro de obra é transferido.
 */

import { MotorFederado } from '../src/services/federacaoBusca.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function banner(t) {
  console.log(`\n${'═'.repeat(78)}`);
  console.log(`🌐 ${t}`);
  console.log(`${'═'.repeat(78)}\n`);
}

function argValor(args, nome, padrao) {
  const i = args.indexOf(nome);
  return i !== -1 && args[i + 1] ? args[i + 1] : padrao;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--diagnostico')) {
    banner('FASE 4 — Diagnóstico do motor federado');
    const m = new MotorFederado();
    console.log('Upstreams registados:');
    m.diagnostico().forEach(u => {
      console.log(`  ${u.id.padEnd(16)} ${u.nome.padEnd(30)} peso=${u.peso}  ${u.estado}`);
    });
    console.log(`\nAlgoritmo de fusão: Reciprocal Rank Fusion (k=${60})`);
    return;
  }

  const termo = args.find(a => !a.startsWith('--') && !/^\d+$/.test(a));
  if (!termo) {
    console.error('Uso: node scripts/fase4_federacao_busca.mjs "<termo>" [--limite N] [--json]');
    process.exit(1);
  }

  const limite = parseInt(argValor(args, '--limite', '25'), 10);
  const timeout = parseInt(argValor(args, '--timeout', '8000'), 10);
  const comoJson = args.includes('--json');
  const apenasUpstreams = argValor(args, '--upstreams', null);

  banner('FASE 4 — Busca Federada Global');
  console.log(`Termo: "${termo}" | limite: ${limite} | timeout: ${timeout}ms\n`);

  const motor = new MotorFederado({
    limitePorUpstream: limite,
    limiteFinal: limite,
    timeoutMs: timeout
  });

  // Restringe a um subconjunto de upstreams (útil para depurar)
  if (apenasUpstreams) {
    const ids = new Set(apenasUpstreams.split(',').map(s => s.trim()));
    motor.upstreams = motor.upstreams.filter(u => ids.has(u.id));
    console.log(`Upstreams activos: ${[...ids].join(', ')}\n`);
  }

  const t0 = Date.now();
  const r = await motor.buscar(termo);
  const ms = Date.now() - t0;

  if (comoJson) {
    console.log(JSON.stringify(r, null, 2));
    return;
  }

  console.log(`─── Estado dos upstreams ───`);
  for (const u of r.upstreams) {
    const icone = u.estado === 'ok' ? '✔' : '✖';
    console.log(`  ${icone} ${u.upstream.padEnd(16)} ${String(u.estado).padEnd(10)} ${String(u.total).padStart(3)} resultados  ${String(u.ms).padStart(6)}ms  ${u.erro || ''}`);
  }

  console.log(`\n─── ${r.total} resultados (fusão RRF, k=60) ───`);
  r.resultados.forEach((x, i) => {
    const fontes = (x.fontes || []).join('+');
    console.log(`  ${String(i + 1).padStart(3)}. ${(x.titulo || '').slice(0, 58).padEnd(59)}`);
    console.log(`       ${(x.autor || '—').slice(0, 44).padEnd(45)} │ ${x.fonte} │ ${fontes}`);
    console.log(`       ${String(x.url || '').slice(0, 88)}  [score ${x.score}]`);
  });

  console.log(`\n⏱  ${ms}ms | degradado: ${r.degradado ? 'SIM (upstream lento/indisponível)' : 'não'}`);
  console.log('\nℹ Todos os URLs são externos — a leitura faz-se por redireccionamento 302 (zero armazenamento local).');
}

main().catch(err => { console.error('❌', err); process.exit(1); });
