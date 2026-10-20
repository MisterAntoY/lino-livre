const { getDatabase } = require('./index');
const { cursosData } = require('./cursosSeedData');
const { githubBooks } = require('./githubBooksSeedData');
const { githubFrBooks } = require('./githubFrBooksSeedData');
const { githubEnBooks } = require('./githubEnBooksSeedData');
const { githubZhBooks } = require('./githubZhBooksSeedData');
const { githubDeBooks } = require('./githubDeBooksSeedData');
const { filosofiaBooks } = require('./filosofiaSeedData');
const { literaturaAlema } = require('./literaturaAlemaSeedData');
const { classicosAlema } = require('./classicosAlemaSeedData');
const { wikisourceAlema } = require('./wikisourceAlemaSeedData');
const { archiveAlema } = require('./archiveAlemaSeedData');
const { archiveFrances } = require('./archiveFrancesSeedData');
const { archiveRussa } = require('./archiveRussaSeedData');
const { archiveItaliana } = require('./archiveItalianaSeedData');
const { githubOrgsAlema } = require('./githubOrgsAlemaSeedData');
const { romanceClassics } = require('./romanceClassicsSeedData');
const { worldClassicsList } = require('./worldClassicsSeedData');
const { dioBootcampsList } = require('./dioBootcampsData');
const { santanderAcademyList } = require('./santanderAcademyData');
const { cursoEmVideoList } = require('./cursoEmVideoData');
const { dsaCoursesList } = require('./dsaCoursesData');
const { germanCoursesList } = require('./germanCoursesData');
const { frenchCoursesList } = require('./frenchCoursesData');
const { novasPlataformasCursos } = require('./novasPlataformasData');
const { livrosAfricaData } = require('./livrosAfricaData');
const { roadmapShList } = require('./roadmapShData');
const { podcastsShowsData } = require('./podcastsSeedData');
const { literaturaLusofonaClassica } = require('./literaturaLusofonaClassicaSeedData');
const { githubEsBooks } = require('./githubEsBooksSeedData');
const { uanTrabalhosData } = require('./uanTrabalhosSeedData');
const { programacaoWebCursos } = require('./programacaoWebSeedData');
const { jornadaDoDevList } = require('./jornadaDoDevData');
const { cursaCoursesList } = require('./cursaCoursesData');
const { cursaExerciciosList } = require('./cursaExerciciosData');
const { harvardCoursesList } = require('./harvardCoursesData');
const { evgCoursesList } = require('./evgCoursesData');
const { luminaCoursesList } = require('./luminaCoursesData');
const { ifrsCoursesList } = require('./ifrsCoursesData');
const { googleAtelieCoursesList } = require('./googleAtelieCoursesData');
const { openBootcampCoursesList } = require('./openBootcampCoursesData');
const { fluenciaAiList } = require('./fluenciaAiData');
const { recodeCoursesList } = require('./recodeData');
const { codeIotCoursesList } = require('./codeIotData');
const { abeCoursesList } = require('./abeCoursesData');
const { netacadCoursesList } = require('./netacadCoursesData');
const { awesomeRoadmapsList } = require('./awesomeRoadmapsData');
const { fernandaKipperList } = require('./fernandaKipperData');
const { segInfoBrasilList } = require('./segInfoBrasilData');
const { glauciaLemosTsList } = require('./glauciaLemosTsData');
const { langchainSacchiList } = require('./langchainSacchiData');
const { boraNaTechList } = require('./boraNaTechData');
const { techGuideList } = require('./techGuideData');
const { kaSolutionList } = require('./kaSolutionData');
const { ebacCoursesList } = require('./ebacData');
const { oceanBrasilList } = require('./oceanBrasilData');
const { msLearnList } = require('./msLearnData');
const {

  domCasmurroTexto,
  memoriasPosthumasTexto,
  oCorticoTexto,
  oAlienistaTexto,
  iracemaTexto,
  policarpoQuaresmaTexto,
  espumasFlutuantesTexto,
  oGuaraniTexto,
  quincasBorbaTexto,
  senhoraTexto,
  oAteneuTexto,
  osSertoesTexto,
  aMoreninhaTexto,
  autoDaBarcaDoInfernoTexto,
  osLusiadasTexto,
  mensagemTexto,
  noiteNaTavernaTexto,
  claraDosAnjosTexto
} = require('./textosObras');

function seed(dbInstance = null) {
  const db = dbInstance || getDatabase();

  console.log('Populando acervo Lino Livre com fontes, livros, links e cursos...');

  db.exec('BEGIN TRANSACTION;');
  try {
    db.exec(`
      DELETE FROM links_livros;
      DELETE FROM podcasts_episodios;
      DELETE FROM podcasts_shows;
      DELETE FROM import_jobs;
      DELETE FROM cursos;
      DELETE FROM livros;
      DELETE FROM autores;
      DELETE FROM categorias;
      DELETE FROM fontes;
      DELETE FROM sqlite_sequence;
    `);

  // 1. Inserir Fontes Oficiais (Guia de TI, GitHub e fontes abertas)
  const insertFonte = db.prepare('INSERT INTO fontes (slug, nome, tipo, url_base, ativa) VALUES (?, ?, ?, ?, ?)');
  const fGuiaDeTI = insertFonte.run('guiadeti', 'Guia de TI', 'rss', 'https://guiadeti.com.br', 1).lastInsertRowid;
  const fBibDev = insertFonte.run('github-bibliotecadev', 'BibliotecaDev (GitHub)', 'manual', 'https://github.com/KAYOKG/BibliotecaDev', 1).lastInsertRowid;
  const fItalo = insertFonte.run('github-italocamilo', 'Repositório Books Tech (GitHub)', 'manual', 'https://github.com/italocamil0/books', 1).lastInsertRowid;
  const fTrilha = insertFonte.run('trilhainfo', 'Trilha Info (Flávio Mendes / GitHub)', 'manual', 'https://trilha.info', 1).lastInsertRowid;
  const fGutenberg = insertFonte.run('gutenberg', 'Project Gutenberg', 'api', 'https://gutendex.com', 1).lastInsertRowid;
  // Open Library: fonte técnica de consulta (API). Desativada por padrão porque
  // não é um repositório de leitura directa — as obras são indexadas via outras fontes.
  const fOpenLib = insertFonte.run('openlibrary', 'Open Library', 'api', 'https://openlibrary.org', 0).lastInsertRowid;
  const fDomPub = insertFonte.run('dominiopublico', 'Portal Domínio Público (MEC)', 'manual', 'https://www.dominiopublico.gov.br', 1).lastInsertRowid;
  const fWikisource = insertFonte.run('wikisource', 'Wikisource', 'api', 'https://pt.wikisource.org', 1).lastInsertRowid;
  const fManual = insertFonte.run('manual', 'Curadoria Lino Livre', 'manual', null, 1).lastInsertRowid;
  // Novas fontes GitHub em Mandarim (apenas metadados + links externos)
  const fFreeBooksZh = insertFonte.run('github-freebooks-zh', 'Free Programming Books ZH (GitHub)', 'manual', 'https://github.com/justjavac/free-programming-books-zh_CN', 1).lastInsertRowid;
  const fAwesomeCn = insertFonte.run('github-awesome-cn', 'Awesome Lists Chinese (GitHub)', 'manual', 'https://github.com/gamedilong/awesome-cn', 1).lastInsertRowid;
  const fRoadmapZh = insertFonte.run('github-roadmap-zh', 'Developer Roadmap ZH (GitHub)', 'manual', 'https://github.com/kamranahmedse/developer-roadmap', 1).lastInsertRowid;
  // Novas fontes GitHub em Francês (apenas metadados + links externos)
  const fFreeBooksFr = insertFonte.run('github-freebooks-fr', 'Free Programming Books FR (GitHub)', 'manual', 'https://github.com/EbookFoundation/free-programming-books', 1).lastInsertRowid;
  const fAwesomeFr = insertFonte.run('github-awesome-fr', 'Awesome Lists French (GitHub)', 'manual', 'https://github.com/websealevel/awesome-fr', 1).lastInsertRowid;
  // Novas fontes GitHub em Inglês (apenas metadados + links externos)
  const fFreeBooksEn = insertFonte.run('github-freebooks-en', 'Free Programming Books EN (GitHub)', 'manual', 'https://github.com/EbookFoundation/free-programming-books', 1).lastInsertRowid;
  const fAwesomeEn = insertFonte.run('github-awesome-en', 'Awesome Lists English (GitHub)', 'manual', 'https://github.com/sindresorhus/awesome', 1).lastInsertRowid;
  // Novas fontes GitHub em Alemão (apenas metadados + links externos)
  const fFreeBooksDe = insertFonte.run('github-freebooks-de', 'Free Programming Books DE (GitHub)', 'manual', 'https://github.com/EbookFoundation/free-programming-books', 1).lastInsertRowid;
  const fAwesomeDe = insertFonte.run('github-awesome-de', 'Awesome Lists German (GitHub)', 'manual', 'https://github.com/topics/german', 1).lastInsertRowid;
  const fRheinwerk = insertFonte.run('rheinwerk-openbook', 'Rheinwerk Openbooks (Galileo Computing)', 'manual', 'http://openbook.rheinwerk-verlag.de', 1).lastInsertRowid;
  const fGithubDe = insertFonte.run('github-de', 'Open Source Alemão no GitHub', 'manual', 'https://github.com/topics/deutsch', 1).lastInsertRowid;
  const fLiteraturaDe = insertFonte.run('github-literatura-de', 'Literatura Alemã no GitHub (GITenberg / tiny_schiller)', 'manual', 'https://github.com/topics/deutsch', 1).lastInsertRowid;
  const fWikibooksDe = insertFonte.run('wikibooks-de', 'Wikibooks Deutsch', 'manual', 'https://de.wikibooks.org', 1).lastInsertRowid;
  const fWikisourceDe = insertFonte.run('wikisource-de', 'Wikisource Alemã (Domínio Público)', 'manual', 'https://de.wikisource.org', 1).lastInsertRowid;
  const fArchiveDe = insertFonte.run('archive-de', 'Internet Archive — Cânone Clássico Alemão', 'manual', 'https://archive.org', 1).lastInsertRowid;
  const fArchiveFr = insertFonte.run('archive-fr', 'Internet Archive — Cânone Clássico Francês', 'manual', 'https://archive.org', 1).lastInsertRowid;
  const fArchiveRu = insertFonte.run('archive-ru', 'Internet Archive — Cânone Clássico Russo', 'manual', 'https://archive.org', 1).lastInsertRowid;
  const fArchiveIt = insertFonte.run('archive-it', 'Internet Archive — Cânone Clássico Italiano', 'manual', 'https://archive.org', 1).lastInsertRowid;
  // Fontes de Filosofia (apenas metadados + links externos)
  const fFilosofia = insertFonte.run('github-filosofia', 'Filosofia no GitHub (Listas, Cursos e Ferramentas)', 'manual', 'https://github.com/topics/philosophy', 1).lastInsertRowid;
  const fStandardEbooks = insertFonte.run('standardebooks', 'Standard Ebooks (domínio público)', 'opds', 'https://www.standardebooks.org', 1).lastInsertRowid;
  const fLibriVox = insertFonte.run('librivox', 'LibriVox (Audiolivros de Domínio Público)', 'api', 'https://librivox.org', 1).lastInsertRowid;
  const fEuropeana = insertFonte.run('europeana', 'Europeana Open Data', 'api', 'https://api.europeana.eu', 1).lastInsertRowid;
  // Fonte de Livros Técnicos em Espanhol
  const fFreeBooksEs = insertFonte.run('github-freebooks-es', 'Free Programming Books ES (GitHub)', 'manual', 'https://github.com/EbookFoundation/free-programming-books', 1).lastInsertRowid;
  // Fonte Repositório Universitário TFC UAN
  const fUanTfc = insertFonte.run('uan-tfc', 'Universidade Agostinho Neto (UAN) — Repositório TFC', 'manual', 'https://uan-mapa-portal.lovable.app/trabalhos', 1).lastInsertRowid;
  // Fonte Fluência AI (fluencia.ai)
  const fFluencia = insertFonte.run('fluencia-ai', 'Fluência AI (fluencia.ai)', 'manual', 'https://www.fluencia.ai', 1).lastInsertRowid;

  // 2. Inserir Categorias
  const insertCat = db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)');
  const catClassicos = insertCat.run('Clássicos Brasileiros', 'Obras-primas da literatura nacional em domínio público').lastInsertRowid;
  const catRomance = insertCat.run('Romance & Crônicas', 'Romances históricos, estudos de costumes e narrativas urbanas').lastInsertRowid;
  const catPoesia = insertCat.run('Teatro & Poesia', 'Dramaturgia e coletâneas poéticas clássicas').lastInsertRowid;
  const catIndianismo = insertCat.run('Romance Indianista', 'Obras da vertente indianista do romantismo brasileiro').lastInsertRowid;
  const catDidaticos = insertCat.run('Apoio Pedagógico & Filosofia', 'Textos formativos e reflexões sociopolíticas').lastInsertRowid;
  const catTecnologia = insertCat.run('Tecnologia & Guias Digitais', 'Manuais técnicos, guias de programação, inteligência artificial e roadmaps abertos').lastInsertRowid;
  const catArq = insertCat.run('Arquitetura & Engenharia de Software', 'Clean Architecture, Design Patterns, Refatoração e boas práticas de código').lastInsertRowid;
  const catWeb = insertCat.run('Desenvolvimento Web & Mobile', 'Frontend, Backend, APIs, frameworks modernos e desenvolvimento mobile').lastInsertRowid;
  const catDevOps = insertCat.run('DevOps, Cloud & Infraestrutura', 'Linux, Docker, Kubernetes, redes, segurança e computação em nuvem').lastInsertRowid;
  const catData = insertCat.run('Ciência de Dados & Inteligência Artificial', 'Big Data, Machine Learning, Business Intelligence, Data Science e estatística').lastInsertRowid;
  const catAgil = insertCat.run('Metodologias Ágeis & Carreira Tech', 'Scrum, Lean Startup, hábitos de produtividade, liderança e gestão técnica').lastInsertRowid;
  const catAfricaLit = insertCat.run('🌍 Literatura & Vozes de África', 'Obras-primas da literatura africana e pan-africana em múltiplos idiomas').lastInsertRowid;
  const catAfricaContos = insertCat.run('🌍 Contos & Tradição Oral Africana', 'Folclore, fábulas bantas, lendas de Anansi e sabedoria oral ancestral').lastInsertRowid;
  const catAfricaHist = insertCat.run('🌍 História & Sociedade Africana', 'Civilizações antigas, impérios do Sahel, arqueologia e história pan-africana').lastInsertRowid;
  const catAfricaFilo = insertCat.run('🌍 Filosofia & Pensamento Africano', 'Négritude, libertação, dignidade humana e filosofia pan-africana').lastInsertRowid;
  // Novas categorias de literatura angolana e africana lusófona
  const catAngolana = insertCat.run('Literatura Angolana', 'Obras de autores angolanos: poesia, romance, teatro e tradição oral').lastInsertRowid;
  const catAfricaLusofona = insertCat.run('Literatura Africana Lusófona', 'Literatura dos PALOP: Angola, Moçambique, Cabo Verde, Guiné-Bissau, São Tomé e Príncipe').lastInsertRowid;
  const catPoesiaAfricana = insertCat.run('Poesia Africana', 'Poesia de autores africanos de língua portuguesa e outras línguas africanas').lastInsertRowid;
  const catAutoresLusofonos = insertCat.run('Autores Lusófonos Clássicos', 'Grandes nomes da literatura em português: Camões, Pessoa, Eça, autores africanos e brasileiros clássicos').lastInsertRowid;
  const catUanTfc = insertCat.run('🎓 Teses & Trabalhos Universitários (UAN)', 'Trabalhos de Fim de Curso (TFC) e investigações científicas de estudantes da Universidade Agostinho Neto (UAN)').lastInsertRowid;

  // 3. Inserir Autores
  const insertAutor = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)');
  const autMachado = insertAutor.run('Machado de Assis', 'Brasileiro', 'Fundador da Academia Brasileira de Letras e gênio do Realismo mundial.').lastInsertRowid;
  const autAlencar = insertAutor.run('José de Alencar', 'Brasileiro', 'Patrono da literatura romântica brasileira e autor de Iracema e O Guarani.').lastInsertRowid;
  const autAluisio = insertAutor.run('Aluísio Azevedo', 'Brasileiro', 'Pioneiro do Naturalismo no Brasil e autor consagrado de O Cortiço.').lastInsertRowid;
  const autLimaBarreto = insertAutor.run('Lima Barreto', 'Brasileiro', 'Importante escritor e cronista pré-modernista, crítico da Primeira República.').lastInsertRowid;
  const autCastroAlves = insertAutor.run('Castro Alves', 'Brasileiro', 'O Poeta dos Escravos, célebre por sua lírica romântica e poesia abolicionista.').lastInsertRowid;
  const autPompeia = insertAutor.run('Raul Pompeia', 'Brasileiro', 'Romancista e cronista, autor de O Ateneu e expoente do Impressionismo e Naturalismo no Brasil.').lastInsertRowid;
  const autEuclides = insertAutor.run('Euclides da Cunha', 'Brasileiro', 'Jornalista, historiador e escritor brasileiro, autor do clássico épico e sociológico Os Sertões.').lastInsertRowid;
  const autMacedo = insertAutor.run('Joaquim Manuel de Macedo', 'Brasileiro', 'Médico, jornalista e romancista, fundador do romance urbano brasileiro com A Moreninha.').lastInsertRowid;
  const autGilVicente = insertAutor.run('Gil Vicente', 'Português', 'Pai do teatro português e renascentista, autor dos autos de moralidade como o Auto da Barca do Inferno.').lastInsertRowid;
  const autCamoes = insertAutor.run('Luís de Camões', 'Português', 'O maior poeta da língua portuguesa, autor do poema épico fundamental Os Lusíadas.').lastInsertRowid;
  const autPessoa = insertAutor.run('Fernando Pessoa', 'Português', 'Um dos maiores gênios da literatura universal do século XX, criador dos heterônimos e autor de Mensagem.').lastInsertRowid;
  const autAlvares = insertAutor.run('Álvares de Azevedo', 'Brasileiro', 'Principal representante da segunda geração romântica ultrarromântica (Mal do Século) no Brasil.').lastInsertRowid;
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
    0,
    domCasmurroTexto
  ).lastInsertRowid;
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
    0,
    memoriasPosthumasTexto
  ).lastInsertRowid;
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
    0,
    oCorticoTexto
  ).lastInsertRowid;
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
    0,
    oAlienistaTexto
  ).lastInsertRowid;
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
    0,
    policarpoQuaresmaTexto
  ).lastInsertRowid;
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
    0,
    espumasFlutuantesTexto
  ).lastInsertRowid;
  insertLink.run(l6, 'html', 'https://pt.wikisource.org/wiki/Espumas_Fluctuantes', 0, 1);
  insertLink.run(l6, 'pdf', 'https://www.dominiopublico.gov.br/download/texto/bv000067.pdf', 0, 1);

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
    0,
    iracemaTexto
  ).lastInsertRowid;
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
    0,
    oGuaraniTexto
  ).lastInsertRowid;
  insertLink.run(l8, 'epub', 'https://www.gutenberg.org/ebooks/38496.epub3.images', 1900000, 1);

  // Livro: Quincas Borba
  const lQuincas = insertLivro.run(
    'Quincas Borba',
    'Edição Original B. L. Garnier (1891)',
    '978-8572323871',
    1891,
    'pt',
    'A continuação espiritual de Memórias Póstumas, acompanhando Rubião, herdeiro da fortuna do filósofo Quincas Borba, e seu cão na corte imperial carioca.',
    '/capas/quincas_borba.jpg',
    240,
    autMachado,
    catClassicos,
    fDomPub,
    'dp-bv000234',
    'dominio-publico',
    0,
    quincasBorbaTexto
  ).lastInsertRowid;
  insertLink.run(lQuincas, 'epub', 'https://www.gutenberg.org/ebooks/55682.epub3.images', 1150000, 1);
  insertLink.run(lQuincas, 'html', 'https://pt.wikisource.org/wiki/Quincas_Borba', 0, 1);

  // Livro: Senhora
  const lSenhora = insertLivro.run(
    'Senhora',
    'Edição Original B. L. Garnier (1875)',
    '978-8508119059',
    1875,
    'pt',
    'O célebre romance de costumes e perfil de mulher sobre Aurélia Camargo, a rica herdeira que compra seu antigo noivo Fernando Seixas.',
    '/capas/senhora.png',
    260,
    autAlencar,
    catRomance,
    fDomPub,
    'dp-bv000188',
    'dominio-publico',
    0,
    senhoraTexto
  ).lastInsertRowid;
  insertLink.run(lSenhora, 'epub', 'https://www.gutenberg.org/ebooks/48433.epub3.images', 1200000, 1);
  insertLink.run(lSenhora, 'html', 'https://pt.wikisource.org/wiki/Senhora', 0, 1);

  // Livro: O Ateneu
  const lAteneu = insertLivro.run(
    'O Ateneu',
    'Edição Original Gazeta de Notícias / Livraria Moderna (1888)',
    '978-8572323888',
    1888,
    'pt',
    'Crônica de saudades e sátira implacável à sociedade imperial através das memórias do internato colegial dirigido pelo Dr. Aristarco Argolo de Ramos.',
    '/capas/o_ateneu.jpg',
    210,
    autPompeia,
    catClassicos,
    fDomPub,
    'dp-bv000282',
    'dominio-publico',
    0,
    oAteneuTexto
  ).lastInsertRowid;
  insertLink.run(lAteneu, 'epub', 'https://www.gutenberg.org/ebooks/47824.epub3.images', 980000, 1);
  insertLink.run(lAteneu, 'html', 'https://pt.wikisource.org/wiki/O_Ateneu', 0, 1);

  // Livro: Os Sertões
  const lSertoes = insertLivro.run(
    'Os Sertões',
    'Campanha de Canudos — Edição Original Laemmert (1902)',
    '978-8520921005',
    1902,
    'pt',
    'Monumental obra jornalística, sociológica e épica dividida em A Terra, O Homem e A Luta, retratando a Guerra de Canudos liderada por Antônio Conselheiro.',
    '/capas/os_sertoes.jpg',
    520,
    autEuclides,
    catDidaticos,
    fDomPub,
    'dp-bv000091',
    'dominio-publico',
    0,
    osSertoesTexto
  ).lastInsertRowid;
  insertLink.run(lSertoes, 'html', 'https://pt.wikisource.org/wiki/Os_Sertões', 0, 1);

  // Livro: A Moreninha
  const lMoreninha = insertLivro.run(
    'A Moreninha',
    'Edição Original Typographia Imparcial (1844)',
    '978-8572323895',
    1844,
    'pt',
    'Marco inaugural do romance brasileiro, relatando a aposta de Augusto e seus colegas na Ilha de Paquetá e o amor inesquecível pela jovem Carolina.',
    '/capas/a_moreninha.png',
    190,
    autMacedo,
    catRomance,
    fDomPub,
    'dp-bv000216',
    'dominio-publico',
    0,
    aMoreninhaTexto
  ).lastInsertRowid;
  insertLink.run(lMoreninha, 'epub', 'https://www.gutenberg.org/ebooks/55257.epub3.images', 870000, 1);
  insertLink.run(lMoreninha, 'html', 'https://pt.wikisource.org/wiki/A_Moreninha', 0, 1);

  // Livro: Auto da Barca do Inferno
  const lBarca = insertLivro.run(
    'Auto da Barca do Inferno',
    'Auto de Moralidade (1517 / Copilaçam 1562)',
    '978-8572323901',
    1517,
    'pt',
    'A imortal sátira teatral de Gil Vicente no cais místico onde o Anjo e o Diabo julgam os vícios e hipocrisias dos mortais em busca de salvação.',
    '/capas/auto_da_barca_do_inferno.jpg',
    95,
    autGilVicente,
    catPoesia,
    fDomPub,
    'dp-bv000109',
    'dominio-publico',
    0,
    autoDaBarcaDoInfernoTexto
  ).lastInsertRowid;
  insertLink.run(lBarca, 'epub', 'https://www.gutenberg.org/ebooks/37021.epub3.images', 550000, 1);
  insertLink.run(lBarca, 'html', 'https://pt.wikisource.org/wiki/Auto_da_Barca_do_Inferno', 0, 1);

  // Livro: Os Lusíadas
  const lLusiadas = insertLivro.run(
    'Os Lusíadas',
    'Canto Épico dos Feitos Portugueses — Edição Original (1572)',
    '978-8572323918',
    1572,
    'pt',
    'O supremo poema épico da língua portuguesa, cantando a viagem marítima de Vasco da Gama à Índia e as façanhas históricas dos navegadores lusitanos.',
    '/capas/os_lusiadas.jpg',
    380,
    autCamoes,
    catPoesia,
    fDomPub,
    'dp-bv000088',
    'dominio-publico',
    0,
    osLusiadasTexto
  ).lastInsertRowid;
  insertLink.run(lLusiadas, 'epub', 'https://www.gutenberg.org/ebooks/3333.epub3.images', 1600000, 1);
  insertLink.run(lLusiadas, 'html', 'https://pt.wikisource.org/wiki/Os_Lusíadas', 0, 1);

  // Livro: Mensagem
  const lMensagem = insertLivro.run(
    'Mensagem',
    'Único Livro de Poemas em Português Publicado em Vida (1934)',
    '978-8572323925',
    1934,
    'pt',
    'Obra-prima mística, simbólica e sebastianista de Fernando Pessoa, evocando o império espiritual do Quinto Império através de 44 poemas.',
    '/capas/mensagem.jpg',
    110,
    autPessoa,
    catPoesia,
    fDomPub,
    'dp-pe000004',
    'dominio-publico',
    0,
    mensagemTexto
  ).lastInsertRowid;
  insertLink.run(lMensagem, 'epub', 'https://www.gutenberg.org/ebooks/54029.epub3.images', 620000, 1);
  insertLink.run(lMensagem, 'html', 'https://pt.wikisource.org/wiki/Mensagem', 0, 1);

  // Livro: Noite na Taverna
  const lTaverna = insertLivro.run(
    'Noite na Taverna',
    'Edição Original Póstuma (1855)',
    '978-8572323932',
    1855,
    'pt',
    'Contos góticos e sombrios da boêmia romântica onde amigos reunidos numa taverna narram suas experiências de paixão mórbida, crime e desespero.',
    '/capas/noite_na_taverna.png',
    130,
    autAlvares,
    catRomance,
    fDomPub,
    'dp-bv000043',
    'dominio-publico',
    0,
    noiteNaTavernaTexto
  ).lastInsertRowid;
  insertLink.run(lTaverna, 'epub', 'https://www.gutenberg.org/ebooks/47822.epub3.images', 680000, 1);
  insertLink.run(lTaverna, 'html', 'https://pt.wikisource.org/wiki/Noite_na_Taverna', 0, 1);

  // Livro: Clara dos Anjos
  const lClara = insertLivro.run(
    'Clara dos Anjos',
    'Edição Concluída em 1922 / Publicação Póstuma',
    '978-8572323949',
    1922,
    'pt',
    'A sensível e contundente narrativa de Lima Barreto sobre os subúrbios cariocas, o preconceito racial e as barreiras sociais enfrentadas pela jovem mulata Clara.',
    '/capas/clara_dos_anjos.jpg',
    180,
    autLimaBarreto,
    catRomance,
    fDomPub,
    'dp-bv000159',
    'dominio-publico',
    0,
    claraDosAnjosTexto
  ).lastInsertRowid;
  insertLink.run(lClara, 'html', 'https://pt.wikisource.org/wiki/Clara_dos_Anjos', 0, 1);

  // Inserir Livros Técnicos e Manuais Abertos do GitHub (BibliotecaDev, italo books)
  const catMap = {
    'Arquitetura & Engenharia de Software': catArq,
    'Desenvolvimento Web & Mobile': catWeb,
    'DevOps, Cloud & Infraestrutura': catDevOps,
    'Ciência de Dados & Inteligência Artificial': catData,
    'Metodologias Ágeis & Carreira Tech': catAgil,
    'Tecnologia & Guias Digitais': catTecnologia,
    'Romance & Crônicas': catRomance,
    'Teatro & Poesia': catPoesia,
    'Apoio Pedagógico & Filosofia': catDidaticos,
    'Literatura Angolana': catAngolana,
    'Literatura Africana Lusófona': catAfricaLusofona,
    'Poesia Africana': catPoesiaAfricana,
    'Autores Lusófonos Clássicos': catAutoresLusofonos,
    '🌍 Literatura & Vozes de África': catAfricaLit,
    '🌍 Contos & Tradição Oral Africana': catAfricaContos,
    '🌍 História & Sociedade Africana': catAfricaHist,
    '🌍 Filosofia & Pensamento Africano': catAfricaFilo,
    '🎓 Teses & Trabalhos Universitários (UAN)': catUanTfc
  };

  const fonteMap = {
    'github-bibliotecadev': fBibDev,
    'github-italocamilo': fItalo,
    'trilhainfo': fTrilha,
    'guiadeti': fGuiaDeTI,
    'gutenberg': fGutenberg,
    'wikisource': fWikisource,
    'dominiopublico': fDomPub,
    'manual': fManual,
    'github-freebooks-zh': fFreeBooksZh,
    'github-awesome-cn': fAwesomeCn,
    'github-roadmap-zh': fRoadmapZh,
    'github-freebooks-fr': fFreeBooksFr,
    'github-awesome-fr': fAwesomeFr,
    'github-freebooks-en': fFreeBooksEn,
    'github-awesome-en': fAwesomeEn,
    'github-freebooks-de': fFreeBooksDe,
    'github-awesome-de': fAwesomeDe,
    'rheinwerk-openbook': fRheinwerk,
    'wikibooks-de': fWikibooksDe,
    'github-de': fGithubDe,
    'github-literatura-de': fLiteraturaDe,
    'github-filosofia': fFilosofia,
    'standardebooks': fStandardEbooks,
    'github-freebooks-es': fFreeBooksEs,
    'wikisource-de': fWikisourceDe,
    'archive-de': fArchiveDe,
    'archive-fr': fArchiveFr,
    'archive-ru': fArchiveRu,
    'archive-it': fArchiveIt,
    'uan-tfc': fUanTfc
  };

  for (const b of githubBooks) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Internacional/Comunidade', 'Autor de obras e manuais técnicos abertos.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catTecnologia;
    const fId = fonteMap[b.fonteSlug] || fManual;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 2020,
      'pt',
      b.sinopse,
      b.capaUrl,
      b.paginas || 200,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      'outro',
      0,
      `${b.titulo.toUpperCase()}\n\n${b.sinopse}\n\nMaterial disponível livremente para leitura e estudo no acervo Lino Livre.`
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      for (const lk of b.links) {
        insertLink.run(bId, lk.formato || 'pdf', lk.url, 0, 1);
      }
    }
  }

  // Inserir Livros Técnicos e Repositórios em Francês (FR)
  for (const b of githubFrBooks) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'França / Francofonia', 'Auteur et communauté de technologies libres francophones.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catTecnologia;
    const fId = fonteMap[b.fonteSlug] || fFreeBooksFr;

    const existing = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existing) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 2024,
      'fr',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      'outro',
      0,
      `${b.titulo.toUpperCase()}\n\n${b.sinopse}\n\nOuvrage ou ressource libre accessible pour lecture en ligne.`
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Livros Técnicos e Repositórios em Alemão (DE)
  for (const b of githubDeBooks) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Deutschland / DACH', 'Autor und Open-Source-Gemeinschaft im deutschsprachigen Raum.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catTecnologia;
    const fId = fonteMap[b.fonteSlug] || fFreeBooksDe;

    const existing = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existing) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 2024,
      'de',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      'outro',
      0,
      `${b.titulo.toUpperCase()}\n\n${b.sinopse}\n\nFrei verfügbares Fachbuch oder Ressource für Studium und Praxis.`
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Livros Técnicos e Repositórios em Mandarim (ZH)
  for (const b of githubZhBooks) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'China / Comunidade Técnica', '开源技术作者与社区').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catTecnologia;
    const fId = fonteMap[b.fonteSlug] || fFreeBooksZh;

    const existing = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existing) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 2024,
      'zh',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      'outro',
      0,
      `${b.titulo.toUpperCase()}\n\n${b.sinopse}\n\n开源技术中文书籍及资源。`
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Livros Técnicos e Repositórios em Inglês (EN)
  for (const b of githubEnBooks) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'International / Open Source', 'Technical authors and community curators.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catTecnologia;
    const fId = fonteMap[b.fonteSlug] || fFreeBooksEn;

    const existing = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existing) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 2024,
      'en',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      'outro',
      0,
      `${b.titulo.toUpperCase()}\n\n${b.sinopse}\n\nFree open book for online learning.`
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }


  // Inserir Romances Clássicos de Domínio Público (GITenberg + Standard Ebooks)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente
  // Usar categoria "Romance & Crônicas" já definida (catRomance)

  for (const b of romanceClassics) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Britânica / Americana / Francesa', 'Autor clássico de romances de domínio público.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catRomance; // usar categoria existente
    const fId = fGutenberg; // usar fonte Project Gutenberg existente

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      b.isbn || null,
      b.ano,
      'en', // idioma original
      b.sinopse,
      b.capaUrl,
      b.paginas,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      'dominio-publico',
      0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Os 100 Livros Mais Lidos e Vendidos da História (+ 5 Obras Históricas)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of worldClassicsList) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Literatura Mundial / Universal', 'Autor consagrado no cânone da literatura e circulação mundial.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || (b.categoria === 'Apoio Pedagógico & Filosofia' ? catDidaticos : catRomance);
    const fId = fonteMap[b.fonteSlug] || fGutenberg;

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano,
      b.idioma || 'pt',
      b.sinopse,
      b.capaUrl,
      b.paginas || 300,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      b.licenca || 'outro',
      0,
      '' // ZERO conteúdo local - estritamente intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Filosofia no GitHub (Listas, Cursos, Ferramentas e Obras Clássicas)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of filosofiaBooks) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Internacional / Comunidade', 'Autor ou organizador de recursos filosóficos abertos.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catDidaticos;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 2020,
      b.idioma || 'en',
      b.sinopse,
      b.capaUrl,
      b.paginas || 200,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Literatura Alemã (Project Gutenberg / GITenberg + tiny_schiller)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of literaturaAlema) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Alemã', 'Autor clássico de obras em língua alemã em domínio público.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catDidaticos;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 1900,
      b.idioma || 'de',
      b.sinopse,
      b.capaUrl,
      b.paginas || 200,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Clássicos Alemães Canónicos (Goethe, Schiller, Kafka, Nietzsche, Kant, Hoffmann, Heine)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of classicosAlema) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Alemã', 'Autor clássico de obras em língua alemã em domínio público.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catDidaticos;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || null,
      b.idioma || 'de',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Clássicos Alemães na Wikisource Alemã (Schiller, Kant, Goethe, Lessing, Grimm)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of wikisourceAlema) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Alemã', 'Autor clássico de obras em língua alemã em domínio público.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catDidaticos;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || null,
      b.idioma || 'de',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir o Cânone Clássico Alemão no Internet Archive (Hegel, Schopenhauer, Nietzsche, Lessing, Goethe, Kleist, Heine)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of archiveAlema) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Alemã', 'Autor clássico de obras em língua alemã em domínio público.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catDidaticos;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || null,
      b.idioma || 'de',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir o Cânone Clássico Francês no Internet Archive (Molière, Voltaire, Rousseau, Hugo, Flaubert, Balzac, Dumas, Zola, Baudelaire...)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of archiveFrances) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Francesa', 'Autor clássico de obras em língua francesa em domínio público.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catDidaticos;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || null,
      b.idioma || 'fr',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Cânone Clássico Russo no Internet Archive
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of archiveRussa) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Russa', 'Autor clássico de obras em língua russa em domínio público.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catDidaticos;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || null,
      b.idioma || 'ru',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Cânone Clássico Italiano no Internet Archive
  // (Dante, Petrarca, Boccaccio, Machiavelli, Ariosto, Tasso, Goldoni, Foscolo, Leopardi,
  //  Manzoni, Pellico, Nievo, Verga, D'Annunzio, Serao, Svevo, Pascoli, Alfieri)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of archiveItaliana) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Italiana', 'Autor clássico de obras em língua italiana em domínio público.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catDidaticos;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || null,
      b.idioma || 'it',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Open Source Alemão no GitHub (Repositórios de Organizações Alemãs)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of githubOrgsAlema) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Alemã', 'Organização ou comunidade de software livre alemã.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catTecnologia;
    const fId = fonteMap[b.fonteSlug] || fManual;
    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 2026,
      b.idioma || 'de',
      b.sinopse,
      b.capaUrl,
      b.paginas || 200,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      b.leituras || 0,
      ''      // SEM conteúdo local - apenas intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir a Coleção Monumental de África (5 idiomas: pt, en, fr, de, zh)
  const catAfricaMap = {
    '🌍 Literatura & Vozes de África': catAfricaLit,
    '🌍 Contos & Tradição Oral Africana': catAfricaContos,
    '🌍 História & Sociedade Africana': catAfricaHist,
    '🌍 Filosofia & Pensamento Africano': catAfricaFilo
  };

  for (const b of livrosAfricaData) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, b.nacionalidade || 'Africana / Internacional', b.biografia || 'Autor de relevo da literatura e cultura africana.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catAfricaMap[b.categoria] || catAfricaLit;
    const fId = fonteMap[b.fonteSlug] || fManual;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      b.isbn || null,
      b.ano || 1960,
      b.idioma || 'pt',
      b.sinopse,
      b.capaUrl,
      b.paginas || 200,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      b.licenca || 'dominio-publico',
      0,
      b.conteudoTexto
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      for (const lk of b.links) {
        insertLink.run(bId, lk.formato || 'html', encodeURI(lk.url), 0, 1);
      }
    }
  }

  // Inserir Literatura Lusófona Clássica e Vozes dos PALOP (Project Gutenberg / Wikisource)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of literaturaLusofonaClassica) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, b.nacionalidade || 'Lusófona', b.biografia || 'Autor clássico da literatura em língua portuguesa.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catRomance;
    const fId = fonteMap[b.fonteSlug] || fGutenberg;

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano,
      b.idioma || 'pt',
      b.sinopse,
      b.capaUrl,
      b.paginas || 200,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      b.licenca || 'dominio-publico',
      0,
      '' // ZERO conteúdo local - estritamente intermediário
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Recursos Técnicos e Livros de Programação em Espanhol (ES)
  // IMPORTANTE: Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (AGENTS.md)
  for (const b of githubEsBooks) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, 'Espanha / América Latina', 'Comunidade e autores de software e tecnologia em espanhol.').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catMap[b.categoria] || catTecnologia;
    const fId = fonteMap[b.fonteSlug] || fFreeBooksEs;

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'outro';

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      null,
      b.ano || 2023,
      b.idioma || 'es',
      b.sinopse,
      b.capaUrl,
      b.paginas || 0,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      0,
      `${b.titulo.toUpperCase()}\n\n${b.sinopse}\n\nRecurso libre para estudio y lectura en línea.`
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Trabalhos de Fim de Curso (TFC) da Universidade Agostinho Neto (UAN)
  for (const b of uanTrabalhosData) {
    let aut = db.prepare('SELECT id FROM autores WHERE nome = ?').get(b.autor);
    let aId;
    if (!aut) {
      aId = insertAutor.run(b.autor, b.nacionalidade || 'Angolana', b.biografia || 'Estudante universitário(a) e autor(a) de TFC na Universidade Agostinho Neto (UAN).').lastInsertRowid;
    } else {
      aId = aut.id;
    }

    const cId = catUanTfc;
    const fId = fUanTfc;

    const existingLivro = db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fId, b.fonteIdExterno);
    if (existingLivro) continue;

    const lic = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'].includes(b.licenca) ? b.licenca : 'cc-by';

    const bId = insertLivro.run(
      b.titulo,
      b.subtitulo || null,
      b.isbn || null,
      b.ano || 2024,
      b.idioma || 'pt',
      b.sinopse,
      b.capaUrl,
      b.paginas || 75,
      aId,
      cId,
      fId,
      b.fonteIdExterno,
      lic,
      0,
      `${b.titulo.toUpperCase()}\n\n${b.subtitulo || ''}\n\n${b.sinopse}\n\nTrabalho de conclusão de curso para consulta pública e acadêmica.`
    ).lastInsertRowid;

    if (b.links && Array.isArray(b.links)) {
      const seenFormatos = new Set();
      for (const lk of b.links) {
        const fmt = lk.formato || 'html';
        if (seenFormatos.has(fmt)) continue;
        seenFormatos.add(fmt);
        insertLink.run(bId, fmt, lk.url, 0, 1);
      }
    }
  }

  // Inserir Tese do Método Fluência (Publicação Oficial Aberta da Fluência AI)
  const autCamila = insertAutor.run('Camila Caligari', 'Brasileira', 'Especialista em inteligência artificial aplicada, design de produtos AI-Native e fundadora do Método Fluência.').lastInsertRowid;
  const lTeseFluencia = insertLivro.run(
    'Tese do Método Fluência: Criatividade e Liderança na Era da IA',
    'Modelos mentais, pensamento crítico e arquitetura de sistemas com IA',
    'FLUENCIA-TESE-2025',
    2025,
    'pt',
    'Manifesto e tratado metodológico do Método Fluência. Ensina a superar o uso raso e passivo de prompts e ferramentas isoladas, desenvolvendo autonomia cognitiva, governança, pensamento computacional e liderança estratégica para a era das Frontier Firms.',
    'https://static.wixstatic.com/media/dff43d_6723fca1326442e0b1c66157965eaf77~mv2.png',
    42,
    autCamila,
    catData,
    fFluencia,
    'fluencia-tese-pdf',
    'outro',
    0,
    'TESE DO MÉTODO FLUÊNCIA: CRIATIVIDADE E LIDERANÇA NA ERA DA IA\n\nPor Camila Caligari — Fluência AI.\n\nUm guia profundo sobre como pensar, decidir e construir sistemas com inteligência artificial com método, critério e impacto real.'
  ).lastInsertRowid;
  insertLink.run(lTeseFluencia, 'pdf', 'https://www.fluencia.ai/_files/ugd/dff43d_4b80c894cb58416b8539e7deda773405.pdf', 684472, 1);

  // 5. Inserir Cursos e Roadmaps (classificando com coluna 'tipo')
  const insertCurso = db.prepare(`
    INSERT INTO cursos (titulo, tipo, area, plataforma, url, licenca, nivel, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of cursosData) {
    const titulo = c[0] || '';
    const plataforma = c[2] || '';
    const url = c[3] || '';
    const isRoadmap = plataforma.includes('Trilha Info') ||
                      titulo.toLowerCase().includes('roadmap') ||
                      url.includes('/roadmaps/') ||
                      titulo.toLowerCase().includes('techguide');
    const tipo = isRoadmap ? 'roadmap' : 'curso';
    insertCurso.run(c[0], tipo, c[1], c[2], c[3], c[4], c[5], c[6]);
  }

  // Roadmaps interativos oficiais do Roadmap.sh (95 roadmaps oficiais extraídos de nilbuild/developer-roadmap)
  for (const r of roadmapShList) {
    insertCurso.run(r.titulo, 'roadmap', r.area, r.plataforma, r.url, r.licenca, r.nivel, r.descricao);
  }

  // Bootcamps Oficiais DIO (Digital Innovation One - 222 bootcamps com datas de finalização e habilidades)
  for (const b of dioBootcampsList) {
    insertCurso.run(b.titulo, 'bootcamp', b.area, b.plataforma, b.url, b.licenca, b.nivel, b.descricao);
  }

  // Santander Open Academy (Bolsas, Bootcamps e Cursos On-Demand com prazos de finalização)
  for (const s of santanderAcademyList) {
    insertCurso.run(s.titulo, s.tipo || 'curso', s.area, s.plataforma, s.url, s.licenca, s.nivel, s.descricao);
  }

  // Curso em Vídeo (Prof. Gustavo Guanabara - 25 cursos completos com certificados gratuitos)
  for (const v of cursoEmVideoList) {
    insertCurso.run(v.titulo, 'curso', v.area, v.plataforma, v.url, v.licenca, v.nivel, v.descricao);
  }

  // Data Science Academy (DSA - Cursos gratuitos oficiais com certificação gratuita de conclusão)
  for (const d of dsaCoursesList) {
    insertCurso.run(d.titulo, d.tipo || 'curso', d.area, d.plataforma, d.url, d.licenca, d.nivel, d.descricao);
  }

  // Novas Plataformas Parceiras de Cursos & Bootcamps (FIAP, IBM, Cisco, Escola do Trabalhador, AWS, MS Learn, freeCodeCamp, Kultivi, SENAI, ONE, Generation, WoMakersCode, Eu Capacito)
  for (const p of novasPlataformasCursos) {
    insertCurso.run(p.titulo, p.tipo || 'curso', p.area, p.plataforma, p.url, p.licenca, p.nivel, p.descricao);
  }

  // Cursos e Tutoriais Gratuitos em Alemão (openHPI, Microsoft Learn DE, YouTube, Red Hat)
  for (const g of germanCoursesList) {
    insertCurso.run(g.titulo, g.tipo || 'curso', g.area, g.plataforma, g.url, g.licenca, g.nivel, g.descricao);
  }

  // Cursos e Tutoriais Gratuitos em Francês (FUN-MOOC, Inria, ANSSI, OpenClassrooms, Elements of AI)
  for (const fr of frenchCoursesList) {
    insertCurso.run(fr.titulo, fr.tipo || 'curso', fr.area, fr.plataforma, fr.url, fr.licenca, fr.nivel, fr.descricao);
  }

  // Cursos Gratuitos do canal Programação Web (Dimitry Lavalhere - YouTube)
  for (const pw of programacaoWebCursos) {
    insertCurso.run(pw.titulo, pw.tipo || 'curso', pw.area, pw.plataforma, pw.url, pw.licenca, pw.nivel, pw.descricao);
  }

  // Cursos Gratuitos da Plataforma Cursa (cursa.app - em PT, EN, ES, FR, HI com certificado gratuito)
  for (const cur of cursaCoursesList) {
    insertCurso.run(cur.titulo, cur.tipo || 'curso', cur.area, cur.plataforma, cur.url, cur.licenca, cur.nivel, cur.descricao);
  }

  // Exercícios e Questionários Práticos da Plataforma Cursa (cursa.app/pt/exercicios)
  for (const ex of cursaExerciciosList) {
    insertCurso.run(ex.titulo, ex.tipo || 'exercicios', ex.area, ex.plataforma, ex.url, ex.licenca, ex.nivel, ex.descricao);
  }

  // Cursos Gratuitos de Harvard Online (Harvard PLL Free) e Grandes Plataformas Acadêmicas (MIT OCW, Stanford)
  for (const hvd of harvardCoursesList) {
    insertCurso.run(hvd.titulo, hvd.tipo || 'curso', hvd.area, hvd.plataforma, hvd.url, hvd.licenca, hvd.nivel, hvd.descricao);
  }

  // Cursos Gratuitos da Jornada do Dev (jornadadodev.com.br - 60 cursos completos com certificado gratuito)
  for (const j of jornadaDoDevList) {
    insertCurso.run(j.titulo, j.tipo || 'curso', j.area, j.plataforma, j.url, j.licenca, j.nivel, j.descricao);
  }

  // Cursos Gratuitos da Escola Virtual de Governo (EV.G / ENAP - escolavirtual.gov.br - 489 cursos com certificado oficial gratuito)
  for (const evg of evgCoursesList) {
    insertCurso.run(evg.titulo, evg.tipo || 'curso', evg.area, evg.plataforma, evg.url, evg.licenca, evg.nivel, evg.descricao);
  }

  // Cursos Gratuitos da Lumina UFRGS (lumina.ufrgs.br - com certificado de extensão universitária gratuito)
  for (const lum of luminaCoursesList) {
    insertCurso.run(lum.titulo, lum.tipo || 'curso', lum.area, lum.plataforma, lum.url, lum.licenca, lum.nivel, lum.descricao);
  }

  // Cursos Gratuitos do Instituto Federal do Rio Grande do Sul (IFRS Moodle MOOC - com certificado gratuito)
  for (const ifrs of ifrsCoursesList) {
    insertCurso.run(ifrs.titulo, ifrs.tipo || 'curso', ifrs.area, ifrs.plataforma, ifrs.url, ifrs.licenca, ifrs.nivel, ifrs.descricao);
  }

  // Cursos Gratuitos do Google Ateliê Digital (learndigital.withgoogle.com - com certificado oficial gratuito)
  for (const ggl of googleAtelieCoursesList) {
    insertCurso.run(ggl.titulo, ggl.tipo || 'curso', ggl.area, ggl.plataforma, ggl.url, ggl.licenca, ggl.nivel, ggl.descricao);
  }

  // Cursos Gratuitos do OpenBootcamp / Kogno (open-bootcamp.com - desenvolvimento de software 100% gratuito)
  for (const ob of openBootcampCoursesList) {
    insertCurso.run(ob.titulo, ob.tipo || 'curso', ob.area, ob.plataforma, ob.url, ob.licenca, ob.nivel, ob.descricao);
  }

  // Cursos, Workshops e Formações da Fluência AI (fluencia.ai - Método Fluência, AI-Native Design, Governança)
  for (const f of fluenciaAiList) {
    insertCurso.run(f.titulo, f.tipo || 'curso', f.area, f.plataforma, f.url, f.licenca, f.nivel, f.descricao);
  }

  // Cursos, Bootcamps e Formações Gratuitas da Recode (recode.org.br - Recode PRO AI, impactAI, Programação, Games)
  for (const rc of recodeCoursesList) {
    insertCurso.run(rc.titulo, rc.tipo || 'curso', rc.area, rc.plataforma, rc.url, rc.licenca, rc.nivel, rc.descricao);
  }

  // Cursos Gratuitos do Code IoT (codeiot.org.br - Samsung & LSI-TEC / USP - Internet das Coisas, Arduino, Robótica, IA)
  for (const ci of codeIotCoursesList) {
    insertCurso.run(ci.titulo, ci.tipo || 'curso', ci.area, ci.plataforma, ci.url, ci.licenca, ci.nivel, ci.descricao);
  }

  // Cursos Gratuitos da Aliança pela Educação (ABE / Instituto Somos - abe.aliancapelaeducacao.com.br - IA, Dados, Cloud, ESG, Gestão)
  for (const abe of abeCoursesList) {
    insertCurso.run(abe.titulo, abe.tipo || 'curso', abe.area, abe.plataforma, abe.url, abe.licenca, abe.nivel, abe.descricao);
  }

  // Cursos Oficiais da Cisco Networking Academy & Skills for All (netacad.com - Redes, Cibersegurança, Programação, IA, Suporte)
  for (const cisco of netacadCoursesList) {
    insertCurso.run(cisco.titulo, cisco.tipo || 'curso', cisco.area, cisco.plataforma, cisco.url, cisco.licenca, cisco.nivel, cisco.descricao);
  }

  // Awesome Roadmaps (github.com/liuchong/awesome-roadmaps - Roteiros Curados de Carreira e Estudo em TI)
  for (const r of awesomeRoadmapsList) {
    insertCurso.run(r.titulo, 'roadmap', r.area, r.plataforma, r.url, r.licenca, r.nivel, r.descricao);
  }

  // Curso DOCKER + DOCKER COMPOSE por Fernanda Kipper | Dev (YouTube)
  for (const fk of fernandaKipperList) {
    insertCurso.run(fk.titulo, fk.tipo || 'curso', fk.area, fk.plataforma, fk.url, fk.licenca, fk.nivel, fk.descricao);
  }

  // Curso COMPLETO Segurança em Redes de Computadores por SegInfoBrasil (YouTube)
  for (const sib of segInfoBrasilList) {
    insertCurso.run(sib.titulo, sib.tipo || 'curso', sib.area, sib.plataforma, sib.url, sib.licenca, sib.nivel, sib.descricao);
  }

  // Cursos de TypeScript e Full Stack Azure por Glaucia Lemos (YouTube)
  for (const gl of glauciaLemosTsList) {
    insertCurso.run(gl.titulo, gl.tipo || 'curso', gl.area, gl.plataforma, gl.url, gl.licenca, gl.nivel, gl.descricao);
  }

  // Curso Completo de LangChain para Iniciantes por Gustavo Sacchi (YouTube)
  for (const gs of langchainSacchiList) {
    insertCurso.run(gs.titulo, gs.tipo || 'curso', gs.area, gs.plataforma, gs.url, gs.licenca, gs.nivel, gs.descricao);
  }

  // Bora na Tech? (boranatech.com.br - Plataforma de Carreira, Roadmaps e Projetos)
  for (const bnt of boraNaTechList) {
    insertCurso.run(bnt.titulo, bnt.tipo || 'curso', bnt.area, bnt.plataforma, bnt.url, bnt.licenca, bnt.nivel, bnt.descricao);
  }

  // TechGuide.sh (techguide.sh - Alura & Comunidade - Guias do Profissional em T)
  for (const tg of techGuideList) {
    insertCurso.run(tg.titulo, tg.tipo || 'roadmap', tg.area, tg.plataforma, tg.url, tg.licenca, tg.nivel, tg.descricao);
  }

  // KA Solution (Webinars Oficiais no Zoom & Cursos KAtrocinados)
  for (const ka of kaSolutionList) {
    insertCurso.run(ka.titulo, ka.tipo || 'curso', ka.area, ka.plataforma, ka.url, ka.licenca, ka.nivel, ka.descricao);
  }

  // EBAC Online (Cursos Gratuitos, Webinars & Workshops com Certificado)
  for (const eb of ebacCoursesList) {
    insertCurso.run(eb.titulo, eb.tipo || 'curso', eb.area, eb.plataforma, eb.url, eb.licenca, eb.nivel, eb.descricao);
  }

  // Samsung Ocean Brasil (Cursos, Trilhas e Workshops em parceria com USP & UEA)
  for (const oc of oceanBrasilList) {
    insertCurso.run(oc.titulo, oc.tipo || 'curso', oc.area, oc.plataforma, oc.url, oc.licenca, oc.nivel, oc.descricao);
  }

  // Microsoft Learn (Cursos Oficiais, Applied Skills e Trilhas de Aprendizagem em Português pt-pt)
  for (const ms of msLearnList) {
    insertCurso.run(ms.titulo, ms.tipo || 'curso', ms.area, ms.plataforma, ms.url, ms.licenca, ms.nivel, ms.descricao);
  }

  // Inserir Catálogo de Podcasts & Audiolivros (Integração Spotify)

  const insertShow = db.prepare(`
    INSERT INTO podcasts_shows (titulo, slug, descricao, capa_url, spotify_url, spotify_uri, categoria, idioma, ativo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const insertEpisodio = db.prepare(`
    INSERT INTO podcasts_episodios (show_id, numero, titulo, slug, descricao, duracao_minutos, spotify_url, spotify_embed_url, audio_url, publicado_em, reproducoes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `);

  for (const s of podcastsShowsData) {
    const showId = insertShow.run(s.titulo, s.slug, s.descricao, s.capa_url, s.spotify_url, s.spotify_uri, s.categoria, s.idioma).lastInsertRowid;
    if (s.episodios && Array.isArray(s.episodios)) {
      for (const ep of s.episodios) {
        insertEpisodio.run(
          showId,
          ep.numero,
          ep.titulo,
          ep.slug,
          ep.descricao,
          ep.duracao_minutos,
          ep.spotify_url,
          ep.spotify_embed_url,
          ep.audio_url || null,
          ep.publicado_em || '2026-10-01'
        );
      }
    }
  }

    db.exec('COMMIT;');
    console.log('Seed do Lino Livre finalizado com sucesso!');
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (_) {}
    throw err;
  }
}

if (require.main === module) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Execução de seed é estritamente proibida em ambiente de produção!');
    process.exit(1);
  }

  const db = getDatabase();
  let totalExistente = 0;
  try {
    totalExistente = db.prepare('SELECT COUNT(*) AS total FROM livros').get()?.total || 0;
  } catch (_) {}

  const temFlagReset = process.argv.includes('--reset') || process.argv.includes('--force');

  if (totalExistente > 0 && !temFlagReset) {
    console.error(`\n⚠️  ATENÇÃO: A base de dados local já contém ${totalExistente} livros indexados.`);
    console.error('   O seed executa um reset destrutivo das tabelas locais.');
    console.error('   Para confirmar o reset e recriar os dados de demonstração, execute:\n');
    console.error('   npm run seed -- --reset\n');
    process.exit(1);
  }

  seed(db);
}

module.exports = { seed };