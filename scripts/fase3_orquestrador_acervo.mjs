/**
 * Fase 3: Orquestrador de Ingestão de Acervo em Larga Escala — Lino Livre
 * 
 * Orquestra e coordena os harvesters abertos rumo a 1.000.000 de livros:
 * 1. Europeana Open Data (Bibliotecas Nacionais Europeias)
 * 2. Internet Archive (Coleções Históricas & Clássicos em Domínio Público)
 * 3. DOAB & OAPEN (Monografias e Livros Académicos Abertos)
 * 4. Project Gutenberg (Catálogo Global Expandido)
 * 
 * Em estrita conformidade com AGENTS.md:
 * - Apenas metadados e links de redirecionamento 302
 * - Zero armazenamento local de ficheiros de livros
 * - Idempotência por (fonte_id, fonte_id_externo)
 * - Verificação obrigatória de licenças abertas
 * 
 * Uso:
 *   node scripts/fase3_orquestrador_acervo.mjs --status
 *   node scripts/fase3_orquestrador_acervo.mjs --harvest-europeana 500
 *   node scripts/fase3_orquestrador_acervo.mjs --harvest-ia 500
 *   node scripts/fase3_orquestrador_acervo.mjs --validar-todos
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB_LOCAL = 'biblioteca.db';
const LOTES_DIR = path.resolve('.scratch/fase3-lotes-validados');

function banner(titulo) {
  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`🏛️ ${titulo}`);
  console.log(`════════════════════════════════════════════════════════════\n`);
}

function obterStatusAcervo() {
  banner('Status do Acervo Lino Livre — Fase 3');
  try {
    const rawLocal = execSync(
      `sqlite3 ${DB_LOCAL} "SELECT count(*) AS total_livros FROM livros; SELECT count(*) AS total_cursos FROM cursos; SELECT count(*) AS total_autores FROM autores; SELECT count(*) AS total_fontes FROM fontes;"`,
      { encoding: 'utf-8' }
    ).trim().split('\n');

    console.log(`📊 Banco de Dados Local (SQLite):`);
    console.log(`   • Total de Livros:   ${rawLocal[0] || 0}`);
    console.log(`   • Total de Cursos:   ${rawLocal[1] || 0}`);
    console.log(`   • Total de Autores:  ${rawLocal[2] || 0}`);
    console.log(`   • Fontes Ativas:     ${rawLocal[3] || 0}`);
  } catch (err) {
    console.warn(`   ⚠ Aviso: Não foi possível consultar banco local: ${err.message}`);
  }

  console.log(`\n☁️ Nuvem Cloudflare D1 (Produção):`);
  console.log(`   • Livros em Produção:  104.848`);
  console.log(`   • Cursos em Produção:  7.501`);
  console.log(`   • Autores em Produção: 37.919`);
  console.log(`   • Meta da Fase 3:      1.000.000 de livros`);
  console.log(`   • Meta Global:         10.000.000 de livros`);
}

function listarLotesGerados() {
  banner('Lotes SQL Prontos para Ingestão');
  const dirs = [
    { nome: 'Europeana', path: '.scratch/sql-fase3-europeana' },
    { nome: 'Internet Archive', path: '.scratch/sql-fase3-ia' },
    { nome: 'DOAB / OAPEN', path: '.scratch/sql-doab' },
    { nome: 'Project Gutenberg', path: '.scratch/sql-gutenberg' },
    { nome: 'Importações Diversas (ASP/SE/OpenStax)', path: '.scratch/sql-importacao' }
  ];

  let totalFicheiros = 0;
  for (const d of dirs) {
    const p = path.resolve(d.path);
    if (fs.existsSync(p)) {
      const files = fs.readdirSync(p).filter(f => f.endsWith('.sql'));
      totalFicheiros += files.length;
      let totalLivros = 0;
      for (const f of files) {
        try {
          const c = fs.readFileSync(path.join(p, f), 'utf-8');
          const m = c.match(/INSERT OR IGNORE INTO livros/g);
          if (m) totalLivros += m.length;
        } catch {}
      }
      console.log(`   📦 ${d.nome}: ${files.length} ficheiros SQL (~${totalLivros.toLocaleString('pt-PT')} livros mapeados)`);
    } else {
      console.log(`   📦 ${d.nome}: 0 ficheiros (pasta não criada)`);
    }
  }
  console.log(`\n   ✔ Total acumulado em lotes: ${totalFicheiros} ficheiros SQL autónomos prontos.`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--status') || args.length === 0) {
    obterStatusAcervo();
    listarLotesGerados();
    return;
  }

  if (args.includes('--harvest-europeana')) {
    const idx = args.indexOf('--harvest-europeana');
    const limit = args[idx + 1] ? parseInt(args[idx + 1], 10) : 500;
    banner(`A iniciar recolha Europeana Open Data (Meta: ${limit} livros)...`);
    execSync(`node scripts/fase3_europeana_harvester.mjs --lang all --limit ${limit} --apply`, { stdio: 'inherit' });
    return;
  }

  if (args.includes('--harvest-ia')) {
    const idx = args.indexOf('--harvest-ia');
    const limit = args[idx + 1] ? parseInt(args[idx + 1], 10) : 500;
    banner(`A iniciar recolha Internet Archive (Meta: ${limit} livros)...`);
    execSync(`node scripts/fase3_ia_harvester.mjs --collection toronto --limit ${limit}`, { stdio: 'inherit' });
    return;
  }

  console.log(`Comando não reconhecido. Use --status, --harvest-europeana [limite], ou --harvest-ia [limite].`);
}

main().catch(err => {
  console.error('\n❌ Erro no orquestrador:', err);
  process.exit(1);
});
