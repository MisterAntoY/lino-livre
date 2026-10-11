/**
 * Acervo Curado de Romances Clássicos de Domínio Público (GITenberg + Standard Ebooks)
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente.
 * Fontes: GITenberg (GitHub org), Standard Ebooks, Project Gutenberg
 */

const romanceClassics = [
  // ========== JANE AUSTEN ==========
  {
    "titulo": "Pride and Prejudice",
    "subtitulo": "Orgulho e Preconceito",
    "autor": "Jane Austen",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "1342",
    "ano": 1813,
    "paginas": 432,
    "sinopse": "Elizabeth Bennet navega pelas complexidades sociais da Inglaterra regencial, confrontando seu próprio preconceito e o orgulho do Sr. Darcy em uma das histórias de amor mais amadas da literatura.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Pride-and-Prejudice_1342" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/1342.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/1342.pdf" }
    ]
  },
  {
    "titulo": "Sense and Sensibility",
    "subtitulo": "Razão e Sensibilidade",
    "autor": "Jane Austen",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "161",
    "ano": 1811,
    "paginas": 384,
    "sinopse": "As irmãs Dashwood, Elinor e Marianne, representam razão e emoção em suas buscas por amor e segurança na sociedade georgiana.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/161/pg161.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Sense-and-Sensibility_161" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/161.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/161.pdf" }
    ]
  },
  {
    "titulo": "Emma",
    "subtitulo": "Emma",
    "autor": "Jane Austen",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "158",
    "ano": 1815,
    "paginas": 474,
    "sinopse": "Emma Woodhouse, bela, inteligente e rica, diverte-se fazendo casamentos para os outros, sem perceber que seu próprio coração está em jogo.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/158/pg158.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Emma_158" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/158.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/158.pdf" }
    ]
  },
  {
    "titulo": "Persuasion",
    "subtitulo": "Persuasão",
    "autor": "Jane Austen",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "105",
    "ano": 1817,
    "paginas": 272,
    "sinopse": "Anne Elliot, persuadida a recusar o amor de sua juventude, reencontra o capitão Wentworth oito anos depois, quando as marés da fortuna mudaram.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/105/pg105.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Persuasion_105" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/105.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/105.pdf" }
    ]
  },
  {
    "titulo": "Mansfield Park",
    "subtitulo": "Mansfield Park",
    "autor": "Jane Austen",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "141",
    "ano": 1814,
    "paginas": 488,
    "sinopse": "Fanny Price, pobre parente acolhida pela família rica, observa silenciosamente os dramas morais e românticos ao seu redor, mantendo sua integridade.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/141/pg141.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Mansfield-Park_141" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/141.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/141.pdf" }
    ]
  },
  {
    "titulo": "Northanger Abbey",
    "subtitulo": "A Abadia de Northanger",
    "autor": "Jane Austen",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "121",
    "ano": 1817,
    "paginas": 352,
    "sinopse": "Catherine Morland, jovem ingênua e ávida leitora de romances góticos, visita a Abadia de Northanger onde sua imaginação cria mistérios que a realidade desmente.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/121/pg121.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Northanger-Abbey_121" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/121.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/121.pdf" }
    ]
  },

  // ========== BRONTË SISTERS ==========
  {
    "titulo": "Jane Eyre",
    "subtitulo": "Jane Eyre",
    "autor": "Charlotte Brontë",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "1260",
    "ano": 1847,
    "paginas": 576,
    "sinopse": "A jornada de Jane Eyre, órfã governanta que encontra amor e independência ao lado do misterioso Sr. Rochester, em meio a segredos sombrios de Thornfield Hall.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/1260/pg1260.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Jane-Eyre_1260" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/1260.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/1260.pdf" }
    ]
  },
  {
    "titulo": "Wuthering Heights",
    "subtitulo": "O Morro dos Ventos Uivantes",
    "autor": "Emily Brontë",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "768",
    "ano": 1847,
    "paginas": 416,
    "sinopse": "A paixão destrutiva e eterna entre Heathcliff e Catherine Earnshaw assombra as charnecas de Yorkshire através de gerações.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/768/pg768.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Wuthering-Heights_768" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/768.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/768.pdf" }
    ]
  },
  {
    "titulo": "The Tenant of Wildfell Hall",
    "subtitulo": "A Inquilina de Wildfell Hall",
    "autor": "Anne Brontë",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "969",
    "ano": 1848,
    "paginas": 528,
    "sinopse": "Helen Graham foge de um casamento abusivo e busca refúgio em Wildfell Hall, desafiando as convenções vitorianas sobre o papel da mulher.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/969/pg969.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/The-Tenant-of-Wildfell-Hall_969" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/969.epub3.images" }
    ]
  },
  {
    "titulo": "Villette",
    "subtitulo": "Villette",
    "autor": "Charlotte Brontë",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "9182",
    "ano": 1853,
    "paginas": 592,
    "sinopse": "Lucy Snowe, professora inglesa na Bélgica, enfrenta isolamento, amor não correspondido e a busca por identidade em uma escola para meninas.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/9182/pg9182.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Villette_9182" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/9182.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/9182.pdf" }
    ]
  },

  // ========== EDITH WHARTON ==========
  {
    "titulo": "The Age of Innocence",
    "subtitulo": "A Idade da Inocência",
    "autor": "Edith Wharton",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "3360",
    "ano": 1920,
    "paginas": 384,
    "sinopse": "Nova York, 1870: Newland Archer vê seu noivado ameaçado pela chegada da condessa Olenska, forçando-o a escolher entre o dever social e o verdadeiro amor.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/3360/pg3360.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/The-Age-of-Innocence_3360" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/3360.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/3360.pdf" }
    ]
  },
  {
    "titulo": "Ethan Frome",
    "subtitulo": "Ethan Frome",
    "autor": "Edith Wharton",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "1470",
    "ano": 1911,
    "paginas": 192,
    "sinopse": "No rigoroso inverno de Massachusetts, Ethan Frome vive preso entre o dever para com a esposa doente e a paixão pela jovem prima Mattie.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/1470/pg1470.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Ethan-Frome_1470" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/1470.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/1470.pdf" }
    ]
  },
  {
    "titulo": "The House of Mirth",
    "subtitulo": "A Casa da Alegria",
    "autor": "Edith Wharton",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "4027",
    "ano": 1905,
    "paginas": 432,
    "sinopse": "Lily Bart navega pela alta sociedade nova-iorquina buscando um casamento vantajoso, enquanto sua integridade e chances de felicidade genuína se esvaem.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/4027/pg4027.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/The-House-of-Mirth_4027" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/4027.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/4027.pdf" }
    ]
  },

  // ========== BRONTË SISTERS (additional) ==========
  {
    "titulo": "Agnes Grey",
    "subtitulo": "Agnes Grey",
    "autor": "Anne Brontë",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "767",
    "ano": 1847,
    "paginas": 256,
    "sinopse": "Baseado nas experiências da autora como governanta, Agnes Grey retrata a solidão e humilhação de mulheres educadas forçadas a trabalhar em lares aristocráticos.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/767/pg767.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Agnes-Grey_767" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/767.epub3.images" }
    ]
  },

  // ========== THOMAS HARDY ==========
  {
    "titulo": "Far from the Madding Crowd",
    "subtitulo": "Longe da Multidão",
    "autor": "Thomas Hardy",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2976",
    "ano": 1874,
    "paginas": 448,
    "sinopse": "Bathsheba Everdene, fazendeira independente, atrai três pretendentes muito diferentes: o pastor Gabriel, o rico fazendeiro Boldwood e o sedutor soldado Troy.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2976/pg2976.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Far-from-the-Madding-Crowd_2976" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2976.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/2976.pdf" }
    ]
  },
  {
    "titulo": "A Pair of Blue Eyes",
    "subtitulo": "Um Par de Olhos Azuis",
    "autor": "Thomas Hardy",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "548",
    "ano": 1873,
    "paginas": 384,
    "sinopse": "Elfride Swancourt, filha de um pároco cornuallês, divide-se entre dois amores: o arquiteto Stephen Smith e o aristocrata Henry Knight.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/548/pg548.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/A-Pair-of-Blue-Eyes_548" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/548.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/548.pdf" }
    ]
  },
  {
    "titulo": "Under the Greenwood Tree",
    "subtitulo": "Sob a Árvore Verde",
    "autor": "Thomas Hardy",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "480",
    "ano": 1872,
    "paginas": 256,
    "sinopse": "Romance pastoral sobre o coro da igreja de Mellstock e o amor entre a professora Fancy Day e o jovem transeunte Dick Dewy.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/480/pg480.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Under-the-Greenwood-Tree_480" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/480.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/480.pdf" }
    ]
  },

  // ========== GEORGE ELIOT ==========
  {
    "titulo": "Adam Bede",
    "subtitulo": "Adam Bede",
    "autor": "George Eliot",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2337",
    "ano": 1859,
    "paginas": 592,
    "sinopse": "No interior da Inglaterra, o carpinteiro Adam Bede ama a bela Hetty Sorrel, cuja vaidade leva a tragédia, enquanto a piedosa Dinah Morris oferece redenção.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2337/pg2337.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Adam-Bede_2337" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2337.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/2337.pdf" }
    ]
  },
  {
    "titulo": "The Mill on the Floss",
    "subtitulo": "O Moinho à Beira do Floss",
    "autor": "George Eliot",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "6688",
    "ano": 1860,
    "paginas": 592,
    "sinopse": "Maggie Tulliver luta entre o dever familiar e seus desejos intelectuais e emocionais, em um romance que explora a condição da mulher vitoriana.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/6688/pg6688.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/The-Mill-on-the-Floss_6688" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/6688.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/6688.pdf" }
    ]
  },
  {
    "titulo": "Silas Marner",
    "subtitulo": "Silas Marner",
    "autor": "George Eliot",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "4994",
    "ano": 1861,
    "paginas": 224,
    "sinopse": "O tecelão solitário Silas Marner encontra redenção ao adotar a órfã Eppie, cujo amor transforma sua vida avarenta em uma de significado e comunidade.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/4994/pg4994.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Silas-Marner_4994" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/4994.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/4994.pdf" }
    ]
  },

  // ========== WILKIE COLLINS ==========
  {
    "titulo": "The Woman in White",
    "subtitulo": "A Mulher de Branco",
    "autor": "Wilkie Collins",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2001",
    "ano": 1859,
    "paginas": 672,
    "sinopse": "Walter Hartright encontra uma misteriosa mulher de branco e se envolve em uma conspiração envolvendo identidades trocadas, asilos e heranças roubadas.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/583/pg583.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/The-Woman-in-White_2001" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2001.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/2001.pdf" }
    ]
  },
  {
    "titulo": "Armadale",
    "subtitulo": "Armadale",
    "autor": "Wilkie Collins",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "196",
    "ano": 1866,
    "paginas": 864,
    "sinopse": "Quatro homens chamados Allan Armadale estão ligados por um segredo de família que abrange gerações, em um romance de identidades, sonhos premonitórios e destino.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/1895/pg1895.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Armadale_196" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/196.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/196.pdf" }
    ]
  },
  {
    "titulo": "The Moonstone",
    "subtitulo": "A Pedra da Lua",
    "autor": "Wilkie Collins",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "1586",
    "ano": 1868,
    "paginas": 560,
    "sinopse": "Considerado o primeiro romance policial inglês, o diamante Moonstone é roubado durante uma festa, e múltiplos narradores revelam a verdade.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/1586/pg1586.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/The-Moonstone_1586" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/1586.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/1586.pdf" }
    ]
  },

  // ========== ELIZABETH GASKELL ==========
  {
    "titulo": "North and South",
    "subtitulo": "Norte e Sul",
    "autor": "Elizabeth Gaskell",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2159",
    "ano": 1854,
    "paginas": 480,
    "sinopse": "Margaret Hale, sulina transplantada para o industrial norte, choca-se com o fabricante John Thornton, em um romance que contrasta classes, gêneros e regiões.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2159/pg2159.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/North-and-South_2159" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2159.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/2159.pdf" }
    ]
  },
  {
    "titulo": "Wives and Daughters",
    "subtitulo": "Esposas e Filhas",
    "autor": "Elizabeth Gaskell",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "3137",
    "ano": 1864,
    "paginas": 768,
    "sinopse": "Molly Gibson cresce sob a tutela da madrasta e da meia-irmã Cynthia, navegando ciúmes, segredos familiares e o primeiro amor em uma sociedade provinciana.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/3137/pg3137.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Wives-and-Daughters_3137" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/3137.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/3137.pdf" }
    ]
  },

  // ========== NATHANIEL HAWTHORNE ==========
  {
    "titulo": "The Scarlet Letter",
    "subtitulo": "A Letra Escarlate",
    "autor": "Nathaniel Hawthorne",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "25344",
    "ano": 1850,
    "paginas": 352,
    "sinopse": "Na Puritana Boston do século XVII, Hester Prynne usa a letra 'A' por adultério, enfrentando o julgamento social enquanto protege a identidade do pai de sua filha.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/25344/pg25344.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/The-Scarlet-Letter_25344" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/25344.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/25344.pdf" }
    ]
  },

  // ========== ALEXANDRE DUMAS (fils) ==========
  {
    "titulo": "The Lady of the Camellias",
    "subtitulo": "A Dama das Camélias",
    "autor": "Alexandre Dumas fils",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2383",
    "ano": 1848,
    "paginas": 320,
    "sinopse": "Marguerite Gautier, cortesã parisiense, encontra o verdadeiro amor em Armand Duval, mas o peso da sociedade e a tuberculose condenam seu romance.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2383/pg2383.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/The-Lady-of-the-Camellias_2383" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2383.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/2383.pdf" }
    ]
  },

  // ========== LADY AUDLEY'S SECRET (MARY ELIZABETH BRADDON) ==========
  {
    "titulo": "Lady Audley's Secret",
    "subtitulo": "O Segredo de Lady Audley",
    "autor": "Mary Elizabeth Braddon",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "4646",
    "ano": 1862,
    "paginas": 544,
    "sinopse": "A bela e jovem Lady Audley esconde um passado sombrio: bigamia, abandono de filho e possível assassinato, em um dos primeiros 'sensation novels' vitorianos.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/4646/pg4646.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/GITenberg/Lady-Audleys-Secret_4646" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/4646.epub3.images" },
      { "formato": "pdf", "url": "https://www.gutenberg.org/ebooks/4646.pdf" }
    ]
  }
];

module.exports = { romanceClassics };