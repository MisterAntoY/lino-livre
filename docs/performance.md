# ⚡ Engenharia de Performance Web e Otimizações de Borda — Lino Livre

Compilação condensada dos relatórios técnicos de performance:
1. `docs/EFICIENCIA-D1.md`
2. `docs/WEBPERF-CACHE.md`
3. `docs/WEBPERF-CLS.md`
4. `docs/REVISAO-PSI-A11Y.md`

---

## 1. Eficiência da Cloudflare D1 e Mitigação de Cotas (5M Leituras/Dia)
- **Tabelas de Agregados Pré-computados:** `estatisticas`, `contadores` e `autor_totais` reduzem varreduras de 104k linhas para leituras pontuais de 1 a 35 linhas.
- **Bounded Subquery Counts:** Consultas com múltiplos filtros usam `SELECT COUNT(*) FROM (SELECT 1 FROM ... LIMIT 500)` para impor um teto de leitura previsível.
- **Guardrail de Paginação Profunda:** Requisições para páginas > 50 sem filtros retornam imediatamente vazio com cache de 24h, neutralizando scrapers agressivos.
- **Recálculo Noturno Inteligente:** O cron noturno só executa agregações pesadas se `versao_mutacoes > versao_calculada`, evitando desperdício de quotas.

---

## 2. Estratégias de Cache de Borda (CDN e Service Worker)
- **Cabeçalhos Globais:** `Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400` nos 330 datacenters da Cloudflare.
- **Cache API no Worker:** Middleware `cacheDeBorda` intercepta requisições públicas antes do toque na D1.
- **Service Worker PWA:** Interceptação com `Stale-While-Revalidate` para o App Shell e consultas frequentes, garantindo navegação offline instantânea.

---

## 3. Estabilidade Visual (Zero Cumulative Layout Shift - CLS = 0.00)
- **Dimensões Reservadas:** `width` e `height` explícitos em todas as capas (`width="180" height="261"` no acervo e `width="160" height="228"` nos destaques) e logos (`width="16" height="16"`).
- **Skeleton Cards Nativos:** Shimmer estático em CSS já embutido no HTML inicial mantendo a proporção `aspect-ratio: 2/2.85`.
- **Preload Crítico:** Preload de scripts fundamentais no `<head>` de `public/index.html`.
