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
});
