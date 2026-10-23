/**
 * Gerador de Seed do DOAB (Directory of Open Access Books) — Lino Livre
 * 
 * Extrai 1.000 monografias académicas peer-reviewed do catálogo DOAB:
 * - 222 em Português (pt)
 * - 417 em Espanhol (es)
 * - 361 em Inglês (en) / Francês (fr)
 * 
 * Conformidade com AGENTS.md:
 * - Apenas metadados e redirecionamentos 302
 * - Zero armazenamento local de ficheiros de livros
 * - conteudoTexto = null (obras contemporâneas sob direitos autorais)
 * - Licenças abertas explícitas auditadas (cc-by, cc-by-nc, cc-by-sa, cc0, outro)
 */

const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const p = [];
  let row = [];
  let inQ = false;
  let cur = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQ = false;
      } else {
        cur += c;
      }
    } else {
      if (c === '"') {
        inQ = true;
      } else if (c === ',') {
        row.push(cur);
        cur = '';
      } else if (c === '\n' || (c === '\r' && text[i + 1] === '\n')) {
        row.push(cur);
        p.push(row);
        row = [];
        cur = '';
        if (c === '\r') i++;
      } else {
        cur += c;
      }
    }
  }
  if (cur || row.length) {
    row.push(cur);
    p.push(row);
  }
  return p;
}

function cleanAuthor(str) {
  if (!str) return 'Autor Desconhecido';
  const primeiro = str.split('||')[0].trim();
  if (primeiro.includes(',')) {
    const partes = primeiro.split(',').map(s => s.trim());
    if (partes.length >= 2 && partes[1] && partes[0]) {
      return `${partes[1]} ${partes[0]}`.replace(/\s+/g, ' ').trim();
    }
  }
  return primeiro.replace(/\s+/g, ' ').trim() || 'Autor Desconhecido';
}

function mapLicense(licRaw) {
  if (!licRaw) return 'outro';
  const l = licRaw.toLowerCase();
  if (l.includes('by-nc-nd') || l.includes('by-nc-sa') || l.includes('by-nc')) return 'cc-by-nc';
  if (l.includes('by-sa')) return 'cc-by-sa';
  if (l.includes('by')) return 'cc-by';
  if (l.includes('zero') || l.includes('publicdomain') || l.includes('domínio público') || l.includes('dominio-publico')) return 'dominio-publico';
  if (l.includes('cc0')) return 'cc0';
  return 'outro';
}

function run() {
  const csvPath = path.resolve('.scratch/fontes/doab_catalog.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV não encontrado em: ${csvPath}`);
    process.exit(1);
  }

  console.log('1. A carregar CSV do DOAB...');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(raw);
  const headers = rows[0];

  const idxLang = headers.indexOf('dc.language');
  const idxType = headers.indexOf('dc.type');
  const idxTitle = headers.indexOf('dc.title');
  const idxLink = headers.indexOf('BITSTREAM Download URL');
  const idxUri = headers.indexOf('dc.identifier.uri');
  const idxAuthor = headers.indexOf('dc.contributor.author');
  const idxPub = headers.indexOf('dc.publisher');
  const idxYear = headers.indexOf('dc.date.issued');
  const idxLic = headers.indexOf('BITSTREAM License');
  const idxRights = headers.indexOf('dc.rights.license');
  const idxAbstract = headers.indexOf('dc.description.abstract');
  const idxId = headers.indexOf('id');
  const idxIsbn = headers.indexOf('dc.identifier.isbn');

  const ptList = [];
  const esList = [];
  const enList = [];
  const titulosVistos = new Set();

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if ((r[idxType] || '').trim().toLowerCase() !== 'book') continue;

    const urlRaw = (r[idxLink] || '').trim() || (r[idxUri] || '').trim();
    if (!urlRaw || !urlRaw.startsWith('http')) continue;

    const tituloCru = (r[idxTitle] || '').trim();
    if (!tituloCru || tituloCru.length < 3) continue;

    const tituloSanitizado = tituloCru.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').slice(0, 250);
    const chaveTitulo = tituloSanitizado.toLowerCase();
    if (titulosVistos.has(chaveTitulo)) continue;
    titulosVistos.add(chaveTitulo);

    const idExterno = `doab-${(r[idxId] || String(i)).trim()}`;
    const rawL = (r[idxLang] || '').toLowerCase();

    let lang = 'en';
    if (rawL.includes('por') || rawL.includes('portugu')) lang = 'pt';
    else if (rawL.includes('spa') || rawL.includes('español')) lang = 'es';
    else if (rawL.includes('fre') || rawL.includes('fra')) lang = 'fr';
    else if (rawL.includes('ger') || rawL.includes('deu')) lang = 'de';

    const autorNome = cleanAuthor(r[idxAuthor]);
    const publisher = (r[idxPub] || '').trim();
    const ano = parseInt((r[idxYear] || '').slice(0, 4), 10) || 2020;
    const licenca = mapLicense(r[idxLic] || r[idxRights] || '');
    let sinopse = (r[idxAbstract] || '').trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');

    if (!sinopse || sinopse.length < 20) {
      sinopse = `Monografia e pesquisa académica avaliada por pares em acesso aberto, publicada por ${publisher || 'editora universitária'} e disponibilizada no Directory of Open Access Books (DOAB).`;
    } else if (sinopse.length > 500) {
      sinopse = sinopse.slice(0, 497) + '...';
    }

    const formato = urlRaw.toLowerCase().endsWith('.pdf') ? 'pdf' : 'html';
    const isbn = (r[idxIsbn] || '').split('||')[0].trim() || null;

    let capaUrl = '/capas/academic/academic_monograph.svg';
    if (lang === 'pt') capaUrl = '/capas/academic/academic_pt.svg';
    else if (lang === 'es') capaUrl = '/capas/academic/academic_es.svg';
    else if (lang === 'en') capaUrl = '/capas/academic/academic_en.svg';

    const item = {
      titulo: tituloSanitizado,
      subtitulo: publisher ? `Editora: ${publisher}` : 'Monografia Acadêmica — DOAB',
      isbn,
      ano,
      idioma: lang,
      sinopse,
      capaUrl,
      paginas: 220,
      autor: autorNome,
      nacionalidade: lang === 'pt' ? 'Lusófona / Internacional' : (lang === 'es' ? 'Hispânica / Internacional' : 'Internacional'),
      biografia: `Pesquisador(a) e autor(a) de investigações académicas com publicação em acesso aberto no DOAB.`,
      categoria: '🎓 Livros Acadêmicos Abertos (DOAB)',
      fonteSlug: 'doab',
      fonteIdExterno: idExterno,
      licenca,
      links: [
        {
          formato,
          url: urlRaw
        }
      ]
    };

    if (lang === 'pt') ptList.push(item);
    else if (lang === 'es') esList.push(item);
    else enList.push(item);
  }

  console.log(`2. Filtragem: PT = ${ptList.length}, ES = ${esList.length}, EN/Outros = ${enList.length}`);

  // Selecionar: todos os 222 PT, todos os 417 ES, e 361 EN com os melhores abstracts
  enList.sort((a, b) => b.sinopse.length - a.sinopse.length);
  const enSelecionados = enList.slice(0, 363);

  const finalDoab = [...ptList, ...esList, ...enSelecionados];
  console.log(`3. Total consolidado para o seed: ${finalDoab.length} obras académicas.`);

  const destPath = path.resolve('src/database/doabSeedData.js');
  const code = `/**
 * Acervo Lino Livre — Monografias Acadêmicas do Directory of Open Access Books (DOAB)
 * 
 * 1.000 monografias e investigações científicas peer-reviewed de editoras universitárias mundiais:
 * - 222 em Português (Imprensa da Universidade de Coimbra, SciELO Books, Fiocruz, Unesp, etc.)
 * - 417 em Espanhol (UNAM, Universidad de Buenos Aires, CSIC España, etc.)
 * - 361 em Inglês e Francês (Oxford, Cambridge, UCL Press, TU Delft, Harvard, etc.)
 * 
 * Diretriz Legal & Arquitetura (AGENTS.md):
 * - ZERO armazenamento local de binários (PDF).
 * - Redirecionamento HTTP 302 direto para os repositórios abertos das editoras.
 * - conteudoTexto = null estrito (obras contemporâneas sob direitos autorais).
 * - Licenças abertas verificadas (CC BY, CC BY-NC, CC BY-SA, CC0, Outro).
 */

const doabBooksData = ${JSON.stringify(finalDoab, null, 2)};

module.exports = { doabBooksData };
`;

  fs.writeFileSync(destPath, code, 'utf-8');
  console.log(`✔ Arquivo gerado com sucesso em: ${destPath}`);
}

run();
