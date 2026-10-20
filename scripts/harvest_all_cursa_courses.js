const fs = require('node:fs');
const path = require('node:path');

// Carregar cursos existentes para preservar customizações prévias
let existingCourses = [];
try {
  const { cursaCoursesList } = require('../src/database/cursaCoursesData');
  existingCourses = cursaCoursesList || [];
} catch (_) {}

const cacheFilePath = path.join(__dirname, '../.scratch/cursa_harvested_cache.json');

const sitemaps = [
  { lang: 'pt', name: 'Cursa (Português)', url: 'https://cursa.app/sitemaps/PT/vidcourses.txt' },
  { lang: 'en', name: 'Cursa (English)', url: 'https://cursa.app/sitemaps/EN/vidcourses.txt' },
  { lang: 'es', name: 'Cursa (Español)', url: 'https://cursa.app/sitemaps/SP/vidcourses.txt' },
  { lang: 'fr', name: 'Cursa (Français)', url: 'https://cursa.app/sitemaps/FR/vidcourses.txt' },
  { lang: 'hi', name: 'Cursa (Hindi)', url: 'https://cursa.app/sitemaps/HI/vidcourses.txt' }
];

function mapArea(about, title, lang) {
  const s = `${about || ''} ${title || ''}`.toLowerCase();
  
  if (
    s.includes('inteligência artificial') || s.includes('artificial intelligence') || s.includes('inteligencia artificial') ||
    s.includes('machine learning') || s.includes('deep learning') || s.includes('data science') || s.includes('ciência de dados') ||
    s.includes('ciencia de datos') || s.includes('science des données') || s.includes('big data') || s.includes('python para dados') ||
    s.includes('डेटा')
  ) {
    return 'Inteligência Artificial & Dados';
  }

  if (
    s.includes('desenvolvimento web') || s.includes('web development') || s.includes('desarrollo web') || s.includes('développement web') ||
    s.includes('front-end') || s.includes('back-end') || s.includes('javascript') || s.includes('html') || s.includes('css') ||
    s.includes('react') || s.includes('angular') || s.includes('vue') || s.includes('node') || s.includes('php') || s.includes('java') ||
    s.includes('python') || s.includes('c#') || s.includes('c++') || s.includes('golang') || s.includes('flutter') || s.includes('kotlin') ||
    s.includes('swift') || s.includes('mobile') || s.includes('aplicativos') || s.includes('apps') || s.includes('games') || s.includes('jogos') ||
    s.includes('programação') || s.includes('programming') || s.includes('programación') || s.includes('programmation') || s.includes('वेब') ||
    s.includes('वर्डप्रेस') || s.includes('código') || s.includes('code')
  ) {
    return 'Desenvolvimento Web & Mobile';
  }

  if (
    s.includes('redes') || s.includes('networks') || s.includes('réseaux') || s.includes('segurança') || s.includes('security') ||
    s.includes('seguridad') || s.includes('sécurité') || s.includes('cloud') || s.includes('aws') || s.includes('azure') ||
    s.includes('linux') || s.includes('devops') || s.includes('docker') || s.includes('kubernetes') || s.includes('servidores') ||
    s.includes('hardware') || s.includes('banco de dados') || s.includes('database') || s.includes('base de datos') || s.includes('sql') ||
    s.includes('robótica') || s.includes('robotics') || s.includes('clp') || s.includes('arduino')
  ) {
    return 'DevOps, Cloud & Infraestrutura';
  }

  if (
    s.includes('administração') || s.includes('business') || s.includes('gestão') || s.includes('management') || s.includes('gestión') ||
    s.includes('marketing') || s.includes('vendas') || s.includes('sales') || s.includes('ventas') || s.includes('finanças') ||
    s.includes('finance') || s.includes('finanzas') || s.includes('contabilidade') || s.includes('accounting') || s.includes('contabilidad') ||
    s.includes('recursos humanos') || s.includes('rh') || s.includes('hr') || s.includes('logística') || s.includes('logistics') ||
    s.includes('empreendedorismo') || s.includes('entrepreneurship') || s.includes('investimentos') || s.includes('investing')
  ) {
    return 'Gestão & Negócios';
  }

  if (
    s.includes('inglês') || s.includes('english') || s.includes('espanhol') || s.includes('spanish') || s.includes('español') ||
    s.includes('francês') || s.includes('french') || s.includes('français') || s.includes('alemão') || s.includes('german') ||
    s.includes('italiano') || s.includes('italian') || s.includes('idiomas') || s.includes('languages') || s.includes('langues') ||
    s.includes('japonês') || s.includes('japanese') || s.includes('coreano') || s.includes('korean') || s.includes('mandarim') ||
    s.includes('chinese') || s.includes('libras') || s.includes('russo') || s.includes('russian') || s.includes('अंग्रेजी')
  ) {
    return 'Idiomas';
  }

  if (
    s.includes('direito') || s.includes('law') || s.includes('derecho') || s.includes('droit') || s.includes('filosofia') ||
    s.includes('philosophy') || s.includes('história') || s.includes('history') || s.includes('histoire') || s.includes('sociologia') ||
    s.includes('sociology') || s.includes('política') || s.includes('concursos') || s.includes('enem') || s.includes('pedagogia') ||
    s.includes('educação') || s.includes('education')
  ) {
    return 'Ciências Humanas';
  }

  if (
    s.includes('matemática') || s.includes('math') || s.includes('matematicas') || s.includes('mathématiques') ||
    s.includes('física') || s.includes('physics') || s.includes('physique') || s.includes('química') || s.includes('chemistry') ||
    s.includes('chimie') || s.includes('estatística') || s.includes('statistics') || s.includes('estadística') || s.includes('गणित')
  ) {
    return 'Ciências Exatas';
  }

  if (
    s.includes('saúde') || s.includes('health') || s.includes('salud') || s.includes('santé') || s.includes('enfermagem') ||
    s.includes('nursing') || s.includes('enfermería') || s.includes('medicina') || s.includes('medicine') || s.includes('nutrição') ||
    s.includes('nutrition') || s.includes('farmácia') || s.includes('pharmacy') || s.includes('biologia') || s.includes('biology') ||
    s.includes('psicologia') || s.includes('psychology') || s.includes('primeiros socorros') || s.includes('first aid')
  ) {
    return 'Ciências & Saúde';
  }

  if (
    s.includes('design') || s.includes('música') || s.includes('music') || s.includes('musique') || s.includes('fotografia') ||
    s.includes('photography') || s.includes('photographie') || s.includes('vídeo') || s.includes('video') || s.includes('áudio') ||
    s.includes('audio') || s.includes('violão') || s.includes('guitar') || s.includes('piano') || s.includes('desenho') ||
    s.includes('drawing') || s.includes('photoshop') || s.includes('illustrator') || s.includes('figma') || s.includes('canva')
  ) {
    return 'Comunicação & Artes';
  }

  return 'Tecnologia & Guias Digitais';
}

function titleCaseSlug(slug) {
  return slug
    .replace(/-[a-z0-9]{2,4}$/i, '') // remove hash suffix
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function getCertText(lang) {
  switch (lang) {
    case 'en': return 'Includes free digital certificate of completion issued by the Cursa app.';
    case 'es': return 'Incluye certificado digital gratuito de finalización emitido por la aplicación Cursa.';
    case 'fr': return "Comprend la délivrance d'un certificat numérique gratuit par l'application Cursa.";
    case 'hi': return 'Cursa ऐप द्वारा मुफ्त पूर्णता प्रमाणपत्र (free digital certificate) शामिल है।';
    default: return 'Inclui emissão de certificado digital gratuito pelo aplicativo Cursa.';
  }
}

function ensureCertMention(desc, lang) {
  const d = desc || '';
  const lower = d.toLowerCase();
  if (lower.includes('certificad') || lower.includes('certificat') || lower.includes('certificate') || d.includes('प्रमाणपत्र')) {
    return d;
  }
  return `${d} ${getCertText(lang)}`;
}

async function main() {
  console.log('=== HARVESTER GERAL DE CURSOS DA PLATAFORMA CURSA (5 IDIOMAS) ===');
  
  // 1. Carregar cache se existir
  const courseMap = new Map();
  for (const c of existingCourses) {
    courseMap.set(c.url, c);
  }

  if (fs.existsSync(cacheFilePath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
      for (const item of cached) {
        if (!courseMap.has(item.url)) {
          courseMap.set(item.url, item);
        }
      }
      console.log(`Carregados ${courseMap.size} cursos do cache existente.`);
    } catch (_) {}
  }

  // 2. Baixar sitemaps e obter URLs
  const urlsToFetch = [];
  for (const sm of sitemaps) {
    try {
      console.log(`Baixando sitemap para ${sm.lang.toUpperCase()}: ${sm.url}`);
      const res = await fetch(sm.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const text = await res.text();
      const urls = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
      console.log(`-> Encontrados ${urls.length} cursos em ${sm.lang.toUpperCase()}`);

      for (const u of urls) {
        if (!courseMap.has(u)) {
          urlsToFetch.push({ url: u, lang: sm.lang, plataforma: sm.name });
        }
      }
    } catch (err) {
      console.error(`Erro ao baixar sitemap ${sm.url}:`, err.message);
    }
  }

  console.log(`Total de novos cursos a processar: ${urlsToFetch.length}`);

  // 3. Pool de requisições concorrentes
  const concurrency = 30;
  let processed = 0;
  let idx = 0;
  const total = urlsToFetch.length;
  let lastSave = Date.now();

  async function worker() {
    while (idx < total) {
      const item = urlsToFetch[idx++];
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        const res = await fetch(item.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.status === 200) {
          const html = await res.text();
          const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
          if (m) {
            try {
              const data = JSON.parse(m[1]);
              const rawName = data.name || '';
              const rawDesc = data.description || '';
              const about = data.about || '';
              const area = mapArea(about, rawName, item.lang);
              const certSuffix = getCertText(item.lang);

              const desc = rawDesc
                ? ensureCertMention(rawDesc, item.lang)
                : `Curso completo de ${rawName} na Cursa. ${getCertText(item.lang)}`;

              courseMap.set(item.url, {
                titulo: `${rawName} (Cursa)`,
                tipo: 'curso',
                area,
                plataforma: item.plataforma,
                url: item.url,
                licenca: 'gratuito',
                nivel: 'Iniciante',
                descricao: desc
              });
            } catch (parseErr) {
              // fallback
            }
          }
        }
      } catch (err) {
        // Fallback para slug
        const slug = item.url.split('/').pop() || '';
        const fallbackTitle = titleCaseSlug(slug);
        const area = mapArea('', fallbackTitle, item.lang);
        const certSuffix = getCertText(item.lang);

        courseMap.set(item.url, {
          titulo: `${fallbackTitle} (Cursa)`,
          tipo: 'curso',
          area,
          plataforma: item.plataforma,
          url: item.url,
          licenca: 'gratuito',
          nivel: 'Iniciante',
          descricao: `Curso completo de ${fallbackTitle} disponível na plataforma Cursa com aulas em vídeo. ${certSuffix}`
        });
      }

      processed++;
      if (processed % 100 === 0 || processed === total) {
        const pct = ((processed / total) * 100).toFixed(1);
        console.log(`[Progresso] ${processed}/${total} (${pct}%) - Total indexado: ${courseMap.size}`);
        
        // Salvar checkpoint
        if (Date.now() - lastSave > 15000 || processed === total) {
          fs.writeFileSync(cacheFilePath, JSON.stringify(Array.from(courseMap.values())), 'utf8');
          lastSave = Date.now();
        }
      }
    }
  }

  if (total > 0) {
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  const finalCourseList = Array.from(courseMap.values());
  console.log(`=== Concluído! Total de cursos Cursa catalogados: ${finalCourseList.length} ===`);

  // Salvar cache permanente
  fs.writeFileSync(cacheFilePath, JSON.stringify(finalCourseList, null, 2), 'utf8');

  // Atualizar cursaCoursesData.js
  const cursaCoursesDataPath = path.join(__dirname, '../src/database/cursaCoursesData.js');
  const codeContent = `/**
 * Catálogo Oficial Curado de Cursos Gratuitos da Plataforma Cursa (cursa.app)
 * Cursos com emissão de Certificado Gratuito nos 5 idiomas solicitados:
 * - Português (cursa.app/pt)
 * - Inglês (cursa.app/en)
 * - Espanhol (cursa.app/es)
 * - Francês (cursa.app/fr)
 * - Hindi (cursa.app/hi)
 * 
 * Total de cursos catalogados: ${finalCourseList.length}
 * Diretriz AGENTS.md: Somente metadados e redirecionamentos externos 302.
 */

const cursaCoursesList = ${JSON.stringify(finalCourseList, null, 2)};

module.exports = { cursaCoursesList };
`;

  fs.writeFileSync(cursaCoursesDataPath, codeContent, 'utf8');
  console.log(`Arquivo cursaCoursesData.js atualizado com sucesso (${finalCourseList.length} cursos).`);
}

main().catch(err => {
  console.error('Falha geral no harvester de cursos Cursa:', err);
  process.exit(1);
});
