/**
 * Cursos Gratuitos e Práticos do Canal Programação Web (@programacaoweb)
 * Apresentador: Dimitry Lavalhere
 * Canal no YouTube com foco em desenvolvimento web moderno, front-end, back-end e IA.
 * 
 * Todas as URLs são links diretos para as playlists e cursos oficiais gratuitos no YouTube.
 */

const programacaoWebCursos = [
  {
    titulo: 'Curso Completo de HTML',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_ca_LTlQJyklDijwZAOk_iJ',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Curso completo e gratuito de HTML com 15 aulas práticas apresentado por Dimitry Lavalhere (Programação Web) no YouTube (certificação de estudo e formação aberta). Do zero absoluto à estruturação semântica de websites, tags modernas, formulários completos, tabelas e boas práticas de SEO e acessibilidade.'
  },
  {
    titulo: 'Curso Completo de CSS',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_fqPM6MOwi2zXsbfV1j11kc',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Curso completo de CSS com 28 aulas práticas no canal Programação Web no YouTube (certificação de estudo e formação aberta). Cobre sintaxe, cores, tipografia, modelo de caixa (box model), posicionamento, Flexbox, CSS Grid, responsividade (media queries) e estilização moderna de interfaces.'
  },
  {
    titulo: 'Curso Completo de JavaScript',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_dpxlW0pWrVqBc04GUQfXm3',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Curso completo de JavaScript com 20 aulas do zero ao avançado no canal Programação Web no YouTube (certificação de estudo e formação aberta). Ensina lógica de programação, variáveis, condicionais, laços, funções, manipulação da árvore DOM, eventos do navegador, arrays e objetos.'
  },
  {
    titulo: 'Curso de Banco de Dados MySQL (com PHP)',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_dBzMqlXc5uc-HZprvG0nHn',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Curso prático de Banco de Dados MySQL integrado com PHP no canal Programação Web no YouTube (certificação de estudo e formação aberta). Aborda criação de banco e tabelas relacionais, comandos SQL (SELECT, INSERT, UPDATE, DELETE), chaves primárias e estrangeiras, e conexão com PHP via PDO/MySQLi.'
  },
  {
    titulo: 'Curso de Git e GitHub Para Iniciantes',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_dQ6Eh7lJ4y3le7eGuxKHGW',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Curso passo a passo de controle de versão com Git e GitHub no canal Programação Web no YouTube (certificação de estudo e formação aberta). Cobre instalação, configuração, comandos git init, add, commit, log, branch, checkout, merge, push/pull e hospedagem de repositórios no GitHub.'
  },
  {
    titulo: 'Curso Programador Web Moderno: Era da IA',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_f69N5jAfypOOhjdW3yDFnw',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Treinamento prático e atualizado de desenvolvimento web moderno no YouTube (certificação de estudo e formação aberta) alinhado com ferramentas de Inteligência Artificial generativa (ChatGPT, GitHub Copilot, Cursor). Criado por Dimitry Lavalhere para acelerar a produtividade do programador.'
  },
  {
    titulo: 'ABC do Front-end: Base e Projetos Reais',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_dxY4kmnphLjfRoRLdUOqyu',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Série prática de 12 aulas ensinando a base sólida do desenvolvimento front-end moderno no YouTube (certificação de estudo e formação aberta) através da construção de projetos reais no canal Programação Web.'
  },
  {
    titulo: 'Cursos de 1 Hora: Tecnologias Web na Prática',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_c4dlgeANTt8npMM9T5-ATk',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Imersões em vídeo de 1 hora completas e diretas ao ponto no YouTube (certificação de estudo e formação aberta) sobre tecnologias essenciais para desenvolvedores web iniciantes.'
  },
  {
    titulo: 'Inteligência Artificial e Machine Learning para Programadores Web',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_cEc07_NdFgR5GNL_nopQxN',
    licenca: 'gratuito',
    nivel: 'Iniciante',
    descricao: 'Série com 22 vídeos explorando Inteligência Artificial, redes neurais, machine learning, integração de APIs generativas no YouTube (certificação de estudo e formação aberta) e automação para desenvolvedores web.'
  },
  {
    titulo: 'Projetos Práticos de Programação Web Passo a Passo',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_fDQu_zF7RZTAOtW9yCZadA',
    licenca: 'gratuito',
    nivel: 'Intermediário',
    descricao: 'Construção prática e passo a passo de projetos web completos, landing pages, interfaces modernas e sistemas dinâmicos no YouTube (certificação de estudo e formação aberta) no canal Programação Web.'
  },
  {
    titulo: 'Criar Aplicativos: Do Conceito à Publicação',
    tipo: 'curso',
    area: 'Tecnologia',
    plataforma: 'YouTube (Programação Web)',
    url: 'https://www.youtube.com/playlist?list=PL2Fdisxwzt_fqF_5N7J9vykVDqt1-oZjE',
    licenca: 'gratuito',
    nivel: 'Intermediário',
    descricao: '18 aulas práticas no canal Programação Web no YouTube (certificação de estudo e formação aberta) dedicadas à criação de aplicativos para celular, conversão de websites para apps e publicação nas lojas virtuais.'
  }
];

module.exports = { programacaoWebCursos };
