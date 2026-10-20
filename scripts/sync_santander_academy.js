#!/usr/bin/env node
/**
 * Lino Livre — Sincronizador Automático de Bolsas, Bootcamps e Cursos do Santander Open Academy
 *
 * Consulta de forma automatizada:
 * 1. O sitemap mestre de programas e cursos da aplicação (https://app.santanderopenacademy.com/sitemaps/index.xml)
 *    cobrindo todas as sub-sitemaps de cursos (soa-courses-*.xml, lms-courses-*.xml) e programas (soa-grants-*.xml).
 * 2. O sitemap do portal institucional (https://www.santanderopenacademy.com/sitemap.xml).
 *
 * Monitora convocatórias internacionais (British Council, Cambridge, MIT, Harvard, Google, Microsoft, DIO)
 * com datas de finalização (deadlines), vagas e emissão de certificados oficiais do Banco Santander.
 *
 * Executado semanalmente via GitHub Actions (.github/workflows/sync-santander-academy.yml).
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const APP_SITEMAP_INDEX = 'https://app.santanderopenacademy.com/sitemaps/index.xml';
const PORTAL_SITEMAP_URL = 'https://www.santanderopenacademy.com/sitemap.xml';
const PORTAL_URL = 'https://www.santanderopenacademy.com/pt_br';
const DATA_FILE = path.join(__dirname, '../src/database/santanderAcademyData.json');
const REPORT_FILE = path.join(__dirname, '../docs/plataformas/SANTANDER-ACADEMY-STATUS.md');

// Registry de programas com metadados verificados (deadlines, vagas e parcerias oficiais)
const PROGRAMAS_ESPECIAIS = {
  'british-council-english-online-2026-3rd-call': {
    titulo: 'Curso Santander | British Council English Online 2026 - 3rd Call',
    tipo: 'bootcamp',
    area: 'Metodologias Ágeis & Carreira Tech',
    parceiro: 'British Council',
    nivel: 'Iniciante',
    vagas: 10000,
    data_finalizacao: '2026-11-19',
    url: 'https://app.santanderopenacademy.com/es/program/british-council-english-online-2026-3rd-call',
    descricao: '[INSCRIÇÕES ABERTAS - Finaliza em 2026-11-19] Bolsa oficial do Banco Santander e British Council com 10.000 vagas para cursos de inglês online gratuitos (níveis A1 a C1), com aulas ao vivo, materiais interativos e certificado oficial emitido pelo Banco Santander.'
  },
  'british-council-ielts-online-2026': {
    titulo: 'Bolsas Santander | British Council IELTS Online 2026',
    tipo: 'bootcamp',
    area: 'Metodologias Ágeis & Carreira Tech',
    parceiro: 'British Council',
    nivel: 'Intermediário',
    vagas: 5000,
    data_finalizacao: '2026-12-15',
    url: 'https://app.santanderopenacademy.com/en/program/british-council-ielts-online-2026',
    descricao: '[INSCRIÇÕES ABERTAS - Finaliza em 2026-12-15] Bolsa oficial do Banco Santander e British Council para preparação para o exame IELTS com simulações e certificado gratuito do Banco Santander.'
  }
};

function inferPartner(slug, title = '') {
  const text = (slug + ' ' + title).toLowerCase();
  if (text.includes('british-council') || text.includes('british council')) return 'British Council';
  if (text.includes('cambridge')) return 'Cambridge University Press & Assessment';
  if (text.includes('google')) return 'Google';
  if (text.includes('microsoft')) return 'Microsoft';
  if (text.includes('mit')) return 'MIT Professional Education';
  if (text.includes('harvard')) return 'Harvard Business Publishing';
  if (text.includes('dio') || text.includes('digital innovation one')) return 'DIO (Digital Innovation One)';
  if (text.includes('universia')) return 'Universia';
  if (text.includes('ada')) return 'Ada Tech';
  if (text.includes('oxford')) return 'Oxford';
  if (text.includes('esade')) return 'Esade';
  if (text.includes('babson')) return 'Babson College';
  if (text.includes('lse') || text.includes('london school of economics')) return 'London School of Economics';
  return 'Santander Open Academy';
}

function inferAreaFromSlug(slug, title = '') {
  const text = (slug + ' ' + title).toLowerCase();
  if (text.match(/ai|ia|gemini|copilot|python|data|analytics|power-bi|machine-learning|dados|inteligencia|prompt|deep-learning/)) {
    return 'Inteligência Artificial & Dados';
  }
  if (text.match(/cloud|nuvem|cyber|ciber|seguran|safety|privacy|protecao|devops|linux|aws|azure/)) {
    return 'DevOps, Cloud & Infraestrutura';
  }
  if (text.match(/web|mobile|cursor|programming|programacao|java|react|frontend|backend|fullstack|code|desarrollo|software|typescript/)) {
    return 'Desenvolvimento Web & Mobile';
  }
  if (text.match(/leadership|lideranca|liderazgo|gestao|gestion|agile|scrum|communication|comunicacion|carreira|carrera|english|ingles|british-council|ielts|idiomas|soft-skills|idioma/)) {
    return 'Metodologias Ágeis & Carreira Tech';
  }
  return 'Tecnologia & Guias Digitais';
}

function inferTitleFromSlug(slug) {
  if (PROGRAMAS_ESPECIAIS[slug]) {
    return PROGRAMAS_ESPECIAIS[slug].titulo;
  }
  const words = slug
    .replace(/-+/g, ' ')
    .trim()
    .split(' ')
    .map(w => {
      const lower = w.toLowerCase();
      if (['ai', 'ia', 'ti', 'mit', 'dio', 'aws', 'bi', 'ui', 'ux', 'ielts', 'sql', 'php', 'html', 'css'].includes(lower)) {
        return lower.toUpperCase();
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
  return `Santander: ${words}`;
}

async function fetchAllSantanderOpportunities() {
  console.log(`📡 Consultando sitemaps oficiais do Santander Open Academy...`);
  const catalog = new Map();

  // 1. Sitemaps da aplicação (app.santanderopenacademy.com)
  try {
    const indexRes = await fetch(APP_SITEMAP_INDEX, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    if (indexRes.ok) {
      const indexXml = await indexRes.text();
      const subSitemaps = [...indexXml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);
      console.log(`📋 Encontradas ${subSitemaps.length} sub-sitemaps na aplicação.`);

      // Filtrar sub-sitemaps de cursos e programas abertos
      const targetSubXmls = subSitemaps.filter(s =>
        s.includes('soa-courses-') ||
        s.includes('lms-courses-') ||
        s.includes('soa-grants-pt') ||
        s.includes('soa-grants-es') ||
        s.includes('soa-grants-en')
      );

      await Promise.all(targetSubXmls.map(async subUrl => {
        try {
          const r = await fetch(subUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (!r.ok) return;
          const txt = await r.text();
          const urls = [...txt.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);
          for (const u of urls) {
            const match = u.match(/\/(program|course|courses)\/([^/]+?)(?:\.html)?$/);
            if (!match) continue;
            const type = match[1] === 'program' ? 'bootcamp' : 'curso';
            const slug = match[2];

            // Relevância: se for grants, priorizar programas online, cursos, línguas ou tecnologia
            if (subUrl.includes('soa-grants-')) {
              const isRelevant = slug.match(/online|english|ingles|tech|bootcamp|ai|python|digital|british|cambridge|mit|harvard|google|microsoft|dio|ielts|data/i) || subUrl.includes('-pt');
              if (!isRelevant) continue;
            }

            if (!catalog.has(slug)) {
              catalog.set(slug, { slug, type, url: u });
            } else {
              // Preferir URL em português se já existia noutro idioma
              const curr = catalog.get(slug);
              if (u.includes('/pt-BR/') || (!curr.url.includes('/pt-BR/') && u.includes('/pt/'))) {
                catalog.set(slug, { slug, type, url: u });
              }
            }
          }
        } catch (_) {}
      }));
    }
  } catch (err) {
    console.warn(`Aviso ao ler sitemap de app: ${err.message}`);
  }

  // 2. Sitemap do portal institucional (www.santanderopenacademy.com)
  try {
    const portalRes = await fetch(PORTAL_SITEMAP_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (portalRes.ok) {
      const xml = await portalRes.text();
      const urls = [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);
      for (const u of urls) {
        if (u.includes('/courses/')) {
          const slug = u.split('/courses/')[1].replace(/\.html$/, '').replace(/\/$/, '');
          if (slug && !catalog.has(slug)) {
            catalog.set(slug, {
              slug,
              type: 'curso',
              url: u
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn(`Aviso ao ler portal sitemap: ${err.message}`);
  }

  // Garantir que os programas especiais estão no catálogo
  for (const [slug, meta] of Object.entries(PROGRAMAS_ESPECIAIS)) {
    if (!catalog.has(slug)) {
      catalog.set(slug, { slug, type: meta.tipo, url: meta.url });
    }
  }

  console.log(`✅ Total de oportunidades únicas identificadas: ${catalog.size}`);
  return Array.from(catalog.values());
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
  md += `**Periodicidade:** Semanal e sob demanda via GitHub Actions\n\n`;

  md += `## 📊 Resumo Executivo\n\n`;
  md += `- **Total de Oportunidades Catalogadas:** ${programas.length}\n`;
  md += `- **Bootcamps & Bolsas Ativos (Inscrições Abertas):** ${ativos.length}\n`;
  md += `- **Cursos Contínuos com Certificado Gratuito:** ${continuos.length}\n`;
  md += `- **Programas Históricos Encerrados:** ${finalizados.length}\n`;
  md += `- **Novos Programas Identificados nesta Ronda:** ${novos.length}\n\n`;

  if (novos.length > 0) {
    md += `## 🆕 Novos Programas Adicionados Recentemente\n\n`;
    md += `| Programa | Área | Parceiro | Finalização | Link Direto |\n`;
    md += `|---|---|---|---|---|\n`;
    for (const p of novos.slice(0, 30)) {
      md += `| **${p.titulo}** | ${p.area} | ${p.parceiro || 'Santander'} | ${p.data_finalizacao ? `\`${p.data_finalizacao}\`` : 'Contínuo'} | [Acessar Oportunidade](${p.url}) |\n`;
    }
    if (novos.length > 30) {
      md += `\n*(Exibindo os primeiros 30 de ${novos.length} novos itens adicionados)*\n`;
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
  md += `Cursos com acesso imediato e certificação digital sem custo emitidos pelo Banco Santander e parceiros globais (Google, Microsoft, Harvard, MIT, British Council):\n\n`;
  md += `| Curso | Área | Parceiro | Nível | Certificação | Acesso |\n`;
  md += `|---|---|---|---|---|---|\n`;
  for (const p of continuos.slice(0, 30)) {
    md += `| **${p.titulo}** | ${p.area} | ${p.parceiro || 'Santander'} | ${p.nivel} | 🏆 Banco Santander | [Iniciar Agora](${p.url}) |\n`;
  }
  if (continuos.length > 30) {
    md += `\n*(Exibindo os primeiros 30 de ${continuos.length} cursos contínuos catalogados)*\n\n`;
  }

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

  const mapaExistente = new Map(baseExistente.map(b => [b.slug, b]));
  const oportunidades = await fetchAllSantanderOpportunities();
  const novos = [];

  for (const op of oportunidades) {
    if (mapaExistente.has(op.slug)) {
      // Atualizar URL ou metadados especiais se aplicável
      const existente = mapaExistente.get(op.slug);
      if (PROGRAMAS_ESPECIAIS[op.slug]) {
        Object.assign(existente, PROGRAMAS_ESPECIAIS[op.slug]);
      }
      continue;
    }

    // Criar nova entrada
    let novoItem;
    if (PROGRAMAS_ESPECIAIS[op.slug]) {
      novoItem = {
        id: op.slug,
        slug: op.slug,
        plataforma: 'Santander Open Academy',
        licenca: 'gratuito',
        ativo: true,
        ...PROGRAMAS_ESPECIAIS[op.slug]
      };
    } else {
      const area = inferAreaFromSlug(op.slug);
      const parceiro = inferPartner(op.slug);
      const titulo = inferTitleFromSlug(op.slug);
      novoItem = {
        id: op.slug,
        slug: op.slug,
        titulo,
        tipo: op.type || 'curso',
        area,
        plataforma: 'Santander Open Academy',
        url: op.url,
        licenca: 'gratuito',
        nivel: 'Iniciante',
        data_finalizacao: null,
        ativo: true,
        vagas: null,
        parceiro,
        descricao: op.type === 'bootcamp'
          ? `[PROGRAMA SANTANDER] Programa oficial de capacitação do Banco Santander em parceria com ${parceiro}, com certificação gratuita.`
          : `[CURSO CONTÍNUO - Acesso Imediato] Formação oficial do Santander Open Academy com certificação digital gratuita do Banco Santander.`
      };
    }

    baseExistente.push(novoItem);
    mapaExistente.set(op.slug, novoItem);
    novos.push(novoItem);
  }

  // Garantir que o curso específico do British Council 2026 3rd Call está atualizado
  if (mapaExistente.has('british-council-english-online-2026-3rd-call')) {
    const bc = mapaExistente.get('british-council-english-online-2026-3rd-call');
    Object.assign(bc, PROGRAMAS_ESPECIAIS['british-council-english-online-2026-3rd-call']);
  } else {
    const bcItem = {
      id: 'british-council-english-online-2026-3rd-call',
      slug: 'british-council-english-online-2026-3rd-call',
      plataforma: 'Santander Open Academy',
      licenca: 'gratuito',
      ativo: true,
      ...PROGRAMAS_ESPECIAIS['british-council-english-online-2026-3rd-call']
    };
    baseExistente.unshift(bcItem);
    novos.unshift(bcItem);
  }

  // Atualizar status de ativos baseado na data atual
  const now = new Date();
  baseExistente.forEach(p => {
    if (p.data_finalizacao) {
      p.ativo = new Date(p.data_finalizacao) >= now;
      const statusBadge = p.ativo
        ? `[INSCRIÇÕES ABERTAS - Finaliza em ${p.data_finalizacao}]`
        : `[Finalizado em ${p.data_finalizacao}]`;
      p.descricao = p.descricao.replace(/\[(INSCRIÇÕES ABERTAS|Finalizado em|CURSO CONTÍNUO|PROGRAMA SANTANDER)[^\]]*\]/, statusBadge);
    }
  });

  // Ordenar: primeiro ativos com prazo, depois contínuos, depois finalizados
  baseExistente.sort((a, b) => {
    if (a.ativo && !b.ativo) return -1;
    if (!a.ativo && b.ativo) return 1;
    if (a.data_finalizacao && b.data_finalizacao) {
      return new Date(a.data_finalizacao) - new Date(b.data_finalizacao);
    }
    if (a.data_finalizacao && !b.data_finalizacao) return -1;
    if (!a.data_finalizacao && b.data_finalizacao) return 1;
    return a.titulo.localeCompare(b.titulo);
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

module.exports = {
  fetchAllSantanderOpportunities,
  inferAreaFromSlug,
  inferTitleFromSlug,
  inferPartner,
  PROGRAMAS_ESPECIAIS
};
