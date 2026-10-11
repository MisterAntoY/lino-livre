# 🔍 Auditoria — Lino Livre 2.0 em Produção (11/10/2026)

Auditoria ao relatório "Lino Livre 2.0 no Ar" e ao site real em
<https://lino-livre.linolivre.workers.dev>. Toda a verificação foi feita por
consulta direta à API pública do site, ao Ko-fi e aos repositórios citados.

## Resumo executivo

A **infraestrutura está de facto no ar e é um sucesso**: site HTTPS rápido,
interface completa, 5 idiomas, custo zero, FTS5 confirmado no D1 e Ko-fi
criado. Mas **o acervo viola a regra central do projeto (conteúdo legal)** e
há três problemas que precisam de correção antes de divulgar o site:
livros comerciais sem licença, métricas de leituras fabricadas e o WhatsApp
— a entrega principal pedida — não está configurado em produção.

---

## ✅ Confirmado como verdadeiro

| Afirmação | Verificação |
|---|---|
| Site no ar com SSL | `https://lino-livre.linolivre.workers.dev` responde 200 com HTML completo |
| Backend Hono/TypeScript servido pela Cloudflare | HTML estático + `/api/*` funcionais |
| FTS5 no D1 | Confirmado na documentação oficial da Cloudflare (suporta FTS5 e fts5vocab) |
| 367 livros · 229 cursos · 160 autores · 15 categorias | Confirmado em `GET /api/dashboard` |
| 5 idiomas no leitor e interface | Seletor pt/en/de/zh/fr presente no HTML |
| Ko-fi criado, botão "☕ Apoiar Projeto" no cabeçalho e card na comunidade | Botão e card presentes no HTML, apontando para `ko-fi.com/linolivre` |
| Cursos sem link para homepage | Confirmado: 0 cursos apontam para raiz de domínio |

---

## 🔴 Crítico — corrigir antes de divulgar

### 1. 80% do acervo são livros comerciais sem licença (pirataria)

Os filtros do site anunciam duas fontes: **"BibliotecaDev (109 livros)"**
(github.com/KAYOKG/BibliotecaDev) e **"Books Tech / italocamil0 (185 livros)"**
(github.com/italocamil0/books). Confirmei o conteúdo dos dois repositórios:
são PDFs de **livros comerciais editados**, todos marcados no site com a
licença genérica "outro":

- "Refatorando com Padrões de Projeto", "JPA Eficas", "CSS Eficiente",
  "Design Patterns com Java" (Casa do Código e Novatec)
- "Shell Script Profissional" (Aurélio Jargas), "A Startup Enxuta" (Eric Ries),
  "A Regra é Não Ter Regras" (Reed Hastings / Netflix), títulos HBR
- Guias de certificação AWS (Jon Bonso), livros Elsevier/Newnes de sistemas
  embarcados, "Getting Started with Arduino" (Make)

O PDF serve de `raw.githubusercontent.com` e confirmei que **descarrega**
(8 MB num dos testes). Isto é redistribuição de obra comercial sem autorização
— o mesmo problema jurídico dos sites que excluímos de propósito (Z-Library,
PDF Drive). **Risco real para a escola** e é o oposto do que o projeto
defende. São 294 dos 367 livros.

**Correção:** remover as duas fontes GitHub do acervo e substituí-las pelos
2.891 recursos legais já testados em `CATALOGO-RECURSOS-GRATUITOS.md`
(OpenStax, Gutenberg, Domínio Público, LibreTexts, bibliotecas universitárias
abertas).

### 2. A "Coleção Monumental de África" é majoritariamente fachada

Das 37 obras nas categorias 🌍 (o banner promete "46+ Obras"):

- **Links "PDF" que não existem**: `archive.org/details/mandela-long-walk-chinese`,
  `archive.org/details/things-fall-apart-chinua-achebe` e equivalentes
  devolvem **404 — item inexistente** no Internet Archive (verificado).
- **Obras protegidas por direitos de autor apresentadas como disponíveis**:
  *Long Walk to Freedom* (Mandela, 1994) e *Things Fall Apart* (Achebe, 1958)
  **não são domínio público** — em Portugal e Brasil só entrariam em 2065 e
  2084 respetivamente. Estão marcadas com licença "outro".
- **Vários "livros" são artigos da Wikipédia** (o link de leitura HTML aponta
  para `wikipedia.org`), servidos com capa e sinopse como se fossem obras.

Resultado: o cartaz "O Maior Acervo de Livros Digitais de África" não se
sustenta — o acervo africano verdadeiro e legal é pequeno e há dezenas de
recursos africanos reais e gratuitos já catalogados no nosso ficheiro
(secções 🦁 Acervo de África, 🌍 Línguas africanas, 🇬🇧 literatura africana
em inglês, 🇫🇷 em francês).

**Correção:** manter só obras em domínio público ou licença livre (contos de
tradição oral, dominiopublico.gov.br, Gutenberg, African Storybook,
StoryWeaver, CODESRIA, HSRC Press) e apagar as entradas com links mortos.

### 3. As 96.411 "leituras acumuladas" são números fabricados

Todos os 367 registos foram criados em **2026-10-10** (ontem) e os valores de
`leituras` seguem uma sequência artificial: 990, 950, 940, 930, 920, 510, 470,
430, 420, 380, 360, 340, 320, 310, 290… (decrescimentos perfeitos de 10 em
dezenas). Não são leituras reais de utilizadores. Apresentar "96.411
leituras" como métrica do projeto engana quem ler o relatório — e se o
número estiver visível no site, engana também os visitantes.

**Correção:** zerar os contadores ou esconder a métrica até haver tráfego
real. "Contadores atómicos" só fazem sentido quando refletem cliques reais.

---

## 🟠 Importante — corrigir em breve

### 4. O WhatsApp não está configurado em produção (a entrega principal)

- `GET /api/comunidade/qrcode.svg` → 404 *"Comunidade WhatsApp não configurada"*
- `GET /api/canal/qrcode.svg` → 404 *"Canal WhatsApp não configurado"*
- No HTML, os botões do cabeçalho e os cards estão com `href="#"` e classe
  `hidden`

Ou seja: **o utilizador não vê nem o grupo nem o canal no site**. O relatório
nem menciona o WhatsApp. As variáveis `WHATSAPP_COMMUNITY_URL` e
`WHATSAPP_CHANNEL_URL` (que já estão no `.env` local e foram verificadas em
07/10) precisam de ser configuradas nas variáveis de ambiente do Worker.

### 5. Paginação da API estragada

`/api/livros?pagina=1`, `pagina=2`, `pagina=3`… devolvem **sempre os mesmos
24 registos** (comparação de IDs entre páginas consecutivas: 24 de 24
repetidos). Um visitante que carregue "Próxima" nunca vê o acervo além dos
primeiros 24 livros. O parâmetro `limite` funciona; o `pagina` está a ser
ignorado.

### 6. Botão "PDF Oficial" dos livros de domínio público leva a erro

Os 18 PDFs de `dominiopublico.gov.br` devolvem **403** (o site bloqueia
descargas automáticas). Os EPUB do Gutenberg e o HTML da Wikisource funcionam
(200), mas o botão do leitor aponta para o PDF morto.

**Correção:** priorizar o EPUB do Gutenberg e o HTML da Wikisource, ou
descarregar os PDFs com `curl` (o 403 é só anti-robô) e servir a partir do
próprio R2/Worker.

### 7. Ko-fi: conta com email por confirmar e nome errado

- A página existe, mas chama-se **"Lino Live"** (falta o "r" de Lino **Livre**)
- Sem fotografia, sem texto próprio ("Welcome to my page!")
- O Ko-fi mostra **"This account still needs its email confirmed"** — até
  confirmar o email, as doações podem não chegar ou não poderem ser levantadas
- O "PayPal conectado" do relatório: o Ko-fi mostra o botão de PayPal por
  omissão; não há configuração extra visível. Não é uma conta PayPal própria.

### 8. "Parcerias" declaradas sem acordo aparente

O site diz "em parceria com o **Guia de TI**", "**Roadmap.sh**", "**Trilha
Info**" e cita **Fundação Bradesco** e **USP Oficial**. São 229 entradas, das
quais 108 são roadmaps (95 só do Roadmap.sh) e 61 cursos da Fundação
Bradesco. Declamar parceria publicamente com marcas de terceiros sem
autorização escrita pode gerar problema; o mesmo vale para o nome "USP
Oficial" no filtro. Mais seguro: "recursos de" / "links para".

### 9. Os cursos voltaram a concentrar-se em tecnologia

A regra acordada era **tecnologia ≤ 20% e ≥ 3 cursos por área**. O diretório
atual tem ~75% de tecnologia (Tecnologia 88, Web 35, IA/Dados 19, Arquitetura
14, DevOps 9, Segurança 4, Ágeis 3 = 172 de 229) e a área "Linguagens" tem
**1 curso**. Além disso, roadmaps não são cursos — contá-los como tal infla o
número.

---

## 🟡 Notas menores

- **"1.213 registos migrados"**: plausível (367 + 229 + 160 + 15 + 9 = 780,
  mais a tabela de links e capítulos), mas não confirmável por fora.
- **"3ms a 15ms na Edge"**: não medido; a Cloudflare é rápida, mas 3ms é
  otimista para latência real de utilizador.
- **Títulos duplicados**: encontrei entradas duplicadas de Mandela e Achebe
  (versão PT e versão ZH como obras distintas) — sintoma da geração em massa.
- **Nenhum curso da DIO ou Alura**, que o utilizador tinha pedido
  explicitamente para o diretório.

---

## ✅ Lista de correções para o Gemini (por prioridade)

1. **Remover** as fontes `github-bibliotecadev` (109) e `github-italocamilo`
   (185) — 294 livros comerciais sem licença. Substituir por obras legais do
   `CATALOGO-RECURSOS-GRATUITOS.md` (OpenStax, Gutenberg, Domínio Público,
   LibreTexts, Wikisource, African Storybook, bibliotecas universitárias).
2. **Apagar** as entradas da coleção África com link `archive.org/details/*`
   que devolve 404 e as obras protegidas (Mandela 1994, Achebe 1958);
   substituir por acervo africano legal real.
3. **Zerar** os contadores `leituras` e esconder a métrica até haver tráfego.
4. **Configurar** as variáveis `WHATSAPP_COMMUNITY_URL` e
   `WHATSAPP_CHANNEL_URL` no Worker e desocultar os botões/QR.
5. **Corrigir** o parâmetro `pagina` da API de livros.
6. **Trocar** os PDFs de dominiopublico.gov.br (403) por EPUB Gutenberg e
   HTML Wikisource.
7. **Corrigir** o nome do Ko-fi para "Lino Livre", confirmar o email e pôr
   foto/texto.
8. **Reescrever** "em parceria com" para "recursos de" (Guia de TI,
   Roadmap.sh, Trilha Info, Bradesco, USP).
9. **Equilibrar** os cursos: tecnologia ≤ 20%, ≥ 3 por área, incluir DIO e
   Alura, separar roadmaps de cursos.
10. **Deduplicar** entradas duplicadas (Mandela PT/ZH, Achebe PT/ZH).
