# 🤖 MEMÓRIA E REGRAS PARA AGENTES (ATUAIS E FUTUROS)

> **ATENÇÃO AGENTES DE IA (Antigravity, Gemini, Claude, GPT, Cursor, etc.):**
> 
> Esta é uma diretriz de arquitetura, legalidade, cybersegurança e histórico operacional inviolável para todo e qualquer trabalho neste repositório. Todos os agentes devem respeitar estas diretrizes integralmente antes de propor, modificar ou executar código.

---

## 🏛️ 1. Diretriz Principal: Servidor Intermediário (Zero Armazenamento Local de Livros)

1. **Sem Armazenamento de Arquivos/Livros:** 
   - O servidor web, a API e o banco de dados deste projeto **NUNCA** devem armazenar, hospedar ou guardar arquivos de livros (PDF, EPUB, TXT, MOBI ou quaisquer binários).
   - O banco de dados guarda unicamente **metadados** (título, autor, categoria, idioma, licença) e **links de redirecionamento para URLs externas**.

2. **Papel Exclusivo de Intermediário:**
   - A aplicação funciona **estritamente como uma plataforma intermediária e indexadora de busca educacional**.
   - Toda leitura/download feita pelo usuário ocorre através de um redirecionamento (HTTP 302) para o provedor original ou repositório externo onde o arquivo está efetivamente hospedado.

3. **Fundamento da Defesa Legal (Lei n.º 15/14 de Angola & Convenções Internacionais):**
   - Em caso de notificação jurídica, disputa ou processo legal, a linha de defesa do responsável e da aplicação baseia-se no fato de que o servidor **não armazena nem distribui diretamente nenhum arquivo de obra** em sua infraestrutura física ou de banco de dados, atuando unicamente como ponte/redirecionador para links públicos disponíveis na internet.
   - O Lino Livre opera sem fins lucrativos, com zero monetização e com canais diretos de desindexação ágil (DMCA / Notificação Legal com compromisso de remoção em até 48 horas úteis, conforme documentado em [`docs/LEGAL.md`](file:///Users/mendes/Desktop/I%20am%20Abc/docs/LEGAL.md)).

4. **Coluna `conteudo_texto` — Regra Inviolável de Domínio Público:**
   - Conforme auditado em [`docs/auditorias/DOMINIO-PUBLICO-VERIFICACAO.md`](file:///Users/mendes/Desktop/I%20am%20Abc/docs/auditorias/DOMINIO-PUBLICO-VERIFICACAO.md), **100% dos textos integrais** armazenados na coluna `conteudo_texto` devem pertencer comprovadamente ao **Domínio Público universal** (autores clássicos falecidos há mais de 70 anos: Machado de Assis, Camões, Alencar, Aluísio Azevedo, Lima Barreto, Fernando Pessoa). Nenhuma obra sob copyright contemporâneo pode ter texto integral inserido no banco.

5. **Dever de Todos os Agentes:**
   - **NÃO** crie tabelas, colunas, pastas no servidor ou buckets para upload/armazenamento direto dos arquivos de livros.
   - **NÃO** altere a lógica de redirecionamento 302 para servir arquivos diretamente do sistema de arquivos local do servidor.
   - Mantenha sempre a integridade da arquitetura de intermediação em todas as novas rotas, scripts de importação e refatorações.

---

## 🛡️ 2. Arquitetura de Cybersegurança e Controles Defensivos

Todas as diretrizes do relatório [`docs/auditorias/AUDITORIA_SEGURANCA_ARQUITETURA.md`](file:///Users/mendes/Desktop/I%20am%20Abc/docs/auditorias/AUDITORIA_SEGURANCA_ARQUITETURA.md) foram implementadas em código e devem ser mantidas:

### 2.1. Autenticação Administrativa Fail-Closed & Anti-Timing Attack
- **Mutações Protegidas:** Todas as rotas que alteram dados (`POST/PUT/DELETE /api/livros`, `/api/categorias`, `/api/autores`, `/api/cursos`, `/api/import`, `/api/admin/*`) e a visualização da moderação (`GET /api/sugestoes`) exigem autenticação administrativa.
- **Fail-Closed em Produção:** Se a variável de ambiente `ADMIN_API_KEY` não for configurada no servidor, mutações são imediatamente rejeitadas (HTTP 503 no Express, HTTP 401 no Worker).
- **Tempo Constante:** A comparação de chaves (`x-admin-key` ou `Authorization: Bearer <key>`) utiliza `crypto.timingSafeEqual` no Express e `timingSafeEqualStr` no Worker, prevenindo ataques de temporização (timing attacks).
- **Gerador de Chaves:** Disponível em [`scripts/gerar_chave_admin.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/gerar_chave_admin.js) para criar chaves de 256 bits com a flag `--salvar-env`.

### 2.2. Prevenção de SQLi e Sanitização FTS5 contra DoS
- **Prepared Statements:** 100% das consultas dinâmicas usam marcadores posicionais `?` com `db.prepare(...).bind(...)` ou `db.prepare(...).run/all(...)`.
- **FTS5 Query Sanitization:** Toda busca textual passa pela função `sanitizarFts5`. Operadores especiais e pontuações (`(`, `:`, `*`, `AND`, `OR`, `NOT`, `NEAR`) são neutralizados e encapsulados como literais puros (`"token"*`), prevenindo exceções de sintaxe SQLite e ataques de negação de serviço (DoS).

### 2.3. Defesa Anti-SSRF e Open Redirect
- **Validador Obrigatório:** Todo redirecionamento e submissão de link externo passa por `validarUrlRedirecionamento` em [`src/utils/urlValidator.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/utils/urlValidator.js) e [`workers/src/utils/urlValidator.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/utils/urlValidator.ts).
- **Regras:**
  - Apenas protocolos `http:` e `https:` são aceitos.
  - Bloqueio estrito de redes locais (`localhost`, `127.0.0.1`, `0.0.0.0`), faixas privadas RFC 1918 (`10.*`, `172.16-31.*`, `192.168.*`), endereços de metadados em nuvem (`169.254.169.254`) e TLDs internos (`.local`, `.internal`).
  - Bloqueio sistemático de domínios da blacklist de pirataria (`z-lib`, `libgen`, `sci-hub`, `annas-archive`, `pdfdrive`, etc.).

### 2.4. WAF de Borda contra Scanners e Sondas
- **Middlewares WAF:** Ativos em [`src/app.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/app.js) e [`workers/src/index.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/index.ts).
- **Bloqueio de Scanners Ofensivos:** Ferramentas automatizadas (`sqlmap`, `nikto`, `dirbuster`, `gobuster`, `acunetix`, `nuclei`, `masscan`, `wpscan`, `zgrab`) recebem **HTTP 403 Forbidden** imediato.
- **Bloqueio de Sondas Sensíveis:** Acessos a caminhos de sonda (`/.env`, `/.git`, `/wp-admin`, `/phpmyadmin`, `/.aws`) recebem **HTTP 404 estrito** sem processamento de banco de dados.

### 2.5. Cabeçalhos de Segurança HTTP Rígidos
Ambos os backends aplicam:
- `Content-Security-Policy (CSP)`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Origin-Agent-Cluster: ?1`
- `Strict-Transport-Security (HSTS)` em ambiente de produção

---

## 🏗️ 3. Decisões de Arquitetura de Dados: Estratégia Híbrida (D1 + Supabase)

### 3.1. Cloudflare D1 como Banco de Borda Primário (Produção Ativa)
- **Decisão:** `"DB_BACKEND": "d1"` permanece como o backend ativo em [`wrangler.jsonc`](file:///Users/mendes/Desktop/I%20am%20Abc/wrangler.jsonc).
- **Justificativa:** O Cloudflare D1 (`lino-livre-db`) opera na Edge Network com latência mínima global, busca FTS5 integrada e redirecionamentos 302 instantâneos.
- **Eficiência e Controle de Cotas D1 (5M leituras/dia):**
  - Todas as consultas com paginação forçam limite máximo (`Math.min(limit, 500)`).
  - Consultas comuns usam tabelas de agregados pré-computados (`estatisticas`, `contadores`, `autor_totais`), evitando varreduras de 104k linhas.
  - Cron diário às 00:10 UTC recalcula agregados e mantém os índices compostos de performance declarados em [`migrations/0005_indices_performance.sql`](file:///Users/mendes/Desktop/I%20am%20Abc/migrations/0005_indices_performance.sql).
  - Cache de borda via Cloudflare Cache API protege rotas GET de leituras repetidas na D1.

### 3.2. Supabase como Backend Auxiliar / Híbrido (Migração Parcial)
- **Diretriz do Usuário:** *"Não migre completamente para o supabase, migre parcialmente."*
- **Finalidade:** Armazenamento relacional PostgreSQL auxiliar para metadados selecionados e fallback de alta disponibilidade.
- **Status das Tabelas Sincronizadas Parcialmente:**
  - `fontes`: 34 registros.
  - `categorias`: 20 registros.
  - `cursos`: 8.541 registros.
- **Script de Migração Parcial:** [`scripts/migrar_d1_para_supabase.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/migrar_d1_para_supabase.js).

---

## ⏰ 4. Automações Periódicas Agendadas (Background Cron Jobs)

O sistema mantém rotinas de ingestão e sincronização autônomas agendadas:

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

## 📱 5. Comunidade e Canal WhatsApp (Fase 8)

- **Diretriz:** Apenas links diretos e QR codes gerados dinamicamente. Sem bots proprietários, sem Cloud API da Meta e com zero coleta de números de telefone ou dados pessoais dos usuários.
- **Canais Integrados:**
  - 📢 **Canal Oficial ("Livros e Cursos — Lino Livre"):** Comunicação de mão única para anúncios de novas obras e cursos com certificados.
  - 💬 **Grupo de Leitores ("Lino, quero ler!"):** Espaço comunitário aberto para troca de resenhas e pedidos de obras abertas.
- **Endpoints de QR Code SVG:**
  - `GET /api/comunidade/qrcode.svg`: QR Code SVG dinâmico para a comunidade com cache em memória.
  - `GET /api/canal/qrcode.svg`: QR Code SVG dinâmico para o canal oficial.
- **Cartaz Escolar para Impressão:** Disponível em [`public/comunidade.html`](file:///Users/mendes/Desktop/I%20am%20Abc/public/comunidade.html) com formatação responsiva A4 e `@media print` para murais de escolas e universidades.

---

## 🎨 6. Interface do Usuário e Experiência Acessível

- **Navegação por Abas:** As abas principais do catálogo (Livros Digitais, Cursos Gratuitos, Roadmaps & Trilhas, Podcasts, Dicas & Ferramentas, Métricas & Fontes) utilizam seletores resilientes e isolamento de eventos de clique em [`public/js/app.js`](file:///Users/mendes/Desktop/I%20am%20Abc/public/js/app.js).
- **Rótulos de Licenças Abertas:** Licenças do tipo `outro` são traduzidas em todos os idiomas para **"Acesso Externo Aberto" / "Open External Access"** para evitar ambiguidades jurídicas com Domínio Público ou Creative Commons.
- **Transparência de Leituras:** O catálogo só exibe contadores de leitura quando houver registros reais (`leituras > 0`). Caso contrário, apresenta a etiqueta neutra `"Leitura Aberta"`.

---

## 🚀 7. Pipeline de CI/CD e Qualidade de Código

- **Arquivo:** [`.github/workflows/deploy.yml`](file:///Users/mendes/Desktop/I%20am%20Abc/.github/workflows/deploy.yml)
- **Regras do Pipeline:**
  1. **Fail-Closed em Migrações D1:** Se a aplicação de qualquer migração falhar, o deploy é imediatamente interrompido.
  2. **Verificação Estática:** `npx tsc --noEmit` obrigatório em TypeScript.
  3. **Suíte Completa de Testes:** Execução de `npm test` antes de liberar o build.
  4. **Smoke Tests Pós-Deploy:**
     - `GET /` -> HTTP 200
     - `GET /api/dashboard` -> HTTP 200 ou 503
     - `GET /api/livros?page=1&limit=5` -> HTTP 200
     - `GET /api/cursos?limit=5` -> HTTP 200
     - `POST /api/sugestoes` (validação vazia) -> HTTP 400
     - `POST /api/livros` sem chave administrativa -> **HTTP 401**
     - `GET /api/livros` com User-Agent `sqlmap` (WAF) -> **HTTP 403**

---

## 🧪 8. Testes Automatizados e Paridade de Ambientes

- **Comando:** `npm test`
- **Cobertura:** 145 testes automatizados distribuídos em 29 suítes, cobrindo:
  - Testes de integração de API Express ([`test/api.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/api.test.js))
  - Testes do Cloudflare Worker com D1 mockada ([`test/worker.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/worker.test.js))
  - Testes de domínio, integridade e triggers FTS5 ([`test/library.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/library.test.js))
  - Testes de ingestão escalar e busca federada RRF ([`test/buscaFederada.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/buscaFederada.test.js))
  - Testes do acervo GitHub e metadados multilíngues ([`test/fase5.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/fase5.test.js))
  - Testes de segurança, IDOR, SSRF e WAF ([`test/seguranca.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/seguranca.test.js))
- **Regra de Ouro:** Nenhum código deve ser promovido à branch `main` sem que todos os testes passem com 100% de sucesso.
