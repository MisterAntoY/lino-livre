const fs = require('node:fs');
const path = require('node:path');

async function main() {
  console.log('Iniciando coleta estruturada de Exercícios & Simulados da plataforma Cursa...');

  const categoryEndpoints = [
    { url: 'https://cursa.app/pt/exercicios', cat: 'geral' },
    { url: 'https://cursa.app/pt/exercicios?page=2', cat: 'geral' },
    { url: 'https://cursa.app/pt/exercicios?page=3', cat: 'geral' },
    { url: 'https://cursa.app/pt/exercicios?category=informatica-ti', cat: 'tech' },
    { url: 'https://cursa.app/pt/exercicios?category=informatica-ti&page=2', cat: 'tech' },
    { url: 'https://cursa.app/pt/exercicios?category=informatica-ti&page=3', cat: 'tech' },
    { url: 'https://cursa.app/pt/exercicios?category=gestao-e-negocios', cat: 'gestao' },
    { url: 'https://cursa.app/pt/exercicios?category=gestao-e-negocios&page=2', cat: 'gestao' },
    { url: 'https://cursa.app/pt/exercicios?category=idiomas', cat: 'idiomas' },
    { url: 'https://cursa.app/pt/exercicios?category=direito', cat: 'direito' },
    { url: 'https://cursa.app/pt/exercicios?category=preparatorio-enem-vestibulares', cat: 'vestibular' },
    { url: 'https://cursa.app/pt/exercicios?category=preparatorio-concursos', cat: 'concursos' },
    { url: 'https://cursa.app/pt/exercicios?category=saude', cat: 'saude' },
    { url: 'https://cursa.app/pt/exercicios?category=musica', cat: 'musica' },
    { url: 'https://cursa.app/pt/exercicios?category=profissionalizantes', cat: 'profissional' }
  ];

  function mapArea(itemUrl, subName) {
    const s = (subName + ' ' + itemUrl).toLowerCase();
    
    if (s.includes('inteligência artificial') || s.includes('ciência de dados') || s.includes('anomalias') || s.includes('machine-learning')) {
      return 'Inteligência Artificial & Dados';
    }
    if (s.includes('programação de jogos') || s.includes('front-end') || s.includes('desenvolvimento-web') || s.includes('aplicativos') || s.includes('back-end') || s.includes('python') || s.includes('java') || s.includes('ruby') || s.includes('logica-de-programacao')) {
      return 'Desenvolvimento Web & Mobile';
    }
    if (s.includes('redes') || s.includes('servidores') || s.includes('segurança-da-informacao') || s.includes('hardware') || s.includes('robótica') || s.includes('clp') || s.includes('linux') || s.includes('ferramentas-de-ti') || s.includes('banco-de-dados') || s.includes('testes-de-software') || s.includes('qa')) {
      return 'DevOps, Cloud & Infraestrutura';
    }
    if (s.includes('gestão') || s.includes('administração') || s.includes('marketing') || s.includes('finanças') || s.includes('contabilidade') || s.includes('recursos-humanos') || s.includes('vendas') || s.includes('logística') || s.includes('estoquista') || s.includes('negócios') || s.includes('investimentos') || s.includes('hotelaria') || s.includes('corretor')) {
      return 'Gestão & Negócios';
    }
    if (s.includes('idiomas') || s.includes('ingles') || s.includes('espanhol') || s.includes('frances') || s.includes('alemao') || s.includes('coreano') || s.includes('russo') || s.includes('japones') || s.includes('mandarim') || s.includes('chines') || s.includes('libras') || s.includes('latim') || s.includes('italiano') || s.includes('hebraico') || s.includes('portugues') || s.includes('redacao')) {
      return 'Idiomas';
    }
    if (s.includes('direito') || s.includes('penal') || s.includes('trabalho') || s.includes('constitucional') || s.includes('estatutos') || s.includes('oab') || s.includes('filosofia') || s.includes('política') || s.includes('sociologia') || s.includes('história') || s.includes('literatura') || s.includes('concursos') || s.includes('policia') || s.includes('inss') || s.includes('detran') || s.includes('ibge') || s.includes('tribunais') || s.includes('judiciario')) {
      return 'Ciências Humanas';
    }
    if (s.includes('matemática') || s.includes('matematica') || s.includes('estatística') || s.includes('probabilidade') || s.includes('física') || s.includes('química') || s.includes('raciocínio-logico')) {
      return 'Ciências Exatas';
    }
    if (s.includes('saúde') || s.includes('saude') || s.includes('enfermagem') || s.includes('nutrição') || s.includes('nutricao') || s.includes('farmac') || s.includes('biomedicina') || s.includes('fisioterapia') || s.includes('biologia') || s.includes('psicologia') || s.includes('primeiros-socorros') || s.includes('anatomia') || s.includes('hipnose') || s.includes('massoterapia') || s.includes('pele') || s.includes('idosos') || s.includes('exercicios-fisicos')) {
      return 'Ciências & Saúde';
    }
    if (s.includes('música') || s.includes('musica') || s.includes('áudio') || s.includes('audio') || s.includes('design') || s.includes('audiovisual') || s.includes('dança') || s.includes('danca') || s.includes('canto') || s.includes('guitarra') || s.includes('violão') || s.includes('violao') || s.includes('teclado') || s.includes('bateria') || s.includes('baixo') || s.includes('dj') || s.includes('acordeon') || s.includes('edicao-de-video') || s.includes('fotografia') || s.includes('maquiagem') || s.includes('artesanato') || s.includes('moda')) {
      return 'Comunicação & Artes';
    }
    return 'Tecnologia & Guias Digitais';
  }

  function mapNivel(dif) {
    if (!dif) return 'Iniciante';
    const d = dif.toLowerCase();
    if (d.includes('fácil') || d.includes('facil')) return 'Iniciante';
    if (d.includes('média') || d.includes('media')) return 'Intermediário';
    if (d.includes('difícil') || d.includes('dificil')) return 'Avançado';
    return 'Iniciante';
  }

  const collectedMap = new Map();

  // Portais principais nos idiomas suportados
  const masterPortals = [
    {
      titulo: 'Cursa: Portal de Exercícios e Questões com Respostas Comentadas',
      tipo: 'exercicios',
      area: 'Tecnologia & Guias Digitais',
      plataforma: 'Cursa (Português)',
      url: 'https://cursa.app/pt/exercicios',
      licenca: 'gratuito',
      nivel: 'Iniciante',
      descricao: 'Portal central de exercícios práticos gratuitos da plataforma Cursa com milhares de questionários de múltipla escolha comentados em tecnologia, programação, IA, idiomas, direito e gestão para fixação de conhecimento e preparação para certificação gratuita.'
    },
    {
      titulo: 'Cursa: Free Practice Exercises & Quizzes with Feedback (English)',
      tipo: 'exercicios',
      area: 'Tecnologia & Guias Digitais',
      plataforma: 'Cursa (English)',
      url: 'https://cursa.app/en/exercises',
      licenca: 'gratuito',
      nivel: 'Iniciante',
      descricao: 'Official Cursa interactive exercises and multiple-choice quizzes with detailed explanations in programming, languages, IT, and business for knowledge reinforcement and free certificate exam preparation.'
    },
    {
      titulo: 'Cursa: Ejercicios y Cuestionarios Prácticos Gratuitos (Español)',
      tipo: 'exercicios',
      area: 'Tecnologia & Guias Digitais',
      plataforma: 'Cursa (Español)',
      url: 'https://cursa.app/es/ejercicios',
      licenca: 'gratuito',
      nivel: 'Iniciante',
      descricao: 'Portal de ejercicios prácticos y cuestionarios de opción múltiple con respuestas comentadas en tecnología, idiomas y gestión para consolidar aprendizajes y preparar la obtención de certificados gratuitos en Cursa.'
    },
    {
      titulo: 'Cursa: Exercices et Quiz Pratiques Gratuits avec Corrigés (Français)',
      tipo: 'exercicios',
      area: 'Tecnologia & Guias Digitais',
      plataforma: 'Cursa (Français)',
      url: 'https://cursa.app/fr/exercices',
      licenca: 'gratuito',
      nivel: 'Iniciante',
      descricao: 'Banque officielle d\'exercices et de quiz à choix multiples avec explications détaillées pour valider vos compétences et préparer l\'obtention de votre certificat gratuit sur l\'application Cursa.'
    },
    {
      titulo: 'Cursa: अभ्यास और प्रश्नोत्तरी — Practice Exercises in Hindi (Cursa)',
      tipo: 'exercicios',
      area: 'Tecnologia & Guias Digitais',
      plataforma: 'Cursa (Hindi)',
      url: 'https://cursa.app/hi/exercises',
      licenca: 'gratuito',
      nivel: 'Iniciante',
      descricao: 'प्रश्नोत्तरी और अभ्यास: Cursa free practice questions and quizzes with detailed explanations to reinforce learning and prepare for the free certificate (प्रमाणपत्र).'
    }
  ];

  for (const portal of masterPortals) {
    collectedMap.set(portal.url, portal);
  }

  const regexCard = /<a class="quiz-card" href="([^"]+)">[\s\S]*?<h3>([^<]+)<\/h3>[\s\S]*?<p class="desc">([^<]+)<\/p>[\s\S]*?<li><b>(\d+)<\/b>\s*Perguntas<\/li>[\s\S]*?<li>([^<]+)<\/li>[\s\S]*?<li class="sub">([^<]+)<\/li>/g;

  for (const endpoint of categoryEndpoints) {
    try {
      console.log(`Baixando página: ${endpoint.url}`);
      const res = await fetch(endpoint.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.status !== 200) {
        console.warn(`Status ${res.status} em ${endpoint.url}`);
        continue;
      }
      const html = await res.text();
      let m;
      let pageCount = 0;
      while ((m = regexCard.exec(html)) !== null) {
        const itemUrl = m[1].trim();
        if (!collectedMap.has(itemUrl)) {
          const rawTitulo = m[2].trim();
          const rawDesc = m[3].trim();
          const perguntas = m[4].trim();
          const dif = m[5].trim();
          const sub = m[6].trim();

          const area = mapArea(itemUrl, sub);
          const nivel = mapNivel(dif);

          collectedMap.set(itemUrl, {
            titulo: `${rawTitulo} — Exercícios & Simulado (Cursa)`,
            tipo: 'exercicios',
            area,
            plataforma: 'Cursa (Português)',
            url: itemUrl,
            licenca: 'gratuito',
            nivel,
            descricao: `${rawDesc} Módulo com ${perguntas} questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa.`
          });
          pageCount++;
        }
      }
      console.log(`-> Extraídos ${pageCount} novos exercícios.`);
    } catch (err) {
      console.error(`Erro ao processar ${endpoint.url}: ${err.message}`);
    }
  }

  const finalList = Array.from(collectedMap.values());
  console.log(`Total final de módulos de exercícios da Cursa: ${finalList.length}`);

  const targetFile = path.join(__dirname, '../src/database/cursaExerciciosData.js');
  const fileContent = `/**
 * Catálogo Oficial Curado de Exercícios e Simulados Práticos da Plataforma Cursa (cursa.app/pt/exercicios)
 * Exercícios interativos com gabarito e respostas explicadas em tecnologia, IA, idiomas, direito e mais.
 * Preparação prática para certificação gratuita emitida pelo aplicativo Cursa.
 * 
 * Diretriz AGENTS.md: Somente metadados e redirecionamentos externos 302.
 */

const cursaExerciciosList = ${JSON.stringify(finalList, null, 2)};

module.exports = { cursaExerciciosList };
`;

  fs.writeFileSync(targetFile, fileContent, 'utf8');
  console.log(`Arquivo salvo com sucesso em: ${targetFile}`);
}

main().catch(err => {
  console.error('Falha geral no script:', err);
  process.exit(1);
});
