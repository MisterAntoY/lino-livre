/**
 * Catálogo Oficial Curado de Exercícios e Simulados Práticos da Plataforma Cursa (cursa.app/pt/exercicios)
 * Exercícios interativos com gabarito e respostas explicadas em tecnologia, IA, idiomas, direito e mais.
 * Preparação prática para certificação gratuita emitida pelo aplicativo Cursa.
 * 
 * Diretriz AGENTS.md: Somente metadados e redirecionamentos externos 302.
 */

const cursaExerciciosList = [
  {
    "titulo": "Cursa: Portal de Exercícios e Questões com Respostas Comentadas",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Portal central de exercícios práticos gratuitos da plataforma Cursa com milhares de questionários de múltipla escolha comentados em tecnologia, programação, IA, idiomas, direito e gestão para fixação de conhecimento, estudos práticos e obtenção de certificado gratuito."
  },
  {
    "titulo": "Cursa: Free Practice Exercises & Quizzes with Feedback (English)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (English)",
    "url": "https://cursa.app/en/exercises",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Official Cursa interactive exercises and multiple-choice quizzes with detailed explanations in programming, languages, IT, and business for knowledge reinforcement and free certificate exam preparation."
  },
  {
    "titulo": "Cursa: Ejercicios y Cuestionarios Prácticos Gratuitos (Español)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Español)",
    "url": "https://cursa.app/es/ejercicios",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Portal de ejercicios prácticos y cuestionarios de opción múltiple con respuestas comentadas en tecnología, idiomas y gestión para consolidar aprendizajes y preparar la obtención de certificados gratuitos en Cursa."
  },
  {
    "titulo": "Cursa: Exercices et Quiz Pratiques Gratuits avec Corrigés (Français)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Français)",
    "url": "https://cursa.app/fr/exercices",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Banque officielle d'exercices et de quiz à choix multiples avec explications détaillées pour valider vos compétences et préparer l'obtention de votre certificat gratuit sur l'application Cursa."
  },
  {
    "titulo": "Cursa: अभ्यास और प्रश्नोत्तरी — Practice Exercises in Hindi (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Hindi)",
    "url": "https://cursa.app/hi/exercises",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "प्रश्नोत्तरी और अभ्यास: Cursa free practice questions and quizzes with detailed explanations to reinforce learning and prepare for the free certificate (प्रमाणपत्र)."
  },
  {
    "titulo": "Musicalidade e Técnica no Forró Pé-de-Serra — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/danca/musicalidade-e-tecnica-no-forro-pe-de-serra",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre musicalidade e técnica no forró pé-de-serra: ritmos, instrumentos, condução, conexão, giros e etiqueta na dança. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Hipnose no Manejo da Dor Aguda e Crônica — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/hipnose/hipnose-no-manejo-da-dor-aguda-e-cronica",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre hipnose no manejo da dor aguda e crônica, analgesia, sugestões terapêuticas e estratégias de cuidado seguro. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Fundamentos de Navegação na Corrida de Orientação — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/jogos-e-esportes/fundamentos-de-navegacao-na-corrida-de-orientacao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre fundamentos de navegação na corrida de orientação: mapa, bússola, rotas, controles, escalas e técnicas essenciais. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Correlação e Regressão Linear Simples — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Exatas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/estatistica-e-probabilidade/correlacao-e-regressao-linear-simples",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre correlação e regressão linear simples, coeficiente de Pearson, R², resíduos, causalidade e previsões. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Colorimetria Aplicada à Maquiagem: Correção e Harmonia das Cores — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/maquiagem/colorimetria-aplicada-a-maquiagem-correcao-e-harmonia-das-cores",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em colorimetria aplicada à maquiagem, correção de imperfeições, subtons de pele, bases e harmonia das cores. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Iter Criminis e Institutos Relacionados à Tentativa — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-penal/iter-criminis-e-institutos-relacionados-a-tentativa",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre iter criminis, tentativa, desistência voluntária, arrependimento eficaz, crime impossível e consumação. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gradação de Moldes para Produção de Vestuário — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/moda-corte-e-costura/gradacao-de-moldes-para-producao-de-vestuario",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gradação de moldes para produção de vestuário, tamanhos, medidas, margens de costura e controle de qualidade. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Controle da Cadeia Fria no Recebimento e na Reposição — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/estoquista/controle-da-cadeia-fria-no-recebimento-e-na-reposicao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre cadeia fria, controle de temperatura, recebimento e reposição de produtos refrigerados e congelados. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Detecção de Anomalias com Machine Learning — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Inteligência Artificial & Dados",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/inteligencia-artificial/deteccao-de-anomalias-com-machine-learning",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em detecção de anomalias com Machine Learning: Isolation Forest, LOF, One-Class SVM, métricas e séries temporais. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Terceirização e Trabalho Temporário no Direito do Trabalho — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-do-trabalho/terceirizacao-e-trabalho-temporario-no-direito-do-trabalho",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre terceirização e trabalho temporário no Direito do Trabalho, com foco na Lei nº 6.019/1974 e decisões do STF. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Regularização Ambiental de Imóveis Rurais: CAR, APP e Reserva Legal — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/agronegocio/regularizacao-ambiental-de-imoveis-rurais-car-app-e-reserva-legal",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre regularização ambiental rural, CAR, APP, Reserva Legal, PRA e Código Florestal. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Compressão de Dinâmica na Produção Musical — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/teoria-e-producao-musical/compressao-de-dinamica-na-producao-musical",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre compressão de dinâmica na produção musical: threshold, ratio, attack, release, sidechain e mais. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Operação, Limpeza e Diagnóstico de Sistemas de Chope — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/garcom-e-barman/operacao-limpeza-e-diagnostico-de-sistemas-de-chope",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre operação, limpeza e diagnóstico de sistemas de chope, incluindo serviço, temperatura, CO₂ e manutenção. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Preservação de Local de Crime na Segurança Privada — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/seguranca/preservacao-de-local-de-crime-na-seguranca-privada",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre preservação de local de crime na segurança privada, isolamento, vestígios, testemunhas e procedimentos. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Direção Defensiva em Condições Adversas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-detran/direcao-defensiva-em-condicoes-adversas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos de direção defensiva em condições adversas, como chuva, neblina, aquaplanagem, vento lateral e pista molhada. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Estatuto da Advocacia e da OAB: Direitos, Inscrição e Exercício Profissional — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/estatutos/estatuto-da-advocacia-e-da-oab-direitos-inscricao-e-exercicio-profissional",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre o Estatuto da Advocacia e da OAB: direitos, inscrição, incompatibilidades, honorários e exercício profissional. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Documentoscopia Forense: Autenticação e Exame de Documentos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-policia-federal/documentoscopia-forense-autenticacao-e-exame-de-documentos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em documentoscopia forense, autenticação, fraude documental, tintas, assinaturas e técnicas de exame pericial. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Escolástica Medieval: Fé, Razão e os Universais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/filosofia/escolastica-medieval-fe-razao-e-os-universais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre Escolástica Medieval: fé, razão, universais, Tomás de Aquino, Agostinho, Anselmo, Ockham e outros pensadores. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Diagnóstico e Manutenção de Limpadores e Lavadores de Para-brisa — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/manutencao-de-automoveis/diagnostico-e-manutencao-de-limpadores-e-lavadores-de-para-brisa",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre diagnóstico e manutenção de limpadores e lavadores de para-brisa automotivos. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Saúde Auditiva e Controle de Níveis Sonoros para DJs — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/dj/saude-auditiva-e-controle-de-niveis-sonoros-para-djs",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre saúde auditiva para DJs, níveis sonoros, dB, proteção contra ruído e práticas seguras em apresentações. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Mecanismos da Evolução Biológica e Especiação — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/biologia/mecanismos-da-evolucao-biologica-e-especiacao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre evolução biológica, seleção natural, deriva genética, especiação, Hardy-Weinberg e filogenia. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Fundamentos Profissionais de Preparo de Café Espresso — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outras-profissoes/fundamentos-profissionais-de-preparo-de-cafe-espresso",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre preparo de café espresso: moagem, compactação, extração, vaporização do leite, microespuma e limpeza da máquina. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Pronomes Complementos em Francês: COD, COI, Y e EN — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/frances/pronomes-complementos-em-frances-cod-coi-y-e-en",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre pronomes complementos em francês: COD, COI, y e en, com exercícios de substituição, negação e imperativo. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Improbidade Administrativa após a Lei nº 14.230/2021 — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-administrativo/improbidade-administrativa-apos-a-lei-no-14-230-2021",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre improbidade administrativa após a Lei 14.230/2021: dolo, sanções, prescrição, sucessão e ação judicial. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Montagem de Continuidade: Raccords, Eixo de Ação e Cortes — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/edicao-de-video/montagem-de-continuidade-raccords-eixo-de-acao-e-cortes",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre montagem de continuidade, raccords, eixo de ação, regra dos 180 graus, cortes e edição audiovisual. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Radiocomunicação Operacional para Polícia Militar e Guarda Municipal — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-policia-militar/radiocomunicacao-operacional-para-policia-militar-e-guarda-municipal",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em radiocomunicação operacional para Polícia Militar e Guarda Municipal, com códigos Q, alfabeto fonético e procedimentos de rádio. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Partículas Essenciais da Gramática Coreana — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/coreano/particulas-essenciais-da-gramatica-coreana",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre partículas essenciais da gramática coreana, incluindo tópico, sujeito, objeto, destino, posse e contraste. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Liberação Miofascial Manual: Avaliação, Técnicas e Segurança — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/massoterapia-massagem/liberacao-miofascial-manual-avaliacao-tecnicas-e-seguranca",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre liberação miofascial manual: avaliação, técnicas, segurança, contraindicações e condutas profissionais. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Casos Gramaticais do Russo: Uso e Declinação — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/russo/casos-gramaticais-do-russo-uso-e-declinacao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre os casos gramaticais do russo: uso, declinações, preposições e exemplos práticos em frases do dia a dia. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Ergonomia e Prevenção de Lesões ao Tocar Cavaquinho — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/cavaquinho/ergonomia-e-prevencao-de-lesoes-ao-tocar-cavaquinho",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre ergonomia no cavaquinho, postura, aquecimento e prevenção de lesões durante a prática musical. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Arcadismo Brasileiro: autores, obras e convenções poéticas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/literatura/arcadismo-brasileiro-autores-obras-e-convencoes-poeticas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre o Arcadismo Brasileiro: autores, obras, pseudônimos, convenções poéticas e Inconfidência Mineira. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Arquitetura da Informação: Taxonomias, Card Sorting e Navegação — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ux-experiencia-do-usuario/arquitetura-da-informacao-taxonomias-card-sorting-e-navegacao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em Arquitetura da Informação: taxonomias, card sorting, tree testing, navegação, metadados e encontrabilidade. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Inglês para Emergências Médicas e Atendimento ao Paciente — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ingles/ingles-para-emergencias-medicas-e-atendimento-ao-paciente",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos de inglês para emergências médicas, sintomas, atendimento ao paciente, medicamentos e equipamentos hospitalares. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Sistema de Balizamento Marítimo IALA — Região B — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/aviacao/sistema-de-balizamento-maritimo-iala-regiao-b",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre o Sistema de Balizamento Marítimo IALA Região B, marcas laterais, cardinais, luzes e segurança na navegação. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Resposta e Tratamento de Incidentes de Segurança — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/seguranca-da-informacao/resposta-e-tratamento-de-incidentes-de-seguranca",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre resposta e tratamento de incidentes de segurança, contenção, análise forense, erradicação e recuperação. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Anatomia da Unha Natural e Reconhecimento de Alterações Ungueais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/manicure-e-pedicure/anatomia-da-unha-natural-e-reconhecimento-de-alteracoes-ungueais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre anatomia da unha natural, alterações ungueais, cuidados profissionais e reconhecimento de sinais de alerta. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Projeções Cartográficas: Propriedades, Distorções e Aplicações — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/geografia/projecoes-cartograficas-propriedades-distorcoes-e-aplicacoes",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre projeções cartográficas, distorções, propriedades, Mercator, Gall-Peters, UTM e aplicações em mapas. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Direito Internacional dos Conflitos Armados em Operações Militares — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-forcas-armadas/direito-internacional-dos-conflitos-armados-em-operacoes-militares",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre Direito Internacional dos Conflitos Armados, princípios do DICA e regras aplicáveis às operações militares. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Leitura e Interpretação da Conta de Energia Elétrica — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/fundamental/leitura-e-interpretacao-da-conta-de-energia-eletrica",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre leitura e interpretação da conta de energia elétrica, consumo em kWh, tarifas, impostos e economia de energia. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Fotoproteção e Uso Seguro do Protetor Solar — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/cuidados-com-a-pele/fotoprotecao-e-uso-seguro-do-protetor-solar",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre fotoproteção, FPS, raios UVA e UVB, reaplicação e uso seguro do protetor solar. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Otimização de Conversão em Landing Pages — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/marketing-digital/otimizacao-de-conversao-em-landing-pages",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre otimização de conversão em landing pages, CRO, testes A/B, CTAs, formulários, métricas e experiência do usuário. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Regulagem e Ajuste de Guitarra Elétrica — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/guitarra/regulagem-e-ajuste-de-guitarra-eletrica",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre regulagem e ajuste de guitarra elétrica: ação das cordas, tensor, oitavas, ponte, pestana e captadores. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Organização de Espaços e Rotinas na Educação Infantil — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/pedagogia/organizacao-de-espacos-e-rotinas-na-educacao-infantil",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre organização de espaços e rotinas na Educação Infantil, autonomia, inclusão e planejamento pedagógico. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gestão e Otimização de Catálogo em Marketplaces — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/vendas/gestao-e-otimizacao-de-catalogo-em-marketplaces",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gestão e otimização de catálogo em marketplaces, anúncios, imagens, variações, SEO e conversão. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Sistema Equatorial de Coordenadas Celestes — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/astronomia-e-astrologia/sistema-equatorial-de-coordenadas-celestes",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre o sistema equatorial de coordenadas celestes, ascensão reta, declinação, tempo sideral e posição dos astros. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Direito de Arrependimento nas Compras Fora do Estabelecimento — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-do-consumidor/direito-de-arrependimento-nas-compras-fora-do-estabelecimento",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre o direito de arrependimento em compras online e fora do estabelecimento, conforme o artigo 49 do CDC. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Uso Técnico do Microfone em Locução — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/oratoria-e-locucao/uso-tecnico-do-microfone-em-locucao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre uso técnico do microfone em locução: ganho, proximidade, padrões polares, pop filter, clipping e acústica. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gestão e Operação do FGTS pela Caixa Econômica Federal — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-caixa/gestao-e-operacao-do-fgts-pela-caixa-economica-federal",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gestão e operação do FGTS pela Caixa, depósitos, saques, contas vinculadas, habitação e saque-aniversário. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Administração Segura de Medicamentos em Enfermagem — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/enfermagem/administracao-segura-de-medicamentos-em-enfermagem",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre administração segura de medicamentos em enfermagem, cálculos, vias, protocolos e prevenção de erros. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Decadência e Prescrição no Direito Previdenciário — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-previdenciario/decadencia-e-prescricao-no-direito-previdenciario",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre decadência e prescrição no Direito Previdenciário, revisão de benefícios, prazos do INSS e parcelas atrasadas. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Pronúncia Restaurada do Latim Clássico — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/latim/pronuncia-restaurada-do-latim-classico",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre a pronúncia restaurada do latim clássico: sons, ditongos, acentuação, vogais longas e consoantes. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Treinamento de Equilíbrio para Prevenção de Quedas em Idosos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/educacao-fisica/treinamento-de-equilibrio-para-prevencao-de-quedas-em-idosos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre treinamento de equilíbrio para idosos e prevenção de quedas com exercícios, segurança e estratégias posturais. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "People Analytics Aplicado à Gestão de Pessoas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/recursos-humanos/people-analytics-aplicado-a-gestao-de-pessoas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em People Analytics, turnover, absenteísmo, eNPS, análise preditiva, LGPD e decisões estratégicas em RH. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Falsos Cognatos entre Português e Espanhol — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/espanhol/falsos-cognatos-entre-portugues-e-espanhol",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre falsos cognatos entre português e espanhol e aprenda a evitar erros comuns de vocabulário. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Administração Segura de Medicamentos para Idosos e Crianças — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/cuidador-de-idosos-e-criancas/administracao-segura-de-medicamentos-para-idosos-e-criancas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre administração segura de medicamentos para idosos e crianças, incluindo doses, identificação e prevenção de erros. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Consulta e Interpretação de Dados no SIDRA do IBGE — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-ibge/consulta-e-interpretacao-de-dados-no-sidra-do-ibge",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre consulta, interpretação e exportação de dados no SIDRA do IBGE, tabelas estatísticas, indicadores e API. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Sistema Constitucional de Crises: Estado de Defesa e Estado de Sítio — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-constitucional/sistema-constitucional-de-crises-estado-de-defesa-e-estado-de-sitio",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre estado de defesa e estado de sítio na Constituição Federal, incluindo requisitos, limites, duração e controle. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Biossegurança no Atendimento de Extensão de Cílios — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/design-de-sobrancelhas/biosseguranca-no-atendimento-de-extensao-de-cilios",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre biossegurança na extensão de cílios: higiene, desinfecção, EPIs, prevenção de contaminação e atendimento seguro. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Projeto e Layout de Placas de Circuito Impresso — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/eletronica/projeto-e-layout-de-placas-de-circuito-impresso",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre projeto e layout de PCBs: trilhas, vias, impedância, planos de terra, BGA e regras de fabricação. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Anatomia do Sistema Reprodutor Feminino — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/anatomia/anatomia-do-sistema-reprodutor-feminino",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre a anatomia do sistema reprodutor feminino: ovários, tubas uterinas, útero, ligamentos, vasos e estruturas pélvicas. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Unidades de Medida da Informação Digital — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/informatica-basica/unidades-de-medida-da-informacao-digital",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre unidades de medida da informação digital: bits, bytes, KB, KiB, MB, GB, TB, velocidade e armazenamento. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Lógica Booleana: Tabelas-Verdade e Equivalências — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/logica-de-programacao/logica-booleana-tabelas-verdade-e-equivalencias",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em lógica booleana com tabelas-verdade, equivalências, conectivos lógicos, leis de De Morgan e circuitos. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "JWT em APIs Back-end: Segurança e Validação — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-back-end/jwt-em-apis-back-end-seguranca-e-validacao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre JWT em APIs back-end: autenticação, validação, claims, assinatura, tokens e segurança. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Segurança Funcional em Células Robóticas Industriais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/robotica-e-arduino/seguranca-funcional-em-celulas-roboticas-industriais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre segurança funcional em células robóticas industriais, ISO 13849-1, paradas de emergência e dispositivos de proteção. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Comunicação e Qualidade de Serviço no ROS 2 — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/robotica-e-arduino/comunicacao-e-qualidade-de-servico-no-ros-2",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre comunicação no ROS 2, QoS, nós, tópicos, serviços, ações, executores, namespaces e rosbag2. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Visão Computacional para Inspeção e Orientação de Robôs Industriais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/robotica-e-arduino/visao-computacional-para-inspecao-e-orientacao-de-robos-industriais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em visão computacional para inspeção, calibração, iluminação e orientação de robôs industriais. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Cinemática de Manipuladores Robóticos Industriais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/robotica-e-arduino/cinematica-de-manipuladores-roboticos-industriais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em cinemática de manipuladores robóticos industriais, cinemática direta e inversa, Jacobiana, TCP e espaço de trabalho. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Lógica Ladder e Operação de CLPs em Automação Industrial — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/robotica-e-arduino/logica-ladder-e-operacao-de-clps-em-automacao-industrial",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em Lógica Ladder, CLPs e automação industrial com questões sobre temporizadores, contadores, intertravamentos e sinais. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Type Hints e Verificação Estática com mypy em Python — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/python-ruby-java/type-hints-e-verificacao-estatica-com-mypy-em-python",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre type hints em Python, mypy, tipagem estática, Protocol, TypedDict, generics e anotações de tipos. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gerenciadores de Contexto e Controle de Recursos em Python — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/python-ruby-java/gerenciadores-de-contexto-e-controle-de-recursos-em-python",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gerenciadores de contexto em Python, with, contextlib, ExitStack, recursos assíncronos e tratamento de exceções. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Geradores e Iteradores em Python — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/python-ruby-java/geradores-e-iteradores-em-python",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre geradores e iteradores em Python, incluindo yield, protocolo de iteração, memória, itertools e expressões geradoras. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Decoradores em Python: Criação, Composição e Boas Práticas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/python-ruby-java/decoradores-em-python-criacao-composicao-e-boas-praticas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre decoradores em Python: criação, composição, functools.wraps, argumentos, propriedades, classes e funções assíncronas. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Concorrência Assíncrona com asyncio em Python — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/python-ruby-java/concorrencia-assincrona-com-asyncio-em-python",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre concorrência assíncrona com asyncio em Python, incluindo corrotinas, event loop, tarefas e sincronização. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Agendamento de Tarefas no Linux com Cron — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ferramentas-de-ti/agendamento-de-tarefas-no-linux-com-cron",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre agendamento de tarefas no Linux com Cron, crontab, expressões, logs, permissões e boas práticas. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Uso do DBeaver para Consultas e Administração de Bancos de Dados — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ferramentas-de-ti/uso-do-dbeaver-para-consultas-e-administracao-de-bancos-de-dados",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre DBeaver, consultas SQL, conexões, transações e administração de bancos de dados com este questionário. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gerenciamento de Pacotes Linux com APT — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ferramentas-de-ti/gerenciamento-de-pacotes-linux-com-apt",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gerenciamento de pacotes Linux com APT, comandos, repositórios, dependências, atualizações e segurança. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Produtividade e Configuração no Visual Studio Code — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ferramentas-de-ti/produtividade-e-configuracao-no-visual-studio-code",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre produtividade e configuração no Visual Studio Code, com atalhos, extensões, IntelliSense e recursos do editor. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Testes e Desenvolvimento de APIs com Postman — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ferramentas-de-ti/testes-e-desenvolvimento-de-apis-com-postman",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre APIs e Postman: métodos HTTP, autenticação JWT, variáveis, testes, coleções, Newman e mocks. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Arquitetura Entity Component System em Jogos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-games/arquitetura-entity-component-system-em-jogos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre arquitetura Entity Component System (ECS) em jogos, entidades, componentes, sistemas, arquétipos e desempenho. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Rollback Netcode em Jogos Multijogador — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-games/rollback-netcode-em-jogos-multijogador",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre rollback netcode em jogos multijogador, simulação determinística, previsão de entradas e sincronização online. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Máquinas de Estados Finitos para IA de NPCs — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-games/maquinas-de-estados-finitos-para-ia-de-npcs",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre máquinas de estados finitos para IA de NPCs, transições, hierarquias, padrões e decisões em jogos. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Busca de Caminhos e Navegação de Agentes em Jogos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-games/busca-de-caminhos-e-navegacao-de-agentes-em-jogos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre busca de caminhos, A*, navmesh, heurísticas e navegação de agentes em jogos. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Detecção e Resposta de Colisões 2D em Jogos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-games/deteccao-e-resposta-de-colisoes-2d-em-jogos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre detecção e resposta de colisões 2D em jogos: AABB, círculos, SAT, raycast, triggers e física. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Formatação Condicional no Microsoft Excel — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/pacote-office/formatacao-condicional-no-microsoft-excel",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre formatação condicional no Excel: regras, fórmulas, escalas de cores, prioridades e destaque de dados. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Validação de Dados no Microsoft Excel — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/pacote-office/validacao-de-dados-no-microsoft-excel",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre Validação de Dados no Microsoft Excel, listas, regras, alertas de erro, fórmulas personalizadas e proteção de planilhas. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Criação e Personalização de Gráficos no Excel — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/pacote-office/criacao-e-personalizacao-de-graficos-no-excel",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre criação e personalização de gráficos no Excel, incluindo tipos de gráficos, eixos, tendências e análise de dados. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Tabelas Dinâmicas no Excel: Análise e Organização de Dados — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/pacote-office/tabelas-dinamicas-no-excel-analise-e-organizacao-de-dados",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre Tabelas Dinâmicas no Excel: análise de dados, filtros, segmentação, campos calculados e gráficos dinâmicos. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Power Query no Excel: Importação e Transformação de Dados — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/pacote-office/power-query-no-excel-importacao-e-transformacao-de-dados",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre Power Query no Excel: importação, transformação, mesclagem, atualização e análise de dados. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Testes de Resiliência com Engenharia do Caos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/testes-de-software/testes-de-resiliencia-com-engenharia-do-caos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre engenharia do caos, resiliência de sistemas, observabilidade, falhas controladas e qualidade de software. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Teste de Mutação para Avaliar a Qualidade dos Testes — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/testes-de-software/teste-de-mutacao-para-avaliar-a-qualidade-dos-testes",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre teste de mutação, escore de mutação, mutantes equivalentes e qualidade de testes de software. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Testes Baseados em Propriedades com Geração de Dados — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/testes-de-software/testes-baseados-em-propriedades-com-geracao-de-dados",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre testes baseados em propriedades, geração de dados, shrinking, testes metamórficos e cobertura de casos. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Testes de Acessibilidade em Aplicações Web — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/testes-de-software/testes-de-acessibilidade-em-aplicacoes-web",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre acessibilidade web, WCAG, teclado, contraste, ARIA, leitores de tela e boas práticas de inclusão. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Testes de Contrato em APIs e Microsserviços — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/testes-de-software/testes-de-contrato-em-apis-e-microsservicos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre testes de contrato em APIs e microsserviços, compatibilidade, OpenAPI, CI/CD, Pact e integração entre serviços. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Change Data Capture (CDC) em Bancos de Dados — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/banco-de-dados/change-data-capture-cdc-em-bancos-de-dados",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre Change Data Capture (CDC) em bancos de dados, logs de transações, eventos, snapshots, conectores e integração de dados. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Desenvolvimento Seguro e Eficiente de Stored Procedures — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/banco-de-dados/desenvolvimento-seguro-e-eficiente-de-stored-procedures",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre desenvolvimento seguro e eficiente de stored procedures, SQL, transações, parâmetros e boas práticas. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gatilhos (Triggers) em Bancos de Dados Relacionais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/banco-de-dados/gatilhos-triggers-em-bancos-de-dados-relacionais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gatilhos em bancos de dados relacionais: triggers, auditoria, validação, transações, OLD, NEW e UPDATE. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Particionamento Declarativo de Tabelas no PostgreSQL — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/banco-de-dados/particionamento-declarativo-de-tabelas-no-postgresql",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre particionamento declarativo de tabelas no PostgreSQL, incluindo RANGE, LIST, HASH, pruning e subpartições. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Backup e Recuperação de Bancos de Dados — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/banco-de-dados/backup-e-recuperacao-de-bancos-de-dados",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre backup e recuperação de bancos de dados, RPO, RTO, logs, snapshots e estratégias de proteção de dados. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Configuração e Funcionamento de VLANs e Trunks 802.1Q — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/redes-de-computadores/configuracao-e-funcionamento-de-vlans-e-trunks-802-1q",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre VLANs, trunks 802.1Q, segmentação de redes, VLAN nativa, inter-VLAN routing e segurança em switches. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Análise de Logs HTTP para Diagnóstico de Servidores Web — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/redes-de-computadores/analise-de-logs-http-para-diagnostico-de-servidores-web",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em análise de logs HTTP, códigos de status, latência, segurança e diagnóstico de servidores web. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Fundamentos de Balanceamento de Carga em Servidores Web — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/redes-de-computadores/fundamentos-de-balanceamento-de-carga-em-servidores-web",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre balanceamento de carga em servidores web, algoritmos, alta disponibilidade, TLS, sessões e roteamento HTTP. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Endereçamento IPv4 e Cálculo de Sub-redes CIDR — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/redes-de-computadores/enderecamento-ipv4-e-calculo-de-sub-redes-cidr",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em endereçamento IPv4, máscaras CIDR, sub-redes, broadcast, hosts utilizáveis, sumarização e roteamento. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Implementação Segura de TLS e HTTPS em Servidores Web — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/redes-de-computadores/implementacao-segura-de-tls-e-https-em-servidores-web",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre implementação segura de TLS e HTTPS, certificados digitais, HSTS, SNI, mTLS e proteção de servidores web. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Testes Automatizados em Aplicativos Móveis — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-aplicativos/testes-automatizados-em-aplicativos-moveis",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre testes automatizados em aplicativos móveis, incluindo testes unitários, UI, APIs, CI, cobertura e regressão. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Autenticação Segura e Gerenciamento de Sessões em Aplicativos Móveis — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-aplicativos/autenticacao-segura-e-gerenciamento-de-sessoes-em-aplicativos-moveis",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre autenticação segura, OAuth 2.0, PKCE, JWT, biometria e gerenciamento de sessões em aplicativos móveis. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Acessibilidade em Aplicativos Móveis — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-aplicativos/acessibilidade-em-aplicativos-moveis",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre acessibilidade em aplicativos móveis: contraste, leitores de tela, foco, gestos, legendas e WCAG. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Armazenamento Offline e Sincronização de Dados em Aplicativos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-aplicativos/armazenamento-offline-e-sincronizacao-de-dados-em-aplicativos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre armazenamento offline, sincronização de dados, arquitetura offline-first, conflitos, filas e segurança em aplicativos. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gerenciamento de Estado e Fluxo de Dados no SwiftUI — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-de-aplicativos/gerenciamento-de-estado-e-fluxo-de-dados-no-swiftui",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gerenciamento de estado e fluxo de dados no SwiftUI, com @State, @Binding, ObservableObject, Observation e EnvironmentObject. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Web Components: Custom Elements, Shadow DOM e Slots — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-web/web-components-custom-elements-shadow-dom-e-slots",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre Web Components, Custom Elements, Shadow DOM, slots, templates e eventos em JavaScript. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "TypeScript Aplicado ao Desenvolvimento Front-End — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-web/typescript-aplicado-ao-desenvolvimento-front-end",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em TypeScript para front-end: tipos, interfaces, generics, eventos DOM, strictNullChecks e segurança no código. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Layouts Modernos com CSS Grid — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-web/layouts-modernos-com-css-grid",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em CSS Grid: layouts responsivos, colunas, áreas, alinhamento, subgrid, auto-fit, minmax e propriedades avançadas. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Otimização de Imagens para Performance Web — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-web/otimizacao-de-imagens-para-performance-web",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre otimização de imagens para performance web, formatos, compressão, imagens responsivas, lazy loading e SEO. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Acessibilidade Web: HTML Semântico e ARIA — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Desenvolvimento Web & Mobile",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/desenvolvimento-web/acessibilidade-web-html-semantico-e-aria",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em acessibilidade web com HTML semântico e ARIA: navegação, formulários, foco, imagens e leitores de tela. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado: Manutenção de Software para Computadores — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/manutencao-de-computadores/simulado-manutencao-de-software-para-computadores",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em manutenção de computadores: BIOS, drivers, overclock, disco rígido, CPU, limpeza e segurança de dados. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Manutenção de Periféricos em Computadores — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/manutencao-de-computadores/simulado-sobre-manutencao-de-perifericos-em-computadores",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre manutenção de periféricos de computador, incluindo impressoras, monitores, teclados, mouse, scanner e USB. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Curso de Manutenção de Computadores: Otimização de Desempenho — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/manutencao-de-computadores/curso-de-manutencao-de-computadores-otimizacao-de-desempenho",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em manutenção de computadores e otimização de desempenho, com foco em hardware, software, limpeza e segurança. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Ferramentas de TI: Uso de Software de Virtualização — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ferramentas-de-ti/simulado-sobre-ferramentas-de-ti-uso-de-software-de-virtualizacao",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em virtualização, máquinas virtuais, hypervisors, snapshots e otimização de desempenho de VMs. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Ferramentas de TI: Uso de PowerShell — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "DevOps, Cloud & Infraestrutura",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ferramentas-de-ti/simulado-sobre-ferramentas-de-ti-uso-de-powershell",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Simulado de PowerShell para testar comandos, scripts, cmdlets, variáveis, módulos e administração de serviços em TI. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Escrituração Contábil pelo Método das Partidas Dobradas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/contabilidade/escrituracao-contabil-pelo-metodo-das-partidas-dobradas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre escrituração contábil pelo método das partidas dobradas, lançamentos, razonetes, balancete e contas patrimoniais. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gestão de Estoques para Pequenos Negócios — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/administracao/gestao-de-estoques-para-pequenos-negocios",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em gestão de estoques para pequenos negócios: giro, curva ABC, ponto de pedido, PEPS e inventário. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Controle Integrado de Mudanças em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/controle-integrado-de-mudancas-em-projetos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre controle integrado de mudanças em projetos, linha de base, governança, aprovação e gestão de escopo. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Federalismo e Relações Intergovernamentais no Brasil — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-publica/federalismo-e-relacoes-intergovernamentais-no-brasil",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre federalismo brasileiro, competências constitucionais e relações intergovernamentais entre União, estados e municípios. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gerenciamento de Aquisições e Contratos em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/gerenciamento-de-aquisicoes-e-contratos-em-projetos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gerenciamento de aquisições e contratos em projetos, fornecedores, licitações, riscos e encerramento contratual. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Juros Compostos e Valor do Dinheiro no Tempo — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/investimentos/juros-compostos-e-valor-do-dinheiro-no-tempo",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre juros compostos, valor presente, inflação, taxas efetivas, aportes, VPL e rentabilidade real. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Estratégias de Fidelização de Clientes em E-commerce — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/vendas/estrategias-de-fidelizacao-de-clientes-em-e-commerce",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre fidelização de clientes em e-commerce, programas de lealdade, atendimento e experiência omnichannel. Módulo com 5 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Estratégias Avançadas de Negociação em Vendas Online — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/vendas/estrategias-avancadas-de-negociacao-em-vendas-online",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em estratégias avançadas de negociação, vendas online, objeções, cross-selling, follow-up e conversão. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Estratégias de Precificação em Vendas Online — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/vendas/estrategias-de-precificacao-em-vendas-online",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre estratégias de precificação em vendas online, preço dinâmico, valor percebido, segmentação e competitividade. Módulo com 8 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Conhecimentos Básicos de Vendas Online — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/vendas/conhecimentos-basicos-de-vendas-online",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos básicos de vendas online: e-commerce, SEO, loja virtual, pagamentos, redes sociais e experiência do cliente. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Entendendo o Funil de Vendas para E-commerce — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/vendas/entendendo-o-funil-de-vendas-para-e-commerce",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre funil de vendas para e-commerce, conversão, leads, retenção de clientes e estratégias para vender mais online. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Dominando o Atendimento ao Cliente em Vendas Online — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/vendas/dominando-o-atendimento-ao-cliente-em-vendas-online",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre atendimento ao cliente em vendas online, e-commerce, suporte, comunicação personalizada e fidelização. Módulo com 5 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Dominando a Persuasão em Vendas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/vendas/dominando-a-persuasao-em-vendas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre persuasão em vendas: urgência, reciprocidade, storytelling, objeções e técnicas para aumentar conversões. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Gestão de Custos em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/simulado-sobre-gestao-de-custos-em-projetos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em gestão de custos em projetos: estimativas, EVM, CPI, baseline, contingências e controle de mudanças. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Gestão de Comunicação em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/simulado-sobre-gestao-de-comunicacao-em-projetos",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em gestão de comunicação em projetos com este simulado sobre planos, stakeholders, feedback e comunicação eficaz. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Gestão do Tempo em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/simulado-sobre-gestao-do-tempo-em-projetos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em gestão do tempo em projetos com este simulado sobre cronograma, caminho crítico, diagrama de Gantt e fast tracking. Módulo com 6 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado de Técnicas de Planejamento de Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/simulado-de-tecnicas-de-planejamento-de-projetos",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em técnicas de planejamento de projetos: EAP, cronograma, caminho crítico, custos, marcos e comunicação. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Gestão de Qualidade em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/simulado-sobre-gestao-de-qualidade-em-projetos",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em Gestão de Qualidade em Projetos com questões sobre PDCA, auditorias, controle, métricas e padrões de qualidade. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gestão de Recursos em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/gestao-de-recursos-em-projetos",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre gestão de recursos em projetos, planejamento, alocação, equipes e estratégias para aumentar a eficiência. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gerenciamento de Stakeholders em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/gerenciamento-de-stakeholders-em-projetos",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre gerenciamento de stakeholders em projetos: identificação, análise, comunicação, priorização e engajamento. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gerenciamento de Escopo em Projetos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-de-projetos/gerenciamento-de-escopo-em-projetos",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre gerenciamento de escopo em projetos, EAP, requisitos, mudanças e validação do escopo. Módulo com 9 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado de Economia do Desenvolvimento — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/economia-e-financas-empresariais/simulado-de-economia-do-desenvolvimento",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Simulado de Economia do Desenvolvimento: teste seus conhecimentos sobre pobreza, desigualdade, educação, infraestrutura e políticas econômicas. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado de Economia para Investimento Pessoal — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/economia-e-financas-empresariais/simulado-de-economia-para-investimento-pessoal",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos de economia para investimento pessoal: inflação, PIB, bancos centrais, oferta e demanda, impostos e câmbio. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Conceitos de Gestão Econômica e Estratégica — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/economia-e-financas-empresariais/conceitos-de-gestao-economica-e-estrategica",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gestão econômica e estratégica: custo de oportunidade, mercados financeiros, SWOT e vantagem competitiva. Módulo com 5 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado: Fundamentos de Economia Internacional — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/economia-e-financas-empresariais/simulado-fundamentos-de-economia-internacional",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em Economia Internacional: balança comercial, câmbio, protecionismo, tarifas, FMI e vantagem comparativa. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Curso de Economia Comportamental — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/economia-e-financas-empresariais/curso-de-economia-comportamental",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em Economia Comportamental: nudges, aversão à perda, efeito de ancoragem, emoções e decisões econômicas. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Noções Básicas de Finanças Públicas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/economia-e-financas-empresariais/nocoes-basicas-de-financas-publicas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em finanças públicas: orçamento, Tesouro Nacional, impostos, déficit, dívida pública e política fiscal. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Princípios da Política Monetária — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/economia-e-financas-empresariais/principios-da-politica-monetaria",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre princípios da política monetária, inflação, taxa de juros, banco central e medidas expansionistas e contracionistas. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Introdução à Microeconomia: Conceitos e Aplicações — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/economia-e-financas-empresariais/introducao-a-microeconomia-conceitos-e-aplicacoes",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em microeconomia: demanda, oferta, elasticidade, equilíbrio de mercado, monopólio e concorrência perfeita. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gestão Financeira no Setor Público — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-publica/gestao-financeira-no-setor-publico",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gestão financeira no setor público, orçamento público, receitas, despesas, auditoria e Lei de Responsabilidade Fiscal. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gestão de Projetos Públicos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-publica/gestao-de-projetos-publicos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em gestão de projetos públicos: planejamento, orçamento, riscos, stakeholders, cronograma e avaliação de resultados. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Avaliação de Políticas Públicas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-publica/simulado-sobre-avaliacao-de-politicas-publicas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos com o simulado sobre avaliação de políticas públicas, indicadores, impactos, dados e tomada de decisão. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Transparência e Prestação de Contas na Gestão Pública — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-publica/transparencia-e-prestacao-de-contas-na-gestao-publica",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre transparência e prestação de contas na gestão pública, controle social, ética, auditoria e prevenção à corrupção. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Desafios e Inovações na Administração Pública — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-publica/desafios-e-inovacoes-na-administracao-publica",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre desafios e inovações na administração pública, governança, tecnologia, transparência e gestão por resultados. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gestão de Liderança e Processos Públicos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-publica/gestao-de-lideranca-e-processos-publicos",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre gestão de liderança e processos públicos, ética, transparência, inovação e participação cidadã. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gestão de Crises na Administração Pública — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/gestao-publica/gestao-de-crises-na-administracao-publica",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre gestão de crises na administração pública, comunicação, liderança, planejamento e recuperação institucional. Módulo com 5 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Introdução ao Marketing Digital: Dicas para Otimizar Sua Presença Online — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/marketing-digital/introducao-ao-marketing-digital-dicas-para-otimizar-sua-presenca-online",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em marketing digital: SEO, Google Analytics, redes sociais, PPC, branding, funil de vendas e email marketing. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Classificadores Nominais e Verbais em Mandarim — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/chines-mandarim/classificadores-nominais-e-verbais-em-mandarim",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre classificadores nominais e verbais em mandarim com exercícios práticos de medida, quantidade e repetição. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Nikud: Sinais Vocálicos e Leitura do Hebraico — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/hebraico/nikud-sinais-vocalicos-e-leitura-do-hebraico",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre nikud, sinais vocálicos e leitura do hebraico com questões sobre sheva, dagesh, holam e pronúncia. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Contadores Japoneses e Suas Leituras Irregulares — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/japones/contadores-japoneses-e-suas-leituras-irregulares",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre contadores japoneses, leituras irregulares, números e expressões para objetos, pessoas, animais, idade e datas. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Atuação do Intérprete de Libras em Palestras e Eventos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/libras/atuacao-do-interprete-de-libras-em-palestras-e-eventos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre a atuação do intérprete de Libras em palestras e eventos, com foco em acessibilidade, ética e comunicação. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Partículas Básicas da Língua Japonesa — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-idiomas/particulas-basicas-da-lingua-japonesa",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre partículas básicas da língua japonesa, incluindo は, が, を, に, へ, の, と, も, から e まで. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Partículas Modais no Alemão Falado — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/alemao/particulas-modais-no-alemao-falado",
    "licenca": "gratuito",
    "nivel": "Avançado",
    "descricao": "Teste seus conhecimentos sobre partículas modais no alemão falado e compreenda usos de doch, denn, mal, ja, wohl, eben, ruhig, schon e bloß. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Pronúncia e Ortografia do Italiano: Sons e Grafias Essenciais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/italiano/pronuncia-e-ortografia-do-italiano-sons-e-grafias-essenciais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos de pronúncia e ortografia do italiano: sons, grafias, regras de c, sc, gn, gli e vocabulário essencial. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Inglês para Atendimento em Restaurantes — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ingles/ingles-para-atendimento-em-restaurantes",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seu inglês para atendimento em restaurantes: reservas, pedidos, alergias, cardápio, reclamações e cobrança em situações reais. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Falsos Cognatos em Inglês para Falantes de Português — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ingles/falsos-cognatos-em-ingles-para-falantes-de-portugues",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre falsos cognatos em inglês e evite erros comuns de tradução para falantes de português. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Phrasal Verbs Essenciais com Get, Take e Look — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ingles/phrasal-verbs-essenciais-com-get-take-e-look",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos de phrasal verbs essenciais com get, take e look em inglês com questões práticas e contextualizadas. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Inglês para Viagens: Aeroporto e Imigração — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/ingles/ingles-para-viagens-aeroporto-e-imigracao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seu inglês para viagens com perguntas sobre aeroporto, imigração, bagagem, conexão, embarque e alfândega. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Latim e as Suas Expressões na Música Sacra — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/latim/latim-e-as-suas-expressoes-na-musica-sacra",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre latim na música sacra, expressões litúrgicas, hinos, missa, cânticos e termos tradicionais. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Latim Avançado: Textos Jurídicos Antigos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/latim/latim-avancado-textos-juridicos-antigos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em Latim Jurídico Avançado com termos, princípios e expressões de textos jurídicos antigos. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Intervenção de Terceiros no Processo Civil segundo o CPC/2015 — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-processual-civil/intervencao-de-terceiros-no-processo-civil-segundo-o-cpc-2015",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre intervenção de terceiros no processo civil conforme o CPC/2015, incluindo assistência, denunciação e desconsideração. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Fundamentos e Aplicação da Lei Geral de Proteção de Dados (LGPD) — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/fundamentos-e-aplicacao-da-lei-geral-de-protecao-de-dados-lgpd",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre LGPD: princípios, bases legais, direitos dos titulares, segurança, ANPD e proteção de dados pessoais. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Decadência e Prescrição do Crédito Tributário — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-tributario/decadencia-e-prescricao-do-credito-tributario",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre decadência e prescrição do crédito tributário, prazos do CTN, lançamento, cobrança judicial e jurisprudência do STJ. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Incorporação Imobiliária e Patrimônio de Afetação — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-imobiliario/incorporacao-imobiliaria-e-patrimonio-de-afetacao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre incorporação imobiliária, patrimônio de afetação, memorial, contratos, prazos e direitos dos adquirentes. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Erro de Tipo e Erro de Proibição no Direito Penal — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/direito-penal/erro-de-tipo-e-erro-de-proibicao-no-direito-penal",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre erro de tipo e erro de proibição no Direito Penal, suas espécies, efeitos e aplicações práticas. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Direito Internacional Privado — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/simulado-sobre-direito-internacional-privado",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Simulado de Direito Internacional Privado com questões sobre jurisdição, conflitos de leis, nacionalidade, tratados e normas de aplicação imediata. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado Sobre Direito do Consumidor — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/simulado-sobre-direito-do-consumidor",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em Direito do Consumidor com questões sobre CDC, PROCON, publicidade enganosa, troca de produtos e práticas abusivas. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Direito Administrativo — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/simulado-sobre-direito-administrativo",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Simulado de Direito Administrativo com questões sobre atos, licitações, contratos, poder de polícia e princípios da administração pública. Módulo com 9 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Direito Contratual — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/simulado-sobre-direito-contratual",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Simulado de Direito Contratual com questões sobre contratos bilaterais, nulidade, adesão, resilição e princípios contratuais. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Direito Penal — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/simulado-sobre-direito-penal",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos com este simulado de Direito Penal sobre legalidade, dolo, culpa, penas, legítima defesa, prescrição e habeas corpus. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado Sobre Direito Ambiental — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/simulado-sobre-direito-ambiental",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos com o simulado de Direito Ambiental sobre sustentabilidade, políticas públicas, conservação e poluidor-pagador. Módulo com 6 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Direito das Coisas e Direito Agrário — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/simulado-sobre-direito-das-coisas-e-direito-agrario",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Simulado de Direito das Coisas e Direito Agrário: teste seus conhecimentos sobre posse, propriedade, usucapião rural, servidões e desapropriação. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado Sobre Direito Eclesiástico — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-em-direito/simulado-sobre-direito-eclesiastico",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em Direito Eclesiástico: liberdade religiosa, Estado laico, concordatos e princípios constitucionais no Brasil. Módulo com 6 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Variação Linguística e Adequação aos Contextos de Uso — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/portugues/variacao-linguistica-e-adequacao-aos-contextos-de-uso",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre variação linguística, norma-padrão, preconceito linguístico e adequação da linguagem aos contextos de uso. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Parábolas na Geometria Analítica — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Exatas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/matematica/parabolas-na-geometria-analitica",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre parábolas na Geometria Analítica: foco, diretriz, vértice, equações, tangentes e interseções. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Indução Eletromagnética: Leis de Faraday e Lenz — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Exatas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/fisica/inducao-eletromagnetica-leis-de-faraday-e-lenz",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre indução eletromagnética, leis de Faraday e Lenz, fluxo magnético, transformadores, indutores e circuitos RL. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Construção da Proposta de Intervenção na Redação do ENEM — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/redacao/construcao-da-proposta-de-intervencao-na-redacao-do-enem",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre a proposta de intervenção na redação do ENEM: agentes, ações, meios, finalidades e direitos humanos. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Ácidos e Bases em Solução: pH, Tampões e Titulações — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Exatas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/quimica/acidos-e-bases-em-solucao-ph-tampoes-e-titulacoes",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre ácidos e bases: pH, pKa, soluções tampão, titulações, indicadores e teorias de Arrhenius e Brønsted-Lowry. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "O Processo de Independência do Brasil (1808-1825) — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/historia/o-processo-de-independencia-do-brasil-1808-1825",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre a Independência do Brasil (1808-1825), da chegada da corte portuguesa à Constituição de 1824. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Indústria Cultural e Cultura de Massa — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/sociologia/industria-cultural-e-cultura-de-massa",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre indústria cultural e cultura de massa, com conceitos de Adorno, Horkheimer, mídia, consumo e cultura digital. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Cinética Química: Velocidade, Leis de Velocidade e Catálise — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Exatas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/quimica/cinetica-quimica-velocidade-leis-de-velocidade-e-catalise",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em cinética química: velocidade das reações, leis de velocidade, energia de ativação, Arrhenius e catálise. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Análise Combinatória: Princípios e Técnicas de Contagem — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Exatas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/matematica/analise-combinatoria-principios-e-tecnicas-de-contagem",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em análise combinatória com princípios de contagem, permutações, combinações, arranjos, anagramas e caminhos. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Medidas de Tempo no Cotidiano: Relógios, Calendários e Duração — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/fundamental/medidas-de-tempo-no-cotidiano-relogios-calendarios-e-duracao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre medidas de tempo, relógios, calendários, horas, minutos, semanas e duração de atividades. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Métodos de Pesquisa Sociológica — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/sociologia/metodos-de-pesquisa-sociologica",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre métodos de pesquisa sociológica, amostragem, análise de dados, ética e desenhos de pesquisa. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Teoria dos Números: Divisibilidade e Congruências — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Exatas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/matematica/teoria-dos-numeros-divisibilidade-e-congruencias",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em teoria dos números com questões de divisibilidade, MDC, MMC, números primos, congruências e algoritmo de Euclides. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Porcentagem no Cotidiano: Descontos, Acréscimos e Proporções — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/fundamental/porcentagem-no-cotidiano-descontos-acrescimos-e-proporcoes",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre porcentagem no cotidiano: descontos, acréscimos, juros, proporções e interpretação de gráficos. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Métodos de Amostragem e Vieses em Pesquisas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Exatas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/estatistica-e-probabilidade/metodos-de-amostragem-e-vieses-em-pesquisas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre métodos de amostragem, vieses em pesquisas, margem de erro, ponderação e desenho amostral. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Auxílio-Acidente no Regime Geral de Previdência Social — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-inss/auxilio-acidente-no-regime-geral-de-previdencia-social",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre auxílio-acidente no RGPS: requisitos, carência, valor, início, acumulação, cessação e abono anual. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Raciocínio Lógico com Calendários e Dias da Semana — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/raciocinio-logico/raciocinio-logico-com-calendarios-e-dias-da-semana",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seu raciocínio lógico com calendários e dias da semana. Resolva questões sobre datas, anos bissextos, meses e contagem de dias. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Identificação Criminal segundo a Lei nº 12.037/2009 — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-policia-civil/identificacao-criminal-segundo-a-lei-no-12-037-2009",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre identificação criminal na Lei nº 12.037/2009, documentos civis, perfil genético, garantias e procedimentos legais. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Identificação Veicular e Detecção de Adulterações na Fiscalização da PRF — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-policia-rodoviaria-federal/identificacao-veicular-e-deteccao-de-adulteracoes-na-fiscalizacao-da-prf",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre identificação veicular, VIN, chassi, CRLV-e e detecção de adulterações na fiscalização da PRF. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Acessibilidade Digital para Concursos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/informatica-para-concursos/acessibilidade-digital-para-concursos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em acessibilidade digital para concursos, com questões sobre WCAG, eMAG, HTML semântico, ARIA e tecnologias assistivas. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Atendimento Pré-Hospitalar em Emergências no Ambiente Prisional — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/policia-penal/atendimento-pre-hospitalar-em-emergencias-no-ambiente-prisional",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em atendimento pré-hospitalar no ambiente prisional: RCP, engasgo, convulsões, trauma, AVC e primeiros socorros. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Fundamentos de Arquivologia para Concursos Públicos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/outros-concursos/fundamentos-de-arquivologia-para-concursos-publicos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em Arquivologia para concursos públicos: gestão documental, protocolo, classificação, temporalidade e princípios arquivísticos. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Ventilação Tática em Incêndios Estruturais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-bombeiro-civil/ventilacao-tatica-em-incendios-estruturais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre ventilação tática em incêndios estruturais, fluxo de gases, controle de portas e segurança operacional. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Prevenção à Lavagem de Dinheiro e ao Financiamento do Terrorismo no Setor Bancário — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-banco-do-brasil/prevencao-a-lavagem-de-dinheiro-e-ao-financiamento-do-terrorismo-no-setor-bancario",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre prevenção à lavagem de dinheiro e financiamento do terrorismo no setor bancário, com foco em PLD/FTP. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Recursos Trabalhistas no Âmbito dos TRTs — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-tecnico-judiciario/recursos-trabalhistas-no-ambito-dos-trts",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre recursos trabalhistas nos TRTs, incluindo recurso ordinário, agravo, embargos, revista e depósito recursal. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Aposentadoria Especial por Exposição a Agentes Nocivos no INSS — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-inss/aposentadoria-especial-por-exposicao-a-agentes-nocivos-no-inss",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre aposentadoria especial no INSS, PPP, LTCAT, agentes nocivos, regras da EC 103/2019 e exposição ocupacional. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Fiscalização do Transporte Rodoviário de Produtos Perigosos pela PRF — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-policia-rodoviaria-federal/fiscalizacao-do-transporte-rodoviario-de-produtos-perigosos-pela-prf",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre fiscalização PRF no transporte rodoviário de produtos perigosos, normas ANTT, segurança e resposta a emergências. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Mapas e Cartografia no IBGE — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-ibge/simulado-sobre-mapas-e-cartografia-no-ibge",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre mapas e cartografia do IBGE: escalas, mapas temáticos, topográficos, precisão e classificação cartográfica. Módulo com 5 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre História e Funções do IBGE — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/preparatorio-ibge/simulado-sobre-historia-e-funcoes-do-ibge",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre a história, funções e pesquisas do IBGE com este simulado de Geografia e atualidades. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Reabilitação Fisioterapêutica de Pacientes com Queimaduras — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/fisioterapia/reabilitacao-fisioterapeutica-de-pacientes-com-queimaduras",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre reabilitação fisioterapêutica em queimaduras: posicionamento, cicatrizes, órteses, mobilidade e prevenção de contraturas. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Gerenciamento de Resíduos de Serviços de Saúde segundo a RDC nº 222/2018 — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/legislacao-na-saude/gerenciamento-de-residuos-de-servicos-de-saude-segundo-a-rdc-no-222-2018",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre gerenciamento de resíduos de serviços de saúde conforme a RDC nº 222/2018, PGRSS e classificação de resíduos. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Avaliação Laboratorial da Hemostasia e Coagulação — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/biomedicina/avaliacao-laboratorial-da-hemostasia-e-coagulacao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre avaliação laboratorial da hemostasia e coagulação, coagulograma, TTPa, TP/INR, plaquetas e anticoagulantes. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Termogênese Adaptativa e Platôs no Emagrecimento — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/nutricao/termogenese-adaptativa-e-platos-no-emagrecimento",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre termogênese adaptativa, NEAT, gasto energético e platôs no emagrecimento com este questionário. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Fundamentos de Psicometria: Precisão, Validade e Interpretação de Testes — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/psicologia/fundamentos-de-psicometria-precisao-validade-e-interpretacao-de-testes",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em psicometria: precisão, validade, percentis, Teoria Clássica dos Testes e TRI na avaliação psicológica. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Farmacologia dos Anestésicos Locais — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/farmacologia/farmacologia-dos-anestesicos-locais",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em farmacologia dos anestésicos locais: mecanismo de ação, metabolismo, toxicidade, bloqueio nervoso e aplicações clínicas. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Primeiros Socorros em Intoxicações por Produtos Domésticos — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/primeiros-socorros/primeiros-socorros-em-intoxicacoes-por-produtos-domesticos",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre primeiros socorros em intoxicações por produtos domésticos, prevenção, descontaminação e condutas de emergência. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Microbiota intestinal, fibras fermentáveis e controle do peso — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/nutricao/microbiota-intestinal-fibras-fermentaveis-e-controle-do-peso",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre microbiota intestinal, fibras fermentáveis, prebióticos, probióticos, amido resistente e controle do peso. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Crononutrição e Ritmos Circadianos no Controle do Peso — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/nutricao/crononutricao-e-ritmos-circadianos-no-controle-do-peso",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre crononutrição, ritmos circadianos, jejum, sono e estratégias alimentares para o controle do peso. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Leitura de Rótulos para Escolhas Alimentares no Emagrecimento — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/nutricao/leitura-de-rotulos-para-escolhas-alimentares-no-emagrecimento",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre leitura de rótulos, calorias, ingredientes, açúcares e escolhas alimentares para emagrecer com mais consciência. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Farmacologia em Biomedicina — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/biomedicina/simulado-sobre-farmacologia-em-biomedicina",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em farmacologia para Biomedicina: receptores, fármacos, metabolismo, efeitos terapêuticos e adversos. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Biotecnologia em Biomedicina — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/biomedicina/simulado-sobre-biotecnologia-em-biomedicina",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em biotecnologia aplicada à biomedicina: engenharia genética, OGMs, CRISPR-Cas9, vacinas e terapia gênica. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Métodos em Bioquímica na Biomedicina — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/biomedicina/simulado-sobre-metodos-em-bioquimica-na-biomedicina",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em métodos de bioquímica na biomedicina: ELISA, HPLC, PCR, Western Blot, centrifugação e mais. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado: Patologia na Biomedicina — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/biomedicina/simulado-patologia-na-biomedicina",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em Patologia na Biomedicina com questões sobre neoplasias, inflamação, apoptose, câncer e sistema linfático. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Microbiologia na Biomedicina — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/biomedicina/simulado-sobre-microbiologia-na-biomedicina",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em microbiologia aplicada à Biomedicina com questões sobre vírus, bactérias, culturas, esterilização e microbiota. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Simulado sobre Histologia em Biomedicina — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências & Saúde",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/biomedicina/simulado-sobre-histologia-em-biomedicina",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos em Histologia aplicada à Biomedicina com questões sobre tecidos, células, sangue, músculos, tendões e ligamentos. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Contraponto Aplicado à Criação de Linhas de Baixo — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/baixo/contraponto-aplicado-a-criacao-de-linhas-de-baixo",
    "licenca": "gratuito",
    "nivel": "Avançado",
    "descricao": "Teste seus conhecimentos sobre contraponto aplicado à criação de linhas de baixo, condução de vozes, harmonia, ritmo e independência melódica. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Articulação no Saxofone e na Flauta — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/saxofone/articulacao-no-saxofone-e-na-flauta",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre articulação no saxofone e na flauta: legato, staccato, acentos, língua, ar, frulato e articulação dupla. Módulo com 18 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Leitura de Partituras e Notação Rítmica para Bateria — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/bateria/leitura-de-partituras-e-notacao-ritmica-para-bateria",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos de leitura de partituras para bateria, notação rítmica, compassos, pausas, tercinas, ligaduras e repetições. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Ergonomia e Prevenção de Lesões para Violinistas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/violino/ergonomia-e-prevencao-de-lesoes-para-violinistas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre ergonomia para violinistas, postura, prevenção de lesões, prática saudável e proteção auditiva. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Técnicas de Pedalização no Piano e Teclado — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/piano-e-teclado/tecnicas-de-pedalizacao-no-piano-e-teclado",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre técnicas de pedalização no piano e teclado: sustain, una corda, sostenuto, meio pedal e trocas harmônicas. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Leitura à Primeira Vista Aplicada ao Violão — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/violao/leitura-a-primeira-vista-aplicada-ao-violao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos de leitura à primeira vista no violão: notas, afinação, ritmo, armaduras de clave, digitação e sinais musicais. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Domínio do Sistema de Baixos Stradella — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/acordeon/dominio-do-sistema-de-baixos-stradella",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre o sistema de baixos Stradella no acordeon: ciclo de quintas, acordes, contrabaixos e padrões de acompanhamento. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Dicção e Articulação no Canto em Português — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Idiomas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/canto/diccao-e-articulacao-no-canto-em-portugues",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre dicção e articulação no canto em português, com foco em vogais, consoantes, legato, agudos e clareza vocal. Módulo com 13 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Condução de Vozes a Quatro Partes na Harmonia Tonal — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/teoria-e-producao-musical/conducao-de-vozes-a-quatro-partes-na-harmonia-tonal",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre condução de vozes a quatro partes, harmonia tonal, duplicações, resoluções e regras de escrita coral. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Regulagem e Manutenção Preventiva do Baixo Elétrico — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/baixo/regulagem-e-manutencao-preventiva-do-baixo-eletrico",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre regulagem e manutenção preventiva do baixo elétrico: tensor, ação, entonação, captadores e limpeza. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Circuitos Passivos e Captação Elétrica da Guitarra — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/guitarra/circuitos-passivos-e-captacao-eletrica-da-guitarra",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre circuitos passivos de guitarra, captadores, humbuckers, tone, volume, coil split e elétrica musical. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Entendendo a Manutenção do Acordeon — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/acordeon/entendendo-a-manutencao-do-acordeon",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre manutenção de acordeon: limpeza, fole, palhetas, teclas, alças e cuidados para conservar o instrumento. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Improvisação Criativa no Acordeon — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/acordeon/improvisacao-criativa-no-acordeon",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre improvisação criativa no acordeon, tonalidades, acordes e técnicas para desenvolver solos musicais. Módulo com 5 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Teoria Musical Aplicada ao Acordeon — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/acordeon/teoria-musical-aplicada-ao-acordeon",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos de teoria musical aplicada ao acordeon: escalas, intervalos, baixos, fole, acordes e técnicas de execução. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Explorando a Dinâmica do Acordeon — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/acordeon/explorando-a-dinamica-do-acordeon",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Teste seus conhecimentos sobre acordeon: baixos, fole, registros, tipos de instrumento, timbre, teoria musical e estilos associados. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Conhecimentos Básicos e Intermediários de Acordeon — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/acordeon/conhecimentos-basicos-e-intermediarios-de-acordeon",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos básicos e intermediários de acordeon: técnica, postura, fole, baixos, registros, escalas e acordes. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Instalações Prediais de Esgoto Sanitário — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/construcao-civil/instalacoes-prediais-de-esgoto-sanitario",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre instalações prediais de esgoto sanitário, ventilação, declividade, caixas de inspeção e dimensionamento. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Segurança em Espaços Confinados conforme a NR-33 — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Ciências Humanas",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/seguranca-do-trabalho/seguranca-em-espacos-confinados-conforme-a-nr-33",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre segurança em espaços confinados conforme a NR-33, PET, avaliação atmosférica, vigia, ventilação e resgate. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Parafusos, Roscas e Controle de Torque na Montagem de Celulares — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/manutencao-de-celular/parafusos-roscas-e-controle-de-torque-na-montagem-de-celulares",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre parafusos, roscas e controle de torque na montagem de celulares com boas práticas de reparo técnico. Módulo com 12 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Instalação e Regulagem de Ferragens para Móveis — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/marcenaria/instalacao-e-regulagem-de-ferragens-para-moveis",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre instalação e regulagem de ferragens para móveis, incluindo dobradiças, corrediças, pistões e conectores. Módulo com 15 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Inspeção e Manutenção de Pneus e Rodas de Motocicletas — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/manutencao-de-motos/inspecao-e-manutencao-de-pneus-e-rodas-de-motocicletas",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre inspeção e manutenção de pneus e rodas de motocicletas: pressão, desgaste, balanceamento, reparos e segurança. Módulo com 20 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Acessibilidade e Inclusão em Meios de Hospedagem — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/hotelaria/acessibilidade-e-inclusao-em-meios-de-hospedagem",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre acessibilidade e inclusão em meios de hospedagem, atendimento, desenho universal e práticas para hotéis acessíveis. Módulo com 16 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Técnicas de Quilling em Papel: Formas, Montagem e Acabamento — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Comunicação & Artes",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/artesanato/tecnicas-de-quilling-em-papel-formas-montagem-e-acabamento",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre técnicas de quilling em papel: formas, espirais, montagem, cola, acabamento e conservação de peças. Módulo com 17 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Leitura e Interpretação de Plantas de Imóveis — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/corretor-de-imoveis/leitura-e-interpretacao-de-plantas-de-imoveis",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre leitura e interpretação de plantas de imóveis, escalas, cotas, cortes, fachadas e símbolos arquitetônicos. Módulo com 19 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Produção e Edição de Notícias para Rádio — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/jornalismo/producao-e-edicao-de-noticias-para-radio",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre produção e edição de notícias para rádio, linguagem radiojornalística, roteiro, sonora, gravação e ética. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Triagem e Controle de Correspondências na Recepção — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/atendimento-secretariado-e-recepcao/triagem-e-controle-de-correspondencias-na-recepcao",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre triagem, protocolo, segurança e controle de correspondências na recepção corporativa. Módulo com 10 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Metrologia Dimensional Aplicada à Produção Industrial — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Gestão & Negócios",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/logistica/metrologia-dimensional-aplicada-a-producao-industrial",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos em metrologia dimensional aplicada à produção industrial, instrumentos, tolerâncias, calibração e controle de qualidade. Módulo com 14 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  },
  {
    "titulo": "Calibração Dimensional e Tolerâncias na Impressão 3D FDM — Exercícios & Simulado (Cursa)",
    "tipo": "exercicios",
    "area": "Tecnologia & Guias Digitais",
    "plataforma": "Cursa (Português)",
    "url": "https://cursa.app/pt/exercicios/grafica/calibracao-dimensional-e-tolerancias-na-impressao-3d-fdm",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Teste seus conhecimentos sobre calibração dimensional, tolerâncias, fluxo, folgas e precisão na impressão 3D FDM. Módulo com 11 questões de múltipla escolha e respostas explicadas para fixação de conteúdo e preparação para o certificado gratuito no Cursa."
  }
];

module.exports = { cursaExerciciosList };
