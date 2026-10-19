/**
 * Catálogo Oficial Curado de Cursos Gratuitos de Harvard Online (Harvard PLL Free)
 * e Principais Plataformas Acadêmicas Globais (MIT OpenCourseWare e Stanford Online).
 * 
 * Fonte principal: https://pll.harvard.edu/catalog/free
 * Todas as URLs são verificadas, oficiais e abertas para estudantes do mundo inteiro.
 * Diretriz AGENTS.md: Somente metadados e redirecionamentos externos 302.
 */

const harvardCoursesList = [
  // ==================== HARVARD ONLINE / PLL FREE (pll.harvard.edu/catalog/free) ====================
  {
    titulo: "CS50: Introduction to Computer Science (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "O curso introdutório de ciência da computação mais prestigiado do mundo com o Prof. David J. Malan: algoritmos, estruturas de dados, C, Python, SQL, HTML/CSS e JavaScript com acesso gratuito aos materiais e projetos."
  },
  {
    titulo: "CS50's Web Programming with Python and JavaScript (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/cs50s-web-programming-python-and-javascript",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Desenvolvimento full-stack de aplicações web modernas com Django, React, APIs RESTful, bancos de dados relacionais e implantação em nuvem com acesso aberto da Harvard University."
  },
  {
    titulo: "CS50's Introduction to Programming with Python (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/cs50s-introduction-programming-python",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Aprenda Python do zero com a pedagogia rigorosa de Harvard: tipos de dados, condicionais, loops, tratamento de erros, bibliotecas padrão, expressões regulares e testes unitários."
  },
  {
    titulo: "CS50's Introduction to Artificial Intelligence with Python (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Fundamentos teóricos e práticos de inteligência artificial: algoritmos de busca (A*), grafos de conhecimento, inferência probabilística, machine learning, redes neurais e aprendizado por reforço."
  },
  {
    titulo: "CS50's Introduction to Game Development (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/cs50s-introduction-game-development",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Design e engenharia de jogos 2D e 3D em Lua, LÖVE 2D e Unity: recriação de mecânicas de Pong, Flappy Bird, Super Mario Bros, The Legend of Zelda e Angry Birds."
  },
  {
    titulo: "CS50's Computer Science for Business Professionals (Harvard PLL)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/cs50s-computer-science-business-professionals",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Curso de tecnologia para gestores, empreendedores e tomadores de decisão: arquiteturas em nuvem, bancos de dados, linguagens de programação, segurança e automação tecnológica."
  },
  {
    titulo: "CS50's Understanding Technology (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/cs50s-understanding-technology",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Alfabetização digital essencial para todos os estudantes: como funcionam processadores, redes, internet, multimídia, segurança cibernética e programação no mundo contemporâneo."
  },
  {
    titulo: "Data Science: R Basics (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/data-science-r-basics",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Introdução à ciência de dados com a linguagem estatística R ministrado pelo Prof. Rafael Irizarry: manipulação de dados com dplyr, vetores, matrizes e análise exploratória de casos reais."
  },
  {
    titulo: "Data Science: Machine Learning (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/data-science-machine-learning",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Algoritmos populares de aprendizado de máquina, validação cruzada, regularização, árvores de decisão e construção de sistemas de recomendação de filmes com R e caret."
  },
  {
    titulo: "Data Science: Visualization (Harvard PLL)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/data-science-visualization",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Princípios visuais de comunicação científica de dados e domínio do pacote ggplot2 em R: gráficos estatísticos, distribuição de probabilidades e identificação de padrões."
  },
  {
    titulo: "Data Science: Linear Regression (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Exatas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/data-science-linear-regression",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Teoria e aplicação prática de modelos lineares, correlação, variáveis de confusão (confounding) e testes de hipóteses estatísticas aplicadas à ciência de dados."
  },
  {
    titulo: "Justice: Moral Reasoning and Political Philosophy (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/justice",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "O mais célebre curso de filosofia moral e política de Harvard com o Prof. Michael Sandel: dilemas éticos, teorias da justiça de Aristóteles, John Locke, Kant, John Rawls e direitos humanos."
  },
  {
    titulo: "Rhetoric: The Art of Persuasive Writing and Public Speaking (Harvard PLL)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/rhetoric-art-persuasive-writing-and-public-speaking",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "A arte da persuasão e oratória clássica desde Aristóteles e Cícero até discursos contemporâneos: estruturação de argumentos, retórica lógica (logos, ethos, pathos) e escrita persuasiva."
  },
  {
    titulo: "Exercising Leadership: Foundational Principles (Harvard PLL)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/exercising-leadership-foundational-principles",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Liderança adaptativa ministrada pelo Prof. Ronald Heifetz na Harvard Kennedy School: diagnóstico de desafios complexos, negociação de conflitos e mobilização de pessoas em tempos de incerteza."
  },
  {
    titulo: "Managing Happiness (Harvard PLL / HBS)",
    tipo: "curso",
    area: "Desenvolvimento Pessoal",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/managing-happiness",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Curso da Harvard Business School com o Prof. Arthur Brooks: ciências comportamentais, neurobiologia da satisfação, propósito de vida, conexões humanas e bem-estar emocional."
  },
  {
    titulo: "Fundamentals of Neuroscience: Electrical Properties of the Neuron (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Biológicas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/fundamentals-neuroscience-part-1-electrical-properties-neuron",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "A neurociência fundamental de Harvard: potenciais de ação, bioeletricidade de membranas, transmissão sináptica e modelos computacionais do funcionamento do sistema nervoso."
  },
  {
    titulo: "Introduction to Digital Humanities (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/introduction-digital-humanities",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Interseção entre tecnologia digital, computação e estudos culturais: mineração de textos literários antigos, cartografia histórica e visualização de redes do conhecimento humano."
  },
  {
    titulo: "The Path to Happiness: What Chinese Philosophy Teaches Us (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/path-happiness-what-chinese-philosophy-teaches-us-about-good-life",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Filosofia oriental e reflexão moral com o Prof. Michael Puett: ensinamentos de Confúcio, Laozi, Zhuangzi e a arte de viver com harmonia, flexibilidade e integridade ética."
  },
  {
    titulo: "Pyramids of Giza: Ancient Egyptian Art and Archaeology (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/pyramids-giza-ancient-egyptian-art-and-archaeology",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Exploração arqueológica e histórica das Grandes Pirâmides do Antigo Egito: monumentos mortuários, hieróglifos, sociedade faraônica e reconstruções 3D de sítios arqueológicos."
  },
  {
    titulo: "Shakespeare's Life and Work (Harvard PLL)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/shakespeares-life-and-work",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Análise profunda das grandes peças teatrais de William Shakespeare ministrada pelo renomado teórico e biógrafo Stephen Greenblatt: Hamlet, O Mercador de Veneza e Henrique V."
  },
  {
    titulo: "Contract Law: From Trust to Promise to Contract (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/contract-law-trust-promise-contract",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fundamentos de direito contratual com o Prof. Charles Fried da Harvard Law School: formação de acordos, quebras contratuais, obrigações mútuas e resolução judicial de disputas."
  },
  {
    titulo: "Bioethics: The Law, Medicine, and Ethics of Reproductive Technologies (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Biológicas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/bioethics-law-medicine-and-ethics-reproductive-technologies-and-genetics",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Dilemas bioéticos e regulamentação legal em biotecnologia: edição genética (CRISPR), reprodução assistida, privacidade genética e os limites morais da ciência médica."
  },
  {
    titulo: "PredictionX: Lost Without Longitude (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Exatas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/predictionx-lost-without-longitude",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "História das grandes navegações, astronomia de posição, física dos relógios marítimos e a evolução científica da medição da longitude em alto mar."
  },
  {
    titulo: "Mechanical Ventilation for COVID-19 and Critical Care (Harvard PLL)",
    tipo: "curso",
    area: "Ciências Biológicas",
    plataforma: "Harvard Online (PLL)",
    url: "https://pll.harvard.edu/course/mechanical-ventilation-covid-19",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Treinamento clínico da Harvard Medical School para operação de ventiladores pulmonares, suporte respiratório mecânico e cuidados intensivos em emergências hospitalares."
  },

  // ==================== GRANDES PLATAFORMAS ACADÊMICAS (MIT OCW & STANFORD) ====================
  {
    titulo: "Introduction to Computer Science and Programming in Python (MIT OCW 6.0001)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Curso oficial do Massachusetts Institute of Technology (MIT) introduzindo computação rigorosa, estruturas de dados, algoritmos de ordenação e simulação computacional com Python."
  },
  {
    titulo: "Introduction to Algorithms (MIT OCW 6.006)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Curso clássico de algoritmos do MIT: análise assintótica, árvores AVL, tabelas hash, grafos, algoritmos de Dijkstra e Bellman-Ford, e programação dinâmica com provas matemáticas."
  },
  {
    titulo: "Linear Algebra (MIT OCW 18.06 - Gilbert Strang)",
    tipo: "curso",
    area: "Ciências Exatas",
    plataforma: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "As lendárias aulas de álgebra linear do Prof. Gilbert Strang: matrizes, espaços vetoriais, ortogonalidade, determinantes, autovalores, autovetores e decomposição SVD."
  },
  {
    titulo: "Classical Mechanics (MIT OCW 8.01 - Walter Lewin)",
    tipo: "curso",
    area: "Ciências Exatas",
    plataforma: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fundamentos de física clássica: cinemática vetorial, leis de Newton, trabalho e energia cinética, conservação do momento linear e colisões com demonstrações experimentais."
  },
  {
    titulo: "CS229: Machine Learning (Stanford Online - Andrew Ng)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Stanford Online",
    url: "https://online.stanford.edu/courses/cs229-machine-learning",
    licenca: "gratuito",
    nivel: "Avançado",
    descricao: "O curso canônico de machine learning da Universidade de Stanford pelo Prof. Andrew Ng: aprendizado supervisionado, modelos generativos, SVMs, teoria do aprendizado e redes neurais profundas."
  },
  {
    titulo: "Algorithms: Design and Analysis (Stanford Online - Tim Roughgarden)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Stanford Online",
    url: "https://online.stanford.edu/courses/soe-ycsalgorithms1-algorithms-design-and-analysis-part-1",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Paradigmas fundamentais de projeto algorítmico: divisão e conquista, algoritmos gulosos, união-busca, grafos e programação dinâmica pelo Prof. Tim Roughgarden da Stanford University."
  },
  {
    titulo: "Cryptography I (Stanford Online - Dan Boneh)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Stanford Online",
    url: "https://online.stanford.edu/courses/soe-ycryptography-cryptography-i",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Criptografia moderna com o Prof. Dan Boneh de Stanford: cifras de bloco (AES), funções hash criptográficas, assinaturas digitais, criptografia de chave pública (RSA) e protocolos de segurança."
  },
  {
    titulo: "Relational Databases and SQL (Stanford Online - Jennifer Widom)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Stanford Online",
    url: "https://online.stanford.edu/courses/soe-ydatabases-databases-relational-databases-and-sql",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fundamentos teóricos e práticos de banco de dados relacionais ministrados pela Profa. Jennifer Widom de Stanford: álgebra relacional, DDL, DML, integridade de dados e consultas SQL avançadas."
  }
];

module.exports = { harvardCoursesList };
