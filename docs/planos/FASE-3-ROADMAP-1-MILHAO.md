# 🚀 Lino Livre — Plano de Execução da Fase 3: Rumo a 1.000.000 de Livros

> **Meta Global:** 10.000.000 de Livros Digitais Gratuitos  
> **Status Atual:** 100.807 livros indexados (Fase 2 concluída com sucesso!)  
> **Objetivo da Fase 3:** Escalar o acervo para **1.000.000 de livros** indexados com busca rápida e conformidade total com `AGENTS.md`.

---

## 🏛️ 1. Princípios Invioláveis de Arquitetura (`AGENTS.md`)

1. **Zero Armazenamento Local de Arquivos Binários**:
   - Nenhum PDF, EPUB, TXT ou áudio é armazenado nos servidores do Lino Livre.
   - O banco de dados armazena **estritamente metadados** (título, autor, ano, idioma, licença, sinopse, capa) e **links de redirecionamento HTTP 302**.
2. **Papel Exclusivo de Intermediário**:
   - Toda leitura ocorre diretamente no leitor oficial do repositório de origem (Internet Archive, Project Gutenberg, DOAB, Europeana, etc.).

---

## 📊 2. De Onde Virão os 900.000 Livros da Fase 3?

| Fonte Oficial | Volume Alvo | Tipo de Conteúdo / Licenças | Mecanismo de Ingestão |
| :--- | :---: | :--- | :--- |
| **Open Library / Internet Archive** | **700.000** | Obras clássicas e históricas em domínio público com leitura online no Archive.org | Stream de metadados do dump de edições (`ol_dump_editions`) filtrado para obras com `ocaid` (texto integral aberto) |
| **Europeana (Bibliotecas Nacionais Europeias)** | **100.000** | Obras digitalizadas pelas Bibliotecas Nacionais de Portugal, França, Espanha e Alemanha | API REST Open Data da Europeana (licenças Domínio Público / Public Domain Mark) |
| **StoryWeaver (Pratham Books)** | **50.000** | Literatura infantil e infanto-juvenil em mais de 300 idiomas (inclusive línguas africanas e indígenas) | Catálogo aberto sob licença CC-BY 4.0 |
| **SciELO Livros & OAPEN** | **50.000** | Monografias académicas, teses e publicações universitárias revisadas por pares | Protocolo OAI-PMH e exportações institucionais |

---

## ⚡ 3. Infraestrutura & Desempenho para 1 Milhão de Livros

- **Tamanho dos Dados**:
  - 1.000.000 de registos de metadados ocupam $\approx 650 \text{ MB}$ na Cloudflare D1.
  - A cota gratuita da Cloudflare D1 suporta até **5.000 MB (5 GB)**, utilizando menos de 15% do armazenamento.
- **Otimização de Leituras e Consultas**:
  - Consultas paginadas usando índices otimizados por `id`, `idioma` e `categoria_id`.
  - Cache de borda nos Cloudflare Workers (`Cache-Control: public, max-age=600`) para consultas populares e estatísticas.
- **Divisão em Lotes Autónomos**:
  - Lotes de 2.000 a 5.000 livros por ficheiro SQL, cada um auto-suficiente com seus respetivos autores e links.
