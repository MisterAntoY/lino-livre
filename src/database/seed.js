const { getDatabase } = require('./index');
const { cursosData } = require('./cursosSeedData');

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
    'https://guiadeti.com.br/media/CACHE/images/library/2026/09/AI_Expert_Roadmap/65927a0974e90c3df4e690236a471e89.webp',
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
    'https://guiadeti.com.br/media/CACHE/images/library/2026/09/awesome/2ed4a9e52da1d1c276d7a2df6f618d02.webp',
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
    'https://guiadeti.com.br/media/CACHE/images/library/2026/10/maestro-20261005-1a2d7f9a4897756f/cda1e67a527c2b1071b43c6290662c37.webp',
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

  // Livro 12 (Guia de TI): TechGuide.sh - Guia de Carreiras e Tecnologias
  const l12 = insertLivro.run(
    'TechGuide.sh - Guia de Carreiras e Tecnologias',
    'Mapeamento de Habilidades e Competências Técnicas',
    '978-0000000004',
    2026,
    'pt',
    'Guia com caminhos estruturados de aprendizado, níveis de proficiência e tecnologias para desenvolvimento profissional.',
    'https://guiadeti.com.br/media/CACHE/images/library/2026/09/techguide/d9eb488def2346638788a8b5e8c1448d.webp',
    160,
    autGuiaTI,
    catTecnologia,
    fGuiaDeTI,
    'guiadeti-techguide',
    'outro',
    410,
    `TECHGUIDE.SH - GUIA DE CARREIRAS\n\nNavegue pelas tecnologias mais requisitadas e construa um plano de estudos sólido e direcionado.`
  ).lastInsertRowid;
  insertLink.run(l12, 'html', 'https://guiadeti.com.br/roadmaps/techguidesh-guia-de-carreiras-e-tecnologias/', 0, 1);

  // Livro 13 (Guia de TI): Trilha Info - Trilhas Gratuitas em Português
  const l13 = insertLivro.run(
    'Trilha Info - Trilhas Gratuitas em Português',
    'Formação Colaborativa em Frontend, Backend e DevOps',
    '978-0000000005',
    2026,
    'pt',
    'Trilhas colaborativas abertas em língua portuguesa para formação de desenvolvedores e preparação para entrevistas técnicas.',
    'https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp',
    190,
    autGuiaTI,
    catTecnologia,
    fGuiaDeTI,
    'guiadeti-trilha-info',
    'outro',
    375,
    `TRILHA INFO\n\nAprenda a programar do zero e aprofunde seus conhecimentos em desenvolvimento web e engenharia de software em português.`
  ).lastInsertRowid;
  insertLink.run(l13, 'html', 'https://guiadeti.com.br/roadmaps/trilha-info-trilhas-gratuitas-de-tecnologia/', 0, 1);

  // Livro 14 (Guia de TI): Roadmap.sh - Developer Roadmaps Traduzidos
  const l14 = insertLivro.run(
    'Roadmap.sh - Developer Roadmaps Traduzidos',
    'Diretório Global de Guias de Estudo para Desenvolvedores',
    '978-0000000006',
    2026,
    'pt',
    'Mapas mentais e guias passo a passo cobrindo arquitetura de software, DevOps, segurança e stacks de programação.',
    'https://guiadeti.com.br/seo/thumbnail/roadmaps/roadmap/f906b934-8cde-44f9-8f18-6822586aa9a5/fallback.webp?v=v2-1790651464',
    210,
    autGuiaTI,
    catTecnologia,
    fGuiaDeTI,
    'guiadeti-roadmapsh',
    'outro',
    490,
    `ROADMAP.SH - MAPAS DE CARREIRA\n\nDiretório de referência com trilhas para Frontend, Backend, DevOps, Cyber Security e Inteligência Artificial.`
  ).lastInsertRowid;
  insertLink.run(l14, 'html', 'https://guiadeti.com.br/roadmaps/roadmapsh-developer-roadmaps/', 0, 1);

  // 5. Inserir Cursos Gratuitos Curados (Guia de TI + Fundação Bradesco 61 cursos + OER internacionais)
  const insertCurso = db.prepare(`
    INSERT INTO cursos (titulo, area, plataforma, url, licenca, nivel, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of cursosData) {
    insertCurso.run(...c);
  }

  console.log('Seed do Lino Livre finalizado com sucesso!');
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
