/**
 * Catálogo Oficial Curado de Cursos Gratuitos da Plataforma Lumina (UFRGS)
 * Universidade Federal do Rio Grande do Sul — lumina.ufrgs.br
 * 
 * Cursos livres e MOOCs abertos a qualquer cidadão com emissão gratuita
 * de Certificado de Extensão Universitária pela UFRGS.
 * 
 * Diretriz AGENTS.md: Apenas metadados e URLs de redirecionamento 302.
 */

const luminaCoursesList = [
  {
    titulo: "Introdução à Divulgação Científica (Lumina UFRGS)",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=107",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fundamentos e técnicas da comunicação e jornalismo científico: como transformar pesquisas complexas em linguagem acessível para o grande público com emissão de certificado gratuito de extensão universitária pela UFRGS."
  },
  {
    titulo: "Produção Textual na Universidade: O Artigo Científico (Lumina UFRGS)",
    tipo: "curso",
    area: "Educação",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=83",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Estrutura, metodologia, normas acadêmicas, escrita de resumo, introdução e discussão para artigos científicos e trabalhos de conclusão de curso com certificado gratuito da UFRGS."
  },
  {
    titulo: "Leitura Crítica e Escrita Acadêmica (Lumina UFRGS)",
    tipo: "curso",
    area: "Educação",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=92",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Desenvolvimento da capacidade de análise textual, argumentação sólida, fichamento de fontes bibliográficas e combate ao plágio acadêmico com certificação gratuita pela UFRGS."
  },
  {
    titulo: "Pensamento Computacional: Fundamentos e Resolução de Problemas (Lumina UFRGS)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=114",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Os 4 pilares do pensamento computacional: decomposição, reconhecimento de padrões, abstração e algoritmos aplicados na solução de problemas cotidianos e científicos com certificado gratuito UFRGS."
  },
  {
    titulo: "Filosofia da Ciência e Pensamento Crítico (Lumina UFRGS)",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=76",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Reflexões sobre a natureza do método científico, falseabilidade (Popper), paradigmas (Kuhn), ética na pesquisa e combate a pseudociências com certificado de extensão da UFRGS."
  },
  {
    titulo: "História da Arte, Patrimônio Cultural e Cidadania (Lumina UFRGS)",
    tipo: "curso",
    area: "Comunicação & Artes",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=68",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Panorama dos movimentos artísticos, conservação do patrimônio histórico material e imaterial e memória cultural coletiva com certificado digital gratuito pela UFRGS."
  },
  {
    titulo: "Neurociência e Processos de Aprendizagem (Lumina UFRGS)",
    tipo: "curso",
    area: "Ciências & Saúde",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=95",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Como o cérebro aprende: plasticidade neural, memória de trabalho, atenção, consolidação do sono e estratégias pedagógicas baseadas em evidências com certificado gratuito da UFRGS."
  },
  {
    titulo: "Gestão Cultural e Economia Criativa (Lumina UFRGS)",
    tipo: "curso",
    area: "Administração & Negócios",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=88",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Planejamento, captação de recursos, sustentabilidade financeira e gestão de projetos culturais independentes e comunitários com certificado de extensão universitária UFRGS."
  },
  {
    titulo: "Sustentabilidade, Mudanças Climáticas e Meio Ambiente (Lumina UFRGS)",
    tipo: "curso",
    area: "Ciências & Saúde",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=102",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Crise climática global, transição energética, biodiversidade, metas ESG e Objetivos de Desenvolvimento Sustentável (ODS) da ONU com certificação oficial da UFRGS."
  },
  {
    titulo: "Direitos Humanos, Diversidade e Cidadania (Lumina UFRGS)",
    tipo: "curso",
    area: "Ciências Humanas",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=59",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "História e princípios da Declaração Universal dos Direitos Humanos, combate ao racismo e discriminação, igualdade de gênero e inclusão social com certificado gratuito da UFRGS."
  },
  {
    titulo: "Saúde Pública e Fundamentos de Epidemiologia (Lumina UFRGS)",
    tipo: "curso",
    area: "Ciências & Saúde",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=111",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Conceitos de vigilância sanitária, indicadores de saúde populacional, prevenção de epidemias e promoção da saúde coletiva com certificado digital gratuito pela UFRGS."
  },
  {
    titulo: "Estatística Básica Aplicada à Pesquisa Acadêmica (Lumina UFRGS)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=74",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Amostragem, medidas de tendência central, dispersão, correlação, interpretação de gráficos e testes de hipóteses para pesquisas universitárias com certificado gratuito UFRGS."
  },
  {
    titulo: "Acessibilidade e Desenho Universal na Educação (Lumina UFRGS)",
    tipo: "curso",
    area: "Educação",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=82",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Tecnologias assistivas, recursos didáticos inclusivos, audiodescrição e desenho universal para a aprendizagem de pessoas com deficiência com certificação gratuita da UFRGS."
  },
  {
    titulo: "Bioética e Integridade na Pesquisa Científica (Lumina UFRGS)",
    tipo: "curso",
    area: "Ciências & Saúde",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=90",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Comitês de ética, consentimento informado, privacidade de dados de participantes e boas práticas em pesquisas clínicas e sociais com certificado emitido pela UFRGS."
  },
  {
    titulo: "Metodologia Científica e Elaboração de Projetos (Lumina UFRGS)",
    tipo: "curso",
    area: "Educação",
    plataforma: "Lumina (UFRGS)",
    url: "https://lumina.ufrgs.br/course/view.php?id=66",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Formulação do problema de pesquisa, hipóteses, cronograma, justificativa, revisão sistemática e delineamento experimental para projetos acadêmicos com certificado da UFRGS."
  }
];

module.exports = { luminaCoursesList };
