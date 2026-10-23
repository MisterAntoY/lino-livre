process.env.NODE_ENV = 'test';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const ler = (rel) => fs.readFileSync(path.join(raiz, rel), 'utf-8');

describe('Performance frontend — LCP, fontes e animações compostas', () => {
  const html = ler('public/index.html');
  const i18n = ler('public/js/i18n.js');
  const app = ler('public/js/app.js');
  const css = ler('public/css/style.css');

  test('1. Noto Sans/Serif SC não é carregado no caminho crítico (evita ~150 KiB de CSS não usado)', () => {
    const head = html.split('</head>')[0];
    assert.ok(
      !/Noto\+(Sans|Serif)\+SC/.test(head),
      'O CSS do Noto SC não deve estar no <head>; deve ser injetado só para zh'
    );
    assert.ok(
      i18n.includes('garantirFontesIdioma') && i18n.includes("code !== 'zh'"),
      'i18n.js deve injetar as fontes CJK apenas quando o idioma for zh'
    );
  });

  test('2. Idioma padrão (pt) não reescreve o DOM no arranque (LCP estável)', () => {
    assert.ok(
      /alvo === 'pt'/.test(i18n),
      'i18n.init() deve ter caminho rápido para pt, sem aplicar traduções ao DOM'
    );
    assert.ok(
      i18n.includes('el.textContent === txt') && i18n.includes('el.innerHTML === html'),
      'aplicarDocumento() deve evitar mutações quando o conteúdo já é idêntico'
    );
  });

  test('3. Nenhuma transição com "all" (animações não compostas)', () => {
    assert.ok(
      !/transition:\s*all/i.test(css),
      'style.css não deve usar transition: all'
    );
    assert.ok(
      !/transition:all/i.test(html),
      'o CSS crítico inline não deve usar transition: all'
    );
  });

  test('4. Barra do placar anima com transform (compositor) e não com width (layout)', () => {
    assert.ok(
      /\.goal-progress-bar-fill\s*\{[^}]*transform:\s*scaleX/.test(css),
      'a barra deve usar transform: scaleX()'
    );
    assert.ok(
      /elBarra\.style\.transform\s*=\s*`scaleX\(/.test(app),
      'app.js deve atualizar a barra via transform'
    );
  });

  test('5. Tarefas secundárias do arranque são adiadas para o tempo ocioso', () => {
    assert.ok(
      app.includes('requestIdleCallback') && app.includes('tarefasSecundarias'),
      'app.init() deve adiar carregarCategoriasSelect/verificarComunidadeECanal'
    );
  });

  test('6. Assets versionados para cache longo com invalidação', () => {
    assert.ok(html.includes('/css/style.css?v=20261024'), 'CSS deve usar ?v=20261024');
    assert.ok(html.includes('/js/app.js?v=20261024'), 'app.js deve usar ?v=20261024');
    assert.ok(html.includes('/js/i18n.js?v=20261024'), 'i18n.js deve usar ?v=20261024');
  });
});
