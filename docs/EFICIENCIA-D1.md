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
2. **Cron diário às 00:10 UTC** (`triggers.crons` no `wrangler.jsonc`):
   recalcula tudo logo após o reset da cota, em 3 lotes para respeitar o
   tempo máximo por invocação.
3. **Cache de borda** (Cache API) em todas as rotas públicas de leitura, com
   TTL de 1 hora (`stale-while-revalidate=86400`).
4. **Contagem sem varredura**: `/api/livros` lê o total de `estatisticas` ou
   `contadores` quando o filtro é simples; só faz `COUNT(*)` em filtros
   complexos, com estimativa de recurso se a cota falhar.
5. **Degradação elegante**: em erro de cota, as rotas devolvem `[]` com
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
