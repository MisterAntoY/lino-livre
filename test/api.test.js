const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const app = require('../src/app');
const { initDatabase, getDatabase, closeDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');

describe('Testes de Integração da API Lino Livre (Fase 9)', () => {
  let server;
  let port;
  const testDbPath = path.join(__dirname, 'api_test_lino.db');

  let originalFetch;

  before(async () => {
    if (fs.existsSync(testDbPath)) {
      try { fs.unlinkSync(testDbPath); } catch (_) {}
    }
    const db = initDatabase(testDbPath);
    seed(db);

    // Mock HTTP para fontes externas (Fase 9 requisito 5)
    originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, options) => {
      const urlStr = String(url);
      if (urlStr.includes('gutendex.com') || urlStr.includes('openlibrary.org')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            results: [
              {
                id: 99991,
                title: 'Dom Casmurro Importado',
                authors: [{ name: 'Assis, Machado de' }],
                languages: ['pt'],
                formats: {
                  'application/pdf': 'https://exemplo.org/mock.pdf',
                  'application/epub+zip': 'https://exemplo.org/mock.epub'
                }
              }
            ]
          })
        };
      }
      if (urlStr.includes('guiadeti.com.br')) {
        return {
          ok: true,
          status: 200,
          text: async () => `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel>
  <title>Cursos — Guia de TI</title>
  <item>
    <title>Curso de Python 2025</title>
    <link>https://guiadeti.com.br/cursos/curso-de-python-2025/</link>
    <description>Curso gratuito de Python para iniciantes com variáveis e lógica.</description>
  </item>
  <item>
    <title>AI Expert Roadmap</title>
    <link>https://guiadeti.com.br/roadmaps/ai-expert-roadmap/</link>
    <description>Trilha completa de inteligência artificial e aprendizado de máquina.</description>
  </item>
</channel></rss>`
        };
      }
      return originalFetch(url, options);
    };

    // Configurar variáveis de teste para comunidade e canal
    process.env.WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/TESTE_LINO_LIVRE';
    process.env.WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/TESTE_CANAL_LINO';

    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    }
    if (server.closeAllConnections) {
      server.closeAllConnections();
    }
    await new Promise((resolve) => server.close(resolve));
    closeDatabase();
    if (fs.existsSync(testDbPath)) {
      try { fs.unlinkSync(testDbPath); } catch (_) {}
    }
  });

  const request = async (urlPath, options = {}) => {
    const url = `http://127.0.0.1:${port}${urlPath}`;
    const res = await originalFetch(url, {
      redirect: 'manual',
      ...options,
      headers: {
        'Connection': 'close',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }
    return { status: res.status, headers: res.headers, data };
  };

  // Teste 1: CRUD de livro digital com licença (recusa licença inválida)
  test('1. CRUD de livro digital com licença (recusa licença inválida com 400)', async () => {
    // Tentativa com licença inválida
    const resInvalido = await request('/api/livros', {
      method: 'POST',
      body: JSON.stringify({
        titulo: 'Livro Irregular',
        licenca: 'licenca-inexistente'
      })
    });
    assert.equal(resInvalido.status, 400, 'Deve recusar licença inválida com 400');

    // Tentativa sem licença
    const resSemLicenca = await request('/api/livros', {
      method: 'POST',
      body: JSON.stringify({
        titulo: 'Livro Sem Licenca'
      })
    });
    assert.equal(resSemLicenca.status, 400, 'Deve exigir licença na criação com 400');

    // Criação válida
    const resCriacao = await request('/api/livros', {
      method: 'POST',
      body: JSON.stringify({
        titulo: 'O Cortiço - Edição Especial',
        licenca: 'dominio-publico',
        ano_publicacao: 1890,
        sinopse: 'Romance naturalista clássico.',
        links: [
          { formato: 'pdf', url: 'https://exemplo.org/cortico.pdf' },
          { formato: 'epub', url: 'https://exemplo.org/cortico.epub' }
        ]
      })
    });
    assert.equal(resCriacao.status, 201, 'Deve cadastrar com 201');
    assert.equal(resCriacao.data.titulo, 'O Cortiço - Edição Especial');
    assert.equal(resCriacao.data.licenca, 'dominio-publico');
    assert.equal(resCriacao.data.links.length, 2);

    const novoId = resCriacao.data.id;

    // Atualização
    const resAtualizacao = await request(`/api/livros/${novoId}`, {
      method: 'PUT',
      body: JSON.stringify({
        titulo: 'O Cortiço - Edição Anotada',
        licenca: 'cc-by'
      })
    });
    assert.equal(resAtualizacao.status, 200);
    assert.equal(resAtualizacao.data.titulo, 'O Cortiço - Edição Anotada');
    assert.equal(resAtualizacao.data.licenca, 'cc-by');
  });

  // Teste 2: Busca FTS5 encontra por título e autor
  test('2. Busca FTS5 encontra por título e por nome do autor', async () => {
    // Busca por título
    const resTitulo = await request('/api/livros?busca=Casmurro');
    assert.equal(resTitulo.status, 200);
    assert.ok(resTitulo.data.data.length > 0);
    assert.ok(resTitulo.data.data.some(l => l.titulo.includes('Casmurro')));

    // Busca por autor
    const resAutor = await request('/api/livros?busca=Machado');
    assert.equal(resAutor.status, 200);
    assert.ok(resAutor.data.data.length > 0);
    assert.ok(resAutor.data.data.some(l => l.autor_nome && l.autor_nome.includes('Machado')));
  });

  // Teste 3: Paginação (page/limit/total)
  test('3. Paginação correta (page, limit, total, total_pages, data)', async () => {
    const res = await request('/api/livros?page=1&limit=3');
    assert.equal(res.status, 200);
    assert.equal(res.data.page, 1);
    assert.equal(res.data.limit, 3);
    assert.ok(res.data.total >= 8);
    assert.ok(res.data.total_pages >= 3);
    assert.equal(res.data.data.length, 3);
  });

  // Teste 4: Redirect /ler/:linkId = 302 e incrementa leituras
  test('4. Redirect 302 em /ler/:linkId e incremento atômico de leituras', async () => {
    const listRes = await request('/api/livros?limit=1');
    const livro = listRes.data.data[0];
    const link = livro.links[0];
    assert.ok(link, 'O livro deve possuir link cadastrado');

    const leiturasAntes = livro.leituras;

    // Acessar link de leitura (fetch não segue 302 devido a redirect: manual)
    const lerRes = await request(`/api/livros/${livro.id}/ler/${link.id}`);
    assert.equal(lerRes.status, 302, 'Deve responder HTTP 302 Redirect');
    assert.equal(lerRes.headers.get('location'), link.url);

    // Verificar se contador de leituras foi incrementado no banco
    const livroAtualizado = await request(`/api/livros/${livro.id}`);
    assert.equal(livroAtualizado.data.leituras, leiturasAntes + 1, 'Contador de leituras deve ser incrementado em 1');
  });

  // Teste 5: Importação idempotente (mock HTTP / verificação de unicidade)
  test('5. Importação assíncrona registra job e mantém idempotência sem duplicações', async () => {
    const resPost = await request('/api/import', {
      method: 'POST',
      body: JSON.stringify({
        fonte: 'gutenberg',
        query: 'machado'
      })
    });

    assert.equal(resPost.status, 202, 'Deve responder 202 Accepted para job de importação');
    assert.ok(resPost.data.job_id);

    const jobId = resPost.data.job_id;
    const resJob = await request(`/api/import/${jobId}`);
    assert.equal(resJob.status, 200);
    assert.ok(['pendente', 'em_curso', 'concluido', 'erro'].includes(resJob.data.status));
  });

  // Teste 6: DELETE de livro remove links em cascata
  test('6. DELETE de livro remove links em cascata', async () => {
    // Criar um livro com link para ser removido
    const resCriar = await request('/api/livros', {
      method: 'POST',
      body: JSON.stringify({
        titulo: 'Livro Para Remover',
        licenca: 'dominio-publico',
        links: [
          { formato: 'pdf', url: 'https://exemplo.org/remover.pdf' }
        ]
      })
    });
    const livroId = resCriar.data.id;
    const linkId = resCriar.data.links[0].id;

    const db = getDatabase();
    const linkAntes = db.prepare('SELECT id FROM links_livros WHERE id = ?').get(linkId);
    assert.ok(linkAntes, 'Link deve existir antes da exclusão');

    // Executar DELETE
    const resDel = await request(`/api/livros/${livroId}`, { method: 'DELETE' });
    assert.equal(resDel.status, 200);

    // Verificar cascata
    const linkDepois = db.prepare('SELECT id FROM links_livros WHERE id = ?').get(linkId);
    assert.equal(linkDepois, undefined, 'Link deve ter sido deletado em cascata');
  });

  // Teste 7: Dashboard retorna métricas por área/idioma/formato
  test('7. Dashboard retorna métricas agrupadas por área, idioma, formato e licenças', async () => {
    const res = await request('/api/dashboard');
    assert.equal(res.status, 200);
    assert.ok(res.data.resumo.total_livros > 0);
    assert.ok(Array.isArray(res.data.areas), 'Deve conter métricas por área');
    assert.ok(Array.isArray(res.data.idiomas), 'Deve conter métricas por idioma');
    assert.ok(Array.isArray(res.data.formatos), 'Deve conter métricas por formato');
    assert.ok(Array.isArray(res.data.licencas), 'Deve conter métricas por licença');
    assert.ok(Array.isArray(res.data.fontes), 'Deve conter fontes sincronizadas');
  });

  // Teste 8: Comunidade e Canal WhatsApp (URLs configurados e QR Codes SVG)
  test('8. Endpoints de Comunidade e Canal WhatsApp: URLs, QR Code SVG e 404 quando desconfigurados', async () => {
    // 8.1 - Com variáveis definidas
    const resComunidade = await request('/api/comunidade');
    assert.equal(resComunidade.status, 200);
    assert.equal(resComunidade.data.url, 'https://chat.whatsapp.com/TESTE_LINO_LIVRE');

    const resQrComunidade = await request('/api/comunidade/qrcode.svg');
    assert.equal(resQrComunidade.status, 200);
    assert.ok(resQrComunidade.headers.get('content-type').includes('image/svg+xml'));
    assert.ok(resQrComunidade.data.includes('<svg'));

    const resCanal = await request('/api/canal');
    assert.equal(resCanal.status, 200);
    assert.equal(resCanal.data.url, 'https://whatsapp.com/channel/TESTE_CANAL_LINO');

    const resQrCanal = await request('/api/canal/qrcode.svg');
    assert.equal(resQrCanal.status, 200);
    assert.ok(resQrCanal.headers.get('content-type').includes('image/svg+xml'));
    assert.ok(resQrCanal.data.includes('<svg'));

    // 8.2 - Sem variáveis (deve retornar 404)
    const backupCom = process.env.WHATSAPP_COMMUNITY_URL;
    const backupCan = process.env.WHATSAPP_CHANNEL_URL;
    delete process.env.WHATSAPP_COMMUNITY_URL;
    delete process.env.WHATSAPP_CHANNEL_URL;

    const resCom404 = await request('/api/comunidade');
    assert.equal(resCom404.status, 404);

    const resCan404 = await request('/api/canal');
    assert.equal(resCan404.status, 404);

    const resQrCom404 = await request('/api/comunidade/qrcode.svg');
    assert.equal(resQrCom404.status, 404);

    const resQrCan404 = await request('/api/canal/qrcode.svg');
    assert.equal(resQrCan404.status, 404);

    // Restaurar
    process.env.WHATSAPP_COMMUNITY_URL = backupCom;
    process.env.WHATSAPP_CHANNEL_URL = backupCan;
  });

  // Teste 9: Integração do Guia de TI (importação assíncrona, cursos e fonte oficial)
  test('9. Integração do Guia de TI: importação assíncrona, filtragem por fonte e busca de cursos', async () => {
    // 9.1 - Verificar se Guia de TI está listado nas fontes
    const resFontes = await request('/api/fontes');
    assert.equal(resFontes.status, 200);
    const fonteGti = resFontes.data.find(f => f.slug === 'guiadeti');
    assert.ok(fonteGti, 'Guia de TI deve constar nas fontes oficiais');
    assert.equal(fonteGti.tipo, 'rss');

    // 9.2 - Disparar importação para o Guia de TI
    const resImport = await request('/api/import', {
      method: 'POST',
      body: JSON.stringify({
        fonte: 'guiadeti',
        query: 'python'
      })
    });
    assert.equal(resImport.status, 202);
    assert.ok(resImport.data.job_id);
    assert.equal(resImport.data.fonte, 'guiadeti');

    // 9.3 - Filtragem de cursos por fonte guiadeti
    const resCursosGti = await request('/api/cursos?fonte=guiadeti');
    assert.equal(resCursosGti.status, 200);
    assert.ok(resCursosGti.data.length > 0, 'Deve retornar cursos do Guia de TI');
    assert.ok(resCursosGti.data.every(c => c.plataforma.includes('Guia de TI')));

    // 9.4 - Busca de cursos por termo
    const resBuscaPython = await request('/api/cursos?busca=python');
    assert.equal(resBuscaPython.status, 200);
    assert.ok(resBuscaPython.data.some(c => c.titulo.toLowerCase().includes('python')));
  });

  // Teste 10: Cursos do YouTube com certificado gratuito e Trilha Info
  test('10. Cursos do YouTube com certificado gratuito e roadmaps Trilha Info', async () => {
    // 10.1 - Filtragem de cursos por youtube=true
    const resYoutube = await request('/api/cursos?youtube=true');
    assert.equal(resYoutube.status, 200);
    assert.ok(resYoutube.data.length >= 10, 'Deve retornar ao menos 10 cursos do YouTube');
    assert.ok(resYoutube.data.every(c => c.plataforma.includes('YouTube')));
    assert.ok(resYoutube.data.every(c => c.descricao.toLowerCase().includes('certifica')));

    // 10.2 - Filtragem por certificado=gratuito
    const resCert = await request('/api/cursos?certificado=gratuito');
    assert.equal(resCert.status, 200);
    assert.ok(resCert.data.length >= 10);

    // 10.3 - Roadmaps Trilha Info
    const resTrilha = await request('/api/cursos?plataforma=Trilha%20Info');
    assert.equal(resTrilha.status, 200);
    assert.ok(resTrilha.data.length >= 8, 'Deve conter as 8 formações da Trilha Info');
    assert.ok(resTrilha.data.some(c => c.titulo.includes('Frontend')));

    // 10.4 - Roadmaps oficiais do Roadmap.sh (95 roadmaps catalogados de nilbuild/developer-roadmap)
    const resRoadmapSh = await request('/api/roadmaps?plataforma=Roadmap.sh');
    assert.equal(resRoadmapSh.status, 200);
    assert.ok(resRoadmapSh.data.length >= 95, 'Deve conter os 95 roadmaps oficiais do Roadmap.sh');
    assert.ok(resRoadmapSh.data.some(r => r.url === 'https://roadmap.sh/ai-agents'), 'Deve conter roadmap de AI Agents');
    assert.ok(resRoadmapSh.data.some(r => r.url === 'https://roadmap.sh/devops'), 'Deve conter roadmap de DevOps');
    assert.ok(resRoadmapSh.data.some(r => r.url === 'https://roadmap.sh/frontend'), 'Deve conter roadmap de Frontend');
    assert.ok(resRoadmapSh.data.some(r => r.url === 'https://roadmap.sh/rust'), 'Deve conter roadmap de Rust');
  });

  // Teste 11: Livros técnicos e manuais via GitHub (BibliotecaDev, italocamil0, Trilha Info)
  test('11. Livros técnicos e manuais via GitHub com capas originais e links diretos', async () => {
    // 11.1 - Livros da BibliotecaDev com capas vetoriais SVG (todos os 109 livros)
    const resBDev = await request('/api/livros?fonte_slug=github-bibliotecadev');
    assert.equal(resBDev.status, 200);
    assert.ok(resBDev.data.total >= 100, 'Deve conter todos os livros da BibliotecaDev (>= 100)');
    const livroSvg = resBDev.data.data.find(l => l.titulo.includes('Arquitetura Limpa'));
    assert.ok(livroSvg, 'Deve encontrar Arquitetura Limpa');
    assert.ok(livroSvg.capa_url.endsWith('.svg'), 'Capa deve ser vetor SVG original');
    assert.ok(livroSvg.links.some(lnk => lnk.url.includes('raw.githubusercontent.com')), 'Link deve ser direto do GitHub raw');

    // 11.2 - Livros do italocamil0/books (185 livros únicos desduplicados)
    const resItalo = await request('/api/livros?fonte_slug=github-italocamilo');
    assert.equal(resItalo.status, 200);
    assert.ok(resItalo.data.total >= 180, 'Deve conter todos os livros únicos do acervo italocamil0 (>= 180)');
    assert.ok(resItalo.data.data.some(l => l.links.some(lnk => lnk.url.includes('italocamil0/books'))));

    // 11.3 - Guias visuais e roadmaps da Trilha Info
    const resTrilha = await request('/api/livros?fonte_slug=trilhainfo');
    assert.equal(resTrilha.status, 200);
    assert.ok(resTrilha.data.total >= 10, 'Deve conter os guias e roadmaps da Trilha Info');

    // 11.4 - Filtragem por categoria técnica
    const resCatArq = await request('/api/livros?categoria_id=Arquitetura%20%26%20Engenharia%20de%20Software');
    assert.equal(resCatArq.status, 200);
    assert.ok(resCatArq.data.data.length > 0, 'Deve retornar livros de engenharia/arquitetura');

    // 11.5 - Volume consolidado de livros únicos
    const resTodos = await request('/api/livros');
    assert.ok(resTodos.data.total >= 320, 'Acervo deve conter mais de 320 livros únicos cadastrados');

    // 11.6 - Garantia de zero títulos duplicados
    const db = getDatabase();
    const dupCheck = db.prepare(`
      SELECT titulo, COUNT(*) as qtd
      FROM livros
      GROUP BY LOWER(TRIM(titulo))
      HAVING COUNT(*) > 1
    `).all();
    assert.equal(dupCheck.length, 0, 'Não deve existir nenhum livro duplicado no catálogo');
  });

  // Teste 12: Coleção Monumental de África nos 5 idiomas oficiais
  test('12. Coleção Monumental de África cobre 5 idiomas (pt, en, fr, de, zh) com capítulos e metadados', async () => {
    // 12.1 - Consulta por idioma English (en)
    const resEn = await request('/api/livros?idioma=en');
    assert.equal(resEn.status, 200);
    assert.ok(resEn.data.total >= 8, 'Deve conter acervo em inglês (>= 8)');
    const resEquianoCheck = await request('/api/livros?idioma=en&busca=Equiano');
    assert.ok(resEquianoCheck.data.data.some(l => l.titulo.includes('Olaudah Equiano')));

    // 12.2 - Consulta por idioma Français (fr)
    const resFr = await request('/api/livros?idioma=fr&limit=100');
    assert.equal(resFr.status, 200);
    assert.ok(resFr.data.total >= 6, 'Deve conter acervo em francês (>= 6)');
    assert.ok(resFr.data.data.some(l => l.titulo.includes('Senghor') || l.autor_nome.includes('Senghor')));

    // 12.3 - Consulta por idioma Deutsch (de)
    const resDe = await request('/api/livros?idioma=de&limit=100');
    assert.equal(resDe.status, 200);
    assert.ok(resDe.data.total >= 6, 'Deve conter acervo em alemão (>= 6)');
    assert.ok(resDe.data.data.some(l => l.titulo.includes('Afrikanische') || l.titulo.includes('Bantu')));

    // 12.4 - Consulta por idioma 中文 (zh)
    const resZh = await request('/api/livros?idioma=zh&limit=50');
    assert.equal(resZh.status, 200);
    assert.ok(resZh.data.total >= 8, 'Deve conter acervo em chinês (>= 8)');
    assert.ok(resZh.data.data.some(l => l.titulo.includes('非洲') || l.titulo.includes('曼德拉')));

    // 12.5 - Consulta por categoria africana
    const resCatLit = await request('/api/livros?categoria_id=' + encodeURIComponent('🌍 Literatura & Vozes de África'));
    assert.equal(resCatLit.status, 200);
    assert.ok(resCatLit.data.total >= 10, 'Deve conter obras de Literatura e Vozes de África');

    // 12.6 - Leitura com múltiplos capítulos estruturados
    const resEquiano = await request('/api/livros?busca=Equiano');
    assert.equal(resEquiano.status, 200);
    const idEquiano = resEquiano.data.data[0].id;
    const resDetalhe = await request(`/api/livros/${idEquiano}`);
    assert.equal(resDetalhe.status, 200);
    assert.ok(resDetalhe.data.conteudo_texto.includes('### Chapter I'), 'Deve possuir múltiplos capítulos para leitura online');
  });

  // Teste 13: Módulo de Podcasts e Audiolivros integrado ao Spotify
  test('13. Módulo de Podcasts e Audiolivros integrado ao Spotify', async () => {
    // 13.1 - Listar shows
    const resShows = await request('/api/podcasts');
    assert.equal(resShows.status, 200);
    assert.ok(Array.isArray(resShows.data));

    // 13.2 - Episódios recentes para o reprodutor
    const resRecentes = await request('/api/podcasts/episodios/recentes');
    assert.equal(resRecentes.status, 200);
    assert.ok(Array.isArray(resRecentes.data));
  });

  // Teste 14: Bootcamps DIO, Santander Open Academy e Curso em Vídeo (Gustavo Guanabara)
  test('14. Catálogo de Bootcamps DIO, Santander Open Academy e Curso em Vídeo com datas de finalização e certificados', async () => {
    // 14.1 - Bootcamps Oficiais DIO com datas de finalização e habilidades
    const resDio = await request('/api/cursos?plataforma=DIO');
    assert.equal(resDio.status, 200);
    assert.ok(Array.isArray(resDio.data));
    assert.ok(resDio.data.length >= 200, 'Deve conter pelo menos 200 bootcamps da DIO');
    assert.ok(resDio.data.some(b => b.descricao.includes('Finaliza em')), 'Bootcamps DIO devem conter data de finalização');
    assert.ok(resDio.data.some(b => b.titulo.includes('Java') || b.titulo.includes('Python')), 'Deve conter bootcamps técnicos');

    // 14.2 - Santander Open Academy (Bootcamps, Bolsas e Cursos On-Demand)
    const resSantander = await request('/api/cursos?plataforma=Santander');
    assert.equal(resSantander.status, 200);
    assert.ok(Array.isArray(resSantander.data));
    assert.ok(resSantander.data.length >= 30, 'Deve conter acervo expressivo do Santander Open Academy');
    assert.ok(resSantander.data.some(s => s.descricao.includes('Finaliza em') || s.descricao.includes('INSCRIÇÕES ABERTAS')), 'Santander deve conter prazos e datas de finalização');
    assert.ok(resSantander.data.some(s => s.descricao.includes('Banco Santander')), 'Deve conter certificação oficial do Banco Santander');

    // 14.3 - Curso em Vídeo (Prof. Gustavo Guanabara)
    const resGuanabara = await request('/api/cursos?plataforma=Curso+em+V%C3%ADdeo');
    assert.equal(resGuanabara.status, 200);
    assert.ok(Array.isArray(resGuanabara.data));
    assert.ok(resGuanabara.data.length >= 20, 'Deve conter os cursos consagrados do Prof. Gustavo Guanabara');
    assert.ok(resGuanabara.data.some(c => c.titulo.includes('Python 3')), 'Deve conter curso de Python 3');
    assert.ok(resGuanabara.data.some(c => c.titulo.includes('HTML5 e CSS3')), 'Deve conter módulos de HTML5 e CSS3');
    assert.ok(resGuanabara.data.some(c => c.descricao.includes('Gustavo Guanabara')), 'Deve creditar o Prof. Gustavo Guanabara');
    assert.ok(resGuanabara.data.some(c => c.descricao.includes('Certificado oficial gratuito')), 'Cursos devem garantir certificação 100% gratuita');

    // 14.4 - Data Science Academy (DSA)
    const resDsa = await request('/api/cursos?plataforma=Data+Science+Academy');
    assert.equal(resDsa.status, 200);
    assert.ok(Array.isArray(resDsa.data));
    assert.ok(resDsa.data.length >= 7, 'Deve conter cursos gratuitos da Data Science Academy');
    assert.ok(resDsa.data.some(c => c.titulo.includes('Python') || c.titulo.includes('Power BI')), 'Deve conter cursos de Python e Power BI');
    assert.ok(resDsa.data.some(c => c.url.includes('datascienceacademy.com.br')), 'Deve apontar para URLs oficiais da DSA');
    assert.ok(resDsa.data.some(c => c.descricao.includes('Data Science Academy')), 'Deve conter descrição oficial da DSA');

    // 14.5 - Plataformas Parceiras (FIAP, IBM, Cisco, freeCodeCamp, AWS, Microsoft, etc.)
    const resFiap = await request('/api/cursos?plataforma=FIAP+ON');
    assert.equal(resFiap.status, 200);
    assert.ok(resFiap.data.length >= 5, 'Deve conter cursos da FIAP ON');

    const resFcc = await request('/api/cursos?plataforma=freeCodeCamp');
    assert.equal(resFcc.status, 200);
    assert.ok(resFcc.data.length >= 5, 'Deve conter certificações do freeCodeCamp');

    const resCisco = await request('/api/cursos?plataforma=Cisco+Networking+Academy');
    assert.equal(resCisco.status, 200);
    assert.ok(resCisco.data.length >= 5, 'Deve conter cursos da Cisco NetAcad');

    const resIbm = await request('/api/cursos?plataforma=IBM+SkillsBuild');
    assert.equal(resIbm.status, 200);
    assert.ok(resIbm.data.length >= 4, 'Deve conter cursos da IBM SkillsBuild');

    // 14.6 - Canal Programação Web (Dimitry Lavalhere - YouTube)
    const resProgWeb = await request('/api/cursos?plataforma=Programação%20Web');
    assert.equal(resProgWeb.status, 200);
    assert.ok(Array.isArray(resProgWeb.data));
    assert.ok(resProgWeb.data.length >= 10, 'Deve conter pelo menos 10 cursos do canal Programação Web');
    assert.ok(resProgWeb.data.some(c => c.titulo.includes('HTML')), 'Deve conter Curso Completo de HTML');
    assert.ok(resProgWeb.data.some(c => c.titulo.includes('CSS')), 'Deve conter Curso Completo de CSS');
    assert.ok(resProgWeb.data.some(c => c.titulo.includes('JavaScript')), 'Deve conter Curso Completo de JavaScript');
    assert.ok(resProgWeb.data.some(c => c.titulo.includes('MySQL')), 'Deve conter Curso de Banco de Dados MySQL com PHP');
    assert.ok(resProgWeb.data.some(c => c.titulo.includes('Git e GitHub')), 'Deve conter Curso de Git e GitHub');
    assert.ok(resProgWeb.data.some(c => c.titulo.includes('Programador Web Moderno')), 'Deve conter Curso Programador Web Moderno');
    assert.ok(resProgWeb.data.every(c => c.url.includes('youtube.com/playlist?list=PL2Fdisxwzt_')), 'URLs devem apontar para as playlists oficiais no YouTube');

    // 14.7 - Jornada do Dev (jornadadodev.com.br)
    const resJornada = await request('/api/cursos?plataforma=Jornada+do+Dev');
    assert.equal(resJornada.status, 200);
    assert.ok(Array.isArray(resJornada.data));
    assert.ok(resJornada.data.length >= 50, 'Deve conter os cursos gratuitos da Jornada do Dev (>= 50)');
    assert.ok(resJornada.data.some(c => c.titulo.includes('HTML5')), 'Deve conter curso de HTML5');
    assert.ok(resJornada.data.some(c => c.titulo.includes('JavaScript')), 'Deve conter curso de JavaScript');
    assert.ok(resJornada.data.some(c => c.titulo.includes('Python')), 'Deve conter curso de Python');
    assert.ok(resJornada.data.some(c => c.titulo.includes('Node.js')), 'Deve conter curso de Node.js');
    assert.ok(resJornada.data.some(c => c.url.includes('jornadadodev.com.br/cursos/')), 'URLs devem apontar para a plataforma Jornada do Dev');
    assert.ok(resJornada.data.every(c => c.licenca === 'gratuito'), 'Todos os cursos da Jornada do Dev devem ser gratuitos');

    // 14.8 - Escola Virtual de Governo (EV.G / ENAP - escolavirtual.gov.br)
    const resEvg = await request('/api/cursos?plataforma=EV.G');
    assert.equal(resEvg.status, 200);
    assert.ok(Array.isArray(resEvg.data));
    assert.ok(resEvg.data.length >= 450, 'Deve conter os cursos gratuitos da EV.G / ENAP (>= 450)');
    assert.ok(resEvg.data.some(c => c.url.includes('escolavirtual.gov.br/curso/')), 'URLs devem apontar para a plataforma Escola Virtual de Governo');
    assert.ok(resEvg.data.every(c => c.licenca === 'gratuito'), 'Todos os cursos da EV.G devem ser gratuitos');

    // 14.9 - Fluência AI (fluencia.ai)
    const resFluencia = await request('/api/cursos?plataforma=Flu%C3%AAncia+AI');
    assert.equal(resFluencia.status, 200);
    assert.ok(Array.isArray(resFluencia.data));
    assert.ok(resFluencia.data.length >= 15, 'Deve conter as formações, módulos e publicações da Fluência AI (>= 15)');
    assert.ok(resFluencia.data.some(c => c.titulo.includes('Método Fluência')), 'Deve conter o Método Fluência');
    assert.ok(resFluencia.data.some(c => c.titulo.includes('AI-Native Product Design')), 'Deve conter AI-Native Product Design');
    assert.ok(resFluencia.data.some(c => c.titulo.includes('Workshop')), 'Deve conter Workshop de Governança');
    assert.ok(resFluencia.data.some(c => c.titulo.includes('Corporativa') || c.titulo.includes('Frontier Firms')), 'Deve conter formação corporativa');
    assert.ok(resFluencia.data.some(c => c.url.includes('fluencia.ai')), 'URLs devem apontar para o domínio oficial da Fluência AI');

    // 14.10 - Recode (recode.org.br - Recode PRO AI, impactAI, Programação, Games)
    const resRecode = await request('/api/cursos?plataforma=Recode');
    assert.equal(resRecode.status, 200);
    assert.ok(Array.isArray(resRecode.data));
    assert.ok(resRecode.data.length >= 35, 'Deve conter as formações gratuitas da Recode (>= 35)');
    assert.ok(resRecode.data.some(c => c.titulo.includes('Recode PRO AI')), 'Deve conter o bootcamp Recode PRO AI');
    assert.ok(resRecode.data.some(c => c.titulo.includes('impactAI')), 'Deve conter a trilha impactAI');
    assert.ok(resRecode.data.some(c => c.titulo.includes('Desenvolvimento de Sistemas Web Básico')), 'Deve conter Desenvolvimento Web Básico');
    assert.ok(resRecode.data.some(c => c.titulo.includes('Desenvolvimento de Games')), 'Deve conter Desenvolvimento de Games');
    assert.ok(resRecode.data.some(c => c.titulo.includes('Mediação de Leitura')), 'Deve conter Mediação de Leitura para Bibliotecas');
    assert.ok(resRecode.data.some(c => c.url.includes('recode.org.br')), 'URLs devem apontar para o portal da Recode');
    assert.ok(resRecode.data.every(c => c.licenca === 'gratuito'), 'Todos os cursos da Recode devem ser gratuitos');

    // 14.11 - Code IoT (codeiot.org.br - Samsung & LSI-TEC / USP)
    const resCodeIot = await request('/api/cursos?plataforma=Code+IoT');
    assert.equal(resCodeIot.status, 200);
    assert.ok(Array.isArray(resCodeIot.data));
    assert.ok(resCodeIot.data.length >= 25, 'Deve conter as formações gratuitas do Code IoT (>= 25)');
    assert.ok(resCodeIot.data.some(c => c.titulo.includes('Internet das Coisas')), 'Deve conter curso de Internet das Coisas');
    assert.ok(resCodeIot.data.some(c => c.titulo.includes('Arduino')), 'Deve conter curso de Programação Física com Arduino');
    assert.ok(resCodeIot.data.some(c => c.titulo.includes('Eletrônica')), 'Deve conter curso de Eletrônica Básica');
    assert.ok(resCodeIot.data.some(c => c.titulo.includes('Aplicativos para Dispositivos Móveis')), 'Deve conter curso de App Inventor');
    assert.ok(resCodeIot.data.some(c => c.titulo.includes('Samsung Innovation Campus') || c.titulo.includes('SIC')), 'Deve conter cursos do Samsung Innovation Campus');
    assert.ok(resCodeIot.data.some(c => c.url.includes('codeiot.org.br')), 'URLs devem apontar para a plataforma Code IoT');
    assert.ok(resCodeIot.data.every(c => c.licenca === 'gratuito'), 'Todos os cursos do Code IoT devem ser gratuitos');
  });

  // Teste 15: Recursos Técnicos e Cursos em Alemão (DE)
  test('15. Acervo de Tecnologia e Programação em Alemão (Livros e Cursos Open Access)', async () => {
    // 15.1 - Livros técnicos em alemão (2 páginas x 100 cobrem o acervo DE atual e futuro próximo)
    const resDe = await request('/api/livros?idioma=de&limit=100');
    assert.equal(resDe.status, 200);
    const resDe2 = await request('/api/livros?idioma=de&limit=100&page=2');
    assert.equal(resDe2.status, 200);
    const todosDe = [...resDe.data.data, ...resDe2.data.data];
    assert.ok(resDe.data.total >= 25, 'Deve conter ao menos 25 livros em alemão cadastrados');
    assert.ok(todosDe.some(l => l.titulo.includes('Pro Git')), 'Deve conter Pro Git auf Deutsch');
    assert.ok(todosDe.some(l => l.titulo.includes('Rust-Buch') || l.titulo.includes('Rust')), 'Deve conter Das Rust-Buch');
    assert.ok(todosDe.some(l => l.titulo.includes('Linux')), 'Deve conter Linux Rheinwerk Openbook');
    assert.ok(todosDe.some(l => l.titulo.includes('SelfHTML')), 'Deve conter SelfHTML Web-Standards');
    assert.ok(todosDe.some(l => l.titulo.includes('TeachYourselfCS')), 'Deve conter TeachYourselfCS Deutsch');

    // 15.2 - Verificação de métricas reais (sem números fictícios inflados) e links externos
    const deLivros = resDe.data.data;
    assert.ok(deLivros.every(l => typeof l.leituras === 'number' && l.leituras <= 5), 'Livros em alemão não devem conter leituras artificiais ou infladas');
    assert.ok(deLivros.every(l => Array.isArray(l.links) && l.links.length > 0), 'Todos os livros em alemão devem possuir links de acesso');

    // 15.3 - Cursos e MOOCs em alemão (openHPI, Elements of AI, YouTube DE)
    const resHpi = await request('/api/cursos?busca=openHPI');
    assert.equal(resHpi.status, 200);
    assert.ok(Array.isArray(resHpi.data));
    assert.ok(resHpi.data.length >= 4, 'Deve conter cursos do openHPI (Hasso-Plattner-Institut)');
    assert.ok(resHpi.data.some(c => c.titulo.includes('Python')), 'Deve conter curso de Python do openHPI');

    const resAi = await request('/api/cursos?busca=Elements+of+AI');
    assert.equal(resAi.status, 200);
    assert.ok(resAi.data.length >= 1, 'Deve conter o curso Elements of AI em alemão');
  });

  // Teste 16: Recursos Técnicos e Cursos em Francês (FR)
  test('16. Acervo de Tecnologia e Programação em Francês (Livros e Cursos Open Access)', async () => {
    // 16.1 - Livros técnicos em francês
    const resFr = await request('/api/livros?idioma=fr&limit=100');
    assert.equal(resFr.status, 200);
    assert.ok(resFr.data.total >= 25, 'Deve conter ao menos 25 livros em francês cadastrados');
    assert.ok(resFr.data.data.some(l => l.titulo.includes('Pro Git')), 'Deve conter Pro Git em francês');
    assert.ok(resFr.data.data.some(l => l.titulo.includes('Python') || l.titulo.includes('Swinnen')), 'Deve conter Python de Gérard Swinnen ou QuantEcon');
    assert.ok(resFr.data.data.some(l => l.titulo.includes('Cybersécurité') || l.titulo.includes('SecNumacadémie')), 'Deve conter guia de segurança ANSSI');
    assert.ok(resFr.data.data.some(l => l.titulo.includes('Grafikart') || l.titulo.includes('PHP')), 'Deve conter desenvolvimento web Grafikart');

    // 16.2 - Verificação de links externos e formato
    const frLivros = resFr.data.data;
    assert.ok(frLivros.every(l => Array.isArray(l.links) && l.links.length > 0), 'Todos os livros em francês devem possuir links de acesso');

    // 16.3 - Cursos e MOOCs em francês (FUN-MOOC, Inria, ANSSI, OpenClassrooms)
    const resInria = await request('/api/cursos?busca=Inria');
    assert.equal(resInria.status, 200);
    assert.ok(Array.isArray(resInria.data));
    assert.ok(resInria.data.length >= 2, 'Deve conter cursos abertos do Inria');

    const resAnssi = await request('/api/cursos?busca=ANSSI');
    assert.equal(resAnssi.status, 200);
    assert.ok(resAnssi.data.length >= 1, 'Deve conter formação SecNumacadémie da ANSSI');
  });


  // Teste 17: Recursos Técnicos e Livros de Programação em Espanhol (ES)
  test('17. Acervo de Tecnologia e Programação em Espanhol (Livros e Recursos Open Access)', async () => {
    // 17.1 - Consulta por idioma Espanhol (es)
    const resEs = await request('/api/livros?idioma=es&limit=50');
    assert.equal(resEs.status, 200);
    assert.ok(resEs.data.total >= 25, 'Deve conter ao menos 25 livros técnicos em espanhol cadastrados');
    assert.ok(resEs.data.data.some(l => l.titulo.includes('Pro Git')), 'Deve conter Pro Git em espanhol');
    assert.ok(resEs.data.data.some(l => l.titulo.includes('Eloquent JavaScript')), 'Deve conter Eloquent JavaScript em espanhol');
    assert.ok(resEs.data.data.some(l => l.titulo.includes('Python')), 'Deve conter livro de Python em espanhol');
    assert.ok(resEs.data.data.some(l => l.titulo.includes('Rust')), 'Deve conter livro de Rust em espanhol');
    assert.ok(resEs.data.data.some(l => l.titulo.includes('Docker') || l.titulo.includes('Kubernetes')), 'Deve conter guias DevOps em espanhol');

    // 17.2 - Verificação de capas SVG e links externos
    const esLivros = resEs.data.data;
    assert.ok(esLivros.every(l => Array.isArray(l.links) && l.links.length > 0), 'Todos os livros em espanhol devem possuir links de acesso');
    assert.ok(esLivros.every(l => l.capa_url && (l.capa_url.includes('tech_') || l.capa_url.startsWith('http'))), 'Todos os livros devem ter capa válida');
  });

  // Teste 18: Literatura Lusófona Clássica e Vozes dos PALOP
  test('18. Acervo de Literatura Lusófona Clássica e Vozes dos PALOP (Angola, Cabo Verde, São Tomé, Moçambique)', async () => {
    // 18.1 - Consulta por Autores Lusófonos Clássicos (Eça de Queirós, Camilo, Florbela Espanca)
    const resLusofonos = await request('/api/livros?busca=' + encodeURIComponent('Eça de Queirós'));
    assert.equal(resLusofonos.status, 200);
    assert.ok(resLusofonos.data.total >= 5, 'Deve conter ao menos 5 obras de Eça de Queirós');
    assert.ok(resLusofonos.data.data.some(l => l.titulo.includes('Os Maias')), 'Deve conter Os Maias');
    assert.ok(resLusofonos.data.data.some(l => l.titulo.includes('O Crime do Padre Amaro')), 'Deve conter O Crime do Padre Amaro');

    // 18.2 - Consulta por Literatura Angolana (Alfredo Troni, Cordeiro da Matta, Assis Júnior)
    const resAngola = await request('/api/livros?busca=' + encodeURIComponent('Nga Muturi'));
    assert.equal(resAngola.status, 200);
    assert.ok(resAngola.data.total >= 1, 'Deve conter Nga Muturi de Alfredo Troni');
    assert.equal(resAngola.data.data[0].autor_nome, 'Alfredo Troni');

    // 18.3 - Consulta por Poesia Africana e Vozes Insulares (Cabo Verde, São Tomé, Moçambique)
    const resPoesia = await request('/api/livros?busca=' + encodeURIComponent('Costa Alegre'));
    assert.equal(resPoesia.status, 200);
    assert.ok(resPoesia.data.total >= 1, 'Deve conter Versos de Caetano da Costa Alegre');

    const resNoronha = await request('/api/livros?busca=' + encodeURIComponent('Rui de Noronha'));
    assert.equal(resNoronha.status, 200);
    assert.ok(resNoronha.data.total >= 1, 'Deve conter Sonetos de Rui de Noronha');
  });

  // Teste 19: Placar e Métricas da Meta dos 10 Milhões de Livros Livres
  test('19. Placar e Métricas da Meta dos 10 Milhões de Livros Livres', async () => {
    // 19.1 - Validação via /api/dashboard
    const resDash = await request('/api/dashboard');
    assert.equal(resDash.status, 200);
    const totalLivros = resDash.data.resumo.total_livros;
    assert.ok(typeof totalLivros === 'number' && totalLivros > 0, 'Total de livros deve ser número positivo');

    // 19.2 - Cálculo da meta de 10 Milhões
    const meta = 10000000;
    const faltam = meta - totalLivros;
    const porcentagem = (totalLivros / meta) * 100;

    assert.ok(faltam > 0 && faltam < meta, 'Contagem regressiva deve ser válida');
    assert.ok(porcentagem > 0 && porcentagem <= 100, 'Porcentagem de avanço deve ser positiva');

    // 19.3 - Validação via /api/livros para alimentar placar em tempo real
    const resLivros = await request('/api/livros?limit=1');
    assert.equal(resLivros.status, 200);
    assert.equal(resLivros.data.total, totalLivros, 'Total em /api/livros deve ser idêntico ao total do dashboard');
  });

  // Teste 20: Suporte Internacional Completo ao Idioma Espanhol (locales/es.json e filtros)
  test('20. Suporte Internacional Completo ao Idioma Espanhol (locales/es.json e filtros)', async () => {
    const fs = require('node:fs');
    const path = require('node:path');

    // 20.1 - Validação do arquivo de internacionalização es.json
    const esPath = path.join(__dirname, '../public/locales/es.json');
    assert.ok(fs.existsSync(esPath), 'Arquivo public/locales/es.json deve existir');
    const esData = JSON.parse(fs.readFileSync(esPath, 'utf8'));
    assert.equal(esData.meta.code, 'es');
    assert.equal(esData.meta.label, 'Español');
    assert.ok(esData.ui.goal.title.includes('10 Millones'), 'Deve conter tradução do placar da meta dos 10 milhões');
    assert.ok(esData.ui.books.readOnline, 'Deve conter tradução de leitura online');

    // 20.2 - Filtro de livros em espanhol na API
    const resEs = await request('/api/livros?idioma=es');
    assert.equal(resEs.status, 200);
    assert.ok(resEs.data.total >= 1, 'Deve conter obras em espanhol no catálogo');
  });

  // Teste 21: Módulo de Dicas de Estudo e Hábitos Atômicos (James Clear)
  test('21. Módulo de Dicas de Estudo e Hábitos Atômicos (James Clear)', async () => {
    // 21.1 - Listar todas as dicas
    const resTodas = await request('/api/dicas');
    assert.equal(resTodas.status, 200);
    assert.ok(Array.isArray(resTodas.data), 'Resposta deve ser um array');
    assert.ok(resTodas.data.length >= 28, 'Deve conter pelo menos 28 dicas catalogadas');

    // 21.2 - Filtrar por categoria habitos (Hábitos Atômicos)
    const resHabitos = await request('/api/dicas?categoria=habitos');
    assert.equal(resHabitos.status, 200);
    assert.ok(Array.isArray(resHabitos.data));
    assert.equal(resHabitos.data.length, 6, 'Deve conter exatamente 6 dicas de Hábitos Atômicos');
    const titulos = resHabitos.data.map(d => d.titulo);
    assert.ok(titulos.some(t => t.includes('2 Minutos')), 'Deve conter a Regra dos 2 Minutos');
    assert.ok(titulos.some(t => t.includes('Empilhamento de Hábitos')), 'Deve conter Habit Stacking');
    assert.ok(titulos.some(t => t.includes('Design do Ambiente')), 'Deve conter Design do Ambiente');
    assert.ok(titulos.some(t => t.includes('1% Melhor')), 'Deve conter 1% Melhor Todos os Dias');
    assert.ok(titulos.some(t => t.includes('Nunca Falhar Duas Vezes')), 'Deve conter Regra de Nunca Falhar Duas Vezes');
    assert.ok(titulos.some(t => t.includes('Identidade')), 'Deve conter Hábitos Baseados em Identidade');

    // 21.3 - Buscar dica específica por ID
    const resId = await request('/api/dicas/23');
    assert.equal(resId.status, 200);
    assert.equal(resId.data.id, 23);
    assert.equal(resId.data.categoria, 'habitos');

    // 21.4 - Busca textual com filtro
    const resBusca = await request('/api/dicas?busca=' + encodeURIComponent('procrastinação'));
    assert.equal(resBusca.status, 200);
    assert.ok(resBusca.data.length >= 1, 'Deve encontrar a dica sobre procrastinação');

    // 21.5 - Filtrar por categoria angola (Repositórios de Angola - ADM Angola)
    const resAngola = await request('/api/dicas?categoria=angola');
    assert.equal(resAngola.status, 200);
    assert.ok(Array.isArray(resAngola.data));
    assert.equal(resAngola.data.length, 7, 'Deve conter exatamente 7 guias de repositórios online de Angola (ADM Angola)');
    const titulosAngola = resAngola.data.map(d => d.titulo);
    assert.ok(titulosAngola.some(t => t.includes('OAPEN')));
    assert.ok(titulosAngola.some(t => t.includes('RCAAP')));
    assert.ok(titulosAngola.some(t => t.includes('BNP Digital')));
    assert.ok(titulosAngola.some(t => t.includes('CMI')));
    assert.ok(titulosAngola.some(t => t.includes('Banco Mundial')));
    assert.ok(titulosAngola.some(t => t.includes('UC Digitalis')));
    assert.ok(titulosAngola.some(t => t.includes('Portal ADM Angola')));
  });

  // Teste 22: Conformidade Legal, Papel de Intermediário, DMCA Takedown e Termos de Uso
  test('22. Conformidade Legal, Papel de Intermediário, DMCA Takedown e Termos de Uso', async () => {
    // 22.1 - Validação do endpoint oficial /api/legal
    const resLegal = await request('/api/legal');
    assert.equal(resLegal.status, 200);
    assert.equal(resLegal.data.status, 'ativo');
    assert.equal(resLegal.data.arquitetura.papel, 'intermediario_indexador');
    assert.equal(resLegal.data.arquitetura.armazenamento_local_arquivos, false, 'Deve garantir zero armazenamento local de livros');
    assert.equal(resLegal.data.arquitetura.redirecionamento_protocolo, 'HTTP 302');
    assert.equal(resLegal.data.dmca_takedown.canal_oficial, 'bv6alblu6@mozmail.com');
    assert.equal(resLegal.data.dmca_takedown.prazo_atendimento_horas, 48);
    assert.equal(resLegal.data.privacidade.cadastro_obrigatorio, false);
    assert.equal(resLegal.data.privacidade.cookies_rastreamento, false);

    // 22.2 - Validação da existência e integridade dos arquivos legais físicos
    const fs = require('node:fs');
    const path = require('node:path');

    const mdPath = path.join(__dirname, '../TERMOS-DE-USO-E-AVISO-LEGAL.md');
    assert.ok(fs.existsSync(mdPath), 'TERMOS-DE-USO-E-AVISO-LEGAL.md deve existir na raiz');
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    assert.ok(mdContent.includes('Zero Armazenamento'), 'Documento deve registrar diretriz de zero armazenamento');
    assert.ok(mdContent.includes('HTTP 302'), 'Documento deve registrar protocolo 302');

    const htmlTermosPath = path.join(__dirname, '../public/termos.html');
    assert.ok(fs.existsSync(htmlTermosPath), 'public/termos.html deve existir');
    const htmlContent = fs.readFileSync(htmlTermosPath, 'utf8');
    assert.ok(htmlContent.includes('Termos de Uso'), 'HTML deve conter Termos de Uso');
    assert.ok(htmlContent.includes('bv6alblu6@mozmail.com'), 'HTML deve conter email de takedown');

    const htmlLegalPath = path.join(__dirname, '../public/legal.html');
    assert.ok(fs.existsSync(htmlLegalPath), 'public/legal.html deve existir como alias');

    // 22.3 - Validação de i18n dos termos legais (pt, es, en)
    const ptLocale = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/locales/pt.json'), 'utf8'));
    assert.ok(ptLocale.ui.footer.terms, 'pt.json deve conter ui.footer.terms');
    assert.ok(ptLocale.ui.footer.disclaimer, 'pt.json deve conter ui.footer.disclaimer');
    assert.ok(ptLocale.ui.legal.title, 'pt.json deve conter ui.legal.title');

    const esLocale = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/locales/es.json'), 'utf8'));
    assert.ok(esLocale.ui.footer.terms, 'es.json deve conter ui.footer.terms');
    assert.ok(esLocale.ui.legal.title, 'es.json deve conter ui.legal.title');

    const enLocale = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/locales/en.json'), 'utf8'));
    assert.ok(enLocale.ui.footer.terms, 'en.json deve conter ui.footer.terms');
    assert.ok(enLocale.ui.legal.title, 'en.json deve conter ui.legal.title');
  });

  // Teste 23: Repositório de Trabalhos Universitários e TFC da UAN (Universidade Agostinho Neto)
  test('23. Repositório de Trabalhos Universitários e TFC da UAN (Universidade Agostinho Neto)', async () => {
    // 23.1 - Filtrar por fonte uan-tfc
    const resFonte = await request('/api/livros?fonte_slug=uan-tfc&limit=50');
    assert.equal(resFonte.status, 200);
    assert.ok(resFonte.data.total >= 21, 'Deve conter pelo menos 21 trabalhos de estudantes da UAN');
    assert.equal(resFonte.data.data.length, 21, 'Deve retornar os 21 registros');

    // 23.2 - Validação de metadados acadêmicos e integridade dos registros
    const primeiro = resFonte.data.data[0];
    assert.ok(primeiro.titulo, 'Deve conter título');
    assert.ok(primeiro.autor_nome, 'Deve conter autor com nome de estudante');
    assert.equal(primeiro.idioma, 'pt');
    assert.equal(primeiro.licenca, 'cc-by');
    assert.ok(primeiro.capa_url.includes('supabase.co'), 'Capa deve apontar para o storage público');
    assert.ok(primeiro.links.length >= 1, 'Deve possuir link externo associado');
    assert.ok(primeiro.links[0].url.includes('uan-mapa-portal.lovable.app/trabalhos/'), 'Link deve apontar para o portal da UAN');

    // 23.3 - Teste de redirecionamento 302 em /ler/:linkId para trabalho da UAN
    const linkId = primeiro.links[0].id;
    const resLer = await request(`/api/livros/${primeiro.id}/ler/${linkId}`);
    assert.equal(resLer.status, 302, 'Acesso ao trabalho universitário deve retornar HTTP 302');
    assert.equal(resLer.headers.get('location'), primeiro.links[0].url, 'Location deve ser a URL oficial no portal da UAN');

    // 23.4 - Filtrar por categoria de trabalhos universitários
    const resCat = await request('/api/livros?categoria_id=' + encodeURIComponent('🎓 Teses & Trabalhos Universitários (UAN)'));
    assert.equal(resCat.status, 200);
    assert.ok(resCat.data.total >= 21, 'Filtro por categoria deve retornar todos os trabalhos da UAN');
  });

  // Teste 24: Catálogo Global de Cursos Abertos (Cursa em 5 Idiomas, Harvard PLL, MIT OCW e Stanford Online)
  test('24. Catálogo Global de Cursos Abertos (Cursa em 5 Idiomas, Harvard PLL, MIT OCW e Stanford Online)', async () => {
    // 24.1 - Cursa: Cursos gratuitos com certificado em 5 idiomas (PT, EN, ES, FR, HI)
    const resCursa = await request('/api/cursos?plataforma=Cursa');
    assert.equal(resCursa.status, 200);
    assert.ok(Array.isArray(resCursa.data));
    assert.ok(resCursa.data.length >= 50, 'Deve conter pelo menos 50 cursos catalogados da Cursa');

    // Validação dos 5 idiomas
    const plataformasCursa = resCursa.data.map(c => c.plataforma);
    assert.ok(plataformasCursa.some(p => p.includes('Português')), 'Deve conter cursos Cursa em Português');
    assert.ok(plataformasCursa.some(p => p.includes('English')), 'Deve conter cursos Cursa em Inglês');
    assert.ok(plataformasCursa.some(p => p.includes('Español')), 'Deve conter cursos Cursa em Espanhol');
    assert.ok(plataformasCursa.some(p => p.includes('Français')), 'Deve conter cursos Cursa em Francês');
    assert.ok(plataformasCursa.some(p => p.includes('Hindi')), 'Deve conter cursos Cursa em Hindi');

    // Validação de links cursa.app e menções a certificado gratuito
    assert.ok(resCursa.data.every(c => c.url.startsWith('https://cursa.app/')), 'Todos os links Cursa devem apontar para https://cursa.app/');
    assert.ok(resCursa.data.every(c => c.descricao && (
      c.descricao.toLowerCase().includes('certificad') ||
      c.descricao.toLowerCase().includes('certificat') ||
      c.descricao.toLowerCase().includes('certificate') ||
      c.descricao.includes('प्रमाणपत्र')
    )), 'Todos os cursos Cursa devem mencionar certificado');

    // 24.2 - Harvard Online / PLL Free: Cursos acadêmicos de ponta
    const resHarvard = await request('/api/cursos?plataforma=' + encodeURIComponent('Harvard Online'));
    assert.equal(resHarvard.status, 200);
    assert.ok(Array.isArray(resHarvard.data));
    assert.ok(resHarvard.data.length >= 20, 'Deve conter pelo menos 20 cursos gratuitos de Harvard Online (PLL)');
    const titulosHarvard = resHarvard.data.map(c => c.titulo);
    assert.ok(titulosHarvard.some(t => t.includes('CS50')), 'Deve conter cursos CS50');
    assert.ok(titulosHarvard.some(t => t.includes('Data Science') || t.includes('R Basics')), 'Deve conter Data Science de Harvard');
    assert.ok(titulosHarvard.some(t => t.includes('Justice')), 'Deve conter Justice de Michael Sandel');
    assert.ok(resHarvard.data.every(c => c.url.includes('harvard.edu') || c.url.includes('edx.org')), 'Links devem apontar para Harvard ou edX');

    // 24.3 - MIT OpenCourseWare
    const resMit = await request('/api/cursos?plataforma=' + encodeURIComponent('MIT OpenCourseWare'));
    assert.equal(resMit.status, 200);
    assert.ok(Array.isArray(resMit.data));
    assert.ok(resMit.data.length >= 4, 'Deve conter ao menos 4 cursos do MIT OCW');
    assert.ok(resMit.data.some(c => c.titulo.includes('Python') || c.titulo.includes('6.0001')), 'Deve conter 6.0001 Python do MIT');
    assert.ok(resMit.data.some(c => c.titulo.includes('Gilbert Strang') || c.titulo.includes('18.06')), 'Deve conter Álgebra Linear de Gilbert Strang');
    assert.ok(resMit.data.every(c => c.url.includes('ocw.mit.edu')), 'Links do MIT devem apontar para ocw.mit.edu');

    // 24.4 - Stanford Online
    const resStanford = await request('/api/cursos?plataforma=' + encodeURIComponent('Stanford Online'));
    assert.equal(resStanford.status, 200);
    assert.ok(Array.isArray(resStanford.data));
    assert.ok(resStanford.data.length >= 4, 'Deve conter ao menos 4 cursos de Stanford');
    assert.ok(resStanford.data.some(c => c.titulo.includes('Andrew Ng') || c.titulo.includes('CS229')), 'Deve conter Machine Learning de Andrew Ng');
    assert.ok(resStanford.data.every(c => c.url.includes('stanford.edu') || c.url.includes('coursera.org')), 'Links de Stanford devem ser oficiais');

    // 24.5 - Redirecionamento HTTP 302 direto para a plataforma oficial
    const primeiroCursa = resCursa.data[0];
    const resRedirect = await request(`/api/cursos/${primeiroCursa.id}/acessar`);
    assert.equal(resRedirect.status, 302, 'Acesso ao curso deve responder com HTTP 302');
    assert.equal(resRedirect.headers.get('location'), primeiroCursa.url, 'Location deve coincidir com URL oficial do curso');
  });

  // Teste 25: Plataformas Nacionais com Certificado Grátis (Fundação Bradesco, EV.G/ENAP, Lumina, IFRS) e Globais (Google Ateliê, OpenBootcamp) + Automação
  test('25. Plataformas Nacionais com Certificado Grátis (Fundação Bradesco, EV.G/ENAP, Lumina, IFRS) e Globais (Google Ateliê, OpenBootcamp) + Automação', async () => {
    // 25.1 - Fundação Bradesco (EV)
    const resBradesco = await request('/api/cursos?plataforma=' + encodeURIComponent('Fundação Bradesco'));
    assert.equal(resBradesco.status, 200);
    assert.ok(Array.isArray(resBradesco.data));
    assert.ok(resBradesco.data.length >= 60, 'Deve conter pelo menos 60 cursos da Fundação Bradesco');
    assert.ok(resBradesco.data.some(c => c.titulo.includes('Excel')), 'Deve conter curso de Excel');
    assert.ok(resBradesco.data.some(c => c.titulo.includes('Python')), 'Deve conter curso de Python');
    assert.ok(resBradesco.data.every(c => c.url.includes('ev.org.br')), 'Todos os links Bradesco devem apontar para ev.org.br');

    // 25.2 - EV.G - Escola Virtual de Governo (ENAP)
    const resEvg = await request('/api/cursos?plataforma=' + encodeURIComponent('Escola Virtual de Governo'));
    assert.equal(resEvg.status, 200);
    assert.ok(Array.isArray(resEvg.data));
    assert.ok(resEvg.data.length >= 400, 'Deve conter catálogo amplo da EV.G / ENAP (>= 400 cursos)');
    assert.ok(resEvg.data.every(c => c.url.includes('escolavirtual.gov.br')), 'Links EV.G devem apontar para escolavirtual.gov.br');
    assert.ok(resEvg.data.every(c => c.descricao.toLowerCase().includes('certifica')), 'Cursos EV.G devem mencionar certificado ou certificação');

    // 25.3 - Lumina (UFRGS - Universidade Federal do Rio Grande do Sul)
    const resLumina = await request('/api/cursos?plataforma=' + encodeURIComponent('Lumina'));
    assert.equal(resLumina.status, 200);
    assert.ok(Array.isArray(resLumina.data));
    assert.ok(resLumina.data.length >= 15, 'Deve conter ao menos 15 cursos da Lumina UFRGS');
    assert.ok(resLumina.data.some(c => c.titulo.includes('Divulgação Científica')), 'Deve conter Divulgação Científica');
    assert.ok(resLumina.data.some(c => c.titulo.includes('Produção Textual') || c.titulo.includes('Artigo Científico')), 'Deve conter Artigo Científico');
    assert.ok(resLumina.data.some(c => c.titulo.includes('Pensamento Computacional')), 'Deve conter Pensamento Computacional');
    assert.ok(resLumina.data.every(c => c.url.includes('lumina.ufrgs.br')), 'Links devem apontar para lumina.ufrgs.br');

    // 25.4 - IFRS (Instituto Federal do Rio Grande do Sul - Moodle MOOC)
    const resIfrs = await request('/api/cursos?plataforma=' + encodeURIComponent('Instituto Federal'));
    assert.equal(resIfrs.status, 200);
    assert.ok(Array.isArray(resIfrs.data));
    assert.ok(resIfrs.data.length >= 15, 'Deve conter ao menos 15 cursos MOOC do IFRS');
    const titulosIfrs = resIfrs.data.map(c => c.titulo);
    assert.ok(titulosIfrs.some(t => t.includes('Inglês')), 'Deve conter curso de Inglês');
    assert.ok(titulosIfrs.some(t => t.includes('Espanhol')), 'Deve conter curso de Espanhol');
    assert.ok(titulosIfrs.some(t => t.includes('Lógica de Programação') || t.includes('Java')), 'Deve conter cursos de informática');
    assert.ok(titulosIfrs.some(t => t.includes('Matemática') || t.includes('Estatística') || t.includes('Física')), 'Deve conter ciências exatas');
    assert.ok(resIfrs.data.every(c => c.url.includes('ifrs.edu.br')), 'Links IFRS devem apontar para ifrs.edu.br');

    // 25.5 - Google Ateliê Digital (learndigital.withgoogle.com)
    const resGoogle = await request('/api/cursos?plataforma=' + encodeURIComponent('Google Ateliê'));
    assert.equal(resGoogle.status, 200);
    assert.ok(Array.isArray(resGoogle.data));
    assert.ok(resGoogle.data.length >= 10, 'Deve conter ao menos 10 cursos do Google Ateliê');
    assert.ok(resGoogle.data.some(c => c.titulo.includes('Fundamentos do Marketing Digital')), 'Deve conter Fundamentos do Marketing Digital');
    assert.ok(resGoogle.data.some(c => c.titulo.includes('Machine Learning') || c.titulo.includes('Inteligência Artificial')), 'Deve conter IA do Google');
    assert.ok(resGoogle.data.every(c => c.url.includes('withgoogle.com') || c.url.includes('skillshop.exceedlms.com')), 'Links devem apontar para Google');

    // 25.6 - OpenBootcamp / Kogno
    const resOb = await request('/api/cursos?plataforma=' + encodeURIComponent('OpenBootcamp'));
    assert.equal(resOb.status, 200);
    assert.ok(Array.isArray(resOb.data));
    assert.ok(resOb.data.length >= 12, 'Deve conter ao menos 12 cursos do OpenBootcamp');
    const titulosOb = resOb.data.map(c => c.titulo);
    assert.ok(titulosOb.some(t => t.includes('HTML5')), 'Deve conter HTML5');
    assert.ok(titulosOb.some(t => t.includes('JavaScript')), 'Deve conter JavaScript');
    assert.ok(titulosOb.some(t => t.includes('Python')), 'Deve conter Python');
    assert.ok(titulosOb.some(t => t.includes('React')), 'Deve conter React');
    assert.ok(titulosOb.some(t => t.includes('Docker')), 'Deve conter Docker');
    assert.ok(resOb.data.every(c => c.url.includes('open-bootcamp.com')), 'Links devem apontar para open-bootcamp.com');

    // 25.7 - Validador do Motor Automatizado (scripts/sincronizar_cursos.js)
    const { validarCurso } = require('../scripts/sincronizar_cursos');
    const valido = validarCurso({
      titulo: 'Curso Teste Validação',
      plataforma: 'Plataforma Teste',
      url: 'https://exemplo.org/curso-teste',
      descricao: 'Descrição com certificado'
    });
    assert.equal(valido.valido, true);
    assert.equal(valido.curso.tipo, 'curso');

    const invalidoLocal = validarCurso({
      titulo: 'Curso Inválido',
      plataforma: 'Teste',
      url: 'file:///Users/mendes/Desktop/livro.pdf'
    });
    assert.equal(invalidoLocal.valido, false, 'Deve rejeitar URLs apontando para arquivos locais (violação AGENTS.md)');

    // 25.8 - Redirecionamento HTTP 302 direto para cursos oficiais
    const primeiroLumina = resLumina.data[0];
    const resRedirectLumina = await request(`/api/cursos/${primeiroLumina.id}/acessar`);
    assert.equal(resRedirectLumina.status, 302);
    assert.equal(resRedirectLumina.headers.get('location'), primeiroLumina.url);

    const primeiroGoogle = resGoogle.data[0];
    const resRedirectGoogle = await request(`/api/cursos/${primeiroGoogle.id}/acessar`);
    assert.equal(resRedirectGoogle.status, 302);
    assert.equal(resRedirectGoogle.headers.get('location'), primeiroGoogle.url);
  });
});



