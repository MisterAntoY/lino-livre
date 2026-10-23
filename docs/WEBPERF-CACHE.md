# Cache HTTP e Proxy de Capas — Lino Livre

> Complementa [`WEBPERF-CLS.md`](WEBPERF-CLS.md). Objetivo: eliminar o aviso
> Lighthouse *"Use durações totais de cache eficientes"* sem violar a diretriz
> de intermediação (o servidor **não** armazena ficheiros de livros).

## 1. Problema

O Lighthouse reportava poupança estimada em recursos com TTL insuficiente:

| Recurso | Origem | `Cache-Control` na origem |
| :--- | :--- | :--- |
| `pg46408.cover.medium.jpg` | `www.gutenberg.org` | **ausente** (sem `Cache-Control` nem `Expires`) |
| `/capas/*`, `/css/*`, `/js/*` | Cloudflare Workers Assets | `public, max-age=0, must-revalidate` (padrão) |

Sem cache, cada visita volta a descarregar as mesmas capas e assets.

## 2. Solução

### 2.1 Assets estáticos — `public/_headers`

O Workers Static Assets respeita o ficheiro `public/_headers` (não é servido
publicamente) e substitui os cabeçalhos por omissão:

```text
/css/*      Cache-Control: public, max-age=31536000, immutable
/js/*       Cache-Control: public, max-age=31536000, immutable
/capas/*    Cache-Control: public, max-age=31536000, immutable
/img/*      Cache-Control: public, max-age=31536000, immutable
/fonts/*    Cache-Control: public, max-age=31536000, immutable
/locales/*  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/ , /index.html , /sw.js  Cache-Control: public, max-age=0, must-revalidate
```

> ⚠️ **Regra de ouro:** como `/css` e `/js` usam `immutable` por 1 ano, qualquer
> alteração a esses ficheiros **exige** subir o `?v=` no HTML (ex.: `?v=20261023`).
> O mesmo vale para o `CACHE_VERSION` em `public/sw.js`.

### 2.2 Capas externas — `GET /api/capas?u=<url>`

Implementado em `workers/src/index.ts` e `src/controllers/capasController.js`.

- **Allowlist de origens:** `gutenberg.org`, `openlibrary.org`, `archive.org`,
  `githubusercontent.com`, `guiadeti.com.br`, `supabase.co`, `unsplash.com`,
  `wikimedia.org`, `africanstorybook.org`, `standardebooks.org`.
- **Anti-SSRF:** `validarUrlRedirecionamento` antes do `fetch` e **revalidação do
  URL final** (bloqueia redirect para loopback / RFC 1918 / metadados cloud).
- **Apenas imagens:** `Content-Type: image/*`, limite de 5 MB.
- **Cache:** `public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800`
  e `Cache API` de borda (`caches.default`).
- **Sem armazenamento:** a imagem é transmitida em *streaming*; nada é guardado
  em disco, R2 ou base de dados. Continua a ser um intermediário de metadados.

O frontend usa `app.capaProxyUrl()` (`public/js/app.js`) para encaminhar apenas
capas externas; caminhos locais (`/capas/...`) são servidos diretamente.

### 2.3 Fontes versionadas no caminho (não na query string)

O edge da Cloudflare guarda os assets **por caminho** e ignora a query string na
chave de cache. Como as fontes já tinham sido servidas com `max-age=0` antes de a
regra `/fonts/*` existir, a resposta antiga continuava a ser entregue mesmo com
`?v=...`. A solução é versionar o **nome do ficheiro**:

```text
/fonts/lora-latin-var-v20261023.woff2
/fonts/lora-italic-latin-var-v20261023.woff2
```

Ao atualizar as fontes: copiar para um novo sufixo de versão, atualizar
`public/index.html` (preload + `@font-face`), `public/css/style.css` e a lista de
pré-cache do `public/sw.js`, e subir o `?v=` do CSS. Os ficheiros antigos são
mantidos para não quebrar CSS já em cache (`immutable` por 1 ano).

## 3. Como validar

```bash
# Cabeçalho de cache da capa intermediada (esperado: max-age=31536000)
curl -sI "https://lino-livre.linolivre.workers.dev/api/capas?u=https%3A%2F%2Fwww.gutenberg.org%2Fcache%2Fepub%2F10%2Fpg10.cover.medium.jpg" \
  | grep -i cache-control

# Asset estático (esperado: immutable)
curl -sI "https://lino-livre.linolivre.workers.dev/capas/dom_casmurro.jpg" \
  | grep -i cache-control

# Bloqueios de segurança (esperado: 400 / 403)
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://lino-livre.linolivre.workers.dev/api/capas?u=http%3A%2F%2F127.0.0.1%2Fsegredo"
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://lino-livre.linolivre.workers.dev/api/capas?u=https%3A%2F%2Fexample.com%2Fa.jpg"
```

## 4. Testes

| Ficheiro | Cobertura |
| :--- | :--- |
| `test/capas_proxy.test.js` | Express: parâmetro, allowlist, SSRF direto e por redirect, não-imagem, origem indisponível, cabeçalhos |
| `test/worker_capas_proxy.test.js` | Worker: os mesmos cenários + `Cache API` (put e hit sem novo fetch) |
