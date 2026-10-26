// ────────────────────────────────────────────────────────────
// Catálogo Fallback de Resiliência para Degradação de Cota D1
// ────────────────────────────────────────────────────────────

export interface FallbackLivroLink {
  id: number;
  formato: string;
  url: string;
  link_externo: number;
}

export interface FallbackLivro {
  id: number;
  titulo: string;
  autor_nome: string;
  categoria_id: number;
  categoria_nome: string;
  ano_publicacao: number;
  idioma: string;
  licenca: string;
  capa_url: string;
  sinopse: string;
  fonte_id_externo?: string;
  links: FallbackLivroLink[];
}

export const FALLBACK_LIVROS: FallbackLivro[] = [
  {
    id: 1,
    titulo: 'Dom Casmurro',
    autor_nome: 'Machado de Assis',
    categoria_id: 1,
    categoria_nome: 'Clássicos Brasileiros',
    ano_publicacao: 1899,
    idioma: 'pt',
    licenca: 'dominio-publico',
    capa_url: '/capas/dom_casmurro.jpg',
    sinopse: 'A obra-prima de Machado de Assis narrando a história de Bento Santiago e Capitu.',
    links: [
      { id: 1, formato: 'html', url: 'https://pt.wikisource.org/wiki/Dom_Casmurro', link_externo: 1 },
      { id: 1001, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/55752.pdf', link_externo: 1 },
      { id: 1002, formato: 'epub', url: 'https://www.gutenberg.org/ebooks/55752.epub3.images', link_externo: 1 }
    ]
  },
  {
    id: 2,
    titulo: 'Memórias Póstumas de Brás Cubas',
    autor_nome: 'Machado de Assis',
    categoria_id: 1,
    categoria_nome: 'Clássicos Brasileiros',
    ano_publicacao: 1881,
    idioma: 'pt',
    licenca: 'dominio-publico',
    capa_url: '/capas/memorias_posthumas.jpg',
    sinopse: 'Narrativa irônica e revolucionária de um defunto-autor.',
    links: [
      { id: 2, formato: 'html', url: 'https://pt.wikisource.org/wiki/Memórias_Póstumas_de_Brás_Cubas', link_externo: 1 },
      { id: 1003, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/54829.pdf', link_externo: 1 },
      { id: 1004, formato: 'epub', url: 'https://www.gutenberg.org/ebooks/54829.epub3.images', link_externo: 1 }
    ]
  },
  {
    id: 3,
    titulo: 'O Cortiço',
    autor_nome: 'Aluísio Azevedo',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1890,
    idioma: 'pt',
    licenca: 'dominio-publico',
    capa_url: '/capas/o_cortico.png',
    sinopse: 'Obra fundadora do Naturalismo no Brasil retratando a vida coletiva num cortiço.',
    links: [
      { id: 3, formato: 'html', url: 'https://pt.wikisource.org/wiki/O_Cortiço', link_externo: 1 },
      { id: 1005, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/55800.pdf', link_externo: 1 }
    ]
  },
  {
    id: 4,
    titulo: 'Os Lusíadas',
    autor_nome: 'Luís de Camões',
    categoria_id: 3,
    categoria_nome: 'Teatro & Poesia',
    ano_publicacao: 1572,
    idioma: 'pt',
    licenca: 'dominio-publico',
    capa_url: '/capas/os_lusiadas.jpg',
    sinopse: 'O épico supremo da língua portuguesa sobre a viagem de Vasco da Gama.',
    links: [
      { id: 4, formato: 'html', url: 'https://pt.wikisource.org/wiki/Os_Lusíadas', link_externo: 1 },
      { id: 1006, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/3333.pdf', link_externo: 1 }
    ]
  },
  {
    id: 5,
    titulo: 'Mensagem',
    autor_nome: 'Fernando Pessoa',
    categoria_id: 3,
    categoria_nome: 'Teatro & Poesia',
    ano_publicacao: 1934,
    idioma: 'pt',
    licenca: 'dominio-publico',
    capa_url: '/capas/mensagem.jpg',
    sinopse: 'A única obra poética em língua portuguesa publicada em vida por Fernando Pessoa.',
    links: [
      { id: 5, formato: 'html', url: 'https://pt.wikisource.org/wiki/Mensagem', link_externo: 1 }
    ]
  },
  {
    id: 828,
    titulo: 'Iracema',
    autor_nome: 'José de Alencar',
    categoria_id: 4,
    categoria_nome: 'Romance Indianista',
    ano_publicacao: 1865,
    idioma: 'pt',
    licenca: 'dominio-publico',
    capa_url: '/capas/iracema.jpg',
    sinopse: 'A virgem dos lábios de mel e o nascimento mítico da identidade brasileira.',
    links: [
      { id: 828, formato: 'html', url: 'https://pt.wikisource.org/wiki/Iracema', link_externo: 1 },
      { id: 1007, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/6774.pdf', link_externo: 1 }
    ]
  },
  {
    id: 838,
    titulo: 'O Alienista',
    autor_nome: 'Machado de Assis',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1882,
    idioma: 'pt',
    licenca: 'dominio-publico',
    capa_url: '/capas/o_alienista.jpg',
    sinopse: 'Simão Bacamarte e a Casa Verde numa sátira genial sobre os limites da razão humana.',
    links: [
      { id: 838, formato: 'html', url: 'https://pt.wikisource.org/wiki/O_Alienista', link_externo: 1 }
    ]
  },
  {
    id: 467,
    titulo: 'A Bíblia Sagrada',
    autor_nome: 'Diversos Autores',
    categoria_id: 5,
    categoria_nome: 'Apoio Pedagógico & Filosofia',
    ano_publicacao: 100,
    idioma: 'pt',
    licenca: 'dominio-publico',
    capa_url: 'https://covers.openlibrary.org/b/id/14586617-L.jpg',
    sinopse: 'Texto fundacional da civilização ocidental e livro mais impresso da história humana.',
    fonte_id_externo: 'world-hist-1',
    links: [
      { id: 542, formato: 'html', url: 'https://openlibrary.org/search?q=A%20B%C3%ADblia%20Sagrada', link_externo: 1 }
    ]
  },
  {
    id: 468,
    titulo: 'O Livro Vermelho',
    autor_nome: 'Mao Tsé-Tung',
    categoria_id: 5,
    categoria_nome: 'Apoio Pedagógico & Filosofia',
    ano_publicacao: 1964,
    idioma: 'zh',
    licenca: 'dominio-publico',
    capa_url: 'https://covers.openlibrary.org/b/id/10515152-L.jpg',
    sinopse: 'Coletânea de citações e discursos do líder chinês com circulação massiva na segunda metade do século XX.',
    fonte_id_externo: 'world-hist-2',
    links: [
      { id: 543, formato: 'html', url: 'https://openlibrary.org/search?q=O%20Livro%20Vermelho%20Mao', link_externo: 1 }
    ]
  },
  {
    id: 471,
    titulo: 'O Alcorão',
    autor_nome: 'Tradição Islâmica',
    categoria_id: 5,
    categoria_nome: 'Apoio Pedagógico & Filosofia',
    ano_publicacao: 632,
    idioma: 'ar',
    licenca: 'dominio-publico',
    capa_url: 'https://covers.openlibrary.org/b/id/12779381-L.jpg',
    sinopse: 'Texto sagrado do Islã, considerado uma das obras fundamentais da literatura clássica árabe e da história das religiões mundiais.',
    fonte_id_externo: 'world-hist-5',
    links: [
      { id: 546, formato: 'html', url: 'https://openlibrary.org/search?q=O%20Alcor%C3%A3o', link_externo: 1 }
    ]
  },
  {
    id: 472,
    titulo: 'Um Conto de Duas Cidades',
    autor_nome: 'Charles Dickens',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1859,
    idioma: 'en',
    licenca: 'dominio-publico',
    capa_url: 'https://www.gutenberg.org/cache/epub/98/pg98.cover.medium.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em > 200 milhões. Título original: "A Tale of Two Cities" (1859). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-1',
    links: [
      { id: 547, formato: 'epub', url: 'https://www.gutenberg.org/ebooks/98.epub3.images', link_externo: 1 },
      { id: 548, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/98.pdf', link_externo: 1 },
      { id: 549, formato: 'html', url: 'https://www.gutenberg.org/files/98/98-h/98-h.htm', link_externo: 1 }
    ]
  },
  {
    id: 473,
    titulo: 'O Pequeno Príncipe',
    autor_nome: 'Antoine de Saint-Exupéry',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1943,
    idioma: 'fr',
    licenca: 'outro',
    capa_url: 'https://covers.openlibrary.org/b/id/10708272-M.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 200 milhões. Título original: "Le Petit Prince" (1943). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-2',
    links: [
      { id: 551, formato: 'html', url: 'https://openlibrary.org/search?q=O%20Pequeno%20Pr%C3%ADncipe%20Antoine%20de%20Saint-Exup%C3%A9ry', link_externo: 1 }
    ]
  },
  {
    id: 474,
    titulo: 'O Senhor dos Anéis (Obra Completa)',
    autor_nome: 'J. R. R. Tolkien',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1954,
    idioma: 'en',
    licenca: 'outro',
    capa_url: 'https://covers.openlibrary.org/b/id/15024346-L.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 150 milhões. Título original: "The Lord of the Rings" (1954). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-3',
    links: [
      { id: 552, formato: 'html', url: 'https://openlibrary.org/search?q=O%20Senhor%20dos%20An%C3%A9is%20Obra%20Completa', link_externo: 1 }
    ]
  },
  {
    id: 475,
    titulo: 'O Alquimista',
    autor_nome: 'Paulo Coelho',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1988,
    idioma: 'pt',
    licenca: 'outro',
    capa_url: 'https://covers.openlibrary.org/b/id/7414780-M.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 150 milhões. Título original: "O Alquimista" (1988). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-4',
    links: [
      { id: 554, formato: 'html', url: 'https://openlibrary.org/search?q=O%20Alquimista%20Paulo%20Coelho', link_externo: 1 }
    ]
  },
  {
    id: 476,
    titulo: 'Harry Potter e a Pedra Filosofal',
    autor_nome: 'J. K. Rowling',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1997,
    idioma: 'en',
    licenca: 'outro',
    capa_url: 'https://covers.openlibrary.org/b/id/15155833-M.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 120 milhões. Título original: "Harry Potter and the Philosopher\'s Stone" (1997). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-5',
    links: [
      { id: 556, formato: 'html', url: 'https://openlibrary.org/search?q=Harry%20Potter%20e%20a%20Pedra%20Filosofal%20J.%20K.%20Rowling', link_externo: 1 }
    ]
  },
  {
    id: 477,
    titulo: 'E Não Sobrou Nenhum (O Caso dos Dez Negrinhos)',
    autor_nome: 'Agatha Christie',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1939,
    idioma: 'en',
    licenca: 'outro',
    capa_url: 'https://covers.openlibrary.org/b/id/11172296-L.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 100 milhões. Título original: "And Then There Were None" (1939). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-6',
    links: [
      { id: 557, formato: 'html', url: 'https://openlibrary.org/search?q=E%20N%C3%A3o%20Sobrou%20Nenhum%20O%20Caso%20dos%20Dez%20Negrinhos', link_externo: 1 }
    ]
  },
  {
    id: 478,
    titulo: 'O Sonho da Câmara Vermelha',
    autor_nome: 'Cao Xueqin',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1791,
    idioma: 'zh',
    licenca: 'dominio-publico',
    capa_url: 'https://www.gutenberg.org/cache/epub/24264/pg24264.cover.medium.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 100 milhões. Título original: "紅樓夢 (Dream of the Red Chamber)" (1791). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-7',
    links: [
      { id: 558, formato: 'epub', url: 'https://www.gutenberg.org/ebooks/24264.epub3.images', link_externo: 1 },
      { id: 559, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/24264.pdf', link_externo: 1 },
      { id: 560, formato: 'html', url: 'https://www.gutenberg.org/files/24264/24264-h/24264-h.htm', link_externo: 1 }
    ]
  },
  {
    id: 479,
    titulo: 'O Hobbit',
    autor_nome: 'J. R. R. Tolkien',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1937,
    idioma: 'en',
    licenca: 'outro',
    capa_url: 'https://covers.openlibrary.org/b/id/14627509-M.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 100 milhões. Título original: "The Hobbit" (1937). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-8',
    links: [
      { id: 562, formato: 'html', url: 'https://openlibrary.org/search?q=O%20Hobbit%20J.%20R.%20R.%20Tolkien', link_externo: 1 }
    ]
  },
  {
    id: 480,
    titulo: 'As Aventuras de Alice no País das Maravilhas',
    autor_nome: 'Lewis Carroll',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1865,
    idioma: 'en',
    licenca: 'dominio-publico',
    capa_url: 'https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 100 milhões. Título original: "Alice\'s Adventures in Wonderland" (1865). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-9',
    links: [
      { id: 563, formato: 'epub', url: 'https://www.gutenberg.org/ebooks/11.epub3.images', link_externo: 1 },
      { id: 564, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/11.pdf', link_externo: 1 },
      { id: 565, formato: 'html', url: 'https://www.gutenberg.org/files/11/11-h/11-h.htm', link_externo: 1 }
    ]
  },
  {
    id: 481,
    titulo: 'Ela, a Feiticeira',
    autor_nome: 'H. Rider Haggard',
    categoria_id: 2,
    categoria_nome: 'Romance & Crônicas',
    ano_publicacao: 1887,
    idioma: 'en',
    licenca: 'dominio-publico',
    capa_url: 'https://www.gutenberg.org/cache/epub/3155/pg3155.cover.medium.jpg',
    sinopse: 'Obra consagrada da literatura mundial com circulação estimada em 83 milhões. Título original: "She: A History of Adventure" (1887). Reconhecido no cânone global de obras fundamentais.',
    fonte_id_externo: 'world-top100-10',
    links: [
      { id: 566, formato: 'epub', url: 'https://www.gutenberg.org/ebooks/3155.epub3.images', link_externo: 1 },
      { id: 567, formato: 'pdf', url: 'https://www.gutenberg.org/ebooks/3155.pdf', link_externo: 1 },
      { id: 568, formato: 'html', url: 'https://www.gutenberg.org/files/3155/3155-h/3155-h.htm', link_externo: 1 }
    ]
  }
];

export function obterLinkFallback(livroId: string | number, linkId?: string | number) {
  const lId = Number(livroId);
  const lnkId = linkId !== undefined && /^\d+$/.test(String(linkId)) ? Number(linkId) : null;
  const livro = FALLBACK_LIVROS.find((l) => l.id === lId);
  if (!livro) return null;
  const links = livro.links || [];
  if (lnkId !== null) {
    const linkExato = links.find((lnk: any) => lnk.id === lnkId);
    if (linkExato) {
      return { ...linkExato, livro_id: lId, titulo: livro.titulo, conteudo_texto: null };
    }
  }
  const linkPadrao = links[0];
  if (linkPadrao) {
    return { ...linkPadrao, livro_id: lId, titulo: livro.titulo, conteudo_texto: null };
  }
  return null;
}
