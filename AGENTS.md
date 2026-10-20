# 🤖 MEMÓRIA, ARQUITETURA E REGRAS PARA AGENTES (ATUAIS E FUTUROS)

> **DOCUMENTO NORMATIVO E HISTÓRICO DE DECISÕES DO LINO LIVRE**
>
> **Atenção Agentes de IA (Gemini, Claude, GPT, Cursor, Antigravity, etc.):**
> Este documento consolida a arquitetura, as diretrizes de compliance legal invioláveis, todas as interações e decisões das Fases 0 a 10 e o histórico de resolução de incidentes técnicos.
> **Leia e respeite este arquivo integralmente antes de modificar qualquer código no repositório.**

---

## 🏛️ 1. Diretriz Principal Inviolável: Servidor Intermediário (Zero Armazenamento Local)

1. **Sem Armazenamento de Arquivos/Livros:** 
   - O servidor web, a API, os buckets de objetos e o banco de dados deste projeto **NUNCA** devem armazenar, hospedar ou guardar arquivos de livros (PDF, EPUB, TXT, MOBI, MP3, MP4 ou quaisquer binários).
   - O banco de dados guarda unicamente **metadados** (título, autor, categoria, idioma, licença) e **links de redirecionamento para URLs externas**.
2. **Papel Exclusivo de Intermediário:**
   - A aplicação funciona **estritamente como uma plataforma intermediária e indexadora de busca pública**.
   - Toda leitura/download feita pelo usuário ocorre através de um redirecionamento (**HTTP 302**) para o provedor original ou repositório externo onde o arquivo está efetivamente hospedado.
3. **Fundamento da Defesa Legal:**
   - Em caso de notificação jurídica, disputa ou processo legal, a linha de defesa do responsável e da aplicação baseia-se no facto de que o servidor **não armazena nem distribui diretamente nenhum arquivo de obra** em sua infraestrutura física ou de banco de dados, atuando unicamente como ponte/redirecionador para links públicos disponíveis na internet.
4. **Política Anti-Pirataria (Lista Negra Estrita):**
   - É terminantemente proibido indexar, armazenar links ou aceitar cadastros de domínios conhecidos de pirataria (shadow libraries):
     - `Z-Library` (`z-lib.*`, `singlelogin.*`, `b-ok.*`)
     - `Library Genesis` (`libgen.*`)
     - `Sci-Hub` (`sci-hub.*`)
     - `Anna's Archive` (`annas-archive.*`)
     - `PDF Drive`, `BookFi` e similares.
   - Qualquer link para esses domínios deve ser sumariamente rejeitado com erro HTTP 400 pelo validador central (`src/utils/urlValidator.js` e `workers/src/utils/urlValidator.ts`).
5. **Privacidade Absoluta:**
   - A plataforma **não recolhe** números de telefone, dados pessoais ou mensagens de usuários. Não há integração com Meta Cloud API, webhooks invasivos ou robôs espiões.

---

## 🗺️ 2. Histórico de Decisões e Interações por Fases (Fases 0 a 10)

### Fase 0 — Decisões Arquiteturais e Pilha Tecnológica
- **Stack Tecnológico:**
  - **Backend Local/Node:** Node.js (≥ 22) + Express 5 + SQLite (`node:sqlite` nativo via `DatabaseSync`) + FTS5.
  - **Edge / Produção Serverless:** Cloudflare Workers (Hono + TypeScript) com D1 Database + Supabase Postgres (modo híbrido/fallback) e Cloudflare Workers Assets para estáticos.
  - **Frontend:** Vanilla HTML5, CSS customizado responsivo e JavaScript limpo (sem Tailwind extra nem frameworks pesados).
- **Descarte de Alunos/Empréstimos:** Decisão irrevogável de focar apenas no acervo digital público.

### Fase 1 — Eliminação do Modelo de Empréstimos Físicos (P0)
- **Eliminações:**
  - Deletado `src/controllers/emprestimosController.js`.
  - Removidas rotas `/emprestimos`, `/devolver`, `/renovar`.
  - Excluídas as tabelas `emprestimos`, `historico_emprestimos` e as colunas de estoque físico (`quantidade_total`, `quantidade_disponivel`).
  - Atualizados os testes para cobrir estritamente catálogo digital.

### Fase 2 — Modelo de Dados Digital (P0)
- Criação do esquema definitivo em `src/database/schema.sql`:
  - `fontes` (slug, nome, tipo, url_base, ativa)
  - `livros` (titulo, subtitulo, isbn, ano, idioma, sinopse, capa_url, autor_id, categoria_id, fonte_id, licenca, leituras)
  - `links_livros` (livro_id, formato, url, tamanho_bytes, link_externo)
  - `cursos` (titulo, area, plataforma, url, licenca, nivel, tipo, descricao)
  - `import_jobs` (fonte_id, query, status, total, processados, erro)
  - `livros_fts` (Virtual Table SQLite FTS5 sincronizada por triggers com autor desnormalizado).

### Fases 3 & 4 — Ingestão Escalar e Motor Federado Distribuído (P1)
- **Motor Federado Distribuído (RRF — Reciprocal Rank Fusion):**
  - Algoritmo RRF com constante $k=60$ para combinar resultados do catálogo local e catálogos remotos abertos.
  - Deduplicação inteligente de edições por chave canônica `titulo_normalizado + autor_normalizado`.
  - Degradação graciosa em timeout ou falha de upstreams.
- **Importadores Oficiais Assíncronos:**
  - Project Gutenberg (via Gutendex JSON).
  - Open Library / Internet Archive (somente obras com download livre e domínio público).
  - Wikisource (MediaWiki API para fontes primárias em português).
  - LibriVox (audiolivros em domínio público).
  - Standard Ebooks (OPDS de clássicos com tipografia de alta qualidade).
  - Europeana (patrimônio cultural europeu).
  - Enriquecimento opcional via Google Books API (capas e sinopses).
- **Idempotência Garantida:** Restrição `UNIQUE (fonte_id, fonte_id_externo)` para impedir registros duplicados.

### Fase 5 — Compliance, Licenciamento & Acervo de 100 Repositórios GitHub (P0)
- **Auditoria de Licenças:** 100% dos livros e cursos possuem campo `licenca` obrigatório (`dominio-publico`, `cc0`, `cc-by`, `cc-by-sa`, `cc-by-nc`, `outro`).
- **Página de Compliance:** Criação de `/creditos.html` e endpoint `GET /api/creditos` com métricas auditáveis.
- **Acervo GitHub Curado:** Ingestão de 100 repositórios técnicos canônicos (Harvard, Stanford, Oxford, Linux, Free-Programming-Books), com capas SVG exclusivas geradas e sinopses localizadas.

### Fase 6 — Frontend e Experiência do Usuário (P1)
- **Acervo Interativo:**
  - Barra de filtros rápidos por tipo de licença (`#pills-licencas`).
  - Modal dedicado de Detalhes da Obra (`#modal-detalhes-livro`) com sinopse, capas em alta definição e botões de download por formato (PDF, EPUB, TXT, HTML).
  - Leitor imersivo ultraleve em navegador para obras em texto e audiolivros.
  - Suporte a Deep Links via URL Hash (`/#livro-123`) e botão "Partilhar Obra".
  - Internacionalização (i18n) completa em **7 idiomas**: Português (`pt`), Português do Brasil (`pt-br`), Inglês (`en`), Espanhol (`es`), Francês (`fr`), Alemão (`de`) e Mandarim (`zh`).

### Fase 7 — Intermediário de Cursos Gratuitos e Recursos Educacionais Abertos (P2)
- **Diretório Curado de OER:**
  - **OER Commons:** 15 cursos e módulos abertos (CC BY).
  - **OpenStax:** 8 livros/cursos didáticos universitários (CC BY).
  - **MIT OpenCourseWare:** 11 cursos clássicos do MIT (CC BY-NC-SA).
  - **CK-12 Foundation:** 5 cursos de ciências e matemática (CC BY-NC).
  - **PhET Interactive Simulations:** 6 simulações interativas de física e química (CC BY).
  - **Khan Academy Brasil:** 6 trilhas abertas de matemática e ciências (CC BY-NC-SA).
  - **Plataformas Globais/Nacionais:** Cursa (em 5 idiomas), Harvard PLL, Stanford Online, DIO Bootcamps, Fundação Bradesco, EV.G, Lumina, IFRS e Guia de TI.
- **Acesso Seguro 302:** Endpoint `GET /api/cursos/:id/acessar` com redirecionamento validado e zero armazenamento de vídeos/mídia no servidor.
- **Filtros por Licença:** Suporte a parâmetro `licenca` em `GET /api/cursos` no Express e no Cloudflare Worker.

### Fase 8 — Comunidade WhatsApp & Cartaz Escolar para Impressão (P1)
- **Dois Pontos de Acesso WhatsApp:**
  - 💬 **Grupo de Leitores ("Lino, quero ler!")**: `WHATSAPP_COMMUNITY_URL` para pedidos de livros e resenhas.
  - 📢 **Canal Oficial ("Livros e Cursos — Lino Livre")**: `WHATSAPP_CHANNEL_URL` de sentido único e com privacidade total para novidades.
- **Geração Dinâmica de QR Code:**
  - `GET /api/comunidade/qrcode.svg` e `GET /api/canal/qrcode.svg` com biblioteca `qrcode` e cache em memória.
- **Cartaz Escolar para Impressão A4 ([`public/comunidade.html`](file:///Users/mendes/Desktop/I%20am%20Abc/public/comunidade.html) / `/comunidade`):**
  - Layout pronto para afixar em murais escolares e bibliotecas.
  - Regras CSS `@media print` sem margens excessivas ou botões de tela.
  - Passo a passo de leitura do código com a câmara do telemóvel.

### Fase 9 — Suíte de Testes Automatizados e Resiliência (P1)
- **145 Testes Automatizados (100% Verdes):**
  - `test/api.test.js`: 32 testes de integração (CRUD, FTS5, paginação, 302, comunidade, cursos, WAF).
  - `test/worker.test.js`: 9 cenários do Worker Cloudflare (D1, Supabase fallback, 503 degradado, rate limit, matching FTS).
  - `test/fase34.test.js`: Ingestores, RRF e conformidade de metadados.
  - `test/security_idor_tdd.test.js`: Prevenção de IDOR, Anti-SSRF, sanitização de IPv4/IPv6 e proteção de limites anti-DoS.
  - `test/library.test.js`: Constraints de domínio e integridade relacional.

### Fase 10 — Documentação, Arranque e CI/CD (P1)
- Alinhamento de nomes, marcas e variáveis (`.env.example`).
- Pipeline GitHub Actions (`.github/workflows/deploy.yml`) com execução de testes automatizados e deploy contínuo para Cloudflare Workers.

---

## 🛠️ 3. Decisões Técnicas Críticas & Resolução de Incidentes

| Incidente / Desafio | Causa Raiz | Solução Adotada & Regra Definitiva |
|---|---|---|
| **Erro Cloudflare Deploy (código 10000 / 9109)** | O token da Cloudflare usado na action possuía restrição de IP estático ou permissão insuficiente para runners dinâmicos do GitHub Actions (ex: IP `134.33.102.120`). | O token precisa ter permissões de `Worker Scripts: Edit`, `Account Settings: Read` e `D1: Edit` sem restrição de IP estático no painel da Cloudflare. |
| **Discrepância na Contagem de Busca FTS5** | A função de contagem rápida `contarNaFts` recebia termo pré-formatado diferente da consulta principal. | A contagem na FTS deve receber o termo cru e passar pela mesma função `limparTermoFts`, garantindo que o `total` bata 100% com os itens retornados. |
| **Estouro de Cota da D1 (Full Table Scans)** | Consultas de autores e filtros sem índices forçavam a D1 a varrer os 104.848 livros a cada requisição. | Criada tabela pré-computada `autor_totais`, índice case-insensitive `autores(nome COLLATE NOCASE)` e índice composto `(autor_id, id)` na migração `0005`. |
| **Vulnerabilidade SSRF em Capas** | Rotas administrativas aceitavam URLs arbitrárias para `capa_url`. | `capa_url` e links passam por `validarUrlRedirecionamento`, que bloqueia loopbacks (`127.0.0.0/8`), IPv6 local (`::1`, `fe80::`), metadados AWS/Cloud (`169.254.169.254`) e redes RFC 1918. |
| **Degradação de Supabase / D1** | Falhas de conexão externa quebravam a API no Edge. | Arquitetura com fallback: requisições tentam Supabase; em caso de erro, recorrem à D1. Se ambos falharem, o cache de memória devolve HTTP 200 ou 503 com `Retry-After: 30`. |
| **WAF de Borda contra Scanners** | Scanners automatizados (sqlmap, nikto, dirbuster) consumiam requisições da borda. | Middleware de WAF bloqueia User-Agents maliciosos com HTTP 403 e retorna HTTP 404 estrito para sondas de arquivos confidenciais (`/.env`, `/.git`). |
| **Padronização de Licenças de Cursos** | Alguns cursos do MIT OCW estavam como `gratuito` genérico. | Alinhada a licença estrita: MIT OCW é `cc-by-nc-sa`; OpenStax é `cc-by`; PhET é `cc-by`; CK-12 é `cc-by-nc`. |

---

## 💻 4. Guia Rápido de Comandos para Agentes

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

## 🔒 5. Compromisso Contínuo dos Agentes
- **Nunca** quebre os 145 testes automatizados.
- **Nunca** hospede arquivos de mídia locais.
- **Sempre** rode `npm test` e `npx tsc --noEmit` antes de qualquer commit.
- **Sempre** garanta que qualquer novo curso ou livro contenha uma licença aberta válida e comprovada.
