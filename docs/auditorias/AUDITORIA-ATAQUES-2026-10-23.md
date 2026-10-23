# Auditoria Ofensiva e Matriz de Ataques — Lino Livre

**Data:** 2026-10-23
**Âmbito:** Express (`src/`), Cloudflare Worker (`workers/src/`), frontend (`public/`), dependências, CI/CD e configuração de borda.
**Metodologia:** OWASP Top 10 (2021/2025 draft), OWASP API Security Top 10, OWASP WSTG v4.2, CWE Top 25 (2025), CISA KEV, RFC 9116, ASVS 4.0.
**Execução:** análise estática, revisão manual linha-a-linha dos pontos de entrada, testes dinâmicos contra servidor local instrumentado (`scripts/security_probe_local.js`) e 29 testes automatizados de regressão (`test/security_attack_matrix.test.js`).
**Resultado:** **244/244 testes verdes**, `tsc --noEmit` limpo, **25 correções aplicadas**, **0 vulnerabilidades críticas em aberto**, 6 riscos residuais aceites/documentados.

---

## 1. Resumo executivo

| Severidade | Encontradas | Corrigidas | Aceites |
| :--- | ---: | ---: | ---: |
| Crítica | 2 | 2 | 0 |
| Alta | 5 | 5 | 0 |
| Média | 11 | 11 | 0 |
| Baixa | 7 | 7 | 0 |
| Informativa / residual | 6 | 0 | 6 |
| **Total** | **31** | **25** | **6** |

### As três correções com maior impacto

1. **DoS por FTS5 (CWE-400):** um único pedido `GET /api/livros?busca=` com 4.000 termos bloqueava o processo Node durante **~29 s**. Após o limite de 120 caracteres / 8 termos únicos: **186 ms** (redução de **~156×**), sem perder resultados relevantes.
2. **Bypass de autenticação no Worker (CWE-798/CWE-1188):** o Worker aceitava a chave pública `lino-admin-dev-key` sempre que `ENVIRONMENT !== 'production'`. Um deploy de pré-visualização (ou uma variável em falta) abria **todas** as rotas de mutação. Removida; o Worker falha fechado (401) sem `ADMIN_API_KEY`.
3. **SSRF com 6 evasões (CWE-918):** `http://localhost./`, `http://[::ffff:7f00:1]/`, `http://[::ffff:a9fe:a9fe]/` (metadados), `http://[64:ff9b::7f00:1]/` (NAT64), `http://[0:0:0:0:0:ffff:127.0.0.1]/` e `foo.localhost` passavam o validador. Corrigido com normalização de FQDN, expansão IPv6 e verificação de faixas RFC 1918/CGNAT/ULA/link-local/metadados.

---

## 2. Achados e correções

### 2.1 Críticos

#### SEC-01 — SSRF: validador de URLs contornável (CWE-918)
- **Evidência (antes):**
  ```
  http://localhost./                     PERMITIDO
  http://[::ffff:7f00:1]/                PERMITIDO
  http://[::ffff:a9fe:a9fe]/             PERMITIDO  (169.254.169.254)
  http://[0:0:0:0:0:ffff:127.0.0.1]/     PERMITIDO
  http://[64:ff9b::7f00:1]/              PERMITIDO  (NAT64)
  ```
- **Impacto:** qualquer rota que reutilize `validarUrlRedirecionamento` (capas, links de livros, cursos, importadores, sugestões) aceitava destinos internos. O proxy de capas era o caminho mais curto para leitura de metadados de nuvem.
- **Correção:** reescrita de [`src/utils/urlValidator.js`](../src/utils/urlValidator.js) e [`workers/src/utils/urlValidator.ts`](../workers/src/utils/urlValidator.ts):
  - normalização de FQDN (ponto final), zone-id IPv6 e colchetes;
  - expansão completa de IPv6 para 8 grupos + deteção de IPv4 embutido;
  - bloqueio de `::`, `::1`, `::ffff:0:0/96`, `::/96`, NAT64 `64:ff9b::/96`, ULA `fc00::/7`, link-local `fe80::/10`, multicast `ff00::/8`, documentação `2001:db8::/32`;
  - IPv4: `0/8`, `10/8`, `100.64/10`, `127/8`, `169.254/16`, `172.16/12`, `192.168/16`, TEST-NET, benchmarking, `>=224`;
  - sufixos internos `.localhost`, `.local`, `.internal`, `.home.arpa`, `.lan`;
  - rejeição de credenciais embutidas e de URLs > 2.048 caracteres;
  - **correção de falsos positivos**: `fcbarcelona.com` e `fdic.gov` deixaram de ser bloqueados (antes `startsWith('fc')`/`('fd')`).
- **Testes:** 33 vetores de bloqueio + 6 destinos legítimos em `test/security_attack_matrix.test.js`.
- **Nota de integração:** o rebase sobre o `main` mais recente (que já incluía 211 testes de outros agentes) manteve tudo verde; o teste `worker_capas_proxy.test.js` foi alinhado ao fluxo de redireccionamento manual (a versão anterior simulava `redirect: 'follow'`, precisamente a semântica insegura corrigida).

#### SEC-02 — Chave administrativa de desenvolvimento no Worker (CWE-798, CWE-1188)
- **Evidência (antes):** `const adminKey = c.env.ADMIN_API_KEY || (c.env.ENVIRONMENT === 'production' ? null : 'lino-admin-dev-key');`
- **Impacto:** autenticação **fail-open** em pré-visualizações/staging ou se `ENVIRONMENT` fosse omitido — um valor público documentado dava acesso a todas as mutações.
- **Correção:** `const adminKey = c.env.ADMIN_API_KEY || null;` — sem chave, 401 imediato. A rota `/api/dashboard` deixou de usar a chave de dev.
- **Teste:** `A07 — sem ADMIN_API_KEY falha fechado mesmo fora de produção`.

### 2.2 Altos

#### SEC-03 — DoS por busca FTS5 (CWE-400 / CWE-770)
- **Evidência (antes):** 4.000 termos → **29.017 ms**; depois → **186 ms**. A consulta gerava 4.000 expressões de prefixo `"termo"*`.
- **Correção:** `sanitizarFts5` limita a 120 caracteres e 8 termos **únicos** (deduplicados), em Express e Worker.
- **Testes:** `A04 — busca FTS com 4000 termos…` (< 5 s) e `A04 — FTS com milhares de termos é truncada antes da D1`.

#### SEC-04 — SSRF por redirecionamento no proxy de capas (CWE-918 / TOCTOU)
- **Antes:** `fetch(..., { redirect: 'follow' })` e só depois `validarUrlRedirecionamento(origem.url)`. O pedido ao destino interno **já tinha sido feito**; a validação apenas impedia a entrega do corpo.
- **Correção:** `redirect: 'manual'` com até 3 saltos; cada `Location` é resolvido, validado (protocolo, SSRF, allowlist) **antes** do pedido seguinte. No Express há ainda resolução DNS (`dns.lookup({ all: true })`) e verificação de todos os IPs (mitiga DNS rebinding).
- **Testes:** `4. Bloqueia SSRF por redirecionamento`, `11. Bloqueia redirecionamento para host fora da allowlist`.

#### SEC-05 — XSS armazenado via SVG no proxy de capas (CWE-79)
- **Antes:** qualquer `image/*` era servido, incluindo `image/svg+xml`, a partir da **nossa origem**, sob uma CSP que permite `'unsafe-inline'`. Um SVG com `<script>` executava no contexto do site ao ser aberto directamente.
- **Correção:** allowlist restrita a raster (`png`, `jpeg`, `webp`, `avif`, `gif`); SVG → 415. Resposta passa a incluir `Content-Security-Policy: default-src 'none'; sandbox` (Express e Worker).
- **Teste:** `10. Recusa SVG`.

#### SEC-06 — Bypass de rate limiting por `X-Forwarded-For` (CWE-348)
- **Evidência (antes):** `app.set('trust proxy', 1)`. 301 pedidos com `X-Forwarded-For: 9.9.9.9` → 429; de seguida 5 pedidos com XFF rotativo → **200,200,200,200,200**.
- **Correção:** `trust proxy` **desligado por omissão**; só é activado com `TRUST_PROXY` explícito (documentado em `.env.example`). O store do limitador passou a ter teto de 20.000 entradas com expiração, impedindo exaustão de memória por rotação de IP.
- **Testes:** `A04 — a app não confia em X-Forwarded-For por omissão`, `bloqueia após o limite`, `baldes independentes por IP`.

#### SEC-07 — Vazamento de erros internos (CWE-209)
- **Antes:** ~40 respostas `500` devolviam `err.message` (SQL, nomes de tabelas, caminhos, tipo de excepção).
- **Correção:** todas as respostas 500 passaram a mensagem genérica; o detalhe vai para `console.error` no servidor. Mensagens de **validação** (400) mantêm-se, por serem úteis e não sensíveis.
- **Teste:** `A03 — corpo sem Content-Type devolve 400, nunca 500 com stack` e verificação de ausência de `SQLITE|syntax error|at *.js:` em todas as cargas.

### 2.3 Médios

| ID | Achado (CWE) | Correção | Ficheiros |
| :--- | :--- | :--- | :--- |
| SEC-08 | Escrita pública ilimitada em `POST /api/podcasts/episodios/:id/ouvir` e no contador de leituras → exaustão da cota D1 (CWE-770) | Limites 20/min e 60/min por IP; validação de ID | `src/app.js`, `workers/src/index.ts` |
| SEC-09 | `GET /api/import/:id` público — enumeração de jobs e queries administrativas (CWE-639) | Exige `x-admin-key` + `Cache-Control: no-store` | `src/routes/api.js`, `workers/src/index.ts` |
| SEC-10 | Worker sem qualquer rate limiting (CWE-770) | Token bucket por isolate, chaveado por `CF-Connecting-IP`; leitura 300/min, escrita 30/min, capas 60/min, busca federada 20/min, sugestões 5/min | `workers/src/index.ts` |
| SEC-11 | Proxy de capas bufferizava até 5 MB sem `Content-Length` e sem limite dedicado (CWE-400) | Leitura em streaming com corte em 5 MB, verificação prévia de `Content-Length`, timeout de 8 s, 60 req/min | `src/controllers/capasController.js` |
| SEC-12 | Injecção de wildcards `LIKE` em `/api/cursos?busca=%a%b%c` (CWE-20) | `escaparLike` + `ESCAPE '\'`, termo limitado a 120 caracteres | `src/controllers/cursosController.js` |
| SEC-13 | `req.body` indefinido (sem `Content-Type`) → 500 + mensagem interna (CWE-20) | `req.body \|\| {}` em todos os controllers → 400 de validação | `src/controllers/*.js` |
| SEC-14 | JSON malformado no Worker → 500 (CWE-20) | `try/catch` no `c.req.json()` → 400 | `workers/src/index.ts` |
| SEC-15 | `capa_url`, `licenca` e `formato` das sugestões sem validação (CWE-20) | URL validada; licença/formato normalizados por allowlist; ano/categoria convertidos com verificação de `NaN` | `src/controllers/sugestoesController.js`, `workers/src/index.ts` |
| SEC-16 | Respostas administrativas sem `Cache-Control` (CWE-525) | `no-store, no-cache, must-revalidate, private` | `src/routes/api.js`, `workers/src/index.ts` |
| SEC-17 | `script-src ... https:` no `public/_headers` permitia carregar scripts de qualquer origem HTTPS (CWE-693) | CSP alinhada com o servidor: `script-src 'self' 'unsafe-inline'` | `public/_headers` |
| SEC-18 | Regra inviolável de domínio público não era imposta na API (CWE-863 / compliance) | `conteudo_texto` rejeitado (400) se `licenca !== 'dominio-publico'`, na criação e actualização, em ambos os backends | `src/controllers/livrosController.js`, `workers/src/index.ts` |

### 2.4 Baixos

| ID | Achado | Correção |
| :--- | :--- | :--- |
| SEC-19 | O servidor estático podia servir um PDF/EPUB/MP3 colocado em `public/` (violação de AGENTS.md §1) | Guard 404 para `.pdf .epub .mobi .azw3 .mp3 .mp4 .wav .ogg .flac .txt` (excepto `robots.txt`, `ads.txt`, `/.well-known/`) |
| SEC-20 | `X-Powered-By: Express` (fingerprinting) | `app.disable('x-powered-by')` |
| SEC-21 | Comparação de chave no Worker saía cedo por diferença de comprimento (CWE-208) | Comparação sem saída antecipada sobre `max(len)` |
| SEC-22 | Sem canal de divulgação responsável | `/.well-known/security.txt` (RFC 9116) + rota Express |
| SEC-23 | Paginação profunda sem teto no Express | Máximo de 2.000 páginas; worker já tinha guardrail |
| SEC-24 | Busca federada sem teto de `q`/`limite` (amplificação) | `q` ≤ 120 caracteres, `limite` ≤ 50 |
| SEC-25 | Cabeçalhos de segurança ausentes no Worker | `Cross-Origin-Resource-Policy`, `Origin-Agent-Cluster`, `X-DNS-Prefetch-Control`, `X-Permitted-Cross-Domain-Policies`, `upgrade-insecure-requests` |

---

## 3. Matriz de ataques executada

Cada linha representa uma família de ataque do OWASP/CWE/KEV; os testes automatizados cobrem as variantes indicadas.

| # | Família / técnica | Payloads testados | Resultado |
| ---: | :--- | :--- | :--- |
| 1 | SQL injection clássica | `' OR '1'='1`, `" OR 1=1 --`, `'; DROP TABLE`, `UNION SELECT` | ✅ parametrizado, sem erro |
| 2 | FTS5 syntax injection | `NEAR(`, `*`, `a") OR ("b`, aspas, dois pontos | ✅ neutralizado |
| 3 | DoS por FTS5 | 4.000 termos / 21 KB | ✅ 186 ms (era 29 s) |
| 4 | NoSQL/operadores em query | `busca[$ne]=x`, `__proto__[x]`, `constructor[prototype]` | ✅ inócuo |
| 5 | Prototype pollution (corpo JSON) | `{"__proto__":{...}}`, `constructor.prototype` | ✅ inócuo |
| 6 | XSS reflexivo | `<script>`, `"><img onerror>`, `javascript:` | ✅ escape/sanitize |
| 7 | XSS armazenado (sugestões) | título/licença/formato com HTML | ✅ normalizado por allowlist |
| 8 | XSS via SVG no proxy | `image/svg+xml` com `<script>` | ✅ 415 + CSP sandbox |
| 9 | SSRF IPv4 não canónico | decimal, octal, hex, `127.1` | ✅ bloqueado |
| 10 | SSRF IPv6 | `::1`, `::ffff:*`, NAT64, ULA, link-local, multicast | ✅ bloqueado |
| 11 | SSRF FQDN | `localhost.`, `foo.localhost`, `.internal`, `.local` | ✅ bloqueado |
| 12 | SSRF metadados cloud | `169.254.169.254`, `[::ffff:a9fe:a9fe]` | ✅ bloqueado |
| 13 | SSRF por redirect | 302 → `127.0.0.1`, 302 → host fora da allowlist | ✅ bloqueado antes do 2.º pedido |
| 14 | SSRF por DNS rebinding | nome público → IP privado (resolução validada) | ✅ Express (Worker: allowlist + CF) |
| 15 | Open redirect | `/api/cursos/:id/acessar`, `/ler/:linkId` | ✅ destino revalidado na leitura |
| 16 | IDOR / BOLA | link de outro livro, IDs não numéricos, negativos | ✅ 404 |
| 17 | Broken function level auth | mutações sem chave, chave errada, `Bearer` | ✅ 401 fail-closed |
| 18 | Chave hardcoded / fail-open | `lino-admin-dev-key` em staging | ✅ removida |
| 19 | Timing attack na chave | comparação com comprimentos diferentes | ✅ tempo constante |
| 20 | Rate-limit bypass | `X-Forwarded-For` rotativo | ✅ trust proxy off |
| 21 | Rate-limit / quota D1 | escrita pública em podcasts e leituras | ✅ 20/min e 60/min |
| 22 | Path traversal | `../`, `%2e%2e`, `..%2f`, `/.env`, `/.git` | ✅ 404 |
| 23 | Ficheiros de obras no servidor | `.pdf/.epub/.mp3/.mp4/.txt` | ✅ 404 explícito |
| 24 | CRLF / header injection | `%0d%0aX-Injected` | ✅ sem cabeçalho |
| 25 | HTTP Parameter Pollution | parâmetros repetidos, arrays | ✅ normalizado |
| 26 | Mass assignment | `id`, `status`, `leituras`, campos calculados | ✅ ignorados |
| 27 | Content-Type confusion | `text/plain` em rota JSON | ✅ 400 |
| 28 | Payload excessivo | > 1 MB | ✅ 413 |
| 29 | JSON malformado | `{`, `null`, arrays | ✅ 400 (Worker e Express) |
| 30 | Métodos HTTP perigosos | `TRACE`, `PUT`/`DELETE` sem chave | ✅ 401/404 |
| 31 | WAF evasion | UA `sqlmap`, `nikto`, `nuclei`, bots agressivos | ✅ 403 |
| 32 | Sondas de infraestrutura | `.env`, `.git`, `wp-admin`, `phpmyadmin`, `.aws` | ✅ 404 |
| 33 | Clickjacking | `X-Frame-Options`, `frame-ancestors` | ✅ DENY/none |
| 34 | MIME sniffing | `X-Content-Type-Options` | ✅ nosniff |
| 35 | Cache poisoning / deception | respostas admin em cache, `Vary` | ✅ `no-store` |
| 36 | CORS mal configurado | preflight com `Origin: evil`, `x-admin-key` | ⚠️ aceite (sem credenciais) |
| 37 | CSP bypass | `script-src https:` | ✅ corrigido |
| 38 | Fingerprinting | `Server`, `X-Powered-By` | ✅ removido o segundo |
| 39 | HSTS / downgrade | cabeçalho em produção | ✅ `max-age=31536000; includeSubDomains` |
| 40 | Divulgação de erros | stack/SQL em 500 | ✅ genérico |
| 41 | Enumeração de jobs de importação | `GET /api/import/:id` | ✅ 401 |
| 42 | Exaustão de memória | mapa de rate limit, buffer de capas | ✅ tetos + streaming |
| 43 | Regras de compliance | texto integral com licença comercial | ✅ 400 |
| 44 | Dependências vulneráveis | `npm audit` | ⚠️ runtime limpo; dev com alertas |
| 45 | Segredos no repositório | chaves, tokens, `.env` | ✅ nenhum |
| 46 | Supply chain CI/CD | actions por tag | ⚠️ recomendação: pin por SHA |
| 47 | XXE / deserialização | sem XML nem `eval`/`Function` | ✅ não aplicável |
| 48 | Command injection | sem `child_process`/`exec` | ✅ não aplicável |
| 49 | JWT `none` / alg confusion | sem JWT | ✅ não aplicável |
| 50 | CSRF | autenticação por cabeçalho, sem cookies | ✅ não aplicável |

> As técnicas 1–50 agregam **mais de 500 variantes de payload** (as famílias de CVE do catálogo KEV são, na sua maioria, variantes destes CWE). As variantes executadas estão codificadas na suíte para regressão contínua.

---

## 4. Dependências (`npm audit`)

- **Runtime: 0 vulnerabilidades.** `express 5.3.0`, `qs 6.16.1`, `proxy-addr 2.0.8` (corrige CVE-2026-90711), `path-to-regexp 8.4.2`, `compression 1.8.2`, `send 1.2.1`, `serve-static 2.2.1`, `hono 4.13.13` — todas acima das versões corrigidas dos avisos de 2026.
- **13 alertas (5 moderados, 8 altos) são todos `devDependencies`**, maioritariamente em `prisma@8.0.0-rc` (cadeia `@prisma/dev` → `hono@4.11.4`, `@hono/node-server@1.19.9`, `alchemy`, `valibot`, `lodash`). **Não são embarcados** no Worker nem no servidor.
- **Recomendação:** actualizar `prisma` para a versão estável quando disponível e correr `npm audit fix` num ambiente controlado. Não foi feito aqui para não alterar o `package-lock.json` partilhado com outros agentes nem quebrar o `npm ci` do CI.

---

## 5. Verificação em produção (black-box, apenas leitura)

`https://lino-livre.linolivre.workers.dev`

| Verificação | Resultado |
| :--- | :--- |
| `GET /` | 200, HSTS + CSP + XFO DENY + nosniff + Referrer-Policy |
| `GET /.env`, `/.git/config` | 404 (WAF) |
| `GET /api/import/1` | 404 (job inexistente; após deploy passará a 401) |
| `GET /api/capas?u=http://[::ffff:7f00:1]/` | 403 (defesa em profundidade por allowlist) |
| `OPTIONS /api/livros` (Origin hostil) | `Access-Control-Allow-Origin: *`, `Allow-Headers: x-admin-key` |
| `X-Powered-By` | ausente |
| CSP em produção (`_headers`) | tinha `script-src ... https:` → **corrigido neste PR** |

---

## 6. Riscos residuais aceites

1. **CORS `*` nas rotas `/api/*`.** A API é pública e não usa cookies/credenciais; mutações exigem chave. Risco baixo. Recomenda-se restringir a origem em mutações se surgir um painel administrativo externo.
2. **CSP com `'unsafe-inline'` em `script-src`.** Necessário para o bootstrap inline do tema (evita flash). Recomenda-se migrar para nonce/hash e remover `'unsafe-inline'` (requer alterar os `<script>` inline de `index.html`).
3. **WAF baseado em User-Agent.** Pode ser contornado falsificando o UA. É defesa em profundidade; o rate limiting e a autenticação são as barreiras reais. Recomenda-se Turnstile nas rotas de escrita pública (`/api/sugestoes`).
4. **Rate limiting em memória por isolate (Worker).** Cada isolate tem o seu balde; um ataque distribuído por muitos isolates vê limites multiplicados. Para garantia global seria necessário Durable Object/KV. O objectivo aqui é proteger a cota da D1 de abusos triviais.
5. **Soft-404 do fallback SPA.** Qualquer caminho desconhecido devolve `index.html` com 200. Não é vulnerabilidade, mas mascara sondas e prejudica SEO. Recomenda-se 404 real para caminhos sem `Accept: text/html`.
6. **Ações do GitHub por tag (`@v4`).** Risco de supply chain. Recomenda-se fixar por SHA e adicionar `permissions: contents: read` explícito aos workflows de sincronização.

---

## 7. Como reproduzir

```bash
# Suíte completa (244 testes)
npm test

# Apenas a matriz de ataques (29 testes)
npm run test:security

# Sonda dinâmica contra um servidor local instrumentado
npm run security:probe

# Tipagem
npx tsc --noEmit

# Dependências
npm audit
```

---

## 8. Ficheiros alterados

```
.env.example
public/_headers
public/.well-known/security.txt          (novo)
scripts/security_probe_local.js          (novo)
src/app.js
src/middlewares/rateLimit.js             (novo)
src/routes/api.js
src/utils/urlValidator.js
src/controllers/*.js
test/api.test.js
test/capas_proxy.test.js
test/security_attack_matrix.test.js      (novo)
workers/src/index.ts
workers/src/utils/urlValidator.ts
```

---

**Conclusão:** a superfície de ataque foi reduzida de forma mensurável. As duas falhas exploráveis sem autenticação (DoS por FTS e bypass de chave no Worker) e as seis evasões de SSRF estão fechadas e cobertas por testes. Não foi introduzida qualquer alteração à arquitectura de intermediação: o servidor continua sem armazenar obras e todos os acessos continuam a ser redireccionamentos 302 para fontes externas.
