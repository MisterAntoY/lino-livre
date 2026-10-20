# 🤖 MEMÓRIA E REGRAS PARA AGENTES (ATUAIS E FUTUROS)

> **ATENÇÃO AGENTES DE IA (Antigravity, Gemini, Claude, GPT, Cursor, etc.):**
> 
> Esta é uma diretriz de arquitetura, legalidade, cybersegurança e histórico operacional inviolável para todo e qualquer trabalho neste repositório. Todos os agentes devem respeitar estas diretrizes integralmente antes de propor, modificar ou executar código.

---

## 🏛️ 1. Diretriz Principal: Servidor Intermediário (Zero Armazenamento Local de Livros)

1. **Sem Armazenamento de Arquivos/Livros:** 
   - O servidor web, a API e o banco de dados deste projeto **NUNCA** devem armazenar, hospedar ou guardar arquivos de livros (PDF, EPUB, TXT, MOBI, MP3, MP4 ou quaisquer binários).
   - O banco de dados guarda unicamente **metadados** (título, autor, categoria, idioma, licença) e **links de redirecionamento para URLs externas**.

2. **Papel Exclusivo de Intermediário:**
   - A aplicação funciona **estritamente como uma plataforma intermediária e indexadora de busca educacional**.
   - Toda leitura/download feita pelo usuário ocorre através de um redirecionamento (HTTP 302) para o provedor original ou repositório externo onde o arquivo está efetivamente hospedado.

3. **Fundamento da Defesa Legal (Lei n.º 15/14 de Angola & Convenções Internacionais):**
   - Em caso de notificação jurídica, disputa ou processo legal, a linha de defesa do responsável e da aplicação baseia-se no fato de que o servidor **não armazena nem distribui diretamente nenhum arquivo de obra** em sua infraestrutura física ou de banco de dados, atuando unicamente como ponte/redirecionador para links públicos disponíveis na internet.
   - O Lino Livre opera sem fins lucrativos, com zero monetização e com canais diretos de desindexação ágil (DMCA / Notificação Legal com compromisso de remoção em até 48 horas úteis, conforme documentado em [`docs/LEGAL.md`](file:///Users/mendes/Desktop/I%20am%20Abc/docs/LEGAL.md)).

4. **Coluna `conteudo_texto` — Regra Inviolável de Domínio Público:**
   - Conforme auditado em [`docs/auditorias/DOMINIO-PUBLICO-VERIFICACAO.md`](file:///Users/mendes/Desktop/I%20am%20Abc/docs/auditorias/DOMINIO-PUBLICO-VERIFICACAO.md), **100% dos textos integrais** armazenados na coluna `conteudo_texto` devem pertencer comprovadamente ao **Domínio Público universal** (autores clássicos falecidos há mais de 70 anos: Machado de Assis, Camões, Alencar, Aluísio Azevedo, Lima Barreto, Fernando Pessoa).
   - Obras contemporâneas ou acadêmicas sob direitos autorais (como Trabalhos de Fim de Curso e Teses da Universidade Agostinho Neto - UAN) **NÃO** podem ter texto integral em `conteudo_texto` (`NULL` obrigatório), sendo o acesso realizado estritamente por redirecionamento HTTP 302 para a fonte original.

5. **Dever de Todos os Agentes:**
   - **NÃO** crie tabelas, colunas, pastas no servidor ou buckets para upload/armazenamento direto dos arquivos de livros.
   - **NÃO** altere a lógica de redirecionamento 302 para servir arquivos diretamente do sistema de arquivos local do servidor.
   - Mantenha sempre a integridade da arquitetura de intermediação em todas as novas rotas, scripts de importação e refatorações.

---

## 📜 2. Histórico de Decisões e Interações Registradas nos Chats

### 2.1. Cursos Cursa em Múltiplos Idiomas e Atualização do Contador
- **Decisão:** Inclusão e catalogação integral dos cursos gratuitos do aplicativo Cursa (`https://cursa.app`) em **5 idiomas**: Português (`pt`), Inglês (`en`), Espanhol (`es`), Francês (`fr`) e Alemão (`de`), cobrindo áreas de Tecnologia, Idiomas, Gestão e Ciências.
- **Contador do Acervo:** O contador geral de cursos foi atualizado no banco local (`biblioteca.db`) e nos agregados para mais de **8.560 cursos** gratuitos catalogados.

### 2.2. Resolução do Incidente de Deploy no Cloudflare Workers (Erros 10000 e 9109)
- **Problema Relatado:**
  ```text
  Run cloudflare/wrangler-action@v3
  ✘ [ERROR] A request to the Cloudflare API failed. Authentication error [code: 10000]
  ✘ [ERROR] Cannot use the access token from location: 134.33.102.120 [code: 9109]
  ```
- **Causa Raiz:** O token de API da Cloudflare (`CLOUDFLARE_API_TOKEN`) gerado no painel da Cloudflare continha restrição de IP de cliente (IP Access Rules / Client IP Filtering), o que impedia que os runners do GitHub Actions (que utilizam IPs dinâmicos, como `134.33.102.120`) autenticassem no endpoint da Cloudflare.
- **Decisão e Resolução para Agentes:**
  1. O token no painel da Cloudflare deve ser gerado através do template **"Edit Cloudflare Workers"**.
  2. As permissões obrigatórias são:
     - `Account > Worker Scripts > Edit`
     - `Account > D1 > Edit`
     - `Account > Account Settings > Read`
     - `User > User Details > Read`
  3. No campo **Client IP Address Filtering**, **NÃO** configure restrição de IP (`IP Filtering: Any IP`), para permitir execução por runners CI/CD em qualquer faixa de endereçamento.

### 2.3. Execução Sequencial das Fases do Plano de Resolução
O projeto executou de forma estrita as fases detalhadas em [`docs/planos/PLANO-RESOLUCAO.md`](file:///Users/mendes/Desktop/I%20am%20Abc/docs/planos/PLANO-RESOLUCAO.md):
- **Fase 3 & 4 (Ingestão Escalar e Busca Federada Global):**
  - Motor federado RRF (Reciprocal Rank Fusion com $k=60$) agregando catálogo local e upstreams abertos.
  - Importadores assíncronos oficiais para Wikisource, LibriVox, Standard Ebooks, Europeana e Google Books.
- **Fase 5 (Compliance e Auditoria de Licenças):**
  - 100% dos títulos com licenças válidas auditadas.
  - Bloqueio no código contra sites da blacklist de pirataria (Z-Library, LibGen, Sci-Hub, Anna's Archive).
  - Ingestão curada de 100 repositórios técnicos do GitHub com capas vetoriais SVG e sinopses multilíngues.
- **Fase 6 (Frontend & Experiência de Usuário):**
  - Pílulas de filtro por licença (`#pills-licencas`).
  - Modal dedicado de Detalhes da Obra com sinopse, capa em alta resolução e botões de download por formato (PDF, EPUB, TXT, HTML).
  - Suporte a Deep Links com hash (`/#livro-123`).
  - Internacionalização em 7 idiomas (`pt`, `pt-br`, `en`, `es`, `fr`, `de`, `zh`).
- **Fase 7 (Intermediário de Cursos Gratuitos - OER):**
  - Diretório curado cobrindo **OER Commons** (15 cursos CC BY), **OpenStax** (8 cursos CC BY), **MIT OpenCourseWare** (11 cursos CC BY-NC-SA), **CK-12 Foundation** (5 cursos CC BY-NC), **PhET Interactive Simulations** (6 simulações CC BY) e **Khan Academy** (6 trilhas CC BY-NC-SA).
  - Filtro por `licenca` em `GET /api/cursos` no Express, Worker e Supabase.
  - Redirecionamento seguro HTTP 302 em `GET /api/cursos/:id/acessar`.
- **Fase 8 (Comunidade & Cartaz Escolar para Impressão):**
  - Criação da página pública de Cartaz Escolar em [`public/comunidade.html`](file:///Users/mendes/Desktop/I%20am%20Abc/public/comunidade.html) acessível via rota `/comunidade`.
  - Estilos de impressão `@media print` para papel A4 sem cabeçalhos de tela.
  - QR codes dinâmicos SVG gerados em `/api/comunidade/qrcode.svg` e `/api/canal/qrcode.svg` com cache em memória.
  - Zero coleta de números de telefone ou mensagens privadas (privacidade absoluta).
- **Fase 10 (Documentação e Arranque Final):**
  - Consolidação de marcas, `.env.example`, `README.md` e checklist final em `PLANO-RESOLUCAO.md`.

---

## 🛡️ 3. Arquitetura de Cybersegurança e Controles Defensivos

Todas as diretrizes do relatório [`docs/auditorias/AUDITORIA_SEGURANCA_ARQUITETURA.md`](file:///Users/mendes/Desktop/I%20am%20Abc/docs/auditorias/AUDITORIA_SEGURANCA_ARQUITETURA.md) foram implementadas em código e devem ser mantidas:

### 3.1. Autenticação Administrativa Fail-Closed & Anti-Timing Attack
- **Mutações Protegidas:** Todas as rotas que alteram dados (`POST/PUT/DELETE /api/livros`, `/api/categorias`, `/api/autores`, `/api/cursos`, `/api/import`, `/api/admin/*`) e a visualização da moderação (`GET /api/sugestoes`) exigem autenticação administrativa.
- **Fail-Closed em Produção:** Se a variável de ambiente `ADMIN_API_KEY` não for configurada no servidor, mutações são imediatamente rejeitadas (HTTP 503 no Express, HTTP 401 no Worker).
- **Tempo Constante:** A comparação de chaves (`x-admin-key` ou `Authorization: Bearer <key>`) utiliza `crypto.timingSafeEqual` no Express e `timingSafeEqualStr` no Worker, prevenindo ataques de temporização (timing attacks).

### 3.2. Prevenção de SQLi e Sanitização FTS5 contra DoS
- **Prepared Statements:** 100% das consultas dinâmicas usam marcadores posicionais `?` com `db.prepare(...).bind(...)` ou `db.prepare(...).run/all(...)`.
- **FTS5 Query Sanitization:** Toda busca textual passa pela função `sanitizarFts5`. Operadores especiais e pontuações (`(`, `:`, `*`, `AND`, `OR`, `NOT`, `NEAR`) são neutralizados e encapsulados como literais puros (`"token"*`), prevenindo exceções de sintaxe SQLite e ataques de negação de serviço (DoS).
- **Alinhamento da Contagem:** A função `contarNaFts` deve usar rigorosamente a mesma expressão de sanitização que a consulta principal (`limparTermoFts`), mantendo correspondência exata entre o número total anunciado e os itens retornados.

### 3.3. Defesa Anti-SSRF e Open Redirect
- **Validador Obrigatório:** Todo redirecionamento e submissão de link externo passa por `validarUrlRedirecionamento` em [`src/utils/urlValidator.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/utils/urlValidator.js) e [`workers/src/utils/urlValidator.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/utils/urlValidator.ts).
- **Regras:**
  - Apenas protocolos `http:` e `https:` são aceitos.
  - Bloqueio estrito de redes locais (`localhost`, `127.0.0.1`, `0.0.0.0`), faixas privadas RFC 1918 (`10.*`, `172.16-31.*`, `192.168.*`), endereços de metadados em nuvem (`169.254.169.254`), loopbacks IPv4 (`127.0.0.0/8`), IPv6 local/link-local (`::1`, `fe80::`, `fc00::`) e TLDs internos (`.local`, `.internal`).
  - Bloqueio sistemático de domínios da blacklist de pirataria (`z-lib`, `libgen`, `sci-hub`, `annas-archive`, `pdfdrive`, etc.).
  - Validação estrita aplicada também a links de imagens (`capa_url`).

### 3.4. WAF de Borda contra Scanners e Sondas
- **Middlewares WAF:** Ativos em [`src/app.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/app.js) e [`workers/src/index.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/index.ts).
- **Bloqueio de Scanners Ofensivos:** Ferramentas automatizadas (`sqlmap`, `nikto`, `dirbuster`, `gobuster`, `acunetix`, `nuclei`, `masscan`, `wpscan`, `zgrab`) recebem **HTTP 403 Forbidden** imediato.
- **Bloqueio de Sondas Sensíveis:** Acessos a caminhos de sonda (`/.env`, `/.git`, `/wp-admin`, `/phpmyadmin`, `/.aws`) recebem **HTTP 404 estrito** sem processamento de banco de dados.

### 3.5. Cabeçalhos de Segurança HTTP Rígidos
Ambos os backends aplicam:
- `Content-Security-Policy (CSP)`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Origin-Agent-Cluster: ?1`
- `Strict-Transport-Security (HSTS)` em ambiente de produção

---

## 🏗️ 4. Decisões de Arquitetura de Dados: Estratégia Híbrida (D1 + Supabase)

### 4.1. Cloudflare D1 como Banco de Borda Primário (Produção Ativa)
- **Decisão:** `"DB_BACKEND": "d1"` permanece como o backend ativo em [`wrangler.jsonc`](file:///Users/mendes/Desktop/I%20am%20Abc/wrangler.jsonc).
- **Justificativa:** O Cloudflare D1 (`lino-livre-db`) opera na Edge Network com latência mínima global, busca FTS5 integrada e redirecionamentos 302 instantâneos.
- **Eficiência e Controle de Cotas D1 (5M leituras/dia):**
  - Todas as consultas com paginação forçam limite máximo (`Math.min(limit, 500)`).
  - Consultas comuns usam tabelas de agregados pré-computados (`estatisticas`, `contadores`, `autor_totais`), evitando varreduras de 104k linhas.
  - Cron diário às 00:10 UTC recalcula agregados e mantém os índices compostos de performance declarados em [`migrations/0005_indices_performance.sql`](file:///Users/mendes/Desktop/I%20am%20Abc/migrations/0005_indices_performance.sql).
  - Cache de borda via Cloudflare Cache API protege rotas GET de leituras repetidas na D1.

### 4.2. Supabase como Backend Auxiliar / Híbrido (Migração Parcial)
- **Diretriz do Usuário:** *"Não migre completamente para o supabase, migre parcialmente."*
- **Finalidade:** Armazenamento relacional PostgreSQL auxiliar para metadados selecionados e fallback de alta disponibilidade.
- **Status das Tabelas Sincronizadas Parcialmente:**
  - `fontes`: 34 registros.
  - `categorias`: 20 registros.
  - `cursos`: 8.541 registros.
- **Script de Migração Parcial:** [`scripts/migrar_d1_para_supabase.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/migrar_d1_para_supabase.js).

---

## ⏰ 5. Automações Periódicas Agendadas (Background Cron Jobs)

1. **Samsung Ocean Brasil (Semanal):**
   - **Script:** [`scripts/sync_ocean_brasil.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/sync_ocean_brasil.js)
   - **Agendamento:** `0 8 * * 1` (toda segunda-feira às 08:00 UTC)
   - **Função:** Sincroniza o catálogo oficial de capacitações e cursos gratuitos da Samsung Ocean (Android, Python, IoT, IA, UX/UI, Cloud) no SQLite e D1 com deduplicação idempotente por URL.

2. **Microsoft Learn em Português pt-pt (Semanal):**
   - **Script:** [`scripts/sync_ms_learn.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/sync_ms_learn.js)
   - **Agendamento:** `0 9 * * 1` (toda segunda-feira às 09:00 UTC)
   - **Função:** Consulta a API pública oficial do Microsoft Learn (`learn.microsoft.com/api/catalog?locale=pt-pt`), atualiza módulos e trilhas de aprendizagem (Azure, DevOps, C#, Power BI, Cybersegurança) com certificados gratuitos.

3. **Recálculo de Agregados D1 (Diário):**
   - **Agendamento:** `10 0 * * *` (todos os dias às 00:10 UTC em [`wrangler.jsonc`](file:///Users/mendes/Desktop/I%20am%20Abc/wrangler.jsonc))
   - **Função:** Executa `recomputarEstatisticas` logo após a reposição da cota diária da Cloudflare.

---

## 💻 6. Guia Rápido de Comandos para Agentes

```bash
# Executar a suíte completa de testes automatizados (145 testes)
npm test

# Executar apenas testes do Cloudflare Worker
npm run test:worker

# Verificar tipagem estrita TypeScript (sem emitir binários)
npx tsc --noEmit

# Repovoar o banco local com todas as fontes, livros e cursos limpos
npm run seed -- --reset

# Sincronizar catálogo de cursos locais e remotos
npm run cursos:sync

# Exportar catálogo consolidado para CSV
npm run livros:csv

# Iniciar servidor Express de desenvolvimento
npm start
```

---

## 🔒 7. Compromisso Contínuo dos Agentes
- **Nunca** quebre os 145 testes automatizados.
- **Nunca** hospede arquivos de mídia locais.
- **Sempre** rode `npm test` e `npx tsc --noEmit` antes de qualquer commit.
- **Sempre** garanta que qualquer novo curso ou livro contenha uma licença aberta válida e comprovada.
