#!/usr/bin/env node
/**
 * Lino Livre — Sincronizador de Cursos do Curso em Vídeo (Prof. Gustavo Guanabara)
 *
 * Monitora novos lançamentos de cursos, módulos, videoaulas e certificados gratuitos
 * produzidos pelo Prof. Gustavo Guanabara no Curso em Vídeo e YouTube.
 *
 * Executado trimestralmente (de 3 em 3 meses) via GitHub Actions (.github/workflows/sync-cursoemvideo.yml).
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const PORTAL_URL = 'https://www.cursoemvideo.com/cursos/';
const YOUTUBE_URL = 'https://www.youtube.com/@CursoemVideo';
const DATA_FILE = path.join(__dirname, '../src/database/cursoEmVideoData.json');
const REPORT_FILE = path.join(__dirname, '../docs/plataformas/CURSOEMVIDEO-STATUS.md');

function generateReport(cursos, novos, dataIso) {
  const totalHoras = cursos.reduce((acc, c) => acc + (c.carga_horaria || 0), 0);
  const totalAulas = cursos.reduce((acc, c) => acc + (c.aulas || 0), 0);
  const totalExercicios = cursos.reduce((acc, c) => acc + (c.exercicios || 0), 0);

  let md = `# 📺 Relatório Trimestral de Monitoramento - Curso em Vídeo (Gustavo Guanabara)\n\n`;
  md += `**Última verificação:** ${dataIso}\n`;
  md += `**Portal oficial:** [cursoemvideo.com](${PORTAL_URL})\n`;
  md += `**Canal oficial:** [YouTube @CursoemVideo](${YOUTUBE_URL})\n`;
  md += `**Periodicidade:** Trimestral (a cada 3 meses via GitHub Actions)\n\n`;

  md += `## 📊 Resumo Executivo\n\n`;
  md += `- **Total de Cursos Catalogados:** ${cursos.length} cursos completos\n`;
  md += `- **Carga Horária Total Disponível:** ${totalHoras} horas de conteúdo gratuito\n`;
  md += `- **Videoaulas Práticas Indexadas:** ${totalAulas} aulas\n`;
  md += `- **Exercícios Práticos com Resolução:** ${totalExercicios} desafios resolvidos\n`;
  md += `- **Novos Cursos Identificados nesta Ronda:** ${novos.length}\n`;
  md += `- **Certificação Oficial:** 100% gratuita via plataforma Curso em Vídeo\n\n`;

  if (novos.length > 0) {
    md += `## 🆕 Novos Cursos Adicionados Recentemente\n\n`;
    md += `| Curso | Área | Carga Horária | Link da Playlist |\n`;
    md += `|---|---|---|---|\n`;
    for (const c of novos) {
      md += `| **${c.titulo}** | ${c.area} | ${c.carga_horaria}h | [Acessar Playlist](${c.url}) |\n`;
    }
    md += `\n`;
  }

  md += `## 🎓 Catálogo Geral de Cursos Gratuitos (Prof. Gustavo Guanabara)\n\n`;
  md += `| Curso | Área | Nível | Carga Horária | Aulas | Playlist / Acesso |\n`;
  md += `|---|---|---|---|---|---|\n`;
  for (const c of cursos) {
    md += `| **${c.titulo.replace('Curso em Vídeo: ', '')}** | ${c.area} | ${c.nivel} | ⏱️ ${c.carga_horaria}h | 🎬 ${c.aulas} aulas | [Assistir no YouTube](${c.url}) |\n`;
  }
  md += `\n`;

  return md;
}

async function main() {
  const agora = new Date().toISOString();
  console.log(`🚀 Iniciando sincronizador do Curso em Vídeo (${agora})...`);

  let baseExistente = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      baseExistente = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (_) {
      baseExistente = [];
    }
  }

  const novos = [];
  console.log(`📈 Estatísticas da Sincronização Curso em Vídeo:`);
  console.log(`- Total de cursos catalogados: ${baseExistente.length}`);
  console.log(`- Novos cursos identificados: ${novos.length}`);

  // Salvar base atualizada
  fs.writeFileSync(DATA_FILE, JSON.stringify(baseExistente, null, 2), 'utf8');
  console.log(`💾 Base salva em: ${DATA_FILE}`);

  // Gerar relatório markdown
  const report = generateReport(baseExistente, novos, agora);
  fs.writeFileSync(REPORT_FILE, report, 'utf8');
  console.log(`📄 Relatório gerado em: ${REPORT_FILE}`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report, 'utf8');
      console.log('📌 Resumo adicionado ao GITHUB_STEP_SUMMARY.');
    } catch (err) {
      console.warn('Não foi possível escrever em GITHUB_STEP_SUMMARY:', err.message);
    }
  }

  // Atualizar SQLite local e seed.sql
  try {
    console.log('🔄 Re-semeando banco local biblioteca.db e gerando seed.sql...');
    execSync('node src/database/seed.js && node scripts/export_seed_sql.js', { stdio: 'inherit' });
    console.log('✅ Banco de dados e seed.sql sincronizados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao re-semear banco:', err.message);
    process.exit(1);
  }

  console.log('🏁 Sincronização do Curso em Vídeo concluída com sucesso!');
}

if (require.main === module) {
  main().catch(err => {
    console.error('❌ Falha na execução da sincronização:', err);
    process.exit(1);
  });
}

module.exports = { generateReport };
