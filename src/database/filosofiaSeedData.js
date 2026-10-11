/**
 * Acervo Curado de Filosofia no GitHub (Listas, Cursos, Ferramentas e Obras Clássicas)
 * Apenas metadados + links externos — NENHUM conteúdo armazenado localmente (regra AGENTS.md).
 * Pesquisa e verificação realizadas em 11/10/2026 (estrelas e links testados, HTTP 200).
 * Inclui filosofia alemã (Kant, Idealismo Alemão) e recursos pedagógicos em francês.
 */

const filosofiaBooks = [
  // ========== LISTAS CURADAS E AGREGADORES ==========
  {
    "titulo": "Mind Expanding Books — Filosofia e Além",
    "subtitulo": "Hackerkid/Mind-Expanding-Books (14.370★)",
    "autor": "Hackerkid / Comunidade",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "mind-expanding-books",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "O maior agregador de leituras do GitHub sobre filosofia, ciência, história e desenvolvimento pessoal: dezenas de listas temáticas (filosofia, física, mente, sociedade) com links para livros e recursos livres.",
    "capaUrl": "https://raw.githubusercontent.com/Hackerkid/Mind-Expanding-Books/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/Hackerkid/Mind-Expanding-Books" }
    ]
  },
  {
    "titulo": "Awesome Philosophy",
    "subtitulo": "HussainAther/awesome-philosophy (285★)",
    "autor": "Hussain Ather",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "awesome-philosophy",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Lista awesome canónica de filosofia: podcasts, periódicos, enciclopédias (Stanford Encyclopedia, Internet Encyclopedia of Philosophy), bibliotecas digitais, cursos e canais de vídeo, organizados por tradição e período.",
    "capaUrl": "https://raw.githubusercontent.com/HussainAther/awesome-philosophy/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/HussainAther/awesome-philosophy" }
    ]
  },
  {
    "titulo": "Philosophy — Livros e Recursos",
    "subtitulo": "Jfaler/Philosophy (370★)",
    "autor": "J. Faler",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "jfaler-philosophy",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Lista estruturada de livros e recursos de filosofia, com obras fundamentais de Platão, Aristóteles, Kant, Nietzsche, Wittgenstein e autores contemporâneos, organizadas para leitura progressiva.",
    "capaUrl": "https://raw.githubusercontent.com/Jfaler/Philosophy/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/Jfaler/Philosophy" }
    ]
  },
  {
    "titulo": "Awesome Stoicism — Estoicismo",
    "subtitulo": "DavidWells/awesome-stoicism (141★)",
    "autor": "David Wells",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "awesome-stoicism",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Recursos de estoicismo: Sêneca, Epicteto e Marco Aurélio, com traduções livres, aplicações práticas, podcasts e textos sobre a filosofia estoica como prática diária.",
    "capaUrl": "https://raw.githubusercontent.com/DavidWells/awesome-stoicism/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/DavidWells/awesome-stoicism" }
    ]
  },
  {
    "titulo": "Awesome Philosophy & Computer Science",
    "subtitulo": "glennstreet/awesome-philosophy-compsci (111★)",
    "autor": "Glenn Street",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "awesome-philosophy-compsci",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Lista de recursos que cruzam filosofia e ciência da computação: lógica, fundamentos da matemática, filosofia da mente, computabilidade, ética da IA e textos clássicos da teoria da computação.",
    "capaUrl": "https://raw.githubusercontent.com/glennstreet/awesome-philosophy-compsci/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/glennstreet/awesome-philosophy-compsci" }
    ]
  },
  {
    "titulo": "Awesome Ethics — Ética",
    "subtitulo": "HussainAther/awesome-ethics (74★)",
    "autor": "Hussain Ather",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "awesome-ethics",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Lista curada de ética: teorias normativas, ética aplicada, bioética, ética da tecnologia e da inteligência artificial, com periódicos, cursos e guias de debate.",
    "capaUrl": "https://raw.githubusercontent.com/HussainAther/awesome-ethics/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/HussainAther/awesome-ethics" }
    ]
  },
  {
    "titulo": "A Filosofia do Zen do Python",
    "subtitulo": "filiplajszczak/awesome-zen-of-python (60★)",
    "autor": "Filip Lajszczak",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "awesome-zen-of-python",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Coleção sobre o Zen do Python (PEP 20): guias, traduções, análises e derivações da filosofia de projeto da linguagem Python — o elo entre programação e reflexão filosófica.",
    "capaUrl": "https://raw.githubusercontent.com/filiplajszczak/awesome-zen-of-python/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/filiplajszczak/awesome-zen-of-python" }
    ]
  },
  // ========== FILOSOFIA E INTELIGÊNCIA ARTIFICIAL ==========
  {
    "titulo": "PhiloAgents — Quando a Filosofia Encontra a IA",
    "subtitulo": "neural-maze/philoagents-course (1.551★)",
    "autor": "Neural Maze",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "philoagents-course",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Curso aberto que une filosofia e agentes de IA: ética aplicada, simulações de diálogos filosóficos e experimentos com LLMs, com código, notebooks e material didático completo.",
    "capaUrl": "https://raw.githubusercontent.com/neural-maze/philoagents-course/main/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/neural-maze/philoagents-course" }
    ]
  },
  {
    "titulo": "CMU 10-721 — Filosofia da Inteligência de Máquina",
    "subtitulo": "acmi-lab/cmu-10721 (264★)",
    "autor": "Carnegie Mellon University",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "cmu-10721-philosophy",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Repositório oficial do curso da CMU 'Philosophical Foundations of Machine Intelligence': experimentos mentais, agência, consciência, alinhamento e os limites do conhecimento do aprendizado automático.",
    "capaUrl": "https://raw.githubusercontent.com/acmi-lab/cmu-10721-philosophy-machine-intelligence/main/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/acmi-lab/cmu-10721-philosophy-machine-intelligence" }
    ]
  },
  {
    "titulo": "The Pile PhilPapers — Corpus Filosófico",
    "subtitulo": "thoppe/The-Pile-PhilPapers (20★)",
    "autor": "The Pile / PhilPapers",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "pile-philpapers",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Ferramentas para descarregar, analisar e filtrar dados de filosofia (PhilPapers) usados no corpus The Pile de treino de modelos de linguagem: um dos poucos grandes corpora filosóficos estruturados.",
    "capaUrl": "https://raw.githubusercontent.com/thoppe/The-Pile-PhilPapers/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/thoppe/The-Pile-PhilPapers" }
    ]
  },
  {
    "titulo": "philosophy-mcp — Textos Filosóficos via MCP",
    "subtitulo": "sea9401/philosophy-mcp (9★)",
    "autor": "sea9401",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "philosophy-mcp",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Servidor MCP (Model Context Protocol) que expõe textos e bibliografia filosófica — PhilPapers e PhilArchive — a assistentes de IA, permitindo pesquisa erudita a partir de ferramentas locais.",
    "capaUrl": "https://raw.githubusercontent.com/sea9401/philosophy-mcp/main/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/sea9401/philosophy-mcp" }
    ]
  },
  {
    "titulo": "Agora Cósmica — 30 Figuras Históricas Conversáveis",
    "subtitulo": "chipmates/agoracosmica (148★)",
    "autor": "chipmates",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "agoracosmica",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "'Uma biblioteca viva à conversa': trinta figuras históricas (filósofos, cientistas e pensadores) com as suas obras, acessíveis por diálogo — abordagem lúdica ao estudo da história das ideias.",
    "capaUrl": "https://raw.githubusercontent.com/chipmates/agoracosmica/main/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/chipmates/agoracosmica" }
    ]
  },
  // ========== FILOSOFIA ALEMÃ (KANT E IDEALISMO ALEMÃO) ==========
  {
    "titulo": "Crítica da Razão Pura — Mapa Mental de Kant",
    "subtitulo": "ilalev/KdrV_mindmap (4★)",
    "autor": "I. A. Lev",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "kdr-v-mindmap",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Mapa mental interativo da Crítica da Razão Pura de Immanuel Kant: estrutura das doutrinas (estética transcendentais, analítica, dialética), conceitos e relações entre as partes da obra fundamental do idealismo alemão.",
    "capaUrl": "https://raw.githubusercontent.com/ilalev/KdrV_mindmap/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/ilalev/KdrV_mindmap" }
    ]
  },
  {
    "titulo": "Crítica da Razão Pura de Kant — Edição Completa",
    "subtitulo": "cartheur-monographs/Kant-Critique",
    "autor": "cartheur-monographs",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "kant-critique-monographs",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "dominio-publico",
    "sinopse": "Monografia sobre a Crítica da Razão Pura de Kant e obras correlatas, reunidas em repositório de monografias: material de consulta para o estudo do criticalismo kantiano.",
    "capaUrl": "https://raw.githubusercontent.com/cartheur-monographs/Kant-Critique/main/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/cartheur-monographs/Kant-Critique" }
    ]
  },
  {
    "titulo": "Skills de Idealismo Alemão (Kant e Hegel)",
    "subtitulo": "german-idealism-codex-skills",
    "autor": "Equinox7379",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "german-idealism-codex-skills",
    "ano": 2026,
    "paginas": 0,
    "idioma": "de",
    "licenca": "outro",
    "sinopse": "Conjunto de skills (no formato aberto de skills de agentes) dedicado ao Idealismo Alemão: filosofia crítica de Kant e a Fenomenologia do Espírito de Hegel, para uso com assistentes de IA em estudo e tradução.",
    "capaUrl": "https://raw.githubusercontent.com/Equinox7379/german-idealism-codex-skills/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/Equinox7379/german-idealism-codex-skills" }
    ]
  },
  {
    "titulo": "Artigos de Filosofia em Alemão",
    "subtitulo": "Knusperhase/philosophy",
    "autor": "Knusperhase",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "knusperhase-philosophy",
    "ano": 2026,
    "paginas": 0,
    "idioma": "de",
    "licenca": "outro",
    "sinopse": "Coleção de artigos e ensaios de filosofia integralmente em alemão — um dos raros repositórios do GitHub com produção filosófica contemporânea em língua alemã.",
    "capaUrl": "/capas/tech/tech_482.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/Knusperhase/philosophy" }
    ]
  },
  {
    "titulo": "A Crítica da Razão Pura Resumida para Linguistas",
    "subtitulo": "kant-for-linguists",
    "autor": "free-variation",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "kant-for-linguists",
    "ano": 2026,
    "paginas": 0,
    "idioma": "en",
    "licenca": "outro",
    "sinopse": "Resumo breve e acessível da Crítica da Razão Pura de Kant, escrito para linguistas: categorias, intuições puras e a distinção entre entendimento e sensibilidade, ligando epistemologia kantiana e teoria da linguagem.",
    "capaUrl": "/capas/tech/tech_483.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/free-variation/kant-for-linguists" }
    ]
  },
  // ========== OBRAS CLÁSSICAS EM DOMÍNIO PÚBLICO ==========
  {
    "titulo": "Critique of Pure Reason",
    "subtitulo": "Crítica da Razão Pura — Immanuel Kant",
    "autor": "Immanuel Kant (trad. J. M. Meiklejohn)",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "4280",
    "ano": 1781,
    "paginas": 336,
    "idioma": "en",
    "licenca": "dominio-publico",
    "sinopse": "A obra fundadora do idealismo alemão e um dos textos decisivos da filosofia ocidental: como o conhecimento é possível, os limites da razão pura e a distinção entre fenómeno e coisa-em-si. Edição clássica em inglês no Project Gutenberg.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/4280/pg4280.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/4280" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/4280.epub3.images" }
    ]
  },
  {
    "titulo": "Critique of Practical Reason",
    "subtitulo": "Crítica da Razão Prática — Immanuel Kant",
    "autor": "Immanuel Kant (trad. Thomas King)",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "5683",
    "ano": 1788,
    "paginas": 220,
    "idioma": "en",
    "licenca": "dominio-publico",
    "sinopse": "Segunda crítica kantiana, dedicada à moral: o imperativo categórico, a liberdade da vontade e a fundamentação da ética na razão prática, complemento necessário da Crítica da Razão Pura.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/5683/pg5683.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/5683" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/5683.epub3.images" }
    ]
  },
  {
    "titulo": "A Commentary to Kant's Critique of Pure Reason",
    "subtitulo": "Comentário à Crítica da Razão Pura — Norman Kemp Smith",
    "autor": "Norman Kemp Smith",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "43572",
    "ano": 1918,
    "paginas": 560,
    "idioma": "en",
    "licenca": "dominio-publico",
    "sinopse": "O comentário clássico de referência à Crítica da Razão Pura de Kant, ainda hoje usado em cursos de filosofia: análise linha a linha das teses kantianas e do seu contexto leibniziano-wolffiano.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/43572/pg43572.cover.medium.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.gutenberg.org/ebooks/43572" },
      { "formato": "epub", "url": "https://www.gutenberg.org/ebooks/43572.epub3.images" }
    ]
  },
  {
    "titulo": "The Problems of Philosophy",
    "subtitulo": "Bertrand Russell — Standard Ebooks",
    "autor": "Bertrand Russell",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "standardebooks",
    "fonteIdExterno": "russell-problems-of-philosophy",
    "ano": 1912,
    "paginas": 180,
    "idioma": "en",
    "licenca": "dominio-publico",
    "sinopse": "Introdução breve e célebre de Bertrand Russell aos problemas centrais da filosofia: conhecimento sensível, idealismo, verdade e falsidade, indução e limites do conhecimento. Edição digital de alta qualidade da Standard Ebooks (dedicação CC0).",
    "capaUrl": "https://standardebooks.org/ebooks/bertrand-russell/the-problems-of-philosophy/downloads/cover.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://standardebooks.org/ebooks/bertrand-russell/the-problems-of-philosophy" }
    ]
  },
  {
    "titulo": "The Consolation of Philosophy",
    "subtitulo": "A Consolação da Filosofia — Boécio",
    "autor": "Anício Manlio Torquato Boécio (trad. H. R. James)",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "standardebooks",
    "fonteIdExterno": "boethius-consolation",
    "ano": 524,
    "paginas": 210,
    "idioma": "en",
    "licenca": "dominio-publico",
    "sinopse": "Um dos textos mais lidos do primeiro milénio: o prisioneiro Boécio dialoga com a personificação da Filosofia sobre fortuna, providência, liberdade e o bem verdadeiro. Ponte entre a filosofia antiga e a Idade Média.",
    "capaUrl": "https://standardebooks.org/ebooks/boethius/the-consolation-of-philosophy/h-r-james/downloads/cover.jpg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.standardebooks.org/ebooks/boethius/the-consolation-of-philosophy/h-r-james" }
    ]
  },
  // ========== FILOSOFIA EM OUTRAS LÍNGUAS ==========
  {
    "titulo": "Ressources pour l'enseignement de la philosophie",
    "subtitulo": "Recursos de Ensino de Filosofia (França)",
    "autor": "eyssette",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "enseignement-philosophie-fr",
    "ano": 2026,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "outro",
    "sinopse": "Recursos gerais partilhados para o ensino de filosofia em francês: base de dados de sujets de dissertation do bac filosóphique, textos, exercícios e material de apoio para professores e estudantes.",
    "capaUrl": "https://raw.githubusercontent.com/eyssette/ressources-generales-enseignement-philosophie/master/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/eyssette/ressources-generales-enseignement-philosophie" },
      { "formato": "html", "url": "https://github.com/eyssette/sujets-philosophie" }
    ]
  },
  {
    "titulo": "PhiloBots — Chatbots de Filósofos",
    "subtitulo": "La-caverne-de-Platon/PhiloBots",
    "autor": "La caverne de Platon",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "github-filosofia",
    "fonteIdExterno": "philobots",
    "ano": 2026,
    "paginas": 0,
    "idioma": "fr",
    "licenca": "outro",
    "sinopse": "Chatbots de filósofos construídos diretamente a partir das obras originais, em francês: diálogo simulado com pensadores clássicos como ferramenta de estudo e discussão.",
    "capaUrl": "https://raw.githubusercontent.com/La-caverne-de-Platon/PhiloBots/main/README.md",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/La-caverne-de-Platon/PhiloBots" }
    ]
  }
];

module.exports = { filosofiaBooks };
