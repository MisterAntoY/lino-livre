# 🚀 Planos e Roteiros Consolidados — Lino Livre

Compilação condensada dos documentos de planejamento e arquitetura:
1. `docs/planos/PLANO-RESOLUCAO.md`
2. `docs/planos/PLANO-ARQUITECTURA-LINO-LIVRE.md`
3. `docs/planos/FASE-3-ROADMAP-1-MILHAO.md`
4. `docs/planos/OS-100-LIVROS-MAIS-LIDOS-DO-MUNDO.md`
5. `docs/planos/REPOSITORIOS-GITHUB-11-10.md`
6. `docs/planos/ESPECIFICACAO-INTEGRACAO-GITHUB.md`
7. `docs/planos/PLANO-GRAVACAO-E-SUGESTOES-PODCAST.md`

---

## 1. Arquitetura de Alto Nível e Meta dos 10 Milhões

### 1.1 Meta Coletiva Global e Marcos Progressivos
- **Marco Inicial (0):** Lançamento da plataforma aberta.
- **Marco 1 (1.000):** Acervo Clássico Lusófono e Repositórios Técnicos (Atingido com 2.000 obras consolidadas).
- **Marco 2 (10.000):** Ingestão Acadêmica Aberta (DOAB, Teses e Repositórios Universitários).
- **Marco 3 (100.000):** Domínio Público Global (Gutenberg, Wikisource, Standard Ebooks).
- **Marco 4 (1.000.000):** Federação Escalar com Bibliotecas Nacionais e Europeana.
- **Grande Meta (10.000.000):** Democratização universal do conhecimento livre.

### 1.2 Os 4 Pilares de Infraestrutura Custo Zero ($0.00 Perpétuo)
1. **Camada 0 — Client-Side Edge (Service Worker PWA):** Cache local Stale-While-Revalidate servindo consultas comuns em 0ms sem tocar no servidor.
2. **Camada 1 — Cloudflare CDN & Cache API:** Cache de borda com `s-maxage=3600` e `stale-while-revalidate=86400` nos 330 datacenters globais.
3. **Camada 2 — Dual-Engine Balanceado (Cloudflare D1 + Supabase Postgres):** Circuit Breaker de borda com comutação automática sob limites de cota.
4. **Camada 3 — Busca Federada Global (RRF):** Agregação em tempo real com Reciprocal Rank Fusion ($k=60$) para busca em upstreams abertos sem armazenamento local.
5. **Evolução Futura para 10M:** Particionamento colunar Apache Parquet com DuckDB WASM no cliente via HTTP Range Requests sobre Cloudflare R2 / GitHub Releases.

---

## 2. Coleções Especiais e Catalogação

### 2.1 Os 100 Mais Lidos do Mundo (`world-top100-*` e `world-hist-*`)
- 5 Obras Fundacionais Históricas de circulação universal (`world-hist-1` a `world-hist-5`).
- 100 Livros de maior tiragem comercial da história (`world-top100-1` a `world-top100-100`).
- Capas originais auditadas via Open Library e Gutenberg; redirecionamento seguro para catálogo aberto ou empréstimo digital regulamentado.

### 2.2 Acervo Técnico GitHub (100 Repositórios Abertos)
- Livros de programação, ciência da computação e manuais abertos catalogados com capas vetoriais SVG locais, sinopses multilíngues em 7 idiomas e licenças permissivas.

### 2.3 Audiolivros e Podcast Spotify
- Planejamento de roteiros e audiolivros educativos distribuídos via Spotify for Podcasters (RSS feed oficial) e incorporados via player web oficial, sem armazenamento de áudio no servidor.
