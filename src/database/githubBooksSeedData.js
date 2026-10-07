/**
 * Acervo Curado de Livros Técnicos e Manuais Abertos via GitHub
 * Fontes Oficiais:
 * - https://github.com/KAYOKG/BibliotecaDev (com capas em vetor SVG e PDFs diretos)
 * - https://github.com/italocamil0/books/tree/main/books (PDFs técnicos hospedados no GitHub)
 * - https://github.com/flaviojmendes/trilhainfo (guias e roadmaps abertos em português)
 */

const githubBooks = [
  // ==================== KAYOKG / BibliotecaDev ====================
  {
    titulo: 'Arquitetura Limpa: O Guia do Artesão para Estrutura e Design de Software',
    subtitulo: 'Regras universais de arquitetura de software para sistemas duradouros',
    autor: 'Robert C. Martin',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-arquitetura-limpa',
    ano: 2019,
    paginas: 432,
    sinopse: 'Diretrizes práticas de Robert C. Martin sobre regras universais de arquitetura de software, limites arquiteturais, testes e desacoplamento de frameworks.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Arquitetura%20Limpa%20-%20O%20Guia%20do%20Artes%C3%A3o%20para%20Estrutura%20e%20Design%20de%20Software.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Arquitetura%20Limpa%20-%20O%20Guia%20do%20Artesão%20para%20Estrutura%20e%20Design%20de%20Software%20-%20Autor%20(Robert%20C.%20Martin).pdf'
      }
    ]
  },
  {
    titulo: 'Refatoração: Aperfeiçoando o Design de Códigos Existentes',
    subtitulo: 'Técnicas essenciais para melhorar a estrutura interna do código',
    autor: 'Martin Fowler',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-refatoracao',
    ano: 2020,
    paginas: 456,
    sinopse: 'O clássico de Martin Fowler demonstrando o catálogo de refatorações, princípios de código legível, cheiros de código (code smells) e testes automatizados.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Refatora%C3%A7%C3%A3o%20-%20Aperfei%C3%A7oando%20o%20Design%20de%20C%C3%B3digos%20Existentes.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Refatoração%20-%20Aperfeiçoando%20o%20Design%20de%20Códigos%20Existentes%20-%20Autor%20(Martin%20Fowler).pdf'
      }
    ]
  },
  {
    titulo: 'Mergulho nos Padrões de Projeto (Design Patterns)',
    subtitulo: 'Soluções elegantes para problemas recorrentes de design orientado a objetos',
    autor: 'Alexander Shvets',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-design-patterns',
    ano: 2021,
    paginas: 410,
    sinopse: 'Guia visual e didático cobrindo os 22 padrões clássicos de projeto (Criacionais, Estruturais e Comportamentais) com diagramas e analogias do mundo real.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Mergulho%20nos%20Padr%C3%B5es%20de%20Projeto.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://refactoring.guru/pt-br/design-patterns/book'
      }
    ]
  },
  {
    titulo: 'A Startup Enxuta',
    subtitulo: 'Como os empreendedores usam a inovação contínua para criar empresas sustentáveis',
    autor: 'Eric Ries',
    categoria: 'Metodologias Ágeis & Carreira Tech',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-startup-enxuta',
    ano: 2012,
    paginas: 288,
    sinopse: 'Metodologia Lean Startup: ciclo Construir-Medir-Aprender, produto mínimo viável (MVP), testes de hipóteses e pivotagem para produtos digitais.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20Startup%20Enxuta.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/A%20Startup%20Enxuta%20-%20Autor%20(Eric%20Ries).pdf'
      }
    ]
  },
  {
    titulo: 'A Web Mobile: Programe para um Mundo de Muitos Dispositivos',
    subtitulo: 'Design responsivo, performance e interfaces adaptáveis para navegadores móveis',
    autor: 'Casa do Código',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-web-mobile',
    ano: 2018,
    paginas: 230,
    sinopse: 'Manual sobre desenvolvimento front-end focado em dispositivos móveis: media queries, viewport, otimização de imagens e navegação touch.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20Web%20Mobile%20-%20Programe%20para%20um%20Mundo%20de%20Muitos%20Dispositivos.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/A%20Web%20Mobile%20-%20Programe%20para%20um%20Mundo%20de%20Muitos%20Dispositivos%20-%20Autor%20(Casa%20do%20Código).pdf'
      }
    ]
  },
  {
    titulo: '14 Hábitos de Desenvolvedores Altamente Produtivos',
    subtitulo: 'Práticas diárias para elevar a eficiência e o bem-estar na carreira de programação',
    autor: 'Zeno Rocha',
    categoria: 'Metodologias Ágeis & Carreira Tech',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-14-habitos',
    ano: 2020,
    paginas: 220,
    sinopse: 'Hábitos comprovados por líderes técnicos para foco, aprendizado contínuo, eliminação de distrações e construção de projetos de alto impacto.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/14%20H%C3%A1bitos%20de%20Desenvolvedores%20Altamente%20Produtivos.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/14%20Hábitos%20de%20Desenvolvedores%20Altamente%20Produtivos%20-%20Autor%20(Zeno%20Rocha).pdf'
      }
    ]
  },
  {
    titulo: 'Big Data: Técnicas e Tecnologias para Extração de Valor dos Dados',
    subtitulo: 'Armazenamento distribuído, pipelines analíticos e processamento em larga escala',
    autor: 'Casa do Código',
    categoria: 'Ciência de Dados & Inteligência Artificial',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-big-data',
    ano: 2019,
    paginas: 240,
    sinopse: 'Conceitos fundamentais de Big Data, Hadoop, Spark, NoSQL e arquiteturas de dados para suporte à tomada de decisões estratégicas.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Big%20Data%20-%20T%C3%A9cnicas%20e%20tecnologias%20para%20extra%C3%A7%C3%A3o%20de%20valor%20dos%20dados.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Big%20Data%20-%20Técnicas%20e%20tecnologias%20para%20extração%20de%20valor%20dos%20dados%20-%20Autor%20(Casa%20do%20Código).pdf'
      }
    ]
  },
  {
    titulo: 'Business Intelligence: Implementar do Jeito Certo e a Custo Zero',
    subtitulo: 'Construção de data warehouses e dashboards operacionais com ferramentas livres',
    autor: 'Casa do Código',
    categoria: 'Ciência de Dados & Inteligência Artificial',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-bi-custo-zero',
    ano: 2018,
    paginas: 260,
    sinopse: 'Passo a passo para modelagem dimensional (Kimball), ETL open-source e criação de painéis gerenciais eficientes sem altos custos de licença.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Business%20Intelligence%20-%20Implementar%20do%20jeito%20certo%20e%20a%20custo%20zero.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Business%20Intelligence%20-%20Implementar%20do%20jeito%20certo%20e%20a%20custo%20zero%20-%20Autor%20(Casa%20do%20Código).pdf'
      }
    ]
  },
  {
    titulo: 'Expressões Regulares: Uma Abordagem Divertida',
    subtitulo: 'Do básico ao avançado em casamento de padrões e manipulação de textos',
    autor: 'Aurelio Marinho Jargas',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-expressoes-regulares',
    ano: 2016,
    paginas: 210,
    sinopse: 'O clássico guia de Aurélio Marinho ensinando regex com humor, clareza e exemplos aplicáveis a Python, JavaScript, Linux e editores de código.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Express%C3%B5es%20Regulares%20-%20uma%20abordagem%20divertida.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Expressões%20Regulares%20-%20uma%20abordagem%20divertida%20-%20Autor%20(Aurelio%20Marinho).pdf'
      }
    ]
  },
  {
    titulo: 'Introdução a Data Science: Algoritmos de Machine Learning e Análise',
    subtitulo: 'Fundamentos matemáticos e práticos para análise de dados e predições',
    autor: 'Casa do Código',
    categoria: 'Ciência de Dados & Inteligência Artificial',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-data-science',
    ano: 2020,
    paginas: 250,
    sinopse: 'Conceitos centrais de ciência de dados, regressão, classificação, árvores de decisão e visualização prática em Python e R.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Introdu%C3%A7%C3%A3o%20a%20data%20science%20-%20Algoritmos%20de%20machine%20learning%20e%20m%C3%A9todos%20de%20an%C3%A1lise.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Introdução%20a%20data%20science%20-%20Algoritmos%20de%20machine%20learning%20e%20métodos%20de%20análise%20-%20Autor%20(Casa%20do%20Código).pdf'
      }
    ]
  },
  {
    titulo: 'OAuth 2.0: Proteja Suas Aplicações com Spring Security',
    subtitulo: 'Autenticação, autorização segura e controle de tokens para APIs REST',
    autor: 'Casa do Código',
    categoria: 'DevOps, Cloud & Infraestrutura',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-oauth2',
    ano: 2019,
    paginas: 215,
    sinopse: 'Padrão OAuth 2.0 e JWT para controle de acesso seguro a microsserviços e aplicações web com Java e Spring.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Oauth%202.0%20Proteja%20Suas%20Aplica%C3%A7%C3%B5es%20Com%20O%20Spring%20Security%20Oauth2.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Oauth%202.0%20Proteja%20Suas%20Aplicacoes%20Com%20O%20Spring%20Security%20Oauth2%20-%20Autor%20(Casa%20do%20Código).pdf'
      }
    ]
  },
  {
    titulo: 'A Regra é Não Ter Regras: A Netflix e a Cultura da Reinvenção',
    subtitulo: 'Gestão de pessoas, liberdade com responsabilidade e cultura de alta densidade',
    autor: 'Reed Hastings',
    categoria: 'Metodologias Ágeis & Carreira Tech',
    fonteSlug: 'github-bibliotecadev',
    fonteIdExterno: 'bdev-regra-nao-ter-regras',
    ano: 2020,
    paginas: 310,
    sinopse: 'Lições de liderança e gestão da Netflix: eliminação de controles burocráticos, feedback sincero e atração dos melhores talentos.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20Regra%20%C3%A9%20N%C3%A3o%20Ter%20Regras%20-%20A%20Netflix%20e%20a%20Cultura%20da%20Reinven%C3%A7%C3%A3o.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/A%20Regra%20é%20Não%20Ter%20Regras%20-%20A%20Netflix%20e%20a%20Cultura%20da%20Reinvenção%20-%20Autor%20(Reed%20Hastings).pdf'
      }
    ]
  },

  // ==================== italocamil0 / books ====================
  {
    titulo: 'Arduino Descomplicado: Como Elaborar Projetos de Eletrônica',
    subtitulo: 'Programação de microcontroladores, sensores e automação para iniciantes',
    autor: 'Claudio Luis Vieira Oliveira & Humberto Zanetti',
    categoria: 'DevOps, Cloud & Infraestrutura',
    fonteSlug: 'github-italocamilo',
    fonteIdExterno: 'italo-arduino-descomplicado',
    ano: 2015,
    paginas: 320,
    sinopse: 'Guia prático para criação de projetos eletrônicos e Internet das Coisas (IoT) com a plataforma de hardware livre Arduino.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Arquitetura%20Limpa%20-%20O%20Guia%20do%20Artes%C3%A3o%20para%20Estrutura%20e%20Design%20de%20Software.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/italocamil0/books/main/books/(Arduino%20Descomplicado)%20Claudio%20Luis%20Vieira%20Oliveira_%20Humberto%20Augusto%20Piovesana%20Zanetti%20-%20Arduino%20Descomplicado_%20Como%20Elaborar%20Projetos%20de%20Eletr%C3%B4nica-%C3%89rica%20(2015).pdf'
      }
    ]
  },
  {
    titulo: 'Aplicações Web Real Time com Node.js',
    subtitulo: 'Comunicação bidirecional, WebSockets e arquitetura assíncrona orientada a eventos',
    autor: 'Casa do Código',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'github-italocamilo',
    fonteIdExterno: 'italo-nodejs-realtime',
    ano: 2017,
    paginas: 190,
    sinopse: 'Construção de aplicações interativas em tempo real utilizando Node.js, Express, Socket.io e bancos de dados orientados a documentos.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20Web%20Mobile%20-%20Programe%20para%20um%20Mundo%20de%20Muitos%20Dispositivos.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/italocamil0/books/main/books/Aplicacoes%20web%20real%20time%20com%20Node-js%20-%20Casa%20do%20Codigo.pdf'
      }
    ]
  },
  {
    titulo: 'Apostila de Administração de Redes Linux',
    subtitulo: 'Serviços de rede, firewall, roteamento e segurança no terminal de servidores',
    autor: 'Comunidade Software Livre',
    categoria: 'DevOps, Cloud & Infraestrutura',
    fonteSlug: 'github-italocamilo',
    fonteIdExterno: 'italo-redes-linux',
    ano: 2019,
    paginas: 180,
    sinopse: 'Manual prático para configuração de DNS, DHCP, servidores web Apache/Nginx, SSH, iptables e gerenciamento de rede em distribuições Linux.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/10/maestro-20261005-1a2d7f9a4897756f/cda1e67a527c2b1071b43c6290662c37.webp',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/italocamil0/books/main/books/Apostila%20de%20Administra%C3%A7%C3%A3o%20de%20Redes%20Linux.pdf'
      }
    ]
  },
  {
    titulo: 'Apostila de Computação Quântica: Princípios e Algoritmos',
    subtitulo: 'Qubits, portas lógicas quânticas e algoritmos de Deutsch, Shor e Grover',
    autor: 'Pesquisa Acadêmica Aberta',
    categoria: 'Ciência de Dados & Inteligência Artificial',
    fonteSlug: 'github-italocamilo',
    fonteIdExterno: 'italo-computacao-quantica',
    ano: 2020,
    paginas: 140,
    sinopse: 'Texto introdutório sobre os fundamentos matemáticos da mecânica quântica aplicados ao processamento de informação e criptografia quântica.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/AI_Expert_Roadmap/65927a0974e90c3df4e690236a471e89.webp',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/italocamil0/books/main/books/Apostila%20de%20Computa%C3%A7%C3%A3o%20Qu%C3%A2ntica.pdf'
      }
    ]
  },
  {
    titulo: 'Estruturas de Dados e Algoritmos com JavaScript',
    subtitulo: 'Conceitos fundamentais de listas, pilhas, filas, árvores e grafos',
    autor: 'Comunidade Open Source',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'github-italocamilo',
    fonteIdExterno: 'italo-estruturas-dados',
    ano: 2021,
    paginas: 210,
    sinopse: 'Estudo aprofundado e prático sobre algoritmos de busca e ordenação, complexidade assintótica O(n) e estruturas de dados essenciais para desenvolvedores.',
    capaUrl: 'https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Refatora%C3%A7%C3%A3o%20-%20Aperfei%C3%A7oando%20o%20Design%20de%20C%C3%B3digos%20Existentes.svg',
    links: [
      {
        formato: 'pdf',
        url: 'https://raw.githubusercontent.com/italocamil0/books/main/books/Estrutura%20de%20Dados.pdf'
      }
    ]
  },

  // ==================== flaviojmendes / trilhainfo ====================
  {
    titulo: 'Trilha Info: Guia Completo de Desenvolvimento Frontend',
    subtitulo: 'Roteiro de estudos aberto em português para HTML, CSS, JavaScript, React e TypeScript',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'Desenvolvimento Web & Mobile',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-frontend',
    ano: 2026,
    paginas: 150,
    sinopse: 'Trilha colaborativa e aberta reunindo os melhores materiais gratuitos em língua portuguesa para formação de desenvolvedores frontend modernos.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp',
    links: [
      {
        formato: 'html',
        url: 'https://trilha.info/roadmap/frontend'
      }
    ]
  },
  {
    titulo: 'Trilha Info: Guia Completo de Desenvolvimento Backend',
    subtitulo: 'APIs, bancos relacionais e NoSQL, autenticação, microsserviços e arquitetura',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-backend',
    ano: 2026,
    paginas: 165,
    sinopse: 'Trilha aberta cobrindo linguagens backend (Node, Python, Java, Go), modelagem de dados, mensageria e segurança para serviços em produção.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp',
    links: [
      {
        formato: 'html',
        url: 'https://trilha.info/roadmap/backend'
      }
    ]
  },
  {
    titulo: 'Trilha Info: Guia Completo DevOps e Infraestrutura em Nuvem',
    subtitulo: 'Linux, Docker, Kubernetes, CI/CD, Terraform e observabilidade contínua',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'DevOps, Cloud & Infraestrutura',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-devops',
    ano: 2026,
    paginas: 180,
    sinopse: 'Trilha estruturada em português para dominar cultura DevOps, automação de deploys, containers e infraestrutura como código.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/10/maestro-20261005-1a2d7f9a4897756f/cda1e67a527c2b1071b43c6290662c37.webp',
    links: [
      {
        formato: 'html',
        url: 'https://trilha.info/roadmap/devops'
      }
    ]
  },
  {
    titulo: 'Trilha Info: Guia de Engenharia de Dados & Big Data',
    subtitulo: 'Pipelines ETL, Data Lakes, Apache Spark, Airflow, SQL e modelagem analítica',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'Ciência de Dados & Inteligência Artificial',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-data-engineer',
    ano: 2026,
    paginas: 170,
    sinopse: 'Roteiro de formação para engenheiros de dados com recursos abertos cobrindo ingestão, processamento distribuído e governança de dados.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/AI_Expert_Roadmap/65927a0974e90c3df4e690236a471e89.webp',
    links: [
      {
        formato: 'html',
        url: 'https://trilha.info/roadmap/data-engineer'
      }
    ]
  },
  {
    titulo: 'Trilha Info: Guia de Testes de Software & Garantia de Qualidade (QA)',
    subtitulo: 'Testes unitários, integração, end-to-end, automação com Cypress e pirâmide de testes',
    autor: 'Flávio Mendes & Comunidade Trilha Info',
    categoria: 'Arquitetura & Engenharia de Software',
    fonteSlug: 'trilhainfo',
    fonteIdExterno: 'trilha-test-qa',
    ano: 2026,
    paginas: 140,
    sinopse: 'Trilha completa em português para qualidade de software, testes manuais e automatizados, boas práticas e CI/CD com foco em QA.',
    capaUrl: 'https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp',
    links: [
      {
        formato: 'html',
        url: 'https://trilha.info/roadmap/test'
      }
    ]
  }
];

module.exports = {
  githubBooks
};
