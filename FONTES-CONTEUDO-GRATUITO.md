# Lino Livre — Fontes de Livros, Cursos e Conteúdo Gratuito

Pesquisa de outubro de 2026. Só fontes **legais**: domínio público, licenças Creative Commons, acesso aberto, ou acesso gratuito oferecido pelo próprio dono do conteúdo.

**Legenda da coluna "Integração"**
- 🟢 **API / dados abertos**: dá para importar automaticamente para o catálogo
- 🟡 **Catálogo manual**: sem API estável; o administrador adiciona os títulos à mão, com link para a fonte
- 🔗 **Só link**: conteúdo com direitos ou regras próprias; o Lino Livre apenas encaminha para a plataforma

**Regra geral:** quando a licença não permite redistribuir, o Lino Livre **mostra e liga**, mas não guarda o ficheiro.

---

## 1. Livros em português

| Fonte | O que tem | Licença | Integração |
|---|---|---|---|
| **Domínio Público (MEC, Brasil)**: dominiopublico.mec.gov.br | Literatura, obras científicas, áudio e vídeo | Domínio público / autorizadas | 🟡 |
| **MEC Livros**: gov.br/mec/pt-br/mec-livros | Domínio público e títulos licenciados para estudantes | Mista | 🔗 |
| **Biblioteca Nacional Digital (Portugal)**: purl.pt | Obras digitalizadas portuguesas | Domínio público | 🟡 (há também um conjunto de dados em dados.gov.pt) |
| **Biblioteca Digital Camões (Camões, I.P.)** | Cultura em língua portuguesa; leitura gratuita sem registo | Mista: cada edição tem o seu nível de acesso | 🔗 |
| **Memórias de África e do Oriente** | Documentos sobre os países africanos de língua portuguesa e o Oriente | Varia | 🔗 |
| **Biblioteca Digital de Literatura de Países Lusófonos (UFSC)**: literaturabrasileira.ufsc.br | Literatura lusófona com links para edições digitais | Domínio público | 🟡 |
| **Brasiliana Guita e José Mindlin (USP)**: digital.bbm.usp.br | Obras raras brasileiras | Domínio público | 🟡 |
| **BNDigital / Hemeroteca Digital (Biblioteca Nacional do Brasil)** | Livros, jornais e revistas históricas | Domínio público | 🔗 |
| **Wikisource em português**: pt.wikisource.org | Textos-fonte (Machado, Camões, Pessoa, Eça...) | Domínio público / CC BY-SA | 🟢 MediaWiki API |
| **Wikilivros**: pt.wikibooks.org | Manuais e livros didáticos colaborativos | CC BY-SA | 🟢 MediaWiki API |
| **SciELO Livros**: books.scielo.org | Livros académicos de editoras universitárias | Parte em acesso aberto (filtrar) | 🟢 via DOAB |
| **eduCAPES (Brasil)**: educapes.capes.gov.br | Livros didáticos, videoaulas, teses e materiais da UAB | Aberta / autorizada | 🟢 DSpace (normalmente com OAI-PMH; confirmar) |
| **MEC RED**: plataformaintegrada.mec.gov.br | Recursos educacionais abertos para a educação básica | Aberta | 🟡 |

## 2. Livros internacionais (todas as áreas)

| Fonte | O que tem | Licença | Integração |
|---|---|---|---|
| **Project Gutenberg**: gutenberg.org | Mais de 70 mil clássicos, incluindo em português | Domínio público (EUA) | 🟢 gutendex.com / catálogo CSV oficial |
| **Open Library / Internet Archive** | Milhões de registos | Só importar os de download livre | 🟢 search.json |
| **DOAB: Directory of Open Access Books**: doabooks.org | Mais de 100 mil livros académicos revistos por pares | Acesso aberto; metadados CC0 | 🟢 OAI-PMH, REST API, CSV, RSS |
| **OAPEN Library**: oapen.org | Livros académicos em acesso aberto | CC | 🟢 OAI-PMH |
| **Standard Ebooks** | Clássicos com edição cuidada (inglês) | CC0 / domínio público | 🟢 OPDS |
| **HathiTrust**: hathitrust.org | Obras digitalizadas por bibliotecas universitárias | Domínio público ("full view") | 🔗 |
| **Europeana**: europeana.eu | Património cultural europeu | Varia, filtrável por licença | 🟢 API (chave gratuita) |
| **OpenStax**: openstax.org | Manuais universitários (matemática, ciências, economia) | CC BY | 🟡 |
| **Open Textbook Library / LibreTexts** | Manuais abertos de todas as áreas | CC | 🟡 |
| **Google Books API** | Metadados, capas e sinopses | Só leitura completa quando `viewability = ALL_PAGES` | 🟢 enriquecimento |

## 3. Livros infantis e juvenis

| Fonte | O que tem | Licença | Integração |
|---|---|---|---|
| **StoryWeaver (Pratham Books)**: storyweaver.org.in | Milhares de histórias ilustradas em centenas de línguas, incluindo português | **CC BY 4.0** | 🟡 (download direto em PDF/ePub) |
| **African Storybook**: africanstorybook.org | Histórias africanas ilustradas, com traduções para português | CC BY | 🟡 |
| **Global Digital Library** | Livros de leitura para crianças em várias línguas | CC | 🟡 |

## 4. Cursos gratuitos & Formação Profissional

Atualizado com a auditoria e integração do **Guia de TI** como fonte principal de tecnologia.

### 4.1 Fonte Principal de Tecnologia, Roadmaps e Cursos Livres

| Plataforma | Áreas | Idioma | Certificado / Acesso | Integração |
|---|---|---|---|---|
| ⭐ **Guia de TI**: guiadeti.com.br | Programação (Python 2025, TypeScript, HTML/CSS, Laravel), DevOps & Cloud (Linux, Docker), IA & Claude, Power BI, Roadmaps de Carreira | 🇧🇷 Português | Gratuito e aberto; parceiros com certificado | 🟢 **RSS 2.0 Oficial** (`/cursos/feed/`, `/roadmaps/feed/`, `/feed/`) |

### 4.2 Plataformas abertas a todos (qualquer país)

| Plataforma | Áreas | Idioma | Certificado | Integração |
|---|---|---|---|---|
| ✅ **NAU (FCT, Portugal)**: nau.edu.pt/pt/cursos | Saúde, desporto, sustentabilidade, literatura (Eça, Saramago), IA, programação | 🇵🇹 Português (alguns em inglês) | Sim, gratuito | 🔗 |
| ✅ **OpenWHO (OMS)**: openwho.org/courses | Saúde pública, primeiros socorros, saúde mental, emergências | Muitas línguas, incluindo 🇧🇷 e 🇵🇹 | Sim, gratuito ("Record of Achievement") | 🔗 |
| ✅ **Lúmina (UFRGS)**: lumina.ufrgs.br | Mais de 100 MOOCs: saúde e biológicas (39), humanas e sociais (33), letras e artes (11), tecnologia (28) | 🇧🇷 Português | Sim, da UFRGS | 🔗 |
| ✅ **Embrapa e-Campo**: e-campo.sede.embrapa.br | Agricultura, pecuária, apicultura, hortas, ambiente, alimentação (193 cursos gratuitos e 14 pagos; mostrar só os gratuitos) | 🇧🇷 Português | Sim | 🔗 |
| **Khan Academy em português**: pt.khanacademy.org | Matemática, ciências, história, gramática | Português | Não | 🔗 |
| **OpenLearn (Open University)** | Cursos curtos de muitas áreas | 🇬🇧 Inglês | Declaração de participação | 🔗 |
| **MIT OpenCourseWare**: ocw.mit.edu | Mais de 2.500 cursos do MIT, de todas as áreas | 🇬🇧 Inglês | Não | 🟢 MIT Learn API / OER Commons |
| **CS50 (Harvard)**: cs50.harvard.edu | Ciência da computação, IA, web | 🇬🇧 Inglês (com legendas) | Grátis pelo CS50; o do edX é pago | 🔗 |
| **freeCodeCamp**: freecodecamp.org | Programação | Inglês (parte em português) | Sim, gratuito | 🔗 |
| **CK-12**: ck12.org | Matemática e ciências do ensino médio | 🇬🇧 Inglês | Não | 🔗 |
| **OER Commons**: oercommons.org | Recursos abertos de todas as áreas | Vários | Não | 🟢 API documentada |
| **Ensina RTP**: ensina.rtp.pt | Vídeos educativos portugueses de várias disciplinas | 🇵🇹 Português | Não | 🔗 |
| **Curso em Vídeo** | Programação e informática (YouTube) | 🇧🇷 Português | Não | 🔗 |
| **Duolingo** | Línguas estrangeiras | Muitas | Não | 🔗 |
| **Microsoft Learn / Google Skillshop** | Tecnologia e competências digitais | Vários | Sim, gratuito | 🔗 |
| **Coursera / edX** | Cursos universitários | Vários | ⚠️ **Assistir é grátis, o certificado é pago** (dizer isto no site) | 🔗 |

### 4.2 Plataformas brasileiras (podem exigir CPF ou conta gov.br)

| Plataforma | Áreas | Requisito | Certificado | Integração |
|---|---|---|---|---|
| ✅ **Aprenda Mais (MEC)**: aprendamais.mec.gov.br | Ambiente e Saúde, Humanas, Educação, Gestão, Idiomas e Literatura, Produção Alimentícia, Recursos Naturais, Turismo, Produção Cultural e Design, Segurança | Conta (confirmar se exige CPF) | Sim, gratuito | 🔗 |
| ✅ **Escult (Ministério da Cultura)**: escult.cultura.gov.br | Audiovisual, fotografia, animação, música, gestão cultural (com Libras e audiodescrição) | **Conta gov.br**, a partir de 14 anos | Sim, de instituições federais | 🔗 |
| ✅ **Fundação Bradesco: Escola Virtual**: ev.org.br | Desenvolvimento pessoal, negócios, produtividade, análise de dados, IA, programação | **CPF**, a partir de 14 anos | Sim, gratuito (válido 2 anos) | 🔗 |
| **Escola Virtual de Governo (ENAP)** | Gestão pública, cidadania, finanças, dados | Conta gov.br (confirmar) | Sim | 🔗 |
| ✅ **Sebrae** | Empreendedorismo e gestão | Conta | Sim | 🔗 ⚠️ o link antigo vai para a **loja**; ligar à lista dos gratuitos |

**Exemplos reais de cursos não-tech da Fundação Bradesco** (✅):
- "Regulação da Preocupação e da Ansiedade" (4h): ev.org.br/cursos/regulacao-da-preocupacao-e-da-ansiedade
- "Lei Geral de Proteção de Dados (LGPD)" (2h): ev.org.br/cursos/lei-geral-de-protecao-de-dados-lgpd
- "Introdução à Liderança Lean" (4h): ev.org.br/cursos/introducao-a-lideranca-lean

### 4.3 Tecnologia: DIO e Alura (pedido do responsável)

| Plataforma | O que é gratuito | Cuidado |
|---|---|---|
| ✅ **DIO**: dio.me/bootcamp | **Bootcamps gratuitos patrocinados** por empresas (ex.: Microsoft, Santander, iFood, Carrefour) | Só tecnologia. O site tem muita publicidade a planos pagos: ligar **só** à página dos bootcamps. Confirmar o certificado em cada bootcamp. |
| ✅ **Alura**: alura.com.br/imersao | **Imersões gratuitas**: 5 aulas, com certificado, em edições com datas | O catálogo principal é **pago** (cerca de R$ 1.200/ano). Quando não houver edição aberta, mostrar "inscrições em breve". |

### 4.4 Mapa por área

| Área | Plataformas |
|---|---|
| 🩺 Saúde | OpenWHO, NAU, Lúmina, Aprenda Mais |
| 🎨 Artes, cultura e música | Escult, Lúmina (letras e artes), Aprenda Mais (produção cultural e design) |
| 🌱 Agricultura e ambiente | Embrapa e-Campo, NAU (sustentabilidade), Aprenda Mais (recursos naturais) |
| 🗣️ Línguas e literatura | NAU (Eça, Saramago), Aprenda Mais (idiomas e literatura), Duolingo, Khan (gramática) |
| 📐 Matemática e ciências | Khan Academy, MIT OCW, CK-12, PhET, OpenStax |
| 🏛️ Humanas e cidadania | Lúmina, Khan (história), ENAP, MIT OCW (economia) |
| 💼 Gestão e empreendedorismo | Sebrae, Fundação Bradesco, ENAP |
| 🍳 Profissões técnicas | Aprenda Mais (produção alimentícia, turismo, segurança) |
| ⚽ Desporto | NAU (cursos com o IPDJ) |
| 🧠 Desenvolvimento pessoal | Fundação Bradesco |
| 💻 Tecnologia (máximo 20%) | DIO, Alura, CS50, freeCodeCamp, Curso em Vídeo, Microsoft Learn |

### 4.5 Regras do diretório de cursos

1. **Cada entrada leva a um curso concreto**, nunca à página inicial. Se for a plataforma inteira, marcar `tipo = 'catalogo'` e usar o nome da plataforma como título.
2. **Não inventar cursos**: só entram títulos confirmados na plataforma.
3. Mostrar no site o **idioma** ("🇬🇧 Em inglês"), o **requisito** ("Requer CPF") e se o **certificado** é gratuito, pago ou inexistente.
4. Pelo menos **3 cursos por área**.
5. Livros (OpenStax) e simulações (PhET) entram como `tipo = 'livro-texto'` ou `'simulacao'`, não como cursos.
6. Guardar a **data da última verificação** do link e rever a cada semestre.

### 4.6 🚫 Evitar: falsos "cursos grátis"

Sites como **Prime Cursos, Elevo Cursos, Gama Cursos** e semelhantes anunciam "curso grátis com certificado", mas **o certificado é pago**. Não devem entrar no diretório nem ser partilhados no WhatsApp.

## 5. Outros conteúdos gratuitos

| Tipo | Fontes | Licença |
|---|---|---|
| 🎧 Audiolivros | **LibriVox** (tem secção em português) | Domínio público |
| 🔬 Simulações de ciências | **PhET** (Universidade do Colorado, em português) | CC BY |
| 📄 Artigos científicos | **SciELO**, **DOAJ**, **arXiv**, **PubMed Central** | Acesso aberto |
| 🎓 Teses e dissertações | **BDTD** (Brasil), **RCAAP** (Portugal) | Acesso aberto |
| 🖼️ Imagens e media | **Wikimedia Commons** | CC / domínio público |
| 🎼 Partituras e música | **IMSLP**, **Musopen** | Domínio público (atenção ao país) |
| 🗺️ Mapas | **OpenStreetMap** | ODbL |
| 📖 Enciclopédia e dicionário | **Wikipédia**, **Wikcionário** | CC BY-SA |
| 🎬 Vídeos educativos | **TED-Ed**, **Khan Academy**, **Ensina RTP** | Varia (normalmente só link) |

---

## Sugestão de prioridade para o catálogo

1. **Arranque (automático):** Project Gutenberg (filtro português), Wikisource PT, DOAB (filtro português) → acervo grande e legal logo de início
2. **Curadoria manual:** Domínio Público MEC, StoryWeaver, African Storybook, Biblioteca Nacional Digital → foco lusófono e infantil
3. **Secção "Cursos" (só links), equilibrada por área:** NAU, OpenWHO, Lúmina, Embrapa e-Campo, Aprenda Mais, Escult, Khan Academy PT, Fundação Bradesco, MIT OCW, e na tecnologia CS50, freeCodeCamp, DIO e Alura (máximo 20%)
4. **Secção "Mais conteúdo":** PhET, LibriVox, Wikipédia, BDTD/RCAAP

## 🚫 Fontes proibidas

**Z-Library, Library Genesis (LibGen), Sci-Hub, Anna's Archive** e sites semelhantes distribuem livros protegidos sem autorização. Aparecem com frequência nas pesquisas (incluindo nesta), mas **nunca** devem ser ligados nem importados, nem partilhados no grupo ou no canal do WhatsApp.

## Cuidados

- O **domínio público depende do país** (em Portugal e no Brasil, em regra, 70 anos após a morte do autor). Uma obra livre nos EUA (Gutenberg) pode não o ser noutro país. Em caso de dúvida, mostrar só o link para a fonte original.
- Guardar sempre **licença e fonte** de cada item e mostrar a atribuição exigida pelas licenças CC (ex.: autor, ilustrador, licença).
- As plataformas mudam: rever os links a cada semestre.
- **Elegibilidade por país:** as plataformas da secção 4.2 podem exigir CPF ou conta gov.br e só servem a alunos no Brasil. Falta decidir onde estão os alunos (Brasil, Portugal, Angola...) para definir as prioridades.
