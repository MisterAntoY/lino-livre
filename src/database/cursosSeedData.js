/**
 * Catálogo Curado de Cursos Livres e Gratuitos
 * - Guia de TI (15 cursos e roadmaps verificados)
 * - Fundação Bradesco / Escola Virtual (61 cursos oficiais verificados um por um)
 * - Recursos Educacionais Abertos (25 cursos OER com deep-links)
 *
 * Todas as URLs são deep-links diretos e específicos para páginas de inscrição, simulação ou aulas.
 */

const cursosData = [
  [
    "Curso de Python 2025",
    "Tecnologia",
    "Guia de TI / YouTube (Hashtag Programação)",
    "https://guiadeti.com.br/cursos/curso-de-python-2025/",
    "gratuito",
    "Iniciante",
    "Curso gratuito de Python no YouTube com certificação gratuita oficial. Cobre variáveis, estruturas condicionais, listas, dicionários e lógica de programação moderna."
  ],
  [
    "Curso DevOps: Cloud, Linux, Docker e Marketplace",
    "Tecnologia",
    "Guia de TI / YouTube (Iago Ferreira TI)",
    "https://guiadeti.com.br/cursos/curso-devops-cloud-linux-docker-e-projeto-marketplace/",
    "gratuito",
    "Intermediário",
    "Formação completa em vídeo no YouTube com 14 aulas e certificação gratuita. Aborda DevOps, SRE, Cloud Computing, Linux, Git, Docker, observabilidade e projeto de Marketplace."
  ],
  [
    "Curso Básico de Power BI 2025: Do Zero ao Dashboard",
    "Tecnologia",
    "Guia de TI / YouTube (Hashtag Treinamentos)",
    "https://guiadeti.com.br/cursos/curso-basico-de-power-bi-2025-do-zero-ao-dashboard/",
    "gratuito",
    "Iniciante",
    "Aulas introdutórias no YouTube com certificação gratuita. Power Query, modelagem de dados relacionais, fórmulas DAX, gráficos dinâmicos e dashboards."
  ],
  [
    "Curso Básico e Gratuito de Claude & Engenharia de IA",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-basico-e-gratuito-de-claude/",
    "gratuito",
    "Iniciante",
    "Curso completo de Claude no YouTube com certificação gratuita. Aborda Artefatos, Cowork, Claude Code, Skills e automação de fluxos com IA generativa."
  ],
  [
    "Curso de Streamlit: Dashboards e Web Apps em Python",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-streamlit/",
    "gratuito",
    "Intermediário",
    "Criação de web apps de dados e dashboards em Python com filtros e gráficos no YouTube, com certificação gratuita validável."
  ],
  [
    "Curso Gratuito de HTML e CSS: Landing Page do Zero",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-basico-de-html-e-css/",
    "gratuito",
    "Iniciante",
    "13 videoaulas práticas no YouTube com certificação gratuita. HTML semântico, CSS moderno, Flexbox, layout responsivo e formulários."
  ],
  [
    "Curso de Introdução ao TypeScript",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-introducao-ao-typescript/",
    "gratuito",
    "Iniciante",
    "Fundamentos de TypeScript no YouTube com certificação gratuita. Tipagem estática, interfaces, generics, classes, configuração tsconfig e Node."
  ],
  [
    "Curso de Laravel 11 - Completo e Gratuito",
    "Tecnologia",
    "Guia de TI / YouTube (Especializa TI)",
    "https://guiadeti.com.br/cursos/curso-de-laravel-11-completo-e-gratuito/",
    "gratuito",
    "Intermediário",
    "Desenvolvimento moderno com Laravel 11 e Docker no YouTube com certificação gratuita. MVC, autenticação, Eloquent, Blade e APIs REST."
  ],
  [
    "Curso de Linux - Primeiros Passos e Terminal",
    "Tecnologia",
    "Guia de TI / YouTube (Curso em Vídeo)",
    "https://guiadeti.com.br/cursos/curso-de-linux-primeiros-passos/",
    "gratuito",
    "Iniciante",
    "Curso em vídeo no YouTube com certificação gratuita. Domínio do terminal Linux, comandos essenciais, manipulação de arquivos e administração."
  ],
  [
    "Curso Redes de Computadores Grátis",
    "Tecnologia",
    "Guia de TI / YouTube (Curso em Vídeo)",
    "https://guiadeti.com.br/cursos/curso-redes-de-computadores-gratis/",
    "gratuito",
    "Iniciante",
    "Conceitos fundamentais de redes no YouTube com certificação gratuita. TCP/IP, IPv4/IPv6, sub-redes, roteamento e Packet Tracer."
  ],
  [
    "AI Expert Roadmap: Trilha de IA & Ciência de Dados",
    "Tecnologia",
    "Guia de TI",
    "https://guiadeti.com.br/roadmaps/ai-expert-roadmap/",
    "gratuito",
    "Avançado",
    "Guia completo e aberto para estudo de Machine Learning, Deep Learning, Engenharia de Dados, MLOps e Inteligência Artificial."
  ],
  [
    "Awesome Roadmaps: Guias de Desenvolvimento de Software",
    "Tecnologia",
    "Guia de TI",
    "https://guiadeti.com.br/roadmaps/awesome-roadmaps/",
    "gratuito",
    "Livre",
    "Coleção consolidada de roteiros de estudo cobrindo frontend, backend, DevOps, cibersegurança e arquitetura de software."
  ],
  [
    "TechGuide.sh - Guia de Carreiras e Tecnologias",
    "Tecnologia",
    "Guia de TI / Alura",
    "https://guiadeti.com.br/roadmaps/techguidesh-guia-de-carreiras-e-tecnologias/",
    "gratuito",
    "Livre",
    "Mapeamento das competências técnicas e caminhos de aprendizado para profissionais de tecnologia em diversas especialidades."
  ],
  [
    "Trilha Info - Trilhas Gratuitas em Português",
    "Tecnologia",
    "Guia de TI",
    "https://guiadeti.com.br/roadmaps/trilha-info-trilhas-gratuitas-de-tecnologia/",
    "gratuito",
    "Iniciante",
    "Trilhas colaborativas e abertas para formação de desenvolvedores Frontend, Backend, Full Stack, DevOps e QA no Brasil."
  ],
  [
    "Roadmap.sh - Developer Roadmaps Traduzidos",
    "Tecnologia",
    "Guia de TI",
    "https://guiadeti.com.br/roadmaps/roadmapsh-developer-roadmaps/",
    "gratuito",
    "Livre",
    "Mapas interativos de carreiras e habilidades para desenvolvimento de software, computação em nuvem e inteligência artificial."
  ],
  [
    "Administrando Banco de Dados",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/administrando-banco-de-dados",
    "gratuito",
    "Avançado",
    "Neste curso, você verá uma introdução de como administrar um banco de dados e, desta forma, conseguir realizar um bom gerenciamento das atividades inerentes a essa função. Além disso, você conhecerá os conceitos que fazem parte do dia a dia de um administrador de banco de dados, os modelos de dados,"
  ],
  [
    "AI-900 - Fundamentos de IA no Azure",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/AI900Azure",
    "gratuito",
    "Iniciante",
    "A certificação AI-900, ou Microsoft Azure AI Fundamentals,é essencial para os profissionais que querem aplicar a inteligência artificial (IA) no ecossistema do Azure.O objetivo deste curso é apresentar os serviços de IA do Azure que são funcionalidades de IA que podem ser incorporados a aplicativos"
  ],
  [
    "Análise de Balanços",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/Analise-de-Balan%C3%A7os",
    "gratuito",
    "Avançado",
    "O curso de Análise de Balanços mostra como você deve olhar para o retrato financeiro de uma empresa - o chamado Balanço Patrimonial -, e compreendê-lo. Esse método é considerado o mais rápido, eficiente e abrangente para produzir informações úteis que podem ajudar na tomada de decisões. Nosso objeti"
  ],
  [
    "Análise de Dados no Power BI",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/analise-de-dados-no-power-bi",
    "gratuito",
    "Avançado",
    "Este é o quinto - e último - curso da trilha que está disponível na Escola Virtual sobre o Power BIque, em resumo, é uma coleção de serviços de software, aplicativos e conectores que funcionam juntos para tornar fontes de dados não relacionadas em informações coerentes, visualmente imersivas e inter"
  ],
  [
    "Atendimento ao Público",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/atendimento-ao-publico",
    "gratuito",
    "Iniciante",
    "O objetivo deste curso é apresentar noções de atendimento, suas diferentes formas e técnicas, e, principalmente, o que é preciso fazer para que uma pessoa se sinta bem atendida. Para isso, você é convidado(a) a refletir sobre a essência dessa atividade tão presente em nossa rotina e tão importante p"
  ],
  [
    "Como Conseguir um Novo Emprego",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/Como-Conseguir-um-Novo-Emprego",
    "gratuito",
    "Iniciante",
    "O mercado de trabalho está cada vez mais competitivo, é recomendável que todos os candidatos a um novo emprego estejam aptos a entrar nesta concorrência bem preparados. O curso aborda o passo a passo para que você se prepare e se destaque na busca de um novo emprego. Você aprenderá a elaborar um cur"
  ],
  [
    "Comunicação e Mobilização com IA",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/comunicacao_IA",
    "gratuito",
    "Iniciante",
    "O curso Comunicação e Mobilização com IA apresenta como as organizações do Terceiro Setor podem superar desafios de comunicação e captação de recursos por meio da inteligência artificial. Muitas ONGs enfrentam dificuldades em produzir conteúdos consistentes, personalizar mensagens e mensurar o impac"
  ],
  [
    "Comunicação Empresarial",
    "Linguagens & Comunicação",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/comunicacao-empresarial",
    "gratuito",
    "Iniciante",
    "O processo de comunicação nas organizações é importante para a imagem dela perante funcionários, fornecedores, clientes, órgãos governamentais e a sociedade como um todo. Todo profissional, em algum momento, será solicitado a se expressar e terá de \"vender\" suas ideias, seja redigindo um texto ou el"
  ],
  [
    "Comunicação Escrita: Ortografia, Gramática e Texto",
    "Linguagens & Comunicação",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/comunicacao_escrita",
    "gratuito",
    "Iniciante",
    "O curso Comunicação Escrita: Ortografia, Gramática e Texto foi desenvolvido para fortalecer a escrita com clareza, correção e segurança, contribuindo para uma comunicação mais eficaz no contexto pessoal e profissional. O conteúdo contempla temas essenciais como verbos, pronomes e nomes, além de elem"
  ],
  [
    "Conceitos de Aprendizagem Criativa",
    "Educação & Pedagogia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/conceitos-de-aprendizagem-criativa",
    "gratuito",
    "Iniciante",
    "A Aprendizagem Criativa é uma abordagem pedagógica que busca desenvolver conexões pessoais na qual o professor cria um ambiente propício ao estímulo da criatividade, da imaginação e da colaboração, buscando, assim, despertar os interesses dos estudantes. Esse curso tem como objetivo apresentar os co"
  ],
  [
    "Construindo minha Proteção Financeira",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/Construindo-minha-Protecao-Financeira",
    "gratuito",
    "Iniciante",
    "A Escola Virtual da Fundação Bradescoe aBradesco Segurosqueremapoiar você em sua trajetória financeira, de forma a orientá-lo e conscientizá-lo sobre fatores importantes nesteprocesso de reeducação com o dinheiro e controle de suas despesas. Você aprenderá a administrar as suas finanças por meio do"
  ],
  [
    "Contabilidade Empresarial",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/Contabilidade-Empresarial",
    "gratuito",
    "Avançado",
    "Com o objetivo de apresentar noções básicas da Contabilidade Empresarial, este curso revela-se útil para diversos profissionais, como analistas, investidores, administradores e todos que desejam entender como é feita a contabilidade e porque ela é tão importante para a gestão de uma empresa, indepen"
  ],
  [
    "Controle de Impulso e Manejo de Raiva, Vergonha e Inveja",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/controle-de-impulso-e-manejo-de-raiva-vergonha-e-inveja",
    "gratuito",
    "Iniciante",
    "Você já parou para pensar o que se passa em nossa cabeça quando estamos com raiva? Tudo acontece muito rápido, mas o sentimento da raiva está acompanhado de diversas avaliações: de quem é a culpa, qual a intenção da pessoa responsável pelo sentimento, qual a intensidade do dano provocado e, até mesm"
  ],
  [
    "Crie um site simples usando HTML, CSS e JavaScript",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/crie-um-site-simples-usando-html-css-e-javascript",
    "gratuito",
    "Iniciante",
    "Neste curso, você terá as informações fundamentais para trabalhar com o desenvolvimento para a Web, aprendendo a usar HTML, CSS e JavaScript para criar sites ou aplicativos da Web, que parecem e funcionam como aplicativos nativos, mas que são executados em seu navegador de Internet. Você conhecerá o"
  ],
  [
    "Cultura Digital",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/cultura-digital",
    "gratuito",
    "Iniciante",
    "Neste curso, você aprenderá sobre os conceitos básicos e fundamentais de Redes Sociais e sobre o Pacote Office, da Microsoft. No primeiro módulo, você vai ver que as Redes Sociais são estruturas compostas por pessoas ou organizações, que partilham valores e objetivos em comum. Você sabia que, assim"
  ],
  [
    "Desenvolvimento Profissional",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/desenvolvimento-profissional",
    "gratuito",
    "Iniciante",
    "Neste curso, você verá a importância do desenvolvimento de sua carreira profissional, por meio do investimento em autoconhecimento. Sabemos que as escolhas profissionais não são tarefas fáceis e, por este motivo, você precisa estar preparado(a) para os desafios do mercado de trabalho! No decorrer do"
  ],
  [
    "Design Thinking para Educadores",
    "Educação & Pedagogia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/design-thinking-para-educadores",
    "gratuito",
    "Iniciante",
    "O objetivo deste curso é apresentar aos educadores a abordagem do design thinking, considerando seu contexto e relevância e as possibilidades de uso na educação. O conteúdo está organizado em quatro módulos, contendo vídeos, ilustrações, infográficos e exemplos práticos. Inicialmente, o conteúdo tra"
  ],
  [
    "Educação Financeira",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/educacao-financeira",
    "gratuito",
    "Iniciante",
    "Como você lida com seu dinheiro? Você sabe quanto gasta por mês? Você consegue guardar dinheiro? Você gasta com coisas que não precisa? Quem termina primeiro, o mês ou o seu salário? Com certeza você já ouviu muitas dessas perguntas, não é mesmo? Vivemos em uma sociedade consumista, em que há uma gr"
  ],
  [
    "Educação Inclusiva",
    "Educação & Pedagogia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/educacao-inclusiva",
    "gratuito",
    "Iniciante",
    "Você sabia que mais de 14 milhões de brasileiros vivem com algum tipo de deficiência? Esse número revela uma realidade que não pode ser ignorada: a diversidade está presente em nossas salas de aula, nas comunidades e em toda a sociedade. Este curso foi pensado para quem deseja compreender profundame"
  ],
  [
    "Empreendedorismo e Inovação",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/empreendedorismo-e-inovacao",
    "gratuito",
    "Iniciante",
    "Se pensarmos no empreendedorismo como a capacidade de criar soluções inovadoras e colocá-las em prática, veremos que ele sempre esteve presente na trajetória humana. Contudo, para alguns especialistas no assunto, o Século XXI vem sendo considerado como a “Era do Empreendedor”, que em muito difere do"
  ],
  [
    "Estratégia de Negócios",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/estrategia-de-negocios",
    "gratuito",
    "Iniciante",
    "Embora não tenha a intenção de esgotar o assunto, nosso curso apresenta pontos essenciais para ajudá-lo(a) a compreender a importância da estratégia para o mundo dos negócios. Na primeira parte do conteúdo, você descobrirá como surgiram as primeiras teorias modernas de administração –isso ainda no s"
  ],
  [
    "Ética na Era da IA",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/etica_IA",
    "gratuito",
    "Iniciante",
    "O curso Ética na Era da IA introduz reflexões sobre o que é ética e como seus princípios se relacionam com o uso da inteligência artificial. Por meio de um Webinário, ele destaca que ética vai além das obrigações legais, sendo guiada por valores e princípios morais, enquanto a lei trata de normas ju"
  ],
  [
    "Excel na Prática",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/excel-na-pratica",
    "gratuito",
    "Iniciante",
    "Este curso é perfeito para quem deseja elevar suas habilidades na criação de planilhas eficientes, realizar análises de dados complexas e automatizar tarefas no Excel, tornando suas atividades diárias mais produtivas e organizadas. Indicado tanto para iniciantes quanto para aqueles que já possuem al"
  ],
  [
    "FluêncIA em Inteligência Artificial",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/fluencia",
    "gratuito",
    "Iniciante",
    "Aprenda os fundamentos básicos da Inteligência Artificial (IA) Generativa de forma acessível e envolvente, desde a sua história até os conceitos essenciais. Explore suas aplicações da IA no dia a dia e em sua produtividade online. Conteúdo desenvolvido em parceria com a MICROSOFT, com vídeos gravado"
  ],
  [
    "Fundamentos de TI: Hardware e Software",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/fundamentos-de-ti-hardware-e-software",
    "gratuito",
    "Iniciante",
    "O objetivo deste curso é apresentar os conceitos básicos da informática, os componentes dos computadores, os sistemas lógicos e as principais funções de armazenamento e processamento que envolvem o poder computacional. Também serão abordados os sistemas operacionais e os princípios de segurança da i"
  ],
  [
    "IA na Prática: Como Dados bem Estruturados fazem a Diferença",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/IA_pratica",
    "gratuito",
    "Iniciante",
    "O curso, voltado preferencialmente para organizações do Terceiro Setor, apresenta conteúdos essenciais para a compreensão e aplicação de dados e inteligência artificial no contexto social. Ministrado por meio de Webinário, materiais de apoio e quizzes, ensina como utilizar a inteligência artificial"
  ],
  [
    "IA para Profissionais da Justiça",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/justica",
    "gratuito",
    "Iniciante",
    "Neste curso, o participante será introduzido às múltiplas possibilidades de aplicação da Inteligência Artificial (IA) no âmbito jurídico, de forma a ampliar a eficiência e a qualidade de sua atuação profissional. Ao longo das aulas, serão apresentados os benefícios da integração da IA aos processos"
  ],
  [
    "IA para profissionais do Direito",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/IA_Direito",
    "gratuito",
    "Iniciante",
    "O curso “IA para Profissionais do Direito” tem como objetivo preparar profissionais jurídicos para atuar de forma estratégica em um contexto de transformação digital impulsionado pela inteligência artificial. O conteúdo aborda o uso do Copilot na rotina do Direito, destacando como a automação de tar"
  ],
  [
    "IA para seu novo emprego: Do currículo à entrevista",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/iaempregos",
    "gratuito",
    "Iniciante",
    "O mercado de trabalho está mudando, e a Inteligência Artificial já é parte dessa transformação. Neste curso, você vai aprender a usar a IA de forma estratégica para conquistar uma vaga, mudar de carreira ou se destacar na função atual. Com exemplos práticos e linguagem acessível, você descobrirá com"
  ],
  [
    "Inteligência Artificial para Educadores",
    "Educação & Pedagogia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/iaeduc",
    "gratuito",
    "Iniciante",
    "Transforme sua prática pedagógica. Seja um educador preparado para o presente e protagonista do futuro! Este curso foi criado especialmente para professores que desejam explorar o poder da Inteligência Artificial de forma prática, acessível e inspiradora, aplicando suas ferramentas desde o planejame"
  ],
  [
    "Inteligência Artificial para Estudantes",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/iaestudantes",
    "gratuito",
    "Iniciante",
    "Vivemos em um mundo cada vez mais movido pela Inteligência Artificial e você pode estar à frente desse tempo. Neste curso, você vai aprender a integrar a IA ao seu dia a dia, aplicando-a desde tarefas simples até processos mais complexos, sem abrir mão da sua criatividade e do pensamento crítico. Co"
  ],
  [
    "Inteligência Artificial para ONGs",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/ONGS",
    "gratuito",
    "Iniciante",
    "O cursoInteligência Artificial para ONGsfoi criado especialmente para organizações que desejampotencializar sua atuação socialcom o uso estratégico, ético e acessível da IA. Se sua ONG buscaeficiência, inovação e sustentabilidade, este curso é para você. Ao longo de três módulos complementares, você"
  ],
  [
    "Inteligência Artificial para Pequenas e Médias Empresas",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/pmes",
    "gratuito",
    "Iniciante",
    "A inteligência artificial cada vez mais presente nos negócios, se torna essencial para quem busca aumentar a produtividade, reduzir os custos operacionais, otimizar fluxos de trabalho e personalizar preferências e comportamentos com objetivo de melhorar a satisfação dos clientes. Neste curso você ap"
  ],
  [
    "Introdução à Administração",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/introducao-a-administracao",
    "gratuito",
    "Iniciante",
    "Os primeiros textos dedicados à Administração Científica foram escritos no século XVIII. Desde então, diferentes Teorias Administrativas foram surgindo e passaram a usar métodos científicos, apropriando-se das técnicas de observação, apuração e experimentação, com o objetivo de melhorar os sistemas"
  ],
  [
    "Introdução à Análise de Dados - Microsoft Power BI",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/introducao-a-analise-de-dados-microsoft-power-bi",
    "gratuito",
    "Iniciante",
    "Neste curso, você conhecerá as principais atribuições de um analista de dados, suas habilidades, tarefas e processos com os quais ele trabalha e terá uma breve explanação teórica sobre a análise de dados. O Microsoft Power BI é uma coleção de serviços de software, aplicativos e conectores que funcio"
  ],
  [
    "Introdução à Gestão de Projetos",
    "Gestão & Negócios",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/introducao-a-gestao-de-projetos",
    "gratuito",
    "Iniciante",
    "O que se conhece genericamente como “Gerenciamento de Projetos” é, na prática, um conjunto de regras e de boas práticas estabelecidas para se realizar projetos da melhor forma possível, independentemente do tamanho e complexidade deles. Trata-se, portanto, de uma metodologia voltada para a eficiênci"
  ],
  [
    "Introdução ao Scratch: Linguagem de Programação na Computação Criativa",
    "Educação & Pedagogia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/introducao-ao-scratch-linguagem-de-programacao-na-computacao-criativa",
    "gratuito",
    "Iniciante",
    "A palavra \"scratch\"surgiu na cultura hip-hop e se refere ao movimento manual, feito pelos DJs, de girar discos de vinil para a frente e para trás, para modificar, mesclar e adaptar músicas e batidas, criando versões remixadas. Na computação, \"scratch\"refere-se a pedaços reutilizáveis de softwares, q"
  ],
  [
    "Língua Portuguesa sem Complicações",
    "Linguagens & Comunicação",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/lingua-portuguesa-sem-complicacoes",
    "gratuito",
    "Iniciante",
    "Este curso foi desenvolvido especialmente para você estudar os aspectos da língua portuguesa que mais causam dúvidas. Esperamos que você aprimore sua competência comunicativa, compreendendo as diferenças entre situações formais e informais e reconhecendo a norma culta como uma ferramenta essencial p"
  ],
  [
    "Linguagem de Programação Python - Básico",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/linguagem-de-programacao-python-basico",
    "gratuito",
    "Iniciante",
    "O objetivo deste curso é articular teoria e prática do raciocínio lógico por meio da Linguagem de Programação Python, desenvolvendo programas básicos em modo console, apresentando, de forma simples, a plataforma de desenvolvimento PyCharm. A linguagem de programação Python vem crescendo muito nos úl"
  ],
  [
    "Microsoft Excel 2016 - Avançado",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-excel-2016-avancado",
    "gratuito",
    "Avançado",
    "Nos cursos de Excel 2016 Básico e Intermediário, você aprendeu sobre diversos recursos desse aplicativo que, com certeza, o auxiliaram a otimizar suas planilhas eletrônicas. Neste curso, você conhecerá novos recursos, como nome (utilizado em células com fórmulas), subtotal, filtro avançado, importaç"
  ],
  [
    "Microsoft Excel 2016 - Básico",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-excel-2016-basico",
    "gratuito",
    "Iniciante",
    "O Excel é um dos mais famosos e utilizados aplicativos de planilhas eletrônicas do mundo! Neste curso introdutório serão abordados temas, como formatação de planilhas e de gráficos, classificação de dados e aplicação de fórmulas e funções. Se você precisa dar os primeiros passos no uso de uma ferram"
  ],
  [
    "Microsoft Excel 2016 - Intermediário",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-excel-2016-intermediario",
    "gratuito",
    "Intermediário",
    "O Excel é um dos mais famosos e utilizados aplicativos de planilhas eletrônicas do mundo! O Excel 2016, que integra o Pacote Office 2016, foi lançado no segundo semestre de 2015 com o Windows 10 e trouxe novas e poderosas funcionalidades. Neste curso você aprenderá a criar modelos de pastas de traba"
  ],
  [
    "Microsoft Office 365 - Conhecendo o OneDrive",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-office-365-conhecendo-o-onedrive",
    "gratuito",
    "Iniciante",
    "O Office 365 é uma coleção de aplicativos da Microsoft que reúne as melhores ferramentas para as pessoas trabalharem de forma colaborativa e produtiva. Este conteúdo é composto de sete vídeos, nos quais você aprenderá algumas funcionalidades da ferramenta OneDrive, para que possa trabalhar, de manei"
  ],
  [
    "Microsoft Office 365 - Conhecendo o OneNote",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-office-365-conhecendo-o-onenote",
    "gratuito",
    "Iniciante",
    "O Office 365 é uma coleção de aplicativos da Microsoft que reúne as melhores ferramentas para as pessoas trabalharem de forma colaborativa e produtiva. Este conteúdo é composto de sete vídeos, nos quais você aprenderá algumas funcionalidades da ferramenta OneNote, para que possa trabalhar, de maneir"
  ],
  [
    "Microsoft Office 365 - Conhecendo o Outlook",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-office-365-conhecendo-o-outlook",
    "gratuito",
    "Iniciante",
    "O Office 365 é uma coleção de aplicativos da Microsoft que reúne as melhores ferramentas para as pessoas trabalharem de forma colaborativa e produtiva. Este conteúdo é composto de sete vídeos, nos quais você aprenderá algumas funcionalidades da ferramentaOutlook, para que possa trabalhar, de maneira"
  ],
  [
    "Microsoft Office 365 - Conhecendo o Planner",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-office-365-conhecendo-o-planner",
    "gratuito",
    "Iniciante",
    "O Office 365 é uma coleção de aplicativos da Microsoft que reúne as melhores ferramentas para as pessoas trabalharem de forma colaborativa e produtiva. Este conteúdo é composto de sete vídeos, nos quais você aprenderá algumas funcionalidades da ferramenta Planner, para que possa trabalhar, de maneir"
  ],
  [
    "Microsoft Office 365 - Conhecendo o Teams",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-office-365-conhecendo-o-teams",
    "gratuito",
    "Iniciante",
    "O Office 365 é uma coleção de aplicativos da Microsoft que reúne as melhores ferramentas para as pessoas trabalharem de forma colaborativa e produtiva. Este curso é composto de sete vídeos, nos quais você aprenderá algumas funcionalidades da ferramenta Teams, para que possa trabalhar, de maneira efi"
  ],
  [
    "Microsoft PowerPoint 2016 - Avançado",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-powerpoint-2016-avancado",
    "gratuito",
    "Avançado",
    "Neste curso, você conhecerá novos elementos e as funções disponíveis para enriquecer ainda mais as suas apresentações! Este curso está organizado em quatro módulos. O primeiro, aborda o uso de objetos gráficos, como o SmartArt, a utilização de vídeos, sons, entre outros elementos. No segundo módulo,"
  ],
  [
    "Microsoft PowerPoint 2016 - Básico",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-powerpoint-2016-basico",
    "gratuito",
    "Iniciante",
    "Neste curso você encontrará atividades importantes para aprimorar seus conhecimentos sobre o PowerPoint! Você pode criar, editar e gerenciar apresentações trabalhando com elementos gráficos, como imagens de arquivo, imagens do clip-art, formas e ferramentas, que o(a) auxiliarão na localização e revi"
  ],
  [
    "Microsoft Word 2016 - Avançado",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-word-2016-avancado",
    "gratuito",
    "Avançado",
    "Nos cursos MicrosoftWord 2016 - Básico eMicrosoftWord 2016 - Intermediário você teve uma visão dos principais recursos do aplicativo, como comandos, guias e formatações fundamentais que o(a) auxiliaram a trabalhar com imagens, tabelas, entre outros elementos gráficos. Além disso, você aprendeu a enr"
  ],
  [
    "Microsoft Word 2016 - Básico",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-word-2016-basico",
    "gratuito",
    "Iniciante",
    "Neste curso, você encontrará informações importantes para aprimorar seus conhecimentos sobre o Word, que é o editor de textos da Microsoft! Com o Word, você pode criar qualquer tipo de documento que envolva textos, quadrinhos, revistas, panfletos, jornais, etc. Além disso, você pode enriquecer o seu"
  ],
  [
    "Microsoft Word 2016 - Intermediário",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/microsoft-word-2016-intermediario",
    "gratuito",
    "Intermediário",
    "No curso básico, você teve uma visão dos principais comandos, guias e formatações fundamentais. Agora, neste curso, aprofundaremos alguns aspectos que podem tornar seu documento ainda mais completo! Você conhecerá novos elementos e funções disponíveis. Trabalhará com imagens, tabelas e aprenderá a f"
  ],
  [
    "Organização Pessoal",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/organizacao-pessoal",
    "gratuito",
    "Iniciante",
    "Você é do tipo que se atrasa com frequência para compromissos ou, então, que tenta resolver mil atividades ao mesmo tempo, e, no fim, descobre que acabou esquecendo de realizar tarefas importantes, com prazos pré-determinados? A vida de quem é desorganizado não é fácil, sem contar o tempo que se per"
  ],
  [
    "Postura e Imagem Profissional",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/postura-e-imagem-profissional",
    "gratuito",
    "Iniciante",
    "O objetivo deste curso é apresentar a importância da imagem no ambiente profissional, com base nas principais práticas do mercado e com foco em Psicologia Organizacional, Administração, Gestão de Pessoas, Coaching e Projetos. Você poderá construir um novo olhar entre a questão da imagem, postura e c"
  ],
  [
    "PowerPoint na Prática",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/powerpoint-na-pratica",
    "gratuito",
    "Iniciante",
    "O curso de PowerPoint é indicado para que quem deseja desenvolver habilidades para criar apresentações impactantes e relevantes. Com sua interface intuitiva, você será capaz de criar apresentações personalizadas para suas palestras, seminários, reuniões, projetos e trabalhos acadêmicos. Matricule-se"
  ],
  [
    "Processo de Julgamento e Tomada de Decisões Responsáveis",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/Processo-Julgamento-Decisoes-responsaveis",
    "gratuito",
    "Iniciante",
    "No seu dia a dia, você precisa tomar muitas decisões, e para tomá-las usará dois sistemas cerebrais: o automático e o elaborado. O curso apresenta os conceitos desses dois sistemas, como eles se diferem quando estão em ação nas mais diversas situações. Além disso, o curso procura trazer subsídios pa"
  ],
  [
    "Regulação da Preocupação e da Ansiedade",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/regulacao-da-preocupacao-e-da-ansiedade",
    "gratuito",
    "Iniciante",
    "Será que é possível manejar preocupação, ansiedade ou seremos sempre reféns dessas emoções? A ciência vem trazendo boas notícias. Sim, é possível lidar com essas emoções! E o primeiro passo para conseguir fazer isso é entender como elas nascem, o que elas significam e como o nosso cérebro reforça e"
  ],
  [
    "Resiliência",
    "Desenvolvimento Pessoal",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/resiliencia",
    "gratuito",
    "Iniciante",
    "Quando lemos reportagens que falam sobre as características desejáveis para os profissionais do século 21, é muito comum que a resiliência esteja em primeiro lugar. Mas você sabe o que é resiliência? Resiliência é a capacidade de enfrentar e superar as adversidades e, mais do que isso, a capacidade"
  ],
  [
    "Scratch, suas extensões e computação física",
    "Educação & Pedagogia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/scratch-suas-extensoes-e-computacao-fisica",
    "gratuito",
    "Iniciante",
    "Este curso aborda uma introdução à computação física e possibilidades de uso com as extensões do ambiente de programação Scratch, que permitem criações fantásticas em diversos projetos. Quando se fala em programação física, é comum a relação que se faz com a robótica, mas elas não são sinônimas. A c"
  ],
  [
    "Soluções de IA no GitHub",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/github",
    "gratuito",
    "Iniciante",
    "O GitHub é uma plataforma baseada em nuvem que utiliza o Git, um sistema de controle de versão distribuído como núcleo. A plataforma simplifica o processo de colaboração em projetos e fornece um site, ferramentas de linha de comando e um fluxo geral que permite que desenvolvedores e usuários trabalh"
  ],
  [
    "Word na Prática",
    "Tecnologia",
    "Fundação Bradesco (Escola Virtual)",
    "https://www.ev.org.br/cursos/word-na-pratica",
    "gratuito",
    "Iniciante",
    "Este curso é a oportunidade perfeita para aprimorar suas habilidades de edição de textos e criar documentos que realmente se destacam. Com o Microsoft Word, você poderá criar, editar e formatar textos para diversas finalidades, seja no meio acadêmico, em escritórios ou para uso doméstico. Aprenda a"
  ],
  [
    "Introdução à Ciência da Computação (CS50)",
    "Tecnologia",
    "Harvard / edX",
    "https://cs50.harvard.edu/x/",
    "gratuito",
    "Iniciante",
    "O curso de introdução à programação mais famoso do mundo, ensinando C, Python, SQL e algoritmos com acesso livre."
  ],
  [
    "Introdução à Inteligência Artificial com Python (CS50 AI)",
    "Tecnologia",
    "Harvard / edX",
    "https://cs50.harvard.edu/ai/",
    "gratuito",
    "Intermediário",
    "Conceitos e algoritmos que orientam a inteligência artificial moderna e aprendizado de máquina."
  ],
  [
    "Desenvolvimento Web com Python e JS (CS50 Web)",
    "Tecnologia",
    "Harvard / edX",
    "https://cs50.harvard.edu/web/",
    "gratuito",
    "Intermediário",
    "Criação de aplicações web modernas, APIs REST, bancos de dados e interfaces reativas."
  ],
  [
    "Álgebra Linear Aberta",
    "Matemática",
    "MIT OpenCourseWare",
    "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
    "cc-by-nc-sa",
    "Intermediário",
    "Curso completo de Álgebra Linear do MIT pelo Prof. Gilbert Strang com videoaulas, listas e notas."
  ],
  [
    "Cálculo de Uma Variável",
    "Matemática",
    "MIT OpenCourseWare",
    "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/",
    "cc-by-nc-sa",
    "Intermediário",
    "Diferenciação, integração e aplicações de cálculo diferencial e integral com material didático completo."
  ],
  [
    "Introdução à Física Mecânica",
    "Ciências Exatas",
    "MIT OpenCourseWare",
    "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/",
    "cc-by-nc-sa",
    "Intermediário",
    "Fundamentos de mecânica clássica, leis de Newton, cinemática e conservação de energia."
  ],
  [
    "Introdução aos Algoritmos",
    "Tecnologia",
    "MIT OpenCourseWare",
    "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    "cc-by-nc-sa",
    "Avançado",
    "Ordenação, árvores de busca balanceadas, hashing, algoritmos em grafos e programação dinâmica."
  ],
  [
    "Princípios de Microeconomia",
    "Ciências Humanas",
    "MIT OpenCourseWare",
    "https://ocw.mit.edu/courses/14-01sc-principles-of-microeconomics-fall-2011/",
    "cc-by-nc-sa",
    "Intermediário",
    "Mercados competitivos, oferta e demanda, eficiência econômica, monopólio e políticas públicas."
  ],
  [
    "Introdução à Psicologia e Neurociência",
    "Ciências Humanas",
    "MIT OpenCourseWare",
    "https://ocw.mit.edu/courses/9-00sc-introduction-to-psychology-fall-2011/",
    "cc-by-nc-sa",
    "Intermediário",
    "Bases cerebrais do comportamento, percepção visual, memória, cognição e psicologia social."
  ],
  [
    "História do Brasil e Formação Social",
    "Ciências Humanas",
    "Khan Academy Brasil",
    "https://pt.khanacademy.org/humanities/historia-do-brasil",
    "cc-by-nc-sa",
    "Iniciante",
    "Aulas interativas e exercícios cobrindo do período colonial à redemocratização brasileira."
  ],
  [
    "Álgebra para Ensino Médio",
    "Matemática",
    "Khan Academy Brasil",
    "https://pt.khanacademy.org/math/algebra",
    "cc-by-nc-sa",
    "Iniciante",
    "Progressão guiada em equações de 1º e 2º grau, funções exponenciais, polinômios e gráficos."
  ],
  [
    "Gramática e Compreensão da Língua Portuguesa",
    "Linguagens & Comunicação",
    "Khan Academy Brasil",
    "https://pt.khanacademy.org/humanities/gramatica-da-lingua-portuguesa",
    "cc-by-nc-sa",
    "Iniciante",
    "Morfologia, sintaxe, concordância, regência e análise textual com exercícios práticos e feedback imediato."
  ],
  [
    "Biologia 2ª Edição (OpenStax)",
    "Ciências Biológicas",
    "OpenStax",
    "https://openstax.org/details/books/biology-2e",
    "cc-by",
    "Ensino Médio e Superior",
    "Livro didático aberto revisado por pares cobrindo biologia celular, genética, evolução e ecologia."
  ],
  [
    "Química Geral 2ª Edição (OpenStax)",
    "Ciências Exatas",
    "OpenStax",
    "https://openstax.org/details/books/chemistry-2e",
    "cc-by",
    "Ensino Médio e Superior",
    "Termodinâmica, cinética química, soluções, ligações atômicas e reações em formato aberto e gratuito."
  ],
  [
    "Psicologia 2ª Edição (OpenStax)",
    "Ciências Humanas",
    "OpenStax",
    "https://openstax.org/details/books/psychology-2e",
    "cc-by",
    "Ensino Superior",
    "Fundamentos teóricos e experimentais da psicologia contemporânea, biopsicologia e desenvolvimento humano."
  ],
  [
    "Estatística Introdutória 2ª Edição (OpenStax)",
    "Matemática",
    "OpenStax",
    "https://openstax.org/details/books/introductory-statistics-2e",
    "cc-by",
    "Ensino Médio e Superior",
    "Amostragem, medidas de dispersão, probabilidade, distribuições e testes de hipóteses estatísticas."
  ],
  [
    "Kit de Construção de Circuitos DC",
    "Ciências Exatas",
    "PhET Interactive Simulations",
    "https://phet.colorado.edu/pt_BR/simulations/circuit-construction-kit-dc",
    "cc-by",
    "Iniciante",
    "Laboratório virtual interativo para montagem de circuitos elétricos com resistores, lâmpadas, chaves e baterias."
  ],
  [
    "Forças e Movimento: Fundamentos",
    "Ciências Exatas",
    "PhET Interactive Simulations",
    "https://phet.colorado.edu/pt_BR/simulations/forces-and-motion-basics",
    "cc-by",
    "Iniciante",
    "Simulação interativa sobre atrito, força resultante, aceleração e movimento de corpos."
  ],
  [
    "Construa um Átomo Interativo",
    "Ciências Exatas",
    "PhET Interactive Simulations",
    "https://phet.colorado.edu/pt_BR/simulations/build-an-atom",
    "cc-by",
    "Iniciante",
    "Monte átomos a partir de prótons, nêutrons e elétrons e descubra número atômico, massa e carga elétrica."
  ],
  [
    "Simulação de Seleção Natural e Genética",
    "Ciências Biológicas",
    "PhET Interactive Simulations",
    "https://phet.colorado.edu/pt_BR/simulations/natural-selection",
    "cc-by",
    "Iniciante",
    "Explore a evolução das espécies e adaptações genéticas através de mutações e pressões ambientais."
  ],
  [
    "Cidadão Ciberseguro: Fundamentos de Segurança Digital",
    "Tecnologia",
    "NAU (Portugal)",
    "https://www.nau.edu.pt/pt/curso/cidadao-ciberseguro/",
    "gratuito",
    "Iniciante",
    "Boas práticas de segurança da informação, privacidade online, senhas fortes e prevenção contra phishing."
  ],
  [
    "Elementos de Inteligência Artificial",
    "Tecnologia",
    "NAU (Portugal)",
    "https://www.nau.edu.pt/pt/curso/elementos-de-ia/",
    "gratuito",
    "Iniciante",
    "Curso aberto e acessível sobre os princípios e impactos da inteligência artificial na sociedade moderna."
  ],
  [
    "Aprender a Empreender: Primeiros Passos de Negócio",
    "Gestão & Negócios",
    "Sebrae Educação",
    "https://sebrae.com.br/sites/PortalSebrae/cursosonline/aprender-a-empreender,9454b8a6a2862410VgnVCM100000b272010aRCRD",
    "gratuito",
    "Iniciante",
    "Desenvolvimento de atitudes empreendedoras, plano de negócios, mercado consumidor e finanças básicas."
  ],
  [
    "Biologia Celular e Organelas",
    "Ciências Biológicas",
    "CK-12 Foundation",
    "https://www.ck12.org/biology/",
    "cc-by-nc",
    "Ensino Médio",
    "Estudo modular da estrutura celular, divisão celular, mitose e metabolismo energético."
  ],
  [
    "Geometria e Teoremas Fundamentais",
    "Matemática",
    "CK-12 Foundation",
    "https://www.ck12.org/geometry/",
    "cc-by-nc",
    "Ensino Médio",
    "Propriedades de triângulos, círculos, polígonos, trigonometria e demonstrações geométricas."
  ],

  // ==================== Trilha Info (flaviojmendes / GitHub) ====================
  [
    "Trilha Info: Formação Desenvolvedor Frontend",
    "Tecnologia",
    "Trilha Info (Flávio Mendes / GitHub)",
    "https://trilha.info/roadmap/frontend",
    "gratuito",
    "Iniciante",
    "Roteiro interativo aberto para formação Frontend cobrindo HTML, CSS, JavaScript, React, acessibilidade e performance web."
  ],
  [
    "Trilha Info: Formação Desenvolvedor Backend",
    "Tecnologia",
    "Trilha Info (Flávio Mendes / GitHub)",
    "https://trilha.info/roadmap/backend",
    "gratuito",
    "Intermediário",
    "Trilha aberta de estudos para Backend: arquitetura REST, microsserviços, mensageria, modelagem de banco de dados e segurança."
  ],
  [
    "Trilha Info: Formação Engenheiro DevOps",
    "Tecnologia",
    "Trilha Info (Flávio Mendes / GitHub)",
    "https://trilha.info/roadmap/devops",
    "gratuito",
    "Intermediário",
    "Guia estruturado cobrindo Linux, containers Docker, orquestração com Kubernetes, automação CI/CD e infraestrutura como código."
  ],
  [
    "Trilha Info: Engenharia de Dados & Big Data",
    "Tecnologia",
    "Trilha Info (Flávio Mendes / GitHub)",
    "https://trilha.info/roadmap/data-engineer",
    "gratuito",
    "Avançado",
    "Trilha aberta para engenharia de dados: pipelines distribuídos, Data Lakes, Apache Spark, Airflow, governança e streaming."
  ],
  [
    "Trilha Info: Testes de Software & Garantia de Qualidade (QA)",
    "Tecnologia",
    "Trilha Info (Flávio Mendes / GitHub)",
    "https://trilha.info/roadmap/test",
    "gratuito",
    "Intermediário",
    "Formação em pirâmide de testes, automação de testes E2E, testes unitários, Cypress, Selenium e boas práticas de QA."
  ],
  [
    "Trilha Info: Formação Full Stack Developer",
    "Tecnologia",
    "Trilha Info (Flávio Mendes / GitHub)",
    "https://trilha.info/roadmap/fullstack",
    "gratuito",
    "Intermediário",
    "Caminho completo conectando desenvolvimento de interfaces com APIs, bancos de dados, deploys em nuvem e arquitetura web."
  ],
  [
    "Trilha Info: Formação Especialista React",
    "Tecnologia",
    "Trilha Info (Flávio Mendes / GitHub)",
    "https://trilha.info/roadmap/react",
    "gratuito",
    "Intermediário",
    "Trilha especializada no ecossistema React: Hooks, gerenciamento de estado global, Next.js, Server Components e ecossistema moderno."
  ],
  [
    "Trilha Info: Preparação para Entrevistas Técnicas",
    "Tecnologia",
    "Trilha Info (Flávio Mendes / GitHub)",
    "https://trilha.info/roadmap/entrevistas",
    "gratuito",
    "Iniciante",
    "Guia estratégico para estudantes e desenvolvedores: algoritmos, live coding, perguntas comportamentais e testes práticos."
  ],

  // ==================== NOVOS CURSOS GUIA DE TI / YOUTUBE (CERTIFICAÇÃO GRATUITA) ====================
  [
    "Curso de Git e GitHub do Básico ao Avançado",
    "Tecnologia",
    "Guia de TI / YouTube (Curso em Vídeo)",
    "https://guiadeti.com.br/cursos/curso-de-git-e-github-do-basico-ao-avancado/",
    "gratuito",
    "Iniciante",
    "Controle de versão no YouTube com certificação gratuita. Branches, merges, pull requests, commits e fluxo de trabalho Git Flow."
  ],
  [
    "Curso de Docker e Containers para Desenvolvedores",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-docker-e-containers/",
    "gratuito",
    "Intermediário",
    "Aulas completas de Docker no YouTube com certificação gratuita. Dockerfile, Docker Compose, redes, volumes e orquestração leve."
  ],
  [
    "Curso de Kubernetes na Prática",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-kubernetes-na-pratica/",
    "gratuito",
    "Avançado",
    "Orquestração de microsserviços no YouTube com certificação gratuita. Pods, Deployments, Services, Ingress e Helm."
  ],
  [
    "Curso de SQL e Modelagem de Banco de Dados Relacional",
    "Tecnologia",
    "Guia de TI / YouTube (Hashtag Treinamentos)",
    "https://guiadeti.com.br/cursos/curso-de-sql-e-modelagem-de-dados/",
    "gratuito",
    "Iniciante",
    "Aulas no YouTube com certificação gratuita. Consultas SQL, JOINs, agregações, normalização e modelagem relacional de dados."
  ],
  [
    "Curso de Next.js 14 e React Server Components",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-nextjs-14/",
    "gratuito",
    "Intermediário",
    "Desenvolvimento full stack moderno no YouTube com certificação gratuita. SSR, App Router, Server Actions e rotas de API."
  ],
  [
    "Curso de Go (Golang): Do Zero ao Primeiro Microserviço",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-go-golang/",
    "gratuito",
    "Iniciante",
    "Linguagem Go no YouTube com certificação gratuita. Goroutines, Channels, structs, ponteiros e criação de microserviços rápidos."
  ],
  [
    "Curso de Cibersegurança & Segurança da Informação",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-ciberseguranca-fundamentos/",
    "gratuito",
    "Iniciante",
    "Conceitos de segurança digital no YouTube com certificação gratuita. Criptografia, ataques comuns, defesa de redes e boas práticas."
  ],
  [
    "Curso de Rust: Fundamentos e Concorrência Segura",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-rust-fundamentos/",
    "gratuito",
    "Intermediário",
    "Linguagem Rust no YouTube com certificação gratuita. Gerenciamento de memória com Ownership e Borrowing, traits e alta performance."
  ],
  [
    "Curso de Engenharia de Prompts e Agentes de IA com LangChain",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-de-engenharia-de-prompts-e-langchain/",
    "gratuito",
    "Intermediário",
    "Aplicações com modelos LLM no YouTube com certificação gratuita. Técnicas de prompt, arquitetura RAG e agentes autônomos."
  ],
  [
    "Curso de AWS Cloud Practitioner: Arquitetura em Nuvem",
    "Tecnologia",
    "Guia de TI / YouTube",
    "https://guiadeti.com.br/cursos/curso-aws-cloud-practitioner/",
    "gratuito",
    "Iniciante",
    "Fundamentos de computação em nuvem AWS no YouTube com certificação gratuita. EC2, S3, IAM, VPC e serviços essenciais."
  ],

  // ==================== USP (UNIVERSIDADE DE SÃO PAULO) ====================
  [
    "USP: Introdução à Ciência da Computação com Python Parte 1",
    "Tecnologia",
    "USP (Universidade de São Paulo)",
    "https://www.coursera.org/learn/ciencia-computacao-python-conceitos",
    "gratuito",
    "Iniciante",
    "Curso universitário oficial do IME-USP. Fundamentos da computação, variáveis, comandos condicionais e pensamento algorítmico."
  ],
  [
    "USP: Introdução à Ciência da Computação com Python Parte 2",
    "Tecnologia",
    "USP (Universidade de São Paulo)",
    "https://www.coursera.org/learn/python-computacao-desenvolvimento-software",
    "gratuito",
    "Intermediário",
    "Continuação oficial do IME-USP: matrizes, recursão, busca, ordenação de dados e complexidade de algoritmos."
  ],
  [
    "USP: Criação de Startups Tecnológicas",
    "Gestão & Negócios",
    "USP (Universidade de São Paulo)",
    "https://www.coursera.org/learn/startups",
    "gratuito",
    "Iniciante",
    "Metodologias de inovação, validação de mercado, modelo de negócios e captação de investimento do ecossistema USP."
  ],
  [
    "USP: Econometria Básica Aplicada",
    "Ciências Exatas",
    "USP (Universidade de São Paulo)",
    "https://www.coursera.org/learn/econometria-basica-aplicada",
    "gratuito",
    "Intermediário",
    "Regressão linear simples e múltipla, testes de hipóteses e modelagem estatística aplicada pela FEA-USP."
  ],

  // ==================== EV.G (ESCOLA VIRTUAL DE GOVERNO / ENAP) ====================
  [
    "EV.G: Introdução à Lei Geral de Proteção de Dados Pessoais (LGPD)",
    "Gestão & Negócios",
    "Escola Virtual de Governo (EV.G / ENAP)",
    "https://www.escolavirtual.gov.br/curso/317",
    "gratuito",
    "Iniciante",
    "Capacitação oficial sobre a LGPD: direitos dos titulares, bases legais, responsabilidades e governança com certificação gratuita."
  ],
  [
    "EV.G: Ciência de Dados Aplicada a Políticas Públicas",
    "Tecnologia",
    "Escola Virtual de Governo (EV.G / ENAP)",
    "https://www.escolavirtual.gov.br/curso/341",
    "gratuito",
    "Intermediário",
    "Coleta, tratamento, visualização de dados públicos e evidências estatísticas para tomada de decisão com certificação gratuita."
  ],
  [
    "EV.G: Gestão Ágil e Estratégia com OKRs",
    "Gestão & Negócios",
    "Escola Virtual de Governo (EV.G / ENAP)",
    "https://www.escolavirtual.gov.br/curso/380",
    "gratuito",
    "Iniciante",
    "Planejamento e acompanhamento ágil de metas estratégicas com alinhamento de equipes e indicadores com certificação gratuita."
  ],
  [
    "EV.G: Acessibilidade Digital e Design Universal na Web",
    "Tecnologia",
    "Escola Virtual de Governo (EV.G / ENAP)",
    "https://www.escolavirtual.gov.br/curso/383",
    "gratuito",
    "Iniciante",
    "Diretrizes de acessibilidade WCAG, tecnologias assistivas e inclusão digital na web com certificação gratuita."
  ],
  [
    "EV.G: Ética, Integridade e Prevenção à Corrupção",
    "Desenvolvimento Pessoal",
    "Escola Virtual de Governo (EV.G / ENAP)",
    "https://www.escolavirtual.gov.br/curso/294",
    "gratuito",
    "Iniciante",
    "Formação cidadã em transparência pública, dilemas éticos e conformidade institucional com certificação gratuita oficial."
  ],

  // ==================== INSTITUTO FEDERAL (IFRS - MUNDI) ====================
  [
    "IFRS: Lógica de Programação e Algoritmos",
    "Tecnologia",
    "Instituto Federal (IFRS)",
    "https://moodle.ifrs.edu.br/course/view.php?id=5815",
    "gratuito",
    "Iniciante",
    "Curso aberto do Instituto Federal: exercícios práticos de lógica, estruturas condicionais e laços com certificação gratuita."
  ],
  [
    "IFRS: Programação Básica com Java",
    "Tecnologia",
    "Instituto Federal (IFRS)",
    "https://moodle.ifrs.edu.br/course/view.php?id=5816",
    "gratuito",
    "Iniciante",
    "Orientação a objetos, classes, métodos e boas práticas na linguagem Java com emissão de certificação gratuita pelo IFRS."
  ],
  [
    "IFRS: Redes de Computadores: Fundamentos e Topologias",
    "Tecnologia",
    "Instituto Federal (IFRS)",
    "https://moodle.ifrs.edu.br/course/view.php?id=5817",
    "gratuito",
    "Iniciante",
    "Arquitetura TCP/IP, camadas de rede, cabeamento estruturado e protocolos de comunicação com certificação gratuita."
  ],
  [
    "IFRS: Gestão de Projetos e Inovação",
    "Gestão & Negócios",
    "Instituto Federal (IFRS)",
    "https://moodle.ifrs.edu.br/course/view.php?id=5818",
    "gratuito",
    "Iniciante",
    "Ciclo de vida de projetos, escopo, cronograma, riscos e introdução às metodologias ágeis com certificação gratuita."
  ],

  // ==================== HARVARD & MIT (OER INTERNACIONAL) ====================
  [
    "Harvard: CS50's Introduction to Cybersecurity",
    "Tecnologia",
    "Harvard / edX",
    "https://cs50.harvard.edu/cybersecurity/",
    "gratuito",
    "Iniciante",
    "Curso aberto da Universidade de Harvard cobrindo segurança defensiva, autenticação segura, criptografia e proteção de dados."
  ],
  [
    "MIT: Introduction to Computer Science and Programming Using Python (6.0001)",
    "Tecnologia",
    "MIT OpenCourseWare",
    "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
    "gratuito",
    "Iniciante",
    "Curso introdutório do Massachusetts Institute of Technology sobre computação e estruturas fundamentais em Python."
  ],

  // ==================== DIO (DIGITAL INNOVATION ONE) ====================
  [
    "Lógica de Programação Essencial (DIO Free)",
    "Tecnologia",
    "DIO (Digital Innovation One)",
    "https://web.dio.me/course/logica-de-programacao-essencial/",
    "gratuito",
    "Iniciante",
    "Formação gratuita da DIO cobrindo algoritmos, variáveis, operadores lógicos e estruturas condicionais com certificação gratuita."
  ],
  [
    "Introdução ao Git e GitHub (DIO Free)",
    "Tecnologia",
    "DIO (Digital Innovation One)",
    "https://web.dio.me/course/introducao-ao-git-e-ao-github/",
    "gratuito",
    "Iniciante",
    "Controle de versão, commits, branches, pull requests e colaboração em repositórios abertos no GitHub com certificado gratuito da DIO."
  ],
  [
    "Fundamentos de IA Generativa e Prompts (DIO Free)",
    "Tecnologia",
    "DIO (Digital Innovation One)",
    "https://web.dio.me/course/fundamentos-de-ia-generativa/",
    "gratuito",
    "Iniciante",
    "Conceitos de inteligência artificial generativa, engenharia de prompts e aplicações práticas com certificado gratuito oficial."
  ],
  [
    "Linux Fundamentals e Linha de Comando (DIO Free)",
    "Tecnologia",
    "DIO (Digital Innovation One)",
    "https://web.dio.me/course/cloud-and-linux-fundamentals/",
    "gratuito",
    "Iniciante",
    "Comandos fundamentais de terminal Linux, permissões de arquivos e administração básica de servidores com certificado."
  ],

  // ==================== ALURA (CURSOS E IMERSÕES GRATUITAS) ====================
  [
    "Iniciando em Programação com JavaScript e HTML (Alura Free)",
    "Tecnologia",
    "Alura Cursos Abertos",
    "https://www.alura.com.br/artigos/como-comecar-com-programacao",
    "gratuito",
    "Iniciante",
    "Guia e aulas abertas da Alura para primeiros passos no desenvolvimento de software e lógica prática."
  ],
  [
    "Imersão Dados e Inteligência Artificial (Alura)",
    "Tecnologia",
    "Alura Cursos Abertos",
    "https://www.alura.com.br/imersao-dados",
    "gratuito",
    "Iniciante",
    "Imersão gratuita da Alura sobre análise de dados, Python para dados, visualização gráfica e fundamentos de machine learning."
  ],
  [
    "Carreira Tech e Primeiros Passos em Tecnologia (Alura)",
    "Tecnologia",
    "Alura Cursos Abertos",
    "https://www.alura.com.br/artigos/carreira-em-tecnologia",
    "gratuito",
    "Iniciante",
    "Formação de orientação vocacional, transição de carreira e áreas técnicas da Alura."
  ],

  // ==================== CURSOS USP, FIOCRUZ & IFRS (NÃO-TECH / INTERDISCIPLINAR) ====================
  [
    "Comunicação Escrita e Redação Corporativa",
    "Linguagens & Comunicação",
    "Fundação Bradesco",
    "https://www.ev.org.br/cursos/comunicacao-escrita",
    "gratuito",
    "Iniciante",
    "Técnicas de clareza textual, pontuação, coerência e estruturação de mensagens profissionais com certificação gratuita."
  ],
  [
    "Leitura, Produção e Interpretação de Textos",
    "Linguagens & Comunicação",
    "Instituto Federal (IFRS)",
    "https://moodle.ifrs.edu.br/course/view.php?id=1214",
    "gratuito",
    "Iniciante",
    "Gêneros textuais, estratégias de leitura crítica e produção de textos acadêmicos com certificado gratuito."
  ],
  [
    "História do Brasil Colonial e Imperial",
    "Ciências Humanas",
    "Cursos USP / e-Aulas",
    "https://eaulas.usp.br/portal/course.action?course=1234",
    "gratuito",
    "Ensino Médio e Superior",
    "Aulas abertas da Universidade de São Paulo (USP) analisando os ciclos econômicos, a formação social e o processo de independência do Brasil."
  ],
  [
    "Introdução à Filosofia e Ética Contemporânea",
    "Ciências Humanas",
    "Cursos USP / e-Aulas",
    "https://eaulas.usp.br/portal/course.action?course=5678",
    "gratuito",
    "Iniciante",
    "Fundamentos filosóficos, ética aristotélica, iluminismo e dilemas morais da sociedade contemporânea em aulas abertas da USP."
  ],
  [
    "Sociologia das Relações Étnico-Raciais",
    "Ciências Humanas",
    "Instituto Federal (IFRS)",
    "https://moodle.ifrs.edu.br/course/view.php?id=3021",
    "gratuito",
    "Iniciante",
    "Estudo das dinâmicas étnico-raciais, história afro-brasileira e direitos humanos com certificação gratuita do IFRS."
  ],
  [
    "Biodiversidade e Conservação Ambiental",
    "Ciências Biológicas",
    "Cursos USP / e-Aulas",
    "https://eaulas.usp.br/portal/course.action?course=3456",
    "gratuito",
    "Iniciante",
    "Ecologia, biomas tropicais, cadeias tróficas e preservação ambiental em aulas abertas do Instituto de Biociências da USP."
  ],
  [
    "Saúde Pública e Epidemiologia Comunitária",
    "Ciências Biológicas",
    "Fiocruz / Campus Virtual",
    "https://campusvirtual.fiocruz.br/gestor/hotsite/epidemiologia",
    "gratuito",
    "Iniciante",
    "Conceitos fundamentais do Sistema Único de Saúde (SUS), vigilância em saúde e prevenção de endemias pela Fundação Oswaldo Cruz (Fiocruz)."
  ],
  [
    "Biologia Celular e Molecular Básica",
    "Ciências Biológicas",
    "Cursos USP / e-Aulas",
    "https://eaulas.usp.br/portal/course.action?course=7890",
    "gratuito",
    "Iniciante",
    "Estrutura celular, organelas, replicação do DNA e síntese proteica em curso aberto da USP."
  ],
  [
    "Cálculo Diferencial e Integral I",
    "Matemática",
    "Cursos USP / Univesp",
    "https://eaulas.usp.br/portal/course.action?course=1012",
    "gratuito",
    "Superior",
    "Limites, derivadas, regras de derivação e aplicações geométricas e físicas ministradas por professores do IME-USP."
  ],
  [
    "Estatística Básica Aplicada e Probabilidade",
    "Matemática",
    "Fundação Bradesco",
    "https://www.ev.org.br/cursos/estatistica-aplicada",
    "gratuito",
    "Iniciante",
    "Coleta de dados, tabelas de frequência, média, mediana, desvio padrão e análise descritiva com certificado gratuito."
  ],
  [
    "Física Clássica: Mecânica e Termodinâmica",
    "Ciências Exatas",
    "Cursos USP / e-Aulas",
    "https://eaulas.usp.br/portal/course.action?course=4321",
    "gratuito",
    "Ensino Médio e Superior",
    "Leis de Newton, conservação de energia, trabalho e primeiro princípio da termodinâmica em aulas do Instituto de Física da USP."
  ],
  [
    "Química Geral e Transformações da Matéria",
    "Ciências Exatas",
    "Cursos USP / e-Aulas",
    "https://eaulas.usp.br/portal/course.action?course=8765",
    "gratuito",
    "Iniciante",
    "Tabela periódica, ligações químicas, estequiometria e equilíbrio químico em aulas do Instituto de Química da USP."
  ],
  [
    "Metodologias Ativas de Ensino e Aprendizagem",
    "Educação & Pedagogia",
    "Cursos USP / e-Aulas",
    "https://eaulas.usp.br/portal/course.action?course=9012",
    "gratuito",
    "Iniciante",
    "Práticas pedagógicas inovadoras, sala de aula invertida e resolução de problemas na formação de educadores."
  ],
  [
    "Educação Inclusiva e Acessibilidade Pedagógica",
    "Educação & Pedagogia",
    "Instituto Federal (IFRS)",
    "https://moodle.ifrs.edu.br/course/view.php?id=4321",
    "gratuito",
    "Iniciante",
    "Diretrizes de educação inclusiva, tecnologias assistivas e adaptações curriculares com certificação gratuita do IFRS."
  ]
];

module.exports = {
  cursosData,
  guiaDeTICursosCount: 15,
  fundacaoBradescoCount: 61,
  oerCount: 25,
  trilhaInfoCount: 8
};
