#!/usr/bin/env node
/**
 * Lino Livre — Sincronizador Automático de Cursos, Trilhas e Credenciais do Microsoft Learn
 *
 * Consulta a API oficial do Catálogo Microsoft Learn (https://learn.microsoft.com):
 * GET https://learn.microsoft.com/api/catalog/?locale=pt-pt&type=courses,learningPaths,appliedSkills
 *
 * Catálogo Indexado:
 * 1. Cursos Oficiais (courses): formações acadêmicas e preparatórias completas (ex: AZ-900, AI-900, GH-200, DP-604)
 * 2. Trilhas de Aprendizagem (learningPaths): jornadas completas de aprendizagem estruturadas em módulos (tipo: 'roadmap')
 * 3. Microsoft Applied Skills (appliedSkills): credenciais práticas com laboratórios interativos e validação de habilidades
 *
 * Todos os conteúdos são 100% gratuitos e contam com conquistas, badges e certificados de conclusão oficiais da Microsoft.
 * Em estrita conformidade com a diretriz AGENTS.md (zero armazenamento de binários; apenas metadados e redirecionamentos 302).
 *
 * Agendado para execução semanal (de 1 em 1 semana).
 */

const fs = require('node:fs');
const path = require('node:path');

const CATALOG_API_URL = 'https://learn.microsoft.com/api/catalog/?locale=pt-pt&type=courses,learningPaths,appliedSkills';

const DATA_JSON_FILE = path.join(__dirname, '../src/database/msLearnData.json');
const DATA_JS_FILE = path.join(__dirname, '../src/database/msLearnData.js');
const REPORT_FILE = path.join(__dirname, '../docs/plataformas/MICROSOFT-LEARN-STATUS.md');

function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanUrl(url) {
  if (!url) return 'https://learn.microsoft.com/pt-pt/';
  return url.split('?')[0];
}

function mapLevel(levels = []) {
  if (!Array.isArray(levels)) levels = [];
  if (levels.includes('beginner')) return 'Iniciante';
  if (levels.includes('intermediate')) return 'Intermediário';
  if (levels.includes('advanced')) return 'Avançado';
  return 'Iniciante a Intermediário';
}

function mapArea(item) {
  const text = [
    item.title || '',
    item.summary || '',
    ...(item.products || []),
    ...(item.roles || []),
    ...(item.subjects || [])
  ].join(' ').toLowerCase();

  if (text.match(/\b(ai|ia|machine-learning|machine learning|copilot|openai|power-bi|power bi|analytics|inteligência|cosmos|fabric|deep learning|nlp)\b/)) {
    return 'Inteligência Artificial & Dados';
  }
  if (text.match(/\b(cloud|nuvem|azure|devops|docker|kubernetes|linux|infra|seguran|security|ciber|cyber|entra|identity|network)\b/)) {
    return 'DevOps, Cloud & Infraestrutura';
  }
  if (text.match(/\b(dotnet|c#|f#|python|javascript|typescript|web|mobile|programação|desenvolvimento|github|git|api|csharp|react|frontend|backend|html|css)\b/)) {
    return 'Desenvolvimento Web & Mobile';
  }
  if (text.match(/\b(agile|scrum|gestão|liderança|carreira|business|power-platform|power platform|power apps|power automate|dynamics|project)\b/)) {
    return 'Metodologias Ágeis & Carreira Tech';
  }
  if (text.match(/\b(ux|ui|design|acessibilidade|accessibility)\b/)) {
    return 'UI/UX & Design';
  }
  return 'Tecnologia & Guias Digitais';
}

async function fetchJson(url, timeoutMs = 15000) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LinoLivreSync/1.0',
      'Accept': 'application/json'
    },
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) {
    throw new Error(`Falha HTTP ${res.status} ao consultar ${url}`);
  }
  return await res.json();
}

async function sincronizarMicrosoftLearn(opcoes = {}) {
  const { offline = false, atualizarBanco = true } = opcoes;
  console.log('===============================================================');
  console.log('  ☁️ Microsoft Learn — Sincronização Semanal de Cursos e Trilhas');
  console.log('  Catálogo Oficial em Português (pt-pt / pt-br)');
  console.log('===============================================================');

  let catalogData = null;

  if (offline) {
    console.log('Modo offline solicitado. Lendo dados do arquivo local...');
    if (fs.existsSync(DATA_JSON_FILE)) {
      const cached = JSON.parse(fs.readFileSync(DATA_JSON_FILE, 'utf8'));
      console.log(`Carregados ${cached.length} registros do cache local.`);
      return cached;
    }
    console.warn('Cache local não encontrado. Alternando para modo online.');
  }

  try {
    console.log(`1. Consultando API oficial do catálogo em ${CATALOG_API_URL}...`);
    catalogData = await fetchJson(CATALOG_API_URL);
  } catch (err) {
    console.error('   -> Erro ao consultar API do Microsoft Learn:', err.message);
  }

  if (!catalogData || (!catalogData.courses && !catalogData.learningPaths)) {
    if (fs.existsSync(DATA_JSON_FILE)) {
      console.log('Falha na consulta remota. Mantendo registros anteriores do cache.');
      return JSON.parse(fs.readFileSync(DATA_JSON_FILE, 'utf8'));
    }
    throw new Error('Não foi possível obter dados da API do Microsoft Learn e não há cache local disponível.');
  }

  const rawCourses = catalogData.courses || [];
  const rawPaths = catalogData.learningPaths || [];
  const rawSkills = catalogData.appliedSkills || [];

  console.log(`2. Resposta recebida: ${rawCourses.length} cursos, ${rawPaths.length} trilhas e ${rawSkills.length} applied skills.`);

  const cursosFinais = [];
  const seenUrls = new Set();

  // 1. Cursos Oficiais (courses)
  for (const c of rawCourses) {
    const title = (c.title || '').trim();
    if (!title) continue;
    const url = cleanUrl(c.url);
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    const cleanSummary = stripHtml(c.summary);
    const duration = c.duration_in_hours ? `${c.duration_in_hours}h` : '24h';
    const prefix = c.course_number ? `${c.course_number}: ` : '';

    cursosFinais.push({
      idExterno: `mslearn-course-${c.uid}`,
      titulo: `${prefix}${title}`,
      tipo: 'curso',
      area: mapArea(c),
      plataforma: 'Microsoft Learn',
      url: url,
      licenca: 'gratuito',
      nivel: mapLevel(c.levels),
      descricao: `[Microsoft Learn Oficial • pt-pt] ${cleanSummary.slice(0, 300)}... Duração estimada: ${duration}. Curso oficial gratuito da Microsoft com módulos práticos, laboratórios e certificado de conclusão.`
    });
  }

  // 2. Trilhas de Aprendizagem (learningPaths - tipo: 'roadmap')
  for (const lp of rawPaths) {
    const title = (lp.title || '').trim();
    if (!title) continue;
    const url = cleanUrl(lp.url);
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    const cleanSummary = stripHtml(lp.summary);
    const durationMin = lp.duration_in_minutes || 60;
    const durationStr = durationMin >= 60 ? `${Math.round(durationMin / 60)}h` : `${durationMin} min`;
    const modCount = (lp.modules || []).length;

    cursosFinais.push({
      idExterno: `mslearn-path-${lp.uid}`,
      titulo: `Trilha: ${title}`,
      tipo: 'roadmap',
      area: mapArea(lp),
      plataforma: 'Microsoft Learn',
      url: url,
      licenca: 'gratuito',
      nivel: mapLevel(lp.levels),
      descricao: `[Microsoft Learn Oficial • pt-pt] ${cleanSummary.slice(0, 300)}... Trilha de aprendizagem oficial gratuita composta por ${modCount} módulos (${durationStr}). Conquistas, emblemas e certificado oficial gratuito da Microsoft.`
    });
  }

  // 3. Microsoft Applied Skills (appliedSkills)
  for (const sk of rawSkills) {
    const title = (sk.title || '').trim();
    if (!title) continue;
    const url = cleanUrl(sk.url);
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    const cleanSummary = stripHtml(sk.summary);

    cursosFinais.push({
      idExterno: `mslearn-skill-${sk.uid}`,
      titulo: title,
      tipo: 'curso',
      area: mapArea(sk),
      plataforma: 'Microsoft Learn',
      url: url,
      licenca: 'gratuito',
      nivel: mapLevel(sk.levels),
      descricao: `[Microsoft Applied Skills • pt-pt] ${cleanSummary.slice(0, 300)}... Credencial oficial prática verificável da Microsoft com laboratório interativo e certificado gratuito.`
    });
  }

  console.log(`3. Catálogo consolidado: ${cursosFinais.length} itens do Microsoft Learn indexados.`);

  // 4. Salvar arquivos locais
  fs.writeFileSync(DATA_JSON_FILE, JSON.stringify(cursosFinais, null, 2), 'utf8');
  console.log(`   -> Salvo em ${DATA_JSON_FILE}`);

  const jsContent = `/**
 * Catálogo Oficial Curado de Cursos, Trilhas e Credenciais do Microsoft Learn (pt-pt)
 * Fonte: Microsoft Learn Catalog API (https://learn.microsoft.com/api/catalog/)
 * 
 * Gerado automaticamente por scripts/sync_ms_learn.js
 * Diretriz AGENTS.md: Somente metadados e redirecionamentos externos 302.
 */

const msLearnList = require('./msLearnData.json');

module.exports = { msLearnList };
`;
  fs.writeFileSync(DATA_JS_FILE, jsContent, 'utf8');
  console.log(`   -> Salvo em ${DATA_JS_FILE}`);

  // 5. Gerar relatório Markdown de status
  gerarRelatorioMarkdown(cursosFinais);

  // 6. Atualizar banco SQLite se solicitado
  if (atualizarBanco) {
    try {
      atualizarBancoLocal(cursosFinais);
    } catch (dbErr) {
      console.warn('Aviso ao atualizar banco SQLite local:', dbErr.message);
    }
  }

  return cursosFinais;
}

function gerarRelatorioMarkdown(cursos) {
  const agora = new Date().toISOString().slice(0, 10);
  const totalCursos = cursos.filter(c => c.tipo === 'curso').length;
  const totalRoadmaps = cursos.filter(c => c.tipo === 'roadmap').length;

  const porArea = {};
  for (const c of cursos) {
    porArea[c.area] = (porArea[c.area] || 0) + 1;
  }

  let md = `# ☁️ Microsoft Learn — Catálogo Oficial de Cursos e Trilhas (pt-pt)

> **Data da Última Sincronização:** ${agora}  
> **Fonte Oficial:** [learn.microsoft.com/pt-pt](https://learn.microsoft.com/pt-pt/)  
> **Total de Registros:** ${cursos.length} (${totalCursos} cursos/credenciais + ${totalRoadmaps} trilhas de aprendizagem)  
> **Certificação Oficial:** 100% dos cursos, módulos e trilhas contam com certificado de conclusão, conquistas e emblemas digitais da Microsoft.

---

## 📊 Distribuição por Área de Conhecimento

| Área | Total de Cursos/Trilhas |
| :--- | :---: |
`;

  for (const [area, qtd] of Object.entries(porArea)) {
    md += `| ${area} | ${qtd} |\n`;
  }

  md += `
---

## 🎓 Cursos e Trilhas em Destaque

| Título | Tipo | Área | Nível | Link Oficial |
| :--- | :---: | :--- | :---: | :--- |
`;

  // Primeiros 35 cursos para visualização no markdown
  for (const c of cursos.slice(0, 35)) {
    md += `| **${c.titulo}** | ${c.tipo} | ${c.area} | ${c.nivel} | [Acessar no Microsoft Learn](${c.url}) |\n`;
  }

  if (cursos.length > 35) {
    md += `| *... e mais ${cursos.length - 35} cursos e trilhas disponíveis* | | | | [Ver Catálogo Completo](https://learn.microsoft.com/pt-pt/training/browse/) |\n`;
  }

  md += `
---
*Sincronização automática semanal executada pelo motor Lino Livre.*
`;

  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, md, 'utf8');
  console.log(`   -> Relatório de status gerado em ${REPORT_FILE}`);
}

function atualizarBancoLocal(cursos) {
  const dbPath = path.join(__dirname, '../biblioteca.db');
  if (!fs.existsSync(dbPath)) {
    console.log('Banco de dados biblioteca.db não encontrado. Execução continuará sem atualização direta.');
    return;
  }

  const { getDatabase } = require('../src/database');
  const db = getDatabase();

  console.log('4. Atualizando tabela de cursos no banco SQLite local...');
  db.exec('BEGIN TRANSACTION;');
  try {
    const deleteStmt = db.prepare("DELETE FROM cursos WHERE plataforma = 'Microsoft Learn'");
    deleteStmt.run();

    const insertStmt = db.prepare(`
      INSERT INTO cursos (titulo, tipo, area, plataforma, url, licenca, nivel, descricao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of cursos) {
      insertStmt.run(
        c.titulo,
        c.tipo || 'curso',
        c.area,
        c.plataforma || 'Microsoft Learn',
        c.url,
        c.licenca || 'gratuito',
        c.nivel || 'Iniciante',
        c.descricao
      );
    }

    db.exec('COMMIT;');
    console.log(`   -> ${cursos.length} cursos/trilhas do Microsoft Learn gravados com sucesso no SQLite!`);
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

// Execução CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const offline = args.includes('--offline');
  const atualizarBanco = !args.includes('--no-db');

  sincronizarMicrosoftLearn({ offline, atualizarBanco })
    .then(lista => {
      console.log(`\n🎉 Sincronização do Microsoft Learn finalizada com sucesso! Total: ${lista.length} cursos e trilhas.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ Erro durante a sincronização:', err);
      process.exit(1);
    });
}

module.exports = { sincronizarMicrosoftLearn };
