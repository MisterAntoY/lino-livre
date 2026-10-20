/**
 * Fase 3: Internet Archive Library Collections Harvester — Lino Livre
 * 
 * Indexador em larga escala de coleções de bibliotecas históricas do Internet Archive.
 * Em conformidade absoluta com AGENTS.md:
 * - Apenas metadados (título, autor, ano, idioma, licença, sinopse, capa)
 * - Zero armazenamento local de ficheiros de obras
 * - Redirecionamento HTTP 302 direto para o leitor oficial do Archive.org
 * 
 * Uso:
 *   node scripts/fase3_ia_harvester.mjs --collection toronto --limit 2000
 *   node scripts/fase3_ia_harvester.mjs --collection toronto --limit 2000 --apply
 *   node scripts/fase3_ia_harvester.mjs --collection biodiversity --limit 2000 --apply
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB = 'lino-livre-db';
const SQL_DIR = path.resolve('.scratch/sql-fase3-ia');
const PROGRESS_FILE = path.resolve('.scratch/ia-applied.json');
const BATCH_SIZE = 300;

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

function cleanAuthor(creator) {
  if (!creator) return 'Autor Desconhecido';
  let first = Array.isArray(creator) ? creator[0] : String(creator);
  if (!first) return 'Autor Desconhecido';

  first = first.replace(/,?\s*\b\d{3,4}\s*[-–—]\s*\d{3,4}\b.*$/, '');
  first = first.replace(/\s*\(\d{3,4}\s*[-–—]\s*\d{3,4}\).*$/, '');
  first = first.replace(/,\s*(ca\.|b\.|d\.|fl\.)\s*\d{3,4}.*$/, '');
  first = first.replace(/\s*\[.*\]\s*$/, '');

  if (first.includes(',') && !first.includes('(')) {
    const parts = first.split(',').map(s => s.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      first = `${parts[1]} ${parts[0]}`.trim();
    }
  }

  first = first.replace(/^[;,.\s]+|[;,.\s]+$/g, '');
  return first.trim().slice(0, 150) || 'Autor Desconhecido';
}

function cleanTitle(raw) {
  if (!raw) return '';
  let t = String(raw).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  t = t.replace(/\s*\[microform\]/gi, '');
  t = t.replace(/\s*\[microforme\]/gi, '');
  t = t.replace(/\s*\[electronic resource\]/gi, '');
  t = t.replace(/^[;,:.\s]+|[;,:.\s]+$/g, '');
  return t.slice(0, 250);
}

function mapLanguage(lang) {
  if (!lang) return 'en';
  let l = Array.isArray(lang) ? String(lang[0]) : String(lang);
  l = l.toLowerCase().trim();

  if (l === 'por' || l === 'portuguese' || l === 'pt') return 'pt';
  if (l === 'eng' || l === 'english' || l === 'en') return 'en';
  if (l === 'fre' || l === 'fra' || l === 'french' || l === 'fr') return 'fr';
  if (l === 'ger' || l === 'deu' || l === 'german' || l === 'de') return 'de';
  if (l === 'spa' || l === 'spanish' || l === 'es') return 'es';
  if (l === 'ita' || l === 'italian' || l === 'it') return 'it';
  if (l === 'lat' || l === 'latin') return 'la';
  if (l === 'chi' || l === 'zho' || l === 'chinese') return 'zh';
  if (l === 'rus' || l === 'russian') return 'ru';
  return 'outro';
}

async function fetchArchivePage(collection, rows = 1000, page = 1) {
  let query = `mediatype:texts AND date:[1500 TO 1928]`;
  if (collection === 'portuguese') {
    query += ` AND language:por`;
  } else {
    query += ` AND collection:${collection}`;
  }

  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator,year,language&rows=${rows}&page=${page}&output=json`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'LinoLivre-Harvester/1.0 (biblioteca digital aberta; educacional)' },
    signal: AbortSignal.timeout(30000)
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} ao consultar Internet Archive`);
  const data = await res.json();
  return data.response?.docs || [];
}

async function getNextStartIds() {
  let fallbackL = 313200;
  let fallbackA = 82000;
  let fallbackK = 413200;

  // Verificar ficheiros SQL já gerados localmente para evitar colisões
  if (fs.existsSync(SQL_DIR)) {
    const files = fs.readdirSync(SQL_DIR).filter(f => f.endsWith('.sql'));
    for (const f of files) {
      try {
        const content = fs.readFileSync(path.join(SQL_DIR, f), 'utf-8');
        const matchesL = content.match(/INSERT OR IGNORE INTO livros \(id,[^)]*VALUES \((\d+),/g);
        if (matchesL) {
          for (const m of matchesL) {
            const num = parseInt(m.match(/VALUES \((\d+),/)[1], 10);
            if (num > fallbackL) fallbackL = num;
          }
        }
        const matchesA = content.match(/INSERT OR IGNORE INTO autores \(id,[^)]*VALUES \((\d+),/g);
        if (matchesA) {
          for (const m of matchesA) {
            const num = parseInt(m.match(/VALUES \((\d+),/)[1], 10);
            if (num > fallbackA) fallbackA = num;
          }
        }
        const matchesK = content.match(/INSERT OR IGNORE INTO links_livros \(id,[^)]*VALUES \((\d+),/g);
        if (matchesK) {
          for (const m of matchesK) {
            const num = parseInt(m.match(/VALUES \((\d+),/)[1], 10);
            if (num > fallbackK) fallbackK = num;
          }
        }
      } catch {}
    }
  }

  try {
    const raw = execSync(`npx wrangler d1 execute ${DB} --remote --command "SELECT MAX(id) AS max_l FROM livros; SELECT MAX(id) AS max_a FROM autores; SELECT MAX(id) AS max_k FROM links_livros;" --json`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
    const jsonStart = raw.indexOf('[');
    if (jsonStart !== -1) {
      const parsed = JSON.parse(raw.slice(jsonStart));
      const maxL = parsed[0]?.results[0]?.max_l || 300000;
      const maxA = parsed[1]?.results[0]?.max_a || 70000;
      const maxK = parsed[2]?.results[0]?.max_k || 400000;
      return {
        nextLivroId: Math.max(maxL + 1, fallbackL + 1),
        nextAutorId: Math.max(maxA + 1, fallbackA + 1),
        nextLinkId: Math.max(maxK + 1, fallbackK + 1)
      };
    }
  } catch (err) {
    console.warn(`   ⚠ Usando limites locais calculados: ${err.message?.slice(0, 80)}`);
  }

  return {
    nextLivroId: fallbackL + 1,
    nextAutorId: fallbackA + 1,
    nextLinkId: fallbackK + 1
  };
}

async function main() {
  const aplicar = process.argv.includes('--apply');
  const colArg = process.argv.indexOf('--collection');
  const collection = colArg !== -1 ? process.argv[colArg + 1] : 'toronto';
  const limitArg = process.argv.indexOf('--limit');
  const maxObras = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : 2000;
  const startPageArg = process.argv.indexOf('--page');
  const startPage = startPageArg !== -1 ? parseInt(process.argv[startPageArg + 1], 10) : 1;

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`🏛️ Harvester Fase 3: Internet Archive Library Collections`);
  console.log(`Coleção: ${collection} | Meta: ${maxObras} obras`);
  console.log(`Modo: ${aplicar ? 'APLICAR (Local + Cloudflare D1)' : 'DRY-RUN (Geração SQL)'}`);
  console.log(`════════════════════════════════════════════════════════════\n`);

  const fonteId = 45; // Internet Archive

  // Mapeamento de Categoria por Coleção
  let catId = 53; // 🏛️ Internet Archive (Domínio Público)
  if (collection === 'biodiversity') {
    catId = 36; // 🔬 Ciências & Matemática
  }

  console.log(`1. A verificar ponto de partida de IDs desimpedidos...`);
  const { nextLivroId, nextAutorId, nextLinkId } = await getNextStartIds();
  let maxL = nextLivroId;
  let maxA = nextAutorId;
  let maxK = nextLinkId;
  console.log(`   ✔ Início seguro: livro_id=${maxL}, autor_id=${maxA}, link_id=${maxK}`);

  const mapaAutores = new Map();
  const setExistentes = new Set();
  const novosLivros = [];
  const novosLinks = [];

  let currentPage = startPage;
  const rowsPerPage = 1000;

  console.log(`\n2. A recolher metadados do Internet Archive...`);
  while (novosLivros.length < maxObras) {
    console.log(`   ▶ A consultar página ${currentPage} (start=${(currentPage - 1) * rowsPerPage})...`);
    let docs = [];
    try {
      docs = await fetchArchivePage(collection, rowsPerPage, currentPage);
    } catch (err) {
      console.warn(`   ⚠ Erro na página ${currentPage}: ${err.message}`);
      break;
    }

    if (!docs.length) {
      console.log(`   ℹ Fim dos resultados na coleção ${collection}.`);
      break;
    }

    for (const d of docs) {
      if (novosLivros.length >= maxObras) break;
      if (!d.identifier || !d.title) continue;

      const extId = `ia-${d.identifier}`;
      if (setExistentes.has(extId)) continue;
      setExistentes.add(extId);

      const titulo = cleanTitle(d.title);
      if (titulo.length < 2) continue;

      const autorNome = cleanAuthor(d.creator);
      const autorChave = autorNome.toLowerCase();

      let autorId;
      if (mapaAutores.has(autorChave)) {
        autorId = mapaAutores.get(autorChave);
      } else {
        maxA++;
        autorId = maxA;
        mapaAutores.set(autorChave, autorId);
      }

      let ano = null;
      if (d.year) {
        const parsedYear = parseInt(d.year, 10);
        if (parsedYear >= 1400 && parsedYear <= 1928) ano = parsedYear;
      }

      const idioma = mapLanguage(d.language);
      const capaUrl = `https://archive.org/services/img/${d.identifier}`;
      const urlLeitura = `https://archive.org/details/${d.identifier}`;

      let sinopse = `Obra histórica digitalizada e preservada pelo Internet Archive (${collection}).`;
      if (d.description) {
        const descText = Array.isArray(d.description) ? d.description.join(' ') : String(d.description);
        const cleanDesc = descText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanDesc.length > 10) sinopse = cleanDesc.slice(0, 400);
      }

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
        licenca: 'dominio-publico'
      });

      novosLinks.push({
        id: linkId,
        livroId,
        formato: 'html',
        url: urlLeitura
      });
    }

    currentPage++;
  }

  console.log(`\n3. Resumo da recolha:`);
  console.log(`   ✔ ${novosLivros.length} obras identificadas e validadas`);
  console.log(`   ✔ ${mapaAutores.size} autores catalogados`);
  console.log(`   ✔ ${novosLinks.length} links diretos para o Internet Archive gerados`);

  if (!novosLivros.length) {
    console.log(`ℹ Nenhuma obra nova a processar.`);
    return;
  }

  fs.mkdirSync(SQL_DIR, { recursive: true });

  const ficheirosSql = [];
  const totalLotes = Math.ceil(novosLivros.length / BATCH_SIZE);
  console.log(`\n4. A gerar ${totalLotes} lotes SQL autónomos em ${path.relative(process.cwd(), SQL_DIR)}...`);

  for (let b = 0; b < totalLotes; b++) {
    const start = b * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, novosLivros.length);
    const loteLivros = novosLivros.slice(start, end);
    const loteLinks = novosLinks.slice(start, end);

    const loteAutoresMap = new Map();
    for (const l of loteLivros) {
      if (l.autorObj) loteAutoresMap.set(l.autorObj.id, l.autorObj);
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

    const batchTag = `${collection}-p${startPage}-b${String(b + 1).padStart(3, '0')}`;
    const fPath = path.join(SQL_DIR, `ia-${batchTag}.sql`);
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
    console.log(`\n🎉 Concluído com sucesso! ${novosLivros.length} obras do Internet Archive adicionadas.`);
  } else {
    console.log(`\nℹ Execução em modo DRY-RUN. Para aplicar, execute com --apply.`);
  }
}

main().catch(err => {
  console.error(`❌ Erro fatal: ${err.message}`);
  process.exit(1);
});
