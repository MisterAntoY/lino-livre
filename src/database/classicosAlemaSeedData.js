/**
 * Clássicos Alemães Canónicos — Goethe, Schiller, Kafka, Nietzsche, Heine, Hoffmann e Kant
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (regra AGENTS.md).
 * Pesquisa via GITenberg (organização do Project Gutenberg no GitHub) e verificação ao vivo
 * em 11/10/2026: páginas, capas e ficheiros epub do Project Gutenberg testados (HTTP 200).
 * Apenas ORIGINAIS EM ALEMÃO foram incluídos (traduções inglesas/finesas foram excluídas).
 * Os repositórios GITenberg correspondentes espelham cada obra por ID (ex.: GITenberg/Faust--Der-Trag-die-erster-Teil_2229).
 */

const classicosAlema = [
  // ==================== JOHANN WOLFGANG VON GOETHE (1749–1832) ====================
  {
    "titulo": "Faust — Der Tragödie erster Teil",
    "subtitulo": "Faust, parte 1 (PG 2229 / GITenberg)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2229",
    "ano": 1808,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Primeira parte da tragédia de Goethe (1749–1832): o pacto de Fausto com Mefistófeles em busca do conhecimento absoluto — obra central da literatura alemã e do romantismo europeu, integralmente no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2229/pg2229.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/2229" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2229.epub3.images" }
    ]
  },
  {
    "titulo": "Faust — Der Tragödie zweiter Teil",
    "subtitulo": "Faust, parte 2 (PG 2230 / GITenberg)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2230",
    "ano": 1832,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Segunda e última parte do Fausto, publicada postumamente em 1832: a jornada de Fausto pelo poder imperial e pelo mundo clássico, culminando na salvação pela graça — cume da obra goethiana, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2230/pg2230.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/2230" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2230.epub3.images" }
    ]
  },
  {
    "titulo": "Die Leiden des jungen Werther — Band 1",
    "subtitulo": "Os sofrimentos do jovem Werther, vol. 1 (PG 2407)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2407",
    "ano": 1774,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Primeiro volume do epistolário que desencadeou a febre do Sturm und Drang na Europa: o jovem Werther narra paixão infeliz por Lote. O romance que fez de Goethe famoso em toda a Alemanha, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2407/pg2407.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/2407" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2407.epub3.images" }
    ]
  },
  {
    "titulo": "Die Leiden des jungen Werther — Band 2",
    "subtitulo": "Os sofrimentos do jovem Werther, vol. 2 (PG 2408)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2408",
    "ano": 1774,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Segundo volume do Werther de Goethe: aprofundamento do drama amoroso que marcou gerações de leitores românticos e deu origem ao fenómeno europeu do 'wertherismo'.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2408/pg2408.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/2408" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2408.epub3.images" }
    ]
  },
  {
    "titulo": "Iphigenie auf Tauris",
    "subtitulo": "Ifigênia em Táuride (PG 2054)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2054",
    "ano": 1787,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Drama em verso de Goethe sobre o mito de Ifigênia, sacerdotisa em Táuride que rompe o ciclo de vingança da casa de Atreus através do perdão — obra máxima do classicismo de Weimar, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2054/pg2054.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/2054" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2054.epub3.images" }
    ]
  },
  {
    "titulo": "Reineke Fuchs",
    "subtitulo": "A raposa Reineke, epopeia em verso (PG 2228)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "2228",
    "ano": 1794,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Epopeia satírica em hexâmetros da raposa Reineke, baseada na tradição medieval do Reinhart Fuchs — sátira política e social de Goethe à corte e à astúcia humana, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2228/pg2228.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/2228" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/2228.epub3.images" }
    ]
  },
  {
    "titulo": "Torquato Tasso",
    "subtitulo": "Drama em cinco atos (PG 13328)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "13328",
    "ano": 1790,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Drama de Goethe sobre o poeta Tasso na corte de Ferrara: o conflito entre o génio criador e o poder político, reflexo da própria tensão de Goethe entre arte e vida cortesã, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/13328/pg13328.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/13328" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/13328.epub3.images" }
    ]
  },
  {
    "titulo": "Römische Elegien",
    "subtitulo": "Elegias romanas (PG 5325)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "5325",
    "ano": 1795,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Ciclo de vinte e quatro elegias eróticas e meditativas compostas em Roma, celebrando amor, arte e a Antiguidade clássica em métrica elegíaca — das mais pessoais composições de Goethe, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/5325/pg5325.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/5325" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/5325.epub3.images" }
    ]
  },
  {
    "titulo": "Erotica Romana",
    "subtitulo": "Elegias romanas de 1795 (PG 7889)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "7889",
    "ano": 1795,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Ciclo de elegias de Goethe dedicadas à mulher amada em Roma, entrelaçando erótica, mitologia e filosofia da arte — obra que escandalizou a corte de Weimar e permanece um clássico da lírica alemã.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/7889/pg7889.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/7889" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/7889.epub3.images" }
    ]
  },

  // ==================== FRIEDRICH SCHILLER (1759–1805) ====================
  {
    "titulo": "Wallensteins Lager",
    "subtitulo": "O acampamento de Wallenstein (PG 6518)",
    "autor": "Friedrich Schiller",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "6518",
    "ano": 1798,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Abertura da trilogia de Wallenstein de Schiller: no acampamento imperial, o exército e a política preparam a rebelião do general Wallenstein contra o imperador — teatro histórico alemão em verso, no original.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/6518/pg6518.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/6518" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/6518.epub3.images" }
    ]
  },
  {
    "titulo": "Einige Gedichte",
    "subtitulo": "Alguns poemas de Friedrich Schiller (PG 6649)",
    "autor": "Friedrich Schiller",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "6649",
    "ano": 1803,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Seleção de poesias de Schiller no original alemão — incluindo a lírica que alimentou compositores de Schubert a Brahms — apresentada na edição do Project Gutenberg com o texto integral em alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/6649/pg6649.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/6649" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/6649.epub3.images" }
    ]
  },

  // ==================== FRANZ KAFKA (1883–1924) ====================
  {
    "titulo": "Die Verwandlung",
    "subtitulo": "A metamorfose (PG 22367 / GITenberg)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "22367",
    "ano": 1915,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Gregor Samsa acorda transformado num inseto enorme — a narrativa mais célebre de Kafka e um dos textos fundadores da modernidade literária, integralmente no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/22367/pg22367.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/22367" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/22367.epub3.images" }
    ]
  },
  {
    "titulo": "Der Prozess — Roman",
    "subtitulo": "O processo (PG 69327 / GITenberg)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "69327",
    "ano": 1925,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Josef K. é preso um manhã sem saber a culpa que lhe imputam — romance publicado postumamente pela vontade de Kafka, alegoria máxima da burocracia e da culpa, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/69327/pg69327.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/69327" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/69327.epub3.images" }
    ]
  },
  {
    "titulo": "Betrachtung",
    "subtitulo": "Meditações — prosas breves (PG 23532)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "23532",
    "ano": 1913,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Ciclo de dezoito prosas curtíssimas com que Kafka estreou como autor: fragmentos de sonho, ironia e estranheza que definem a sua prosa — integralmente em alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/23532/pg23532.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/23532" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/23532.epub3.images" }
    ]
  },
  {
    "titulo": "Ein Hungerkünstler",
    "subtitulo": "Um artista da fome (PG 30655)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "30655",
    "ano": 1922,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Último conjunto de contos publicado em vida por Kafka, com a narrativa-título do artista da fome que jejua em feiras — alegoria da arte e do sacrifício no século XX, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/30655/pg30655.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/30655" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/30655.epub3.images" }
    ]
  },
  {
    "titulo": "In der Strafkolonie",
    "subtitulo": "Na colónia penal (PG 25791)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "25791",
    "ano": 1919,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Narração kafkiana de uma execução numa máquina que inscreve a sentença na pele do condenado — reflexão sobre justiça, poder e obediência escrita em alemão por Kafka em 1914.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/25791/pg25791.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/25791" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/25791.epub3.images" }
    ]
  },
  {
    "titulo": "Ein Landarzt — Kleine Erzählungen",
    "subtitulo": "Um médico de campo — contos breves (PG 21989)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "21989",
    "ano": 1919,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Coletânea de dez contos entre os mais extraordinários de Kafka, incluindo a 'Colónia Penal' e 'Um médico de campo' — prosa onírica e angustiante no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/21989/pg21989.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/21989" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/21989.epub3.images" }
    ]
  },
  {
    "titulo": "Das Urteil — Eine Geschichte",
    "subtitulo": "A sentença (PG 21593)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "21593",
    "ano": 1913,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Novela de estreia madura de Kafka, escrita numa única sessão noturna: a sentença que um pai profere contra o filho condensa o drama da autoridade paterna kafkiano, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/21593/pg21593.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/21593" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/21593.epub3.images" }
    ]
  },
  {
    "titulo": "Der Heizer — Ein Fragment",
    "subtitulo": "O foguista — fragmento (PG 16304)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "16304",
    "ano": 1913,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Primeiro capítulo do romance inacabado 'A Desaparecida': Karl Rossmann denuncia o tratamento infligido a um foguista no navio — obra onde Kafka descobriu o seu mundo narrativo, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/16304/pg16304.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/16304" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/16304.epub3.images" }
    ]
  },
  {
    "titulo": "Grosser Lärm",
    "subtitulo": "Grande barulho — oito prosas (PG 30570)",
    "autor": "Franz Kafka",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "30570",
    "ano": 1923,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Oito prosas breves de 1923, das últimas escritas por Kafka, incluindo a peça 'Grande barulho' — o autor no limiar da parábola e do lirismo em prosa, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/30570/pg30570.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/30570" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/30570.epub3.images" }
    ]
  },

  // ==================== FRIEDRICH NIETZSCHE (1844–1900) ====================
  {
    "titulo": "Also sprach Zarathustra — Ein Buch für Alle und Keinen",
    "subtitulo": "Assim falou Zaratustra (PG 7205 / GITenberg)",
    "autor": "Friedrich Nietzsche",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "7205",
    "ano": 1883,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Obra central de Nietzsche em prosa lírica: Zaratustra desce da montanha para anunciar o super-homem e o eterno retorno — filosofia escrita como epopeia, integralmente no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/7205/pg7205.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/7205" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/7205.epub3.images" }
    ]
  },
  {
    "titulo": "Der Wille zur Macht — Eine Auslegung alles Geschehens",
    "subtitulo": "A vontade de poder (PG 60360)",
    "autor": "Friedrich Nietzsche",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "60360",
    "ano": 1901,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Compilação póstuma, organizada pela irmã do filósofo, dos cadernos nietzscheanos sob o tema da vontade de poder — documento central (e controverso) da receção do pensamento de Nietzsche, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/60360/pg60360.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/60360" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/60360.epub3.images" }
    ]
  },
  {
    "titulo": "Friedrich Nietzsche in seinen Werken",
    "subtitulo": "Estudo de Rudolf Steiner (PG 50525)",
    "autor": "Rudolf Steiner",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "50525",
    "ano": 1895,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Estudo filosófico de Rudolf Steiner sobre a obra de Nietzsche, publicado quando o filósofo ainda estava vivo — leitura alemã da evolução do seu pensamento, da música ao niilismo.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/50525/pg50525.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/50525" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/50525.epub3.images" }
    ]
  },
  {
    "titulo": "Friedrich Nietzsche — Ein Kämpfer gegen seine Zeit",
    "subtitulo": "Estudo de Rudolf Steiner (PG 53592)",
    "autor": "Rudolf Steiner",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "53592",
    "ano": 1898,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Segundo estudo de Steiner sobre Nietzsche: o filósofo como combatente da cultura do seu tempo — análise alemã do diagnóstico nietzscheano da modernidade em vésperas do colapso do autor.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/53592/pg53592.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/53592" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/53592.epub3.images" }
    ]
  },

  // ==================== IMMANUEL KANT (1724–1804) — TEXTOS EM ALEMÃO ====================
  {
    "titulo": "Kritik der Urtheilskraft",
    "subtitulo": "Crítica da faculdade do juízo — gesammelte Schriften (PG 55925)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "55925",
    "ano": 1790,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Terceira crítica de Kant na edição alemã das gesammelte Schriften: juízo estético (belo e sublime) e juízo teleológico — a ponte entre os sistemas da razão pura e da razão prática, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/55925/pg55925.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/55925" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/55925.epub3.images" }
    ]
  },
  {
    "titulo": "Kritik der praktischen Vernunft",
    "subtitulo": "Crítica da razão prática — gesammelte Schriften (PG 49543)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "49543",
    "ano": 1788,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Segunda crítica de Kant na edição alemã das gesammelte Schriften: o imperativo categórico, a liberdade e o postulado da imortalidade da alma — texto fundador da ética deontológica, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/49543/pg49543.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/49543" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/49543.epub3.images" }
    ]
  },
  {
    "titulo": "Beantwortung der Frage: Was ist Aufklärung?",
    "subtitulo": "Resposta à pergunta: o que é o esclarecimento? (PG 30821)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "30821",
    "ano": 1784,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O ensaio de 1784 em que Kant define a Aufklärung como 'saída da menoridade culpada' — 'Sapere aude!' — texto fundador do iluminismo alemão, integralmente no original.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/30821/pg30821.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/30821" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/30821.epub3.images" }
    ]
  },
  {
    "titulo": "Was heißt: sich im Denken orientieren?",
    "subtitulo": "O que significa orientar-se no pensamento? (PG 38754)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "38754",
    "ano": 1786,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Escrito polémico de Kant sobre a liberdade de pensar e o critério da orientação racional — reflexão central sobre autonomia do juízo no debate pós-iluminista, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/38754/pg38754.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/38754" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/38754.epub3.images" }
    ]
  },
  {
    "titulo": "Beobachtungen über das Gefühl des Schönen und Erhabenen",
    "subtitulo": "Observações sobre o sentimento do belo e do sublime (PG 41197)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "41197",
    "ano": 1764,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Primeira obra estética de Kant (1764): análise do belo e do sublime com notas sobre carácter nacional — o jovem Kant a aproximar-se do problema que a terceira crítica resolveria, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/41197/pg41197.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/41197" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/41197.epub3.images" }
    ]
  },
  {
    "titulo": "Träume eines Geistersehers",
    "subtitulo": "Sonhos de um vidente de espíritos (PG 36076)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "36076",
    "ano": 1766,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Sátira crítica de Kant contra o misticismo de Swedenborg, com subtítulo 'elucidados por sonhos da metafísica' — obra que abriu caminho à Crítica da razão pura, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/36076/pg36076.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/36076" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/36076.epub3.images" }
    ]
  },
  {
    "titulo": "Die Religion innerhalb der Grenzen der bloßen Vernunft",
    "subtitulo": "A religião dentro dos limites da simples razão — ed. 1793 (PG 56182)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "56182",
    "ano": 1793,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Obra fundamental da filosofia religiosa de Kant, na edição alemã de 1793: a moral interior como núcleo de toda a religião, contra o culto externo e o fanatismo — no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/56182/pg56182.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/56182" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/56182.epub3.images" }
    ]
  },
  {
    "titulo": "Über die Vulkane im Monde",
    "subtitulo": "Sobre os vulcões na lua (PG 38755)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "38755",
    "ano": 1785,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Breve escrito de cosmologia kantiana sobre a hipótese dos vulcões lunares — o filósofo a dialogar com a astronomia da sua época, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/38755/pg38755.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/38755" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/38755.epub3.images" }
    ]
  },
  {
    "titulo": "Von der Macht des Gemüts",
    "subtitulo": "Do poder do ânimo sobre as paixões doentias (PG 38295)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "38295",
    "ano": 1796,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Último escrito publicado em vida por Kant sobre o domínio voluntário das afecções patológicas — ética da ataraxia aplicada, publicado postumamente em 1797, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/38295/pg38295.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/38295" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/38295.epub3.images" }
    ]
  },

  // ==================== E. T. A. HOFFMANN (1776–1822) ====================
  {
    "titulo": "Der Goldene Topf — Ein Märchen aus der neuen Zeit",
    "subtitulo": "O vaso de ouro (PG 17362)",
    "autor": "E. T. A. Hoffmann",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "17362",
    "ano": 1814,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Márchen do romantismo alemão: o estudante Anselmus entre a realidade de Dresde e o mundo ideal da serpente de esmeralda — a mais célebre narrativa de Hoffmann, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/17362/pg17362.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/17362" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/17362.epub3.images" }
    ]
  },
  {
    "titulo": "Lebensansichten des Katers Murr",
    "subtitulo": "As opiniões do gato Murr (PG 38780)",
    "autor": "E. T. A. Hoffmann",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "38780",
    "ano": 1819,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Romance satírico de Hoffmann: o gato Murr escreve as suas memórias em papel roubado ao mestre Kapellmeister Johannes Kreisler — paródia romântica da autobiografia, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/38780/pg38780.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/38780" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/38780.epub3.images" }
    ]
  },

  // ==================== HEINRICH HEINE (1797–1856) ====================
  {
    "titulo": "Die Harzreise",
    "subtitulo": "A viagem à montanha Harz (PG 24249)",
    "autor": "Heinrich Heine",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "24249",
    "ano": 1826,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Crónica de viagem poética de Heine pelas montanhas Harz, entre prosa irónica, canções e meditação política — obra que renovou a prosa alemã, no original alemão.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/24249/pg24249.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/24249" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/24249.epub3.images" }
    ]
  },
  {
    "titulo": "Das Lied vom blöden Ritter",
    "subtitulo": "A canção do cavaleiro estúpido (PG 39792)",
    "autor": "Heinrich Heine",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "39792",
    "ano": 1827,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Balada satírica de Heine sobre um cavaleiro que se debate entre ascetismo e tentação — poesia narrativa alemã no seu tom mais mordaz e lúdico, no original.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/39792/pg39792.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/39792" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/39792.epub3.images" }
    ]
  }
];

module.exports = { classicosAlema };
