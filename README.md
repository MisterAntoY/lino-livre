# Lino Livre — Livros Livres, Para Todos

> *"Livros livres, para todos."*

Plataforma aberta, ultrassimples e direta para distribuição de **livros digitais** e **cursos gratuitos**, voltada para escolas, estudantes e a comunidade em geral. O modelo de empréstimo físico e controle de inventário foi integralmente descartado em prol do acesso livre, irrestrito e legal.

---

## 🌟 Destaques do Projeto

1. **Guia de TI — Principal Fonte de Cursos, Livros Técnicos & Roadmaps**:
   Integração direta com o portal **[Guia de TI](https://guiadeti.com.br)** (`https://guiadeti.com.br/mapa-do-site/`), trazendo catálogo completo com deep-links verificados para cursos modernos (*Python 2025, Claude & IA, DevOps, Power BI 2025, Streamlit, Linux, TypeScript, Laravel 11*), roadmaps de carreira (*AI Expert, Roadmap.sh, TechGuide.sh, Trilha Info*) e sincronização via feeds RSS 2.0 oficiais (`/cursos/feed/`, `/roadmaps/feed/`, `/feed/`).
2. **Capas Originais Históricas Reais**:
   Digitalizações autênticas de primeiras edições em domínio público (*Machado de Assis 1881 e 1899, Aluísio Azevedo 1890, Lima Barreto 1915, Castro Alves 1870, José de Alencar 1857 e 1865*), armazenadas localmente para velocidade e preservação histórica.
3. **Distribuição Multi-formato**:
   Disponibilização de obras em formatos abertos: **PDF**, **EPUB**, **HTML/Web** e **TXT**. Cada acesso via link gera redirecionamento HTTP 302 direto à fonte oficial com incremento atômico de leituras.
4. **Busca FTS5 (Full-Text Search)**:
   Mecanismo de busca textual do SQLite FTS5 integrado, sincronizado automaticamente por triggers ao cadastrar ou atualizar obras.
5. **Diretório Expandido de Cursos Gratuitos**:
   Mais de 45 cursos curados e roadmaps, liderados pelo **Guia de TI** e complementados por grandes instituições educacionais abertas (*Harvard CS50, MIT OpenCourseWare, OpenStax, PhET, Khan Academy, CK-12*).
6. **Comunidade & Canal WhatsApp**:
   Integração direta sem coleta de dados do usuário: links diretos e geração dinâmica de QR codes em SVG pelo servidor (`/api/comunidade/qrcode.svg` e `/api/canal/qrcode.svg`), com cache em memória e atualização automática ao alterar o `.env`.
7. **Compliance & Licenças**:
   Todos os itens exigem licença legal obrigatória (`dominio-publico`, `cc0`, `cc-by`, `cc-by-sa`, `cc-by-nc`, `outro`). Fontes piratas são terminantemente proibidas.
8. **Arquitetura de Intermediário Sem Armazenamento**:
   O servidor e o banco de dados **não armazenam nenhum arquivo ou conteúdo de livro**. A plataforma atua estritamente como intermediária de links, indexando recursos armazenados em servidores e fontes externas.

---

## ⚖️ Arquitetura & Defesa Legal (Servidor Intermediário)

> **AVISO LEGAL E ARQUITETÓNICO:** O **Lino Livre** é uma plataforma que atua exclusivamente como **intermediária e indexadora de links**.
> 
> - **Zero Armazenamento Local:** Nenhum arquivo de livro (PDF, EPUB, TXT ou binários) é armazenado no servidor ou no banco de dados do projeto.
> - **Hospedagem Externa:** Todos os livros disponibilizados no catálogo estão hospedados fora da nossa infraestrutura, em servidores de terceiros e repositórios públicos externos.
> - **Intermediação de Acesso:** Os endpoints do servidor realizam apenas o redirecionamento (HTTP 302) do visitante para a fonte externa responsável pela disponibilização do conteúdo.
> - **Fundamento Jurídico:** Esta arquitetura garante a proteção e defesa legal da plataforma em caso de processos ou disputas judiciais, uma vez que o servidor não detém, não guarda e não distribui diretamente arquivos com direitos autorais a partir de infraestrutura própria.
8. **Site Multilíngue (i18n)**:
   Interface traduzida em **5 idiomas** — Português, English, Deutsch, 中文 e Français — com seletor no cabeçalho, sinopses dos livros traduzidas, `<html lang>` e `<title>` atualizados, fontes Noto Sans/Serif SC para chinês e memória da escolha do visitante.

---

## 🌐 Idiomas (i18n)

O site é uma única aplicação com seletor de idioma no cabeçalho.

| Arquivo | Idioma |
|---|---|
| `public/locales/pt.json` | Português (base / fallback) |
| `public/locales/en.json` | English |
| `public/locales/de.json` | Deutsch |
| `public/locales/zh.json` | 中文 (Mandarim) |
| `public/locales/fr.json` | Français |

**Como funciona**

- `public/js/i18n.js` carrega o JSON do idioma, aplica os atributos `data-i18n` / `data-i18n-ph` / `data-i18n-title` / `data-i18n-alt` / `data-i18n-aria` do HTML e expõe `t('chave')` para o JavaScript.
- A escolha fica salva em `localStorage` (`lino_lang`) e também na URL (`?lang=de`), permitindo compartilhar links em um idioma específico.
- Padrão: **português**. A detecção automática pelo navegador está comentada em `detectarIdioma()` — basta descomentar para ativar.
- `synopses` no JSON traduz as sinopses por `id` do livro; se um id não existir, o texto do banco é usado automaticamente.
- As seções `categories`, `areas`, `levels` e `licenses` traduzem os rótulos vindos do banco mantendo o valor original como chave de filtro.

**Para adicionar um 6º idioma**

1. Copie `public/locales/pt.json` para `public/locales/<código>.json` e traduza os valores.
2. Adicione o código em `IDIOMAS`, `FLAGS` e `LABELS_PADRAO` em `public/js/i18n.js` (o seletor é montado sozinho).

---

## 📡 Endpoints da API v2

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/livros` | Lista paginada (`page`, `limit`, `total`) com busca FTS5 e filtros por categoria, formato, idioma e licença |
| `GET` | `/api/livros/:id` | Detalhes da obra, links de download, autor, categoria e fonte |
| `GET` | `/api/livros/:id/ler/:linkId` | Redirecionamento 302 para a fonte e incremento atômico de leituras |
| `POST` | `/api/livros` | Cadastro com validação de licença obrigatória |
| `PUT` | `/api/livros/:id` | Atualização dos metadados da obra |
| `DELETE` | `/api/livros/:id` | Remoção da obra e links em cascata |
| `GET` | `/api/cursos` | Diretório de cursos livres com filtro por `area` e `nivel` |
| `POST` | `/api/cursos` | Cadastro de novo curso no diretório |
| `GET` | `/api/fontes` | Lista de fontes abertas ativas |
| `POST` | `/api/import` | Disparo assíncrono de importação idempotente (Gutenberg, Open Library) |
| `GET` | `/api/import/:id` | Status e progresso do job de importação |
| `GET` | `/api/dashboard` | Métricas do acervo: totais por área, idioma, formato, licenças e fontes |
| `GET` | `/api/comunidade` | Devolve a URL da comunidade WhatsApp (ou 404 se não configurado) |
| `GET` | `/api/comunidade/qrcode.svg`| QR code dinâmico em SVG para a comunidade |
| `GET` | `/api/canal` | Devolve a URL do canal do WhatsApp (ou 404 se não configurado) |
| `GET` | `/api/canal/qrcode.svg` | QR code dinâmico em SVG para o canal |

---

## 🚀 Como Iniciar

### 1. Pré-requisitos
- Node.js ≥ 22 (recomendado Node 22+)
- Sem necessidade de bancos externos; utiliza `node:sqlite` nativo com FTS5.

### 2. Configuração do Ambiente
Copie o arquivo de exemplo e defina os links da sua comunidade/canal:
```bash
cp .env.example .env
```

### 3. Instalação e Execução
```bash
# Instalar dependências (express, qrcode)
npm install

# Popular banco com obras, capas originais e cursos
npm run seed

# Iniciar o servidor
npm start
```
Acesse no navegador: **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Testes Automatizados

A aplicação conta com uma suite completa de testes cobrindo todas as fases do plano:

```bash
npm test
```

### Critérios Validados:
- [x] CRUD de livro digital com recusa de licenças inválidas.
- [x] Busca FTS5 por título e autor.
- [x] Paginação correta (`page`, `limit`, `total`).
- [x] Redirecionamento 302 em leitura com contador atômico.
- [x] Importação idempotente sem duplicação de registros.
- [x] Deleção em cascata (`ON DELETE CASCADE`) de livros e links.
- [x] Agregações do dashboard por área, idioma e formato.
- [x] Geração e entrega de QR codes SVG para WhatsApp com fallback 404.
- [x] Zero referências a termos ou lógica de empréstimo físico no código.

---

## 📜 Licença, Armazenamento & Isenção Legal
- **Armazenamento:** O servidor e o banco de dados **não armazenam nem hospedam ficheiros de livros**. O sistema funciona exclusivamente como **intermediário de links externos**.
- **Textos e capas de obras clássicas:** **Domínio Público**.
- **Cursos e simuladores:** **Creative Commons** e licenças educacionais das respectivas instituições parceiras.
- **Plataforma:** Código aberto sob licença MIT/ISC.
