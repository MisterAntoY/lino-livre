const fs = require('fs');

const bdevLivros = JSON.parse(fs.readFileSync('scratch/bdev_livros.json', 'utf8')).filter(f => f.name.endsWith('.pdf'));
const bdevImgs = JSON.parse(fs.readFileSync('scratch/bdev_imgs.json', 'utf8'));
const italoLivros = JSON.parse(fs.readFileSync('scratch/italo_livros.json', 'utf8')).filter(f => f.name.endsWith('.pdf'));

function norm(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

const imgNormMap = new Map();
for (const img of bdevImgs) {
  imgNormMap.set(norm(img.name.replace(/\.svg$/, '')), img.name);
}

function categorizar(titulo) {
  const t = titulo.toLowerCase();
  if (t.includes('agile') || t.includes('ágil') || t.includes('scrum') || t.includes('kanban') || t.includes('lean') || t.includes('gestão') || t.includes('liderança') || t.includes('carreira') || t.includes('hábito') || t.includes('feedback') || t.includes('startup') || t.includes('produto') || t.includes('coaching') || t.includes('métricas') || t.includes('ego') || t.includes('generalista') || t.includes('produtiv') || t.includes('regra é não ter')) {
    return 'Metodologias Ágeis & Carreira Tech';
  }
  if (t.includes('data') || t.includes('dados') || t.includes('machine learning') || t.includes('inteligência') || t.includes('ia') || t.includes('deep learning') || t.includes('estatística') || t.includes('bi') || t.includes('business intelligence') || t.includes('sql') || t.includes('nosql') || t.includes('redis') || t.includes('mongo') || t.includes('banco de dados')) {
    return 'Ciência de Dados & Inteligência Artificial';
  }
  if (t.includes('cloud') || t.includes('aws') || t.includes('azure') || t.includes('devops') || t.includes('docker') || t.includes('kubernetes') || t.includes('linux') || t.includes('rede') || t.includes('git') || t.includes('shell') || t.includes('jenkins') || t.includes('sysops') || t.includes('servidor') || t.includes('sre') || t.includes('infraestrutura') || t.includes('bash')) {
    return 'DevOps, Cloud & Infraestrutura';
  }
  if (t.includes('web') || t.includes('mobile') || t.includes('html') || t.includes('css') || t.includes('javascript') || t.includes('typescript') || t.includes('react') || t.includes('node') || t.includes('android') || t.includes('ios') || t.includes('flutter') || t.includes('frontend') || t.includes('front end') || t.includes('rest') || t.includes('spring') || t.includes('oauth') || t.includes('ux') || t.includes('seo') || t.includes('pwa') || t.includes('progressive web') || t.includes('php') || t.includes('laravel') || t.includes('c#') || t.includes('java')) {
    return 'Desenvolvimento Web & Mobile';
  }
  if (t.includes('arquitetura') || t.includes('padrões') || t.includes('patterns') || t.includes('refatora') || t.includes('código') || t.includes('clean') || t.includes('tdd') || t.includes('bdd') || t.includes('ddd') || t.includes('domain') || t.includes('algoritmo') || t.includes('design') || t.includes('orientado') || t.includes('teste') || t.includes('craftsman') || t.includes('interview') || t.includes('programador')) {
    return 'Arquitetura & Engenharia de Software';
  }
  return 'Tecnologia & Guias Digitais';
}

function findBestSvg(text) {
  const n = norm(text);
  if (imgNormMap.has(n)) return imgNormMap.get(n);
  for (const [k, v] of imgNormMap.entries()) {
    if (k.length > 8 && (n.includes(k) || k.includes(n))) return v;
  }
  const words = n.split(/[^a-z0-9]+/).filter(w => w.length >= 5);
  for (const [k, v] of imgNormMap.entries()) {
    const matches = words.filter(w => k.includes(w));
    if (matches.length >= 2 || (words.length === 1 && matches.length === 1 && words[0].length >= 7)) {
      return v;
    }
  }
  return null;
}

function calcLeituras(titulo) {
  const t = titulo.toLowerCase();
  if (t.includes('arquitetura limpa')) return 650;
  if (t.includes('código limpo') || t.includes('codigo limpo')) return 640;
  if (t.includes('refatora')) return 630;
  if (t.includes('padrões de projeto') || t.includes('design patterns')) return 620;
  if (t.includes('pragmático') || t.includes('pragmatico')) return 610;
  if (t.includes('domain driven') || t.includes('domain-driven')) return 600;
  if (t.includes('tdd')) return 590;
  if (t.includes('startup enxuta')) return 580;
  if (t.includes('scrum')) return 570;
  if (t.includes('html5 e css3')) return 560;
  if (t.includes('kubernetes')) return 550;
  if (t.includes('data-intensive')) return 540;
  if (t.includes('site reliability')) return 530;
  if (t.includes('shell script')) return 520;
  if (t.includes('pro git')) return 510;
  return Math.floor(Math.random() * 80) + 120;
}

// 1. Processar todos os livros de BibliotecaDev
const bdevOutput = [];
for (const b of bdevLivros) {
  const filename = b.name.replace(/\.pdf$/, '');
  const autorMatch = filename.match(/\s*-\s*Auto[r]?\s*\(([^)]+)\)\s*$/i);
  let autor = autorMatch ? autorMatch[1].trim() : 'Comunidade Tech';
  let titleFull = autorMatch ? filename.slice(0, autorMatch.index).trim() : filename;

  let titulo = titleFull;
  let subtitulo = null;
  if (titleFull.includes(' - ')) {
    const p = titleFull.split(' - ');
    titulo = p[0].trim();
    subtitulo = p.slice(1).join(' - ').trim();
  }

  const svg = findBestSvg(titleFull) || findBestSvg(titulo) || 'Arquitetura Limpa - O Guia do Artesão para Estrutura e Design de Software.svg';
  const capaUrl = `https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/${encodeURIComponent(svg)}`;
  const pdfUrl = `https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/${encodeURIComponent(b.name)}`;
  const slug = 'bdev-' + norm(titulo).slice(0, 35);
  const cat = categorizar(titulo + ' ' + (subtitulo || ''));

  bdevOutput.push({
    titulo,
    subtitulo,
    autor,
    categoria: cat,
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: slug,
    ano: 2020,
    paginas: Math.floor(Math.random() * 150) + 200,
    sinopse: `Obra de referência sobre ${titulo}. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.`,
    capaUrl,
    leituras: calcLeituras(titulo),
    links: [{ formato: 'pdf', url: pdfUrl }]
  });
}

console.log('BibliotecaDev processados:', bdevOutput.length);

// 2. Processar todos os livros de italocamil0
const italoOutput = [];
const seenItaloSlugs = new Set();

for (const b of italoLivros) {
  let name = b.name.replace(/\.pdf$/, '').replace(/^\([^)]+\)\s*/, '');
  let autor = 'Comunidade Tech';
  let titulo = name;
  let subtitulo = null;

  if (name.includes(' - ')) {
    const parts = name.split(' - ');
    if (parts.length === 2) {
      if (parts[1].toLowerCase().includes('casa do codigo') || parts[1].toLowerCase().includes('caelum')) {
        titulo = parts[0].trim();
        autor = parts[1].trim();
      } else if (parts[0].split(' ').length <= 3 && !parts[0].toLowerCase().includes('apostila') && !parts[0].toLowerCase().includes('curso')) {
        autor = parts[0].trim();
        titulo = parts[1].trim();
      } else {
        titulo = parts[0].trim();
        autor = parts[1].replace(/\(Auth\.\)/i, '').replace(/\(\d{4}\)/, '').trim();
      }
    } else {
      titulo = parts[0].trim();
      subtitulo = parts.slice(1, parts.length - 1).join(' - ').trim() || null;
      autor = parts[parts.length - 1].replace(/\(Auth\.\)/i, '').replace(/\(\d{4}\)/, '').trim();
    }
  }

  if (autor.toLowerCase().includes('casa do codigo')) autor = 'Casa do Código';
  if (autor.toLowerCase().includes('caelum')) autor = 'Caelum';
  if (autor.toLowerCase().includes('erica')) autor = 'Editora Érica';
  if (autor.toLowerCase().includes('newnes')) autor = 'Newnes Publishing';

  const svg = findBestSvg(titulo) || findBestSvg(name);
  let capaUrl = svg 
    ? `https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/${encodeURIComponent(svg)}`
    : 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg';

  const cat = categorizar(titulo + ' ' + (subtitulo || ''));
  const pdfUrl = `https://raw.githubusercontent.com/italocamil0/books/main/books/${encodeURIComponent(b.name)}`;
  let slug = 'italo-' + norm(titulo).slice(0, 35);
  if (seenItaloSlugs.has(slug)) {
    slug += '-' + (seenItaloSlugs.size + 1);
  }
  seenItaloSlugs.add(slug);

  italoOutput.push({
    titulo,
    subtitulo,
    autor,
    categoria: cat,
    fonteSlug: 'github-italocamilo',
    fonteIdExterno: slug,
    ano: 2018,
    paginas: Math.floor(Math.random() * 140) + 180,
    sinopse: `Manual e guia técnico abordando ${titulo}. Disponibilizado para estudo no repositório de livros abertos de italocamil0.`,
    capaUrl,
    leituras: calcLeituras(titulo),
    links: [{ formato: 'pdf', url: pdfUrl }]
  });
}

console.log('italocamil0 processados:', italoOutput.length);

// 3. Guias e Roadmaps de Trilha Info (Flávio Mendes)
const trilhaGuides = [
  {
    titulo: 'Trilha Info: Notação Big O (Guia Visual de Algoritmos)',
    subtitulo: 'Complexidade de tempo e espaço, O(1), O(log n), O(n) e boas práticas computacionais',
    autor: 'Flávio Mendes',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-guide-big-o',
    ano: 2026,
    paginas: 65,
    sinopse: 'Guia visual e analítico sobre complexidade algorítmica Big O, análise de desempenho de estruturas de dados e otimização de loops.',
    capaUrl: 'https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/bigO.jpg',
    leituras: 350,
    links: [{ formato: 'html', url: 'https://trilha.info' }]
  },
  {
    titulo: 'Trilha Info: Autenticação Básica & Segurança Web',
    subtitulo: 'HTTP Basic Auth, cabeçalhos, tokens, cookies e práticas seguras em APIs',
    autor: 'Flávio Mendes',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-guide-basic-auth',
    ano: 2026,
    paginas: 50,
    sinopse: 'Conceitos essenciais de autenticação web, vulnerabilidades comuns e como implementar autenticação em APIs REST.',
    capaUrl: 'https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/basicAuth.jpg',
    leituras: 320,
    links: [{ formato: 'html', url: 'https://trilha.info' }]
  },
  {
    titulo: 'Trilha Info: Onboarding Eficaz de Desenvolvedores',
    subtitulo: 'Como acelerar a adaptação em novos times, setup de ambientes e documentação',
    autor: 'Flávio Mendes',
    categoria: 'Metodologias Ágeis & Carreira Tech',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-guide-onboarding',
    ano: 2026,
    paginas: 45,
    sinopse: 'Boas práticas para integração de novos engenheiros em squads, rituais ágeis, arquitetura do projeto e primeiros deploys.',
    capaUrl: 'https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/onboarding.jpg',
    leituras: 310,
    links: [{ formato: 'html', url: 'https://trilha.info' }]
  },
  {
    titulo: 'Trilha Info: SSO (Single Sign-On) e Gestão de Identidade',
    subtitulo: 'OIDC, OAuth2, SAML e federação de usuários em ecossistemas de microsserviços',
    autor: 'Flávio Mendes',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-guide-sso',
    ano: 2026,
    paginas: 55,
    sinopse: 'Guia arquitetural sobre federação de identidades, Single Sign-On e controle de acesso centralizado em aplicações modernas.',
    capaUrl: 'https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/sso.jpg',
    leituras: 330,
    links: [{ formato: 'html', url: 'https://trilha.info' }]
  },
  {
    titulo: 'Trilha Info: Modelo STAR para Entrevistas Técnicas',
    subtitulo: 'Situação, Tarefa, Ação e Resultado: estruturando respostas comportamentais e técnicas',
    autor: 'Flávio Mendes',
    categoria: 'Metodologias Ágeis & Carreira Tech',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-guide-star',
    ano: 2026,
    paginas: 40,
    sinopse: 'Método comprovado para entrevistas de emprego na área de tecnologia, permitindo destacar conquistas e liderança com clareza.',
    capaUrl: 'https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/star.jpg',
    leituras: 340,
    links: [{ formato: 'html', url: 'https://trilha.info' }]
  },
  {
    titulo: 'Trilha Info: SLA, SLO e SLI para Engenharia Confiável',
    subtitulo: 'Métricas de confiabilidade, orçamentos de erro (Error Budgets) e observabilidade SRE',
    autor: 'Flávio Mendes',
    categoria: 'DevOps, Cloud & Infraestrutura',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-guide-sla-slo-sli',
    ano: 2026,
    paginas: 60,
    sinopse: 'Guia prático de Site Reliability Engineering (SRE) sobre como definir Service Level Agreements, Objectives e Indicators.',
    capaUrl: 'https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/slaSloSli.jpg',
    leituras: 360,
    links: [{ formato: 'html', url: 'https://trilha.info' }]
  },
  {
    titulo: 'Trilha Info: JavaScript Async & Defer na Performance Web',
    subtitulo: 'Ciclo de vida do carregamento de scripts, render-blocking e Core Web Vitals',
    autor: 'Flávio Mendes',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-guide-async-defer',
    ano: 2026,
    paginas: 45,
    sinopse: 'Como otimizar a velocidade de carregamento de páginas web dominando a execução assíncrona de scripts e ordenação do DOM.',
    capaUrl: 'https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/jsAsyncDefer.jpg',
    leituras: 315,
    links: [{ formato: 'html', url: 'https://trilha.info' }]
  },
  {
    titulo: 'Trilha Info: Formação Desenvolvedor Frontend',
    subtitulo: 'HTML, CSS, JavaScript, React, Vue, TypeScript, Performance e Acessibilidade Web',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-frontend',
    ano: 2026,
    paginas: 200,
    sinopse: 'Roteiro de estudos completo e gratuito com materiais em português para formação sólida em Frontend moderno.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp',
    leituras: 450,
    links: [{ formato: 'html', url: 'https://trilha.info/roadmap/frontend' }]
  },
  {
    titulo: 'Trilha Info: Formação Desenvolvedor Backend',
    subtitulo: 'APIs RESTful, Microsserviços, SQL, NoSQL, Autenticação, Cache e Mensageria',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-backend',
    ano: 2026,
    paginas: 220,
    sinopse: 'Trilha estruturada do zero ao avançado em arquitetura backend, bancos de dados e desenvolvimento de servidores robustos.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/awesome/2ed4a9e52da1d1c276d7a2df6f618d02.webp',
    leituras: 440,
    links: [{ formato: 'html', url: 'https://trilha.info/roadmap/backend' }]
  },
  {
    titulo: 'Trilha Info: Guia Completo DevOps e Infraestrutura em Nuvem',
    subtitulo: 'Linux, Docker, Kubernetes, CI/CD, Terraform e observabilidade contínua',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'DevOps, Cloud & Infraestrutura',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-devops',
    ano: 2026,
    paginas: 180,
    sinopse: 'Trilha estruturada em português para dominar cultura DevOps, automação de deploys, containers e infraestrutura como código.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/10/maestro-20261005-1a2d7f9a4897756f/cda1e67a527c2b1071b43c6290662c37.webp',
    leituras: 430,
    links: [{ formato: 'html', url: 'https://trilha.info/roadmap/devops' }]
  },
  {
    titulo: 'Trilha Info: Guia de Engenharia de Dados & Big Data',
    subtitulo: 'Pipelines ETL, Data Lakes, Apache Spark, Airflow, SQL e modelagem analítica',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'Ciência de Dados & Inteligência Artificial',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-data-engineer',
    ano: 2026,
    paginas: 170,
    sinopse: 'Roteiro de formação para engenheiros de dados com recursos abertos cobrindo ingestão, processamento distribuído e governança de dados.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/AI_Expert_Roadmap/65927a0974e90c3df4e690236a471e89.webp',
    leituras: 420,
    links: [{ formato: 'html', url: 'https://trilha.info/roadmap/data-engineer' }]
  },
  {
    titulo: 'Trilha Info: Guia de Testes de Software & Garantia de Qualidade (QA)',
    subtitulo: 'Testes unitários, integração, end-to-end, automação com Cypress e pirâmide de testes',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-test-qa',
    ano: 2026,
    paginas: 140,
    sinopse: 'Trilha completa em português para qualidade de software, testes manuais e automatizados, boas práticas e CI/CD com foco em QA.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp',
    leituras: 410,
    links: [{ formato: 'html', url: 'https://trilha.info/roadmap/test' }]
  }
];

const guiadetiBooks = [
  {
    titulo: 'AI Expert Roadmap & Guia de IA',
    subtitulo: 'Trilha Completa de Inteligência Artificial e Data Science',
    autor: 'Guia de TI & Comunidade',
    categoria: 'Ciência de Dados & Inteligência Artificial',
    fonteSlug: 'guiadeti',
    fonteIdExterno: 'guiadeti-ai-expert',
    ano: 2026,
    paginas: 150,
    sinopse: 'Guia estruturado e prático para o estudo e domínio de Inteligência Artificial, Machine Learning, Deep Learning e Engenharia de Prompts.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/AI_Expert_Roadmap/65927a0974e90c3df4e690236a471e89.webp',
    leituras: 450,
    links: [{ formato: 'html', url: 'https://guiadeti.com.br/roadmaps/ai-expert-roadmap/' }]
  },
  {
    titulo: 'Guia Completo de Carreiras e Roadmaps de TI',
    subtitulo: 'Trilhas para Frontend, Backend, DevOps e Dados',
    autor: 'Guia de TI & Comunidade',
    categoria: 'Tecnologia & Guias Digitais',
    fonteSlug: 'guiadeti',
    fonteIdExterno: 'guiadeti-roadmaps-carreiras',
    ano: 2026,
    paginas: 180,
    sinopse: 'Coleção abrangente de mapas de estudo para profissionais e estudantes de computação navegarem com clareza em suas jornadas de aprendizado.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/awesome/2ed4a9e52da1d1c276d7a2df6f618d02.webp',
    leituras: 390,
    links: [{ formato: 'html', url: 'https://guiadeti.com.br/roadmaps/awesome-roadmaps/' }]
  },
  {
    titulo: 'Manual de Fundamentos DevOps, Cloud & Linux',
    subtitulo: 'Linux, Containers Docker, Git e Arquitetura de Nuvem',
    autor: 'Guia de TI & Comunidade',
    categoria: 'DevOps, Cloud & Infraestrutura',
    fonteSlug: 'guiadeti',
    fonteIdExterno: 'guiadeti-devops-linux',
    ano: 2026,
    paginas: 220,
    sinopse: 'Manual formativo sobre cultura DevOps, administração de sistemas Linux, automação e orquestração de servidores para infraestrutura moderna.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/10/maestro-20261005-1a2d7f9a4897756f/cda1e67a527c2b1071b43c6290662c37.webp',
    leituras: 520,
    links: [{ formato: 'html', url: 'https://guiadeti.com.br/cursos/curso-devops-cloud-linux-docker-e-projeto-marketplace/' }]
  },
  {
    titulo: 'TechGuide.sh - Guia de Carreiras e Tecnologias',
    subtitulo: 'Mapeamento de Habilidades e Competências Técnicas',
    autor: 'Guia de TI & Comunidade',
    categoria: 'Tecnologia & Guias Digitais',
    fonteSlug: 'guiadeti',
    fonteIdExterno: 'guiadeti-techguide',
    ano: 2026,
    paginas: 160,
    sinopse: 'Guia com caminhos estruturados de aprendizado, níveis de proficiência e tecnologias para desenvolvimento profissional.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/techguide/d9eb488def2346638788a8b5e8c1448d.webp',
    leituras: 410,
    links: [{ formato: 'html', url: 'https://guiadeti.com.br/roadmaps/techguidesh-guia-de-carreiras-e-tecnologias/' }]
  },
  {
    titulo: 'Trilha Info - Trilhas Gratuitas em Português',
    subtitulo: 'Formação Colaborativa em Frontend, Backend e DevOps',
    autor: 'Guia de TI & Comunidade',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'guiadeti',
    fonteIdExterno: 'guiadeti-trilha-info',
    ano: 2026,
    paginas: 190,
    sinopse: 'Trilhas colaborativas abertas em língua portuguesa para formação de desenvolvedores e preparação para entrevistas técnicas.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp',
    leituras: 375,
    links: [{ formato: 'html', url: 'https://guiadeti.com.br/roadmaps/trilha-info-trilhas-gratuitas-de-tecnologia/' }]
  },
  {
    titulo: 'Roadmap.sh - Developer Roadmaps Traduzidos',
    subtitulo: 'Diretório Global de Guias de Estudo para Desenvolvedores',
    autor: 'Guia de TI & Comunidade',
    categoria: 'Tecnologia & Guias Digitais',
    fonteSlug: 'guiadeti',
    fonteIdExterno: 'guiadeti-roadmapsh',
    ano: 2026,
    paginas: 210,
    sinopse: 'Mapas mentais e guias passo a passo cobrindo arquitetura de software, DevOps, segurança e stacks de programação.',
    capaUrl: 'https://guiadeti.com.br/seo/thumbnail/roadmaps/roadmap/f906b934-8cde-44f9-8f18-6822586aa9a5/fallback.webp?v=v2-1790651464',
    leituras: 490,
    links: [{ formato: 'html', url: 'https://guiadeti.com.br/roadmaps/roadmapsh-developer-roadmaps/' }]
  }
];

const todos = [...bdevOutput, ...italoOutput, ...trilhaGuides, ...guiadetiBooks];

const codeFinal = `/**
 * Acervo Curado de Livros Técnicos e Manuais Abertos via GitHub e Fontes Oficiais
 * Fontes Oficiais:
 * - https://github.com/KAYOKG/BibliotecaDev (${bdevOutput.length} livros com capas SVG e PDFs diretos)
 * - https://github.com/italocamil0/books/tree/main/books (${italoOutput.length} PDFs técnicos abertos)
 * - https://github.com/flaviojmendes/trilhainfo (${trilhaGuides.length} guias visuais e roadmaps)
 * - https://guiadeti.com.br (${guiadetiBooks.length} roadmaps e manuais digitais)
 */

const githubBooks = ${JSON.stringify(todos, null, 2)};

module.exports = { githubBooks };
`;

fs.writeFileSync('src/database/githubBooksSeedData.js', codeFinal, 'utf8');
console.log('Total consolidado:', todos.length);
