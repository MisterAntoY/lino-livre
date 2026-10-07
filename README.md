# BiblioDigital — Plataforma de Distribuição de Livros Digitais Online

Sistema escolar moderno para disponibilização, distribuição, leitura e download online de livros digitais (e-books nos formatos **PDF**, **EPUB** e **Web**).

O sistema substitui o modelo tradicional de empréstimos físicos por um acervo digital livre, permitindo que os estudantes leiam obras diretamente no navegador ou façam o download integral dos arquivos.

---

## 🚀 Funcionalidades

### 📖 Catálogo Digital de E-books
- Navegação visual por cards de livros digitais com imagem de capa, sinopse, formato e autor.
- Filtros instantâneos por gênero/categoria, autor e formato digital (**PDF**, **EPUB**, **Web**).
- Busca em tempo real por título, autor ou palavras-chave.
- Cadastro e publicação de novos e-books com links de download ou textos integrais.

### 👓 Leitor Digital Web Embutido
- Leitura online e imediata de qualquer obra diretamente no navegador, sem necessidade de aplicativos externos.
- Interface limpa com tipografia serifada confortável para leitura prolongada.
- Controle dinâmico de tamanho de fonte (`A+` / `A-`).
- Botão de download rápido disponível dentro do próprio leitor.

### 📥 Distribuição & Download Livre
- Download instantâneo de e-books em um clique.
- Contadores atômicos e em tempo real de downloads e leituras online por livro.
- Registro histórico de acessos escolares (com nome do aluno e turma).

### 📊 Painel de Métricas de Engajamento
- Indicadores globais: Total de obras digitais, total de downloads realizados, leituras online e índice de engajamento.
- Tabela de acessos e leituras recentes de alunos em tempo real.
- Ranking dos livros digitais mais acessados e populares.

### ✍️ Autores e Categorias
- Gestão completa de autores e biografia.
- Categorização temático-pedagógica (Clássicos Brasileiros, Ficção Científica, Romance, Teatro & Poesia, Didáticos).

---

## 🛠️ Tecnologias

- **Backend**: Node.js (v22+ / v26) e Express 5
- **Banco de Dados**: SQLite nativo via `node:sqlite` (sem dependências de compilação C++)
- **Frontend**: HTML5 responsivo, CSS3 com design system moderno e JavaScript Vanilla
- **Testes Automatizados**: `node:test` e `node:assert` (testes unitários e de integração HTTP)

---

## 🏃 Como Rodar a Aplicação

### 1. Instalar dependências
```bash
npm install
```

### 2. Popular o catálogo digital inicial (Seed)
```bash
npm run seed
```

### 3. Iniciar o servidor
```bash
npm start
```

Acesse em seu navegador: **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Testes Automatizados

Para rodar a suíte completa de testes:
```bash
npm test
```

---

## 📡 Endpoints da API REST

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/dashboard` | Métricas de distribuição, formatos e acessos recentes |
| `GET` | `/api/livros` | Lista catálogo digital com filtros (`busca`, `categoria_id`, `autor_id`, `formato`) |
| `GET` | `/api/livros/:id` | Detalhes do livro digital e conteúdo para leitura |
| `POST` | `/api/livros` | Publica uma nova obra digital |
| `PUT` | `/api/livros/:id` | Atualiza dados da obra digital |
| `DELETE` | `/api/livros/:id` | Remove a obra digital do catálogo |
| `POST` | `/api/livros/:id/download` | Registra e processa download do e-book |
| `POST` | `/api/livros/:id/ler` | Registra e abre conteúdo para leitura online |
| `GET` | `/api/autores` | Lista autores e contagem de obras digitais |
| `POST` | `/api/autores` | Cadastra autor |
| `GET` | `/api/categorias` | Lista categorias e contagem de e-books |
| `POST` | `/api/categorias` | Cadastra categoria |
