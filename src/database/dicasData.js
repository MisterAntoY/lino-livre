/**
 * Catálogo Curado de Dicas de Estudo e Ferramentas Educativas Abertas
 * Extraído e validado a partir de CATALOGO-RECURSOS-GRATUITOS.md
 */

const dicasData = [
  // ==================== 1. TÉCNICAS DE ESTUDO & FOCO ====================
  {
    id: 1,
    titulo: 'Método Pomodoro (Pomofocus)',
    categoria: 'estudo',
    categoria_label: 'Técnicas de Estudo & Foco',
    icone: '⏱️',
    descricao: 'Temporizador Pomodoro online gratuito para ciclos de 25 minutos de concentração absoluta e 5 minutos de descanso restaurador.',
    dica_pratica: 'Divida seus estudos em blocos de 25 minutos sem celular ou notificações. A cada 4 ciclos, faça uma pausa maior de 15 a 30 minutos.',
    url: 'https://pomofocus.io',
    gratuito: '100% Gratuito',
    idioma: 'EN / Vários'
  },
  {
    id: 2,
    titulo: 'Repetição Espaçada & Flashcards (Anki)',
    categoria: 'estudo',
    categoria_label: 'Técnicas de Estudo & Foco',
    icone: '🧠',
    descricao: 'O padrão ouro em memorização de longo prazo com algoritmos de repetição espaçada (SRS) para vestibulares, concursos e programação.',
    dica_pratica: 'Crie cartões com perguntas diretas na frente e respostas curtas no verso. Revise diariamente de 10 a 15 minutos para consolidar na memória.',
    url: 'https://apps.ankiweb.net/',
    gratuito: 'Código Aberto / Gratuito',
    idioma: 'PT-BR / Vários'
  },
  {
    id: 3,
    titulo: 'Aprendendo a Aprender (Barbara Oakley)',
    categoria: 'estudo',
    categoria_label: 'Técnicas de Estudo & Foco',
    icone: '💡',
    descricao: 'Técnicas mentais fundamentadas em neurociência para superar a procrastinação, dominar assuntos difíceis e alternar entre foco e difusão.',
    dica_pratica: 'Quando travar em um problema difícil de código ou matemática, saia da mesa por 10 minutos. O "modo difuso" do cérebro continua trabalhando no plano de fundo.',
    url: 'https://www.coursera.org/learn/learning-how-to-learn',
    gratuito: 'Acesso Gratuito às Aulas',
    idioma: 'Legendas PT-BR'
  },
  {
    id: 4,
    titulo: 'Mapas Mentais Colaborativos (Coggle)',
    categoria: 'estudo',
    categoria_label: 'Técnicas de Estudo & Foco',
    icone: '🌿',
    descricao: 'Criação intuitiva de diagramas conceituais e árvores de ideias para associar conceitos complexos visualmente.',
    dica_pratica: 'Ao terminar de ler um capítulo de livro ou teoria, desenhe um mapa mental ligando os tópicos centrais aos detalhes secundários.',
    url: 'https://coggle.it',
    gratuito: 'Plano Gratuito Disponível',
    idioma: 'Vários'
  },
  {
    id: 5,
    titulo: 'Quadro Branco para Esquemas (Excalidraw)',
    categoria: 'estudo',
    categoria_label: 'Técnicas de Estudo & Foco',
    icone: '✏️',
    descricao: 'Quadro virtual minimalista com estética desenhada à mão para rascunhar arquiteturas, fluxos de raciocínio e mapas conceituais.',
    dica_pratica: 'Excelente para explicar conceitos difíceis a si mesmo (Técnica Feynman) desenhando blocos e setas de causa e efeito.',
    url: 'https://excalidraw.com',
    gratuito: '100% Gratuito & Aberto',
    idioma: 'Vários'
  },

  // ==================== 2. ORGANIZAÇÃO & GESTÃO DE CONHECIMENTO ====================
  {
    id: 6,
    titulo: 'Obsidian — Caderno em Grafo com Markdown',
    categoria: 'organizacao',
    categoria_label: 'Organização & Notas',
    icone: '📓',
    descricao: 'Software de base de conhecimento pessoal que armazena notas em arquivos Markdown puros no seu próprio computador.',
    dica_pratica: 'Use links bidirecionais [[NomeDaNota]] para interconectar conceitos de livros, aulas e artigos, gerando sua própria Wikipédia pessoal.',
    url: 'https://obsidian.md',
    gratuito: 'Gratuito para Uso Pessoal',
    idioma: 'PT-BR / Vários'
  },
  {
    id: 7,
    titulo: 'Zotero — Gestor de Referências & PDFs Acadêmicos',
    categoria: 'organizacao',
    categoria_label: 'Organização & Notas',
    icone: '📑',
    descricao: 'Ferramenta livre indispensável para coletar, organizar, citar e pesquisar fontes bibliográficas com 1 clique no navegador.',
    dica_pratica: 'Instale o Zotero Connector no navegador para salvar livros, artigos e teses do Domínio Público e SciELO já com metadados e ABNT prontos.',
    url: 'https://www.zotero.org',
    gratuito: 'Código Aberto / Gratuito',
    idioma: 'PT-BR / Vários'
  },
  {
    id: 8,
    titulo: 'Notion para Estudantes',
    categoria: 'organizacao',
    categoria_label: 'Organização & Notas',
    icone: '📋',
    descricao: 'Espaço de trabalho modular para planejamento de semestres, banco de questões, tabelas de leitura e rotinas de estudos.',
    dica_pratica: 'Crie uma tabela com colunas: "Obra", "Autor", "Status de Leitura", "Capítulo Atual" e "Principais Ideias".',
    url: 'https://www.notion.so',
    gratuito: 'Plano Gratuito com Recursos para Alunos',
    idioma: 'PT-BR / Vários'
  },
  {
    id: 9,
    titulo: 'Joplin — Notas Livres com Criptografia',
    categoria: 'organizacao',
    categoria_label: 'Organização & Notas',
    icone: '🔒',
    descricao: 'Alternativa segura e de código aberto para anotações rápidas e listas de tarefas, com suporte completo a Markdown.',
    dica_pratica: 'Sincronize suas anotações de leitura via Dropbox, Google Drive ou servidor próprio sem custo de mensalidade.',
    url: 'https://joplinapp.org',
    gratuito: 'Código Aberto',
    idioma: 'PT-BR / Vários'
  },

  // ==================== 3. ESCRITA & REVISÃO ====================
  {
    id: 10,
    titulo: 'LanguageTool — Corretor Gramatical para Português',
    categoria: 'escrita',
    categoria_label: 'Escrita & Revisão',
    icone: '✍️',
    descricao: 'Revisor ortográfico e de concordância multilíngue de código aberto que detecta erros sutis que corretores comuns deixam passar.',
    dica_pratica: 'Cole suas redações e resenhas antes de publicar. O corretor aponta pleonasmos, pontuação incorreta e concordâncias verbais.',
    url: 'https://languagetool.org',
    gratuito: 'Versão Gratuita Robusta',
    idioma: 'PT-BR, PT-PT e outros'
  },
  {
    id: 11,
    titulo: 'Hemingway Editor — Clareza e Legibilidade',
    categoria: 'escrita',
    categoria_label: 'Escrita & Revisão',
    icone: '📖',
    descricao: 'Editor textual que avalia a legibilidade do texto e destaca frases excessivamente longas, voz passiva e termos rebuscados.',
    dica_pratica: 'Escreva primeiro sem se preocupar; depois use o editor para encurtar orações complexas e tornar sua argumentação direta e envolvente.',
    url: 'https://hemingwayapp.com',
    gratuito: 'Gratuito Online',
    idioma: 'EN / Adaptável para PT'
  },
  {
    id: 12,
    titulo: 'Overleaf — Editor LaTeX Colaborativo na Nuvem',
    categoria: 'escrita',
    categoria_label: 'Escrita & Revisão',
    icone: '📐',
    descricao: 'Ambiente online para redigir artigos científicos, trabalhos acadêmicos (TCC/Mestrado) e equações matemáticas formatadas com perfeição.',
    dica_pratica: 'Utilize os templates prontos da ABNT ou de periódicos científicos para não perder horas ajustando margens e espaçamentos manuais.',
    url: 'https://www.overleaf.com',
    gratuito: 'Plano Gratuito Disponível',
    idioma: 'Interface EN / Suporta PT'
  },
  {
    id: 13,
    titulo: 'Reedsy Book Editor — Diagramação Profissional',
    categoria: 'escrita',
    categoria_label: 'Escrita & Revisão',
    icone: '📚',
    descricao: 'Plataforma gratuita para autores diagramarem livros digitais em formato EPUB e PDF prontos para publicação independente.',
    dica_pratica: 'Perfeito para transformar coletâneas de textos, poemas ou anotações didáticas em um livro digital elegante.',
    url: 'https://reedsy.com/write-a-book',
    gratuito: 'Editor Gratuito',
    idioma: 'EN'
  },

  // ==================== 4. IDIOMAS & DICIONÁRIOS ====================
  {
    id: 14,
    titulo: 'Dicionário Etimológico da Língua Portuguesa',
    categoria: 'idiomas',
    categoria_label: 'Idiomas & Dicionários',
    icone: '📜',
    descricao: 'Descubra a origem histórica, raízes latinas/gregas e a evolução semântica dos vocábulos da nossa língua.',
    dica_pratica: 'Entender o prefixo e a raiz das palavras amplia seu vocabulário e facilita a interpretação de clássicos como Machado de Assis e Castro Alves.',
    url: 'https://www.dicionarioetimologico.com.br',
    gratuito: '100% Gratuito',
    idioma: 'PT-BR'
  },
  {
    id: 15,
    titulo: 'Forvo — Pronúncias por Falantes Nativos',
    categoria: 'idiomas',
    categoria_label: 'Idiomas & Dicionários',
    icone: '🗣️',
    descricao: 'O maior guia de pronúncia colaborativo do planeta, gravado por pessoas nativas de centenas de idiomas e dialetos.',
    dica_pratica: 'Pesquise nomes de autores estrangeiros e termos técnicos para ouvir a entonação e fonética autêntica.',
    url: 'https://pt.forvo.com',
    gratuito: '100% Gratuito',
    idioma: 'Multilíngue'
  },
  {
    id: 16,
    titulo: 'Linguee & Reverso Context — Tradução em Contexto',
    categoria: 'idiomas',
    categoria_label: 'Idiomas & Dicionários',
    icone: '🌐',
    descricao: 'Dicionários bilíngues com milhões de exemplos extraídos de textos reais, publicações acadêmicas e órgãos internacionais.',
    dica_pratica: 'Em vez de traduzir palavras soltas, busque expressões completas para aprender como autores nativos as utilizam no dia a dia.',
    url: 'https://www.linguee.com.br',
    gratuito: '100% Gratuito',
    idioma: 'Multilíngue'
  },

  // ==================== 5. FERRAMENTAS LIVRES & MÍDIA ABERTA ====================
  {
    id: 17,
    titulo: 'Audacity — Editor de Áudio Livre',
    categoria: 'criacao',
    categoria_label: 'Mídia Livre & Criação',
    icone: '🎙️',
    descricao: 'Software multiplataforma de código aberto para gravação e edição de áudios, narração de audiolivros e podcasts educativos.',
    dica_pratica: 'Grave seus próprios resumos em áudio para escutar no transporte público ou enquanto faz atividades físicas.',
    url: 'https://www.audacityteam.org',
    gratuito: 'Código Aberto',
    idioma: 'PT-BR / Vários'
  },
  {
    id: 18,
    titulo: 'GIMP & Inkscape — Criação Visual Livre',
    categoria: 'criacao',
    categoria_label: 'Mídia Livre & Criação',
    icone: '🎨',
    descricao: 'Suíte aberta de manipulação de imagens (GIMP) e desenho vetorial SVG (Inkscape) alternativa às ferramentas proprietárias.',
    dica_pratica: 'Ideal para criar ilustrações de capa para trabalhos, infográficos didáticos e diagramas conceituais vetoriais.',
    url: 'https://www.gimp.org',
    gratuito: 'Código Aberto',
    idioma: 'PT-BR / Vários'
  },
  {
    id: 19,
    titulo: 'Openverse — Milhões de Imagens & Áudios em Domínio Público',
    categoria: 'criacao',
    categoria_label: 'Mídia Livre & Criação',
    icone: '🖼️',
    descricao: 'Motor de busca oficial da fundação WordPress com mais de 700 milhões de imagens e arquivos de áudio sob licença Creative Commons.',
    dica_pratica: 'Encontre capas, retratos de autores históricos e trilhas sonoras livres para enriquecer seus projetos de estudo e apresentações.',
    url: 'https://openverse.org',
    gratuito: '100% Aberto / CC',
    idioma: 'Multilíngue'
  },

  // ==================== 6. CARREIRA & APOIO AO ESTUDANTE ====================
  {
    id: 20,
    titulo: 'CIEE — Estágios e Primeiro Emprego',
    categoria: 'carreira',
    categoria_label: 'Carreira & Apoio ao Estudante',
    icone: '💼',
    descricao: 'Centro de Integração Empresa-Escola: banco de vagas gratuitas de estágio curricular, programas de jovem aprendiz e oficinas de currículo.',
    dica_pratica: 'Mantenha seu cadastro atualizado e faça os cursos rápidos de capacitação profissional oferecidos gratuitamente na plataforma.',
    url: 'https://portal.ciee.org.br',
    gratuito: '100% Gratuito',
    idioma: 'PT-BR'
  },
  {
    id: 21,
    titulo: 'e-MEC — Consulta Oficial de Cursos e Faculdades',
    categoria: 'carreira',
    categoria_label: 'Carreira & Apoio ao Estudante',
    icone: '🏛️',
    descricao: 'Base de dados oficial do Ministério da Educação do Brasil para verificar o credenciamento, notas do Enade e situação legal de qualquer curso superior.',
    dica_pratica: 'Sempre consulte a instituição e o curso no e-MEC antes de se matricular para garantir que o diploma terá validade nacional reconhecida.',
    url: 'https://emec.mec.gov.br',
    gratuito: 'Serviço Público Oficial',
    idioma: 'PT-BR'
  },
  {
    id: 22,
    titulo: 'CVV — Apoio Emocional e Prevenção do Estresse nos Estudos',
    categoria: 'carreira',
    categoria_label: 'Carreira & Apoio ao Estudante',
    icone: '💚',
    descricao: 'Centro de Valorização da Vida: acolhimento e escuta fraterna gratuita 24 horas por dia por telefone (ligação 188) ou chat online.',
    dica_pratica: 'A rotina de estudos pode ser intensa e solitária. Nunca hesite em buscar apoio e conversar com alguém quando sentir sobrecarga emocional.',
    url: 'https://cvv.org.br',
    gratuito: 'Gratuito 24h / Ligue 188',
    idioma: 'PT-BR'
  },

  // ==================== 7. HÁBITOS & ROTINAS DE ESTUDO ====================
  {
    id: 23,
    titulo: 'Regra dos 2 Minutos — Comece Pequeno',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos',
    icone: '',
    descricao: 'Reduza uma nova rotina de estudo à primeira ação que leva até dois minutos. Começar por uma etapa pequena ajuda a vencer a procrastinação e a criar consistência.',
    dica_pratica: 'Em vez de prometer estudar um capítulo inteiro, abra o livro e leia a primeira página. Depois de começar, decida se continua.',
    url: 'https://jamesclear.com/atomic-habits',
    gratuito: 'Artigo Gratuito',
    idioma: 'EN'
  },
  {
    id: 24,
    titulo: 'Empilhamento de Hábitos — Vincule uma Nova Rotina',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos',
    icone: '',
    descricao: 'Associe um novo hábito a uma rotina que já faz parte do seu dia, usando um momento existente como lembrete para a nova atividade.',
    dica_pratica: 'Defina uma sequência clara, como: depois do pequeno-almoço, rever os cartões de estudo por dez minutos.',
    url: 'https://jamesclear.com/habit-stacking',
    gratuito: 'Artigo Gratuito',
    idioma: 'EN'
  },
  {
    id: 25,
    titulo: 'Design do Ambiente — Facilite o Estudo',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos',
    icone: '',
    descricao: 'Organize o espaço e os materiais para tornar o comportamento desejado mais fácil de iniciar e reduzir distrações.',
    dica_pratica: 'Deixe o material da próxima sessão preparado e mantenha o telemóvel fora do alcance durante o período de foco.',
    url: 'https://jamesclear.com/atomic-habits',
    gratuito: 'Artigo Gratuito',
    idioma: 'EN'
  },
  {
    id: 26,
    titulo: '1% Melhor Todos os Dias — Progresso Gradual',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos',
    icone: '',
    descricao: 'Pequenas melhorias repetidas podem acumular-se com o tempo. Concentre-se em práticas sustentáveis em vez de depender de mudanças bruscas.',
    dica_pratica: 'Escolha uma melhoria simples para a próxima sessão, como rever os apontamentos durante cinco minutos adicionais.',
    url: 'https://jamesclear.com/atomic-habits',
    gratuito: 'Artigo Gratuito',
    idioma: 'EN'
  },
  {
    id: 27,
    titulo: 'Nunca Falhar Duas Vezes — Retome a Rotina',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos',
    icone: '',
    descricao: 'Uma interrupção ocasional não precisa transformar-se num abandono. Retome a atividade na próxima oportunidade disponível.',
    dica_pratica: 'Se perder uma sessão, programe agora um horário curto para amanhã e retome pelo próximo passo possível.',
    url: 'https://jamesclear.com/atomic-habits',
    gratuito: 'Artigo Gratuito',
    idioma: 'EN'
  },
  {
    id: 28,
    titulo: 'Hábitos Baseados em Identidade — Reforce Quem Quer Ser',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos',
    icone: '',
    descricao: 'Ligue as ações diárias à identidade que pretende construir: cada sessão de estudo é uma oportunidade de praticar ser uma pessoa que aprende.',
    dica_pratica: 'Após cada sessão, registe a ação concluída e reconheça o compromisso que ela representa com os seus objetivos de aprendizagem.',
    url: 'https://jamesclear.com/identity-based-habits',
    gratuito: 'Artigo Gratuito',
    idioma: 'EN'
  }
];

module.exports = { dicasData };
