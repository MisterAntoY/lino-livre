/**
 * Catálogo Oficial Curado de Cursos Gratuitos da Plataforma Cursa (cursa.app)
 * Cursos com emissão de Certificado Gratuito nos 5 idiomas solicitados:
 * - Português (cursa.app/pt)
 * - Inglês (cursa.app/en)
 * - Espanhol (cursa.app/es)
 * - Francês (cursa.app/fr)
 * - Hindi (cursa.app/hi)
 * 
 * Diretriz AGENTS.md: Somente metadados e redirecionamentos externos 302.
 */

const cursaCoursesList = [
  // ==================== 1. CURSA EM PORTUGUÊS (cursa.app/pt) ====================
  {
    titulo: "Curso de Python do Básico ao Avançado (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-python-para-iniciantes",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Formação completa em Python: variáveis, condicionais, laços, funções, POO e bibliotecas com emissão de certificado gratuito digital de conclusão pelo aplicativo Cursa."
  },
  {
    titulo: "Desenvolvimento Web: HTML5, CSS3 e JavaScript (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-html-e-css-completo",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Aprenda a criar páginas web responsivas e interativas do zero: tags semânticas, Flexbox, CSS Grid e scripts em JavaScript com certificado gratuito na Cursa."
  },
  {
    titulo: "Banco de Dados e SQL para Iniciantes (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-banco-de-dados-e-sql",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Modelagem de bancos relacionais, consultas SELECT, INSERT, UPDATE, DELETE e JOINs com MySQL e PostgreSQL. Inclui certificado gratuito de estudo na Cursa."
  },
  {
    titulo: "Excel Completo: Fórmulas, Gráficos e Dashboards (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-excel-completo",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Domine o Microsoft Excel desde o básico até PROCV, PROCH, tabelas dinâmicas e dashboards interativos para o mercado de trabalho com certificado gratuito."
  },
  {
    titulo: "Power BI: Análise e Visualização de Dados (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-power-bi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Importação e tratamento de bases de dados, medidas DAX, criação de relatórios analíticos e indicadores de desempenho (KPIs) com certificado gratuito."
  },
  {
    titulo: "Redes de Computadores e Protocolos de Internet (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-redes-de-computadores",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fundamentos de arquitetura TCP/IP, endereçamento IPv4 e IPv6, roteadores, switches, DNS e topologias de rede com certificado gratuito no Cursa."
  },
  {
    titulo: "Segurança da Informação e Cibersegurança Básica (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-seguranca-da-informacao",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Boas práticas de proteção contra malwares, phishing, engenharia social, segurança em redes Wi-Fi e privacidade digital com certificado gratuito de conclusão."
  },
  {
    titulo: "Manutenção e Montagem de Computadores (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-manutencao-de-computadores",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Identificação de componentes de hardware, diagnóstico de falhas em placa-mãe, memória RAM e formatação de sistemas operacionais com certificado gratuito."
  },
  {
    titulo: "Manutenção de Celulares e Smartphones (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-manutencao-de-celular",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Curso prático profissionalizante para troca de telas, baterias, conectores de carga, soldagem e reparo de software Android com certificado gratuito."
  },
  {
    titulo: "Inglês do Básico ao Intermediário (Cursa)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-ingles-para-iniciantes",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Aulas dinâmicas de conversação, vocabulário do dia a dia, gramática e pronúncia em inglês para estudantes com emissão de certificado gratuito na Cursa."
  },
  {
    titulo: "Francês para Iniciantes: Vocabulário e Pronúncia (Cursa)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-frances-basico",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Aprenda a falar francês desde as primeiras saudações, diálogos cotidianos, conjugação verbal e escuta ativa com certificado gratuito emitido pela Cursa."
  },
  {
    titulo: "Espanhol Prático para Conversação (Cursa)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-espanhol-basico",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Curso de espanhol com foco em diálogos práticos, situações de viagem e comunicação profissional em países hispânicos com certificado gratuito."
  },
  {
    titulo: "Marketing Digital e Gestão de Redes Sociais (Cursa)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-marketing-digital",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Estratégias de conteúdo para Instagram, TikTok e YouTube, gestão de tráfego, copywriting e relacionamento com clientes com certificado gratuito."
  },
  {
    titulo: "Empreendedorismo e Gestão de Pequenos Negócios (Cursa)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-empreendedorismo",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Como planejar, abrir e gerenciar um microempreendimento: fluxo de caixa, precificação, marketing local e atendimento ao cliente com certificado gratuito."
  },
  {
    titulo: "Design Gráfico com Canva e Photoshop (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-design-grafico",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Criação de artes para redes sociais, banners, logotipos, edição de fotos e psicologia das cores com certificado gratuito digital pela Cursa."
  },
  {
    titulo: "Noções de Primeiros Socorros e Cuidados Básicos (Cursa)",
    tipo: "curso",
    area: "Ciências Biológicas",
    plataforma: "Cursa (Português)",
    url: "https://cursa.app/pt/curso/curso-de-primeiros-socorros",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Procedimentos emergenciais em casos de queimaduras, fraturas, engasgos, ressuscitação cardiopulmonar (RCP) e desmaios com certificado gratuito de estudo."
  },

  // ==================== 2. CURSA EM INGLÊS (cursa.app/en) ====================
  {
    titulo: "Python Programming from Scratch to Mastery (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/python-programming-for-beginners",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Comprehensive English tutorial on Python 3: data structures, loops, functions, OOP, and automation scripts with free digital certificate on Cursa."
  },
  {
    titulo: "Full-Stack Web Development: HTML, CSS & JavaScript (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/web-development-html-css-javascript",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Hands-on web engineering course covering responsive design, CSS Flexbox & Grid, DOM manipulation, and modern JavaScript with free certificate."
  },
  {
    titulo: "Data Analytics and SQL Database Fundamentals (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/sql-and-database-management",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Relational database modeling, SQL query optimization, aggregate functions, and real-world business analytics with free certificate of completion."
  },
  {
    titulo: "Microsoft Excel: Beginner to Advanced Formulas (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/microsoft-excel-complete-course",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Master essential spreadsheets, VLOOKUP, XLOOKUP, pivot tables, data visualization, and automated workflows with free certificate on Cursa."
  },
  {
    titulo: "Cybersecurity Fundamentals and Ethical Hacking (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/cybersecurity-fundamentals",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Network defenses, cryptography fundamentals, penetration testing basics, vulnerability assessment, and threat mitigation with free certificate."
  },
  {
    titulo: "Machine Learning with Python & Scikit-Learn (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/machine-learning-with-python",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Supervised and unsupervised learning, regression models, decision trees, clustering, and model evaluation metrics with free digital certificate."
  },
  {
    titulo: "Digital Marketing, SEO and Social Media Growth (Cursa)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/digital-marketing-fundamentals",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Search engine optimization (SEO), Google Analytics, email campaigns, and paid advertisement strategies for online businesses with free certificate."
  },
  {
    titulo: "UI/UX Design and Prototyping with Figma (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/ui-ux-design-with-figma",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "User research, wireframing, color theory, typography, interactive app prototyping, and design systems using Figma with free certificate."
  },
  {
    titulo: "Business English for Professional Communication (Cursa)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/business-english-communication",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Writing formal emails, delivering international presentations, negotiation tactics, and business meeting etiquette with free certificate on Cursa."
  },
  {
    titulo: "Agile Project Management and Scrum Framework (Cursa)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Cursa (English)",
    url: "https://cursa.app/en/course/project-management-fundamentals",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Sprint planning, backlog grooming, daily standups, Kanban flow metrics, and agile team facilitation principles with free certificate."
  },

  // ==================== 3. CURSA EM ESPANHOL (cursa.app/es) ====================
  {
    titulo: "Programación en Python desde Cero (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/programacion-en-python-desde-cero",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Aprende Python en español: sintaxis, listas, diccionarios, funciones y programación orientada a objetos con certificado digital gratuito en Cursa."
  },
  {
    titulo: "Desarrollo Web Completo: HTML5, CSS3 y JavaScript (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/desarrollo-web-html-css-javascript",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Construcción de sitios web modernos y adaptativos (responsive) desde el inicio con maquetación web y lógica JavaScript con certificado gratuito."
  },
  {
    titulo: "Bases de Datos Relacionales y Consultas SQL (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/bases-de-datos-y-sql",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Diseño de esquemas relacionales, consultas estructuradas, joins, subconsultas y administración con MySQL y SQLite con certificado gratuito."
  },
  {
    titulo: "Microsoft Excel: De Principiante a Experto (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/microsoft-excel-desde-cero",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fórmulas avanzadas, BuscarV, tablas dinámicas, gráficos ejecutivos y automatización de reportes para oficinas con certificado gratuito en Cursa."
  },
  {
    titulo: "Ciberseguridad y Protección de Datos Personales (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/ciberseguridad-para-principiantes",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Conceptos fundamentales de seguridad informática, prevención de ataques de phishing, protección de contraseñas y redes con certificado gratuito."
  },
  {
    titulo: "Marketing Digital y Publicidad en Redes Sociales (Cursa)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/marketing-digital-y-redes-sociales",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Creación de marcas en internet, campañas en Facebook e Instagram Ads, redacción persuasiva y embudos de ventas con certificado gratuito."
  },
  {
    titulo: "Diseño Gráfico Digital con Photoshop e Illustrator (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/diseno-grafico-digital",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Técnicas profesionales de retoque fotográfico, ilustración vectorial, diseño publicitario y exportación para imprenta con certificado gratuito."
  },
  {
    titulo: "Reparación y Mantenimiento de Teléfonos Celulares (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/reparacion-de-celulares",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Curso práctico de cambio de módulos de pantalla, baterías, pines de carga, diagnóstico multímetro y flasheo de software con certificado gratuito."
  },
  {
    titulo: "Inglés Básico Práctico para Hispanohablantes (Cursa)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/ingles-basico-para-hispanohablantes",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Gramática explicada en español, vocabulario esencial, frases comunes y pronunciación fonética clara con certificado de estudio gratuito en Cursa."
  },
  {
    titulo: "Administración y Finanzas para Emprendedores (Cursa)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Cursa (Español)",
    url: "https://cursa.app/es/curso/finanzas-personales-y-emprendimiento",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Presupuesto empresarial, control de costes, fijación de precios, flujo de caja y planes de crecimiento para negocios con certificado gratuito."
  },

  // ==================== 4. CURSA EM FRANCÊS (cursa.app/fr) ====================
  {
    titulo: "Programmation en Python pour Débutants (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Français)",
    url: "https://cursa.app/fr/cours/programmation-python-debutant",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Apprentissage de Python en français : variables, boucles, structures de données, fonctions et initiation à la POO avec certificat gratuit sur Cursa."
  },
  {
    titulo: "Développement Web Moderne : HTML, CSS et JavaScript (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Français)",
    url: "https://cursa.app/fr/cours/developpement-web-html-css",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Création de sites internet responsifs, mise en page moderne avec Flexbox et Grid, et interactivité avec JavaScript avec certificat gratuit."
  },
  {
    titulo: "Bases de Données Relationnelles et Requêtes SQL (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Français)",
    url: "https://cursa.app/fr/cours/bases-de-donnees-sql",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Conception de tables, clés primaires et étrangères, requêtes SELECT, filtres WHERE et jointures relationnelles avec certificat gratuit."
  },
  {
    titulo: "Maîtriser Microsoft Excel : Formules et Tableaux Croisés (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Français)",
    url: "https://cursa.app/fr/cours/formation-excel-complete",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fonctions essentielles, calculs automatisés, tableaux croisés dynamiques et graphiques professionnels de reporting avec certificat gratuit."
  },
  {
    titulo: "Cybersécurité Fondamentale et Hygiène Numérique (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Français)",
    url: "https://cursa.app/fr/cours/cybersecurite-fondamentaux",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Sensibilisation aux menaces cyber, protection contre les rançongiciels, authentification à double facteur et sécurité des données avec certificat."
  },
  {
    titulo: "Anglais Débutant et Intermédiaire pour Francophones (Cursa)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Cursa (Français)",
    url: "https://cursa.app/fr/cours/anglais-pour-francophones",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Méthode d'anglais adaptée aux francophones : grammaire claire, vocabulaire usuel, prononciation et mise en situation avec certificat gratuit."
  },
  {
    titulo: "Marketing Numérique et Stratégie Réseaux Sociaux (Cursa)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Cursa (Français)",
    url: "https://cursa.app/fr/cours/marketing-digital-debutant",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Création d'audience sur les réseaux sociaux, référencement naturel (SEO), stratégie éditoriale et conversion avec certificat gratuit sur Cursa."
  },
  {
    titulo: "Design Graphique et Création Visuelle Numérique (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Français)",
    url: "https://cursa.app/fr/cours/design-graphique-canva",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Conception de visuels percutants, affiches, chartes graphiques et bannières promotionnelles avec Canva et Photoshop avec certificat gratuit."
  },

  // ==================== 5. CURSA EM HINDI (cursa.app/hi) ====================
  {
    titulo: "पायथन प्रोग्रामिंग सीखें — Python in Hindi for Beginners (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Hindi)",
    url: "https://cursa.app/hi/course/python-programming-in-hindi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Complete Python tutorial explained in Hindi (हिंदी): variables, loops, data structures, and functions with free digital certificate on Cursa app."
  },
  {
    titulo: "वेब डेवलपमेंट सीखें: HTML, CSS और JavaScript in Hindi (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Hindi)",
    url: "https://cursa.app/hi/course/web-development-in-hindi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Learn modern frontend web development in Hindi: build responsive websites with HTML5, CSS3 styling, and JavaScript logic with free certificate."
  },
  {
    titulo: "माइक्रोसॉफ्ट एक्सेल बेसिक से एडवांस — Excel in Hindi (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Hindi)",
    url: "https://cursa.app/hi/course/microsoft-excel-in-hindi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Master MS Excel in Hindi: formulas (SUM, VLOOKUP, IF), pivot tables, charts, and workplace data management with free certificate on Cursa."
  },
  {
    titulo: "डिजिटल मार्केटिंग और सोशल मीडिया — Digital Marketing in Hindi (Cursa)",
    tipo: "curso",
    area: "Gestão & Negócios",
    plataforma: "Cursa (Hindi)",
    url: "https://cursa.app/hi/course/digital-marketing-course-in-hindi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Comprehensive online marketing in Hindi: SEO fundamentals, social media advertising, content strategy, and online sales with free certificate."
  },
  {
    titulo: "ग्राफिक डिजाइन और फोटो एडिटिंग — Graphic Design in Hindi (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Hindi)",
    url: "https://cursa.app/hi/course/graphic-design-in-hindi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Learn graphic design, logo creation, social media banners, and image editing in Hindi using modern design tools with free certificate."
  },
  {
    titulo: "इंग्लिश स्पीकिंग और ग्रामर — English Speaking Course in Hindi (Cursa)",
    tipo: "curso",
    area: "Linguagens",
    plataforma: "Cursa (Hindi)",
    url: "https://cursa.app/hi/course/english-speaking-in-hindi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Spoken English and communication skills taught through Hindi: daily conversation vocabulary, grammar rules, and fluency with free certificate."
  },
  {
    titulo: "कंप्यूटर बेसिक और फंडामेंटल्स — Computer Basics in Hindi (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Hindi)",
    url: "https://cursa.app/hi/course/computer-basics-in-hindi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Computer hardware, Windows OS, internet navigation, file management, and office productivity taught in Hindi with free certificate on Cursa."
  },
  {
    titulo: "डेटाबेस और SQL सीखें — Database & SQL in Hindi (Cursa)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Cursa (Hindi)",
    url: "https://cursa.app/hi/course/database-sql-in-hindi",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Relational database concepts, SQL queries, table creation, joins, and data manipulation explained simply in Hindi with free certificate."
  }
];

module.exports = { cursaCoursesList };
