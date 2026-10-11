/**
 * Catálogo Curado de Cursos Livres e Gratuitos em Francês (FUN-MOOC, Inria, ANSSI, OpenClassrooms, Elements of AI)
 * Todas as URLs são verificadas e ativas.
 * Em estrita conformidade com AGENTS.md (apenas metadados e redirecionamentos externos 302).
 */

const frenchCoursesList = [
  {
    "titulo": "Python 3 : des fondamentaux aux concepts avancés (Inria / FUN-MOOC)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Inria / FUN-MOOC",
    "url": "https://www.fun-mooc.fr/fr/cours/python-3-des-fondamentaux-aux-concepts-avances/",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Formation universitaire ouverte d'Inria sur FUN-MOOC : syntaxe, structures de données, programmation orientée objet, itérateurs et écosystème Python moderne."
  },
  {
    "titulo": "MOOC SecNumacadémie : Sensibilisation à la cybersécurité (ANSSI)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "ANSSI (République Française)",
    "url": "https://secnumacademie.gouv.fr/",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Formation officielle et gratuite de l'Agence nationale de la sécurité des systèmes d'information (ANSSI) avec attestation de réussite. Panorama complet des bonnes pratiques cyber, cryptographie et protection des réseaux."
  },
  {
    "titulo": "L'Intelligence Artificielle... avec intelligence ! (Inria)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Inria / FUN-MOOC",
    "url": "https://www.fun-mooc.fr/fr/cours/lintelligence-artificielle-avec-intelligence/",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Introduction rigoureuse aux fondements de l'intelligence artificielle par les chercheurs d'Inria : apprentissage automatique, réseaux neuronaux, éthique et perspectives technologiques."
  },
  {
    "titulo": "Éléments d'IA — Introduction à l'Intelligence Artificielle (Français)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Université d'Helsinki / Reaktor (FR)",
    "url": "https://www.elementsofai.com/fr",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Version francophone officielle du MOOC européen primé d'introduction à l'IA. Démystification de l'apprentissage automatique, probabilités et réseaux de neurones avec certificat universitaire gratuit."
  },
  {
    "titulo": "Créez des pages web dynamiques avec JavaScript (OpenClassrooms)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "OpenClassrooms",
    "url": "https://openclassrooms.com/fr/courses/7697016-creez-des-pages-web-dynamiques-avec-javascript",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Cours complet en français pour maîtriser le DOM, gérer les événements, consommer des API asynchrones avec fetch() et concevoir des interfaces web interactives."
  },
  {
    "titulo": "Gérez du code avec Git et GitHub (OpenClassrooms)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "OpenClassrooms",
    "url": "https://openclassrooms.com/fr/courses/7162856-gerez-du-code-avec-git-et-github",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Apprentissage du contrôle de version, de la gestion des branches, des conflits de fusion, des pull requests et des bonnes pratiques de collaboration sur GitHub."
  },
  {
    "titulo": "Bases de données relationnelles et SQL (CNAM / FUN-MOOC)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "CNAM / FUN-MOOC",
    "url": "https://www.fun-mooc.fr/fr/cours/bases-de-donnees-relationnelles-et-sql/",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Cours du Conservatoire National des Arts et Métiers : modélisation relationnelle, normalisation des schémas, algèbre relationnelle et requêtes SQL avancées."
  },
  {
    "titulo": "Programmer en C (Institut Mines-Télécom / FUN-MOOC)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Institut Mines-Télécom / FUN-MOOC",
    "url": "https://www.fun-mooc.fr/fr/cours/programmer-en-c/",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Formation fondamentale de l'Institut Mines-Télécom sur la programmation en langage C : pointeurs, allocation dynamique de mémoire, tableaux, structures et préprocesseur."
  },
  {
    "titulo": "Initiez-vous au Machine Learning (OpenClassrooms)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "OpenClassrooms",
    "url": "https://openclassrooms.com/fr/courses/8063076-initiez-vous-au-machine-learning",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Découverte pratique des concepts d'apprentissage supervisé et non supervisé : préparation des données avec Scikit-Learn, régression linéaire, classification et évaluation des performances."
  },
  {
    "titulo": "Programmation Orientée Objet en PHP 8 (Grafikart)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Grafikart",
    "url": "https://grafikart.fr/formations/programmation-objet-php",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Formation vidéo ouverte sur l'architecture logicielle en PHP moderne : classes, héritage, interfaces, injection de dépendances, PSR standards et conception modulaire."
  }
];

module.exports = { frenchCoursesList };
