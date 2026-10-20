/**
 * Cânone Clássico Russo no Internet Archive (archive.org)
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (regra AGENTS.md).
 * Pesquisa e verificação ao vivo em 11/10/2026 — seis rondas com verificação de língua REAL
 * pela razão de caracteres cirílicos no OCR (djvu.txt), porque os metadados de idioma do IA
 * são inconsistentes para itens russos (três candidatos com language:eng,rus eram, na
 * verdade, traduções inglesas e foram rejeitados; um falso positivo foi um álbum de um
 * compositor de apelido Чехович e outro um livro de cartas do Hoyle):
 *  - página de detalhe https://archive.org/details/<id> existente;
 *  - razão de caracteres cirílicos > 0,5 no OCR (a maioria com 1,00 = texto integral russo);
 *  - PDF direto testado a resolver (206) — nome de ficheiro confirmado na metadata;
 *  - capa real em https://archive.org/services/img/<id> (JPEG, entropia de imagem >= 7,4).
 * Preferência por digitalizações de edições históricas (1831, 1850, 1857, 1862, 1864, 1876,
 * 1898, 1900, 1904-05, 1921, 1925, 1937, 1938...); edições soviéticas (1957-1978) apenas
 * quando não havia alternativa histórica desimpedida (o texto é de domínio público).
 * Lacunas honestas: a Morte de Ivan Ilitch e os dramáticos de Tchekhov (Três irmãs, Tio Vânia,
 * A gaivota, A ala nº 6) não têm exemplares em russo desimpedidos no IA — só traduções.
 * Caso particular: em polnoesobraniesochinenijfmdostoevskogo1 os metadados indicam Т. 8
 * (Бесы), mas o OCR confirma que o volume digitalizado é o Т. 7 (Идиотъ) — catalogado como
 * O Idiota com base no conteúdo digitalizado verificado.
 */

const archiveRussa = [
  {
    "titulo": "Война и мир",
    "subtitulo": "Guerra e Paz — romance em quatro volumes (edição de 1937, em russo)",
    "autor": "Lev Tolstói",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "tolstoy-leo-war-and-peace-4-volumes",
    "ano": 1937,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "A epopeia napoleónica de Tolstói (1865-1869) — a Rússia de 1805 a 1812 vista através das vidas de Pierre Bezukhov, Andrei Bolkonski e Natália Rostóva — integral em quatro volumes da edição russa de 1937. O link PDF abre o Volume I; os cinco volumes estão na página do item.",
    "capaUrl": "https://archive.org/services/img/tolstoy-leo-war-and-peace-4-volumes",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/tolstoy-leo-war-and-peace-4-volumes/War%20and%20Piece%20by%20Tolstoy%20Vol%20I.pdf" },
      { "formato": "html", "url": "https://archive.org/details/tolstoy-leo-war-and-peace-4-volumes" }
    ]
  },
  {
    "titulo": "Анна Каренина",
    "subtitulo": "Anna Karenina — romance em oito partes (1.º volume da edição de 1900, em russo)",
    "autor": "Lev Tolstói",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "annakareninaroma01tols",
    "ano": 1900,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O romance adúltero de Tolstói (1875-1877) — Anna, a mulher do alto funcionário Karenin, e o oficial Vronski, entre São Petersburgo, Moscovo e a estrada de ferro — 1.º volume da edição russa de 1900.",
    "capaUrl": "https://archive.org/services/img/annakareninaroma01tols",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/annakareninaroma01tols/annakareninaroma01tols.pdf" },
      { "formato": "html", "url": "https://archive.org/details/annakareninaroma01tols" }
    ]
  },
  {
    "titulo": "Воскресение",
    "subtitulo": "Ressurreição — volume 11 da edição em 12 volumes (1975, em russo)",
    "autor": "Lev Tolstói",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "B-001-033-444-ALL",
    "ano": 1975,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O último grande romance de Tolstói (1899) — o príncipe Nekhlúdov, jurado num processo de assassinato, reconhece na ré a prostituta que um dia seduziu e abriu mão, e percorre o caminho da expiação — volume 11 da edição soviética em 12 volumes de 1975.",
    "capaUrl": "https://archive.org/services/img/B-001-033-444-ALL",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/B-001-033-444-ALL/B-001-033-444-01.pdf" },
      { "formato": "html", "url": "https://archive.org/details/B-001-033-444-ALL" }
    ]
  },
  {
    "titulo": "Преступление и наказание",
    "subtitulo": "Crime e Castigo — romance em seis partes com epílogo (Т. 6 da edição jubilar de 1904, em russo)",
    "autor": "Fiódor Dostoiévski",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "polnoesobraniesochinenijfmdostoevskogo16",
    "ano": 1904,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O estudante Raskólnikov mata a velha pawnbroker «pela aritmética» da utilidade — e descobre que a consciência não se resolve em equações — na página de rosto da edição jubilar (6.ª, 1904) das obras completas de Dostoiévski, volume 6, com o texto integral em russo.",
    "capaUrl": "https://archive.org/services/img/polnoesobraniesochinenijfmdostoevskogo16",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/polnoesobraniesochinenijfmdostoevskogo16/polnoesobraniesochinenijfmdostoevskogo16.pdf" },
      { "formato": "html", "url": "https://archive.org/details/polnoesobraniesochinenijfmdostoevskogo16" }
    ]
  },
  {
    "titulo": "Идиот",
    "subtitulo": "O Idiota — romance em quatro partes (volume da edição jubilar de 1904-1906, em russo)",
    "autor": "Fiódor Dostoiévski",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "polnoesobraniesochinenijfmdostoevskogo1",
    "ano": 1905,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O príncipe Myshkin, recém-saído do sanatório suíço, regressa a São Petersburgo com a bondade pura de um «idiota» — e o mundo a sua volta não sabe o que fazer dela — romance integral em russo na edição jubilar (6.ª, 1904-1906) das obras completas. Nota: os metadados do item indicam Т. 8 (Бесы), mas o volume digitalizado é, segundo a página de rosto, o Т. 7 (Идиотъ).",
    "capaUrl": "https://archive.org/services/img/polnoesobraniesochinenijfmdostoevskogo1",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/polnoesobraniesochinenijfmdostoevskogo1/polnoesobraniesochinenijfmdostoevskogo1.pdf" },
      { "formato": "html", "url": "https://archive.org/details/polnoesobraniesochinenijfmdostoevskogo1" }
    ]
  },
  {
    "titulo": "Братья Карамазовы",
    "subtitulo": "Os irmãos Karamazov — romance integral (em russo)",
    "autor": "Fiódor Dostoiévski",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "bratya-karamazovy-1571-1",
    "ano": 1880,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O último e maior romance de Dostoiévski (1880) — o pai Fyodor Pavlovich e os quatro filhos, entre o parricídio e a questão de Deus, com o inquisidor e o sofrimento como centro da balada — texto integral em russo.",
    "capaUrl": "https://archive.org/services/img/bratya-karamazovy-1571-1",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bratya-karamazovy-1571-1/bratya-karamazovy_1571%20%281%29.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bratya-karamazovy-1571-1" }
    ]
  },
  {
    "titulo": "Бесы",
    "subtitulo": "Os demónios — romance integral (edição moderna, em russo)",
    "autor": "Fiódor Dostoiévski",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "dostoevski-besy",
    "ano": 1871,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O romance da revolução (1872) — em cidade russa anónima, o conspirador Stavrogin e o ideólogo Kirillov movem um grupo de jovens nihilistas à deriva entre o terrorismo e o suicídio filosófico — texto integral em russo, edição moderna da coleção «100 melhores livros de todos os tempos».",
    "capaUrl": "https://archive.org/services/img/dostoevski-besy",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/dostoevski-besy/Dostoevski_besy.pdf" },
      { "formato": "html", "url": "https://archive.org/details/dostoevski-besy" }
    ]
  },
  {
    "titulo": "Записки из подполья",
    "subtitulo": "Memórias do subsolo — novela (1864, em russo)",
    "autor": "Fiódor Dostoiévski",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "zapiski-iz-podpolya",
    "ano": 1864,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O primeiro grande texto do subterrâneo — o funcionário anónimo de São Petersburgo cospe sobre a «lógica das sete vezes dois» e reivindica o direito de ser irracional: a declaração de independência do homem do subsolo, novela de 1864.",
    "capaUrl": "https://archive.org/services/img/zapiski-iz-podpolya",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/zapiski-iz-podpolya/zapiski-iz-podpolya.pdf" },
      { "formato": "html", "url": "https://archive.org/details/zapiski-iz-podpolya" }
    ]
  },
  {
    "titulo": "Записки из Мёртвого дома. Игрок",
    "subtitulo": "Memórias da Casa Morta e O Jogador — volume de 1921 (em russo)",
    "autor": "Fiódor Dostoiévski",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "zapiskiizmertvag00dost",
    "ano": 1921,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "Volume russo de 1921 que reúne duas obras: as Memórias da Casa Morta (1862), o relato da prisão siberiana de Dostoiévski entre presidiários e flagelados, e O Jogador (1867), o frenesi da roleta em cidade alemã e o vício que devora o jogo.",
    "capaUrl": "https://archive.org/services/img/zapiskiizmertvag00dost",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/zapiskiizmertvag00dost/zapiskiizmertvag00dost.pdf" },
      { "formato": "html", "url": "https://archive.org/details/zapiskiizmertvag00dost" }
    ]
  },
  {
    "titulo": "Мёртвые души",
    "subtitulo": "Almas mortas — poema em prosa (volume das obras completas, ed. de 1857, em russo)",
    "autor": "Nikolai Gogol",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "sochinenijaipismanvgogoljat4mertvy78",
    "ano": 1857,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O cavaleiro Chichikov percorre a província russa a comprar «almas mortas» — camponeses falecidos, ainda contados no censo — sátira da burocracia e da propriedade rural em forma de poema em prosa de Gogol (1842) — volume das obras e cartas de Gogol (edição de 1857), em russo.",
    "capaUrl": "https://archive.org/services/img/sochinenijaipismanvgogoljat4mertvy78",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/sochinenijaipismanvgogoljat4mertvy78/sochinenijaipismanvgogoljat4mertvy78.pdf" },
      { "formato": "html", "url": "https://archive.org/details/sochinenijaipismanvgogoljat4mertvy78" }
    ]
  },
  {
    "titulo": "Ревизор",
    "subtitulo": "O revisor — comédia em cinco atos (edição de 1898, em russo, ortografia pré-1918)",
    "autor": "Nikolai Gogol",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "revizorizpeterb00gogogoog",
    "ano": 1898,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "«Chamaram-me aqui, Eminência...» — a cidade de província inteira se ajoelha perante Khlestakov, o pequeno funcionário de passagem tomado por inspetor do governo: a comédia mais famosa de Gogol (1836), na edição russa de 1898, em ortografia anterior à reforma de 1918.",
    "capaUrl": "https://archive.org/services/img/revizorizpeterb00gogogoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/revizorizpeterb00gogogoog/revizorizpeterb00gogogoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/revizorizpeterb00gogogoog" }
    ]
  },
  {
    "titulo": "Тарас Бульба",
    "subtitulo": "Taras Bulba — novela histórica (edição de 1850, em russo)",
    "autor": "Nikolai Gogol",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "tarasbulba00gogo",
    "ano": 1850,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O atamã cosaco Taras Bulba e os filhos entre o Zaporíjia e a guerra contra polacos e turcos — o pai que executa o filho traidor com as próprias mãos: novela histórica de Gogol (versão de 1842), na edição russa de 1850.",
    "capaUrl": "https://archive.org/services/img/tarasbulba00gogo",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/tarasbulba00gogo/tarasbulba00gogo.pdf" },
      { "formato": "html", "url": "https://archive.org/details/tarasbulba00gogo" }
    ]
  },
  {
    "titulo": "Евгений Онегин",
    "subtitulo": "Eugênio Oneguin — romance em verso (edição de 1925, em russo)",
    "autor": "Alexander Pushkin",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "evgeniionegin00push",
    "ano": 1925,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O «romance em verso» de Pushkin (1825-1832) — o dândi Oneguin mata o amigo em duelo e perde Tatiana para sempre, num retrato da Rússia aristocrática em estrofes de oito linhas — edição russa de 1925.",
    "capaUrl": "https://archive.org/services/img/evgeniionegin00push",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/evgeniionegin00push/evgeniionegin00push.pdf" },
      { "formato": "html", "url": "https://archive.org/details/evgeniionegin00push" }
    ]
  },
  {
    "titulo": "Капитанская дочка",
    "subtitulo": "A filha do capitão — novela histórica (edição soviética de 1964, em russo)",
    "autor": "Alexander Pushkin",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "1964_20230109",
    "ano": 1964,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O alferes Grinyov na revolta de Pugachev (1773-1775) — o amor pela filha do capitão Mironov e a dívida de honra perante o cossaco que o poupa: a novela histórica de Pushkin (1836), na edição soviética de 1964.",
    "capaUrl": "https://archive.org/services/img/1964_20230109",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/1964_20230109/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD%20%D0%90.%D0%A1.%20-%20%D0%9A%D0%B0%D0%BF%D0%B8%D1%82%D0%B0%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B4%D0%BE%D1%87%D0%BA%D0%B0%2C%201964.pdf" },
      { "formato": "html", "url": "https://archive.org/details/1964_20230109" }
    ]
  },
  {
    "titulo": "Герой нашего времени",
    "subtitulo": "Um herói do nosso tempo — novela (edição de 1938, em russo)",
    "autor": "Mikhail Lermontov",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "gerojnashegovremeni53",
    "ano": 1938,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O oficial Pechorin, «herói do nosso tempo» — o homem supérfluo do Cáucaso e do Mar Negro, calculista e suicida nos seus diários: a primeira grande prosa russa (1840) de Lermontov, na edição de 1938.",
    "capaUrl": "https://archive.org/services/img/gerojnashegovremeni53",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/gerojnashegovremeni53/gerojnashegovremeni53.pdf" },
      { "formato": "html", "url": "https://archive.org/details/gerojnashegovremeni53" }
    ]
  },
  {
    "titulo": "Отцы и дети",
    "subtitulo": "Pais e filhos — romance (edição em russo)",
    "autor": "Ivan Turgueniev",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "ivan_sergeevich_turgenev-ottci_i_deti-64018873c3bb0",
    "ano": 1862,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O nihilista Bazarov e o tradicionalista Kirsanov — a geração de 1862 que rasga com os pais e morre de tifo numa feira de província: o romance mais politizado de Turgueniev (1862), texto integral em russo.",
    "capaUrl": "https://archive.org/services/img/ivan_sergeevich_turgenev-ottci_i_deti-64018873c3bb0",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/ivan_sergeevich_turgenev-ottci_i_deti-64018873c3bb0/Turgenev_Otcy-i-deti.w75KQA.706070.pdf" },
      { "formato": "html", "url": "https://archive.org/details/ivan_sergeevich_turgenev-ottci_i_deti-64018873c3bb0" }
    ]
  },
  {
    "titulo": "Записки охотника",
    "subtitulo": "Memórias de um caçador — ciclo de contos (edição de 1876, em russo)",
    "autor": "Ivan Turgueniev",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "zapiskiokhotnik00turggoog",
    "ano": 1876,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O caçador que percorre a campanha de Tula e ouve os camponeses: o ciclo de contos de Turgueniev (1852) que denunciou a servidão e fez o leitor russo chorar pela sua própria terra — edição de 1876.",
    "capaUrl": "https://archive.org/services/img/zapiskiokhotnik00turggoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/zapiskiokhotnik00turggoog/zapiskiokhotnik00turggoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/zapiskiokhotnik00turggoog" }
    ]
  },
  {
    "titulo": "Обломов",
    "subtitulo": "Oblomov — romance (edição da «Biblioteca do Estudante», 1957, em russo)",
    "autor": "Ivan Goncharov",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "B-001-033-282-ALL",
    "ano": 1957,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O sonho de Oblomov — o nobre de São Petersburgo que não sai da cama, incapaz de responder às cartas nem de amar a mulher que o ama: o romance russo da «inércia» de Goncharov (1859), na edição escolar soviética de 1957.",
    "capaUrl": "https://archive.org/services/img/B-001-033-282-ALL",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/B-001-033-282-ALL/B-001-033-282-01.pdf" },
      { "formato": "html", "url": "https://archive.org/details/B-001-033-282-ALL" }
    ]
  },
  {
    "titulo": "Вишнёвый сад",
    "subtitulo": "A cerejeira — peça em quatro atos (edição escolar soviética de 1978, em russo)",
    "autor": "Anton Tchekhov",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "B-001-052-608-ALL",
    "ano": 1978,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "A última peça de Tchekhov (1904) — a família Ranevskaya vende a quinta e a cerejeira para um antigo servo enriquecido; o «corta, corta» do machado atravessa o final de uma era russa — na edição escolar soviética de 1978, em russo.",
    "capaUrl": "https://archive.org/services/img/B-001-052-608-ALL",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/B-001-052-608-ALL/B-001-052-608-06-photo.pdf" },
      { "formato": "html", "url": "https://archive.org/details/B-001-052-608-ALL" }
    ]
  },
  {
    "titulo": "Басни",
    "subtitulo": "Fábulas — edição de 1831 (em russo)",
    "autor": "Ivan Krylov",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-ru",
    "fonteIdExterno": "basnikry00kryl",
    "ano": 1831,
    "paginas": 0,
    "idioma": "ru",
    "licenca": "dominio-publico",
    "sinopse": "O «La Fontaine russo» — a fábula consagrada do século XIX russo: o lobo e o cordeiro, a raposa e as uvas, o escaravelho e a formiga, em verso que a Rússia decorou de cor — edição das fábulas de Krylov de 1831.",
    "capaUrl": "https://archive.org/services/img/basnikry00kryl",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/basnikry00kryl/basnikry00kryl.pdf" },
      { "formato": "html", "url": "https://archive.org/details/basnikry00kryl" }
    ]
  }
];

module.exports = { archiveRussa };
