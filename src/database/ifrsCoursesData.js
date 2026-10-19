/**
 * Catálogo Oficial Curado de Cursos Gratuitos do IFRS (Instituto Federal do Rio Grande do Sul)
 * Plataforma Moodle MOOC: moodle.ifrs.edu.br
 * 
 * Cursos de extensão 100% gratuitos e abertos a toda a comunidade.
 * Certificação digital emitida gratuitamente após atingir a nota mínima nas avaliações.
 * 
 * Diretriz AGENTS.md: Apenas metadados e URLs de redirecionamento 302.
 */

const ifrsCoursesList = [
  // ==================== 1. IDIOMAS (INGLÊS E ESPANHOL) ====================
  {
    titulo: "IFRS: Inglês 1 — Iniciante e Vocabulário Básico",
    tipo: "curso",
    area: "Idiomas",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6101",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Curso de extensão em Língua Inglesa para iniciantes: saudações, pronomes, verbo to be, rotina diária, números e vocabulário com certificado digital gratuito emitido pelo IFRS após atingir nota mínima."
  },
  {
    titulo: "IFRS: Inglês 2 — Pré-Intermediário e Comunicação Cotidiana",
    tipo: "curso",
    area: "Idiomas",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6102",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Passado simples, preposições de tempo e lugar, compras, viagens e conversações cotidianas em inglês com certificação digital gratuita emitida pelo Instituto Federal (IFRS)."
  },
  {
    titulo: "IFRS: Espanhol 1 — Iniciante e Expressões Básicas",
    tipo: "curso",
    area: "Idiomas",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6103",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Comunicação inicial em língua espanhola: fonética, saudações, artigos, pronomes interrogativos e vocabulário prático com certificado gratuito garantido pelo IFRS."
  },
  {
    titulo: "IFRS: Espanhol 2 — Básico para Interações Sociais",
    tipo: "curso",
    area: "Idiomas",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6104",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Diálogos em viagens, restaurantes, hospedagem, tempos verbais no presente e passado em espanhol com emissão gratuita de certificado oficial pelo IFRS."
  },

  // ==================== 2. INFORMÁTICA & TECNOLOGIA ====================
  {
    titulo: "IFRS: Informática Básica com LibreOffice e Software Livre",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6105",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Conceitos de sistemas operacionais, edição de textos no LibreOffice Writer, planilhas no Calc e apresentações no Impress com certificado digital gratuito do IFRS."
  },
  {
    titulo: "IFRS: Lógica de Programação e Algoritmos",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=5815",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Conceitos fundamentais de programação: variáveis, tipos de dados, operadores lógicos, estruturas condicionais e de repetição com certificado gratuito do IFRS."
  },
  {
    titulo: "IFRS: Programação Básica com Java e Orientação a Objetos",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=5816",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fundamentos da linguagem Java, sintaxe, métodos, classes, encapsulamento e programação orientada a objetos (POO) com certificado gratuito emitido pelo IFRS."
  },
  {
    titulo: "IFRS: Desenvolvimento Web com HTML5 e CSS3",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6106",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Construção de sites semânticos, estruturação com tags HTML5, estilização visual com CSS3 e introdução ao design responsivo com certificado digital do IFRS."
  },
  {
    titulo: "IFRS: Banco de Dados 1 — Modelagem Conceitual e SQL",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6107",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Diagrama Entidade-Relacionamento (DER), modelo relacional, chaves primárias, estrangeiras e consultas SQL com certificação gratuita garantida pelo IFRS."
  },
  {
    titulo: "IFRS: Redes de Computadores: Fundamentos e Topologias",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=5817",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Topologias de rede, modelo OSI, pilha TCP/IP, endereçamento IPv4/IPv6, roteamento e protocolos essenciais de internet com certificado oficial gratuito do IFRS."
  },

  // ==================== 3. CIÊNCIAS EXATAS ====================
  {
    titulo: "IFRS: Matemática Básica para o Ensino Superior e Concursos",
    tipo: "curso",
    area: "Ciências & Matemática",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6108",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Revisão prática de frações, potenciação, radiciação, equações de 1º e 2º grau, regra de três e porcentagem com certificado digital gratuito emitido pelo IFRS."
  },
  {
    titulo: "IFRS: Estatística Descritiva Básica para Análise de Dados",
    tipo: "curso",
    area: "Ciências & Matemática",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6109",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Distribuição de frequências, média, mediana, moda, desvio-padrão e representação gráfica de dados para pesquisas e estudos com certificado gratuito IFRS."
  },
  {
    titulo: "IFRS: Física Geral: Mecânica e Cinemática Aplicada",
    tipo: "curso",
    area: "Ciências & Matemática",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6110",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Conceitos de movimento retilíneo uniforme (MRU), aceleração, Leis de Newton, trabalho e conservação de energia com certificado digital oficial do IFRS."
  },

  // ==================== 4. CIÊNCIAS HUMANAS & EDUCAÇÃO ====================
  {
    titulo: "IFRS: Leitura, Produção e Interpretação de Textos",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=1214",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Gêneros textuais, coerência, coesão, estratégias de leitura crítica e técnicas de redação para exames e vida profissional com certificado gratuito do IFRS."
  },
  {
    titulo: "IFRS: Redação Oficial e Comunicação Corporativa",
    tipo: "curso",
    area: "Administração & Negócios",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=6111",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Manual de redação da Presidência, elaboração de ofícios, memorandos, relatórios e e-mails profissionais claros com certificado digital do IFRS."
  },
  {
    titulo: "IFRS: Sociologia das Relações Étnico-Raciais",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=3021",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "História e cultura afro-brasileira e indígena, combate ao racismo estrutural, políticas afirmativas e cidadania com certificado de extensão gratuito do IFRS."
  },
  {
    titulo: "IFRS: Educação Inclusiva e Acessibilidade Pedagógica",
    tipo: "curso",
    area: "Educação",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=4321",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Práticas inclusivas na sala de aula, atendimento educacional especializado (AEE) e adaptação de materiais para pessoas com deficiência com certificado do IFRS."
  },
  {
    titulo: "IFRS: Gestão de Projetos e Inovação Empreendedora",
    tipo: "curso",
    area: "Administração & Negócios",
    plataforma: "Instituto Federal (IFRS)",
    url: "https://moodle.ifrs.edu.br/course/view.php?id=5818",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Ciclo de vida de projetos, escopo, cronograma, Canvas de modelo de negócios e ferramentas de inovação com certificado de extensão oficial do IFRS."
  }
];

module.exports = { ifrsCoursesList };
