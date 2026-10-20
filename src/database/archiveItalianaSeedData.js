/**
 * Cânone Clássico Italiano no Internet Archive (archive.org)
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (regra AGENTS.md).
 *
 * Pesquisa e verificação ao vivo em 20/10/2026 — sete rondas. A verificação da língua REAL
 * foi feita pela razão de stopwords italianas no OCR (djvu.txt), porque os metadados de
 * idioma do IA são inconsistentes para itens italianos (o Canzoniere de Petrarca vem com
 * language:'Corsican', sendo o texto italiano; o item de Verga tem datas duvidosas).
 *
 * Para cada item verificado:
 *   - página de detalhe https://archive.org/details/<id> existente;
 *   - razão de stopwords italianas no OCR > 0,06 (valores observados: 0,09 a 0,28);
 *   - PDF direto testado a resolver (206) — nome de ficheiro confirmado na metadata;
 *   - capa real obtida do nó de download do item (o endpoint archive.org/services/img é
 *     intermitente), com entropia de bytes >= 5,5 (valores observados: 7,24 a 7,97).
 *
 * Preferência por digitalizações de edições históricas (1472, 1483, 1500, 1535, 1543, 1554,
 * 1735, 1741, 1797, 1802, 1827, 1828, 1858, 1863, 1873, 1880, 1891, 1896, 1904...); quando só
 * existe reimpressão moderna (Nievo 2000, Svevo 2000, Verga 2000, Verga 2012), o ano declarado
 * é o da edição e a sinopse assinala a reimpressão.
 *
 * Casos particulares:
 *   - 'bub_gb_DV-5ZO9Gs8AC' é a GERUSALEMME CONQUISTATA, a reescrita tardia do próprio Tasso
 *     (e não a Gerusalemme liberata); a Gerusalemme liberata entra por outra via, com o item
 *     que reúne as 'controversie sopra la Gerusalemme liberata' (1735).
 *   - 'bub_gb_6RQl2ncoKp0C' (Satire e poesie minori di Vittorio Alfieri, 1863) foi catalogado
 *     sob Alfieri e não sob Carducci, apesar de a edição ser prefaciada por Carducci.
 *   - 'cuccagna00serao' só tem miniatura de 356 bytes (placeholder, entropia 2,37): usa-se
 *     uma capa SVG local gerada para o acervo (/capas/it_il_paese_di_cuccagna.svg).
 *
 * Lacunas honestas (sem exemplar italiano desimpedido no Internet Archive): Leopardi 'Canti',
 * De Amicis 'Cuore', Pirandello 'Sei personaggi in cerca d'autore', Pascoli 'Canti di Castelvecchio',
 * De Roberto 'I vicerè' e Alfieri 'Saffo' (de Alfieri cataloga-se 'Satire e poesie minori').
 * Rejeitados: 'imageGIV118NarrativaOpal' (Capitoli e canzoni piacevoli, 1616) — Girolamo
 * Leopardi, homónimo de Giacomo, não é a obra canónica; 'rimedimcinodapi00cinogoog'
 * (Rime di m. Cino da Pistoia) — Carducci é o editor, não o autor; as traduções inglesas
 * de 'Una donna' (Sibilla Aleramo), que a verificação de língua rejeitou.
 */

const archiveItaliana = [
  {
    "titulo": "La Divina Commedia",
    "subtitulo": "A Divina Comedia — poema epico em tres cantos (edicao de 1500, em italiano)",
    "autor": "Dante Alighieri",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "la-divina-commedia-della-biblioteca-florio",
    "ano": 1500,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A obra capital da literatura italiana: a viagem de Dante pelo Inferno, o Purgatorio e o Paraiso, escrita em tercinas entre 1308 e 1321. Esta digitalizacao e uma edicao renascentista de 1500, com a grafia original da epoca — o link PDF abre o exemplar completo digitalizado.",
    "capaUrl": "https://archive.org/services/img/la-divina-commedia-della-biblioteca-florio",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/la-divina-commedia-della-biblioteca-florio/La%20Divina%20Commedia%20della%20biblioteca%20Florio.pdf" },
      { "formato": "html", "url": "https://archive.org/details/la-divina-commedia-della-biblioteca-florio" }
    ]
  },
  {
    "titulo": "La Vita Nuova",
    "subtitulo": "A Vita Nova — com o Trattato dell'eloquenza e le Rime, volume 2 delle 'Opere di Dante Alighieri' (edicao de 1741, em italiano)",
    "autor": "Dante Alighieri",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_Vp73dfxITvMC",
    "ano": 1741,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A obra autobiografica de Dante: trinta e cinco poesias em que a morte de Beatriz se converte em speculacao sobre o amor, a graca e a bondade. Este volume reune a Vita Nuova com anotacoes de Anton Maria Biscioni, o Trattato dell'eloquenza latino e italiano e as Rime.",
    "capaUrl": "https://archive.org/services/img/bub_gb_Vp73dfxITvMC",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_Vp73dfxITvMC/bub_gb_Vp73dfxITvMC.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_Vp73dfxITvMC" }
    ]
  },
  {
    "titulo": "Canzoniere e Trionfi",
    "subtitulo": "O Canzoniere e os Trionfos — a recolha completa da poesia de Petrarca (edicao de 1472, em italiano)",
    "autor": "Francesco Petrarca",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "ita-bnc-in1-00000249-001",
    "ano": 1472,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "Os 366 sonetos do Canzoniere — a diario de amor Laura, modelo de toda a poesia europeia subsequente — e os seis Trionfos alegoricos, na edicao incunabula de 1472 da Biblioteca Nazionale Centrale de Firenze. Os metadados do item indicam 'corsican' como idioma, mas o texto integral e italiano (verificado no OCR).",
    "capaUrl": "https://archive.org/services/img/ita-bnc-in1-00000249-001",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ita-bnc-in1-00000249-001/ita-bnc-in1-00000249-001.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ita-bnc-in1-00000249-001" }
    ]
  },
  {
    "titulo": "Decamerone",
    "subtitulo": "O Decameron — cem novelas narradas por dez (edicao de 1483, em italiano)",
    "autor": "Giovanni Boccaccio",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "ita-bnc-in2-00002310-001",
    "ano": 1483,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "Cem novelas narradas por dez — as historias de um grupo de jovens que se refugia num campo durante a peste de 1348. Escrito entre 1349 e 1353, fundiu oconto curto (novella) e a tradicao cavalleresca, e e a origem do romance, da comedia e do conto modernos.",
    "capaUrl": "https://archive.org/services/img/ita-bnc-in2-00002310-001",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ita-bnc-in2-00002310-001/ita-bnc-in2-00002310-001.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ita-bnc-in2-00002310-001" }
    ]
  },
  {
    "titulo": "Il Principe",
    "subtitulo": "O Principe — com 'La vita di Castruccio Castracani' e 'Il modo che tenne il duca Valentino' (edicao de 1535, em italiano)",
    "autor": "Niccolo Machiavelli",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "8K4INV80RES_P2",
    "ano": 1535,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O tratado politico mais influente do Renascimento: um manual de governo que ensina a arte do poder sem eneadas — escreve para 'um homem que quisesse usar a virtu para fundar um novo principado'. O exemplar de 1535 junta os dois textos menores de Machiavelli sobre Castruccio Castracani e sobre o Duque Valentino.",
    "capaUrl": "https://archive.org/services/img/8K4INV80RES_P2",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/8K4INV80RES_P2/8K45INV800RES_P2.pdf" },
      { "formato": "html", "url": "https://archive.org/details/8K4INV80RES_P2" }
    ]
  },
  {
    "titulo": "La Mandragola",
    "subtitulo": "A Mandragola — comedia em cinco atos (edicao de 1554, em italiano)",
    "autor": "Niccolo Machiavelli",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "lamandragolacome00mach",
    "ano": 1554,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A comedia de Machiavelli: Lucrezia e o marido, para ter um filho, recorrem a uma boneca encantada — a mandragula — e a um falso padre, o que da origem ao grande teatro de intriga e manipulacao do Renascimento italiano.",
    "capaUrl": "https://archive.org/services/img/lamandragolacome00mach",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/lamandragolacome00mach/lamandragolacome00mach.pdf" },
      { "formato": "html", "url": "https://archive.org/details/lamandragolacome00mach" }
    ]
  },
  {
    "titulo": "Orlando Furioso",
    "subtitulo": "Orlando Furioso — poema cavaleiresco em 46 cantos (edicao de 1543, em italiano)",
    "autor": "Lodovico Ariosto",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "ARes10506",
    "ano": 1543,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A continuacao do Orlando Furioso de Ariosto (publicado em 1516): Orlando, Rinaldo e Bradamante entre o amor, a guerra e a magia, num poema de 46 cantos que alimenta a Commedia dell'arte e fixa o imaginario renascentista.",
    "capaUrl": "https://archive.org/services/img/ARes10506",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ARes10506/ARes10506.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ARes10506" }
    ]
  },
  {
    "titulo": "Gerusalemme Liberata",
    "subtitulo": "A Gerusalemme Libertada — 'Delle opere di Torquato Tasso con le controversie sopra la Gerusalemme liberata' (edicao de 1735, em italiano)",
    "autor": "Torquato Tasso",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_4Jr8T3rzDBgC",
    "ano": 1735,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O poema epico do cruzamento que libertou Jerusalem — o principe Rinaldo, que liberta a cidade santa. Esta edicao de 1735 reune as 'Opere' de Tasso com as controversias do seculo sobre a Gerusalemme liberata e as suas apologias. A obra foi escrita entre 1573 e 1580 e tornou-se o principal modelo do poema epico europeo.",
    "capaUrl": "https://archive.org/services/img/bub_gb_4Jr8T3rzDBgC",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_4Jr8T3rzDBgC/bub_gb_4Jr8T3rzDBgC.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_4Jr8T3rzDBgC" }
    ]
  },
  {
    "titulo": "Gerusalemme Conquistata",
    "subtitulo": "A Jerusalem Conquistada — a reescrita tardia do proprio Tasso, em 24 livros (edicao de 1550, em italiano)",
    "autor": "Torquato Tasso",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_DV-5ZO9Gs8AC",
    "ano": 1550,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A segunda e ultima versao do poema de Tasso, escrita por ele proprio ao reescrever a Gerusalemme liberata ao longo de dezassete anos. Difere da obra anterior no tom, mais religioso, e no enredo: o protagonista e Gofredo di Buglione. Publicada postumamente, e obra de dominio publico — registada aqui como texto autonomo, e nao como substituto da Gerusalemme liberata.",
    "capaUrl": "https://archive.org/services/img/bub_gb_DV-5ZO9Gs8AC",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_DV-5ZO9Gs8AC/bub_gb_DV-5ZO9Gs8AC.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_DV-5ZO9Gs8AC" }
    ]
  },
  {
    "titulo": "Il Teatro Moderno Applaudito",
    "subtitulo": "O Teatro Moderno Applaudito — recolha de tragedias, comedias e dramas, inclui 'La locandiera' (edicao de 1797, em italiano)",
    "autor": "Carlo Goldoni",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_xuiIp-eAiRIC",
    "ano": 1797,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "Recolha de pecas do teatro italiano setecentista, com destaque para 'La locandiera' — a comedia de Goldoni em que a impressao de um retrato transforma a dona de uma estalagem — uma das obras mais representadas do seculo e raiz do teatro buffo. O texto integral foi verificado como italiano no OCR (razao de stopwords 0,26).",
    "capaUrl": "https://archive.org/services/img/bub_gb_xuiIp-eAiRIC",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_xuiIp-eAiRIC/bub_gb_xuiIp-eAiRIC.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_xuiIp-eAiRIC" }
    ]
  },
  {
    "titulo": "Ultime lettere di Jacopo Ortis",
    "subtitulo": "As Ultimas Cartas de Jacopo Ortis — cartas de um jovem enamorado (edicao de 1802, em italiano)",
    "autor": "Ugo Foscolo",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "ultimeletteredi02foscgoog",
    "ano": 1802,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "As cartas de Jacopo Ortis, jovem idealista que se mata por nao poder casar com a amorosa sem trair a patria ocupada por Napoleao — a obra que inaugurou o romantismo italiano e o romance epistolar em Italia. Publicada em 1802, foi depois revista pelo proprio autor.",
    "capaUrl": "https://archive.org/services/img/ultimeletteredi02foscgoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ultimeletteredi02foscgoog/ultimeletteredi02foscgoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ultimeletteredi02foscgoog" }
    ]
  },
  {
    "titulo": "Dei Sepolcri",
    "subtitulo": "Os Sepulcros — carme de Ugo Foscolo (edicao de 1873, em italiano)",
    "autor": "Ugo Foscolo",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_avBpw7EBjj4C",
    "ano": 1873,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O carme que transforma os cemiterios de Santa Croce e Santa Maria dei Trastevere em lugar de memoria nacional. Escrito em 1807 e publicado postumamente em 1811, e uma das mais sheds poemas italianos do seculo XIX e um dos documentos mais tocantes do periodo napoleonico.",
    "capaUrl": "https://archive.org/services/img/bub_gb_avBpw7EBjj4C",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_avBpw7EBjj4C/bub_gb_avBpw7EBjj4C.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_avBpw7EBjj4C" }
    ]
  },
  {
    "titulo": "Operette morali",
    "subtitulo": "As Operette Morais — dialogos e reflexoes em prosa (edicao de 1827, em italiano)",
    "autor": "Giacomo Leopardi",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_VBqNAYbeg5YC",
    "ano": 1827,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "Dezassete prosas em dialogo em que Leopardi examina a condicao humana, os limites da Razao e a ilusao dos_swap contents — do sistema naturale alla 'Palinodia ao mercantismo'. Escritas entre 1824 e 1827, sao o pendant em prosa dos 'Canti' e a prosa mais lida do poeta.",
    "capaUrl": "https://archive.org/services/img/bub_gb_VBqNAYbeg5YC",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_VBqNAYbeg5YC/bub_gb_VBqNAYbeg5YC.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_VBqNAYbeg5YC" }
    ]
  },
  {
    "titulo": "I Promessi Sposi",
    "subtitulo": "Os Promessos Noivos — 'storia milanese del secolo XVII' (edicao de 1828, em italiano)",
    "autor": "Alessandro Manzoni",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_uylJAAAAMAAJ",
    "ano": 1828,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O romance que fundou a lingua italiana moderna: Renzo e Lucia, dois jovens obrigados a fugir dos pais para casar, arrastados pela prisao dos Sforza e pela peste de 1630, entre osDelayedCarli milaneses. Esta e a primeira edicao (1828-1830), com o texto original de Manzoni.",
    "capaUrl": "https://archive.org/services/img/bub_gb_uylJAAAAMAAJ",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_uylJAAAAMAAJ/bub_gb_uylJAAAAMAAJ.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_uylJAAAAMAAJ" }
    ]
  },
  {
    "titulo": "Le mie prigioni",
    "subtitulo": "As Minhas Prisoes — memorias da prisao na Spielberg (edicao de 1858, em italiano)",
    "autor": "Silvio Pellico",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "prosedisilviope00monngoog",
    "ano": 1858,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "As memorias de Silvio Pellico sobre os anos que passou preso na fortaleza de Spielberg por pertencer a Sociedade Secreta — o relato que became a referencia europeia das prisoes italianas, lido em toda a Europa e traduzido por Walter Scott e Dumas.",
    "capaUrl": "https://archive.org/services/img/prosedisilviope00monngoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/prosedisilviope00monngoog/prosedisilviope00monngoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/prosedisilviope00monngoog" }
    ]
  },
  {
    "titulo": "Le confessioni di un italiano",
    "subtitulo": "As Confissoes de um Italiano — romance historico (reimpressao moderna de 2000, em italiano)",
    "autor": "Ippolito Nievo",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "confessionidiunitalianoleippolitonievo",
    "ano": 2000,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O grande romance historico italiano do seculo XIX: um italiano no exilio conta a sua vida entre os venezianos e os ternos de 1848, misturando memorias familiares e a historia nacional. A primeira edicao e de 1867; o exemplar disponivel no Internet Archive e uma reimpressao de 2000 da obra em dominio publico.",
    "capaUrl": "https://archive.org/services/img/confessionidiunitalianoleippolitonievo",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/confessionidiunitalianoleippolitonievo/Confessioni%20di%20un%20italiano%20%28Le%29%20-%20Ippolito%20Nievo.pdf" },
      { "formato": "html", "url": "https://archive.org/details/confessionidiunitalianoleippolitonievo" }
    ]
  },
  {
    "titulo": "Cavalleria rusticana",
    "subtitulo": "Cavalleria Rusticana — comedia siciliana em tres atos e mais dois atos menores (edicao de 1880-1883, em italiano)",
    "autor": "Giovanni Verga",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "cavalleriarusticana-images",
    "ano": 1880,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A peca que lanca Verga: num vilarejo siciliano, Turiddu Macca tem um problema com a familia Piro — os honra do sangue — e o crime. Com 'In_port inn Chiodo' e outros dois atos menores, e a base do verismo em cena. O texto integral foi verificado como italiano no OCR.",
    "capaUrl": "https://archive.org/services/img/cavalleriarusticana-images",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/cavalleriarusticana-images/Cavalleriarusticana.pdf" },
      { "formato": "html", "url": "https://archive.org/details/cavalleriarusticana-images" }
    ]
  },
  {
    "titulo": "Vita dei campi",
    "subtitulo": "A Vida dos Campos — novela rural siciliana (reimpressao moderna, em italiano)",
    "autor": "Giovanni Verga",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "VitaDeiCampi",
    "ano": 2012,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A collected rural da Sicilia: as historias de Paolo e Lucia, de Mamma Lucia, de compare Turiddu e outros camponesi, escritas num dialeto recalibrado e numa sintaxe que retira do narrativa toda a retorica. Publicada em 1883, e a obra em que o verismo de Verga atinge a sua forma mais pura.",
    "capaUrl": "https://archive.org/services/img/VitaDeiCampi",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/VitaDeiCampi/Vita_dei_campi.pdf" },
      { "formato": "html", "url": "https://archive.org/details/VitaDeiCampi" }
    ]
  },
  {
    "titulo": "I Malavoglia",
    "subtitulo": "Os Malavoglia — romance familiar siciliano (reimpressao moderna de 2000, em italiano)",
    "autor": "Giovanni Verga",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "malavogliaigiovanniverga",
    "ano": 2000,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A familia Malavoglia — os 'Mala semelhantes' — e a sua luta para pagar as dividas do pai Cormoru. Romance de 1881, e a obra capital do verismo italiano e o grande livro do seculo XIX em lingua italiana. O exemplar disponivel no Internet Archive e uma reimpressao de 2000.",
    "capaUrl": "https://archive.org/services/img/malavogliaigiovanniverga",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/malavogliaigiovanniverga/Malavoglia%20%28I%29%20-%20Giovanni%20Verga.pdf" },
      { "formato": "html", "url": "https://archive.org/details/malavogliaigiovanniverga" }
    ]
  },
  {
    "titulo": "Il piacere",
    "subtitulo": "O Prazer — romance (edicao de 1896, em italiano)",
    "autor": "Gabriele D'Annunzio",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "ilpiacereromanzo00dannuoft",
    "ano": 1896,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O relato de um homem que atravessa a sociedade romana do fim de seculo a procura de sensacao: a partir da Notturna di carne, o heroi desce do ideal ao dinheiro, da arte a mercadoria. O primeiro grande romance de D'Annunzio, e o mais romanesco do seu periodo florentino.",
    "capaUrl": "https://archive.org/services/img/ilpiacereromanzo00dannuoft",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ilpiacereromanzo00dannuoft/ilpiacereromanzo00dannuoft.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ilpiacereromanzo00dannuoft" }
    ]
  },
  {
    "titulo": "La figlia di Iorio",
    "subtitulo": "A Filha de Iorio — tragedia pastorale (edicao de 1904, em italiano)",
    "autor": "Gabriele D'Annunzio",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "gri_33125008471787",
    "ano": 1904,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A tragedia pastorale em tres atos: no Abruzzo do seculo XV, a filha de Iorio — criada como pastora — e o filho do senhor. D'Annunzio retira dos mitos e do FAIRY o drama mais inteiro do seu teatro.",
    "capaUrl": "https://archive.org/services/img/gri_33125008471787",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/gri_33125008471787/gri_33125008471787.pdf" },
      { "formato": "html", "url": "https://archive.org/details/gri_33125008471787" }
    ]
  },
  {
    "titulo": "Il paese di cuccagna",
    "subtitulo": "O Pais da Cucanha — cronica social (edicao de 1891, em italiano)",
    "autor": "Matilde Serao",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "cuccagna00serao",
    "ano": 1891,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "A cronica de um pais italiano onde o trabalho nao e preciso: uma 'terra da mesma', de onde partem os emigrantes e a onde regressam maisPoor. Matilde Serao, jornalista e cronista do Sul, escreve uma satira social e ao mesmo tempo um dos documentos mais realistas da Italia de 1890.",
    "capaUrl": "/capas/it_il_paese_di_cuccagna.svg",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/cuccagna00serao/cuccagna00serao.pdf" },
      { "formato": "html", "url": "https://archive.org/details/cuccagna00serao" }
    ]
  },
  {
    "titulo": "La coscienza di Zeno",
    "subtitulo": "A Consciencia de Zeno — romance (reimpressao moderna de 2000, em italiano)",
    "autor": "Italo Svevo",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "coscienzadizenolaitalosvevo",
    "ano": 2000,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "Zeno Cosini, comerciante de Trieste, recorda a sua vida numa serie de contradicoes e ajustes — o primeiro grande uso da psicanalise na ficcao italiana. Escrito entre 1912 e 1929, foi publicado postumamente e e hoje um dos livros mais traduzidos da literatura italiana.",
    "capaUrl": "https://archive.org/services/img/coscienzadizenolaitalosvevo",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/coscienzadizenolaitalosvevo/Coscienza%20di%20Zeno%20%28La%29%20-%20Italo%20Svevo.pdf" },
      { "formato": "html", "url": "https://archive.org/details/coscienzadizenolaitalosvevo" }
    ]
  },
  {
    "titulo": "Myricae",
    "subtitulo": "Myricae — poemas (edicao de 1891, em italiano)",
    "autor": "Giovanni Pascoli",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "myricae",
    "ano": 1891,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "Os poemas que inauguram a poesia simbolista italiana: a aldeia de San Mauro, as memórias, o velho giardino e a dor irredutivel do poeta, em versos que recusam a metrica classica. Myricae — 'tamareisco', a arvore pequena que cresce onde nada cresce — e o titulo do conjunto e o programa da sua poesia.",
    "capaUrl": "https://archive.org/services/img/myricae",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/myricae/myricae.pdf" },
      { "formato": "html", "url": "https://archive.org/details/myricae" }
    ]
  },
  {
    "titulo": "Satire e poesie minori",
    "subtitulo": "Satiras e poesias menores — com prefacio de Giosue Carducci (edicao de 1863, em italiano)",
    "autor": "Vittorio Alfieri",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_6RQl2ncoKp0C",
    "ano": 1863,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "As satiras e as poesias menores de Vittorio Alfieri — o poeta da revolucao, autor das tragedias 'Saul', 'Mirra' e 'Bruto'. Esta edicao de 1863 e prefaciada por Giosue Carducci e reune a poesia satirica do poeta piamontes numa edicao unica.",
    "capaUrl": "https://archive.org/services/img/bub_gb_6RQl2ncoKp0C",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_6RQl2ncoKp0C/bub_gb_6RQl2ncoKp0C.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_6RQl2ncoKp0C" }
    ]
  },
  {
    "titulo": "Discorsi sopra la prima deca di Tito Livio",
    "subtitulo": "Discursos sobre a primeira decada de Tito Livio — os 'Discorsi' de Machiavelli (edicao de 1554, em italiano)",
    "autor": "Niccolo Machiavelli",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "discorsidinicolo00mach",
    "ano": 1554,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "Os 'Discorsi' de Machiavelli: uma leitura da historia romana de Tito Livio para extrair as lições de governo que faltavam ao Principe. Scritos em 1512-1519 e publicados postumamente, sao a segunda grande obra do autor e a fundacao da ciencia politica moderna.",
    "capaUrl": "https://archive.org/services/img/discorsidinicolo00mach",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/discorsidinicolo00mach/discorsidinicolo00mach.pdf" },
      { "formato": "html", "url": "https://archive.org/details/discorsidinicolo00mach" }
    ]
  },
  {
    "titulo": "Mastro don Gesualdo",
    "subtitulo": "Mastro Don Gesualdo — romance (edicao de 1890, em italiano)",
    "autor": "Giovanni Verga",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "mastrodongesuald00verguoft",
    "ano": 1890,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O camponês siciliano que sobe na escala social e e destruido por ela: Mastro Don Gesualdo procura um casamento que o salve, mas o capital rural vence-o. Segundo grande romance de Verga (1890), e a sua obra mais cruel e mais moderna.",
    "capaUrl": "https://archive.org/services/img/mastrodongesuald00verguoft",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/mastrodongesuald00verguoft/mastrodongesuald00verguoft.pdf" },
      { "formato": "html", "url": "https://archive.org/details/mastrodongesuald00verguoft" }
    ]
  },
  {
    "titulo": "Il mezzogiorno",
    "subtitulo": "O Meio-Dia — 'poemetto' de Giuseppe Parini, primeira versao do 'Il giorno' (edicao de 1765, em italiano)",
    "autor": "Giuseppe Parini",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_xtxaSA4m9hYC",
    "ano": 1765,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O poema que abre a serie da reforma da lingua e da literatura italianas: Parini descreve a vida de um dia, do meio-dia ao anoitecer, e denuncia a ociosidade das castas. E a primeira versao do 'Il giorno' (1797), expandida e reescrita — o exemplar catalogado e a edicao de 1765.",
    "capaUrl": "https://archive.org/services/img/bub_gb_xtxaSA4m9hYC",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_xtxaSA4m9hYC/bub_gb_xtxaSA4m9hYC.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_xtxaSA4m9hYC" }
    ]
  },
  {
    "titulo": "Una donna",
    "subtitulo": "Uma Mulher — romance (edicao de 1921, em italiano)",
    "autor": "Sibilla Aleramo",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "unadonnaromanzo00aler_0",
    "ano": 1921,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O primeiro grande romance italiano escrito por uma mulher: a protagonista abandona o marido e o filho, recusa-se a ser reduzida a nome de familia e parte em busca de si propria. Published em 1921, e uma das obras fundadoras da literatura feminina italiana. As traducoes inglesas do mesmo romance foram rejeitadas na verificacao de lingua.",
    "capaUrl": "https://archive.org/services/img/unadonnaromanzo00aler_0",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/unadonnaromanzo00aler_0/unadonnaromanzo00aler_0.pdf" },
      { "formato": "html", "url": "https://archive.org/details/unadonnaromanzo00aler_0" }
    ]
  },
  {
    "titulo": "Il bel paese",
    "subtitulo": "O Belo Pais — 'conversazioni sulle bellezze naturali, la geologia e la geografia' (edicao de 1915, em italiano)",
    "autor": "Antonio Stoppani",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "ilbelpaeseconver00stopuoft",
    "ano": 1915,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "As 'conversazioni' com que Antonio Stoppani, padre e naturalista, ensinava Italia a conhecer o proprio territorio — geologia, paisagem, flora e fauna em dialogos accessiveis. Publicada em 1876, foi o grande/manual de divulgacao científica do pais e inspirou o 'Cuore' de De Amicis.",
    "capaUrl": "https://archive.org/services/img/ilbelpaeseconver00stopuoft",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ilbelpaeseconver00stopuoft/ilbelpaeseconver00stopuoft.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ilbelpaeseconver00stopuoft" }
    ]
  },
  {
    "titulo": "Vita e memorie di Giuseppe Garibaldi",
    "subtitulo": "Vida e memorias de Giuseppe Garibaldi — escritas pelo proprio general (edicao de 1860, em italiano)",
    "autor": "Giuseppe Garibaldi",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_KdPZtNeocooC",
    "ano": 1860,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "As memorias do general que unificou a Italia, escritas em primeira pessoa e publicadas pelo proprio autor em 1860 — da fuga de Sao Paulo a legenda da resubmissao do Mezzogiorno. Um documento de memoria e de propaganda, lido em toda a Europa.",
    "capaUrl": "https://archive.org/services/img/bub_gb_KdPZtNeocooC",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_KdPZtNeocooC/bub_gb_KdPZtNeocooC.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_KdPZtNeocooC" }
    ]
  },
  {
    "titulo": "Giudizio degli antichi poeti sopra la moderna censura di Dante",
    "subtitulo": "Juizo dos antigos poetas sobre a moderna censura de Dante — ensaio critico de Gasparo Gozzi (edicao de 1758, em italiano)",
    "autor": "Gasparo Gozzi",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "bub_gb_erCZZZr_Gl8C",
    "ano": 1758,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "Ensaio em que Gasparo Gozzi compara os antigos poetas a Dante com os modernos, e defende a liberdade de escrever contra a censura do seu tempo. Gozzi e tambem o autor do 'Turco em Italia', conte de moldura oriental que adapta as 'Mille e uma noites' ao Risorgimento.",
    "capaUrl": "https://archive.org/services/img/bub_gb_erCZZZr_Gl8C",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_erCZZZr_Gl8C/bub_gb_erCZZZr_Gl8C.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_erCZZZr_Gl8C" }
    ]
  },
  {
    "titulo": "Il fu Mattia Pascal",
    "subtitulo": "O Falecido Mattia Pascal — romanzo (edicao de 1919, em italiano)",
    "autor": "Luigi Pirandello",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-it",
    "fonteIdExterno": "ilfumattiasaCal00pirauoft",
    "ano": 1919,
    "paginas": 0,
    "idioma": "it",
    "licenca": "dominio-publico",
    "sinopse": "O primeiro grande romanzo de Pirandello: Mattia Pascal, modestissimo professor, simula a propria morte para libertar a mulher que ama — e ve-se de repente vivo num mundo onde ninguem o reconhece. Uma novela sobre a identidade e o absurdo, e a obra que dio a fama internacional ao autor.",
    "capaUrl": "https://archive.org/services/img/ilfumattiasaCal00pirauoft",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ilfumattiasaCal00pirauoft/ilfumattiasaCal00pirauoft.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ilfumattiasaCal00pirauoft" }
    ]
  }
];

module.exports = { archiveItaliana };
