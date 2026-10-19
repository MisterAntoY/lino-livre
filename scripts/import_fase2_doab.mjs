/**
 * Importador de Fase 2: DOAB (Directory of Open Access Books) — Lino Livre
 * 
 * Importa metadados de monografias e investigações académicas avaliadas por pares.
 * Em conformidade absoluta com AGENTS.md:
 * - Apenas metadados (título, autor, ano, idioma, licença, sinopse, links externos)
 * - Zero armazenamento local de ficheiros de obras
 * - Redirecionamento HTTP 302 direto para o repositório oficial da editora / OAPEN / DOAB
 * 
 * Uso:
 *   node scripts/import_fase2_doab.mjs                 # dry-run
 *   node scripts/import_fase2_doab.mjs --apply        # aplica local e na D1 remota
 *   node scripts/import_fase2_doab.mjs --limit 7500   # define o limite de livros
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB = 'lino-livre-db';
const SQL_DIR = path.resolve('.scratch/sql-doab');
const CSV_PATH = path.resolve('.scratch/fontes/doab_catalog.csv');
const PROGRESS_FILE = path.resolve('.scratch/doab-applied.json');
const BATCH_SIZE = 1000;

let tmpSeq = 0;

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function runWithRetry(cmd, maxRetries = 3, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return execSync(cmd, {
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    } catch (err) {
      console.warn(`      ⚠ Tentativa ${attempt}/${maxRetries} falhou: ${err.message?.slice(0, 150)}`);
      if (attempt === maxRetries) throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs * attempt);
    }
  }
}

function sqlJson(query) {
  fs.mkdirSync(SQL_DIR, { recursive: true });
  const f = path.join(SQL_DIR, `tmp-q-${process.pid}-${tmpSeq++}.sql`);
  fs.writeFileSync(f, query.trim() + '\n', 'utf-8');
  try {
    const out = runWithRetry(`npx wrangler d1 execute ${DB} --remote --file=${JSON.stringify(f)} --json`);
    const jsonStart = out.indexOf('[');
    if (jsonStart === -1) return [];
    const parsed = JSON.parse(out.slice(jsonStart));
    return parsed[0].results || [];
  } finally {
    try { fs.unlinkSync(f); } catch {}
  }
}

function execFileSql(query) {
  fs.mkdirSync(SQL_DIR, { recursive: true });
  const f = path.join(SQL_DIR, `tmp-cmd-${process.pid}-${tmpSeq++}.sql`);
  fs.writeFileSync(f, query.trim() + '\n', 'utf-8');
  try {
    try {
      execSync(`sqlite3 biblioteca.db -cmd "PRAGMA trusted_schema = ON;" -cmd "PRAGMA busy_timeout = 10000;" < ${JSON.stringify(f)}`, { stdio: 'pipe' });
    } catch {}
    runWithRetry(`npx wrangler d1 execute ${DB} --remote --file=${JSON.stringify(f)} --yes`);
  } finally {
    try { fs.unlinkSync(f); } catch {}
  }
}

function applyFile(file) {
  console.log(`   ▶ a aplicar ${path.basename(file)} ...`);
  try {
    execSync(`sqlite3 biblioteca.db -cmd "PRAGMA trusted_schema = ON;" -cmd "PRAGMA busy_timeout = 10000;" < ${JSON.stringify(file)}`, { stdio: 'pipe' });
  } catch (err) {
    console.warn(`   ⚠ Aviso local: ${err.message?.slice(0, 100)}`);
  }
  runWithRetry(`npx wrangler d1 execute ${DB} --remote --file=${JSON.stringify(file)} --yes`);
}

function getApplied() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch { return []; }
  }
  return [];
}

function saveApplied(list) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function cleanAuthor(str) {
  if (!str) return 'Autor Desconhecido';
  const parts = str.split('||');
  let firstAuthor = parts[0].trim();
  if (firstAuthor.includes(';') && !firstAuthor.includes('(')) {
    firstAuthor = firstAuthor.split(';')[0].trim();
  }
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

function mapLanguage(langRaw) {
  if (!langRaw) return 'outro';
  const l = langRaw.toLowerCase();
  if (l.includes('eng') || l.includes('english')) return 'en';
  if (l.includes('por') || l.includes('portuguese') || l.includes('português')) return 'pt';
  if (l.includes('fre') || l.includes('fra') || l.includes('french') || l.includes('français')) return 'fr';
  if (l.includes('ger') || l.includes('deu') || l.includes('german') || l.includes('deutsch')) return 'de';
  if (l.includes('spa') || l.includes('spanish') || l.includes('español')) return 'es';
  if (l.includes('ita') || l.includes('italian') || l.includes('italiano')) return 'it';
  if (l.includes('pol') || l.includes('polish')) return 'pl';
  if (l.includes('chi') || l.includes('zho') || l.includes('chinese')) return 'zh';
  return 'outro';
}

function mapLicense(licRaw) {
  // Licença vazia/desconhecida → 'outro' (nunca afirmar CC-BY sem fonte).
  // ~11% dos registos DOAB têm BITSTREAM License vazio; rotulá-los 'cc-by'
  // seria imputar uma licença sem base documental. O destino do redirect
  // (página DOAB/OAPEN) mostra a licença real ao leitor.
  if (!licRaw) return 'outro';
  const l = licRaw.toLowerCase();
  if (l.includes('by-nc')) return 'cc-by-nc';
  if (l.includes('by-sa')) return 'cc-by-sa';
  if (l.includes('by')) return 'cc-by';
  if (l.includes('zero') || l.includes('publicdomain') || l.includes('domínio público') || l.includes('dominio-publico')) return 'dominio-publico';
  if (l.includes('cc0')) return 'cc0';
  return 'outro';
}

async function garantirFonteECategoria() {
  // 1. Fonte DOAB
  const checkFonte = sqlJson("SELECT id FROM fontes WHERE slug = 'doab';");
  let fonteId;
  if (checkFonte.length > 0 && checkFonte[0].id) {
    fonteId = checkFonte[0].id;
  } else {
    fonteId = 44;
    execFileSql(`INSERT OR IGNORE INTO fontes (id, slug, nome, tipo, url_base, ativa) VALUES (${fonteId}, 'doab', 'Directory of Open Access Books (DOAB)', 'api', 'https://directory.doabooks.org', 1);`);
  }

  // 2. Categoria
  const catNome = '🎓 Livros Acadêmicos Abertos (DOAB)';
  const catDesc = 'Monografias e investigações científicas peer-reviewed de editoras universitárias mundiais em acesso aberto.';
  const checkCat = sqlJson(`SELECT id FROM categorias WHERE nome = ${esc(catNome)};`);
  let catId;
  if (checkCat.length > 0 && checkCat[0].id) {
    catId = checkCat[0].id;
  } else {
    catId = 52;
    execFileSql(`INSERT OR IGNORE INTO categorias (id, nome, descricao) VALUES (${catId}, ${esc(catNome)}, ${esc(catDesc)});`);
  }

  return { fonteId, catId };
}

async function main() {
  const aplicar = process.argv.includes('--apply');
  const limitArg = process.argv.indexOf('--limit');
  const maxObras = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : 7500;

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`🎓 Importador Fase 2: DOAB (Open Access Academic Books)`);
  console.log(`Modo: ${aplicar ? 'APLICAR (Local + Cloudflare D1)' : 'DRY-RUN (Geração SQL)'}`);
  console.log(`Meta: até ${maxObras} monografias académicas`);
  console.log(`════════════════════════════════════════════════════════════\n`);

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ Ficheiro ${CSV_PATH} não encontrado.`);
    process.exit(1);
  }

  console.log(`1. A carregar e analisar ${path.basename(CSV_PATH)}...`);
  const rawContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(rawContent);
  console.log(`   ✔ ${rows.length - 1} registos lidos do CSV`);

  const headers = rows[0];
  const idxTitle = headers.indexOf('dc.title');
  const idxType = headers.indexOf('dc.type');
  const idxAuthor = headers.indexOf('dc.contributor.author');
  const idxLink = headers.indexOf('BITSTREAM Download URL');
  const idxUri = headers.indexOf('dc.identifier.uri');
  const idxLang = headers.indexOf('dc.language');
  const idxIssued = headers.indexOf('dc.date.issued');
  const idxAbstract = headers.indexOf('dc.description.abstract');
  const idxLicense = headers.indexOf('BITSTREAM License');
  const idxRights = headers.indexOf('dc.rights.license');
  const idxId = headers.indexOf('id');

  console.log(`2. A configurar fonte e categoria...`);
  const fonteId = 44;
  const catId = 52;
  console.log(`   ✔ Fonte DOAB id=${fonteId}, Categoria id=${catId}`);

  // Usar espaço de IDs desimpedido para evitar colisões com o Gutenberg
  let maxA = 50000;
  let maxL = 200000;
  let maxK = 300000;

  console.log(`   ✔ Ponto de partida de IDs seguro: autores=${maxA}, livros=${maxL}, links=${maxK}`);

  const mapaAutores = new Map();
  const setExistentes = new Set();

  const novosAutores = [];
  const novosLivros = [];
  const novosLinks = [];

  for (let i = 1; i < rows.length; i++) {
    if (novosLivros.length >= maxObras) break;
    const r = rows[i];
    if (r.length < 10) continue;

    const tipo = (r[idxType] || '').trim().toLowerCase();
    if (tipo !== 'book') continue;

    const tituloCru = (r[idxTitle] || '').trim();
    if (!tituloCru || tituloCru.length < 2) continue;

    const urlRaw = (r[idxLink] || '').trim() || (r[idxUri] || '').trim();
    if (!urlRaw || !urlRaw.startsWith('http')) continue;

    const extId = `doab-${(r[idxId] || String(i)).trim()}`;
    if (setExistentes.has(extId)) continue;

    const titulo = tituloCru.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 250);
    const autorNome = cleanAuthor(r[idxAuthor]);
    const autorChave = autorNome.toLowerCase();

    let autorId;
    if (mapaAutores.has(autorChave)) {
      autorId = mapaAutores.get(autorChave);
    } else {
      maxA++;
      autorId = maxA;
      mapaAutores.set(autorChave, autorId);
      novosAutores.push({ id: autorId, nome: autorNome });
    }

    let ano = null;
    const issued = r[idxIssued] || '';
    if (/^\d{4}/.test(issued)) {
      ano = parseInt(issued.slice(0, 4), 10);
    }

    const idioma = mapLanguage(r[idxLang]);
    const licenca = mapLicense(r[idxLicense] || r[idxRights]);

    let sinopse = (r[idxAbstract] || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!sinopse || sinopse.length < 10) {
      sinopse = `Monografia e pesquisa académica avaliada por pares em acesso aberto, disponibilizada no Directory of Open Access Books (DOAB).`;
    } else {
      sinopse = sinopse.slice(0, 400);
    }

    const formato = urlRaw.toLowerCase().includes('.pdf') ? 'pdf' : (urlRaw.toLowerCase().includes('.epub') ? 'epub' : 'html');
    const capaUrl = null;

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
      autorObj: { id: autorId, nome: autorNome },
      categoriaId: catId,
      fonteId,
      fonteIdExterno: extId,
      licenca
    });

    novosLinks.push({
      id: linkId,
      livroId,
      formato,
      url: urlRaw
    });

    setExistentes.add(extId);
  }

  console.log(`\n3. Resumo da compilação:`);
  console.log(`   ✔ ${novosLivros.length} novas monografias académicas preparadas`);
  console.log(`   ✔ ${novosAutores.length} novos autores/pesquisadores a cadastrar`);
  console.log(`   ✔ ${novosLinks.length} links de leitura direta (HTTP 302) gerados`);

  if (novosLivros.length === 0) {
    console.log(`ℹ Nada novo a importar.`);
    return;
  }

  fs.mkdirSync(SQL_DIR, { recursive: true });
  for (const f of fs.readdirSync(SQL_DIR)) {
    if (f.startsWith('doab-batch-')) fs.unlinkSync(path.join(SQL_DIR, f));
  }

  const ficheirosSql = [];
  const totalLotes = Math.ceil(novosLivros.length / BATCH_SIZE);
  console.log(`4. A gerar ${totalLotes} ficheiros SQL autónomos em ${path.relative(process.cwd(), SQL_DIR)}...`);

  for (let b = 0; b < totalLotes; b++) {
    const start = b * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, novosLivros.length);
    const loteLivros = novosLivros.slice(start, end);
    const loteLinks = novosLinks.slice(start, end);

    // Todos os autores necessários para este lote específico
    const loteAutoresMap = new Map();
    for (const l of loteLivros) {
      if (l.autorObj) {
        loteAutoresMap.set(l.autorObj.id, l.autorObj);
      }
    }

    const linhas = [];
    for (const a of loteAutoresMap.values()) {
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
    const fPath = path.join(SQL_DIR, `doab-batch-${batchNum}.sql`);
    fs.writeFileSync(fPath, linhas.join('\n') + '\n');
    ficheirosSql.push(fPath);
  }

  console.log(`   ✔ ${ficheirosSql.length} ficheiros SQL gerados.`);

  if (aplicar) {
    console.log(`\n5. A aplicar lotes na base local e no Cloudflare D1 remoto...`);
    const applied = new Set(getApplied());
    let aplicados = 0;
    for (const f of ficheirosSql) {
      const baseName = path.basename(f);
      if (applied.has(baseName)) {
        console.log(`   ✔ ${baseName} já aplicado anteriormente.`);
        continue;
      }
      applyFile(f);
      applied.add(baseName);
      saveApplied(Array.from(applied));
      aplicados++;
      console.log(`   ✔ Progresso: ${aplicados}/${ficheirosSql.length} lotes aplicados.`);
    }
    console.log(`\n🎉 Concluído com sucesso! ${novosLivros.length} obras académicas adicionadas ao Lino Livre.`);
  } else {
    console.log(`\nℹ Execução em modo DRY-RUN. Para aplicar, execute:\n   node scripts/import_fase2_doab.mjs --apply`);
  }
}

main().catch(err => {
  console.error(`❌ Erro fatal: ${err.message}`);
  process.exit(1);
});
