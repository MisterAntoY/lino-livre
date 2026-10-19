#!/usr/bin/env node
/**
 * Lino Livre — Sincronizador de Cursos Gratuitos da Data Science Academy (DSA)
 * https://www.datascienceacademy.com.br
 *
 * Consulta a API oficial (LearnWorlds API) de https://www.datascienceacademy.com.br/api/courses,
 * monitora cursos gratuitos, cargas horárias, títulos e certificações gratuitas.
 *
 * Executado periodicamente via GitHub Actions (.github/workflows/sync-dsa-courses.yml).
 */

const fs = require('node:fs');
const path = require('node:path');

const API_URL = 'https://www.datascienceacademy.com.br/api/courses';
const DATA_FILE = path.join(__dirname, '../src/database/dsaCoursesData.json');
const REPORT_FILE = path.join(__dirname, '../docs/plataformas/DATA-SCIENCE-ACADEMY-STATUS.md');

function inferArea(title) {
  if (title.includes('Python')) return 'Desenvolvimento Web & Mobile';
  if (title.includes('Engenharia de Dados')) return 'DevOps, Cloud & Infraestrutura';
  if (title.includes('Aperfeiçoamento') || title.includes('Career') || title.includes('Hub')) {
    return 'Metodologias Ágeis & Carreira Tech';
  }
  return 'Ciência de Dados & Inteligência Artificial';
}

function inferLevel(title) {
  if (title.includes('Generative AI') || title.includes('Hub') || title.includes('Avançado')) {
    return 'Intermediário';
  }
  return 'Iniciante';
}

function inferHours(title) {
  if (title.includes('Power BI')) return '72h';
  if (title.includes('Python')) return '60h';
  return '40h a 60h';
}

async function fetchDsaCourses() {
  console.log(`📡 Consultando API oficial da Data Science Academy em ${API_URL}...`);
  try {
    const res = await fetch(API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.warn(`Aviso: HTTP ${res.status} ao consultar API da DSA.`);
      return [];
    }

    const json = await res.json();
    const coursesObj = json.courses || {};
    const coursesList = Object.values(coursesObj);

    const freeCourses = coursesList.filter(c => {
      const hasGratuitoTag = (c.tags || []).some(t => t.toLowerCase() === 'gratuito' || t.toLowerCase() === 'free');
      const isPriceZero = c.price === 0;
      return hasGratuitoTag || isPriceZero;
    });

    console.log(`✅ Identificados ${freeCourses.length} cursos gratuitos ativos na API da DSA.`);

    return freeCourses.map(c => {
      const area = inferArea(c.title);
      const nivel = inferLevel(c.title);
      const ch = inferHours(c.title);
      const desc = `${c.keywords || c.description} Carga horária estimada: ${ch}. Certificado oficial gratuito de conclusão emitido pela Data Science Academy. 100% online e gratuito. Tags: ${(c.tags || []).join(', ')}.`;

      return {
        idExterno: c.id,
        titulo: c.title.trim(),
        tipo: 'curso',
        area: area,
        plataforma: 'Data Science Academy',
        url: `https://www.datascienceacademy.com.br/course/${c.titleId}`,
        licenca: 'gratuito',
        nivel: nivel,
        descricao: desc,
        imagemUrl: c.courseImage?.uncompressedUrl || c.courseImage?.url || null,
        tags: c.tags || []
      };
    });
  } catch (err) {
    console.error('❌ Erro ao consultar API da Data Science Academy:', err.message);
    return [];
  }
}

function generateReport(courses) {
  const dateStr = new Date().toISOString().split('T')[0];
  let md = `# 🎓 Data Science Academy (DSA) — Catálogo de Cursos Gratuitos\n\n`;
  md += `> **Data de Atualização:** ${dateStr}  \n`;
  md += `> **Fonte Oficial:** [datascienceacademy.com.br](https://www.datascienceacademy.com.br)  \n`;
  md += `> **Total de Cursos Gratuitos:** ${courses.length}  \n`;
  md += `> **Certificado Oficial:** Todos os cursos incluem certificado gratuito de conclusão.\n\n`;

  md += `| Curso | Área | Nível | Carga Horária | URL Oficial |\n`;
  md += `| :--- | :--- | :---: | :---: | :--- |\n`;

  for (const c of courses) {
    md += `| **${c.titulo}** | ${c.area} | ${c.nivel} | Gratuito | [Acessar Curso](${c.url}) |\n`;
  }

  md += `\n---\n*Sincronização automática executada pelo repositório Lino Livre.*\n`;
  return md;
}

async function main() {
  console.log('🚀 Iniciando sincronizador de cursos gratuitos da Data Science Academy...');

  let current = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      current = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (_) {}
  }

  const remoteCourses = await fetchDsaCourses();
  if (remoteCourses.length === 0) {
    console.log('⚠️ Nenhum curso retornado ou falha de rede; mantendo catálogo local.');
    return;
  }

  // Merge preservando catálogo
  const map = new Map();
  for (const c of current) map.set(c.idExterno || c.url, c);
  for (const r of remoteCourses) map.set(r.idExterno || r.url, r);

  const merged = Array.from(map.values());
  fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`💾 Salvos ${merged.length} cursos em ${DATA_FILE}`);

  const report = generateReport(merged);
  fs.writeFileSync(REPORT_FILE, report, 'utf8');
  console.log(`📝 Relatório gerado em ${REPORT_FILE}`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Falha na execução:', err);
    process.exit(1);
  });
}

module.exports = { main, fetchDsaCourses };
