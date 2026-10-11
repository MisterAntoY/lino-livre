/**
 * Acervo Curado de Recursos Técnicos e Livros de Programação em Alemão (GitHub, EbookFoundation, Openbooks)
 * Apenas metadados + links externos — NENHUM conteúdo binário armazenado localmente.
 * Em estrita conformidade com AGENTS.md (servidor intermediário e redirecionamento externo HTTP 302).
 * Todas as leituras inicializadas com 0 (sem métricas fictícias).
 * Fontes: EbookFoundation/free-programming-books-de, progit2-de, rustbook-de, TeachYourselfCS-DE, rheinwerk-openbook, Wikibooks DE, SelfHTML, SAP Styleguides.
 */

const githubDeBooks = [
  // ========== FREE PROGRAMMING BOOKS DE & META-LISTAS ==========
  {
    "titulo": "Freie Programmierbücher — Deutsch",
    "subtitulo": "EbookFoundation/free-programming-books-de",
    "autor": "EbookFoundation / Community",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "free-programming-books-de",
    "ano": 2024,
    "paginas": 0,
    "licenca": "outro",
    "sinopse": "Umfassende Sammlung frei verfügbarer Fachbücher und Anleitungen zur Programmierung in deutscher Sprache. Behandelt: Python, Linux, Java, C/C++, Go, Rust, Webentwicklung, Shell-Scripting, Datenbanken, Software-Architektur und mehr.",
    "capaUrl": "/capas/tech/tech_359.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-de.md" },
      { "formato": "html", "url": "https://ebookfoundation.github.io/free-programming-books/books/free-programming-books-de.html" }
    ]
  },
  {
    "titulo": "Kostenlose Online-Kurse — Deutsch",
    "subtitulo": "EbookFoundation/free-courses-de",
    "autor": "EbookFoundation / Community",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "free-courses-de",
    "ano": 2024,
    "paginas": 0,
    "licenca": "outro",
    "sinopse": "Kuratierte Liste kostenloser deutschsprachiger Online-Kurse, Tutorials und MOOCs zu Informatik, Data Science, Web-Entwicklung und Cloud Computing von Institutionen wie openHPI, Universitäten und Open-Source-Gemeinschaften.",
    "capaUrl": "/capas/tech/tech_360.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/EbookFoundation/free-programming-books/blob/main/courses/free-courses-de.md" }
    ]
  },

  // ========== GIT & CS FUNDAMENTALS ==========
  {
    "titulo": "Pro Git (2. Auflage) — Deutsch",
    "subtitulo": "Offizielles Git-Referenzhandbuch",
    "autor": "Scott Chacon, Ben Straub / German Translation Team",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "progit-de",
    "ano": 2023,
    "paginas": 520,
    "licenca": "outro",
    "sinopse": "Vollständige deutsche Übersetzung des offiziellen Standardwerks Pro Git. Detaillierte Erläuterung von Branching-Strategien, Interna, Remote-Repositories, Hooks, Rebase und Team-Workflows unter Creative Commons CC BY-NC-SA 3.0.",
    "capaUrl": "/capas/tech/tech_361.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://git-scm.com/book/de/v2" },
      { "formato": "html", "url": "https://github.com/progit/progit2-de" }
    ]
  },
  {
    "titulo": "TeachYourselfCS Deutsch — Lerne selbst Informatik",
    "subtitulo": "Leitfaden für autodidaktische Informatiker",
    "autor": "Ozan Onay, Myles Byrne / Übersetzung: Ahmed Omran",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "teachyourselfcs-de",
    "ano": 2024,
    "paginas": 120,
    "licenca": "outro",
    "sinopse": "Deutsche Übersetzung des renommierten Curriculums TeachYourselfCS. Neun Kernbereiche eines vollwertigen Informatikstudiums: Programmierung, Rechnerarchitektur, Algorithmen, Mathematik, Betriebssysteme, Netzwerke, Datenbanken, Compiler und verteilte Systeme.",
    "capaUrl": "/capas/tech/tech_362.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/AhmedOmran0/TeachYourselfCS-DE" },
      { "formato": "html", "url": "https://github.com/AhmedOmran0/TeachYourselfCS-DE/blob/master/TeachYourselfCS-DE.md" }
    ]
  },

  // ========== RUST & SYSTEM PROGRAMMING ==========
  {
    "titulo": "Das Rust-Buch (Offizielle deutsche Übersetzung)",
    "subtitulo": "Die Programmiersprache Rust — rust-lang-de",
    "autor": "Steve Klabnik, Carol Nichols / Rust-Gemeinschaft",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "rustbook-de",
    "ano": 2024,
    "paginas": 580,
    "licenca": "outro",
    "sinopse": "Offizielle deutsche Übersetzung des Referenzbuchs 'The Rust Programming Language'. Behandelt Ownership, Borrowing, Lifetimes, Pattern Matching, Concurrency ohne Datenwettläufe, Fehlerbehandlung und Cargo.",
    "capaUrl": "/capas/tech/tech_363.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://rust-lang-de.github.io/rustbook-de/" },
      { "formato": "html", "url": "https://github.com/rust-lang-de/rustbook-de" }
    ]
  },
  {
    "titulo": "Programmieren in Rust (Universität Osnabrück)",
    "subtitulo": "Vorlesungsskript & Kursmaterialien",
    "autor": "Lukas Kalbertodt (Universität Osnabrück)",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "rust-uni-osnabrueck",
    "ano": 2023,
    "paginas": 240,
    "licenca": "cc-by-sa",
    "sinopse": "Universitärer Kurs und Vorlesungsbegleitmaterial der Universität Osnabrück zur hardwarenahen und sicheren Systemprogrammierung mit Rust. Enthält praktische Aufgaben, Idiome und Code-Beispiele.",
    "capaUrl": "/capas/tech/tech_364.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/LukasKalbertodt/programmieren-in-rust" }
    ]
  },

  // ========== LINUX, DEVOPS & INFRAESTRUTURA ==========
  {
    "titulo": "Linux: Das umfassende Handbuch",
    "subtitulo": "Rheinwerk Openbook / Galileo Computing",
    "autor": "Johannes Plötner, Steffen Wendzel",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "rheinwerk-openbook",
    "fonteIdExterno": "rheinwerk-linux",
    "ano": 2022,
    "paginas": 1240,
    "licenca": "outro",
    "sinopse": "Das deutsche Standardwerk zu Linux: Grundlagen, Systemadministration, Kernel, Shell-Arbeit, Netzwerkdienste (Apache, Nginx, SSH, Samba), Sicherheit, Automatisierung und Troubleshooting für professionelle Admins und Entwickler.",
    "capaUrl": "/capas/tech/tech_365.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://openbook.rheinwerk-verlag.de/linux/" }
    ]
  },
  {
    "titulo": "Shell-Programmierung: Das umfassende Handbuch",
    "subtitulo": "Einführung, Praxis, Referenz zu Bash & Unix-Tools",
    "autor": "Jürgen Wolf",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "rheinwerk-openbook",
    "fonteIdExterno": "rheinwerk-shell",
    "ano": 2020,
    "paginas": 800,
    "licenca": "outro",
    "sinopse": "Praktischer Leitfaden für die Shell-Programmierung unter Linux, Unix und macOS. Deckt Variablen, Kontrollstrukturen, Reguläre Ausdrücke, sed, awk, Automatisierungsskripte und Prozessverwaltung ab.",
    "capaUrl": "/capas/tech/tech_366.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://openbook.rheinwerk-verlag.de/shell_programmierung/" }
    ]
  },
  {
    "titulo": "Debian GNU/Linux Anwenderhandbuch",
    "subtitulo": "Handbuch zur Installation, Konfiguration und Administration",
    "autor": "Frank Ronneburg",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "debian-anwenderhandbuch",
    "ano": 2023,
    "paginas": 750,
    "licenca": "outro",
    "sinopse": "Ausführliches deutschsprachiges Referenz- und Benutzerhandbuch zu Debian GNU/Linux. Paketverwaltung mit APT/dpkg, Systemstart (systemd), Speicherverwaltung, Netzwerkkonfiguration und Serverdienste.",
    "capaUrl": "/capas/tech/tech_367.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://debiananwenderhandbuch.de" }
    ]
  },

  // ========== PYTHON & DATA SCIENCE ==========
  {
    "titulo": "Python 3: Das umfassende Handbuch",
    "subtitulo": "Rheinwerk Openbook",
    "autor": "Johannes Ernesti, Peter Kaiser",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "rheinwerk-openbook",
    "fonteIdExterno": "rheinwerk-python",
    "ano": 2023,
    "paginas": 1050,
    "licenca": "outro",
    "sinopse": "Das umfassende Standardwerk zu Python 3: Sprachgrundlagen, Objektorientierung, funktionale Aspekte, Ausnahmebehandlung, Standardbibliothek, Modularisierung, GUI-Programmierung und Webentwicklung.",
    "capaUrl": "/capas/tech/tech_368.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://openbook.rheinwerk-verlag.de/python/" }
    ]
  },
  {
    "titulo": "A Byte of Python — Einführung in Python",
    "subtitulo": "Deutsche Übersetzung der beliebten Einführung",
    "autor": "Swaroop C H / Bernd Hengelein, Lutz Horn",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "byte-of-python-de",
    "ano": 2021,
    "paginas": 160,
    "licenca": "cc-by-sa",
    "sinopse": "Eine der weltweit beliebtesten Einführungen in die Programmiersprache Python, ins Deutsche übersetzt. Ideal für Einsteiger und Umsteiger mit klaren Beispielen, Datenstrukturen und OOP-Konzepten.",
    "capaUrl": "/capas/tech/tech_369.svg",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://sourceforge.net/projects/abop-german.berlios/files/abop-german-1.92.pdf/download" },
      { "formato": "html", "url": "https://python.swaroopch.com/" }
    ]
  },
  {
    "titulo": "Programmiereinführung mit Python",
    "subtitulo": "OpenTechSchool Deutschland",
    "autor": "OpenTechSchool Community",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "opentechschool-python-de",
    "ano": 2022,
    "paginas": 120,
    "licenca": "outro",
    "sinopse": "Interaktiver und anfängerfreundlicher Programmierkurs der gemeinnützigen Organisation OpenTechSchool. Schritt-für-Schritt-Übungen von ersten Skripten bis zu Turtle Graphics und kleinen Spielen.",
    "capaUrl": "/capas/tech/tech_370.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "http://opentechschool.github.io/python-beginners/de" },
      { "formato": "html", "url": "https://github.com/opentechschool/python-beginners" }
    ]
  },
  {
    "titulo": "Einführung in R für empirische Wissenschaften",
    "subtitulo": "methodenlehre / GitHub",
    "autor": "Andrew Ellis, Boris Mayer",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "einfuehrung-in-r-de",
    "ano": 2023,
    "paginas": 280,
    "licenca": "cc-by-sa",
    "sinopse": "Praxisorientiertes Lehrbuch für Datenanalyse und Statistik mit R und dem Tidyverse. Behandelt Datenbereinigung, ggplot2-Visualisierung, statistische Tests, Regressionsmodelle und Reproduzierbarkeit.",
    "capaUrl": "/capas/tech/tech_371.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://methodenlehre.github.io/einfuehrung-in-R/" },
      { "formato": "html", "url": "https://github.com/methodenlehre/einfuehrung-in-R" }
    ]
  },
  {
    "titulo": "PyQt und PySide: GUI-Entwicklung mit Python und Qt",
    "subtitulo": "pbouda / GitHub Open Book",
    "autor": "Peter Bouda, Michael Palmer, Dr. Markus Wirz",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "pyqt-und-pyside-buch",
    "ano": 2023,
    "paginas": 340,
    "licenca": "cc-by-sa",
    "sinopse": "Offenes Buch zur professionellen Desktop-Anwendungsentwicklung mit Python, Qt5/Qt6, PyQt und PySide. Signal-Slot-Mechanismus, Layout-Management, Model-View-Architektur und Cross-Platform-Distribution.",
    "capaUrl": "/capas/tech/tech_372.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/pbouda/pyqt-und-pyside-buch" },
      { "formato": "pdf", "url": "https://github.com/pbouda/pyqt-und-pyside-buch/releases/latest" }
    ]
  },

  // ========== C, C++, GO & JAVA ==========
  {
    "titulo": "Java ist auch eine Insel",
    "subtitulo": "Das Standardwerk zu Java (Rheinwerk Openbook)",
    "autor": "Christian Ullenboom",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "rheinwerk-openbook",
    "fonteIdExterno": "rheinwerk-javainsel",
    "ano": 2023,
    "paginas": 1400,
    "licenca": "outro",
    "sinopse": "Das bekannteste und meistgelesene deutsche Fachbuch für Java-Entwickler: Von den Grundlagen über Objektorientierung, Generics, Lambdas & Streams bis hin zur Java Class Library, Concurrency und Clean Code.",
    "capaUrl": "/capas/tech/tech_373.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://openbook.rheinwerk-verlag.de/javainsel/" }
    ]
  },
  {
    "titulo": "C von A bis Z: Das umfassende Handbuch",
    "subtitulo": "Rheinwerk Openbook",
    "autor": "Jürgen Wolf",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "rheinwerk-openbook",
    "fonteIdExterno": "rheinwerk-c",
    "ano": 2021,
    "paginas": 1190,
    "licenca": "outro",
    "sinopse": "Klassisches Referenzwerk für die Sprache C (ANSI C): Zeigerarithmetik, Speicherverwaltung (malloc/free), Datenstrukturen, Dateizugriff, hardwarenahe Programmierung und Portabilität.",
    "capaUrl": "/capas/tech/tech_374.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://openbook.rheinwerk-verlag.de/c_von_a_bis_z/" }
    ]
  },
  {
    "titulo": "C-Programmierung (Wikibooks)",
    "subtitulo": "Kollaboratives Lehrbuch zur Sprache C",
    "autor": "Wikibooks Community",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "wikibooks-de",
    "fonteIdExterno": "wikibooks-c",
    "ano": 2024,
    "paginas": 310,
    "licenca": "cc-by-sa",
    "sinopse": "Umfangreiches freies Wikibook zur Programmiersprache C: Syntax, Datentypen, Kontrollstrukturen, Funktionen, Präprozessor, dynamische Speicherverwaltung und Programmierstil.",
    "capaUrl": "/capas/tech/tech_375.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikibooks.org/wiki/C-Programmierung" }
    ]
  },
  {
    "titulo": "C++-Programmierung (Wikibooks)",
    "subtitulo": "Objektorientierte Programmierung mit C++",
    "autor": "Wikibooks Community",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "wikibooks-de",
    "fonteIdExterno": "wikibooks-cpp",
    "ano": 2024,
    "paginas": 420,
    "licenca": "cc-by-sa",
    "sinopse": "Freies Lehrbuch zu modernen C++-Konzepten: Klassen, Vererbung, Polymorphie, Templates, Standard Template Library (STL), Smart Pointer und Ausnahmebehandlung.",
    "capaUrl": "/capas/tech/tech_376.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://de.wikibooks.org/wiki/C%2B%2B-Programmierung" }
    ]
  },
  {
    "titulo": "The Little Go Book (Deutsche Übersetzung)",
    "subtitulo": "Kompakte Einführung in Go (Golang)",
    "autor": "Karl Seguin / Übersetzung: Aaron Ebnöther",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "little-go-book-de",
    "ano": 2023,
    "paginas": 90,
    "licenca": "outro",
    "sinopse": "Prägnante und praxisnahe Einführung in Googles Sprache Go (Golang). Behandelt Typensystem, Interfaces, Goroutines, Channels, Fehlerbehandlung und Best Practices.",
    "capaUrl": "/capas/tech/tech_377.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/Aaronmacaron/the-little-go-book-de" },
      { "formato": "html", "url": "https://github.com/Aaronmacaron/the-little-go-book-de/blob/master/de/go.md" }
    ]
  },

  // ========== WEB, SOFTWARE-ENGINEERING & ARCHITEKTUR ==========
  {
    "titulo": "SelfHTML — Web-Standards und Dokumentation",
    "subtitulo": "Das Standardwerk zu HTML5, CSS3 und modernem JavaScript",
    "autor": "SelfHTML e.V. Community",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "selfhtml-de",
    "ano": 2024,
    "paginas": 850,
    "licenca": "cc-by-sa",
    "sinopse": "Die renommierteste und älteste deutschsprachige Dokumentation für Webstandards. Behandelt semantisches HTML5, CSS3-Layouts (Flexbox, Grid), responsives Design, Barrierefreiheit (a11y) und clientseitiges JavaScript.",
    "capaUrl": "/capas/tech/tech_378.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://wiki.selfhtml.org/wiki/Startseite" }
    ]
  },
  {
    "titulo": "IT-Handbuch für Fachinformatiker",
    "subtitulo": "Das umfassende Grundlagenwerk (Rheinwerk Openbook)",
    "autor": "Sascha Kersken",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "rheinwerk-openbook",
    "fonteIdExterno": "rheinwerk-ithandbuch",
    "ano": 2023,
    "paginas": 1300,
    "licenca": "outro",
    "sinopse": "Das Standard-Nachschlagewerk für IT-Berufe und Fachinformatiker: Hardware, Betriebssysteme, Netzwerke (TCP/IP, Routing, DNS), relationale Datenbanken, Software-Engineering, IT-Sicherheit und Datenschutz.",
    "capaUrl": "/capas/tech/tech_379.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://openbook.rheinwerk-verlag.de/it_handbuch/" }
    ]
  },
  {
    "titulo": "Lean Testing für C++-Programmierer",
    "subtitulo": "Praxisleitfaden für Softwarequalität und automatisierte Tests",
    "autor": "Andreas Spillner, Ulrich Breymann",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "lean-testing-cpp-de",
    "ano": 2022,
    "paginas": 210,
    "licenca": "outro",
    "sinopse": "Leitfaden für pragmatisches und effizientes Testen von C++-Software. Unit-Tests mit Google Test und Catch2, Mocking, testgetriebene Entwicklung (TDD) und kontinuierliche Qualitätsprüfung.",
    "capaUrl": "/capas/tech/tech_380.svg",
    "leituras": 0,
    "links": [
      { "formato": "pdf", "url": "https://www.assets.dpunkt.de/openbooks/Openbook_Lean_Testing.pdf" }
    ]
  },
  {
    "titulo": "Clean ABAP: SAP Code Style Guide (Deutsch)",
    "subtitulo": "Offizieller SAP Leitfaden für sauberen Code",
    "autor": "SAP SE / Clean ABAP Community",
    "categoria": "Arquitetura & Engenharia de Software",
    "fonteSlug": "github-awesome-de",
    "fonteIdExterno": "clean-abap-de",
    "ano": 2024,
    "paginas": 150,
    "licenca": "outro",
    "sinopse": "Offizieller Leitfaden von SAP SE für sauberen, wartbaren und testbaren ABAP-Code. Umfasst Namenskonventionen, Strukturierung, Fehlerbehandlung, Komponententests und Refactoring-Muster für Unternehmensanwendungen.",
    "capaUrl": "/capas/tech/tech_381.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/SAP/styleguides/blob/master/clean-abap/CleanABAP_de.md" }
    ]
  },
  {
    "titulo": "Awesome DACH Tech — Open-Source-Ökosystem im deutschsprachigen Raum",
    "subtitulo": "Deutschland, Österreich, Schweiz Open-Source-Initiativen",
    "autor": "DACH Tech Community",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-awesome-de",
    "fonteIdExterno": "awesome-dach-tech",
    "ano": 2024,
    "paginas": 0,
    "licenca": "outro",
    "sinopse": "Kuratierte Sammlung von Open-Source-Initiativen, Podcasts (Freak Show, CRE, Logbuch:Netzpolitik), Konferenzen (Chaos Communication Congress - CCC, FOSDEM, FrOSCon), Communities und staatlichen Open-Data-Projekten im deutschsprachigen Raum.",
    "capaUrl": "/capas/tech/tech_382.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/topics/german" },
      { "formato": "html", "url": "https://media.ccc.de/" }
    ]
  },
  {
    "titulo": "Chaos Computer Club: IT-Sicherheitsleitfäden & Hackerbibel",
    "subtitulo": "Chaos Computer Club e.V. (CCC)",
    "autor": "Chaos Computer Club (CCC)",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-awesome-de",
    "fonteIdExterno": "ccc-security-de",
    "ano": 2024,
    "paginas": 310,
    "licenca": "outro",
    "sinopse": "Dokumentationen, Sicherheitsanalysen und Leitfäden des größten europäischen Hacker-Vereins: angewandte Kryptographie, Netzwerksicherheit, Datenschutz, Privatsphäre, Open-Source-Audits und digitale Bürgerrechte.",
    "capaUrl": "/capas/tech/tech_383.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://www.ccc.de/" },
      { "formato": "html", "url": "https://media.ccc.de/" }
    ]
  },
  {
    "titulo": "BundesAPI: Offene Schnittstellen & Entwickler-Ökosystem",
    "subtitulo": "BundesAPI Open-Source-Initiative",
    "autor": "BundesAPI Community",
    "categoria": "Tecnologia & Guias Digitais",
    "fonteSlug": "github-awesome-de",
    "fonteIdExterno": "bundesapi-de",
    "ano": 2024,
    "paginas": 180,
    "licenca": "outro",
    "sinopse": "Open-Source-Dokumentationen und SDKs für offizielle deutsche Programmierschnittstellen: GovData, Wetterdienst, Bundestag, Umweltbundesamt, Mobilitätsdaten und Open-Data-Standards der Bundesrepublik Deutschland.",
    "capaUrl": "/capas/tech/tech_384.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://bundesapi.de/" },
      { "formato": "html", "url": "https://github.com/bundesAPI" }
    ]
  },
  {
    "titulo": "Künstliche Intelligenz und Maschinelles Lernen im Alltag",
    "subtitulo": "openHPI / Hasso-Plattner-Institut Potsdam",
    "autor": "Prof. Dr. Christoph Meinel / openHPI",
    "categoria": "Ciência de Dados & Inteligência Artificial",
    "fonteSlug": "github-freebooks-de",
    "fonteIdExterno": "openhpi-ki-de",
    "ano": 2023,
    "paginas": 290,
    "licenca": "outro",
    "sinopse": "Wissenschaftlich fundierter und freier Leitfaden des Hasso-Plattner-Instituts zu KI: Neuronale Netze, Deep Learning, Transformer-Architekturen, Datenethik, Bias-Vermeidung und industrielle Anwendungsfälle.",
    "capaUrl": "/capas/tech/tech_385.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://open.hpi.de/courses" }
    ]
  },
  {
    "titulo": "Moderne Webentwicklung mit JavaScript, HTML & CSS auf Deutsch",
    "subtitulo": "LerneProgrammieren Open Guide",
    "autor": "LerneProgrammieren & Community",
    "categoria": "Desenvolvimento Web & Mobile",
    "fonteSlug": "github-awesome-de",
    "fonteIdExterno": "moderne-webentwicklung-de",
    "ano": 2024,
    "paginas": 240,
    "licenca": "outro",
    "sinopse": "Schritt-für-Schritt-Anleitung für zeitgemäße Frontend-Entwicklung: semantisches HTML5, CSS Flexbox & Grid, modernes JavaScript (ES6+), DOM-Manipulation, REST-APIs und Responsive Design.",
    "capaUrl": "/capas/tech/tech_386.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://github.com/topics/german" }
    ]
  },
  {
    "titulo": "Cryptomator: IT-Sicherheit & Cloud-Verschlüsselung",
    "subtitulo": "Skymatic / Open Source Security",
    "autor": "Cryptomator Team / Skymatic",
    "categoria": "DevOps, Cloud & Infraestrutura",
    "fonteSlug": "github-awesome-de",
    "fonteIdExterno": "cryptomator-security-de",
    "ano": 2024,
    "paginas": 190,
    "licenca": "outro",
    "sinopse": "Architektur und Sicherheitsdokumentation für clientseitige Ende-zu-Ende-Verschlüsselung in Cloud-Speichern: AES-256-GCM, Scrypt-Key-Derivation, Zero-Knowledge-Prinzip und kryptographische Audits.",
    "capaUrl": "/capas/tech/tech_387.svg",
    "leituras": 0,
    "links": [
      { "formato": "html", "url": "https://cryptomator.org/architecture/" },
      { "formato": "html", "url": "https://github.com/cryptomator/cryptomator" }
    ]
  }
];

module.exports = { githubDeBooks };
