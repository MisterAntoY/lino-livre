/**
 * Script de Importação em Massa — Lino Livre
 * Baixa lotes de livros de fontes abertas (Project Gutenberg & Open Library),
 * normaliza metadados e gera SQL para inserção no Cloudflare D1 e SQLite.
 */

const fs = require('node:fs');
const path = require('node:path');

function escapeString(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  return "'" + val.toString().replace(/'/g, "''") + "'";
}

function inverterNomeAutor(str) {
  if (!str) return 'Autor Desconhecido';
  const partes = str.split(',').map(s => s.trim());
  if (partes.length === 2) {
    return `${partes[1]} ${partes[0]}`;
  }
  return str;
}

// 1. Coletar livros do Project Gutenberg via Gutendex
async function coletarGutenberg(maxPaginas = 10, lang = 'pt') {
  console.log(`\n📚 [Gutenberg] Coletando obras em português (${lang}) - até ${maxPaginas} páginas...`);
  let url = `https://gutendex.com/books/?languages=${lang}`;
  const livros = [];
  let pagina = 1;

  while (url && pagina <= maxPaginas) {
    console.log(`   Página ${pagina}...`);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'LinoLivre-MassImporter/1.0 (educacional)' }
      });
      if (!res.ok) {
        console.warn(`   Falha HTTP ${res.status} na página ${pagina}`);
        break;
      }
      const data = await res.json();
      for (const b of (data.results || [])) {
        const autorNome = b.authors && b.authors[0] ? inverterNomeAutor(b.authors[0].name) : 'Autor Desconhecido';
        const links = [];

        if (b.formats['application/epub+zip']) {
          links.push({ formato: 'epub', url: b.formats['application/epub+zip'] });
        }
        if (b.formats['application/pdf']) {
          links.push({ formato: 'pdf', url: b.formats['application/pdf'] });
        }
        if (b.formats['text/html']) {
          links.push({ formato: 'html', url: b.formats['text/html'] });
        }
        if (b.formats['text/plain; charset=utf-8']) {
          links.push({ formato: 'txt', url: b.formats['text/plain; charset=utf-8'] });
        }

        const sinopse = b.summaries && b.summaries[0]
          ? b.summaries[0].slice(0, 500)
          : `Obra clássica de domínio público preservada pelo Project Gutenberg (Nº ${b.id}).`;

        livros.push({
          fonte_slug: 'gutenberg',
          fonte_id_externo: `pg-${b.id}`,
          titulo: b.title.slice(0, 200),
          autor_nome: autorNome,
          idioma: b.languages && b.languages[0] ? b.languages[0] : 'pt',
          capa_url: b.formats['image/jpeg'] || null,
          licenca: 'dominio-publico',
          sinopse,
          links
        });
      }

      url = data.next;
      pagina++;
      // Pequena pausa amigável para rate limit
      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      console.error(`   Erro na página ${pagina}:`, err.message);
      break;
    }
  }

  console.log(`✅ [Gutenberg] ${livros.length} obras coletadas.`);
  return livros;
}

// 2. Coletar livros da Open Library por termos do conhecimento
async function coletarOpenLibrary(termos = ['literatura', 'historia', 'ciencia', 'filosofia', 'poesia'], limitPorTermo = 25) {
  console.log(`\n🏛️ [Open Library] Coletando obras com texto integral para os temas: ${termos.join(', ')}...`);
  const livros = [];
  const jaVistos = new Set();

  for (const termo of termos) {
    console.log(`   Buscando termo '${termo}'...`);
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&has_fulltext=true&limit=${limitPorTermo}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'LinoLivre-MassImporter/1.0 (educacional)' }
      });
      if (!res.ok) {
        console.warn(`   Falha HTTP ${res.status} para o termo ${termo}`);
        continue;
      }
      const data = await res.json();
      for (const doc of (data.docs || [])) {
        if (!doc.key || !doc.title) continue;
        const idExterno = doc.key.replace('/works/', '');
        if (jaVistos.has(idExterno)) continue;
        jaVistos.add(idExterno);

        const autorNome = doc.author_name && doc.author_name[0] ? doc.author_name[0] : 'Autor Clássico';
        const capaId = doc.cover_i;
        const capaUrl = capaId ? `https://covers.openlibrary.org/b/id/${capaId}-L.jpg` : null;

        const links = [
          { formato: 'html', url: `https://openlibrary.org${doc.key}` }
        ];

        livros.push({
          fonte_slug: 'openlibrary',
          fonte_id_externo: `ol-${idExterno}`,
          titulo: doc.title.slice(0, 200),
          autor_nome: autorNome,
          idioma: doc.language && doc.language[0] ? doc.language[0] : 'pt',
          ano_publicacao: doc.first_publish_year || null,
          capa_url: capaUrl,
          licenca: 'dominio-publico',
          sinopse: doc.subtitle || `Acervo aberto e gratuito referenciado na Open Library sob a área de ${termo}.`,
          links
        });
      }
      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      console.error(`   Erro ao buscar '${termo}':`, err.message);
    }
  }

  console.log(`✅ [Open Library] ${livros.length} obras coletadas.`);
  return livros;
}

// 3. Gerador de SQL para D1
function gerarSqlLote(livros, outputSqlFile) {
  let sql = '-- Lote de Importação em Massa para Cloudflare D1 / SQLite\n\n';

  // Coleta autores únicos
  const autores = new Map();
  for (const l of livros) {
    if (l.autor_nome && !autores.has(l.autor_nome)) {
      autores.set(l.autor_nome, true);
    }
  }

  sql += '-- Inserir autores únicos\n';
  for (const nome of autores.keys()) {
    sql += `INSERT OR IGNORE INTO autores (nome) VALUES (${escapeString(nome)});\n`;
  }
  sql += '\n';

  sql += '-- Inserir livros e links\n';
  for (const l of livros) {
    const autorSubquery = l.autor_nome
      ? `(SELECT id FROM autores WHERE nome = ${escapeString(l.autor_nome)} LIMIT 1)`
      : 'NULL';
    const fonteSubquery = `(SELECT id FROM fontes WHERE slug = ${escapeString(l.fonte_slug)} LIMIT 1)`;

    sql += `
INSERT INTO livros (
  titulo, subtitulo, idioma, sinopse, capa_url, ano_publicacao,
  autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras
) VALUES (
  ${escapeString(l.titulo)}, NULL, ${escapeString(l.idioma)}, ${escapeString(l.sinopse)},
  ${escapeString(l.capa_url)}, ${l.ano_publicacao || 'NULL'}, ${autorSubquery}, NULL,
  ${fonteSubquery}, ${escapeString(l.fonte_id_externo)}, ${escapeString(l.licenca)}, 10
) ON CONFLICT(fonte_id, fonte_id_externo) DO UPDATE SET
  titulo = excluded.titulo,
  capa_url = COALESCE(excluded.capa_url, livros.capa_url),
  sinopse = COALESCE(excluded.sinopse, livros.sinopse);
`;

    for (const link of l.links) {
      sql += `
INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
VALUES (
  (SELECT id FROM livros WHERE fonte_id = ${fonteSubquery} AND fonte_id_externo = ${escapeString(l.fonte_id_externo)} LIMIT 1),
  ${escapeString(link.formato)}, ${escapeString(link.url)}, 0, 1
) ON CONFLICT(livro_id, formato) DO UPDATE SET url = excluded.url;
`;
    }
  }

  fs.writeFileSync(outputSqlFile, sql, 'utf8');
  console.log(`💾 Arquivo SQL gerado em: ${outputSqlFile} (${sql.length} bytes, ${livros.length} obras)`);
}

async function main() {
  const args = process.argv.slice(2);
  const maxPaginasGutenberg = parseInt(args[0], 10) || 12; // ~384 livros

  console.log(`=== INICIANDO IMPORTAÇÃO EM MASSA - LINO LIVRE ===`);

  const livrosGutenberg = await coletarGutenberg(maxPaginasGutenberg, 'pt');
  const livrosOpenLibrary = await coletarOpenLibrary(['literatura', 'historia', 'ciencia', 'filosofia', 'poesia', 'angola'], 25);

  const todos = [...livrosGutenberg, ...livrosOpenLibrary];
  console.log(`\n🎉 Total consolidado de obras coletadas: ${todos.length}`);

  const sqlPath = path.join(__dirname, '../lote_importacao.sql');
  gerarSqlLote(todos, sqlPath);

  console.log(`\nPronto para executar no Cloudflare D1 com:`);
  console.log(`npx wrangler d1 execute lino-livre-db --remote --file=lote_importacao.sql`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Erro na execução do importador:', err);
    process.exit(1);
  });
}

module.exports = { coletarGutenberg, coletarOpenLibrary, gerarSqlLote };
