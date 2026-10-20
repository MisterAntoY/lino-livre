#!/usr/bin/env node
/**
 * Migração D1 (SQLite) → Supabase (PostgreSQL)
 * ============================================
 *
 * Copia APENAS metadados e URLs externas. Nenhum ficheiro de livro é
 * enviado para o Supabase Storage — o modelo de intermediação mantém-se.
 *
 * Características:
 *   • Idempotente  — upsert por id (on_conflict=id).
 *   • Retomável    — checkpoint em .scratch/supabase-migracao.json.
 *   • Por keyset   — WHERE id > último, sem OFFSET.
 *   • Retry        — backoff exponencial em 429/5xx.
 *
 * Uso:
 *   node scripts/migrar_d1_para_supabase.js              # D1 remota
 *   node scripts/migrar_d1_para_supabase.js --local      # biblioteca.db local
 *   node scripts/migrar_d1_para_supabase.js --tabela=livros
 *   node scripts/migrar_d1_para_supabase.js --com-conteudo
 *   node scripts/migrar_d1_para_supabase.js --reiniciar
 *
 * Requer no .env (ou no ambiente):
 *   SUPABASE_URL (ou DATA_API)
 *   SUPABASE_SERVICE_ROLE_KEY (ou Secret_keys / service_role)
 *
 * Antes de correr, aplicar supabase/schema.sql no SQL Editor do Supabase.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const RAIZ = path.resolve(__dirname, '..');
const CHECKPOINT = path.join(RAIZ, '.scratch', 'supabase-migracao.json');
const DB_LOCAL = path.join(RAIZ, 'biblioteca.db');
const DB_D1 = 'lino-livre-db';

// ── Argumentos ───────────────────────────────────────────────
const args = process.argv.slice(2);
const LOCAL = args.includes('--local');
const COM_CONTEUDO = args.includes('--com-conteudo');
const REINICIAR = args.includes('--reiniciar');
const DRY_RUN = args.includes('--dry-run');
const STATUS = args.includes('--status');
const APENAS_TABELA = args.find((a) => a.startsWith('--tabela='))?.split('=')[1];
const LOTE = Number(args.find((a) => a.startsWith('--lote='))?.split('=')[1] || 500);

// ── .env ─────────────────────────────────────────────────────
function carregarEnv() {
  const env = { ...process.env };
  const ficheiro = path.join(RAIZ, '.env');
  if (!fs.existsSync(ficheiro)) return env;
  for (const linha of fs.readFileSync(ficheiro, 'utf8').split(/\r?\n/)) {
    if (!linha || linha.trim().startsWith('#')) continue;
    const i = linha.indexOf('=');
    if (i < 0) continue;
    const k = linha.slice(0, i).trim();
    const v = linha.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in env)) env[k] = v;
  }
  return env;
}

const env = carregarEnv();
const SUPABASE_URL = String(env.SUPABASE_URL || env.DATA_API || '').replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.Secret_keys || env.service_role;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('✗ Falta SUPABASE_URL (ou DATA_API) e a chave de serviço no .env.');
  process.exit(1);
}

// ── Tabelas e colunas ────────────────────────────────────────
// Ordem respeita as foreign keys.
const TABELAS = [
  { nome: 'fontes', colunas: ['id', 'slug', 'nome', 'tipo', 'url_base', 'ativa'] },
  { nome: 'categorias', colunas: ['id', 'nome', 'descricao', 'criado_em'] },
  { nome: 'autores', colunas: ['id', 'nome', 'nacionalidade', 'biografia', 'criado_em'] },
  {
    nome: 'livros',
    lote: 200,
    colunas: [
      'id', 'titulo', 'subtitulo', 'isbn', 'ano_publicacao', 'idioma', 'sinopse',
      'capa_url', 'paginas', 'autor_id', 'categoria_id', 'fonte_id', 'fonte_id_externo',
      'licenca', 'leituras',
      ...(COM_CONTEUDO ? ['conteudo_texto'] : []),
      'criado_em'
    ]
  },
  { nome: 'links_livros', colunas: ['id', 'livro_id', 'formato', 'url', 'tamanho_bytes', 'link_externo'] },
  { nome: 'cursos', colunas: ['id', 'titulo', 'tipo', 'area', 'plataforma', 'url', 'licenca', 'nivel', 'descricao', 'criado_em'] },
  { nome: 'podcasts_shows', colunas: ['id', 'titulo', 'slug', 'descricao', 'capa_url', 'spotify_url', 'spotify_uri', 'categoria', 'idioma', 'ativo', 'criado_em'] },
  { nome: 'podcasts_episodios', colunas: ['id', 'show_id', 'numero', 'titulo', 'slug', 'descricao', 'duracao_minutos', 'spotify_url', 'spotify_embed_url', 'audio_url', 'publicado_em', 'reproducoes', 'criado_em'] }
];

// ── Leitura da origem ────────────────────────────────────────
function lerD1Remota(sql) {
  const cmd = ['wrangler', 'd1', 'execute', DB_D1, '--remote', '--json', '--command', sql];
  let saida;
  try {
    saida = execFileSync('npx', cmd, {
      cwd: RAIZ,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (err) {
    const detalhe = `${err.stdout || ''}\n${err.stderr || ''}`;
    if (/7500|exceeded D1's free tier daily row read limit/i.test(detalhe)) {
      throw new Error(
        'Cota diária de leitura da D1 esgotada (5M linhas). ' +
          'O checkpoint foi guardado; volte a correr após 00:00 UTC ou use Workers Paid.'
      );
    }
    throw new Error('Falha ao ler da D1: ' + (detalhe.trim() || err.message).slice(0, 400));
  }
  const inicio = saida.indexOf('[');
  if (inicio < 0) throw new Error('Resposta inesperada do wrangler: ' + saida.slice(0, 200));
  const json = JSON.parse(saida.slice(inicio));
  return json[0]?.results || [];
}

let dbLocal = null;
function lerLocal(sql, params = []) {
  if (!dbLocal) {
    const { DatabaseSync } = require('node:sqlite');
    if (!fs.existsSync(DB_LOCAL)) throw new Error('biblioteca.db não encontrado em ' + DB_LOCAL);
    dbLocal = new DatabaseSync(DB_LOCAL, { readOnly: true });
  }
  return dbLocal.prepare(sql).all(...params);
}

function lerLote(tabela, colunas, ultimoId, limite) {
  const cols = colunas.join(', ');
  if (LOCAL) {
    return lerLocal(
      `SELECT ${cols} FROM ${tabela.nome} WHERE id > ? ORDER BY id ASC LIMIT ?`,
      [ultimoId, limite]
    );
  }
  return lerD1Remota(
    `SELECT ${cols} FROM ${tabela.nome} WHERE id > ${Number(ultimoId)} ORDER BY id ASC LIMIT ${Number(limite)}`
  );
}

// ── Escrita no Supabase ──────────────────────────────────────
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function upsert(tabela, linhas) {
  const url = `${SUPABASE_URL}/rest/v1/${tabela}?on_conflict=id`;
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    let resposta;
    try {
      resposta = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify(linhas)
      });
    } catch (err) {
      if (tentativa === 5) throw err;
      console.warn(`  ↻ rede (${err.message}); tentativa ${tentativa}/5`);
      await esperar(1000 * 2 ** (tentativa - 1));
      continue;
    }

    if (resposta.ok) return;

    const corpo = await resposta.text();
    const recriavel = [429, 500, 502, 503, 504].includes(resposta.status);
    if (!recriavel || tentativa === 5) {
      throw new Error(`${tabela}: HTTP ${resposta.status} — ${corpo.slice(0, 500)}`);
    }
    console.warn(`  ↻ HTTP ${resposta.status}; tentativa ${tentativa}/5`);
    await esperar(1000 * 2 ** (tentativa - 1));
  }
}

async function estadoTabela(nome) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${nome}?select=id&limit=1`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'count=exact'
    }
  });
  if (r.ok) {
    const cr = r.headers.get('content-range') || '';
    const total = cr.split('/')[1];
    return { existe: true, total: total && total !== '*' ? Number(total) : null };
  }
  const corpo = await r.text();
  if (r.status === 404 || /PGRST205/.test(corpo)) return { existe: false, total: null };
  return { existe: true, erro: `HTTP ${r.status}: ${corpo.slice(0, 120)}` };
}

async function contarNoSupabase(tabela) {
  const estado = await estadoTabela(tabela);
  return estado.existe && !estado.erro ? estado.total : null;
}

async function mostrarStatus() {
  console.log('Estado do catálogo no Supabase:\n');
  const linhas = [];
  // estatisticas/contadores/autor_totais não são migradas: são recalculadas.
  const nomes = [...TABELAS.map((t) => t.nome), 'estatisticas', 'contadores', 'autor_totais'];
  for (const nome of nomes) {
    const e = await estadoTabela(nome);
    const estado = !e.existe ? 'AUSENTE' : e.erro ? e.erro : String(e.total ?? '?');
    linhas.push({ tabela: nome, estado });
  }
  const largura = Math.max(...linhas.map((l) => l.tabela.length));
  for (const l of linhas) console.log('  ' + l.tabela.padEnd(largura) + '  ' + l.estado);

  const ausentes = linhas.filter((l) => l.estado === 'AUSENTE').map((l) => l.tabela);
  if (ausentes.length) {
    console.log('\n⚠ Tabelas ausentes: ' + ausentes.join(', '));
    console.log('  Aplique supabase/schema.sql no SQL Editor do Supabase (ou npm run supabase:schema).');
  }
}

async function rpc(nome, corpo = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${nome}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(corpo)
  });
  if (!r.ok) throw new Error(`rpc ${nome}: HTTP ${r.status} — ${(await r.text()).slice(0, 300)}`);
}

// ── Checkpoint ───────────────────────────────────────────────
function lerCheckpoint() {
  if (REINICIAR || !fs.existsSync(CHECKPOINT)) return {};
  try {
    return JSON.parse(fs.readFileSync(CHECKPOINT, 'utf8'));
  } catch {
    return {};
  }
}

function guardarCheckpoint(dados) {
  fs.mkdirSync(path.dirname(CHECKPOINT), { recursive: true });
  const tmp = CHECKPOINT + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(dados, null, 2));
  fs.renameSync(tmp, CHECKPOINT);
}

// ── Execução ─────────────────────────────────────────────────
async function migrarTabela(tabela, checkpoint) {
  const limite = tabela.lote || LOTE;
  let ultimoId = checkpoint[tabela.nome] || 0;
  let total = 0;
  let vazios = 0;

  const inicio = Date.now();
  process.stdout.write(`\n▶ ${tabela.nome} (a partir do id ${ultimoId})\n`);

  for (;;) {
    const linhas = lerLote(tabela, tabela.colunas, ultimoId, limite);
    if (!linhas.length) {
      if (++vazios >= 2) break; // margem para leituras remotas instáveis
      await esperar(500);
      continue;
    }
    vazios = 0;

    if (!DRY_RUN) await upsert(tabela.nome, linhas);
    total += linhas.length;
    ultimoId = linhas[linhas.length - 1].id;
    if (!DRY_RUN) {
      checkpoint[tabela.nome] = ultimoId;
      guardarCheckpoint(checkpoint);
    }

    const segundos = Math.max((Date.now() - inicio) / 1000, 0.1);
    process.stdout.write(
      `  ${total.toLocaleString('pt-PT')} linhas · id ${ultimoId} · ${(total / segundos).toFixed(0)}/s\n`
    );
  }

  const noSupabase = DRY_RUN ? null : await contarNoSupabase(tabela.nome);
  console.log(
    `✓ ${tabela.nome}: ${total.toLocaleString('pt-PT')} ${DRY_RUN ? 'lidas (dry-run)' : 'enviadas nesta execução'}` +
      (noSupabase === null ? '' : ` · ${noSupabase.toLocaleString('pt-PT')} na tabela`)
  );
}

async function principal() {
  console.log('Lino Livre — migração para Supabase');
  console.log('  origem :', LOCAL ? 'biblioteca.db (local)' : 'D1 remota (' + DB_D1 + ')');
  console.log('  destino:', SUPABASE_URL);
  console.log('  conteúdo textual:', COM_CONTEUDO ? 'incluído' : 'omitido (apenas metadados)');

  if (STATUS) {
    await mostrarStatus();
    return;
  }

  const alvo = APENAS_TABELA ? TABELAS.filter((t) => t.nome === APENAS_TABELA) : TABELAS;

  if (!alvo.length) {
    console.error('✗ Tabela desconhecida:', APENAS_TABELA);
    process.exit(1);
  }

  // Pré-verificação: evita uma migração parcial silenciosa por tabelas ausentes.
  if (!DRY_RUN) {
    const ausentes = [];
    for (const tabela of alvo) {
      const estado = await estadoTabela(tabela.nome);
      if (!estado.existe) ausentes.push(tabela.nome);
    }
    if (ausentes.length) {
      console.error('\n✗ Tabelas ausentes no Supabase: ' + ausentes.join(', '));
      console.error('  Aplique o schema antes de migrar:');
      console.error('    • SQL Editor do Supabase → colar supabase/schema.sql');
      console.error('    • ou: npm run supabase:schema (requer DIRECT_URL válido no .env)');
      process.exit(1);
    }
  }

  const checkpoint = DRY_RUN ? {} : lerCheckpoint();

  for (const tabela of alvo) {
    await migrarTabela(tabela, checkpoint);
  }

  if (APENAS_TABELA && APENAS_TABELA !== 'livros') {
    console.log(`\n✓ Migração parcial da tabela "${APENAS_TABELA}" concluída com sucesso.`);
  } else {
    console.log('\n▶ A recalcular agregados (estatisticas/contadores)…');
    if (DRY_RUN) {
      console.log('  (dry-run: RPC ignorado)');
    } else {
      try {
        await rpc('recalcular_estatisticas');
        console.log('✓ Agregados recalculados');
      } catch (_) {
        console.log('  ℹ️  RPC recalcular_estatisticas ignorado (tabelas de estatísticas não criadas ou migração parcial).');
      }
    }
  }

  console.log('\nConcluído. Para ativar no Worker:');
  console.log('  npx wrangler secret put SUPABASE_URL');
  console.log('  npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY');
  console.log('  # definir "DB_BACKEND": "supabase" em wrangler.jsonc e deploy');
}

principal().catch((err) => {
  console.error('\n✗ Migração interrompida:', err.message);
  console.error('  O checkpoint foi guardado; volte a correr para retomar.');
  process.exit(1);
});
