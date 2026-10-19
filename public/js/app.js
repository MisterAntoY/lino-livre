// Lino Livre — Aplicação Web Digital

const app = {
  abaAtiva: 'livros',
  livros: [],
  cursos: [],
  roadmaps: [],
  dicas: [],
  categoriaAtiva: '',
  fonteLivroAtiva: '',
  formatoAtivo: '',
  filtroIdiomaLivro: '',
  areaCursoAtiva: '',
  fonteCursoAtiva: '',
  plataformaCursoAtiva: '',
  origemRoadmapAtiva: '',
  catDicaAtiva: '',
  termoBusca: '',
  termoBuscaCursos: '',
  termoBuscaRoadmaps: '',
  termoBuscaDicas: '',
  termoBuscaPodcasts: '',
  catPodcastAtiva: '',
  podcasts: [],
  episodiosRecentes: [],
  paginaAtual: 1,
  totalPaginas: 1,
  debounceTimer: null,
  debounceCursosTimer: null,
  debounceRoadmapsTimer: null,
  debounceDicasTimer: null,
  debouncePodcastsTimer: null,
  tamanhoFonte: 22,
  temaPapel: 'creme',
  brilho: 1,
  alinhamento: 'justify',
  modoMidia: 'texto',
  livroAtual: null,
  speechState: {
    sintese: null,
    paragrafos: [],
    indiceAtual: 0,
    reproduzindo: false,
    pausado: false,
    velocidade: 1.0,
    utterance: null
  },
  totalLivrosAcervo: 695,

  async init() {
    // 1. Internacionalização: carrega pt + idioma preferido e aplica ao DOM
    if (window.I18N) {
      await I18N.init();
      I18N.aoTrocar(() => this.aplicarIdioma());
    }

    this.carregarPreferenciasLeitor();
    this.iniciarSinteseVoz();
    this.verificarEconomiaDeDados();

    // Fechar modais ao pressionar tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.fecharModais();
    });

    // Fechar modais ao clicar no backdrop
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.fecharModais();
      });
    });

    await Promise.all([

      this.carregarLivros(),
      this.carregarPlacarMeta(),
      this.carregarCategoriasSelect(),
      this.verificarComunidadeECanal()
    ]);
  },

  // ==================== IDIOMA ====================
  async trocarIdioma(code) {
    if (!window.I18N || I18N.lang === code) return;
    await I18N.setLang(code);
  },

  // re-renderiza tudo o que depende de texto traduzido
  aplicarIdioma() {
    this.atualizarBadgeVoz();

    if (this.livros.length > 0) {
      this.renderizarLivros(this.livros);
      this.atualizarControlesPaginacao();
    }

    if (this.cursos.length > 0) this.renderizarCursos(this.cursos);
    if (this.roadmaps.length > 0) this.renderizarRoadmaps(this.roadmaps);
    if (this.dicas.length > 0) this.renderizarDicas(this.dicas);

    if (this.abaAtiva === 'dashboard') this.carregarDashboard();
    this.atualizarPlacarMeta(this.totalLivrosAcervo);

    this.carregarCategoriasSelect();

    // se o leitor estiver aberto, re-renderiza o cabeçalho dele
    if (this.livroAtual) {
      const l = this.livroAtual;
      document.getElementById('leitor-autor').textContent =
        `${l.autor_nome || t('books.defaultAuthor')} • ${traduzirLicenca(l.licenca)}`;
      this.renderizarConteudoLeitor(l);
      this.aplicarPreferenciasLeitor();
    }
  },

  // preenche o <select> de categorias a partir do banco (ids corretos + rótulos traduzidos)
  async carregarCategoriasSelect() {
    const sel = document.getElementById('novo-categoria-select');
    if (!sel) return;
    try {
      const res = await fetch('/api/categorias');
      const cats = await res.json();
      const ativo = sel.value;
      sel.innerHTML = (cats || []).map(c =>
        `<option value="${c.id}">${this.escape(traduzirCategoria(c.nome))}</option>`
      ).join('');
      if (ativo) sel.value = ativo;
    } catch (_) {
      if (!sel.options.length) sel.innerHTML = '<option value="">—</option>';
    }
  },

  trocarAba(nomeAba) {
    this.abaAtiva = nomeAba;
    
    // Atualizar botões das abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === `tab-btn-${nomeAba}`);
    });

    // Alternar visibilidade do conteúdo
    document.getElementById('aba-livros')?.classList.toggle('hidden', nomeAba !== 'livros');
    document.getElementById('aba-cursos')?.classList.toggle('hidden', nomeAba !== 'cursos');
    document.getElementById('aba-roadmaps')?.classList.toggle('hidden', nomeAba !== 'roadmaps');
    document.getElementById('aba-podcasts')?.classList.toggle('hidden', nomeAba !== 'podcasts');
    document.getElementById('aba-dicas')?.classList.toggle('hidden', nomeAba !== 'dicas');
    document.getElementById('aba-dashboard')?.classList.toggle('hidden', nomeAba !== 'dashboard');

    if (nomeAba === 'cursos' && this.cursos.length === 0) {
      this.carregarCursos();
    } else if (nomeAba === 'roadmaps' && this.roadmaps.length === 0) {
      this.carregarRoadmaps();
    } else if (nomeAba === 'podcasts' && this.podcasts.length === 0) {
      this.carregarPodcasts();
    } else if (nomeAba === 'dicas' && this.dicas.length === 0) {
      this.carregarDicas();
    } else if (nomeAba === 'dashboard') {
      this.carregarDashboard();
    }
  },

  buscarComDebounce() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.termoBusca = (document.getElementById('filtro-busca').value || '').trim();
      this.paginaAtual = 1;
      this.carregarLivros();
    }, 250);
  },

  filtrarPorCategoria(categoria) {
    this.categoriaAtiva = categoria;
    document.querySelectorAll('#pills-categorias .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-categoria') === categoria);
    });
    this.paginaAtual = 1;
    this.carregarLivros();
  },

  filtrarPorFormato(formato) {
    this.formatoAtivo = formato;
    document.querySelectorAll('#pills-formatos .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-formato') === formato);
    });
    this.paginaAtual = 1;
    this.carregarLivros();
  },

  filtrarPorFonteLivro(slug) {
    this.fonteLivroAtiva = slug;
    document.querySelectorAll('#pills-fontes .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-fonte') === slug);
    });
    this.paginaAtual = 1;
    this.carregarLivros();
  },

  filtrarPorIdiomaLivro(lang) {
    this.filtroIdiomaLivro = lang;
    document.querySelectorAll('#pills-idiomas-livros .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    this.paginaAtual = 1;
    this.carregarLivros();
  },

  async carregarLivros() {
    const grid = document.getElementById('grade-livros');
    grid.innerHTML = `<div class="loading">${t('books.searching')}</div>`;

    try {
      const params = new URLSearchParams();
      if (this.termoBusca) params.append('busca', this.termoBusca);
      if (this.categoriaAtiva) params.append('categoria_id', this.obterCategoriaId(this.categoriaAtiva));
      if (this.fonteLivroAtiva) params.append('fonte_slug', this.fonteLivroAtiva);
      if (this.formatoAtivo) params.append('formato', this.formatoAtivo);
      if (this.filtroIdiomaLivro) params.append('idioma', this.filtroIdiomaLivro);
      params.append('page', this.paginaAtual);
      params.append('limit', 12);

      const res = await fetch(`/api/livros?${params.toString()}`);
      const json = await res.json();
      
      const itens = json.data || [];
      this.livros = itens;
      this.paginaAtual = json.page || 1;
      this.totalPaginas = json.total_pages || 1;

      this.renderizarLivros(itens);
      this.atualizarControlesPaginacao();
    } catch (err) {
      grid.innerHTML = `<div class="loading" style="color:#b91c1c">${this.escape(t('books.error', { msg: err.message }))}</div>`;
    }
  },

  obterCategoriaId(nome) {
    // ids conforme a tabela `categorias` do banco
    const mapa = {
      'Clássicos Brasileiros': 1,
      'Romance & Crônicas': 2,
      'Teatro & Poesia': 3,
      'Romance Indianista': 4,
      'Apoio Pedagógico & Filosofia': 5,
      'Tecnologia & Guias Digitais': 6,
      'Arquitetura & Engenharia de Software': 7,
      'Desenvolvimento Web & Mobile': 8,
      'DevOps, Cloud & Infraestrutura': 9,
      'Ciência de Dados & Inteligência Artificial': 10,
      'Metodologias Ágeis & Carreira Tech': 11,
      '🌍 Literatura & Vozes de África': 12,
      '🌍 Contos & Tradição Oral Africana': 13,
      '🌍 História & Sociedade Africana': 14,
      '🌍 Filosofia & Pensamento Africano': 15
    };
    return mapa[nome] || nome || '';
  },

  renderizarLivros(lista) {
    const grid = document.getElementById('grade-livros');

    if (!lista || lista.length === 0) {
      grid.innerHTML = `<div class="loading">${t('books.empty')}</div>`;
      return;
    }

    grid.innerHTML = lista.map(l => {
      const capaUrl = l.capa_url || '/capas/dom_casmurro.jpg';
      const licencaFormatada = traduzirLicenca(l.licenca || 'dominio-publico');
      
      const links = l.links || [];
      const tagsFormatos = links.map(lnk => {
        let labelTamanho = '';
        if (lnk.tamanho_bytes > 0) {
          const mb = (lnk.tamanho_bytes / (1024 * 1024)).toFixed(1);
          labelTamanho = ` (~${mb} MB)`;
        }
        return `
          <a class="format-tag" href="/api/livros/${l.id}/ler/${lnk.id}" target="_blank" rel="noopener noreferrer" title="${this.escape(t('books.openFormat', { f: lnk.formato.toUpperCase() }))}${labelTamanho}">
             ${lnk.formato.toUpperCase()}${labelTamanho}
          </a>
        `;
      }).join('');

      const pdfLink = links.find(lnk => lnk.formato.toLowerCase() === 'pdf');
      const htmlLink = links.find(lnk => lnk.formato.toLowerCase() === 'html');
      const epubLink = links.find(lnk => lnk.formato.toLowerCase() === 'epub');
      const downloadLink = pdfLink || epubLink || links[0];
      const pdfTamanho = pdfLink && pdfLink.tamanho_bytes > 0
        ? ` (~${(pdfLink.tamanho_bytes / (1024 * 1024)).toFixed(1)} MB)`
        : '';

      const sinopse = I18N.sinopse(l.id, l.sinopse || t('books.synopsisFallback'));

      const eGuiaWeb = (l.categoria_id === 6 || (htmlLink && !pdfLink && !epubLink));
      const eLivroTecnicoPdf = (!eGuiaWeb && pdfLink && l.categoria_id > 5);

      let badgeHtml = '';
      let botoesAcaoHtml = '';

      if (eGuiaWeb && htmlLink) {
        badgeHtml = `
          <div class="data-badge-card" style="background:#e0f2fe; color:#0369a1; border-color:#bae6fd" title="Recurso Educacional Aberto / Roadmap Interativo">
             <span>Guia Interativo Web</span>
          </div>
        `;
        botoesAcaoHtml = `
          <a class="btn btn-primary" href="/api/livros/${l.id}/ler/${htmlLink.id}" target="_blank" rel="noopener noreferrer">
             Acessar Guia Online
          </a>
        `;
      } else if (eLivroTecnicoPdf) {
        badgeHtml = `
          <div class="data-badge-card" style="background:#f0fdf4; color:#15803d; border-color:#bbf7d0" title="Livro Técnico Completo Aberto">
             <span>Livro Digital Completo (PDF)</span>
          </div>
        `;
        botoesAcaoHtml = `
          <a class="btn btn-primary" href="/api/livros/${l.id}/ler/${pdfLink.id}" target="_blank" rel="noopener noreferrer">
             Ler Livro (PDF)
          </a>
          <a class="btn btn-secondary" href="/api/livros/${l.id}/ler/${pdfLink.id}" target="_blank" rel="noopener noreferrer">
            ⬇ Baixar${pdfTamanho}
          </a>
        `;
      } else {
        badgeHtml = `
          <div class="data-badge-card" title="${this.escape(t('books.ultralightTitle'))}">
            ${t('books.ultralight')}
          </div>
        `;
        botoesAcaoHtml = `
          <button class="btn btn-primary" onclick="app.abrirLeitorOuLink(${l.id})">
            ${t('books.readOnline')}
          </button>
          ${pdfLink ? `
            <a class="btn btn-secondary" href="/api/livros/${l.id}/ler/${pdfLink.id}" target="_blank" rel="noopener noreferrer" title="${this.escape(t('books.downloadFile'))}${pdfTamanho}">
               PDF Oficial${pdfTamanho}
            </a>
          ` : (downloadLink ? `
            <a class="btn btn-secondary" href="/api/livros/${l.id}/ler/${downloadLink.id}" target="_blank" rel="noopener noreferrer">
              ${t('books.download')}
            </a>
          ` : '')}
        `;
      }

      const langFlags = {
        pt: ' PT',
        en: ' EN',
        fr: ' FR',
        de: ' DE',
        zh: ' ZH'
      };
      const flagLabel = langFlags[l.idioma] || (l.idioma || 'PT').toUpperCase();
      const isAfrica = (l.categoria_nome && l.categoria_nome.includes('África'));

      return `
        <article class="book-card ${isAfrica ? 'book-card-africa' : ''}">
          <div class="book-cover-container">
            <img src="${capaUrl}" alt="${this.escape(t('books.coverOf', { t: l.titulo }))}" class="book-cover" loading="lazy" decoding="async" onerror="this.src='/capas/dom_casmurro.jpg'">
            <span class="badge-format">${flagLabel}</span>
          </div>

          <div class="book-details">
            <h3 class="book-title">${this.escape(l.titulo)}</h3>
            <p class="book-author">${this.escape(l.autor_nome || t('books.defaultAuthor'))} ${l.ano_publicacao ? `• ${l.ano_publicacao}` : ''}</p>
            <div>
              <span class="book-lang-badge lang-${l.idioma || 'pt'}">${flagLabel}</span>
              <span class="badge-license">${this.escape(licencaFormatada)}</span>
              ${isAfrica ? `<span class="africa-stats-badge" style="background:#fef3c7; color:#78350f; border-color:#f59e0b; font-size:0.7rem; padding:0.15rem 0.5rem; margin-left:0.25rem; font-weight:700;"> Coleção África</span>` : ''}
            </div>

            <p class="book-synopsis">${this.escape(sinopse)}</p>

            <div class="format-tags">
              ${tagsFormatos || `<span style="font-size:0.75rem; color:#94a3b8">${t('books.digitalText')}</span>`}
            </div>

            <div class="book-stats">
              <span>${l.leituras > 0 ? t('books.readings', { n: l.leituras }) : ' Leitura Aberta'}</span>
              <span> ${this.escape(traduzirCategoria(l.categoria_nome) || t('books.defaultCategory'))}</span>
            </div>

            ${badgeHtml}

            <div class="book-actions">
              ${botoesAcaoHtml}
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  async abrirLeitorOuLink(livroId) {
    try {
      const res = await fetch(`/api/livros/${livroId}`);
      if (!res.ok) throw new Error(t('books.errorDetails'));
      const livro = await res.json();

      // Se for recurso web com formato html sem capítulos literários, abrir direto
      const eGuiaWeb = (livro.categoria_id === 6 || (livro.links && livro.links[0]?.formato === 'html' && !livro.conteudo_texto?.includes('###')));
      if (eGuiaWeb && livro.links && livro.links.length > 0) {
        window.open(`/api/livros/${livro.id}/ler/${livro.links[0].id}`, '_blank');
        return;
      }

      if (livro.conteudo_texto && livro.conteudo_texto.trim().length > 0) {
        this.livroAtual = livro;
        this.pararAudio();

        document.getElementById('leitor-titulo').textContent = livro.titulo;
        document.getElementById('leitor-autor').textContent = `${livro.autor_nome || t('books.defaultAuthor')} • ${traduzirLicenca(livro.licenca)}`;

        // Botão para abrir edição completa (EPUB Gutenberg ou HTML Wikisource)
        const btnPdf = document.getElementById('btn-leitor-pdf');
        const epubLink = (livro.links || []).find(lnk => lnk.formato && lnk.formato.toLowerCase() === 'epub');
        const htmlLink = (livro.links || []).find(lnk => lnk.formato && lnk.formato.toLowerCase() === 'html' && !lnk.url.includes('wikipedia'));
        const pdfLink = (livro.links || []).find(lnk => lnk.formato && lnk.formato.toLowerCase() === 'pdf' && !lnk.url.includes('dominiopublico.gov.br'));
        const bestExternalLink = epubLink || htmlLink || pdfLink || (livro.links && livro.links[0]);

        if (btnPdf) {
          if (bestExternalLink) {
            btnPdf.href = `/api/livros/${livro.id}/ler/${bestExternalLink.id}`;
            if (bestExternalLink.formato.toLowerCase() === 'epub') {
              btnPdf.textContent = ' Baixar EPUB (Gutenberg)';
            } else if (bestExternalLink.formato.toLowerCase() === 'html') {
              btnPdf.textContent = ' Wikisource Oficial';
            } else {
              btnPdf.textContent = ' Baixar PDF';
            }
            btnPdf.classList.remove('hidden');
          } else {
            btnPdf.classList.add('hidden');
          }
        }

        // Extrair e configurar múltiplos capítulos
        this.capitulos = this.extrairCapitulos(livro.conteudo_texto, livro);
        this.configurarBarraCapitulos();
        this.carregarCapitulo(0);

        this.aplicarPreferenciasLeitor();
        this.ativarModoTexto();

        document.getElementById('modal-leitor').classList.remove('hidden');
      } else if (livro.links && livro.links.length > 0) {
        window.open(`/api/livros/${livro.id}/ler/${livro.links[0].id}`, '_blank');
      } else {
        this.mostrarToast(t('books.availableCatalog'));
      }
    } catch (err) {
      this.mostrarToast(t('books.errorOpen', { msg: err.message }));
    }
  },

  extrairCapitulos(textoBruto, livro) {
    if (!textoBruto) return [];

    // Divisão primária por delimitador markdown '### '
    const partes = textoBruto.split(/(?:^|\n)(?=###\s+)/).map(p => p.trim()).filter(p => p.length > 0);

    if (partes.length > 1) {
      return partes.map((parte, idx) => {
        const linhas = parte.split('\n');
        let titulo = linhas[0].replace(/^###\s*/, '').trim();
        const corpo = linhas.slice(1).join('\n').trim();
        const paragrafos = corpo.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
        return {
          id: idx,
          titulo: titulo || `Capítulo ${idx + 1}`,
          paragrafos: paragrafos.length > 0 ? paragrafos : [corpo]
        };
      });
    }

    // Divisão por CAPÍTULO / CANTO / PARTE em texto sem markdown
    const blocosRegex = textoBruto.split(/(?:^|\n\n)(?=(?:CAP[ÍI]TULO|CANTO|PARTE|DEDICAT[ÓO]RIA|AO\s+LEITOR)\b)/i).map(b => b.trim()).filter(b => b.length > 0);
    if (blocosRegex.length > 1) {
      return blocosRegex.map((bloco, idx) => {
        const linhas = bloco.split('\n');
        const titulo = linhas[0].trim();
        const corpo = linhas.slice(1).join('\n').trim();
        const paragrafos = corpo.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
        return {
          id: idx,
          titulo: titulo || `Capítulo ${idx + 1}`,
          paragrafos: paragrafos.length > 0 ? paragrafos : [corpo]
        };
      });
    }

    // Fallback: texto corrido como capítulo único
    const paragrafos = textoBruto.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
    return [{
      id: 0,
      titulo: 'Capítulo I',
      paragrafos
    }];
  },

  configurarBarraCapitulos() {
    const barra = document.getElementById('reader-chapter-bar');
    const select = document.getElementById('leitor-capitulos-select');
    if (!barra || !select) return;

    if (this.capitulos && this.capitulos.length > 1) {
      barra.classList.remove('hidden');
      select.innerHTML = this.capitulos.map((c, idx) => `
        <option value="${idx}">${this.escape(c.titulo)}</option>
      `).join('');
    } else {
      barra.classList.add('hidden');
    }
  },

  carregarCapitulo(indice) {
    if (!this.capitulos || this.capitulos.length === 0) return;
    this.capituloAtualIndex = Math.max(0, Math.min(this.capitulos.length - 1, indice));
    const cap = this.capitulos[this.capituloAtualIndex];

    const select = document.getElementById('leitor-capitulos-select');
    if (select) select.value = this.capituloAtualIndex;

    const btnAnt = document.getElementById('btn-cap-anterior');
    const btnProx = document.getElementById('btn-cap-proximo');
    if (btnAnt) btnAnt.disabled = (this.capituloAtualIndex === 0);
    if (btnProx) btnProx.disabled = (this.capituloAtualIndex === this.capitulos.length - 1);

    const proximoAction = document.getElementById('leitor-proximo-cap-container');
    if (proximoAction) {
      if (this.capituloAtualIndex < this.capitulos.length - 1) {
        proximoAction.classList.remove('hidden');
        const proxTitulo = this.capitulos[this.capituloAtualIndex + 1].titulo;
        const btnAvancar = document.getElementById('btn-avancar-proximo-cap');
        if (btnAvancar) {
          btnAvancar.textContent = `Avançar para: ${proxTitulo} `;
        }
      } else {
        proximoAction.classList.add('hidden');
      }
    }

    this.renderizarConteudoCapitulo(cap);

    const scrollEl = document.getElementById('reader-body-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;
  },

  renderizarConteudoCapitulo(cap) {
    const textoEl = document.getElementById('leitor-texto');
    if (!textoEl) return;

    let html = `
      <div class="reader-chapter-heading">
        <h2 class="reader-chapter-title">${this.escape(cap.titulo)}</h2>
        <p class="reader-work-title">${this.escape(this.livroAtual?.titulo || '')} — ${this.escape(this.livroAtual?.autor_nome || t('books.defaultAuthor'))}</p>
      </div>
    `;

    const paragrafosVoz = [];
    let narrativoCount = 0;

    for (let i = 0; i < cap.paragrafos.length; i++) {
      const bloco = cap.paragrafos[i];
      paragrafosVoz.push(bloco);
      const pIdx = paragrafosVoz.length - 1;

      if (narrativoCount === 0 && bloco.length > 2) {
        const primeiraLetra = bloco.charAt(0);
        const resto = bloco.slice(1);
        html += `
          <p class="reader-paragraph has-drop-cap" id="p-reader-${pIdx}" data-pindex="${pIdx}">
            <span class="drop-cap">${this.escape(primeiraLetra)}</span>${this.escape(resto)}
          </p>
        `;
        narrativoCount++;
      } else {
        html += `
          <p class="reader-paragraph" id="p-reader-${pIdx}" data-pindex="${pIdx}">
            ${this.escape(bloco)}
          </p>
        `;
      }
    }

    textoEl.innerHTML = html;
    this.speechState.paragrafos = paragrafosVoz;
    this.speechState.indiceAtual = 0;
  },

  proximoCapitulo() {
    if (this.capitulos && this.capituloAtualIndex < this.capitulos.length - 1) {
      this.pararAudio();
      this.carregarCapitulo(this.capituloAtualIndex + 1);
    } else {
      this.mostrarToast('Você concluiu todos os capítulos desta obra!');
    }
  },

  capituloAnterior() {
    if (this.capitulos && this.capituloAtualIndex > 0) {
      this.pararAudio();
      this.carregarCapitulo(this.capituloAtualIndex - 1);
    }
  },

  mudarCapituloPeloSelect(val) {
    this.pararAudio();
    this.carregarCapitulo(parseInt(val, 10) || 0);
  },

  fecharPainelSeAberto(event) {
    const painel = document.getElementById('painel-ajustes-leitura');
    if (painel && !painel.classList.contains('collapsed')) {
      if (!painel.contains(event.target) && !event.target.closest('#btn-toggle-painel')) {
        painel.classList.add('collapsed');
      }
    }
  },

  carregarPreferenciasLeitor() {
    this.temaPapel = localStorage.getItem('lino_tema_papel') || 'creme';
    this.tamanhoFonte = parseInt(localStorage.getItem('lino_tamanho_fonte'), 10) || 22;
    this.brilho = parseFloat(localStorage.getItem('lino_brilho')) || 1;
    this.alinhamento = localStorage.getItem('lino_alinhamento') || 'justify';
  },

  aplicarPreferenciasLeitor() {
    this.mudarTemaPapel(this.temaPapel, false);
    this.ajustarBrilho(this.brilho, false);
    this.alterarFonte(0, false);
    this.mudarAlinhamento(this.alinhamento, false);
    this.atualizarBadgeVoz();
  },

  mudarTemaPapel(tema, salvar = true) {
    this.temaPapel = tema;
    const container = document.getElementById('leitor-container');
    if (container) {
      container.classList.remove('theme-creme', 'theme-sepia', 'theme-noturno');
      container.classList.add(`theme-${tema}`);
    }
    document.querySelectorAll('.paper-swatch').forEach(btn => {
      btn.classList.toggle('active', btn.id === `swatch-${tema}`);
    });
    if (salvar) localStorage.setItem('lino_tema_papel', tema);
  },

  ajustarBrilho(val, salvar = true) {
    this.brilho = parseFloat(val) || 1;
    const bodyScroll = document.getElementById('reader-body-scroll');
    if (bodyScroll) {
      bodyScroll.style.filter = `brightness(${this.brilho})`;
    }
    const slider = document.getElementById('slider-brilho');
    if (slider) slider.value = this.brilho;
    if (salvar) localStorage.setItem('lino_brilho', this.brilho);
  },

  alterarFonte(delta, salvar = true) {
    this.tamanhoFonte = Math.min(32, Math.max(14, this.tamanhoFonte + delta));
    const textoEl = document.getElementById('leitor-texto');
    if (textoEl) textoEl.style.fontSize = `${this.tamanhoFonte}px`;
    const indicador = document.getElementById('valor-fonte-indicador');
    if (indicador) indicador.textContent = this.tamanhoFonte;
    if (salvar) localStorage.setItem('lino_tamanho_fonte', this.tamanhoFonte);
  },

  mudarAlinhamento(align, salvar = true) {
    this.alinhamento = align;
    const textoEl = document.getElementById('leitor-texto');
    if (textoEl) textoEl.style.textAlign = align;
    document.querySelectorAll('.btn-align').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-align') === align);
    });
    if (salvar) localStorage.setItem('lino_alinhamento', align);
  },

  togglePainelAjustes() {
    const painel = document.getElementById('painel-ajustes-leitura');
    if (painel) painel.classList.toggle('collapsed');
  },

  iniciarSinteseVoz() {
    if ('speechSynthesis' in window) {
      this.speechState.sintese = window.speechSynthesis;
      window.speechSynthesis.onvoiceschanged = () => {
        this.atualizarBadgeVoz();
      };
    }
  },

  obterVozParaIdioma(idioma = 'pt') {
    if (!('speechSynthesis' in window)) return null;
    const vozes = window.speechSynthesis.getVoices();
    if (!vozes || vozes.length === 0) return null;

    const langCode = (idioma || 'pt').toLowerCase().slice(0, 2);

    const prefixos = {
      pt: ['pt-br', 'pt_br', 'pt-pt', 'pt'],
      en: ['en-us', 'en_us', 'en-gb', 'en'],
      es: ['es-es', 'es_es', 'es-419', 'es-mx', 'es'],
      fr: ['fr-fr', 'fr_fr', 'fr-ca', 'fr'],
      de: ['de-de', 'de_de', 'de-at', 'de'],
      zh: ['zh-cn', 'zh_cn', 'zh-tw', 'zh']
    };

    const targets = prefixos[langCode] || [langCode];
    for (const pref of targets) {
      const encontrada = vozes.find(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(pref));
      if (encontrada) return encontrada;
    }
    return vozes[0] || null;
  },

  obterVozPortugues() {
    return this.obterVozParaIdioma(this.livroAtual?.idioma || 'pt');
  },

  atualizarBadgeVoz() {
    const badge = document.getElementById('audio-voz-badge');
    const idiomaLivro = this.livroAtual?.idioma || 'pt';
    const voz = this.obterVozParaIdioma(idiomaLivro);
    if (badge) {
      if (voz) {
        badge.textContent = voz.name ? `${voz.lang} (${voz.name.split(' ')[0]})` : (voz.lang || idiomaLivro);
        badge.title = `Voz Nativa: ${voz.name} (${voz.lang})`;
      } else {
        badge.textContent = idiomaLivro.toUpperCase();
      }
    }
  },

  ativarModoAudio() {
    this.modoMidia = 'audio';
    const btnAudio = document.getElementById('toggle-audio-btn');
    const btnTexto = document.getElementById('toggle-texto-btn');
    if (btnAudio) btnAudio.classList.add('active');
    if (btnTexto) btnTexto.classList.remove('active');

    const audioBar = document.getElementById('player-audio-bar');
    if (audioBar) audioBar.classList.remove('hidden');

    if (!this.speechState.reproduzindo && !this.speechState.pausado) {
      this.tocarParagrafo(this.speechState.indiceAtual || 0);
    }
  },

  ativarModoTexto() {
    this.modoMidia = 'texto';
    const btnTexto = document.getElementById('toggle-texto-btn');
    const btnAudio = document.getElementById('toggle-audio-btn');
    if (btnTexto) btnTexto.classList.add('active');
    if (btnAudio) btnAudio.classList.remove('active');

    const audioBar = document.getElementById('player-audio-bar');
    if (audioBar) audioBar.classList.add('hidden');

    if (this.speechState.reproduzindo) {
      this.pausarAudio();
    }
  },

  alternarPlayAudio() {
    if (!('speechSynthesis' in window)) {
      this.mostrarToast(t('reader.noSpeech'));
      return;
    }

    if (this.speechState.reproduzindo && !this.speechState.pausado) {
      this.pausarAudio();
    } else if (this.speechState.pausado) {
      this.retomarAudio();
    } else {
      this.tocarParagrafo(this.speechState.indiceAtual || 0);
    }
  },

  tocarParagrafo(indice) {
    if (!('speechSynthesis' in window)) return;

    if (indice >= this.speechState.paragrafos.length) {
      this.pararAudio();
      if (this.capitulos && this.capituloAtualIndex < this.capitulos.length - 1) {
        this.mostrarToast('Fim do capítulo. Avançando para o próximo capítulo...');
        setTimeout(() => {
          this.proximoCapitulo();
          if (this.modoMidia === 'audio') {
            this.tocarParagrafo(0);
          }
        }, 1200);
      } else {
        this.mostrarToast(t('reader.done'));
      }
      return;
    }

    this.speechState.indiceAtual = indice;
    this.speechState.reproduzindo = true;
    this.speechState.pausado = false;

    document.querySelectorAll('.reader-paragraph').forEach((p, idx) => {
      const eAtivo = (idx === indice);
      p.classList.toggle('speaking-highlight', eAtivo);
      if (eAtivo) {
        p.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    const audioBar = document.getElementById('player-audio-bar');
    if (audioBar) audioBar.classList.add('speaking');

    const btnPlay = document.getElementById('btn-audio-play');
    if (btnPlay) btnPlay.innerHTML = `<span id="audio-play-label">${t('reader.pause')}</span>`;

    const statusEl = document.getElementById('audio-status-texto');
    if (statusEl) {
      statusEl.textContent = t('reader.readingParagraph', { a: indice + 1, b: this.speechState.paragrafos.length });
    }

    window.speechSynthesis.cancel();

    const texto = this.speechState.paragrafos[indice];
    const utterance = new SpeechSynthesisUtterance(texto);
    const idiomaLivro = this.livroAtual?.idioma || 'pt';
    const voz = this.obterVozParaIdioma(idiomaLivro);
    if (voz) {
      utterance.voice = voz;
      utterance.lang = voz.lang;
    } else {
      const defaults = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN' };
      utterance.lang = defaults[idiomaLivro] || 'pt-BR';
    }
    utterance.rate = this.speechState.velocidade;

    utterance.onend = () => {
      if (this.speechState.reproduzindo && !this.speechState.pausado) {
        this.tocarParagrafo(indice + 1);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Erro ao sintetizar voz:', e);
      if (this.speechState.reproduzindo && !this.speechState.pausado) {
        this.tocarParagrafo(indice + 1);
      }
    };

    this.speechState.utterance = utterance;
    window.speechSynthesis.speak(utterance);
  },

  pausarAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.speechState.pausado = true;
    const audioBar = document.getElementById('player-audio-bar');
    if (audioBar) audioBar.classList.remove('speaking');
    const btnPlay = document.getElementById('btn-audio-play');
    if (btnPlay) btnPlay.innerHTML = `<span id="audio-play-label">${t('reader.resume')}</span>`;
    const statusEl = document.getElementById('audio-status-texto');
    if (statusEl) statusEl.textContent = t('reader.audioPaused');
  },

  retomarAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.speechState.pausado = false;
    const audioBar = document.getElementById('player-audio-bar');
    if (audioBar) audioBar.classList.add('speaking');
    const btnPlay = document.getElementById('btn-audio-play');
    if (btnPlay) btnPlay.innerHTML = `<span id="audio-play-label">${t('reader.pause')}</span>`;
    const statusEl = document.getElementById('audio-status-texto');
    if (statusEl) {
      statusEl.textContent = t('reader.readingParagraph', {
        a: this.speechState.indiceAtual + 1,
        b: this.speechState.paragrafos.length
      });
    }
  },

  pararAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.speechState.reproduzindo = false;
    this.speechState.pausado = false;
    this.speechState.indiceAtual = 0;

    document.querySelectorAll('.reader-paragraph').forEach(p => p.classList.remove('speaking-highlight'));
    const audioBar = document.getElementById('player-audio-bar');
    if (audioBar) audioBar.classList.remove('speaking');
    const btnPlay = document.getElementById('btn-audio-play');
    if (btnPlay) btnPlay.innerHTML = `<span id="audio-play-label">${t('reader.listen')}</span>`;
    const statusEl = document.getElementById('audio-status-texto');
    if (statusEl) statusEl.textContent = t('reader.audioReady');
  },

  alterarVelocidadeAudio(vel, btnEl) {
    this.speechState.velocidade = parseFloat(vel) || 1.0;
    document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    if (this.speechState.reproduzindo && !this.speechState.pausado) {
      this.tocarParagrafo(this.speechState.indiceAtual);
    }
  },

  verificarEconomiaDeDados() {
    const conexao = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conexao && (conexao.saveData || /2g|3g/.test(conexao.effectiveType))) {
      this.mostrarToast(t('general.connection'));
    }
  },

  atualizarControlesPaginacao() {
    const pagEl = document.getElementById('paginacao');
    const textoEl = document.getElementById('texto-paginacao');
    const btnAnt = document.getElementById('btn-pag-ant');
    const btnProx = document.getElementById('btn-pag-prox');

    if (this.totalPaginas > 1) {
      pagEl.classList.remove('hidden');
      textoEl.textContent = t('books.pageOf', { p: this.paginaAtual, t: this.totalPaginas });
      btnAnt.disabled = this.paginaAtual <= 1;
      btnProx.disabled = this.paginaAtual >= this.totalPaginas;
    } else {
      pagEl.classList.add('hidden');
    }
  },

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.carregarLivros();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.carregarLivros();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  // ==================== CURSOS GRATUITOS ====================
  buscarCursosComDebounce() {
    clearTimeout(this.debounceCursosTimer);
    this.debounceCursosTimer = setTimeout(() => {
      this.termoBuscaCursos = (document.getElementById('filtro-busca-cursos')?.value || '').trim();
      this.carregarCursos();
    }, 250);
  },

  filtrarCursosPorArea(area) {
    this.areaCursoAtiva = area;
    this.fonteCursoAtiva = '';
    this.plataformaCursoAtiva = '';
    this.youtubeCursoAtivo = false;
    document.querySelectorAll('#pills-cursos-areas .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filtro') === area);
    });
    this.carregarCursos();
  },

  filtrarCursosPorFonte(fonte) {
    this.fonteCursoAtiva = fonte;
    this.areaCursoAtiva = '';
    this.plataformaCursoAtiva = '';
    this.youtubeCursoAtivo = false;
    const filtroAlvo = (fonte || '').toLowerCase().includes('trilha') ? 'trilhainfo' : 'guiadeti';
    document.querySelectorAll('#pills-cursos-areas .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filtro') === filtroAlvo);
    });
    this.carregarCursos();
  },

  filtrarCursosYouTube() {
    this.youtubeCursoAtivo = true;
    this.areaCursoAtiva = '';
    this.fonteCursoAtiva = '';
    this.plataformaCursoAtiva = '';
    document.querySelectorAll('#pills-cursos-areas .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filtro') === 'youtube');
    });
    this.carregarCursos();
  },

  filtrarCursosPorPlataforma(plataforma) {
    this.plataformaCursoAtiva = plataforma;
    this.areaCursoAtiva = '';
    this.fonteCursoAtiva = '';
    this.youtubeCursoAtivo = false;
    document.querySelectorAll('#pills-cursos-areas .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filtro') === plataforma);
    });
    this.carregarCursos();
  },

  async carregarCursos() {
    const grid = document.getElementById('grade-cursos');
    grid.innerHTML = `<div class="loading">${t('courses.loadingRoadmaps')}</div>`;

    try {
      const params = new URLSearchParams();
      params.append('excluir_roadmaps', 'true');
      if (this.youtubeCursoAtivo) params.append('youtube', 'true');
      if (this.areaCursoAtiva) params.append('area', this.areaCursoAtiva);
      if (this.fonteCursoAtiva) params.append('fonte', this.fonteCursoAtiva);
      if (this.plataformaCursoAtiva) params.append('plataforma', this.plataformaCursoAtiva);
      if (this.termoBuscaCursos) params.append('busca', this.termoBuscaCursos);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/cursos${qs}`);
      const cursos = await res.json();
      this.cursos = cursos;

      this.renderizarCursos(cursos);
    } catch (err) {
      grid.innerHTML = `<div class="loading" style="color:#b91c1c">${this.escape(t('courses.error', { msg: err.message }))}</div>`;
    }
  },

  renderizarCursos(lista) {
    const grid = document.getElementById('grade-cursos');

    if (!lista || lista.length === 0) {
      grid.innerHTML = `<div class="loading">${t('courses.empty')}</div>`;
      return;
    }

    grid.innerHTML = lista.map(c => {
      const isSantander = (c.plataforma || '').includes('Santander') || (c.titulo || '').includes('Santander');
      const isDio = (c.plataforma || '').includes('DIO') || (c.titulo || '').includes('DIO');
      const isCursoEmVideo = (c.plataforma || '').includes('Curso em Vídeo') || (c.titulo || '').includes('Curso em Vídeo');
      const isDsa = (c.plataforma || '').includes('Data Science Academy') || (c.plataforma || '').includes('DSA') || (c.titulo || '').includes('Data Science Academy');
      const isYouTube = !isCursoEmVideo && ((c.plataforma || '').includes('YouTube') || (c.descricao || '').toLowerCase().includes('youtube'));
      const isGuiaDeTI = (c.plataforma || '').includes('Guia de TI');
      const isBradesco = (c.plataforma || '').includes('Fundação Bradesco');
      const isUsp = (c.plataforma || '').includes('USP');
      const isAlura = (c.plataforma || '').includes('Alura');
      const isEvg = (c.plataforma || '').includes('EV.G') || (c.plataforma || '').includes('ENAP');
      const isIfrs = (c.plataforma || '').includes('IFRS') || (c.plataforma || '').includes('Instituto Federal');
      let btnTexto = t('courses.btnFree');
      let extraBadge = '';
      let deadlineBadge = '';

      const desc = c.descricao || '';
      if (desc.includes('[INSCRIÇÕES ABERTAS')) {
        const m = desc.match(/Finaliza em ([^\]]+)/);
        const prazo = m ? m[1] : '';
        deadlineBadge = `<span class="badge-guiadeti-pill" style="background:#dcfce7; color:#15803d; border-color:#86efac; font-weight:600;" title="Inscrições abertas"> Inscrições Abertas${prazo ? ' (' + prazo + ')' : ''}</span>`;
      } else if (desc.includes('[Finalizado em')) {
        deadlineBadge = `<span class="badge-guiadeti-pill" title="Edição anterior disponível para estudo">Concluído (Histórico)</span>`;
      } else if (desc.includes('[CURSO CONTÍNUO')) {
        deadlineBadge = `<span class="badge-guiadeti-pill" style="background:#e0f2fe; color:#0369a1; border-color:#7dd3fc;"> Sempre Aberto</span>`;
      }

      const isFiap = (c.plataforma || '').includes('FIAP');
      const isEuCapacito = (c.plataforma || '').includes('Eu Capacito');
      const isIbm = (c.plataforma || '').includes('IBM');
      const isCisco = (c.plataforma || '').includes('Cisco');
      const isEscolaTrab = (c.plataforma || '').includes('Escola do Trabalhador');
      const isAws = (c.plataforma || '').includes('AWS');
      const isMsLearn = (c.plataforma || '').includes('Microsoft Learn');
      const isFcc = (c.plataforma || '').includes('freeCodeCamp');
      const isKultivi = (c.plataforma || '').includes('Kultivi');
      const isSenai = (c.plataforma || '').includes('SENAI');
      const isOracleOne = (c.plataforma || '').includes('Oracle');
      const isGeneration = (c.plataforma || '').includes('Generation');
      const isWmc = (c.plataforma || '').includes('WoMakersCode');
      const isCursa = (c.plataforma || '').includes('Cursa');
      const isHarvard = (c.plataforma || '').includes('Harvard');
      const isMit = (c.plataforma || '').includes('MIT');
      const isStanford = (c.plataforma || '').includes('Stanford');
      const isLumina = (c.plataforma || '').includes('Lumina') || (c.url || '').includes('lumina.ufrgs.br');
      const isGoogleAtelie = (c.plataforma || '').includes('Google Ateliê') || (c.url || '').includes('learndigital.withgoogle.com') || (c.url || '').includes('skillshop.exceedlms.com');
      const isOpenBootcamp = (c.plataforma || '').includes('OpenBootcamp') || (c.plataforma || '').includes('Kogno') || (c.url || '').includes('open-bootcamp.com');

      if (isSantander) {
        btnTexto = ' Acessar Santander';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fee2e2; color:#b91c1c; border-color:#fca5a5; font-weight:600;"> Santander Academy</span>`;
      } else if (isDio) {
        btnTexto = ' Inscrever-se na DIO';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fce7f3; color:#9d174d; border-color:#fbcfe8; font-weight:600;"> Bootcamp DIO</span>`;
      } else if (isCursoEmVideo) {
        btnTexto = ' Assistir no YouTube';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#ffedd5; color:#c2410c; border-color:#fdba74; font-weight:600;"> Curso em Vídeo</span>`;
      } else if (isDsa) {
        btnTexto = '🔬 Acessar DSA';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#e0f2fe; color:#0284c7; border-color:#7dd3fc; font-weight:600;">🔬 Data Science Academy</span>`;
      } else if (isCursa) {
        btnTexto = '🎓 Estudar no Cursa';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#e0e7ff; color:#3730a3; border-color:#c7d2fe; font-weight:600;">🎓 Cursa • Certificado Grátis</span>`;
      } else if (isHarvard) {
        btnTexto = '🏛️ Acessar Harvard PLL';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fee2e2; color:#991b1b; border-color:#fca5a5; font-weight:600;">🏛️ Harvard Online</span>`;
      } else if (isMit) {
        btnTexto = '🏛️ Acessar MIT OCW';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#f1f5f9; color:#0f172a; border-color:#cbd5e1; font-weight:600;">🏛️ MIT OpenCourseWare</span>`;
      } else if (isStanford) {
        btnTexto = '🌲 Acessar Stanford';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fef2f2; color:#831843; border-color:#fbcfe8; font-weight:600;">🌲 Stanford Online</span>`;
      } else if (isFiap) {
        btnTexto = ' Acessar FIAP';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#ffe4e6; color:#e11d48; border-color:#fecdd3; font-weight:600;"> FIAP ON</span>`;
      } else if (isEuCapacito) {
        btnTexto = ' Acessar Eu Capacito';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#f3e8ff; color:#7e22ce; border-color:#e9d5ff; font-weight:600;"> Eu Capacito</span>`;
      } else if (isIbm) {
        btnTexto = ' Acessar IBM';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; font-weight:600;"> IBM SkillsBuild</span>`;
      } else if (isCisco) {
        btnTexto = ' Acessar Cisco';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#e0f2fe; color:#0369a1; border-color:#bae6fd; font-weight:600;"> Cisco NetAcad</span>`;
      } else if (isEscolaTrab) {
        btnTexto = ' Acessar MTE / Microsoft';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#ecfdf5; color:#047857; border-color:#a7f3d0; font-weight:600;"> Escola do Trabalhador 4.0</span>`;
      } else if (isAws) {
        btnTexto = ' Acessar AWS';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fffbeb; color:#b45309; border-color:#fde68a; font-weight:600;"> AWS Skill Builder</span>`;
      } else if (isMsLearn) {
        btnTexto = ' Acessar Microsoft';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#f0f9ff; color:#0284c7; border-color:#bae6fd; font-weight:600;"> Microsoft Learn</span>`;
      } else if (isFcc) {
        btnTexto = ' Estudar no freeCodeCamp';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#f1f5f9; color:#0f172a; border-color:#cbd5e1; font-weight:600;"> freeCodeCamp</span>`;
      } else if (isKultivi) {
        btnTexto = ' Acessar Kultivi';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#ecfeff; color:#0e7490; border-color:#a5f3fc; font-weight:600;"> Kultivi</span>`;
      } else if (isSenai) {
        btnTexto = ' Acessar SENAI';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fef2f2; color:#b91c1c; border-color:#fecaca; font-weight:600;"> SENAI Play</span>`;
      } else if (isOracleOne) {
        btnTexto = ' Acessar Oracle ONE';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fff1f2; color:#be123c; border-color:#fecdd3; font-weight:600;"> Oracle ONE</span>`;
      } else if (isGeneration) {
        btnTexto = ' Acessar Generation';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#f0fdf4; color:#15803d; border-color:#bbf7d0; font-weight:600;"> Generation Brasil</span>`;
      } else if (isWmc) {
        btnTexto = ' Acessar WoMakersCode';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fdf4ff; color:#a21caf; border-color:#f5d0fe; font-weight:600;"> WoMakersCode</span>`;
      } else if (isYouTube) {
        btnTexto = t('courses.btnYoutube');
        extraBadge = `<span class="badge-youtube-cert">${t('courses.badgeYoutube')}</span>`;
      } else if (isGuiaDeTI) {
        btnTexto = t('courses.btnGuiadeti');
        extraBadge = `<span class="badge-guiadeti-pill">${t('courses.badgeGuiadeti')}</span>`;
      } else if (isBradesco) {
        btnTexto = '🎓 Estudar na Fundação Bradesco';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fee2e2; color:#b91c1c; border-color:#fca5a5; font-weight:600;">🏛️ Fundação Bradesco • Certificado Grátis</span>`;
      } else if (isEvg) {
        btnTexto = '📜 Acessar Curso na EV.G';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#dcfce7; color:#166534; border-color:#86efac; font-weight:600;">🏛️ EV.G / ENAP • Certificado Oficial</span>`;
      } else if (isLumina) {
        btnTexto = '📜 Estudar na Lumina UFRGS';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#e0f2fe; color:#0369a1; border-color:#7dd3fc; font-weight:600;">🎓 Lumina (UFRGS) • Extensão</span>`;
      } else if (isIfrs) {
        btnTexto = '📜 Estudar no IFRS';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#ecfdf5; color:#047857; border-color:#a7f3d0; font-weight:600;">🏛️ IFRS • Certificado Digital Grátis</span>`;
      } else if (isGoogleAtelie) {
        btnTexto = '🎓 Estudar no Google';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fef3c7; color:#b45309; border-color:#fde68a; font-weight:600;">🌐 Google Ateliê • Certificado Oficial</span>`;
      } else if (isOpenBootcamp) {
        btnTexto = '🚀 Acessar OpenBootcamp';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#f5f3ff; color:#6d28d9; border-color:#ddd6fe; font-weight:600;">💻 OpenBootcamp • 100% Gratuito</span>`;
      } else if (isUsp) {
        btnTexto = ' Aulas USP';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#fef3c7; color:#92400e; border-color:#fde68a;"> Cursos USP</span>`;
      } else if (isAlura) {
        btnTexto = ' Aulas Alura';
        extraBadge = `<span class="badge-guiadeti-pill" style="background:#dbeafe; color:#1e40af; border-color:#bfdbfe;"> Alura Aberta</span>`;
      }

      const cardClass = isSantander
        ? 'card-featured-santander'
        : (isDio
          ? 'card-featured-dio'
          : (isCursoEmVideo
            ? 'card-featured-cursoemvideo'
            : (isDsa
              ? 'card-featured-dsa'
              : (isCursa
                ? 'card-featured-cursa'
                : (isHarvard
                  ? 'card-featured-harvard'
                  : (isEvg
                    ? 'card-featured-evg'
                    : (isLumina
                      ? 'card-featured-lumina'
                      : (isIfrs
                        ? 'card-featured-ifrs'
                        : (isGoogleAtelie
                          ? 'card-featured-google'
                          : (isOpenBootcamp
                            ? 'card-featured-openbootcamp'
                            : (isBradesco
                              ? 'card-featured-bradesco'
                              : (isFiap
                                ? 'card-featured-fiap'
                                : (isIbm
                                  ? 'card-featured-ibm'
                                  : (isCisco
                                    ? 'card-featured-cisco'
                                    : (isWmc
                                      ? 'card-featured-wmc'
                                      : (isYouTube
                                        ? 'card-featured-youtube'
                                        : (isGuiaDeTI
                                          ? 'card-featured-guiadeti'
                                          : (isUsp || isAlura ? 'card-featured-guiadeti' : '')))))))))))))))));

      const isBtnPrimary = isSantander || isDio || isCursoEmVideo || isDsa || isCursa || isHarvard || isMit || isStanford || isEvg || isLumina || isIfrs || isGoogleAtelie || isOpenBootcamp || isFiap || isEuCapacito || isIbm || isCisco || isEscolaTrab || isAws || isMsLearn || isFcc || isKultivi || isSenai || isOracleOne || isGeneration || isWmc || isYouTube || isGuiaDeTI || isUsp || isAlura || isBradesco;


      let logoHtml = '';
      if (isDio) {
        logoHtml = `<img src="/img/logos/dio.png" alt="DIO" class="course-platform-logo">`;
      } else if (isSantander) {
        logoHtml = `<img src="/img/logos/santander.png" alt="Santander" class="course-platform-logo">`;
      } else if (isCursoEmVideo) {
        logoHtml = `<img src="/img/logos/cursoemvideo.jpg" alt="Curso em Vídeo" class="course-platform-logo logo-round">`;
      } else if (isDsa) {
        logoHtml = `<img src="/img/logos/dsa.png" alt="Data Science Academy" class="course-platform-logo">`;
      } else if (isFiap) {
        logoHtml = `<img src="/img/logos/fiap.png" alt="FIAP" class="course-platform-logo">`;
      } else if (isEuCapacito) {
        logoHtml = `<img src="/img/logos/eucapacito.svg" alt="Eu Capacito" class="course-platform-logo">`;
      } else if (isIbm) {
        logoHtml = `<img src="/img/logos/ibm.svg" alt="IBM SkillsBuild" class="course-platform-logo">`;
      } else if (isCisco) {
        logoHtml = `<img src="/img/logos/cisco.svg" alt="Cisco NetAcad" class="course-platform-logo">`;
      } else if (isEscolaTrab) {
        logoHtml = `<img src="/img/logos/escoladotrabalhador.png" alt="Escola do Trabalhador 4.0" class="course-platform-logo">`;
      } else if (isAws) {
        logoHtml = `<img src="/img/logos/aws.svg" alt="AWS" class="course-platform-logo">`;
      } else if (isMsLearn) {
        logoHtml = `<img src="/img/logos/microsoft.svg" alt="Microsoft Learn" class="course-platform-logo">`;
      } else if (isFcc) {
        logoHtml = `<img src="/img/logos/freecodecamp.png" alt="freeCodeCamp" class="course-platform-logo">`;
      } else if (isKultivi) {
        logoHtml = `<img src="/img/logos/kultivi.png" alt="Kultivi" class="course-platform-logo">`;
      } else if (isSenai) {
        logoHtml = `<img src="/img/logos/senai.png" alt="SENAI" class="course-platform-logo">`;
      } else if (isOracleOne) {
        logoHtml = `<img src="/img/logos/oracle.svg" alt="Oracle ONE" class="course-platform-logo">`;
      } else if (isGeneration) {
        logoHtml = `<img src="/img/logos/generation.png" alt="Generation Brasil" class="course-platform-logo">`;
      } else if (isWmc) {
        logoHtml = `<img src="/img/logos/womakerscode.png" alt="WoMakersCode" class="course-platform-logo">`;
      } else if (isBradesco) {
        logoHtml = `<img src="/img/logos/bradesco.svg" alt="Fundação Bradesco" class="course-platform-logo">`;
      } else if (isGuiaDeTI) {
        logoHtml = `<img src="/img/logos/guiadeti.png" alt="Guia de TI" class="course-platform-logo">`;
      } else if (isYouTube) {
        logoHtml = `<img src="/img/logos/youtube.svg" alt="YouTube" class="course-platform-logo">`;
      } else if (isUsp) {
        logoHtml = `<img src="/img/logos/usp.png" alt="USP" class="course-platform-logo">`;
      } else if (isAlura) {
        logoHtml = `<img src="/img/logos/alura.png" alt="Alura" class="course-platform-logo">`;
      } else if (isEvg) {
        logoHtml = `<img src="/img/logos/evg.png" alt="EV.G" class="course-platform-logo">`;
      } else if (isLumina) {
        logoHtml = `<img src="/img/logos/lumina.svg" alt="Lumina UFRGS" class="course-platform-logo">`;
      } else if (isIfrs) {
        logoHtml = `<img src="/img/logos/ifrs.svg" alt="IFRS" class="course-platform-logo">`;
      } else if (isGoogleAtelie) {
        logoHtml = `<img src="/img/logos/google.svg" alt="Google Ateliê Digital" class="course-platform-logo">`;
      } else if (isOpenBootcamp) {
        logoHtml = `<img src="/img/logos/openbootcamp.svg" alt="OpenBootcamp" class="course-platform-logo">`;
      } else if ((c.plataforma || '').includes('Cursa')) {
        logoHtml = `<img src="/img/logos/cursa.svg" alt="Cursa" class="course-platform-logo">`;
      } else if ((c.plataforma || '').includes('MIT')) {
        logoHtml = `<img src="/img/logos/mit.png" alt="MIT" class="course-platform-logo">`;
      } else if ((c.plataforma || '').includes('Harvard')) {
        logoHtml = `<img src="/img/logos/harvard.png" alt="Harvard" class="course-platform-logo">`;
      } else if ((c.plataforma || '').includes('Stanford')) {
        logoHtml = `<span style="font-size:1.3rem;">🌲</span>`;
      }


      return `
        <article class="course-card ${cardClass}">
          <div class="course-top">
            <span class="course-area">${this.escape(traduzirArea(c.area))}</span>
            <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
              ${extraBadge}
              ${deadlineBadge}
              <span class="course-level">${this.escape(c.nivel ? traduzirNivel(c.nivel) : t('courses.levelDefault'))}</span>
            </div>
          </div>

          <h3 class="course-title">${this.escape(c.titulo)}</h3>
          <p class="course-platform">${logoHtml} <span>${this.escape(c.plataforma)}</span></p>
          <p class="course-desc">${this.escape(c.descricao || t('courses.descFallback'))}</p>

          <a class="btn ${isBtnPrimary ? 'btn-primary' : 'btn-secondary'} course-btn" href="/api/cursos/${c.id}/acessar" target="_blank" rel="noopener noreferrer">
            ${btnTexto}
          </a>
        </article>
      `;
    }).join('');
  },

  // ==================== ROADMAPS & TRILHAS ====================
  buscarRoadmapsComDebounce() {
    clearTimeout(this.debounceRoadmapsTimer);
    this.debounceRoadmapsTimer = setTimeout(() => {
      this.termoBuscaRoadmaps = (document.getElementById('filtro-busca-roadmaps')?.value || '').trim();
      this.carregarRoadmaps();
    }, 250);
  },

  filtrarRoadmapsPorOrigem(origem) {
    this.origemRoadmapAtiva = origem;
    this.termoBuscaRoadmaps = '';
    const input = document.getElementById('filtro-busca-roadmaps');
    if (input) input.value = '';
    document.querySelectorAll('#pills-roadmaps-origem .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filtro') === origem);
    });
    this.carregarRoadmaps();
  },

  filtrarRoadmapsPorTermo(termo) {
    this.origemRoadmapAtiva = '';
    this.termoBuscaRoadmaps = termo;
    const input = document.getElementById('filtro-busca-roadmaps');
    if (input) input.value = termo;
    document.querySelectorAll('#pills-roadmaps-origem .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filtro') === termo.toLowerCase());
    });
    this.carregarRoadmaps();
  },

  async carregarRoadmaps() {
    const grid = document.getElementById('grade-roadmaps');
    if (!grid) return;
    grid.innerHTML = `<div class="loading">${t('roadmaps.loading')}</div>`;

    try {
      const params = new URLSearchParams();
      if (this.origemRoadmapAtiva) params.append('plataforma', this.origemRoadmapAtiva);
      if (this.termoBuscaRoadmaps) params.append('busca', this.termoBuscaRoadmaps);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/roadmaps${qs}`);
      const roadmaps = await res.json();
      this.roadmaps = roadmaps;
      this.renderizarRoadmaps(roadmaps);
    } catch (err) {
      grid.innerHTML = `<div class="loading" style="color:#b91c1c">${this.escape(t('roadmaps.error', { msg: err.message }))}</div>`;
    }
  },

  renderizarRoadmaps(lista) {
    const grid = document.getElementById('grade-roadmaps');
    if (!grid) return;

    if (!lista || lista.length === 0) {
      grid.innerHTML = `<div class="loading">${t('roadmaps.empty')}</div>`;
      return;
    }

    grid.innerHTML = lista.map(r => {
      const isRoadmapSh = (r.plataforma || '').includes('Roadmap.sh');
      const isTrilha = (r.plataforma || '').includes('Trilha Info');
      const isGuiaTI = (r.plataforma || '').includes('Guia de TI');
      let badgeOrigem = ' Roadmap Aberto';
      let logoRoadmap = '';
      if (isRoadmapSh) {
        badgeOrigem = ' Roadmap.sh';
        logoRoadmap = `<img src="/img/logos/roadmapsh.png" alt="Roadmap.sh" class="course-platform-logo">`;
      } else if (isTrilha) {
        badgeOrigem = ' Trilha Info (BR)';
        logoRoadmap = `<img src="/img/logos/trilhainfo.png" alt="Trilha Info" class="course-platform-logo">`;
      } else if (isGuiaTI) {
        badgeOrigem = ' Guia de TI';
        logoRoadmap = `<img src="/img/logos/guiadeti.png" alt="Guia de TI" class="course-platform-logo">`;
      }

      return `
        <article class="roadmap-card">
          <div class="roadmap-top">
            <span class="roadmap-badge-origem">${badgeOrigem}</span>
            <span class="roadmap-nivel">${this.escape(r.nivel || 'Iniciante a Avançado')}</span>
          </div>

          <h3 class="roadmap-title">${this.escape(r.titulo)}</h3>
          <p class="roadmap-platform">${logoRoadmap} <span>${this.escape(r.plataforma)}</span></p>
          <p class="roadmap-desc">${this.escape(r.descricao || 'Árvore de habilidades e guia passo a passo estruturado para desenvolvimento técnico.')}</p>

          <a class="btn roadmap-btn" href="${this.escape(r.url, true)}" target="_blank" rel="noopener noreferrer">
             Acessar Roadmap Interativo ↗
          </a>
        </article>
      `;
    }).join('');
  },

  // ==================== PODCASTS & SPOTIFY ====================
  filtrarPodcastsComDebounce() {
    clearTimeout(this.debouncePodcastsTimer);
    this.debouncePodcastsTimer = setTimeout(() => {
      this.termoBuscaPodcasts = (document.getElementById('filtro-busca-podcasts')?.value || '').trim();
      this.carregarPodcasts();
    }, 250);
  },

  filtrarPorCategoriaPodcast(cat) {
    this.catPodcastAtiva = cat;
    document.querySelectorAll('#pills-categorias-podcasts .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    this.carregarPodcasts();
  },

  scrollParaEpisodiosRecentes() {
    const el = document.getElementById('secao-episodios-recentes');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },

  tocarEpisodioSpotify(embedUrl, id, titulo, showTitulo) {
    const frame = document.getElementById('spotify-embed-frame');
    const statusText = document.getElementById('player-status-text');
    if (frame && embedUrl) {
      frame.src = embedUrl;
    }
    if (statusText) {
      statusText.textContent = ` A reproduzir: ${titulo}${showTitulo ? ' (' + showTitulo + ')' : ''}`;
    }
    const container = document.getElementById('spotify-player-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    // Registrar contagem atômica de reproduções
    if (id) {
      fetch(`/api/podcasts/episodios/${id}/ouvir`, { method: 'POST' }).catch(() => {});
    }
  },

  async carregarPodcasts() {
    const grid = document.getElementById('podcasts-grid');
    if (!grid) return;
    grid.innerHTML = `<div class="loading">Carregando programas de podcast e audiolivros...</div>`;

    try {
      const params = new URLSearchParams();
      if (this.catPodcastAtiva) params.append('categoria', this.catPodcastAtiva);
      if (this.termoBuscaPodcasts) params.append('busca', this.termoBuscaPodcasts);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const [resShows, resEpisodios] = await Promise.all([
        fetch(`/api/podcasts${qs}`).then(r => r.json()),
        fetch('/api/podcasts/episodios/recentes').then(r => r.json())
      ]);

      this.podcasts = Array.isArray(resShows) ? resShows : [];
      this.episodiosRecentes = Array.isArray(resEpisodios) ? resEpisodios : [];

      this.renderizarShows(this.podcasts);
      this.renderizarEpisodiosRecentes(this.episodiosRecentes);
    } catch (err) {
      grid.innerHTML = `<div class="loading" style="color:#b91c1c">Erro ao carregar podcasts: ${this.escape(err.message)}</div>`;
    }
  },

  renderizarShows(lista) {
    const grid = document.getElementById('podcasts-grid');
    if (!grid) return;

    if (!lista || lista.length === 0) {
      grid.innerHTML = `<div class="loading">Nenhum programa de podcast encontrado para os filtros selecionados.</div>`;
      return;
    }

    grid.innerHTML = lista.map(s => {
      const totalEp = s.total_episodios || (s.episodios || []).length || 0;
      return `
        <article class="podcast-card">
          <div class="podcast-cover-box">
            <img src="${s.capa_url || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80'}" alt="${this.escape(s.titulo)}" class="podcast-cover-img" loading="lazy">
            <span class="podcast-category-badge">${this.escape(s.categoria || 'Educação')}</span>
          </div>

          <div class="podcast-body">
            <h4 class="podcast-card-title">${this.escape(s.titulo)}</h4>
            <p class="podcast-card-desc">${this.escape(s.descricao)}</p>

            <div class="podcast-meta-row">
              <span> ${totalEp} ${totalEp === 1 ? 'Episódio' : 'Episódios'}</span>
              <span> Spotify for Creators</span>
            </div>

            <div class="podcast-card-actions">
              ${s.spotify_url ? `
                <a class="btn btn-spotify" href="${s.spotify_url}" target="_blank" rel="noopener noreferrer" style="flex:1; justify-content:center; font-size:0.85rem;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align:middle;margin-right:4px;"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.352-.676.463-1.028.247-2.816-1.721-6.36-2.111-10.536-1.157-.402.092-.801-.158-.893-.561-.092-.403.158-.802.561-.894 4.571-1.045 8.49-.606 11.649 1.336.352.217.462.678.247 1.029zm1.467-3.262c-.27.44-.848.58-1.288.31-3.224-1.982-8.139-2.555-11.952-1.398-.497.151-1.026-.135-1.177-.633-.151-.497.135-1.026.633-1.177 4.364-1.325 9.773-.687 13.473 1.589.44.27.58.848.311 1.309zm.126-3.41c-3.864-2.295-10.239-2.506-13.916-1.39-.594.18-1.222-.162-1.402-.756-.18-.594.162-1.222.756-1.402 4.23-1.284 11.272-1.037 15.702 1.593.535.317.71 1.01.393 1.545-.317.534-1.01.71-1.533.41z"/></svg>
                  Spotify
                </a>
              ` : ''}
              <button class="btn btn-outline" style="flex:1; justify-content:center; font-size:0.85rem;" onclick="app.ouvirShowCompleto('${s.slug}')">
                ▶ Ouvir Show
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  ouvirShowCompleto(slug) {
    const show = this.podcasts.find(s => s.slug === slug);
    if (!show) return;
    const showIdPart = (show.spotify_url || '').split('/show/')[1] || '';
    const embedUrl = `https://open.spotify.com/embed/show/${showIdPart}?utm_source=generator&theme=0`;
    this.tocarEpisodioSpotify(embedUrl, null, show.titulo, 'Programa Completo');
  },

  renderizarEpisodiosRecentes(lista) {
    const container = document.getElementById('episodios-recentes-container');
    if (!container) return;

    if (!lista || lista.length === 0) {
      container.innerHTML = `<div class="loading">Nenhum episódio recente disponível no momento.</div>`;
      return;
    }

    container.innerHTML = lista.map(ep => {
      const duracao = ep.duracao_minutos ? `${ep.duracao_minutos} min` : '';
      const data = ep.publicado_em ? ep.publicado_em : '';
      return `
        <div class="episodio-card">
          <div class="episodio-info">
            <span class="episodio-show-tag"> ${this.escape(ep.show_titulo || 'Podcast Lino Livre')}</span>
            <h4 class="episodio-title">${this.escape(ep.titulo)}</h4>
            <p class="episodio-desc">${this.escape(ep.descricao || '')}</p>
            <div class="episodio-meta">
              ${duracao ? `<span>${duracao}</span>` : ''}
              ${data ? `<span> ${data}</span>` : ''}
              ${ep.reproducoes > 0 ? `<span> ${ep.reproducoes} reproduções</span>` : ''}
            </div>
          </div>

          <div class="episodio-actions">
            <button class="btn-play-ep" onclick="app.tocarEpisodioSpotify('${ep.spotify_embed_url}', ${ep.id}, '${this.escape(ep.titulo)}', '${this.escape(ep.show_titulo)}')">
              ▶ Tocar
            </button>
            ${ep.spotify_url ? `
              <a class="btn btn-spotify" style="padding:0.45rem 0.85rem; font-size:0.8rem;" href="${ep.spotify_url}" target="_blank" rel="noopener noreferrer" title="Abrir na App Spotify">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align:middle;"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.352-.676.463-1.028.247-2.816-1.721-6.36-2.111-10.536-1.157-.402.092-.801-.158-.893-.561-.092-.403.158-.802.561-.894 4.571-1.045 8.49-.606 11.649 1.336.352.217.462.678.247 1.029zm1.467-3.262c-.27.44-.848.58-1.288.31-3.224-1.982-8.139-2.555-11.952-1.398-.497.151-1.026-.135-1.177-.633-.151-.497.135-1.026.633-1.177 4.364-1.325 9.773-.687 13.473 1.589.44.27.58.848.311 1.309zm.126-3.41c-3.864-2.295-10.239-2.506-13.916-1.39-.594.18-1.222-.162-1.402-.756-.18-.594.162-1.222.756-1.402 4.23-1.284 11.272-1.037 15.702 1.593.535.317.71 1.01.393 1.545-.317.534-1.01.71-1.533.41z"/></svg>
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  // ==================== DICAS & FERRAMENTAS ====================
  buscarDicasComDebounce() {
    clearTimeout(this.debounceDicasTimer);
    this.debounceDicasTimer = setTimeout(() => {
      this.termoBuscaDicas = (document.getElementById('filtro-busca-dicas')?.value || '').trim();
      this.carregarDicas();
    }, 250);
  },

  filtrarDicasPorCategoria(cat) {
    this.catDicaAtiva = cat;
    document.querySelectorAll('#pills-dicas-cat .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    this.carregarDicas();
  },

  async carregarDicas() {
    const grid = document.getElementById('grade-dicas');
    if (!grid) return;
    grid.innerHTML = `<div class="loading">${t('tips.loading')}</div>`;

    try {
      const params = new URLSearchParams();
      if (this.catDicaAtiva) params.append('categoria', this.catDicaAtiva);
      if (this.termoBuscaDicas) params.append('busca', this.termoBuscaDicas);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/dicas${qs}`);
      const dicas = await res.json();
      this.dicas = dicas;
      this.renderizarDicas(dicas);
    } catch (err) {
      grid.innerHTML = `<div class="loading" style="color:#b91c1c">${this.escape(t('tips.error', { msg: err.message }))}</div>`;
    }
  },

  renderizarDicas(lista) {
    const grid = document.getElementById('grade-dicas');
    if (!grid) return;

    if (!lista || lista.length === 0) {
      grid.innerHTML = `<div class="loading">${t('tips.empty')}</div>`;
      return;
    }

    grid.innerHTML = lista.map(d => {
      return `
        <article class="dica-card">
          <div class="dica-header">
            <div>
              <span class="dica-categoria-badge">${this.escape(d.categoria_label || 'Dica')}</span>
              <h3 class="dica-title">${this.escape(d.titulo)}</h3>
            </div>
          </div>

          <p class="dica-desc">${this.escape(d.descricao)}</p>

          <div class="dica-pratica-box">
            <strong> Como aplicar nos estudos:</strong>
            ${this.escape(d.dica_pratica)}
          </div>

          <div class="dica-footer">
            <span class="dica-badge-gratis"> ${this.escape(d.gratuito || 'Gratuito')}</span>
            <a class="dica-btn" href="${this.escape(d.url, true)}" target="_blank" rel="noopener noreferrer">
              Acessar Recurso ↗
            </a>
          </div>
        </article>
      `;
    }).join('');
  },

  // ==================== DASHBOARD & MÉTRICAS ====================
  async carregarDashboard() {
    const container = document.getElementById('dashboard-content');
    container.innerHTML = `<div class="loading">${t('dashboard.loading')}</div>`;

    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();

      const r = data.resumo || {};
      const formatos = data.formatos || [];
      const areas = data.areas || [];
      const idiomas = data.idiomas || [];
      const fontes = data.fontes || [];
      const maisLidos = data.mais_lidos || [];

      const totalLivros = r.total_livros || 0;
      const meta = 10000000;
      const pct = ((totalLivros / meta) * 100);
      const pctStr = (pct < 0.01) ? pct.toFixed(4) : pct.toFixed(2);
      const visualWidth = Math.max(1.5, Math.min(100, pct));

      container.innerHTML = `
        <div class="dash-goal-banner">
          <div class="dash-goal-header">
            <div>
              <span class="dash-goal-badge">Meta Coletiva Global</span>
              <h2>Rumo aos 10 Milhões de Livros Livres</h2>
              <p>Acompanhamento oficial da jornada de indexação de obras livres e de domínio público para a humanidade.</p>
            </div>
            <div class="dash-goal-counter">
              <span class="dash-goal-label">Acervo Atual / Meta</span>
              <div class="dash-goal-number">
                ${totalLivros.toLocaleString()} <span>/</span> <strong>10.000.000</strong>
              </div>
              <span class="dash-goal-percent">${pctStr}% da meta</span>
            </div>
          </div>
          <div class="dash-goal-progress">
            <div class="dash-goal-progress-fill" style="width:${visualWidth}%;"></div>
          </div>
        </div>

        <div class="stat-cards-row">
          <div class="stat-card">
            <div class="stat-val">${r.total_livros || 0}</div>
            <div class="stat-label">${t('dashboard.titles')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${r.total_leituras > 0 ? r.total_leituras.toLocaleString() : '0'}</div>
            <div class="stat-label">${r.total_leituras > 0 ? t('dashboard.reads') : 'Leituras em Tempo Real'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${r.total_cursos || 0}</div>
            <div class="stat-label">${t('dashboard.courses')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${r.total_autores || 0}</div>
            <div class="stat-label">${t('dashboard.authors')}</div>
          </div>
        </div>

        <div class="dash-sections-row">
          <div class="dash-box">
            <h3> Idiomas do Acervo</h3>
            <div class="dash-list">
              ${idiomas.map(i => {
                const labels = {
                  pt: 'Português',
                  en: 'English',
                  es: 'Español',
                  fr: 'Français',
                  de: 'Deutsch',
                  zh: '中文'
                };
                const label = labels[i.idioma] || (i.idioma ? i.idioma.toUpperCase() : 'Outro');
                return `
                  <div class="dash-list-item">
                    <span>${label}</span>
                    <span class="dash-list-badge">${i.total} ${t('dashboard.works')}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="dash-box">
            <h3>${t('dashboard.formats')}</h3>
            <div class="dash-list">
              ${formatos.map(f => `
                <div class="dash-list-item">
                  <span> ${f.formato.toUpperCase()}</span>
                  <span class="dash-list-badge">${f.total} ${t('dashboard.works')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dash-box">
            <h3>${t('dashboard.distribution')}</h3>
            <div class="dash-list">
              ${areas.map(a => `
                <div class="dash-list-item">
                  <span> ${this.escape(traduzirArea(a.area))}</span>
                  <span class="dash-list-badge">${a.total} ${t('dashboard.works')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dash-box">
            <h3>${t('dashboard.sources')}</h3>
            <div class="dash-list">
              ${fontes.map(f => `
                <div class="dash-list-item">
                  <span> ${this.escape(f.nome)}</span>
                  <span class="dash-list-badge">${f.total_livros} ${t('dashboard.works')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dash-box">
            <h3>${t('dashboard.mostRead')}</h3>
            <div class="dash-list">
              ${maisLidos.map(l => `
                <div class="dash-list-item">
                  <span> ${this.escape(l.titulo)}</span>
                  <span class="dash-list-badge">${l.leituras > 0 ? `${l.leituras} ${t('dashboard.readsShort')}` : 'Acervo Aberto'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="loading" style="color:#b91c1c">${this.escape(t('dashboard.error', { msg: err.message }))}</div>`;
    }
  },

  // ==================== COMUNIDADE E CANAL WHATSAPP ====================
  async verificarComunidadeECanal() {
    let temComunidade = false;
    let temCanal = false;

    // Verificar Comunidade
    try {
      const res = await fetch('/api/comunidade');
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          temComunidade = true;
          // Botão Header
          const btnHeader = document.getElementById('btn-header-comunidade');
          if (btnHeader) {
            btnHeader.href = data.url;
            btnHeader.classList.remove('hidden');
          }
          // Card da seção
          const cardComunidade = document.getElementById('card-comunidade');
          const linkCard = document.getElementById('link-card-comunidade');
          if (cardComunidade && linkCard) {
            linkCard.href = data.url;
            cardComunidade.classList.remove('hidden');
          }
          // Link rodapé
          const linkFooter = document.getElementById('link-footer-comunidade');
          if (linkFooter) linkFooter.href = data.url;

          // Botão no Placar da Meta 10M
          const btnGoalComunidade = document.getElementById('btn-goal-comunidade');
          if (btnGoalComunidade) {
            btnGoalComunidade.href = data.url;
            btnGoalComunidade.classList.remove('hidden');
          }
        }
      }
    } catch (_) {}

    // Verificar Canal
    try {
      const res = await fetch('/api/canal');
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          temCanal = true;
          // Botão Header
          const btnHeader = document.getElementById('btn-header-canal');
          if (btnHeader) {
            btnHeader.href = data.url;
            btnHeader.classList.remove('hidden');
          }
          // Card da seção
          const cardCanal = document.getElementById('card-canal');
          const linkCard = document.getElementById('link-card-canal');
          if (cardCanal && linkCard) {
            linkCard.href = data.url;
            cardCanal.classList.remove('hidden');
          }
          // Link rodapé
          const linkFooter = document.getElementById('link-footer-canal');
          if (linkFooter) linkFooter.href = data.url;
        }
      }
    } catch (_) {}

    // Mostrar seção se houver comunidade ou canal
    if (temComunidade || temCanal) {
      const secWhatsapp = document.getElementById('secao-whatsapp');
      if (secWhatsapp) secWhatsapp.classList.remove('hidden');
      const footerLinks = document.getElementById('footer-links-container');
      if (footerLinks) footerLinks.classList.remove('hidden');

      if (!temComunidade || !temCanal) {
        const sep = document.getElementById('footer-separator');
        if (sep) sep.classList.add('hidden');
        if (!temComunidade) document.getElementById('link-footer-comunidade')?.classList.add('hidden');
        if (!temCanal) document.getElementById('link-footer-canal')?.classList.add('hidden');
      }
    }
  },

  // ==================== ADICIONAR NOVO LIVRO ====================
  abrirModalNovoLivro() {
    document.getElementById('modal-novo-livro').classList.remove('hidden');
  },

  fecharModais() {
    this.pararAudio();
    const modalLeitor = document.getElementById('modal-leitor');
    if (modalLeitor) modalLeitor.classList.add('hidden');
    const modalNovoLivro = document.getElementById('modal-novo-livro');
    if (modalNovoLivro) modalNovoLivro.classList.add('hidden');
    const modalLegal = document.getElementById('modal-legal');
    if (modalLegal) modalLegal.classList.add('hidden');
  },

  abrirModalLegal(secao = 'termos') {
    const modalLegal = document.getElementById('modal-legal');
    if (!modalLegal) return;
    this.trocarAbaLegal(secao);
    modalLegal.classList.remove('hidden');
  },

  trocarAbaLegal(secao) {
    const abas = ['termos', 'isencao', 'takedown', 'privacidade'];
    abas.forEach(aba => {
      const btn = document.getElementById(`modal-legal-tab-${aba}`);
      const conteudo = document.getElementById(`legal-conteudo-${aba}`);
      if (btn) btn.classList.toggle('active', aba === secao);
      if (conteudo) conteudo.classList.toggle('active', aba === secao);
    });
  },


  async salvarNovoLivro(e) {
    e.preventDefault();

    const titulo = document.getElementById('novo-titulo').value;
    const autorNome = document.getElementById('novo-autor').value;
    const licenca = document.getElementById('novo-licenca').value;
    const categoriaId = document.getElementById('novo-categoria-select').value;
    const ano = document.getElementById('novo-ano').value;
    const formato = document.getElementById('novo-formato-link').value;
    const urlLink = document.getElementById('novo-url-link').value;
    const capaUrl = document.getElementById('novo-capa-url').value;
    const sinopse = document.getElementById('novo-sinopse').value;
    const conteudo = document.getElementById('novo-conteudo').value;

    const links = [];
    if (formato && urlLink) {
      links.push({ formato, url: urlLink });
    }

    try {
      // 1. Cadastrar autor se necessário
      let autorId = null;
      if (autorNome) {
        const resAutores = await fetch('/api/autores');
        const autores = await resAutores.json();
        const autExistente = (autores || []).find(a => a.nome.toLowerCase() === autorNome.trim().toLowerCase());
        if (autExistente) {
          autorId = autExistente.id;
        } else {
          const resNovoAut = await fetch('/api/autores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: autorNome.trim(), nacionalidade: 'Brasileiro' })
          });
          const novoAut = await resNovoAut.json();
          autorId = novoAut.id;
        }
      }

      // 2. Cadastrar livro com licença obrigatória
      const resLivro = await fetch('/api/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          autor_id: autorId,
          categoria_id: categoriaId ? parseInt(categoriaId, 10) : null,
          ano_publicacao: ano ? parseInt(ano, 10) : null,
          licenca,
          capa_url: capaUrl || null,
          sinopse,
          conteudo_texto: conteudo,
          links
        })
      });

      const dataLivro = await resLivro.json();
      if (!resLivro.ok) throw new Error(dataLivro.erro || t('form.errorSave'));

      this.mostrarToast(t('form.savedOk', { t: titulo }));
      this.fecharModais();
      e.target.reset();
      this.carregarCategoriasSelect();
      this.carregarLivros();
      this.carregarPlacarMeta();
    } catch (err) {
      this.mostrarToast(t('form.error', { msg: err.message }));
    }
  },

  // ==================== PLACAR DA JORNADA: RUMO AOS 10 MILHÕES ====================
  async carregarPlacarMeta() {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        const tot = data?.resumo?.total_livros || data?.total_livros;
        if (tot) {
          this.totalLivrosAcervo = tot;
          this.atualizarPlacarMeta(tot);
          return;
        }
      }
    } catch (_) {}

    try {
      const res = await fetch('/api/livros?limit=1');
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json.total === 'number') {
          this.totalLivrosAcervo = json.total;
          this.atualizarPlacarMeta(json.total);
          return;
        }
      }
    } catch (_) {}

    this.atualizarPlacarMeta(this.totalLivrosAcervo || 695);
  },

  atualizarPlacarMeta(total) {
    if (!total || total < 1) total = this.totalLivrosAcervo || 695;
    this.totalLivrosAcervo = total;

    const meta = 10000000;
    const faltam = Math.max(0, meta - total);
    const porcentagem = ((total / meta) * 100);
    const pctStr = (porcentagem < 0.01) ? porcentagem.toFixed(4) : porcentagem.toFixed(2);

    const lang = (window.I18N && I18N.lang) ? I18N.lang : 'pt';
    const localeMap = {
      'pt': 'pt-AO',
      'en': 'en-US',
      'es': 'es-ES',
      'de': 'de-DE',
      'fr': 'fr-FR',
      'zh': 'zh-CN'
    };
    const locale = localeMap[lang] || 'pt-AO';
    const fmt = new Intl.NumberFormat(locale);

    const elTotal = document.getElementById('placar-total-livros');
    const elPct = document.getElementById('placar-porcentagem');
    const elBarra = document.getElementById('placar-barra-progresso');
    const elStatAtual = document.getElementById('placar-stat-atual');
    const elStatFaltam = document.getElementById('placar-stat-faltam');
    const elNextTarget = document.getElementById('placar-stat-next-target');

    if (elTotal) elTotal.textContent = fmt.format(total);
    if (elStatAtual) elStatAtual.textContent = fmt.format(total);
    if (elStatFaltam) elStatFaltam.textContent = fmt.format(faltam);

    let proximoMarco = 1000;
    if (total >= 1000) proximoMarco = 10000;
    if (total >= 10000) proximoMarco = 100000;
    if (total >= 100000) proximoMarco = 1000000;
    if (total >= 1000000) proximoMarco = 10000000;
    if (elNextTarget) elNextTarget.textContent = fmt.format(proximoMarco);

    const m1k = document.getElementById('milestone-1k');
    const m10k = document.getElementById('milestone-10k');
    if (m1k) {
      if (total >= 1000) {
        m1k.classList.remove('active');
        m1k.classList.add('reached');
        const tag = m1k.querySelector('.milestone-tag');
        if (tag) tag.textContent = '';
      }
    }
    if (m10k) {
      if (total >= 1000 && total < 10000) {
        m10k.classList.add('active');
      }
    }

    if (elPct) {
      if (typeof t === 'function') {
        const trad = t('goal.pctOfTarget', { p: pctStr });
        elPct.textContent = (trad && !trad.startsWith('goal.')) ? trad : `${pctStr}% da meta`;
      } else {
        elPct.textContent = `${pctStr}% da meta`;
      }
    }

    if (elBarra) {
      const visualWidth = Math.max(1.5, Math.min(100, (total / meta) * 100));
      elBarra.style.width = `${visualWidth}%`;
    }
  },

  compartilharMeta10M() {
    const total = this.totalLivrosAcervo || 695;
    const lang = (window.I18N && I18N.lang) ? I18N.lang : 'pt';
    const localeMap = { 'pt': 'pt-AO', 'en': 'en-US', 'es': 'es-ES', 'de': 'de-DE', 'fr': 'fr-FR', 'zh': 'zh-CN' };
    const numFmt = new Intl.NumberFormat(localeMap[lang] || 'pt-AO').format(total);

    let texto = ` Junte-se ao Lino Livre na jornada dos 10 Milhões de Livros Livres! Já temos ${numFmt} obras abertas e gratuitas indexadas. Venha ler e contribuir:`;
    if (typeof t === 'function') {
      const trad = t('goal.shareText', { n: numFmt });
      if (trad && !trad.startsWith('goal.')) texto = trad;
    }
    const url = window.location.origin;

    if (navigator.share) {
      navigator.share({
        title: 'Lino Livre — Rumo aos 10 Milhões de Livros Livres',
        text: texto,
        url: url
      }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${texto} ${url}`).then(() => {
          const msg = (typeof t === 'function' ? t('goal.copied') : '') || 'Link e mensagem copiados com sucesso!';
          this.mostrarToast(msg);
        }).catch(() => {});
      }
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto + ' ' + url)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  },

  mostrarToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3500);
  },

  escape(str, preserveEmoji = false) {
    if (!str) return '';
    const value = preserveEmoji
      ? String(str)
      : String(str).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{FE0E}\u{FE0F}\u{200D}]/gu, '');
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&amp;lt;')
      .replace(/>/g, '&amp;gt;')
      .replace(/"/g, '&amp;quot;');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  app.init();
});
