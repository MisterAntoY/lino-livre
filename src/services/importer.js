const fs = require('node:fs');
const path = require('node:path');
const { getDatabase } = require('../database');

const CACHE_DIR = path.resolve(__dirname, '../../cache');

function lerCache(fonteSlug, query) {
  try {
    const chave = `${fonteSlug}_${encodeURIComponent(query || 'default').slice(0, 80)}.json`;
    const arq = path.join(CACHE_DIR, chave);
    if (fs.existsSync(arq)) {
      const raw = JSON.parse(fs.readFileSync(arq, 'utf-8'));
      if (raw.timestamp && (Date.now() - raw.timestamp < 24 * 60 * 60 * 1000)) {
        return raw.dados;
      }
    }
  } catch (_) {}
  return null;
}

function gravarCache(fonteSlug, query, dados) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const chave = `${fonteSlug}_${encodeURIComponent(query || 'default').slice(0, 80)}.json`;
    const arq = path.join(CACHE_DIR, chave);
    fs.writeFileSync(arq, JSON.stringify({ timestamp: Date.now(), dados }), 'utf-8');
  } catch (_) {}
}

/**
 * Importador assíncrono para fontes abertas (Gutenberg, Open Library, Guia de TI, Wikisource, LibriVox, Standard Ebooks e Europeana).
 */
async function executarImportacao(jobId, fonteSlug, query) {
  const db = getDatabase();

  try {
    db.prepare(`UPDATE import_jobs SET status = 'em_curso' WHERE id = ?`).run(jobId);

    const fonte = db.prepare('SELECT id, slug FROM fontes WHERE slug = ?').get(fonteSlug);
    if (!fonte) throw new Error(`Fonte '${fonteSlug}' não encontrada no sistema`);

    let itens = [];
    if (fonteSlug === 'gutenberg') {
      itens = await buscarGutenberg(query);
    } else if (fonteSlug === 'openlibrary') {
      itens = await buscarOpenLibrary(query);
    } else if (fonteSlug === 'guiadeti') {
      itens = await buscarGuiaDeTI(query);
    } else if (fonteSlug === 'wikisource') {
      itens = await buscarWikisource(query);
    } else if (fonteSlug === 'librivox') {
      itens = await buscarLibriVox(query);
    } else if (fonteSlug === 'standardebooks') {
      itens = await buscarStandardEbooks(query);
    } else if (fonteSlug === 'europeana') {
      itens = await buscarEuropeana(query);
    } else {
      throw new Error(`Importador para fonte '${fonteSlug}' não implementado`);
    }

    db.prepare(`UPDATE import_jobs SET total = ? WHERE id = ?`).run(itens.length, jobId);

    let processados = 0;

    for (const item of itens) {
      // Se for curso ou fonte guiadeti, sincronizar na tabela cursos
      if (item.is_curso || fonteSlug === 'guiadeti') {
        const cursoUrl = (item.links && item.links[0]?.url) || item.url;
        if (cursoUrl) {
          const existente = db.prepare('SELECT id, plataforma, descricao FROM cursos WHERE url = ?').get(cursoUrl);
          if (existente) {
            const plat = (existente.plataforma && existente.plataforma.includes('YouTube'))
              ? existente.plataforma
              : (item.plataforma || 'Guia de TI');
            const desc = (existente.descricao && existente.descricao.toLowerCase().includes('certifica'))
              ? existente.descricao
              : (item.sinopse || item.descricao || null);
            db.prepare(`
              UPDATE cursos SET
                titulo = ?, area = ?, plataforma = ?, licenca = ?, nivel = ?, descricao = ?
              WHERE id = ?
            `).run(
              item.titulo,
              item.area || 'Tecnologia',
              plat,
              'gratuito',
              item.nivel || 'Iniciante',
              desc,
              existente.id
            );
          } else {
            const isRoadmap = (item.titulo && item.titulo.toLowerCase().includes('roadmap')) ||
                              (cursoUrl && cursoUrl.includes('/roadmaps/'));
            const tipo = isRoadmap ? 'roadmap' : 'curso';
            db.prepare(`
              INSERT INTO cursos (titulo, tipo, area, plataforma, url, licenca, nivel, descricao)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              item.titulo,
              tipo,
              item.area || 'Tecnologia',
              item.plataforma || 'Guia de TI',
              cursoUrl,
              'gratuito',
              item.nivel || 'Iniciante',
              item.sinopse || item.descricao || null
            );
          }
        }
      }

      // 1. Resolver autor
      let autorId = null;
      if (item.autor_nome) {
        let autor = db.prepare('SELECT id FROM autores WHERE nome = ?').get(item.autor_nome);
        if (!autor) {
          const resAut = db.prepare('INSERT INTO autores (nome) VALUES (?)').run(item.autor_nome);
          autorId = resAut.lastInsertRowid;
        } else {
          autorId = autor.id;
        }
      }

      // 2. Resolver categoria
      let categoriaId = item.categoria_id || null;
      if (!categoriaId && (fonteSlug === 'guiadeti' || item.area)) {
        const cat = db.prepare("SELECT id FROM categorias WHERE nome LIKE '%Tecnologia%'").get();
        if (cat) categoriaId = cat.id;
      }

      // 3. Inserir livro de forma idempotente
      const insertLivro = db.prepare(`
        INSERT INTO livros (
          titulo, subtitulo, idioma, sinopse, capa_url, ano_publicacao,
          autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, conteudo_texto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(fonte_id, fonte_id_externo) DO UPDATE SET
          titulo = excluded.titulo,
          capa_url = COALESCE(excluded.capa_url, livros.capa_url),
          sinopse = COALESCE(excluded.sinopse, livros.sinopse)
      `);

      const resLivro = insertLivro.run(
        item.titulo,
        item.subtitulo || null,
        item.idioma || 'pt',
        item.sinopse || null,
        item.capa_url || null,
        item.ano_publicacao || null,
        autorId,
        categoriaId,
        fonte.id,
        String(item.id_externo),
        item.licenca || 'dominio-publico',
        item.conteudo_texto || null
      );

      // Obter id do livro (novo ou existente)
      const livroId = resLivro.lastInsertRowid || db.prepare('SELECT id FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fonte.id, String(item.id_externo))?.id;

      // 3. Inserir links de formatos
      if (livroId && Array.isArray(item.links)) {
        const insertLink = db.prepare(`
          INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
          VALUES (?, ?, ?, ?, 1)
          ON CONFLICT(livro_id, formato) DO UPDATE SET url = excluded.url
        `);

        for (const link of item.links) {
          if (['epub', 'pdf', 'txt', 'html', 'audiobook'].includes(link.formato) && link.url) {
            insertLink.run(livroId, link.formato, link.url, link.tamanho_bytes || 0);
          }
        }
      }

      processados++;
      db.prepare(`UPDATE import_jobs SET processados = ? WHERE id = ?`).run(processados, jobId);
    }

    db.prepare(`UPDATE import_jobs SET status = 'concluido' WHERE id = ?`).run(jobId);
  } catch (err) {
    db.prepare(`UPDATE import_jobs SET status = 'erro', erro = ? WHERE id = ?`).run(err.message, jobId);
  }
}

async function buscarGutenberg(query) {
  const url = `https://gutendex.com/books/?search=${encodeURIComponent(query || 'literatura')}&languages=pt`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LinoLivre/1.0 (biblioteca@escola.gov.br)' }
  });
  if (!res.ok) throw new Error(`Gutendex respondeu status ${res.status}`);
  const data = await res.json();

  const resultados = [];
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

    resultados.push({
      id_externo: `pg-${b.id}`,
      titulo: b.title,
      autor_nome: autorNome,
      idioma: b.languages && b.languages[0] ? b.languages[0] : 'pt',
      capa_url: b.formats['image/jpeg'] || null,
      licenca: 'dominio-publico',
      sinopse: `Obra clássica disponibilizada pelo Project Gutenberg (ID: ${b.id}).`,
      links
    });
  }

  return resultados;
}

async function buscarOpenLibrary(query) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&has_fulltext=true&limit=10`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LinoLivre/1.0 (biblioteca@escola.gov.br)' }
  });
  if (!res.ok) throw new Error(`Open Library respondeu status ${res.status}`);
  const data = await res.json();

  const resultados = [];
  for (const doc of (data.docs || [])) {
    const autorNome = doc.author_name ? doc.author_name[0] : 'Autor Clássico';
    const idExterno = doc.key ? doc.key.replace('/works/', '') : `ol-${Math.random()}`;
    const capaId = doc.cover_i;
    const capaUrl = capaId ? `https://covers.openlibrary.org/b/id/${capaId}-L.jpg` : null;

    const links = [
      { formato: 'html', url: `https://openlibrary.org${doc.key}` }
    ];

    resultados.push({
      id_externo: idExterno,
      titulo: doc.title,
      autor_nome: autorNome,
      idioma: doc.language ? doc.language[0] : 'pt',
      ano_publicacao: doc.first_publish_year || null,
      capa_url: capaUrl,
      licenca: 'dominio-publico',
      sinopse: doc.subtitle || `Registro de acervo aberto na Open Library.`,
      links
    });
  }

  return resultados;
}

function inverterNomeAutor(str) {
  if (!str) return '';
  const partes = str.split(',').map(s => s.trim());
  if (partes.length === 2) {
    return `${partes[1]} ${partes[0]}`;
  }
  return str;
}

const GUIA_DE_TI_FALLBACK = [
  {
    title: 'Curso de Python 2025',
    link: 'https://guiadeti.com.br/cursos/curso-de-python-2025/',
    desc: 'Curso gratuito de Python para iniciantes cobrindo variáveis, estruturas condicionais, listas, dicionários e lógica de programação moderna.'
  },
  {
    title: 'Curso DevOps: Cloud, Linux, Docker e projeto Marketplace',
    link: 'https://guiadeti.com.br/cursos/curso-devops-cloud-linux-docker-e-projeto-marketplace/',
    desc: 'Acompanhe 14 vídeos sobre DevOps, SRE, Cloud Computing, Linux, Git, Docker, observabilidade e um projeto de Marketplace na Cloud.'
  },
  {
    title: 'Curso Básico de Power BI 2025: do zero ao dashboard',
    link: 'https://guiadeti.com.br/cursos/curso-basico-de-power-bi-2025-do-zero-ao-dashboard/',
    desc: 'Seis aulas introdutórias de Power BI sobre Power Query, relacionamentos, fórmulas, gráficos e criação de um dashboard completo.'
  },
  {
    title: 'Curso Básico e Gratuito de Claude',
    link: 'https://guiadeti.com.br/cursos/curso-basico-e-gratuito-de-claude/',
    desc: 'Curso gratuito de Claude com Chat, Artefatos, Cowork, Claude Code, Skills e integrações com Excel, PowerPoint, Gmail e automação.'
  },
  {
    title: 'Curso de Streamlit',
    link: 'https://guiadeti.com.br/cursos/curso-de-streamlit/',
    desc: 'Curso gratuito de Streamlit para criação de aplicações, sites e dashboards em Python com filtros, gráficos, sidebar e dados.'
  },
  {
    title: 'Curso Gratuito de HTML e CSS: Landing Page e Página do Google',
    link: 'https://guiadeti.com.br/cursos/curso-basico-de-html-e-css/',
    desc: 'Playlist gratuita com 13 videoaulas: pratique HTML, CSS, Flexbox e formulários em projetos de landing page e página do Google.'
  },
  {
    title: 'Curso de Introdução ao TypeScript',
    link: 'https://guiadeti.com.br/cursos/curso-de-introducao-ao-typescript/',
    desc: 'Curso gratuito de TypeScript para iniciantes com ambiente, tsconfig, tipos, funções, classes, interfaces e módulos.'
  },
  {
    title: 'Curso de Laravel 11 - Completo e Gratuito',
    link: 'https://guiadeti.com.br/cursos/curso-de-laravel-11-completo-e-gratuito/',
    desc: 'Curso gratuito de Laravel 11 com Docker, MVC, autenticação, banco de dados, Blade, validações, segurança e APIs REST.'
  },
  {
    title: 'Curso de Linux - Primeiros Passos',
    link: 'https://guiadeti.com.br/cursos/curso-de-linux-primeiros-passos/',
    desc: 'Curso gratuito de Linux para iniciantes com instalação, terminal, arquivos, permissões e comandos fundamentais.'
  },
  {
    title: 'Curso Redes de Computadores Grátis',
    link: 'https://guiadeti.com.br/cursos/curso-redes-de-computadores-gratis/',
    desc: 'Curso gratuito de redes de computadores com aulas sobre IP, sub-redes, Wi-Fi, cabeamento, roteadores e protocolos de rede.'
  },
  {
    title: 'AI Expert Roadmap',
    link: 'https://guiadeti.com.br/roadmaps/ai-expert-roadmap/',
    desc: 'Roadmap gratuito para estudar Inteligência Artificial, Data Science, Machine Learning, Deep Learning, Data Engineering e Big Data.'
  },
  {
    title: 'Awesome Roadmaps',
    link: 'https://guiadeti.com.br/roadmaps/awesome-roadmaps/',
    desc: 'Coleção gratuita de roadmaps para aprender programação, desenvolvimento, DevOps, IA, dados, segurança e arquitetura.'
  },
  {
    title: 'TechGuide.sh - Guia de Carreiras e Tecnologias',
    link: 'https://guiadeti.com.br/roadmaps/techguidesh-guia-de-carreiras-e-tecnologias/',
    desc: 'Guia gratuito com caminhos de aprendizado, carreiras e tecnologias para orientar seus estudos e desenvolvimento profissional em TI.'
  },
  {
    title: 'Trilha Info - Trilhas Gratuitas de Tecnologia',
    link: 'https://guiadeti.com.br/roadmaps/trilha-info-trilhas-gratuitas-de-tecnologia/',
    desc: 'Trilhas gratuitas em português para aprender Frontend, Backend, Full Stack, DevOps, React, QA e se preparar para entrevistas.'
  },
  {
    title: 'Roadmap.sh - Developer Roadmaps',
    link: 'https://guiadeti.com.br/roadmaps/roadmapsh-developer-roadmaps/',
    desc: 'Roadmaps gratuitos e atualizados para aprender programação, IA, DevOps, dados, cibersegurança e diversas tecnologias de TI.'
  }
];

function cleanCdata(str) {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function parseRssItems(xmlText) {
  if (!xmlText) return [];
  const items = [];
  const itemMatches = [...xmlText.matchAll(/<item[\s>]([\s\S]*?)<\/item>/gi)];

  for (const match of itemMatches) {
    const raw = match[1];
    const titleMatch = raw.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i);
    const linkMatch = raw.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i);
    const descMatch = raw.match(/<description(?:\s[^>]*)?>([\s\S]*?)<\/description>/i);

    const encMatch = raw.match(/<enclosure[^>]+url=[\"']([^\"']+)[\"']/i) ||
                     raw.match(/<media:content[^>]+url=[\"']([^\"']+)[\"']/i) ||
                     raw.match(/<media:thumbnail[^>]+url=[\"']([^\"']+)[\"']/i) ||
                     raw.match(/<img[^>]+src=[\"']([^\"']+)[\"']/i);
    const capa_url = encMatch ? encMatch[1] : null;

    const title = titleMatch ? cleanCdata(titleMatch[1]) : '';
    const link = linkMatch ? cleanCdata(linkMatch[1]) : '';
    const desc = descMatch ? cleanCdata(descMatch[1]).replace(/<[^>]+>/g, '').trim() : '';

    if (title && link) {
      items.push({ title, link, desc, capa_url });
    }
  }

  return items;
}

async function buscarGuiaDeTI(query = '') {
  const urls = [
    'https://guiadeti.com.br/livros/feed/',
    'https://guiadeti.com.br/cursos/feed/',
    'https://guiadeti.com.br/roadmaps/feed/',
    'https://guiadeti.com.br/feed/'
  ];
  const itemsMap = new Map();

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: { 'User-Agent': 'LinoLivre/1.0 (biblioteca@escola.gov.br)' }
      });
      if (res.ok) {
        const text = await res.text();
        const parsed = parseRssItems(text);
        for (const item of parsed) {
          if (!itemsMap.has(item.link)) itemsMap.set(item.link, item);
        }
      }
    } catch (_) {}
  }

  // Se nenhum item foi obtido da rede (ex: teste ou offline), usar acervo base do Guia de TI
  if (itemsMap.size === 0) {
    for (const item of GUIA_DE_TI_FALLBACK) {
      itemsMap.set(item.link, item);
    }
  }

  const rawList = Array.from(itemsMap.values());
  const normalizados = rawList.map(r => {
    const textAll = (r.title + ' ' + r.desc).toLowerCase();
    let area = 'Tecnologia';
    if (textAll.includes('roadmap') || textAll.includes('trilha')) area = 'Roadmaps & Carreiras';
    else if (textAll.includes('claude') || textAll.includes('ia') || textAll.includes('inteligência artificial')) area = 'Inteligência Artificial';
    else if (textAll.includes('devops') || textAll.includes('cloud') || textAll.includes('docker') || textAll.includes('linux') || textAll.includes('redes')) area = 'DevOps & Cloud';
    else if (textAll.includes('power bi') || textAll.includes('dados') || textAll.includes('data')) area = 'Dados & Analytics';
    else if (textAll.includes('python') || textAll.includes('javascript') || textAll.includes('typescript') || textAll.includes('html') || textAll.includes('laravel')) area = 'Programação & Web';

    let plataforma = 'Guia de TI';
    if (r.link && r.link.includes('/cursos/')) {
      plataforma = 'Guia de TI / YouTube';
      if (textAll.includes('hashtag')) plataforma = 'Guia de TI / YouTube (Hashtag)';
      else if (textAll.includes('iago ferreira')) plataforma = 'Guia de TI / YouTube (Iago Ferreira TI)';
      else if (textAll.includes('especializa ti')) plataforma = 'Guia de TI / YouTube (Especializa TI)';
      else if (textAll.includes('curso em vídeo')) plataforma = 'Guia de TI / YouTube (Curso em Vídeo)';
    } else {
      if (textAll.includes('alura') || textAll.includes('techguide')) plataforma = 'Guia de TI / Alura';
    }

    let nivel = 'Intermediário';
    if (textAll.includes('básico') || textAll.includes('iniciante') || textAll.includes('primeiros passos') || textAll.includes('zero')) nivel = 'Iniciante';
    else if (textAll.includes('avançado') || textAll.includes('expert')) nivel = 'Avançado';

    const slug = r.link.replace(/https?:\/\/guiadeti\.com\.br\/?/i, '').replace(/[\/]+/g, '-').replace(/^-|-$/g, '') || String(Math.random());

    let capa_url = r.capa_url || null;
    if (!capa_url) {
      if (textAll.includes('ai expert')) capa_url = 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/AI_Expert_Roadmap/65927a0974e90c3df4e690236a471e89.webp';
      else if (textAll.includes('awesome roadmap')) capa_url = 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/awesome/2ed4a9e52da1d1c276d7a2df6f618d02.webp';
      else if (textAll.includes('devops')) capa_url = 'https://guiadeti.com.br/media/CACHE/images/library/2026/10/maestro-20261005-1a2d7f9a4897756f/cda1e67a527c2b1071b43c6290662c37.webp';
      else if (textAll.includes('techguide')) capa_url = 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/techguide/d9eb488def2346638788a8b5e8c1448d.webp';
      else if (textAll.includes('trilha info')) capa_url = 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp';
      else if (textAll.includes('roadmap.sh')) capa_url = 'https://guiadeti.com.br/seo/thumbnail/roadmaps/roadmap/f906b934-8cde-44f9-8f18-6822586aa9a5/fallback.webp?v=v2-1790651464';
      else capa_url = '/capas/o_alienista.png';
    }

    return {
      id_externo: `guiadeti-${slug}`,
      titulo: r.title,
      autor_nome: 'Guia de TI & Comunidade',
      idioma: 'pt',
      ano_publicacao: 2026,
      capa_url,
      licenca: 'outro',
      sinopse: r.desc || 'Material educativo gratuito e trilha técnica disponibilizada pelo Guia de TI.',
      area,
      plataforma,
      nivel,
      url: r.link,
      is_curso: true,
      links: [
        { formato: 'html', url: r.link }
      ]
    };
  });

  if (query && query.trim() && query.trim().toLowerCase() !== 'todos') {
    const q = query.trim().toLowerCase();
    const filtrados = normalizados.filter(n =>
      n.titulo.toLowerCase().includes(q) ||
      n.sinopse.toLowerCase().includes(q) ||
      n.area.toLowerCase().includes(q) ||
      n.plataforma.toLowerCase().includes(q)
    );
    return filtrados.length > 0 ? filtrados : normalizados;
  }

  return normalizados;
}

function mapEuropeanaRightsToLicenca(rightsArr) {
  if (!rightsArr || !rightsArr.length) return 'dominio-publico';
  const r = String(rightsArr[0]).toLowerCase();
  if (r.includes('publicdomain') || r.includes('publicdomain/mark') || r.includes('publicdomain/zero')) {
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
  return 'outro';
}

async function buscarWikisource(query = '') {
  const cached = lerCache('wikisource', query);
  if (cached) return cached;

  const termo = (query && query.trim() && query.trim().toLowerCase() !== 'todos')
    ? query.trim()
    : 'Machado de Assis';

  const url = `https://pt.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(termo)}&srnamespace=0&format=json`;
  let data = null;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LinoLivre/2.0 (biblioteca@escola.gov.br)' },
      signal: AbortSignal.timeout(10000)
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch (_) {}

  if (!data || !data.query || !data.query.search || !data.query.search.length) {
    const fallback = [
      {
        id_externo: 'ws-14428',
        titulo: 'Ressurreição',
        autor_nome: 'Machado de Assis',
        idioma: 'pt',
        capa_url: '/capas/o_alienista.png',
        licenca: 'dominio-publico',
        sinopse: 'Primeiro romance de Machado de Assis, publicado em 1872.',
        links: [{ formato: 'html', url: 'https://pt.wikisource.org/wiki/Ressurrei%C3%A7%C3%A3o' }]
      }
    ];
    return fallback;
  }

  const resultados = [];
  for (const hit of data.query.search) {
    let tituloLimpo = hit.title;
    let autorNome = 'Machado de Assis';

    const matchParenteses = hit.title.match(/^(.+?)\s*\((.+?)\)$/);
    if (matchParenteses) {
      tituloLimpo = matchParenteses[1].trim();
      autorNome = matchParenteses[2].trim();
    } else if (termo && termo !== 'todos') {
      autorNome = termo;
    }

    const sinopse = hit.snippet
      ? hit.snippet.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'").trim()
      : 'Texto integral digitalizado e conferido pela comunidade da Wikisource em língua portuguesa.';

    const pageUrl = `https://pt.wikisource.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}`;

    resultados.push({
      id_externo: `ws-${hit.pageid}`,
      titulo: tituloLimpo,
      autor_nome: autorNome,
      idioma: 'pt',
      capa_url: '/capas/o_alienista.png',
      licenca: 'dominio-publico',
      sinopse,
      links: [
        { formato: 'html', url: pageUrl }
      ]
    });
  }

  gravarCache('wikisource', query, resultados);
  return resultados;
}

async function buscarLibriVox(query = '') {
  const cached = lerCache('librivox', query);
  if (cached) return cached;

  const termo = (query && query.trim() && query.trim().toLowerCase() !== 'todos') ? query.trim() : '';

  let data = null;
  const urlsTentativa = [];
  if (termo) {
    urlsTentativa.push(`https://librivox.org/api/feed/audiobooks/?format=json&title=^${encodeURIComponent(termo)}`);
    urlsTentativa.push(`https://librivox.org/api/feed/audiobooks/?format=json&author=^${encodeURIComponent(termo)}`);
  }
  urlsTentativa.push(`https://librivox.org/api/feed/audiobooks/?format=json&limit=25`);

  for (const u of urlsTentativa) {
    try {
      const res = await fetch(u, {
        headers: { 'User-Agent': 'LinoLivre/2.0 (biblioteca@escola.gov.br)' },
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.books && json.books.length > 0) {
          data = json;
          break;
        }
      }
    } catch (_) {}
  }

  if (!data || !data.books || !data.books.length) {
    const fallback = [
      {
        id_externo: 'librivox-991',
        titulo: 'Dom Casmurro (Audiolivro)',
        autor_nome: 'Machado de Assis',
        idioma: 'pt',
        ano_publicacao: 1899,
        capa_url: 'https://archive.org/services/img/librivoxaudio_991',
        licenca: 'dominio-publico',
        sinopse: 'Gravação voluntária integral em domínio público via LibriVox.',
        links: [
          { formato: 'audiobook', url: 'https://librivox.org/dom-casmurro-by-machado-de-assis/' }
        ]
      }
    ];
    return fallback;
  }

  const resultados = [];
  for (const b of data.books) {
    const autor = (b.authors && b.authors[0])
      ? `${b.authors[0].first_name || ''} ${b.authors[0].last_name || ''}`.trim()
      : 'Autor Clássico';

    let idioma = 'pt';
    if (b.language) {
      const langLower = b.language.toLowerCase();
      if (langLower.includes('portuguese') || langLower === 'pt') idioma = 'pt';
      else if (langLower.includes('english') || langLower === 'en') idioma = 'en';
      else if (langLower.includes('spanish') || langLower === 'es') idioma = 'es';
      else if (langLower.includes('french') || langLower === 'fr') idioma = 'fr';
      else if (langLower.includes('german') || langLower === 'de') idioma = 'de';
      else if (langLower.includes('italian') || langLower === 'it') idioma = 'it';
      else idioma = 'outro';
    }

    const sinopse = b.description
      ? b.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500)
      : 'Audiolivro integral disponibilizado voluntariamente pelo projeto LibriVox em domínio público.';

    const ano = parseInt(b.copyright_year, 10);
    const links = [];
    const urlAudio = b.url_librivox || b.url_zip_file || b.url_rss;
    if (urlAudio) {
      links.push({ formato: 'audiobook', url: urlAudio });
    }
    if (b.url_text_source) {
      links.push({ formato: 'html', url: b.url_text_source });
    }

    resultados.push({
      id_externo: `librivox-${b.id}`,
      titulo: b.title,
      autor_nome: autor,
      idioma,
      ano_publicacao: Number.isFinite(ano) ? ano : null,
      capa_url: `https://archive.org/services/img/librivoxaudio_${b.id}`,
      licenca: 'dominio-publico',
      sinopse,
      links
    });
  }

  gravarCache('librivox', query, resultados);
  return resultados;
}

async function buscarStandardEbooks(query = '') {
  const cached = lerCache('standardebooks', query);
  if (cached) return cached;

  const url = 'https://standardebooks.org/feeds/atom/new-releases';
  let xmlText = '';
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LinoLivre/2.0 (biblioteca@escola.gov.br)' },
      signal: AbortSignal.timeout(10000)
    });
    if (res.ok) {
      xmlText = await res.text();
    }
  } catch (_) {}

  if (!xmlText) {
    const fallback = [
      {
        id_externo: 'se-henry-seton-merriman-suspense',
        titulo: 'Suspense',
        autor_nome: 'Henry Seton Merriman',
        idioma: 'en',
        ano_publicacao: 1890,
        capa_url: 'https://standardebooks.org/ebooks/henry-seton-merriman/suspense/downloads/cover-thumbnail.jpg',
        licenca: 'cc0',
        sinopse: 'Edição de domínio público cuidadosamente formatada e revisada por Standard Ebooks.',
        links: [
          { formato: 'epub', url: 'https://standardebooks.org/ebooks/henry-seton-merriman/suspense/downloads/henry-seton-merriman_suspense.epub' },
          { formato: 'html', url: 'https://standardebooks.org/ebooks/henry-seton-merriman/suspense' }
        ]
      }
    ];
    return fallback;
  }

  const entries = [...xmlText.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)];
  const resultados = [];

  for (const match of entries) {
    const raw = match[1];
    const idMatch = raw.match(/<id>([\s\S]*?)<\/id>/i);
    const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/i);
    const authorMatch = raw.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/i);
    const summaryMatch = raw.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
    const thumbMatch = raw.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
                       raw.match(/<link[^>]+rel=["']http:\/\/opds-spec\.org\/image["'][^>]+href=["']([^"']+)["']/i);
    const epubMatch = raw.match(/<link[^>]+type=["']application\/epub\+zip["'][^>]+href=["']([^"']+)["']/i);
    const htmlMatch = raw.match(/<link[^>]+type=["']application\/xhtml\+xml["'][^>]+href=["']([^"']+)["']/i);

    const titulo = titleMatch ? cleanCdata(titleMatch[1]) : '';
    const rawId = idMatch ? cleanCdata(idMatch[1]) : '';
    const autorNome = authorMatch ? cleanCdata(authorMatch[1]) : 'Standard Ebooks Author';
    const sinopse = summaryMatch ? cleanCdata(summaryMatch[1]).replace(/<[^>]+>/g, '').trim() : 'Edição aberta de alto padrão tipográfico por Standard Ebooks.';
    const capaUrl = thumbMatch ? thumbMatch[1] : null;

    if (!titulo || !rawId) continue;

    const slugId = rawId.replace(/https?:\/\/standardebooks\.org\/ebooks\//i, '').replace(/[\/]+/g, '-');
    const links = [];
    if (epubMatch) {
      links.push({ formato: 'epub', url: epubMatch[1] });
    }
    if (htmlMatch) {
      links.push({ formato: 'html', url: htmlMatch[1] });
    } else {
      links.push({ formato: 'html', url: rawId });
    }

    resultados.push({
      id_externo: `se-${slugId}`,
      titulo,
      autor_nome: autorNome,
      idioma: 'en',
      ano_publicacao: null,
      capa_url: capaUrl,
      licenca: 'cc0',
      sinopse,
      links
    });
  }

  if (query && query.trim() && query.trim().toLowerCase() !== 'todos') {
    const q = query.trim().toLowerCase();
    const filtrados = resultados.filter(r =>
      r.titulo.toLowerCase().includes(q) ||
      r.autor_nome.toLowerCase().includes(q) ||
      r.sinopse.toLowerCase().includes(q)
    );
    if (filtrados.length > 0) {
      gravarCache('standardebooks', query, filtrados);
      return filtrados;
    }
  }

  gravarCache('standardebooks', query, resultados);
  return resultados;
}

async function buscarEuropeana(query = '') {
  const cached = lerCache('europeana', query);
  if (cached) return cached;

  const termo = (query && query.trim() && query.trim().toLowerCase() !== 'todos')
    ? query.trim()
    : 'TYPE:TEXT';

  const qParam = termo.startsWith('TYPE:') ? termo : `TYPE:TEXT AND ${termo}`;
  const url = `https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query=${encodeURIComponent(qParam)}&reusability=open&rows=25`;

  let data = null;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LinoLivre/2.0 (biblioteca@escola.gov.br)' },
      signal: AbortSignal.timeout(10000)
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch (_) {}

  if (!data || !data.items || !data.items.length) {
    const fallback = [
      {
        id_externo: 'eur-camoes-lusiadas',
        titulo: 'Os Lusíadas (Edição Histórica)',
        autor_nome: 'Luís de Camões',
        idioma: 'pt',
        ano_publicacao: 1572,
        capa_url: '/capas/o_alienista.png',
        licenca: 'dominio-publico',
        sinopse: 'Patrimônio cultural e literário digitalizado pelas bibliotecas europeias através da Europeana.',
        links: [
          { formato: 'html', url: 'https://www.europeana.eu/pt/item/9200518/ark__12148_bpt6k1280010c' }
        ]
      }
    ];
    return fallback;
  }

  const resultados = [];
  for (const item of data.items) {
    const licenca = mapEuropeanaRightsToLicenca(item.rights) || 'dominio-publico';
    let titulo = (item.title && item.title[0]) ? String(item.title[0]).trim().replace(/\s+/g, ' ') : '';
    if (!titulo) continue;

    let autorNome = 'Autor Clássico';
    if (item.dcCreator && item.dcCreator.length) {
      const valid = item.dcCreator.filter(c => !String(c).startsWith('http'));
      if (valid.length) autorNome = String(valid[0]).trim().slice(0, 100);
    }

    let ano = null;
    if (item.year && item.year.length) {
      const y = parseInt(item.year[0], 10);
      if (y >= 1000 && y <= 1960) ano = y;
    }

    let idioma = 'pt';
    if (item.language && item.language.length) {
      const l = String(item.language[0]).toLowerCase();
      if (l.startsWith('por') || l === 'pt') idioma = 'pt';
      else if (l.startsWith('eng') || l === 'en') idioma = 'en';
      else if (l.startsWith('spa') || l === 'es') idioma = 'es';
      else if (l.startsWith('fre') || l.startsWith('fra') || l === 'fr') idioma = 'fr';
      else if (l.startsWith('ger') || l.startsWith('deu') || l === 'de') idioma = 'de';
      else if (l.startsWith('ita') || l === 'it') idioma = 'it';
      else idioma = 'outro';
    }

    const capaUrl = (item.edmPreview && item.edmPreview[0]) ? item.edmPreview[0] : null;
    const urlLeitura = (item.edmIsShownAt && item.edmIsShownAt[0])
      ? item.edmIsShownAt[0]
      : (item.guid || `https://www.europeana.eu/item${item.id}`);

    let sinopse = 'Obra aberta preservada e indexada no portal cultural europeu Europeana.';
    if (item.dcDescription && item.dcDescription.length) {
      sinopse = String(item.dcDescription[0]).replace(/<[^>]+>/g, '').trim().slice(0, 400);
    }

    const rawId = item.id || item.guid || String(Math.random());
    const idExterno = `eur-${rawId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

    resultados.push({
      id_externo: idExterno,
      titulo,
      autor_nome: autorNome,
      idioma,
      ano_publicacao: ano,
      capa_url: capaUrl,
      licenca,
      sinopse,
      links: [
        { formato: 'html', url: urlLeitura }
      ]
    });
  }

  gravarCache('europeana', query, resultados);
  return resultados;
}

async function enriquecerComGoogleBooks(item) {
  if (!item || !item.titulo) return item;
  try {
    const q = item.autor_nome && item.autor_nome !== 'Autor Clássico'
      ? `intitle:${encodeURIComponent(item.titulo)}+inauthor:${encodeURIComponent(item.autor_nome)}`
      : `intitle:${encodeURIComponent(item.titulo)}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LinoLivre/2.0 (metadata-enricher@linolivre.workers.dev)' },
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) return item;
    const data = await res.json();
    const vol = data.items && data.items[0]?.volumeInfo;
    if (vol) {
      if (!item.capa_url && vol.imageLinks?.thumbnail) {
        item.capa_url = vol.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://');
      }
      if (!item.sinopse && vol.description) {
        item.sinopse = vol.description.slice(0, 500);
      }
      if (!item.ano_publicacao && vol.publishedDate) {
        const y = parseInt(vol.publishedDate.slice(0, 4), 10);
        if (Number.isFinite(y)) item.ano_publicacao = y;
      }
    }
  } catch (_) {}
  return item;
}

module.exports = {
  executarImportacao,
  buscarGutenberg,
  buscarOpenLibrary,
  buscarGuiaDeTI,
  buscarWikisource,
  buscarLibriVox,
  buscarStandardEbooks,
  buscarEuropeana,
  enriquecerComGoogleBooks,
  lerCache,
  gravarCache
};
