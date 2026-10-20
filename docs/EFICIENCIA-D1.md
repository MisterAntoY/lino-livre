# Eficiência da D1 — diagnóstico e solução

> Medição: 2026-10-20, via Cloudflare GraphQL Analytics
> (`d1AnalyticsAdaptiveGroups` / `d1QueriesAdaptiveGroups`).

## Diagnóstico

| Métrica (24h) | Valor | Limite free tier |
|---|---:|---:|
| Linhas lidas | **15.596.038** | 5.000.000/dia |
| Linhas escritas | **912.513** | 100.000/dia |
| Pedidos ao Worker | 124 | — |
| CPU p50 / p99 | 2,5 ms / 33,1 ms | — |

A cota foi excedida **com apenas 124 pedidos**: cada *cache miss* das rotas de
leitura varria a tabela `livros` inteira (104.848 linhas).

Principais ofensores (por cache miss):

| Rota | Varredura |
|---|---:|
| `/api/dashboard` | ~700.000 linhas (6 varreduras + JOINs) |
| `/api/categorias` | 104.848 (JOIN + GROUP BY) |
| `/api/fontes` | 104.848 (JOIN + GROUP BY) |
| `/api/livros` (COUNT) | 104.848 |
| `/api/autores` | 104.848 |

## Solução aplicada

1. **Agregados pré-calculados** (`migrations/0003_estatisticas.sql`):
   - `estatisticas` — totais gerais (livros, autores, cursos, leituras…).
   - `contadores` — totais por dimensão (idioma, licença, categoria, fonte,
     formato, tipo de curso).
   - `autor_totais` (`migrations/0005_indices_performance.sql`) — livros por
     autor, para que `/api/autores` não junte a tabela de livros.
2. **Cron diário às 00:10 UTC** (`triggers.crons` no `wrangler.jsonc`):
   recalcula tudo logo após o reset da cota, em 3 lotes para respeitar o
   tempo máximo por invocação.
3. **Cache de borda** (Cache API) em todas as rotas públicas de leitura, com
   TTL de 1 hora (`stale-while-revalidate=86400`).
4. **Contagem sem varredura**: `/api/livros` lê o total de `estatisticas` ou
   `contadores` quando o filtro é simples; a busca conta na FTS (uma linha
   por livro); só faz `COUNT(*)` em filtros complexos, com estimativa de
   recurso se a cota falhar.
5. **Índices de performance** (`migrations/0005_indices_performance.sql`):
   os índices compostos de popularidade (`leituras DESC, titulo ASC`) e por
   dimensão existiam no banco local de desenvolvimento mas **nunca foram
   levados às migrações do D1** — a base remota ordenava 104.848 linhas por
   pedido. Também `links_livros(formato, livro_id)`, `autores(nome)` e
   `autores(nome COLLATE NOCASE)`.
6. **Degradação elegante**: em erro de cota, as rotas devolvem `[]` com
   `X-Data-Status: degraded` (HTTP 200) em vez de 500; o dashboard usa um
   fallback estático. Recupera automaticamente após o reset.

## Antes → depois (por cache miss)

| Operação | Antes | Depois |
|---|---:|---:|
| Dashboard | ~700.000 | ~330 |
| Categorias | 104.848 | 29 |
| Fontes | 104.848 | 32 |
| Total de livros | 104.848 | 1 |
| Cursos (lista completa) | 7.501 | 7.501 (cache 1h) |

Estimativa de consumo diário após a correção: **< 1,2 M linhas lidas**
(cron ~765k + cache misses), dentro do limite de 5 M.

## Ciclo seguinte (20/10/2026, medição em base sintética de 104.848 livros)

A medição do ciclo anterior cobriu o dashboard e as rotas de contagem, mas
não as **consultas de listagem** — que, sem índice de ordenação, faziam
`SCAN` + `TEMP B-TREE FOR ORDER BY` sobre a tabela inteira. Medição em base
sintética com a dimensão real da D1 (104.848 livros, 37.919 autores,
210.000 ligações):

| Operação | Antes | Depois | Plano depois |
|---|---:|---:|---|
| Listagem (`ORDER BY leituras DESC, titulo ASC LIMIT 12`) | 284,26 ms | **0,12 ms** | `SCAN l USING INDEX idx_livros_popularidade` |
| `/api/autores` (contagem por autor) | 435,05 ms | **0,89 ms** | `SCAN a USING INDEX idx_autores_nome` |
| `/api/autores?nome=` (correspondência exacta) | 6,89 ms | **0,10 ms** | `SEARCH a USING INDEX idx_autores_nome_nocase` |
| `/api/creditos` (distribuição de licenças) | 120,56 ms | **0,05 ms** | `SEARCH contadores USING INDEX …` |
| Listagem com filtro de idioma + ordenação | — | **0,05 ms** | `SEARCH l USING INDEX idx_livros_idioma_popularidade` |

O "antes" da listagem lia as 104.848 linhas da tabela **só para ordenar**;
com o índice lê as 12 linhas da página.

### Alterações de comportamento

- `/api/autores` deixou de fazer `LEFT JOIN livros … GROUP BY` (uma varredura
  de 104.848 linhas por pedido) e passa a ler `autor_totais` (índice).
  Sem a tabela de agregados, conta apenas os autores da página devolvida.
- `/api/autores` passou a ter **limite por omissão de 500** (antes devolvia
  os ~37.919 autores numa só resposta). A paginação (`?limit`/`?page`)
  mantém-se; `?nome=` faz correspondência exacta indexada.
- `/api/livros?busca=` conta o total na FTS; `/api/livros?formato=` usa o
  contador pré-computado.
- `/api/creditos` lê `estatisticas`/`contadores` em vez de `COUNT(*)` +
  `GROUP BY` sobre a tabela de livros.
- O formulário de administração deixa de trazer todos os autores para
  procurar um nome: usa `/api/autores?nome=`.

### Cobertura de regressão

`test/worker.test.js`, cenário 8, assegura que nenhuma rota volta a
executar `COUNT(*)`/`GROUP BY` sobre a tabela `livros` nem a juntar
`livros` em `/api/autores`, e que a migração 0005 mantém os índices
declarados.

## Operação

- Recalcular manualmente (após uma importação):
  ```bash
  npx wrangler d1 execute lino-livre-db --remote --command \
    "SELECT COUNT(*) FROM estatisticas; SELECT COUNT(*) FROM contadores;"
  ```
  ou aguardar o cron das 00:10 UTC.
- Migração: `npx wrangler d1 migrations apply lino-livre-db --remote`.
- Se o volume crescer, o plano Workers Paid remove o limite diário de linhas
  (25 mil milhões incluídas/mês) e é a recomendação para produção séria.

## SEO adicionado no mesmo ciclo

- `title` e `description` otimizados (África + lusofonia + domínio público).
- `meta keywords` (PT), `author`, `robots` (`max-image-preview:large`).
- Open Graph + Twitter Card (imagem `lino-avatar.jpg`).
- JSON-LD Schema.org (`WebSite`, `Organization`, `CollectionPage`).
- `robots.txt` (bloqueia `/api/` para poupar cota de crawlers) e `sitemap.xml`.
- `<noscript>` com descrição indexável.
