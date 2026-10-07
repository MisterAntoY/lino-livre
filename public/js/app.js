// Lino Livre — Aplicação Web Digital

const app = {
  abaAtiva: 'livros',
  livros: [],
  cursos: [],
  categoriaAtiva: '',
  formatoAtivo: '',
  areaCursoAtiva: '',
  fonteCursoAtiva: '',
  termoBusca: '',
  termoBuscaCursos: '',
  paginaAtual: 1,
  totalPaginas: 1,
  debounceTimer: null,
  debounceCursosTimer: null,
  tamanhoFonte: 18,
  livroAtual: null,

  async init() {
    await Promise.all([
      this.carregarLivros(),
      this.verificarComunidadeECanal()
    ]);
  },

  trocarAba(nomeAba) {
    this.abaAtiva = nomeAba;
    
    // Atualizar botões das abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === `tab-btn-${nomeAba}`);
    });

    // Alternar visibilidade do conteúdo
    document.getElementById('aba-livros').classList.toggle('hidden', nomeAba !== 'livros');
    document.getElementById('aba-cursos').classList.toggle('hidden', nomeAba !== 'cursos');
    document.getElementById('aba-dashboard').classList.toggle('hidden', nomeAba !== 'dashboard');

    if (nomeAba === 'cursos' && this.cursos.length === 0) {
      this.carregarCursos();
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

  async carregarLivros() {
    const grid = document.getElementById('grade-livros');
    grid.innerHTML = `<div class="loading">Buscando obras no acervo digital...</div>`;

    try {
      const params = new URLSearchParams();
      if (this.termoBusca) params.append('busca', this.termoBusca);
      if (this.categoriaAtiva) params.append('categoria_id', this.obterCategoriaId(this.categoriaAtiva));
      if (this.formatoAtivo) params.append('formato', this.formatoAtivo);
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
      grid.innerHTML = `<div class="loading" style="color:#b91c1c">Erro ao carregar livros: ${err.message}</div>`;
    }
  },

  obterCategoriaId(nome) {
    const mapa = {
      'Clássicos Brasileiros': 1,
      'Romance & Crônicas': 2,
      'Teatro & Poesia': 3,
      'Apoio Pedagógico & Filosofia': 4,
      'Literatura Infantojuvenil': 5,
      'Tecnologia & Guias Digitais': 6
    };
    return mapa[nome] || '';
  },

  renderizarLivros(lista) {
    const grid = document.getElementById('grade-livros');

    if (!lista || lista.length === 0) {
      grid.innerHTML = `<div class="loading">Nenhum livro encontrado para os filtros selecionados.</div>`;
      return;
    }

    grid.innerHTML = lista.map(l => {
      const capaUrl = l.capa_url || '/capas/dom_casmurro.jpg';
      const licencaFormatada = (l.licenca || 'Domínio Público').replace('-', ' ').toUpperCase();
      
      const links = l.links || [];
      const tagsFormatos = links.map(lnk => `
        <a class="format-tag" href="/api/livros/${l.id}/ler/${lnk.id}" target="_blank" rel="noopener noreferrer" title="Abrir formato ${lnk.formato.toUpperCase()}">
          📄 ${lnk.formato.toUpperCase()}
        </a>
      `).join('');

      return `
        <article class="book-card">
          <div class="book-cover-container">
            <img src="${capaUrl}" alt="Capa de ${this.escape(l.titulo)}" class="book-cover" onerror="this.src='/capas/dom_casmurro.jpg'">
            <span class="badge-format">${l.idioma ? l.idioma.toUpperCase() : 'PT'}</span>
          </div>

          <div class="book-details">
            <h3 class="book-title">${this.escape(l.titulo)}</h3>
            <p class="book-author">${this.escape(l.autor_nome || 'Autor Clássico')} ${l.ano_publicacao ? `• ${l.ano_publicacao}` : ''}</p>
            <div>
              <span class="badge-license">${this.escape(licencaFormatada)}</span>
            </div>

            <p class="book-synopsis">${this.escape(l.sinopse || 'Disponível livremente para leitura online e download educativo.')}</p>

            <div class="format-tags">
              ${tagsFormatos || '<span style="font-size:0.75rem; color:#94a3b8">Texto Digital</span>'}
            </div>

            <div class="book-stats">
              <span>📖 <strong>${l.leituras || 0}</strong> leituras</span>
              <span>🏷️ ${this.escape(l.categoria_nome || 'Literatura')}</span>
            </div>

            <div class="book-actions">
              <button class="btn btn-primary" onclick="app.abrirLeitorOuLink(${l.id})">
                📖 Ler Online
              </button>
              ${links[0] ? `
                <a class="btn btn-secondary" href="/api/livros/${l.id}/ler/${links[0].id}" target="_blank" rel="noopener noreferrer">
                  ⬇ Baixar
                </a>
              ` : `
                <button class="btn btn-secondary" onclick="app.abrirLeitorOuLink(${l.id})">
                  Visualizar
                </button>
              `}
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  async abrirLeitorOuLink(livroId) {
    try {
      const res = await fetch(`/api/livros/${livroId}`);
      if (!res.ok) throw new Error('Não foi possível carregar os detalhes do livro');
      const livro = await res.json();

      if (livro.conteudo_texto && livro.conteudo_texto.trim().length > 0) {
        this.livroAtual = livro;
        document.getElementById('leitor-titulo').textContent = livro.titulo;
        document.getElementById('leitor-autor').textContent = `${livro.autor_nome || 'Autor'} • ${livro.licenca}`;
        const textoEl = document.getElementById('leitor-texto');
        textoEl.textContent = livro.conteudo_texto;
        textoEl.style.fontSize = `${this.tamanhoFonte}px`;
        document.getElementById('modal-leitor').classList.remove('hidden');
      } else if (livro.links && livro.links.length > 0) {
        window.open(`/api/livros/${livro.id}/ler/${livro.links[0].id}`, '_blank');
      } else {
        this.mostrarToast('Esta obra está disponível no catálogo digital.');
      }
    } catch (err) {
      this.mostrarToast('Erro ao abrir obra: ' + err.message);
    }
  },

  alterarFonte(delta) {
    this.tamanhoFonte = Math.min(28, Math.max(14, this.tamanhoFonte + delta));
    const textoEl = document.getElementById('leitor-texto');
    if (textoEl) textoEl.style.fontSize = `${this.tamanhoFonte}px`;
  },

  atualizarControlesPaginacao() {
    const pagEl = document.getElementById('paginacao');
    const textoEl = document.getElementById('texto-paginacao');
    const btnAnt = document.getElementById('btn-pag-ant');
    const btnProx = document.getElementById('btn-pag-prox');

    if (this.totalPaginas > 1) {
      pagEl.classList.remove('hidden');
      textoEl.textContent = `Página ${this.paginaAtual} de ${this.totalPaginas}`;
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
    document.querySelectorAll('#pills-cursos-areas .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filtro') === area);
    });
    this.carregarCursos();
  },

  filtrarCursosPorFonte(fonte) {
    this.fonteCursoAtiva = fonte;
    this.areaCursoAtiva = '';
    document.querySelectorAll('#pills-cursos-areas .pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filtro') === 'guiadeti');
    });
    this.carregarCursos();
  },

  async carregarCursos() {
    const grid = document.getElementById('grade-cursos');
    grid.innerHTML = `<div class="loading">Carregando catálogo de cursos e roadmaps...</div>`;

    try {
      const params = new URLSearchParams();
      if (this.areaCursoAtiva) params.append('area', this.areaCursoAtiva);
      if (this.fonteCursoAtiva) params.append('fonte', this.fonteCursoAtiva);
      if (this.termoBuscaCursos) params.append('busca', this.termoBuscaCursos);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/cursos${qs}`);
      const cursos = await res.json();
      this.cursos = cursos;

      this.renderizarCursos(cursos);
    } catch (err) {
      grid.innerHTML = `<div class="loading" style="color:#b91c1c">Erro ao carregar cursos: ${err.message}</div>`;
    }
  },

  renderizarCursos(lista) {
    const grid = document.getElementById('grade-cursos');

    if (!lista || lista.length === 0) {
      grid.innerHTML = `<div class="loading">Nenhum curso ou roadmap encontrado para os filtros selecionados.</div>`;
      return;
    }

    grid.innerHTML = lista.map(c => {
      const isGuiaDeTI = (c.plataforma || '').includes('Guia de TI');
      return `
        <article class="course-card ${isGuiaDeTI ? 'card-featured-guiadeti' : ''}">
          <div class="course-top">
            <span class="course-area">${this.escape(c.area)}</span>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              ${isGuiaDeTI ? '<span class="badge-guiadeti-pill">⭐ Guia de TI</span>' : ''}
              <span class="course-level">${this.escape(c.nivel || 'Livre')}</span>
            </div>
          </div>

          <h3 class="course-title">${this.escape(c.titulo)}</h3>
          <p class="course-platform">🏛️ ${this.escape(c.plataforma)}</p>
          <p class="course-desc">${this.escape(c.descricao || 'Curso aberto com acesso gratuito e materiais didáticos.')}</p>

          <a class="btn ${isGuiaDeTI ? 'btn-primary' : 'btn-secondary'} course-btn" href="${c.url}" target="_blank" rel="noopener noreferrer">
            ${isGuiaDeTI ? 'Acessar no Guia de TI ↗' : 'Acessar Curso Gratuito ↗'}
          </a>
        </article>
      `;
    }).join('');
  },

  // ==================== DASHBOARD & MÉTRICAS ====================
  async carregarDashboard() {
    const container = document.getElementById('dashboard-content');
    container.innerHTML = `<div class="loading">Carregando estatísticas do acervo...</div>`;

    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();

      const r = data.resumo || {};
      const formatos = data.formatos || [];
      const areas = data.areas || [];
      const fontes = data.fontes || [];
      const maisLidos = data.mais_lidos || [];

      container.innerHTML = `
        <div class="stat-cards-row">
          <div class="stat-card">
            <div class="stat-val">${r.total_livros || 0}</div>
            <div class="stat-label">Títulos Digitais</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${r.total_leituras || 0}</div>
            <div class="stat-label">Leituras / Acessos</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${r.total_cursos || 0}</div>
            <div class="stat-label">Cursos Gratuitos</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${r.total_autores || 0}</div>
            <div class="stat-label">Autores Clássicos</div>
          </div>
        </div>

        <div class="dash-sections-row">
          <div class="dash-box">
            <h3>Formatos Disponíveis</h3>
            <div class="dash-list">
              ${formatos.map(f => `
                <div class="dash-list-item">
                  <span>📄 ${f.formato.toUpperCase()}</span>
                  <span class="dash-list-badge">${f.total} obras</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dash-box">
            <h3>Distribuição por Área</h3>
            <div class="dash-list">
              ${areas.map(a => `
                <div class="dash-list-item">
                  <span>📚 ${this.escape(a.area)}</span>
                  <span class="dash-list-badge">${a.total} obras</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dash-box">
            <h3>Fontes Abertas Conectadas</h3>
            <div class="dash-list">
              ${fontes.map(f => `
                <div class="dash-list-item">
                  <span>🌐 ${this.escape(f.nome)}</span>
                  <span class="dash-list-badge">${f.total_livros} obras</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dash-box">
            <h3>Obras Mais Lidas</h3>
            <div class="dash-list">
              ${maisLidos.map(l => `
                <div class="dash-list-item">
                  <span>📖 ${this.escape(l.titulo)}</span>
                  <span class="dash-list-badge">${l.leituras} leituras</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="loading" style="color:#b91c1c">Erro ao carregar métricas: ${err.message}</div>`;
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
    document.getElementById('modal-leitor').classList.add('hidden');
    document.getElementById('modal-novo-livro').classList.add('hidden');
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
      if (!resLivro.ok) throw new Error(dataLivro.erro || 'Falha ao cadastrar');

      this.mostrarToast(`"${titulo}" adicionado com sucesso ao acervo!`);
      this.fecharModais();
      e.target.reset();
      this.carregarLivros();
    } catch (err) {
      this.mostrarToast('Erro ao cadastrar livro: ' + err.message);
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

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&amp;lt;')
      .replace(/>/g, '&amp;gt;')
      .replace(/"/g, '&amp;quot;');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  app.init();
});
