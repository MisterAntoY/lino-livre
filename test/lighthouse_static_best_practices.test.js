process.env.NODE_ENV = 'test';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

/**
 * Suíte de regressão estática espelhando as auditorias documentadas em:
 * - developer.chrome.com/docs/lighthouse/best-practices/doctype
 * - developer.chrome.com/docs/lighthouse/accessibility/scoring (tabela de pesos axe-core 4.11)
 * - web.dev/articles/how-to-review (revisão manual de acessibilidade — Rob Dodson)
 * Verificação estática (lab) — complementa, nunca substitui, a revisão manual.
 */

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const HTML_FILES = fs
  .readdirSync(PUBLIC_DIR)
  .filter((f) => f.endsWith('.html'))
  .sort();

describe('Suíte Lighthouse — Best Practices & Acessibilidade (estática)', () => {
  test('1. Auditoria "doctype": cada HTML começa em <!DOCTYPE html> como 1.º byte do documento (sem BOM, espaços ou comentários antes)', () => {
    assert.ok(HTML_FILES.length >= 6, `Pelo menos 6 páginas HTML devem existir (encontradas: ${HTML_FILES.length})`);
    for (const file of HTML_FILES) {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
      const head = content.slice(0, 32).trimStart();
      assert.ok(
        /^<!doctype html>/i.test(head),
        `${file} deve iniciar com <!DOCTYPE html> em seu 1.º byte para evitar o modo quirks (quase-CSS/quebra de layout). Recebido: "${head.slice(0, 24)}"`
      );
      assert.equal(content[0], '<', `${file} não pode ter BOM/espaços/comentários antes do DOCTYPE`);
    }
  });

  test('2. Auditoria "html-has-lang" (peso 7) + "html-lang-valid" (peso 7): <html lang> presente e valor BCP-47 válido em todas as páginas', () => {
    for (const file of HTML_FILES) {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
      const abertura = (content.match(/<html[^>]*>/i) || [])[0] || '';
      const matchLang = abertura.match(/lang="([^"]+)"/i);
      assert.ok(matchLang, `${file} deve declarar lang no elemento <html>`);
      const lang = matchLang[1];
      assert.match(
        lang,
        /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/i,
        `${file}: lang="${lang}" deve ser um valor BCP-47 válido`
      );
    }
  });

  test('3. Auditoria "meta-viewport" (peso 10): sem user-scalable=no e sem maximum-scale < 5', () => {
    for (const file of HTML_FILES) {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
      const viewport = (content.match(/<meta[^>]+name="viewport"[^>]*>/i) || [])[0];
      assert.ok(viewport, `${file} deve declarar <meta name="viewport">`);
      assert.doesNotMatch(viewport, /user-scalable\s*=\s*no/i, `${file}: user-scalable=no deve estar ausente`);
      const maxScale = viewport.match(/maximum-scale\s*=\s*([\d.]+)/i);
      if (maxScale) {
        const v = parseFloat(maxScale[1]);
        assert.ok(v >= 5, `${file}: maximum-scale=${v} inferior a 5 bloqueia zoom assistivo`);
      }
    }
  });

  test('4. Auditoria "document-title" (peso 7): toda página possui <title> não vazio', () => {
    for (const file of HTML_FILES) {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
      const titulo = (content.match(/<title>([^<]+)<\/title>/i) || [])[1];
      assert.ok(titulo && titulo.trim().length > 0, `${file} deve ter <title> com texto`);
    }
  });

  test('5. Auditoria "charset": meta charset nos primeiros 1024 bytes de cada página', () => {
    for (const file of HTML_FILES) {
      const head = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8').slice(0, 1024);
      assert.match(head, /<meta[^>]+charset=["']?utf-8["']?/i, `${file} deve ter <meta charset="utf-8"> no <head> inicial`);
    }
  });

  test('6. Auditoria "landmark-one-main" (peso 3): index.html tem exatamente 1 elemento <main> binário', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');
    const abre = (content.match(/<main[\s>]/g) || []).length;
    const fecha = (content.match(/<\/main>/g) || []).length;
    assert.equal(abre, 1, 'Um único <main> por documento (HTML5 permite só um)');
    assert.equal(fecha, 1, 'O <main> único deve ser fechado');
    const outrosParaSection = (content.match(/<section class="container main-container"/g) || []).length;
    assert.ok(outrosParaSection >= 3, 'As antigas regiões <main> das abas ocultas devem ser <section>');
  });

  test('7. Auditoria "bypass" (peso 7) + "skip-link": link de salto focalizável aponta para o marco principal', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');
    const skip = content.match(/<a[^>]+class="skip-link"[^>]*>/);
    assert.ok(skip, 'index.html deve conter <a class="skip-link">');
    const href = (skip[0].match(/href="([^"]+)"/) || [])[1];
    assert.equal(href, '#conteudo-principal', 'skip-link deve saltar para #conteudo-principal');
    assert.match(content, /<main[^>]+id="conteudo-principal"/, 'O marco <main> deve possuir o id do salto');
  });

  test('8. Guia web.dev "Como revisar": anel de foco visível para teclado (:focus-visible) na folha de estilo global', () => {
    const css = fs.readFileSync(path.join(PUBLIC_DIR, 'css', 'style.css'), 'utf8');
    assert.match(css, /:focus-visible/, 'style.css deve ter regra :focus-visible (alternativa ao outline:none removido)');
    assert.match(css, /outline:\s*3px solid #1d4ed8/, 'O anel deve ter cor e espessura visíveis (WCAG 2.4.7)');
  });

  test('9. Íntegra auditada: skip-link fora da vista (CLS zero por construção), visível apenas no foco', () => {
    const css = fs.readFileSync(path.join(PUBLIC_DIR, 'css', 'style.css'), 'utf8');
    const block = (css.match(/\.skip-link\s*\{[^}]+\}/) || [])[0];
    assert.ok(block, 'Regra .skip-link deve existir');
    assert.match(block, /position:\s*absolute/, 'skip-link deve estar posicionado fora do fluxo (zero layout shift)');
    assert.match(block, /top:\s*-/, 'skip-link deve estar fora da vista por padrão');
  });

  test('10. prefers-reduced-motion respeitado globalmente (style.css) além do CSS crítico da home', () => {
    const css = fs.readFileSync(path.join(PUBLIC_DIR, 'css', 'style.css'), 'utf8');
    const idx = css.indexOf('prefers-reduced-motion');
    assert.ok(idx >= 0, 'style.css deve conter o media query prefers-reduced-motion');
    const bloco = css.slice(idx, idx + 700);
    assert.match(bloco, /animation-duration:\s*0\.01ms/, 'Animações devem parar quase instantaneamente');
    assert.match(bloco, /transition-duration:\s*0\.01ms/, 'Transições devem parar quase instantaneamente');
    assert.match(bloco, /scroll-behavior:\s*auto/, 'Rolagem suave deve ser desativada');
  });
});
