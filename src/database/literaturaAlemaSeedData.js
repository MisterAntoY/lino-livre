/**
 * Acervo Curado de Literatura e Cultura Alemã (Project Gutenberg / GITenberg + GitHub)
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (regra AGENTS.md).
 * Verificado em 11/10/2026: páginas e capas do Project Gutenberg testadas (HTTP 200).
 * Nota: o GitHub tem pouca literatura alemã com tração — o GITenberg é o acervo sistemático,
 * mas organiza 1 ficheiro por obra com estrelas mínimas; o corpus de Schiller vem do tiny_schiller.
 */

const literaturaAlema = [
  {
    "titulo": "tiny_schiller — Obras Dramáticas de Friedrich Schiller",
    "subtitulo": "11 obras em alemão (CC0, ~2 MB)",
    "autor": "Friedrich Schiller (corpus GerDraCor)",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "github-literatura-de",
    "fonteIdExterno": "tiny-schiller",
    "ano": 2026,
    "paginas": 0,
    "idioma": "de",
    "licenca": "cc0",
    "sinopse": "Análogo alemão do tiny_shakespeare: onze obras dramáticas de Friedrich Schiller (1759–1805) em alemão, limpas e tokenizadas para estudo e para modelos de linguagem de escala didática. Corpus de ~2 MB com licença CC0, proveniente da exportação GerDraCor do DraCor — a maior coletânea de Schiller disponível como conjunto de dados aberto.",
    "capaUrl": "/capas/tech/tech_543.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/schutera/tiny_schiller" },
      { "formato": "html", "url": "https://huggingface.co/datasets/mrkschtr/tiny_schiller" }
    ]
  },
  {
    "titulo": "Deutscher Mondschein",
    "subtitulo": "Novela de Wilhelm Raabe",
    "autor": "Wilhelm Raabe",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "32008",
    "ano": 1863,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Novela de Wilhelm Raabe (1831–1911), um dos maiores prosadores do realismo alemão, ambientada na guerra franco-prussiana. Uma das poucas obras de ficção alemã disponíveis em domínio público no Project Gutenberg em alemão original.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/32008/pg32008.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/32008" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/32008.epub3.images" }
    ]
  },
  {
    "titulo": "Deutsche Literaturgeschichte in einer Stunde",
    "subtitulo": "História da Literatura Alemã numa Hora",
    "autor": "Klabund",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "22517",
    "ano": 1925,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Panorama sintético e irreverente da literatura alemã, de Minnesänger à época contemporânea, escrito por Klabund — guia de leitura da tradição alemã em texto breve e original.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/22517/pg22517.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/22517" }
    ]
  },
  {
    "titulo": "An Deutschlands Jugend",
    "subtitulo": "À Juventude da Alemanha",
    "autor": "Walther Rathenau",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "23396",
    "ano": 1918,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Ensaio de Walther Rathenau, industrial, filósofo e ministro dos Negócios Estrangeiros assassinado em 1922, dirigido à juventude alemã no fim da Primeira Guerra Mundial — reflexão sobre técnica, cultura e responsabilidade.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/23396/pg23396.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/23396" }
    ]
  },
  {
    "titulo": "Deutsche Landschaften",
    "subtitulo": "Paisagens e Imagens da Alemanha",
    "autor": "Albrecht Dürer (edição)",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "51223",
    "ano": 1900,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Compilação de paisagens, desenhos e imagens da tradição alemã, atribuída à edição de Albrecht Dürer — documento do imaginário visual e literário da Alemanha.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/51223/pg51223.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/51223" }
    ]
  },
  {
    "titulo": "Kurzgefaßte Deutsche Stilistik",
    "subtitulo": "Manual de Estilística Alemã",
    "autor": "Otto Lyon",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "60306",
    "ano": 1900,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Manual escolar de estilística da língua alemã de Otto Lyon: periodização, figuras retóricas, sintaxe estilística e exemplos clássicos — fonte histórica para o estudo da gramática alemã.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/60306/pg60306.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/60306" }
    ]
  },
  {
    "titulo": "Die Deutschen Familiennamen",
    "subtitulo": "Apelidos Alemães — História e Geografia",
    "autor": "Albert Heintze",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "58804",
    "ano": 1900,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Estudo histórico, geográfico e linguístico dos apelidos alemães: origens profissionais, toponímicas e patronímicas — obra de referência da onomástica germânica.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/58804/pg58804.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/58804" }
    ]
  },
  {
    "titulo": "Deutschlands europäische Sendung",
    "subtitulo": "A Missão Europeia da Alemanha",
    "autor": "Friedrich Lienhard",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "58851",
    "ano": 1910,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Ensaio de Friedrich Lienhard sobre o papel cultural da Alemanha na Europa — debate intelectual do início do século XX sobre identidade, cultura e Europa.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/58851/pg58851.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/58851" }
    ]
  },
  {
    "titulo": "Kleine deutsche Sprachlehre",
    "subtitulo": "Pequena Gramática da Língua Alemã",
    "autor": "Hermann Böhm e Walter Steinert",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "44642",
    "ano": 1900,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Gramática escolar concisa da língua alemã: morfologia, sintase e ortografia, com exercícios — útil para estudantes de alemão e para quem estuda a estrutura histórica da língua.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/44642/pg44642.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/44642" }
    ]
  },
  {
    "titulo": "Allgemeiner deutscher Bier-Comment",
    "subtitulo": "Comentário Geral sobre a Cerveja Alemã",
    "autor": "A. Gerlach",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "55699",
    "ano": 1890,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Curioso documento do costume académico alemão: as normas e convenções da bebedeira estudantil corporativa, com etimologias e brinde — fonte etnográfica da vida universitária alemã do século XIX.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/55699/pg55699.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/55699" }
    ]
  },
  {
    "titulo": "Deutsche Literatur-Bestenlisten",
    "subtitulo": "Listas de mais vendidos em JSON",
    "autor": "tifa365",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-literatura-de",
    "fonteIdExterno": "buecher-bestenlisten",
    "ano": 2026,
    "paginas": 0,
    "idioma": "de",
    "licenca": "outro",
    "sinopse": "Listas de livros mais vendidos da Alemanha estruturadas como dados JSON prontos a usar: recurso raro para análise e descoberta da literatura contemporânea em alemão.",
    "capaUrl": "/capas/tech/tech_544.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/tifa365/buecher-bestenlisten" }
    ]
  }
];

module.exports = { literaturaAlema };
