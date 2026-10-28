const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const app = require('../src/app');

describe('Suíte de Navegação com Agência e Padrões de IA (WebMCP, ARD e llms.txt)', () => {
  let server;
  let baseUrl;

  test('Inicializar servidor Express para testes de rotas de IA', async () => {
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  // 1. Auditoria llms.txt (llmstxt.org)
  describe('1. Especificação llms.txt e llms-full.txt', () => {
    test('1.1 - GET /llms.txt responde 200 com text/markdown e contém cabeçalho H1 obrigatório', async () => {
      const res = await fetch(`${baseUrl}/llms.txt`);
      assert.equal(res.status, 200);
      const contentType = res.headers.get('content-type') || '';
      assert.ok(contentType.includes('text/markdown') || contentType.includes('text/plain'), `ContentType inesperado: ${contentType}`);
      
      const text = await res.text();
      assert.ok(text.startsWith('# '), 'O ficheiro llms.txt deve iniciar com um cabeçalho H1 (# ) conforme llmstxt.org');
      assert.ok(text.includes('LinoDigital'), 'Deve mencionar a marca institucional LinoDigital');
      assert.ok(text.includes('Lino Livre'), 'Deve mencionar o produto Lino Livre');
      assert.ok(text.includes('/api/livros'), 'Deve apontar para os endpoints abertos');
      assert.ok(text.includes('Zero Armazenamento Local') || text.includes('intermediário'), 'Deve declarar arquitetura de intermediação legal');
    });

    test('1.2 - GET /llms-full.txt responde 200 e detalha esquemas e rotas para modelos', async () => {
      const res = await fetch(`${baseUrl}/llms-full.txt`);
      assert.equal(res.status, 200);
      const text = await res.text();
      assert.ok(text.includes('# LinoDigital'), 'Deve conter título H1 com a marca-mãe');
      assert.ok(text.includes('Lino Livre'), 'Deve conter o nome do produto');
      assert.ok(text.includes('/api/livros/destaques'), 'Deve documentar rota de destaques');
      assert.ok(text.includes('/api/cursos'), 'Deve documentar diretório de cursos');
      assert.ok(text.includes('/api/busca/federada'), 'Deve documentar busca federada RRF');
    });
  });

  // 2. Auditoria ai-catalog.json (Agentic Resource Discovery - ARD)
  describe('2. Manifesto ai-catalog.json (Agentic Resource Discovery)', () => {
    test('2.1 - GET /.well-known/ai-catalog.json responde 200 com application/json e estrutura ARD válida', async () => {
      const res = await fetch(`${baseUrl}/.well-known/ai-catalog.json`);
      assert.equal(res.status, 200);
      const contentType = res.headers.get('content-type') || '';
      assert.ok(contentType.includes('application/json'), `ContentType inesperado: ${contentType}`);

      const data = await res.json();
      assert.equal(data.specVersion, '1.0.0', 'specVersion deve ser 1.0.0');
      assert.equal(data.name, 'LinoDigital');
      assert.ok(Array.isArray(data.entries), 'entries deve ser um array de recursos');
      assert.ok(data.entries.length >= 2, 'Deve conter pelo menos as ferramentas essenciais');

      const toolLivros = data.entries.find(e => e.identifier.includes('buscar_livros'));
      assert.ok(toolLivros, 'Deve conter entrada para buscar_livros');
      assert.ok(toolLivros.displayName, 'Deve conter displayName');
      assert.ok(toolLivros.url.includes('/api/livros'), 'URL deve apontar para endpoint');
      assert.ok(Array.isArray(toolLivros.representativeQueries), 'representativeQueries deve ser array');
    });

    test('2.2 - GET /ai-catalog.json (alias na raiz) responde 200 idêntico ao well-known', async () => {
      const res = await fetch(`${baseUrl}/ai-catalog.json`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.name, 'LinoDigital');
      assert.equal(data.specVersion, '1.0.0');
    });
  });

  // 3. Auditoria WebMCP (Declarativo no HTML e Imperativo no JS)
  describe('3. Padrões WebMCP para Agentes de Navegação', () => {
    test('3.1 - public/index.html declara formulários de busca com anotações WebMCP válidas', () => {
      const htmlPath = path.join(__dirname, '../public/index.html');
      const html = fs.readFileSync(htmlPath, 'utf8');

      // Form de Livros
      assert.ok(html.includes('toolname="buscar_livros"'), 'Form de livros deve conter atributo toolname="buscar_livros"');
      assert.ok(html.includes('tooldescription='), 'Form de livros deve conter atributo tooldescription');
      assert.ok(html.includes('toolparamdescription='), 'Input de busca deve conter toolparamdescription');

      // Form de Cursos
      assert.ok(html.includes('toolname="buscar_cursos"'), 'Form de cursos deve conter atributo toolname="buscar_cursos"');
      assert.ok(html.includes('role="search"'), 'Deve manter semântica acessível role="search"');
    });

    test('3.2 - public/js/app.js implementa método de registro de ferramentas WebMCP', () => {
      const jsPath = path.join(__dirname, '../public/js/app.js');
      const js = fs.readFileSync(jsPath, 'utf8');

      assert.ok(js.includes('registrarFerramentasWebMCP()'), 'Deve conter método registrarFerramentasWebMCP');
      assert.ok(js.includes("name: 'buscar_livros'"), 'Deve registrar ferramenta buscar_livros');
      assert.ok(js.includes("name: 'buscar_cursos'"), 'Deve registrar ferramenta buscar_cursos');
      assert.ok(js.includes('modelContext'), 'Deve verificar suporte a modelContext');
      assert.ok(js.includes('registerTool'), 'Deve chamar registerTool');
    });
  });

  // 4. Salvaguardas Anti-CLS (Cumulative Layout Shift)
  describe('4. Estabilidade de Layout (Anti-CLS)', () => {
    test('4.1 - public/index.html contém skeleton cards estáticos em #grade-destaques e #grade-livros', () => {
      const htmlPath = path.join(__dirname, '../public/index.html');
      const html = fs.readFileSync(htmlPath, 'utf8');

      assert.ok(html.includes('skeleton-card'), 'Deve declarar skeleton-card na estrutura inicial');
      assert.ok(html.includes('skeleton-cover'), 'Deve declarar skeleton-cover');
      assert.ok(html.includes('id="btn-goal-comunidade"'), 'Deve conter id btn-goal-comunidade');
      assert.ok(!html.includes('id="btn-goal-comunidade" class="btn btn-goal-whatsapp hidden"'), 'Botão de comunidade no placar não deve ter classe hidden inicial');
    });

    test('4.2 - public/css/style.css define min-height e regras de shimmer para skeletons', () => {
      const cssPath = path.join(__dirname, '../public/css/style.css');
      const css = fs.readFileSync(cssPath, 'utf8');

      assert.ok(css.includes('.destaques-grid'), 'Deve conter classe .destaques-grid');
      assert.ok(css.includes('min-height: 480px') || css.includes('min-height:480px'), 'Destaques deve ter min-height reservado');
      assert.ok(css.includes('.books-grid') && css.includes('min-height: 600px'), 'Grade de livros deve ter min-height reservado');
      assert.ok(css.includes('skeleton-shimmer'), 'Deve ter animação de shimmer nos skeletons');
    });

    test('4.3 - Seção de WhatsApp não possui classe hidden que cause layout shift', () => {
      const htmlPath = path.join(__dirname, '../public/index.html');
      const html = fs.readFileSync(htmlPath, 'utf8');

      assert.ok(html.includes('id="secao-whatsapp" class="container whatsapp-section"'), 'Seção de WhatsApp deve ser visível por padrão');
      assert.ok(html.includes('id="card-comunidade" class="whatsapp-card"'), 'Card comunidade deve ser visível por padrão');
      assert.ok(html.includes('id="card-canal" class="whatsapp-card"'), 'Card canal deve ser visível por padrão');
    });
  });

  // 5. Dados Estruturados Schema.org (Google Rich Results & Lighthouse)
  describe('5. Dados Estruturados Schema.org e Rich Results', () => {
    test('5.1 - public/index.html possui grafo Schema.org válido com WebSite, Organization e BreadcrumbList', () => {
      const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
      const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      assert.ok(match, 'index.html deve conter tag <script type="application/ld+json">');

      const jsonLd = JSON.parse(match[1]);
      assert.equal(jsonLd['@context'], 'https://schema.org');
      assert.ok(Array.isArray(jsonLd['@graph']), '@graph deve ser um array');

      const website = jsonLd['@graph'].find(item => item['@type'] === 'WebSite');
      assert.ok(website, 'Deve conter nó WebSite');
      assert.ok(website.potentialAction, 'WebSite deve conter potentialAction (Google Sitelinks Searchbox)');
      assert.equal(website.potentialAction['@type'], 'SearchAction');
      assert.ok(website.potentialAction.target.urlTemplate.includes('busca={search_term_string}'));

      const org = jsonLd['@graph'].find(item => Array.isArray(item['@type']) ? item['@type'].includes('Organization') : item['@type'] === 'Organization');
      assert.ok(org, 'Deve conter nó Organization/Library');
      assert.ok(org.logo, 'Organization deve conter logo');
      assert.ok(org.contactPoint, 'Organization deve conter contactPoint');

      const breadcrumb = jsonLd['@graph'].find(item => item['@type'] === 'BreadcrumbList');
      assert.ok(breadcrumb, 'Deve conter nó BreadcrumbList');
      assert.ok(Array.isArray(breadcrumb.itemListElement), 'BreadcrumbList deve ter itemListElement');
      assert.ok(breadcrumb.itemListElement.length >= 3, 'Deve conter ao menos 3 níveis de breadcrumb');
    });

    test('5.2 - Páginas secundárias (legal, termos, creditos, comunidade) possuem Schema.org válido', () => {
      const paginas = ['legal.html', 'termos.html', 'creditos.html', 'comunidade.html'];
      for (const pag of paginas) {
        const conteudo = fs.readFileSync(path.join(__dirname, `../public/${pag}`), 'utf8');
        const match = conteudo.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        assert.ok(match, `${pag} deve conter <script type="application/ld+json">`);
        const jsonLd = JSON.parse(match[1]);
        assert.equal(jsonLd['@context'], 'https://schema.org');
        assert.ok(Array.isArray(jsonLd['@graph']), `${pag}: @graph deve ser array`);
        assert.ok(jsonLd['@graph'].some(item => item['@type'] === 'WebPage'), `${pag}: deve conter nó WebPage`);
        assert.ok(jsonLd['@graph'].some(item => item['@type'] === 'BreadcrumbList'), `${pag}: deve conter nó BreadcrumbList`);
      }
    });

    test('5.3 - public/js/app.js injeta dados estruturados de Book dinamicamente ao abrir modal', () => {
      const js = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');
      assert.ok(js.includes('jsonld-livro'), 'Deve gerenciar elemento jsonld-livro');
      assert.ok(js.includes("'@type': 'Book'"), 'Deve instanciar tipo Schema.org Book');
      assert.ok(js.includes('traduzirCategoria'), 'Deve mapear categoria para gênero da obra');
    });

    test('5.4 - Redirecionamento HTTP -> HTTPS está ativo no Worker e Express', () => {
      const workerSecurity = fs.readFileSync(path.join(__dirname, '../workers/src/middlewares/security.ts'), 'utf8');
      assert.ok(workerSecurity.includes('redirecionarHttps'), 'Worker deve declarar middleware redirecionarHttps');
      assert.ok(workerSecurity.includes('url.protocol = \'https:\''), 'Worker deve trocar protocolo para https:');

      const appJs = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf8');
      assert.ok(appJs.includes("proto === 'http'"), 'Express deve checar cabeçalho x-forwarded-proto');
      assert.ok(appJs.includes('res.redirect(301,'), 'Express deve responder com 301');
    });

    test('5.5 - Tabela cursos possui coluna prioridade e índice de ordenação eficiente', () => {
      const schemaSql = fs.readFileSync(path.join(__dirname, '../src/database/schema.sql'), 'utf8');
      assert.ok(schemaSql.includes('prioridade INTEGER DEFAULT 1'), 'schema.sql deve conter coluna prioridade');
      assert.ok(schemaSql.includes('idx_cursos_prioridade_id'), 'schema.sql deve conter idx_cursos_prioridade_id');

      const migrationPath = fs.existsSync(path.join(__dirname, '../migrations/0010_cursos_prioridade.sql'))
        ? path.join(__dirname, '../migrations/0010_cursos_prioridade.sql')
        : path.join(__dirname, '../migrations/0006_cursos_prioridade.sql');
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      assert.ok(migrationSql.includes('ADD COLUMN prioridade INTEGER DEFAULT 1'), 'Migração de prioridade de cursos deve existir');
    });
  });

  test('Encerrar servidor de testes', () => {
    if (server) server.close();
  });
});
