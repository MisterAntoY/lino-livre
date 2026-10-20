# Plano de Resolução — Lino Livre (Biblioteca Digital Escolar)

**Marca:** **Lino Livre**, usada no título do site, na comunidade do WhatsApp e no cartaz com o QR code.
**Slogan sugerido:** *"Livros livres, para todos."*

**Escopo vigente (decisão do responsável):** apenas **distribuição de livros digitais online**. O modelo de empréstimos/devoluções foi **descartado por completo**.
**Papel atual:** plano de auditoria e especificação. Implementação a cargo do agente Gemini 3.8 Flash.

---

## Fase 0 — Decisões arquiteturais (confirmar antes de codificar)

| # | Decisão | Recomendação |
|---|---|---|
| 0.1 | Stack | Mantém-se fullstack web: Node.js + Express 5 + SQLite (`node:sqlite`) + HTML/Tailwind vanilla |
| 0.2 | Modelo de "utilizador" | Sem alunos. Perfil de leitor **opcional** (só para favoritos), adiado para Fase 8 |
| 0.3 | Hospedagem de ficheiros | **Não rehostear** conteúdo protegido. Catálogo + *deep links*; rehosting apenas de obras em domínio público/CC, com atribuição |
| 0.4 | Fontes aprovadas | Ver Fase 4. **Proibido**: Z-Library, Library Genesis, Sci-Hub e qualquer fonte pirata |

---

## Fase 1 — Remoção do modelo de empréstimos (P0, quebra de escopo)

Mapa de impacto já auditado (51 referências em 6 ficheiros):

| ID | Tarefa | Ficheiros |
|---|---|---|
| 1.1 | Eliminar controlador de empréstimos | `src/controllers/emprestimosController.js` (apagar) |
| 1.2 | Remover rotas `/emprestimos`, `/devolver`, `/renovar` | `src/routes/api.js` |
| 1.3 | Remover tabela `emprestimos`, colunas `quantidade_total`/`quantidade_disponivel` | `src/database/schema.sql` |
| 1.4 | Remover seed de empréstimos | `src/database/seed.js` |
| 1.5 | Remover `atualizarStatusAtrasos` | `src/database/index.js` |
| 1.6 | Remover `historico_emprestimos`, verificação de ativos no delete, colunas de stock | `src/controllers/livrosController.js` |
| 1.7 | Reescrever métricas (sem "atrasados"/"mais emprestados") | `src/controllers/dashboardController.js` |
| 1.8 | Remover modal de empréstimo/devolução/renovação | `public/index.html`, `public/js/app.js`, `public/css/style.css` |
| 1.9 | Eliminar 6 testes de empréstimo; manter 4 (categorias/autores/livros) | `test/library.test.js`, `test/api.test.js` |

**Critério de aceite:** `npm test` passa sem qualquer referência a empréstimo; `grep -ri emprestim src public test` devolve vazio.

---

## Fase 2 — Modelo de dados digital (P0)

Esquema alvo (adicional a `categorias` e `autores`, que se mantêm):

```sql
CREATE TABLE fontes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,        -- gutenberg | openlibrary | dominiopublico | wikisource ...
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('api','opds','rss','csv','scraping','manual')),
    url_base TEXT,
    ativa INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    subtitulo TEXT,
    isbn TEXT,
    ano_publicacao INTEGER,
    idioma TEXT DEFAULT 'pt',
    sinopse TEXT,
    capa_url TEXT,
    paginas INTEGER,
    autor_id INTEGER REFERENCES autores(id) ON DELETE SET NULL,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    fonte_id INTEGER REFERENCES fontes(id) ON DELETE SET NULL,
    fonte_id_externo TEXT,
    licenca TEXT NOT NULL CHECK (licenca IN ('dominio-publico','cc0','cc-by','cc-by-sa','cc-by-nc','outro')),
    leituras INTEGER NOT NULL DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (fonte_id, fonte_id_externo)   -- idempotência de import
);

CREATE TABLE links_livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    livro_id INTEGER NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
    formato TEXT NOT NULL CHECK (formato IN ('epub','pdf','txt','html','audiobook')),
    url TEXT NOT NULL,
    tamanho_bytes INTEGER,
    link_externo INTEGER NOT NULL DEFAULT 1,  -- 1 = abre fonte; 0 = ficheiro local
    UNIQUE (livro_id, formato)
);

CREATE TABLE import_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fonte_id INTEGER NOT NULL REFERENCES fontes(id),
    query TEXT,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','em_curso','concluido','erro')),
    total INTEGER DEFAULT 0,
    processados INTEGER DEFAULT 0,
    erro TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE VIRTUAL TABLE livros_fts USING fts5(titulo, autor_nome, conteudo='livros', conteudo_rowid='id');
-- + triggers para manter o FTS sincronizado (autor_nome desnormalizado no FTS)
```

**Critério de aceite:** schema aplica-se limpo (`rm biblioteca.db && npm run seed`); constraints violadas rejeitadas.

---

## Fase 3 — API v2 (P0)

| Endpoint | Descrição |
|---|---|
| `GET /api/livros?busca=&categoria_id=&autor_id=&idioma=&formato=&licenca=&page=&limit=` | Lista paginada (default `limit=24`, máx 100) com busca FTS5 |
| `GET /api/livros/:id` | Detalhe + `links` + autor/categoria/fonte |
| `GET /api/livros/:id/ler/:linkId` | Redirect 302 para a fonte e incrementa `leituras` |
| `POST/PUT/DELETE /api/livros` | CRUD manual (com validação de licença obrigatória) |
| `GET/POST /api/categorias`, `/api/autores` | CRUD (mantido do código atual) |
| `GET /api/fontes` | Fontes ativas |
| `POST /api/import` `{fonte_id, query}` → 202 + `GET /api/import/:id` | Fila de importação assíncrona |
| `GET /api/dashboard` | Totais por área/idioma/formato, licenças, leituras, fontes sincronizadas |
| `GET /api/cursos` / `POST /api/cursos` | Diretório curado de cursos gratuitos (Fase 7) |
| `GET /api/comunidade` | Devolve `{ url }` da comunidade WhatsApp (Fase 8) |
| `GET /api/comunidade/qrcode.svg` | QR code SVG gerado a partir do link configurado (Fase 8) |

**Critério de aceite:** paginação correta (`page`/`limit`/`total`), busca FTS5 retorna relevância, redirect 302 com contador, erro 400 em licença inválida.

---

## Fase 4 — Importadores de livros gratuitos, todas as áreas (P1)

Ordem de implementação (por fiabilidade legal/técnica):

1. **Project Gutenberg** (via gutendex.com, JSON, sem key; fallback: catálogo CSV oficial) — filtros por `topic`/`language` cobrem "todas as áreas"
2. **Open Library / Internet Archive** (`search.json`, sem key) — **regra:** só importar quando `ebook_access` permitir download/PD
3. **Wikisource** (MediaWiki API) — textos-fonte PT/BR
4. **Standard Ebooks** (OPDS apenas; bulk download exige associação — não scraping)
5. **Domínio Público (MEC)** — sem API estável: início com **curadoria manual**; scraping só depois de auditoria a `robots.txt`
6. **Google Books API** (key gratuita) — enriquecimento de metadados (capa, sinopse, ISBN)
7. **LibriVox** (API) — audiolivros PD

Requisitos de cada importador:
- Rate limit próprio (ex.: ≤ 2 req/s) + backoff em erro 429
- Idempotência via `UNIQUE (fonte_id, fonte_id_externo)` (upsert)
- **Licença obrigatória** — item sem licença clara é descartado e logado
- Cache de respostas (TTL 24h) em `cache/*.json`
- Registo em `import_jobs` com progresso

**Critério de aceite:** `POST /api/import {fonte: "gutenberg", query: "literatura brasileira"}` importa ≥ 20 livros com links e licenças; segunda execução não duplica.

---

## Fase 5 — Compliance e licenciamento (P0, contínuo)

- [x] Lista de fontes aprovadas documentada; lista negra de fontes piratas (ver `docs/FONTES-E-COMPLIANCE.md` e bloqueio anti-pirataria no código)
- [x] Respeito a `robots.txt` e Termos de Uso de cada fonte; User-Agent identificável (`LinoLivre/2.0`)
- [x] Campo `licenca` preenchido em 100% dos itens; página pública de "Créditos e Licenças" (`/creditos.html`) e endpoint `GET /api/creditos`
- [x] Atenção a prazos de domínio público (BR/PT/EUA: vida+70): obra PD num país pode não o ser noutro — quando divergente, manter só *link* à fonte original (zero armazenamento local, HTTP 302)
- [x] Privacidade: a aplicação **não recolhe** números de telefone nem mensagens do WhatsApp (só mostra o link da comunidade)

---

## Fase 6 — Frontend (P1)

- [x] Página **Acervo**: cards com capa, filtros (área/categoria, idioma, formato, licença), busca instantânea (FTS), paginação
- [x] Página **Livro**: modal dedicado de detalhes (`#modal-detalhes-livro`), sinopse, autor, licença, botões **"Ler online"** (leitor ultraleve no navegador ou redirecionamento 302 à fonte aberta) e **"Baixar"** por formato (PDF, EPUB, TXT, HTML)
- [x] Página **Início**: dashboard com totais por área, destaques e o bloco **"Junte-se à comunidade"** (botão + QR code, Fase 8)
- [x] Rodapé de todas as páginas: link curto "Comunidade WhatsApp" em `index.html`, `legal.html`, `termos.html` e `creditos.html`
- [x] Estilo: manter design system já existente (sem Tailwind extra; CSS atual é suficiente e responsivo)

---

## Fase 7 — Intermediário de cursos gratuitos (P2)

- [x] Tabela/CRUD `cursos` (título, área, plataforma, url, licença, nivel, descricao)
- [x] Diretório curado: **OER Commons** (recursos OER CC BY), **OpenStax** (livros e cursos CC BY), **MIT OCW** (cursos abertos CC BY-NC-SA), **CK-12** (CC BY-NC), **PhET** (simulações interativas CC BY)
- [x] Khan Academy: conteúdo aberto CC BY-NC-SA em matemática e ciências com links diretos
- [x] Plataformas nacionais e globais curadas (Coursera, edX, Harvard, Stanford, DIO, Fundação Bradesco, EV.G, Lumina, IFRS, Cursa em 5 idiomas)
- [x] Filtro por licença (`licenca=cc-by`, `licenca=cc-by-nc-sa`, etc.) e plataforma em Express e Cloudflare Workers (Hono + D1 + Supabase)
- [x] Redirecionamento 302 estrito (`/api/cursos/:id/acessar`), validação anti-SSRF e zero armazenamento local de binários/vídeos (conforme `AGENTS.md`)
- [x] Suíte de testes automatizados completa (119/119 testes passando, incluindo Teste 30)

**Critério de aceite atingido:** ≥ 30 cursos de ≥ 5 plataformas listados (acervo conta com mais de 8.500 cursos cadastrados em dezenas de plataformas globais), com links diretos oficiais e licenças verificadas.

---

## Fase 8 — Link e QR code da comunidade WhatsApp (P1, simples)

**Decisão do responsável:** só um **link** e um **QR code** que levam à comunidade do WhatsApp. Sem bot, sem Cloud API da Meta, sem webhook e sem guardar dados no servidor. As recomendações de livros acontecem dentro do grupo da comunidade, entre pessoas.

**Passos manuais (administrador, no telemóvel):**
1. No WhatsApp: separador **Comunidades** → criar a comunidade **"Lino Livre"** (descrição: *"Livros livres, para todos. Livros digitais e cursos gratuitos."*) e adicionar os grupos:
   - 📢 **Avisos Lino Livre**: o grupo de avisos que o WhatsApp cria sozinho (só administradores escrevem), para divulgar livros e cursos novos
   - 💡 **Lino, quero ler!**: recomendações e pedidos de livros pelos membros
   - 🎓 **Cursos Livres**: partilha de cursos gratuitos
2. Comunidade → **Convidar membros** → **Convidar por link** → copiar o link (`https://chat.whatsapp.com/XXXXXXXX`)
3. Guardar o link em `.env` como `WHATSAPP_COMMUNITY_URL=`

**Canal do WhatsApp (já criado):** "Livros e Cursos-Lino Livre", em `WHATSAPP_CHANNEL_URL`. O canal é de sentido único: só o administrador publica, e os seguidores não veem o número uns dos outros. Usar o **canal** para divulgar livros e cursos novos e o **grupo** para conversar e pedir livros ("Lino, quero ler!").

**Implementação (pequena):**
- O canal segue o mesmo padrão: `GET /api/canal` → `{ url }` e `GET /api/canal/qrcode.svg`, com o botão **"Seguir o canal Lino Livre"** ao lado do botão do grupo. Se a variável não estiver definida, o botão não aparece.
- `.env.example` (já criado): `WHATSAPP_COMMUNITY_URL` e `WHATSAPP_CHANNEL_URL`; os valores reais estão em `.env`
- QR codes estáticos já gerados em `materiais/` (grupo e canal, PNG 1024 px e SVG) para cartazes
- `GET /api/comunidade` → `{ url }`; devolve 404 se a variável não estiver definida (o frontend esconde o bloco)
- `GET /api/comunidade/qrcode.svg` → QR gerado no servidor com o pacote npm `qrcode` (`QRCode.toString(url, { type: 'svg' })`), com cache em memória
  - **Porquê gerar no servidor:** se o administrador **redefinir o link** no WhatsApp (o link antigo deixa de funcionar), basta mudar o `.env`; o QR atualiza-se sozinho. Um PNG estático exportado do app ficaria inválido.
  - Alternativa sem dependências: exportar o QR do próprio WhatsApp (Convidar por link → QR code) para `public/img/comunidade-qr.png`, aceitando o risco acima
- Frontend: botão verde **"Entrar na comunidade Lino Livre"** (`<a href="{url}" target="_blank" rel="noopener noreferrer">`) + `<img src="/api/comunidade/qrcode.svg" alt="QR code da comunidade WhatsApp">` (QR útil para quem está no computador; em telemóvel o botão basta)
- Opcional: página `/comunidade` para imprimir (cartaz para a escola, com o QR em tamanho grande)

**Cuidados:**
- O link permite que **qualquer pessoa** com acesso entre; ativar em **Configurações da comunidade** a aprovação de novos membros pelo administrador, se a comunidade for só para a escola
- Não pôr o link em repositórios públicos (usar `.env`; confirmado que `.env` já está no `.gitignore`)

**Critério de aceite:** com `WHATSAPP_COMMUNITY_URL` definido, o botão abre a comunidade e o QR, lido com a câmara do telemóvel, abre o mesmo convite; sem a variável, o bloco não aparece e não há erros.

---

## Fase 9 — Testes e verificação (P1)

**Automatizados (`npm test`), substituindo os 6 testes de empréstimo:**
1. CRUD de livro digital com licença (recusa licença inválida)
2. Busca FTS5 encontra por título e autor
3. Paginação (`page`/`limit`/`total`)
4. Redirect `/ler/:linkId` = 302 e incrementa `leituras`
5. Importação idempotente (segunda execução não duplica; mock HTTP)
6. DELETE de livro remove links em cascata
7. Dashboard retorna métricas por área/idioma
8. `GET /api/comunidade` e `GET /api/canal` devolvem o URL configurado e 404 sem configuração; os `qrcode.svg` devolvem `Content-Type: image/svg+xml`

**Manual:**
1. `npm run seed && npm start` → `http://localhost:3000`
2. Importar lote do Gutenberg (ex.: "ficção científica", "filosofia", "didáticos")
3. Buscar, filtrar por área/idioma/formato, abrir "Ler online", confirmar contador
4. Verificar página de Créditos/Licenças
5. (Fase 8) Ler o QR com a câmara do telemóvel e confirmar que abre o convite da comunidade

---

## Fase 10 — Documentação e arranque (P1)

- Nome **Lino Livre** aplicado ao `<title>` e ao cabeçalho de `public/index.html`, ao `README.md` e ao campo `name` do `package.json` (`lino-livre`)
- README atualizado ao novo escopo (funções, endpoints, fontes, licenças, como importar)
- `.env.example` com `WHATSAPP_COMMUNITY_URL` e a chave opcional da Google Books — sem segredos commitados
- `git commit` por fase, no ramo `main` existente

---

## Riscos registados

| Risco | Mitigação |
|---|---|
| `node:sqlite` em desenvolvimento ativo | Fixar versão Node ≥ 22.5; encapsular em `src/database/index.js` (já feito) para fácil troca por `better-sqlite3` |
| gutendex é API **não-oficial** do Gutenberg | Fallback ao catálogo CSV/RDF oficial; não criticamente acoplado |
| Domínio Público sem API | Curadoria manual inicial; scraping só após auditoria legal |
| Direitos autorais por jurisdição | Licença obrigatória + link à fonte quando houver dúvida |

---

| Link de convite redefinido ou exposto | Link em `.env`, QR gerado dinamicamente, aprovação de membros ativada |

**Ordem de execução recomendada:** F0 → F1 → F2 → F3 → F5(paralelo) → F9(core) → F4 → F6 + F8 → F7 → F10.
**Estimativa:** ~3–4 dias de trabalho agente até ao MVP (F0–F3+F5+F9), ~1 semana para o produto completo.
