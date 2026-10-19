/**
 * Script para extrair todos os 2.829 livros da Biblioteca Virtual do INSUTEC (Angola)
 * URL: https://biblioteca.insutec.ao/index.php?pagina=1..236
 * Extrai títulos, autores, editoras e arquivos referenciados.
 * Salva os resultados em insutec_livros.json e INSUTEC-CATALOGO-COMPLETO.md.
 */

const fs = require('fs');
const path = require('path');

const TOTAL_PAGES = 236;
const CONCURRENCY = 6;
const BASE_URL = 'https://biblioteca.insutec.ao/index.php?pagina=';

function extrairAutorDoTitulo(titulo, autorAtual) {
  if (autorAtual && autorAtual !== 'Autor não disponível' && autorAtual !== 'Autor não informado' && autorAtual.trim() !== '') {
    return autorAtual;
  }
  
  // Tentar encontrar padrão 'Autor Nome' ou 'Autor: Nome'
  const matchAutor = titulo.match(/\bAutor[:\s]+([^\-]+)$/i);
  if (matchAutor) {
    return matchAutor[1].trim();
  }

  // Padrão 'Nome Do Livro - Autor Nome'
  const matchHifen = titulo.match(/^[^\-]+-\s*autor\s+([^\-]+)$/i);
  if (matchHifen) {
    return matchHifen[1].trim();
  }

  // Padrão 'AUTORES - TITULO' (ex: ALFRED GOODMAN GILMAN, ... - BASES FARMACOLOGICAS)
  if (titulo.includes(' - ')) {
    const partes = titulo.split(' - ');
    if (partes[0].includes(',') || partes[0].toUpperCase() === partes[0]) {
      return partes[0].trim();
    }
  }

  return 'Autor não especificado';
}

function limparTitulo(titulo) {
  let limpo = titulo.trim();
  // Se o título contiver 'Autor ...', removemos a menção no final para ficar o nome real da obra
  const match = limpo.match(/^([\s\S]+?)\s+Autor[:\s]+[^\-]+$/i);
  if (match) {
    return match[1].trim();
  }
  return limpo;
}

async function fetchPageWithRetry(page, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(BASE_URL + page, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const html = await res.text();
      const books = [];
      
      const cardRegex = /<h4 class=\"text-lg font-semibold text-\[#000000\]\" title=\"([^\"]+)\">[\s\S]*?<i class=\"fas fa-user me-2\"><\/i>([^<]*)[\s\S]*?<i class=\"fas fa-building me-2\"><\/i>([^<]*)[\s\S]*?href=\"read_book\.php\?file=([^\"]+)\"/g;
      
      let match;
      while ((match = cardRegex.exec(html)) !== null) {
        const rawTitulo = match[1].trim();
        const rawAutor = match[2].trim();
        const editora = match[3].trim().replace(/^Livro\s*\(\d+\)/, '').trim() || 'N/A';
        const arquivo = decodeURIComponent(match[4].trim());
        const autor = extrairAutorDoTitulo(rawTitulo, rawAutor);
        const titulo = limparTitulo(rawTitulo);

        books.push({
          tituloOriginal: rawTitulo,
          titulo,
          autor,
          editora,
          arquivo
        });
      }
      return books;
    } catch (err) {
      if (attempt === retries) {
        console.error(`Falha definitiva na página ${page}: ${err.message}`);
        return [];
      }
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function main() {
  console.log(`Iniciando extração dos 2.829 livros do INSUTEC (${TOTAL_PAGES} páginas)...`);
  const todosLivros = [];
  const paginas = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  for (let i = 0; i < paginas.length; i += CONCURRENCY) {
    const chunk = paginas.slice(i, i + CONCURRENCY);
    const promessas = chunk.map(p => fetchPageWithRetry(p));
    const resultados = await Promise.all(promessas);

    for (let j = 0; j < chunk.length; j++) {
      const pNum = chunk[j];
      const books = resultados[j];
      todosLivros.push(...books);
    }
    
    process.stdout.write(`Progresso: página ${Math.min(i + CONCURRENCY, TOTAL_PAGES)}/${TOTAL_PAGES} | Livros coletados: ${todosLivros.length}\r`);
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nExtração finalizada com sucesso! Total de livros coletados: ${todosLivros.length}`);

  // Salvar JSON
  const jsonPath = path.join(__dirname, '../docs/insutec/insutec_livros.json');
  fs.writeFileSync(jsonPath, JSON.stringify(todosLivros, null, 2), 'utf8');
  console.log(`JSON salvo em: ${jsonPath}`);

  // Salvar Markdown completo formatado em tabela
  const mdPath = path.join(__dirname, '../docs/insutec/INSUTEC-CATALOGO-COMPLETO.md');
  let mdContent = `# 🇦🇴 Catálogo Completo da Biblioteca Virtual do INSUTEC (Angola)\n\n`;
  mdContent += `**Data da Extração:** 11 de Outubro de 2026\n`;
  mdContent += `**Fonte:** [Biblioteca Virtual INSUTEC](https://biblioteca.insutec.ao/index.php)\n`;
  mdContent += `**Total de Obras Registadas no Banco:** **${todosLivros.length} livros**\n\n`;
  mdContent += `> ⚠️ **Diagnóstico de Acesso:** Ao testar o leitor oficial (\`read_book.php?file=...\&fetch_pdf=true\`), o servidor PHP do INSUTEC retorna **HTTP 404 ("Não foi possível carregar o PDF.")** para os arquivos binários. Isso indica que, embora o banco de dados e os metadados estejam intactos, o diretório físico dos PDFs no servidor deles está atualmente inacessível ou desmontado.\n\n`;
  mdContent += `---\n\n`;
  mdContent += `## 📋 Lista Geral de Obras e Autores\n\n`;
  mdContent += `| # | Título da Obra | Autor(es) | Arquivo Referenciado |\n`;
  mdContent += `|---|---|---|---|\n`;

  todosLivros.forEach((l, idx) => {
    const tSafe = l.titulo.replace(/\|/g, '\\|');
    const aSafe = l.autor.replace(/\|/g, '\\|');
    const arqSafe = l.arquivo.replace(/\|/g, '\\|');
    mdContent += `| ${idx + 1} | **${tSafe}** | ${aSafe} | \`${arqSafe}\` |\n`;
  });

  fs.writeFileSync(mdPath, mdContent, 'utf8');
  console.log(`Markdown salvo em: ${mdPath}`);
}

main().catch(err => console.error('Erro na execução:', err));
