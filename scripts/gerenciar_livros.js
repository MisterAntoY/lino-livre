#!/usr/bin/env node

/**
 * Utilitário de Gestão e Controle do Acervo de Livros — Lino Livre
 * 
 * Uso:
 *   node scripts/gerenciar_livros.js --resumo
 *   node scripts/gerenciar_livros.js --listar [--limite 50] [--pagina 1]
 *   node scripts/gerenciar_livros.js --buscar "python"
 *   node scripts/gerenciar_livros.js --fonte "github-bibliotecadev"
 *   node scripts/gerenciar_livros.js --detalhe <id>
 *   node scripts/gerenciar_livros.js --exportar-csv [arquivo.csv]
 *   node scripts/gerenciar_livros.js --remover <id>
 *   node scripts/gerenciar_livros.js --remover-por-fonte <slug_fonte>
 */

const fs = require('node:fs');
const path = require('node:path');
const { getDatabase } = require('../src/database');

const db = getDatabase();

const args = process.argv.slice(2);
const comando = args[0] || '--resumo';

function printHeader(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

function resumo() {
  printHeader('📊 RESUMO DO ACERVO DE LIVROS NO BANCO DE DADOS');

  const total = db.prepare('SELECT COUNT(*) AS total FROM livros').get().total;
  const totalLinks = db.prepare('SELECT COUNT(*) AS total FROM links_livros').get().total;

  console.log(`\n📚 Total de Livros Cadastrados: ${total}`);
  console.log(`🔗 Total de Links Externos:    ${totalLinks}\n`);

  console.log('--- DISTRIBUIÇÃO POR FONTE EXTERNA ---');
  const porFonte = db.prepare(`
    SELECT f.slug, f.nome, COUNT(l.id) AS total
    FROM fontes f
    LEFT JOIN livros l ON l.fonte_id = f.id
    GROUP BY f.id
    HAVING total > 0
    ORDER BY total DESC;
  `).all();
  for (const f of porFonte) {
    console.log(`  • [${f.slug.padEnd(22)}] ${f.nome}: ${f.total} livros`);
  }

  console.log('\n--- DISTRIBUIÇÃO POR LICENÇA ---');
  const porLicenca = db.prepare(`
    SELECT licenca, COUNT(*) AS total
    FROM livros
    GROUP BY licenca
    ORDER BY total DESC;
  `).all();
  for (const l of porLicenca) {
    console.log(`  • ${l.licenca.padEnd(18)}: ${l.total} livros`);
  }

  console.log('\n--- DISTRIBUIÇÃO POR IDIOMA ---');
  const porIdioma = db.prepare(`
    SELECT idioma, COUNT(*) AS total
    FROM livros
    GROUP BY idioma
    ORDER BY total DESC;
  `).all();
  for (const i of porIdioma) {
    console.log(`  • ${i.idioma.padEnd(6)}: ${i.total} livros`);
  }

  console.log('\n💡 Comandos disponíveis para você ter controle:');
  console.log('  node scripts/gerenciar_livros.js --listar');
  console.log('  node scripts/gerenciar_livros.js --buscar "termo"');
  console.log('  node scripts/gerenciar_livros.js --fonte <slug_da_fonte>');
  console.log('  node scripts/gerenciar_livros.js --detalhe <id>');
  console.log('  node scripts/gerenciar_livros.js --exportar-csv');
  console.log('  node scripts/gerenciar_livros.js --remover <id>\n');
}

function listar() {
  let limite = 30;
  let pagina = 1;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limite' && args[i + 1]) limite = parseInt(args[i + 1], 10) || 30;
    if (args[i] === '--pagina' && args[i + 1]) pagina = parseInt(args[i + 1], 10) || 1;
  }

  const offset = (pagina - 1) * limite;
  const total = db.prepare('SELECT COUNT(*) AS total FROM livros').get().total;

  printHeader(`📚 LISTAGEM DE LIVROS (Página ${pagina} de ${Math.ceil(total / limite)})`);

  const livros = db.prepare(`
    SELECT 
      l.id, l.titulo, l.idioma, l.licenca,
      COALESCE(a.nome, 'Autor Desconhecido') AS autor,
      COALESCE(f.slug, 'sem-fonte') AS fonte_slug
    FROM livros l
    LEFT JOIN autores a ON a.id = l.autor_id
    LEFT JOIN fontes f ON f.id = l.fonte_id
    ORDER BY l.id ASC
    LIMIT ? OFFSET ?
  `).all(limite, offset);

  for (const l of livros) {
    console.log(`[#${String(l.id).padStart(3, '0')}] "${l.titulo.slice(0, 42).padEnd(42)}" | Autor: ${l.autor.slice(0, 20).padEnd(20)} | Fonte: ${l.fonte_slug.padEnd(18)} | Licença: ${l.licenca}`);
  }

  console.log(`\nExibindo ${livros.length} de ${total} livros.`);
  if (offset + limite < total) {
    console.log(`👉 Para ver mais: node scripts/gerenciar_livros.js --listar --pagina ${pagina + 1}`);
  }
}

function buscar() {
  const termo = args[1];
  if (!termo) {
    console.error('❌ Especifique um termo de busca: node scripts/gerenciar_livros.js --buscar "python"');
    process.exit(1);
  }

  printHeader(`🔍 BUSCA POR: "${termo}"`);

  const livros = db.prepare(`
    SELECT 
      l.id, l.titulo, l.idioma, l.licenca,
      COALESCE(a.nome, 'Autor Desconhecido') AS autor,
      COALESCE(f.slug, 'sem-fonte') AS fonte_slug
    FROM livros l
    LEFT JOIN autores a ON a.id = l.autor_id
    LEFT JOIN fontes f ON f.id = l.fonte_id
    WHERE l.titulo LIKE ? OR a.nome LIKE ?
    ORDER BY l.id ASC
  `).all(`%${termo}%`, `%${termo}%`);

  if (livros.length === 0) {
    console.log(`Nenhum livro encontrado com o termo "${termo}".`);
    return;
  }

  console.log(`Encontrados ${livros.length} livro(s):\n`);
  for (const l of livros) {
    console.log(`[#${String(l.id).padStart(3, '0')}] "${l.titulo}"`);
    console.log(`      Autor: ${l.autor} | Fonte: ${l.fonte_slug} | Idioma: ${l.idioma} | Licença: ${l.licenca}`);
  }
}

function porFonte() {
  const slug = args[1];
  if (!slug) {
    console.error('❌ Especifique a slug da fonte: node scripts/gerenciar_livros.js --fonte "github-bibliotecadev"');
    process.exit(1);
  }

  printHeader(`📦 LIVROS DA FONTE: "${slug}"`);

  const livros = db.prepare(`
    SELECT 
      l.id, l.titulo, l.idioma, l.licenca,
      COALESCE(a.nome, 'Autor Desconhecido') AS autor,
      f.nome AS fonte_nome
    FROM livros l
    LEFT JOIN autores a ON a.id = l.autor_id
    JOIN fontes f ON f.id = l.fonte_id
    WHERE f.slug = ? OR f.slug LIKE ?
    ORDER BY l.id ASC
  `).all(slug, `%${slug}%`);

  if (livros.length === 0) {
    console.log(`Nenhum livro cadastrado para a fonte "${slug}".`);
    return;
  }

  console.log(`Total: ${livros.length} livros encontrados.\n`);
  for (const l of livros) {
    console.log(`[#${String(l.id).padStart(3, '0')}] "${l.titulo}" — ${l.autor} (${l.idioma}, ${l.licenca})`);
  }
}

function detalhe() {
  const id = parseInt(args[1], 10);
  if (!id) {
    console.error('❌ Especifique o ID do livro: node scripts/gerenciar_livros.js --detalhe 1');
    process.exit(1);
  }

  const livro = db.prepare(`
    SELECT 
      l.*,
      COALESCE(a.nome, 'Não informado') AS autor_nome,
      COALESCE(c.nome, 'Geral') AS categoria_nome,
      COALESCE(f.nome, 'Manual') AS fonte_nome,
      f.slug AS fonte_slug
    FROM livros l
    LEFT JOIN autores a ON a.id = l.autor_id
    LEFT JOIN categorias c ON c.id = l.categoria_id
    LEFT JOIN fontes f ON f.id = l.fonte_id
    WHERE l.id = ?
  `).get(id);

  if (!livro) {
    console.error(`❌ Livro com ID ${id} não encontrado.`);
    process.exit(1);
  }

  printHeader(`📖 DETALHES DO LIVRO #${livro.id}: ${livro.titulo}`);
  console.log(`Título:       ${livro.titulo}`);
  if (livro.subtitulo) console.log(`Subtítulo:    ${livro.subtitulo}`);
  console.log(`Autor:        ${livro.autor_nome}`);
  console.log(`Categoria:    ${livro.categoria_nome}`);
  console.log(`Fonte:        ${livro.fonte_nome} (${livro.fonte_slug || 'n/a'})`);
  console.log(`Licença:      ${livro.licenca}`);
  console.log(`Idioma:       ${livro.idioma}`);
  console.log(`Páginas:      ${livro.paginas || 'N/A'}`);
  console.log(`Capa:         ${livro.capa_url || 'N/A'}`);
  console.log(`Cadastrado:   ${livro.criado_em}`);

  const links = db.prepare('SELECT * FROM links_livros WHERE livro_id = ?').all(id);
  console.log('\n🔗 Links Externos de Leitura/Download:');
  if (links.length === 0) {
    console.log('   (Nenhum link cadastrado)');
  } else {
    for (const l of links) {
      console.log(`   • [${l.formato.toUpperCase()}] ${l.url}`);
    }
  }
}

function exportarCSV() {
  const destino = args[1] || path.join(__dirname, '../catalogo_livros.csv');
  printHeader(`💾 EXPORTANDO CATÁLOGO COMPLETO PARA CSV`);

  const rows = db.prepare(`
    SELECT 
      l.id,
      l.titulo,
      COALESCE(l.subtitulo, '') AS subtitulo,
      COALESCE(a.nome, '') AS autor,
      COALESCE(c.nome, '') AS categoria,
      COALESCE(f.slug, '') AS fonte,
      l.idioma,
      l.licenca,
      l.ano_publicacao,
      l.paginas,
      COALESCE(GROUP_CONCAT(ll.formato || ': ' || ll.url, ' | '), '') AS links_externos
    FROM livros l
    LEFT JOIN autores a ON a.id = l.autor_id
    LEFT JOIN categorias c ON c.id = l.categoria_id
    LEFT JOIN fontes f ON f.id = l.fonte_id
    LEFT JOIN links_livros ll ON ll.livro_id = l.id
    GROUP BY l.id
    ORDER BY l.id ASC
  `).all();

  const cabecalho = ['ID', 'Titulo', 'Subtitulo', 'Autor', 'Categoria', 'Fonte', 'Idioma', 'Licenca', 'Ano', 'Paginas', 'LinksExternos'];
  
  function escapeCSV(val) {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  const linhas = [cabecalho.map(escapeCSV).join(',')];
  for (const r of rows) {
    linhas.push([
      r.id,
      r.titulo,
      r.subtitulo,
      r.autor,
      r.categoria,
      r.fonte,
      r.idioma,
      r.licenca,
      r.ano_publicacao || '',
      r.paginas || '',
      r.links_externos
    ].map(escapeCSV).join(','));
  }

  fs.writeFileSync(destino, '\uFEFF' + linhas.join('\n'), 'utf8');
  console.log(`✅ Catálogo exportado com sucesso para:`);
  console.log(`   ${destino}`);
  console.log(`\nForam exportados ${rows.length} registros com metadados e links externos.`);
  console.log(`Você pode abrir este arquivo diretamente no Microsoft Excel ou Planilhas Google.`);
}

function remover() {
  const id = parseInt(args[1], 10);
  if (!id) {
    console.error('❌ Especifique o ID do livro a remover: node scripts/gerenciar_livros.js --remover 10');
    process.exit(1);
  }

  const livro = db.prepare('SELECT id, titulo FROM livros WHERE id = ?').get(id);
  if (!livro) {
    console.error(`❌ Livro com ID ${id} não encontrado.`);
    process.exit(1);
  }

  db.prepare('DELETE FROM livros WHERE id = ?').run(id);
  console.log(`\n🗑️ Livro #${id} ("${livro.titulo}") e seus links externos associados foram removidos com sucesso.`);
}

function removerPorFonte() {
  const slug = args[1];
  if (!slug) {
    console.error('❌ Especifique o slug da fonte: node scripts/gerenciar_livros.js --remover-por-fonte "github-bibliotecadev"');
    process.exit(1);
  }

  const fonte = db.prepare('SELECT id, slug, nome FROM fontes WHERE slug = ?').get(slug);
  if (!fonte) {
    console.error(`❌ Fonte "${slug}" não encontrada.`);
    process.exit(1);
  }

  const total = db.prepare('SELECT COUNT(*) AS total FROM livros WHERE fonte_id = ?').get(fonte.id).total;
  if (total === 0) {
    console.log(`Nenhum livro cadastrado para a fonte "${fonte.nome}".`);
    return;
  }

  db.prepare('DELETE FROM livros WHERE fonte_id = ?').run(fonte.id);
  console.log(`\n🗑️ Foram removidos ${total} livros da fonte "${fonte.nome}" (${slug}).`);
}

// Router de comandos
switch (comando) {
  case '--listar':
  case '-l':
    listar();
    break;
  case '--buscar':
  case '-b':
    buscar();
    break;
  case '--fonte':
  case '-f':
    porFonte();
    break;
  case '--detalhe':
  case '--detalhes':
  case '-d':
    detalhe();
    break;
  case '--exportar-csv':
  case '--csv':
    exportarCSV();
    break;
  case '--remover':
  case '-r':
    remover();
    break;
  case '--remover-por-fonte':
    removerPorFonte();
    break;
  case '--resumo':
  case '-h':
  case '--help':
  default:
    resumo();
    break;
}
