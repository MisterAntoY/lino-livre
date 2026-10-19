#!/usr/bin/env node
/**
 * Lino Livre — Sincronizador de Bootcamps da DIO (Digital Innovation One)
 *
 * Consulta o catálogo oficial em https://www.dio.me/bootcamp,
 * extrai metadados completos, identifica novos bootcamps e monitora
 * as datas de finalização (deadlines de inscrição/conclusão).
 *
 * Executado semanalmente via GitHub Actions (.github/workflows/sync-dio-bootcamps.yml).
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const DIO_URL = 'https://www.dio.me/bootcamp';
const DATA_FILE = path.join(__dirname, '../src/database/dioBootcampsData.json');
const REPORT_FILE = path.join(__dirname, '../docs/plataformas/BOOTCAMPS-DIO-STATUS.md');

function inferArea(name, skills) {
  const text = (name + ' ' + (skills || []).map(s => s.name || s).join(' ')).toLowerCase();
  if (text.match(/ia|intelig[eê]ncia artificial|dados|data|copilot|agente|agent|machine learning|python|bi|analytics|confluent|big data/)) {
    return 'Inteligência Artificial & Dados';
  }
  if (text.match(/cloud|aws|azure|devops|linux|kubernetes|docker|seguran[cç]a|cyber/)) {
    return 'DevOps & Nuvem';
  }
  if (text.match(/java|spring|\.net|c#|node|react|frontend|front-end|backend|back-end|fullstack|full stack|mobile|flutter|android|ios|kotlin|angular|javascript|html|css|php/)) {
    return 'Desenvolvimento Web & Mobile';
  }
  return 'Tecnologia';
}

function inferNivel(name) {
  const lower = name.toLowerCase();
  if (lower.includes('zero') || lower.includes('iniciante') || lower.includes('fundamentals') || lower.includes('básico')) {
    return 'Iniciante';
  }
  if (lower.includes('avançado') || lower.includes('expert') || lower.includes('pro')) {
    return 'Avançado';
  }
  return 'Intermediário';
}

async function fetchDioBootcamps() {
  console.log(`📡 Consultando catálogo oficial da DIO em ${DIO_URL}...`);
  const response = await fetch(DIO_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  });

  if (!response.ok) {
    throw new Error(`Falha ao acessar DIO: HTTP ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
  if (!match) {
    throw new Error('Não foi possível localizar os dados __NEXT_DATA__ na página da DIO.');
  }

  const parsed = JSON.parse(match[1]);
  const bootcamps = parsed?.props?.pageProps?.bootcamps;
  if (!Array.isArray(bootcamps)) {
    throw new Error('Formato inesperado: pageProps.bootcamps não é um array.');
  }

  console.log(`✅ Recebidos ${bootcamps.length} bootcamps da DIO.`);
  return bootcamps;
}

function formatBootcamps(rawBootcamps) {
  const now = new Date();
  return rawBootcamps.map(b => {
    const skillsList = (b.skills || []).map(s => s.name || s).filter(Boolean);
    const skillsStr = skillsList.length > 0 ? skillsList.join(', ') : 'Desenvolvimento de Software';
    const area = inferArea(b.name, b.skills || []);
    const nivel = inferNivel(b.name);
    const finishDate = b.finish || 'Contínuo';
    const devs = b.total_devs ? `${Number(b.total_devs).toLocaleString('pt-BR')} devs inscritos.` : '';
    const isAtivo = Boolean(b.finish && new Date(b.finish) >= now);
    const statusStr = isAtivo ? `[INSCRIÇÕES ABERTAS - Finaliza em ${finishDate}]` : `[Finalizado em ${finishDate}]`;

    return {
      id: b.id,
      slug: b.slug,
      titulo: `Bootcamp DIO: ${b.name}`,
      tipo: 'bootcamp',
      area,
      plataforma: 'DIO (Digital Innovation One)',
      url: `https://www.dio.me/bootcamp/${b.slug}`,
      licenca: 'gratuito',
      nivel,
      data_finalizacao: b.finish || null,
      ativo: isAtivo,
      total_devs: b.total_devs || 0,
      skills: skillsList,
      descricao: `${statusStr} Bootcamp gratuito oficial da DIO em parceria com empresas inovadoras. Habilidades: ${skillsStr}. Data de finalização: ${finishDate}. ${devs} Certificação gratuita oficial e oportunidade de contratação.`
    };
  });
}

function generateReport(bootcamps, novos, dataIso) {
  const ativos = bootcamps.filter(b => b.ativo).sort((a, b) => new Date(a.data_finalizacao) - new Date(b.data_finalizacao));
  const finalizados = bootcamps.filter(b => !b.ativo);

  let md = `# ⚡ Relatório de Monitoramento Semanal de Bootcamps DIO\n\n`;
  md += `**Última verificação:** ${dataIso}\n`;
  md += `**Fonte oficial:** [dio.me/bootcamp](${DIO_URL})\n`;
  md += `**Periodicidade:** Semanal (segunda-feira via GitHub Actions)\n\n`;

  md += `## 📊 Resumo Executivo\n\n`;
  md += `- **Total de Bootcamps Catalogados:** ${bootcamps.length}\n`;
  md += `- **Bootcamps com Inscrições Abertas / Ativos:** ${ativos.length}\n`;
  md += `- **Bootcamps Históricos Concluídos:** ${finalizados.length}\n`;
  md += `- **Novos Bootcamps Detectados nesta Ronda:** ${novos.length}\n\n`;

  if (novos.length > 0) {
    md += `## 🆕 Novos Bootcamps Adicionados Recentemente\n\n`;
    md += `| Bootcamp | Área | Finalização | Link |\n`;
    md += `|---|---|---|---|\n`;
    for (const b of novos) {
      md += `| **${b.titulo}** | ${b.area} | ${b.data_finalizacao || 'Contínuo'} | [Acessar na DIO](${b.url}) |\n`;
    }
    md += `\n`;
  }

  md += `## 🟢 Bootcamps Ativos (com Data de Finalização)\n\n`;
  md += `Estes programas estão com inscrições abertas ou turmas em andamento. Fique atento às datas limites de entrega de projetos:\n\n`;
  md += `| Bootcamp | Área | Nível | Data de Finalização | Devs Inscritos | Link Direto |\n`;
  md += `|---|---|---|---|---|---|\n`;
  for (const b of ativos) {
    const devsFormatted = b.total_devs ? Number(b.total_devs).toLocaleString('pt-BR') : 'N/D';
    md += `| **${b.titulo.replace('Bootcamp DIO: ', '')}** | ${b.area} | ${b.nivel} | 📅 \`${b.data_finalizacao}\` | 👥 ${devsFormatted} | [Inscrever-se](${b.url}) |\n`;
  }
  md += `\n`;

  md += `## 🏛️ Histórico Completo de Bootcamps Disponíveis no Acervo\n\n`;
  md += `Todos os ${bootcamps.length} bootcamps da DIO estão catalogados no acervo do Lino Livre, permitindo aos estudantes consultar o conteúdo programático, tecnologias exigidas e links oficiais mesmo após o encerramento da edição ao vivo.\n\n`;

  return md;
}

async function main() {
  const agora = new Date().toISOString();
  console.log(`🚀 Iniciando sincronizador de Bootcamps DIO (${agora})...`);

  let bootcampsRaw;
  try {
    bootcampsRaw = await fetchDioBootcamps();
  } catch (err) {
    console.warn(`⚠️ Não foi possível obter catálogo online (${err.message}). Usando base local se disponível.`);
    if (fs.existsSync(DATA_FILE)) {
      bootcampsRaw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } else {
      throw err;
    }
  }

  const bootcampsNovosFormatados = formatBootcamps(bootcampsRaw);

  // Ler base existente para detectar novidades
  let baseExistente = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      baseExistente = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (_) {
      baseExistente = [];
    }
  }

  const slugsExistentes = new Set(baseExistente.map(b => b.slug));
  const novos = bootcampsNovosFormatados.filter(b => !slugsExistentes.has(b.slug));

  console.log(`📈 Estatísticas da Sincronização:`);
  console.log(`- Total catalogado: ${bootcampsNovosFormatados.length}`);
  console.log(`- Novos bootcamps: ${novos.length}`);
  console.log(`- Ativos com data limite: ${bootcampsNovosFormatados.filter(b => b.ativo).length}`);

  // Salvar base atualizada
  fs.writeFileSync(DATA_FILE, JSON.stringify(bootcampsNovosFormatados, null, 2), 'utf8');
  console.log(`💾 Base salva em: ${DATA_FILE}`);

  // Gerar relatório markdown
  const report = generateReport(bootcampsNovosFormatados, novos, agora);
  fs.writeFileSync(REPORT_FILE, report, 'utf8');
  console.log(`📄 Relatório gerado em: ${REPORT_FILE}`);

  // Se executando no GitHub Actions, escrever no Step Summary
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

  console.log('🏁 Sincronização de Bootcamps DIO concluída com sucesso!');
}

if (require.main === module) {
  main().catch(err => {
    console.error('❌ Falha na execução da sincronização:', err);
    process.exit(1);
  });
}

module.exports = { fetchDioBootcamps, formatBootcamps, inferArea, inferNivel };
