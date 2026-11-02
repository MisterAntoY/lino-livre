# 📚 Plano Arquitetural Consolidado: Servidor MCP Lino Livre
**Projecto Oficial:** `lino-livre-mcp` (Repositório Dedicado: [`https://github.com/MisterAntoY/lino-livre-mcp`](https://github.com/MisterAntoY/lino-livre-mcp))  
**Ecossistema:** Lino (Governança Unificada Lino.livre + Lino.digital no Paperclip)  
**Metodologia de Alinhamento:** Grill-Me (Decisões Estruturadas Q1 a Q11 Consolidadas)  
**Data:** 29 de Outubro de 2026  
**Status:** ESPECIFICAÇÃO FINAL APROVADA  

---

## 1. Resumo das Decisões Estruturais (Matriz Grill-Me)

| Questão | Tópico | Decisão Aprovada | Justificação Arquitetural |
| :--- | :--- | :--- | :--- |
| **Q1** | Execução e Hosting | **Híbrido (Worker SSE + CLI Stdio)** | Atende agentes remotos (web) e editores locais (Cursor/VS Code). |
| **Q2** | Mecanismo de Busca | **Busca Lexical FTS5 Pura (BM25)** | Respostas em <10ms, determinístico, leve e sem custos de vetores. |
| **Q3** | Retorno de Dados | **Ficha Catalográfica + Links CDN** | Economia máxima de tokens para os modelos de IA. |
| **Q4** | Modelo de Acesso | **100% Aberto e Gratuito** | Foco em impacto social, literacia e inclusão em Angola. |
| **Q5** | Organização do Código | **Core TypeScript Agnóstico** | `core.ts` unificado servindo `stdio.ts` e `sse.ts`. |
| **Q6** | Tratamento de Texto | **FTS5 Simples e Direto** | Busca natural eficiente sem regras manuais frágeis. |
| **Q7** | Armazenamento de Arquivos | **Cloudflare R2 + Fallbacks** | CDN sem custo de saída (egress) com espelho seguro. |
| **Q8** | Integração Lino.digital | **Link Embutido nos Metadados** | Zero overhead de ferramentas extras para o LLM. |
| **Q9** | Estrutura de Repositório | **Repositório Separado (`lino-livre-mcp`)** | Desacoplamento total, facilidade de deploy e open source. |
| **Q10** | Mapeamento de Sinergia | **Contextual por Categoria (UTM)** | Livros de código sugerem Dev IA; arte sugere Canva/CapCut. |
| **Q11** | Proteção de Tráfego | **Cloudflare Edge Rate Limit (60 req/min)** | Proteção nativa no edge sem onerar o servidor. |

---

## 2. Arquitetura do Sistema e Fluxo de Dados

```mermaid
graph TD
    User["👨‍🎓 Aluno / Professor / Dev"] --> LLM["🤖 Agente LLM<br/>(Hermes / Claude / Cursor / Antigravity)"]
    
    subgraph "Repositório Dedicado (lino-livre-mcp)"
        LLM <-->|Protocolo MCP (JSON-RPC)| Transport["Camada de Transporte MCP"]
        Transport --> Stdio["stdio.ts (Local CLI)<br/>npx @lino/mcp-server"]
        Transport --> SSE["sse.ts (Cloudflare Worker)<br/>https://mcp.lino.livre/sse"]
        
        Stdio --> Core["core.ts (Lógica Central de Ferramentas & Schemas Zod)"]
        SSE --> Core
    end

    subgraph "Infraestrutura de Dados & Armazenamento"
        Core --> DB["🔍 SQLite FTS5 / D1 Database<br/>(860+ Livros Indexados)"]
        Core --> R2["📦 Cloudflare R2 CDN<br/>(Downloads Diretos de PDFs e ePubs)"]
    end

    subgraph "Sinergia de Ecossistema Lino"
        Core -. "Link nos Metadados (lino_perk_url)" .-> LinoDigital["🛒 Lino.digital<br/>(Assinaturas Digitais com Desconto)"]
    end
```

---

## 3. Especificação Final das Ferramentas MCP (Tools)

O repositório `lino-livre-mcp` exportará duas ferramentas essenciais e enxutas:

### 1. `search_books`
Pesquisa rápida no catálogo através do motor SQLite FTS5.
- **Entrada:**
  ```typescript
  {
    query: string;           // Título, autor ou assunto
    category?: string;        // Ex.: "Ciência de Dados", "Romance", "Apoio Pedagógico"
    limit?: number;          // Padrão: 10 (máx: 30)
  }
  ```
- **Saída:**
  ```json
  [
    {
      "id": "19",
      "titulo": "A Regra é Não Ter Regras",
      "autor": "Reed Hastings",
      "categoria": "Metodologias Ágeis & Carreira Tech",
      "ano": "2020",
      "paginas": "231",
      "download_url": "https://cdn.lino.livre/livros/19.pdf",
      "lino_perk_url": "https://lino.digital/?pack=dev-ia&ref=lino-livre"
    }
  ]
  ```

### 2. `get_book_details`
Recupera a ficha catalográfica completa de um livro específico.
- **Entrada:**
  ```typescript
  {
    book_id: string | number; // ID único do livro
  }
  ```
- **Saída:** Metadados estruturados, licença (Domínio Público, Open Source), formatos disponíveis (PDF, ePub) e links canônicos de download.

---

## 4. Mapeamento de Sinergia com o `Lino.digital` (Q10-A)

Cada resultado entregue pelo servidor MCP inclui dinamicamente o campo `lino_perk_url`, mapeado da seguinte forma:

| Categoria do Livro | Pacote Recomendado no Lino.digital | URL Gerado nos Metadados |
| :--- | :--- | :--- |
| **Tecnologia, DevOps, Cloud, AI, Código** | Pack Dev & IA (GitHub Copilot, Cursor, ChatGPT, JetBrains) | `https://lino.digital/?pack=dev-ia&ref=mcp` |
| **Design, Vídeo, Criatividade, Artes** | Pack Visual Creator (Canva Pro, CapCut Pro, Freepik) | `https://lino.digital/?pack=creator-visual&ref=mcp` |
| **Metodologias, Gestão, Negócios** | Pack Produtividade (Notion, Office, Google One) | `https://lino.digital/?pack=produtividade&ref=mcp` |
| **Literatura, Clássicos, Geral** | Plataforma Global Lino | `https://lino.digital/?ref=mcp` |

---

## 5. Estrutura do Novo Repositório (`MisterAntoY/lino-livre-mcp`)

```
lino-livre-mcp/
├── package.json               # Dependências (@modelcontextprotocol/sdk, zod, hono)
├── tsconfig.json
├── wrangler.jsonc             # Deploy do worker SSE no Cloudflare
├── bin/
│   └── lino-livre-mcp.js      # Ponto de entrada CLI (Stdio)
├── src/
│   ├── core.ts                # Definição das ferramentas, schemas e queries FTS5
│   ├── stdio.ts               # Adaptador para execução local (StdioServerTransport)
│   ├── sse.ts                 # Adaptador para rota HTTP/SSE (SSEServerTransport)
│   ├── db.ts                  # Conexão com SQLite / Cloudflare D1
│   └── perks.ts               # Mapeamento de links Lino.digital por categoria
├── tests/
│   ├── fts-search.test.ts     # Testes de busca textual em milissegundos
│   └── mcp-contract.test.ts   # Validação de conformidade com a especificação MCP
└── README.md                  # Documentação e instruções de uso (Claude, Cursor, Hermes)
```

---

## 6. Governança e Próximos Passos
1. **Governança Unificada:** O repositório `lino-livre-mcp` fica subordinado à diretoria executiva da Lino no Paperclip sob o comando do **Lino (CEO)**.
2. **Execução Futura:** Quando o Board autorizar o início do desenvolvimento, a criação e implementação do repositório será iniciada sem retrabalho, seguindo à risca este blueprint aprovado.
