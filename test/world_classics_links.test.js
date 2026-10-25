process.env.NODE_ENV = 'test';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { worldClassicsList } = require('../src/database/worldClassicsSeedData');

/**
 * Regressão da auditoria de 2026-10-24.
 *
 * Os itens de empréstimo do Internet Archive expõem URLs
 * `archive.org/download/<id>/<ficheiro>.pdf` que devolvem HTTP 401/403
 * (nginx) para utilizadores não autenticados. O Lino Livre é um
 * intermediário de indexação e não pode apresentar esses URLs como
 * downloads livres. Obras com direitos comerciais passam a apontar
 * apenas para o catálogo público da Open Library.
 */
describe('Links externos do catálogo mundial (anti-401/403)', () => {
  test('1. O catálogo mantém as 105 obras e todas têm pelo menos um link', () => {
    assert.equal(worldClassicsList.length, 105, 'Devem existir 100 obras do ranking + 5 obras históricas');

    for (const obra of worldClassicsList) {
      assert.ok(Array.isArray(obra.links) && obra.links.length > 0, `${obra.titulo} deve ter pelo menos um link externo`);
    }
  });

  test('2. Nenhuma obra aponta para download direto do Internet Archive', () => {
    const restritos = [];

    for (const obra of worldClassicsList) {
      for (const link of obra.links) {
        if (String(link.url).startsWith('https://archive.org/download/')) {
          restritos.push(`${obra.fonteIdExterno} (${obra.titulo}): ${link.url}`);
        }
      }
    }

    assert.deepEqual(restritos, [], `Links de download restritos encontrados:\n${restritos.join('\n')}`);
  });

  test('3. Obras com licença "outro" só apontam para o catálogo público da Open Library', () => {
    const obrasComerciais = worldClassicsList.filter((obra) => obra.licenca === 'outro');
    assert.ok(obrasComerciais.length > 0, 'O catálogo deve conter obras com direitos comerciais');

    for (const obra of obrasComerciais) {
      for (const link of obra.links) {
        assert.equal(link.formato, 'html', `${obra.titulo} não pode expor formato ${link.formato} para obra comercial`);
        const url = new URL(link.url);
        assert.equal(url.protocol, 'https:', `${obra.titulo} deve usar HTTPS`);
        assert.equal(url.hostname, 'openlibrary.org', `${obra.titulo} deve apontar para a Open Library`);
      }
    }
  });

  test('4. O Alquimista (world-top100-4) não expõe PDF restrito e aponta para a Open Library', () => {
    const alquimista = worldClassicsList.find((obra) => obra.fonteIdExterno === 'world-top100-4');
    assert.ok(alquimista, 'A obra world-top100-4 deve existir');
    assert.equal(alquimista.licenca, 'outro');
    assert.ok(!alquimista.links.some((link) => link.formato === 'pdf'), 'O Alquimista não pode ter link PDF direto');
    assert.ok(
      alquimista.links.some((link) => link.formato === 'html' && link.url.startsWith('https://openlibrary.org/search?q=O%20Alquimista')),
      'O Alquimista deve apontar para o catálogo da Open Library'
    );
  });

  test('5. O Pequeno Príncipe e O Diário de Anne Frank deixaram de estar marcados como domínio público', () => {
    for (const id of ['world-top100-2', 'world-top100-45']) {
      const obra = worldClassicsList.find((item) => item.fonteIdExterno === id);
      assert.ok(obra, `A obra ${id} deve existir`);
      assert.equal(obra.licenca, 'outro', `${obra.titulo} deve usar a licença "outro" enquanto o item do Internet Archive for restrito`);
    }
  });

  test('6. Todos os links usam HTTPS e domínios permitidos', () => {
    const dominiosPermitidos = new Set(['openlibrary.org', 'www.gutenberg.org']);

    for (const obra of worldClassicsList) {
      for (const link of obra.links) {
        const url = new URL(link.url);
        assert.equal(url.protocol, 'https:', `${obra.titulo}: link não HTTPS (${link.url})`);
        assert.ok(dominiosPermitidos.has(url.hostname), `${obra.titulo}: domínio não permitido (${url.hostname})`);
      }
    }
  });

  test('7. As capas são únicas, usam HTTPS e não reutilizam a capa placeholder 8232000', () => {
    const hostsPermitidos = new Set(['covers.openlibrary.org', 'www.gutenberg.org']);
    const capas = new Map();

    for (const obra of worldClassicsList) {
      const capa = String(obra.capaUrl || '');
      assert.ok(capa, `${obra.titulo}: capa ausente`);

      const url = new URL(capa);
      assert.equal(url.protocol, 'https:', `${obra.titulo}: capa não HTTPS (${capa})`);
      assert.ok(hostsPermitidos.has(url.hostname), `${obra.titulo}: host de capa não permitido (${url.hostname})`);
      assert.ok(!capa.includes('/8232000-'), `${obra.titulo}: capa placeholder 8232000 (${capa})`);

      const chave = capa.replace(/-[SML]\.jpg$/, '');
      assert.ok(!capas.has(chave), `${obra.titulo}: capa duplicada com ${capas.get(chave)} (${capa})`);
      capas.set(chave, obra.titulo);
    }

    assert.equal(capas.size, worldClassicsList.length, 'Cada obra deve ter uma capa própria');

    const livroVermelho = worldClassicsList.find((obra) => obra.fonteIdExterno === 'world-hist-4');
    assert.ok(livroVermelho, 'A obra world-hist-4 deve existir');
    assert.ok(
      livroVermelho.capaUrl.includes('/15047576-'),
      'O Livro Vermelho de Mao deve usar a capa correta da Open Library (ID 15047576)'
    );
  });
});
