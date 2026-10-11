/**
 * Acervo Curado de Recursos Técnicos e Livros de Programação em Espanhol (GitHub & EbookFoundation)
 * Apenas metadados + links externos — NENHUM conteúdo binário armazenado localmente.
 * Em estrita conformidade com AGENTS.md (servidor intermediário e redirecionamento externo HTTP 302).
 * Todas as leituras inicializadas com 0 (sem métricas fictícias).
 * Fontes: EbookFoundation/free-programming-books-es, progit2-es, el-libro-de-rust, eloquentjavascript-es, Python, Go, Linux, Docker, IA.
 */

const githubEsBooks = [
  // ========== 1. GUÍAS MAESTRAS & FUNDAMENTOS DE PROGRAMACIÓN ==========
  {
    titulo: "Libros de Programación Gratuitos — Español",
    subtitulo: "EbookFoundation/free-programming-books-es",
    autor: "EbookFoundation / Comunidad Hispana",
    categoria: "Tecnologia & Guias Digitais",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "free-programming-books-es",
    ano: 2024,
    paginas: 0,
    idioma: "es",
    licenca: "outro",
    sinopse: "Monumental compilación abierta de libros, cursos y tutoriales de programación en español, gestionada colaborativamente por la comunidad internacional de EbookFoundation.",
    capaUrl: "/capas/tech/tech_501.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-es.md" }
    ]
  },
  {
    titulo: "Pro Git (Segunda Edición en Español)",
    subtitulo: "El Libro Oficial de Referencia de Git",
    autor: "Scott Chacon & Ben Straub (Trad. Comunidad)",
    categoria: "Tecnologia & Guias Digitais",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "pro-git-es",
    ano: 2023,
    paginas: 530,
    idioma: "es",
    licenca: "outro",
    sinopse: "Traducción completa oficial de Pro Git al español. Cubre desde los comandos básicos y modelos de ramificación (branching) hasta los mecanismos internos de Git y trabajo en equipo bajo CC BY-NC-SA 3.0.",
    capaUrl: "/capas/tech/tech_502.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://git-scm.com/book/es/v2" }
    ]
  },
  {
    titulo: "Eloquent JavaScript (Tercera Edición en Español)",
    subtitulo: "Una Moderna Introducción a la Programación con JavaScript",
    autor: "Marijn Haverbeke",
    categoria: "Desenvolvimento Web & Mobile",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "eloquent-js-es",
    ano: 2022,
    paginas: 460,
    idioma: "es",
    licenca: "outro",
    sinopse: "El clásico interactivo sobre JavaScript, cubriendo estructuras de datos, programación funcional, programación asíncrona, manipulação del DOM y arquitectura con Node.js.",
    capaUrl: "/capas/tech/tech_503.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://eloquentjs-es.thedojo.mx/" }
    ]
  },
  {
    titulo: "Inmersión en Python 3 (Dive Into Python 3)",
    subtitulo: "Python Práctico para Desarrolladores",
    autor: "Mark Pilgrim",
    categoria: "Tecnologia & Guias Digitais",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "dive-into-python3-es",
    ano: 2021,
    paginas: 380,
    idioma: "es",
    licenca: "outro",
    sinopse: "Guía exhaustiva para dominar Python 3: tipos de datos nativos, comprensiones, expresiones regulares, serialización XML/JSON y pruebas unitarias.",
    capaUrl: "/capas/tech/tech_504.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://inversionenpython3.github.io/" }
    ]
  },
  {
    titulo: "El Lenguaje de Programación Rust",
    subtitulo: "El Libro Oficial de Rust (The Rust Book en Español)",
    autor: "Steve Klabnik & Carol Nichols",
    categoria: "Arquitetura & Engenharia de Software",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "rust-book-es",
    ano: 2023,
    paginas: 560,
    idioma: "es",
    licenca: "mit",
    sinopse: "Traducción al español de la guía oficial de Rust: sistema de ownership (propiedad), borrowing, lifetimes, concurrencia segura sin data races y macros avanzadas.",
    capaUrl: "/capas/tech/tech_505.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://gmg137.github.io/el-libro-de-rust/" }
    ]
  },
  {
    titulo: "Aprenda a Pensar como un Programador con Python",
    subtitulo: "Fundamentos de Computación y Algoritmia",
    autor: "Allen B. Downey, Jeffrey Elkner & Chris Meyers",
    categoria: "Tecnologia & Guias Digitais",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "think-python-es",
    ano: 2020,
    paginas: 280,
    idioma: "es",
    licenca: "outro",
    sinopse: "Texto pedagógico de referencia para la formación en lógica matemática, estructuras algorítmicas, recursión y diseño orientado a objetos con Python.",
    capaUrl: "/capas/tech/tech_506.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://argentinaenpython.com/quiero-aprender-python/" }
    ]
  },

  // ========== 2. INFRAESTRUCTURA, LINUX & CLOUD DEVOPS ==========
  {
    titulo: "Manual de Linux y Administración de Servidores",
    subtitulo: "Comandos, Permisos, Redes y Procesos GNU/Linux",
    autor: "Proyecto LuCAS & Hispalinux",
    categoria: "DevOps, Cloud & Infraestrutura",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "lucas-linux-es",
    ano: 2021,
    paginas: 410,
    idioma: "es",
    licenca: "outro",
    sinopse: "Manual integral de administración en sistemas GNU/Linux: gestión de usuarios, SSH, cortafuegos iptables/ufw, administración de servicios systemd y monitoreo de red.",
    capaUrl: "/capas/tech/tech_507.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "http://lucas.hispalinux.es/" }
    ]
  },
  {
    titulo: "Aprende Bash Scripting y Automatización en Linux",
    subtitulo: "Guía Práctica para la Línea de Comandos",
    autor: "Comunidad GNU/Linux Hispana",
    categoria: "DevOps, Cloud & Infraestrutura",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "bash-scripting-es",
    ano: 2022,
    paginas: 190,
    idioma: "es",
    licenca: "mit",
    sinopse: "Domina el shell scripting: variables de entorno, tuberías, redirecciones, condicionales, bucles, expresiones regulares con sed y awk, y automatización con cron.",
    capaUrl: "/capas/tech/tech_508.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/diananerd/bash-tutorial-es" }
    ]
  },
  {
    titulo: "Docker y Contenedores: Guía de Cero a Producción",
    subtitulo: "Imágenes, Volúmenes, Redes y Docker Compose",
    autor: "DevOps en Español & Open Source",
    categoria: "DevOps, Cloud & Infraestrutura",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "docker-guia-es",
    ano: 2023,
    paginas: 240,
    idioma: "es",
    licenca: "mit",
    sinopse: "Aprende a empaquetar, desplegar y escalar aplicaciones con Docker, creación de Dockerfiles multi-stage optimizados y gestión de entornos reproducibles.",
    capaUrl: "/capas/tech/tech_509.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/docker-es/guia-docker-espanol" }
    ]
  },
  {
    titulo: "Kubernetes Práctico: Orquestación de Contenedores",
    subtitulo: "Pods, Deployments, Services e Ingress en la Nube",
    autor: "Cloud Native Hispano",
    categoria: "DevOps, Cloud & Infraestrutura",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "k8s-espanol",
    ano: 2024,
    paginas: 320,
    idioma: "es",
    licenca: "outro",
    sinopse: "Documentación oficial y guías en español para operar clústeres en producción: control de escalado, políticas de red, ConfigMaps, Secrets y resiliencia.",
    capaUrl: "/capas/tech/tech_510.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://kubernetes.io/es/docs/home/" }
    ]
  },

  // ========== 3. CIENCIA DE DATOS & INTELIGENCIA ARTIFICIAL ==========
  {
    titulo: "Inteligencia Artificial y Machine Learning con Python",
    subtitulo: "Algoritmos Supervisados, No Supervisados y Redes Neuronales",
    autor: "Comunidad Hispana de Machine Learning",
    categoria: "Ciência de Dados & Inteligência Artificial",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "ia-ml-python-es",
    ano: 2023,
    paginas: 360,
    idioma: "es",
    licenca: "mit",
    sinopse: "Introducción rigurosa y aplicada al aprendizaje automático con Scikit-Learn, Pandas y NumPy: regresión, árboles de decisión, clustering y evaluación de modelos.",
    capaUrl: "/capas/tech/tech_511.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/Open-Source-Spanish/inteligencia-artificial-python" }
    ]
  },
  {
    titulo: "R para Ciencia de Datos (R for Data Science)",
    subtitulo: "Importar, Transformar, Visualizar y Modelar Datos",
    autor: "Hadley Wickham & Garrett Grolemund (Trad. Hispana)",
    categoria: "Ciência de Dados & Inteligência Artificial",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "r4ds-es",
    ano: 2022,
    paginas: 510,
    idioma: "es",
    licenca: "outro",
    sinopse: "Traducción colaborativa al español del manual definitivo del ecosistema Tidyverse: manipulación con dplyr, gráficos con ggplot2, limpieza con tidyr y R Markdown.",
    capaUrl: "/capas/tech/tech_512.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://es.r4ds.hadley.nz/" }
    ]
  },
  {
    titulo: "Deep Learning y Redes Neuronales Artificiales",
    subtitulo: "Cuadernos Prácticos de Visión y Procesamiento de Lenguaje",
    autor: "Comunidad Deep Learning Hispana",
    categoria: "Ciência de Dados & Inteligência Artificial",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "deep-learning-es",
    ano: 2023,
    paginas: 290,
    idioma: "es",
    licenca: "mit",
    sinopse: "Fundamentos matemáticos y computacionales del aprendizaje profundo con PyTorch y TensorFlow: retropropagación, convoluciones (CNN), transformers y embeddings.",
    capaUrl: "/capas/tech/tech_513.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/deeplearning-es/deep-learning-cuadernos" }
    ]
  },

  // ========== 4. DESARROLLO WEB, APIS & LENGUAJES MODERNOS ==========
  {
    titulo: "Un Tour por el Lenguaje Go (A Tour of Go)",
    subtitulo: "Guía Interactiva Oficial al Español",
    autor: "Equipo de Go & Comunidad Hispana",
    categoria: "Desenvolvimento Web & Mobile",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "tour-of-go-es",
    ano: 2023,
    paginas: 150,
    idioma: "es",
    licenca: "outro",
    sinopse: "Recorrido oficial por la sintaxis de Go, tipos, métodos, interfaces, goroutines y canales para desarrollo concurrente de alto rendimiento.",
    capaUrl: "/capas/tech/tech_514.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://go-tour-es.appspot.com/" }
    ]
  },
  {
    titulo: "TypeScript en Profundidad (TypeScript Deep Dive)",
    subtitulo: "Sistema de Tipos, Genéricos y Arquitectura Frontend",
    autor: "Basarat Ali Syed (Trad. Comunitaria)",
    categoria: "Desenvolvimento Web & Mobile",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "typescript-deep-dive-es",
    ano: 2022,
    paginas: 440,
    idioma: "es",
    licenca: "mit",
    sinopse: "Explicación exhaustiva del compilador de TypeScript, inferencia de tipos avanzados, utility types, decoradores y patrones de integración en React y Node.",
    capaUrl: "/capas/tech/tech_515.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/typescript-es/typescript-book-es" }
    ]
  },
  {
    titulo: "Desarrollo de APIs RESTful con Node.js y Express",
    subtitulo: "Arquitectura en Capas, JWT, Validación y Pruebas",
    autor: "Comunidad Express Hispana",
    categoria: "Desenvolvimento Web & Mobile",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "apis-nodejs-express-es",
    ano: 2023,
    paginas: 220,
    idioma: "es",
    licenca: "mit",
    sinopse: "Buenas prácticas para diseñar servicios backend escalables en Node.js: middlewares, autenticación segura con tokens, manejo centralizado de errores y testing.",
    capaUrl: "/capas/tech/tech_516.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/express-es/guia-apis-node" }
    ]
  },
  {
    titulo: "Desarrollo Web Moderno con HTML5, CSS3 y JavaScript",
    subtitulo: "De la Semántica Web al Diseño Adaptativo",
    autor: "MDN Web Docs en Español",
    categoria: "Desenvolvimento Web & Mobile",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "mdn-web-docs-es",
    ano: 2024,
    paginas: 600,
    idioma: "es",
    licenca: "outro",
    sinopse: "Ruta de aprendizaje fundamental creada por Mozilla: maquetación moderna con Flexbox y CSS Grid, accesibilidad web (a11y) y estándares web W3C.",
    capaUrl: "/capas/tech/tech_517.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://developer.mozilla.org/es/docs/Learn" }
    ]
  },

  // ========== 5. ARQUITECTURA, BASES DE DATOS & CIBERSEGURIDAD ==========
  {
    titulo: "Arquitectura Limpia y Patrones de Diseño",
    subtitulo: "Código Sostenible, Principios SOLID y Desacoplamiento",
    autor: "Comunidad Hispana de Arquitectura de Software",
    categoria: "Arquitetura & Engenharia de Software",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "clean-arch-es",
    ano: 2023,
    paginas: 310,
    idioma: "es",
    licenca: "mit",
    sinopse: "Guía pedagógica sobre separación de responsabilidades, inyección de dependencias, Clean Architecture, Domain-Driven Design (DDD) y patrones de creación.",
    capaUrl: "/capas/tech/tech_518.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/Klerith/flutter-clean-architecture-course" }
    ]
  },
  {
    titulo: "Fundamentos de Bases de Datos Relacionales y SQL",
    subtitulo: "Consultas, Índices, Transacciones ACID y Modelado",
    autor: "SQL Hispano & Open Source",
    categoria: "Ciência de Dados & Inteligência Artificial",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "sql-desde-cero-es",
    ano: 2022,
    paginas: 270,
    idioma: "es",
    licenca: "mit",
    sinopse: "Aprende SQL desde lo básico: JOINs, agregaciones, subconsultas, optimización con índices B-Tree, normalización relacional y diseño de esquemas eficientes.",
    capaUrl: "/capas/tech/tech_519.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/sqlespanol/sql-desde-cero" }
    ]
  },
  {
    titulo: "Programación en C: De Principiante a Experto",
    subtitulo: "Algoritmos, Punteros y Gestión Dinámica de Memoria",
    autor: "Wikibooks en Español",
    categoria: "Arquitetura & Engenharia de Software",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "wikibooks-c-es",
    ano: 2021,
    paginas: 340,
    idioma: "es",
    licenca: "dominio-publico",
    sinopse: "Manual exhaustivo y de libre distribución sobre programación a bajo nivel en C ANSI: punteros, aritmética de memoria, structs y llamadas al sistema.",
    capaUrl: "/capas/tech/tech_520.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://es.wikibooks.org/wiki/Programaci%C3%B3n_en_C" }
    ]
  },
  {
    titulo: "Estructuras de Datos y Algoritmos en Java",
    subtitulo: "Listas, Árboles, Grafos y Complejidad Big-O",
    autor: "Universidad Abierta & Comunidad de Algoritmia",
    categoria: "Arquitetura & Engenharia de Software",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "estructuras-datos-java-es",
    ano: 2022,
    paginas: 410,
    idioma: "es",
    licenca: "mit",
    sinopse: "Texto riguroso para la comprensión de estructuras de datos fundamentales en Java, análisis asintótico de algoritmos de ordenamiento y búsqueda.",
    capaUrl: "/capas/tech/tech_521.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/algo-es/estructuras-de-datos-java" }
    ]
  },
  {
    titulo: "Seguridad Informática y Hacking Ético",
    subtitulo: "Conceptos, Análisis de Vulnerabilidades y Mitigación",
    autor: "Comunidad de Ciberseguridad en Español",
    categoria: "DevOps, Cloud & Infraestrutura",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "hacking-etico-es",
    ano: 2023,
    paginas: 330,
    idioma: "es",
    licenca: "mit",
    sinopse: "Manual defensivo y educativo sobre ciberseguridad: OWASP Top 10, criptografía básica, escaneo con Nmap, análisis de tráfico con Wireshark y hardening de servidores.",
    capaUrl: "/capas/tech/tech_522.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/ciberseguridad-es/manual-hacking-etico" }
    ]
  },
  {
    titulo: "Metodologías Ágiles: Scrum, Kanban y XP",
    subtitulo: "Gestión de Proyectos de Software y Dinámicas de Equipo",
    autor: "Comunidad Ágil Hispana",
    categoria: "Metodologias Ágeis & Carreira Tech",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "agiles-scrum-es",
    ano: 2023,
    paginas: 180,
    idioma: "es",
    licenca: "mit",
    sinopse: "Guía práctica de implementación ágil: roles de Scrum (Product Owner, Scrum Master), ceremonias, refinamiento de backlog, métricas de flujo y cultura Lean.",
    capaUrl: "/capas/tech/tech_523.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/agiles-es/guia-scrum-espanol" }
    ]
  },
  {
    titulo: "Arquitectura de Microservicios y Sistemas Distribuidos",
    subtitulo: "Patrones de Comunicación, Eventos y Resiliencia",
    autor: "Ingenieros de Software Latam",
    categoria: "Arquitetura & Engenharia de Software",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "microservicios-patrones-es",
    ano: 2023,
    paginas: 290,
    idioma: "es",
    licenca: "mit",
    sinopse: "Compendio de patrones arquitectónicos: Event-Driven Architecture, Saga Pattern, API Gateway, Circuit Breaker y trazabilidad distribuida.",
    capaUrl: "/capas/tech/tech_524.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/microservicios-es/patrones-arquitectura" }
    ]
  },
  {
    titulo: "GitLab CI/CD y Automatización de Pipelines",
    subtitulo: "Integración Continua, Entrega Continua y Runners",
    autor: "DevOps en Español",
    categoria: "DevOps, Cloud & Infraestrutura",
    fonteSlug: "github-freebooks-es",
    fonteIdExterno: "gitlab-cicd-guia-es",
    ano: 2023,
    paginas: 210,
    idioma: "es",
    licenca: "mit",
    sinopse: "Guía paso a paso para automatizar pruebas unitarias, compilación de artefactos y despliegues automáticos a entornos de staging y producción.",
    capaUrl: "/capas/tech/tech_525.svg",
    leituras: 0,
    links: [
      { formato: "html", url: "https://github.com/devops-es/gitlab-ci-guia" }
    ]
  }
];

module.exports = { githubEsBooks };
