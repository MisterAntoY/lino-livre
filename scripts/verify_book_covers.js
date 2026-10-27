const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { getDatabase } = require('../src/database/index');

const db = getDatabase();
const books = db.prepare('SELECT id, titulo, idioma, capa_url, licenca FROM livros ORDER BY id ASC').all();

console.log(`Iniciando verificação individual (one-for-one) de ${books.length} capas de livros...`);

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function requestWithRetry(url, retries = 2) {
  return new Promise((resolve) => {
    function tryReq(attempt) {
      checkUrl(url)
        .then(res => {
          if (!res.ok && attempt < retries) {
            setTimeout(() => tryReq(attempt + 1), 600);
          } else {
            resolve(res);
          }
        })
        .catch(err => {
          if (attempt < retries) {
            setTimeout(() => tryReq(attempt + 1), 600);
          } else {
            resolve({ ok: false, status: 0, error: err.message });
          }
        });
    }
    tryReq(0);
  });
}

function checkUrl(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    if (maxRedirects < 0) {
      return resolve({ ok: false, status: 0, error: 'Too many redirects' });
    }

    try {
      const parsed = new URL(url);
      const transport = parsed.protocol === 'https:' ? https : http;

      const reqOptions = {
        method: 'GET',
        headers: {
          'User-Agent': url.includes('wikimedia.org')
            ? 'LinoLivre/1.0 (https://lino-livre.linolivre.workers.dev; bv6alblu6@mozmail.com)'
            : USER_AGENT,
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Range': 'bytes=0-2048'
        },
        timeout: 14000
      };

      const req = transport.request(parsed, reqOptions, (res) => {
        const statusCode = res.statusCode;

        // Redirects
        if ([301, 302, 303, 307, 308].includes(statusCode)) {
          const location = res.headers.location;
          res.resume();
          if (!location) {
            return resolve({ ok: false, status: statusCode, error: 'Redirect without Location header' });
          }
          const redirectUrl = new URL(location, url).href;
          return resolve(checkUrl(redirectUrl, maxRedirects - 1));
        }

        // 200 OK ou 206 Partial Content
        if (statusCode === 200 || statusCode === 206) {
          const contentType = res.headers['content-type'] || '';
          res.resume();
          return resolve({
            ok: true,
            status: statusCode,
            contentType,
            contentLength: res.headers['content-length']
          });
        }

        res.resume();
        return resolve({ ok: false, status: statusCode, error: `HTTP ${statusCode}` });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, status: 0, error: 'Timeout (14s)' });
      });

      req.on('error', (err) => {
        resolve({ ok: false, status: 0, error: err.message });
      });

      req.end();
    } catch (err) {
      resolve({ ok: false, status: 0, error: `Invalid URL: ${err.message}` });
    }
  });
}

async function verifyAll() {
  const results = [];
  const CONCURRENCY = 6; // Concorrência moderada para respeitar limites do Gutenberg e CDN
  let runningIndex = 0;

  async function worker() {
    while (runningIndex < books.length) {
      const idx = runningIndex++;
      const book = books[idx];
      const { id, titulo, idioma, capa_url } = book;

      let result = {
        id,
        titulo,
        idioma,
        capa_url,
        isLocal: false,
        ok: false,
        status: null,
        detail: ''
      };

      if (!capa_url || capa_url.trim() === '') {
        result.detail = 'Capa vazia/nula';
      } else if (capa_url.startsWith('/')) {
        result.isLocal = true;
        const localPath = path.join(__dirname, '../public', capa_url);
        if (fs.existsSync(localPath)) {
          const stats = fs.statSync(localPath);
          if (stats.size > 0) {
            result.ok = true;
            result.status = 200;
            result.detail = `Arquivo local existe (${(stats.size / 1024).toFixed(1)} KB)`;
          } else {
            result.detail = 'Arquivo local existe mas tem 0 bytes';
          }
        } else {
          result.detail = `Arquivo local não encontrado: ${localPath}`;
        }
      } else {
        // URL externa com retry
        const check = await requestWithRetry(capa_url);
        result.ok = check.ok;
        result.status = check.status;
        if (check.ok) {
          result.detail = `HTTP ${check.status} (${check.contentType || 'image'})`;
        } else {
          result.detail = check.error;
        }
      }

      results.push(result);
      process.stdout.write(`[${results.length}/${books.length}] Livro #${id}: ${result.ok ? '✅' : '❌'} (${titulo.substring(0, 30)}...) -> ${result.detail}\n`);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const passed = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  console.log('\n=============================================');
  console.log('RELATÓRIO DE VERIFICAÇÃO ONE-FOR-ONE DE CAPAS');
  console.log('=============================================');
  console.log(`Total de Livros: ${books.length}`);
  console.log(`Capas Válidas:   ${passed.length} (${((passed.length / books.length) * 100).toFixed(1)}%)`);
  console.log(`Capas Falhas:    ${failed.length} (${((failed.length / books.length) * 100).toFixed(1)}%)`);
  console.log('=============================================\n');

  const relatorioDir = path.join(__dirname, '../docs/auditorias');
  if (!fs.existsSync(relatorioDir)) fs.mkdirSync(relatorioDir, { recursive: true });
  fs.writeFileSync(
    path.join(relatorioDir, 'relatorio_verificacao_capas.json'),
    JSON.stringify({ total: books.length, passed: passed.length, failed: failed.length, failures: failed, results }, null, 2)
  );

  if (failed.length > 0) {
    console.log('LISTA DE CAPAS COM FALHA:');
    failed.forEach(f => {
      console.log(`- [#${f.id}] "${f.titulo}" (${f.idioma}) | URL: ${f.capa_url} | Erro: ${f.detail}`);
    });
  } else {
    console.log('🎉 100% DAS CAPAS DE TODOS OS LIVROS FORAM VERIFICADAS E ESTÃO FUNCIONANDO!');
  }
}

verifyAll();
