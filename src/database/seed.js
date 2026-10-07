const { getDatabase } = require('./index');

function seed(dbInstance = null) {
  const db = dbInstance || getDatabase();

  console.log('Populando banco de dados com catálogo digital online...');

  // Dropar tabelas antigas se ainda existirem da versão anterior
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
  const catFiccao = insertCategoria.run('Ficção Científica & Fantasia', 'Narrativas do imaginário, exploração espacial e aventuras').lastInsertRowid;
  const catRomance = insertCategoria.run('Romance & Crônicas', 'Romances de época, estudos sociais e crônicas urbanas').lastInsertRowid;
  const catTeatro = insertCategoria.run('Teatro & Poesia', 'Dramaturgia clássica e coletâneas poéticas para estudo escolar').lastInsertRowid;
  const catDidaticos = insertCategoria.run('Apoio Pedagógico & Filosofia', 'Textos formativos, ensaios e material de apoio escolar').lastInsertRowid;

  // Inserir Autores
  const insertAutor = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)');
  const autMachado = insertAutor.run('Machado de Assis', 'Brasileiro', 'Fundador da Academia Brasileira de Letras e um dos maiores mestres do realismo mundial.').lastInsertRowid;
  const autAlencar = insertAutor.run('José de Alencar', 'Brasileiro', 'Um dos expoentes do romantismo brasileiro e autor de obras indianistas fundamentais.').lastInsertRowid;
  const autAluisio = insertAutor.run('Aluísio Azevedo', 'Brasileiro', 'Pioneiro do movimento naturalista no Brasil e autor de "O Cortiço".').lastInsertRowid;
  const autLimaBarreto = insertAutor.run('Lima Barreto', 'Brasileiro', 'Importante escritor e jornalista pré-modernista, crítico das desigualdades sociais da Primeira República.').lastInsertRowid;
  const autCastroAlves = insertAutor.run('Castro Alves', 'Brasileiro', 'O "Poeta dos Escravos", célebre por sua poesia lírica e abolicionista do condoreirismo.').lastInsertRowid;

  // Inserir Livros Digitais
  const insertLivro = db.prepare(`
    INSERT INTO livros (
      titulo, subtitulo, sinopse, isbn, ano_publicacao, formato, 
      arquivo_url, capa_url, conteudo_texto, tamanho_mb, 
      downloads_count, leituras_count, autor_id, categoria_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Dom Casmurro
  const textoDomCasmurro = `CAPÍTULO I: DO TÍTULO

Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos. A viagem era curta, e os versos pode ser que não fossem inteiramente maus, porém o caso é que eles me adormeceram. Ao fechar dos olhos ouvi que me chamava: "Dom Casmurro!"

Não consultes dicionários. Casmurro não está aqui no sentido que eles lhe dão, mas no que lhe pôs o vulgo de homem calado e metido consigo. Dom veio por ironia, para atribuir-me fumos de fidalgo. Tudo por estar cochilando! Também não foi achado só meu; os vizinhos, que não gostam dos meus hábitos reclusos e calados, deram curso à alcunha, que afinal pegou.

Pois bem, faz algum tempo resolvi escrever a minha história; a história da minha mocidade, do seminário, de Capitu e dos meus olhos de ressaca...`;

  const liv1 = insertLivro.run(
    'Dom Casmurro',
    'Edição Digital Escolar Anotada',
    'A narrativa em primeira pessoa de Bento Santiago sobre sua juventude, o amor de infância por Capitu e os conflitos que marcaram sua vida.',
    '978-8572323864',
    1899,
    'PDF',
    'https://www.dominiopublico.gov.br/download/texto/bv000241.pdf',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    textoDomCasmurro,
    1.8,
    142,
    380,
    autMachado,
    catClassicos
  ).lastInsertRowid;

  // 2. Memórias Póstumas de Brás Cubas
  const textoBrasCubas = `AO VERME QUE PRIMEIRO ROEU AS FRIAS CARNES DO MEU CADÁVER DEDICO COMO SAUDOSA LEMBRANÇA ESTAS MEMÓRIAS PÓSTUMAS

CAPÍTULO I: ÓBITO DO AUTOR

Algum tempo hesitei se devia abrir estas memórias pelo princípio ou pelo fim, isto é, se poria em primeiro lugar o meu nascimento ou a minha morte. Suposto o uso vulgar seja começar pelo nascimento, duas considerações me levaram a adotar diferente método: a primeira é que eu não sou propriamente um autor defunto, mas um defunto autor, para quem a campa foi outro berço; a segunda é que o escrito ficaria assim mais galante e mais novo. Moisés, que também contou a sua morte, não a pôs no introito: mas era um autor célebre...`;

  const liv2 = insertLivro.run(
    'Memórias Póstumas de Brás Cubas',
    'Texto Integral com Notas Explicativas',
    'Uma obra revolucionária contada por um defunto-autor, inaugurando com ironia e genialidade o Realismo no Brasil.',
    '978-8535914841',
    1881,
    'EPUB',
    'https://www.dominiopublico.gov.br/download/texto/bv000215.pdf',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    textoBrasCubas,
    2.1,
    98,
    215,
    autMachado,
    catClassicos
  ).lastInsertRowid;

  // 3. O Alienista
  const textoAlienista = `CAPÍTULO I: DE COMO A VILA DE ITAGUAÍ GANHOU UMA CASA DE ORATES

As crônicas da vila de Itaguaí dizem que em tempos remotos viveu ali um certo médico, o Dr. Simão Bacamarte, filho da nobreza da terra e o maior dos médicos do Brasil, de Portugal e das Espanhas. Estudara em Coimbra e Pádua. Aos trinta e quatro anos regressou ao Brasil, não podendo el-rei alcançar dele que ficasse em Coimbra, regendo a universidade, ou em Lisboa, expedindo os negócios da monarquia.

A ciência, disse ele a Sua Majestade, era o seu emprego único; a terra natal, o seu teatro. Chegando a Itaguaí, dedicou-se com afinco ao estudo da loucura e fundou a célebre Casa Verde...`;

  const liv3 = insertLivro.run(
    'O Alienista',
    'Novela Satírica sobre a Razão Humana',
    'A história do Dr. Simão Bacamarte e seu hospício em Itaguaí, uma sátira atemporal sobre os limites da sanidade e do poder.',
    '978-8572321112',
    1882,
    'Web',
    'https://www.dominiopublico.gov.br/download/texto/bv000231.pdf',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    textoAlienista,
    0.9,
    185,
    420,
    autMachado,
    catClassicos
  ).lastInsertRowid;

  // 4. O Cortiço
  const textoCortico = `CAPÍTULO I

João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro no bairro de Botafogo. Vivia de pão com queijo, dormia sobre o balcão e poupava cada réis que lhe caía nas mãos. Comprou depois uma casinha e um pedaço de terra, e ali começou a levantar um cortiço que não tardou em acolher dezenas de famílias operárias e tipos populares do Rio de Janeiro oitocentista...`;

  const liv4 = insertLivro.run(
    'O Cortiço',
    'Retrato Naturalista do Brasil Oitocentista',
    'Obra-prima do naturalismo brasileiro, descrevendo a vida coletiva, as tensões sociais e o cotidiano de um cortiço carioca.',
    '978-8535909555',
    1890,
    'PDF',
    'https://www.dominiopublico.gov.br/download/texto/bv000194.pdf',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80',
    textoCortico,
    2.5,
    87,
    165,
    autAluisio,
    catRomance
  ).lastInsertRowid;

  // 5. Triste Fim de Policarpo Quaresma
  const textoPolicarpo = `PRIMEIRA PARTE: CAPÍTULO I - UMA LIÇÃO DE VIOLÃO

Como de hábito, às quatro e meia da tarde, Policarpo Quaresma, subsecretário do Arsenal de Guerra, largou o escritório, tomou o bonde de Santa Teresa e recolheu-se ao sossego de sua residência. O major amava o Brasil com fervor incondicional: estudava seu tupi, sua geografia e suas tradições patrióticas com uma dedicação incomparável...`;

  const liv5 = insertLivro.run(
    'Triste Fim de Policarpo Quaresma',
    'Sátira Política e Nacionalista',
    'O retrato tragicômico de um patriota idealista que propõe o tupi-guarani como língua oficial do Brasil e enfrenta as contradições do país.',
    '978-8576570660',
    1915,
    'EPUB',
    'https://www.dominiopublico.gov.br/download/texto/bv000160.pdf',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
    textoPolicarpo,
    1.4,
    110,
    190,
    autLimaBarreto,
    catDidaticos
  ).lastInsertRowid;

  // 6. O Navio Negreiro e Espumas Flutuantes
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

  const liv6 = insertLivro.run(
    'O Navio Negreiro e Espumas Flutuantes',
    'Poesia Condoreira e Abolicionista',
    'Os poemas mais célebres de Castro Alves, denunciando o tráfico negreiro e expressando o vigor lírico da poesia romântica brasileira.',
    '978-8582850787',
    1869,
    'Web',
    'https://www.dominiopublico.gov.br/download/texto/bv000067.pdf',
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80',
    textoCastro,
    0.8,
    164,
    310,
    autCastroAlves,
    catTeatro
  ).lastInsertRowid;

  // Inserir Registros de Acessos Recentes
  const insertAcesso = db.prepare(`
    INSERT INTO acessos_digitais (livro_id, tipo_acesso, aluno_nome, aluno_turma, criado_em)
    VALUES (?, ?, ?, ?, datetime('now', ?))
  `);

  insertAcesso.run(liv1, 'download', 'Beatriz Santos', '3º Ano EM', '-2 hours');
  insertAcesso.run(liv1, 'leitura_online', 'Guilherme Rocha', '2º Ano EM', '-1 hour');
  insertAcesso.run(liv3, 'leitura_online', 'Larissa Duarte', '1º Ano EM', '-45 minutes');
  insertAcesso.run(liv2, 'download', 'Matheus Fernandes', '3º Ano EM', '-30 minutes');
  insertAcesso.run(liv6, 'leitura_online', 'Camila Nogueira', '9º Ano EF', '-10 minutes');

  console.log('Catálogo digital populado com sucesso!');
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
