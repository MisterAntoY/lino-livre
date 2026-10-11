const fs = require('fs');
const path = require('path');

const md = fs.readFileSync(path.join(__dirname, '../OS-100-LIVROS-MAIS-LIDOS-DO-MUNDO.md'), 'utf8');
const linhas = md.split('\n').filter(l => l.startsWith('| **'));

// Mapeamento específico de IDs do Gutenberg para clássicos
const gutenbergIds = {
  "Um Conto de Duas Cidades": 98,
  "As Aventuras de Alice no País das Maravilhas": 11,
  "O Sonho da Câmara Vermelha": 24264,
  "Ela, a Feiticeira": 3155,
  "Heidi": 1448,
  "Anne de Green Gables": 45,
  "Beleza Negra": 271,
  "A História do Pedro Coelho": 14838,
  "Uma Mensagem a Garcia": 7047,
  "Guerra e Paz": 2600,
  "As Aventuras de Pinóquio": 500,
  "O Grande Gatsby": 64317,
  "Ben-Hur: Uma História dos Tempos de Cristo": 2147,
  "Paulo e Virgínia": 14358,
  "O Vento nos Salgueiros": 289,
  "As Aventuras de Huckleberry Finn": 76,
  "Orgulho e Preconceito": 1342,
  "O Bom Soldado Švejk": 63219,
  "Kokoro": 44885,
  "Dom Quixote de la Mancha": 996
};

// Mapeamento de capas e slugs do Internet Archive / Open Library
const archiveSlugs = {
  "O Pequeno Príncipe": "the-little-prince-antoine-de-saint-exupery",
  "O Senhor dos Anéis (Obra Completa)": "the-lord-of-the-rings-trilogy-j-r-r-tolkien",
  "O Alquimista": "the-alchemist-paulo-coelho",
  "Harry Potter e a Pedra Filosofal": "harrypottersorce00rowl",
  "E Não Sobrou Nenhum (O Caso dos Dez Negrinhos)": "andthentherewere00chri",
  "O Hobbit": "the-hobbit-j.-r.-r.-tolkien",
  "O Leão, a Feiticeira e o Guarda-Roupa": "the-lion-the-witch-and-the-wardrobe-c.-s.-lewis",
  "O Código Da Vinci": "the-da-vinci-code-dan-brown",
  "Harry Potter e a Câmara Secreta": "harrypotterchamb00rowl",
  "Quem Pensa Enriquece": "thinkandgrowrich00napo",
  "O Apanhador no Campo de Centeio": "the-catcher-in-the-rye-j.-d.-salinger",
  "O Mundo de Sofia": "sophiesworld00gaar",
  "As Pontes de Madison": "bridgesofmadison00wall",
  "Cem Anos de Solidão": "onehundredyearso0000garc",
  "Lolita": "lolitanabokov00vlad",
  "Meu Filho, Meu Tesouro (Manual de Cuidados)": "commonsensebooko00spoc",
  "O Nome da Rosa": "nameofrose00ecou",
  "A Águia Pousou": "eaglehaslanded00higg",
  "Em Busca de Watership Down": "watershipdown00adam",
  "O Relatório Hite": "hitereportnation00hite",
  "A Teia de Charlotte": "charlottesweb00whit",
  "O Homem Ruivo": "gingerman00donl",
  "Uma Vida com Propósitos": "purposedrivenlif00warr",
  "Fernão Capelo Gaivota": "jonathanlivingst00bach",
  "Uma Lagarta Muito Comilona": "veryhungrycaterp00carl",
  "O Sol é Para Todos": "to-kill-a-mockingbird-harper-lee",
  "Jardim dos Esquecidos": "flowersinattic00andr",
  "Cosmos": "cosmos00saga",
  "Anjos e Demônios": "angelsdemons00brow",
  "Como Fazer Amigos e Influenciar Pessoas": "howtowinfriendsi00carn",
  "Alcoólicos Anônimos (O Livro Azul)": "alcoholicsanonym00alcopage",
  "Medo de Voar": "fearofflying00jong",
  "Assim Foi Temperado o Aço": "howsteelwastempe00ostr",
  "O Diário de Anne Frank": "diaryofyounggirl0000anne",
  "Seus Pontos Fracos": "yourerroneouszon00dyer",
  "Pássaros Feridos": "thornbirds00mccu",
  "Caim e Abel": "kaneabel00arch",
  "O Caçador de Pipas": "thekiterunner00khal",
  "O Vale das Bonecas": "valleydolls00susa",
  "E o Vento Levou": "gonewithwind0000mitc",
  "Rebecca, a Mulher Inesquecível": "rebeccaduma00daph",
  "A Revolta de Mamie Stover": "revoltofmamiesto00huie",
  "Os Homens que Não Amavam as Mulheres": "girlwithdragonta00lars",
  "O Símbolo Perdido": "lostsymbol00brow",
  "Jogos Vorazes": "thehungergames0000coll",
  "James e o Pêssego Gigante": "jamesgiantpeach00dahl",
  "A Jovem Guarda": "youngguard00fade",
  "Quem Mexeu no Meu Queijo?": "whomovedmycheese00john",
  "Uma Breve História do Tempo": "briefhistoryofti00hawk",
  "Sede de Viver (Biografia de Van Gogh)": "lustforlife00ston",
  "Os 7 Hábitos das Pessoas Altamente Eficazes": "7habitsofhighlye00cove",
  "Totto-chan: A Menina na Janela": "tottochanlittleg00kuro",
  "Sapiens: Uma Breve História da Humanidade": "sapiens-a-brief-history-of-humankind-yuval-noah-harari",
  "Campos Arroteados": "virginsoilupturn00shol",
  "A Profecia Celestina": "celestineprophec00redf",
  "A Culpa é das Estrelas": "the-fault-in-our-stars-john-green",
  "A Garota no Trem": "girlontrain00hawk",
  "A Cabana": "shack00youn",
  "Tio Stiopa": "unclestyopa00mikh",
  "O Poderoso Chefão": "thegodfather00mari",
  "Uma História de Amor (Love Story)": "lovestory00sega",
  "Em Chamas": "catchingfire00coll",
  "A Esperança": "mockingjay00coll",
  "Kitchen": "kitchen00yosh",
  "A Nebulosa de Andrômeda": "andromedanebula00yefremov",
  "Garota Exemplar": "gonegirl00flyn",
  "O Triângulo das Bermudas": "bermudatriangle00berl",
  "O Mundo se Despedaça": "thingsfallapart00ache",
  "Totem do Lobo": "wolftotem00jian",
  "Tubarão": "jaws00benc",
  "Eu Te Amarei Para Sempre": "loveyouforever00muns",
  "O Ponto de Encontro": "womensroom00fren",
  "O que Esperar Quando Você Está Esperando": "whattoexpectwhen00eise",
  "O Diário Secreto de Adrian Mole": "secretdiaryofadr00town",
  "A Expedição Kon-Tiki": "kontikiexpediti00heye",
  "Onde Vivem os Monstros": "wherewildthingsa00send",
  "O Poder do Pensamento Positivo": "powerofpositivet00peal",
  "O Segredo": "the-secret-rhonda-byrne",
  "Duna": "dune-frank-herbert",
  "A Fantástica Fábrica de Chocolate": "charliechocolate00dahl",
  "O Macaco Nu": "nakedapezoologis00morr",
  "A Menina que Roubava Livros": "thebookthief00zusa",
  "Matilda": "matilda00dahl",
  "O Homem que Sussurrava aos Cavalos": "horsewhisperer00evan",
  "Boa Noite, Lua": "goodnightmoon00brow",
  "1984": "1984-george-orwell",
  "A Revolução dos Bichos": "animalfarm00orwe"
};

const codigosIdiomas = {
  "Inglês": "en",
  "Francês": "fr",
  "Português": "pt",
  "Chinês": "zh",
  "Espanhol": "es",
  "Alemão": "de",
  "Italiano": "it",
  "Norueguês": "no",
  "Russo": "ru",
  "Holandês": "nl",
  "Sueco": "sv",
  "Hebraico": "he",
  "Japonês": "ja",
  "Tcheco": "cs"
};

const top100Mundiais = [];

for (const l of linhas) {
  const p = l.split('|').map(x => x.trim());
  if (p.length < 8) continue;

  const rank = parseInt(p[1].replace(/\*\*/g, ''), 10);
  const tituloPt = p[2].replace(/\*\*/g, '');
  const tituloOrig = p[3].replace(/\*/g, '');
  const autor = p[4];
  const ano = parseInt(p[5], 10) || 1900;
  const idiomaNome = p[6];
  const idioma = codigosIdiomas[idiomaNome] || 'en';
  const vendas = p[7].replace(/\*\*/g, '');
  const isDominioPublico = p[8].toLowerCase().includes('domínio');
  const licenca = isDominioPublico ? 'dominio-publico' : 'outro';

  let capaUrl = '';
  let links = [];
  let fonteSlug = isDominioPublico ? 'gutenberg' : 'openlibrary';

  if (gutenbergIds[tituloPt]) {
    const gid = gutenbergIds[tituloPt];
    fonteSlug = 'gutenberg';
    capaUrl = `https://www.gutenberg.org/cache/epub/${gid}/pg${gid}.cover.medium.jpg`;
    links = [
      { formato: "epub", url: `https://www.gutenberg.org/ebooks/${gid}.epub3.images` },
      { formato: "pdf", url: `https://www.gutenberg.org/ebooks/${gid}.pdf` },
      { formato: "html", url: `https://www.gutenberg.org/files/${gid}/${gid}-h/${gid}-h.htm` }
    ];
  } else if (archiveSlugs[tituloPt]) {
    const slug = archiveSlugs[tituloPt];
    fonteSlug = 'openlibrary';
    capaUrl = `https://archive.org/services/img/${slug}`;
    links = [
      { formato: "html", url: `https://archive.org/details/${slug}` },
      { formato: "pdf", url: `https://archive.org/download/${slug}/${slug}.pdf` }
    ];
  } else {
    // Fallback limpo baseado no título e busca externa do Internet Archive / Open Library
    const cleanSearch = encodeURIComponent(tituloOrig.replace(/[()]/g, ''));
    fonteSlug = 'openlibrary';
    capaUrl = `https://covers.openlibrary.org/b/id/8232000-M.jpg`;
    links = [
      { formato: "html", url: `https://archive.org/search?query=${cleanSearch}` }
    ];
  }

  top100Mundiais.push({
    rank,
    titulo: tituloPt,
    subtitulo: `${tituloOrig} • Mais de ${vendas} exemplares`,
    autor,
    ano,
    idioma,
    vendas,
    categoria: "🌟 Mais Lidos do Mundo",
    fonteSlug,
    fonteIdExterno: `top100-${String(rank).padStart(3, '0')}`,
    licenca,
    capaUrl,
    sinopse: `Consagrada obra literária mundial #${rank} no ranking dos livros mais lidos e vendidos de todos os tempos (${vendas} exemplares). Publicada originalmente em ${ano} no idioma ${idiomaNome}.`,
    links
  });
}

const arquivoDestino = path.join(__dirname, '../src/database/top100MundiaisSeedData.js');
const conteudoExport = `/**
 * Os 100 Livros Mais Lidos e Vendidos da História do Mundo
 * Metadados, capas e links externos oficiais (zero arquivos armazenados localmente).
 */

const top100Mundiais = ${JSON.stringify(top100Mundiais, null, 2)};

module.exports = { top100Mundiais };
`;

fs.writeFileSync(arquivoDestino, conteudoExport, 'utf8');
console.log(`✅ Gerados ${top100Mundiais.length} livros com sucesso em: ${arquivoDestino}`);
