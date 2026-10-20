/**
 * Testes Automatizados de Segurança, IDOR e Validação de Entradas (TDD)
 * ===================================================================
 * 
 * Aplicando a teoria do TDD (Test-Driven Development):
 * Estes testes foram concebidos e escritos para verificar rigorosamente:
 * 1. Prevenção de IDOR (Insecure Direct Object Reference) e integridade de IDs
 * 2. Prevenção de SSRF e Open Redirect (IPv4 loopbacks, IPv6 local, domínios proibidos)
 * 3. Sanitização contra SQL Injection / FTS5 Syntax Injection
 * 4. Normalização defensiva de parâmetros de paginação e limites (Anti-DoS)
 * 5. Validação de esquemas e integridade em rotas de mutação protegidas
 * 6. Cabeçalhos de segurança HTTP em todas as respostas
 */

process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const app = require('../src/app');
const { initDatabase, getDatabase, closeDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');
const { validarUrlRedirecionamento, DOMINIOS_PROIBIDOS } = require('../src/utils/urlValidator');

const CHAVE_ADMIN = 'chave-de-teste-admin-lino-livre-12345';

describe('Suíte TDD de Segurança, IDOR e Validação de Entradas', () => {
  let server;
  let port;
  const testDbPath = path.join(__dirname, 'security_test_lino.db');

  const limparBdTeste = () => {
    for (const sufixo of ['', '-wal', '-shm']) {
      const f = testDbPath + sufixo;
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (_) {}
      }
    }
  };

  before(async () => {
    limparBdTeste();
    process.env.ADMIN_API_KEY = CHAVE_ADMIN;
    const db = initDatabase(testDbPath);
    seed(db);

    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    if (server.closeAllConnections) {
      server.closeAllConnections();
    }
    await new Promise((resolve) => server.close(resolve));
    closeDatabase();
    limparBdTeste();
  });

  const apiFetch = async (urlPath, options = {}) => {
    const url = `http://127.0.0.1:${port}${urlPath}`;
    const headers = { ...(options.headers || {}) };
    let body = options.body;
    if (body && typeof body === 'object') {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(url, {
      ...options,
      headers,
      body,
      redirect: options.redirect || 'manual'
    });
    let data;
    const cType = res.headers.get('content-type') || '';
    if (cType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return {
      status: res.status,
      headers: res.headers,
      body: data
    };
  };

  describe('1. Prevenção de IDOR e Integridade de Identificadores (:id)', () => {

    test('1.1 - GET /api/autores/:id deve retornar 200 com autor e livros sem quebrar por coluna inexistente', async () => {
      const db = getDatabase();
      const autor = db.prepare('SELECT id FROM autores LIMIT 1').get();
      assert.ok(autor, 'Deve existir pelo menos um autor no banco');

      const res = await apiFetch(`/api/autores/${autor.id}`);
      assert.equal(res.status, 200, `Esperado 200, recebido ${res.status}: ${JSON.stringify(res.body)}`);
      assert.equal(res.body.id, autor.id);
      assert.ok(Array.isArray(res.body.livros), 'Deve retornar array de livros do autor');
      assert.equal(res.body.erro, undefined);
    });

    test('1.2 - GET /api/autores/:id com ID inexistente deve retornar 404 seguro', async () => {
      const res = await apiFetch('/api/autores/9999999');
      assert.equal(res.status, 404);
      assert.ok(res.body.erro);
    });

    test('1.3 - IDOR Cross-Resource: GET /api/livros/:id/ler/:linkId com link de OUTRO livro deve retornar 404', async () => {
      const db = getDatabase();
      const links = db.prepare('SELECT id, livro_id FROM links_livros ORDER BY id ASC LIMIT 2').all();
      if (links.length >= 2 && links[0].livro_id !== links[1].livro_id) {
        const res = await apiFetch(`/api/livros/${links[0].livro_id}/ler/${links[1].id}`);
        assert.equal(res.status, 404, 'Não deve permitir acessar link de outro livro via IDOR');
      }
    });

    test('1.4 - Tentativa de IDOR em exclusão/edição sem autenticação administrativa deve responder 401', async () => {
      const endpoints = [
        { method: 'DELETE', path: '/api/livros/1' },
        { method: 'PUT', path: '/api/livros/1', body: { titulo: 'Hack' } },
        { method: 'DELETE', path: '/api/cursos/1' },
        { method: 'DELETE', path: '/api/categorias/1' },
        { method: 'PUT', path: '/api/categorias/1', body: { nome: 'Hack' } },
        { method: 'DELETE', path: '/api/autores/1' },
        { method: 'PUT', path: '/api/autores/1', body: { nome: 'Hack' } }
      ];

      for (const ep of endpoints) {
        const res = await apiFetch(ep.path, { method: ep.method, body: ep.body });
        assert.equal(res.status, 401, `Endpoint ${ep.method} ${ep.path} deve exigir autenticação 401`);
      }
    });

    test('1.5 - POST /api/sugestoes tentando forçar ID personalizado ou status aprovado é neutralizado', async () => {
      const res = await apiFetch('/api/sugestoes', {
        method: 'POST',
        body: {
          id: 77777,
          status: 'aprovado',
          titulo: 'Obra Sugerida Comunitária Segura',
          url_link: 'https://www.gutenberg.org/ebooks/9999.epub'
        }
      });

      assert.equal(res.status, 201);
      assert.ok(res.body.sucesso);

      const db = getDatabase();
      const gravada = db.prepare('SELECT id, status FROM sugestoes WHERE id = ?').get(res.body.id);
      assert.equal(gravada.status, 'pendente', 'Status deve ser sempre forçado para pendente');
      assert.notEqual(gravada.id, 77777, 'ID não deve ser o fornecido pelo payload do usuário');
    });

    test('1.6 - POST /api/podcasts/episodios/:id/ouvir com ID inválido/não numérico deve validar entrada', async () => {
      const res = await apiFetch('/api/podcasts/episodios/nao-e-numero/ouvir', { method: 'POST' });
      assert.ok([400, 404].includes(res.status), `Status esperado 400 ou 404, recebido ${res.status}`);
    });

  });

  describe('2. Prevenção de SSRF, Redirecionamentos Abertos e Validação de URLs', () => {

    test('2.1 - Deve bloquear TODO o espaço de endereçamento loopback IPv4 (127.0.0.0/8)', () => {
      const loopbacks = [
        'http://127.0.0.1/admin',
        'http://127.0.0.2/admin',
        'http://127.1.2.3/internal',
        'http://127.255.255.254/secret',
        'http://localhost:3000/api',
        'http://0.0.0.0:8080/test'
      ];

      for (const url of loopbacks) {
        assert.throws(
          () => validarUrlRedirecionamento(url),
          /proibido|inválida/i,
          `URL ${url} deveria ser bloqueada como loopback IPv4`
        );
      }
    });

    test('2.2 - Deve bloquear endereços IPv6 locais, loopbacks e link-local (::1, ::, fe80::, fc00::)', () => {
      const ipv6Privados = [
        'http://[::1]/admin',
        'http://[::]/admin',
        'http://[fe80::1]/config',
        'http://[fe80::1234:5678]/status',
        'http://[fc00::1]/private',
        'http://[fd12:3456:789a::1]/intranet'
      ];

      for (const url of ipv6Privados) {
        assert.throws(
          () => validarUrlRedirecionamento(url),
          /proibido|inválida/i,
          `URL IPv6 ${url} deveria ser bloqueada como endereço local/privado`
        );
      }
    });

    test('2.3 - Deve bloquear redes privadas RFC 1918 e metadados de nuvem', () => {
      const redesPrivadas = [
        'http://10.0.0.1/admin',
        'http://10.254.1.1/secret',
        'http://192.168.0.1/router',
        'http://192.168.100.50:8080/setup',
        'http://172.16.0.1/intranet',
        'http://172.31.255.255/intranet',
        'http://169.254.169.254/latest/meta-data/',
        'http://servidor.internal/api',
        'http://intranet.local/auth'
      ];

      for (const url of redesPrivadas) {
        assert.throws(
          () => validarUrlRedirecionamento(url),
          /proibido|inválida/i,
          `URL privada ${url} deveria ser bloqueada`
        );
      }
    });

    test('2.4 - Deve bloquear protocolos perigosos (javascript:, data:, file:, gopher:)', () => {
      const protocolosProibidos = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'file:///etc/passwd',
        'gopher://127.0.0.1:6379/_flushall',
        'ftp://downloads.com/file.pdf'
      ];

      for (const url of protocolosProibidos) {
        assert.throws(
          () => validarUrlRedirecionamento(url),
          /não permitido|inválido/i,
          `Protocolo ${url} deveria ser rejeitado`
        );
      }
    });

    test('2.5 - Deve bloquear URLs de repositórios piratas da lista negra', () => {
      const pirataria = [
        'https://z-library.se/book/12345',
        'https://libgen.is/book/abc',
        'https://sci-hub.se/paper/xyz',
        'https://annas-archive.org/md5/1234567890abcdef'
      ];

      for (const url of pirataria) {
        assert.throws(
          () => validarUrlRedirecionamento(url),
          /viol|proib|compliance/i,
          `URL de pirataria ${url} deveria ser rejeitada`
        );
      }
    });

    test('2.6 - Deve aceitar URLs públicas legítimas de acervos abertos', () => {
      const legitimas = [
        'https://www.gutenberg.org/ebooks/1342.epub3.images',
        'https://pt.wikisource.org/wiki/Dom_Casmurro',
        'https://archive.org/details/domcasmurro00machuoft',
        'https://web.dio.me/course/fundamentos-de-ia-generativa/'
      ];

      for (const url of legitimas) {
        assert.doesNotThrow(() => {
          const val = validarUrlRedirecionamento(url);
          assert.ok(val.startsWith('https://'));
        });
      }
    });

  });

  describe('3. Sanitização contra SQL Injection e FTS5 Syntax Injection', () => {

    test('3.1 - GET /api/livros com operadores e caracteres perigosos no parâmetro busca não deve quebrar FTS', async () => {
      const termosPerigosos = [
        '"aspas nao fechadas',
        'AND OR NOT NEAR',
        ':::***',
        'livro* AND (categoria:*)',
        "' OR 1=1 --",
        '<script>alert("xss")</script>',
        '\\0 null byte'
      ];

      for (const busca of termosPerigosos) {
        const res = await apiFetch(`/api/livros?busca=${encodeURIComponent(busca)}`);
        assert.equal(res.status, 200, `Busca com termo perigoso "${busca}" não deve causar erro 500`);
        assert.ok(Array.isArray(res.body.data), 'Deve retornar array de dados paginado');
      }
    });

    test('3.2 - Paginação com valores anômalos ou negativos é normalizada com segurança', async () => {
      const res = await apiFetch('/api/livros?page=-10&limit=-50');
      assert.equal(res.status, 200);
      assert.equal(res.body.page, 1);
      assert.ok(res.body.limit >= 1 && res.body.limit <= 100);
    });

    test('3.3 - Limite excessivo (Anti-DoS / Memory exhaustion) é clampado para no máximo 100', async () => {
      const res = await apiFetch('/api/livros?limit=999999999');
      assert.equal(res.status, 200);
      assert.equal(res.body.limit, 100, 'Limite de itens deve ser limitado a 100');
    });

  });

  describe('4. Validação e Sanitização em Rotas de Mutação Protegidas', () => {

    test('4.1 - POST /api/livros com chave admin mas payload vazio ou sem título rejeita com 400', async () => {
      const res = await apiFetch('/api/livros', {
        method: 'POST',
        headers: { 'x-admin-key': CHAVE_ADMIN },
        body: {}
      });

      assert.equal(res.status, 400);
      assert.match(res.body.erro, /título.*obrigatório/i);
    });

    test('4.2 - POST /api/livros com link de capa apontando para rede interna é rejeitado com 400', async () => {
      const res = await apiFetch('/api/livros', {
        method: 'POST',
        headers: { 'x-admin-key': CHAVE_ADMIN },
        body: {
          titulo: 'Livro de Teste com SSRF',
          licenca: 'dominio-publico',
          capa_url: 'http://127.0.0.1:8080/capa.jpg'
        }
      });

      assert.equal(res.status, 400);
      assert.match(res.body.erro, /proibido|inválid/i);
    });

    test('4.3 - POST /api/cursos com chave admin mas dados inválidos rejeita com 400', async () => {
      const res = await apiFetch('/api/cursos', {
        method: 'POST',
        headers: { 'x-admin-key': CHAVE_ADMIN },
        body: {
          titulo: 'Curso Teste'
        }
      });

      assert.equal(res.status, 400);
      assert.match(res.body.erro, /obrigatórios/i);
    });

    test('4.4 - POST /api/cursos com URL interna rejeita com 400', async () => {
      const res = await apiFetch('/api/cursos', {
        method: 'POST',
        headers: { 'x-admin-key': CHAVE_ADMIN },
        body: {
          titulo: 'Curso Malicioso',
          area: 'Tecnologia',
          plataforma: 'Hack',
          url: 'http://10.0.0.1/curso'
        }
      });

      assert.equal(res.status, 400);
      assert.match(res.body.erro, /inválida ou não autorizada|proibido/i);
    });

    test('4.5 - POST /api/categorias com nome em branco rejeita com 400', async () => {
      const res = await apiFetch('/api/categorias', {
        method: 'POST',
        headers: { 'x-admin-key': CHAVE_ADMIN },
        body: { nome: '   ' }
      });

      assert.equal(res.status, 400);
      assert.match(res.body.erro, /nome.*obrigatório/i);
    });

    test('4.6 - POST /api/autores com nome em branco rejeita com 400', async () => {
      const res = await apiFetch('/api/autores', {
        method: 'POST',
        headers: { 'x-admin-key': CHAVE_ADMIN },
        body: { nome: '' }
      });

      assert.equal(res.status, 400);
      assert.match(res.body.erro, /nome.*obrigatório/i);
    });

  });

  describe('5. Cabeçalhos HTTP de Proteção em Todas as Respostas', () => {

    test('5.1 - Respostas da API devem conter cabeçalhos defensivos (X-Content-Type-Options, X-Frame-Options, CSP)', async () => {
      const res = await apiFetch('/api/dashboard');
      assert.equal(res.status, 200);

      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(res.headers.get('x-frame-options'), 'DENY');
      assert.ok(res.headers.get('content-security-policy'));
      assert.match(res.headers.get('content-security-policy'), /default-src/);
      assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    });

  });

});
