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

### 2.4. Integração Spotify / Audiolivros & Plano de Gravação de Podcast
- **Contexto & Diretriz do Usuário:** O usuário solicitou planejamento para gravação e disponibilização de episódios no Spotify, advertindo explicitamente contra alucinações sobre episódios já gravados (*"Não alucine, eu ainda não gravei nada na spotify"*).
- **Decisão e Entrega:**
  - Foi criado o artefato [`PLANO-GRAVACAO-E-SUGESTOES-PODCAST.md`](file:///Users/mendes/.gemini/antigravity/brain/792a8f78-d098-4ad1-8b64-c766376b98c5/PLANO-GRAVACAO-E-SUGESTOES-PODCAST.md) contendo o plano operacional de gravação, roteiros, sugestões de episódios (Clássicos de Angola, Literatura Lusófona, Hábitos Atômicos, Carreiras em TI e IA) e arquitetura de integração.
  - **Zero Armazenamento de Áudio:** O servidor Lino Livre **NÃO** hospeda arquivos de áudio (MP3/WAV). A hospedagem é feita externamente no **Spotify for Podcasters** (antigo Anchor) com distribuição via feed RSS público e reprodução através do widget oficial do Spotify (`open.spotify.com/embed/show/...`).

### 2.5. Resolução de Políticas RLS no Supabase (Categorias, Cursos, Fontes)
- **Problema Relatado:** O Supabase Database Linter apontou alertas de segurança críticos:
  ```text
  RLS Enabled No Policy (public.categorias, public.cursos, public.fontes)
  ```
- **Causa Raiz:** O Row Level Security (RLS) estava ativo nas tabelas, porém sem políticas explícitas declaradas, o que impedia qualquer leitura pública via API cliente anônima (PostgREST).
- **Decisão e Resolução:**
  - Declaração de políticas de leitura pública permissiva para catálogos abertos:
    ```sql
    CREATE POLICY "leitura_publica" ON public.categorias FOR SELECT USING (true);
    CREATE POLICY "leitura_publica" ON public.cursos FOR SELECT USING (true);
    CREATE POLICY "leitura_publica" ON public.fontes FOR SELECT USING (true);
    ```
  - Bloqueio estrito de inserções, alterações e deleções para a role `anon` (código de erro PostgreSQL `42501` em tentativas de mutação não autenticadas).

### 2.6. Auditoria de Portas, APIs, URLs, IDORs e Entradas via TDD Estrito
- **Diretriz do Usuário:** *"Verifique todas as portas, API, url, idors, todo o tipo de entrada de dados, de forma detalhista, e APLIQUE A TEORIA DO TDD"*
- **Metodologia Aplicada:** Ciclo rigoroso de TDD (Red -> Green -> Refactor) na suíte [`test/security_idor_tdd.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/security_idor_tdd.test.js) com 22 testes de regressão de segurança:
  1. **Correção de Coluna Fantasma em Autores:** Em [`src/controllers/autoresController.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/controllers/autoresController.js), a consulta tentava selecionar a coluna inexistente `quantidade_disponivel`, causando erro 500. Removida e substituída por contagem segura.
  2. **Blindagem Anti-SSRF em URLs de Imagens e Redirecionamentos:** Atualização em [`src/utils/urlValidator.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/utils/urlValidator.js) e [`workers/src/utils/urlValidator.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/utils/urlValidator.ts) bloqueando loopbacks IPv4 (`127.0.0.0/8`), `0.0.0.0/8`, IPv6 loopbacks (`::1`, `::`), link-local (`fe80::/10`), redes privadas e metadados cloud (`169.254.169.254`). Validação estrita aplicada também a links de capas (`capa_url`).
  3. **Mitigação de IDOR Cross-Resource:** Na rota `GET /api/livros/:id/ler/:linkId`, validação estrita assegura que o `linkId` pertença obrigatoriamente ao `livroId` requisitado (`SELECT * FROM links_livros WHERE id = ? AND livro_id = ?`), impedindo referências cruzadas arbitrárias.
  4. **Fila de Moderação `/api/sugestoes`:** Inclusão da tabela `sugestoes` em [`src/database/schema.sql`](file:///Users/mendes/Desktop/I%20am%20Abc/src/database/schema.sql) com sanitização de título, URL externa, proteção contra listas de pirataria e restrição de visualização restrita à chave administrativa.

### 2.7. Sincronização do Contador e Eliminação de Números Fictícios (997 Obras Reais)
- **Diretriz do Usuário:** *"atualize o contador"*
- **Problema Detectado:** Existência de números de exemplo/fictícios residuais (`104.848`) em placeholders do frontend e fallbacks de degradação quando o servidor atingia limites de cota da D1.
- **Valores REAIS Consolidados da Base de Dados:**
  - **Total de Livros Abertos:** **997** (897 clássicos/acadêmicos + 100 livros de programação/GitHub da Fase 5).
  - **Meta Coletiva Global:** **10.000.000** de livros livres.
  - **Faltam Indexar:** **9.999.003**.
  - **Porcentagem Atual:** **0.0100%** da meta.
  - **Próximo Marco:** **1.000 Obras** (faltam apenas 3 obras para atingir o Marco 1).
  - **Cursos Gratuitos:** **8.568**.
  - **Autores:** **641**.
  - **Categorias:** **20**.
  - **Fontes Aprovadas:** **34** ativas.
- **Ajustes Realizados:**
  1. [`public/index.html`](file:///Users/mendes/Desktop/I%20am%20Abc/public/index.html): hodômetro `#placar-total-livros` inicializado em `997`, marco 1.000 com classe `active` e tag *"Próximo"*, pílulas de estatísticas atualizadas.
  2. [`public/js/app.js`](file:///Users/mendes/Desktop/I%20am%20Abc/public/js/app.js): `totalLivrosAcervo: 997`, remoção de limiares artificiais e distribuições falsas em recálculos de agregados.
  3. [`workers/src/index.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/index.ts): objeto `resumo_estavel` atualizado com as métricas reais em caso de degradação 503 da D1.
  4. Script de auditoria automatizado [`scripts/corrigirMetricasDashboard.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/corrigirMetricasDashboard.js) com 100% de verificações verdes.
  5. Deploy realizado no Cloudflare Workers (`https://lino-livre.linolivre.workers.dev`, Version ID: `9dfd75e7-75de-4081-b01f-10b93206030c`).

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

### 3.6. Proteção contra IDOR Cross-Resource e Integridade Referencial
- **Validação de Propriedade do Recurso:** Na rota de leitura `GET /api/livros/:id/ler/:linkId`, o sistema garante que o `linkId` pertence de fato ao `livro_id` especificado na URL (`SELECT * FROM links_livros WHERE id = ? AND livro_id = ?`). Se um atacante tentar associar o ID de um livro público com o linkId de outra obra, o servidor responde com **HTTP 404 Not Found**, impedindo enumerações cruzadas (IDOR cross-resource).
- **Validação Estrita de Identificadores Numéricos:** Parâmetros de rota (`:id`, `:linkId`) são convertidos e validados estritamente como números inteiros positivos (`/^\d+$/`). Entradas não numéricas ou payloads maliciosos são sumariamente rejeitados.
- **Fila de Moderação Sanitizada:** O endpoint de submissão de sugestões (`POST /api/sugestoes`) valida tamanho máximo, caracteres de controle e protocolo do link externo antes de enfileirar no banco de dados.

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
