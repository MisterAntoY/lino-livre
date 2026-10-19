/**
 * Importador de Fase 2: Project Gutenberg Integral — Lino Livre
 * 
 * Importa metadados do catálogo completo de domínio público do Project Gutenberg.
 * Em conformidade absoluta com AGENTS.md:
 * - Apenas metadados (título, autor, ano, idioma, licença, capa, links)
 * - Zero armazenamento local de ficheiros de obras
 * - Redirecionamento HTTP 302 direto para o leitor oficial do Gutenberg
 * 
 * Uso:
 *   node scripts/import_fase2_gutenberg.mjs                 # dry-run
 *   node scripts/import_fase2_gutenberg.mjs --apply        # aplica local e na D1 remota
 *   node scripts/import_fase2_gutenberg.mjs --limit 10000  # limita o lote
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB = 'lino-livre-db';
const SQL_DIR = path.resolve('.scratch/sql-gutenberg');
const CSV_PATH = path.resolve('.scratch/fontes/pg_catalog.csv');
const BATCH_SIZE = 1000; // 1000 livros por ficheiro SQL

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function wrangler(cmd) {
  return execSync(`npx wrangler d1 execute ${DB} --remote ${cmd}`, { 
    encoding: 'utf-8', 
    maxBuffer: 50 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'] 
  });
}

async function sqlJson(command) {
  const oneLine = command.replace(/\s+/g, ' ').trim();
  const out = wrangler(`--command ${JSON.stringify(oneLine)} --json`);
  return JSON.parse(out)[0].results;
}

function applyFile(file) {
  console.log(`   ▶ a aplicar ${path.basename(file)} ...`);
  try {
    execSync(`sqlite3 biblioteca.db -cmd "PRAGMA trusted_schema = ON;" -cmd "PRAGMA busy_timeout = 10000;" < ${JSON.stringify(file)}`, { stdio: 'pipe' });
  } catch (err) {
    console.warn(`   ⚠ Aviso local: ${err.message}`);
  }
  wrangler(`--file ${JSON.stringify(file)} --yes`);
}

function cleanAuthor(str) {
  if (!str) return 'Autor Desconhecido';
  const parts = str.split(';');
  let firstAuthor = parts[0].trim();
  firstAuthor = firstAuthor.replace(/,?\s*\b\d{3,4}\s*[-–—]\s*\d{3,4}\b.*$/, '');
  firstAuthor = firstAuthor.replace(/\s*\(\d{3,4}\s*[-–—]\s*\d{3,4}\).*$/, '');
  if (firstAuthor.includes(',') && !firstAuthor.includes('(')) {
    const [last, first] = firstAuthor.split(',').map(s => s.trim());
    if (first && last) return `${first} ${last}`.trim();
  }
  return firstAuthor.trim() || 'Autor Desconhecido';
}

function parseCSV(content) {
  const rows = [];
  let curRow = [];
  let curField = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (c === '\"') {
      if (inQuotes && content[i+1] === '\"') { curField += '\"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (c === ',' && !inQuotes) {
      curRow.push(curField);
      curField = '';
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (c === '\r' && content[i+1] === '\n') i++;
      curRow.push(curField);
      curField = '';
      if (curRow.length > 1 || (curRow.length === 1 && curRow[0] !== '')) {
        rows.push(curRow);
      }
      curRow = [];
    } else {
      curField += c;
    }
  }
  if (curField || curRow.length) {
    curRow.push(curField);
    rows.push(curRow);
  }
  return rows;
}

const IDIOMAS = {
  en: 'en', english: 'en',
  pt: 'pt', portuguese: 'pt',
  fr: 'fr', french: 'fr',
  de: 'de', german: 'de',
  es: 'es', spanish: 'es',
  it: 'it', italian: 'it',
  zh: 'zh', chinese: 'zh',
  la: 'la', latin: 'la',
  ru: 'ru', russian: 'ru',
  el: 'el', greek: 'el',
  nl: 'nl', dutch: 'nl',
  sv: 'sv', swedish: 'sv',
  da: 'da', danish: 'da',
  no: 'no', norwegian: 'no',
  fi: 'fi', finnish: 'fi',
  pl: 'pl', polish: 'pl',
  eo: 'eo', esperanto: 'eo',
  ja: 'ja', japanese: 'ja',
  ar: 'ar', arabic: 'ar'
};

async function main() {
  const aplicar = process.argv.includes('--apply');
  const limitArg = process.argv.indexOf('--limit');
  const maxObras = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`📚 Importador Fase 2: Project Gutenberg Integral — Lino Livre`);
  console.log(`Modo: ${aplicar ? 'APLICAR (Local + Cloudflare D1)' : 'DRY-RUN (Geração SQL)'}`);
  console.log(`Limite máximo: ${Number.isFinite(maxObras) ? maxObras : 'Sem limite (todas as obras)'}`);
  console.log(`════════════════════════════════════════════════════════════\n`);

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ Ficheiro ${CSV_PATH} não encontrado.`);
    process.exit(1);
  }

  console.log(`1. A carregar e analisar ${path.basename(CSV_PATH)}...`);
  const rawContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(rawContent);
  console.log(`   ✔ ${rows.length - 1} registos lidos do CSV`);

  console.log(`2. A consultar estado actual da base de dados...`);
  const [maxAutoresRow, maxLivrosRow, maxLinksRow] = await Promise.all([
    sqlJson('SELECT COALESCE(MAX(id), 0) AS m FROM autores;'),
    sqlJson('SELECT COALESCE(MAX(id), 0) AS m FROM livros;'),
    sqlJson('SELECT COALESCE(MAX(id), 0) AS m FROM links_livros;')
  ]);
  let maxA = maxAutoresRow[0].m;
  let maxL = maxLivrosRow[0].m;
  let maxK = maxLinksRow[0].m;

  // Autores já cadastrados
  const autoresDb = await sqlJson('SELECT id, nome FROM autores;');
  const mapaAutores = new Map();
  for (const a of autoresDb) mapaAutores.set(a.nome.trim().toLowerCase(), a.id);

  // Livros do Gutenberg já cadastrados (para evitar duplicados)
  const existentesGutenberg = await sqlJson("SELECT fonte_id_externo FROM livros WHERE fonte_id = 5;");
  const setExistentes = new Set(existentesGutenberg.map(r => r.fonte_id_externo));
  console.log(`   ✔ ${setExistentes.size} obras do Gutenberg já indexadas anteriormente`);
  console.log(`   ✔ Ponto de partida de IDs: autores=${maxA}, livros=${maxL}, links=${maxK}`);

  const categoriaGutenbergId = 51; // 📚 Project Gutenberg (Domínio Público)
  const fonteGutenbergId = 5;

  const novosAutores = [];
  const novosLivros = [];
  const novosLinks = [];

  let processados = 0;
  for (let i = 1; i < rows.length; i++) {
    if (novosLivros.length >= maxObras) break;
    const r = rows[i];
    if (r.length < 5) continue;
    
    const [num, tipo, issued, tituloCru, langCru, authorCru, subjects, locc, bookshelves] = r;
    if (tipo !== 'Text') continue;
    if (!num || !tituloCru || !tituloCru.trim()) continue;

    const extId = `pg-${num.trim()}`;
    if (setExistentes.has(extId)) continue; // já existe

    const titulo = tituloCru.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 250);
    const autorNome = cleanAuthor(authorCru);
    const autorChave = autorNome.toLowerCase();

    // Resolver autor
    let autorId;
    if (mapaAutores.has(autorChave)) {
      autorId = mapaAutores.get(autorChave);
    } else {
      maxA++;
      autorId = maxA;
      mapaAutores.set(autorChave, autorId);
      novosAutores.push({ id: autorId, nome: autorNome });
    }

    // Ano
    let ano = null;
    if (issued && /^\d{4}/.test(issued)) {
      ano = parseInt(issued.slice(0, 4), 10);
    }

    // Idioma
    const lang = (langCru ? langCru.trim().toLowerCase() : 'en');
    const idioma = IDIOMAS[lang] || 'outro';

    // Sinopse
    let sinopse = `Obra clássica em domínio público preservada pelo Project Gutenberg.`;
    if (subjects && subjects.trim()) {
      const topSubj = subjects.split(';').slice(0, 3).map(s => s.trim()).join(', ');
      sinopse += ` Temas: ${topSubj}.`;
    }
    sinopse = sinopse.slice(0, 400);

    const capaUrl = `https://www.gutenberg.org/cache/epub/${num}/pg${num}.cover.medium.jpg`;
    const urlLeitura = `https://www.gutenberg.org/ebooks/${num}.html.images`;

    maxL++;
    maxK++;
    const livroId = maxL;
    const linkId = maxK;

    novosLivros.push({
      id: livroId,
      titulo,
      idioma,
      sinopse,
      capaUrl,
      ano,
      autorId,
      categoriaId: categoriaGutenbergId,
      fonteId: fonteGutenbergId,
      fonteIdExterno: extId,
      licenca: 'dominio-publico'
    });

    novosLinks.push({
      id: linkId,
      livroId,
      formato: 'html',
      url: urlLeitura
    });

    setExistentes.add(extId);
    processados++;
  }

  console.log(`\n3. Resumo da compilação:`);
  console.log(`   ✔ ${novosLivros.length} novos livros preparados`);
  console.log(`   ✔ ${novosAutores.length} novos autores a cadastrar`);
  console.log(`   ✔ ${novosLinks.length} links de leitura direta (HTTP 302) gerados`);

  if (novosLivros.length === 0) {
    console.log(`ℹ Nada novo a importar.`);
    return;
  }

  // Geração de SQL em lotes de BATCH_SIZE
  fs.mkdirSync(SQL_DIR, { recursive: true });
  for (const f of fs.readdirSync(SQL_DIR)) {
    if (f.startsWith('pg-batch-')) fs.unlinkSync(path.join(SQL_DIR, f));
  }

  const ficheirosSql = [];
  const totalLotes = Math.ceil(novosLivros.length / BATCH_SIZE);
  console.log(`4. A gerar ${totalLotes} ficheiros SQL em ${path.relative(process.cwd(), SQL_DIR)}...`);

  // Mapear autores por lote
  let autorIdx = 0;
  for (let b = 0; b < totalLotes; b++) {
    const start = b * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, novosLivros.length);
    const loteLivros = novosLivros.slice(start, end);
    const loteLinks = novosLinks.slice(start, end);

    // Selecionar autores pertencentes a este lote
    const autoresDesteLote = [];
    const loteAutoresIds = new Set(loteLivros.map(l => l.autorId));
    while (autorIdx < novosAutores.length && loteAutoresIds.has(novosAutores[autorIdx].id)) {
      autoresDesteLote.push(novosAutores[autorIdx]);
      autorIdx++;
    }

    const linhas = [];
    for (const a of autoresDesteLote) {
      linhas.push(`INSERT OR IGNORE INTO autores (id, nome) VALUES (${a.id}, ${esc(a.nome)});`);
    }
    for (const l of loteLivros) {
      linhas.push(
        `INSERT OR IGNORE INTO livros (id, titulo, idioma, sinopse, capa_url, ano_publicacao, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, leituras, conteudo_texto) VALUES ` +
        `(${l.id}, ${esc(l.titulo)}, ${esc(l.idioma)}, ${esc(l.sinopse)}, ${esc(l.capaUrl)}, ${esc(l.ano)}, ${l.autorId}, ${l.categoriaId}, ${l.fonteId}, ${esc(l.fonteIdExterno)}, ${esc(l.licenca)}, 0, NULL);`
      );
    }
    for (const k of loteLinks) {
      linhas.push(
        `INSERT OR IGNORE INTO links_livros (id, livro_id, formato, url, link_externo) VALUES ` +
        `(${k.id}, ${k.livroId}, ${esc(k.formato)}, ${esc(k.url)}, 1);`
      );
    }

    const batchNum = String(b + 1).padStart(3, '0');
    const fPath = path.join(SQL_DIR, `pg-batch-${batchNum}.sql`);
    fs.writeFileSync(fPath, linhas.join('\n') + '\n');
    ficheirosSql.push(fPath);
  }

  // Autores restantes (se houver)
  if (autorIdx < novosAutores.length) {
    const linhas = [];
    while (autorIdx < novosAutores.length) {
      const a = novosAutores[autorIdx++];
      linhas.push(`INSERT OR IGNORE INTO autores (id, nome) VALUES (${a.id}, ${esc(a.nome)});`);
    }
    const fPath = path.join(SQL_DIR, `pg-batch-000-autores.sql`);
    fs.writeFileSync(fPath, linhas.join('\n') + '\n');
    ficheirosSql.unshift(fPath);
  }

  console.log(`   ✔ ${ficheirosSql.length} ficheiros SQL gerados.`);

  if (aplicar) {
    console.log(`\n5. A aplicar lotes na base local e no Cloudflare D1 remoto...`);
    let aplicados = 0;
    for (const f of ficheirosSql) {
      applyFile(f);
      aplicados++;
      if (aplicados % 10 === 0 || aplicados === ficheirosSql.length) {
        console.log(`   ✔ Progresso: ${aplicados}/${ficheirosSql.length} lotes aplicados.`);
      }
    }
    console.log(`\n🎉 Concluído com sucesso! ${novosLivros.length} obras adicionadas ao Lino Livre.`);
  } else {
    console.log(`\nℹ Execução em modo DRY-RUN. Para aplicar, execute:\n   node scripts/import_fase2_gutenberg.mjs --apply`);
  }
}

main().catch(err => {
  console.error(`❌ Erro fatal: ${err.message}`);
  process.exit(1);
});
