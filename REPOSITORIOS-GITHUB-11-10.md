# 🐙 Repositórios GitHub para o Lino Livre

**Data:** 11/10/2026 — varrimento via API oficial do GitHub (busca por temas, estrelas, licença e data de atividade; licenças confirmadas ficheiro a ficheiro nos candidatos finais).

**Critério de inclusão:** o repositório tem de ter licença livre verificável (domínio público, CC, MIT, CC0) ou conter apenas *ligações* para conteúdo oficialmente gratuito. Repositórios que hospedam livros comerciais sem licença — mesmo que digam "MIT" na pasta — ficam na lista negada, tal como decidido com o responsável para as fontes já no ar.

---

## ⭐ Desobrigação: o achado principal

### `global-asp/asp-source` — African Storybook Project
**Isto é exatamente o "acervo monumental de África" que o site promete.**

| | |
|---|---|
| Licença | **CC-BY-4.0**, confirmada no site africanstorybook.org |
| Conteúdo | Histórias infantis ilustradas em **Markdown**, uma pasta por língua |
| Línguas | **87** — incluindo as 5 do projeto (en, fr, pt) e dezenas de línguas africanas: sw (suaíli), yo (iorubá), am (amárico), ha (hauçá), zu (zulu), xh (xosa), ss (suazi), rw (quinyarwanda), om (oromo), so (somali), af (africâner)… |
| Volume | en: 368 histórias · fr: 107 · sw: 126 · pt: presente · yo: 16 — texto completo, não ligações |
| Imagens | `global-asp/asp-imagebank` (117 MB) — banco de imagens sob a mesma licença |
| Áudio | `global-asp/gasp-audio` — versões narradas em aberto |
| Vida | atualizado em janeiro de 2026 |

**Integração sugerida (só metadados — ver `AGENTS.md`):** importar de `asp-raw-db` os **metadados** de cada história (título, autor, ilustrador, idioma, nível, licença, texto da sinopse) e guardar na D1 apenas esses campos mais duas ligações externas que já vêm no próprio ficheiro: `url` (leitor oficial `africanstorybook.org/reader.php?id=…`) e `thumb` (capa `africanstorybook.org/illustrations/covers/….png`). **Nenhum `.md`, nenhuma imagem, nenhum áudio é baixado ou hospedado** — o utilizador carrega em "Ler" e recebe um redirect 302 para o leitor oficial deles. É conteúdo real, ilustrado, infantil, africano e nas cinco línguas — substitui com vantagem as entradas com capa postiça e links mortos que a auditoria apontou, sem o Lino Livre guardar um único ficheiro.

---

## ✅ Recomendados — verificados

### Catálogos-meta (ligações para fontes oficiais)

| Repositório | Estrelas | Licença | O que é |
|---|---|---|---|
| `EbookFoundation/free-programming-books` | 398.693 | CC-BY-4.0 | A maior lista mundial de livros técnicos gratuitos e legais, com ligações diretas. Atualizado a 09/10/2026. |
| `EbookFoundation/free-science-books` | 2.299 | CC0-1.0 | Extensão do projeto para ciências — ligações para livros abertos de matemática, física, medicina, etc. |

Nenhum destes hospeda ficheiros: são listas de ligações oficiais, ou seja, curadoria pronta a importar para as categorias do site.

### Domínio público e textos abertos (ficheiros reais)

| Repositório | Estrelas | Licença | Conteúdo | Nota |
|---|---|---|---|---|
| `standardebooks` (organização) | 1.533 repositórios | domínio público / dedicação CC0 em cada livro | Clássicos da literatura em EPUB de altíssima qualidade (Dubliners, Jekyll & Hyde, Siddhartha, Doyle, Christie…) | Cada livro é um repositório próprio com EPUB pronto a servir. Maioria em inglês; alguns em francês e alemão. |
| `chinese-poetry/chinese-poetry` | 53.642 | MIT | Poesia e literatura clássica chinesa (Tang, Song…) em JSON, 222 MB | Alimenta a secção chinesa com texto verdadeiro em vez de ligações. |
| `GITenberg` / `gitenberg-dev` | — | domínio público | Espelhos por-livro do Project Gutenberg no GitHub | Alternativa de redistribuição já usada por outros projetos; útil quando o gutenberg.org falha. |

### Educação aberta

| Repositório | Estrelas | Licença | Conteúdo |
|---|---|---|---|
| `philschatz/textbooks` | 70 | OpenStax (CC-BY) | Manuais OpenStax publicados no GitHub Pages — leitura direta no browser, sem download. |
| `openstax` (organização) | — | CC-BY | Código-fonte oficial dos manuais OpenStax (física, biologia, cálculo, economia…). |

---

## ⚠️ Rejeitados — mesma situação das fontes já no ar

Estes repositórios aparecem nas buscas e foram inspecionados. **Não recomendo importar**, pelo mesmo motivo documentado na auditoria: são PDFs de livros comerciais publicados sem licença, embora os repositórios tenham uma licença MIT na raiz (a MIT cobre o código do repositório, não os livros).

| Repositório | Estrelas | Porquê |
|---|---|---|
| `devxhub/awesome-book-collection` | 544 | 1,3 GB de PDFs: *Database Internals* (O'Reilly), *Kafka in Action* (Manning), *Beginning Database Design* (Wrox), títulos Packt… — conteúdo comercial com licença duvidosa. |
| `allankildare/livros-desenvolvedor` | 32 | 207 MB, em português, inclui *Guia do Hacker Brasileiro* e outros PDFs de editoras brasileiras. Mesmo padrão das duas fontes atuais do site. |
| `MartinStamenkovski/LibraryGenesis` | 66 | Cliente iOS do LibGen — excluído por regra do projeto. |
| `rpmuller/ePubs` | 44 | EPUBs de clássicos franceses; sem ficheiro de licença e sem atualização desde 2019 — domínio público provável, mas por verificação obra a obra se for usado. |

---

## 📌 Resumo para o Gemini

1. **Importar primeiro `global-asp/asp-source`** — é o upgrade mais grande e mais barato para a coleção africana: 87 línguas, texto completo, CC-BY-4.0, atribuição obrigatória mas simples.
2. **Espalhar por `standardebooks`** os clássicos em inglês/francês/alemão que substituam links mortos.
3. **Usar `chinese-poetry`** para dar corpo à secção chinesa.
4. **Ligar o catálogo `EbookFoundation`** (ambos os ficheiros) às categorias de cursos e livros técnicos — são curadoria pronta, só com ligações oficiais.
5. **Não importar** os quatro repositórios da tabela vermelha.
