const fs = require('fs');

const rawList = JSON.parse(fs.readFileSync('scratch/nilbuild_roadmaps.json', 'utf8')).map(d => d.name);

// Dicionário rico de metadados para os 95 roadmaps do roadmap.sh
const metadata = {
  'ai-agents': {
    titulo: 'Roadmap.sh: AI Agents & Agentes Autônomos de IA',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Avançado',
    descricao: 'Árvore de competências para desenvolvimento de agentes autônomos com LLMs: chamadas de ferramentas (tool use), memória de curto e longo prazo, planejamento de ações, loops de reflexão e orquestração com LangChain e AutoGen.'
  },
  'ai-data-scientist': {
    titulo: 'Roadmap.sh: AI Data Scientist (Cientista de Dados & IA)',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Intermediário a Avançado',
    descricao: 'Trilha completa cobrindo álgebra linear, cálculo, estatística inferencial, manipulação de dados com Pandas/NumPy, machine learning supervisionado e não supervisionado, deep learning e visualização analítica.'
  },
  'ai-engineer': {
    titulo: 'Roadmap.sh: AI Engineer (Engenheiro de Inteligência Artificial)',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Intermediário a Avançado',
    descricao: 'Guia essencial para engenharia de IA: consumo de APIs de modelos fundacionais, fine-tuning, RAG (Retrieval-Augmented Generation), bancos de dados vetoriais, avaliação de modelos e monitoramento em produção.'
  },
  'ai-product-builder': {
    titulo: 'Roadmap.sh: AI Product Builder (Construção de Produtos com IA)',
    area: 'Gestão & Negócios',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Como criar produtos digitais potencializados por IA: discovery de oportunidades de automação, prototipação rápida, design de UX com interfaces conversacionais e métricas de impacto no usuário.'
  },
  'ai-red-teaming': {
    titulo: 'Roadmap.sh: AI Red Teaming & Segurança em Modelos de IA',
    area: 'Segurança & Infraestrutura',
    nivel: 'Avançado',
    descricao: 'Metodologias de testes adversariais para inteligência artificial: injeção de prompts (prompt injection), evasão de guardrails, exfiltração de dados e auditoria de vulnerabilidades em sistemas de IA generativa.'
  },
  'android': {
    titulo: 'Roadmap.sh: Formação Desenvolvedor Android',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Roteiro de formação mobile para Android: Kotlin moderno, Jetpack Compose, arquitetura MVVM/MVI, Coroutines, Flow, injeção de dependências com Hilt e publicação na Google Play Store.'
  },
  'angular': {
    titulo: 'Roadmap.sh: Formação Angular',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário a Avançado',
    descricao: 'Guia estruturado do framework Angular: TypeScript avançado, componentes standalone, Signals, RxJS e reatividade, roteamento avançado, injeção de dependências e testes com Karma e Jest.'
  },
  'api-design': {
    titulo: 'Roadmap.sh: Design & Arquitetura de APIs',
    area: 'Arquitetura & Engenharia',
    nivel: 'Intermediário a Avançado',
    descricao: 'Princípios fundamentais de design de APIs: RESTful patterns, versionamento, paginação, idempotência, segurança com JWT e OAuth2, rate limiting, OpenAPI/Swagger, GraphQL e RPC.'
  },
  'aspnet-core': {
    titulo: 'Roadmap.sh: Formação ASP.NET Core & Ecossistema .NET',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário a Avançado',
    descricao: 'Formação em C# e ASP.NET Core: Web APIs minimalistas, Entity Framework Core, injeção de dependência, autenticação com Identity, Docker em .NET e microsserviços escaláveis.'
  },
  'aws': {
    titulo: 'Roadmap.sh: AWS Cloud Practitioner & Solutions Architect',
    area: 'DevOps & Nuvem',
    nivel: 'Iniciante a Avançado',
    descricao: 'Computação em nuvem na Amazon Web Services: EC2, S3, RDS, Lambda (Serverless), VPC e redes, IAM e segurança de credenciais, CloudWatch e infraestrutura global de nuvem.'
  },
  'backend-beginner': {
    titulo: 'Roadmap.sh: Backend para Iniciantes',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante',
    descricao: 'Fundamentos de desenvolvimento backend para quem está começando: protocolo HTTP, clientes e servidores, noções de bancos de dados relacionais e criação da primeira API REST.'
  },
  'backend': {
    titulo: 'Roadmap.sh: Formação Desenvolvedor Backend Completo',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Árvore de competências essencial para arquitetura backend: linguagens de programação, bancos SQL e NoSQL, autenticação e tokens, caching com Redis, mensageria (RabbitMQ/Kafka) e microsserviços.'
  },
  'bi-analyst': {
    titulo: 'Roadmap.sh: Business Intelligence Analyst (BI & Analytics)',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Roteiro para analistas de Business Intelligence: modelagem dimensional (Star Schema), ETL de dados, consultas analíticas em SQL, criação de dashboards no Power BI e Tableau e storytelling com dados.'
  },
  'blockchain': {
    titulo: 'Roadmap.sh: Formação Blockchain, Smart Contracts & Web3',
    area: 'Arquitetura & Engenharia',
    nivel: 'Intermediário a Avançado',
    descricao: 'Desenvolvimento descentralizado: fundamentos criptográficos, Ethereum, programação de Smart Contracts com Solidity, Web3.js, testes com Hardhat e segurança em contratos inteligentes.'
  },
  'c': {
    titulo: 'Roadmap.sh: Linguagem C (Fundamentos de Sistemas)',
    area: 'Arquitetura & Engenharia',
    nivel: 'Iniciante a Avançado',
    descricao: 'Guia da linguagem C: gerenciamento de memória (pointers, malloc/free), estruturas de dados nativas, compilação com GCC/Clang, Makefile e programação próxima ao hardware e sistemas operacionais.'
  },
  'claude-code': {
    titulo: 'Roadmap.sh: Claude Code & Desenvolvimento Assistido por IA',
    area: 'Tecnologia',
    nivel: 'Iniciante a Avançado',
    descricao: 'Guia prático para uso do Claude Code no terminal: agentes autônomos no desenvolvimento de software, automação de refatoração, criação de testes e integração contínua com IA.'
  },
  'cloudflare': {
    titulo: 'Roadmap.sh: Cloudflare & Edge Computing',
    area: 'DevOps & Nuvem',
    nivel: 'Intermediário',
    descricao: 'Arquitetura e recursos da Cloudflare: CDN global, proteção contra DDoS, DNS, Cloudflare Workers para execução em borda, Pages para hosting estático e KV/D1 para armazenamento distribuído.'
  },
  'code-review': {
    titulo: 'Roadmap.sh: Boas Práticas e Diretrizes de Code Review',
    area: 'Metodologias Ágeis & Carreira',
    nivel: 'Iniciante a Avançado',
    descricao: 'Como conduzir revisões de código de alto impacto: empatia e comunicação construtiva, checklist de qualidade, detecção de code smells, cobertura de testes e prevenção de regressões.'
  },
  'computer-science': {
    titulo: 'Roadmap.sh: Ciência da Computação (Fundamentos Teóricos)',
    area: 'Arquitetura & Engenharia',
    nivel: 'Iniciante a Avançado',
    descricao: 'Grade formativa de Ciência da Computação: lógica matemática, arquitetura de computadores, sistemas operacionais, teoria da computação, redes de dados e compiladores.'
  },
  'cpp': {
    titulo: 'Roadmap.sh: C++ Moderno (Alta Performance)',
    area: 'Arquitetura & Engenharia',
    nivel: 'Intermediário a Avançado',
    descricao: 'C++ Moderno (C++17/C++20): RAII, smart pointers, Templates e metaprogramação, Standard Template Library (STL), programação concorrente e desenvolvimento de motores gráficos e jogos.'
  },
  'css': {
    titulo: 'Roadmap.sh: CSS Moderno (Estilos & Layout Responsivo)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Domínio de CSS: box model, seletores avançados, layouts com Flexbox e CSS Grid, animações e transições, CSS Variables, metodologia BEM e frameworks utilitários como Tailwind CSS.'
  },
  'cyber-security': {
    titulo: 'Roadmap.sh: Cibersegurança & Defesa Cibernética',
    area: 'Segurança & Infraestrutura',
    nivel: 'Iniciante a Avançado',
    descricao: 'Guia de segurança da informação: fundamentos de redes seguras, criptografia, análise de vulnerabilidades, SIEM, testes de invasão (pentest), conformidade e resposta a incidentes.'
  },
  'data-analyst': {
    titulo: 'Roadmap.sh: Formação Analista de Dados',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Trilha formativa em análise de dados: SQL avançado, limpeza de dados com Python (Pandas), análise exploratória (EDA), estatística descritiva e criação de painéis visuais interativos.'
  },
  'data-engineer': {
    titulo: 'Roadmap.sh: Formação Engenheiro de Dados',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Intermediário a Avançado',
    descricao: 'Arquitetura de pipelines de dados em larga escala: ingestão contínua com Kafka, processamento distribuído com Apache Spark, orquestração com Airflow, Data Lakes e Data Warehouses modernos.'
  },
  'datastructures-and-algorithms': {
    titulo: 'Roadmap.sh: Estruturas de Dados e Algoritmos (DSA)',
    area: 'Arquitetura & Engenharia',
    nivel: 'Iniciante a Avançado',
    descricao: 'Fundamentos de computação: complexidade Big O, arrays, listas ligadas, pilhas, filas, árvores binárias, grafos, algoritmos de ordenação, busca binária e programação dinâmica.'
  },
  'design-system': {
    titulo: 'Roadmap.sh: Design Systems & Componentização na Web',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário',
    descricao: 'Criação e manutenção de bibliotecas de componentes: design tokens, documentação com Storybook, acessibilidade (WCAG), versionamento semântico e alinhamento entre designers e engenheiros.'
  },
  'devops-beginner': {
    titulo: 'Roadmap.sh: DevOps para Iniciantes',
    area: 'DevOps & Nuvem',
    nivel: 'Iniciante',
    descricao: 'Introdução à cultura DevOps: comandos básicos do terminal Linux, controle de versão com Git, conceitos de servidores web e primeiros passos com containers Docker.'
  },
  'devops': {
    titulo: 'Roadmap.sh: Formação DevOps & Engenharia de Infraestrutura',
    area: 'DevOps & Nuvem',
    nivel: 'Iniciante a Avançado',
    descricao: 'Formação completa em DevOps: automação de infraestrutura, CI/CD, gerenciamento de configuração, monitoramento e métricas (Prometheus/Grafana), logs distribuídos e nuvem híbrida.'
  },
  'devrel': {
    titulo: 'Roadmap.sh: Developer Relations (DevRel & Comunidades)',
    area: 'Metodologias Ágeis & Carreira',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Habilidades para profissionais de relações com desenvolvedores: evangelismo técnico, produção de tutoriais, organização de hackathons, feedback de produto e crescimento de comunidade.'
  },
  'devsecops': {
    titulo: 'Roadmap.sh: DevSecOps (Segurança Contínua em CI/CD)',
    area: 'Segurança & Infraestrutura',
    nivel: 'Intermediário a Avançado',
    descricao: 'Integração de práticas de segurança no pipeline de entrega contínua: SAST, DAST, análise de vulnerabilidades em dependências (SCA), segurança de imagens de containers e gestão de segredos.'
  },
  'django': {
    titulo: 'Roadmap.sh: Framework Django & Web em Python',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário',
    descricao: 'Desenvolvimento web completo com Python e Django: arquitetura MVT, ORM do Django, autenticação e permissões, Django REST Framework para APIs e deploy em produção.'
  },
  'docker': {
    titulo: 'Roadmap.sh: Containers Docker & Isolamento de Ambientes',
    area: 'DevOps & Nuvem',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Domínio prático de Docker: Dockerfile, multi-stage builds, redes e volumes, orquestração com Docker Compose e otimização de imagens para segurança e velocidade de deploy.'
  },
  'elasticsearch': {
    titulo: 'Roadmap.sh: Elasticsearch & Busca Textual Distribuída',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Intermediário a Avançado',
    descricao: 'Ecossistema Elastic (ELK): índices invertidos, sharding e réplicas, queries complexas e agregações, ingestão com Logstash e visualização com dashboards no Kibana.'
  },
  'engineering-manager': {
    titulo: 'Roadmap.sh: Engineering Manager (Liderança Técnica)',
    area: 'Gestão & Negócios',
    nivel: 'Avançado',
    descricao: 'Transição e atuação na gestão de equipes de engenharia: 1-on-1s eficazes, planos de desenvolvimento individual (PDI), contratação técnica, gestão de performance e cultura de equipe.'
  },
  'flutter': {
    titulo: 'Roadmap.sh: Formação Flutter & Dart (Multiplataforma)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Desenvolvimento mobile multiplataforma (Android e iOS): widgets fundamentais, gerenciamento de estado (Bloc/Provider/Riverpod), consumo de APIs REST e animações nativas.'
  },
  'forward-deployed-engineer': {
    titulo: 'Roadmap.sh: Forward Deployed Engineer (Engenharia de Soluções)',
    area: 'Arquitetura & Engenharia',
    nivel: 'Avançado',
    descricao: 'Atuação na interseção entre engenharia de software e clientes estratégicos: integração de sistemas legados, arquiteturas sob medida, deploys on-premise e resolução rápida de gargalos.'
  },
  'frontend-beginner': {
    titulo: 'Roadmap.sh: Frontend para Iniciantes',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante',
    descricao: 'Primeiros passos para construir sites: tags semânticas do HTML5, regras básicas de estilização em CSS e introdução à manipulação de páginas com JavaScript.'
  },
  'frontend': {
    titulo: 'Roadmap.sh: Formação Desenvolvedor Frontend Completo',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Guia definitivo de frontend: ecossistema JavaScript moderno, gerenciamento de estado, consumo de APIs, bundlers (Vite/Webpack), acessibilidade e métricas Web Vitals.'
  },
  'full-stack': {
    titulo: 'Roadmap.sh: Formação Desenvolvedor Full Stack',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Domínio de ponta a ponta: frontend reativo, APIs no backend, bancos de dados relacionais e não-relacionais, autenticação segura e automação de deploys na nuvem.'
  },
  'game-developer': {
    titulo: 'Roadmap.sh: Formação Game Developer (Criação de Jogos)',
    area: 'Tecnologia',
    nivel: 'Iniciante a Avançado',
    descricao: 'Desenvolvimento de jogos: lógica e matemática para games (vetores, física, colisões), motores gráficos (Unity, Unreal Engine e Godot), shaders e pipeline de áudio e assets.'
  },
  'git-github-beginner': {
    titulo: 'Roadmap.sh: Git e GitHub para Iniciantes',
    area: 'Tecnologia',
    nivel: 'Iniciante',
    descricao: 'Controle de versão essencial: commits, branches, merges, resolução de conflitos simples, clonagem de repositórios e abertura de Pull Requests no GitHub.'
  },
  'git-github': {
    titulo: 'Roadmap.sh: Git e GitHub Avançado',
    area: 'Tecnologia',
    nivel: 'Intermediário a Avançado',
    descricao: 'Fluxos avançados de trabalho com Git: Git Flow, Trunk-based Development, rebase interativo, bisect para depuração, automação com GitHub Actions e regras de proteção de branches.'
  },
  'golang': {
    titulo: 'Roadmap.sh: Linguagem Go (Golang)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Programação de alta concorrência em Go: goroutines, channels, interfaces, gerenciamento de dependências com Go modules, construção de microsserviços e testes integrados.'
  },
  'graphql': {
    titulo: 'Roadmap.sh: Formação GraphQL (APIs Declarativas)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário',
    descricao: 'Consultas precisas na web: Schemas, Types, Queries, Mutations, Subscriptions em tempo real, mitigação do problema N+1 com DataLoader e clientes como Apollo e Relay.'
  },
  'html': {
    titulo: 'Roadmap.sh: HTML Semântico & Acessibilidade Web',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante',
    descricao: 'A base da internet: tags semânticas para SEO e leitores de tela, formulários acessíveis, validações nativas, tags de mídia e boas práticas de estruturação do DOM.'
  },
  'inference-engineering': {
    titulo: 'Roadmap.sh: Inference Engineering & Otimização de Modelos',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Avançado',
    descricao: 'Execução eficiente de modelos de IA em produção: quantização (GGUF, AWQ, FP8), servidores de inferência (vLLM, TensorRT-LLM, TGI), gerenciamento de KV-cache e latência ultra-baixa.'
  },
  'ios': {
    titulo: 'Roadmap.sh: Formação Desenvolvedor iOS',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Desenvolvimento mobile no ecossistema Apple: Swift moderno, SwiftUI, concorrência assíncrona (Async/Await), CoreData/SwiftData, arquitetura MVVM e publicação na App Store.'
  },
  'java': {
    titulo: 'Roadmap.sh: Formação Linguagem Java & Ecossistema Corporativo',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Java moderno (Java 17/21 LTS): Programação Orientada a Objetos, Collections, Streams API, Virtual Threads (Project Loom), gerenciamento com Maven/Gradle e testes com JUnit.'
  },
  'javascript': {
    titulo: 'Roadmap.sh: Formação JavaScript Moderno (ES6+)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'A linguagem da web em profundidade: tipos primitivos e de referência, closures, protótipos, Event Loop, Promises, Async/Await, manipulação de DOM e modularização.'
  },
  'kotlin': {
    titulo: 'Roadmap.sh: Linguagem Kotlin (Multiplataforma)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Programação moderna com Kotlin: null-safety, extensões de funções, data classes, Coroutines para assincronismo, backend com Ktor/Spring e Kotlin Multiplatform (KMP).'
  },
  'kubernetes': {
    titulo: 'Roadmap.sh: Orquestração com Kubernetes (K8s)',
    area: 'DevOps & Nuvem',
    nivel: 'Intermediário a Avançado',
    descricao: 'Orquestração de microsserviços em produção: Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, gerenciamento com Helm, Operators e observabilidade no cluster.'
  },
  'laravel': {
    titulo: 'Roadmap.sh: Framework Laravel & PHP Moderno',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário',
    descricao: 'Desenvolvimento ágil com Laravel: Blade, Eloquent ORM, migrações de banco, filas assíncronas com Redis, autenticação com Breeze/Sanctum e ecossistema Livewire/Inertia.'
  },
  'leetcode': {
    titulo: 'Roadmap.sh: Preparação LeetCode & Entrevistas de Algoritmos',
    area: 'Arquitetura & Engenharia',
    nivel: 'Intermediário a Avançado',
    descricao: 'Padrões de resolução para entrevistas técnicas: Two Pointers, Sliding Window, Fast & Slow Pointers, BFS/DFS em grafos, Backtracking e Programação Dinâmica.'
  },
  'linux': {
    titulo: 'Roadmap.sh: Administração de Sistemas Linux',
    area: 'DevOps & Nuvem',
    nivel: 'Iniciante a Intermediário',
    descricao: 'O sistema operacional dos servidores: hierarquia do filesystem, permissões (chmod/chown), processos (systemd/ps), gerenciamento de pacotes, SSH e noções de segurança e firewall.'
  },
  'machine-learning': {
    titulo: 'Roadmap.sh: Formação Machine Learning & Aprendizado de Máquina',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Intermediário a Avançado',
    descricao: 'Algoritmos e práticas de aprendizado: regressão linear/logística, árvores de decisão, florestas aleatórias, SVM, Redes Neurais com PyTorch/TensorFlow e métricas de validação.'
  },
  'mlops': {
    titulo: 'Roadmap.sh: MLOps (Operações de Machine Learning)',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Avançado',
    descricao: 'Ciclo de vida de modelos em escala: rastreamento de experimentos (MLflow/Weights&Biases), versionamento de dados (DVC), pipelines de treinamento automatizado e detecção de model drift.'
  },
  'mongodb': {
    titulo: 'Roadmap.sh: MongoDB & Modelagem de Bancos NoSQL',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Intermediário',
    descricao: 'Bancos de documentos: modelagem orientada a documentos (embedding vs referencing), Aggregation Framework, índices e performance, replica sets e sharding para escalabilidade.'
  },
  'network-engineer': {
    titulo: 'Roadmap.sh: Network Engineer (Engenharia de Redes)',
    area: 'Segurança & Infraestrutura',
    nivel: 'Intermediário a Avançado',
    descricao: 'Fundamentos de telecomunicações e redes: modelo OSI, protocolo TCP/IP, roteamento BGP/OSPF, sub-redes e VLANs, balanceadores de carga, VPNs e automação de redes com Python.'
  },
  'nextjs': {
    titulo: 'Roadmap.sh: Next.js & React Full Stack',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário a Avançado',
    descricao: 'O framework de produção para React: App Router, React Server Components (RSC), Server Actions, otimização automática de imagens e fontes, SEO dinâmico e deploy com Vercel/Docker.'
  },
  'nodejs': {
    titulo: 'Roadmap.sh: Node.js (Servidores & APIs Escaláveis)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'JavaScript no lado do servidor: arquitetura assíncrona orientada a eventos, Streams e Buffers, módulos CommonJS/ESM, criação de APIs com Express/Fastify e profiling de memória.'
  },
  'openclaw': {
    titulo: 'Roadmap.sh: OpenClaw & Agentes de Código Aberto',
    area: 'Tecnologia',
    nivel: 'Intermediário',
    descricao: 'Arquiteturas abertas para raspagem de dados, automação de interfaces, orquestração de scripts e agentes de inteligência em código aberto.'
  },
  'php': {
    titulo: 'Roadmap.sh: PHP Moderno (PHP 8+)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Intermediário',
    descricao: 'PHP contemporâneo: tipagem estrita, atributos, match expressions, gerenciamento de pacotes com Composer, padrões PSR, programação orientada a objetos robusta e testes com PHPUnit.'
  },
  'postgresql-dba': {
    titulo: 'Roadmap.sh: PostgreSQL DBA & Administração de Banco',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Intermediário a Avançado',
    descricao: 'Administração profissional de PostgreSQL: tunning de configuração (postgresql.conf), índices avançados (B-Tree, GIN, GiST), particionamento de tabelas, replicação lógica/streaming e backups.'
  },
  'power-bi': {
    titulo: 'Roadmap.sh: Microsoft Power BI & Modelagem DAX',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Criação de soluções de Business Intelligence: tratamento de dados com Power Query (linguagem M), fórmulas analíticas com DAX, relacionamentos de tabelas e publicação de relatórios.'
  },
  'product-design': {
    titulo: 'Roadmap.sh: Product Design (Design de Produtos Digitais)',
    area: 'Gestão & Negócios',
    nivel: 'Iniciante a Avançado',
    descricao: 'Processo completo de design: discovery de produto, wireframing e prototipagem no Figma, design visual, testes de usabilidade com usuários reais e colaboração com times de desenvolvimento.'
  },
  'product-manager': {
    titulo: 'Roadmap.sh: Product Manager (Gestão de Produtos)',
    area: 'Gestão & Negócios',
    nivel: 'Iniciante a Avançado',
    descricao: 'Formação em Product Management: definição de visão e roadmap de produto, priorização de backlog (RICE/MoSCoW), análise de métricas de produto (AARRR), estratégia de monetização e lançamentos.'
  },
  'prompt-engineering': {
    titulo: 'Roadmap.sh: Engenharia de Prompts para Modelos LLM',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Técnicas avançadas para extrair o máximo de modelos de linguagem: Few-Shot Prompting, Chain-of-Thought (CoT), ReAct, estruturação de outputs com JSON Schema e mitigação de alucinações.'
  },
  'python-data-analysis': {
    titulo: 'Roadmap.sh: Python para Análise de Dados',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Trilha analítica com Python: ambientes Jupyter, computação com NumPy, dataframes com Pandas, gráficos expressivos com Seaborn e automação de planilhas e relatórios.'
  },
  'python': {
    titulo: 'Roadmap.sh: Formação Linguagem Python',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'A linguagem mais popular do mundo: sintaxe limpa, estruturas de dados nativas, geradores e decoradores, orientação a objetos, módulos e pacotes com Pip e escrita de scripts utilitários.'
  },
  'qa': {
    titulo: 'Roadmap.sh: Quality Assurance (QA & Automação de Testes)',
    area: 'Arquitetura & Engenharia',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Garantia de qualidade de software: pirâmide de testes, testes manuais e exploratórios, automação end-to-end com Cypress e Playwright, testes de carga com k6 e integração contínua.'
  },
  'r-programming': {
    titulo: 'Roadmap.sh: Programação em R para Ciência de Dados',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Computação estatística em R: ecossistema Tidyverse (dplyr, tidyr), visualizações com ggplot2, modelagem estatística clássica e relatórios reprodutíveis com R Markdown.'
  },
  'r': {
    titulo: 'Roadmap.sh: Linguagem R & Análise Estatística',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Iniciante a Avançado',
    descricao: 'Aplicações avançadas de R para bioinformática, econometria, modelagem probabilística de dados e pacotes especializados em análises matemáticas complexas.'
  },
  'react-native': {
    titulo: 'Roadmap.sh: Formação React Native (Mobile)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário',
    descricao: 'Construção de aplicativos nativos para iOS e Android com JavaScript e React: componentes nativos, navegação com React Navigation, consumo de APIs de hardware e fluxo com Expo.'
  },
  'react': {
    titulo: 'Roadmap.sh: Formação React (Frontend Reativo)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Avançado',
    descricao: 'Biblioteca líder de interfaces: JSX, Componentes, Hooks nativos e customizados, gerenciamento de estado global (Zustand/Redux), roteamento e otimização de renderização.'
  },
  'redis': {
    titulo: 'Roadmap.sh: Redis & Armazenamento em Memória',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Intermediário',
    descricao: 'Bancos em memória ultra-rápidos: strings, hashes, lists, sets, sorted sets, Pub/Sub para mensageria, estratégias de expiração e invalidação de cache, persistência (RDB/AOF) e clustering.'
  },
  'ruby-on-rails': {
    titulo: 'Roadmap.sh: Framework Ruby on Rails',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário',
    descricao: 'Desenvolvimento web acelerado por convenção: Active Record, Action Pack, migrações automáticas de banco de dados, autenticação, Hotwire/Turbo e testes com RSpec.'
  },
  'ruby': {
    titulo: 'Roadmap.sh: Linguagem Ruby & Orientação a Objetos',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Elegância e produtividade com Ruby: blocos, procs e lambdas, metaprogramação dinâmica, gerenciamento de bibliotecas com RubyGems e Bundler e escrita expressiva de código.'
  },
  'rust': {
    titulo: 'Roadmap.sh: Formação Linguagem Rust',
    area: 'Arquitetura & Engenharia',
    nivel: 'Intermediário a Avançado',
    descricao: 'Segurança de memória sem garbage collector: sistema de Ownership, Borrowing e Lifetimes, pattern matching, traits, programação concorrente segura e ecossistema Cargo.'
  },
  'scala': {
    titulo: 'Roadmap.sh: Linguagem Scala & Computação Funcional',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Avançado',
    descricao: 'O poder funcional na JVM: imutabilidade, funções de alta ordem, tipos avançados, pattern matching e integração com frameworks de Big Data como Apache Spark.'
  },
  'seo': {
    titulo: 'Roadmap.sh: SEO Técnico (Search Engine Optimization)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Otimização de sites para mecanismos de busca: rastreabilidade e indexação, dados estruturados (Schema.org), Core Web Vitals, sitemaps XML, robots.txt e arquitetura de URLs.'
  },
  'server-side-game-developer': {
    titulo: 'Roadmap.sh: Server-Side Game Developer (Servidores de Jogos)',
    area: 'Arquitetura & Engenharia',
    nivel: 'Avançado',
    descricao: 'Engenharia de servidores para jogos multiplayer: protocolos de rede UDP vs TCP, reconciliação de estado e interpolação, matchmaking, escalabilidade de salas e combate a trapaças.'
  },
  'shell-bash': {
    titulo: 'Roadmap.sh: Shell Scripting & Bash',
    area: 'DevOps & Nuvem',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Automação na linha de comando: variáveis de ambiente, pipes e redirecionamentos, estruturas de controle de fluxo, manipulação de texto com grep/awk/sed e rotinas cron.'
  },
  'software-architect': {
    titulo: 'Roadmap.sh: Arquiteto de Software',
    area: 'Arquitetura & Engenharia',
    nivel: 'Avançado',
    descricao: 'Tomada de decisões técnicas de alto impacto: trade-offs arquiteturais, monolitos vs microsserviços, arquitetura orientada a eventos, resiliência, escalabilidade e governança de sistemas.'
  },
  'software-design-architecture': {
    titulo: 'Roadmap.sh: Arquitetura e Design de Software',
    area: 'Arquitetura & Engenharia',
    nivel: 'Intermediário a Avançado',
    descricao: 'Princípios fundamentais de design: Clean Architecture, SOLID, Design Patterns do GoF, Domain-Driven Design (DDD), acoplamento e coesão e modularização de código-fonte.'
  },
  'spring-boot': {
    titulo: 'Roadmap.sh: Framework Spring Boot & Java Corporativo',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário a Avançado',
    descricao: 'Microsserviços em Java com Spring Boot: injeção de dependências, Spring Data JPA, Spring Security com OAuth2, Actuator para observabilidade e testes automatizados.'
  },
  'sql': {
    titulo: 'Roadmap.sh: SQL & Bancos de Dados Relacionais',
    area: 'Inteligência Artificial & Dados',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Linguagem padrão de dados: DDL, DML, joins complexos, funções de agregação, subqueries, índices para otimização de performance, transações ACID e normalização de tabelas.'
  },
  'swift-ui': {
    titulo: 'Roadmap.sh: SwiftUI (Interfaces Declarativas Apple)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Intermediário',
    descricao: 'Interfaces declarativas modernas para iOS, macOS e iPadOS: State e Binding, ObservableObject, navegação fluida, animações e integração com o ecossistema Swift.'
  },
  'system-design': {
    titulo: 'Roadmap.sh: System Design & Arquitetura de Grande Escala',
    area: 'Arquitetura & Engenharia',
    nivel: 'Avançado',
    descricao: 'Como projetar sistemas para milhões de usuários: balanceamento de carga, caching em múltiplos níveis, sharding de bancos de dados, teorema CAP, consistência eventual e microsserviços.'
  },
  'technical-writer': {
    titulo: 'Roadmap.sh: Technical Writer (Escrita Técnica)',
    area: 'Metodologias Ágeis & Carreira',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Produção de documentação clara e precisa: manuais de usuário, documentação de APIs, guias de arquitetura, ferramentas Docs-as-Code (Markdown/Git) e comunicação técnica.'
  },
  'terraform': {
    titulo: 'Roadmap.sh: Terraform & Infraestrutura como Código (IaC)',
    area: 'DevOps & Nuvem',
    nivel: 'Intermediário a Avançado',
    descricao: 'Provisionamento automatizado de nuvem: linguagem HCL, state management remoto, módulos reutilizáveis, provedores de nuvem (AWS, GCP, Azure) e boas práticas em equipe.'
  },
  'typescript': {
    titulo: 'Roadmap.sh: Formação TypeScript',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Intermediário',
    descricao: 'JavaScript com tipagem estática: tipos primitivos, interfaces, type aliases, union e intersection types, generics, utility types e configuração do tsconfig para projetos reais.'
  },
  'ux-design': {
    titulo: 'Roadmap.sh: UX Design (Experiência do Usuário)',
    area: 'Gestão & Negócios',
    nivel: 'Iniciante a Intermediário',
    descricao: 'Design centrado no usuário: pesquisa com usuários, personas, jornadas do cliente (user journeys), testes de usabilidade, heurísticas de Nielsen e arquitetura de informação.'
  },
  'vibe-coding': {
    titulo: 'Roadmap.sh: Vibe Coding (Desenvolvimento com Agentes de IA)',
    area: 'Tecnologia',
    nivel: 'Iniciante a Avançado',
    descricao: 'Fluxo moderno de desenvolvimento de software impulsionado por copilotos e agentes de IA: Cursor, Claude, prompts de arquitetura, prototipagem em tempo real e iteração contínua.'
  },
  'vue': {
    titulo: 'Roadmap.sh: Formação Vue.js',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Intermediário',
    descricao: 'O framework progressivo de JavaScript: Composition API, reatividade com ref e reactive, Vue Router, gerenciamento de estado com Pinia e criação de Single Page Applications.'
  },
  'wordpress': {
    titulo: 'Roadmap.sh: Formação WordPress (Temas & Plugins)',
    area: 'Desenvolvimento Web & Mobile',
    nivel: 'Iniciante a Intermediário',
    descricao: 'O CMS mais utilizado na internet: estrutura de temas e templates, desenvolvimento de plugins customizados, Hooks (actions e filters), REST API do WordPress e boas práticas de segurança.'
  }
};

const finalRoadmaps = rawList.map(slug => {
  const meta = metadata[slug] || {
    titulo: `Roadmap.sh: Formação ${slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}`,
    area: 'Tecnologia',
    nivel: 'Iniciante a Avançado',
    descricao: `Guia passo a passo e árvore de habilidades interativa cobrindo tópicos essenciais de ${slug}. Disponível abertamente no roadmap.sh.`
  };

  return {
    slug,
    titulo: meta.titulo,
    tipo: 'roadmap',
    area: meta.area,
    plataforma: 'Roadmap.sh',
    url: `https://roadmap.sh/${slug}`,
    githubUrl: `https://github.com/nilbuild/developer-roadmap/tree/master/roadmaps/${slug}`,
    licenca: 'gratuito',
    nivel: meta.nivel,
    descricao: `${meta.descricao} (Código aberto no GitHub: nilbuild/developer-roadmap/tree/master/roadmaps/${slug})`
  };
});

console.log("Roadmaps mapeados com sucesso:", finalRoadmaps.length);

const outputCode = `/**
 * Acervo Completo de Roadmaps Oficiais do Roadmap.sh
 * Extraído diretamente do repositório oficial:
 * https://github.com/nilbuild/developer-roadmap/tree/master/roadmaps (${finalRoadmaps.length} roadmaps catalogados)
 */

const roadmapShList = ${JSON.stringify(finalRoadmaps, null, 2)};

module.exports = { roadmapShList };
`;

fs.writeFileSync('src/database/roadmapShData.js', outputCode, 'utf8');
console.log("Arquivo src/database/roadmapShData.js criado com sucesso!");
