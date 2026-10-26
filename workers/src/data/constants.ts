// ────────────────────────────────────────────────────────────
// Constantes e Dimensões Estáticas do Acervo
// ────────────────────────────────────────────────────────────

export const META_GLOBAL_LIVROS = 10000000;

export const DIMENSOES_ESTATICAS = {
  fontes: [
    { id: 1, slug: 'wikisource' }, { id: 2, slug: 'gutenberg' }, { id: 3, slug: 'openstax' },
    { id: 4, slug: 'archive-org' }, { id: 5, slug: 'standardebooks' }, { id: 6, slug: 'cursa' },
    { id: 7, slug: 'uan' }, { id: 8, slug: 'github' }, { id: 9, slug: 'mit-ocw' },
    { id: 10, slug: 'khan-academy' }, { id: 11, slug: 'phet' }, { id: 12, slug: 'ck-12' },
    { id: 13, slug: 'oer-commons' }, { id: 14, slug: 'harvard-pll' }, { id: 15, slug: 'stanford-online' },
    { id: 16, slug: 'bradesco' }, { id: 17, slug: 'enap' }, { id: 18, slug: 'lumina' },
    { id: 19, slug: 'ifrs' }, { id: 20, slug: 'google-atelie' }, { id: 21, slug: 'openbootcamp' },
    { id: 22, slug: 'dio' }, { id: 23, slug: 'santander' }, { id: 24, slug: 'curso-em-video' },
    { id: 25, slug: 'europeana' }, { id: 26, slug: 'librivox' }, { id: 27, slug: 'doab' },
    { id: 28, slug: 'scielo' }, { id: 29, slug: 'bndigital' }, { id: 30, slug: 'camões' },
    { id: 31, slug: 'unesco' }, { id: 32, slug: 'ted' }, { id: 33, slug: 'edx' },
    { id: 34, slug: 'coursera' }
  ],
  categorias: [
    { id: 1, nome: 'Clássicos Brasileiros' }, { id: 2, nome: 'Romance & Crônicas' },
    { id: 3, nome: 'Teatro & Poesia' }, { id: 4, nome: 'Romance Indianista' },
    { id: 5, nome: 'Apoio Pedagógico & Filosofia' }, { id: 6, nome: 'Tecnologia & Programação' },
    { id: 7, nome: 'Matemática & Ciências Exatas' }, { id: 8, nome: 'Física & Astronomia' },
    { id: 9, nome: 'Química & Biologia' }, { id: 10, nome: 'História & Geografia' },
    { id: 11, nome: 'Filosofia & Sociologia' }, { id: 12, nome: 'Artes & Cultura' },
    { id: 13, nome: 'Infantojuvenil' }, { id: 14, nome: 'Direito & Legislação' },
    { id: 15, nome: 'Economia & Administração' }, { id: 16, nome: 'Medicina & Saúde' },
    { id: 17, nome: 'Psicologia & Desenvolvimento' }, { id: 18, nome: 'Idiomas & Linguística' },
    { id: 19, nome: 'Educação & Pedagogia' }, { id: 20, nome: 'África & Literatura Angolana' }
  ]
};

export const ORIGENS_PERMITIDAS = new Set([
  'https://lino-livre.linolivre.workers.dev',
  'https://linolivre.org',
  'https://www.linolivre.org',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]);
