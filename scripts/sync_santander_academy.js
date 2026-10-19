#!/usr/bin/env node
/**
 * Lino Livre — Sincronizador de Bolsas, Bootcamps e Cursos do Santander Open Academy
 *
 * Consulta o portal oficial e sitemap de https://www.santanderopenacademy.com,
 * monitora convocatórias de bolsas e bootcamps com datas de finalização (deadlines),
 * detecta novos lançamentos em parceria com MIT, Harvard, DIO, Google e Microsoft.
 *
 * Executado semanalmente via GitHub Actions (.github/workflows/sync-santander-academy.yml).
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const SITEMAP_URL = 'https://www.santanderopenacademy.com/sitemap.xml';
const PORTAL_URL = 'https://www.santanderopenacademy.com/pt_br';
const DATA_FILE = path.join(__dirname, '../src/database/santanderAcademyData.json');
const REPORT_FILE = path.join(__dirname, '../docs/plataformas/SANTANDER-ACADEMY-STATUS.md');

function inferAreaFromSlug(slug) {
  const text = slug.toLowerCase();
  if (text.match(/ai|ia|gemini|copilot|python|data|analytics|power-bi|machine-learning|dados/)) {
    return 'Inteligência Artificial & Dados';
  }
  if (text.match(/cloud|nuvem|cyber|seguran|safety|privacy|protecao/)) {
    return 'DevOps, Cloud & Infraestrutura';
  }
  if (text.match(/web|mobile|cursor|programming|programacao|java|react|frontend|backend/)) {
    return 'Desenvolvimento Web & Mobile';
  }
  if (text.match(/leadership|lideranca|gestao|agile|scrum|communication|comunicacao|carreira|english|ingles/)) {
    return 'Metodologias Ágeis & Carreira Tech';
  }
  return 'Tecnologia & Guias Digitais';
}

function inferTitleFromSlug(slug) {
  const words = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `Santander Open Academy: ${words}`;
}

async function fetchSitemapCourses() {
  console.log(`📡 Consultando sitemap oficial em ${SITEMAP_URL}...`);
  try {
    const res = await fetch(SITEMAP_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!res.ok) {
      console.warn(`Aviso: HTTP ${res.status} ao consultar sitemap.`);
      return [];
    }

    const xml = await res.text();
    const matches = xml.match(/https:\/\/www\.santanderopenacademy\.com\/pt_br\/courses\/([a-zA-Z0-9_\-]+)\.html/g) || [];
    const slugs = [...new Set(matches)].map(u => u.split('/').pop().replace('.html', ''));
    console.log(`✅ Identificados ${slugs.length} cursos em português no sitemap.`);
    return slugs;
  } catch (err) {
    console.warn(`Erro ao consultar sitemap: ${err.message}`);
    return [];
  }
}

function generateReport(programas, novos, dataIso) {
  const agora = new Date();
  const comPrazo = programas.filter(p => p.data_finalizacao);
  const ativos = comPrazo.filter(p => new Date(p.data_finalizacao) >= agora).sort((a, b) => new Date(a.data_finalizacao) - new Date(b.data_finalizacao));
  const finalizados = comPrazo.filter(p => new Date(p.data_finalizacao) < agora);
  const continuos = programas.filter(p => !p.data_finalizacao);

  let md = `# 🏛️ Relatório de Monitoramento Semanal - Santander Open Academy\n\n`;
  md += `**Última verificação:** ${dataIso}\n`;
  md += `**Portal oficial:** [santanderopenacademy.com](${PORTAL_URL})\n`;
  md += `**Periodicidade:** Semanal (segunda-feira via GitHub Actions)\n\n`;

  md += `## 📊 Resumo Executivo\n\n`;
  md += `- **Total de Oportunidades Catalogadas:** ${programas.length}\n`;
  md += `- **Bootcamps & Bolsas Ativos (Inscrições Abertas):** ${ativos.length}\n`;
  md += `- **Cursos Contínuos com Certificado Gratuito:** ${continuos.length}\n`;
  md += `- **Programas Históricos Encerrados:** ${finalizados.length}\n`;
  md += `- **Novos Programas Identificados nesta Ronda:** ${novos.length}\n\n`;

  if (novos.length > 0) {
    md += `## 🆕 Novos Programas Adicionados Recentemente\n\n`;
    md += `| Programa | Área | Finalização | Link Direto |\n`;
    md += `|---|---|---|---|\n`;
    for (const p of novos) {
      md += `| **${p.titulo}** | ${p.area} | ${p.data_finalizacao || 'Contínuo'} | [Acessar Oportunidade](${p.url}) |\n`;
    }
    md += `\n`;
  }

  md += `## 🟢 Bootcamps e Bolsas com Inscrições Abertas (Data de Finalização)\n\n`;
  md += `Fique atento aos prazos limites de submissão e documentação nas chamadas ativas:\n\n`;
  md += `| Programa / Convocatória | Parceiro | Nível | Inscrições Até | Vagas | Link Oficial |\n`;
  md += `|---|---|---|---|---|---|\n`;
  for (const p of ativos) {
    const vagas = p.vagas ? Number(p.vagas).toLocaleString('pt-BR') : 'A consultar';
    md += `| **${p.titulo}** | ${p.parceiro || 'Santander'} | ${p.nivel} | 📅 \`${p.data_finalizacao}\` | 👥 ${vagas} | [Candidatar-se](${p.url}) |\n`;
  }
  md += `\n`;

  md += `## 🎓 Cursos On-Demand com Certificação Gratuita Santander\n\n`;
  md += `Cursos com acesso imediato e certificação digital sem custo emitidos pelo Banco Santander e parceiros globais (Google, Microsoft, Harvard, MIT):\n\n`;
  md += `| Curso | Área | Nível | Certificação | Acesso |\n`;
  md += `|---|---|---|---|---|\n`;
  for (const p of continuos.slice(0, 20)) {
    md += `| **${p.titulo}** | ${p.area} | ${p.nivel} | 🏆 Santander / Universia | [Iniciar Agora](${p.url}) |\n`;
  }
  md += `\n*(Exibindo os primeiros 20 de ${continuos.length} cursos contínuos catalogados)*\n\n`;

  return md;
}

async function main() {
  const agora = new Date().toISOString();
  console.log(`🚀 Iniciando sincronizador do Santander Open Academy (${agora})...`);

  let baseExistente = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      baseExistente = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (_) {
      baseExistente = [];
    }
  }

  const slugsExistentes = new Set(baseExistente.map(b => b.slug));
  const sitemapSlugs = await fetchSitemapCourses();

  const novosSlugs = sitemapSlugs.filter(s => !slugsExistentes.has(s));
  const novos = [];

  for (const slug of novosSlugs) {
    const area = inferAreaFromSlug(slug);
    const titulo = inferTitleFromSlug(slug);
    const novoCurso = {
      id: slug,
      slug,
      titulo,
      tipo: 'curso',
      area,
      plataforma: 'Santander Open Academy',
      url: `https://www.santanderopenacademy.com/pt_br/courses/${slug}.html`,
      licenca: 'gratuito',
      nivel: 'Iniciante',
      data_finalizacao: null,
      ativo: true,
      vagas: null,
      parceiro: 'Santander Open Academy',
      descricao: `[CURSO CONTÍNUO - Acesso Imediato] Formação oficial do Santander Open Academy com certificação digital gratuita do Banco Santander.`
    };
    baseExistente.push(novoCurso);
    novos.push(novoCurso);
  }

  // Atualizar status de ativos baseado na data atual
  const now = new Date();
  baseExistente.forEach(p => {
    if (p.data_finalizacao) {
      p.ativo = new Date(p.data_finalizacao) >= now;
      const statusBadge = p.ativo
        ? `[INSCRIÇÕES ABERTAS - Finaliza em ${p.data_finalizacao}]`
        : `[Finalizado em ${p.data_finalizacao}]`;
      p.descricao = p.descricao.replace(/\[(INSCRIÇÕES ABERTAS|Finalizado em|CURSO CONTÍNUO)[^\]]*\]/, statusBadge);
    }
  });

  console.log(`📈 Estatísticas da Sincronização Santander Open Academy:`);
  console.log(`- Total catalogado: ${baseExistente.length}`);
  console.log(`- Novos programas identificados: ${novos.length}`);
  console.log(`- Bootcamps/Bolsas ativos: ${baseExistente.filter(p => p.data_finalizacao && p.ativo).length}`);

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

  console.log('🏁 Sincronização do Santander Open Academy concluída com sucesso!');
}

if (require.main === module) {
  main().catch(err => {
    console.error('❌ Falha na execução da sincronização:', err);
    process.exit(1);
  });
}

module.exports = { fetchSitemapCourses, inferAreaFromSlug, inferTitleFromSlug };
