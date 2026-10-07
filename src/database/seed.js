const { getDatabase } = require('./index');

function seed(dbInstance = null) {
  const db = dbInstance || getDatabase();

  console.log('Populando acervo com capas originais históricas...');

  db.exec(`
    DROP TABLE IF EXISTS emprestimos;
    DELETE FROM acessos_digitais;
    DELETE FROM livros;
    DELETE FROM autores;
    DELETE FROM categorias;
    DELETE FROM sqlite_sequence WHERE name IN ('acessos_digitais', 'livros', 'autores', 'categorias');
  `);

  // Inserir Categorias
  const insertCategoria = db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)');
  const catClassicos = insertCategoria.run('Clássicos Brasileiros', 'Obras-primas da literatura nacional em domínio público').lastInsertRowid;
  const catRomance = insertCategoria.run('Romance & Crônicas', 'Romances históricos, estudos de costumes e narrativas urbanas').lastInsertRowid;
  const catPoesia = insertCategoria.run('Teatro & Poesia', 'Dramaturgia e coletâneas poéticas clássicas').lastInsertRowid;
  const catIndianismo = insertCategoria.run('Romance Indianista', 'Obras da vertente indianista do romantismo brasileiro').lastInsertRowid;
  const catDidaticos = insertCategoria.run('Apoio Pedagógico & Filosofia', 'Textos formativos e reflexões sociopolíticas').lastInsertRowid;

  // Inserir Autores
  const insertAutor = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)');
  const autMachado = insertAutor.run('Machado de Assis', 'Brasileiro', 'Fundador da Academia Brasileira de Letras e gênio do Realismo mundial.').lastInsertRowid;
  const autAlencar = insertAutor.run('José de Alencar', 'Brasileiro', 'Patrono da literatura romântica brasileira e autor das principais narrativas indianistas.').lastInsertRowid;
  const autAluisio = insertAutor.run('Aluísio Azevedo', 'Brasileiro', 'Pioneiro do Naturalismo no Brasil e autor consagrado de O Cortiço.').lastInsertRowid;
  const autLimaBarreto = insertAutor.run('Lima Barreto', 'Brasileiro', 'Importante escritor e cronista pré-modernista, crítico das estruturas de poder da Primeira República.').lastInsertRowid;
  const autCastroAlves = insertAutor.run('Castro Alves', 'Brasileiro', 'O Poeta dos Escravos, célebre por sua lírica romântica e poesia abolicionista.').lastInsertRowid;

  // Inserir Livros Digitais
  const insertLivro = db.prepare(`
    INSERT INTO livros (
      titulo, subtitulo, sinopse, isbn, ano_publicacao, formato, 
      arquivo_url, capa_url, conteudo_texto, tamanho_mb, 
      downloads_count, leituras_count, autor_id, categoria_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Dom Casmurro (1899)
  const textoDomCasmurro = `CAPÍTULO I: DO TÍTULO

Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos. A viagem era curta, e os versos pode ser que não fossem inteiramente maus, porém o caso é que eles me adormeceram. Ao fechar dos olhos ouvi que me chamava: "Dom Casmurro!"

Não consultes dicionários. Casmurro não está aqui no sentido que eles lhe dão, mas no que lhe pôs o vulgo de homem calado e metido consigo. Dom veio por ironia, para atribuir-me fumos de fidalgo. Tudo por estar cochilando! Também não foi achado só meu; os vizinhos, que não gostam dos meus hábitos reclusos e calados, deram curso à alcunha, que afinal pegou.

Pois bem, faz algum tempo resolvi escrever a minha história; a história da minha mocidade, do seminário, de Capitu e dos seus olhos de ressaca...`;

  insertLivro.run(
    'Dom Casmurro',
    'Edição Original Garnier (1899)',
    'A narrativa em primeira pessoa de Bento Santiago sobre sua juventude, o amor de infância por Capitu e as dúvidas sobre a fidelidade conjugal.',
    '978-8572323864',
    1899,
    'PDF',
    'https://www.dominiopublico.gov.br/download/texto/bv000241.pdf',
    '/capas/dom_casmurro.jpg',
    textoDomCasmurro,
    1.8,
    142,
    380,
    autMachado,
    catClassicos
  );

  // 2. Memórias Póstumas de Brás Cubas (1881)
  const textoBrasCubas = `AO VERME QUE PRIMEIRO ROEU AS FRIAS CARNES DO MEU CADÁVER DEDICO COMO SAUDOSA LEMBRANÇA ESTAS MEMÓRIAS PÓSTUMAS

CAPÍTULO I: ÓBITO DO AUTOR

Algum tempo hesitei se devia abrir estas memórias pelo princípio ou pelo fim, isto é, se poria em primeiro lugar o meu nascimento ou a minha morte. Suposto o uso vulgar seja começar pelo nascimento, duas considerações me levaram a adotar diferente método: a primeira é que eu não sou propriamente um autor defunto, mas um defunto autor, para quem a campa foi outro berço; a segunda é que o escrito ficaria assim mais galante e mais novo. Moisés, que também contou a sua morte, não a pôs no introito: mas era um autor célebre...`;

  insertLivro.run(
    'Memórias Póstumas de Brás Cubas',
    'Edição Original Typographia Nacional (1881)',
    'Uma obra revolucionária narrada por um defunto-autor, inaugurando com ironia e genialidade psicológica o Realismo no Brasil.',
    '978-8535914841',
    1881,
    'EPUB',
    'https://www.dominiopublico.gov.br/download/texto/bv000215.pdf',
    '/capas/memorias_posthumas.jpg',
    textoBrasCubas,
    2.1,
    98,
    215,
    autMachado,
    catClassicos
  );

  // 3. O Cortiço (1890)
  const textoCortico = `CAPÍTULO I

João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro no bairro de Botafogo. Vivia de pão com queijo, dormia sobre o balcão e poupava cada réis que lhe caía nas mãos. Comprou depois uma casinha e um pedaço de terra, e ali começou a levantar um cortiço que não tardou em acolher dezenas de famílias operárias e tipos populares do Rio de Janeiro oitocentista...`;

  insertLivro.run(
    'O Cortiço',
    'Edição Original B. L. Garnier (1890)',
    'Obra-prima do naturalismo brasileiro, descrevendo a vida coletiva, as tensões sociais e o cotidiano de um cortiço carioca.',
    '978-8535909555',
    1890,
    'PDF',
    'https://www.dominiopublico.gov.br/download/texto/bv000194.pdf',
    '/capas/o_cortico.png',
    textoCortico,
    2.5,
    87,
    165,
    autAluisio,
    catRomance
  );

  // 4. O Alienista (1882)
  const textoAlienista = `CAPÍTULO I: DE COMO A VILA DE ITAGUAÍ GANHOU UMA CASA DE ORATES

As crônicas da vila de Itaguaí dizem que em tempos remotos viveu ali um certo médico, o Dr. Simão Bacamarte, filho da nobreza da terra e o maior dos médicos do Brasil, de Portugal e das Espanhas. Estudara em Coimbra e Pádua. Aos trinta e quatro anos regressou ao Brasil, não podendo el-rei alcançar dele que ficasse em Coimbra, regendo a universidade, ou em Lisboa, expedindo os negócios da monarquia.

A ciência, disse ele a Sua Majestade, era o seu emprego único; a terra natal, o seu teatro. Chegando a Itaguaí, dedicou-se com afinco ao estudo da loucura e fundou a célebre Casa Verde...`;

  insertLivro.run(
    'O Alienista',
    'Edição Original Papéis Avulsos (1882)',
    'A história do Dr. Simão Bacamarte e seu hospício em Itaguaí, uma sátira atemporal sobre os limites da sanidade, da ciência e do poder.',
    '978-8572321112',
    1882,
    'Web',
    'https://www.dominiopublico.gov.br/download/texto/bv000231.pdf',
    '/capas/o_alienista.png',
    textoAlienista,
    0.9,
    185,
    420,
    autMachado,
    catClassicos
  );

  // 5. Triste Fim de Policarpo Quaresma (1915)
  const textoPolicarpo = `PRIMEIRA PARTE: CAPÍTULO I - UMA LIÇÃO DE VIOLÃO

Como de hábito, às quatro e meia da tarde, Policarpo Quaresma, subsecretário do Arsenal de Guerra, largou o escritório, tomou o bonde de Santa Teresa e recolheu-se ao sossego de sua residência. O major amava o Brasil com fervor incondicional: estudava seu tupi, sua geografia e suas tradições patrióticas com uma dedicação incomparável...`;

  insertLivro.run(
    'Triste Fim de Policarpo Quaresma',
    'Edição Original Typ. Revista dos Tribunaes (1915)',
    'O retrato tragicômico de um patriota idealista que propõe o tupi-guarani como língua oficial do Brasil e enfrenta as contradições do país.',
    '978-8576570660',
    1915,
    'EPUB',
    'https://www.dominiopublico.gov.br/download/texto/bv000160.pdf',
    '/capas/policarpo_quaresma.png',
    textoPolicarpo,
    1.4,
    110,
    190,
    autLimaBarreto,
    catDidaticos
  );

  // 6. Espumas Flutuantes / O Navio Negreiro (1870)
  const textoCastro = `O NAVIO NEGREIRO (TRAGÉDIA NO MAR)

'Stamos em pleno mar... Doudo espasmo
De vaga em vaga o espaço rasga e ferve...
Veleiro audaz, nas trevas se desdobra,
E sobre as ondas a correr soberbe!

Era um sonho dantesco... o tombadilho
Que das luzernas avermelha o brilho,
Em sangue a se banhar.
Tinir de ferros... estalar do açoite...
Legiões de homens negros como a noite,
Horrendos a dançar!...`;

  insertLivro.run(
    'Espumas Flutuantes',
    'Edição Original Camillo de Lellis (1870)',
    'Coletânea que reúne O Navio Negreiro e outros poemas célebres de Castro Alves, ápice da poesia lírica e abolicionista brasileira.',
    '978-8582850787',
    1870,
    'Web',
    'https://www.dominiopublico.gov.br/download/texto/bv000067.pdf',
    '/capas/espumas_flutuantes.jpg',
    textoCastro,
    0.8,
    164,
    310,
    autCastroAlves,
    catPoesia
  );

  // 7. Iracema (1865)
  const textoIracema = `CAPÍTULO I

Verdes mares bravios de minha terra natal, onde canta a jandaia nas frondes da carnaúba; verdes mares, que brilhais como líquida esmeralda aos raios do sol nascente, perlongando as alvas praias ensombradas de coqueiros.

Além, muito além daquela serra, que ainda azula no horizonte, nasceu Iracema.
Iracema, a virgem dos lábios de mel, que tinha os cabelos mais negros que a asa da graúna e mais longos que seu talhe de palmeira. O favo da jati não era doce como seu sorriso; nem a baunilha recendia no bosque como seu hálito perfumado...`;

  insertLivro.run(
    'Iracema',
    'Edição Original Vianna & Filhos (1865)',
    'A lenda do Ceará e o romance fundacional entre a virgem dos lábios de mel e o guerreiro branco Martim.',
    '978-8508129843',
    1865,
    'PDF',
    'https://www.dominiopublico.gov.br/download/texto/bv000185.pdf',
    '/capas/iracema.png',
    textoIracema,
    1.2,
    125,
    290,
    autAlencar,
    catIndianismo
  );

  // 8. O Guarani (1857)
  const textoGuarani = `PRIMEIRA PARTE: OS CAVALEIROS

CAPÍTULO I: O CENÁRIO

De um dos cabeços da Serra dos Órgãos descai um fio d'água que se dirige para o norte, e engrossado com os mananciais que recebe no seu curso de dez léguas, torna-se rio caudal. É o Paquequer: saltando de cascata em cascata, enroscando-se como uma serpente, vai depois se estampar em formosa bacia... Ali vivia D. Antônio de Mariz com sua família e Peri, o nobre guerreiro goitacá...`;

  insertLivro.run(
    'O Guarani',
    'Edição Original B. L. Garnier (1857)',
    'O épico romance indianista retratando o amor e a lealdade de Peri e Cecília nas florestas do Brasil colonial.',
    '978-8508119042',
    1857,
    'PDF',
    'https://www.dominiopublico.gov.br/download/texto/bv000186.pdf',
    '/capas/o_guarani.jpg',
    textoGuarani,
    2.8,
    95,
    230,
    autAlencar,
    catIndianismo
  );

  console.log('Acervo inicial carregado com sucesso!');
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
