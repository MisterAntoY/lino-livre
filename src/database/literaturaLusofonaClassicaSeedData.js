/**
 * Acervo Curado de Literatura Lusófona Clássica e Vozes dos PALOP
 * Obras de Domínio Público (Project Gutenberg, Wikisource e Acervos Nacionais Digitais)
 * Abrange:
 *  - Autores Lusófonos Clássicos (Eça de Queirós, Camilo Castelo Branco, Florbela Espanca, Cesário Verde, Antero de Quental, Garrett, Sá-Carneiro)
 *  - Literatura Angolana (Alfredo Troni, Pedro Félix Machado, António de Assis Júnior, Cordeiro da Matta)
 *  - Literatura Africana Lusófona & Poesia Africana (Eugénio Tavares, Pedro Cardoso, Caetano da Costa Alegre, Rui de Noronha)
 *
 * Em estrita conformidade com AGENTS.md (apenas metadados e redirecionamentos externos 302, zero binários locais).
 */

const literaturaLusofonaClassica = [
  // ==========================================
  // 1. AUTORES LUSÓFONOS CLÁSSICOS (PORTUGAL)
  // ==========================================
  {
    titulo: "Os Maias: Episódios da Vida Romântica",
    subtitulo: "A obra-prima do Realismo português",
    autor: "Eça de Queirós",
    nacionalidade: "Português",
    biografia: "Um dos maiores romancistas de todos os tempos da língua portuguesa e mestre supremo do Realismo e da ironia social.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-40409",
    ano: 1888,
    paginas: 720,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "A narrativa monumental da decadência da aristocracia lisboeta através de três gerações da família Maia, centrada nos amores trágicos de Carlos da Maia e Maria Eduarda.",
    capaUrl: "https://www.gutenberg.org/cache/epub/40409/pg40409.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/40409" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/40409.epub3.images" }
    ]
  },
  {
    titulo: "O Crime do Padre Amaro",
    subtitulo: "Cenas da vida devota e hipocrisia clerical",
    autor: "Eça de Queirós",
    nacionalidade: "Português",
    biografia: "Romancista fundador do Realismo-Naturalismo em Portugal, diplomata e autor de obras canônicas da literatura universal.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-24888",
    ano: 1875,
    paginas: 480,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Primeiro grande romance realista português, ambientado em Leiria, que expõe com audácia e realismo psicológico a corrupção e a hipocrisia do meio eclesiástico e provinciano.",
    capaUrl: "https://www.gutenberg.org/cache/epub/24888/pg24888.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/24888" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/24888.epub3.images" }
    ]
  },
  {
    titulo: "O Primo Basílio",
    subtitulo: "Episódio Doméstico da Burguesia Lisboeta",
    autor: "Eça de Queirós",
    nacionalidade: "Português",
    biografia: "Mestre da prosa realista lusa, criador de personagens imortais como Juliana, Luísa e Conselheiro Acácio.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-24578",
    ano: 1878,
    paginas: 420,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Retrato clínico e satírico do tédio burguês e adultério em Lisboa, marcado pelo confronto entre a ingênua Luísa e a implacável criada Juliana.",
    capaUrl: "https://www.gutenberg.org/cache/epub/24578/pg24578.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/24578" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/24578.epub3.images" }
    ]
  },
  {
    titulo: "A Cidade e as Serras",
    subtitulo: "O contraste entre o cosmopolitismo parisiense e o Douro",
    autor: "Eça de Queirós",
    nacionalidade: "Português",
    biografia: "Escritor e pensador português do século XIX, pioneiro da crítica à civilização urbana e ao consumismo desenfreado.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-24887",
    ano: 1901,
    paginas: 310,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Publicado postumamente, narra a viagem de Jacinto de Thormes, que troca a exaustão hipertecnológica da Paris do final do século XIX pela paz telúrica e vital das serras de Tormes.",
    capaUrl: "https://www.gutenberg.org/cache/epub/24887/pg24887.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/24887" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/24887.epub3.images" }
    ]
  },
  {
    titulo: "A Relíquia",
    subtitulo: "Sobre a nudez forte da verdade o manto diáfano da fantasia",
    autor: "Eça de Queirós",
    nacionalidade: "Português",
    biografia: "Grande ficcionista luso, autor de romances, ensaios e crônicas que renovaram profundamente o idioma português.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-24579",
    ano: 1887,
    paginas: 350,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Romance picaresco e satírico que relata a viagem de Teodorico Raposo a Alexandria e Jerusalém em busca de uma relíquia sagrada para herdar a fortuna de sua beata tiazona D. Patrocínio das Neves.",
    capaUrl: "https://www.gutenberg.org/cache/epub/24579/pg24579.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/24579" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/24579.epub3.images" }
    ]
  },
  {
    titulo: "Amor de Perdição",
    subtitulo: "Memórias de uma Família",
    autor: "Camilo Castelo Branco",
    nacionalidade: "Português",
    biografia: "Um dos mais prolíficos e intensos escritores da literatura portuguesa, expoente supremo do ultrarromantismo passional e da novela trágica.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-19948",
    ano: 1862,
    paginas: 280,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "O romance passional mais célebre da literatura lusófona, narrando a paixão proibida e devastadora entre Simão Botelho e Teresa de Albuquerque em meio ao ódio de famílias rivais.",
    capaUrl: "https://www.gutenberg.org/cache/epub/19948/pg19948.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/19948" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/19948.epub3.images" }
    ]
  },
  {
    titulo: "A Queda dum Anjo",
    subtitulo: "Romance de costumes e sátira política",
    autor: "Camilo Castelo Branco",
    nacionalidade: "Português",
    biografia: "Primeiro Visconde de Correia Botelho, mestre inigualável da prosa torrencial e da crítica sociopolítica do Portugal oitocentista.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-23086",
    ano: 1866,
    paginas: 240,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Brilhante sátira aos meandros da política parlamentar e à corrupção moral da corte de Lisboa, acompanhando a transformação do austero deputado transmontano Calisto Elísio.",
    capaUrl: "https://www.gutenberg.org/cache/epub/23086/pg23086.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/23086" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/23086.epub3.images" }
    ]
  },
  {
    titulo: "Charneca em Flor",
    subtitulo: "Sonetos e Poesias Póstumas",
    autor: "Florbela Espanca",
    nacionalidade: "Portuguesa",
    biografia: "Uma das mais extraordinárias poetisas da língua portuguesa, pioneira da expressão da subjetividade feminina, do amor trágico e do lirismo confessional.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-26658",
    ano: 1931,
    paginas: 130,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Coletânea poética culminante de Florbela Espanca, reunindo sonetos de fulgurante intensidade sensorial, dor existencial e celebração do desejo.",
    capaUrl: "https://www.gutenberg.org/cache/epub/26658/pg26658.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/26658" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/26658.epub3.images" }
    ]
  },
  {
    titulo: "Livro de Mágoas",
    subtitulo: "Primeiros Sonetos da Alma Alentejana",
    autor: "Florbela Espanca",
    nacionalidade: "Portuguesa",
    biografia: "Poetisa e contista alentejana cuja lírica de rara beleza emotiva inspirou gerações inteiras no mundo lusófono.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-26657",
    ano: 1919,
    paginas: 90,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "O primeiro livro publicado por Florbela Espanca, dedicado ao pai e ao irmão, marcando sua entrada triunfal na história literária com sonetos de incomparável sensibilidade.",
    capaUrl: "https://www.gutenberg.org/cache/epub/26657/pg26657.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/26657" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/26657.epub3.images" }
    ]
  },
  {
    titulo: "O Livro de Cesário Verde",
    subtitulo: "A Poesia do Cotidiano e do Olhar Moderno",
    autor: "Cesário Verde",
    nacionalidade: "Português",
    biografia: "Precursor fundamental do Modernismo português, cuja poesia sensorial captou como ninguém a vida urbana de Lisboa e o ritmo do trabalho humano.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-27142",
    ano: 1887,
    paginas: 150,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Organizado por Silva Pinto após a morte prematura do poeta, reúne clássicos como 'O Sentimento dum Ocidental', revolucionando a métrica e a imagética poética portuguesa.",
    capaUrl: "https://www.gutenberg.org/cache/epub/27142/pg27142.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/27142" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/27142.epub3.images" }
    ]
  },
  {
    titulo: "Sonetos Completos",
    subtitulo: "Filosofia, Desencanto e Metafísica",
    autor: "Antero de Quental",
    nacionalidade: "Português",
    biografia: "Poeta, filósofo açoriano e líder da Geração de 70 nas famosas Conferências do Casino Lisbonense.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-21832",
    ano: 1886,
    paginas: 180,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "A trajetória espiritual e intelectual de um dos maiores sonetistas da língua, desde o lirismo juvenil e o combate sociopolítico até o pessimismo filosófico contemplativo.",
    capaUrl: "https://www.gutenberg.org/cache/epub/21832/pg21832.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/21832" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/21832.epub3.images" }
    ]
  },
  {
    titulo: "Viagens na Minha Terra",
    subtitulo: "Crônica, Romance e Memória",
    autor: "Almeida Garrett",
    nacionalidade: "Português",
    biografia: "Escritor, orador, dramaturgo e homem de Estado que introduziu o Romantismo em Portugal e fundou o Teatro Nacional D. Maria II.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-23479",
    ano: 1846,
    paginas: 320,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Obra seminal que funde relato de viagem, reflexões políticas e a novela passional de Carlos e Joaninha na pitoresca paisagem de Santarém.",
    capaUrl: "https://www.gutenberg.org/cache/epub/23479/pg23479.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/23479" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/23479.epub3.images" }
    ]
  },
  {
    titulo: "Frei Luís de Sousa",
    subtitulo: "Tragédia Clássica da Honra e do Destino",
    autor: "Almeida Garrett",
    nacionalidade: "Português",
    biografia: "Pai do teatro moderno em língua portuguesa, autor de Autos e dramas de ressonância nacional.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-23480",
    ano: 1844,
    paginas: 160,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "A maior obra-prima do teatro romântico português, estruturada em prosa poética com rigor de tragédia clássica, sobre o retorno inesperado de D. João de Portugal após a batalha de Alcácer Quibir.",
    capaUrl: "https://www.gutenberg.org/cache/epub/23480/pg23480.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/23480" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/23480.epub3.images" }
    ]
  },
  {
    titulo: "A Confissão de Lúcio",
    subtitulo: "Novela de Vanguarda e Mistério Psicológico",
    autor: "Mário de Sá-Carneiro",
    nacionalidade: "Português",
    biografia: "Poeta e novelista do grupo da revista Orpheu, figura de ponta do Primeiro Modernismo português ao lado de Fernando Pessoa.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-23087",
    ano: 1914,
    paginas: 140,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Uma das obras mais fascinantes e misteriosas da vanguarda modernista em língua portuguesa, explorando temas do duplo, obsessão estética e fusão de identidades entre Lúcio, Ricardo e Marta.",
    capaUrl: "https://www.gutenberg.org/cache/epub/23087/pg23087.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/23087" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/23087.epub3.images" }
    ]
  },
  {
    titulo: "Dispersão",
    subtitulo: "12 Poesias de Angústia e Transfiguração",
    autor: "Mário de Sá-Carneiro",
    nacionalidade: "Português",
    biografia: "Gênio precoce do Modernismo português cuja poesia antecipou o surrealismo e o drama da fragmentação do Eu.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-23088",
    ano: 1914,
    paginas: 80,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Coletânea poética fundamental do modernismo lusitano, marcada pelo célebre poema 'Quase' e pela expressão dilacerada da vertigem existencial.",
    capaUrl: "https://www.gutenberg.org/cache/epub/23088/pg23088.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/23088" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/23088.epub3.images" }
    ]
  },
  {
    titulo: "Campo de Flores",
    subtitulo: "Poesias Líricas e Canções Populares",
    autor: "João de Deus",
    nacionalidade: "Português",
    biografia: "Educador e poeta romântico português, autor da revolucionária Cartilha Maternal e patrono das escolas infantis.",
    categoria: "Autores Lusófonos Clássicos",
    fonteSlug: "gutenberg",
    fonteIdExterno: "pg-23891",
    ano: 1893,
    paginas: 220,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Magistral coletânea poética que expressa a simplicidade, ternura e harmonia musical da poesia popular e lírica do idioma português.",
    capaUrl: "https://www.gutenberg.org/cache/epub/23891/pg23891.cover.medium.jpg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/23891" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/23891.epub3.images" }
    ]
  },

  // ==========================================
  // 2. LITERATURA ANGOLANA (CANÔNICA & PIONEIRA)
  // ==========================================
  {
    titulo: "Nga Muturi",
    subtitulo: "Cenas da Vida de Luanda Oitocentista (Novela Inaugural)",
    autor: "Alfredo Troni",
    nacionalidade: "Angolano",
    biografia: "Jornalista, escritor e advogado radicado em Luanda, fundador do jornal 'Um Pharol do Povo' e pioneiro absoluto da narrativa ficcional angolana moderna.",
    categoria: "Literatura Angolana",
    fonteSlug: "wikisource",
    fonteIdExterno: "angola-nga-muturi",
    ano: 1882,
    paginas: 96,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Considerada por historiadores e críticos a obra inaugural da literatura de ficção de Angola. Narra a história de Nga Muturi, viúva luandense inserida nas dinâmicas sociais, linguísticas e jurídicas de Luanda no final do século XIX.",
    capaUrl: "/capas/palop_nga_muturi.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://pt.wikisource.org/wiki/Nga_Muturi" },
      { formato: "epub", url: "https://pt.wikisource.org/w/index.php?title=Especial:Livro&bookcmd=render_article&arttitle=Nga_Muturi" }
    ]
  },
  {
    titulo: "Scenas d'Africa",
    subtitulo: "Romance de Costumes e História das Terras de Angola",
    autor: "Pedro Félix Machado",
    nacionalidade: "Angolano",
    biografia: "Escritor e pensador angolano do século XIX, defensor da valorização dos costumes nativos e da memória histórica dos povos de Angola.",
    categoria: "Literatura Angolana",
    fonteSlug: "wikisource",
    fonteIdExterno: "angola-scenas-africa",
    ano: 1892,
    paginas: 210,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Romance histórico que retrata a vida cotidiana, os conflitos e as tradições do interior e litoral de Angola, mesclando crônica etnográfica e sensibilidade literária pioneira.",
    capaUrl: "/capas/palop_scenas_africa.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://pt.wikisource.org/wiki/Scenas_d%27Africa" }
    ]
  },
  {
    titulo: "O Segredo da Morta",
    subtitulo: "Romance de Costumes Angolenses",
    autor: "António de Assis Júnior",
    nacionalidade: "Angolano",
    biografia: "Jornalista, escritor e nacionalista angolano, uma das figuras mais lúcidas da imprensa e literatura do início do século XX em Angola.",
    categoria: "Literatura Angolana",
    fonteSlug: "dominiopublico",
    fonteIdExterno: "angola-segredo-morta",
    ano: 1929,
    paginas: 260,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Clássico romance de costumes angolanos ambientado entre Luanda e o Dondo, pintando com fidelidade o drama social, as feitiçarias, o comércio colonial e as paixões humanas da sociedade mista angolana.",
    capaUrl: "/capas/palop_segredo_morta.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://archive.org/details/osegredodamorta00assi" }
    ]
  },
  {
    titulo: "Philosophia Popular em Proverbios Angolenses",
    subtitulo: "Sabedoria Ancestral Kimbundu-Português",
    autor: "Joaquim Dias Cordeiro da Matta",
    nacionalidade: "Angolano",
    biografia: "Grande intelectual, historiador, poeta e lexicógrafo angolano (1857-1894), autor de obras fundamentais para a preservação das línguas nacionais de Angola.",
    categoria: "Literatura Angolana",
    fonteSlug: "dominiopublico",
    fonteIdExterno: "angola-proverbios-cordeiro",
    ano: 1891,
    paginas: 180,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Recolha pioneira de centenas de provérbios e axiomas da sabedoria oral banta em língua kimbundu, com suas respectivas traduções e explicações conceituais em língua portuguesa.",
    capaUrl: "/capas/palop_proverbios_angolenses.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://archive.org/details/philosophia-popular-proverbios-angolenses" }
    ]
  },
  {
    titulo: "Delírios",
    subtitulo: "Versos da Juventude Angolana",
    autor: "Joaquim Dias Cordeiro da Matta",
    nacionalidade: "Angolano",
    biografia: "Figura exponencial do renascimento cultural angolano do século XIX, pioneiro do romantismo lírico em Angola.",
    categoria: "Poesia Africana",
    fonteSlug: "wikisource",
    fonteIdExterno: "angola-delirios-cordeiro",
    ano: 1889,
    paginas: 110,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Primeira coletânea poética impressa de um autor nativo angolano no século XIX, cantando os amores da juventude, as belezas naturais da terra natal e a consciência histórica africana.",
    capaUrl: "/capas/palop_delirios.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://pt.wikisource.org/wiki/Del%C3%ADrios" }
    ]
  },

  // ==============================================================
  // 3. LITERATURA AFRICANA LUSÓFONA & POESIA (CABO VERDE, MOÇAMBIQUE, SÃO TOMÉ)
  // ==============================================================
  {
    titulo: "Mornas: Cantigas Crioulas",
    subtitulo: "A Poesia Eterna da Alma Caboverdiana",
    autor: "Eugénio Tavares",
    nacionalidade: "Cabo-Verdiano",
    biografia: "O maior poeta e compositor lírico da história de Cabo Verde (Ilha Brava, 1867-1930), que elevou a morna e o crioulo cabo-verdiano ao estatuto de alta literatura.",
    categoria: "Literatura Africana Lusófona",
    fonteSlug: "wikisource",
    fonteIdExterno: "cv-mornas-eugenio-tavares",
    ano: 1932,
    paginas: 140,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Compilação póstuma das mais comoventes mornas e poemas líricos de Eugénio Tavares, expressando a 'sodade', o mar, a despedida dos emigrantes e o amor às ilhas de Cabo Verde.",
    capaUrl: "/capas/palop_mornas_tavares.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://pt.wikisource.org/wiki/Mornas:_Cantigas_Crioulas" }
    ]
  },
  {
    titulo: "Folclore Caboverdiano",
    subtitulo: "Tradições, Mitos, Cantigas e Provérbios das Ilhas",
    autor: "Pedro Cardoso",
    nacionalidade: "Cabo-Verdiano",
    biografia: "Poeta, jornalista, ensaísta e folklorista da Ilha do Fogo (1883-1942), pioneiro incansável dos estudos de identidade e cultura crioula em Cabo Verde.",
    categoria: "Literatura Africana Lusófona",
    fonteSlug: "dominiopublico",
    fonteIdExterno: "cv-folclore-pedro-cardoso",
    ano: 1933,
    paginas: 190,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Monumental estudo e compilação do cancioneiro, histórias populares, crenças e expressões linguísticas tradicionais do arquipélago de Cabo Verde.",
    capaUrl: "/capas/palop_folclore_caboverdiano.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://archive.org/details/folclore-caboverdiano-cardoso" }
    ]
  },
  {
    titulo: "Algas e Corais",
    subtitulo: "Poemas do Mar e das Ilhas de Barlavento e Sotavento",
    autor: "Pedro Cardoso",
    nacionalidade: "Cabo-Verdiano",
    biografia: "Expoente da fase pré-Claridade na literatura cabo-verdiana, que combinou a escrita clássica com temas genuinamente insulares.",
    categoria: "Poesia Africana",
    fonteSlug: "wikisource",
    fonteIdExterno: "cv-algas-corais-cardoso",
    ano: 1928,
    paginas: 120,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Livro de sonetos e poemas líricos que retrata a beleza agreste da paisagem vulcânica, a bravura dos marinheiros e a identidade telúrica de Cabo Verde.",
    capaUrl: "/capas/palop_algas_corais.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://pt.wikisource.org/wiki/Algas_e_Corais" }
    ]
  },
  {
    titulo: "Versos",
    subtitulo: "A Poesia Negra Pioneira em Língua Portuguesa",
    autor: "Caetano da Costa Alegre",
    nacionalidade: "São-Tomense",
    biografia: "Poeta são-tomense (1864-1890) que produziu a mais contundente e precoce lírica sobre a identidade negra e a experiência do preconceito racial na língua portuguesa.",
    categoria: "Poesia Africana",
    fonteSlug: "wikisource",
    fonteIdExterno: "st-versos-costa-alegre",
    ano: 1916,
    paginas: 110,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Publicado em Lisboa após sua morte prematura, 'Versos' é uma obra-prima histórica: os primeiros poemas em língua portuguesa onde a cor negra da pele é afirmada com altivez, orgulho lírico e beleza estética incomparável.",
    capaUrl: "/capas/palop_versos_costa_alegre.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://pt.wikisource.org/wiki/Versos_(Costa_Alegre)" }
    ]
  },
  {
    titulo: "Sonetos",
    subtitulo: "O Fundador da Poesia Moçambicana Moderna",
    autor: "Rui de Noronha",
    nacionalidade: "Moçambicano",
    biografia: "Jornalista e poeta moçambicano (1909-1943), aclamado unanimemente como o pai e patrono da moderna literatura e poesia de Moçambique.",
    categoria: "Poesia Africana",
    fonteSlug: "wikisource",
    fonteIdExterno: "mz-sonetos-rui-noronha",
    ano: 1946,
    paginas: 130,
    idioma: "pt",
    licenca: "dominio-publico",
    sinopse: "Coletânea monumental com sonetos célebres como 'Surge et Ambula' ('Levanta-te e Anda'), conclamando a África a despertar de seu longo sono colonial com dignidade, justiça e força cultural.",
    capaUrl: "/capas/palop_sonetos_noronha.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://pt.wikisource.org/wiki/Sonetos_(Rui_de_Noronha)" }
    ]
  }
];

module.exports = { literaturaLusofonaClassica };
