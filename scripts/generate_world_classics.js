const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync('OS-100-LIVROS-MAIS-LIDOS-DO-MUNDO.md', 'utf8');
const lines = raw.split('\n');

const langMap = {
  'Inglês': 'en',
  'Francês': 'fr',
  'Alemão': 'de',
  'Português': 'pt',
  'Espanhol': 'es',
  'Italiano': 'it',
  'Russo': 'ru',
  'Chinês': 'zh',
  'Japonês': 'ja',
  'Norueguês': 'no',
  'Holandês': 'nl',
  'Sueco': 'sv',
  'Hebraico': 'he',
  'Tcheco': 'cs'
};

const gutenbergIds = {
  'Um Conto de Duas Cidades': 98,
  'O Sonho da Câmara Vermelha': 24264,
  'As Aventuras de Alice no País das Maravilhas': 11,
  'Ela, a Feiticeira': 3155,
  'Quem Pensa Enriquece': 67362,
  'Heidi': 1448,
  'Anne de Green Gables': 45,
  'Beleza Negra': 271,
  'A História do Pedro Coelho': 14838,
  'Uma Mensagem a Garcia': 76,
  'Guerra e Paz': 2600,
  'As Aventuras de Pinóquio': 500,
  'O Grande Gatsby': 64317,
  'Ben-Hur: Uma História dos Tempos de Cristo': 2147,
  'Paulo e Virgínia': 4070,
  'O Vento nos Salgueiros': 289,
  'As Aventuras de Huckleberry Finn': 76,
  'Orgulho e Preconceito': 1342,
  'O Bom Soldado Švejk': 47261,
  'Kokoro': 59400,
  'Dom Quixote de la Mancha': 996,
  'O Manifesto Comunista': 61,
  'A Bíblia Sagrada': 10
};

// 5 Grandes Obras Históricas de Circulação Preliminar
const historicalBooks = [
  {
    titulo: "A Bíblia Sagrada",
    subtitulo: "Tradição Judaico-Cristã • Circulação: > 5 a 7 bilhões de cópias",
    autor: "Vários Autores / Tradição Bíblica",
    ano: 100,
    idioma: "pt",
    categoria: "Apoio Pedagógico & Filosofia",
    fonteSlug: "gutenberg",
    fonteIdExterno: "world-hist-1",
    licenca: "dominio-publico",
    sinopse: "O texto mais lido, traduzido e impresso de toda a história humana. Coletânea de escrituras canônicas do Antigo e Novo Testamento em domínio público.",
    capaUrl: "https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg",
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/10" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/10.epub3.images" }
    ]
  },
  {
    titulo: "Dom Quixote de la Mancha",
    subtitulo: "El ingenioso hidalgo Don Quijote de la Mancha (1605/1615) • > 500 milhões",
    autor: "Miguel de Cervantes",
    ano: 1605,
    idioma: "es",
    categoria: "Romance & Crônicas",
    fonteSlug: "gutenberg",
    fonteIdExterno: "world-hist-2",
    licenca: "dominio-publico",
    sinopse: "A obra-prima fundadora do romance moderno. Narra as tragicômicas aventuras do fidalgo Alonso Quijano e de seu fiel escudeiro Sancho Pança.",
    capaUrl: "https://www.gutenberg.org/cache/epub/996/pg996.cover.medium.jpg",
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/996" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/996.epub3.images" }
    ]
  },
  {
    titulo: "O Manifesto Comunista",
    subtitulo: "Manifest der Kommunistischen Partei (1848) • > 500 milhões",
    autor: "Karl Marx & Friedrich Engels",
    ano: 1848,
    idioma: "de",
    categoria: "Apoio Pedagógico & Filosofia",
    fonteSlug: "gutenberg",
    fonteIdExterno: "world-hist-3",
    licenca: "dominio-publico",
    sinopse: "Um dos tratados sociopolíticos mais influentes da história mundial, analisando as lutas de classes, as transformações do trabalho e o desenvolvimento histórico.",
    capaUrl: "https://www.gutenberg.org/cache/epub/61/pg61.cover.medium.jpg",
    links: [
      { formato: "html", url: "https://www.gutenberg.org/ebooks/61" },
      { formato: "epub", url: "https://www.gutenberg.org/ebooks/61.epub3.images" }
    ]
  },
  {
    titulo: "Citações do Presidente Mao Tsé-Tung (O Livro Vermelho)",
    subtitulo: "毛主席语录 (1964) • > 900 milhões a 1 bilhão de exemplares",
    autor: "Mao Tsé-Tung",
    ano: 1964,
    idioma: "zh",
    categoria: "Apoio Pedagógico & Filosofia",
    fonteSlug: "openlibrary",
    fonteIdExterno: "world-hist-4",
    licenca: "outro",
    sinopse: "Coletânea histórica de aforismos e discursos de Mao Tsé-Tung amplamente impressa e distribuída na China no século XX.",
    capaUrl: "https://raw.githubusercontent.com/sindresorhus/awesome/main/media/logo.png",
    links: [
      { formato: "html", url: "https://openlibrary.org/search?q=Quotations+from+Chairman+Mao" }
    ]
  },
  {
    titulo: "O Alcorão",
    subtitulo: "القرآن الكريم • > 800 milhões de cópias",
    autor: "Tradição Islâmica",
    ano: 632,
    idioma: "ar",
    categoria: "Apoio Pedagógico & Filosofia",
    fonteSlug: "openlibrary",
    fonteIdExterno: "world-hist-5",
    licenca: "dominio-publico",
    sinopse: "Texto sagrado do Islã, considerado uma das obras fundamentais da literatura clássica árabe e da história das religiões mundiais.",
    capaUrl: "https://raw.githubusercontent.com/sindresorhus/awesome/main/media/logo.png",
    links: [
      { formato: "html", url: "https://openlibrary.org/search?q=Quran" }
    ]
  }
];

const parsed100 = [];

for (const line of lines) {
  if (line.startsWith('| **')) {
    const parts = line.split('|').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 7) {
      const num = parts[0].replace(/\*\*/g, '');
      const titulo = parts[1].replace(/\*\*/g, '');
      const tituloOrig = parts[2].replace(/\*/g, '');
      const autor = parts[3];
      const ano = parseInt(parts[4]) || 1950;
      const idiomaNome = parts[5];
      const vendas = parts[6].replace(/\*\*/g, '');
      const licencaRaw = parts[7] || 'Direitos Comerciais';

      const isDP = licencaRaw.includes('Domínio Público') || licencaRaw.includes('CC');
      const licenca = isDP ? 'dominio-publico' : 'outro';
      const langCode = langMap[idiomaNome] || 'en';

      let categoria = 'Romance & Crônicas';
      if (['Quem Pensa Enriquece', 'Como Fazer Amigos e Influenciar Pessoas', 'Uma Vida com Propósitos',
           'Os 7 Hábitos das Pessoas Altamente Eficazes', 'O Poder do Pensamento Positivo',
           'O Segredo', 'O Relatório Hite', 'Sapiens: Uma Breve História da Humanidade',
           'Uma Breve História do Tempo', 'Cosmos', 'Uma Mensagem a Garcia',
           'Meu Filho, Meu Tesouro (Manual de Cuidados)', 'Alcoólicos Anônimos (O Livro Azul)',
           'O que Esperar Quando Você Está Esperando', 'O Macaco Nu'].includes(titulo)) {
        categoria = 'Apoio Pedagógico & Filosofia';
      }

      const gId = gutenbergIds[titulo];
      let fonteSlug = isDP ? (gId ? 'gutenberg' : 'wikisource') : 'openlibrary';
      const fonteIdExterno = `world-top100-${num}`;

      let capaUrl = 'https://raw.githubusercontent.com/sindresorhus/awesome/main/media/logo.png';
      const links = [];

      if (gId) {
        capaUrl = `https://www.gutenberg.org/cache/epub/${gId}/pg${gId}.cover.medium.jpg`;
        links.push({ formato: 'html', url: `https://www.gutenberg.org/ebooks/${gId}` });
        links.push({ formato: 'epub', url: `https://www.gutenberg.org/ebooks/${gId}.epub3.images` });
      } else if (isDP) {
        const query = encodeURIComponent(tituloOrig || titulo);
        links.push({ formato: 'html', url: `https://openlibrary.org/search?q=${query}` });
      } else {
        const query = encodeURIComponent(`${tituloOrig} ${autor}`);
        links.push({ formato: 'html', url: `https://openlibrary.org/search?q=${query}` });
      }

      const sinopse = `Obra consagrada da literatura mundial com circulação estimada em ${vendas}. Título original: "${tituloOrig}" (${ano}). Reconhecido no cânone global de obras fundamentais.`;

      parsed100.push({
        titulo,
        subtitulo: `${tituloOrig} (${ano}) • Circulação: ${vendas}`,
        autor,
        ano,
        idioma: langCode,
        categoria,
        fonteSlug,
        fonteIdExterno,
        licenca,
        sinopse,
        capaUrl,
        links
      });
    }
  }
}

const allBooks = [...historicalBooks, ...parsed100];

console.log(`Gerando dataset com ${allBooks.length} obras da literatura mundial...`);

const outputCode = `/**
 * Os 100 Livros Mais Lidos e Vendidos da História do Mundo (Mais 5 Obras Históricas de Circulação Universal)
 * Compilado a partir de OS-100-LIVROS-MAIS-LIDOS-DO-MUNDO.md
 * Em estrita conformidade com AGENTS.md:
 * - Apenas metadados e redirecionamentos externos (Project Gutenberg, Open Library, Wikisource).
 * - ZERO armazenamento local de binários/livros.
 */

const worldClassicsList = ${JSON.stringify(allBooks, null, 2)};

module.exports = { worldClassicsList };
`;

fs.writeFileSync('src/database/worldClassicsSeedData.js', outputCode, 'utf8');
console.log('src/database/worldClassicsSeedData.js gerado com sucesso!');
