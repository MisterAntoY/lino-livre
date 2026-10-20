# 🎓 Cursa App — Cursos Gratuitos e Banco de Exercícios & Simulados

> **Status:** Ativo e integrado ao catálogo do Lino Livre  
> **Portal de Exercícios:** [https://cursa.app/pt/exercicios](https://cursa.app/pt/exercicios)  
> **Conformidade Legal:** 100% aderente às diretrizes de `AGENTS.md` (indexação exclusiva de metadados, links externos oficiais e redirecionamento HTTP 302 sem hospedagem de binários).

---

## 📌 Visão Geral

A plataforma **Cursa** (`cursa.app`) oferece centenas de cursos abertos com emissão de certificados digitais gratuitos em 5 idiomas (Português, Inglês, Espanhol, Francês e Hindi), além de uma plataforma interativa de **exercícios e questionários de múltipla escolha com gabarito comentado** para fixação de aprendizado.

### 📊 Métricas no Lino Livre
- **Total de Itens Cadastrados:** 310 recursos oficiais da Cursa.
- **Cursos com Certificado:** 52 cursos completos em 5 idiomas.
- **Exercícios & Simulados Práticos:** 258 módulos interativos com gabarito comentado.
- **Áreas Cobertas:**
  - Inteligência Artificial, Machine Learning & Ciência de Dados
  - Programação Front-End, Back-End, Mobile e Games (Python, JavaScript, Java, etc.)
  - DevOps, Redes, Linux, Ferramentas de TI e Segurança da Informação
  - Banco de Dados e SQL (DBeaver, MySQL, PostgreSQL)
  - Robótica Industrial, ROS 2, Lógica Ladder e CLPs
  - Estatística, Probabilidade e Matemática
  - Ciências Humanas, Filosofia e História
  - Direito (Penal, Constitucional, Trabalho, Administrativo e Exame da OAB)
  - Preparatórios e Concursos Públicos (Polícia Federal, Detran, INSS, IBGE, Raciocínio Lógico)
  - Gestão de Projetos, Negócios, Finanças, Logística e Administração
  - Idiomas (Inglês, Espanhol, Francês, Alemão, Italiano, Japonês, Coreano, Russo, Mandarim, Libras, Latim)
  - Saúde, Bem-Estar, Enfermagem e Primeiros Socorros
  - Música, Produção de Áudio e Teoria Musical

---

## 🌐 Portais Principais Catalogados

| Recurso | Idioma | URL Oficial |
|---|---|---|
| **Portal de Exercícios com Respostas Comentadas** | Português | [cursa.app/pt/exercicios](https://cursa.app/pt/exercicios) |
| **Free Practice Exercises & Quizzes** | Inglês | [cursa.app/en/exercises](https://cursa.app/en/exercises) |
| **Ejercicios y Cuestionarios Prácticos** | Espanhol | [cursa.app/es/ejercicios](https://cursa.app/es/ejercicios) |
| **Exercices et Quiz Pratiques avec Corrigés** | Francês | [cursa.app/fr/exercices](https://cursa.app/fr/exercices) |
| **अभ्यास और प्रश्नोत्तरी (Practice Exercises)** | Hindi | [cursa.app/hi/exercises](https://cursa.app/hi/exercises) |

---

## 🛠️ Automação e Sincronização

1. **Scraper / Harvester:** `scripts/harvest_cursa_exercicios.js`
   - Extrai cards estruturados diretamente de `https://cursa.app/pt/exercicios` e suas categorias especializadas.
   - Normaliza metadados, títulos, número de perguntas, nível de dificuldade e área do conhecimento.
2. **Dados em Código:** `src/database/cursaExerciciosData.js`
3. **Migração Cloudflare D1:** `scripts/sync_cursa_harvard_d1.js` e `scripts/cursa_harvard_d1.sql`
4. **Seed Geral:** `src/database/seed.js` e `seed.sql`
