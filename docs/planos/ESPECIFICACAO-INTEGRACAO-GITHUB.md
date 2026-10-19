# 🔗 Especificação de Integração — Todas as Fontes GitHub (Modelo Intermediário)

**Data:** 11/10/2026
**Destinatário:** agente implementador
**Regra inviolável:** `AGENTS.md` — o Lino Livre **não hospeda nenhum ficheiro de livro**. A D1 guarda apenas **metadados** e **URLs externas**; toda a leitura é feita por **redirect HTTP 302** para o provedor original. Nenhum `.pdf`, `.epub`, `.md`, imagem ou áudio é baixado, copiado ou espelhado.

Este documento liga ao site **cinco fontes aprovadas**, todas verificadas hoje (HTTP 200 nos padrões de URL abaixo). Nenhuma delas exige armazenamento local: o conteúdo continua hospedado nos servidores do respetivo projeto.

---

## 0. Princípio comum a todas as importações

Cada registo importado para a D1 tem:

| Campo | Conteúdo | Guarda ficheiro? |
|---|---|---|
| `titulo`, `autor`, `idioma`, `categoria`, `sinopse`, `ano`, `nivel` | metadados lidos do ficheiro-fonte | ❌ só texto de metadados |
| `licenca` | `CC-BY`, `CC-BY-NC`, `dominio-publico`, `CC0`… | ❌ |
| `links[].url` | URL **externa** da obra (leitor ou página oficial) | ❌ só o texto do link |
| `links[].link_externo` | `1` — força redirect 302, nunca servir do Worker | ❌ |
| `capa_url` | URL **externa** da capa, no servidor do provedor | ❌ |

Campo proibido: qualquer `conteudo`, `ficheiro`, `blob`, `bytes`, bucket ou pasta de uploads. A tabela `links` que já existe na API de produção (`link_externo: 1`) é exatamente o mecanismo certo — usar esse, sem criar alíneas alternativas.

**Atribuição obrigatória** (CC-BY): mostrar em cada ficha `autor`, `ilustrador` (quando existir) e `licença com link`. É preço legal da licença e melhora a confiança.

---

## 1. 🦁 African Storybook — o carro-chefe do acervo africano

**Fonte de metadados:** `github.com/global-asp/asp-raw-db` (ramo `master`, pasta `data/`)
**Conteúdo hospedado por:** africanstorybook.org (o site oficial deles)
**Licença:** CC-BY e CC-BY-NC (3.0/4.0, indicada por história) — confirmada em africanstorybook.org

### O que importar

**12.085 histórias** (contagem confirmada no git tree, não truncado). Cada história é um `.txt` simples:

```
url:	http://africanstorybook.org/reader.php?id=1001&d=0&a=1
id:	1001
title:	Umfowethu Olivila
author:	Clare Verbeek
artist:	Mlungisi Dlamini
lang:	isiZulu
level:	First words
lic:	Creative Commons: Attribution-Non Commercial 3.0
thumb:	http://africanstorybook.org/illustrations/covers/1001.png
desc:	Kulendaba
```

Parser: 10 linhas-chave `chave:\tvalor`, depois `page_text:` (que **não se importa** — é o texto da obra; fica no site deles).

### Mapeamento de campos → D1

| Fonte | D1 | Nota |
|---|---|---|
| `title` | `titulo` | |
| `author` | `autor` | já há tabela/autores na API |
| `artist` | campo novo `ilustrador` ou acrescentar à sinopse | necessária para atribuição CC-BY |
| `lang` | `idioma` | mapear para código ISO onde possível: isiZulu→zu, Kiswahili→sw, Français→fr, English→en, Português→pt |
| `level` | campo `nivel` | "First words", "Beginning readers"… |
| `lic` | `licenca` | converter texto → código: `CC-BY`, `CC-BY-NC` |
| `desc` | `sinopse` | 1 linha |
| `url` | `links[].url` | **redirect 302** |
| `thumb` | `capa_url` | imagem hospedada por eles |
| `page_text` | — | ❌ **não importar** |

### URLs externas verificadas hoje

- Leitor: `https://www.africanstorybook.org/reader.php?id={id}&d=0&a=1` → **HTTP 200**
- Capa: `https://africanstorybook.org/illustrations/covers/{id}.png` → **HTTP 200**

### Categorias sugeridas na D1

- Todas entram em **Literatura Africana** (ou categoria dedicada "Histórias de África").
- Filtrar por idioma para as cinco línguas do projeto (en, fr, pt, de, zh existem em alguma medida; as línguas africanas dão corpo à secção 🌍).
- `nivel` permite filtro "infantil" — o público-alvo do projeto.

### Volume esperado

Do banco completo: **12.085 histórias** em 87+ línguas, todas com capa e leitor próprio. Mesmo importando só as das cinco línguas do projeto + as dez línguas africanas maiores, o acervo africano passa de ~111 entradas (catálogo atual) para **milhares de registos reais**.

---

## 2. 📚 Standard Ebooks — clássicos em alta qualidade

**Conteúdo hospedado por:** standardebooks.org
**Licença:** domínio público (dedicação CC0 em cada repositório, verificado no do *Dubliners*)

- **1.533 repositórios** na organização, um por obra.
- Padrão de URL externa verificado hoje: repositório `standardebooks/{autor}_{obra}` → página oficial `https://www.standardebooks.org/ebooks/{autor-slug}/{obra-slug}` → **HTTP 200**.
- Importar: título, autor, idioma, ano, domínio público, e **ligação externa** à página do livro (de onde o utilizador descarrega/ler no servidor deles).
- Não clonar repositórios, não copiar EPUBs.

**Integração:** substitui os links mortos da secção de clássicos (inglês, francês, alemão) com obras verificadas.

---

## 3. 🇨🇳 chinese-poetry — corpo para a secção chinesa

**Conteúdo hospedado por:** github.com/chinese-poetry/chinese-poetry (HTTP 200 verificado)
**Licença:** MIT sobre o repositório; os textos são domínio público clássico (poesia Tang/Song)

- 222 MB de JSON com poesia e prosa clássica.
- Modelo intermediário: importar **índice de obras** (título, dinastia, autor) e apontar `links[].url` para o ficheiro correspondente no GitHub (`https://github.com/chinese-poetry/chinese-poetry/blob/master/...`) — o GitHub é o terceiro hospedeiro.
- Não baixar os JSON para a D1.

---

## 4. 🎓 OpenStax — manuais universitários abertos

**Conteúdo hospedado por:** openstax.org (página oficial verificada: `https://openstax.org/details/books/biology-2e` → HTTP 200)
**Licença:** CC-BY

- Espelhos auxiliares: `philschatz/textbooks` (publicado no GitHub Pages, HTTP 200) — usar só como URL alternativa.
- Importar: título, disciplina, idioma, CC-BY, e ligação externa à página oficial do livro.
- Alimenta as categorias de ciências (física, biologia, cálculo, economia).

---

## 5. 📖 Bookshelves do EbookFoundation — curadoria pronta (só ligações)

**Repositórios:** `EbookFoundation/free-programming-books` (CC-BY, 398k★) e `EbookFoundation/free-science-books` (CC0)

- São **listas de ligações** para livros oficiais e gratuitos — nunca ficheiros.
- Importar linha a linha: título, autor (quando indicado), área, e a URL externa que já vem na lista.
- `link_externo: 1` em todas — o redirect 302 leva o utilizador ao site oficial (OpenStax, leitor web, EPUB do autor).
- Resolve de uma vez a desproporção tech/não-tech que a auditoria apontou (75% tech): `free-science-books` traz matemática, física, medicina, biologia, engenharia, economia.

---

## 6. Regras de verificação antes de cada lote

1. Testar o padrão de URL com 5 URLs aleatórias do lote (deve dar 200 ou redirect válido).
2. Gravar `verificado_em` em cada registo importado.
3. Rejeitar qualquer entrada cuja URL externa dê 404 — não entra no site.
4. Nunca importar de: `devxhub/awesome-book-collection`, `allankildare/livros-desenvolvedor`, `MartinStamenkovski/LibraryGenesis`, `rpmuller/ePubs` (tabela vermelha de `REPOSITORIOS-GITHUB-11-10.md`).

---

## 7. Ordem de execução sugerida

1. **asp-raw-db** (maior impacto: acervo africano real, milhares de histórias, capa + leitor externos)
2. **free-science-books** (corrige a balança tech/não-tech)
3. **Standard Ebooks** (preenche clássicos com links mortos)
4. **OpenStax** (ciências)
5. **chinese-poetry** (secção chinesa)

Cada lote: importar metadados → testar 5 URLs → inserir com `link_externo=1` → reportar contagem.

---

*Especificação emitida pela equipa de auditoria. Em conformidade com `AGENTS.md`: nenhum ficheiro de livro é armazenado no servidor, banco de dados, buckets ou pastas locais do projeto; o Lino Livre atua exclusivamente como intermediário indexador com redirect 302 para provedores externos.*
