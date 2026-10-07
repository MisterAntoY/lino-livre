const { getDatabase } = require('./index');

function seed(dbInstance = null) {
  const db = dbInstance || getDatabase();

  console.log('Populando banco de dados com dados iniciais...');

  // Limpar tabelas existentes mantendo estrutura
  db.exec(`
    DELETE FROM emprestimos;
    DELETE FROM livros;
    DELETE FROM autores;
    DELETE FROM categorias;
    DELETE FROM sqlite_sequence WHERE name IN ('emprestimos', 'livros', 'autores', 'categorias');
  `);

  // Inserir Categorias
  const insertCategoria = db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)');
  const catLitBr = insertCategoria.run('Literatura Brasileira', 'Obras de autores clássicos e contemporâneos do Brasil').lastInsertRowid;
  const catFiccao = insertCategoria.run('Ficção Científica', 'Narrativas especulativas sobre ciência, futuro e tecnologia').lastInsertRowid;
  const catDistopia = insertCategoria.run('Distopia & Política', 'Ficções sociopolíticas sobre governos e sociedades distópicas').lastInsertRowid;
  const catRomance = insertCategoria.run('Romance Clássico', 'Romances históricos e literatura mundial').lastInsertRowid;
  const catHistoria = insertCategoria.run('História & Filosofia', 'Textos históricos, ensaios e reflexões filosóficas').lastInsertRowid;

  // Inserir Autores
  const insertAutor = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)');
  const autMachado = insertAutor.run('Machado de Assis', 'Brasileiro', 'Um dos maiores nomes da literatura brasileira, fundador da Academia Brasileira de Letras.').lastInsertRowid;
  const autClarice = insertAutor.run('Clarice Lispector', 'Brasileira', 'Escritora e jornalista aclamada por sua prosa intimista e introspectiva.').lastInsertRowid;
  const autOrwell = insertAutor.run('George Orwell', 'Britânico', 'Romancista e ensaísta conhecido por suas críticas ao autoritarismo e totalitarismo.').lastInsertRowid;
  const autAsimov = insertAutor.run('Isaac Asimov', 'Norte-Americano', 'Mestre da ficção científica e autor das Três Leis da Robótica.').lastInsertRowid;
  const autRosa = insertAutor.run('Guimarães Rosa', 'Brasileiro', 'Um dos mais importantes ficcionistas do modernismo brasileiro.').lastInsertRowid;
  const autAusten = insertAutor.run('Jane Austen', 'Britânica', 'Escritora inglesa clássica célebre por romances de costumes e ironia social.').lastInsertRowid;

  // Inserir Livros
  const insertLivro = db.prepare(`
    INSERT INTO livros (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, categoria_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const livDomCasmurro = insertLivro.run('Dom Casmurro', '978-8572323864', 1899, 5, 4, autMachado, catLitBr).lastInsertRowid;
  const livHoraEstrela = insertLivro.run('A Hora da Estrela', '978-8532508102', 1977, 4, 3, autClarice, catLitBr).lastInsertRowid;
  const liv1984 = insertLivro.run('1984', '978-8535914849', 1949, 6, 5, autOrwell, catDistopia).lastInsertRowid;
  const livRevolucao = insertLivro.run('A Revolução dos Bichos', '978-8535909555', 1945, 3, 3, autOrwell, catDistopia).lastInsertRowid;
  const livFundacao = insertLivro.run('Fundação', '978-8576570660', 1951, 4, 3, autAsimov, catFiccao).lastInsertRowid;
  const livEuRobo = insertLivro.run('Eu, Robô', '978-8576572008', 1950, 3, 3, autAsimov, catFiccao).lastInsertRowid;
  const livGrandeSertao = insertLivro.run('Grande Sertão: Veredas', '978-8535932591', 1956, 2, 2, autRosa, catLitBr).lastInsertRowid;
  const livOrgulho = insertLivro.run('Orgulho e Preconceito', '978-8582850787', 1813, 4, 4, autAusten, catRomance).lastInsertRowid;

  // Helper para formatar datas (YYYY-MM-DD)
  const formatarData = (d) => d.toISOString().split('T')[0];

  const hoje = new Date();
  
  // Data de 10 dias atrás
  const dMenos10 = new Date(hoje);
  dMenos10.setDate(hoje.getDate() - 10);
  
  // Data de 3 dias atrás
  const dMenos3 = new Date(hoje);
  dMenos3.setDate(hoje.getDate() - 3);

  // Data de ontem
  const dMenos1 = new Date(hoje);
  dMenos1.setDate(hoje.getDate() - 1);

  // Data daqui a 7 dias
  const dMais7 = new Date(hoje);
  dMais7.setDate(hoje.getDate() + 7);

  // Inserir Empréstimos
  const insertEmprestimo = db.prepare(`
    INSERT INTO emprestimos (livro_id, aluno_nome, aluno_matricula, data_emprestimo, data_devolucao_prevista, data_devolucao_real, status, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Empréstimo ativo (Dom Casmurro)
  insertEmprestimo.run(
    livDomCasmurro,
    'Lucas Silva',
    'MAT2026-001',
    formatarData(dMenos3),
    formatarData(dMais7),
    null,
    'ativo',
    'Empréstimo regular para trabalho escolar'
  );

  // 2. Empréstimo atrasado (Fundação - era para devolver 3 dias atrás)
  insertEmprestimo.run(
    livFundacao,
    'Mariana Costa',
    'MAT2026-042',
    formatarData(dMenos10),
    formatarData(dMenos3),
    null,
    'atrasado',
    'Notificação de atraso enviada por e-mail'
  );

  // 3. Empréstimo devolvido (A Hora da Estrela)
  insertEmprestimo.run(
    livHoraEstrela,
    'Gabriel Souza',
    'MAT2026-105',
    formatarData(dMenos10),
    formatarData(dMenos1),
    formatarData(dMenos1),
    'devolvido',
    'Livro entregue em perfeito estado'
  );

  console.log('Dados iniciais populados com sucesso!');
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
