/**
 * Cânone Clássico Alemão no Internet Archive (archive.org)
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (regra AGENTS.md).
 * Pesquisa e verificação ao vivo em 11/10/2026: para cada registo verificou-se
 *  - página de detalhe (https://archive.org/details/<id>) com HTTP 200;
 *  - metadados via https://archive.org/metadata/<id> (título/autor/idioma correspondem à obra,
 *    item SEM restrição de acesso "access-restricted-item");
 *  - link direto do PDF/TXT resolvendo HTTP 200 (quando presente);
 *  - capa via https://archive.org/services/img/<id> com imagem real (JPEG 180×~260).
 * Obra incluída apenas se a digitalização for de edição clara em domínio público
 * (edições originais de 1779/1788/1802/1887/1895/1908 etc.); edições modernas ou
 * digitalizações com traduções protegidas no mesmo item foram descartadas.
 */

const archiveAlema = [
  {
    "titulo": "Phänomenologie des Geistes",
    "subtitulo": "Fenomenologia do Espírito (edição de 1832)",
    "autor": "Georg Wilhelm Friedrich Hegel",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "10043398",
    "ano": 1832,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A obra-mestra de Hegel (1807): a jornada da consciência da certeza sensível até o saber absoluto, com o famoso capítulo do senhor e do escravo — digitalização da edição de 1832, a primeira publicada após a morte do autor.",
    "capaUrl": "https://archive.org/services/img/10043398",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/10043398/10043398.pdf" },
      { "formato": "html", "url": "https://archive.org/details/10043398" }
    ]
  },
  {
    "titulo": "Die Welt als Wille und Vorstellung",
    "subtitulo": "O mundo como vontade e representação (2.ª edição)",
    "autor": "Arthur Schopenhauer",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "dieweltalswille00unkngoog",
    "ano": 1844,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O sistema central de Schopenhauer: o mundo como representação do sujeito e como vontade cega e insaciável, com a saída pela arte e pela compaixão — digitalização da 2.ª edição (1844), ampliada pelo próprio autor.",
    "capaUrl": "https://archive.org/services/img/dieweltalswille00unkngoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/dieweltalswille00unkngoog/dieweltalswille00unkngoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/dieweltalswille00unkngoog" }
    ]
  },
  {
    "titulo": "Jenseits von Gut und Böse",
    "subtitulo": "Para além do bem e do mal — vorspiel einer philosophie",
    "autor": "Friedrich Nietzsche",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "jenseitsvongutun07204gut",
    "ano": 1886,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O 'prelúdio a uma filosofia' de 1886 que desmonta a moral do ressentimento e abre caminho à genealogia e ao além-do-humano — digitalização do texto integral do original alemão.",
    "capaUrl": "/capas/tech/tech_1812.svg",
    "leituras": 0,
    "links": [
      { "formato": "txt", "url": "https://archive.org/download/jenseitsvongutun07204gut/7jnst10.txt" },
      { "formato": "html", "url": "https://archive.org/details/jenseitsvongutun07204gut" }
    ]
  },
  {
    "titulo": "Zur Genealogie der Moral",
    "subtitulo": "Genealogia da moral — uma polêmica (edição de 1892)",
    "autor": "Friedrich Nietzsche",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "zurgenealogieder00niet",
    "ano": 1892,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Três ensaios genealógicos (1887) sobre a má-consciência, a culpa e o ideal ascético — a crítica mais dura de Nietzsche à moral judaico-cristã, na digitalização de uma edição alemã de 1892.",
    "capaUrl": "https://archive.org/services/img/zurgenealogieder00niet",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/zurgenealogieder00niet/zurgenealogieder00niet.pdf" },
      { "formato": "html", "url": "https://archive.org/details/zurgenealogieder00niet" }
    ]
  },
  {
    "titulo": "Der Antichrist",
    "subtitulo": "O anticristo — tentativa de crítica do cristianismo (1895)",
    "autor": "Friedrich Nietzsche",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "nietzsche-friedrich-der-antichrist-1895-70-s.-text",
    "ano": 1895,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O panfleto final de Nietzsche (1895): o cristianismo julgado como religião do niilismo e do desvaloramento da vida — digitalização de uma edição alemã de 1895.",
    "capaUrl": "https://archive.org/services/img/nietzsche-friedrich-der-antichrist-1895-70-s.-text",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/nietzsche-friedrich-der-antichrist-1895-70-s.-text/Nietzsche%2C%20Friedrich%20-%20Der%20Antichrist%20%281895%2C%2070%20S.%2C%20Text%29.pdf" },
      { "formato": "html", "url": "https://archive.org/details/nietzsche-friedrich-der-antichrist-1895-70-s.-text" }
    ]
  },
  {
    "titulo": "Ecce Homo",
    "subtitulo": "Como se torna o que se é (autobiografia, 1908)",
    "autor": "Friedrich Nietzsche",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "eccehomo00niet_0",
    "ano": 1908,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A autobiografia-lapidar de Nietzsche, escrita em 1888 e publicada postumamente em 1908: autoanálise, títulos ('Assim falou Zaratustra') e a lucidez de quem sabia do fim próximo — digitalização da edição alemã de 1908.",
    "capaUrl": "https://archive.org/services/img/eccehomo00niet_0",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://archive.org/details/eccehomo00niet_0" }
    ]
  },
  {
    "titulo": "Die fröhliche Wissenschaft",
    "subtitulo": "A gaia ciência — la gaya scienza (edição de 1887)",
    "autor": "Friedrich Nietzsche",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "bub_gb_uIQNAAAAYAAJ",
    "ano": 1887,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A 'gaia ciência' de Nietzsche em dois tempos: os aforismos e cantos de 1882, com o Livro V acrescentado em 1887 — onde se encontra a primeira formulação de 'Deus está morto' — na digitalização da edição de 1887.",
    "capaUrl": "https://archive.org/services/img/bub_gb_uIQNAAAAYAAJ",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/bub_gb_uIQNAAAAYAAJ/bub_gb_uIQNAAAAYAAJ.pdf" },
      { "formato": "html", "url": "https://archive.org/details/bub_gb_uIQNAAAAYAAJ" }
    ]
  },
  {
    "titulo": "Nathan der Weise",
    "subtitulo": "Nathan, o sábio — dramático poema em 5 atos (1779)",
    "autor": "Gotthold Ephraim Lessing",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "11721593bsb",
    "ano": 1779,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O grande drama da tolerância de Lessing (1779): diante do sultão Saladino, o judeu Nathan ilustra com a parábola dos três anéis que nenhuma religião pode reivindicar a posse da verdade — digitalização da edição de 1779.",
    "capaUrl": "https://archive.org/services/img/11721593bsb",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/11721593bsb/11721593bsb.pdf" },
      { "formato": "html", "url": "https://archive.org/details/11721593bsb" }
    ]
  },
  {
    "titulo": "Minna von Barnhelm",
    "subtitulo": "ou a ventura do soldado — comédia em 5 atos",
    "autor": "Gotthold Ephraim Lessing",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "minnavonbarnhelm00les",
    "ano": 1904,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A comédia de Lessing (1767): a rica Minna von Barnhelm procura o oficial empobrecido von Tellheim numa Alemanha pós-guerra — crítica ao orgulho militar e ao Preußentum — na digitalização de uma edição alemã de 1904.",
    "capaUrl": "https://archive.org/services/img/minnavonbarnhelm00les",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/minnavonbarnhelm00les/minnavonbarnhelm00les.pdf" },
      { "formato": "html", "url": "https://archive.org/details/minnavonbarnhelm00les" }
    ]
  },
  {
    "titulo": "Egmont",
    "subtitulo": "Trauerspiel em 5 atos (edição de 1788)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "10109256bsb",
    "ano": 1788,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O drama histórico de Goethe (1788) sobre o conde de Egmont e a revolta dos Países Baixos contra a tirania espanhola, com a liberdade vencida mas redimida pelo sonho final — levado à música-sinfonia por Beethoven (1810). Digitalização da edição de 1788.",
    "capaUrl": "https://archive.org/services/img/10109256bsb",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/10109256bsb/10109256bsb.pdf" },
      { "formato": "html", "url": "https://archive.org/details/10109256bsb" }
    ]
  },
  {
    "titulo": "Hermann und Dorothea",
    "subtitulo": "Idílio em hexâmetros — nove cantos (1797)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "hermannunddorot00unkngoog",
    "ano": 1897,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A epopeia doméstica de Goethe (1797) em hexâmetros clássicos: no horror da Guerra dos Trinta Anos transposta para o tempo da Revolução Francesa, o jovem Hermann e a refugiada Dorothea encontram-se e fundam um mundo — na digitalização de uma edição de 1897.",
    "capaUrl": "https://archive.org/services/img/hermannunddorot00unkngoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/hermannunddorot00unkngoog/hermannunddorot00unkngoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/hermannunddorot00unkngoog" }
    ]
  },
  {
    "titulo": "Das Nibelungenlied",
    "subtitulo": "O épico medieval alemão (edição de Zarncke, 1875)",
    "autor": "Anónimo (alto-alemão médio)",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "dasnibelungenli08zarngoog",
    "ano": 1875,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O grande épico medieval alemão: Siegfried, Kriemhild e a queda dos burgúndios numa vingança que consome um povo inteiro — na digitalização da edição crítica de Friedrich Zarncke (1875), com o texto original em alto-alemão médio.",
    "capaUrl": "https://archive.org/services/img/dasnibelungenli08zarngoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/dasnibelungenli08zarngoog/dasnibelungenli08zarngoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/dasnibelungenli08zarngoog" }
    ]
  },
  {
    "titulo": "Buch der Lieder",
    "subtitulo": "O livro de canções de Heine (1827)",
    "autor": "Heinrich Heine",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "10125030bsb",
    "ano": 1868,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O livro de canções que funda a modernidade lírica alemã (1827): os ciclos do 'Lyrisches Intermezzo', da 'Nordsee' e da 'Heimkehr', entre amor, ironia e melancolia — na digitalização de uma edição de 1868.",
    "capaUrl": "https://archive.org/services/img/10125030bsb",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/10125030bsb/10125030bsb.pdf" },
      { "formato": "html", "url": "https://archive.org/details/10125030bsb" }
    ]
  },
  {
    "titulo": "Die Jungfrau von Orleans",
    "subtitulo": "Tragédia romântica em 5 atos (edição de 1802)",
    "autor": "Friedrich Schiller",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "10859397bsb",
    "ano": 1802,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A tragédia romântica de Schiller (1801) sobre Joana d'Arc: a santa guerreira entre a história, a lenda e o sacrifício — digitalização da edição de 1802.",
    "capaUrl": "https://archive.org/services/img/10859397bsb",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/10859397bsb/10859397bsb.pdf" },
      { "formato": "html", "url": "https://archive.org/details/10859397bsb" }
    ]
  },
  {
    "titulo": "Wallensteins Tod",
    "subtitulo": "A morte de Wallenstein — tragédia em 5 atos (1799)",
    "autor": "Friedrich Schiller",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "wallensteinstod00schigoog",
    "ano": 1865,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Desfecho da trilogia de Wallenstein: o general imperial Albrecht Wallenstein, entre a astrologia, a ambição e a lealdade, é traído e morto no fim da Guerra dos Trinta Anos (1799) — na digitalização de uma edição de 1865.",
    "capaUrl": "https://archive.org/services/img/wallensteinstod00schigoog",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/wallensteinstod00schigoog/wallensteinstod00schigoog.pdf" },
      { "formato": "html", "url": "https://archive.org/details/wallensteinstod00schigoog" }
    ]
  },
  {
    "titulo": "Der zerbrochene Krug",
    "subtitulo": "O pote partido — comédia de Heinrich von Kleist",
    "autor": "Heinrich von Kleist",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "archive-de",
    "fonteIdExterno": "derzerbrochenekr00kleiuoft",
    "ano": 1900,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A comédia-julgamento de Kleist (estreada em 1808): num tribunal de Haia, o juiz Adam tenta encobrir que é o próprio sedutor da noiva de Ruprecht — o esclarecimento que se julga a si próprio e naufraga — na digitalização de uma edição de 1900.",
    "capaUrl": "https://archive.org/services/img/derzerbrochenekr00kleiuoft",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://archive.org/download/derzerbrochenekr00kleiuoft/derzerbrochenekr00kleiuoft.pdf" },
      { "formato": "html", "url": "https://archive.org/details/derzerbrochenekr00kleiuoft" }
    ]
  }
];

module.exports = { archiveAlema };
