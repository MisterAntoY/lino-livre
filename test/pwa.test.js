process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const app = require('../src/app');

describe('Suíte PWA (Progressive Web App) — Lino Livre', () => {
  let server;
  let port;

  before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
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
  });

  const request = async (urlPath) => {
    const res = await fetch(`http://127.0.0.1:${port}${urlPath}`);
    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json') || contentType.includes('application/manifest+json')) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }
    return { status: res.status, headers: res.headers, data };
  };

  test('1. Manifest Web App (/manifest.webmanifest) deve ser servido com status 200 e campos válidos', async () => {
    const res = await request('/manifest.webmanifest');
    assert.equal(res.status, 200, 'Deveria responder 200');
    assert.ok(res.headers.get('content-type').includes('application/manifest+json'), 'Content-Type deve ser application/manifest+json');
    assert.ok(res.headers.get('cache-control'), 'Deve possuir cabeçalho Cache-Control');

    const manifest = res.data;
    assert.equal(manifest.name, 'Lino Livre — Livros Livres, Para Todos');
    assert.equal(manifest.short_name, 'Lino Livre');
    assert.equal(manifest.display, 'standalone');
    assert.equal(manifest.start_url, '/?source=pwa');
    assert.equal(manifest.theme_color, '#10b981');
    assert.equal(manifest.background_color, '#0f172a');
    assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 4, 'Deve conter pelo menos 4 ícones responsivos');
    assert.ok(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, 'Deve conter atalhos de navegação');
  });

  test('2. Compatibilidade legada com /manifest.json', async () => {
    const res = await request('/manifest.json');
    assert.equal(res.status, 200, 'Deveria responder 200 para /manifest.json');
    assert.equal(res.data.short_name, 'Lino Livre');
  });

  test('3. Service Worker (/sw.js) deve ser servido com escopo raiz permitido e cabeçalhos defensivos', async () => {
    const res = await request('/sw.js');
    assert.equal(res.status, 200, 'Deveria responder 200');
    assert.ok(res.headers.get('content-type').includes('javascript'), 'Content-Type deve ser javascript');
    assert.equal(res.headers.get('service-worker-allowed'), '/', 'Service-Worker-Allowed deve ser raiz (/)');
    assert.ok(res.headers.get('cache-control').includes('no-cache'), 'Não deve cachear o arquivo de controle do service worker');
    assert.ok(res.data.includes('linolivre-core'), 'Deve declarar o cache principal do app shell');
    assert.ok(res.data.includes('/offline.html'), 'Deve referenciar o fallback offline');
  });

  test('4. Rota /offline deve servir a página estática de modo offline', async () => {
    const res = await request('/offline');
    assert.equal(res.status, 200, 'Deveria responder 200');
    assert.ok(res.data.includes('Modo Offline') || res.data.includes('offline'), 'Deveria conter mensagem de modo offline');
    assert.ok(res.data.includes('window.location.reload()'), 'Deveria conter ação de reconexão');
  });

  test('5. Todos os ativos físicos de ícones PWA devem existir em disco com dimensões válidas', () => {
    const publicDir = path.join(__dirname, '../public');
    const arquivosObrigatorios = [
      'manifest.webmanifest',
      'sw.js',
      'offline.html',
      'favicon.svg',
      'apple-touch-icon.png',
      'img/icons/icon-192.png',
      'img/icons/icon-512.png',
      'img/icons/icon-maskable-192.png',
      'img/icons/icon-maskable-512.png',
      'img/icons/icon.svg'
    ];

    for (const arq of arquivosObrigatorios) {
      const fullPath = path.join(publicDir, arq);
      assert.ok(fs.existsSync(fullPath), `O ficheiro ${arq} deve existir em public/`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 0, `O ficheiro ${arq} não pode estar vazio`);
    }
  });

  test('6. public/index.html deve declarar tags PWA e elementos visuais de instalação', () => {
    const htmlPath = path.join(__dirname, '../public/index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');

    assert.ok(html.includes('rel="manifest" href="/manifest.webmanifest"'), 'Deve conter link para o manifest');
    assert.ok(html.includes('name="theme-color" content="#10b981"'), 'Deve conter theme-color esmeralda');
    assert.ok(html.includes('id="btn-instalar-app"'), 'Deve conter botão de instalação PWA');
    assert.ok(html.includes('id="banner-offline"'), 'Deve conter banner de aviso de conectividade');
  });

  test('7. public/js/app.js deve implementar lógica de registro do Service Worker e PWA', () => {
    const jsPath = path.join(__dirname, '../public/js/app.js');
    const js = fs.readFileSync(jsPath, 'utf-8');

    assert.ok(js.includes('iniciarPwa()'), 'app deve ter método iniciarPwa');
    assert.ok(js.includes('instalarPwa()'), 'app deve ter método instalarPwa');
    assert.ok(js.includes('navigator.serviceWorker.register'), 'Deve registrar o sw.js');
    assert.ok(js.includes('beforeinstallprompt'), 'Deve escutar o evento beforeinstallprompt');
  });

  test('8. Arquivos de tradução (locales) devem conter chaves de PWA', () => {
    const localesDir = path.join(__dirname, '../public/locales');
    const idiomas = ['pt.json', 'pt-br.json', 'en.json', 'es.json', 'fr.json', 'de.json', 'zh.json'];

    for (const file of idiomas) {
      const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf-8'));
      assert.ok(content.ui && content.ui.pwa, `${file} deve conter o objeto ui.pwa`);
      assert.ok(content.ui.pwa.installBtn, `${file} deve conter ui.pwa.installBtn`);
      assert.ok(content.ui.pwa.offlineMode, `${file} deve conter ui.pwa.offlineMode`);
    }
  });

});
