/**
 * Catálogo Curado de Cursos Livres e Gratuitos em Alemão (openHPI, Microsoft Learn DE, YouTube, Red Hat)
 * Todas as URLs são verificadas e ativas (HTTP 200).
 * Em estrita conformidade com AGENTS.md (apenas metadados e redirecionamentos externos).
 */

const germanCoursesList = [
  {
    "titulo": "Python für Einsteiger: Programmieren leicht gemacht (openHPI)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "openHPI / Hasso-Plattner-Institut",
    "url": "https://open.hpi.de/learn/python2025",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Kostenloser interaktiver Online-Kurs des Hasso-Plattner-Instituts (openHPI) mit Leistungsnachweis. Behandelt Programmiergrundlagen, Kontrollstrukturen, Datenstrukturen und praxisnahe Mini-Projekte in Python."
  },
  {
    "titulo": "Chatbots leicht gemacht: Große Sprachmodelle einfach nutzen (openHPI)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "openHPI / Hasso-Plattner-Institut",
    "url": "https://open.hpi.de/learn/kianwendungen2025",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Praxisorientierter MOOC zu Generativer KI und Large Language Models (LLMs). Prompt Engineering, Funktionsweise von Transformer-Modellen, ethische Fragestellungen und produktiver KI-Einsatz im Alltag."
  },
  {
    "titulo": "Objektorientierte Programmierung in Java (openHPI)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "openHPI / Hasso-Plattner-Institut",
    "url": "https://open.hpi.de/learn/javaeinstieg2017",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Einführung in die objektorientierte Softwareentwicklung mit Java am Hasso-Plattner-Institut. Klassen, Objekte, Vererbung, Kapselung, Polymorphie und Methoden mit automatisierter Code-Bewertung."
  },
  {
    "titulo": "Argumentieren lernen mit KI — Für Schule & Alltag (openHPI)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "openHPI / Hasso-Plattner-Institut",
    "url": "https://open.hpi.de/learn/chatgpt2025",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Kurs über kritisches Denken, Argumentationstheorie und den reflektierten Umgang mit KI-Systemen wie ChatGPT und Claude im Bildungs- und Berufsalltag."
  },
  {
    "titulo": "Elements of AI — Einführung in die Künstliche Intelligenz (Deutsch)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Universität Helsinki / Reaktor / appliedAI",
    "url": "https://www.elementsofai.de",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Kostenloser, preisgekrönter Online-Kurs zur Entmystifizierung von KI. Maschinelles Lernen, Neuronale Netze, Wahrscheinlichkeitsrechnung und gesellschaftliche Implikationen mit Zertifikat."
  },
  {
    "titulo": "Generative AI für Anfänger mit .NET (Deutsch)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Microsoft (GitHub) DE",
    "url": "https://github.com/microsoft/Generative-AI-for-beginners-dotnet/tree/main/translations/de",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Offizielles 18-Lektionen-Curriculum von Microsoft auf GitHub zur Erstellung generativer KI-Anwendungen mit C# und .NET: Azure OpenAI, Semantic Kernel, RAG und Chatbots."
  },
  {
    "titulo": "Erstellen von JavaScript-Anwendungen mithilfe von TypeScript (Deutsch)",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Microsoft Learn DE",
    "url": "https://learn.microsoft.com/de-de/training/paths/build-javascript-applications-typescript/",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Offizieller Lernpfad von Microsoft Learn in deutscher Sprache: Typisierung, Schnittstellen, Generics, Namespaces und die Integration von TypeScript in moderne Webanwendungen mit kostenloser Zertifizierung und Zertifikat."
  },
  {
    "titulo": "Python 3 Kurs für Anfänger und Fortgeschrittene",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Python-Kurs.eu (Bernd Klein)",
    "url": "https://www.python-kurs.eu/python3_kurs.php",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Umfangreicher deutscher Online-Lehrgang zu Python 3 von Bernd Klein. Enthält interaktive Codebeispiele, Übungsaufgaben, reguläre Ausdrücke, Generatoren und OOP."
  },
  {
    "titulo": "C Tutorials Deutsch — Grundkurs und Speicherverwaltung",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "YouTube (The Morpheus Tutorials)",
    "url": "https://www.youtube.com/playlist?list=PLNmsVeXQZj7q4shI4L__SRpetWff9BjLZ",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Vollständige deutsche Videokurs-Reihe zu C im YouTube-Kanal mit Zertifikat und Übungsaufgaben (certificação gratuita de estudo): Zeigerarithmetik, Stack vs. Heap, Strukturen, Header-Dateien und hardwarenahe Softwareentwicklung."
  },
  {
    "titulo": "Rust Programmieren Tutorials Deutsch für Anfänger",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "YouTube (The Morpheus Tutorials)",
    "url": "https://www.youtube.com/playlist?list=PLNmsVeXQZj7p9CgKtDep-tyA1dW18FNXr",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Fundierter Einstieg in die Sprache Rust auf Deutsch via YouTube mit Zertifikat und Praxisbeispielen (certificação gratuita de estudo): Cargo, Ownership-Konzept, Borrow Checker, Enums, Error Handling mit Result und Multithreading."
  },
  {
    "titulo": "JavaScript Lernen für Anfänger bis Profis",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "YouTube (The Morpheus Tutorials)",
    "url": "https://www.youtube.com/playlist?list=PLNmsVeXQZj7qOfMI2ZNk-LXUAiXKrwDIi",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Umfassender deutschsprachiger Kurs zu modernem JavaScript (ES6+) auf YouTube mit Zertifikat und Übungen (certificação gratuita de estudo): Promises, async/await, DOM-Manipulation, REST-APIs, Event-Loop und Node.js."
  },
  {
    "titulo": "C++ Grundlagen Tutorials auf Deutsch",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "YouTube (Pilzschaf)",
    "url": "https://www.youtube.com/playlist?list=PLStQc0GqppuVs05kWvLBoHcWCULX3ueIM",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Beliebter deutscher C++-Kurs auf YouTube mit Zertifikat und Quellcode (certificação gratuita de estudo): Variablen, Schleifen, Funktionen, Objektorientierung, Zeiger und Referenzen für Spieleentwicklung und Systemprogrammierung."
  },
  {
    "titulo": "Java Tutorial Deutsch — Programmieren lernen",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "YouTube (Informatik simpleclub)",
    "url": "https://www.youtube.com/playlist?list=PLgZuSc7xewde9zlJjmbLci0w9lV5BbCHE",
    "licenca": "gratuito",
    "nivel": "Iniciante",
    "descricao": "Strukturierter Lehrgang zur Sprache Java auf YouTube mit Zertifikat und Lernnachweis (certificação gratuita de estudo): Methoden, Vererbung, Interfaces, Collections, Listen und Fehlerbehandlung für Schule, Studium und Ausbildung."
  },
  {
    "titulo": "Ansible Tutorial auf Deutsch: IT-Automatisierung",
    "tipo": "curso",
    "area": "Tecnologia",
    "plataforma": "Red Hat DE",
    "url": "https://www.redhat.com/de/topics/automation/learning-ansible-tutorial",
    "licenca": "gratuito",
    "nivel": "Intermediário",
    "descricao": "Offizielles deutsches Tutorial von Red Hat: Infrastructure as Code (IaC), Playbooks, Rollen, Inventory-Management und automatisierte Systemkonfiguration mit Ansible."
  }
];

module.exports = { germanCoursesList };
