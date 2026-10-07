const { getDatabase } = require('./index');

function seed(dbInstance = null) {
  const db = dbInstance || getDatabase();

  console.log('Populando acervo Lino Livre com fontes, livros, links e cursos...');

  db.exec(`
    DELETE FROM links_livros;
    DELETE FROM import_jobs;
    DELETE FROM cursos;
    DELETE FROM livros;
    DELETE FROM autores;
    DELETE FROM categorias;
    DELETE FROM fontes;
    DELETE FROM sqlite_sequence;
  `);

  // 1. Inserir Fontes Oficiais (Guia de TI como principal fonte técnica)
  const insertFonte = db.prepare('INSERT INTO fontes (slug, nome, tipo, url_base, ativa) VALUES (?, ?, ?, ?, ?)');
  const fGuiaDeTI = insertFonte.run('guiadeti', 'Guia de TI', 'rss', 'https://guiadeti.com.br', 1).lastInsertRowid;
  const fGutenberg = insertFonte.run('gutenberg', 'Project Gutenberg', 'api', 'https://gutendex.com', 1).lastInsertRowid;
  const fOpenLib = insertFonte.run('openlibrary', 'Open Library', 'api', 'https://openlibrary.org', 1).lastInsertRowid;
  const fDomPub = insertFonte.run('dominiopublico', 'Portal Domínio Público (MEC)', 'manual', 'https://www.dominiopublico.gov.br', 1).lastInsertRowid;
  const fWikisource = insertFonte.run('wikisource', 'Wikisource', 'api', 'https://pt.wikisource.org', 1).lastInsertRowid;
  const fManual = insertFonte.run('manual', 'Curadoria Lino Livre', 'manual', null, 1).lastInsertRowid;

  // 2. Inserir Categorias
  const insertCat = db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)');
  const catClassicos = insertCat.run('Clássicos Brasileiros', 'Obras-primas da literatura nacional em domínio público').lastInsertRowid;
  const catRomance = insertCat.run('Romance & Crônicas', 'Romances históricos, estudos de costumes e narrativas urbanas').lastInsertRowid;
  const catPoesia = insertCat.run('Teatro & Poesia', 'Dramaturgia e coletâneas poéticas clássicas').lastInsertRowid;
  const catIndianismo = insertCat.run('Romance Indianista', 'Obras da vertente indianista do romantismo brasileiro').lastInsertRowid;
  const catDidaticos = insertCat.run('Apoio Pedagógico & Filosofia', 'Textos formativos e reflexões sociopolíticas').lastInsertRowid;
  const catTecnologia = insertCat.run('Tecnologia & Guias Digitais', 'Manuais técnicos, guias de programação, inteligência artificial e roadmaps abertos').lastInsertRowid;

  // 3. Inserir Autores
  const insertAutor = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)');
  const autMachado = insertAutor.run('Machado de Assis', 'Brasileiro', 'Fundador da Academia Brasileira de Letras e gênio do Realismo mundial.').lastInsertRowid;
  const autAlencar = insertAutor.run('José de Alencar', 'Brasileiro', 'Patrono da literatura romântica brasileira e autor de Iracema e O Guarani.').lastInsertRowid;
  const autAluisio = insertAutor.run('Aluísio Azevedo', 'Brasileiro', 'Pioneiro do Naturalismo no Brasil e autor consagrado de O Cortiço.').lastInsertRowid;
  const autLimaBarreto = insertAutor.run('Lima Barreto', 'Brasileiro', 'Importante escritor e cronista pré-modernista, crítico da Primeira República.').lastInsertRowid;
  const autCastroAlves = insertAutor.run('Castro Alves', 'Brasileiro', 'O Poeta dos Escravos, célebre por sua lírica romântica e poesia abolicionista.').lastInsertRowid;
  const autGuiaTI = insertAutor.run('Guia de TI & Comunidade', 'Brasileiro/Internacional', 'Curadoria e produção aberta de conteúdos, roadmaps e cursos de tecnologia.').lastInsertRowid;

  // 4. Inserir Livros Digitais
  const insertLivro = db.prepare(`
    INSERT INTO livros (
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca,
      leituras, conteudo_texto
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertLink = db.prepare(`
    INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Livro 1: Dom Casmurro
  const l1 = insertLivro.run(
    'Dom Casmurro',
    'Edição Original Garnier (1899)',
    '978-8572323864',
    1899,
    'pt',
    'A narrativa em primeira pessoa de Bento Santiago sobre sua juventude, o amor de infância por Capitu e as dúvidas sobre a fidelidade conjugal.',
    '/capas/dom_casmurro.jpg',
    256,
    autMachado,
    catClassicos,
    fDomPub,
    'dp-bv000241',
    'dominio-publico',
    380,
    `CAPÍTULO I: DO TÍTULO\n\nUma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro...`
  ).lastInsertRowid;
  insertLink.run(l1, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000241.pdf', 1887436, 1);
  insertLink.run(l1, 'epub', 'https://www.gutenberg.org/ebooks/55752.epub3.images', 1250000, 1);
  insertLink.run(l1, 'html', 'https://pt.wikisource.org/wiki/Dom_Casmurro', 0, 1);

  // Livro 2: Memórias Póstumas de Brás Cubas
  const l2 = insertLivro.run(
    'Memórias Póstumas de Brás Cubas',
    'Edição Original Typographia Nacional (1881)',
    '978-8535914841',
    1881,
    'pt',
    'Uma obra revolucionária narrada por um defunto-autor, inaugurando com ironia e genialidade psicológica o Realismo no Brasil.',
    '/capas/memorias_posthumas.jpg',
    220,
    autMachado,
    catClassicos,
    fDomPub,
    'dp-bv000215',
    'dominio-publico',
    215,
    `AO VERME QUE PRIMEIRO ROEU AS FRIAS CARNES DO MEU CADÁVER DEDICO COMO SAUDOSA LEMBRANÇA ESTAS MEMÓRIAS PÓSTUMAS\n\nCAPÍTULO I: ÓBITO DO AUTOR...`
  ).lastInsertRowid;
  insertLink.run(l2, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000215.pdf', 2140000, 1);
  insertLink.run(l2, 'epub', 'https://www.gutenberg.org/ebooks/54829.epub3.images', 1100000, 1);

  // Livro 3: O Cortiço
  const l3 = insertLivro.run(
    'O Cortiço',
    'Edição Original B. L. Garnier (1890)',
    '978-8535909555',
    1890,
    'pt',
    'Obra-prima do naturalismo brasileiro, descrevendo a vida coletiva, as tensões sociais e o cotidiano de um cortiço carioca.',
    '/capas/o_cortico.png',
    280,
    autAluisio,
    catRomance,
    fDomPub,
    'dp-bv000194',
    'dominio-publico',
    165,
    `CAPÍTULO I\n\nJoão Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro no bairro de Botafogo...`
  ).lastInsertRowid;
  insertLink.run(l3, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000194.pdf', 2500000, 1);
  insertLink.run(l3, 'epub', 'https://www.gutenberg.org/ebooks/54575.epub3.images', 1400000, 1);

  // Livro 4: O Alienista
  const l4 = insertLivro.run(
    'O Alienista',
    'Edição Original Papéis Avulsos (1882)',
    '978-8572321112',
    1882,
    'pt',
    'A história do Dr. Simão Bacamarte e seu hospício em Itaguaí, uma sátira atemporal sobre os limites da sanidade, da ciência e do poder.',
    '/capas/o_alienista.png',
    110,
    autMachado,
    catClassicos,
    fDomPub,
    'dp-bv000231',
    'dominio-publico',
    420,
    `CAPÍTULO I: DE COMO A VILA DE ITAGUAÍ GANHOU UMA CASA DE ORATES\n\nAs crônicas da vila de Itaguaí dizem que em tempos remotos viveu ali um certo médico...`
  ).lastInsertRowid;
  insertLink.run(l4, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000231.pdf', 950000, 1);
  insertLink.run(l4, 'html', 'https://pt.wikisource.org/wiki/O_Alienista', 0, 1);

  // Livro 5: Triste Fim de Policarpo Quaresma
  const l5 = insertLivro.run(
    'Triste Fim de Policarpo Quaresma',
    'Edição Original Typ. Revista dos Tribunaes (1915)',
    '978-8576570660',
    1915,
    'pt',
    'O retrato tragicômico de um patriota idealista que propõe o tupi-guarani como língua oficial do Brasil e enfrenta as contradições do país.',
    '/capas/policarpo_quaresma.png',
    215,
    autLimaBarreto,
    catDidaticos,
    fDomPub,
    'dp-bv000160',
    'dominio-publico',
    190,
    `PRIMEIRA PARTE: CAPÍTULO I - UMA LIÇÃO DE VIOLÃO\n\nComo de hábito, às quatro e meia da tarde, Policarpo Quaresma...`
  ).lastInsertRowid;
  insertLink.run(l5, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000160.pdf', 1450000, 1);
  insertLink.run(l5, 'epub', 'https://www.gutenberg.org/ebooks/57530.epub3.images', 980000, 1);

  // Livro 6: Espumas Flutuantes
  const l6 = insertLivro.run(
    'Espumas Flutuantes',
    'Edição Original Camillo de Lellis (1870)',
    '978-8582850787',
    1870,
    'pt',
    'Coletânea que reúne O Navio Negreiro e outros poemas célebres de Castro Alves, ápice da poesia lírica e abolicionista brasileira.',
    '/capas/espumas_flutuantes.jpg',
    180,
    autCastroAlves,
    catPoesia,
    fDomPub,
    'dp-bv000067',
    'dominio-publico',
    310,
    `O NAVIO NEGREIRO (TRAGÉDIA NO MAR)\n\n'Stamos em pleno mar... Doudo espasmo\nDe vaga em vaga o espaço rasga e ferve...`
  ).lastInsertRowid;
  insertLink.run(l6, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000067.pdf', 850000, 1);

  // Livro 7: Iracema
  const l7 = insertLivro.run(
    'Iracema',
    'Edição Original Vianna & Filhos (1865)',
    '978-8508129843',
    1865,
    'pt',
    'A lenda do Ceará e o romance fundacional entre a virgem dos lábios de mel e o guerreiro branco Martim.',
    '/capas/iracema.png',
    140,
    autAlencar,
    catIndianismo,
    fDomPub,
    'dp-bv000185',
    'dominio-publico',
    290,
    `CAPÍTULO I\n\nVerdes mares bravios de minha terra natal, onde canta a jandaia nas frondes da carnaúba...`
  ).lastInsertRowid;
  insertLink.run(l7, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000185.pdf', 1200000, 1);
  insertLink.run(l7, 'epub', 'https://www.gutenberg.org/ebooks/67705.epub3.images', 850000, 1);

  // Livro 8: O Guarani
  const l8 = insertLivro.run(
    'O Guarani',
    'Edição Original B. L. Garnier (1857)',
    '978-8508119042',
    1857,
    'pt',
    'O épico romance indianista retratando o amor e a lealdade de Peri e Cecília nas florestas do Brasil colonial.',
    '/capas/o_guarani.jpg',
    320,
    autAlencar,
    catIndianismo,
    fDomPub,
    'dp-bv000186',
    'dominio-publico',
    230,
    `PRIMEIRA PARTE: OS CAVALEIROS\n\nCAPÍTULO I: O CENÁRIO\n\nDe um dos cabeços da Serra dos Órgãos descai um fio d'água...`
  ).lastInsertRowid;
  insertLink.run(l8, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000186.pdf', 2800000, 1);
  insertLink.run(l8, 'epub', 'https://www.gutenberg.org/ebooks/38496.epub3.images', 1900000, 1);

  // Livro 9 (Guia de TI): AI Expert Roadmap & Guia de IA
  const l9 = insertLivro.run(
    'AI Expert Roadmap & Guia de IA',
    'Trilha Completa de Inteligência Artificial e Data Science',
    '978-0000000001',
    2026,
    'pt',
    'Guia estruturado e prático para o estudo e domínio de Inteligência Artificial, Machine Learning, Deep Learning e Engenharia de Prompts.',
    '/capas/o_alienista.png',
    150,
    autGuiaTI,
    catTecnologia,
    fGuiaDeTI,
    'guiadeti-ai-expert',
    'outro',
    450,
    `AI EXPERT ROADMAP & GUIA DE INTELIGÊNCIA ARTIFICIAL\n\nUma trilha aberta e orientada à prática para dominar IA, modelos generativos, Python para dados e automações inteligentes com ferramentas de ponta.`
  ).lastInsertRowid;
  insertLink.run(l9, 'html', 'https://guiadeti.com.br/roadmaps/ai-expert-roadmap/', 0, 1);

  // Livro 10 (Guia de TI): Guia Completo de Carreiras e Roadmaps de TI
  const l10 = insertLivro.run(
    'Guia Completo de Carreiras e Roadmaps de TI',
    'Trilhas para Frontend, Backend, DevOps e Dados',
    '978-0000000002',
    2026,
    'pt',
    'Coleção abrangente de mapas de estudo para profissionais e estudantes de computação navegarem com clareza em suas jornadas de aprendizado.',
    '/capas/policarpo_quaresma.png',
    180,
    autGuiaTI,
    catTecnologia,
    fGuiaDeTI,
    'guiadeti-roadmaps-carreiras',
    'outro',
    390,
    `ROADMAPS DE CARREIRAS EM TECNOLOGIA\n\nGuias de habilidades indispensáveis para o mercado moderno de TI: arquitetura de software, computação em nuvem, ferramentas e boas práticas de engenharia.`
  ).lastInsertRowid;
  insertLink.run(l10, 'html', 'https://guiadeti.com.br/roadmaps/awesome-roadmaps/', 0, 1);

  // Livro 11 (Guia de TI): Manual de Fundamentos DevOps, Cloud & Linux
  const l11 = insertLivro.run(
    'Manual de Fundamentos DevOps, Cloud & Linux',
    'Linux, Containers Docker, Git e Arquitetura de Nuvem',
    '978-0000000003',
    2026,
    'pt',
    'Manual formativo sobre cultura DevOps, administração de sistemas Linux, automação e orquestração de servidores para infraestrutura moderna.',
    '/capas/o_cortico.png',
    220,
    autGuiaTI,
    catTecnologia,
    fGuiaDeTI,
    'guiadeti-devops-linux',
    'outro',
    520,
    `FUNDAMENTOS DEVOPS, LINUX E NUVEM\n\nAprenda a administrar ambientes operacionais Linux no terminal, empacotar aplicações com Docker e implementar pipelines de entrega contínua.`
  ).lastInsertRowid;
  insertLink.run(l11, 'html', 'https://guiadeti.com.br/cursos/curso-devops-cloud-linux-docker-e-projeto-marketplace/', 0, 1);

  // 5. Inserir Cursos Gratuitos Curados (Guia de TI como principal fonte + OER internacionais)
  const insertCurso = db.prepare(`
    INSERT INTO cursos (titulo, area, plataforma, url, licenca, nivel, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const cursosData = [
    // Guia de TI — Cursos Oficiais e Roadmaps em Destaque Primário
    ['Curso de Python 2025', 'Tecnologia', 'Guia de TI / Hashtag Programação', 'https://guiadeti.com.br/cursos/curso-de-python-2025/', 'gratuito', 'Iniciante', 'Curso gratuito de Python para iniciantes cobrindo variáveis, estruturas condicionais, listas, dicionários e lógica de programação moderna.'],
    ['Curso DevOps: Cloud, Linux, Docker e Marketplace', 'Tecnologia', 'Guia de TI / Iago Ferreira TI', 'https://guiadeti.com.br/cursos/curso-devops-cloud-linux-docker-e-projeto-marketplace/', 'gratuito', 'Intermediário', 'Formação completa com 14 aulas sobre DevOps, SRE, Cloud Computing, Linux, Git, Docker, observabilidade e projeto de Marketplace.'],
    ['Curso Básico de Power BI 2025: Do Zero ao Dashboard', 'Tecnologia', 'Guia de TI / Hashtag Treinamentos', 'https://guiadeti.com.br/cursos/curso-basico-de-power-bi-2025-do-zero-ao-dashboard/', 'gratuito', 'Iniciante', 'Aulas introdutórias práticas de Power BI com Power Query, modelagem de dados relacionais, fórmulas DAX, gráficos dinâmicos e dashboards.'],
    ['Curso Básico e Gratuito de Claude & Engenharia de IA', 'Tecnologia', 'Guia de TI', 'https://guiadeti.com.br/cursos/curso-basico-e-gratuito-de-claude/', 'gratuito', 'Iniciante', 'Curso completo de Claude abordando Artefatos, Cowork, Claude Code, Skills e automação de fluxos de trabalho com IA generativa.'],
    ['Curso de Streamlit: Dashboards e Web Apps em Python', 'Tecnologia', 'Guia de TI', 'https://guiadeti.com.br/cursos/curso-de-streamlit/', 'gratuito', 'Intermediário', 'Criação ágil de aplicações de dados e dashboards interativos em Python com filtros, gráficos interativos e integração com APIs.'],
    ['Curso Gratuito de HTML e CSS: Landing Page do Zero', 'Tecnologia', 'Guia de TI', 'https://guiadeti.com.br/cursos/curso-basico-de-html-e-css/', 'gratuito', 'Iniciante', 'Treinamento prático com 13 videoaulas abordando HTML semântico, CSS moderno, Flexbox, layout responsivo e formulários.'],
    ['Curso de Introdução ao TypeScript', 'Tecnologia', 'Guia de TI', 'https://guiadeti.com.br/cursos/curso-de-introducao-ao-typescript/', 'gratuito', 'Iniciante', 'Fundamentos de tipagem estática para JavaScript, interfaces, generics, classes, configuração de tsconfig e compilação para Node e Web.'],
    ['Curso de Laravel 11 - Completo e Gratuito', 'Tecnologia', 'Guia de TI / Especializa TI', 'https://guiadeti.com.br/cursos/curso-de-laravel-11-completo-e-gratuito/', 'gratuito', 'Intermediário', 'Desenvolvimento moderno com Laravel 11, Docker, arquitetura MVC, autenticação, Eloquent ORM, Blade, validações e APIs REST.'],
    ['Curso de Linux - Primeiros Passos e Terminal', 'Tecnologia', 'Guia de TI / Curso em Vídeo', 'https://guiadeti.com.br/cursos/curso-de-linux-primeiros-passos/', 'gratuito', 'Iniciante', 'Domínio do terminal Linux, comandos essenciais, manipulação de arquivos, permissões, usuários e administração básica do sistema operacional.'],
    ['Curso de Redes de Computadores Grátis', 'Tecnologia', 'Guia de TI / Curso em Vídeo', 'https://guiadeti.com.br/cursos/curso-redes-de-computadores-gratis/', 'gratuito', 'Iniciante', 'Conceitos fundamentais de redes: arquitetura TCP/IP, endereçamento IPv4/IPv6, sub-redes, DNS, roteamento e segurança básica.'],
    ['AI Expert Roadmap: Trilha de IA & Ciência de Dados', 'Tecnologia', 'Guia de TI', 'https://guiadeti.com.br/roadmaps/ai-expert-roadmap/', 'gratuito', 'Avançado', 'Guia completo e aberto para estudo de Machine Learning, Deep Learning, Engenharia de Dados, MLOps e Inteligência Artificial.'],
    ['Awesome Roadmaps: Guias de Desenvolvimento de Software', 'Tecnologia', 'Guia de TI', 'https://guiadeti.com.br/roadmaps/awesome-roadmaps/', 'gratuito', 'Livre', 'Coleção consolidada de roteiros de estudo cobrindo frontend, backend, DevOps, cibersegurança e arquitetura de software.'],
    ['TechGuide.sh - Guia de Carreiras e Tecnologias', 'Tecnologia', 'Guia de TI / Alura', 'https://guiadeti.com.br/roadmaps/techguidesh-guia-de-carreiras-e-tecnologias/', 'gratuito', 'Livre', 'Mapeamento das competências técnicas e caminhos de aprendizado para profissionais de tecnologia em diversas especialidades.'],
    ['Trilha Info - Trilhas Gratuitas em Português', 'Tecnologia', 'Guia de TI', 'https://guiadeti.com.br/roadmaps/trilha-info-trilhas-gratuitas-de-tecnologia/', 'gratuito', 'Iniciante', 'Trilhas colaborativas e abertas para formação de desenvolvedores Frontend, Backend, Full Stack, DevOps e QA no Brasil.'],
    ['Roadmap.sh - Developer Roadmaps Traduzidos', 'Tecnologia', 'Guia de TI', 'https://guiadeti.com.br/roadmaps/roadmapsh-developer-roadmaps/', 'gratuito', 'Livre', 'Mapas interativos de carreiras e habilidades para desenvolvimento de software, computação em nuvem e inteligência artificial.'],
    
    // Acervo Complementar OER & Aberto
    ['Introdução à Ciência da Computação (CS50)', 'Tecnologia', 'Harvard / edX', 'https://cs50.harvard.edu/x/', 'gratuito', 'Iniciante', 'O curso de introdução à programação mais famoso do mundo, ensinando C, Python, SQL e algoritmos com acesso livre.'],
    ['Física Geral com Simulações PhET', 'Ciências Exatas', 'University of Colorado / PhET', 'https://phet.colorado.edu/pt_BR/', 'cc-by', 'Ensino Médio', 'Simulações interativas gratuitas de física, química e biologia com planos de aula abertos.'],
    ['Cálculo e Álgebra Linear Aberta', 'Matemática', 'MIT OpenCourseWare', 'https://ocw.mit.edu', 'cc-by-nc-sa', 'Intermediário', 'Materiais didáticos, videoaulas e provas completas dos cursos de graduação do MIT.'],
    ['Livros Didáticos e Cursos Abertos de Biologia', 'Ciências Biológicas', 'OpenStax', 'https://openstax.org/details/books/biology-2e', 'cc-by', 'Ensino Médio e Superior', 'Livros e cursos abertos revisados por pares e adotados em centenas de instituições de ensino.'],
    ['História do Brasil e Cidadania', 'Ciências Humanas', 'Khan Academy Brasil', 'https://pt.khanacademy.org/humanities/historia-do-brasil', 'cc-by-nc-sa', 'Iniciante', 'Aulas interativas e exercícios com gamificação cobrindo todo o currículo de história e ciências.'],
    ['Fundamentos de Programação e Tecnologia', 'Tecnologia', 'Fundação Bradesco (Escola Virtual)', 'https://www.ev.org.br', 'gratuito', 'Iniciante', 'Cursos online gratuitos com emissão de certificado para estudantes e jovens profissionais.'],
    ['Introdução à Física Mecânica', 'Ciências Exatas', 'MIT OpenCourseWare', 'https://ocw.mit.edu/courses/physics/', 'cc-by-nc-sa', 'Intermediário', 'Fundamentos de mecânica clássica, leis de Newton e conservação de energia.'],
    ['Química Geral Interativa', 'Ciências Exatas', 'OpenStax', 'https://openstax.org/details/books/chemistry-2e', 'cc-by', 'Ensino Médio e Superior', 'Conceitos atômicos, reações químicas, estequiometria e equilíbrio químico.'],
    ['Álgebra e Funções para Ensino Médio', 'Matemática', 'Khan Academy Brasil', 'https://pt.khanacademy.org/math/algebra', 'cc-by-nc-sa', 'Iniciante', 'Progressão de aprendizado em equações lineares, quadráticas e análise gráfica.'],
    ['Biologia Celular e Molecular', 'Ciências Biológicas', 'CK-12 Foundation', 'https://www.ck12.org/biology/', 'cc-by-nc', 'Ensino Médio', 'Estudo estruturado da célula, genética mendeliana e biotecnologia.'],
    ['Geometria e Trigonometria Prática', 'Matemática', 'CK-12 Foundation', 'https://www.ck12.org/geometry/', 'cc-by-nc', 'Ensino Médio', 'Teoremas fundamentais, cálculo de áreas e trigonometria do triângulo retângulo.'],
    ['Introdução à Inteligência Artificial com Python', 'Tecnologia', 'Harvard / edX', 'https://cs50.harvard.edu/ai/', 'gratuito', 'Intermediário', 'Conceitos e algoritmos que orientam a inteligência artificial moderna e aprendizado de máquina.'],
    ['Simulações de Circuitos Elétricos', 'Ciências Exatas', 'University of Colorado / PhET', 'https://phet.colorado.edu/pt_BR/simulations/circuit-construction-kit-dc', 'cc-by', 'Iniciante', 'Montagem interativa de circuitos elétricos com resistores, lâmpadas e baterias.'],
    ['Literatura Brasileira e Redação Escolar', 'Linguagens', 'Fundação Bradesco (Escola Virtual)', 'https://www.ev.org.br', 'gratuito', 'Iniciante', 'Técnicas de redação dissertativo-argumentativa e análise dos grandes autores nacionais.'],
    ['Gramática e Compreensão Textual', 'Linguagens', 'Khan Academy Brasil', 'https://pt.khanacademy.org', 'cc-by-nc-sa', 'Iniciante', 'Aulas de sintaxe, morfologia e leitura crítica orientada para estudantes.'],
    ['Astronomia Fundamental Aberta', 'Ciências Exatas', 'OER Commons', 'https://www.oercommons.org', 'cc-by', 'Iniciante', 'Estudo do sistema solar, galáxias e evolução estelar com materiais de livre acesso.'],
    ['Ecologia e Meio Ambiente Global', 'Ciências Biológicas', 'OER Commons', 'https://www.oercommons.org', 'cc-by', 'Iniciante', 'Dinâmica dos ecossistemas, biodiversidade e sustentabilidade ecológica.'],
    ['Introdução à Microeconomia', 'Ciências Humanas', 'MIT OpenCourseWare', 'https://ocw.mit.edu/courses/economics/', 'cc-by-nc-sa', 'Intermediário', 'Princípios de mercados, oferta e demanda, tomada de decisão e políticas públicas.'],
    ['Psicologia e Comportamento Humano', 'Ciências Humanas', 'OpenStax', 'https://openstax.org/details/books/psychology-2e', 'cc-by', 'Ensino Superior', 'Introdução à psicologia científica, cognição, memória e processos psicossociais.'],
    ['Estatística Descritiva e Probabilidade', 'Matemática', 'OpenStax', 'https://openstax.org/details/books/introductory-statistics-2e', 'cc-by', 'Ensino Médio e Superior', 'Amostragem, medidas de tendência central, dispersão e distribuições de probabilidade.'],
    ['Filosofia e Ética Cidadã', 'Ciências Humanas', 'OER Commons', 'https://www.oercommons.org', 'cc-by', 'Ensino Médio', 'Discussão sobre correntes filosóficas clássicas e dilemas morais contemporâneos.'],
    ['Inglês Instrumental para Leitura e Pesquisa', 'Linguagens', 'Fundação Bradesco (Escola Virtual)', 'https://www.ev.org.br', 'gratuito', 'Iniciante', 'Desenvolvimento de competências para leitura de textos técnicos e acadêmicos em inglês.'],
    ['Química Orgânica e Ligações Moleculares', 'Ciências Exatas', 'University of Colorado / PhET', 'https://phet.colorado.edu/pt_BR/', 'cc-by', 'Ensino Médio', 'Modelagem tridimensional de moléculas e visualização de reações orgânicas.'],
    ['Algoritmos e Estruturas de Dados', 'Tecnologia', 'MIT OpenCourseWare', 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/', 'cc-by-nc-sa', 'Avançado', 'Ordenação, árvores de busca, grafos e complexidade computacional.'],
    ['Desenvolvimento Web com Python e JS', 'Tecnologia', 'Harvard / edX', 'https://cs50.harvard.edu/web/', 'gratuito', 'Intermediário', 'Criação de aplicações web modernas, APIs REST, bancos de dados e interfaces reativas.'],
    ['Empreendedorismo Jovem e Inovação', 'Ciências Humanas', 'Sebrae Educação', 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline', 'gratuito', 'Iniciante', 'Identificação de oportunidades, planejamento e criação de projetos de impacto.'],
    ['Gestão de Projetos e Trabalho em Equipe', 'Gestão', 'Fundação Bradesco (Escola Virtual)', 'https://www.ev.org.br', 'gratuito', 'Iniciante', 'Metodologias ágeis, liderança colaborativa e organização de tarefas.'],
    ['Genética, DNA e Hereditariedade', 'Ciências Biológicas', 'CK-12 Foundation', 'https://www.ck12.org/biology/genetics/', 'cc-by-nc', 'Ensino Médio', 'Mecanismos de replicação do DNA, transcrição, tradução e mutações gênicas.'],
    ['Geografia Física e Cartografia Digital', 'Ciências Humanas', 'OER Commons', 'https://www.oercommons.org', 'cc-by', 'Ensino Médio', 'Estudo do relevo, clima, vegetação e interpretação de mapas e imagens de satélite.'],
    ['Educação Financeira Pessoal', 'Ciências Humanas', 'Fundação Bradesco (Escola Virtual)', 'https://www.ev.org.br', 'gratuito', 'Iniciante', 'Planejamento orçamentário, investimentos básicos e consumo consciente.'],
    ['Robótica e Eletrônica Aberta', 'Tecnologia', 'OER Commons', 'https://www.oercommons.org', 'cc-by', 'Iniciante', 'Introdução ao Arduino, componentes eletrônicos e automação para estudantes.'],
    ['Neurociência Básica e Cognição', 'Ciências Biológicas', 'MIT OpenCourseWare', 'https://ocw.mit.edu/courses/brain-and-cognitive-sciences/', 'cc-by-nc-sa', 'Intermediário', 'Funcionamento do sistema nervoso, processamento sensorial e mecanismos de memória.']
  ];

  for (const c of cursosData) {
    insertCurso.run(...c);
  }

  console.log('Seed do Lino Livre finalizado com sucesso!');
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
