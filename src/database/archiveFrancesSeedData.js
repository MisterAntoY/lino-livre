/**
 * Cânone Clássico Francês no Internet Archive (archive.org)
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (regra AGENTS.md).
 * Pesquisa e verificação ao vivo em 11/10/2026 — duas rondas com filtro estrito de idioma
 * (language:fre/French obrigatório, itens com access-restricted-item descartados):
 *  - página de detalhe https://archive.org/details/<id> existente (metadados obtidos com 200);
 *  - título/autor/idioma dos metadados correspondem à obra pretendida;
 *  - PDF direto testado a resolver (200/206) — nome de ficheiro confirmado na metadata;
 *  - capa real em https://archive.org/services/img/<id> (JPEG 180×~290, entropia de imagem,
 *    nenhuma capa em branco).
 * Preferência por digitalizações de edições históricas (1655, 1677, 1696, 1700, 1731, 1759,
 * 1760, 1777, 1782, 1830, 1845-46, 1851, 1857, 1885, 1896...); edições escolares apenas
 * quando o texto integral em francês está presente (ex.: Le Misanthrope de 1851).
 */

const archiveFrances = [
  {
    "titulo": "Le Misanthrope",
    "subtitulo": "O misantropo — comédia em 5 atos e em verso",
    "autor": "Molière",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "lemisanthropeco00moli",
    "ano": 1851,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "Alceste, o misantropo, explode contra a hipocrisia da corte de Luís XIV nesta comédia em versos de 1666 — a peça mais refinada de Molière, entre a amizade ferida e o amor impossível — na digitalização de uma edição francesa de 1851.",
    "capaUrl": "https://archive.org/services/img/lemisanthropeco00moli",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/lemisanthropeco00moli/lemisanthropeco00moli.pdf" },
      { "formato": "html", "url": "https://archive.org/details/lemisanthropeco00moli" }
    ]
  },
  {
    "titulo": "Tartuffe, ou l'Imposteur",
    "subtitulo": "Tartufo, o impostor — comédia em 5 atos",
    "autor": "Molière",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "bub_gb_Dpv2B04LIeoC",
    "ano": 1777,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "A comédia do hipócrita religioso (1664), proibida pela censura real durante cinco anos: Orgon acolhe Tartufo, o devoto impostor que lhe rouba a casa e a família — sátira moliéresca do fanatismo — na digitalização da edição de 1777.",
    "capaUrl": "https://archive.org/services/img/bub_gb_Dpv2B04LIeoC",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_Dpv2B04LIeoC/bub_gb_Dpv2B04LIeoC.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_Dpv2B04LIeoC" }
    ]
  },
  {
    "titulo": "L'Avare",
    "subtitulo": "O avarento — comédia em prosa em 5 atos",
    "autor": "Molière",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "bub_gb_T1Xtso7bbC0C",
    "ano": 1760,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "Harpagon, escravizado pelo próprio cofre, sacrifica os filhos ao dote nesta comédia em prosa de 1668, Plauto e Rabelais ao serviço da avareza universal — na digitalização da edição de 1760.",
    "capaUrl": "https://archive.org/services/img/bub_gb_T1Xtso7bbC0C",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_T1Xtso7bbC0C/bub_gb_T1Xtso7bbC0C.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_T1Xtso7bbC0C" }
    ]
  },
  {
    "titulo": "Candide, ou l'Optimisme",
    "subtitulo": "Candide, ou o otimismo — conto filosófico",
    "autor": "Voltaire",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "bib_fict_4655354",
    "ano": 1759,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O conto filosófico mais célebre de Voltaire (1759): o jovem Candide, otimista leibniziano, atravessa terremotos, escravatura e guerras até descobrir que é preciso cultivar o próprio jardim — na digitalização da edição original de 1759.",
    "capaUrl": "https://archive.org/services/img/bib_fict_4655354",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bib_fict_4655354/bib_fict_4655354.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bib_fict_4655354" }
    ]
  },
  {
    "titulo": "Zadig et Micromégas",
    "subtitulo": "Zadig e Micrómegas — contos filosóficos",
    "autor": "Voltaire",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "zadigetmicromg00volt",
    "ano": 1886,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "Dois contos filosóficos de Voltaire: Zadig, o sábio babilónico cujo destino desmente o providencialismo, e Micromégas, o gigante saturniano que visita a Terra com um filósofo humano — na digitalização de uma edição de 1886.",
    "capaUrl": "https://archive.org/services/img/zadigetmicromg00volt",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/zadigetmicromg00volt/zadigetmicromg00volt.pdf" },
      { "formato": "html", "url": "https://archive.org/details/zadigetmicromg00volt" }
    ]
  },
  {
    "titulo": "Les Confessions",
    "subtitulo": "Confissões, seguidas das Divagações do caminhante solitário",
    "autor": "Jean-Jacques Rousseau",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "lesconfessionsde01rous",
    "ano": 1782,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "As memórias revoltadas de Rousseau, escritas em 1765-1770 e publicadas a partir de 1782, seguidas das Divagações do caminhante solitário — o gênero confessional inventado contra a sociedade e a má-fé — na digitalização de uma edição de 1782.",
    "capaUrl": "https://archive.org/services/img/lesconfessionsde01rous",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/lesconfessionsde01rous/lesconfessionsde01rous.pdf" },
      { "formato": "html", "url": "https://archive.org/details/lesconfessionsde01rous" }
    ]
  },
  {
    "titulo": "Du contrat social",
    "subtitulo": "O contrato social — princípio de direito político",
    "autor": "Jean-Jacques Rousseau",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "ducontractsocia00dreygoog",
    "ano": 1896,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O tratado de 1762 que funda a soberania popular — 'o homem nasceu livre, e em toda parte está acorrentado' — entre a vontade geral e a liberdade civil, obra fundadora da democracia moderna — na digitalização de uma edição de 1896 com o texto definitivo e as variantes.",
    "capaUrl": "https://archive.org/services/img/ducontractsocia00dreygoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ducontractsocia00dreygoog/ducontractsocia00dreygoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ducontractsocia00dreygoog" }
    ]
  },
  {
    "titulo": "Lettres persanes",
    "subtitulo": "Cartas persas",
    "autor": "Montesquieu",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "lettrespersanes00goog",
    "ano": 1731,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "Duas persianas em Paris (1721) observam os europeus com espanto: crítica perspicaz da religião, do poder e dos costumes que revelou Montesquieu e preparou o Espírito das Leis — na digitalização da edição de 1731.",
    "capaUrl": "https://archive.org/services/img/lettrespersanes00goog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/lettrespersanes00goog/lettrespersanes00goog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/lettrespersanes00goog" }
    ]
  },
  {
    "titulo": "La Princesse de Clèves",
    "subtitulo": "A princesa de Clèves — romance",
    "autor": "Madame de La Fayette",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "laprincessedecl00unkngoog",
    "ano": 1877,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O romance de 1678 que inventa a análise psicológica: a princesa de Clèves, casada, resiste ao amor por Nemours numa corte de Luís XIII onde a confissão é a única arma — na digitalização de uma edição de 1877.",
    "capaUrl": "https://archive.org/services/img/laprincessedecl00unkngoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/laprincessedecl00unkngoog/laprincessedecl00unkngoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/laprincessedecl00unkngoog" }
    ]
  },
  {
    "titulo": "Phèdre",
    "subtitulo": "Fedra — tragédia (edição de 1677)",
    "autor": "Jean Racine",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "PhedreEtHippolyte",
    "ano": 1677,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "A tragédia de Racine (1677): Fedra, consumida pelo amor incestuoso por Hipólito, escolhe o silêncio e a vingança diante de Teseu — o verso raciniano no seu ponto mais alto — na digitalização da edição de 1677.",
    "capaUrl": "https://archive.org/services/img/PhedreEtHippolyte",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/PhedreEtHippolyte/PhedreetHippolyte.pdf" },
      { "formato": "html", "url": "https://archive.org/details/PhedreEtHippolyte" }
    ]
  },
  {
    "titulo": "Le Cid",
    "subtitulo": "O cid — tragédia heroica em 5 atos",
    "autor": "Pierre Corneille",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "1348867",
    "ano": 1655,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "A tragédia heroica de Corneille (1637): Rodrigo mata o pai de Chimène para lavar a honra do seu, e os amantes tornam-se rivais — o duelo entre amor e dever que funda o teatro clássico francês, na digitalização da edição de 1655.",
    "capaUrl": "https://archive.org/services/img/1348867",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/1348867/1348867.pdf" },
      { "formato": "html", "url": "https://archive.org/details/1348867" }
    ]
  },
  {
    "titulo": "Les Misérables",
    "subtitulo": "Os miseráveis — romance (1862)",
    "autor": "Victor Hugo",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "p4lesmisrables00hugo",
    "ano": 1862,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O romance-total de Hugo (1862): Jean Valjean contra o inspetor Javert no Paris da miséria pós-revolucionária, entre a batalha de Waterloo e as barricadas de 1832 — na digitalização de um volume da edição francesa original.",
    "capaUrl": "https://archive.org/services/img/p4lesmisrables00hugo",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/p4lesmisrables00hugo/p4lesmisrables00hugo.pdf" },
      { "formato": "html", "url": "https://archive.org/details/p4lesmisrables00hugo" }
    ]
  },
  {
    "titulo": "Notre-Dame de Paris",
    "subtitulo": "Nossa Senhora de Paris — romance (1831)",
    "autor": "Victor Hugo",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "notredamedeparis1830hugo",
    "ano": 1830,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O romance gótico de Hugo (1831): Quasímodo, a cigana Esmeralda e o arquidiáculo Frollo sob as torres de Notre-Dame, entre o destino e a piedade — na digitalização da edição original de 1830.",
    "capaUrl": "https://archive.org/services/img/notredamedeparis1830hugo",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/notredamedeparis1830hugo/notredamedeparis1830hugo.pdf" },
      { "formato": "html", "url": "https://archive.org/details/notredamedeparis1830hugo" }
    ]
  },
  {
    "titulo": "Madame Bovary",
    "subtitulo": "Madame Bovary — costumes de província",
    "autor": "Gustave Flaubert",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "madamebovarymurs11flau",
    "ano": 1857,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O romance realista de Flaubert (1857), julgado por ofensa à moral: Emma Bovary, adúltera e endividada pelos sonhos românticos, consome-se em Yonville até o arsénico — na digitalização da edição original de 1857.",
    "capaUrl": "https://archive.org/services/img/madamebovarymurs11flau",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/madamebovarymurs11flau/madamebovarymurs11flau.pdf" },
      { "formato": "html", "url": "https://archive.org/details/madamebovarymurs11flau" }
    ]
  },
  {
    "titulo": "Le Père Goriot",
    "subtitulo": "O pai Goriot",
    "autor": "Honoré de Balzac",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "pregoriot1910balz",
    "ano": 1910,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O pai Goriot, que consumiu a fortuna para as filhas, morre esquecido na pensão Vauquer enquanto o jovem Rastignac descobre as regras implacáveis da Paris social — o romance de Balzac (1835) que abre a Comédia Humana — na digitalização de uma edição de 1910.",
    "capaUrl": "https://archive.org/services/img/pregoriot1910balz",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/pregoriot1910balz/pregoriot1910balz.pdf" },
      { "formato": "html", "url": "https://archive.org/details/pregoriot1910balz" }
    ]
  },
  {
    "titulo": "Le Comte de Monte-Cristo",
    "subtitulo": "O conde de Monte-Cristo — 1.º volume (edição de 1845-46)",
    "autor": "Alexandre Dumas",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "lecomtedemontecr01dumauoft",
    "ano": 1845,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "Dantès, traído e preso na Château d'If, escapa com o tesouro do padre Faria e renasce como conde de Monte-Cristo — a vingança em três tempos de Dumas (1844-46) — na digitalização do primeiro volume da edição de 1845-46.",
    "capaUrl": "https://archive.org/services/img/lecomtedemontecr01dumauoft",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/lecomtedemontecr01dumauoft/lecomtedemontecr01dumauoft.pdf" },
      { "formato": "html", "url": "https://archive.org/details/lecomtedemontecr01dumauoft" }
    ]
  },
  {
    "titulo": "Germinal",
    "subtitulo": "Germinal — romance operário",
    "autor": "Émile Zola",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "germinalz00zola",
    "ano": 1885,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "A mina de Voreux, a greve e Étienne Lantier: o romance operário por excelência do naturalismo de Zola (1885), entre a fome, o carvão e a revolta que germina como semente — na digitalização da edição original de 1885.",
    "capaUrl": "https://archive.org/services/img/germinalz00zola",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/germinalz00zola/germinalz00zola.pdf" },
      { "formato": "html", "url": "https://archive.org/details/germinalz00zola" }
    ]
  },
  {
    "titulo": "Bel-Ami",
    "subtitulo": "Bel-Ami — as ambições de Georges Duroy",
    "autor": "Guy de Maupassant",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "belamimaup00maup",
    "ano": 1885,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "Georges Duroy, o sedutor ascendente do jornalismo parisiense pós-1871, faz a sua carreira sobre as mulheres que o elevam — o romance da ambição sem escrúpulos de Maupassant (1885) — na digitalização do texto integral em francês.",
    "capaUrl": "https://archive.org/services/img/belamimaup00maup",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/belamimaup00maup/belamimaup00maup.pdf" },
      { "formato": "html", "url": "https://archive.org/details/belamimaup00maup" }
    ]
  },
  {
    "titulo": "Les Fleurs du mal",
    "subtitulo": "As flores do mal (edição de 1857)",
    "autor": "Charles Baudelaire",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "lesfleursdumal00bauduoft",
    "ano": 1857,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O livro que funda a poesia moderna (1857), com seis poemas condenados por ofensa à moral: spleen, ideal, carne e cidade — Baudelaire entre o cisne e a Vênus antiga — na digitalização da edição original de 1857.",
    "capaUrl": "https://archive.org/services/img/lesfleursdumal00bauduoft",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/lesfleursdumal00bauduoft/lesfleursdumal00bauduoft.pdf" },
      { "formato": "html", "url": "https://archive.org/details/lesfleursdumal00bauduoft" }
    ]
  },
  {
    "titulo": "Le Mariage de Figaro",
    "subtitulo": "O casamento de Fígaro, ou a jornada louca — comédia em 5 atos",
    "autor": "Pierre-Augustin Caron de Beaumarchais",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "lemariagedefig00beau",
    "ano": 1784,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "A 'jornada louca' de Beaumarchais (1784): o pícaro Fígaro desmonta, servindo o conde de Almaviva, os privilégios da nobreza — a comédia que antecipou 1789 e fez a corte tremer — na digitalização de uma cópia francesa antiga.",
    "capaUrl": "https://archive.org/services/img/lemariagedefig00beau",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/lemariagedefig00beau/lemariagedefig00beau.pdf" },
      { "formato": "html", "url": "https://archive.org/details/lemariagedefig00beau" }
    ]
  },
  {
    "titulo": "Gargantua et Pantagruel",
    "subtitulo": "Gargantua e Pantagruel — ciclo romanceado",
    "autor": "François Rabelais",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "gargantuaetpant00clougoog",
    "ano": 1546,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "A dupla gigante de Rabelais (1532-1564): Gargantua e o filho Pantagruel numa torrente de gargalhadas, paródias escolásticas e sabedoria cínica — a épica grotesca assinada 'Alcofribas Nasier' — na digitalização de uma edição do texto original em francês arcaico.",
    "capaUrl": "https://archive.org/services/img/gargantuaetpant00clougoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/gargantuaetpant00clougoog/gargantuaetpant00clougoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/gargantuaetpant00clougoog" }
    ]
  },
  {
    "titulo": "Atala; René",
    "subtitulo": "Atala e René — novelas do romantismo francês",
    "autor": "François-René de Chateaubriand",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "atalaren01chatgoog",
    "ano": 1801,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "Atala (1801) e René (1802), as novelas que lançaram o romantismo francês: o amor cristão no deserto americano e o mal do século numa alma sem destino — na digitalização de uma edição que reúne os dois textos.",
    "capaUrl": "https://archive.org/services/img/atalaren01chatgoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/atalaren01chatgoog/atalaren01chatgoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/atalaren01chatgoog" }
    ]
  },
  {
    "titulo": "Pensées",
    "subtitulo": "Pensamentos (edição de 1812)",
    "autor": "Blaise Pascal",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "bub_gb_HtICAAAAQAAJ",
    "ano": 1812,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "Os fragmentos que Pascal legou antes de morrer em 1662: a miséria do homem sem Deus, a aposta e a crítica da razão — obra central do jansenismo e da filosofia francesa — na digitalização de uma edição de 1812.",
    "capaUrl": "https://archive.org/services/img/bub_gb_HtICAAAAQAAJ",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_HtICAAAAQAAJ/bub_gb_HtICAAAAQAAJ.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_HtICAAAAQAAJ" }
    ]
  },
  {
    "titulo": "Les Aventures de Télémaque",
    "subtitulo": "As aventuras de Telêmaco",
    "autor": "François de Salignac de La Mothe-Fénelon",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "esaventuresdfn00fn",
    "ano": 1700,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "O romance didático de Fénelon (1699): Telêmaco, guiado por Minerva, percorre o Mediterrâneo antigo numa utopia política contra o absolutismo — o livro mais lido do século XVIII — na digitalização da edição de 1700.",
    "capaUrl": "https://archive.org/services/img/esaventuresdfn00fn",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/esaventuresdfn00fn/esaventuresdfn00fn.pdf" },
      { "formato": "html", "url": "https://archive.org/details/esaventuresdfn00fn" }
    ]
  },
  {
    "titulo": "Fables choisies, mises en vers",
    "subtitulo": "Fábulas escolhidas em verso (edição de 1696)",
    "autor": "Jean de La Fontaine",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-fr",
    "fonteIdExterno": "FablesChoisiesMisesEnVers1696",
    "ano": 1696,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "dominio-publico",
    "sinopse": "As fábulas em verso de La Fontaine (1668-1694) — o lobo e o cordeiro, a cigarra e a formiga, o corvo e a raposa — a moral do poder contada do lado dos fracos — na digitalização da edição de 1696.",
    "capaUrl": "https://archive.org/services/img/FablesChoisiesMisesEnVers1696",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/FablesChoisiesMisesEnVers1696/Fables_choisies_mises_en_vers_par_Mr_de.pdf" },
      { "formato": "html", "url": "https://archive.org/details/FablesChoisiesMisesEnVers1696" }
    ]
  }
];

module.exports = { archiveFrances };
