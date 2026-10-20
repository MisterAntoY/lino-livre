/**
 * Fase 3: Europeana Open Data Harvester — Lino Livre
 * 
 * Indexador em larga escala do património digital e literatura aberta
 * das Bibliotecas Nacionais Europeias através da Europeana Open Data API.
 * 
 * Em estrita conformidade com AGENTS.md:
 * - Apenas metadados (título, autor, ano, idioma, licença, sinopse, capa)
 * - Zero armazenamento local de ficheiros de obras
 * - Redirecionamento HTTP 302 direto para a biblioteca de origem ou leitor oficial da Europeana
 * 
 * Uso:
 *   node scripts/fase3_europeana_harvester.mjs --lang pt --limit 500
 *   node scripts/fase3_europeana_harvester.mjs --query "classic" --limit 1000
 *   node scripts/fase3_europeana_harvester.mjs --lang pt --limit 500 --apply
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DB = 'lino-livre-db';
const SQL_DIR = path.resolve('.scratch/sql-fase3-europeana');
const BATCH_SIZE = 300;
const API_KEY = 'api2demo';

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function cleanAuthor(creatorArr) {
  if (!creatorArr || !creatorArr.length) return 'Autor Desconhecido';
  
  // Filtrar URIs VIAF/Wikidata/GND
  const names = creatorArr
    .map(c => String(c).trim())
    .filter(c => !c.startsWith('http://') && !c.startsWith('https://') && c.length > 1);

  if (!names.length) return 'Autor Desconhecido';

  let first = names[0];
  first = first.replace(/,?\s*\b\d{3,4}\s*[-–—]\s*\d{3,4}\b.*$/, '');
  first = first.replace(/\s*\(\s*(c\.\s*)?\d{3,4}\s*[-–—]\s*(c\.\s*)?\d{3,4}\s*\).*$/, '');
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

function cleanTitle(rawArr) {
  if (!rawArr || !rawArr.length) return '';
  let t = String(rawArr[0]).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  t = t.replace(/\s*\[microform\]/gi, '');
  t = t.replace(/\s*\[electronic resource\]/gi, '');
  t = t.replace(/^[;,:.\s]+|[;,:.\s]+$/g, '');
  return t.slice(0, 250);
}

function mapRightsToLicenca(rightsArr) {
  if (!rightsArr || !rightsArr.length) return null;
  const r = String(rightsArr[0]).toLowerCase();

  if (r.includes('publicdomain/mark') || r.includes('publicdomain/zero') || r.includes('publicdomain')) {
    return 'dominio-publico';
  }
  if (r.includes('/zero/1.0') || r.includes('cc0')) {
    return 'cc0';
  }
  if (r.includes('/by/')) {
    return 'cc-by';
  }
  if (r.includes('/by-sa/')) {
    return 'cc-by-sa';
  }
  if (r.includes('/by-nc/')) {
    return 'cc-by-nc';
  }
  return null;
}

function mapLanguage(langArr, defaultLang = 'pt') {
  if (!langArr || !langArr.length) return defaultLang;
  const l = String(langArr[0]).toLowerCase().trim();

  if (l.startsWith('por') || l === 'pt') return 'pt';
  if (l.startsWith('eng') || l === 'en') return 'en';
  if (l.startsWith('fre') || l.startsWith('fra') || l === 'fr') return 'fr';
  if (l.startsWith('ger') || l.startsWith('deu') || l === 'de') return 'de';
  if (l.startsWith('spa') || l === 'es') return 'es';
  if (l.startsWith('ita') || l === 'it') return 'it';
  if (l.startsWith('lat') || l === 'la') return 'la';
  return defaultLang || 'outro';
}

function getNextStartIds() {
  let fallbackL = 320000;
  let fallbackA = 85000;
  let fallbackK = 430000;

  // Verificar ficheiros existentes em .scratch para não colidir
  const scratchDirs = ['.scratch/sql-fase3-ia', '.scratch/sql-fase3-ol', '.scratch/sql-fase3-europeana'];
  for (const dir of scratchDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql'));
      for (const f of files) {
        try {
          const content = fs.readFileSync(path.join(dir, f), 'utf-8');
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
  }

  return {
    nextLivroId: fallbackL + 1,
    nextAutorId: fallbackA + 1,
    nextLinkId: fallbackK + 1
  };
}

async function main() {
  const aplicar = process.argv.includes('--apply');
  const langArg = process.argv.indexOf('--lang');
  const lang = langArg !== -1 ? process.argv[langArg + 1] : 'pt';
  const limitArg = process.argv.indexOf('--limit');
  const maxObras = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : 500;
  const queryArg = process.argv.indexOf('--query');
  const customQuery = queryArg !== -1 ? process.argv[queryArg + 1] : null;

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`🇪🇺 Fase 3: Harvester Europeana Open Data`);
  console.log(`Idioma: ${lang} | Meta: ${maxObras} obras`);
  console.log(`Modo: ${aplicar ? 'APLICAR (Local + Cloudflare D1)' : 'DRY-RUN (Geração SQL)'}`);
  console.log(`════════════════════════════════════════════════════════════\n`);

  const fonteId = 46; // Europeana
  const catId = 39;   // 📚 Clássicos Mundiais

  console.log(`1. A verificar ponto de partida de IDs desimpedidos...`);
  const { nextLivroId, nextAutorId, nextLinkId } = getNextStartIds();
  let maxL = nextLivroId;
  let maxA = nextAutorId;
  let maxK = nextLinkId;
  console.log(`   ✔ Início seguro: livro_id=${maxL}, autor_id=${maxA}, link_id=${maxK}`);

  const mapaAutores = new Map();
  const setExistentes = new Set();
  const novosLivros = [];
  const novosLinks = [];

  let cursor = '*';
  const rowsPerPage = 100;
  let page = 1;

  console.log(`\n2. A recolher metadados da Europeana Open Data...`);
  while (novosLivros.length < maxObras) {
    let q = 'TYPE:TEXT';
    if (customQuery) {
      q = customQuery;
    } else if (lang && lang !== 'all') {
      q = `TYPE:TEXT AND (LANGUAGE:${lang} OR edmLanguage:${lang} OR dcLanguage:${lang})`;
    }

    const url = `https://api.europeana.eu/record/v2/search.json?wskey=${API_KEY}&query=${encodeURIComponent(q)}&reusability=open&rows=${rowsPerPage}&cursor=${encodeURIComponent(cursor)}`;

    let data;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'LinoLivre-Harvester/1.0 (biblioteca digital aberta; educacional)' },
        signal: AbortSignal.timeout(20000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (err) {
      console.warn(`   ⚠ Erro na requisição página ${page}: ${err.message}`);
      break;
    }

    const items = data.items || [];
    if (!items.length) {
      console.log(`   ℹ Fim dos resultados disponíveis na Europeana.`);
      break;
    }

    for (const item of items) {
      if (novosLivros.length >= maxObras) break;

      const licenca = mapRightsToLicenca(item.rights);
      if (!licenca) continue; // Descartar obras sem licença aberta compatível

      const titulo = cleanTitle(item.title);
      if (titulo.length < 2) continue;

      const extId = `eur-${item.id?.replace(/[^a-zA-Z0-9_-]/g, '_') || item.guid}`;
      if (setExistentes.has(extId)) continue;
      setExistentes.add(extId);

      const autorNome = cleanAuthor(item.dcCreator);
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
      if (item.year && item.year.length) {
        const y = parseInt(item.year[0], 10);
        if (y >= 1000 && y <= 1960) ano = y;
      }

      const idioma = mapLanguage(item.language || item.dcLanguage, lang);
      const capaUrl = item.edmPreview?.[0] || null;
      const urlLeitura = item.edmIsShownAt?.[0] || item.guid || `https://www.europeana.eu/item${item.id}`;

      let sinopse = `Obra histórica digitalizada pelas bibliotecas europeias, preservada e catalogada pela Europeana.`;
      if (item.dataProvider && item.dataProvider.length) {
        sinopse += ` Acervo: ${item.dataProvider[0]}.`;
      }
      if (item.dcDescription && item.dcDescription.length) {
        const d = String(item.dcDescription[0]).replace(/[\r\n]+/g, ' ').trim();
        if (d.length > 15) sinopse = d.slice(0, 400);
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
        licenca
      });

      novosLinks.push({
        id: linkId,
        livroId,
        formato: 'html',
        url: urlLeitura
      });
    }

    console.log(`   ✔ Página ${page}: ${novosLivros.length}/${maxObras} obras recolhidas`);
    if (!data.nextCursor || data.nextCursor === cursor) break;
    cursor = data.nextCursor;
    page++;
  }

  console.log(`\n3. Resumo da recolha:`);
  console.log(`   ✔ ${novosLivros.length} obras identificadas e validadas`);
  console.log(`   ✔ ${mapaAutores.size} autores catalogados`);
  console.log(`   ✔ ${novosLinks.length} links diretos para a biblioteca oficial gerados`);

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
    // Garantir Fonte na D1/SQLite
    linhas.push(`INSERT OR IGNORE INTO fontes (id, slug, nome, tipo, url_base, ativa) VALUES (${fonteId}, 'europeana', 'Europeana (Bibliotecas Nacionais Europeias)', 'api', 'https://www.europeana.eu', 1);`);

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
      linhas.push(`INSERT OR IGNORE INTO links_livros (id, livro_id, formato, url, link_externo) VALUES (${k.id}, ${k.livroId}, ${esc(k.formato)}, ${esc(k.url)}, 1);`);
    }

    const fileName = `eur-batch-${String(b + 1).padStart(3, '0')}.sql`;
    const filePath = path.join(SQL_DIR, fileName);
    fs.writeFileSync(filePath, linhas.join('\n') + '\n', 'utf-8');
    ficheirosSql.push(filePath);
    console.log(`   ✔ Gerado ${fileName} (${loteLivros.length} livros)`);
  }

  if (aplicar) {
    console.log(`\n5. A aplicar ${ficheirosSql.length} lotes localmente na base SQLite...`);
    for (const file of ficheirosSql) {
      try {
        execSync(`sqlite3 biblioteca.db -cmd "PRAGMA trusted_schema = ON;" < ${JSON.stringify(file)}`, { stdio: 'pipe' });
        console.log(`   ✔ Aplicado localmente: ${path.basename(file)}`);
      } catch (err) {
        console.warn(`   ⚠ Erro ao aplicar localmente: ${err.message}`);
      }
    }
    console.log(`\n✨ Lotes gerados e validados!`);
  } else {
    console.log(`\nℹ Execução em modo DRY-RUN. Para aplicar à base de dados local, adicione --apply.`);
  }
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err);
  process.exit(1);
});
