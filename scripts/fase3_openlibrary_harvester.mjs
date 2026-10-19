/**
 * Fase 3: Open Library / Internet Archive Harvester — Lino Livre
 * 
 * Indexador de obras em domínio público e acesso aberto da Open Library / Internet Archive.
 * Em conformidade estrita com AGENTS.md:
 * - Apenas metadados (título, autor, ano, idioma, licença, sinopse, capa)
 * - Zero armazenamento local de ficheiros de obras
 * - Redirecionamento HTTP 302 direto para o leitor web oficial do Archive.org / Open Library
 * 
 * Uso:
 *   node scripts/fase3_openlibrary_harvester.mjs --query "classic" --limit 500
 *   node scripts/fase3_openlibrary_harvester.mjs --query "classic" --limit 500 --apply
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB = 'lino-livre-db';
const SQL_DIR = path.resolve('.scratch/sql-fase3-ol');
const BATCH_SIZE = 500;

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

function mapLanguage(langList) {
  if (!langList || !langList.length) return 'en';
  const first = String(langList[0]).toLowerCase();
  if (first.startsWith('por') || first === 'pt') return 'pt';
  if (first.startsWith('eng') || first === 'en') return 'en';
  if (first.startsWith('fre') || first.startsWith('fra') || first === 'fr') return 'fr';
  if (first.startsWith('ger') || first.startsWith('deu') || first === 'de') return 'de';
  if (first.startsWith('spa') || first === 'es') return 'es';
  if (first.startsWith('ita') || first === 'it') return 'it';
  return 'outro';
}

async function fetchOpenLibraryPage(query, page = 1) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&has_fulltext=true&public_scan_b=true&limit=100&page=${page}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LinoLivre-Harvester/1.0 (biblioteca digital aberta; educacional)' },
    signal: AbortSignal.timeout(20000)
  });
  if (!res.ok) throw new Error(`Falha ao consultar Open Library API: HTTP ${res.status}`);
  return await res.json();
}

async function main() {
  const aplicar = process.argv.includes('--apply');
  const queryArg = process.argv.indexOf('--query');
  const query = queryArg !== -1 ? process.argv[queryArg + 1] : 'public domain';
  const limitArg = process.argv.indexOf('--limit');
  const maxObras = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : 500;

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`📚 Fase 3: Harvester Open Library & Internet Archive`);
  console.log(`Consulta: "${query}" | Meta: até ${maxObras} obras`);
  console.log(`Modo: ${aplicar ? 'APLICAR (Local + Cloudflare D1)' : 'DRY-RUN (Geração SQL)'}`);
  console.log(`════════════════════════════════════════════════════════════\n`);

  const fonteId = 6; // Open Library (já cadastrada)
  const catId = 39;  // 📚 Clássicos Mundiais (já cadastrada)

  // Espaço de IDs para Fase 3 (sem colisão com Fase 1 ou Fase 2)
  let maxA = 70000;
  let maxL = 300000;
  let maxK = 400000;

  const novosLivros = [];
  const novosLinks = [];
  const mapaAutores = new Map();
  const setObras = new Set();

  let page = 1;
  while (novosLivros.length < maxObras && page <= 20) {
    console.log(`1. A buscar página ${page} da Open Library...`);
    try {
      const data = await fetchOpenLibraryPage(query, page);
      const docs = data.docs || [];
      if (!docs.length) break;

      for (const d of docs) {
        if (novosLivros.length >= maxObras) break;
        if (!d.title || !d.title.trim()) continue;

        const iaId = d.ia && d.ia.length ? d.ia[0] : null;
        if (!iaId) continue; // Precisa ter texto integral escaneado no Internet Archive

        const extId = `ol-${iaId}`;
        if (setObras.has(extId)) continue;
        setObras.add(extId);

        const titulo = d.title.trim().slice(0, 250);
        const autorNome = d.author_name && d.author_name.length ? d.author_name[0].trim() : 'Autor Desconhecido';
        const autorKey = autorNome.toLowerCase();

        let autorId;
        if (mapaAutores.has(autorKey)) {
          autorId = mapaAutores.get(autorKey);
        } else {
          maxA++;
          autorId = maxA;
          mapaAutores.set(autorKey, autorId);
        }

        const ano = d.first_publish_year || (d.publish_year && d.publish_year.length ? d.publish_year[0] : null);
        const idioma = mapLanguage(d.language);
        const capaUrl = d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : `https://archive.org/services/img/${iaId}`;
        const urlLeitura = `https://archive.org/details/${iaId}`;

        let sinopse = `Obra clássica digitalizada preservada no Internet Archive e indexada pela Open Library.`;
        if (d.subject && d.subject.length) {
          sinopse += ` Assuntos: ${d.subject.slice(0, 3).join(', ')}.`;
        }
        sinopse = sinopse.slice(0, 400);

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

      page++;
    } catch (err) {
      console.warn(`   ⚠ Erro na página ${page}: ${err.message}`);
      break;
    }
  }

  console.log(`\n2. Resumo da recolha:`);
  console.log(`   ✔ ${novosLivros.length} obras recolhidas`);
  console.log(`   ✔ ${mapaAutores.size} autores únicos identificados`);
  console.log(`   ✔ ${novosLinks.length} links para o Internet Archive gerados`);

  if (!novosLivros.length) {
    console.log(`ℹ Nenhuma obra nova para gerar.`);
    return;
  }

  fs.mkdirSync(SQL_DIR, { recursive: true });
  for (const f of fs.readdirSync(SQL_DIR)) {
    if (f.startsWith('ol-batch-')) fs.unlinkSync(path.join(SQL_DIR, f));
  }

  const totalLotes = Math.ceil(novosLivros.length / BATCH_SIZE);
  const ficheirosSql = [];
  console.log(`3. A gerar ${totalLotes} ficheiros SQL autónomos em ${path.relative(process.cwd(), SQL_DIR)}...`);

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

    const batchNum = String(b + 1).padStart(3, '0');
    const fPath = path.join(SQL_DIR, `ol-batch-${batchNum}.sql`);
    fs.writeFileSync(fPath, linhas.join('\n') + '\n');
    ficheirosSql.push(fPath);
  }

  console.log(`   ✔ ${ficheirosSql.length} ficheiros SQL gerados.`);

  if (aplicar) {
    console.log(`\n4. A aplicar lotes no SQLite local e Cloudflare D1 remoto...`);
    let aplicados = 0;
    for (const f of ficheirosSql) {
      applyFile(f);
      aplicados++;
      console.log(`   ✔ Progresso: ${aplicados}/${ficheirosSql.length} lotes aplicados.`);
    }
    console.log(`\n🎉 Lotes da Fase 3 aplicados com sucesso!`);
  } else {
    console.log(`\nℹ Execute com --apply para aplicar.`);
  }
}

main().catch(err => {
  console.error(`❌ Erro fatal: ${err.message}`);
  process.exit(1);
});
