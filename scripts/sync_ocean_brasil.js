#!/usr/bin/env node
/**
 * Lino Livre — Sincronizador Automático de Cursos, Trilhas e Atividades da Samsung Ocean Brasil
 *
 * Consulta a API oficial da Samsung Ocean Brasil (https://oceanbrasil.com):
 * 1. GET https://api.oceanbrasil.com/prod/home/events (próximos eventos, cursos e workshops ao vivo)
 * 2. GET https://api.oceanbrasil.com/prod/home/tracks (trilhas de aprendizagem e módulos curriculares)
 * 3. GET https://api.oceanbrasil.com/prod/course/:id (detalhes, ementas completas e instrutores de cada atividade)
 *
 * Parcerias Acadêmicas Oficiais:
 * - Universidade de São Paulo (USP / Poli-USP)
 * - Universidade do Estado do Amazonas (UEA)
 * - Universidade de Brasília (UnB)
 *
 * Todos os cursos e trilhas incluem emissão de certificado oficial gratuito.
 * Em total conformidade com a diretriz AGENTS.md (zero armazenamento de binários; apenas metadados e redirecionamentos 302).
 *
 * Agendado para execução semanal (1 em 1 semana).
 */

const fs = require('node:fs');
const path = require('node:path');

const EVENTS_URL = 'https://api.oceanbrasil.com/prod/home/events';
const TRACKS_URL = 'https://api.oceanbrasil.com/prod/home/tracks';
const COURSE_BASE_URL = 'https://api.oceanbrasil.com/prod/course';

const DATA_JSON_FILE = path.join(__dirname, '../src/database/oceanBrasilData.json');
const DATA_JS_FILE = path.join(__dirname, '../src/database/oceanBrasilData.js');
const REPORT_FILE = path.join(__dirname, '../docs/plataformas/SAMSUNG-OCEAN-STATUS.md');

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-');
}

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

function mapArea(trackTitle = '', title = '') {
  const t = (trackTitle + ' ' + title).toLowerCase();
  if (t.match(/inteligência artificial|inteligencia artificial|\bia\b|\bai\b|machine learning|deep learning|assistente de voz|visão computacional|nlp|redes neurais/)) {
    return 'Inteligência Artificial & Dados';
  }
  if (t.match(/ux|ui|design|experiência|interface|usabilidade/)) {
    return 'UI/UX & Design';
  }
  if (t.match(/ágil|agil|scrum|empreendedor|gestão|gestao|carreira|pitch|startup|business|inovação/)) {
    return 'Metodologias Ágeis & Carreira Tech';
  }
  if (t.match(/iot|internet das coisas|fabricação digital|fabricacao digital|wearables|hardware|eletrônica|eletronica|arduino|nuvem|cloud|devops|infra/)) {
    return 'DevOps, Cloud & Infraestrutura';
  }
  if (t.match(/android|backend|frontend|programação|programacao|web|mobile|python|java|javascript|scratch|kotlin|react|api|docker|sql|banco de dados|blockchain/)) {
    return 'Desenvolvimento Web & Mobile';
  }
  return 'Tecnologia & Guias Digitais';
}

function inferLevel(title = '') {
  const lower = title.toLowerCase();
  if (lower.match(/iniciante|introdução|introducao|básico|basico|do zero|fundamentos|primeiro contato/)) {
    return 'Iniciante';
  }
  if (lower.match(/avançado|avancado|master|expert|arquitetura|tendências|boas práticas/)) {
    return 'Avançado';
  }
  return 'Intermediário';
}

async function fetchJson(url, timeoutMs = 7000) {
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

async function sincronizarOceanBrasil(opcoes = {}) {
  const { offline = false, atualizarBanco = true } = opcoes;
  console.log('===============================================================');
  console.log('  🌊 Samsung Ocean Brasil — Sincronização Semanal de Cursos');
  console.log('  Parceria oficial: Samsung • USP • UEA • UnB');
  console.log('===============================================================');

  let rawEvents = [];
  let rawTracks = [];

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
    console.log(`1. Consultando próximos eventos e cursos em ${EVENTS_URL}...`);
    const eventsData = await fetchJson(EVENTS_URL);
    rawEvents = eventsData.nextEventGroups || [];
    console.log(`   -> Encontrados ${rawEvents.length} grupos de eventos / cursos ativos.`);
  } catch (err) {
    console.error('   -> Erro ao consultar eventos da Samsung Ocean:', err.message);
  }

  try {
    console.log(`2. Consultando trilhas oficiais em ${TRACKS_URL}...`);
    const tracksData = await fetchJson(TRACKS_URL);
    rawTracks = tracksData.tracks || [];
    console.log(`   -> Encontradas ${rawTracks.length} trilhas oficiais de aprendizagem.`);
  } catch (err) {
    console.error('   -> Erro ao consultar trilhas da Samsung Ocean:', err.message);
  }

  if (rawEvents.length === 0 && rawTracks.length === 0) {
    if (fs.existsSync(DATA_JSON_FILE)) {
      console.log('Falha na consulta remota. Mantendo registros anteriores do cache.');
      return JSON.parse(fs.readFileSync(DATA_JSON_FILE, 'utf8'));
    }
    throw new Error('Não foi possível obter dados da API da Samsung Ocean Brasil e não há cache local disponível.');
  }

  // 3. Consultar detalhes individuais de cada evento em paralelo com pool de concorrência
  console.log(`3. Enriquecendo detalhes curriculares de ${rawEvents.length} cursos (pool de concorrência: 15)...`);
  const courseDetails = {};
  const eventIds = rawEvents.map(e => e.id);
  let cursor = 0;

  async function worker() {
    while (cursor < eventIds.length) {
      const id = eventIds[cursor++];
      try {
        const detail = await fetchJson(`${COURSE_BASE_URL}/${id}`, 6000);
        courseDetails[id] = detail;
      } catch (e) {
        // Fallback gracioso: usará os dados consolidados do grupo de eventos
      }
    }
  }

  const concurrency = Math.min(15, eventIds.length || 1);
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  console.log(`   -> Detalhes curriculares obtidos com sucesso para ${Object.keys(courseDetails).length} cursos.`);

  // 4. Montar catálogo consolidado
  const cursosFinais = [];
  const eventTitlesSet = new Set();

  // 4.1 Cursos e atividades ativas (nextEventGroups)
  for (const eg of rawEvents) {
    const title = (eg.eventGroupTitle || '').trim();
    if (!title) continue;
    eventTitlesSet.add(title.toLowerCase());

    const slug = slugify(title);
    const idExterno = `ocean-event-${eg.id}`;
    const detail = courseDetails[eg.id] || {};

    const totalMinutes = (eg.events || []).reduce((acc, ev) => acc + (ev.workload || 0), 0);
    const workloadStr = totalMinutes > 0 ? `${Math.round(totalMinutes / 60)}h` : '4h';

    const modality = eg.modality || (detail.modality) || 'Online';
    const campus = eg.campusName || 'Brasil';
    const instrutores = (eg.speakersNames || (detail.speakers ? detail.speakers.map(s => s.name) : [])).filter(Boolean).join(', ');

    const cleanDesc = stripHtml(detail.description);
    const cleanCurr = stripHtml(detail.curriculum);

    let descParts = [`Curso oficial gratuito da Samsung Ocean em parceria com a Universidade de São Paulo (USP) e Universidade do Estado do Amazonas (UEA).`];
    if (cleanDesc) {
      descParts.push(cleanDesc);
    }
    descParts.push(`Modalidade: ${modality} (${campus}). Carga horária: ${workloadStr}.`);
    if (instrutores) {
      descParts.push(`Instrutor(a): ${instrutores}.`);
    }
    if (cleanCurr) {
      const ementaCurta = cleanCurr.length > 250 ? cleanCurr.slice(0, 247) + '...' : cleanCurr;
      descParts.push(`Conteúdo programático: ${ementaCurta}`);
    }
    descParts.push(`Certificado oficial gratuito emitido pela Samsung Ocean.`);

    cursosFinais.push({
      idExterno,
      titulo: title,
      tipo: 'curso',
      area: mapArea(eg.trackTitle, title),
      plataforma: 'Samsung Ocean',
      url: `https://oceanbrasil.com/atividades/${eg.id}-${slug}`,
      licenca: 'gratuito',
      nivel: inferLevel(title),
      descricao: descParts.join(' ')
    });
  }

  // 4.2 Trilhas oficiais (tracks) — cadastradas como roadmaps formativos
  for (const tr of rawTracks) {
    const trackName = (tr.trackName || '').trim();
    if (!trackName) continue;
    const slugTrack = slugify(trackName);
    const totalProgramas = (tr.programs || []).length;

    cursosFinais.push({
      idExterno: `ocean-track-${slugTrack}`,
      titulo: `Trilha Samsung Ocean: ${trackName}`,
      tipo: 'roadmap',
      area: mapArea(trackName),
      plataforma: 'Samsung Ocean',
      url: 'https://oceanbrasil.com/trilhas',
      licenca: 'gratuito',
      nivel: 'Iniciante a Avançado',
      descricao: `Trilha oficial de formação tecnológica da Samsung Ocean em parceria com a Universidade de São Paulo (USP) e Universidade do Estado do Amazonas (UEA) na área de ${trackName}. Trilha estruturada com ${totalProgramas} módulos formativos e emissão de certificado oficial gratuito.`
    });

    // 4.3 Módulos de trilhas que não estão atualmente na lista de eventos ao vivo
    for (const prog of (tr.programs || [])) {
      const progTitle = (prog.title || '').trim();
      if (!progTitle || eventTitlesSet.has(progTitle.toLowerCase())) continue;
      eventTitlesSet.add(progTitle.toLowerCase());

      const slugProg = slugify(progTitle);
      cursosFinais.push({
        idExterno: `ocean-module-${slugTrack}-${slugProg}`,
        titulo: progTitle,
        tipo: 'curso',
        area: mapArea(trackName, progTitle),
        plataforma: 'Samsung Ocean',
        url: 'https://oceanbrasil.com/atividades',
        licenca: 'gratuito',
        nivel: inferLevel(progTitle),
        descricao: `Módulo formativo do currículo oficial da Trilha ${trackName} da Samsung Ocean em parceria com a USP e UEA. Certificado oficial gratuito emitido pela Samsung Ocean.`
      });
    }
  }

  console.log(`4. Catálogo consolidado: ${cursosFinais.length} itens da Samsung Ocean indexados.`);

  // 5. Salvar arquivos locais
  fs.writeFileSync(DATA_JSON_FILE, JSON.stringify(cursosFinais, null, 2), 'utf8');
  console.log(`   -> Salvo em ${DATA_JSON_FILE}`);

  const jsContent = `/**
 * Catálogo Oficial Curado de Cursos, Trilhas e Atividades da Samsung Ocean Brasil
 * Parceria: Samsung • Universidade de São Paulo (USP) • Universidade do Estado do Amazonas (UEA)
 * 
 * Gerado automaticamente por scripts/sync_ocean_brasil.js
 * Diretriz AGENTS.md: Somente metadados e redirecionamentos externos 302.
 */

const oceanBrasilList = require('./oceanBrasilData.json');

module.exports = { oceanBrasilList };
`;
  fs.writeFileSync(DATA_JS_FILE, jsContent, 'utf8');
  console.log(`   -> Salvo em ${DATA_JS_FILE}`);

  // 6. Gerar relatório Markdown de status
  gerarRelatorioMarkdown(cursosFinais);

  // 7. Atualizar banco SQLite se solicitado
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

  let md = `# 🌊 Samsung Ocean Brasil — Catálogo Oficial de Cursos e Trilhas

> **Data da Última Sincronização:** ${agora}  
> **Fonte Oficial:** [oceanbrasil.com](https://oceanbrasil.com)  
> **Parcerias Acadêmicas:** Universidade de São Paulo (USP / Poli-USP), Universidade do Estado do Amazonas (UEA), Universidade de Brasília (UnB)  
> **Total de Registros:** ${cursos.length} (${totalCursos} cursos/oficinas + ${totalRoadmaps} trilhas formativas)  
> **Certificação Oficial:** 100% dos cursos e trilhas contam com certificado gratuito emitido pela Samsung Ocean em parceria com as universidades.

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

  // Primeiros 30 cursos para visualização no markdown
  for (const c of cursos.slice(0, 30)) {
    md += `| **${c.titulo}** | ${c.tipo} | ${c.area} | ${c.nivel} | [Acessar Atividade](${c.url}) |\n`;
  }

  if (cursos.length > 30) {
    md += `| *... e mais ${cursos.length - 30} cursos disponíveis* | | | | [Ver Catálogo Completo](https://oceanbrasil.com/atividades) |\n`;
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

  console.log('5. Atualizando tabela de cursos no banco SQLite local...');
  db.exec('BEGIN TRANSACTION;');
  try {
    const deleteStmt = db.prepare("DELETE FROM cursos WHERE plataforma = 'Samsung Ocean'");
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
        c.plataforma || 'Samsung Ocean',
        c.url,
        c.licenca || 'gratuito',
        c.nivel || 'Iniciante',
        c.descricao
      );
    }

    db.exec('COMMIT;');
    console.log(`   -> ${cursos.length} cursos da Samsung Ocean gravados com sucesso no SQLite!`);
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

  sincronizarOceanBrasil({ offline, atualizarBanco })
    .then(lista => {
      console.log(`\n🎉 Sincronização da Samsung Ocean finalizada com sucesso! Total: ${lista.length} cursos e trilhas.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ Erro durante a sincronização:', err);
      process.exit(1);
    });
}

module.exports = { sincronizarOceanBrasil };
