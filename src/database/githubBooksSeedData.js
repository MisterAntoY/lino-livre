/**
 * Acervo Curado e Higienizado de Livros Técnicos e Manuais Abertos via GitHub
 * Deduplicado e Unificado:
 * - BibliotecaDev: 109 livros (com capas originais SVG e PDFs diretos)
 * - Books Tech (italocamil0): 185 livros únicos (sem sobreposições ou duplicatas internas)
 * - Trilha Info: 12 guias e roadmaps visuais
 * - Guia de TI: 6 guias e roadmaps digitais
 * Total: 312 obras e guias técnicos únicos
 */

const githubBooks = [
  {
    "titulo": "A Regra é Não Ter Regras",
    "subtitulo": "A Netflix e a Cultura da Reinvenção",
    "autor": "Reed Hastings",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-aregraenaoterregras",
    "ano": 2020,
    "paginas": 231,
    "sinopse": "Obra de referência sobre A Regra é Não Ter Regras. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20Regra%20%C3%A9%20N%C3%A3o%20Ter%20Regras%20-%20A%20Netflix%20e%20a%20Cultura%20da%20Reinven%C3%A7%C3%A3o.svg",
    "leituras": 153,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/A%20Regra%20%C3%A9%20N%C3%A3o%20Ter%20Regras%20-%20A%20Netflix%20e%20a%20Cultura%20da%20Reinven%C3%A7%C3%A3o%20-%20Autor%20(Reed%20Hastings).pdf"
      }
    ]
  },
  {
    "titulo": "A Startup Enxuta",
    "subtitulo": null,
    "autor": "Eric Ries",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-astartupenxuta",
    "ano": 2020,
    "paginas": 324,
    "sinopse": "Obra de referência sobre A Startup Enxuta. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20Startup%20Enxuta.svg",
    "leituras": 580,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/A%20Startup%20Enxuta%20-%20Autor%20(Eric%20Ries).pdf"
      }
    ]
  },
  {
    "titulo": "A Web Mobile",
    "subtitulo": "Programe para um Mundo de Muitos Dispositivos",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awebmobile",
    "ano": 2020,
    "paginas": 275,
    "sinopse": "Obra de referência sobre A Web Mobile. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20Web%20Mobile%20-%20Programe%20para%20um%20Mundo%20de%20Muitos%20Dispositivos.svg",
    "leituras": 136,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/A%20Web%20Mobile%20-%20Programe%20para%20um%20Mundo%20de%20Muitos%20Dispositivos%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "A arte de dar feedback (Um guia acima da média",
    "subtitulo": "HBR) - Motive sua equipe. Melhore a comunicação. Estabeleça objetivos claros.",
    "autor": "Harvard Business Review",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-aartededarfeedbackumguiaacimadamedi",
    "ano": 2020,
    "paginas": 330,
    "sinopse": "Obra de referência sobre A arte de dar feedback (Um guia acima da média. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20arte%20de%20dar%20feedback%20(Um%20guia%20acima%20da%20m%C3%A9dia%20-%20HBR)%20-%20Motive%20sua%20equipe%20Melhore%20a%20comunica%C3%A7%C3%A3o%20Estabele%C3%A7a%20objetivos%20claros.svg",
    "leituras": 157,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/A%20arte%20de%20dar%20feedback%20(Um%20guia%20acima%20da%20m%C3%A9dia%20-%20HBR)%20-%20Motive%20sua%20equipe.%20Melhore%20a%20comunica%C3%A7%C3%A3o.%20Estabele%C3%A7a%20objetivos%20claros.%20-%20Autor%20(Harvard%20Business%20Review).pdf"
      }
    ]
  },
  {
    "titulo": "A jornada do empreendedor",
    "subtitulo": "O herói da nossa Era",
    "autor": "Casa do Código",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-ajornadadoempreendedor",
    "ano": 2020,
    "paginas": 284,
    "sinopse": "Obra de referência sobre A jornada do empreendedor. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20jornada%20do%20empreendedor%20-%20O%20her%C3%B3i%20da%20nossa%20Era.svg",
    "leituras": 189,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/A%20jornada%20do%20empreendedor%20-%20O%20her%C3%B3i%20da%20nossa%20Era%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "AWS Certified Cloud Practitioner Exam",
    "subtitulo": null,
    "autor": "Jon Bonso and Adrian Formaran",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awscertifiedcloudpractitionerexam",
    "ano": 2020,
    "paginas": 255,
    "sinopse": "Obra de referência sobre AWS Certified Cloud Practitioner Exam. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20Certified%20Cloud%20Practitioner%20Exam.svg",
    "leituras": 163,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20Certified%20Cloud%20Practitioner%20Exam%20-%20Autor%20(Jon%20Bonso%20and%20Adrian%20Formaran).pdf"
      }
    ]
  },
  {
    "titulo": "AWS Certified DevOps Engineer",
    "subtitulo": "Professional Certification and Beyond",
    "autor": "Adam Book",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awscertifieddevopsengineer",
    "ano": 2020,
    "paginas": 225,
    "sinopse": "Obra de referência sobre AWS Certified DevOps Engineer. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20Certified%20DevOps%20Engineer.svg",
    "leituras": 128,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20Certified%20DevOps%20Engineer%20-%20Professional%20Certification%20and%20Beyond%20-%20Autor%20(Adam%20Book).pdf"
      }
    ]
  },
  {
    "titulo": "AWS Certified DevOps Professional Engineer",
    "subtitulo": null,
    "autor": "Jon Bonso and Kenneth Samonte",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awscertifieddevopsprofessionalengin",
    "ano": 2020,
    "paginas": 234,
    "sinopse": "Obra de referência sobre AWS Certified DevOps Professional Engineer. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20Certified%20DevOps%20Professional%20Engineer.svg",
    "leituras": 130,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20Certified%20DevOps%20Professional%20Engineer%20-%20Autor%20(Jon%20Bonso%20and%20Kenneth%20Samonte).pdf"
      }
    ]
  },
  {
    "titulo": "AWS Certified Developer Associate Exam",
    "subtitulo": null,
    "autor": "Jon Bonso and Adrian Formaran",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awscertifieddeveloperassociateexam",
    "ano": 2020,
    "paginas": 286,
    "sinopse": "Obra de referência sobre AWS Certified Developer Associate Exam. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20Certified%20Developer%20Associate%20Exam.svg",
    "leituras": 175,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20Certified%20Developer%20Associate%20Exam%20-%20Autor%20(Jon%20Bonso%20and%20Adrian%20Formaran).pdf"
      }
    ]
  },
  {
    "titulo": "AWS Certified Security Specialty Exam",
    "subtitulo": null,
    "autor": "Jon Bonso and Carlo Acebedo",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awscertifiedsecurityspecialtyexam",
    "ano": 2020,
    "paginas": 233,
    "sinopse": "Obra de referência sobre AWS Certified Security Specialty Exam. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20Certified%20Security%20Specialty%20Exam.svg",
    "leituras": 145,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20Certified%20Security%20Specialty%20Exam%20-%20Autor%20(Jon%20Bonso%20and%20Carlo%20Acebedo).pdf"
      }
    ]
  },
  {
    "titulo": "AWS Certified Solutions Architect Associate SAA-C03",
    "subtitulo": null,
    "autor": "Jon Bonso",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awscertifiedsolutionsarchitectassoc",
    "ano": 2020,
    "paginas": 331,
    "sinopse": "Obra de referência sobre AWS Certified Solutions Architect Associate SAA-C03. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20Certified%20Solutions%20Architect%20Associate%20SAA-C03.svg",
    "leituras": 178,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20Certified%20Solutions%20Architect%20Associate%20SAA-C03%20-%20Autor%20(Jon%20Bonso).pdf"
      }
    ]
  },
  {
    "titulo": "AWS Certified Solutions Architect Professional",
    "subtitulo": null,
    "autor": "Jon Bonso and Adrian Formaran",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awscertifiedsolutionsarchitectprofe",
    "ano": 2020,
    "paginas": 213,
    "sinopse": "Obra de referência sobre AWS Certified Solutions Architect Professional. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20Certified%20Solutions%20Architect%20Professional.svg",
    "leituras": 133,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20Certified%20Solutions%20Architect%20Professional%20-%20Autor%20(Jon%20Bonso%20and%20Adrian%20Formaran).pdf"
      }
    ]
  },
  {
    "titulo": "AWS Certified SysOps Administrator Associate Version 2",
    "subtitulo": null,
    "autor": "Jon Bonso and Lervin John Obando",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awscertifiedsysopsadministratorasso",
    "ano": 2020,
    "paginas": 220,
    "sinopse": "Obra de referência sobre AWS Certified SysOps Administrator Associate Version 2. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20Certified%20SysOps%20Administrator%20Associate%20Version%202.svg",
    "leituras": 143,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20Certified%20SysOps%20Administrator%20Associate%20Version%202%20-%20Autor%20(Jon%20Bonso%20and%20Lervin%20John%20Obando).pdf"
      }
    ]
  },
  {
    "titulo": "AWS For Beginners",
    "subtitulo": "The ultimate guide to the fundamentals of aws",
    "autor": "Steve M Burnett",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awsforbeginners",
    "ano": 2020,
    "paginas": 245,
    "sinopse": "Obra de referência sobre AWS For Beginners. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20For%20Beginners%20-%20The%20ultimate%20guide%20to%20the%20fundamentals%20of%20aws.svg",
    "leituras": 181,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20For%20Beginners%20-%20The%20ultimate%20guide%20to%20the%20fundamentals%20of%20aws%20-%20Autor%20(Steve%20M%20Burnett).pdf"
      }
    ]
  },
  {
    "titulo": "AWS for Non-Engineers",
    "subtitulo": null,
    "autor": "Hiroko Nishimura",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-awsfornonengineers",
    "ano": 2020,
    "paginas": 306,
    "sinopse": "Obra de referência sobre AWS for Non-Engineers. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/AWS%20for%20Non-Engineers.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/AWS%20for%20Non-Engineers%20-%20Autor%20(Hiroko%20Nishimura).pdf"
      }
    ]
  },
  {
    "titulo": "Agile",
    "subtitulo": "Desenvolvimento de Software com Entregas Frequentes e Foco no Valor de Negócio",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-agile",
    "ano": 2020,
    "paginas": 305,
    "sinopse": "Obra de referência sobre Agile. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Agile%20-%20Desenvolvimento%20de%20Software%20com%20Entregas%20Frequentes%20e%20Foco%20no%20Valor%20de%20Neg%C3%B3cio.svg",
    "leituras": 120,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Agile%20-%20Desenvolvimento%20de%20Software%20com%20Entregas%20Frequentes%20e%20Foco%20no%20Valor%20de%20Neg%C3%B3cio%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Agile Estimating and Planning",
    "subtitulo": null,
    "autor": "Mike Cohn",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-agileestimatingandplanning",
    "ano": 2020,
    "paginas": 259,
    "sinopse": "Obra de referência sobre Agile Estimating and Planning. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Agile%20Estimating%20and%20Planning.svg",
    "leituras": 121,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Agile%20Estimating%20and%20Planning%20-%20Autor%20(Mike%20Cohn).pdf"
      }
    ]
  },
  {
    "titulo": "Agile Project Management with Scrum",
    "subtitulo": null,
    "autor": "Ken Schwaber",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-agileprojectmanagementwithscrum",
    "ano": 2020,
    "paginas": 217,
    "sinopse": "Obra de referência sobre Agile Project Management with Scrum. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Agile%20Project%20Management%20with%20Scrum.svg",
    "leituras": 570,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Agile%20Project%20Management%20with%20Scrum%20-%20Autor%20(Ken%20Schwaber).pdf"
      }
    ]
  },
  {
    "titulo": "Agile Retrospectives",
    "subtitulo": "Making Good Teams Great (Pragmatic Programmers)",
    "autor": "Esther Derby",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-agileretrospectives",
    "ano": 2020,
    "paginas": 211,
    "sinopse": "Obra de referência sobre Agile Retrospectives. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Agile%20Retrospectives%20-%20Making%20Good%20Teams%20Great.svg",
    "leituras": 144,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Agile%20Retrospectives%20-%20Making%20Good%20Teams%20Great%20(Pragmatic%20Programmers)%20-%20Autor%20(Esther%20Derby).pdf"
      }
    ]
  },
  {
    "titulo": "Algoritmos",
    "subtitulo": "Teoria e Prática",
    "autor": "Thomas Cormen",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-algoritmos",
    "ano": 2020,
    "paginas": 283,
    "sinopse": "Obra de referência sobre Algoritmos. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Algoritmos%20-%20Teoria%20e%20Pr%C3%A1tica.svg",
    "leituras": 185,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Algoritmos%20-%20Teoria%20e%20Pr%C3%A1tica%20-%20Autor%20(Thomas%20Cormen).pdf"
      }
    ]
  },
  {
    "titulo": "Amazon AWS",
    "subtitulo": "Descomplicando a computação na nuvem",
    "autor": "Casa do Código",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-amazonaws",
    "ano": 2020,
    "paginas": 272,
    "sinopse": "Obra de referência sobre Amazon AWS. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Amazon%20AWS%20-%20Descomplicando%20a%20computa%C3%A7%C3%A3o%20na%20nuvem.svg",
    "leituras": 146,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Amazon%20AWS%20-%20Descomplicando%20a%20computa%C3%A7%C3%A3o%20na%20nuvem%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Aplicações web real time com Node-js",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-aplicacoeswebrealtimecomnodejs",
    "ano": 2020,
    "paginas": 321,
    "sinopse": "Obra de referência sobre Aplicações web real time com Node-js. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Aplica%C3%A7%C3%B5es%20web%20real%20time%20com%20Node-js.svg",
    "leituras": 173,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Aplica%C3%A7%C3%B5es%20web%20real%20time%20com%20Node-js%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Apprenticeship Patterns",
    "subtitulo": "Guidance for the Aspiring Software Craftsman",
    "autor": "Dave Hoover e Adewale Oshineye",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-apprenticeshippatterns",
    "ano": 2020,
    "paginas": 234,
    "sinopse": "Obra de referência sobre Apprenticeship Patterns. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Apprenticeship%20Patterns%20-%20Guidance%20for%20the%20Aspiring%20Software%20Craftsman.svg",
    "leituras": 153,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Apprenticeship%20Patterns%20-%20Guidance%20for%20the%20Aspiring%20Software%20Craftsman%20-%20Autor%20(Dave%20Hoover%20e%20Adewale%20Oshineye).pdf"
      }
    ]
  },
  {
    "titulo": "Arquitetura Limpa",
    "subtitulo": "O Guia do Artesão para Estrutura e Design de Software",
    "autor": "Robert C. Martin",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-arquiteturalimpa",
    "ano": 2020,
    "paginas": 320,
    "sinopse": "Obra de referência sobre Arquitetura Limpa. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Arquitetura%20Limpa%20-%20O%20Guia%20do%20Artes%C3%A3o%20para%20Estrutura%20e%20Design%20de%20Software.svg",
    "leituras": 650,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Arquitetura%20Limpa%20-%20O%20Guia%20do%20Artes%C3%A3o%20para%20Estrutura%20e%20Design%20de%20Software%20-%20Autor%20(Robert%20C.%20Martin).pdf"
      }
    ]
  },
  {
    "titulo": "Azure",
    "subtitulo": "Coloque suas plataformas e serviços no cloud",
    "autor": "Casa do Código",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-azure",
    "ano": 2020,
    "paginas": 276,
    "sinopse": "Obra de referência sobre Azure. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Azure%20-%20Coloque%20suas%20plataformas%20e%20servi%C3%A7os%20no%20cloud.svg",
    "leituras": 153,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Azure%20-%20Coloque%20suas%20plataformas%20e%20servi%C3%A7os%20no%20cloud%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "BDD in Action",
    "subtitulo": "Behavior-Driven Development for the Whole Software Lifecycle",
    "autor": "John Ferguson Smart",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-bddinaction",
    "ano": 2020,
    "paginas": 278,
    "sinopse": "Obra de referência sobre BDD in Action. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/BDD%20in%20Action%20-%20Behavior-Driven%20Development%20for%20the%20Whole%20Software%20Lifecycle.svg",
    "leituras": 168,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/BDD%20in%20Action%20-%20Behavior-Driven%20Development%20for%20the%20Whole%20Software%20Lifecycle%20-%20Autor%20(John%20Ferguson%20Smart).pdf"
      }
    ]
  },
  {
    "titulo": "Big Data",
    "subtitulo": "Técnicas e tecnologias para extração de valor dos dados",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-bigdata",
    "ano": 2020,
    "paginas": 277,
    "sinopse": "Obra de referência sobre Big Data. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Big%20Data%20-%20T%C3%A9cnicas%20e%20tecnologias%20para%20extra%C3%A7%C3%A3o%20de%20valor%20dos%20dados.svg",
    "leituras": 188,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Big%20Data%20-%20T%C3%A9cnicas%20e%20tecnologias%20para%20extra%C3%A7%C3%A3o%20de%20valor%20dos%20dados%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Business Intelligence",
    "subtitulo": "Implementar do jeito certo e a custo zero",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-businessintelligence",
    "ano": 2020,
    "paginas": 259,
    "sinopse": "Obra de referência sobre Business Intelligence. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Business%20Intelligence%20-%20Implementar%20do%20jeito%20certo%20e%20a%20custo%20zero.svg",
    "leituras": 148,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Business%20Intelligence%20-%20Implementar%20do%20jeito%20certo%20e%20a%20custo%20zero%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "But How Do It Know",
    "subtitulo": "The Basic Principles of Computers for Everyone - Author (J. Clark Scott)",
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-buthowdoitknow",
    "ano": 2020,
    "paginas": 322,
    "sinopse": "Obra de referência sobre But How Do It Know. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/But%20How%20Do%20it%20Know%20-%20The%20Basic%20Principles%20of%20Computers%20for%20Everyone.svg",
    "leituras": 158,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/But%20How%20Do%20It%20Know%20-%20The%20Basic%20Principles%20of%20Computers%20for%20Everyone%20-%20Author%20(J.%20Clark%20Scott).pdf"
      }
    ]
  },
  {
    "titulo": "CSS Eficiente",
    "subtitulo": "Técnicas e ferramentas que fazem a diferença nos seus estilos",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-csseficiente",
    "ano": 2020,
    "paginas": 206,
    "sinopse": "Obra de referência sobre CSS Eficiente. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/CSS%20Eficiente%20-%20T%C3%A9cnicas%20e%20ferramentas%20que%20fazem%20a%20diferen%C3%A7a%20nos%20seus%20estilos.svg",
    "leituras": 181,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/CSS%20Eficiente%20-%20T%C3%A9cnicas%20e%20ferramentas%20que%20fazem%20a%20diferen%C3%A7a%20nos%20seus%20estilos%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Caixa de Ferramentas DevOps",
    "subtitulo": "Um Guia para Construção, Administração e Arquitetura de Sistemas Modernos",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-caixadeferramentasdevops",
    "ano": 2020,
    "paginas": 306,
    "sinopse": "Obra de referência sobre Caixa de Ferramentas DevOps. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Caixa%20de%20Ferramentas%20DevOps%20-%20Um%20Guia%20para%20Constru%C3%A7%C3%A3o%2C%20Administra%C3%A7%C3%A3o%20e%20Arquitetura%20de%20Sistemas%20Modernos.svg",
    "leituras": 144,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Caixa%20de%20Ferramentas%20DevOps%20-%20Um%20Guia%20para%20Constru%C3%A7%C3%A3o%2C%20Administra%C3%A7%C3%A3o%20e%20Arquitetura%20de%20Sistemas%20Modernos%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Canivete suico do desenvolvedor Node",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-canivetesuicododesenvolvedornode",
    "ano": 2020,
    "paginas": 206,
    "sinopse": "Obra de referência sobre Canivete suico do desenvolvedor Node. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Canivete%20sui%C3%A7o%20do%20desenvolvedor%20Node.svg",
    "leituras": 128,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Canivete%20suico%20do%20desenvolvedor%20Node%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Clean Agile",
    "subtitulo": "Back to Basics",
    "autor": "Robert Martin",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-cleanagile",
    "ano": 2020,
    "paginas": 320,
    "sinopse": "Obra de referência sobre Clean Agile. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Clean%20Agile%20-%20Back%20to%20Basics.svg",
    "leituras": 150,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Clean%20Agile%20-%20Back%20to%20Basics%20-%20Autor%20(Robert%20Martin).pdf"
      }
    ]
  },
  {
    "titulo": "Clean Coder, The",
    "subtitulo": "A Code of Conduct for Professional Programmers",
    "autor": "Robert C. Martin",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-cleancoderthe",
    "ano": 2020,
    "paginas": 226,
    "sinopse": "Obra de referência sobre Clean Coder, The. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Clean%20Coder%2C%20The%20-%20A%20Code%20of%20Conduct%20for%20Professional%20Programmers.svg",
    "leituras": 169,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Clean%20Coder%2C%20The%20-%20A%20Code%20of%20Conduct%20for%20Professional%20Programmers%20-%20Autor%20(Robert%20C.%20Martin).pdf"
      }
    ]
  },
  {
    "titulo": "Coaching Agile Teams",
    "subtitulo": "A Companion for ScrumMasters, Agile Coaches, and Project Managers in Transition",
    "autor": "Adkins Lyssa",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-coachingagileteams",
    "ano": 2020,
    "paginas": 229,
    "sinopse": "Obra de referência sobre Coaching Agile Teams. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Coaching%20Agile%20Teams%20-%20A%20Companion%20for%20ScrumMasters%2C%20Agile%20Coaches%2C%20and%20Project%20Managers%20in%20Transition.svg",
    "leituras": 177,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Coaching%20Agile%20Teams%20-%20A%20Companion%20for%20ScrumMasters%2C%20Agile%20Coaches%2C%20and%20Project%20Managers%20in%20Transition%20-%20Autor%20(Adkins%20Lyssa).pdf"
      }
    ]
  },
  {
    "titulo": "Começando com o Linux",
    "subtitulo": "Comandos, serviços e administração",
    "autor": "Casa do Código",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-comecandocomolinux",
    "ano": 2020,
    "paginas": 324,
    "sinopse": "Obra de referência sobre Começando com o Linux. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 198,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Como Melhorar o Desempenho da Sua Equipe de Desenvolvimento",
    "subtitulo": null,
    "autor": "Software House",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-comomelhorarodesempenhodasuaequiped",
    "ano": 2020,
    "paginas": 256,
    "sinopse": "Obra de referência sobre Como Melhorar o Desempenho da Sua Equipe de Desenvolvimento. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Como%20Melhorar%20o%20Desempenho%20da%20Sua%20Equipe%20de%20Desenvolvimento%20-%20Autor(Software%20House).svg",
    "leituras": 123,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Como%20Melhorar%20o%20Desempenho%20da%20Sua%20Equipe%20de%20Desenvolvimento%20-%20Autor(Software%20House).pdf"
      }
    ]
  },
  {
    "titulo": "Como mentir com estatística",
    "subtitulo": null,
    "autor": "Darrell-Heff",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-comomentircomestatistica",
    "ano": 2020,
    "paginas": 335,
    "sinopse": "Obra de referência sobre Como mentir com estatística. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Como%20mentir%20com%20estat%C3%ADstica.svg",
    "leituras": 133,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Como%20mentir%20com%20estat%C3%ADstica%20-%20Auto%20(Darrell-Heff).pdf"
      }
    ]
  },
  {
    "titulo": "Como ser um Programador Melhor",
    "subtitulo": "um Manual Para Programadores que se Importam com Código",
    "autor": "Pete Goodliffe",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-comoserumprogramadormelhor",
    "ano": 2020,
    "paginas": 238,
    "sinopse": "Obra de referência sobre Como ser um Programador Melhor. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Como%20ser%20um%20Programador%20Melhor%20-%20um%20Manual%20Para%20Programadores%20que%20se%20Importam%20com%20C%C3%B3digo.svg",
    "leituras": 180,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Como%20ser%20um%20Programador%20Melhor%20-%20um%20Manual%20Para%20Programadores%20que%20se%20Importam%20com%20C%C3%B3digo%20-%20Autor%20(Pete%20Goodliffe).pdf"
      }
    ]
  },
  {
    "titulo": "Comunicação de Dados e Redes de Computadores",
    "subtitulo": null,
    "autor": "Behrouz A. Forouzan",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-comunicacaodedadoseredesdecomputado",
    "ano": 2020,
    "paginas": 321,
    "sinopse": "Obra de referência sobre Comunicação de Dados e Redes de Computadores. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Comunica%C3%A7%C3%A3o%20de%20Dados%20e%20Redes%20de%20Computadores.svg",
    "leituras": 198,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Comunica%C3%A7%C3%A3o%20de%20Dados%20e%20Redes%20de%20Computadores%20-%20Autor%20(Behrouz%20A.%20Forouzan).pdf"
      }
    ]
  },
  {
    "titulo": "Construindo API REST com Node JS",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-construindoapirestcomnodejs",
    "ano": 2020,
    "paginas": 257,
    "sinopse": "Obra de referência sobre Construindo API REST com Node JS. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Construindo%20API%20REST%20com%20Node%20JS.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Construindo%20API%20REST%20com%20Node%20JS%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Containers com Docker",
    "subtitulo": "Do desenvolvimento à produção",
    "autor": "Casa do Código",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-containerscomdocker",
    "ano": 2020,
    "paginas": 227,
    "sinopse": "Obra de referência sobre Containers com Docker. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Containers%20com%20Docker%20-%20Do%20desenvolvimento%20%C3%A0%20produ%C3%A7%C3%A3o.svg",
    "leituras": 133,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Containers%20com%20Docker%20-%20Do%20desenvolvimento%20%C3%A0%20produ%C3%A7%C3%A3o%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Controlando Versões com Git e GitHub",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-controlandoversoescomgitegithub",
    "ano": 2020,
    "paginas": 309,
    "sinopse": "Obra de referência sobre Controlando Versões com Git e GitHub. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Controlando%20Vers%C3%B5es%20com%20Git%20e%20GitHub.svg",
    "leituras": 122,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Controlando%20Vers%C3%B5es%20com%20Git%20e%20GitHub%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Cracking the Coding Interview",
    "subtitulo": "189 Programming Questions and Solutions - Author (Gayle Laakmann McDowell)",
    "autor": "Comunidade Tech",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-crackingthecodinginterview",
    "ano": 2020,
    "paginas": 345,
    "sinopse": "Obra de referência sobre Cracking the Coding Interview. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Cracking%20the%20Coding%20Interview%20-%20189%20Programming%20Questions%20and%20Solutions.svg",
    "leituras": 174,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Cracking%20the%20Coding%20Interview%20-%20189%20Programming%20Questions%20and%20Solutions%20-%20Author%20(Gayle%20Laakmann%20McDowell).pdf"
      }
    ]
  },
  {
    "titulo": "Crystal Clear",
    "subtitulo": "A Human-Powered Methodology for Small Teams",
    "autor": "Alistair Cockburn",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-crystalclear",
    "ano": 2020,
    "paginas": 273,
    "sinopse": "Obra de referência sobre Crystal Clear. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Crystal%20Clear%20-%20A%20Human-Powered%20Methodology%20for%20Small%20Teams.svg",
    "leituras": 189,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Crystal%20Clear%20-%20A%20Human-Powered%20Methodology%20for%20Small%20Teams%20-%20Autor%20(Alistair%20Cockburn).pdf"
      }
    ]
  },
  {
    "titulo": "Código limpo",
    "subtitulo": "Habilidades práticas do Agile Software",
    "autor": "Robert C. Martin",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-codigolimpo",
    "ano": 2020,
    "paginas": 217,
    "sinopse": "Obra de referência sobre Código limpo. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/C%C3%B3digo%20limpo%20-%20Habilidades%20pr%C3%A1ticas%20do%20Agile%20Software.svg",
    "leituras": 640,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/C%C3%B3digo%20limpo%20-%20Habilidades%20pr%C3%A1ticas%20do%20Agile%20Software%20-%20Autor%20(Robert%20C.%20Martin).pdf"
      }
    ]
  },
  {
    "titulo": "DSL",
    "subtitulo": "Quebre a barreira entre desenvolvimento e negócios",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-dsl",
    "ano": 2020,
    "paginas": 322,
    "sinopse": "Obra de referência sobre DSL. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Arquitetura%20Limpa%20-%20O%20Guia%20do%20Artes%C3%A3o%20para%20Estrutura%20e%20Design%20de%20Software.svg",
    "leituras": 126,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/DSL%20-%20Quebre%20a%20barreira%20entre%20desenvolvimento%20e%20neg%C3%B3cios%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Desconstruindo a Web",
    "subtitulo": "As Tecnologias por Trás de uma Requisição",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-desconstruindoaweb",
    "ano": 2020,
    "paginas": 274,
    "sinopse": "Obra de referência sobre Desconstruindo a Web. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Arquitetura%20Limpa%20-%20O%20Guia%20do%20Artes%C3%A3o%20para%20Estrutura%20e%20Design%20de%20Software.svg",
    "leituras": 153,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Desconstruindo%20a%20Web%20-%20As%20Tecnologias%20por%20Tr%C3%A1s%20de%20uma%20Requisi%C3%A7%C3%A3o%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "DevOps na Prática",
    "subtitulo": "Entrega de Software Confiável e Automatizada",
    "autor": "Casa do Código",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-devopsnapratica",
    "ano": 2020,
    "paginas": 228,
    "sinopse": "Obra de referência sobre DevOps na Prática. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/DevOps%20na%20Pr%C3%A1tica%20-%20Entrega%20de%20Software%20Confi%C3%A1vel%20e%20Automatizada.svg",
    "leituras": 149,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/DevOps%20na%20Pr%C3%A1tica%20-%20Entrega%20de%20Software%20Confi%C3%A1vel%20e%20Automatizada%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Direto ao Ponto",
    "subtitulo": "Criando produtos de forma enxuta",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-diretoaoponto",
    "ano": 2020,
    "paginas": 260,
    "sinopse": "Obra de referência sobre Direto ao Ponto. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Direto%20ao%20Ponto%20-%20Criando%20produtos%20de%20forma%20enxuta.svg",
    "leituras": 168,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Direto%20ao%20Ponto%20-%20Criando%20produtos%20de%20forma%20enxuta%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Domain Driven Design Rapido",
    "subtitulo": null,
    "autor": "Eric Evans",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-domaindrivendesignrapido",
    "ano": 2020,
    "paginas": 311,
    "sinopse": "Obra de referência sobre Domain Driven Design Rapido. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Domain%20Driven%20Design%20Rapido.svg",
    "leituras": 600,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Domain%20Driven%20Design%20Rapido%20-%20Autor%20(Eric%20Evans).pdf"
      }
    ]
  },
  {
    "titulo": "Domain-Driven Design Referência",
    "subtitulo": "Sumário de Padrões e Definições",
    "autor": "Eric Evans",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-domaindrivendesignreferencia",
    "ano": 2020,
    "paginas": 227,
    "sinopse": "Obra de referência sobre Domain-Driven Design Referência. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Domain-Driven%20Design%20Refer%C3%AAncia%20-%20Sum%C3%A1rio%20de%20Padr%C3%B5es%20e%20Defini%C3%A7%C3%B5es.svg",
    "leituras": 600,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Domain-Driven%20Design%20Refer%C3%AAncia%20-%20Sum%C3%A1rio%20de%20Padr%C3%B5es%20e%20Defini%C3%A7%C3%B5es%20-%20Autor%20(Eric%20Evans).pdf"
      }
    ]
  },
  {
    "titulo": "Entendendo Algoritmos",
    "subtitulo": "Um Guia Ilustrado Para Programadores e Outros Curiosos",
    "autor": "Aditya Y. Bhargava",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-entendendoalgoritmos",
    "ano": 2020,
    "paginas": 267,
    "sinopse": "Obra de referência sobre Entendendo Algoritmos. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Entendendo%20Algoritmos%20-%20Um%20Guia%20Ilustrado%20Para%20Programadores%20e%20Outros%20Curiosos.svg",
    "leituras": 152,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Entendendo%20Algoritmos%20-%20Um%20Guia%20Ilustrado%20Para%20Programadores%20e%20Outros%20Curiosos%20-%20Autor%20(Aditya%20Y.%20Bhargava).pdf"
      }
    ]
  },
  {
    "titulo": "Entrega Contínua",
    "subtitulo": "Como Entregar Software de Forma Rápida e Confiável",
    "autor": "Jez Humble",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-entregacontinua",
    "ano": 2020,
    "paginas": 316,
    "sinopse": "Obra de referência sobre Entrega Contínua. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Entrega%20Cont%C3%ADnua%20-%20Como%20Entregar%20Software%20de%20Forma%20R%C3%A1pida%20e%20Confi%C3%A1vel.svg",
    "leituras": 198,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Entrega%20Cont%C3%ADnua%20-%20Como%20Entregar%20Software%20de%20Forma%20R%C3%A1pida%20e%20Confi%C3%A1vel%20-%20Auto%20(Jez%20Humble).pdf"
      }
    ]
  },
  {
    "titulo": "Entrega contínua em Android",
    "subtitulo": "Como automatizar a distribuição de apps",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-entregacontinuaemandroid",
    "ano": 2020,
    "paginas": 246,
    "sinopse": "Obra de referência sobre Entrega contínua em Android. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Entrega%20cont%C3%ADnua%20em%20Android%20-%20Como%20automatizar%20a%20distribui%C3%A7%C3%A3o%20de%20apps.svg",
    "leituras": 129,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Entrega%20cont%C3%ADnua%20em%20Android%20-%20Como%20automatizar%20a%20distribui%C3%A7%C3%A3o%20de%20apps%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Estatistica",
    "subtitulo": "O que e, para que serve, como funciona",
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-estatistica",
    "ano": 2020,
    "paginas": 281,
    "sinopse": "Obra de referência sobre Estatistica. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/O%20que%20e%2C%20para%20que%20serve%2C%20como%20funciona.svg",
    "leituras": 187,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Estatistica%20-%20O%20que%20e%2C%20para%20que%20serve%2C%20como%20funciona%20.pdf"
      }
    ]
  },
  {
    "titulo": "Expressões Regulares",
    "subtitulo": "uma abordagem divertida",
    "autor": "Aurelio Marinho",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-expressoesregulares",
    "ano": 2020,
    "paginas": 337,
    "sinopse": "Obra de referência sobre Expressões Regulares. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Express%C3%B5es%20Regulares%20-%20uma%20abordagem%20divertida%20-%20Autor%20(Aurelio%20Marinho).svg",
    "leituras": 146,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Express%C3%B5es%20Regulares%20-%20uma%20abordagem%20divertida%20-%20Autor%20(Aurelio%20Marinho).pdf"
      }
    ]
  },
  {
    "titulo": "Extreme Programming Explained",
    "subtitulo": "Embrace Change",
    "autor": "Kent Beck",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-extremeprogrammingexplained",
    "ano": 2020,
    "paginas": 272,
    "sinopse": "Obra de referência sobre Extreme Programming Explained. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Extreme%20Programming%20Explained%20-%20Embrace%20Change.svg",
    "leituras": 188,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Extreme%20Programming%20Explained%20-%20Embrace%20Change%20-%20Autor%20(Kent%20Beck).pdf"
      }
    ]
  },
  {
    "titulo": "Fragmentos de um programador",
    "subtitulo": "Artigos e insights da carreira de um profissional",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-fragmentosdeumprogramador",
    "ano": 2020,
    "paginas": 251,
    "sinopse": "Obra de referência sobre Fragmentos de um programador. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Fragmentos%20de%20um%20programador%20-%20Artigos%20e%20insights%20da%20carreira%20de%20um%20profissional.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Fragmentos%20de%20um%20programador%20-%20Artigos%20e%20insights%20da%20carreira%20de%20um%20profissional%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Gestão de produtos",
    "subtitulo": "Como aumentar as chances de sucesso do seu software",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-gestaodeprodutos",
    "ano": 2020,
    "paginas": 231,
    "sinopse": "Obra de referência sobre Gestão de produtos. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Gest%C3%A3o%20de%20produtos%20-%20Como%20aumentar%20as%20chances%20de%20sucesso%20do%20seu%20software.svg",
    "leituras": 168,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Gest%C3%A3o%20de%20produtos%20-%20Como%20aumentar%20as%20chances%20de%20sucesso%20do%20seu%20software%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Google Android",
    "subtitulo": "crie aplicações para celulares e tablets",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-googleandroid",
    "ano": 2020,
    "paginas": 252,
    "sinopse": "Obra de referência sobre Google Android. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Google%20Android%20-%20crie%20aplica%C3%A7%C3%B5es%20para%20celulares%20e%20tablets.svg",
    "leituras": 192,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Google%20Android%20-%20crie%20aplica%C3%A7%C3%B5es%20para%20celulares%20e%20tablets%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Guia da Startup",
    "subtitulo": "Como Startups e Empresas Estabelecidas Podem Criar Produtos Web Rentáveis",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-guiadastartup",
    "ano": 2020,
    "paginas": 231,
    "sinopse": "Obra de referência sobre Guia da Startup. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Guia%20da%20Startup%20-%20Como%20Startups%20e%20Empresas%20Estabelecidas%20Podem%20Criar%20Produtos%20Web%20Rent%C3%A1veis.svg",
    "leituras": 184,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Guia%20da%20Startup%20-%20Como%20Startups%20e%20Empresas%20Estabelecidas%20Podem%20Criar%20Produtos%20Web%20Rent%C3%A1veis%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Guia do Mestre Programador",
    "subtitulo": "Pensando como pirata, evoluindo como jedi",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-guiadomestreprogramador",
    "ano": 2020,
    "paginas": 212,
    "sinopse": "Obra de referência sobre Guia do Mestre Programador. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Guia%20do%20Mestre%20Programador%20-%20Pensando%20como%20pirata%2C%20evoluindo%20como%20jedi.svg",
    "leituras": 175,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Guia%20do%20Mestre%20Programador%20-%20Pensando%20como%20pirata%2C%20evoluindo%20como%20jedi%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Guia prático de TypeScript",
    "subtitulo": "Melhore suas aplicações JavaScript",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-guiapraticodetypescript",
    "ano": 2020,
    "paginas": 249,
    "sinopse": "Obra de referência sobre Guia prático de TypeScript. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Guia%20pr%C3%A1tico%20de%20TypeScript%20-%20Melhore%20suas%20aplica%C3%A7%C3%B5es%20JavaScript.svg",
    "leituras": 171,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Guia%20pr%C3%A1tico%20de%20TypeScript%20-%20Melhore%20suas%20aplica%C3%A7%C3%B5es%20JavaScript%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Guia prático do servidor Linux",
    "subtitulo": "Administração Linux para iniciantes",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-guiapraticodoservidorlinux",
    "ano": 2020,
    "paginas": 328,
    "sinopse": "Obra de referência sobre Guia prático do servidor Linux. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Guia%20pr%C3%A1tico%20do%20servidor%20Linux%20-%20Administra%C3%A7%C3%A3o%20Linux%20para%20iniciantes.svg",
    "leituras": 132,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Guia%20pr%C3%A1tico%20do%20servidor%20Linux%20-%20Administra%C3%A7%C3%A3o%20Linux%20para%20iniciantes%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "HTML5 e CSS3",
    "subtitulo": "domine a web do futuro",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-html5ecss3",
    "ano": 2020,
    "paginas": 234,
    "sinopse": "Obra de referência sobre HTML5 e CSS3. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/HTML5%20e%20CSS3%20-%20domine%20a%20web%20do%20futuro.svg",
    "leituras": 560,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/HTML5%20e%20CSS3%20-%20domine%20a%20web%20do%20futuro%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Introdução a data science",
    "subtitulo": "Algoritmos de machine learning e métodos de análise",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-introducaoadatascience",
    "ano": 2020,
    "paginas": 333,
    "sinopse": "Obra de referência sobre Introdução a data science. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Introdu%C3%A7%C3%A3o%20a%20data%20science%20-%20Algoritmos%20de%20machine%20learning%20e%20m%C3%A9todos%20de%20an%C3%A1lise.svg",
    "leituras": 195,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Introdu%C3%A7%C3%A3o%20a%20data%20science%20-%20Algoritmos%20de%20machine%20learning%20e%20m%C3%A9todos%20de%20an%C3%A1lise%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Introdução e boas práticas em UX Design",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-introducaoeboaspraticasemuxdesign",
    "ano": 2020,
    "paginas": 289,
    "sinopse": "Obra de referência sobre Introdução e boas práticas em UX Design. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Arquitetura%20Limpa%20-%20O%20Guia%20do%20Artes%C3%A3o%20para%20Estrutura%20e%20Design%20de%20Software.svg",
    "leituras": 183,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Introdu%C3%A7%C3%A3o%20e%20boas%20pr%C3%A1ticas%20em%20UX%20Design%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Introdução à arquitetura de design de software",
    "subtitulo": null,
    "autor": "Paulo Silveira",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-introducaoaarquiteturadedesigndesof",
    "ano": 2020,
    "paginas": 310,
    "sinopse": "Obra de referência sobre Introdução à arquitetura de design de software. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Introdu%C3%A7%C3%A3o%20%C3%A0%20arquitetura%20de%20design%20de%20software.svg",
    "leituras": 182,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Introdu%C3%A7%C3%A3o%20%C3%A0%20arquitetura%20de%20design%20de%20software%20-%20Autor%20(Paulo%20Silveira).pdf"
      }
    ]
  },
  {
    "titulo": "Jenkins",
    "subtitulo": "Automatize Tudo sem Complicações",
    "autor": "Casa do Código",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-jenkins",
    "ano": 2020,
    "paginas": 202,
    "sinopse": "Obra de referência sobre Jenkins. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Jenkins%20-%20Automatize%20Tudo%20sem%20Complica%C3%A7%C3%B5es.svg",
    "leituras": 124,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Jenkins%20-%20Automatize%20Tudo%20sem%20Complica%C3%A7%C3%B5es%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Kubernetes",
    "subtitulo": "Tudo sobre orquestração de contêineres",
    "autor": "Casa do Código",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-kubernetes",
    "ano": 2020,
    "paginas": 326,
    "sinopse": "Obra de referência sobre Kubernetes. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Kubernetes%20-%20Tudo%20sobre%20orquestra%C3%A7%C3%A3o%20de%20cont%C3%AAineres.svg",
    "leituras": 550,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Kubernetes%20-%20Tudo%20sobre%20orquestra%C3%A7%C3%A3o%20de%20cont%C3%AAineres%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "LEAN ENTERPRISE",
    "subtitulo": "Como empresas de alta performance inovam em escala",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-leanenterprise",
    "ano": 2020,
    "paginas": 342,
    "sinopse": "Obra de referência sobre LEAN ENTERPRISE. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/LEAN%20ENTERPRISE%20-%20Como%20empresas%20de%20alta%20performance%20inovam%20em%20escala.svg",
    "leituras": 149,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/LEAN%20ENTERPRISE%20-%20Como%20empresas%20de%20alta%20performance%20inovam%20em%20escala%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Learning 3.0",
    "subtitulo": "Como os profissionais criativos aprendem",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-learning30",
    "ano": 2020,
    "paginas": 311,
    "sinopse": "Obra de referência sobre Learning 3.0. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Learning%203.0%20-%20Como%20os%20profissionais%20criativos%20aprendem.svg",
    "leituras": 183,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Learning%203.0%20-%20Como%20os%20profissionais%20criativos%20aprendem%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Managing For Happiness",
    "subtitulo": null,
    "autor": "Jurgen Appelo",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-managingforhappiness",
    "ano": 2020,
    "paginas": 281,
    "sinopse": "Obra de referência sobre Managing For Happiness. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Managing%20For%20Happiness.svg",
    "leituras": 189,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Managing%20For%20Happiness%20-%20Autor%20(Jurgen%20Appelo).pdf"
      }
    ]
  },
  {
    "titulo": "MongoDB",
    "subtitulo": "Construa Novas Aplicações com Novas Tecnologias",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-mongodb",
    "ano": 2020,
    "paginas": 251,
    "sinopse": "Obra de referência sobre MongoDB. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/MongoDB%20-%20Construa%20Novas%20Aplica%C3%A7%C3%B5es%20com%20Novas%20Tecnologias.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/MongoDB%20-%20Construa%20Novas%20Aplica%C3%A7%C3%B5es%20com%20Novas%20Tecnologias%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "More Agile Testing",
    "subtitulo": "Learning Journeys for the Whole Team",
    "autor": "Lisa Crispin",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-moreagiletesting",
    "ano": 2020,
    "paginas": 240,
    "sinopse": "Obra de referência sobre More Agile Testing. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/More%20Agile%20Testing%20-%20Learning%20Journeys%20for%20the%20Whole%20Team.svg",
    "leituras": 198,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/More%20Agile%20Testing%20-%20Learning%20Journeys%20for%20the%20Whole%20Team%20-%20Autor%20(Lisa%20Crispin).pdf"
      }
    ]
  },
  {
    "titulo": "Métricas ágeis",
    "subtitulo": "Obtenha melhores resultados em sua equipe",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-metricasageis",
    "ano": 2020,
    "paginas": 218,
    "sinopse": "Obra de referência sobre Métricas ágeis. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/M%C3%A9tricas%20%C3%A1geis%20-%20Obtenha%20melhores%20resultados%20em%20sua%20equipe.svg",
    "leituras": 154,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/M%C3%A9tricas%20%C3%A1geis%20-%20Obtenha%20melhores%20resultados%20em%20sua%20equipe%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "NoSQL",
    "subtitulo": "Como armazenar os dados de uma aplicação moderna",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-nosql",
    "ano": 2020,
    "paginas": 343,
    "sinopse": "Obra de referência sobre NoSQL. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/NoSQL%20-%20Como%20armazenar%20os%20dados%20de%20uma%20aplica%C3%A7%C3%A3o%20moderna.svg",
    "leituras": 174,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/NoSQL%20-%20Como%20armazenar%20os%20dados%20de%20uma%20aplica%C3%A7%C3%A3o%20moderna%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "O Ego É Seu Inimigo. Como Dominar Seu Pior Adversário",
    "subtitulo": null,
    "autor": "Ryan Holiday",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-oegoeseuinimigocomodominarseupiorad",
    "ano": 2020,
    "paginas": 337,
    "sinopse": "Obra de referência sobre O Ego É Seu Inimigo. Como Dominar Seu Pior Adversário. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/O%20Ego%20%C3%89%20Seu%20Inimigo.%20Como%20Dominar%20Seu%20Pior%20Advers%C3%A1rio.svg",
    "leituras": 129,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/O%20Ego%20%C3%89%20Seu%20Inimigo.%20Como%20Dominar%20Seu%20Pior%20Advers%C3%A1rio%20-%20Autor%20(Ryan%20Holiday).pdf"
      }
    ]
  },
  {
    "titulo": "O Programador Apaixonado",
    "subtitulo": "Construindo uma Carreira Notável em Desenvolvimento de Software",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-oprogramadorapaixonado",
    "ano": 2020,
    "paginas": 201,
    "sinopse": "Obra de referência sobre O Programador Apaixonado. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/O%20Programador%20Apaixonado%20-%20Construindo%20uma%20Carreira%20Not%C3%A1vel%20em%20Desenvolvimento%20de%20Software.svg",
    "leituras": 161,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/O%20Programador%20Apaixonado%20-%20Construindo%20uma%20Carreira%20Not%C3%A1vel%20em%20Desenvolvimento%20de%20Software%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "O Programador Pragmático",
    "subtitulo": null,
    "autor": "Andrew Hunt e David Thomas",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-oprogramadorpragmatico",
    "ano": 2020,
    "paginas": 317,
    "sinopse": "Obra de referência sobre O Programador Pragmático. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/O%20Programador%20Pragm%C3%A1tico.svg",
    "leituras": 610,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/O%20Programador%20Pragm%C3%A1tico%20-%20Autor%20(Andrew%20Hunt%20e%20David%20Thomas).pdf"
      }
    ]
  },
  {
    "titulo": "Oauth 2.0 Proteja Suas Aplicacoes Com O Spring Security Oauth2",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-oauth20protejasuasaplicacoescomospr",
    "ano": 2020,
    "paginas": 260,
    "sinopse": "Obra de referência sobre Oauth 2.0 Proteja Suas Aplicacoes Com O Spring Security Oauth2. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Oauth%202.0%20Proteja%20Suas%20Aplica%C3%A7%C3%B5es%20Com%20O%20Spring%20Security%20Oauth2.svg",
    "leituras": 191,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Oauth%202.0%20Proteja%20Suas%20Aplicacoes%20Com%20O%20Spring%20Security%20Oauth2%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Padrões de Projetos",
    "subtitulo": "Soluções Reutilizáveis de Software Orientados a Objetos",
    "autor": "Erich Gamma",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-padroesdeprojetos",
    "ano": 2020,
    "paginas": 336,
    "sinopse": "Obra de referência sobre Padrões de Projetos. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Padr%C3%B5es%20de%20Projetos%20-%20Solu%C3%A7%C3%B5es%20Reutiliz%C3%A1veis%20de%20Software%20Orientados%20a%20Objetos.svg",
    "leituras": 620,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Padr%C3%B5es%20de%20Projetos%20-%20Solu%C3%A7%C3%B5es%20Reutiliz%C3%A1veis%20de%20Software%20Orientados%20a%20Objetos%20-%20Autor%20(Erich%20Gamma).pdf"
      }
    ]
  },
  {
    "titulo": "Por que Os Generalistas Vencem Em um Mundo de Especialistas",
    "subtitulo": null,
    "autor": "David Epstein",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-porqueosgeneralistasvencememummundo",
    "ano": 2020,
    "paginas": 286,
    "sinopse": "Obra de referência sobre Por que Os Generalistas Vencem Em um Mundo de Especialistas. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Por%20que%20Os%20Generalistas%20Vencem%20Em%20um%20Mundo%20de%20Especialistas%20-%20Autor(David%20Epstein).svg",
    "leituras": 153,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Por%20que%20Os%20Generalistas%20Vencem%20Em%20um%20Mundo%20de%20Especialistas%20-%20Autor(David%20Epstein).pdf"
      }
    ]
  },
  {
    "titulo": "Princípios de Design e Padrões de Projeto",
    "subtitulo": null,
    "autor": "Robert C. Martin",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-principiosdedesignepadroesdeprojeto",
    "ano": 2020,
    "paginas": 245,
    "sinopse": "Obra de referência sobre Princípios de Design e Padrões de Projeto. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Princ%C3%ADpios%20de%20Design%20e%20Padr%C3%B5es%20de%20Projeto.svg",
    "leituras": 620,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Princ%C3%ADpios%20de%20Design%20e%20Padr%C3%B5es%20de%20Projeto%20-%20Autor%20(Robert%20C.%20Martin).pdf"
      }
    ]
  },
  {
    "titulo": "Progressive web apps",
    "subtitulo": "Construa aplicações progressivas com React",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-progressivewebapps",
    "ano": 2020,
    "paginas": 259,
    "sinopse": "Obra de referência sobre Progressive web apps. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Progressive%20web%20apps%20-%20Construa%20aplica%C3%A7%C3%B5es%20progressivas%20com%20React.svg",
    "leituras": 198,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Progressive%20web%20apps%20-%20Construa%20aplica%C3%A7%C3%B5es%20progressivas%20com%20React%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "REST",
    "subtitulo": "Construa API's inteligentes de maneira simples",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-rest",
    "ano": 2020,
    "paginas": 268,
    "sinopse": "Obra de referência sobre REST. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/REST%20-%20Construa%20API's%20inteligentes%20de%20maneira%20simples.svg",
    "leituras": 168,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/REST%20-%20Construa%20API's%20inteligentes%20de%20maneira%20simples%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Range",
    "subtitulo": "Why Generalists Triumph in a Specialized World",
    "autor": "David Epstein",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-range",
    "ano": 2020,
    "paginas": 239,
    "sinopse": "Obra de referência sobre Range. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Range%20-%20Why%20Generalists%20Triumph%20in%20a%20Specialized%20World%20-%20Autor(David%20Epstein).svg",
    "leituras": 189,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Range%20-%20Why%20Generalists%20Triumph%20in%20a%20Specialized%20World%20-%20Autor(David%20Epstein).pdf"
      }
    ]
  },
  {
    "titulo": "Real-World Kanban",
    "subtitulo": "Do Less, Accomplish More with Lean Thinking",
    "autor": "Mattias Skarin",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-realworldkanban",
    "ano": 2020,
    "paginas": 319,
    "sinopse": "Obra de referência sobre Real-World Kanban. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Real-World%20Kanban%20-%20Do%20Less%2C%20Accomplish%20More%20with%20Lean%20Thinking.svg",
    "leituras": 196,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Real-World%20Kanban%20-%20Do%20Less%2C%20Accomplish%20More%20with%20Lean%20Thinking%20-%20Autor%20(Mattias%20Skarin).pdf"
      }
    ]
  },
  {
    "titulo": "Refatoração",
    "subtitulo": "Aperfeiçoando o Design de Códigos Existentes",
    "autor": "Martin Fowler",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-refatoracao",
    "ano": 2020,
    "paginas": 257,
    "sinopse": "Obra de referência sobre Refatoração. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Refatora%C3%A7%C3%A3o%20-%20Aperfei%C3%A7oando%20o%20Design%20de%20C%C3%B3digos%20Existentes.svg",
    "leituras": 630,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Refatora%C3%A7%C3%A3o%20-%20Aperfei%C3%A7oando%20o%20Design%20de%20C%C3%B3digos%20Existentes%20-%20Autor%20(Martin%20Fowler).pdf"
      }
    ]
  },
  {
    "titulo": "SEO Prático",
    "subtitulo": "Seu Site na Primeira Página das Buscas",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-seopratico",
    "ano": 2020,
    "paginas": 312,
    "sinopse": "Obra de referência sobre SEO Prático. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/SEO%20Pr%C3%A1tico%20-%20Seu%20Site%20na%20Primeira%20P%C3%A1gina%20das%20Buscas.svg",
    "leituras": 141,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/SEO%20Pr%C3%A1tico%20-%20Seu%20Site%20na%20Primeira%20P%C3%A1gina%20das%20Buscas%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "SOA Aplicado",
    "subtitulo": "Integrando com web services e além",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-soaaplicado",
    "ano": 2020,
    "paginas": 342,
    "sinopse": "Obra de referência sobre SOA Aplicado. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/SOA%20Aplicado%20-%20Integrando%20com%20web%20services%20e%20al%C3%A9m.svg",
    "leituras": 144,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/SOA%20Aplicado%20-%20Integrando%20com%20web%20services%20e%20al%C3%A9m%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Scrum",
    "subtitulo": "Gestão ágil para projetos de sucesso",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-scrum",
    "ano": 2020,
    "paginas": 322,
    "sinopse": "Obra de referência sobre Scrum. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Scrum%20-%20Gest%C3%A3o%20%C3%A1gil%20para%20projetos%20de%20sucesso.svg",
    "leituras": 570,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Scrum%20-%20Gest%C3%A3o%20%C3%A1gil%20para%20projetos%20de%20sucesso%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Scrum 360",
    "subtitulo": "Um guia completo e prático de agilidade",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-scrum360",
    "ano": 2020,
    "paginas": 241,
    "sinopse": "Obra de referência sobre Scrum 360. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Scrum%20360%20-%20Um%20guia%20completo%20e%20pr%C3%A1tico%20de%20agilidade.svg",
    "leituras": 570,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Scrum%20360%20-%20Um%20guia%20completo%20e%20pra%CC%81tico%20de%20agilidade%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Secrets of a Buccaneer-Scholar",
    "subtitulo": "How Self-Education and the Pursuit of Passion Can Lead to a Lifetime of Success",
    "autor": "James Marcus Bach",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-secretsofabuccaneerscholar",
    "ano": 2020,
    "paginas": 348,
    "sinopse": "Obra de referência sobre Secrets of a Buccaneer-Scholar. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Secrets%20of%20a%20Buccaneer-Scholar%20-%20How%20Self-Education%20and%20the%20Pursuit%20of%20Passion%20Can%20Lead%20to%20a%20Lifetime%20of%20Success.svg",
    "leituras": 167,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Secrets%20of%20a%20Buccaneer-Scholar%20-%20How%20Self-Education%20and%20the%20Pursuit%20of%20Passion%20Can%20Lead%20to%20a%20Lifetime%20of%20Success%20-%20Autor%20(James%20Marcus%20Bach).pdf"
      }
    ]
  },
  {
    "titulo": "Soft Skills",
    "subtitulo": "The Software Developer's Life Manual",
    "autor": "John Sonmez",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-softskills",
    "ano": 2020,
    "paginas": 306,
    "sinopse": "Obra de referência sobre Soft Skills. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Soft%20Skills%20-%20The%20Software%20Developer's%20Life%20Manual.svg",
    "leituras": 146,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Soft%20Skills%20-%20The%20Software%20Developer's%20Life%20Manual%20-%20Autor%20(John%20Sonmez).pdf"
      }
    ]
  },
  {
    "titulo": "Sprint",
    "subtitulo": null,
    "autor": "Jake Knapp",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-sprint",
    "ano": 2020,
    "paginas": 252,
    "sinopse": "Obra de referência sobre Sprint. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Sprint.svg",
    "leituras": 174,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Sprint%20-%20Autor%20(Jake%20Knapp).pdf"
      }
    ]
  },
  {
    "titulo": "TDD",
    "subtitulo": "Desenvolvimento Guiado por Testes",
    "autor": "Ken Beck",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-tdd",
    "ano": 2020,
    "paginas": 243,
    "sinopse": "Obra de referência sobre TDD. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/TDD%20-%20Desenvolvimento%20Guiado%20por%20Testes.svg",
    "leituras": 590,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/TDD%20-%20Desenvolvimento%20Guiado%20por%20Testes%20-%20Autor%20(Ken%20Beck).pdf"
      }
    ]
  },
  {
    "titulo": "Test-Driven Development",
    "subtitulo": "Teste e Design no Mundo Real",
    "autor": "Casa do Código",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-testdrivendevelopment",
    "ano": 2020,
    "paginas": 315,
    "sinopse": "Obra de referência sobre Test-Driven Development. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Test-Driven%20Development%20-%20Teste%20e%20Design%20no%20Mundo%20Real.svg",
    "leituras": 168,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Test-Driven%20Development%20-%20Teste%20e%20Design%20no%20Mundo%20Real%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Testes Automatizados de Software",
    "subtitulo": "Um Guia Prático",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-testesautomatizadosdesoftware",
    "ano": 2020,
    "paginas": 315,
    "sinopse": "Obra de referência sobre Testes Automatizados de Software. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Testes%20Automatizados%20de%20Software%20-%20Um%20Guia%20Pr%C3%A1tico.svg",
    "leituras": 134,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Testes%20Automatizados%20de%20Software%20-%20Um%20Guia%20Pr%C3%A1tico%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "The Cambridge Handbook of the Learning Sciences",
    "subtitulo": null,
    "autor": "R. Keith Sawyer",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-thecambridgehandbookofthelearningsc",
    "ano": 2020,
    "paginas": 349,
    "sinopse": "Obra de referência sobre The Cambridge Handbook of the Learning Sciences. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/The%20Cambridge%20Handbook%20of%20the%20Learning%20Sciences%20-%20Autor(R.%20Keith%20Sawyer).svg",
    "leituras": 145,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/The%20Cambridge%20Handbook%20of%20the%20Learning%20Sciences%20-%20Autor(R.%20Keith%20Sawyer).pdf"
      }
    ]
  },
  {
    "titulo": "The Mythical Man-Month Essays On Software Engineering",
    "subtitulo": "Author (Frederick P. Brooks)",
    "autor": "Comunidade Tech",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-themythicalmanmonthessaysonsoftware",
    "ano": 2020,
    "paginas": 210,
    "sinopse": "Obra de referência sobre The Mythical Man-Month Essays On Software Engineering. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/The%20Mythical%20Man-Month%20Essays%20On%20Software%20Engineering.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/The%20Mythical%20Man-Month%20Essays%20On%20Software%20Engineering%20-%20Author%20(Frederick%20P.%20Brooks).pdf"
      }
    ]
  },
  {
    "titulo": "The Passionate Programmer",
    "subtitulo": "Creating a Remarkable Career in Software Development",
    "autor": "Chad Fowler",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-thepassionateprogrammer",
    "ano": 2020,
    "paginas": 339,
    "sinopse": "Obra de referência sobre The Passionate Programmer. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/The%20Passionate%20Programmer%20-%20Creating%20a%20Remarkable%20Career%20in%20Software%20Development.svg",
    "leituras": 197,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/The%20Passionate%20Programmer%20-%20Creating%20a%20Remarkable%20Career%20in%20Software%20Development%20-%20Autor%20(Chad%20Fowler).pdf"
      }
    ]
  },
  {
    "titulo": "The Software Craftsman",
    "subtitulo": "Professionalism, Pragmatism, Pride",
    "autor": "Sandro Mancuso",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-thesoftwarecraftsman",
    "ano": 2020,
    "paginas": 245,
    "sinopse": "Obra de referência sobre The Software Craftsman. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/The%20Software%20Craftsman%20-%20Professionalism%2C%20Pragmatism%2C%20Pride.svg",
    "leituras": 188,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/The%20Software%20Craftsman%20-%20Professionalism%2C%20Pragmatism%2C%20Pride%20-%20Autor%20(Sandro%20Mancuso).pdf"
      }
    ]
  },
  {
    "titulo": "ThoughtWorks Antologia Brasil",
    "subtitulo": "Histórias de aprendizado e inovação",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-thoughtworksantologiabrasil",
    "ano": 2020,
    "paginas": 292,
    "sinopse": "Obra de referência sobre ThoughtWorks Antologia Brasil. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/ThoughtWorks%20Antologia%20Brasil%20-%20Hist%C3%B3rias%20de%20aprendizado%20e%20inova%C3%A7%C3%A3o.svg",
    "leituras": 191,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/ThoughtWorks%20Antologia%20Brasil%20-%20Hist%C3%B3rias%20de%20aprendizado%20e%20inova%C3%A7%C3%A3o%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Trabalho Eficaz com Código Legado",
    "subtitulo": null,
    "autor": "Michael C. Feathers",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-trabalhoeficazcomcodigolegado",
    "ano": 2020,
    "paginas": 298,
    "sinopse": "Obra de referência sobre Trabalho Eficaz com Código Legado. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Trabalho%20Eficaz%20com%20C%C3%B3digo%20Legado.svg",
    "leituras": 122,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Trabalho%20Eficaz%20com%20C%C3%B3digo%20Legado%20-%20Autor%20(Michael%20C.%20Feathers).pdf"
      }
    ]
  },
  {
    "titulo": "UX e Usabilidade Aplicados em Mobile e Web",
    "subtitulo": null,
    "autor": "Caelum",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-uxeusabilidadeaplicadosemmobileeweb",
    "ano": 2020,
    "paginas": 256,
    "sinopse": "Obra de referência sobre UX e Usabilidade Aplicados em Mobile e Web. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/UX%20e%20Usabilidade%20Aplicados%20em%20Mobile%20e%20Web.svg",
    "leituras": 195,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/UX%20e%20Usabilidade%20Aplicados%20em%20Mobile%20e%20Web%20-%20Autor%20(Caelum).pdf"
      }
    ]
  },
  {
    "titulo": "Web Design Responsivo",
    "subtitulo": "Páginas adaptáveis para todos os dispositivos",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-webdesignresponsivo",
    "ano": 2020,
    "paginas": 227,
    "sinopse": "Obra de referência sobre Web Design Responsivo. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Web%20Design%20Responsivo%20-%20P%C3%A1ginas%20adapt%C3%A1veis%20para%20todos%20os%20dispositivos.svg",
    "leituras": 140,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/Web%20Design%20Responsivo%20-%20P%C3%A1ginas%20adapt%C3%A1veis%20para%20todos%20os%20dispositivos%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "eXtreme Programming",
    "subtitulo": "Práticas para o dia a dia no desenvolvimento ágil de software",
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-bibliotecadev",
    "fonteIdExterno": "bdev-extremeprogramming",
    "ano": 2020,
    "paginas": 201,
    "sinopse": "Obra de referência sobre eXtreme Programming. Material didático aberto e técnico disponível no acervo colaborativo da BibliotecaDev.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/eXtreme%20Programming%20-%20Pr%C3%A1ticas%20para%20o%20dia%20a%20dia%20no%20desenvolvimento%20%C3%A1gil%20de%20software.svg",
    "leituras": 198,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/LivrosDev/eXtreme%20Programming%20-%20Pr%C3%A1ticas%20para%20o%20dia%20a%20dia%20no%20desenvolvimento%20%C3%A1gil%20de%20software%20-%20Autor%20(Casa%20do%20C%C3%B3digo).pdf"
      }
    ]
  },
  {
    "titulo": "Claudio Luis Vieira Oliveira_ Humberto Augusto Piovesana Zanetti",
    "subtitulo": null,
    "autor": "Arduino Descomplicado_ Como Elaborar Projetos de Eletrônica-Érica",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-claudioluisvieiraoliveirahumbertoau",
    "ano": 2018,
    "paginas": 269,
    "sinopse": "Manual e guia técnico abordando Claudio Luis Vieira Oliveira_ Humberto Augusto Piovesana Zanetti. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 169,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/(Arduino%20Descomplicado)%20Claudio%20Luis%20Vieira%20Oliveira_%20Humberto%20Augusto%20Piovesana%20Zanetti%20-%20Arduino%20Descomplicado_%20Como%20Elaborar%20Projetos%20de%20Eletr%C3%B4nica-%C3%89rica%20(2015).pdf"
      }
    ]
  },
  {
    "titulo": "Embedded Systems Design Using the TI MSP430 Series-Newnes (2003)",
    "subtitulo": null,
    "autor": "Chris Nagy",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-embeddedsystemsdesignusingthetimsp4",
    "ano": 2018,
    "paginas": 249,
    "sinopse": "Manual e guia técnico abordando Embedded Systems Design Using the TI MSP430 Series-Newnes (2003). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 173,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/(Embedded%20Technology)%20Chris%20Nagy%20-%20Embedded%20Systems%20Design%20Using%20the%20TI%20MSP430%20Series-Newnes%20(2003).pdf"
      }
    ]
  },
  {
    "titulo": "Msp430-based Robot Applications. A Guide to Developing Embedded Systems-Newnes (2013)",
    "subtitulo": null,
    "autor": "Dan Harres (Auth.)",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-msp430basedrobotapplicationsaguidet",
    "ano": 2018,
    "paginas": 249,
    "sinopse": "Manual e guia técnico abordando Msp430-based Robot Applications. A Guide to Developing Embedded Systems-Newnes (2013). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 151,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/(EngineeringPro%20collection)%20Dan%20Harres%20(Auth.)%20-%20Msp430-based%20Robot%20Applications.%20A%20Guide%20to%20Developing%20Embedded%20Systems-Newnes%20(2013).pdf"
      }
    ]
  },
  {
    "titulo": "Getting Started with Arduino -Make (2008)",
    "subtitulo": null,
    "autor": "Massimo Banzi",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-gettingstartedwitharduinomake2008",
    "ano": 2018,
    "paginas": 220,
    "sinopse": "Manual e guia técnico abordando Getting Started with Arduino -Make (2008). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 122,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/(Make_%20Projects)%20Massimo%20Banzi%20-%20Getting%20Started%20with%20Arduino%20-Make%20(2008).pdf"
      }
    ]
  },
  {
    "titulo": "Eric Ries",
    "subtitulo": null,
    "autor": "A Startup Enxuta",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-ericries",
    "ano": 2018,
    "paginas": 209,
    "sinopse": "Manual e guia técnico abordando Eric Ries. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/A%20Startup%20Enxuta.svg",
    "leituras": 159,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/A%20Startup%20Enxuta%20-%20Eric%20Ries.pdf"
      }
    ]
  },
  {
    "titulo": "Adrian Fernandez and Dung Dang (Auth.)",
    "subtitulo": null,
    "autor": "Getting Started with the MSP430 Launchpad",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-adrianfernandezanddungdangauth",
    "ano": 2018,
    "paginas": 299,
    "sinopse": "Manual e guia técnico abordando Adrian Fernandez and Dung Dang (Auth.). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 120,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Adrian%20Fernandez%20and%20Dung%20Dang%20(Auth.)%20-%20Getting%20Started%20with%20the%20MSP430%20Launchpad%20(2013).pdf"
      }
    ]
  },
  {
    "titulo": "Algorithms",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-algorithms",
    "ano": 2018,
    "paginas": 273,
    "sinopse": "Manual e guia técnico abordando Algorithms. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 172,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Algorithms.pdf"
      }
    ]
  },
  {
    "titulo": "Aplicacoes Java para a Web Com JDF e JPA",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-aplicacoesjavaparaawebcomjdfejpa",
    "ano": 2018,
    "paginas": 269,
    "sinopse": "Manual e guia técnico abordando Aplicacoes Java para a Web Com JDF e JPA. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 133,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Aplicacoes%20Java%20para%20a%20Web%20Com%20JDF%20e%20JPA%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Aplicacoes web real time com Node-js",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-aplicacoeswebrealtimecomnodejs",
    "ano": 2018,
    "paginas": 206,
    "sinopse": "Manual e guia técnico abordando Aplicacoes web real time com Node-js. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Aplica%C3%A7%C3%B5es%20web%20real%20time%20com%20Node-js.svg",
    "leituras": 154,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Aplicacoes%20web%20real%20time%20com%20Node-js%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Apostila de Administração de Redes Linux",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-apostiladeadministracaoderedeslinux",
    "ano": 2018,
    "paginas": 276,
    "sinopse": "Manual e guia técnico abordando Apostila de Administração de Redes Linux. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 185,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Apostila%20de%20Administra%C3%A7%C3%A3o%20de%20Redes%20Linux.pdf"
      }
    ]
  },
  {
    "titulo": "Apostila de Computação Quântica",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-apostiladecomputacaoquantica",
    "ano": 2018,
    "paginas": 190,
    "sinopse": "Manual e guia técnico abordando Apostila de Computação Quântica. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 136,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Apostila%20de%20Computa%C3%A7%C3%A3o%20Qu%C3%A2ntica.pdf"
      }
    ]
  },
  {
    "titulo": "Apostila de Linux Ubuntu",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-apostiladelinuxubuntu",
    "ano": 2018,
    "paginas": 257,
    "sinopse": "Manual e guia técnico abordando Apostila de Linux Ubuntu. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 182,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Apostila%20de%20Linux%20Ubuntu.pdf"
      }
    ]
  },
  {
    "titulo": "Apostila de computação gráfica",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-apostiladecomputacaografica",
    "ano": 2018,
    "paginas": 254,
    "sinopse": "Manual e guia técnico abordando Apostila de computação gráfica. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 171,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Apostila%20de%20computa%C3%A7%C3%A3o%20gr%C3%A1fica.pdf"
      }
    ]
  },
  {
    "titulo": "Armazenando dados com Redis",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-armazenandodadoscomredis",
    "ano": 2018,
    "paginas": 221,
    "sinopse": "Manual e guia técnico abordando Armazenando dados com Redis. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Armazenando%20dados%20com%20Redis%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Shell Script Profissional",
    "subtitulo": null,
    "autor": "Aurélio Marinho Jargas",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-shellscriptprofissional",
    "ano": 2018,
    "paginas": 199,
    "sinopse": "Manual e guia técnico abordando Shell Script Profissional. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 520,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Aur%C3%A9lio%20Marinho%20Jargas%20-%20Shell%20Script%20Profissional.pdf"
      }
    ]
  },
  {
    "titulo": "C# e Orientação a Objetos",
    "subtitulo": null,
    "autor": "Caelum",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-ceorientacaoaobjetos",
    "ano": 2018,
    "paginas": 236,
    "sinopse": "Manual e guia técnico abordando C# e Orientação a Objetos. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 123,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/C%23%20e%20Orienta%C3%A7%C3%A3o%20a%20Objetos%20-%20Caelum%2C%20FN-13.pdf"
      }
    ]
  },
  {
    "titulo": "CDI Integre as dependencias e contextos do seu codigo Java",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-cdiintegreasdependenciasecontextosd",
    "ano": 2018,
    "paginas": 259,
    "sinopse": "Manual e guia técnico abordando CDI Integre as dependencias e contextos do seu codigo Java. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 135,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/CDI%20Integre%20as%20dependencias%20e%20contextos%20do%20seu%20codigo%20Java%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "CSS Eficiente Técnicas e ferramentas que fazem a diferença nos seus estilos",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-csseficientetecnicaseferramentasque",
    "ano": 2018,
    "paginas": 268,
    "sinopse": "Manual e guia técnico abordando CSS Eficiente Técnicas e ferramentas que fazem a diferença nos seus estilos. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/CSS%20Eficiente%20-%20T%C3%A9cnicas%20e%20ferramentas%20que%20fazem%20a%20diferen%C3%A7a%20nos%20seus%20estilos.svg",
    "leituras": 199,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/CSS%20Eficiente%20T%C3%A9cnicas%20e%20ferramentas%20que%20fazem%20a%20diferen%C3%A7a%20nos%20seus%20estilos%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "CURSO_WD_43_-_DESENVOLVIMENTO_WEB_COM_HT",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-cursowd43desenvolvimentowebcomht",
    "ano": 2018,
    "paginas": 187,
    "sinopse": "Manual e guia técnico abordando CURSO_WD_43_-_DESENVOLVIMENTO_WEB_COM_HT. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/CURSO_WD_43_-_DESENVOLVIMENTO_WEB_COM_HT.pdf"
      }
    ]
  },
  {
    "titulo": "Caderno de Algoritmos",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-cadernodealgoritmos",
    "ano": 2018,
    "paginas": 302,
    "sinopse": "Manual e guia técnico abordando Caderno de Algoritmos. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 179,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Caderno%20de%20Algoritmos.pdf"
      }
    ]
  },
  {
    "titulo": "Caixa de Ferramentas DevOps Um guia para construcao, administracao e arquitetura de sistemas modernos",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-caixadeferramentasdevopsumguiaparac",
    "ano": 2018,
    "paginas": 241,
    "sinopse": "Manual e guia técnico abordando Caixa de Ferramentas DevOps Um guia para construcao, administracao e arquitetura de sistemas modernos. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Caixa%20de%20Ferramentas%20DevOps%20-%20Um%20Guia%20para%20Constru%C3%A7%C3%A3o%2C%20Administra%C3%A7%C3%A3o%20e%20Arquitetura%20de%20Sistemas%20Modernos.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Caixa%20de%20Ferramentas%20DevOps%20Um%20guia%20para%20construcao%2C%20administracao%20e%20arquitetura%20de%20sistemas%20modernos%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Completo PT",
    "subtitulo": null,
    "autor": "Codigo Limpo",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-completopt",
    "ano": 2018,
    "paginas": 316,
    "sinopse": "Manual e guia técnico abordando Completo PT. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 152,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Codigo%20Limpo%20-%20Completo%20PT.pdf"
      }
    ]
  },
  {
    "titulo": "Front-End Handbook",
    "subtitulo": null,
    "autor": "Cody Lindey",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-frontendhandbook",
    "ano": 2018,
    "paginas": 211,
    "sinopse": "Manual e guia técnico abordando Front-End Handbook. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 179,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Cody%20Lindey%20-%20Front-End%20Handbook.pdf"
      }
    ]
  },
  {
    "titulo": "Coletanea Front-End",
    "subtitulo": "Uma Antologia da Comunidade Front End Brasileira",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-coletaneafrontend",
    "ano": 2018,
    "paginas": 194,
    "sinopse": "Manual e guia técnico abordando Coletanea Front-End. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 157,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Coletanea%20Front-End%20-%20Uma%20Antologia%20da%20Comunidade%20Front%20End%20Brasileira%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Componentes Reutilizaveis em Java Com Reflexoes e Anotacoes",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-componentesreutilizaveisemjavacomre",
    "ano": 2018,
    "paginas": 275,
    "sinopse": "Manual e guia técnico abordando Componentes Reutilizaveis em Java Com Reflexoes e Anotacoes. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 185,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Componentes%20Reutilizaveis%20em%20Java%20Com%20Reflexoes%20e%20Anotacoes%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Conhecendo o Adobe Photoshop CS6",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-conhecendooadobephotoshopcs6",
    "ano": 2018,
    "paginas": 248,
    "sinopse": "Manual e guia técnico abordando Conhecendo o Adobe Photoshop CS6. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 182,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Conhecendo%20o%20Adobe%20Photoshop%20CS6%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Containers com Docker do Desenvolvimento a Producao",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-containerscomdockerdodesenvolviment",
    "ano": 2018,
    "paginas": 203,
    "sinopse": "Manual e guia técnico abordando Containers com Docker do Desenvolvimento a Producao. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Containers%20com%20Docker%20-%20Do%20desenvolvimento%20%C3%A0%20produ%C3%A7%C3%A3o.svg",
    "leituras": 144,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Containers%20com%20Docker%20do%20Desenvolvimento%20a%20Producao.pdf"
      }
    ]
  },
  {
    "titulo": "Criando aplicações para o seu Windows Phone",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-criandoaplicacoesparaoseuwindowspho",
    "ano": 2018,
    "paginas": 234,
    "sinopse": "Manual e guia técnico abordando Criando aplicações para o seu Windows Phone. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 159,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Criando%20aplica%C3%A7%C3%B5es%20para%20o%20seu%20Windows%20Phone%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Crypto101",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-crypto101",
    "ano": 2018,
    "paginas": 206,
    "sinopse": "Manual e guia técnico abordando Crypto101. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 140,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Crypto101.pdf"
      }
    ]
  },
  {
    "titulo": "Cucumber e RSpec Construa aplicações Ruby com testes e especificações",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-cucumbererspecconstruaaplicacoesrub",
    "ano": 2018,
    "paginas": 301,
    "sinopse": "Manual e guia técnico abordando Cucumber e RSpec Construa aplicações Ruby com testes e especificações. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 136,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Cucumber%20e%20RSpec%20Construa%20aplica%C3%A7%C3%B5es%20Ruby%20com%20testes%20e%20especifica%C3%A7%C3%B5es%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Cálculo I",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-calculoi",
    "ano": 2018,
    "paginas": 275,
    "sinopse": "Manual e guia técnico abordando Cálculo I. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 137,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/C%C3%A1lculo%20I.pdf"
      }
    ]
  },
  {
    "titulo": "Data Science do zero_ Primeiras",
    "subtitulo": null,
    "autor": "Joel Grus",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-datasciencedozeroprimeiras",
    "ano": 2018,
    "paginas": 261,
    "sinopse": "Manual e guia técnico abordando Data Science do zero_ Primeiras. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 185,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Data%20Science%20do%20zero_%20Primeiras%20-%20Joel%20Grus.pdf"
      }
    ]
  },
  {
    "titulo": "Desbravando Java e Orientação a Objetos Um guia para o iniciante da linguagem",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-desbravandojavaeorientacaoaobjetosu",
    "ano": 2018,
    "paginas": 237,
    "sinopse": "Manual e guia técnico abordando Desbravando Java e Orientação a Objetos Um guia para o iniciante da linguagem. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 184,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Desbravando%20Java%20e%20Orienta%C3%A7%C3%A3o%20a%20Objetos%20Um%20guia%20para%20o%20iniciante%20da%20linguagem%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Desenvolva jogos com HTML5 Canvas e JavaScript",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-desenvolvajogoscomhtml5canvasejavas",
    "ano": 2018,
    "paginas": 310,
    "sinopse": "Manual e guia técnico abordando Desenvolva jogos com HTML5 Canvas e JavaScript. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 164,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Desenvolva%20jogos%20com%20HTML5%20Canvas%20e%20JavaScript%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Desenvolvimento Web com HTML, CSS e JavaScript",
    "subtitulo": null,
    "autor": "Caelum",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-desenvolvimentowebcomhtmlcssejavasc",
    "ano": 2018,
    "paginas": 246,
    "sinopse": "Manual e guia técnico abordando Desenvolvimento Web com HTML, CSS e JavaScript. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 131,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Desenvolvimento%20Web%20com%20HTML%2C%20CSS%20e%20JavaScript%20-%20Caelum%2C%20Curso%20WD-43.pdf"
      }
    ]
  },
  {
    "titulo": "Desenvolvimento de Jogos para Android",
    "subtitulo": "Explore sua imaginacao com o framework Cocos2D",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-desenvolvimentodejogosparaandroid",
    "ano": 2018,
    "paginas": 210,
    "sinopse": "Manual e guia técnico abordando Desenvolvimento de Jogos para Android. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 145,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Desenvolvimento%20de%20Jogos%20para%20Android%20-%20Explore%20sua%20imaginacao%20com%20o%20framework%20Cocos2D%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Desenvolvimento de Jogos para iOS",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-desenvolvimentodejogosparaios",
    "ano": 2018,
    "paginas": 188,
    "sinopse": "Manual e guia técnico abordando Desenvolvimento de Jogos para iOS. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 181,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Desenvolvimento%20de%20Jogos%20para%20iOS%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Desenvolvimento web com ASP.NET MVC",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-desenvolvimentowebcomaspnetmvc",
    "ano": 2018,
    "paginas": 306,
    "sinopse": "Manual e guia técnico abordando Desenvolvimento web com ASP.NET MVC. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 183,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Desenvolvimento%20web%20com%20ASP.NET%20MVC%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Test-Driven Development no Mundo Real com PHP",
    "subtitulo": "Teste e Design no Mundo Real com PHP",
    "autor": "Maurício Aniche",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-desenvolvimentowebcomphpemysql",
    "ano": 2018,
    "paginas": 242,
    "sinopse": "Manual e guia técnico abordando Desenvolvimento web com PHP e MySQL. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 150,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Desenvolvimento%20web%20com%20PHP%20e%20MySQL%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Design Patterns com Java",
    "subtitulo": "Projeto orientado a objetos guiado por padrões",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-designpatternscomjava",
    "ano": 2018,
    "paginas": 257,
    "sinopse": "Manual e guia técnico abordando Design Patterns com Java. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 620,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Design%20Patterns%20com%20Java%20-%20Projeto%20orientado%20a%20objetos%20guiado%20por%20padr%C3%B5es%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Design_Patterns",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-designpatterns",
    "ano": 2018,
    "paginas": 315,
    "sinopse": "Manual e guia técnico abordando Design_Patterns. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 181,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Design_Patterns.pdf"
      }
    ]
  },
  {
    "titulo": "Entrega de software confiável e automatizada",
    "subtitulo": null,
    "autor": "DevOps Na prática",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-entregadesoftwareconfiaveleautomati",
    "ano": 2018,
    "paginas": 297,
    "sinopse": "Manual e guia técnico abordando Entrega de software confiável e automatizada. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/DevOps%20na%20Pr%C3%A1tica%20-%20Entrega%20de%20Software%20Confi%C3%A1vel%20e%20Automatizada.svg",
    "leituras": 184,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/DevOps%20Na%20pr%C3%A1tica%20-%20Entrega%20de%20software%20confi%C3%A1vel%20e%20automatizada.pdf"
      }
    ]
  },
  {
    "titulo": "Diego Martins de Pinho",
    "subtitulo": "Javascript",
    "autor": "ECMAScript 6 Entre de cabeça no futuro do JavaScript",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-diegomartinsdepinho",
    "ano": 2018,
    "paginas": 283,
    "sinopse": "Manual e guia técnico abordando Diego Martins de Pinho. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 181,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Diego%20Martins%20de%20Pinho%20-%20Javascript%20-%20ECMAScript%206%20Entre%20de%20cabe%C3%A7a%20no%20futuro%20do%20JavaScript.pdf"
      }
    ]
  },
  {
    "titulo": "Criando aplicacoes de forma enxuta",
    "subtitulo": null,
    "autor": "Direto ao ponto",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-criandoaplicacoesdeformaenxuta",
    "ano": 2018,
    "paginas": 236,
    "sinopse": "Manual e guia técnico abordando Criando aplicacoes de forma enxuta. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 171,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Direto%20ao%20ponto%20-%20Criando%20aplicacoes%20de%20forma%20enxuta.pdf"
      }
    ]
  },
  {
    "titulo": "Dominando JavaScript Com Jquery",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-dominandojavascriptcomjquery",
    "ano": 2018,
    "paginas": 202,
    "sinopse": "Manual e guia técnico abordando Dominando JavaScript Com Jquery. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 164,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Dominando%20JavaScript%20Com%20Jquery%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "EBook",
    "subtitulo": "eMotion Studios",
    "autor": "Como transformar sua ideia em startup em 4 passos (1)",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-ebook",
    "ano": 2018,
    "paginas": 208,
    "sinopse": "Manual e guia técnico abordando EBook. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 127,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/EBook%20-%20eMotion%20Studios%20-%20Como%20transformar%20sua%20ideia%20em%20startup%20em%204%20passos%20(1).pdf"
      }
    ]
  },
  {
    "titulo": "Ebook VirtualBox",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-ebookvirtualbox",
    "ano": 2018,
    "paginas": 183,
    "sinopse": "Manual e guia técnico abordando Ebook VirtualBox. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 185,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Ebook%20VirtualBox.pdf"
      }
    ]
  },
  {
    "titulo": "Ebook em games",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-ebookemgames",
    "ano": 2018,
    "paginas": 318,
    "sinopse": "Manual e guia técnico abordando Ebook em games. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 152,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Ebook%20em%20games.pdf"
      }
    ]
  },
  {
    "titulo": "Edicao e organizacao de fotos com Adobe Lightroom",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-edicaoeorganizacaodefotoscomadobeli",
    "ano": 2018,
    "paginas": 254,
    "sinopse": "Manual e guia técnico abordando Edicao e organizacao de fotos com Adobe Lightroom. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 144,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Edicao%20e%20organizacao%20de%20fotos%20com%20Adobe%20Lightroom.pdf"
      }
    ]
  },
  {
    "titulo": "Elasticsearch consumindo dados real time com ELK",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-elasticsearchconsumindodadosrealtim",
    "ano": 2018,
    "paginas": 192,
    "sinopse": "Manual e guia técnico abordando Elasticsearch consumindo dados real time com ELK. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 138,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Elasticsearch%20consumindo%20dados%20real%20time%20com%20ELK.pdf"
      }
    ]
  },
  {
    "titulo": "Eloquent javascript",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-eloquentjavascript",
    "ano": 2018,
    "paginas": 190,
    "sinopse": "Manual e guia técnico abordando Eloquent javascript. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 126,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Eloquent%20javascript.pdf"
      }
    ]
  },
  {
    "titulo": "Estrutura de Dados, algoritmos, análise da complexidade e implementações em Java e C, C--",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-estruturadedadosalgoritmosanaliseda",
    "ano": 2018,
    "paginas": 218,
    "sinopse": "Manual e guia técnico abordando Estrutura de Dados, algoritmos, análise da complexidade e implementações em Java e C, C--. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Estrutura%20de%20Dados%2C%20algoritmos%2C%20an%C3%A1lise%20da%20complexidade%20e%20implementa%C3%A7%C3%B5es%20em%20Java%20e%20C%2C%20C--.pdf"
      }
    ]
  },
  {
    "titulo": "Everton Coimbra de Araújo",
    "subtitulo": "Asp.NET Core MVC",
    "autor": "Aplicações Modernas em Conjunto com o Entity Framework",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-evertoncoimbradearaujo",
    "ano": 2018,
    "paginas": 207,
    "sinopse": "Manual e guia técnico abordando Everton Coimbra de Araújo. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 132,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Everton%20Coimbra%20de%20Ara%C3%BAjo%20-%20Asp.NET%20Core%20MVC%20-%20%20Aplica%C3%A7%C3%B5es%20Modernas%20em%20Conjunto%20com%20o%20Entity%20Framework.pdf"
      }
    ]
  },
  {
    "titulo": "Explorando APIs e bibliotecas Java JDBC, IO, Threads, JavaFX e mais",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-explorandoapisebibliotecasjavajdbci",
    "ano": 2018,
    "paginas": 304,
    "sinopse": "Manual e guia técnico abordando Explorando APIs e bibliotecas Java JDBC, IO, Threads, JavaFX e mais. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 189,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Explorando%20APIs%20e%20bibliotecas%20Java%20JDBC%2C%20IO%2C%20Threads%2C%20JavaFX%20e%20mais%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Falando de Grails Altíssima produtividade no desenvolvimento web",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-falandodegrailsaltissimaprodutivida",
    "ano": 2018,
    "paginas": 275,
    "sinopse": "Manual e guia técnico abordando Falando de Grails Altíssima produtividade no desenvolvimento web. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 177,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Falando%20de%20Grails%20Alt%C3%ADssima%20produtividade%20no%20desenvolvimento%20web%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Como aumentar as chances de sucesso do seu software",
    "subtitulo": null,
    "autor": "Gestão de produtos",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-comoaumentaraschancesdesucessodoseu",
    "ano": 2018,
    "paginas": 264,
    "sinopse": "Manual e guia técnico abordando Como aumentar as chances de sucesso do seu software. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Gest%C3%A3o%20de%20produtos%20-%20Como%20aumentar%20as%20chances%20de%20sucesso%20do%20seu%20software.svg",
    "leituras": 157,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Gest%C3%A3o%20de%20produtos%20-%20Como%20aumentar%20as%20chances%20de%20sucesso%20do%20seu%20software.pdf"
      }
    ]
  },
  {
    "titulo": "crie aplicações para celulares e tablets",
    "subtitulo": null,
    "autor": "Google Android",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-crieaplicacoesparacelularesetablets",
    "ano": 2018,
    "paginas": 249,
    "sinopse": "Manual e guia técnico abordando crie aplicações para celulares e tablets. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Google%20Android%20-%20crie%20aplica%C3%A7%C3%B5es%20para%20celulares%20e%20tablets.svg",
    "leituras": 142,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Google%20Android%20-%20crie%20aplica%C3%A7%C3%B5es%20para%20celulares%20e%20tablets.pdf"
      }
    ]
  },
  {
    "titulo": "Construindo Servicos na Nuvem",
    "subtitulo": null,
    "autor": "Google App Engine",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-construindoservicosnanuvem",
    "ano": 2018,
    "paginas": 201,
    "sinopse": "Manual e guia técnico abordando Construindo Servicos na Nuvem. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 123,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Google%20App%20Engine%20-%20Construindo%20Servicos%20na%20Nuvem.pdf"
      }
    ]
  },
  {
    "titulo": "O caminho das pedras para ser um dev front-end",
    "subtitulo": null,
    "autor": "Guia Front-End",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-ocaminhodaspedrasparaserumdevfronte",
    "ano": 2018,
    "paginas": 313,
    "sinopse": "Manual e guia técnico abordando O caminho das pedras para ser um dev front-end. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 122,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Guia%20Front-End%20-%20O%20caminho%20das%20pedras%20para%20ser%20um%20dev%20front-end.pdf"
      }
    ]
  },
  {
    "titulo": "Guia da Startup Como startups e empresas estabelecidas podem criar produtos web rentáveis",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-guiadastartupcomostartupseempresase",
    "ano": 2018,
    "paginas": 269,
    "sinopse": "Manual e guia técnico abordando Guia da Startup Como startups e empresas estabelecidas podem criar produtos web rentáveis. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Guia%20da%20Startup%20-%20Como%20Startups%20e%20Empresas%20Estabelecidas%20Podem%20Criar%20Produtos%20Web%20Rent%C3%A1veis.svg",
    "leituras": 147,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Guia%20da%20Startup%20Como%20startups%20e%20empresas%20estabelecidas%20podem%20criar%20produtos%20web%20rent%C3%A1veis%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Guilherme Silveira, Mário Amaral",
    "subtitulo": "Java SE 8 Programmer I",
    "autor": "O guia para sua Certificação Oracle Certified Associate",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-guilhermesilveiramarioamaral",
    "ano": 2018,
    "paginas": 209,
    "sinopse": "Manual e guia técnico abordando Guilherme Silveira, Mário Amaral. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 162,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Guilherme%20Silveira%2C%20M%C3%A1rio%20Amaral%20-%20Java%20SE%208%20Programmer%20I%20-%20O%20guia%20para%20sua%20Certifica%C3%A7%C3%A3o%20Oracle%20Certified%20Associate.pdf"
      }
    ]
  },
  {
    "titulo": "Domine a web do futuro",
    "subtitulo": null,
    "autor": "HTML5 e CSS3",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-domineawebdofuturo",
    "ano": 2018,
    "paginas": 242,
    "sinopse": "Manual e guia técnico abordando Domine a web do futuro. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/HTML5%20e%20CSS3%20-%20domine%20a%20web%20do%20futuro.svg",
    "leituras": 180,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/HTML5%20e%20CSS3%20-%20Domine%20a%20web%20do%20futuro.pdf"
      }
    ]
  },
  {
    "titulo": "HTML5_e_CSS3_com_farinha_e_pimenta",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-html5ecss3comfarinhaepimenta",
    "ano": 2018,
    "paginas": 218,
    "sinopse": "Manual e guia técnico abordando HTML5_e_CSS3_com_farinha_e_pimenta. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 154,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/HTML5_e_CSS3_com_farinha_e_pimenta.pdf"
      }
    ]
  },
  {
    "titulo": "Html5_e_css3_domine_a_web_do_futuro_fran (1)",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-html5ecss3domineawebdofuturofran1",
    "ano": 2018,
    "paginas": 286,
    "sinopse": "Manual e guia técnico abordando Html5_e_css3_domine_a_web_do_futuro_fran (1). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/HTML5%20e%20CSS3%20-%20domine%20a%20web%20do%20futuro.svg",
    "leituras": 166,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Html5_e_css3_domine_a_web_do_futuro_fran%20(1).pdf"
      }
    ]
  },
  {
    "titulo": "Sensors and Transducers-Newnes (2001)",
    "subtitulo": null,
    "autor": "Ian Sinclair",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-sensorsandtransducersnewnes2001",
    "ano": 2018,
    "paginas": 207,
    "sinopse": "Manual e guia técnico abordando Sensors and Transducers-Newnes (2001). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 185,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Ian%20Sinclair%20-%20Sensors%20and%20Transducers-Newnes%20(2001).pdf"
      }
    ]
  },
  {
    "titulo": "Inteligência Artificial",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-inteligenciaartificial",
    "ano": 2018,
    "paginas": 217,
    "sinopse": "Manual e guia técnico abordando Inteligência Artificial. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 146,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Intelig%C3%AAncia%20Artificial.pdf"
      }
    ]
  },
  {
    "titulo": "Introducao ao Calculo Diferencial",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-introducaoaocalculodiferencial",
    "ano": 2018,
    "paginas": 266,
    "sinopse": "Manual e guia técnico abordando Introducao ao Calculo Diferencial. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 183,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Introducao%20ao%20Calculo%20Diferencial.pdf"
      }
    ]
  },
  {
    "titulo": "Introducao ao Calculo Integral",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-introducaoaocalculointegral",
    "ano": 2018,
    "paginas": 317,
    "sinopse": "Manual e guia técnico abordando Introducao ao Calculo Integral. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 178,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Introducao%20ao%20Calculo%20Integral.pdf"
      }
    ]
  },
  {
    "titulo": "Introdução a arquitetura e design de software",
    "subtitulo": null,
    "autor": "Uma visão sobre a plataforma JAVA",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-introducaoaarquiteturaedesigndesoft",
    "ano": 2018,
    "paginas": 276,
    "sinopse": "Manual e guia técnico abordando Introdução a arquitetura e design de software. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Introdu%C3%A7%C3%A3o%20a%20arquitetura%20e%20design%20de%20software%20-%20Uma%20vis%C3%A3o%20sobre%20a%20plataforma%20JAVA.pdf"
      }
    ]
  },
  {
    "titulo": "Introdução à Arquitetura e Design de Software",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-introducaoaarquiteturaedesigndesoft-87",
    "ano": 2018,
    "paginas": 256,
    "sinopse": "Manual e guia técnico abordando Introdução à Arquitetura e Design de Software. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 151,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Introdu%C3%A7%C3%A3o%20%C3%A0%20Arquitetura%20e%20Design%20de%20Software%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Introdução à Computação Da Lógica aos jogos com Ruby",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-introducaoacomputacaodalogicaaosjog",
    "ano": 2018,
    "paginas": 188,
    "sinopse": "Manual e guia técnico abordando Introdução à Computação Da Lógica aos jogos com Ruby. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 126,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Introdu%C3%A7%C3%A3o%20%C3%A0%20Computa%C3%A7%C3%A3o%20Da%20L%C3%B3gica%20aos%20jogos%20com%20Ruby%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Introdução à programação em C",
    "subtitulo": null,
    "autor": "Os primeiros passos de um desenvolvedor",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-introducaoaprogramacaoemc",
    "ano": 2018,
    "paginas": 250,
    "sinopse": "Manual e guia técnico abordando Introdução à programação em C. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 123,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Introdu%C3%A7%C3%A3o%20%C3%A0%20programa%C3%A7%C3%A3o%20em%20C%20-%20Os%20primeiros%20passos%20de%20um%20desenvolvedor.pdf"
      }
    ]
  },
  {
    "titulo": "JPA Eficaz",
    "subtitulo": "As melhores praticas de persistencia de dados em Java",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-jpaeficaz",
    "ano": 2018,
    "paginas": 303,
    "sinopse": "Manual e guia técnico abordando JPA Eficaz. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 196,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/JPA%20Eficaz%20-%20As%20melhores%20praticas%20de%20persistencia%20de%20dados%20em%20Java%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "JSF Eficaz",
    "subtitulo": "As melhores práticas para o desenvolvedor web Java",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-jsfeficaz",
    "ano": 2018,
    "paginas": 202,
    "sinopse": "Manual e guia técnico abordando JSF Eficaz. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 154,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/JSF%20Eficaz%20-%20As%20melhores%20pr%C3%A1ticas%20para%20o%20desenvolvedor%20web%20Java%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Java 8 Pratico Lambdas Streams e os Novos Recursos da Linguagem",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-java8praticolambdasstreamseosnovosr",
    "ano": 2018,
    "paginas": 209,
    "sinopse": "Manual e guia técnico abordando Java 8 Pratico Lambdas Streams e os Novos Recursos da Linguagem. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 131,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Java%208%20Pratico%20Lambdas%20Streams%20e%20os%20Novos%20Recursos%20da%20Linguagem%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Java SE 7 Programmer I O guia para sua certificação Oracle Certified Associate",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javase7programmerioguiaparasuacerti",
    "ano": 2018,
    "paginas": 242,
    "sinopse": "Manual e guia técnico abordando Java SE 7 Programmer I O guia para sua certificação Oracle Certified Associate. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 175,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Java%20SE%207%20Programmer%20I%20O%20guia%20para%20sua%20certifica%C3%A7%C3%A3o%20Oracle%20Certified%20Associate%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Java e Orientação a Objetos",
    "subtitulo": null,
    "autor": "Caelum",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javaeorientacaoaobjetos",
    "ano": 2018,
    "paginas": 308,
    "sinopse": "Manual e guia técnico abordando Java e Orientação a Objetos. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 141,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Java%20e%20Orienta%C3%A7%C3%A3o%20a%20Objetos%20-%20Caelum%2C%20Curso%20FJ-11.pdf"
      }
    ]
  },
  {
    "titulo": "Java e Orientações a Objetos",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javaeorientacoesaobjetos",
    "ano": 2018,
    "paginas": 287,
    "sinopse": "Manual e guia técnico abordando Java e Orientações a Objetos. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 130,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Java%20e%20Orienta%C3%A7%C3%B5es%20a%20Objetos.pdf"
      }
    ]
  },
  {
    "titulo": "Java para Desenvolvimento Web",
    "subtitulo": null,
    "autor": "Caelum",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javaparadesenvolvimentoweb",
    "ano": 2018,
    "paginas": 291,
    "sinopse": "Manual e guia técnico abordando Java para Desenvolvimento Web. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 184,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Java%20para%20Desenvolvimento%20Web%20-%20Caelum%2C%20FJ-21.pdf"
      }
    ]
  },
  {
    "titulo": "Interfaces com qualidade para aplicacoes desktop",
    "subtitulo": null,
    "autor": "JavaFX",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-interfacescomqualidadeparaaplicacoe",
    "ano": 2018,
    "paginas": 226,
    "sinopse": "Manual e guia técnico abordando Interfaces com qualidade para aplicacoes desktop. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 195,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/JavaFX%20-%20Interfaces%20com%20qualidade%20para%20aplicacoes%20desktop.pdf"
      }
    ]
  },
  {
    "titulo": "JavaFX Interfaces com qualidade para aplicacoes desktop",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javafxinterfacescomqualidadeparaapl",
    "ano": 2018,
    "paginas": 287,
    "sinopse": "Manual e guia técnico abordando JavaFX Interfaces com qualidade para aplicacoes desktop. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 128,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/JavaFX%20Interfaces%20com%20qualidade%20para%20aplicacoes%20desktop%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "JavaScript O Guia Definitivo_v2",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javascriptoguiadefinitivov2",
    "ano": 2018,
    "paginas": 296,
    "sinopse": "Manual e guia técnico abordando JavaScript O Guia Definitivo_v2. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 138,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/JavaScript%20O%20Guia%20Definitivo_v2.pdf"
      }
    ]
  },
  {
    "titulo": "JavaScriptNotesForProfessionals",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javascriptnotesforprofessionals",
    "ano": 2018,
    "paginas": 222,
    "sinopse": "Manual e guia técnico abordando JavaScriptNotesForProfessionals. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 129,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/JavaScriptNotesForProfessionals.pdf"
      }
    ]
  },
  {
    "titulo": "Java_Programming",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javaprogramming",
    "ano": 2018,
    "paginas": 308,
    "sinopse": "Manual e guia técnico abordando Java_Programming. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 183,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Java_Programming.pdf"
      }
    ]
  },
  {
    "titulo": "Javascript",
    "subtitulo": "Cangaceiro JavaScript",
    "autor": "Uma Aventura no Sertão da Programacao",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javascript",
    "ano": 2018,
    "paginas": 196,
    "sinopse": "Manual e guia técnico abordando Javascript. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Guia%20pr%C3%A1tico%20de%20TypeScript%20-%20Melhore%20suas%20aplica%C3%A7%C3%B5es%20JavaScript.svg",
    "leituras": 143,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Javascript%20-%20Cangaceiro%20JavaScript%20-%20Uma%20Aventura%20no%20Sert%C3%A3o%20da%20Programacao.pdf"
      }
    ]
  },
  {
    "titulo": "Automatize tudo sem complicacoes",
    "subtitulo": null,
    "autor": "Jenkins",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-automatizetudosemcomplicacoes",
    "ano": 2018,
    "paginas": 265,
    "sinopse": "Manual e guia técnico abordando Automatize tudo sem complicacoes. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Jenkins%20-%20Automatize%20Tudo%20sem%20Complica%C3%A7%C3%B5es.svg",
    "leituras": 174,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Jenkins%20-%20%20Automatize%20tudo%20sem%20complicacoes.pdf"
      }
    ]
  },
  {
    "titulo": "Analog and Digital Circuits for Electronic Control System Applications_ Using the TI MSP430 Microcontroller-Newnes (2004)",
    "subtitulo": null,
    "autor": "Jerry Luecke",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-analoganddigitalcircuitsforelectron",
    "ano": 2018,
    "paginas": 228,
    "sinopse": "Manual e guia técnico abordando Analog and Digital Circuits for Electronic Control System Applications_ Using the TI MSP430 Microcontroller-Newnes (2004). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Jerry%20Luecke%20-%20Analog%20and%20Digital%20Circuits%20for%20Electronic%20Control%20System%20Applications_%20Using%20the%20TI%20MSP430%20Microcontroller-Newnes%20(2004).pdf"
      }
    ]
  },
  {
    "titulo": "Jogos Android",
    "subtitulo": "Crie um game do zero usando classes nativas",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-jogosandroid",
    "ano": 2018,
    "paginas": 278,
    "sinopse": "Manual e guia técnico abordando Jogos Android. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 157,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Jogos%20Android%20-%20Crie%20um%20game%20do%20zero%20usando%20classes%20nativas%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Jogos em HTML5 Explore o mobile e física",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-jogosemhtml5exploreomobileefisica",
    "ano": 2018,
    "paginas": 266,
    "sinopse": "Manual e guia técnico abordando Jogos em HTML5 Explore o mobile e física. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 160,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Jogos%20em%20HTML5%20Explore%20o%20mobile%20e%20f%C3%ADsica%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "John H. Davies-MSP430 Microcontroller Basics-Newnes (2008)",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-johnhdaviesmsp430microcontrollerbas",
    "ano": 2018,
    "paginas": 213,
    "sinopse": "Manual e guia técnico abordando John H. Davies-MSP430 Microcontroller Basics-Newnes (2008). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 141,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/John%20H.%20Davies-MSP430%20Microcontroller%20Basics-Newnes%20(2008).pdf"
      }
    ]
  },
  {
    "titulo": "John Lovine-PIC Microcontroller Project Book-McGraw-Hill (2000)",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-johnlovinepicmicrocontrollerproject",
    "ano": 2018,
    "paginas": 240,
    "sinopse": "Manual e guia técnico abordando John Lovine-PIC Microcontroller Project Book-McGraw-Hill (2000). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 172,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/John%20Lovine-PIC%20Microcontroller%20Project%20Book-McGraw-Hill%20(2000).pdf"
      }
    ]
  },
  {
    "titulo": "Programando  Excel ® Vba Para Leigos",
    "subtitulo": null,
    "autor": "John Walkenbach",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-programandoexcelvbaparaleigos",
    "ano": 2018,
    "paginas": 192,
    "sinopse": "Manual e guia técnico abordando Programando  Excel ® Vba Para Leigos. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 158,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/John%20Walkenbach%20-%20Programando%20%20Excel%20%C2%AE%20Vba%20Para%20Leigos.pdf"
      }
    ]
  },
  {
    "titulo": "Kenneth Lewenhagen, Anders Åkesson",
    "subtitulo": null,
    "autor": "Node.js in Open Source projects on Github",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-kennethlewenhagenandersakesson",
    "ano": 2018,
    "paginas": 313,
    "sinopse": "Manual e guia técnico abordando Kenneth Lewenhagen, Anders Åkesson. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 192,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Kenneth%20Lewenhagen%2C%20Anders%20%C3%85kesson%20-%20Node.js%20in%20Open%20Source%20projects%20on%20Github.pdf"
      }
    ]
  },
  {
    "titulo": "Como empresas de alta performance inovam em escala",
    "subtitulo": null,
    "autor": "LEAN ENTERPRISE",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-comoempresasdealtaperformanceinovam",
    "ano": 2018,
    "paginas": 241,
    "sinopse": "Manual e guia técnico abordando Como empresas de alta performance inovam em escala. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/LEAN%20ENTERPRISE%20-%20Como%20empresas%20de%20alta%20performance%20inovam%20em%20escala.svg",
    "leituras": 197,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/LEAN%20ENTERPRISE%20-%20Como%20empresas%20de%20alta%20performance%20inovam%20em%20escala.pdf"
      }
    ]
  },
  {
    "titulo": "Linux-a-biblia-pt-br",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-linuxabibliaptbr",
    "ano": 2018,
    "paginas": 311,
    "sinopse": "Manual e guia técnico abordando Linux-a-biblia-pt-br. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 185,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Linux-a-biblia-pt-br.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de A Computacao pessoal e o Sistema operacional Linux",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodeacomputacaopessoaleosistemao",
    "ano": 2018,
    "paginas": 260,
    "sinopse": "Manual e guia técnico abordando Livro de A Computacao pessoal e o Sistema operacional Linux. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 170,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20A%20Computacao%20pessoal%20e%20o%20Sistema%20operacional%20Linux.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Arquitetura e Organização de Computadores(1)",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodearquiteturaeorganizacaodecom",
    "ano": 2018,
    "paginas": 214,
    "sinopse": "Manual e guia técnico abordando Livro de Arquitetura e Organização de Computadores(1). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 138,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Arquitetura%20e%20Organiza%C3%A7%C3%A3o%20de%20Computadores(1).pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Arquitetura e organização de computadores",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodearquiteturaeorganizacaodecom-117",
    "ano": 2018,
    "paginas": 219,
    "sinopse": "Manual e guia técnico abordando Livro de Arquitetura e organização de computadores. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 179,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Arquitetura%20e%20organiza%C3%A7%C3%A3o%20de%20computadores.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Big Data",
    "subtitulo": null,
    "autor": "Tecnicas extracao de valor dos dados",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodebigdata",
    "ano": 2018,
    "paginas": 246,
    "sinopse": "Manual e guia técnico abordando Livro de Big Data. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 142,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Big%20Data%20-%20Tecnicas%20extracao%20de%20valor%20dos%20dados.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Compilladores",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodecompilladores",
    "ano": 2018,
    "paginas": 312,
    "sinopse": "Manual e guia técnico abordando Livro de Compilladores. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 151,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Compilladores.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Comunicação de Dados e Redes de Computadores",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodecomunicacaodedadoseredesdeco",
    "ano": 2018,
    "paginas": 247,
    "sinopse": "Manual e guia técnico abordando Livro de Comunicação de Dados e Redes de Computadores. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Comunica%C3%A7%C3%A3o%20de%20Dados%20e%20Redes%20de%20Computadores.svg",
    "leituras": 146,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Comunica%C3%A7%C3%A3o%20de%20Dados%20e%20Redes%20de%20Computadores.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Desenvolvimento de jogos 3D",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodedesenvolvimentodejogos3d",
    "ano": 2018,
    "paginas": 203,
    "sinopse": "Manual e guia técnico abordando Livro de Desenvolvimento de jogos 3D. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Desenvolvimento%20de%20jogos%203D.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Entendendo e Dominando o Linux",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodeentendendoedominandoolinux",
    "ano": 2018,
    "paginas": 208,
    "sinopse": "Manual e guia técnico abordando Livro de Entendendo e Dominando o Linux. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 141,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Entendendo%20e%20Dominando%20o%20Linux.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Inteligência Artificial",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodeinteligenciaartificial",
    "ano": 2018,
    "paginas": 192,
    "sinopse": "Manual e guia técnico abordando Livro de Inteligência Artificial. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 121,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Intelig%C3%AAncia%20Artificial.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Introdução ao ambiente windows",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodeintroducaoaoambientewindows",
    "ano": 2018,
    "paginas": 215,
    "sinopse": "Manual e guia técnico abordando Livro de Introdução ao ambiente windows. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 144,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Introdu%C3%A7%C3%A3o%20ao%20ambiente%20windows.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Introdução à Mineração de Dados",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodeintroducaoamineracaodedados",
    "ano": 2018,
    "paginas": 235,
    "sinopse": "Manual e guia técnico abordando Livro de Introdução à Mineração de Dados. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 127,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Introdu%C3%A7%C3%A3o%20%C3%A0%20Minera%C3%A7%C3%A3o%20de%20Dados.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Java",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodejava",
    "ano": 2018,
    "paginas": 284,
    "sinopse": "Manual e guia técnico abordando Livro de Java. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 180,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Java.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Javascript",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodejavascript",
    "ano": 2018,
    "paginas": 210,
    "sinopse": "Manual e guia técnico abordando Livro de Javascript. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 124,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Javascript.pdf"
      }
    ]
  },
  {
    "titulo": "A Bíblia",
    "subtitulo": null,
    "autor": "Livro de Linux",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-abiblia",
    "ano": 2018,
    "paginas": 248,
    "sinopse": "Manual e guia técnico abordando A Bíblia. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 189,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Linux%20-%20A%20B%C3%ADblia.pdf"
      }
    ]
  },
  {
    "titulo": "o guia essencial",
    "subtitulo": null,
    "autor": "Livro de Linux",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-oguiaessencial",
    "ano": 2018,
    "paginas": 187,
    "sinopse": "Manual e guia técnico abordando o guia essencial. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 192,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Linux%20-%20o%20guia%20essencial.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Montagem e Manutenção de Computadores",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodemontagememanutencaodecomputa",
    "ano": 2018,
    "paginas": 235,
    "sinopse": "Manual e guia técnico abordando Livro de Montagem e Manutenção de Computadores. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 181,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Montagem%20e%20Manuten%C3%A7%C3%A3o%20de%20Computadores.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Montagtem, Manutenção e Configuração de Computadores",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodemontagtemmanutencaoeconfigur",
    "ano": 2018,
    "paginas": 200,
    "sinopse": "Manual e guia técnico abordando Livro de Montagtem, Manutenção e Configuração de Computadores. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 135,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Montagtem%2C%20Manuten%C3%A7%C3%A3o%20e%20Configura%C3%A7%C3%A3o%20de%20Computadores.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de MySQL",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodemysql",
    "ano": 2018,
    "paginas": 296,
    "sinopse": "Manual e guia técnico abordando Livro de MySQL. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 164,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20MySQL.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Oracle Database 11g Sql",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodeoracledatabase11gsql",
    "ano": 2018,
    "paginas": 297,
    "sinopse": "Manual e guia técnico abordando Livro de Oracle Database 11g Sql. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 124,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Oracle%20Database%2011g%20Sql.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Python (Automatize tarefas maçantes)",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodepythonautomatizetarefasmacan",
    "ano": 2018,
    "paginas": 289,
    "sinopse": "Manual e guia técnico abordando Livro de Python (Automatize tarefas maçantes). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 170,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Python%20(Automatize%20tarefas%20ma%C3%A7antes).pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Python (desenvolvedores)",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodepythondesenvolvedores",
    "ano": 2018,
    "paginas": 225,
    "sinopse": "Manual e guia técnico abordando Livro de Python (desenvolvedores). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 173,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Python%20(desenvolvedores).pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Python",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodepython",
    "ano": 2018,
    "paginas": 291,
    "sinopse": "Manual e guia técnico abordando Livro de Python. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 189,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Python.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Rede de Computadores e a Internet",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livroderededecomputadoreseainternet",
    "ano": 2018,
    "paginas": 199,
    "sinopse": "Manual e guia técnico abordando Livro de Rede de Computadores e a Internet. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 130,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Rede%20de%20Computadores%20e%20a%20Internet.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Sistemas Operacionais",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodesistemasoperacionais",
    "ano": 2018,
    "paginas": 235,
    "sinopse": "Manual e guia técnico abordando Livro de Sistemas Operacionais. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 177,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Sistemas%20Operacionais.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Sistemas de Banco de Dados",
    "subtitulo": null,
    "autor": "4ª Edição",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodesistemasdebancodedados",
    "ano": 2018,
    "paginas": 200,
    "sinopse": "Manual e guia técnico abordando Livro de Sistemas de Banco de Dados. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 159,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Sistemas%20de%20Banco%20de%20Dados%20-%204%C2%AA%20Edi%C3%A7%C3%A3o.pdf"
      }
    ]
  },
  {
    "titulo": "Livro de Windows",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-livrodewindows",
    "ano": 2018,
    "paginas": 184,
    "sinopse": "Manual e guia técnico abordando Livro de Windows. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Livro%20de%20Windows.pdf"
      }
    ]
  },
  {
    "titulo": "Logica de programacao",
    "subtitulo": "Crie seus primeiros programas usando javascript e html",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-logicadeprogramacao",
    "ano": 2018,
    "paginas": 196,
    "sinopse": "Manual e guia técnico abordando Logica de programacao. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 191,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Logica%20de%20programacao%20-%20Crie%20seus%20primeiros%20programas%20usando%20javascript%20e%20html%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Luiz Eduardo Borges",
    "subtitulo": "Python para Desenvolvedores",
    "autor": "2° Edição",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-luizeduardoborges",
    "ano": 2018,
    "paginas": 255,
    "sinopse": "Manual e guia técnico abordando Luiz Eduardo Borges. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 192,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Luiz%20Eduardo%20Borges%20-%20Python%20para%20Desenvolvedores%20-%202%C2%B0%20Edi%C3%A7%C3%A3o.pdf"
      }
    ]
  },
  {
    "titulo": "Manuel Jiménez, Rogelio Palomera, Isidoro Couvertier (auth.)",
    "subtitulo": null,
    "autor": "Introduction to Embedded Systems_ Using Microcontrollers and the MSP430-Springer-Verlag New York",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-manueljimenezrogeliopalomeraisidoro",
    "ano": 2018,
    "paginas": 252,
    "sinopse": "Manual e guia técnico abordando Manuel Jiménez, Rogelio Palomera, Isidoro Couvertier (auth.). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Manuel%20Jim%C3%A9nez%2C%20Rogelio%20Palomera%2C%20Isidoro%20Couvertier%20(auth.)%20-%20Introduction%20to%20Embedded%20Systems_%20Using%20Microcontrollers%20and%20the%20MSP430-Springer-Verlag%20New%20York%20(2014).pdf"
      }
    ]
  },
  {
    "titulo": "Mean Full stack JavaScript para aplicações web com MongoDB, Express, Angular e Node",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-meanfullstackjavascriptparaaplicaco",
    "ano": 2018,
    "paginas": 298,
    "sinopse": "Manual e guia técnico abordando Mean Full stack JavaScript para aplicações web com MongoDB, Express, Angular e Node. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 156,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Mean%20Full%20stack%20JavaScript%20para%20aplica%C3%A7%C3%B5es%20web%20com%20MongoDB%2C%20Express%2C%20Angular%20e%20Node%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Meteor",
    "subtitulo": "Criando aplicações web real-time com JavaScript",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-meteor",
    "ano": 2018,
    "paginas": 262,
    "sinopse": "Manual e guia técnico abordando Meteor. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 171,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Meteor%20-%20Criando%20aplica%C3%A7%C3%B5es%20web%20real-time%20com%20JavaScript%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Programming Embedded Systems in C and C ++-O_Reilly Media (1999)",
    "subtitulo": null,
    "autor": "Michael Barr",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-programmingembeddedsystemsincandcor",
    "ano": 2018,
    "paginas": 265,
    "sinopse": "Manual e guia técnico abordando Programming Embedded Systems in C and C ++-O_Reilly Media (1999). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 138,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Michael%20Barr%20-%20Programming%20Embedded%20Systems%20in%20C%20and%20C%20%2B%2B-O_Reilly%20Media%20(1999).pdf"
      }
    ]
  },
  {
    "titulo": "Embedded C-Addison-Wesley Professional (2002)",
    "subtitulo": null,
    "autor": "Michael J Pont",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-embeddedcaddisonwesleyprofessional2",
    "ano": 2018,
    "paginas": 285,
    "sinopse": "Manual e guia técnico abordando Embedded C-Addison-Wesley Professional (2002). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 188,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Michael%20J%20Pont%20-%20Embedded%20C-Addison-Wesley%20Professional%20(2002).pdf"
      }
    ]
  },
  {
    "titulo": "Beginning Arduino-Apress (2010)",
    "subtitulo": null,
    "autor": "Michael McRoberts",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-beginningarduinoapress2010",
    "ano": 2018,
    "paginas": 239,
    "sinopse": "Manual e guia técnico abordando Beginning Arduino-Apress (2010). Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 188,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Michael%20McRoberts%20-%20Beginning%20Arduino-Apress%20(2010).pdf"
      }
    ]
  },
  {
    "titulo": "MongoDB Construa novas aplicações com novas tecnologias",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-mongodbconstruanovasaplicacoescomno",
    "ano": 2018,
    "paginas": 297,
    "sinopse": "Manual e guia técnico abordando MongoDB Construa novas aplicações com novas tecnologias. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/MongoDB%20-%20Construa%20Novas%20Aplica%C3%A7%C3%B5es%20com%20Novas%20Tecnologias.svg",
    "leituras": 186,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/MongoDB%20Construa%20novas%20aplica%C3%A7%C3%B5es%20com%20novas%20tecnologias%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "MundoJ",
    "subtitulo": "Java efetivo",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-mundoj",
    "ano": 2018,
    "paginas": 222,
    "sinopse": "Manual e guia técnico abordando MundoJ. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 172,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/MundoJ%20-%20Java%20efetivo%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "MundoJ Segurança com Java",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-mundojsegurancacomjava",
    "ano": 2018,
    "paginas": 200,
    "sinopse": "Manual e guia técnico abordando MundoJ Segurança com Java. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 120,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/MundoJ%20Seguran%C3%A7a%20com%20Java%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "MySQL Comece com o principal banco de dados open source do mercado",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-mysqlcomececomoprincipalbancodedado",
    "ano": 2018,
    "paginas": 284,
    "sinopse": "Manual e guia técnico abordando MySQL Comece com o principal banco de dados open source do mercado. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 168,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/MySQL%20Comece%20com%20o%20principal%20banco%20de%20dados%20open%20source%20do%20mercado%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Como armazenar os dados de uma aplicação moderna",
    "subtitulo": null,
    "autor": "NoSQL",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-comoarmazenarosdadosdeumaaplicacaom",
    "ano": 2018,
    "paginas": 307,
    "sinopse": "Manual e guia técnico abordando Como armazenar os dados de uma aplicação moderna. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/NoSQL%20-%20Como%20armazenar%20os%20dados%20de%20uma%20aplica%C3%A7%C3%A3o%20moderna.svg",
    "leituras": 173,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/NoSQL%20-%20Como%20armazenar%20os%20dados%20de%20uma%20aplica%C3%A7%C3%A3o%20moderna.pdf"
      }
    ]
  },
  {
    "titulo": "Aplicações web real-tome com Node.js",
    "subtitulo": null,
    "autor": "Node.js",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-aplicacoeswebrealtomecomnodejs",
    "ano": 2018,
    "paginas": 242,
    "sinopse": "Manual e guia técnico abordando Aplicações web real-tome com Node.js. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 145,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Node.js%20-%20Aplica%C3%A7%C3%B5es%20web%20real-tome%20com%20Node.js.pdf"
      }
    ]
  },
  {
    "titulo": "O Canivete suíço do desenvolvedor Node",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-ocanivetesuicododesenvolvedornode",
    "ano": 2018,
    "paginas": 251,
    "sinopse": "Manual e guia técnico abordando O Canivete suíço do desenvolvedor Node. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Canivete%20sui%C3%A7o%20do%20desenvolvedor%20Node.svg",
    "leituras": 193,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/O%20Canivete%20su%C3%AD%C3%A7o%20do%20desenvolvedor%20Node.pdf"
      }
    ]
  },
  {
    "titulo": "O Mantra da Produtividade",
    "subtitulo": null,
    "autor": "Aprimore sua produtividade com técnicas de foco e organização pessoal",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-omantradaprodutividade",
    "ano": 2018,
    "paginas": 292,
    "sinopse": "Manual e guia técnico abordando O Mantra da Produtividade. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 157,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/O%20Mantra%20da%20Produtividade%20-%20Aprimore%20sua%20produtividade%20com%20t%C3%A9cnicas%20de%20foco%20e%20organiza%C3%A7%C3%A3o%20pessoal.pdf"
      }
    ]
  },
  {
    "titulo": "Construindo uma carreira notavel em desenvolvimento de software",
    "subtitulo": null,
    "autor": "O Programador Apaixonado",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-construindoumacarreiranotavelemdese",
    "ano": 2018,
    "paginas": 268,
    "sinopse": "Manual e guia técnico abordando Construindo uma carreira notavel em desenvolvimento de software. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/O%20Programador%20Apaixonado%20-%20Construindo%20uma%20Carreira%20Not%C3%A1vel%20em%20Desenvolvimento%20de%20Software.svg",
    "leituras": 197,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/O%20Programador%20Apaixonado%20-%20Construindo%20uma%20carreira%20notavel%20em%20desenvolvimento%20de%20software.pdf"
      }
    ]
  },
  {
    "titulo": "Seus primeiros passos na programacao cientifica",
    "subtitulo": null,
    "autor": "Octave",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-seusprimeirospassosnaprogramacaocie",
    "ano": 2018,
    "paginas": 218,
    "sinopse": "Manual e guia técnico abordando Seus primeiros passos na programacao cientifica. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 134,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Octave%20-%20Seus%20primeiros%20passos%20na%20programacao%20cientifica.pdf"
      }
    ]
  },
  {
    "titulo": "Organização estruturada de computadores",
    "subtitulo": null,
    "autor": "Tanenbaum",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-organizacaoestruturadadecomputadore",
    "ano": 2018,
    "paginas": 282,
    "sinopse": "Manual e guia técnico abordando Organização estruturada de computadores. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 197,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Organiza%C3%A7%C3%A3o%20estruturada%20de%20computadores%20-%20Tanenbaum.pdf"
      }
    ]
  },
  {
    "titulo": "Orientação a Objetos e SOLID para Ninjas Projetando classes flexíveis",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-orientacaoaobjetosesolidparaninjasp",
    "ano": 2018,
    "paginas": 202,
    "sinopse": "Manual e guia técnico abordando Orientação a Objetos e SOLID para Ninjas Projetando classes flexíveis. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 125,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Orienta%C3%A7%C3%A3o%20a%20Objetos%20e%20SOLID%20para%20Ninjas%20Projetando%20classes%20flex%C3%ADveis%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Domine a linguagem do banco de dados Oracle",
    "subtitulo": null,
    "autor": "PLSQL",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-dominealinguagemdobancodedadosoracl",
    "ano": 2018,
    "paginas": 274,
    "sinopse": "Manual e guia técnico abordando Domine a linguagem do banco de dados Oracle. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/PLSQL%20-%20Domine%20a%20linguagem%20do%20banco%20de%20dados%20Oracle.pdf"
      }
    ]
  },
  {
    "titulo": "PLSQL Domine a linguagem do banco de dados Oracle",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-plsqldominealinguagemdobancodedados",
    "ano": 2018,
    "paginas": 291,
    "sinopse": "Manual e guia técnico abordando PLSQL Domine a linguagem do banco de dados Oracle. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 197,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/PLSQL%20Domine%20a%20linguagem%20do%20banco%20de%20dados%20Oracle%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Paul Deitel, Harvey Deitel",
    "subtitulo": "Java como Programar",
    "autor": "10° Edição",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-pauldeitelharveydeitel",
    "ano": 2018,
    "paginas": 308,
    "sinopse": "Manual e guia técnico abordando Paul Deitel, Harvey Deitel. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 161,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Paul%20Deitel%2C%20Harvey%20Deitel%20-%20Java%20como%20Programar%20-%2010%C2%B0%20Edi%C3%A7%C3%A3o.pdf"
      }
    ]
  },
  {
    "titulo": "Play Framework",
    "subtitulo": "Java para web sem servlets e com diversao",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-playframework",
    "ano": 2018,
    "paginas": 190,
    "sinopse": "Manual e guia técnico abordando Play Framework. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 149,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Play%20Framework%20-%20Java%20para%20web%20sem%20servlets%20e%20com%20diversao%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Java para web sem servlets e com diversao",
    "subtitulo": null,
    "autor": "Play Framework",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-javaparawebsemservletsecomdiversao",
    "ano": 2018,
    "paginas": 194,
    "sinopse": "Manual e guia técnico abordando Java para web sem servlets e com diversao. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 152,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Play%20Framework%20-%20Java%20para%20web%20sem%20servlets%20e%20com%20diversao.pdf"
      }
    ]
  },
  {
    "titulo": "Banco de dados para aplicações web modernas",
    "subtitulo": null,
    "autor": "PostgreSQL",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-bancodedadosparaaplicacoeswebmodern",
    "ano": 2018,
    "paginas": 277,
    "sinopse": "Manual e guia técnico abordando Banco de dados para aplicações web modernas. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 198,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/PostgreSQL%20-%20Banco%20de%20dados%20para%20aplica%C3%A7%C3%B5es%20web%20modernas.pdf"
      }
    ]
  },
  {
    "titulo": "Programando em Go",
    "subtitulo": "Crie aplicações com a linguagem do Google",
    "autor": "Casa do Código",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-programandoemgo",
    "ano": 2018,
    "paginas": 194,
    "sinopse": "Manual e guia técnico abordando Programando em Go. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 143,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Programando%20em%20Go%20-%20Crie%20aplica%C3%A7%C3%B5es%20com%20a%20linguagem%20do%20Google%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Python",
    "subtitulo": "Escreva seus primeiros programas",
    "autor": "Casa do Código",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-python",
    "ano": 2018,
    "paginas": 191,
    "sinopse": "Manual e guia técnico abordando Python. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 194,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Python%20-%20Escreva%20seus%20primeiros%20programas%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Escreva seus primeiros programas",
    "subtitulo": null,
    "autor": "Python",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-escrevaseusprimeirosprogramas",
    "ano": 2018,
    "paginas": 209,
    "sinopse": "Manual e guia técnico abordando Escreva seus primeiros programas. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 159,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Python%20-%20Escreva%20seus%20primeiros%20programas.pdf"
      }
    ]
  },
  {
    "titulo": "Python_Programming",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-pythonprogramming",
    "ano": 2018,
    "paginas": 195,
    "sinopse": "Manual e guia técnico abordando Python_Programming. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 122,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Python_Programming.pdf"
      }
    ]
  },
  {
    "titulo": "Crie especificacoes executaveis em Ruby",
    "subtitulo": null,
    "autor": "RSpec",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-crieespecificacoesexecutaveisemruby",
    "ano": 2018,
    "paginas": 241,
    "sinopse": "Manual e guia técnico abordando Crie especificacoes executaveis em Ruby. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 158,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/RSpec%20-%20Crie%20especificacoes%20executaveis%20em%20Ruby.pdf"
      }
    ]
  },
  {
    "titulo": "Refatorando com padroes de projeto",
    "subtitulo": null,
    "autor": "Um guia em ruby",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-refatorandocompadroesdeprojeto",
    "ano": 2018,
    "paginas": 229,
    "sinopse": "Manual e guia técnico abordando Refatorando com padroes de projeto. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 630,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Refatorando%20com%20padroes%20de%20projeto%20-%20Um%20guia%20em%20ruby.pdf"
      }
    ]
  },
  {
    "titulo": "Ruby",
    "subtitulo": "Aprenda a programar na linguagem mais divertida",
    "autor": "Casa do Código",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-ruby",
    "ano": 2018,
    "paginas": 221,
    "sinopse": "Manual e guia técnico abordando Ruby. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 192,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Ruby%20-%20Aprenda%20a%20programar%20na%20linguagem%20mais%20divertida%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Aprenda a programar na linguagem mais divertida",
    "subtitulo": null,
    "autor": "Ruby",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-aprendaaprogramarnalinguagemmaisdiv",
    "ano": 2018,
    "paginas": 275,
    "sinopse": "Manual e guia técnico abordando Aprenda a programar na linguagem mais divertida. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 120,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Ruby%20-%20Aprenda%20a%20programar%20na%20linguagem%20mais%20divertida.pdf"
      }
    ]
  },
  {
    "titulo": "Ruby on Rails",
    "subtitulo": "coloque sua aplicacao web nos trilhos",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-rubyonrails",
    "ano": 2018,
    "paginas": 288,
    "sinopse": "Manual e guia técnico abordando Ruby on Rails. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 148,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Ruby%20on%20Rails%20-%20coloque%20sua%20aplicacao%20web%20nos%20trilhos%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "SEO Prático Seu site na primeira página das buscas",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-seopraticoseusitenaprimeirapaginada",
    "ano": 2018,
    "paginas": 237,
    "sinopse": "Manual e guia técnico abordando SEO Prático Seu site na primeira página das buscas. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/SEO%20Pr%C3%A1tico%20-%20Seu%20Site%20na%20Primeira%20P%C3%A1gina%20das%20Buscas.svg",
    "leituras": 184,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/SEO%20Pr%C3%A1tico%20Seu%20site%20na%20primeira%20p%C3%A1gina%20das%20buscas.pdf"
      }
    ]
  },
  {
    "titulo": "Integrando com web services e além",
    "subtitulo": null,
    "autor": "SOA aplicado",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-integrandocomwebservicesealem",
    "ano": 2018,
    "paginas": 253,
    "sinopse": "Manual e guia técnico abordando Integrando com web services e além. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/SOA%20Aplicado%20-%20Integrando%20com%20web%20services%20e%20al%C3%A9m.svg",
    "leituras": 168,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/SOA%20aplicado%20-%20Integrando%20com%20web%20services%20e%20al%C3%A9m.pdf"
      }
    ]
  },
  {
    "titulo": "SQL",
    "subtitulo": "Uma abordagem para bancos de dados Oracle",
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-sql",
    "ano": 2018,
    "paginas": 273,
    "sinopse": "Manual e guia técnico abordando SQL. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/NoSQL%20-%20Como%20armazenar%20os%20dados%20de%20uma%20aplica%C3%A7%C3%A3o%20moderna.svg",
    "leituras": 130,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/SQL%20-%20Uma%20abordagem%20para%20bancos%20de%20dados%20Oracle%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Uma abordagem para bancos de dados Oracle",
    "subtitulo": null,
    "autor": "SQL",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-umaabordagemparabancosdedadosoracle",
    "ano": 2018,
    "paginas": 258,
    "sinopse": "Manual e guia técnico abordando Uma abordagem para bancos de dados Oracle. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 145,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/SQL%20-%20Uma%20abordagem%20para%20bancos%20de%20dados%20Oracle.pdf"
      }
    ]
  },
  {
    "titulo": "Aprendendo pré-processadores CSS",
    "subtitulo": null,
    "autor": "Sass",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-aprendendopreprocessadorescss",
    "ano": 2018,
    "paginas": 232,
    "sinopse": "Manual e guia técnico abordando Aprendendo pré-processadores CSS. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 169,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Sass%20-%20Aprendendo%20pr%C3%A9-processadores%20CSS.pdf"
      }
    ]
  },
  {
    "titulo": "Scrum 360 Um guia completo e prático de agilidade",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-scrum360umguiacompletoepraticodeagi",
    "ano": 2018,
    "paginas": 211,
    "sinopse": "Manual e guia técnico abordando Scrum 360 Um guia completo e prático de agilidade. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Scrum%20360%20-%20Um%20guia%20completo%20e%20pr%C3%A1tico%20de%20agilidade.svg",
    "leituras": 570,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Scrum%20360%20Um%20guia%20completo%20e%20pra%CC%81tico%20de%20agilidade.pdf"
      }
    ]
  },
  {
    "titulo": "Scrum Gestão ágil para projetos de sucesso",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-scrumgestaoagilparaprojetosdesucess",
    "ano": 2018,
    "paginas": 203,
    "sinopse": "Manual e guia técnico abordando Scrum Gestão ágil para projetos de sucesso. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Scrum%20-%20Gest%C3%A3o%20%C3%A1gil%20para%20projetos%20de%20sucesso.svg",
    "leituras": 570,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Scrum%20Gest%C3%A3o%20%C3%A1gil%20para%20projetos%20de%20sucesso.pdf"
      }
    ]
  },
  {
    "titulo": "Seguranca em aplicacoes Web",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-segurancaemaplicacoesweb",
    "ano": 2018,
    "paginas": 319,
    "sinopse": "Manual e guia técnico abordando Seguranca em aplicacoes Web. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 173,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Seguranca%20em%20aplicacoes%20Web.pdf"
      }
    ]
  },
  {
    "titulo": "Spring MVC Domine o principal framework web Java",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-springmvcdomineoprincipalframeworkw",
    "ano": 2018,
    "paginas": 300,
    "sinopse": "Manual e guia técnico abordando Spring MVC Domine o principal framework web Java. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Spring%20MVC%20Domine%20o%20principal%20framework%20web%20Java%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Swift Programe para iPhone e iPad",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-swiftprogrameparaiphoneeipad",
    "ano": 2018,
    "paginas": 270,
    "sinopse": "Manual e guia técnico abordando Swift Programe para iPhone e iPad. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 193,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Swift%20Programe%20para%20iPhone%20e%20iPad%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Test-Driven Development no Mundo Real com .NET",
    "subtitulo": "Teste e Design no Mundo Real com DotNet",
    "autor": "Maurício Aniche",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-testdrivendevelopment",
    "ano": 2018,
    "paginas": 208,
    "sinopse": "Manual e guia técnico abordando Test Driven Development. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Test-Driven%20Development%20-%20Teste%20e%20Design%20no%20Mundo%20Real.svg",
    "leituras": 149,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Test%20Driven%20Development%20-%20Teste%20e%20Design%20no%20Mundo%20Real%20com%20DotNet%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Think_Python",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-thinkpython",
    "ano": 2018,
    "paginas": 275,
    "sinopse": "Manual e guia técnico abordando Think_Python. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 161,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Think_Python.pdf"
      }
    ]
  },
  {
    "titulo": "folhas de estilo inteligentes com Sass",
    "subtitulo": null,
    "autor": "Turbine seu CSS",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-folhasdeestilointeligentescomsass",
    "ano": 2018,
    "paginas": 303,
    "sinopse": "Manual e guia técnico abordando folhas de estilo inteligentes com Sass. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 139,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Turbine%20seu%20CSS%20-%20folhas%20de%20estilo%20inteligentes%20com%20Sass.pdf"
      }
    ]
  },
  {
    "titulo": "Vire o jogo com Spring Framework",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-vireojogocomspringframework",
    "ano": 2018,
    "paginas": 267,
    "sinopse": "Manual e guia técnico abordando Vire o jogo com Spring Framework. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 157,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Vire%20o%20jogo%20com%20Spring%20Framework.pdf"
      }
    ]
  },
  {
    "titulo": "Claudio Moura Castro",
    "subtitulo": null,
    "autor": "Voce Sabe Estudar_",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-claudiomouracastro",
    "ano": 2018,
    "paginas": 235,
    "sinopse": "Manual e guia técnico abordando Claudio Moura Castro. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 195,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Voce%20Sabe%20Estudar_%20-%20Claudio%20Moura%20Castro.pdf"
      }
    ]
  },
  {
    "titulo": "Vraptor",
    "subtitulo": "Desenvolvimento Agil para web com Java",
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-vraptor",
    "ano": 2018,
    "paginas": 242,
    "sinopse": "Manual e guia técnico abordando Vraptor. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 157,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Vraptor%20-%20Desenvolvimento%20Agil%20para%20web%20com%20Java%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Web Services REST com ASP .NET Web API e Windows Azure",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-webservicesrestcomaspnetwebapiewind",
    "ano": 2018,
    "paginas": 316,
    "sinopse": "Manual e guia técnico abordando Web Services REST com ASP .NET Web API e Windows Azure. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 182,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Web%20Services%20REST%20com%20ASP%20.NET%20Web%20API%20e%20Windows%20Azure.pdf"
      }
    ]
  },
  {
    "titulo": "Windows Server 2012 R2 Estudo dirigido para MCSA prova 70-410 ",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-windowsserver2012r2estudodirigidopa",
    "ano": 2018,
    "paginas": 270,
    "sinopse": "Manual e guia técnico abordando Windows Server 2012 R2 Estudo dirigido para MCSA prova 70-410 . Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 121,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/Windows%20Server%202012%20R2%20Estudo%20dirigido%20para%20MCSA%20prova%2070-410%20.pdf"
      }
    ]
  },
  {
    "titulo": "arduino_básico_Michael_McRoberts",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-arduinobasicomichaelmcroberts",
    "ano": 2018,
    "paginas": 282,
    "sinopse": "Manual e guia técnico abordando arduino_básico_Michael_McRoberts. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 166,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/arduino_b%C3%A1sico_Michael_McRoberts.pdf"
      }
    ]
  },
  {
    "titulo": "caelum-algoritmos-estruturas-dados-java-cs14",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-caelumalgoritmosestruturasdadosjava",
    "ano": 2018,
    "paginas": 301,
    "sinopse": "Manual e guia técnico abordando caelum-algoritmos-estruturas-dados-java-cs14. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 146,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/caelum-algoritmos-estruturas-dados-java-cs14.pdf"
      }
    ]
  },
  {
    "titulo": "eXtreme programming  Praticas para o dia-a-dia no desenvolvimento agil de software",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-extremeprogrammingpraticasparaodiaa",
    "ano": 2018,
    "paginas": 305,
    "sinopse": "Manual e guia técnico abordando eXtreme programming  Praticas para o dia-a-dia no desenvolvimento agil de software. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/eXtreme%20Programming%20-%20Pr%C3%A1ticas%20para%20o%20dia%20a%20dia%20no%20desenvolvimento%20%C3%A1gil%20de%20software.svg",
    "leituras": 181,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/eXtreme%20programming%20%20Praticas%20para%20o%20dia-a-dia%20no%20desenvolvimento%20agil%20de%20software%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "html5 e css3 domine a web do futuro",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-html5ecss3domineawebdofuturo",
    "ano": 2018,
    "paginas": 186,
    "sinopse": "Manual e guia técnico abordando html5 e css3 domine a web do futuro. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/HTML5%20e%20CSS3%20-%20domine%20a%20web%20do%20futuro.svg",
    "leituras": 560,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/html5%20e%20css3%20domine%20a%20web%20do%20futuro%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "iOS Programe para iPhone e iPad",
    "subtitulo": null,
    "autor": "Casa do Código",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-iosprogrameparaiphoneeipad",
    "ano": 2018,
    "paginas": 300,
    "sinopse": "Manual e guia técnico abordando iOS Programe para iPhone e iPad. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 151,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/iOS%20Programe%20para%20iPhone%20e%20iPad%20-%20Casa%20do%20Codigo.pdf"
      }
    ]
  },
  {
    "titulo": "Desenvolva interfaces para multiplos dispositivos",
    "subtitulo": null,
    "autor": "jQuery Mobile",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-desenvolvainterfacesparamultiplosdi",
    "ano": 2018,
    "paginas": 316,
    "sinopse": "Manual e guia técnico abordando Desenvolva interfaces para multiplos dispositivos. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 151,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/jQuery%20Mobile%20-%20Desenvolva%20interfaces%20para%20multiplos%20dispositivos.pdf"
      }
    ]
  },
  {
    "titulo": "php",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-php",
    "ano": 2018,
    "paginas": 184,
    "sinopse": "Manual e guia técnico abordando php. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 177,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/php.pdf"
      }
    ]
  },
  {
    "titulo": "phptherightway",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-phptherightway",
    "ano": 2018,
    "paginas": 306,
    "sinopse": "Manual e guia técnico abordando phptherightway. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 132,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/phptherightway.pdf"
      }
    ]
  },
  {
    "titulo": "pythonoo",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-pythonoo",
    "ano": 2018,
    "paginas": 301,
    "sinopse": "Manual e guia técnico abordando pythonoo. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 134,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/pythonoo.pdf"
      }
    ]
  },
  {
    "titulo": "slyy138a",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-slyy138a",
    "ano": 2018,
    "paginas": 208,
    "sinopse": "Manual e guia técnico abordando slyy138a. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 153,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/slyy138a.pdf"
      }
    ]
  },
  {
    "titulo": "wstg-v4.1",
    "subtitulo": null,
    "autor": "Comunidade Tech",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-italocamilo",
    "fonteIdExterno": "italo-wstgv41",
    "ano": 2018,
    "paginas": 252,
    "sinopse": "Manual e guia técnico abordando wstg-v4.1. Disponibilizado para estudo no repositório de livros abertos de italocamil0.",
    "capaUrl": "https://raw.githubusercontent.com/KAYOKG/BibliotecaDev/main/.github/img/Come%C3%A7ando%20com%20o%20Linux%20-%20Comandos%2C%20servi%C3%A7os%20e%20administra%C3%A7%C3%A3o.svg",
    "leituras": 170,
    "links": [
      {
        "formato": "pdf",
        "url": "https://raw.githubusercontent.com/italocamil0/books/main/books/wstg-v4.1.pdf"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Notação Big O (Guia Visual de Algoritmos)",
    "subtitulo": "Complexidade de tempo e espaço, O(1), O(log n), O(n) e boas práticas computacionais",
    "autor": "Flávio Mendes",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-guide-big-o",
    "ano": 2026,
    "paginas": 65,
    "sinopse": "Guia visual e analítico sobre complexidade algorítmica Big O, análise de desempenho de estruturas de dados e otimização de loops.",
    "capaUrl": "https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/bigO.jpg",
    "leituras": 350,
    "links": [
      {
        "formato": "html",
        "url": "https://github.com/flaviojmendes/trilhainfo/blob/main/public/guides/bigO.jpg"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Autenticação Básica & Segurança Web",
    "subtitulo": "HTTP Basic Auth, cabeçalhos, tokens, cookies e práticas seguras em APIs",
    "autor": "Flávio Mendes",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-guide-basic-auth",
    "ano": 2026,
    "paginas": 50,
    "sinopse": "Conceitos essenciais de autenticação web, vulnerabilidades comuns e como implementar autenticação em APIs REST.",
    "capaUrl": "https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/basicAuth.jpg",
    "leituras": 320,
    "links": [
      {
        "formato": "html",
        "url": "https://github.com/flaviojmendes/trilhainfo/blob/main/public/guides/basicAuth.jpg"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Onboarding Eficaz de Desenvolvedores",
    "subtitulo": "Como acelerar a adaptação em novos times, setup de ambientes e documentação",
    "autor": "Flávio Mendes",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-guide-onboarding",
    "ano": 2026,
    "paginas": 45,
    "sinopse": "Boas práticas para integração de novos engenheiros em squads, rituais ágeis, arquitetura do projeto e primeiros deploys.",
    "capaUrl": "https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/onboarding.jpg",
    "leituras": 310,
    "links": [
      {
        "formato": "html",
        "url": "https://github.com/flaviojmendes/trilhainfo/blob/main/public/guides/onboarding.jpg"
      }
    ]
  },
  {
    "titulo": "Trilha Info: SSO (Single Sign-On) e Gestão de Identidade",
    "subtitulo": "OIDC, OAuth2, SAML e federação de usuários em ecossistemas de microsserviços",
    "autor": "Flávio Mendes",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-guide-sso",
    "ano": 2026,
    "paginas": 55,
    "sinopse": "Guia arquitetural sobre federação de identidades, Single Sign-On e controle de acesso centralizado em aplicações modernas.",
    "capaUrl": "https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/sso.jpg",
    "leituras": 330,
    "links": [
      {
        "formato": "html",
        "url": "https://github.com/flaviojmendes/trilhainfo/blob/main/public/guides/sso.jpg"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Modelo STAR para Entrevistas Técnicas",
    "subtitulo": "Situação, Tarefa, Ação e Resultado: estruturando respostas comportamentais e técnicas",
    "autor": "Flávio Mendes",
    "categoria": "Metodologias Ágeis & Carreira Tech",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-guide-star",
    "ano": 2026,
    "paginas": 40,
    "sinopse": "Método comprovado para entrevistas de emprego na área de tecnologia, permitindo destacar conquistas e liderança com clareza.",
    "capaUrl": "https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/star.jpg",
    "leituras": 340,
    "links": [
      {
        "formato": "html",
        "url": "https://github.com/flaviojmendes/trilhainfo/blob/main/public/guides/star.jpg"
      }
    ]
  },
  {
    "titulo": "Trilha Info: SLA, SLO e SLI para Engenharia Confiável",
    "subtitulo": "Métricas de confiabilidade, orçamentos de erro (Error Budgets) e observabilidade SRE",
    "autor": "Flávio Mendes",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-guide-sla-slo-sli",
    "ano": 2026,
    "paginas": 60,
    "sinopse": "Guia prático de Site Reliability Engineering (SRE) sobre como definir Service Level Agreements, Objectives e Indicators.",
    "capaUrl": "https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/slaSloSli.jpg",
    "leituras": 360,
    "links": [
      {
        "formato": "html",
        "url": "https://github.com/flaviojmendes/trilhainfo/blob/main/public/guides/slaSloSli.jpg"
      }
    ]
  },
  {
    "titulo": "Trilha Info: JavaScript Async & Defer na Performance Web",
    "subtitulo": "Ciclo de vida do carregamento de scripts, render-blocking e Core Web Vitals",
    "autor": "Flávio Mendes",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-guide-async-defer",
    "ano": 2026,
    "paginas": 45,
    "sinopse": "Como otimizar a velocidade de carregamento de páginas web dominando a execução assíncrona de scripts e ordenação do DOM.",
    "capaUrl": "https://raw.githubusercontent.com/flaviojmendes/trilhainfo/main/public/guides/jsAsyncDefer.jpg",
    "leituras": 315,
    "links": [
      {
        "formato": "html",
        "url": "https://github.com/flaviojmendes/trilhainfo/blob/main/public/guides/jsAsyncDefer.jpg"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Formação Desenvolvedor Frontend",
    "subtitulo": "HTML, CSS, JavaScript, React, Vue, TypeScript, Performance e Acessibilidade Web",
    "autor": "Flávio Mendes & Comunidade Trilha Info",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-frontend",
    "ano": 2026,
    "paginas": 200,
    "sinopse": "Roteiro de estudos completo e gratuito com materiais em português para formação sólida em Frontend moderno.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp",
    "leituras": 450,
    "links": [
      {
        "formato": "html",
        "url": "https://trilha.info/roadmap/frontend"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Formação Desenvolvedor Backend",
    "subtitulo": "APIs RESTful, Microsserviços, SQL, NoSQL, Autenticação, Cache e Mensageria",
    "autor": "Flávio Mendes & Comunidade Trilha Info",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-backend",
    "ano": 2026,
    "paginas": 220,
    "sinopse": "Trilha estruturada do zero ao avançado em arquitetura backend, bancos de dados e desenvolvimento de servidores robustos.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/09/awesome/2ed4a9e52da1d1c276d7a2df6f618d02.webp",
    "leituras": 440,
    "links": [
      {
        "formato": "html",
        "url": "https://trilha.info/roadmap/backend"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Guia Completo DevOps e Infraestrutura em Nuvem",
    "subtitulo": "Linux, Docker, Kubernetes, CI/CD, Terraform e observabilidade contínua",
    "autor": "Flávio Mendes & Comunidade Trilha Info",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-devops",
    "ano": 2026,
    "paginas": 180,
    "sinopse": "Trilha estruturada em português para dominar cultura DevOps, automação de deploys, containers e infraestrutura como código.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/10/maestro-20261005-1a2d7f9a4897756f/cda1e67a527c2b1071b43c6290662c37.webp",
    "leituras": 430,
    "links": [
      {
        "formato": "html",
        "url": "https://trilha.info/roadmap/devops"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Guia de Engenharia de Dados & Big Data",
    "subtitulo": "Pipelines ETL, Data Lakes, Apache Spark, Airflow, SQL e modelagem analítica",
    "autor": "Flávio Mendes & Comunidade Trilha Info",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-data-engineer",
    "ano": 2026,
    "paginas": 170,
    "sinopse": "Roteiro de formação para engenheiros de dados com recursos abertos cobrindo ingestão, processamento distribuído e governança de dados.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/09/AI_Expert_Roadmap/65927a0974e90c3df4e690236a471e89.webp",
    "leituras": 420,
    "links": [
      {
        "formato": "html",
        "url": "https://trilha.info/roadmap/data-engineer"
      }
    ]
  },
  {
    "titulo": "Trilha Info: Guia de Testes de Software & Garantia de Qualidade (QA)",
    "subtitulo": "Testes unitários, integração, end-to-end, automação com Cypress e pirâmide de testes",
    "autor": "Flávio Mendes & Comunidade Trilha Info",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "trilhainfo",
    "fonteIdExterno": "trilha-test-qa",
    "ano": 2026,
    "paginas": 140,
    "sinopse": "Trilha completa em português para qualidade de software, testes manuais e automatizados, boas práticas e CI/CD com foco em QA.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp",
    "leituras": 410,
    "links": [
      {
        "formato": "html",
        "url": "https://trilha.info/roadmap/test"
      }
    ]
  },
  {
    "titulo": "AI Expert Roadmap & Guia de IA",
    "subtitulo": "Trilha Completa de Inteligência Artificial e Data Science",
    "autor": "Guia de TI & Comunidade",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "guiadeti",
    "fonteIdExterno": "guiadeti-ai-expert",
    "ano": 2026,
    "paginas": 150,
    "sinopse": "Guia estruturado e prático para o estudo e domínio de Inteligência Artificial, Machine Learning, Deep Learning e Engenharia de Prompts.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/09/AI_Expert_Roadmap/65927a0974e90c3df4e690236a471e89.webp",
    "leituras": 450,
    "links": [
      {
        "formato": "html",
        "url": "https://guiadeti.com.br/roadmaps/ai-expert-roadmap/"
      }
    ]
  },
  {
    "titulo": "Guia Completo de Carreiras e Roadmaps de TI",
    "subtitulo": "Trilhas para Frontend, Backend, DevOps e Dados",
    "autor": "Guia de TI & Comunidade",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "guiadeti",
    "fonteIdExterno": "guiadeti-roadmaps-carreiras",
    "ano": 2026,
    "paginas": 180,
    "sinopse": "Coleção abrangente de mapas de estudo para profissionais e estudantes de computação navegarem com clareza em suas jornadas de aprendizado.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/09/awesome/2ed4a9e52da1d1c276d7a2df6f618d02.webp",
    "leituras": 390,
    "links": [
      {
        "formato": "html",
        "url": "https://guiadeti.com.br/roadmaps/awesome-roadmaps/"
      }
    ]
  },
  {
    "titulo": "Manual de Fundamentos DevOps, Cloud & Linux",
    "subtitulo": "Linux, Containers Docker, Git e Arquitetura de Nuvem",
    "autor": "Guia de TI & Comunidade",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "guiadeti",
    "fonteIdExterno": "guiadeti-devops-linux",
    "ano": 2026,
    "paginas": 220,
    "sinopse": "Manual formativo sobre cultura DevOps, administração de sistemas Linux, automação e orquestração de servidores para infraestrutura moderna.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/10/maestro-20261005-1a2d7f9a4897756f/cda1e67a527c2b1071b43c6290662c37.webp",
    "leituras": 520,
    "links": [
      {
        "formato": "html",
        "url": "https://guiadeti.com.br/cursos/curso-devops-cloud-linux-docker-e-projeto-marketplace/"
      }
    ]
  },
  {
    "titulo": "TechGuide.sh - Guia de Carreiras e Tecnologias",
    "subtitulo": "Mapeamento de Habilidades e Competências Técnicas",
    "autor": "Guia de TI & Comunidade",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "guiadeti",
    "fonteIdExterno": "guiadeti-techguide",
    "ano": 2026,
    "paginas": 160,
    "sinopse": "Guia com caminhos estruturados de aprendizado, níveis de proficiência e tecnologias para desenvolvimento profissional.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/09/techguide/d9eb488def2346638788a8b5e8c1448d.webp",
    "leituras": 410,
    "links": [
      {
        "formato": "html",
        "url": "https://guiadeti.com.br/roadmaps/techguidesh-guia-de-carreiras-e-tecnologias/"
      }
    ]
  },
  {
    "titulo": "Trilha Info - Trilhas Gratuitas em Português",
    "subtitulo": "Formação Colaborativa em Frontend, Backend e DevOps",
    "autor": "Guia de TI & Comunidade",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "guiadeti",
    "fonteIdExterno": "guiadeti-trilha-info",
    "ano": 2026,
    "paginas": 190,
    "sinopse": "Trilhas colaborativas abertas em língua portuguesa para formação de desenvolvedores e preparação para entrevistas técnicas.",
    "capaUrl": "https://guiadeti.com.br/media/CACHE/images/library/2026/09/trilha-info/dee73d5d3f6c492970dd6f466a3b77ad.webp",
    "leituras": 375,
    "links": [
      {
        "formato": "html",
        "url": "https://guiadeti.com.br/roadmaps/trilha-info-trilhas-gratuitas-de-tecnologia/"
      }
    ]
  },
  {
    "titulo": "Roadmap.sh - Developer Roadmaps Traduzidos",
    "subtitulo": "Diretório Global de Guias de Estudo para Desenvolvedores",
    "autor": "Guia de TI & Comunidade",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "guiadeti",
    "fonteIdExterno": "guiadeti-roadmapsh",
    "ano": 2026,
    "paginas": 210,
    "sinopse": "Mapas mentais e guias passo a passo cobrindo arquitetura de software, DevOps, segurança e stacks de programação.",
    "capaUrl": "https://guiadeti.com.br/seo/thumbnail/roadmaps/roadmap/f906b934-8cde-44f9-8f18-6822586aa9a5/fallback.webp?v=v2-1790651464",
    "leituras": 490,
    "links": [
      {
        "formato": "html",
        "url": "https://guiadeti.com.br/roadmaps/roadmapsh-developer-roadmaps/"
      }
    ]
  }
];

module.exports = { githubBooks };
