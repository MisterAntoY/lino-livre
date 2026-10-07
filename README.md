# Biblioteca Escolar — Gestão de Acervo e Empréstimos

Sistema completo de gestão para bibliotecas escolares, contemplando cadastro e controle de **Livros**, **Autores**, **Categorias** e o fluxo de **Empréstimos e Devoluções** de alunos.

Desenvolvido com **Node.js**, **Express**, **SQLite nativo (`node:sqlite`)** e interface Web responsiva.

---

## Funcionalidades

### 📚 Acervo de Livros
- Cadastro, edição, visualização e exclusão de obras literárias e acadêmicas.
- Controle rigoroso de estoque: quantidade total vs. quantidade disponível.
- Vínculo direto com Autor e Categoria/Gênero.
- Busca em tempo real por título, autor ou código ISBN.
- Filtros por categoria e opção para listar apenas livros com exemplares disponíveis.

### ✍️ Autores
- Cadastro de autores com nome, nacionalidade e biografia/notas.
- Contagem automática de obras cadastradas no acervo por autor.

### 🏷️ Categorias e Gêneros
- Classificação temática (Literatura Brasileira, Ficção Científica, Distopia, Romance Clássico, etc.).
- Identificação rápida do número de livros associados a cada categoria.

### 🔄 Empréstimos e Devoluções
- Registro de novos empréstimos para alunos (com nome e matrícula).
- Validação automática de disponibilidade em estoque (impede empréstimo se esgotado).
- Decremento automático do estoque ao emprestar e reposição imediata ao devolver.
- Cálculo de prazos com definição flexível de devolução (7, 14, 21 ou 30 dias).
- Monitoramento de status:
  - **Ativo**: Dentro do prazo de devolução.
  - **Atrasado**: Prazo de devolução expirado (sinalização destacada no painel).
  - **Devolvido**: Exemplar retornado e registrado com data de devolução real.
- Ações rápidas: Devolução em 1 clique e Renovação (+7 dias).

### 📊 Painel de Controle (Dashboard)
- Indicadores em tempo real: Total de títulos, total de exemplares, livros disponíveis, empréstimos ativos e atrasados.
- Tabela de movimentações recentes e ranking dos livros mais emprestados.

---

## 🛠️ Tecnologias Utilizadas

- **Runtime**: Node.js (v22+ / v26)
- **Servidor HTTP & API REST**: Express 5
- **Banco de Dados**: SQLite através da biblioteca nativa `node:sqlite` (sem dependência de compiladores nativos externos)
- **Frontend**: HTML5, CSS3 moderno com design system e JavaScript Vanilla integrado
- **Testes**: `node:test` e `node:assert` (testes unitários e de integração HTTP)

---

## 🚀 Como Executar o Projeto

### 1. Instalar as dependências
```bash
npm install
```

### 2. Popular o banco com dados iniciais (Seed)
```bash
npm run seed
```

### 3. Iniciar o servidor
```bash
npm start
```
Acesse a aplicação no navegador em: **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Executando os Testes Automatizados

O projeto possui suíte de testes unitários para as regras de negócio e testes de integração para as rotas da API:

```bash
npm test
```

---

## 📡 Endpoints da API REST

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/dashboard` | Métricas consolidadas e estatísticas |
| `GET` | `/api/livros` | Lista livros (filtros: `busca`, `categoria_id`, `autor_id`, `apenas_disponiveis`) |
| `POST` | `/api/livros` | Cadastra um novo livro |
| `PUT` | `/api/livros/:id` | Atualiza dados e estoque de um livro |
| `DELETE` | `/api/livros/:id` | Remove um livro (bloqueado se houver empréstimo ativo) |
| `GET` | `/api/autores` | Lista autores e total de obras |
| `POST` | `/api/autores` | Cadastra autor |
| `GET` | `/api/categorias` | Lista categorias e total de obras |
| `POST` | `/api/categorias` | Cadastra categoria |
| `GET` | `/api/emprestimos` | Lista empréstimos (filtros: `status`, `busca`) |
| `POST` | `/api/emprestimos` | Registra novo empréstimo (decrementa estoque) |
| `POST` | `/api/emprestimos/:id/devolver` | Registra devolução (repõe estoque) |
| `POST` | `/api/emprestimos/:id/renovar` | Renova prazo de devolução (+7 dias) |
