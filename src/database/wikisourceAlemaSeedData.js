/**
 * Clássicos Alemães na Wikisource Alemã (de.wikisource.org)
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (regra AGENTS.md).
 * Pesquisa e verificação ao vivo em 11/10/2026: as 9 páginas foram testadas (HTTP 200)
 * e o título real de cada página confirmado. Obras que o Project Gutenberg NÃO possui
 * em original alemão (dramas de Schiller, Kant em edição original, Goethe e Lessing).
 * Nota: obras como a Phänomenologie de Hegel ou a Welt als Wille de Schopenhauer não estão
 * transcritas na de.wikisource (verificado por API de procura) e por isso não constam.
 */

const wikisourceAlema = [
  {
    "titulo": "Wilhelm Tell",
    "subtitulo": "Drama em 5 atos (Wikisource alemã)",
    "autor": "Friedrich Schiller",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "wilhelm-tell",
    "ano": 1804,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Epopeia nacional alemã de Schiller sobre a fundação da Confederação Suíça e o tirano Gessler — o drama mais encenado de Schiller, integralmente no original alemão na Wikisource.",
    "capaUrl": "/capas/tech/tech_1803.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/Wilhelm_Tell" }
    ]
  },
  {
    "titulo": "Die Räuber",
    "subtitulo": "Os ladrões — drama em 5 atos (Wikisource alemã)",
    "autor": "Friedrich Schiller",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "die-raeuber",
    "ano": 1781,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Ópera prima de Schiller (1781) que explodiu no Stuttgart de Sturm und Drang: os irmãos Karl e Franz Moor, entre revolta contra a corrupção social e maquinações paternas — teatro de insurgência no original alemão.",
    "capaUrl": "/capas/tech/tech_1804.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/Die_R%C3%A4uber" }
    ]
  },
  {
    "titulo": "Kabale und Liebe",
    "subtitulo": "Intriga e amor — tragédia burguesa (Wikisource alemã)",
    "autor": "Friedrich Schiller",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "kabale-und-liebe",
    "ano": 1784,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Tragédia burguesa de Schiller: o amor entre o oficial Ferdinand e a burguesa Luise é destruído pelas intrigas de corte e patriarcais — o drama social da Alemanha pré-revolucionária, no original alemão.",
    "capaUrl": "/capas/tech/tech_1805.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/Kabale_und_Liebe" }
    ]
  },
  {
    "titulo": "Maria Stuart",
    "subtitulo": "Drama em 5 atos (Wikisource alemã)",
    "autor": "Friedrich Schiller",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "maria-stuart",
    "ano": 1800,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Drama histórico de Schiller sobre os últimos dias da rainha escocesa Maria Stuart frente à corte de Elizabeth I — confronto entre poder político e dignidade humana em verso, no original alemão.",
    "capaUrl": "/capas/tech/tech_1806.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/Maria_Stuart" }
    ]
  },
  {
    "titulo": "Critik der reinen Vernunft (1781)",
    "subtitulo": "Crítica da razão pura — 1ª edição (Wikisource alemã)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "krv-1781",
    "ano": 1781,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A edição original de 1781 ('die erste Kritik') que revolucionou a filosofia: análise dos limites e possibilidades do conhecimento puro, entre racionalismo e empirismo — texto integral em alemão na edição A (1781) da Wikisource.",
    "capaUrl": "/capas/tech/tech_1807.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/Critik_der_reinen_Vernunft_(1781)" }
    ]
  },
  {
    "titulo": "Zum ewigen Frieden",
    "subtitulo": "Sobre a paz perpétua — Volksausgabe (Wikisource alemã)",
    "autor": "Immanuel Kant",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "zum-ewigen-frieden",
    "ano": 1795,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "O tratado de paz perpétua de Kant (1795): federações de repúblicas, direito internacional e garantias da liberdade — texto fundador do pacifismo filosófico europeu, apresentado na Volksausgabe alemã da Wikisource.",
    "capaUrl": "/capas/tech/tech_1808.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/Volksausgabe_von_Kant%E2%80%99s_Schrift_%E2%80%9EZum_ewigen_Frieden%E2%80%9C" }
    ]
  },
  {
    "titulo": "Emilia Galotti",
    "subtitulo": "Tragédia burguesa em 5 atos (Wikisource alemã)",
    "autor": "Gotthold Ephraim Lessing",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "emilia-galotti",
    "ano": 1772,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Tragédia de Lessing: o príncipe de Guarnero persegue a virtuosa Emilia Galotti até a destruição da família Galotti — crítica iluminista ao despotismo, no original alemão.",
    "capaUrl": "/capas/tech/tech_1809.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/Emilia_Galotti" }
    ]
  },
  {
    "titulo": "Götz von Berlichingen mit der eisernen Hand",
    "subtitulo": "Drama em 5 atos (Wikisource alemã)",
    "autor": "Johann Wolfgang von Goethe",
    "categoria": "Teatro & Poesia",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "goetz-von-berlichingen",
    "ano": 1773,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "Drama de estreia de Goethe (1773) sobre o cavaleiro imperial Götz com a mão de ferro, em confronto com o poder centralizante do Império — manifesto do Sturm und Drang, no original alemão.",
    "capaUrl": "/capas/tech/tech_1810.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/G%C3%B6tz_von_Berlichingen_(Goethe)" }
    ]
  },
  {
    "titulo": "Kinder- und Hausmärchen",
    "subtitulo": "Contos de fadas dos Irmãos Grimm (Wikisource alemã)",
    "autor": "Jacob e Wilhelm Grimm",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "wikisource-de",
    "fonteIdExterno": "kinder-und-hausmaerchen",
    "ano": 1812,
    "paginas": 0,
    "idioma": "de",
    "licenca": "dominio-publico",
    "sinopse": "A coletânea original dos Irmãos Grimm (1812/1857) — Chapeuzinho Vermelho, Cinderela, Hänsel e Gretel e mais de 200 contos na forma alemã definitiva, obra fundadora da narratologia moderna e do folclore europeu.",
    "capaUrl": "/capas/tech/tech_1811.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikisource.org/wiki/Kinder-_und_Hausm%C3%A4rchen" }
    ]
  }
];

module.exports = { wikisourceAlema };
