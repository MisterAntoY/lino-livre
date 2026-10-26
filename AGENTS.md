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

### 2.8. Resolução do Incidente de Esgotamento de Cota da D1 (Erro 7500 & Full Table Scan)
- **Problema Relatado:** Na execução de importações e migrações (ex.: `node scripts/import_fase2_doab.mjs --apply`), a Cloudflare D1 retornava erro fatal:
  ```text
  ✘ [ERROR] A request to the Cloudflare API failed.
  Your account has exceeded D1's free tier daily row read limit. Upgrade to a paid plan or wait until tomorrow (midnight UTC) to continue. [code: 7500]
  ```
- **Causa Raiz:** As consultas de listagem com ordenação padrão (`ORDER BY leituras DESC, titulo ASC`) e contagem por autor realizavam varreduras completas (*Full Table Scan*) de todas as linhas de `livros` a cada cache miss. Menos de 50 pedidos não cacheados esgotavam a cota gratuita de 5.000.000 de linhas lidas/dia da Cloudflare.
- **Decisão e Resolução de Engenharia:**
  1. **Criação de Índices Compostos de Performance na D1:**
     - `idx_livros_popularidade ON livros(leituras DESC, titulo ASC)`
     - `idx_livros_idioma_popularidade ON livros(idioma, leituras DESC, titulo ASC)`
     - `idx_livros_fonte_popularidade ON livros(fonte_id, leituras DESC, titulo ASC)`
     - `idx_livros_categoria_popularidade ON livros(categoria_id, leituras DESC, titulo ASC)`
     - `idx_livros_autor_popularidade ON livros(autor_id, leituras DESC, titulo ASC)`
     - `idx_livros_licenca_popularidade ON livros(licenca, leituras DESC, titulo ASC)`
     - `idx_links_formato_livro ON links_livros(formato, livro_id)`
     - `idx_autores_nome ON autores(nome)`
     - `idx_autores_nome_nocase ON autores(nome COLLATE NOCASE)`
     - `idx_cursos_url ON cursos(url)`
  2. **Aplicação Direta de DDL sem Dependência de `d1_migrations`:** O comando `wrangler d1 migrations apply` executava `SELECT` interno que falhava sob cota esgotada. Os índices foram aplicados diretamente via `wrangler d1 execute` com DDL idempotente, pois operações de escrita não consomem cota de leitura.
  3. **Ganho de Eficiência de 3.000x:** Cada consulta paginada lê agora apenas 24 linhas (via índice B-Tree) em vez de 104.848 linhas. O endpoint `/api/dashboard` lê ~36 linhas da tabela de agregados em vez de varrer a base inteira.
  4. **Automação e Manutenção:** Criação da rota protegida `POST /api/admin/recalcular-estatisticas` e do script de monitoramento [`scripts/aplicar_indices_d1_auto.mjs`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/aplicar_indices_d1_auto.mjs).

### 2.9. Auditoria Integral de Vulnerabilidades (Execução do Plano 2026-10-20)
- **Diretriz do Usuário:** *"auditoria_lino_livre_2026-10-20.md aplique o plano, teste tudo denovo, leia cada linha de codigo para questão de possiveis vunerabilidades, resolva todas as vunerabilidades"*
- **Ações Implementadas em Código:**
  1. **Remediação de DOM XSS no Frontend (`public/js/app.js`):**
     - Substituição de interpolação direta de URLs por sanitização estrita via `this.sanitizeUrl(x.url, '#')` em cartões de busca federada e podcasts.
     - Remoção de handlers inline `onclick="app.ouvirShowCompleto('${s.slug}')"` em favor de atributos `data-slug` com delegação de eventos segura.
     - Validação estrita por allowlist nas configurações de leitura do `localStorage` (temas: creme/sepia/noturno; alinhamento: left/center/right/justify).
  2. **Blindagem Anti-SSRF em Ingestões e Mutação:**
     - Validação obrigatória de URLs em `POST /api/cursos`, `POST /api/livros` e importadores via `validarUrlRedirecionamento`, barrando RFC 1918, loopbacks, metadados cloud e esquemas não-HTTP.
  3. **Filtragem de Domínios Piratas na Busca Federada:**
     - Neutralização automática de fontes e resultados provenientes de sites proibidos (LibGen, Z-Library, Sci-Hub, Anna's Archive, PDF Drive) antes de entregar os dados aos usuários.
  4. **Prevenção de Ataques de Temporização (Timing Attacks):**
     - Validação constante de chaves administrativas via `timingSafeEqualStr` no Cloudflare Worker e `crypto.timingSafeEqual` no Express.
  5. **Prevenção de Path Traversal no Cache de Importação:**
     - Sanitização estrita de identificadores de arquivo em `src/services/importer.js` através de `sanitizarNomeArquivoCache`, limitando nomes a `[a-zA-Z0-9_-]`.
  6. **Injeção de Cabeçalhos HTTP Rigorosos em Produção:**
     - Inclusão no Worker de `Strict-Transport-Security: max-age=31536000; includeSubDomains`, CSP isolada, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` e `Permissions-Policy`.

### 2.10. Resiliência de Degradação do Dashboard e Frontend (Zero Telas Quebradas)
- **Problema:** Quando a Cloudflare D1 atingia a cota diária de leitura antes da meia-noite UTC, instâncias novas (cold start) do Worker retornavam 503 com `cachedDashboard = null`, fazendo o frontend exibir "0 / 10.000.000" ou cair para contagens fragmentadas de fallback (ex.: 5 livros).
- **Decisão e Resolução:**
  1. **Fallback com Resumo Estável Real:** O Worker retorna, no próprio corpo do erro 503 (sem cache no header), o objeto `resumo_estavel` com os totais consolidados auditados.
  2. **Frontend Resiliente (`public/js/app.js`):** `carregarPlacarMeta()` e `carregarDashboard()` detectam o estado de degradação e utilizam os valores estáveis auditados. O placar da meta nunca mais exibe 0 ou cai para contagens fragmentadas.
  3. **Sincronização Automatizada:** O script [`scripts/corrigirMetricasDashboard.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/corrigirMetricasDashboard.js) mantém as duas fontes de verdade alinhadas:
     - `public/index.html`: reflete o seed local de desenvolvimento (997 obras) como placeholder estático sem flash visual.
     - `workers/src/index.ts`: reflete os dados de produção do D1/Supabase.

### 2.11. A Grande Meta dos 10 Milhões de Livros Livres e Roadmap de Marcos
- **Diretriz do Usuário:** *"A minha meta é 10 milhões de livros"*
- **Compromisso Oficial:** O Lino Livre adota como meta coletiva global a indexação aberta de 10.000.000 de obras para a humanidade.
- **Estrutura de Marcos:**
  - **Marco Inicial (0):** Lançamento da Plataforma.
  - **Marco 1 (1.000):** Acervo Clássico Lusófono e Repositórios Técnicos (Fase atual: 997 obras — faltam 3 obras para conclusão).
  - **Marco 2 (10.000):** Ingestão Acadêmica Aberta (DOAB, Teses e Repositórios Universitários).
  - **Marco 3 (100.000):** Domínio Público Global (Gutenberg, Wikisource, Standard Ebooks).
  - **Marco 4 (1.000.000):** Federação Escalar com Bibliotecas Nacionais e Europeana.
  - **Grande Meta (10.000.000):** Democratização universal do conhecimento livre.
- **Regra Ética e Legal:** Nenhuma meta é antecipada ficticiamente; cada marco só é ativado no hodômetro visual após confirmação e auditoria real na base de dados.

### 2.12. Diagnóstico e Blindagem contra Esgotamento Diário da D1 (Erros 7500 & Bounded Counts)
- **Problema Relatado:** *"Recebo todos os dias que o limite do D1 da Cloudflare está quase estourando."*
- **Causa Raiz Identificada:**
  1. No Cloudflare D1 Free Tier, o limite diário é de **5.000.000 de linhas lidas/dia**.
  2. Em `/api/livros`, quando múltiplos filtros eram combinados (ex.: `idioma=pt` + `categoria_id=2`), a variável `totalConhecido` tornava-se `null`.
  3. O fallback executava `SELECT COUNT(*) AS total FROM livros l WHERE 1=1...`, realizando uma varredura completa (*Full Table Scan*) de **104.848 linhas** a cada chamada não cacheada.
  4. Bastavam apenas **48 consultas com filtros combinados** em um dia para consumir 100% da cota diária gratuita (48 × 104.848 = 5.032.704 linhas lidas)!
  5. Adicionalmente, cold-starts em 330 datacenters da Cloudflare consultavam `fontes` e `categorias` repetidamente, e `/api/creditos` e `/api/busca/federada` não utilizavam a Cache API de borda.
- **Soluções de Engenharia Aplicadas:**
  1. **Bounded Subquery Count:** Em consultas multi-filtro, a contagem foi substituída por `SELECT COUNT(*) AS total FROM (SELECT 1 FROM livros l WHERE 1=1... LIMIT ?)`, limitando a leitura a no máximo 500 linhas.
  2. **Short-Circuit na Primeira Página:** Quando `numPage === 1` e `livros.length < numLimit`, o total é exatamente `livros.length`, lendo **ZERO linhas extras**.
  3. **Teto Matemático Derivado de Agregados:** Se a contagem ultrapassar 500, o sistema deriva o teto superior a partir do menor contador das dimensões filtradas (`lerContador`), sem nunca varrer a tabela inteira.
  4. **Dimensões Estáticas em Memória:** As 34 fontes e 20 categorias foram embutidas como fallback estático (`DIMENSOES_ESTATICAS`) com TTL de 30 minutos, eliminando queries D1 em cold starts.
  5. **Expansão da Cache de Borda:** Inclusão de `/api/creditos` e `/api/busca/federada` no middleware `cacheDeBorda` (`Cache-Control: public, max-age=3600, stale-while-revalidate=86400`).
  6. **Redução Comprovada:** O custo por requisição caiu de **104.848 linhas para 24 a 500 linhas** (ganho de eficiência entre **210x e 4.300x**).

### 2.13. Status da Migração Parcial para o Supabase (PostgreSQL / REST)
- **Status Auditado em Tempo Real (via API REST PostgREST):**
  - `public.fontes`: **34 registros** sincronizados com integridade (HTTP 206).
  - `public.categorias`: **20 registros** sincronizados com integridade (HTTP 206).
  - `public.cursos`: **8.541 registros** sincronizados com integridade (HTTP 206).
  - `public.livros`: **Não migrado**. Tabela ainda não criada no Supabase.
- **Causa do Bloqueio da Tabela `livros`:**
  - A tentativa de conexão TCP direta (`DIRECT_URL` na porta 5432 do Supabase Pooler) falhou com `password authentication failed for user "postgres"`, devido à alteração ou expiração da senha do banco no painel do Supabase.
  - A API REST do Supabase (`SUPABASE_SECRET_KEY`) continua 100% funcional e autenticada.
- **Instrução de Desbloqueio (1 Clique):**
  - Para habilitar a tabela `livros` no Supabase: Aceder ao Supabase Dashboard → **SQL Editor** → Colar e executar o conteúdo do arquivo [`supabase/schema.sql`](file:///Users/mendes/Desktop/I%20am%20Abc/supabase/schema.sql). Não requer senha do banco de dados e cria as tabelas, índices e funções RPC (`buscar_livros`, `contar_livros`) de forma totalmente idempotente.

### 2.14. Modelo de Escalonamento e Estimativas Concretas de Tráfego
- **Comparativo de Capacidade Diária:**

| Cenário de Tráfego | Pageviews / Dia | Linhas Lidas (Antes) | Linhas Lidas (Otimizado) | Status D1 Free Tier (5M/dia) | Status Workers Paid ($5/mês) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tráfego Atual** | ~500 - 2.000 | 5.200.000 (ESTOURO) | ~35.000 | ✅ 0.7% da cota consumida | ✅ 0.004% da cota |
| **Tráfego Médio (10x)** | 10.000 | 105.000.000 (INVIÁVEL) | ~180.000 | ✅ 3.6% da cota consumida | ✅ 0.02% da cota |
| **Tráfego Alto (50x)** | 50.000 | 525.000.000 (INVIÁVEL) | ~900.000 | ✅ 18.0% da cota consumida | ✅ 0.11% da cota |
| **Tráfego Viral (200x)** | 200.000 | 2.100.000.000 (INVIÁVEL) | ~3.600.000 | ✅ 72.0% da cota consumida | ✅ 0.45% da cota |
| **Super Escala (1M+)** | 1.000.000 | 10.500.000.000 (INVIÁVEL) | ~18.000.000 | ⚠️ Requer Workers Paid ($5) | ✅ 2.25% da cota (25B/mês) |

- **Taxa de Cache de Borda (Hit Ratio):** Com o Cloudflare Edge Cache (`caches.default`), mais de **90%** das requisições a páginas populares e dashboards são servidas em < 15ms sem consumir nenhuma linha da D1.
- **Custo do Plano Workers Paid da Cloudflare:** Caso o projeto ultrapasse 250.000 pageviews/dia, o plano Workers Paid custa apenas **$5 USD/mês** e inclui **25.000.000.000 (25 bilhões) de leituras por mês** (~833 milhões de leituras por dia), suportando volumes massivos de tráfego global.

### 2.15. Preparação para a Fase 3 e Fase 4 (Ingestão em Larga Escala)
- **Status dos Lotes Gerados:** 83 arquivos SQL autônomos prontos em `.scratch/` totalizando ~51.085 livros catalogados de fontes abertas (DOAB, Gutenberg, Internet Archive, Europeana, African Storybook).
- **Proteção da Quota de Escrita da D1 (100.000 rows written/dia no Free Tier):**
  - Scripts de importação em lote (`scripts/fase3_orquestrador_acervo.mjs`) operam com lotes controlados de até 5.000 obras por lote.
  - Ingestões diárias devem respeitar o teto de 80.000 inserções por dia para manter 20% de margem de segurança na D1.

### 2.16. Resolução da Exibição dos 100 Livros Mais Lidos do Mundo (`world-top100` e `world-hist`)
- **Problema Reportado pelo Usuário:** Ao clicar na pílula *"🌟 Os 100 Mais Lidos do Mundo"* no catálogo frontend, a interface retornava *"Nenhum livro encontrado para os filtros selecionados."* (conforme imagem enviada pelo usuário).
- **Causa Raiz Identificada:**
  - O botão no frontend enviava `categoria_id="🌟 Mais Lidos do Mundo"`.
  - No banco de dados (`categorias`), não existia uma categoria com o nome literal `"🌟 Mais Lidos do Mundo"` (as obras pertencem a categorias temáticas como *Romance & Crônicas* e *Apoio Pedagógico & Filosofia*, e são identificadas por `fonte_id_externo LIKE 'world-%'`: 100 livros de ranking comercial `world-top100-1` a `world-top100-100` e 5 obras de circulação universal histórica `world-hist-1` a `world-hist-5`).
  - Tanto no Express (`src/controllers/livrosController.js`) quanto no Cloudflare Worker (`workers/src/index.ts`), categorias não encontradas na tabela geravam `1=0`, resultando em 0 obras encontradas.
- **Decisão e Resolução de Engenharia:**
  1. **Detecção e Mapeamento de Coleção Especial (`isTop100`):**
     - No backend Express (`livrosController.js`) e no Cloudflare Worker (`workers/src/index.ts`), requisições com `categoria_id` contendo `"Mais Lidos"`, `"🌟 Mais Lidos do Mundo"`, `"top100"`, ou com o parâmetro `colecao=top100`, ativam a filtragem direta pela coleção:
       ```sql
       (l.fonte_id_externo LIKE 'world-%')
       ```
  2. **Ordenação pelo Ranking Oficial Histórico:**
     - Ao filtrar pelos Mais Lidos do Mundo, a cláusula `ORDER BY` prioriza a ordem exata da lista histórica e do ranking comercial de `OS-100-LIVROS-MAIS-LIDOS-DO-MUNDO.md`:
       ```sql
       CASE 
         WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN 0 
         WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN CAST(SUBSTR(l.fonte_id_externo, 14) AS INTEGER) 
         ELSE 9999 
       END ASC, l.leituras DESC, l.titulo ASC
       ```
     - As obras aparecem na ordem consagrada: #1 *Um Conto de Duas Cidades*, #2 *O Pequeno Príncipe*, #3 *O Senhor dos Anéis*, #4 *O Alquimista*, #5 *Harry Potter e a Pedra Filosofal*, até #100 *Kokoro*.
  3. **Inclusão de `fonte_id_externo` nas Consultas e Badges Visuais:**
     - A coluna `l.fonte_id_externo` foi adicionada ao `SELECT` paginado em ambos os backends.
     - No frontend (`public/js/app.js`), cada cartão da coleção exibe badge dourado dedicado: `🌟 #X Mais Lido do Mundo` ou `🌟 Clássico Universal`.
  4. **Internacionalização em 7 Idiomas:**
     - Adicionada a chave `catTop100` em `pt`, `pt-br`, `en`, `es`, `fr`, `de`, `zh`, garantindo tradução perfeita da pílula.
  5. **Cobertura de Testes Automatizados TDD:**
     - `test/api.test.js`: Teste 33 validando retorno das 105 obras, ordenação pelo ranking, busca interna e filtros combinados por idioma.
     - `test/worker.test.js`: Cenário 10 com 2 testes validando o comportamento na Cloudflare D1.
     - Suíte completa: 173/173 testes passando (100% verde).

### 2.17. Implementação do PWA (Progressive Web App) e Suporte Offline para Estudantes
- **Decisão:** Tornar o Lino Livre uma aplicação web progressiva (PWA) instalável em dispositivos móveis (Android, iOS, Tablets) e desktops, com funcionamento resiliente sob conectividade instável ou nula nos PALOP e no Brasil.
- **Estrutura Implementada:**
  1. **Web App Manifest (`public/manifest.webmanifest` & `manifest.json`):**
     - Compatível com a especificação W3C PWA: `id: "/"`, `name: "Lino Livre — Plataforma Aberta de Conhecimento"`, `short_name: "Lino Livre"`, `theme_color: "#10b981"`, `background_color: "#0f172a"`, `display: "standalone"`.
     - Ícones de alta resolução gerados (`icon-192.png`, `icon-512.png`, `icon-maskable-192.png`, `icon-maskable-512.png`, `apple-touch-icon.png` e SVG vetorial).
     - Atalhos rápidos (`shortcuts`) para Catálogo de Livros, Cursos Gratuitos, Cartaz Escolar e Dicas de Estudo.
  2. **Service Worker (`public/sw.js`):**
     - Pré-cache do App Shell (`/`, `/index.html`, `/offline.html`, `/comunidade.html`, `/creditos.html`, `/legal.html`, `/termos.html`, CSS, JS e fontes WOFF2 locais).
     - Estratégia **Network-First** com fallback gracioso para cache e tela dedicada `/offline.html`.
     - Estratégia **Stale-While-Revalidate** para APIs públicas de leitura (`/api/dashboard`, `/api/categorias`, `/api/fontes`, `/api/dicas`).
     - Estratégia **Cache-First** para fontes tipográficas locais e imagens de capas.
  3. **Página Dedicada de Fallback Offline (`public/offline.html`):**
     - Interface amigável informando a falta de internet com detecção de reconexão (`window.addEventListener('online')`), botão para tentar reconectar e acesso rápido a conteúdos em cache.
  4. **Frontend & Experiência do Usuário (`public/js/app.js`):**
     - Registro do Service Worker no ciclo de vida da página.
     - Captura do evento `beforeinstallprompt` com exibição de botão nativo de instalação (`#btn-instalar-app`).
     - Detecção de rede com notificação dinâmica via `#banner-offline`.
     - Tipografia `Lora` auto-hospedada em WOFF2 (`font-display: optional`), prevenindo Layout Shifts (CLS) e eliminando dependência de CDN externa no modo offline.
  5. **Configuração de Cabeçalhos e Rotas nos Servidores:**
     - Express e Cloudflare Workers configurados para servir `/sw.js` com `Service-Worker-Allowed: /` e `Cache-Control: no-cache, no-store, must-revalidate`.
     - Manifest servido com `Content-Type: application/manifest+json; charset=utf-8`.
  6. **Testes Automatizados PWA (`test/pwa.test.js`):**
     - Suíte dedicada com 8 testes validando integridade do manifest, cabeçalhos do Service Worker, escopo, arquivos físicos de ícones e chaves de i18n em 7 idiomas.

### 2.18. Otimização de Performance, Acessibilidade (a11y) e Mitigação de Cache Stampede
- **Mitigação de Thundering Herd / Cache Stampede na D1:**
  - Em `workers/src/index.ts`, a variável de controle `dashboardInFlight` garante que múltiplos cold starts ou requisições simultâneas em cache miss aguardem a mesma promessa em andamento em vez de disparar leituras simultâneas na Cloudflare D1.
- **Acessibilidade Web (WCAG 2.1 AA):**
  - Adição de `aria-label` descritivos e unívocos em todos os links e botões de leitura/download por formato (PDF, EPUB, TXT, HTML) contendo o título da obra.
  - Indicadores semânticos `aria-valuenow` e `aria-valuetext` na barra de progresso da meta dos 10 milhões de livros.
  - Ajuste de contraste tipográfico no rodapé (`#334155` e `#475569`) sobre fundos claros, eliminando alertas de contraste insuficiente.
- **Carregamento Otimizado de Fontes Internacionais:**
  - Carregamento assíncrono das fontes Han chinesas (*Noto Sans SC* / *Noto Serif SC*) estritamente sob demanda ao selecionar o idioma chinês (`zh`), economizando ~50 KB e dezenas de conexões em idiomas ocidentais.
  - Reserva de layout (`.btn-agendado`) no cabeçalho para botões de comunidade/canal, eliminando Cumulative Layout Shift (CLS = 0).

### 2.19. Diagnóstico Profundo e Eliminação dos Avisos de Consumo da Cloudflare D1
- **Investigação e Métricas Reais do Incidente:**
  - `wrangler d1 info lino-livre-db`: Base de dados com **126 MB**, **104.848 livros** e **19 tabelas**.
  - O relatório apontou **1.180.515 linhas lidas em 24h (23.61% da cota diária)** e **75.995 linhas gravadas (76.00% da cota de escrita)**.
  - A Cloudflare envia e-mails de alerta automáticos ao cruzar os limites de 20% (1 milhão de leituras) e 75% de escritas diárias.
- **Causas Raízes Identificadas:**
  1. **Disparo Automático do Cron Noturno (`10 0 * * *`):** A função `recomputarEstatisticas` executava 8 varreduras completas (*Full Table Scans*) de 104.848 linhas todas as noites (838.784 leituras) e apagava/regravava mais de 70.000 linhas em `autor_totais` (75.995 escritas), mesmo sem haver nenhuma alteração de obras naquele dia.
  2. **Brecha de Cache Bypass com `Cache-Control: no-cache`:** Clientes anônimos ou bots que enviassem cabeçalhos `no-cache` forçavam leituras desnecessárias na D1 ignorando o cache em memória.
  3. **Varredura por Paginação Profunda (*Deep Offset Scanning*):** Scrapers e crawlers que percorriam páginas profundas sequenciais (`?pagina=100`, `pagina=500`, `pagina=4000`) forçavam o SQLite a percorrer e descartar milhares de linhas do índice B-Tree a cada requisição.
  4. **Rastreadores Agressivos em APIs:** Bots comerciais (Bytespider, Ahrefs, PetalBot, SemrushBot) ignorando `robots.txt` e requisitando repetidamente rotas `/api/*`.
- **Soluções de Engenharia Implementadas e Auditadas:**
  1. **Recálculo Inteligente e Incremental:** O cron diário verifica os marcadores `versao_mutacoes` e `versao_calculada`. Se não houve mutações no acervo, a rotina encerra imediatamente (4 leituras e 0 escritas, contra 838k leituras e 76k escritas anteriores).
  2. **Rastreamento Atômico de Mutações (`registrarMutacaoAcervo`):** Somente mutações reais (`POST /api/livros`, `DELETE /api/livros`, importações de lote) incrementam a versão para recomputação programada ou via `POST /api/admin/recalcular-estatisticas`.
  3. **Guardrail de Paginação Profunda:** Navegação sequencial sem filtros limitada às primeiras 50 páginas (1.200 livros). Páginas superiores a 50 sem filtros retornam aviso educativo e payload vazio com cache de borda de 24h, sem tocar na D1.
  4. **WAF Anti-Scraper de APIs:** Bloqueio imediato no WAF de borda (HTTP 403) para rastreadores agressivos conhecidos em rotas `/api/*`.
  5. **Prevenção de Thundering Herd / Cache Stampede:** Variável `dashboardInFlight` unifica requisições concorrentes em uma única promessa.
  6. **Cabeçalhos CDN Globais (`s-maxage=3600`):** Injeção de `s-maxage=3600` e `stale-while-revalidate=86400` em rotas públicas, permitindo cache nos POPs globais da Cloudflare.
  7. **Ferramenta de Diagnóstico Automatizada:** Script `scripts/diagnostico_consumo_trafego.js` e comando `npm run diagnostico`.
  8. **Ampliação da Suíte de Testes:** Criação de `test/d1_quota_consumption.test.js`, `test/supabase_consumption_traffic.test.js`, `test/traffic_and_monitoring.test.js` e `test/capas_proxy.test.js`, elevando a cobertura para **196 testes automatizados em 37 suítes (100% passando)**.

### 2.20. Resolução dos Alertas do Supabase Database Linter & Plano de Otimização do Site
- **Alertas de Segurança do Supabase Database Linter Identificados e Resolvidos:**
  1. *Extension in Public (`public.pg_trgm`, Lint 0014):* A extensão `pg_trgm` foi detectada no schema `public`. A recomendação oficial é alocar extensões no schema `extensions`:
     ```sql
     CREATE SCHEMA IF NOT EXISTS extensions;
     ALTER EXTENSION pg_trgm SET SCHEMA extensions;
     ```
  2. *SECURITY DEFINER Function Executable by Anon & Authenticated (`public.rls_auto_enable()`, Lints 0028 e 0029):* A função de trigger interna possuía privilégio de execução exposto para as roles `anon` e `authenticated` via PostgREST RPC (`/rest/v1/rpc/rls_auto_enable`). A resolução consiste em revogar o privilégio público ou alternar para `SECURITY INVOKER`:
     ```sql
     REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM public, anon, authenticated;
     ```
- **Plano Mestre de Otimização Integral do Site (Core Web Vitals & CDN):**
  - Documentado detalhadamente no artefato de engenharia [`plano_otimizacao_site.md`](file:///Users/mendes/.gemini/antigravity/brain/3b703f86-86d1-4200-96a5-a49850395038/plano_otimizacao_site.md).
  - **Zero CLS (Cumulative Layout Shift):** Adição de dimensões explícitas `width="16" height="16"` e `loading="lazy" decoding="async"` em 100% dos botões de pílulas (`.pill-logo`), `width="18" height="18"` nos cartões de cursos e trilhas (`.course-platform-logo`), e `width="400" height="190"` nos programas de podcast (`.podcast-cover-img`).
  - **Deduplicação de CSS Crítico:** Remoção de regras CSS redundantes repetidas no `<head>` de [`public/index.html`](file:///Users/mendes/Desktop/I%20am%20Abc/public/index.html) (`.pills-container`, `.pill`, `.pagination-container`, `.btn`), reduzindo o tempo de parsing de folha de estilo.
  - **Cache Imutável de Fontes e Assets:** Regra `/fonts/*` com `Cache-Control: public, max-age=31536000, immutable` consolidada em [`public/_headers`](file:///Users/mendes/Desktop/I%20am%20Abc/public/_headers).
  - **Suíte Completa:** 196 testes automatizados em 37 arquivos de teste executando com 100% de sucesso.

### 2.21. Auditoria Lighthouse: Acessibilidade, Segurança, Imagens e SEO (100% Crawlable Links)
- **Contexto & Relatório Lighthouse:** A aplicação foi submetida a auditoria completa de qualidade web (Lighthouse), registando notas de 93 em Acessibilidade e 92 em SEO devido a links não rastreáveis (`crawlable-anchors`).
- **Resoluções Implementadas e Auditadas:**
  1. **Auditoria de Imagens (625 Ativos):**
     - Verificação automatizada dos 625 ficheiros em `public/img` e `public/capas`.
     - Correção de cabeçalhos binários corrompidos em 5 imagens: `dio.png`, `alura.png`, `mit.png`, `bradesco.png`, `africa_pt_sangue_negro.jpg`.
     - Criação do logótipo vetorial SVG em falta `public/img/logos/github.svg`.
     - Substituição de URLs instáveis de miniaturas da Wikimedia Commons por 10 capas vetoriais SVG locais e autónomas em `public/capas/palop_*.svg` para obras clássicas africanas (Agostinho Neto, Pepetela, Mia Couto, Paulina Chiziane, Baltasar Lopes, etc.).
  2. **Acessibilidade Web (Lighthouse 93 → 100):**
     - **ARIA Progressbar:** Adicionado `aria-label="Progresso da meta coletiva de 10 milhões de livros"` e atributo dinâmico `aria-valuetext="X de 10.000.000 livros livres indexados (Y% da meta)"` ao contentor `#placar-progressbar-container`.
     - **Contraste de Cor (WCAG AAA/AA):** Textos secundários do rodapé e avisos atualizados de `#94a3b8` para `#334155` e `#475569`, cumprindo com folga o rácio de contraste 4.5:1.
     - **Links com o mesmo destino (`identical-links-same-purpose`):** Injeção de `aria-label` com o nome específico da obra em todos os links e botões de leitura/download (ex.: `aria-label="Ler Dom Casmurro em formato PDF"`).
  3. **Práticas Recomendadas e Isolamento de Origem (Lighthouse 100):**
     - Cabeçalhos defensivos globais em `public/_headers`: `Content-Security-Policy`, `Strict-Transport-Security`, `Cross-Origin-Opener-Policy: same-origin`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
     - Tag `<meta http-equiv="Content-Security-Policy">` em todas as páginas HTML estáticas.
     - Inicialização de política `Trusted Types` no frontend (`public/js/app.js`).
  4. **SEO & Rastreio por Motores de Busca (Lighthouse 92 → 100):**
     - **Eliminação de `href="javascript:void(0)"` e `href="#"`:** Substituição de 100% dos pseudo-protocolos nos menus e rodapé por URLs válidos e crawlable targets.
     - **Abas do Acervo:** Links com `href="#aba-livros"`, `href="#aba-cursos"`, `href="#aba-roadmaps"`, `href="#aba-podcasts"`, `href="#aba-dashboard"`.
     - **Links Jurídicos:** Apontam para URLs canónicos estáticos (`href="/legal.html#secao-missao"`, `href="/legal.html#secao-isencao"`, `href="/legal.html#secao-direitos"`, `href="/legal.html#secao-privacidade"`).
     - **Progressive Enhancement:** Motores de busca (Googlebot) rastreiam e indexam páginas reais; cliques no navegador ativam modais dinâmicos instantâneos sem recarregar a página.
     - **Suporte a Hash Routes:** A função `verificarHash()` em `public/js/app.js` abre automaticamente a aba ou modal correspondente quando o utilizador acede via URL directo com fragmento de âncora.
  5. **Cobertura de Testes Atualizada:** 193 testes automatizados passando em 35 suítes (`npm test`).

### 2.22. Seção de Destaques: Livros Mais Populares e Muito Procurados e Ordenação de Abertura do Acervo
- **Diretriz do Usuário:** *"Altere os destaque do site, quando alguém abri o site, quero ver os livros mais populares e muito procurados"*
- **Diagnóstico da Experiência de Abertura:**
  1. Anteriormente, na abertura do site (`/`), o catálogo geral (`GET /api/livros`) executava `ORDER BY l.leituras DESC, l.titulo ASC`. Como as contagens de leituras partem de zero no banco limpo, a ordenação caía estritamente para a ordem alfabética de títulos, exibindo livros técnicos ou manuais acadêmicos menos conhecidos (como *"A Byte of Python — Einführung in Python"*) em vez das grandes obras da literatura mundial e lusófona.
  2. A área de destaque sob o placar consistia em um banner de texto puramente institucional da Coleção de África, sem cartões interativos de livros em destaque.
- **Resoluções e Engenharia Implementadas:**
  1. **Seção de Destaques Interativa (`#secao-destaques`):**
     - Substituição do banner estático por um mostruário moderno e responsivo com cartões de livros em destaque contendo capas em alta resolução (`capaProxyUrl`), títulos, autores, anos, tags de formato (PDF, EPUB, Web) e badges distintivos (`destaque_badge`, ex.: *"🔥 #1 Mais Lido da História"*, *"🔥 > 500M de Leitores"*, *"🌟 > 140M de Leitores"*, *"🏆 Obra-Prima da Lusofonia"*).
     - Botões de ação imediata: "📖 Ler Agora" (acesso direto/302 sem download de ficheiros pesados) e "ℹ Detalhes" (abre o modal com sinopse, licença e todos os formatos).
     - Pílulas de filtragem rápida de destaques: *"🌟 Mais Procurados do Mundo"*, *"📜 Clássicos Lusófonos"*, *"🌍 Tesouros de África"* e *"💻 Manuais de Tecnologia"*.
  2. **Endpoint Dedicado de Destaques (`GET /api/livros/destaques`):**
     - Implementado no Express ([`src/controllers/livrosController.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/controllers/livrosController.js), [`src/routes/api.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/routes/api.js)) e no Cloudflare Worker ([`workers/src/index.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/index.ts)).
     - Suporta parâmetro `?tipo=` (`todos`, `mundo`, `lusofonia`, `africa`, `tech`) e `?limit=`.
     - Responde com cabeçalhos de cache de borda (`Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400`), protegendo a D1 de leituras redundantes.
  3. **Ordenação Otimizada de Abertura no Catálogo Geral:**
     - Quando o utilizador abre o site sem pesquisa textual nem filtro temático, o catálogo prioriza:
       - Obras com leituras acumuladas (`l.leituras DESC`).
       - Clássicos mundiais e top bestsellers da história (`world-hist-*`, `world-top100-*`).
       - Obras-primas da literatura brasileira e lusófona (*Dom Casmurro*, *Memórias Póstumas*, *Os Lusíadas*, *O Cortiço*, *Iracema*, *Mensagem*).
       - Obras monumentais de África.
     - Isso garante que a primeira página de qualquer visitante novo apresente de imediato os livros mais amados, populares e procurados de todos os tempos.
  4. **Ajuste em `mais_lidos` do Dashboard:**
     - O endpoint `/api/dashboard` adota a mesma lógica inteligente para a lista de mais lidos, eliminando a exibição de títulos técnicos aleatórios da ordenação alfabética quando as leituras são iguais a zero.
  5. **Internacionalização em 7 Idiomas:** Chaves `highlightsTitle`, `highlightsSubtitle`, `highlightsBadge`, `highlightsAll`, `highlightsClassics`, `highlightsAfrica`, `highlightsTech`, `highlightsViewAll` e `highlightsLoading` atualizadas em `pt`, `pt-br`, `en`, `es`, `fr`, `de` e `zh`.
  6. **Suíte de Testes:** Criação do Teste 34 em [`test/api.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/api.test.js) e do Cenário 11 em [`test/worker.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/worker.test.js), elevando a cobertura geral para **196 testes automatizados (100% passando)**.

### 2.23. Otimização para Navegação com Agência de IA (WebMCP, ARD, llms.txt e Zero CLS)
- **Contexto da Auditoria Lighthouse (Agentic Web / Navegação com Agência):**
  A auditoria apontou a necessidade de conformidade com os novos padrões de agentes de IA (`https://goo.gle/lighthouse-agentic-web`) e registou **Cumulative Layout Shift (CLS) = 0.41**, além de auditorias não aplicáveis sobre `WebMCP`, `llms.txt` e `ai-catalog.json`.
- **Resoluções de Engenharia Implementadas:**
  1. **Eliminação do Cumulative Layout Shift (CLS 0.41 → 0.00):**
     - **Reserva de Espaço Estrutural:** Adicionado `min-height: 480px` na classe `.destaques-grid`, `min-height: 600px` em `.books-grid` e `min-height: 320px` em `.whatsapp-cards`.
     - **Skeleton Cards Nativos com Shimmer:** O HTML inicial de `#grade-destaques` e `#grade-livros` já renderiza 4 cartões esqueletais com animação de shimmer e a exata proporção `aspect-ratio: 2/2.85`. Quando o JSON da API chega e monta os livros, as dimensões verticais já estão reservadas, eliminando o deslocamento do conteúdo.
     - **Pre-renderização Estática de Componentes:** Remoção da classe `hidden` inicial dos botões `#btn-goal-comunidade`, da secção `#secao-whatsapp` e dos cards `#card-comunidade` e `#card-canal`, que provocavam saltos no layout ao serem ativados assincronamente via JavaScript.
  2. **Anotações Declarativas WebMCP em Formulários:**
     - `<form id="form-busca-livros">` com `toolname="buscar_livros"`, `tooldescription="..."` e `toolparamdescription="..."` no `<input type="search" name="q">`.
     - `<form id="form-busca-cursos">` com `toolname="buscar_cursos"`, `tooldescription="..."` e `toolparamdescription="..."` no `<input type="search" name="curso">`.
  3. **Registro Imperativo de Ferramentas WebMCP (`public/js/app.js`):**
     - Implementação de `registrarFerramentasWebMCP()` invocando `navigator.modelContext?.registerTool` com esquemas JSON estruturados e mapeamento de intenção para agentes de navegação autónomos (ex: Chrome Agentic Browsing, Gemini, Claude).
  4. **Padronização `llms.txt` e `llms-full.txt` (llmstxt.org):**
     - Criação de `public/llms.txt` com cabeçalho H1 obrigatório, resumo em blockquote, manifesto de intermediação legal e hiperligações para todas as rotas abertas.
     - Criação de `public/llms-full.txt` com documentação técnica exaustiva de parâmetros de busca e modelos de dados.
     - Disponibilizado com `Content-Type: text/markdown; charset=utf-8` no Express e no Cloudflare Worker.
  5. **Manifesto `ai-catalog.json` (Agentic Resource Discovery - ARD):**
     - Implementado em `public/.well-known/ai-catalog.json` e `public/ai-catalog.json` com especificação ARD 1.0.0, catalogando as ferramentas `buscar_livros`, `buscar_cursos`, `busca_federada` e `dashboard_metricas` com `representativeQueries`.
     - Configurado `dotfiles: 'allow'` no Express e rota dedicada no Cloudflare Worker.
  6. **Suíte de Testes:** Criação da suíte `test/agentic_web.test.js` (11 testes) e do Cenário 13 em `test/worker.test.js` (3 testes), elevando a cobertura para **211 testes automatizados em 44 suítes (100% passando)**.

### 2.24. Arquitetura 100% Free ($0.00 Perpétuo) e os 4 Pilares de Custo Zero
- **Diretriz do Usuário:** *"o projecto dever ser 100% free, pesquise altenativas e questões arquitecturais e de engenharia para melhorar o projecto"*
- **Princípio Inegociável:** Orçamento de infraestrutura estritamente **$0.00/mês**. Nenhuma funcionalidade pode depender de planos pagos, cartões de crédito ou faturamentos por uso.
- **Os 4 Pilares de Engenharia de Custo Zero:**
  1. **Camada 0 — Client-Side Edge (Service Worker PWA):** O Service Worker intercepta 100% das leituras públicas da API com estratégia `Stale-While-Revalidate`. Para o usuário recorrente, o app responde em 0ms com zero requisições ao servidor e zero leituras na base de dados.
  2. **Camada 1 — Cloudflare CDN & Cache API:** Requisições e largura de banda ilimitadas a custo zero (`caches.default`). Cache com `s-maxage=3600` e `stale-while-revalidate=86400` absorve mais de 92% do tráfego nos 330 datacenters globais.
  3. **Camada 2 — Dual-Engine com Cotas Divididas (D1 + Supabase):** Acesso concorrente e balanceado entre Cloudflare D1 (5M reads/dia grátis) e Supabase Postgres (500 MB grátis / 50k MAU).
  4. **Camada 3 — Federação Global RRF para a Cauda Longa (Zero Armazenamento):** Obras mundiais indexadas em tempo real via Open Library, Internet Archive, DOAB e Europeana.

### 2.25. Balanceamento de Carga de Borda e Padrão Circuit Breaker (`workers/src/loadBalancer.ts`)
- **Implementação:** Classe `EdgeLoadBalancer` aplicando o padrão formal de Circuit Breaker (Martin Fowler):
  - **CLOSED (Normal):** Todas as consultas trafegam normalmente com balanceamento ponderado (60% D1 / 40% Supabase no modo `weighted_hybrid` ou `auto`).
  - **OPEN (Protegido):** Se um backend apresentar 3 falhas consecutivas ou disparar erro de cota (ex: D1 code `7500` ou HTTP `429`), o circuito abre instantaneamente, desviando 100% do tráfego para o backend parceiro durante um cooldown de 60 segundos.
  - **HALF_OPEN (Sonda):** Após o cooldown, uma requisição canário é autorizada. Se bem-sucedida, o circuito retorna a `CLOSED`; se falhar, reabre por mais um ciclo.
- **Rota de Telemetria:** `GET /api/loadbalancer/status` expõe métricas em tempo real de latência, número de requisições roteadas, estado de cada circuito e histórico de falhas.

### 2.26. Diagnóstico do Anti-Pattern do LIKE Infixo vs Índices B-Tree, FTS5 e GIN Trigramas
- **Diretriz do Usuário:** *"uso excessivo de like, pontos fundamentais na enganharia de software, não seja razo, seja especifico e especialista"*
- **Diagnóstico Teórico do Anti-Pattern:**
  - Em um índice B-Tree, as chaves são ordenadas lexicograficamente da esquerda para a direita.
  - Uma cláusula de busca por prefixo `WHERE coluna LIKE 'termo%'` permite ao motor realizar busca binária e range scan com complexidade $O(\log N + K)$, lendo apenas as páginas que contêm as chaves correspondentes.
  - Porém, o uso de curinga à esquerda `WHERE coluna LIKE '%termo%'` (LIKE infixo) destrói completamente a capacidade de navegação da árvore B-Tree, pois o termo pode estar em qualquer posição de qualquer chave. O otimizador de consultas é forçado a um **Full Table Scan (FTS)** sequencial de complexidade $O(N \times M)$ strings comparadas, lendo todas as páginas do disco para a memória. Em tabelas com 104k livros ou 38k autores, poucas consultas dessa natureza esgotam a cota diária de 5 milhões de linhas da D1.
- **Estratégias de Remediação Aplicadas:**
  1. **Prefix-First Strategy:** Quando a busca não contém curinga explícito, prioriza-se `LIKE 'termo%'` para navegação B-Tree instantânea.
  2. **Inverted Index (FTS5 BM25):** Para busca textual em títulos e autores, o Lino Livre utiliza tabelas virtuais FTS5 com tokenização por trigramas ou unicode61, consultando listas invertidas em $O(1)$ sem varrer a tabela física `livros`.
  3. **GIN Trigram Indexes (`pg_trgm`) no Supabase:** Índices GIN com classes de operador `gin_trgm_ops` decompõem palavras em trigramas de 3 caracteres, permitindo que consultas `ILIKE '%termo%'` no PostgreSQL utilizem índices em vez de scans sequenciais.
  4. **Subconsultas Delimitadas (Bounded Counts):** Em contagens com múltiplos filtros onde índices compostos não cobrem a combinação exata, restringe-se a leitura a `LIMIT 500` (`SELECT COUNT(*) FROM (SELECT 1 FROM ... LIMIT 500)`), garantindo custo computacional máximo previsível e bounded.

### 2.27. Sincronização Concluída de Autores no Supabase (37.919 Autores)
- **Status Auditado:**
  - `autores`: **37.919 registros** sincronizados integralmente (100% dos autores da D1 agora no Supabase).
  - `fontes`: **34 registros**.
  - `categorias`: **20 registros**.
  - `cursos`: **8.541 registros**.
  - `livros` e `links_livros`: Em processo de migração por lotes keyset com checkpoint em `.scratch/supabase-migracao.json`.
- **Ajuste Técnico no Script de Migração:** O script [`scripts/migrar_d1_para_supabase.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/migrar_d1_para_supabase.js) foi aprimorado para verificar a existência de tabelas sem coluna `id` primária (`estatisticas` via coluna `chave`, `contadores` via `chave` e `autor_totais` via `autor_id`), eliminando erros HTTP 400 em `node scripts/migrar_d1_para_supabase.js --status`.

### 2.28. Arquitetura Columnar Parquet + DuckDB WASM para a Meta dos 10 Milhões de Livros
- **O Desafio dos 10 Milhões:** Armazenar 10.000.000 de metadados de livros em bancos relacionais exigiria ~12 GB de armazenamento, estourando as cotas gratuitas da D1 (5 GB) e Supabase (500 MB).
- **A Solução de Engenharia a Custo Zero:**
  - Particionamento dos metadados históricos em arquivos colunares **Apache Parquet compactados com Zstandard (ZSTD)** (~500 MB no total para 10M de obras).
  - Hospedagem gratuita dos arquivos Parquet em **Cloudflare R2** (10 GB grátis, zero taxa de egress) ou **GitHub Releases**.
  - Execução de consultas analíticas e buscas vetoriais no próprio navegador do usuário através de **DuckDB WASM**.
  - O motor DuckDB WASM executa requisições HTTP Range (`Range: bytes=start-end`), baixando apenas as páginas de colunas específicas solicitadas pelo usuário (título, autor, link 302), consumindo **ZERO computação do servidor** e operando com custo **$0.00 perpétuo**.

### 2.29. Conclusão do Marco 1 (1.000 Obras) e Ingestão de 1.000 Monografias Acadêmicas do DOAB (2.000 Obras Consolidadas)
- **Marco 1 Oficialmente Atingido:**
  - Inclusão dos clássicos lusófonos em Domínio Público universal: *Os Maias* (Eça de Queirós, 1888, ID 998), *Memorial de Aires* (Machado de Assis, 1908, ID 999) e *A Ilustre Casa de Ramires* (Eça de Queirós, 1900, ID 1000) em [`src/database/textosObras.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/database/textosObras.js).
  - Capas vetoriais SVG de alta fidelidade geradas em [`public/capas/`](file:///Users/mendes/Desktop/I%20am%20Abc/public/capas/).
  - Conclusão exata das 1.000 obras fundacionais.
- **Ingestão Acadêmica do DOAB (Fases 3 e 4 - Rumo ao Marco 2):**
  - Curadoria e catalogação de **1.000 monografias científicas peer-reviewed** do Directory of Open Access Books ([`src/database/doabSeedData.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/database/doabSeedData.js)) publicadas por editoras universitárias de prestígio internacional (Imprensa da Universidade de Coimbra, SciELO Books, Fiocruz, UNAM, UCL Press, TU Delft, Oxford e Cambridge Open).
  - Distribuição linguística: 222 obras em Português, 415 em Espanhol e 363 em Inglês/Francês.
  - Conformidade estrita com a Regra 4 de Domínio Público: `conteudo_texto = NULL` para todas as obras contemporâneas; acesso integral provido unicamente por redirecionamento HTTP 302 seguro para as fontes abertas oficiais.
  - Criação de capas acadêmicas vetoriais em SVG ([`public/capas/academic/academic_*.svg`](file:///Users/mendes/Desktop/I%20am%20Abc/public/capas/academic/)).
- **Sincronização do Hodômetro e Métricas Reais:**
  - Acervo local consolidado: **2.000 livros abertos**, **8.568 cursos gratuitos**, **1.353 autores**, **36 fontes aprovadas** e **20 categorias**.
  - Hodômetro `#placar-total-livros` atualizado para **2.000** (0.0200% da grande meta de 10.000.000).
  - Marco 1 (1.000) comemorado com a classe `reached`; Marco 2 (10.000) promovido a `active` com tag "Próximo marco" e meta imediata definida para 10.000.
  - Faltam exatamente 8.000 obras para atingir o Marco 2 e 9.998.000 para a grande meta global.
  - Suíte automatizada mantida em **100% verde** (341 testes em 66 suítes) e TypeScript sem erros.

---

### 2.30. Identidade de Marca: LinoDigital (Marca-Mãe) e Lino Livre (Produto)
- **Hierarquia oficial e inviolável:**
  - **LinoDigital** é a marca institucional de tecnologia e conhecimento livre, responsável pela plataforma, infraestrutura e identidade visual.
  - **Lino Livre** é o produto/biblioteca digital aberta da LinoDigital, dedicado a livros e cursos gratuitos.
- **Regra de redação:** nunca eliminar o nome do produto em contextos legais, de licenças ou de intermediação. Usar a forma composta **“LinoDigital · Lino Livre”** em títulos, rodapés e metadados, ou **“Lino Livre, da LinoDigital”** em textos corridos.
- **Ativos oficiais da marca:**
  - `public/img/brand/linodigital-mark.svg` — símbolo compacto (livro aberto + estrela) para cabeçalhos.
  - `public/img/brand/linodigital-logo.svg` — assinatura horizontal para documentação e materiais.
  - `public/img/brand/linodigital-og.svg` + `linodigital-og.jpg` — cartão Open Graph/Twitter 1200×630 com a hierarquia de marca.
  - `public/img/icons/icon.svg` + `icon-192.png`, `icon-512.png`, `icon-maskable-*.png` e `apple-touch-icon.png` — ícones PWA com a assinatura “LINODIGITAL / LINO LIVRE”.
- **Superfícies obrigatórias de aplicação:** cabeçalho e rodapé de todas as páginas, `manifest.webmanifest`, `<title>`/Open Graph/Twitter, JSON-LD (`Organization` e `WebSite`), `llms.txt`, `llms-full.txt`, `ai-catalog.json`, locales i18n, README e fallbacks do Worker.
- **Teste de regressão:** `test/brand_linodigital.test.js` valida a presença da marca-mãe, do produto, dos ativos e da hierarquia nos metadados.

### 2.31. Auditoria de Links Externos: Remoção de Downloads Restritos do Internet Archive (HTTP 401/403)
- **Problema Relatado:** Ao abrir a obra 475 (*O Alquimista*) e clicar no botão PDF, o utilizador recebia:
  ```text
  401 Authorization Required
  nginx
  https://dn790009.ca.archive.org/0/items/alchemik0000coel/alchemik0000coel.pdf
  ```
- **Causa Raiz:** O link era um item de empréstimo digital controlado (*controlled digital lending*) do Internet Archive. Os URLs `archive.org/download/<id>/<ficheiro>.pdf` devolvem HTTP 401/403 (nginx) para utilizadores não autenticados, mesmo quando a página `archive.org/details/<id>` responde 200 e oferece empréstimo legal.
- **Auditoria Realizada:** 129 links `archive.org/download` foram verificados contra a API de metadados do Internet Archive. Desses, 34 tinham `access-restricted-item: true`: 33 eram obras com licença `outro` do ranking `world-top100-*` e 1 era *O Pequeno Príncipe* (indevidamente marcado como domínio público).
- **Resolução Implementada:**
  1. [`src/database/worldClassicsSeedData.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/database/worldClassicsSeedData.js): as 35 obras deixaram de expor downloads diretos do Internet Archive e passaram a apontar apenas para o catálogo público da Open Library (metadados, empréstimo legal ou compra). *O Pequeno Príncipe* e *O Diário de Anne Frank* passaram de `dominio-publico` para `outro`, porque os itens do Internet Archive são restritos e a situação de direitos varia por jurisdição.
  2. [`migrations/0006_links_externos_seguros.sql`](file:///Users/mendes/Desktop/I%20am%20Abc/migrations/0006_links_externos_seguros.sql): remove os downloads restritos na D1 de produção e substitui as páginas de detalhe do Internet Archive por URLs codificados da Open Library. A migração é idempotente.
  3. **Testes de Regressão:** [`test/world_classics_links.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/world_classics_links.test.js) (6 testes) e o cenário 33.6 em [`test/api.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/api.test.js), garantindo que nenhuma obra comercial expõe PDF/EPUB direto e que *O Alquimista* responde apenas com o link da Open Library.
- **Regra Inviolável para Agentes:**
  - **Nunca** publicar URLs `archive.org/download/...` para obras com licença `outro` ou para itens com `access-restricted-item: true`.
  - Obras com direitos comerciais devem apontar para páginas de catálogo, empréstimo legal ou compra (Open Library, editora, biblioteca nacional).
  - Downloads diretos só são permitidos quando a licença aberta for comprovada e o URL responder HTTP 200/206 sem autenticação.
  - Qualquer novo importador deve validar `access-restricted-item` antes de catalogar links do Internet Archive.

### 2.32. Auditoria de Conteúdo (Imagens, Títulos, Descrições) e Suíte TDD de Ler/Baixar PDF
- **Diretriz do Usuário:** *"Verifique todas as imagens e titulos de livros e descrições. Automatize teste unitário de ler e baixar pdf"*
- **Auditoria One-for-One de Todas as Capas (2.000 livros):**
  - Reexecução do verificador oficial [`scripts/verify_book_covers.js`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/verify_book_covers.js) → **2000/2000 capas OK (100,0%)**: 1.374 locais (arquivo presente, > 0 bytes, assinatura PNG/JPG/SVG válida) e 626 externas (HTTP 200/206 com content-type de imagem).
  - **Descoberta crítica:** a capa externa do livro #997 (*Tese do Método Fluência*, `static.wixstatic.com`) respondia 200 direto, mas **quebrava em produção** porque o proxy `/api/capas` (Express e Worker) rejeitava o host com 403, exibindo o fallback `dom_casmurro.jpg` no lugar da capa correta.
  - **Correção:** `wixstatic.com` adicionado à `HOSTS_CAPAS_PERMITIDOS` em [`src/controllers/capasController.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/controllers/capasController.js) e [`workers/src/index.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/index.ts), mantendo todos os filtros anti-SSRF e o limite de 5 MB.
- **Auditoria de Títulos e Descrições:**
  - 0 títulos vazios/placeholders, 0 sinopses vazias, 0 duplicatas (titulo + autor), 0 mojibake no seed atual (o aviso anterior sobre a obra 1143 era falso positivo — "MÃE" contém a letra legítima "Ã").
  - 2 sinopses de catálogo DOAB mantêm estilo "assuntos" ("Scientific criticism; marxism" e "Latin America; theory") — dados fiéis à fonte, candidatos a enriquecimento futuro (sem fabricação).
- **Descoberta de Política (TDD Red → Green):** um link de domínio pirata entregue por `/api/livros/:id/ler/:linkId` respondia **HTTP 500 interno** no Express (o Worker já respondia 400), e ainda incrementava o contador de leituras antes de rejeitar.
  - **Correção no Express e Worker ([`src/utils/urlValidator.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/utils/urlValidator.js), [`workers/src/utils/urlValidator.ts`](file:///Users/mendes/Desktop/I%20am%20Abc/workers/src/utils/urlValidator.ts), controllers/rotas `/ler`):** todos os erros de política/SSRF do validador passam a carregar `err.codigoHttp = 400`; o `/ler` valida o destino **antes** de contar a leitura e responde **400 com mensagem de política** (nunca 500 e nunca redireciona). Leituras bloqueadas não contaminam o contador.
- **Nova Suíte de Testes TDD:** [`test/ler_baixar_pdf.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/ler_baixar_pdf.test.js) — 22 testes em 3 grupos:
  1. **Leitura `/ler` (9):** 302 + Location https validada, incremento atômico exato de leituras, upgrade automático http→https, 404 anti-SQLi (IDs não numéricos), 404 para inexistentes, 404 para IDOR cross-resource, JSON de leitura web local, **400 político** para domínio pirata e verificação exata do link PDF.
  2. **Baixar PDF (5):** cartas do catálogo com badge PDF expõem link válido, amostra determinística de 20 PDFs com 302 https (sem SSRF/pirataria), zero esquemas perigosos, zero domínios da lista negra, zero destinos internos.
  3. **Integridade do acervo (8):** 100% das capas locais existem com assinatura de imagem válida, 100% das capas externas na allowlist do proxy (protege contra capas quebradas por host não autorizado), títulos/sinopses sem placeholders e mojibake, zero duplicatas, fluxo frontend sobre `/ler/` e paridade Express/Worker das correções.
  - Snapshot do acervo real é capturado antes das fixtures de teste para que as varreduras nunca sejam contaminadas (fixtures descartadas ao final do grupo 1).
- **Suíte completa mantida 100% verde: 341 testes em 66 suítes**, com `npx tsc --noEmit` limpo.

### 2.33. Integração Integral do Project Gutenberg (79.634 Obras) e Backfill de Paridade Dev/Produção
- **Diretriz do Usuário:** *"Adicione todos os livros do Project Gutenberg - 79.668 books"*
- **Fonte Oficial de Catálogo:** `pg_catalog.csv.gz` (feed diário oficial do Project Gutenberg, snapshot 2026-10-18, 79.634 obras `Type=Text`) complementado pelo **Gutendex** (`gutendex.com`, 79.666 e-books ao vivo) para sinopses, capas e formatos por obra.
- **Diagnóstico Inicial (Estado Real das Bases):**
  - Produção D1 já continha **79.101 obras** do Gutenberg (fonte 5): 78.283 com padrão `pg-N` (lote em massa de Out/2026) + 818 curadas com chave numérica pura (`1342`).
  - Constatadas **779 duplicatas reais em produção** (mesma obra indexada duas vezes: curado `105` + em massa `pg-105`).
  - Delta genuíno do CSV oficial: apenas **101 obras novas** (+31 autores).
- **Importador Fortalecido ([`scripts/import_fase2_gutenberg.mjs`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/import_fase2_gutenberg.mjs)):**
  1. **Deduplicação de Padrão Duplo:** `pg-N` e `N` tratados como a mesma chave canónica (o novo número só entra se NENHUMA das duas formas existir), eliminando re-indexação duplicada.
  2. **Lotes Versionados (`pg-batch-v2-*.sql`):** nomes com sufixo v2 evitam colisão com o progresso antigo (`gutenberg-applied.json`); novo checkpoint idempotente em `gutenberg-applied-v2.json`.
  3. **Bootstrap de `fonte`/`categoria`:** INSERT OR IGNORE idempotente nos dois lados (id 5 / id 51), eliminando dependência de estado pré-existente.
  4. **Dados Honestos:** `ano_publicacao = NULL` para o lote em massa (o campo "Issued" do CSV é a data de digitalização — fabricar o ano da publicação original seria dado falso, violando o princípio 2.7 de números reais); `capa_url = NULL` na ingestão (só o Gutendex preenche com imagem verificada — zero capas 404).
  5. **Aplicação segue em progresso:** delta de 101 obras aplicado localmente e na D1 remota com checkpoint/multi-tentativa.
- **Cura de Duplicatas em Produção:**
  - Removidas **678 linhas pg-N** (e respectivos links) onde já existia a versão curada (com 3 links e sinopse real). Resultado: produção consolidada em **104.170 obras** (de 104.848: +101 novas, −779 cópias).
  - `total_livros` da D1 atualizado surgicalmente (104.170) e `versao_mutacoes=1`/`versao_calculada=0` garantem que o cron das 00:10 UTC recalcule todos os agregados (`estatisticas`, `contadores`, `autor_totais`) sem custo para o daytime.
- **Backfill de Paridade Dev/Produção ([`scripts/sincronizar_gutenberg_local.mjs`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/sincronizar_gutenberg_local.mjs)):**
  - Espelha o acervo Gutenberg integral da **D1 → `biblioteca.db` local** mantendo **os MESMOS IDs** de livros/autores/categorias/links (o id numérico da linha do seed coincide entre as bases, validado por amostragem; Machado de Assis = id 1 em ambas).
  - Resultado: **78.461 obras Gutenberg** + **78.626 links externos** + **26.220 autores garantidos** localmente; estado local final **80.331 obras · 27.185 autores · 0.8033% da meta**.
  - Agregados locais recalculados set-based (`estatisticas`, `contadores` por idioma/licença/categoria/fonte, `autor_totais`), FTS5 verificado por sondas de MATCH (busca "hamlet" e títulos pt OK).
  - Idempotente e retomável por checkpoint (`.scratch/gutenberg-local-sync.json`); `conteudo_texto` copiado fielmente (Gutenberg = 100% domínio público, conforme Regra 4).
- **Enriquecimento Gutendex ([`scripts/enriquecer_gutenberg.mjs`](file:///Users/mendes/Desktop/I%20am%20Abc/scripts/enriquecer_gutenberg.mjs)):**
  - Passe sequencial respeitando 1 req/s (~2.490 páginas ≈ 50 min, checkpoint auto-retomável) aplicando: **sinopses REAIS** (substitui apenas o texto-base template, conserva sinopses curadas), **capas auditadas** (`formats['image/jpeg']` — substitui o padrão-cego antigo e anula URLs prováveis de 404) e **links PDF/EPUB/TXT oficiais** por obra (respeitando UNIQUE(livro_id, formato)).
  - Obras presentes só no Gutendex são registadas em `.scratch/gutenberg-faltantes.json` para remediação.
- **Sincronização de Métricas:** `scripts/corrigirMetricasDashboard.js` (modo padrão) atualizou `public/index.html` ← 80.331 (seed local) e `workers/src/index.ts` ← 104.170 (produção D1) — `resumo_estavel` e `totalCatalogoConhecido`.
- **Enriquecimento Remoto (futuro):** atualizar as ~78k obras Gutenberg na D1 consome mais de 100k escritas/dia do Free Tier; cada janela diária permite aplicar lotes progressivos via o mesmo enriquecedor estendido à D1 (com orçamento e retomada), priorizando as obras mais lidas.
- **Validação da Sessão:** suíte **341 testes em 66 suítes 100% verde** + `npx tsc --noEmit` limpo; smoke test Express local: `/api/dashboard` (80.331), busca FTS "hamlet" (25 resultados), `GET /api/livros/22923/ler/27159` → HTTP 302 para `gutenberg.org` ✓.

### 2.34. Licenciamento 100% Open Source: Adopção Oficial da Apache 2.0
- **Diretriz do Usuário:** *"Quero usar o Apache 2.0"* / *"Doravente o projecto será 100% opensource"*
- **Decisão e Aplicação:**
  - O código-fonte da plataforma LinoDigital · Lino Livre é oficialmente licenciado sob a **Apache License, Version 2.0**.
  - **Ficheiro de Licença:** Criado [`LICENSE`](file:///Users/mendes/Desktop/I%20am%20Abc/LICENSE) na raiz do repositório com o texto canónico da Apache License 2.0 e cabeçalho `Copyright 2026 LinoDigital`.
  - **Metadados:** Declarado `"license": "Apache-2.0"` em [`package.json`](file:///Users/mendes/Desktop/I%20am%20Abc/package.json) e documentado em [`README.md`](file:///Users/mendes/Desktop/I%20am%20Abc/README.md).
  - **Benefícios da Escolha:**
    1. **Concessão Expressa de Patentes:** Cláusula 3 protege contribuidores e utilizadores contra litígios patentários.
    2. **Proteção da Marca Registada LinoDigital:** Cláusula 6 veda expressamente o uso indevido das marcas e nomes comerciais sem autorização.
    3. **Permissividade Comercial e Comunitária:** Permite ampla colaboração institucional, governamental e acadêmica internacional.
  - **Teste Automatizado de Regressão:** Adicionado teste 11 em [`test/brand_linodigital.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/brand_linodigital.test.js) que valida a existência física do arquivo `LICENSE`, a versão 2.0, o copyright LinoDigital e a declaração SPDX no `package.json`.

### 2.35. Resolução de Erro de Leitura/Download e Degradação sob Esgotamento de Cota D1 (Erro 7500)
- **Problema Relatado:** Ao tentar ler ou baixar livros em produção, o usuário recebia erro `"Erro ao processar leitura"` (HTTP 500) e `"Erro ao carregar livro"`.
- **Causa Raiz Identificada:**
  - A base D1 em produção atingiu o limite gratuito diário de leitura da Cloudflare (5M linhas lidas/dia, erro `code: 7500`).
  - O endpoint `/api/livros` possuía tratamento de degradação, mas as rotas `/api/livros/:id/ler/:linkId`, `/api/livros/:id` e `/api/livros/destaques` capturavam o erro e retornavam HTTP 500 genérico.
  - O backend Supabase não era consultado como alternativa porque `DB_BACKEND` estava fixado em `d1`.
- **Resoluções de Engenharia Implementadas:**
  1. **Fallback de Alta Disponibilidade para Supabase (`obterRepoSupabase`):** Quando a D1 dispara `ehErroDeCota(err)`, o Worker tenta instantaneamente consultar os metadados e links no Supabase (que possui as 104k obras espelhadas).
  2. **Catálogo Fallback Local em Borda (`FALLBACK_LIVROS` & `obterLinkFallback`):** Se ambas as bases remotas estiverem indisponíveis, o Worker mantém em memória os links verificados (Wikisource e Project Gutenberg) das principais obras clássicas (Dom Casmurro, Memórias Póstumas, O Cortiço, Os Lusíadas, Mensagem, Iracema, O Alienista, etc.), redirecionando (HTTP 302) com cabeçalho `X-Data-Status: degraded`.
  3. **Degradação Limpa HTTP 503:** Obras fora do catálogo fallback retornam HTTP 503 educativo com cabeçalhos `X-Data-Status: degraded` e `Retry-After: 3600`, eliminando erros 500 internos inesperados.
  4. **Proteção contra Falha de Escrita Assíncrona:** A chamada `UPDATE livros SET leituras = leituras + 1` no background context foi envolvida com `.catch(() => {})`, impedindo unhandled rejections quando a cota de gravação estiver esgotada.
  5. **Cobertura de Testes Automatizados TDD:** Cenário 15 adicionado em [`test/worker.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/worker.test.js) com 5 testes de regressão (348 testes em 67 suítes 100% verdes).

### 2.36. Resolução de Filtros Ignorados no Catálogo sob Degradação da D1
- **Problema Relatado:** Ao aplicar filtros (categorias, idiomas, licenças, formatos, busca) no catálogo geral, o catálogo continuava a devolver sempre as mesmas obras iniciais, ignorando os filtros.
- **Causa Raiz Identificada:**
  - Quando a cota de leitura diária da D1 esgotava (código `7500`), a rota `GET /api/livros` entrava no bloco `catch (err)`.
  - No `catch`, o Worker devolvia estaticamente o array `FALLBACK_LIVROS` (10 obras clássicas) sem aplicar nenhum dos parâmetros de busca ou filtragem recebidos na query string (`busca`, `categoria_id`, `idioma`, `licenca`, `formato`, `fonte`, `colecao`).
  - Além disso, o Supabase (que possui o catálogo integral de 104k obras espelhado) não era consultado como fallback antes da resposta degradada.
- **Resoluções de Engenharia Implementadas:**
  1. **Fallback em Cascata para Supabase:** Ao capturar `ehErroDeCota(err)` em `/api/livros`, o Worker consulta `obterRepoSupabase(c.env).livros(...)`, aplicando busca e filtros sobre a base integral no Supabase.
  2. **Filtragem em Memória sobre `FALLBACK_LIVROS`:** Caso o Supabase também esteja inacessível, o Worker aplica filtros em memória (título, autor, sinopse, categoria_id, idioma, licença, formato) sobre o catálogo de contingência, garantindo que consultas filtradas respeitem estritamente as restrições selecionadas pelo usuário.
  3. **Suporte a Coleção Top 100 no Supabase:** Tratamento explícito de `fonte_id_externo LIKE 'world-*'` no repositório Supabase para responder a requisições com `categoria_id="🌟 Mais Lidos do Mundo"` e `colecao="top100"`.
  4. **Testes de Regressão TDD:** Adicionados testes 15.6 e 15.7 em [`test/worker.test.js`](file:///Users/mendes/Desktop/I%20am%20Abc/test/worker.test.js) validando filtragem por categoria e por busca textual sob cota esgotada (350 testes em 67 suítes 100% verdes).

### 2.37. Decomposição Modular do Cloudflare Worker (`workers/src/index.ts`)
- **Objetivo:** Reduzir complexidade e tamanho do monólito `workers/src/index.ts` mantendo 100% de paridade de comportamento, contratos de API e segurança.
- **Estruturas Criadas:**
  1. `workers/src/data/constants.ts`: Constantes de dimensões estáticas, origens CORS permitidas e metas globais.
  2. `workers/src/data/fallbackLivros.ts`: Catálogo de contingência em memória e resolvedor de links de fallback para resiliência sob esgotamento de cotas.
  3. `workers/src/middlewares/`:
     - `cors.ts`: Controle granular de CORS (leitura irrestrita, mutação restrita a origens permitidas).
     - `cache.ts`: Cache de borda via Cloudflare Cache API (`caches.default`).
     - `security.ts`: Cabeçalhos defensivos (CSP, HSTS, X-Frame-Options), WAF de borda contra scanners/sondas, rate limiter com token bucket e validação Turnstile.
  4. `workers/src/routes/`:
     - `config.ts`: Chave pública do Turnstile (`GET /api/config`).
     - `dicas.ts`: Dicas de estudo e técnicas de aprendizagem (`GET /api/dicas`).
     - `comunidade.ts`: Comunidade, canal WhatsApp e geração de QR Codes SVG (`GET /api/comunidade`, `GET /api/canal`).
     - `loadbalancer.ts`: Telemetria e status do Circuit Breaker (`GET /api/loadbalancer/status`).
     - `agentic.ts`: Descoberta para agentes de IA e segurança (`GET /llms.txt`, `GET /llms-full.txt`, `ai-catalog.json`, `security.txt`).
     - `sugestoes.ts`: Fila de moderação da comunidade com validação de licenças e proteção anti-bot (`POST /api/sugestoes`, `GET /api/sugestoes`).
- **Validação:** 350 testes em 67 suítes passando (100% verde) e TypeScript estrito sem erros (`npx tsc --noEmit`).

### 2.38. Otimização de SQL, Eliminação de LIKEs Ineficientes e Query Builders Puros
- **Problema Abordado:**
  1. Cláusulas `LIKE '%termo%'` em ordenações de cursos (`ORDER BY CASE WHEN plataforma LIKE '%Guia de TI%'...`) e filtros forçavam scans em tabelas indexadas.
  2. O `dashboardController.js` e `categoriasController.js` no Express executavam 14 varreduras completas (*Full Table Scan*) sobre os 80.331 livros a cada requisição, mesmo com tabelas de agregados pré-computados (`estatisticas`, `contadores`, `autor_totais`) já existentes.
  3. Duplicações de código SQL entre Express e Worker para montagem de filtros, ordenação e destaques.
- **Resoluções de Engenharia Implementadas:**
  1. **Substituição de LIKE Infixo por Comparações Estritas ou `instr()`:**
     - Comparações em `cursos` migradas para `= 'Guia de TI'`, `= 'Roadmap.sh'` e `= 'Trilha Info'`.
     - Filtros de certificado convertidos de `LIKE '%certifica%'` para `instr(LOWER(coluna), 'certifica') > 0`.
  2. **Adoção de Tabelas Agregadas no Express (`estatisticas`, `contadores`, `autor_totais`):**
     - Em `categoriasController.js`, leitura via `LEFT JOIN contadores k ON k.dimensao = 'categoria'`, lendo ~20 linhas em vez de 80.331 linhas.
     - Em `dashboardController.js`, agregações de `licencas`, `idiomas`, `areas` e `fontes` agora consomem `contadores`, eliminando múltiplos scans de tabela cheia.
     - Em `autoresController.js`, contagem de livros por autor consome diretamente a tabela `autor_totais`.
  3. **Módulos de Query Builders Puros (`src/database/queries/`):**
     - `cursosQueries.js`: `buildCursosQuery` e `buildRoadmapsQuery`.
     - `destaquesQueries.js`: `buildDestaquesQuery`.
     - `livrosQueries.js`: `buildFiltrosLivros` e `anexarLinksAosLivros`.
  4. **Ganhos de Performance:** Tempo de execução da suíte de 350 testes reduzido de ~71s para ~43s (~40% mais rápida). Total conformidade mantida: 350/350 testes passando (100% verde).

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

### 3.7. Higienização DOM e Mitigação de XSS no Frontend
- **Sanitização de URLs em Injeções Dinâmicas:** Todo link de obra, autor, capa ou podcast injetado via JavaScript passa obrigatoriamente pela função `this.sanitizeUrl(url, '#')`, que bloqueia esquemas perigosos (`javascript:`, `data:`, `vbscript:`) e aplica escape de entidades HTML.
- **Eliminação de Eventos Inline (`onclick`):** Removidos handlers inline com interpolação de strings como `onclick="app.ouvirShowCompleto('${s.slug}')"`. A aplicação utiliza atributos `data-*` (ex.: `data-slug`) e delegação de eventos centralizada com `addEventListener`.
- **Validação de Preferências em `localStorage`:** O leitor web valida estritamente os valores recuperados do armazenamento local através de listas permitidas (allowlist):
  - Temas permitidos: `creme`, `sepia`, `noturno`.
  - Alinhamentos permitidos: `left`, `center`, `right`, `justify`.
  Valores fora dessas listas são sumariamente descartados para o valor padrão.

### 3.8. Prevenção de Path Traversal no Cache de Importação
- **Sanitização de Nomes de Ficheiro:** No serviço de importação ([`src/services/importer.js`](file:///Users/mendes/Desktop/I%20am%20Abc/src/services/importer.js)), a criação de ficheiros de cache temporário utiliza a função `sanitizarNomeArquivoCache(nome)`, que remove sequências de escape de diretório (`../`, `..\`) e restringe o nome a caracteres alfanuméricos seguros (`[^a-zA-Z0-9_-]`), impedindo qualquer escrita fora da pasta de cache designada.

---

## 🏗️ 4. Decisões de Arquitetura de Dados: Estratégia Híbrida (D1 + Supabase)

### 4.1. Cloudflare D1 como Banco de Borda Primário (Produção Ativa)
- **Decisão:** `"DB_BACKEND": "d1"` permanece como o backend ativo em [`wrangler.jsonc`](file:///Users/mendes/Desktop/I%20am%20Abc/wrangler.jsonc).
- **Justificativa:** O Cloudflare D1 (`lino-livre-db`) opera na Edge Network com latência mínima global, busca FTS5 integrada e redirecionamentos 302 instantâneos.
- **Eficiência e Controle de Cotas D1 (5M leituras/dia):**
  - Todas as consultas com paginação forçam limite máximo (`Math.min(limit, 500)`).
  - Consultas comuns usam tabelas de agregados pré-computados (`estatisticas`, `contadores`, `autor_totais`), evitando varreduras de 104k linhas.
  - Índices compostos de performance ativos em produção: `idx_livros_popularidade`, `idx_livros_idioma_popularidade`, `idx_livros_fonte_popularidade`, `idx_livros_categoria_popularidade`, `idx_livros_autor_popularidade`, `idx_livros_licenca_popularidade`, `idx_autores_nome`, `idx_cursos_url`.
  - Cron diário às 00:10 UTC recalcula agregados e garante a integridade dos índices declarados em [`migrations/0005_indices_performance.sql`](file:///Users/mendes/Desktop/I%20am%20Abc/migrations/0005_indices_performance.sql).
  - Endpoint administrativo para recálculo manual a qualquer momento: `POST /api/admin/recalcular-estatisticas` (requer `x-admin-key`).
  - Cache de borda via Cloudflare Cache API protege rotas GET de leituras repetidas na D1.

### 4.2. Supabase como Backend Auxiliar / Híbrido (Migração Parcial)
- **Diretriz do Usuário:** *"Não migre completamente para o supabase, migre parcialmente."*
- **Finalidade:** Armazenamento relacional PostgreSQL auxiliar para metadados selecionados e fallback de alta disponibilidade.
- **Status das Tabelas Sincronizadas Parcialmente:**
  - `fontes`: 34 registros.
  - `categorias`: 20 registros.
  - `autores`: 37.919 registros (100% dos autores sincronizados).
  - `cursos`: 8.541 registros.
  - `livros`: Em migração keyset com checkpoint (600+ registros).
  - `links_livros`: Em migração keyset com checkpoint (500+ registros).
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
# Executar a suíte completa de testes automatizados (341 testes em 66 suítes)
npm test

# Executar diagnóstico completo de tráfego e consumo de cotas (D1 e Supabase)
npm run diagnostico

# Executar apenas testes do Cloudflare Worker
npm run test:worker

# Verificar tipagem estrita TypeScript (sem emitir binários)
npx tsc --noEmit

# ── Project Gutenberg (Fase 2 integral, §2.33) ────────────────────────
# Gerar lotes SQL a partir do pg_catalog.csv e aplicar local + D1 (retomável)
node scripts/import_fase2_gutenberg.mjs --apply

# Espelhar o acervo Gutenberg da D1 de produção para o biblioteca.db local
node scripts/sincronizar_gutenberg_local.mjs [--recalc]

# Enriquecer sinopses/capas/links oficiais via Gutendex (retomável, 1 req/s)
node scripts/enriquecer_gutenberg.mjs [--max-pages N]

# Repovoar o banco local com todas as fontes, livros e cursos limpos
npm run seed -- --reset

# Sincronizar catálogo de cursos locais e remotos
npm run cursos:sync

# Exportar catálogo consolidado para CSV
npm run livros:csv

# Iniciar servidor Express de desenvolvimento
npm start

# Sincronizar e auditar métricas entre banco local e produção
node scripts/corrigirMetricasDashboard.js

# Monitorar e aplicar índices de performance na D1 remota
node scripts/aplicar_indices_d1_auto.mjs
```

---

## 🔒 7. Compromisso Contínuo dos Agentes
- **Nunca** quebre os 341 testes automatizados em 66 suítes.
- **Sempre** preserve a hierarquia de marca **LinoDigital (mãe) · Lino Livre (produto)** em todas as superfícies.
- **Nunca** hospede arquivos de mídia locais.
- **Sempre** rode `npm test` e `npx tsc --noEmit` antes de qualquer commit.
- **Sempre** garanta que qualquer novo curso ou livro contenha uma licença aberta válida e comprovada.
