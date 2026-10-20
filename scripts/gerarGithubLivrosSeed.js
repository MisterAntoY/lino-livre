/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Gerador — Seed Data dos 100 Repositórios GitHub de Livros (Fase 5)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Produz:
 *   1. src/database/githubLivrosSeedData.js   → seed data (metadados + links)
 *   2. public/capas/tech/tech_XXXX.svg        → 100 capas
 *   3. .scratch/gh-livros-synopses.json       → sinopses por locale (pt/en/de/fr/zh)
 *
 * AGENTS.md — CONFORMIDADE ESTRITA:
 *   • Apenas METADADOS (título, autor, ano, idioma, licença, sinopse, capa)
 *   • ZERO armazenamento local de ficheiros de livro
 *   • Leitura/download → redireccionamento HTTP 302 para o GitHub / fonte original
 *   • `conteudo_texto` fica NULL / descritivo — nunca o livro em si
 */
const fs = require('node:fs');
const path = require('node:path');

const { LISTA_100 } = require('../src/database/githubLivrosLista');

const pool = JSON.parse(fs.readFileSync('.scratch/gh-livros-curados.json', 'utf-8'));
const meta = new Map(pool.map(r => [r.full_name.toLowerCase(), r]));

// ── Fonte (nova) ───────────────────────────────────────────────────────────
const FONTE_SLUG = 'github-livros-acervo';
const FONTE_NOME = 'Repositórios GitHub de Livros (Acervo Aberto)';

// ── Classificação editorial por repositório ────────────────────────────────
// [categoria, idioma, autor, sinopseBase]
const EDITORIAL = {
  'DoooReyn/All-IT-Ebooks': ['Tecnologia & Guias Digitais', 'zh', 'DoooReyn', 'Acervo com perto de 10 000 eBooks de informática, reunidos ao longo de anos e organizados por tecnologia. Serve de arquivo de consulta rápida para programadores que procuram títulos clássicos em formato digital.'],
  'LeungGeorge/grimoire-kindle': ['Tecnologia & Guias Digitais', 'zh', 'LeungGeorge', 'Coleção de mais de mil livros eletrónicos preparados para Kindle, catalogados por género e nível de dificuldade.'],
  'bartbussmann/lesswrong_ebook_library': ['Apoio Pedagógico & Filosofia', 'en', 'Bart Bussmann', 'Biblioteca de eBooks da comunidade LessWrong, reunindo obras sobre racionalidade, epistemologia, decisionismo e filosofia técnica.'],
  'RongleXie/java-books-collections': ['Tecnologia & Guias Digitais', 'zh', 'RongleXie', 'Coleção compartilhada de livros de programação Java, com foco em JVM, Spring, arquitetura e padrões de desenho.'],
  'com-puter-tips/Technical-eBooks': ['Tecnologia & Guias Digitais', 'en', 'com-puter-tips', 'Conjunto de PDFs de tutoriais de programação para várias linguagens, disponíveis para leitura e download directo no repositório.'],
  'ThisIsSakshi/Books': ['Tecnologia & Guias Digitais', 'en', 'ThisIsSakshi', 'Pasta de livros e outros recursos de programação, reunindo PDFs de algoritmos, estruturas de dados, Competitive Programming e engenharia de software.'],
  'madhurimarawat/Developer-Resources-Hub': ['Tecnologia & Guias Digitais', 'en', 'Madhurimarawat', 'Coleção abrangente de recursos para desenvolvedores: guias, livros, artigos e ferramentas de todas as áreas da engenharia de software.'],
  'MinhNguyenDS/AI-pdf-books': ['Ciência de Dados & Inteligência Artificial', 'en', 'MinhNguyenDS', 'Repositório de livros em PDF sobre Inteligência Artificial e Ciência de Dados, com foco em engenharia de ML, LLMs e MLOps.'],
  'BUAA-CI-LAB/Literatures-on-GNN-Acceleration': ['Ciência de Dados & Inteligência Artificial', 'en', 'BUAA-CI-LAB', 'Lista de leitura de literatura científica sobre aceleração de redes neuronais convolucionais, com artigos e trabalhos de investigação seleccionados.'],
  'mbreuss/diffusion-literature-for-robotics': ['Ciência de Dados & Inteligência Artificial', 'en', 'Michael Breuss', 'Síntese dos artigos e publicaciones centrais sobre modelos de difusão aplicados à robótica, organizados por tema e com anotações do autor.'],
  'josonle/Coding-Now': ['Tecnologia & Guias Digitais', 'zh', 'josonle', 'Diário de estudo com notas pessoais, eBooks, vídeos e recursos seleccionados sobre grandes temas da computação.'],
  'devxhub/awesome-book-collection': ['Tecnologia & Guias Digitais', 'en', 'devxhub', 'Lista curada dos melhores livros para engenheiros de software, com recomendações por nível, área e linguagem.'],
  'zhangbc/eBooks': ['Tecnologia & Guias Digitais', 'zh', 'zhangbc', 'Coleção de eBooks chineses clássicos de informática, com foco em kernels, redes e arquitectura de sistemas.'],
  'nschaetti/SFGram-dataset': ['Romance & Crônicas', 'en', 'Nils Schaetti', 'Conjunto de dados de ficção científica de domínio público, usado em investigação de processamento de linguagem natural.'],
  'jkoendev/optimal-control-literature-software': ['Ciência de Dados & Inteligência Artificial', 'en', 'J. Koender', 'Lista de literatura científica e software para controlo óptimo e métodos numéricos aplicados a sistemas de controlo.'],
  'mizzunet/awesome-calibre-kindle': ['Tecnologia & Guias Digitais', 'en', 'mizzunet', 'Lista curada de recursos Calibre e Kindle: guias de conversão, plugins, dúvidas frequentes e ferramentas de gestão de biblioteca.'],
  'Hack-with-Github/Free-Security-eBooks': ['Tecnologia & Guias Digitais', 'en', 'Hack-with-Github', 'Colecção de eBooks gratuitos sobre segurança informática e hacking: redes, criptografia, forense, engenharia social e Ethical Hacking.'],
  'waylau/books-collection': ['Tecnologia & Guias Digitais', 'zh', 'waylau', 'Colecção de livros abertos para programadores, cobrindo linguagens, algoritmos, sistemas, bases de dados e prática profissional.'],
  'harvard-edge/cs249r_book': ['Ciência de Dados & Inteligência Artificial', 'en', 'Harvard Edge', 'Machine Learning Systems — o livro de referência sobre como construir sistemas de ML em produção, com capítulos sobre dados, treino, inferência e avaliação.'],
  'nndl/nndl': ['Ciência de Dados & Inteligência Artificial', 'zh', 'nndl', '《神经网络与深度学习》segunda edição: livro completo sobre redes neuronais e aprendizado profundo, com índice de capítulos, recursos de estudo e erratas.'],
  'openmlsys/openmlsys': ['Ciência de Dados & Inteligência Artificial', 'en', 'OpenMLSYS', 'Machine Learning Systems: Design and Implementation (V2) — versão revista e ampliada do livro sobre sistemas de ML em produção.'],
  'vEnhance/napkin': ['Apoio Pedagógico & Filosofia', 'en', 'vEnhance', 'An Infinitely Large Napkin — manual de matemática experimental escrito em interpretador, que explica a análise infinitesimal de forma prática e visual.'],
  'AllenDowney/ThinkStats2': ['Ciência de Dados & Inteligência Artificial', 'en', 'Allen B. Downey', 'Think Stats (2.ª edição) — introdução à estatística usando Python, com foco em probabilidade Bayesiana e análise exploratória de dados.'],
  'AllenDowney/ThinkBayes2': ['Ciência de Dados & Inteligência Artificial', 'en', 'Allen B. Downey', 'Think Bayes (2.ª edição) — Bayesismo aplicado à resolução de problemas do dia-a-dia, com exercícios em Python.'],
  'AllenDowney/ThinkDSP': ['Ciência de Dados & Inteligência Artificial', 'en', 'Allen B. Downey', 'Think DSP — introdução ao processamento digital de sinais em Python, com exercícios sobre Fourier, filtragem e síntese.'],
  'AllenDowney/ThinkPython': ['Tecnologia & Guias Digitais', 'en', 'Allen B. Downey', 'Think Python — introdução à programação com Python, orientada por problemas, com exercícios em cada capítulo.'],
  'AllenDowney/ThinkStats': ['Ciência de Dados & Inteligência Artificial', 'en', 'Allen B. Downey', 'Notebooks da 3.ª edição de Think Stats: estatística descritiva, distribuições, testes de hipótese e regressão em Python.'],
  'AllenDowney/ModSimPy': ['Ciência de Dados & Inteligência Artificial', 'en', 'Allen B. Downey', 'Modeling and Simulation in Python — modelação e simulação computacional de sistemas físicos e biológicos, com notebooks práticos.'],
  'AllenDowney/ThinkComplexity2': ['Arquitetura & Engenharia de Software', 'en', 'Allen B. Downey', 'Think Complexity (2.ª edição) — ciência da computação como investigação de sistemas complexos: SMALL WORLDS, redes e encaminhamento.'],
  'AllenDowney/DSIRP': ['Ciência de Dados & Inteligência Artificial', 'en', 'Allen B. Downey', 'Data Structures and Information Retrieval in Python — estruturas de dados, tablas hash, índices invertidos e recuperação de informação.'],
  'AllenDowney/ThinkLinearAlgebra': ['Ciência de Dados & Inteligência Artificial', 'en', 'Allen B. Downey', 'A computational introduction to linear algebra — álgebra linear computacional com Python e projectos visuais.'],
  'source-academy/sicp': ['Apoio Pedagógico & Filosofia', 'en', 'Source Academy', 'Fontes XML do Structure and Interpretation of Computer Programs, com ferramentas para gerar a versão Scheme e a versão JavaScript do livro.'],
  'wizardforcel/sicp-py-zh': ['Apoio Pedagógico & Filosofia', 'zh', 'wizardforcel', 'Tradução para Python da Berkeley CS61a — SICP em Python, com exercícios e soluções comentadas.'],
  'weisscharlesj/SciCompforChemists': ['Apoio Pedagógico & Filosofia', 'en', 'Charles J. Weiss', 'Scientific Computing for Chemists with Python — livro gratuito sobre computação científica para químicos, com notebooks e exercícios.'],
  'cfgranda/ps4ds': ['Ciência de Dados & Inteligência Artificial', 'en', 'Carlos F. Granda', 'Probability and Statistics for Data Science — manual auto-contido de probabilidade e estatística para ciência de dados, em Python.'],
  'maitbayev/the-elements-of-statistical-learning': ['Ciência de Dados & Inteligência Artificial', 'en', 'Murat Bayatov', 'Notas e código (notebooks Jupyter) para The Elements of Statistical Learning — aprendizagem estatística, validação cruzada e métodos de redução de dimensionalidade.'],
  'NicklasVraa/LiX': ['Apoio Pedagógico & Filosofia', 'en', 'Nicklas Vraa', 'Composer de livros em LaTeX capaz de produzir dissertações, papers, manuais, romances e jornais a partir de uma única fonte de conteúdo.'],
  'AnMnv/eBook': ['Apoio Pedagógico & Filosofia', 'en', 'AnMnv', 'eBook LaTeX aberto com exemplos práticos, que demonstra como estruturar e publicar um livro técnico com controlos de versão.'],
  'captn3m0/google-sre-ebook': ['DevOps, Cloud & Infraestrutura', 'en', 'captn3m0', 'Gerador do Google SRE Book em EPUB, MOBI e PDF — o manual de engenharia de fiabilidade de sites do Google, disponível para leitura offline.'],
  'phodal/growth-ebook': ['Arquitetura & Engenharia de Software', 'zh', 'Phodal', 'Growth Engineering: The Definitive Guide — guia definitivo de engenharia de crescimento (growth engineer) em frontend, backend e dados.'],
  'phodal/growth-in-action': ['Arquitetura & Engenharia de Software', 'zh', 'Phodal', '全栈增长工程师实战 — casos práticos de engenharia de crescimento com código e lições aprendidas em projectos reais.'],
  'phodal/ideabook': ['Arquitetura & Engenharia de Software', 'zh', 'Phodal', 'Conjunto de projectos práticos de Growth Engineering: a acção de uma ideia de crescimento Levada até à produção.'],
  'phodal/fe': ['Desenvolvimento Web & Mobile', 'zh', 'Phodal', '《我的职业是前端工程师》— um livro sobre a carreira de engenheiro frontend: competências, atitude e crescimento no ecossistema web.'],
  'azu/promises-book': ['Desenvolvimento Web & Mobile', 'ja', 'azu', 'JavaScript Promiseの本 — manual em japonês sobre Promises e async/await, com padrões de uso e antipadrões a evitar.'],
  'chinese-poetry/chinese-poetry': ['Teatro & Poesia', 'zh', 'chinese-poetry', 'A base de dados de poesia chinesa mais completa do mundo: mais de 300 mil poemas com metadados, autores, dynastias e formas poéticas.'],
  'guanpengchn/awesome-books': ['Tecnologia & Guias Digitais', 'zh', 'guanpengchn', 'Lista de livros recomendados por programadores chineses, com PDFs seleccionados e cobrindo informática, gestão e sciences humanas.'],
  'sindresorhus/awesome-scifi': ['Romance & Crônicas', 'en', 'Sindre Sorhus', 'Sci-Fi worth consuming — lista seleccionada de ficção científica, com links para leitura online gratuita em bibliotecas abertas.'],
  'RichardLitt/awesome-fantasy': ['Romance & Crônicas', 'en', 'Richard Litt', 'Fantasy literature worth reading — lista de literatura de fantasia com títulos de acesso livre, organizados por subgénero.'],
  'EbookFoundation/free-science-books': ['Apoio Pedagógico & Filosofia', 'en', 'EbookFoundation', 'Colecção de livros de ciência gratuitos, com foco em matemática, física, química, biologia e ciências da computação.'],
  'linsa-io/books': ['Tecnologia & Guias Digitais', 'en', 'linsa-io', 'Awesome Books — grande lista curada de livros de tecnologia, ciência, história e negócios, com links de leitura gratuita.'],
  'chapin666/books': ['Tecnologia & Guias Digitais', 'en', 'chapin666', 'Colecção popular de livros recomendados com links para leitura online e domínios de confiança.'],
  'Werneror/Poetry': ['Teatro & Poesia', 'zh', 'Werneror', 'Base de dados de 850 mil poemas chineses antigos e modernos, com metadados de autor, dynasty, forma e texto integral.'],
  'sheepzh/poetry': ['Teatro & Poesia', 'zh', 'sheepzh', 'O corpus de poesia moderna em língua chinesa mais completo do planeta: 3 000+ poetas, 80 mil poemas e 15 milhões de caracteres.'],
  'snowtraces/poetry-source': ['Teatro & Poesia', 'zh', 'snowtraces', 'Conjunto de dados e projecto de exibição de poesia e-song clássica chinesa, cobrindo de Han a Qing, com indexação e pesquisa.'],
  'abroshan39/ghazal': ['Teatro & Poesia', 'fa', 'abroshan39', 'Ghazal — biblioteca de poesia persa (غزل: کتابخانه شعر فارسی) com o corpus de ghazal em formato legível por máquina.'],
  'palewire/cummings.ee': ['Romance & Crônicas', 'en', 'palewire', 'Colecção da obra completa de Edward Estlin Cummings, presented na forma de um site de leitura acessível e navegável.'],
  'palemoky/chinese-poetry-api': ['Teatro & Poesia', 'zh', 'palemoky', '诗泉 — API de alto desempenho para a poesia clássica chinesa, com pesquisa de texto integral e metadados de cada poema.'],
  'wx-chevalier/Awesome-Books-Notes': ['Tecnologia & Guias Digitais', 'zh', 'wx-chevalier', 'Awesome CS Books — livros clássicos de ciência da computação com digests de cada capítulo, cobrindo linguagens, algoritmos e sistemas.'],
  'zslucky/awesome-AI-books': ['Ciência de Dados & Inteligência Artificial', 'en', 'zslucky', 'Lista de livros sobre inteligência artificial e machine learning com PDFs para leitura, cobrindo fundamentos, visão, NLP e RL.'],
  'Jason2Brownlee/awesome-llm-books': ['Ciência de Dados & Inteligência Artificial', 'en', 'Jason Brownlee', 'Awesome LLM Books — lista curada de livros sobre modelos de linguagem, RAG, agentes e engenharia de prompts.'],
  'camoverride/lit': ['Ciência de Dados & Inteligência Artificial', 'en', 'camoverride', 'Literatura para o praticante autodidata de IA — bibliografia organizada por tema, com livros librement disponíveis.'],
  'minhaj-313/Data-Science-Books': ['Ciência de Dados & Inteligência Artificial', 'en', 'minhaj-313', 'Colecção curada de livros de ciência de dados, com foco em análise exploratória, visualização e estatística aplicada.'],
  'getbookshelves/free-ebooks': ['Tecnologia & Guias Digitais', 'en', 'getbookshelves', 'Guia de fontes de eBooks gratuitas e legais — domínios públicos, obras com licença aberta e bibliotecas sem DRM.'],
  'DistributedProofreaders/dproofreaders': ['Tecnologia & Guias Digitais', 'en', 'Distributed Proofreaders', 'Distributed Proofreaders — aplicação web que coordena milhares de volunteers para corrigir, formatar e publicar livros do Project Gutenberg.'],
  'nao-sabemos-js/You-Dont-Know-JS': ['Desenvolvimento Web & Mobile', 'pt', 'Não Sabemos JS', 'Série de livros You Don\'t Know JS em português do Brasil — fundamentos de JavaScript, escopo, objectos, coerção de tipos e async.'],
  'adamschwartz/magic-of-css': ['Desenvolvimento Web & Mobile', 'en', 'Adam Schwartz', 'The Magic of CSS — curso de CSS que ensina a transformar designs em implementações elegantemente cross-browser.'],
  'hoanhan101/ultimate-go': ['Tecnologia & Guias Digitais', 'en', 'Hoang Anh', 'The Ultimate Go Study Guide — guia de estudo exhaustivo de Go, com links para cada capítulo e exercícios práticos.'],
  'aalhour/C-Sharp-Algorithms': ['Tecnologia & Guias Digitais', 'en', 'Ahmed Alhour', 'Implementações prontas a usar de estruturas de dados e algoritmos em C#, com testes e explicações de complexidade.'],
  'crowdagger/crowbook': ['Apoio Pedagógico & Filosofia', 'en', 'crowdagger', 'Converte livros escritos em Markdown para HTML, LaTeX/PDF e EPUB — uma cadeia de publicação completa num único tool.'],
  'rstudio/bookdown': ['Apoio Pedagógico & Filosofia', 'en', 'RStudio', 'Authoring Books and Technical Documents with R Markdown — publicação de livros e documentos técnicos reprodutíveis com R Markdown.'],
  'honkit/honkit': ['Apoio Pedagógico & Filosofia', 'en', 'HonKit', 'HonKit constrói livros bonitos a partir de Markdown — fork sukcessor do GitBook, com saída estática em HTML, EPUB e PDF.'],
  'pressbooks/pressbooks': ['Apoio Pedagógico & Filosofia', 'en', 'Pressbooks', 'Open publishing, open web, open source — plataforma de publicação editorial para livros, relatórios e cursos, com exportação para EPUB.'],
  'asciidoctor/asciidoctor-epub3': ['Apoio Pedagógico & Filosofia', 'en', 'Asciidoctor', 'Asciidoctor EPUB3 — extensão que converte documentos AsciiDoc em livros EPUB3 completos e conformes.'],
  'mkdocs/catalog': ['Tecnologia & Guias Digitais', 'en', 'MkDocs', 'Lista de projectos e plugins MkDocs, com descrições detalhadas — o catálogo de referência da comunidade MkDocs.'],
  'haroldtreen/epub-press-clients': ['Apoio Pedagógico & Filosofia', 'en', 'haroldtreen', 'Clientes para construir livros com EpubPress — API e bibliotecas para integrar publicação EPUB em pipelines próprios.'],
  'reader-dict/monolingual': ['Tecnologia & Guias Digitais', 'en', 'reader-dict', 'O dicionário multilíngue universal mais abrangente, em formato legível por máquina, para uso em leitores de eBook.'],
  'w3c/epubcheck': ['Apoio Pedagógico & Filosofia', 'en', 'W3C', 'Verificador de conformidade EPUB do W3C — valida a estrutura, os metadados e os recursos de publicações EPUB 2 e 3.'],
  'saga-soft/novelWriter': ['Romance & Crônicas', 'en', 'SAGA Software', 'novelWriter — editor de texto simples para escrever romances, com estrutura de projectos, capítulos, personagens e indexação.'],
  'standardebooks/tools': ['Apoio Pedagógico & Filosofia', 'en', 'Standard Ebooks', 'Toolset do Standard Ebooks para produzir livros electrónicos de alta qualidade: saneamento, formatação e validação de EPUB.'],
  'standardebooks/web': ['Apoio Pedagógico & Filosofia', 'en', 'Standard Ebooks', 'Código-fonte do sítio Standard Ebooks — a biblioteca pública de livros gratuitos com leitura online em todos os formatos.'],
  'standardebooks/manual': ['Apoio Pedagógico & Filosofia', 'en', 'Standard Ebooks', 'Manual do Standard Ebooks — guias de estilo, de marca e de produção que definem os padrões de qualidade da colecção.'],
  'DuckTapeKiller/global-book-search': ['Apoio Pedagógico & Filosofia', 'en', 'DuckTapeKiller', 'Extractor avançado de metadados e capas de livros, com pesquisa global e códigos QR para identificação de exemplares.'],
  'getbookshelves/opds-catalog': ['Tecnologia & Guias Digitais', 'en', 'getbookshelves', 'Guia do OPDS — o Open Publication Distribution System para catálogos e leitura em dispositivos eBooks.'],
  'booktype/Booktype': ['Apoio Pedagógico & Filosofia', 'en', 'Booktype', 'Plataforma editorial open source para produzir livros bonitos, com fluxo de revisão, controlo de versões e exportação multi-formato.'],
  'internetarchive/openlibrary': ['Tecnologia & Guias Digitais', 'en', 'Internet Archive', 'One webpage for every book ever published — o catálogo de metadados de livros mais abrangente jamais construído, com API pública.'],
  'internetarchive/bookreader': ['Tecnologia & Guias Digitais', 'en', 'Internet Archive', 'O Internet Archive BookReader — componente de leitura de libros digitalizados com zoom, realce e pesquisa no texto.'],
  'bookwyrm-social/bookwyrm': ['Tecnologia & Guias Digitais', 'en', 'BookWyrm', 'Leitura e crítica social descentralizada via ActivityPub — rede de leitura federada, alternativa às plataformas centralizadas.'],
  'c-w/gutenberg': ['Tecnologia & Guias Digitais', 'en', 'c-w', 'Interface simples para o corpus do Project Gutenberg — acesso leve ao catálogo e aos textos integralmente digitalizados.'],
  'garethbjohnson/gutendex': ['Tecnologia & Guias Digitais', 'en', 'Gareth Johnson', 'Gutendex — API JSON não-oficial para o Project Gutenberg, com pesquisa, paginação e metadados normalizados.'],
  'VanOns/laraberg': ['Desenvolvimento Web & Mobile', 'en', 'Van Ons', 'Implementação do Project Gutenberg para Laravel — gerador de páginas estáticas com pesquisa e leitura de livros públicos.'],
  'typemill/typemill': ['Apoio Pedagógico & Filosofia', 'en', 'Typemill', 'CMS flat-file baseado em Markdown e desenhado para publicar livros, com plugin de exportação e tema editorial.'],
  'uccser/cs-field-guide': ['Apoio Pedagógico & Filosofia', 'en', 'University of Cape Town', 'Guia interactivo e gratuito de informática para estudantes do ensino secundário, com exercícios em Python e lógica computacional.'],
  'PatMorin/ods': ['Tecnologia & Guias Digitais', 'en', 'Pat Morin', 'Open Data Structures — livro aberto em Java sobre estruturas de dados, com implementação prática e análise de complexidade.'],
  'Melaniewalsh/Intro-Cultural-Analytics': ['Ciência de Dados & Inteligência Artificial', 'en', 'Melanie Walsh', 'Introdução a Cultural Analytics com Python — métodos de análise de texto, imagem e código para as humanidades digitais.'],
  'fdv/running-elasticsearch-fun-profit': ['DevOps, Cloud & Infraestrutura', 'en', 'FreeDev', 'Running Elasticsearch for Fun and Profit — guia prático de operação, indexação e afinação de clusters Elasticsearch.'],
  'cybergalactic/FossenHandbook': ['Apoio Pedagógico & Filosofia', 'en', 'cybergalactic', 'Handbook of Marine Craft Hydrodynamics and Motion Control — manual técnico completo de hidrodinâmica, com teoria, gráficos e código.'],
  'JuliaDynamics/NonlinearDynamicsTextbook': ['Ciência de Dados & Inteligência Artificial', 'en', 'JuliaDynamics', 'Nonlinear Dynamics: A concise introduction interlaced with code — introdução concisa a sistemas dinâmicos não-lineares com simulações em Julia.'],
  'mca91/EconometricsWithR': ['Ciência de Dados & Inteligência Artificial', 'en', 'mca91', 'Companheiro interactivo do manual Introduction to Econometrics, com exercícios em R sobre regressão, modelos e inferência.'],
  'sdcuike/Clean-Code-Collection-Books': ['Arquitetura & Engenharia de Software', 'zh', 'sdcuike', 'Colecção de livros sobre a arte de escrever código — Clean Code e obras afins, com notas contra a aplicação mecânica de teorias.'],
  'bobbyiliev/introduction-to-sql': ['Tecnologia & Guias Digitais', 'en', 'bobbyiliev', 'Introdução ao SQL — eBook gratuito sobre consultas, junções, indexação e modelação de dados, com exercícios práticos.']
};

// ── Cores por categoria (para as capas) ─────────────────────────────────────
const CORES = {
  'Tecnologia & Guias Digitais': ['#1f1338', '#030712', '#a855f7'],
  'Ciência de Dados & Inteligência Artificial': ['#0c1a2e', '#020617', '#38bdf8'],
  'Apoio Pedagógico & Filosofia': ['#1a1408', '#0c0a03', '#f59e0b'],
  'Arquitetura & Engenharia de Software': ['#0f1f1a', '#030806', '#34d399'],
  'Desenvolvimento Web & Mobile': ['#1a0f1f', '#0a030d', '#e879f9'],
  'DevOps, Cloud & Infraestrutura': ['#0f172a', '#020617', '#f97316'],
  'Romance & Crônicas': ['#1f0f14', '#0c0307', '#fb7185'],
  'Teatro & Poesia': ['#1f1114', '#0c0406', '#c084fc']
};

const ICONES = {
  'Tecnologia & Guias Digitais': '<path d="M11 10L5 16l6 6M21 10l6 6-6 6M18 7l-4 18"/>',
  'Ciência de Dados & Inteligência Artificial': '<path d="M9 3v18M15 3v18M3 9h18M3 15h18"/><circle cx="12" cy="12" r="9"/>',
  'Apoio Pedagógico & Filosofia': '<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z"/><path d="M8 7h8M8 11h6"/>',
  'Arquitetura & Engenharia de Software': '<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>',
  'Desenvolvimento Web & Mobile': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/>',
  'DevOps, Cloud & Infraestrutura': '<path d="M18 10a4 4 0 00-7.7-1.6A5 5 0 006 12a4 4 0 00.6 8h13a4 4 0 00.3-8z"/><path d="M12 12v6M9 15l3 3 3-3"/>',
  'Romance & Crônicas': '<path d="M12 6.5C10 4.5 7 4 4 5v13c3-1 6-.5 8 1.5 2-2 5-2.5 8-1.5V5c-3-1-6-.5-8 1.5z"/><path d="M12 6.5v13"/>',
  'Teatro & Poesia': '<path d="M4 19h16M4 15h16M7 15V6h10v9M10 6v9M14 6v9"/>'
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ═══════════════════════════════════════════════════════════════════════════
// 1) CAPAS
// ═══════════════════════════════════════════════════════════════════════════
const CAPA_DIR = 'public/capas/tech';
fs.mkdirSync(CAPA_DIR, { recursive: true });

function gerarCapa(idx, dados) {
  const [c1, c2, cor] = CORES[dados.categoria] || CORES['Tecnologia & Guias Digitais'];
  const icone = ICONES[dados.categoria] || ICONES['Tecnologia & Guias Digitais'];
  const titulo = esc(dados.titulo.length > 30 ? dados.titulo.slice(0, 29) + '…' : dados.titulo);
  const autor = esc(dados.autor.length > 32 ? dados.autor.slice(0, 31) + '…' : dados.autor);
  const badge = `${dados.idioma.toUpperCase()} • OPEN REPOSITORY`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${cor}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${cor}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="400" height="600" fill="url(#bgGrad)"/>
  <rect width="400" height="600" fill="url(#gridPattern)"/>
  <circle cx="200" cy="200" r="100" fill="url(#glowGrad)"/>
  <rect x="0" y="0" width="14" height="600" fill="rgba(0,0,0,0.4)"/>
  <line x1="14" y1="0" x2="14" y2="600" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <g transform="translate(40, 42)">
    <rect width="190" height="26" rx="13" fill="rgba(255,255,255,0.06)" stroke="${cor}" stroke-opacity="0.4" stroke-width="1"/>
    <circle cx="15" cy="13" r="4" fill="${cor}"/>
    <text x="28" y="17" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="${cor}" letter-spacing="0.5">${badge}</text>
  </g>
  <g transform="translate(160, 160) scale(2.5)" fill="none" stroke="${cor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    ${icone}
  </g>
  <rect x="40" y="325" width="48" height="4" rx="2" fill="${cor}"/>
  <text x="40" y="365" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="800" fill="#f8fafc" letter-spacing="-0.5">${titulo}</text>
  <text x="40" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="${cor}" opacity="0.9">${esc(dados.repo)}</text>
  <text x="40" y="490" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">${autor}</text>
  <line x1="40" y1="535" x2="360" y2="535" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <g transform="translate(40, 555)">
    <circle cx="6" cy="6" r="3" fill="#38bdf8"/>
    <text x="16" y="9" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700" fill="#cbd5e1" letter-spacing="1">LINO LIVRE</text>
    <text x="96" y="9" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="400" fill="#64748b">• Acervo Digital Aberto</text>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 2) SEED DATA
// ═══════════════════════════════════════════════════════════════════════════
const LICENCA_MAP = {
  'CC0-1.0': 'cc0',
  'MIT': 'cc-by',
  'CC-BY-SA-4.0': 'cc-by-sa',
  'CC-BY-4.0': 'cc-by',
  'CC-BY-3.0': 'cc-by',
  'BSD-3-Clause': 'cc-by',
  'BSD-2-Clause': 'cc-by',
  'Apache-2.0': 'cc-by',
  'ISC': 'cc-by',
  'Unlicense': 'cc0',
  'WTFPL': 'cc-by',
  'CC-BY-SA-3.0': 'cc-by-sa',
  'MPL-2.0': 'cc-by-sa'
};

// Editorial indexado por chave normalizada (minúsculas)
const EDITORIAL_M = new Map(Object.entries(EDITORIAL).map(([k, v]) => [k.toLowerCase(), v]));

const entradas = [];
let n = 0;
for (const [repo, _desc] of LISTA_100) {
  const chave = repo.toLowerCase();
  const m = meta.get(chave);
  const ed = EDITORIAL_M.get(chave);
  if (!m || !ed) { console.error(`✗ Falta metadado/sinopse: ${repo}`); process.exit(1); }

  const [categoria, idioma, autor, sinopse] = ed;
  const ano = new Date(m.criado || m.atualizado || '2015-01-01').getFullYear();
  const licenca = LICENCA_MAP[m.licenca] || 'outro';
  const idCapa = 2200 + (n + 1);
  const capaUrl = `/capas/tech/tech_${idCapa}.svg`;
  const ramal = m.default_branch || 'main';

  const titulo = `${_desc}`;
  const subtitulo = repo;

  fs.writeFileSync(path.join(CAPA_DIR, `tech_${idCapa}.svg`), gerarCapa(n + 1, { titulo, autor, categoria, idioma, repo }));

  entradas.push({
    titulo,
    subtitulo,
    autor,
    categoria,
    fonteSlug: FONTE_SLUG,
    fonteIdExterno: repo,
    ano,
    paginas: 0,
    idioma,
    sinopse,
    capaUrl,
    stars: m.estrelas,
    licencaRepo: m.licenca || 'n/a',
    licenca,
    links: [
      { formato: 'html', url: `https://github.com/${repo}` },
      { formato: 'html', url: `https://github.com/${repo}/blob/${ramal}/README.md` }
    ]
  });
  n++;
}

const seedJs = `/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Acervo — 100 Repositórios GitHub de Livros (Fase 5)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Repositórios GitHub que contêm ou catalogam livros em domínios públicos,
 * com licença aberta, textos integrais, textbooks, listas canónicas e
 * ferramentas de publicação editorial.
 *
 * AGENTS.md — CONFORMIDADE ESTRITA:
 *   • Apenas METADADOS (título, autor, ano, idioma, licença, sinopse, capa)
 *   • ZERO armazenamento local de ficheiros de livro
 *   • A leitura faz-se por redireccionamento HTTP 302 para o GitHub
 *   • \`conteudo_texto\` nunca contém o livro — apenas descrição
 *
 * Fonte: ${FONTE_NOME} (${entradas.length} repositórios)
 * Gerado por: scripts/gerarGithubLivrosSeed.js
 */

const githubLivros = ${JSON.stringify(entradas, null, 2)};

module.exports = { githubLivros, FONTE_SLUG: '${FONTE_SLUG}', FONTE_NOME: '${FONTE_NOME}' };
`;

fs.writeFileSync('src/database/githubLivrosSeedData.js', seedJs);
console.log(`✔ src/database/githubLivrosSeedData.js (${entradas.length} entradas)`);
console.log(`✔ ${entradas.length} capas geradas em ${CAPA_DIR}/tech_${2201}..tech_${2200 + entradas.length}.svg`);

// ── 3) Manifesto para as sinopses traduzidas ───────────────────────────────
fs.writeFileSync('.scratch/gh-livros-manifesto.json', JSON.stringify(
  entradas.map((e, i) => ({
    indice: i + 1,
    repo: e.fonteIdExterno,
    titulo: e.titulo,
    idioma: e.idioma,
    categoria: e.categoria,
    autor: e.autor,
    stars: e.stars,
    licenca: e.licenca,
    sinopse: e.sinopse
  })), null, 2), 'utf-8');
console.log('✔ .scratch/gh-livros-manifesto.json');
