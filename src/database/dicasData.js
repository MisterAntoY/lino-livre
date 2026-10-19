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

  // ==================== 7. HÁBITOS ATÔMICOS & DISCIPLINA (JAMES CLEAR) ====================
  {
    id: 23,
    titulo: 'Regra dos 2 Minutos para Vencer a Procrastinação',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos (James Clear)',
    icone: '⏳',
    descricao: 'Quando você começar um novo hábito de estudos, ele deve levar menos de dois minutos para ser iniciado. O objetivo é dominar o ato de aparecer e vencer a inércia.',
    dica_pratica: 'Em vez de planejar "vou estudar 3 horas hoje", defina a meta microscópica de "vou sentar, abrir o livro e ler 1 página" ou "abrir o editor de código e rodar 1 linha". Uma vez iniciado o processo, o atrito desaparece e continuar flui naturalmente.',
    url: 'https://jamesclear.com/how-to-stop-procrastinating',
    gratuito: 'Metodologia Aberta',
    idioma: 'PT-BR / EN'
  },
  {
    id: 24,
    titulo: 'Empilhamento de Hábitos (Habit Stacking)',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos (James Clear)',
    icone: '🧱',
    descricao: 'A maneira mais rápida e consistente de criar um novo hábito de estudos é vinculá-lo diretamente a um hábito que você já faz de forma automática e diária.',
    dica_pratica: 'Aplique a fórmula de James Clear: "Depois de [HÁBITO ATUAL], eu vou [NOVO HÁBITO]". Exemplo: "Depois de tomar meu café da manhã, vou sentar na mesa e revisar 10 cartões no Anki por 5 minutos".',
    url: 'https://jamesclear.com/habit-stacking',
    gratuito: 'Metodologia Aberta',
    idioma: 'PT-BR / EN'
  },
  {
    id: 25,
    titulo: 'Design do Ambiente & Redução de Atrito',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos (James Clear)',
    icone: '🏡',
    descricao: 'O ambiente físico e digital é a força invisível que molda nossos hábitos. Facilite os bons comportamentos tornando os gatilhos óbvios e aumente o atrito das distrações.',
    dica_pratica: 'Deixe o caderno de resumos ou o livro aberto sobre a mesa na noite anterior. Para o smartphone, adicione atrito: desligue notificações ou deixe o aparelho em outro cômodo durante os ciclos de estudo.',
    url: 'https://jamesclear.com/environment-design-habits',
    gratuito: 'Metodologia Aberta',
    idioma: 'PT-BR / EN'
  },
  {
    id: 26,
    titulo: '1% Melhor Todos os Dias (O Poder dos Ganhos Compostos)',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos (James Clear)',
    icone: '📈',
    descricao: 'Se você melhorar apenas 1% a cada dia durante 365 dias, terminará o ano 37 vezes melhor. Os hábitos de estudo são os juros compostos do conhecimento.',
    dica_pratica: 'Evite o ciclo destrutivo de estudar 8 horas na véspera de prova e ficar sem estudar por semanas. Trinta a quarenta minutos diários e consistentes vencem qualquer esforço esporádico de última hora.',
    url: 'https://jamesclear.com/continuous-improvement',
    gratuito: 'Metodologia Aberta',
    idioma: 'PT-BR / EN'
  },
  {
    id: 27,
    titulo: 'Rastreador de Estudos & Regra de "Nunca Falhar Duas Vezes"',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos (James Clear)',
    icone: '📅',
    descricao: 'Visualizar o próprio progresso gera satisfação imediata. Quando imprevistos inevitáveis acontecerem, a regra inegociável é nunca falhar dois dias consecutivos.',
    dica_pratica: 'Marque um "X" no calendário ou use um rastreador simples a cada sessão cumprida. Perder um único dia é um acidente da vida; falhar dois dias seguidos é o início de um novo hábito negativo.',
    url: 'https://jamesclear.com/dont-break-the-chain',
    gratuito: 'Metodologia Aberta',
    idioma: 'PT-BR / EN'
  },
  {
    id: 28,
    titulo: 'Hábitos Baseados em Identidade ("Quem você deseja ser")',
    categoria: 'habitos',
    categoria_label: 'Hábitos Atômicos (James Clear)',
    icone: '🎯',
    descricao: 'A verdadeira mudança permanente ocorre no nível da identidade. O objetivo final não é "ler um livro", é se tornar um leitor. Não é "passar numa prova", é se tornar alguém dedicado ao aprendizado.',
    dica_pratica: 'Cada página que você lê e cada exercício que você resolve é um voto que você deposita na pessoa que deseja se tornar. Antes de desistir diante da preguiça, pergunte-se: "O que um estudante disciplinado faria agora?".',
    url: 'https://jamesclear.com/identity-based-habits',
    gratuito: 'Metodologia Aberta',
    idioma: 'PT-BR / EN'
  },
  // ==================== 8. REPOSITÓRIOS ONLINE DE ANGOLA (ADM ANGOLA) ====================
  {
    id: 29,
    titulo: 'OAPEN — Coleção Especial de Livros Abertos sobre Angola',
    categoria: 'angola',
    categoria_label: '🏛️ Repositórios de Angola (ADM Angola)',
    icone: '📚',
    descricao: 'Biblioteca digital internacional com centenas de livros acadêmicos, monografias científicas e ensaios de pós-graduação sobre Angola e África sob licenças de Acesso Aberto (Open Access).',
    dica_pratica: 'Excelente para teses de licenciatura e mestrado: pesquise por tópicos específicos como economia angolana, história do Reino do Congo, sociedade e línguas nacionais para ler livros completos gratuitos.',
    url: 'https://library.oapen.org/discover?query=angola',
    gratuito: '100% Gratuito / Open Access',
    idioma: 'PT / EN / FR'
  },
  {
    id: 30,
    titulo: 'RCAAP & OpenDOAR — Repositórios Científicos Lusófonos & CPLP',
    categoria: 'angola',
    categoria_label: '🏛️ Repositórios de Angola (ADM Angola)',
    icone: '🎓',
    descricao: 'Portal agregador de acesso aberto que reúne a produção científica, dissertações de mestrado, teses e artigos de dezenas de universidades e centros de investigação lusófonos e de países da CPLP.',
    dica_pratica: 'Pesquise por temas de investigação para encontrar trabalhos académicos de estudantes e professores angolanos, consultar bibliografias de referência e apoiar sua revisão de literatura.',
    url: 'https://www.rcaap.pt/search.jsp',
    gratuito: '100% Gratuito / Acesso Aberto',
    idioma: 'Português'
  },
  {
    id: 31,
    titulo: 'BNP Digital — Acervo Histórico e Documental de Angola',
    categoria: 'angola',
    categoria_label: '🏛️ Repositórios de Angola (ADM Angola)',
    icone: '🏛️',
    descricao: 'Acervo digital com manuscritos raros, mapas cartográficos dos séculos XVII a XIX, coleções dos primeiros jornais de Luanda e Benguela e relatórios históricos oficiais em domínio público.',
    dica_pratica: 'Ferramenta indispensável para estudantes de História, Direito, Antropologia e Ciências Sociais que necessitam de documentos históricos e fontes primárias autênticas.',
    url: 'https://bndigital.bnportugal.gov.pt/',
    gratuito: 'Domínio Público / Acesso Livre',
    idioma: 'Português'
  },
  {
    id: 32,
    titulo: 'CMI (Chr. Michelsen Institute) — Investigação & Governação em Angola',
    categoria: 'angola',
    categoria_label: '🏛️ Repositórios de Angola (ADM Angola)',
    icone: '📊',
    descricao: 'O mais conceituado acervo internacional de relatórios de investigação aplicada sobre governação pública, finanças, transparência, direitos humanos e desenvolvimento socioeconómico de Angola.',
    dica_pratica: 'Acesse relatórios temáticos completos e relatórios de políticas públicas ("policy briefs") com análises atualizadas sobre a economia, setor extractivo e descentralização em Angola.',
    url: 'https://www.cmi.no/',
    gratuito: '100% Gratuito / Open Access',
    idioma: 'PT / EN'
  },
  {
    id: 33,
    titulo: 'Banco Mundial — Repositório Aberto de Conhecimento & Dados de Angola',
    categoria: 'angola',
    categoria_label: '🏛️ Repositórios de Angola (ADM Angola)',
    icone: '🌐',
    descricao: 'Repositório oficial Open Knowledge Repository (OKR) e Portal de Dados Abertos com análises macroeconómicas, diagnósticos de setores, relatórios de pobreza e planos estruturais de Angola.',
    dica_pratica: 'Consulte indicadores económicos, relatórios de conjuntura económica angolana e dados demográficos para fundamentar pesquisas e projetos com fontes primárias de relevância mundial.',
    url: 'https://openknowledge.worldbank.org/home',
    gratuito: 'Acesso Aberto Governamental',
    idioma: 'PT / EN'
  },
  {
    id: 34,
    titulo: 'UC Digitalis — Biblioteca Digital Científica e Lusófona',
    categoria: 'angola',
    categoria_label: '🏛️ Repositórios de Angola (ADM Angola)',
    icone: '📖',
    descricao: 'Plataforma digital da Universidade de Coimbra que disponibiliza milhares de volumes científicos, revistas especializadas, teses e ensaios dedicados à história, direito e cultura de Angola.',
    dica_pratica: 'Navegue pelas coleções "Alma Mater" e "Pombalina" para aceder a ensaios jurídicos, botânicos e sociológicos com visualizador online e download gratuito de obras de referência.',
    url: 'https://digitalis.uc.pt/',
    gratuito: '100% Gratuito / Acesso Aberto',
    idioma: 'Português'
  },
  {
    id: 35,
    titulo: 'Portal ADM Angola — Repositórios Online (Guia do Maior Acervo)',
    categoria: 'angola',
    categoria_label: '🏛️ Repositórios de Angola (ADM Angola)',
    icone: '🇦🇴',
    descricao: 'O portal da Administração Pública Angolana que cataloga e direciona para os 19 maiores repositórios digitais e bibliotecas académicas do mundo com acervos dedicados a Angola.',
    dica_pratica: 'Excelente ponto de partida para localizar arquivos governamentais, bases de patentes, diretórios de teses da CPLP e plataformas de documentação sobre a função pública angolana.',
    url: 'https://www.plataforma.admangola.com/biblioteca/repositórios-online',
    gratuito: 'Guia Público Aberto',
    idioma: 'Português'
  }
];

module.exports = { dicasData };

