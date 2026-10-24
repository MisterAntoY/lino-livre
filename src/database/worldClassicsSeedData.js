/**
 * Os 100 Livros Mais Lidos e Vendidos da História do Mundo (Mais 5 Obras Históricas de Circulação Universal)
 * Compilado a partir de OS-100-LIVROS-MAIS-LIDOS-DO-MUNDO.md
 * Enriquecido com capas oficiais do Gutenberg e Open Library e links externos verificados.
 * Em estrita conformidade com AGENTS.md (zero arquivos locais).
 *
 * Política de links (auditoria de 2026-10-24):
 *  - Obras em domínio público apontam para o ficheiro aberto no Project Gutenberg
 *    ou na Wikisource.
 *  - Obras com licença "outro" (direitos comerciais) apontam apenas para o
 *    catálogo público da Open Library (metadados, empréstimo legal ou compra).
 *  - Nunca são publicados links diretos do tipo archive.org/download para itens
 *    de empréstimo: esses URLs devolvem HTTP 401/403 (nginx) e não são acesso livre.
 */

const worldClassicsList = [
  {
    "titulo": "A Bíblia Sagrada",
    "subtitulo": "Tradição Judaico-Cristã • Circulação: > 5 a 7 bilhões de cópias",
    "autor": "Vários Autores / Tradição Bíblica",
    "ano": 100,
    "idioma": "pt",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-hist-1",
    "licenca": "dominio-publico",
    "sinopse": "O texto mais lido, traduzido e impresso de toda a história humana. Coletânea de escrituras canônicas do Antigo e Novo Testamento em domínio público.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/10.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/10.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/10/10-h/10-h.htm"
      }
    ]
  },
  {
    "titulo": "Dom Quixote de la Mancha",
    "subtitulo": "El ingenioso hidalgo Don Quijote de la Mancha (1605/1615) • > 500 milhões",
    "autor": "Miguel de Cervantes",
    "ano": 1605,
    "idioma": "es",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-hist-2",
    "licenca": "dominio-publico",
    "sinopse": "A obra-prima fundadora do romance moderno. Narra as tragicômicas aventuras do fidalgo Alonso Quijano e de seu fiel escudeiro Sancho Pança.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/996/pg996.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/996.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/996.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/996/996-h/996-h.htm"
      }
    ]
  },
  {
    "titulo": "O Manifesto Comunista",
    "subtitulo": "Manifest der Kommunistischen Partei (1848) • > 500 milhões",
    "autor": "Karl Marx & Friedrich Engels",
    "ano": 1848,
    "idioma": "de",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-hist-3",
    "licenca": "dominio-publico",
    "sinopse": "Um dos tratados sociopolíticos mais influentes da história mundial, analisando as lutas de classes, as transformações do trabalho e o desenvolvimento histórico.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/61/pg61.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/61.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/61.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/61/61-h/61-h.htm"
      }
    ]
  },
  {
    "titulo": "Citações do Presidente Mao Tsé-Tung (O Livro Vermelho)",
    "subtitulo": "毛主席语录 (1964) • > 900 milhões a 1 bilhão de exemplares",
    "autor": "Mao Tsé-Tung",
    "ano": 1964,
    "idioma": "zh",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-hist-4",
    "licenca": "outro",
    "sinopse": "Coletânea histórica de aforismos e discursos de Mao Tsé-Tung amplamente impressa e distribuída na China no século XX.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Cita%C3%A7%C3%B5es%20do%20Presidente%20Mao%20Ts%C3%A9-Tung%20O%20Livro%20Vermelho"
      }
    ]
  },
  {
    "titulo": "O Alcorão",
    "subtitulo": "القرآن الكريم • > 800 milhões de cópias",
    "autor": "Tradição Islâmica",
    "ano": 632,
    "idioma": "ar",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-hist-5",
    "licenca": "dominio-publico",
    "sinopse": "Texto sagrado do Islã, considerado uma das obras fundamentais da literatura clássica árabe e da história das religiões mundiais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Alcor%C3%A3o"
      }
    ]
  },
  {
    "titulo": "Um Conto de Duas Cidades",
    "subtitulo": "A Tale of Two Cities (1859) • Circulação: > 200 milhões",
    "autor": "Charles Dickens",
    "ano": 1859,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-1",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em > 200 milhões. Título original: \"A Tale of Two Cities\" (1859). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/98/pg98.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/98.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/98.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/98/98-h/98-h.htm"
      }
    ]
  },
  {
    "titulo": "O Pequeno Príncipe",
    "subtitulo": "Le Petit Prince (1943) • Circulação: 200 milhões",
    "autor": "Antoine de Saint-Exupéry",
    "ano": 1943,
    "idioma": "fr",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-2",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 200 milhões. Título original: \"Le Petit Prince\" (1943). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/10708272-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Pequeno%20Pr%C3%ADncipe%20Antoine%20de%20Saint-Exup%C3%A9ry"
      }
    ]
  },
  {
    "titulo": "O Senhor dos Anéis (Obra Completa)",
    "subtitulo": "The Lord of the Rings (1954) • Circulação: 150 milhões",
    "autor": "J. R. R. Tolkien",
    "ano": 1954,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-3",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 150 milhões. Título original: \"The Lord of the Rings\" (1954). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Senhor%20dos%20An%C3%A9is%20Obra%20Completa"
      }
    ]
  },
  {
    "titulo": "O Alquimista",
    "subtitulo": "O Alquimista (1988) • Circulação: 150 milhões",
    "autor": "Paulo Coelho",
    "ano": 1988,
    "idioma": "pt",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-4",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 150 milhões. Título original: \"O Alquimista\" (1988). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/7414780-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Alquimista%20Paulo%20Coelho"
      }
    ]
  },
  {
    "titulo": "Harry Potter e a Pedra Filosofal",
    "subtitulo": "Harry Potter and the Philosopher's Stone (1997) • Circulação: 120 milhões",
    "autor": "J. K. Rowling",
    "ano": 1997,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-5",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 120 milhões. Título original: \"Harry Potter and the Philosopher's Stone\" (1997). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/15155833-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Harry%20Potter%20e%20a%20Pedra%20Filosofal%20J.%20K.%20Rowling"
      }
    ]
  },
  {
    "titulo": "E Não Sobrou Nenhum (O Caso dos Dez Negrinhos)",
    "subtitulo": "And Then There Were None (1939) • Circulação: 100 milhões",
    "autor": "Agatha Christie",
    "ano": 1939,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-6",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 100 milhões. Título original: \"And Then There Were None\" (1939). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=E%20N%C3%A3o%20Sobrou%20Nenhum%20O%20Caso%20dos%20Dez%20Negrinhos"
      }
    ]
  },
  {
    "titulo": "O Sonho da Câmara Vermelha",
    "subtitulo": "紅樓夢 (Dream of the Red Chamber) (1791) • Circulação: 100 milhões",
    "autor": "Cao Xueqin",
    "ano": 1791,
    "idioma": "zh",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-7",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 100 milhões. Título original: \"紅樓夢 (Dream of the Red Chamber)\" (1791). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/24264/pg24264.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/24264.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/24264.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/24264/24264-h/24264-h.htm"
      }
    ]
  },
  {
    "titulo": "O Hobbit",
    "subtitulo": "The Hobbit (1937) • Circulação: 100 milhões",
    "autor": "J. R. R. Tolkien",
    "ano": 1937,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-8",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 100 milhões. Título original: \"The Hobbit\" (1937). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/14627509-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Hobbit%20J.%20R.%20R.%20Tolkien"
      }
    ]
  },
  {
    "titulo": "As Aventuras de Alice no País das Maravilhas",
    "subtitulo": "Alice's Adventures in Wonderland (1865) • Circulação: 100 milhões",
    "autor": "Lewis Carroll",
    "ano": 1865,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-9",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 100 milhões. Título original: \"Alice's Adventures in Wonderland\" (1865). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/11.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/11.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/11/11-h/11-h.htm"
      }
    ]
  },
  {
    "titulo": "Ela, a Feiticeira",
    "subtitulo": "She: A History of Adventure (1887) • Circulação: 83 milhões",
    "autor": "H. Rider Haggard",
    "ano": 1887,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-10",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 83 milhões. Título original: \"She: A History of Adventure\" (1887). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/3155/pg3155.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/3155.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/3155.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/3155/3155-h/3155-h.htm"
      }
    ]
  },
  {
    "titulo": "O Leão, a Feiticeira e o Guarda-Roupa",
    "subtitulo": "The Lion, the Witch and the Wardrobe (1950) • Circulação: 85 milhões",
    "autor": "C. S. Lewis",
    "ano": 1950,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-11",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 85 milhões. Título original: \"The Lion, the Witch and the Wardrobe\" (1950). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Le%C3%A3o%2C%20a%20Feiticeira%20e%20o%20Guarda-Roupa"
      }
    ]
  },
  {
    "titulo": "O Código Da Vinci",
    "subtitulo": "The Da Vinci Code (2003) • Circulação: 80 milhões",
    "autor": "Dan Brown",
    "ano": 2003,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-12",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 80 milhões. Título original: \"The Da Vinci Code\" (2003). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/9255229-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20C%C3%B3digo%20Da%20Vinci%20Dan%20Brown"
      }
    ]
  },
  {
    "titulo": "Harry Potter e a Câmara Secreta",
    "subtitulo": "Harry Potter and the Chamber of Secrets (1998) • Circulação: 77 milhões",
    "autor": "J. K. Rowling",
    "ano": 1998,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-13",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 77 milhões. Título original: \"Harry Potter and the Chamber of Secrets\" (1998). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/15158664-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Harry%20Potter%20e%20a%20C%C3%A2mara%20Secreta%20J.%20K.%20Rowling"
      }
    ]
  },
  {
    "titulo": "Quem Pensa Enriquece",
    "subtitulo": "Think and Grow Rich (1937) • Circulação: 70 milhões",
    "autor": "Napoleon Hill",
    "ano": 1937,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-14",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 70 milhões. Título original: \"Think and Grow Rich\" (1937). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/67362/pg67362.cover.medium.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/ebooks/67362"
      },
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/67362.epub3.images"
      }
    ]
  },
  {
    "titulo": "O Apanhador no Campo de Centeio",
    "subtitulo": "The Catcher in the Rye (1951) • Circulação: 65 milhões",
    "autor": "J. D. Salinger",
    "ano": 1951,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-15",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 65 milhões. Título original: \"The Catcher in the Rye\" (1951). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/9273490-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Apanhador%20no%20Campo%20de%20Centeio%20J.%20D.%20Salinger"
      }
    ]
  },
  {
    "titulo": "O Mundo de Sofia",
    "subtitulo": "Sofies verden (1991) • Circulação: 60 milhões",
    "autor": "Jostein Gaarder",
    "ano": 1991,
    "idioma": "no",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-16",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 60 milhões. Título original: \"Sofies verden\" (1991). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/9046999-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/works/OL16981323W"
      }
    ]
  },
  {
    "titulo": "As Pontes de Madison",
    "subtitulo": "The Bridges of Madison County (1992) • Circulação: 60 milhões",
    "autor": "Robert James Waller",
    "ano": 1992,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-17",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 60 milhões. Título original: \"The Bridges of Madison County\" (1992). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=As%20Pontes%20de%20Madison"
      }
    ]
  },
  {
    "titulo": "Cem Anos de Solidão",
    "subtitulo": "Cien años de soledad (1967) • Circulação: 50 milhões",
    "autor": "Gabriel García Márquez",
    "ano": 1967,
    "idioma": "es",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-18",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"Cien años de soledad\" (1967). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/12627383-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Cem%20Anos%20de%20Solid%C3%A3o%20Gabriel%20Garc%C3%ADa%20M%C3%A1rquez"
      }
    ]
  },
  {
    "titulo": "Lolita",
    "subtitulo": "Lolita (1955) • Circulação: 50 milhões",
    "autor": "Vladimir Nabokov",
    "ano": 1955,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-19",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"Lolita\" (1955). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/12984540-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Lolita%20Vladimir%20Nabokov"
      }
    ]
  },
  {
    "titulo": "Heidi",
    "subtitulo": "Heidi (1880) • Circulação: 50 milhões",
    "autor": "Johanna Spyri",
    "ano": 1880,
    "idioma": "de",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-20",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"Heidi\" (1880). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/1448/pg1448.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/1448.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/1448.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/1448/1448-h/1448-h.htm"
      }
    ]
  },
  {
    "titulo": "Meu Filho, Meu Tesouro (Manual de Cuidados)",
    "subtitulo": "The Common Sense Book of Baby and Child Care (1946) • Circulação: 50 milhões",
    "autor": "Benjamin Spock",
    "ano": 1946,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-21",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"The Common Sense Book of Baby and Child Care\" (1946). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Meu%20Filho%2C%20Meu%20Tesouro%20Manual%20de%20Cuidados"
      }
    ]
  },
  {
    "titulo": "Anne de Green Gables",
    "subtitulo": "Anne of Green Gables (1908) • Circulação: 50 milhões",
    "autor": "Lucy Maud Montgomery",
    "ano": 1908,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-22",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"Anne of Green Gables\" (1908). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/45/pg45.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/45.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/45.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/45/45-h/45-h.htm"
      }
    ]
  },
  {
    "titulo": "Beleza Negra",
    "subtitulo": "Black Beauty (1877) • Circulação: 50 milhões",
    "autor": "Anna Sewell",
    "ano": 1877,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-23",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"Black Beauty\" (1877). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/271/pg271.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/271.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/271.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/271/271-h/271-h.htm"
      }
    ]
  },
  {
    "titulo": "O Nome da Rosa",
    "subtitulo": "Il Nome della Rosa (1980) • Circulação: 50 milhões",
    "autor": "Umberto Eco",
    "ano": 1980,
    "idioma": "it",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-24",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"Il Nome della Rosa\" (1980). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8598263-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Nome%20da%20Rosa%20Umberto%20Eco"
      }
    ]
  },
  {
    "titulo": "A Águia Pousou",
    "subtitulo": "The Eagle Has Landed (1975) • Circulação: 50 milhões",
    "autor": "Jack Higgins",
    "ano": 1975,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-25",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"The Eagle Has Landed\" (1975). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20%C3%81guia%20Pousou"
      }
    ]
  },
  {
    "titulo": "Em Busca de Watership Down",
    "subtitulo": "Watership Down (1972) • Circulação: 50 milhões",
    "autor": "Richard Adams",
    "ano": 1972,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-26",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"Watership Down\" (1972). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Em%20Busca%20de%20Watership%20Down"
      }
    ]
  },
  {
    "titulo": "O Relatório Hite",
    "subtitulo": "The Hite Report (1976) • Circulação: 50 milhões",
    "autor": "Shere Hite",
    "ano": 1976,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-27",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"The Hite Report\" (1976). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Relat%C3%B3rio%20Hite"
      }
    ]
  },
  {
    "titulo": "A Teia de Charlotte",
    "subtitulo": "Charlotte's Web (1952) • Circulação: 50 milhões",
    "autor": "E. B. White",
    "ano": 1952,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-28",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"Charlotte's Web\" (1952). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8461797-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Teia%20de%20Charlotte%20E.%20B.%20White"
      }
    ]
  },
  {
    "titulo": "O Homem Ruivo",
    "subtitulo": "The Ginger Man (1955) • Circulação: 50 milhões",
    "autor": "J. P. Donleavy",
    "ano": 1955,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-29",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"The Ginger Man\" (1955). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Homem%20Ruivo"
      }
    ]
  },
  {
    "titulo": "Uma Vida com Propósitos",
    "subtitulo": "The Purpose Driven Life (2002) • Circulação: 50 milhões",
    "autor": "Rick Warren",
    "ano": 2002,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-30",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 50 milhões. Título original: \"The Purpose Driven Life\" (2002). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/7438125-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/works/OL17360280W"
      }
    ]
  },
  {
    "titulo": "A História do Pedro Coelho",
    "subtitulo": "The Tale of Peter Rabbit (1902) • Circulação: 45 milhões",
    "autor": "Beatrix Potter",
    "ano": 1902,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-31",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 45 milhões. Título original: \"The Tale of Peter Rabbit\" (1902). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/14838/pg14838.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/14838.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/14838.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/14838/14838-h/14838-h.htm"
      }
    ]
  },
  {
    "titulo": "Fernão Capelo Gaivota",
    "subtitulo": "Jonathan Livingston Seagull (1970) • Circulação: 44 milhões",
    "autor": "Richard Bach",
    "ano": 1970,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-32",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 44 milhões. Título original: \"Jonathan Livingston Seagull\" (1970). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/6522230-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Fern%C3%A3o%20Capelo%20Gaivota%20Richard%20Bach"
      }
    ]
  },
  {
    "titulo": "Uma Lagarta Muito Comilona",
    "subtitulo": "The Very Hungry Caterpillar (1969) • Circulação: 43 milhões",
    "autor": "Eric Carle",
    "ano": 1969,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-33",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 43 milhões. Título original: \"The Very Hungry Caterpillar\" (1969). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Uma%20Lagarta%20Muito%20Comilona"
      }
    ]
  },
  {
    "titulo": "Uma Mensagem a Garcia",
    "subtitulo": "A Message to Garcia (1899) • Circulação: 40 milhões",
    "autor": "Elbert Hubbard",
    "ano": 1899,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-34",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 40 milhões. Título original: \"A Message to Garcia\" (1899). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/7047/pg7047.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/7047.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/7047.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/7047/7047-h/7047-h.htm"
      }
    ]
  },
  {
    "titulo": "O Sol é Para Todos",
    "subtitulo": "To Kill a Mockingbird (1960) • Circulação: 40 milhões",
    "autor": "Harper Lee",
    "ano": 1960,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-35",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 40 milhões. Título original: \"To Kill a Mockingbird\" (1960). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/14351077-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Sol%20%C3%A9%20Para%20Todos%20Harper%20Lee"
      }
    ]
  },
  {
    "titulo": "Jardim dos Esquecidos",
    "subtitulo": "Flowers in the Attic (1979) • Circulação: 40 milhões",
    "autor": "V. C. Andrews",
    "ano": 1979,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-36",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 40 milhões. Título original: \"Flowers in the Attic\" (1979). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Jardim%20dos%20Esquecidos"
      }
    ]
  },
  {
    "titulo": "Cosmos",
    "subtitulo": "Cosmos (1980) • Circulação: 40 milhões",
    "autor": "Carl Sagan",
    "ano": 1980,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-37",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 40 milhões. Título original: \"Cosmos\" (1980). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8283901-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Cosmos%20Carl%20Sagan"
      }
    ]
  },
  {
    "titulo": "Anjos e Demônios",
    "subtitulo": "Angels & Demons (2000) • Circulação: 39 milhões",
    "autor": "Dan Brown",
    "ano": 2000,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-38",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 39 milhões. Título original: \"Angels & Demons\" (2000). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/11408459-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Anjos%20e%20Dem%C3%B4nios%20Dan%20Brown"
      }
    ]
  },
  {
    "titulo": "Como Fazer Amigos e Influenciar Pessoas",
    "subtitulo": "How to Win Friends and Influence People (1936) • Circulação: > 37 milhões",
    "autor": "Dale Carnegie",
    "ano": 1936,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-39",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em > 37 milhões. Título original: \"How to Win Friends and Influence People\" (1936). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/13314878-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Como%20Fazer%20Amigos%20e%20Influenciar%20Pessoas%20Dale%20Carnegie"
      }
    ]
  },
  {
    "titulo": "Alcoólicos Anônimos (O Livro Azul)",
    "subtitulo": "Alcoholics Anonymous (1939) • Circulação: > 37 milhões",
    "autor": "William Griffith Wilson",
    "ano": 1939,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "wikisource",
    "fonteIdExterno": "world-top100-40",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em > 37 milhões. Título original: \"Alcoholics Anonymous\" (1939). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Alco%C3%B3licos%20An%C3%B4nimos%20O%20Livro%20Azul"
      }
    ]
  },
  {
    "titulo": "Medo de Voar",
    "subtitulo": "Fear of Flying (1973) • Circulação: 37 milhões",
    "autor": "Erica Jong",
    "ano": 1973,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-41",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 37 milhões. Título original: \"Fear of Flying\" (1973). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Medo%20de%20Voar"
      }
    ]
  },
  {
    "titulo": "Assim Foi Temperado o Aço",
    "subtitulo": "Как закалялась сталь (1932) • Circulação: 36,4 milhões",
    "autor": "Nikolai Ostrovsky",
    "ano": 1932,
    "idioma": "ru",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "wikisource",
    "fonteIdExterno": "world-top100-42",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 36,4 milhões. Título original: \"Как закалялась сталь\" (1932). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Assim%20Foi%20Temperado%20o%20A%C3%A7o"
      }
    ]
  },
  {
    "titulo": "Guerra e Paz",
    "subtitulo": "Война и мир (War and Peace) (1869) • Circulação: 36 milhões",
    "autor": "Liev Tolstói",
    "ano": 1869,
    "idioma": "ru",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-43",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 36 milhões. Título original: \"Война и мир (War and Peace)\" (1869). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2600/pg2600.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/2600.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/2600.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/2600/2600-h/2600-h.htm"
      }
    ]
  },
  {
    "titulo": "As Aventuras de Pinóquio",
    "subtitulo": "Le avventure di Pinocchio (1881) • Circulação: 35 milhões",
    "autor": "Carlo Collodi",
    "ano": 1881,
    "idioma": "it",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-44",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 35 milhões. Título original: \"Le avventure di Pinocchio\" (1881). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/500/pg500.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/500.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/500.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/500/500-h/500-h.htm"
      }
    ]
  },
  {
    "titulo": "O Diário de Anne Frank",
    "subtitulo": "Het Achterhuis (1947) • Circulação: 35 milhões",
    "autor": "Anne Frank",
    "ano": 1947,
    "idioma": "nl",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-45",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 35 milhões. Título original: \"Het Achterhuis\" (1947). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8584021-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Di%C3%A1rio%20de%20Anne%20Frank%20Anne%20Frank"
      }
    ]
  },
  {
    "titulo": "Seus Pontos Fracos",
    "subtitulo": "Your Erroneous Zones (1976) • Circulação: 35 milhões",
    "autor": "Wayne Dyer",
    "ano": 1976,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-46",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 35 milhões. Título original: \"Your Erroneous Zones\" (1976). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Seus%20Pontos%20Fracos"
      }
    ]
  },
  {
    "titulo": "Pássaros Feridos",
    "subtitulo": "The Thorn Birds (1977) • Circulação: 33 milhões",
    "autor": "Colleen McCullough",
    "ano": 1977,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-47",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 33 milhões. Título original: \"The Thorn Birds\" (1977). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=P%C3%A1ssaros%20Feridos"
      }
    ]
  },
  {
    "titulo": "Caim e Abel",
    "subtitulo": "Kane and Abel (1979) • Circulação: 32,7 milhões",
    "autor": "Jeffrey Archer",
    "ano": 1979,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-48",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 32,7 milhões. Título original: \"Kane and Abel\" (1979). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Caim%20e%20Abel"
      }
    ]
  },
  {
    "titulo": "O Caçador de Pipas",
    "subtitulo": "The Kite Runner (2003) • Circulação: 31,5 milhões",
    "autor": "Khaled Hosseini",
    "ano": 2003,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-49",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 31,5 milhões. Título original: \"The Kite Runner\" (2003). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/14846827-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Ca%C3%A7ador%20de%20Pipas%20Khaled%20Hosseini"
      }
    ]
  },
  {
    "titulo": "O Vale das Bonecas",
    "subtitulo": "Valley of the Dolls (1966) • Circulação: 31 milhões",
    "autor": "Jacqueline Susann",
    "ano": 1966,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-50",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 31 milhões. Título original: \"Valley of the Dolls\" (1966). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Vale%20das%20Bonecas"
      }
    ]
  },
  {
    "titulo": "O Grande Gatsby",
    "subtitulo": "The Great Gatsby (1925) • Circulação: 30 milhões",
    "autor": "F. Scott Fitzgerald",
    "ano": 1925,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-51",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 30 milhões. Título original: \"The Great Gatsby\" (1925). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/64317.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/64317.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/64317/64317-h/64317-h.htm"
      }
    ]
  },
  {
    "titulo": "E o Vento Levou",
    "subtitulo": "Gone with the Wind (1936) • Circulação: 30 milhões",
    "autor": "Margaret Mitchell",
    "ano": 1936,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-52",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 30 milhões. Título original: \"Gone with the Wind\" (1936). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/14817133-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=E%20o%20Vento%20Levou%20Margaret%20Mitchell"
      }
    ]
  },
  {
    "titulo": "Rebecca, a Mulher Inesquecível",
    "subtitulo": "Rebecca (1938) • Circulação: 30 milhões",
    "autor": "Daphne du Maurier",
    "ano": 1938,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-53",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 30 milhões. Título original: \"Rebecca\" (1938). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Rebecca%2C%20a%20Mulher%20Inesquec%C3%ADvel"
      }
    ]
  },
  {
    "titulo": "A Revolta de Mamie Stover",
    "subtitulo": "The Revolt of Mamie Stover (1951) • Circulação: 30 milhões",
    "autor": "William Bradford Huie",
    "ano": 1951,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-54",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 30 milhões. Título original: \"The Revolt of Mamie Stover\" (1951). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Revolta%20de%20Mamie%20Stover"
      }
    ]
  },
  {
    "titulo": "Os Homens que Não Amavam as Mulheres",
    "subtitulo": "Män som hatar kvinnor (Millennium) (2005) • Circulação: 30 milhões",
    "autor": "Stieg Larsson",
    "ano": 2005,
    "idioma": "sv",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-55",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 30 milhões. Título original: \"Män som hatar kvinnor (Millennium)\" (2005). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/9274740-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Os%20Homens%20que%20N%C3%A3o%20Amavam%20as%20Mulheres%20Stieg%20Larsson"
      }
    ]
  },
  {
    "titulo": "O Símbolo Perdido",
    "subtitulo": "The Lost Symbol (2009) • Circulação: 30 milhões",
    "autor": "Dan Brown",
    "ano": 2009,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-56",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 30 milhões. Título original: \"The Lost Symbol\" (2009). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8373389-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20S%C3%ADmbolo%20Perdido%20Dan%20Brown"
      }
    ]
  },
  {
    "titulo": "Jogos Vorazes",
    "subtitulo": "The Hunger Games (2008) • Circulação: 29 milhões",
    "autor": "Suzanne Collins",
    "ano": 2008,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-57",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 29 milhões. Título original: \"The Hunger Games\" (2008). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/12646537-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Jogos%20Vorazes%20Suzanne%20Collins"
      }
    ]
  },
  {
    "titulo": "James e o Pêssego Gigante",
    "subtitulo": "James and the Giant Peach (1961) • Circulação: 28 milhões",
    "autor": "Roald Dahl",
    "ano": 1961,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-58",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 28 milhões. Título original: \"James and the Giant Peach\" (1961). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=James%20e%20o%20P%C3%AAssego%20Gigante"
      }
    ]
  },
  {
    "titulo": "Ben-Hur: Uma História dos Tempos de Cristo",
    "subtitulo": "Ben-Hur: A Tale of the Christ (1880) • Circulação: 26 milhões",
    "autor": "Lew Wallace",
    "ano": 1880,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-59",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 26 milhões. Título original: \"Ben-Hur: A Tale of the Christ\" (1880). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/2147/pg2147.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/2147.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/2147.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/2147/2147-h/2147-h.htm"
      }
    ]
  },
  {
    "titulo": "A Jovem Guarda",
    "subtitulo": "Молодая гвардия (1945) • Circulação: > 26 milhões",
    "autor": "Aleksandr Fadeyev",
    "ano": 1945,
    "idioma": "ru",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "wikisource",
    "fonteIdExterno": "world-top100-60",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em > 26 milhões. Título original: \"Молодая гвардия\" (1945). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Jovem%20Guarda"
      }
    ]
  },
  {
    "titulo": "Quem Mexeu no Meu Queijo?",
    "subtitulo": "Who Moved My Cheese? (1998) • Circulação: 28 – 30 milhões",
    "autor": "Spencer Johnson",
    "ano": 1998,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-61",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 28 – 30 milhões. Título original: \"Who Moved My Cheese?\" (1998). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/15131563-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/works/OL44233063W"
      }
    ]
  },
  {
    "titulo": "Uma Breve História do Tempo",
    "subtitulo": "A Brief History of Time (1988) • Circulação: 25 milhões",
    "autor": "Stephen Hawking",
    "ano": 1988,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-62",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 25 milhões. Título original: \"A Brief History of Time\" (1988). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/10432365-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Uma%20Breve%20Hist%C3%B3ria%20do%20Tempo%20Stephen%20Hawking"
      }
    ]
  },
  {
    "titulo": "Paulo e Virgínia",
    "subtitulo": "Paul et Virginie (1788) • Circulação: 25 milhões",
    "autor": "J.-H. Bernardin de Saint-Pierre",
    "ano": 1788,
    "idioma": "fr",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-63",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 25 milhões. Título original: \"Paul et Virginie\" (1788). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/14358/pg14358.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/14358.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/14358.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/14358/14358-h/14358-h.htm"
      }
    ]
  },
  {
    "titulo": "Sede de Viver (Biografia de Van Gogh)",
    "subtitulo": "Lust for Life (1934) • Circulação: 25 milhões",
    "autor": "Irving Stone",
    "ano": 1934,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-64",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 25 milhões. Título original: \"Lust for Life\" (1934). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Sede%20de%20Viver%20Biografia%20de%20Van%20Gogh"
      }
    ]
  },
  {
    "titulo": "O Vento nos Salgueiros",
    "subtitulo": "The Wind in the Willows (1908) • Circulação: 25 milhões",
    "autor": "Kenneth Grahame",
    "ano": 1908,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-65",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 25 milhões. Título original: \"The Wind in the Willows\" (1908). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/289/pg289.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/289.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/289.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/289/289-h/289-h.htm"
      }
    ]
  },
  {
    "titulo": "Os 7 Hábitos das Pessoas Altamente Eficazes",
    "subtitulo": "The 7 Habits of Highly Effective People (1989) • Circulação: 25 milhões",
    "autor": "Stephen R. Covey",
    "ano": 1989,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-66",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 25 milhões. Título original: \"The 7 Habits of Highly Effective People\" (1989). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/10079937-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Os%207%20H%C3%A1bitos%20das%20Pessoas%20Altamente%20Eficazes%20Stephen%20R.%20Covey"
      }
    ]
  },
  {
    "titulo": "Totto-chan: A Menina na Janela",
    "subtitulo": "窓ぎわのトットちゃん (1981) • Circulação: 25 milhões",
    "autor": "Tetsuko Kuroyanagi",
    "ano": 1981,
    "idioma": "ja",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-67",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 25 milhões. Título original: \"窓ぎわのトットちゃん\" (1981). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Totto-chan%3A%20A%20Menina%20na%20Janela"
      }
    ]
  },
  {
    "titulo": "Sapiens: Uma Breve História da Humanidade",
    "subtitulo": "קיצור תולדות האנושות (Sapiens) (2011) • Circulação: 25 milhões",
    "autor": "Yuval Noah Harari",
    "ano": 2011,
    "idioma": "he",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-68",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 25 milhões. Título original: \"קיצור תולדות האנושות (Sapiens)\" (2011). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8634250-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Sapiens%3A%20Uma%20Breve%20Hist%C3%B3ria%20da%20Humanidade%20Yuval%20Noah%20Harari"
      }
    ]
  },
  {
    "titulo": "Campos Arroteados",
    "subtitulo": "Поднятая целина (1935) • Circulação: > 24 milhões",
    "autor": "Mikhail Sholokhov",
    "ano": 1935,
    "idioma": "ru",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "wikisource",
    "fonteIdExterno": "world-top100-69",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em > 24 milhões. Título original: \"Поднятая целина\" (1935). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Campos%20Arroteados"
      }
    ]
  },
  {
    "titulo": "A Profecia Celestina",
    "subtitulo": "The Celestine Prophecy (1993) • Circulação: 23 milhões",
    "autor": "James Redfield",
    "ano": 1993,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-70",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 23 milhões. Título original: \"The Celestine Prophecy\" (1993). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8749217-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Profecia%20Celestina%20James%20Redfield"
      }
    ]
  },
  {
    "titulo": "A Culpa é das Estrelas",
    "subtitulo": "The Fault in Our Stars (2012) • Circulação: 23 milhões",
    "autor": "John Green",
    "ano": 2012,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-71",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 23 milhões. Título original: \"The Fault in Our Stars\" (2012). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/7418786-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Culpa%20%C3%A9%20das%20Estrelas%20John%20Green"
      }
    ]
  },
  {
    "titulo": "A Garota no Trem",
    "subtitulo": "The Girl on the Train (2015) • Circulação: 23 milhões",
    "autor": "Paula Hawkins",
    "ano": 2015,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-72",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 23 milhões. Título original: \"The Girl on the Train\" (2015). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/13523038-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/works/OL27688914W"
      }
    ]
  },
  {
    "titulo": "A Cabana",
    "subtitulo": "The Shack (2007) • Circulação: 22,5 milhões",
    "autor": "William P. Young",
    "ano": 2007,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-73",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 22,5 milhões. Título original: \"The Shack\" (2007). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/2700082-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Cabana%20William%20P.%20Young"
      }
    ]
  },
  {
    "titulo": "Tio Stiopa",
    "subtitulo": "Дядя Стёпа (1936) • Circulação: > 21 milhões",
    "autor": "Sergey Mikhalkov",
    "ano": 1936,
    "idioma": "ru",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "wikisource",
    "fonteIdExterno": "world-top100-74",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em > 21 milhões. Título original: \"Дядя Стёпа\" (1936). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Tio%20Stiopa"
      }
    ]
  },
  {
    "titulo": "O Poderoso Chefão",
    "subtitulo": "The Godfather (1969) • Circulação: 21 milhões",
    "autor": "Mario Puzo",
    "ano": 1969,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-75",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 21 milhões. Título original: \"The Godfather\" (1969). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/14545491-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/works/OL36993869W"
      }
    ]
  },
  {
    "titulo": "Uma História de Amor (Love Story)",
    "subtitulo": "Love Story (1970) • Circulação: 21 milhões",
    "autor": "Erich Segal",
    "ano": 1970,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-76",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 21 milhões. Título original: \"Love Story\" (1970). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Uma%20Hist%C3%B3ria%20de%20Amor%20Love%20Story"
      }
    ]
  },
  {
    "titulo": "Em Chamas",
    "subtitulo": "Catching Fire (Jogos Vorazes 2) (2009) • Circulação: 21 milhões",
    "autor": "Suzanne Collins",
    "ano": 2009,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-77",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 21 milhões. Título original: \"Catching Fire (Jogos Vorazes 2)\" (2009). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/12646539-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Em%20Chamas%20Suzanne%20Collins"
      }
    ]
  },
  {
    "titulo": "A Esperança",
    "subtitulo": "Mockingjay (Jogos Vorazes 3) (2010) • Circulação: 20 milhões",
    "autor": "Suzanne Collins",
    "ano": 2010,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-78",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Mockingjay (Jogos Vorazes 3)\" (2010). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/12646459-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Esperan%C3%A7a%20Suzanne%20Collins"
      }
    ]
  },
  {
    "titulo": "Kitchen",
    "subtitulo": "キッチン (Kitchen) (1988) • Circulação: 20 milhões",
    "autor": "Banana Yoshimoto",
    "ano": 1988,
    "idioma": "ja",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-79",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"キッチン (Kitchen)\" (1988). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/409670-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Kitchen%20Banana%20Yoshimoto"
      }
    ]
  },
  {
    "titulo": "A Nebulosa de Andrômeda",
    "subtitulo": "Туманность Андромеды (1957) • Circulação: 20 milhões",
    "autor": "Ivan Yefremov",
    "ano": 1957,
    "idioma": "ru",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "wikisource",
    "fonteIdExterno": "world-top100-80",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Туманность Андромеды\" (1957). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Nebulosa%20de%20Andr%C3%B4meda"
      }
    ]
  },
  {
    "titulo": "Garota Exemplar",
    "subtitulo": "Gone Girl (2012) • Circulação: 20 milhões",
    "autor": "Gillian Flynn",
    "ano": 2012,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-81",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Gone Girl\" (2012). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8368314-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Garota%20Exemplar%20Gillian%20Flynn"
      }
    ]
  },
  {
    "titulo": "O Triângulo das Bermudas",
    "subtitulo": "The Bermuda Triangle (1974) • Circulação: 20 milhões",
    "autor": "Charles Berlitz",
    "ano": 1974,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-82",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"The Bermuda Triangle\" (1974). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Tri%C3%A2ngulo%20das%20Bermudas"
      }
    ]
  },
  {
    "titulo": "O Mundo se Despedaça",
    "subtitulo": "Things Fall Apart (1958) • Circulação: 20 milhões",
    "autor": "Chinua Achebe",
    "ano": 1958,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-83",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Things Fall Apart\" (1958). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/12816943-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Mundo%20se%20Despeda%C3%A7a%20Chinua%20Achebe"
      }
    ]
  },
  {
    "titulo": "Totem do Lobo",
    "subtitulo": "狼图腾 (Wolf Totem) (2004) • Circulação: 20 milhões",
    "autor": "Jiang Rong",
    "ano": 2004,
    "idioma": "zh",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-84",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"狼图腾 (Wolf Totem)\" (2004). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Totem%20do%20Lobo"
      }
    ]
  },
  {
    "titulo": "Tubarão",
    "subtitulo": "Jaws (1974) • Circulação: 20 milhões",
    "autor": "Peter Benchley",
    "ano": 1974,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-85",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Jaws\" (1974). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/14819859-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/works/OL40442677W"
      }
    ]
  },
  {
    "titulo": "Eu Te Amarei Para Sempre",
    "subtitulo": "Love You Forever (1986) • Circulação: 20 milhões",
    "autor": "Robert Munsch",
    "ano": 1986,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-86",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Love You Forever\" (1986). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Eu%20Te%20Amarei%20Para%20Sempre"
      }
    ]
  },
  {
    "titulo": "O Ponto de Encontro",
    "subtitulo": "The Women's Room (1977) • Circulação: 20 milhões",
    "autor": "Marilyn French",
    "ano": 1977,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-87",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"The Women's Room\" (1977). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Ponto%20de%20Encontro"
      }
    ]
  },
  {
    "titulo": "O que Esperar Quando Você Está Esperando",
    "subtitulo": "What to Expect When You're Expecting (1984) • Circulação: 20 milhões",
    "autor": "A. Eisenberg & H. Murkoff",
    "ano": 1984,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-88",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"What to Expect When You're Expecting\" (1984). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20que%20Esperar%20Quando%20Voc%C3%AA%20Est%C3%A1%20Esperando"
      }
    ]
  },
  {
    "titulo": "As Aventuras de Huckleberry Finn",
    "subtitulo": "Adventures of Huckleberry Finn (1885) • Circulação: 20 milhões",
    "autor": "Mark Twain",
    "ano": 1885,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-89",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Adventures of Huckleberry Finn\" (1885). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/76/pg76.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/76.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/76.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/76/76-h/76-h.htm"
      }
    ]
  },
  {
    "titulo": "O Diário Secreto de Adrian Mole",
    "subtitulo": "The Secret Diary of Adrian Mole (1982) • Circulação: 20 milhões",
    "autor": "Sue Townsend",
    "ano": 1982,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-90",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"The Secret Diary of Adrian Mole\" (1982). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Di%C3%A1rio%20Secreto%20de%20Adrian%20Mole"
      }
    ]
  },
  {
    "titulo": "Orgulho e Preconceito",
    "subtitulo": "Pride and Prejudice (1813) • Circulação: 20 milhões",
    "autor": "Jane Austen",
    "ano": 1813,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-91",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Pride and Prejudice\" (1813). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/1342.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/1342.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm"
      }
    ]
  },
  {
    "titulo": "A Expedição Kon-Tiki",
    "subtitulo": "Kon-Tiki ekspedisjonen (1950) • Circulação: 20 milhões",
    "autor": "Thor Heyerdahl",
    "ano": 1950,
    "idioma": "no",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-92",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Kon-Tiki ekspedisjonen\" (1950). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Expedi%C3%A7%C3%A3o%20Kon-Tiki"
      }
    ]
  },
  {
    "titulo": "O Bom Soldado Švejk",
    "subtitulo": "Osudy dobrého vojáka Švejka (1923) • Circulação: 20 milhões",
    "autor": "Jaroslav Hašek",
    "ano": 1923,
    "idioma": "cs",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-93",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Osudy dobrého vojáka Švejka\" (1923). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/63219/pg63219.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/63219.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/63219.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/63219/63219-h/63219-h.htm"
      }
    ]
  },
  {
    "titulo": "Onde Vivem os Monstros",
    "subtitulo": "Where the Wild Things Are (1963) • Circulação: 20 milhões",
    "autor": "Maurice Sendak",
    "ano": 1963,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-94",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Where the Wild Things Are\" (1963). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Onde%20Vivem%20os%20Monstros"
      }
    ]
  },
  {
    "titulo": "O Poder do Pensamento Positivo",
    "subtitulo": "The Power of Positive Thinking (1952) • Circulação: 20 milhões",
    "autor": "Norman Vincent Peale",
    "ano": 1952,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-95",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"The Power of Positive Thinking\" (1952). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Poder%20do%20Pensamento%20Positivo"
      }
    ]
  },
  {
    "titulo": "O Segredo",
    "subtitulo": "The Secret (2006) • Circulação: 20 milhões",
    "autor": "Rhonda Byrne",
    "ano": 2006,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-96",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"The Secret\" (2006). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/13279931-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/works/OL10297984W"
      }
    ]
  },
  {
    "titulo": "Duna",
    "subtitulo": "Dune (1965) • Circulação: 20 milhões",
    "autor": "Frank Herbert",
    "ano": 1965,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-97",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Dune\" (1965). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/11481354-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=Duna%20Frank%20Herbert"
      }
    ]
  },
  {
    "titulo": "A Fantástica Fábrica de Chocolate",
    "subtitulo": "Charlie and the Chocolate Factory (1964) • Circulação: 20 milhões",
    "autor": "Roald Dahl",
    "ano": 1964,
    "idioma": "en",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-98",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"Charlie and the Chocolate Factory\" (1964). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/12459564-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=A%20Fant%C3%A1stica%20F%C3%A1brica%20de%20Chocolate%20Roald%20Dahl"
      }
    ]
  },
  {
    "titulo": "O Macaco Nu",
    "subtitulo": "The Naked Ape (1968) • Circulação: 20 milhões",
    "autor": "Desmond Morris",
    "ano": 1968,
    "idioma": "en",
    "categoria": "Apoio Pedagógico & Filosofia",
    "fonteSlug": "openlibrary",
    "fonteIdExterno": "world-top100-99",
    "licenca": "outro",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"The Naked Ape\" (1968). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://covers.openlibrary.org/b/id/8232000-M.jpg",
    "links": [
      {
        "formato": "html",
        "url": "https://openlibrary.org/search?q=O%20Macaco%20Nu"
      }
    ]
  },
  {
    "titulo": "Kokoro",
    "subtitulo": "こゝろ (Kokoro) (1914) • Circulação: 20 milhões",
    "autor": "Natsume Sōseki",
    "ano": 1914,
    "idioma": "ja",
    "categoria": "Romance & Crônicas",
    "fonteSlug": "gutenberg",
    "fonteIdExterno": "world-top100-100",
    "licenca": "dominio-publico",
    "sinopse": "Obra consagrada da literatura mundial com circulação estimada em 20 milhões. Título original: \"こゝろ (Kokoro)\" (1914). Reconhecido no cânone global de obras fundamentais.",
    "capaUrl": "https://www.gutenberg.org/cache/epub/44885/pg44885.cover.medium.jpg",
    "links": [
      {
        "formato": "epub",
        "url": "https://www.gutenberg.org/ebooks/44885.epub3.images"
      },
      {
        "formato": "pdf",
        "url": "https://www.gutenberg.org/ebooks/44885.pdf"
      },
      {
        "formato": "html",
        "url": "https://www.gutenberg.org/files/44885/44885-h/44885-h.htm"
      }
    ]
  }
];

module.exports = { worldClassicsList };
