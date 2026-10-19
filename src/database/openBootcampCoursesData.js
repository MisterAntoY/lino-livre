/**
 * Catálogo Oficial Curado de Cursos Gratuitos do OpenBootcamp / Kogno
 * Plataforma: open-bootcamp.com / github.com/Open-Bootcamp
 * 
 * Cursos completos e 100% gratuitos de desenvolvimento de software
 * (Frontend, Backend, DevOps, Banco de Dados, Mobile e Arquitetura).
 * Modelo aberto para o estudante sem qualquer cobrança.
 * 
 * Diretriz AGENTS.md: Apenas metadados e URLs de redirecionamento 302.
 */

const openBootcampCoursesList = [
  {
    titulo: "Curso de HTML5 y CSS3 desde Cero (OpenBootcamp)",
    tipo: "curso",
    area: "Desenvolvimento Web & Mobile",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/html-css",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Formação completa em HTML semântico, modelos de caixa, Flexbox, CSS Grid, animações, media queries e boas práticas de acessibilidade para iniciantes 100% gratuito no OpenBootcamp."
  },
  {
    titulo: "Curso de JavaScript Moderno (ES6+) y DOM (OpenBootcamp)",
    tipo: "curso",
    area: "Desenvolvimento Web & Mobile",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/javascript",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Aprenda JavaScript desde a sintaxe básica até recursos modernos do ES6+: arrow functions, promessas, async/await, manipulação do DOM e consumo de APIs REST no OpenBootcamp."
  },
  {
    titulo: "Curso de React.js: Componentes, Hooks y Estado (OpenBootcamp)",
    tipo: "curso",
    area: "Desenvolvimento Web & Mobile",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/reactjs",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Desenvolvimento de Single Page Applications (SPAs) profissionais com React: JSX, props, useState, useEffect, useContext, React Router e gestão de estado com acesso aberto."
  },
  {
    titulo: "Curso de Python para Desarrollo de Software (OpenBootcamp)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/python",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Da sintaxe básica à programação orientada a objetos (POO), manipulação de arquivos, módulos, testes e introdução ao desenvolvimento de APIs e scripts de automação com Python."
  },
  {
    titulo: "Curso de Node.js y Express: Creación de APIs REST (OpenBootcamp)",
    tipo: "curso",
    area: "Desenvolvimento Web & Mobile",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/nodejs",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Construção de backends escaláveis com Node.js e Express: rotas, middlewares, autenticação JWT, tratamento de erros e conexão com bancos de dados relacionais e NoSQL no OpenBootcamp."
  },
  {
    titulo: "Curso de Bases de Datos Relacionales y SQL (OpenBootcamp)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/sql",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Fundamentos de bancos de dados relacionais: tabelas, integridade referencial, consultas com SELECT, JOINs complexos, agregações, índices e modelagem com PostgreSQL e MySQL."
  },
  {
    titulo: "Curso de Git y GitHub Profesional (OpenBootcamp)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/git",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Controle de versão para desenvolvedores: commits semânticos, branches, merge, rebase, resolução de conflitos, pull requests e colaboração em equipes no GitHub."
  },
  {
    titulo: "Curso de Java desde Cero hasta Orientación a Objetos (OpenBootcamp)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/java-basico",
    licenca: "gratuito",
    nivel: "Iniciante",
    descricao: "Domine a linguagem Java: tipos primitivos, estruturas de controle, classes, herança, polimorfismo, interfaces e coleções essenciais para o mercado corporativo."
  },
  {
    titulo: "Curso de Spring Boot y Microservicios (OpenBootcamp)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/spring",
    licenca: "gratuito",
    nivel: "Avançado",
    descricao: "Desenvolvimento de microserviços em Java com Spring Boot: injeção de dependências, Spring Data JPA, Hibernate, segurança com Spring Security e testes automatizados."
  },
  {
    titulo: "Curso de Docker y Contenedores para Desarrolladores (OpenBootcamp)",
    tipo: "curso",
    area: "DevOps, Cloud & Infraestrutura",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/docker",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Containerização de aplicações modernas: Dockerfile, imagens, volumes, redes, Docker Compose para orquestração de múltiplos serviços e ambientes de desenvolvimento reproduzíveis."
  },
  {
    titulo: "Curso de TypeScript para Aplicaciones Web Robustas (OpenBootcamp)",
    tipo: "curso",
    area: "Desenvolvimento Web & Mobile",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/typescript",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Tipagem estática em JavaScript: interfaces, tipos genéricos (generics), type narrowing, decoradores e integração completa com projetos React e Node.js no OpenBootcamp."
  },
  {
    titulo: "Curso de C# y .NET para Backend Moderno (OpenBootcamp)",
    tipo: "curso",
    area: "Tecnologia",
    plataforma: "OpenBootcamp / Kogno",
    url: "https://open-bootcamp.com/cursos/c-sharp",
    licenca: "gratuito",
    nivel: "Intermediário",
    descricao: "Ecossistema .NET com C#: Programação Orientada a Objetos, LINQ, Entity Framework Core, criação de Web APIs e injeção de dependências para desenvolvimento de software empresarial."
  }
];

module.exports = { openBootcampCoursesList };
