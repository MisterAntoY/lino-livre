const { getDatabase } = require('./index');
const { cursosData } = require('./cursosSeedData');
const { githubBooks } = require('./githubBooksSeedData');
const { livrosAfricaData } = require('./livrosAfricaData');
const { roadmapShList } = require('./roadmapShData');
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
  const catArq = insertCat.run('Arquitetura & Engenharia de Software', 'Clean Architecture, Design Patterns, Refatoração e boas práticas de código').lastInsertRowid;
  const catWeb = insertCat.run('Desenvolvimento Web & Mobile', 'Frontend, Backend, APIs, frameworks modernos e desenvolvimento mobile').lastInsertRowid;
  const catDevOps = insertCat.run('DevOps, Cloud & Infraestrutura', 'Linux, Docker, Kubernetes, redes, segurança e computação em nuvem').lastInsertRowid;
  const catData = insertCat.run('Ciência de Dados & Inteligência Artificial', 'Big Data, Machine Learning, Business Intelligence, Data Science e estatística').lastInsertRowid;
  const catAgil = insertCat.run('Metodologias Ágeis & Carreira Tech', 'Scrum, Lean Startup, hábitos de produtividade, liderança e gestão técnica').lastInsertRowid;
  const catAfricaLit = insertCat.run('🌍 Literatura & Vozes de África', 'Obras-primas da literatura africana e pan-africana em múltiplos idiomas').lastInsertRowid;
  const catAfricaContos = insertCat.run('🌍 Contos & Tradição Oral Africana', 'Folclore, fábulas bantas, lendas de Anansi e sabedoria oral ancestral').lastInsertRowid;
  const catAfricaHist = insertCat.run('🌍 História & Sociedade Africana', 'Civilizações antigas, impérios do Sahel, arqueologia e história pan-africana').lastInsertRowid;
  const catAfricaFilo = insertCat.run('🌍 Filosofia & Pensamento Africano', 'Négritude, libertação, dignidade humana e filosofia pan-africana').lastInsertRowid;

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
    'Tecnologia & Guias Digitais': catTecnologia
  };

  const fonteMap = {
    'github-bibliotecadev': fBibDev,
    'github-italocamilo': fItalo,
    'trilhainfo': fTrilha,
    'guiadeti': fGuiaDeTI,
    'gutenberg': fGutenberg,
    'wikisource': fWikisource,
    'dominiopublico': fDomPub,
    'manual': fManual
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

    db.exec('COMMIT;');
    console.log('Seed do Lino Livre finalizado com sucesso!');
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (_) {}
    throw err;
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
