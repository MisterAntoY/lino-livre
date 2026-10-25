process.env.NODE_ENV = 'test';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const ler = (rel) => fs.readFileSync(path.join(raiz, rel), 'utf-8');
const existe = (rel) => fs.existsSync(path.join(raiz, rel));

describe('Marca LinoDigital — hierarquia, ativos e consistência', () => {
  const html = ler('public/index.html');
  const css = ler('public/css/style.css');
  const manifest = JSON.parse(ler('public/manifest.webmanifest'));
  const manifestLegado = JSON.parse(ler('public/manifest.json'));
  const aiCatalog = JSON.parse(ler('public/.well-known/ai-catalog.json'));
  const worker = ler('workers/src/index.ts');

  test('1. Ativos oficiais da marca existem e o símbolo é vetorial', () => {
    for (const ativo of [
      'public/img/brand/linodigital-mark.svg',
      'public/img/brand/linodigital-logo.svg',
      'public/img/brand/linodigital-og.svg',
      'public/img/brand/linodigital-og.jpg',
      'public/img/icons/icon.svg',
      'public/img/icons/icon-192.png',
      'public/img/icons/icon-512.png',
      'public/img/icons/icon-maskable-192.png',
      'public/img/icons/icon-maskable-512.png',
      'public/img/icons/apple-touch-icon.png',
      'public/apple-touch-icon.png'
    ]) {
      assert.ok(existe(ativo), `Ativo da marca em falta: ${ativo}`);
    }
    const mark = ler('public/img/brand/linodigital-mark.svg');
    assert.ok(mark.includes('aria-label="LinoDigital"'), 'O símbolo deve identificar LinoDigital');
    assert.ok(mark.includes('<path'), 'O símbolo deve conter o emblema do livro');
  });

  test('2. Ícone PWA declara a assinatura LinoDigital / Lino Livre', () => {
    const icon = ler('public/img/icons/icon.svg');
    assert.ok(icon.includes('LINODIGITAL'), 'O ícone deve exibir LINODIGITAL');
    assert.ok(icon.includes('LINO LIVRE'), 'O ícone deve exibir o produto LINO LIVRE');
  });

  test('3. Cabeçalho e rodapé da home apresentam a marca-mãe e o produto', () => {
    assert.ok(/<h1 class="brand-title">LinoDigital<\/h1>/.test(html), 'O H1 do cabeçalho deve ser LinoDigital');
    assert.ok(html.includes('Lino Livre · Livros livres, para todos.'), 'O subtítulo deve apresentar o produto Lino Livre');
    assert.ok(html.includes('/img/brand/linodigital-mark.svg'), 'O cabeçalho deve usar o símbolo oficial');
    assert.ok(/<div class="footer-brand-title">LinoDigital<\/div>/.test(html), 'O rodapé deve apresentar LinoDigital');
    assert.ok(html.includes('© 2026 <strong>LinoDigital</strong> · Lino Livre'), 'O copyright deve usar a forma composta');
  });

  test('4. SEO, Open Graph e JSON-LD declaram a hierarquia de marca', () => {
    assert.ok(html.includes('<title>LinoDigital — Lino Livre |'), 'O título SEO deve usar a forma composta');
    assert.ok(html.includes('<meta name="author" content="LinoDigital">'), 'O autor deve ser LinoDigital');
    assert.ok(html.includes('<meta property="og:site_name" content="LinoDigital">'), 'og:site_name deve ser LinoDigital');
    assert.ok(html.includes('"name": "LinoDigital"'), 'O JSON-LD deve nomear LinoDigital');
    assert.ok(html.includes('"alternateName": ["Lino Livre"'), 'O JSON-LD deve declarar Lino Livre como nome alternativo');
    assert.ok(html.includes('og:image" content="https://lino-livre.linolivre.workers.dev/img/brand/linodigital-og.jpg"'), 'O Open Graph deve usar a imagem oficial da marca');
    assert.ok(html.includes('og:image:width" content="1200"'), 'A imagem OG deve declarar 1200px de largura');
    assert.ok(html.includes('og:image:height" content="630"'), 'A imagem OG deve declarar 630px de altura');
  });

  test('5. Manifest PWA e alias legado usam a marca-mãe', () => {
    assert.equal(manifest.name, 'LinoDigital — Lino Livre');
    assert.equal(manifest.short_name, 'LinoDigital');
    assert.equal(manifestLegado.name, 'LinoDigital — Lino Livre');
    assert.equal(manifestLegado.short_name, 'LinoDigital');
    assert.ok(manifest.description.includes('Lino Livre'), 'A descrição do manifest deve mencionar o produto');
  });

  test('6. Locales i18n preservam a hierarquia em todos os idiomas', () => {
    for (const lang of ['pt', 'pt-br', 'en', 'es', 'fr', 'de', 'zh']) {
      const d = JSON.parse(ler(`public/locales/${lang}.json`));
      assert.ok(d.title.startsWith('LinoDigital — Lino Livre'), `${lang}: title deve começar por LinoDigital — Lino Livre`);
      assert.ok(d.ui.footer.mission.includes('LinoDigital'), `${lang}: a missão deve mencionar LinoDigital`);
      assert.ok(d.ui.footer.mission.includes('Lino Livre'), `${lang}: a missão deve mencionar Lino Livre`);
    }
  });

  test('7. Documentos para agentes de IA declaram a marca-mãe', () => {
    assert.ok(ler('public/llms.txt').startsWith('# LinoDigital — Lino Livre'), 'llms.txt deve iniciar com a marca-mãe');
    assert.ok(ler('public/llms-full.txt').startsWith('# LinoDigital — Lino Livre'), 'llms-full.txt deve iniciar com a marca-mãe');
    assert.equal(aiCatalog.name, 'LinoDigital');
    assert.ok(aiCatalog.description.includes('Lino Livre'), 'ai-catalog deve mencionar o produto');
    assert.ok(aiCatalog.contact.name.includes('LinoDigital'), 'O contacto deve identificar a equipa LinoDigital');
  });

  test('8. Fallbacks do Cloudflare Worker acompanham a marca', () => {
    assert.ok(worker.includes('# LinoDigital — Lino Livre'), 'O fallback de llms.txt deve usar a marca-mãe');
    assert.ok(worker.includes("name: 'LinoDigital'"), 'O fallback do ai-catalog deve nomear LinoDigital');
    assert.ok(worker.includes('LinoDigital · Lino Livre'), 'O fallback do 404 deve usar a forma composta');
  });

  test('9. README e AGENTS.md documentam a hierarquia de marca', () => {
    const readme = ler('README.md');
    const agents = ler('AGENTS.md');
    assert.ok(readme.startsWith('# LinoDigital — Lino Livre'), 'README deve iniciar com a forma composta');
    assert.ok(readme.includes('produto da **LinoDigital**'), 'README deve identificar Lino Livre como produto');
    assert.ok(agents.includes('### 2.30. Identidade de Marca'), 'AGENTS.md deve documentar a identidade de marca');
    assert.ok(agents.includes('LinoDigital** é a marca institucional'), 'AGENTS.md deve declarar a marca-mãe');
  });

  test('10. O símbolo do cabeçalho tem dimensões reservadas (zero CLS)', () => {
    assert.ok(/\.brand-logo\s*\{[^}]*width:\s*42px[^}]*height:\s*42px/.test(css), 'A classe .brand-logo deve reservar 42x42px');
    assert.ok(html.includes('class="brand-logo" width="42" height="42"'), 'A imagem do cabeçalho deve declarar width/height');
  });

  test('11. Licença da plataforma é Apache 2.0 (LICENSE e package.json)', () => {
    assert.ok(existe('LICENSE'), 'Ficheiro LICENSE deve existir na raiz');
    const licenseText = ler('LICENSE');
    assert.ok(licenseText.includes('Apache License'), 'LICENSE deve conter Apache License');
    assert.ok(licenseText.includes('Version 2.0'), 'LICENSE deve ser versão 2.0');
    assert.ok(licenseText.includes('Copyright 2026 LinoDigital'), 'LICENSE deve conter Copyright LinoDigital');
    const pkg = JSON.parse(ler('package.json'));
    assert.equal(pkg.license, 'Apache-2.0', 'package.json deve declarar licença Apache-2.0');
  });
});
