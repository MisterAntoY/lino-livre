// Aplicação Frontend - Plataforma de Distribuição de Livros Digitais

const app = {
  tabAtual: 'catalogo',
  tamanhoFonteLeitor: 18,
  livroAtualLeitura: null,
  cache: {
    categorias: [],
    autores: [],
    livros: []
  },

  async init() {
    this.configurarNavegacao();
    this.configurarFiltros();
    await this.carregarCategorias();
    await this.carregarAutores();
    await this.carregarCatalogo();
  },

  // ----------------------------------------------------
  // Navegação entre Tabs
  // ----------------------------------------------------
  configurarNavegacao() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.navegarParaTab(tab);
      });
    });
  },

  navegarParaTab(tab) {
    this.tabAtual = tab;

    // Atualiza botões da barra lateral
    document.querySelectorAll('.nav-item').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });

    // Atualiza painéis de conteúdo
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tab}`);
    });

    // Títulos da barra superior
    const titulos = {
      catalogo: { titulo: 'Catálogo de Livros Digitais', sub: 'Acesso livre e instantâneo para leitura online e download de e-books' },
      dashboard: { titulo: 'Métricas de Acesso & Distribuição', sub: 'Estatísticas de downloads, leituras online e engajamento escolar' },
      autores: { titulo: 'Autores', sub: 'Gestão de autores e dramaturgos no catálogo' },
      categorias: { titulo: 'Categorias & Gêneros', sub: 'Classificação temática do acervo digital' }
    };

    if (titulos[tab]) {
      document.getElementById('page-title').textContent = titulos[tab].titulo;
      document.getElementById('page-desc').textContent = titulos[tab].sub;
    }

    if (tab === 'catalogo') this.carregarCatalogo();
    if (tab === 'dashboard') this.carregarDashboard();
    if (tab === 'autores') this.carregarAutores();
    if (tab === 'categorias') this.carregarCategorias();
  },

  // ----------------------------------------------------
  // Filtros e Buscas
  // ----------------------------------------------------
  configurarFiltros() {
    const buscaLivro = document.getElementById('filtro-busca-livro');
    buscaLivro.addEventListener('input', () => this.debounce(() => this.carregarCatalogo(), 250)());

    document.getElementById('filtro-categoria-livro').addEventListener('change', () => this.carregarCatalogo());
    document.getElementById('filtro-autor-livro').addEventListener('change', () => this.carregarCatalogo());

    document.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.carregarCatalogo();
      });
    });
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  obterIdentificacaoAluno() {
    const nome = document.getElementById('global-aluno-nome')?.value?.trim();
    const turma = document.getElementById('global-aluno-turma')?.value?.trim();
    return {
      aluno_nome: nome || 'Aluno Escolar',
      aluno_turma: turma || 'Geral'
    };
  },

  // ----------------------------------------------------
  // Catálogo de Livros Digitais
  // ----------------------------------------------------
  async carregarCatalogo() {
    const grid = document.getElementById('grade-livros-digitais');
    try {
      const busca = document.getElementById('filtro-busca-livro').value;
      const categoriaId = document.getElementById('filtro-categoria-livro').value;
      const autorId = document.getElementById('filtro-autor-livro').value;
      const formatoBtn = document.querySelector('.seg-btn.active');
      const formato = formatoBtn ? formatoBtn.getAttribute('data-formato-filter') : '';

      let url = '/api/livros?';
      if (busca) url += `busca=${encodeURIComponent(busca)}&`;
      if (categoriaId) url += `categoria_id=${encodeURIComponent(categoriaId)}&`;
      if (autorId) url += `autor_id=${encodeURIComponent(autorId)}&`;
      if (formato) url += `formato=${encodeURIComponent(formato)}&`;

      const res = await fetch(url);
      const livros = await res.json();
      this.cache.livros = livros;

      if (livros.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-12">
            <p class="text-muted" style="font-size:1.1rem">Nenhum livro digital encontrado com os filtros aplicados.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = livros.map(livro => {
        const formatoClass = `badge-format-${livro.formato.toLowerCase()}`;
        const capaHtml = livro.capa_url 
          ? `<img src="${this.escapeHtml(livro.capa_url)}" alt="${this.escapeHtml(livro.titulo)}" class="book-cover-img" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'">`
          : `<div class="book-cover-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg></div>`;

        return `
          <article class="book-card">
            <div class="book-cover-wrap">
              ${capaHtml}
              <span class="badge-format ${formatoClass}">${livro.formato}</span>
              ${livro.categoria_nome ? `<span class="badge-category-chip">${this.escapeHtml(livro.categoria_nome)}</span>` : ''}
            </div>

            <div class="book-info">
              <h3 class="book-title">${this.escapeHtml(livro.titulo)}</h3>
              <p class="book-author">${this.escapeHtml(livro.autor_nome || 'Autor não informado')}</p>
              
              <p class="book-synopsis">${this.escapeHtml(livro.sinopse || 'Disponível para leitura digital e download integral.')}</p>

              <div class="book-meta">
                <span class="book-stat-item" title="Downloads realizados">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span id="card-dl-${livro.id}">${livro.downloads_count}</span> downloads
                </span>
                <span class="book-stat-item" title="Leituras online">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span id="card-lt-${livro.id}">${livro.leituras_count}</span> leituras
                </span>
              </div>

              <div class="book-actions">
                <button class="btn btn-primary btn-sm" onclick="app.lerLivro(${livro.id})">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Ler Online
                </button>
                <button class="btn btn-secondary btn-sm" onclick="app.baixarLivro(${livro.id})">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Baixar E-book
                </button>
              </div>

              <div class="book-edit-actions">
                <button class="btn btn-ghost btn-sm" onclick="app.abrirModalEditarLivro(${livro.id})">Editar</button>
                <button class="btn btn-ghost btn-sm text-red" onclick="app.removerLivro(${livro.id})">Excluir</button>
              </div>
            </div>
          </article>
        `;
      }).join('');
    } catch (err) {
      grid.innerHTML = `<div class="loading-state text-red">Erro ao carregar catálogo: ${err.message}</div>`;
      this.mostrarToast('Erro ao carregar catálogo digital: ' + err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Distribuição Digital: Leitura Online & Download
  // ----------------------------------------------------
  async lerLivro(id) {
    try {
      const aluno = this.obterIdentificacaoAluno();
      const res = await fetch(`/api/livros/${id}/ler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao abrir livro');

      const livro = data.livro;
      this.livroAtualLeitura = livro;

      document.getElementById('leitor-titulo').textContent = livro.titulo;
      document.getElementById('leitor-autor').textContent = `${livro.autor_nome || 'Autor não informado'} • ${livro.categoria_nome || 'Literatura'}`;
      
      const conteudoEl = document.getElementById('leitor-conteudo');
      conteudoEl.textContent = livro.conteudo_texto || 'Texto da obra disponível para leitura.';
      conteudoEl.style.fontSize = `${this.tamanhoFonteLeitor}px`;

      // Atualiza botão de download no leitor
      const btnDownload = document.getElementById('btn-leitor-download');
      btnDownload.onclick = () => this.baixarLivro(id);

      // Atualizar contador no card se visível
      const contadorLt = document.getElementById(`card-lt-${id}`);
      if (contadorLt) contadorLt.textContent = livro.leituras_count;

      document.getElementById('modal-leitor').classList.remove('hidden');
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  ajustarFonteLeitor(delta) {
    this.tamanhoFonteLeitor = Math.min(28, Math.max(14, this.tamanhoFonteLeitor + delta));
    const conteudoEl = document.getElementById('leitor-conteudo');
    if (conteudoEl) {
      conteudoEl.style.fontSize = `${this.tamanhoFonteLeitor}px`;
    }
  },

  async baixarLivro(id) {
    try {
      const aluno = this.obterIdentificacaoAluno();
      const res = await fetch(`/api/livros/${id}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao processar download');

      this.mostrarToast(`Download de "${data.titulo}" iniciado!`, 'success');

      // Atualizar contador no card se visível
      const contadorDl = document.getElementById(`card-dl-${id}`);
      if (contadorDl) contadorDl.textContent = data.total_downloads;

      // Abrir download do arquivo em nova janela/aba
      if (data.arquivo_url && data.arquivo_url !== '#') {
        const link = document.createElement('a');
        link.href = data.arquivo_url;
        link.target = '_blank';
        link.download = `${data.titulo}.${data.formato.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Dashboard de Métricas de Acesso Digital
  // ----------------------------------------------------
  async carregarDashboard() {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();

      document.getElementById('stat-titulos').textContent = data.resumo.total_titulos;
      document.getElementById('stat-downloads').textContent = data.resumo.total_downloads;
      document.getElementById('stat-leituras').textContent = data.resumo.total_leituras;
      document.getElementById('stat-engajamento').textContent = data.resumo.total_engajamento;

      // Tabela de acessos recentes
      const tbody = document.getElementById('tabela-ultimos-acessos');
      if (data.ultimos_acessos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Nenhum acesso registrado</td></tr>';
      } else {
        tbody.innerHTML = data.ultimos_acessos.map(a => `
          <tr>
            <td><strong>${this.escapeHtml(a.livro_titulo)}</strong></td>
            <td><span class="badge-format badge-format-${a.formato.toLowerCase()}" style="position:static">${a.formato}</span></td>
            <td>
              <span class="badge ${a.tipo_acesso === 'download' ? 'badge-download' : 'badge-leitura'}">
                ${a.tipo_acesso === 'download' ? 'Download' : 'Leitura Web'}
              </span>
            </td>
            <td>${this.escapeHtml(a.aluno_nome || 'Aluno')} ${a.aluno_turma ? `(${this.escapeHtml(a.aluno_turma)})` : ''}</td>
            <td>${this.formatarDataHora(a.criado_em)}</td>
          </tr>
        `).join('');
      }

      // Mais populares
      const listaMais = document.getElementById('lista-mais-populares');
      if (data.mais_populares.length === 0) {
        listaMais.innerHTML = '<p class="text-muted">Ainda não há dados suficientes.</p>';
      } else {
        listaMais.innerHTML = data.mais_populares.map(l => `
          <div class="top-book-item">
            <div>
              <span class="top-book-title">${this.escapeHtml(l.titulo)}</span>
              <div class="text-muted" style="font-size:0.75rem">${this.escapeHtml(l.autor_nome || '')}</div>
            </div>
            <span class="top-book-count">${l.total_acessos} acessos</span>
          </div>
        `).join('');
      }
    } catch (err) {
      this.mostrarToast('Erro ao carregar métricas: ' + err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Gestão de Livros Digitais (CRUD)
  // ----------------------------------------------------
  abrirModalNovoLivro() {
    this.fecharModais();
    document.getElementById('modal-livro-titulo').textContent = 'Publicar Novo E-book Digital';
    document.getElementById('livro-id').value = '';
    document.getElementById('livro-titulo').value = '';
    document.getElementById('livro-subtitulo').value = '';
    document.getElementById('livro-sinopse').value = '';
    document.getElementById('livro-ano').value = '';
    document.getElementById('livro-formato').value = 'PDF';
    document.getElementById('livro-arquivo-url').value = '';
    document.getElementById('livro-capa-url').value = '';
    document.getElementById('livro-conteudo-texto').value = '';

    this.popularSelectAutoresECategorias();
    document.getElementById('modal-livro').classList.remove('hidden');
  },

  async abrirModalEditarLivro(id) {
    try {
      const res = await fetch(`/api/livros/${id}`);
      const livro = await res.json();
      if (!res.ok) throw new Error(livro.erro);

      this.fecharModais();
      document.getElementById('modal-livro-titulo').textContent = 'Editar Livro Digital';
      document.getElementById('livro-id').value = livro.id;
      document.getElementById('livro-titulo').value = livro.titulo;
      document.getElementById('livro-subtitulo').value = livro.subtitulo || '';
      document.getElementById('livro-sinopse').value = livro.sinopse || '';
      document.getElementById('livro-ano').value = livro.ano_publicacao || '';
      document.getElementById('livro-formato').value = livro.formato || 'PDF';
      document.getElementById('livro-arquivo-url').value = livro.arquivo_url || '';
      document.getElementById('livro-capa-url').value = livro.capa_url || '';
      document.getElementById('livro-conteudo-texto').value = livro.conteudo_texto || '';

      this.popularSelectAutoresECategorias(livro.autor_id, livro.categoria_id);
      document.getElementById('modal-livro').classList.remove('hidden');
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  popularSelectAutoresECategorias(autorId = null, categoriaId = null) {
    const selAutor = document.getElementById('livro-autor-id');
    const selCat = document.getElementById('livro-categoria-id');

    selAutor.innerHTML = '<option value="">Sem autor selecionado</option>' + 
      this.cache.autores.map(a => `<option value="${a.id}" ${a.id == autorId ? 'selected' : ''}>${this.escapeHtml(a.nome)}</option>`).join('');

    selCat.innerHTML = '<option value="">Sem categoria</option>' + 
      this.cache.categorias.map(c => `<option value="${c.id}" ${c.id == categoriaId ? 'selected' : ''}>${this.escapeHtml(c.nome)}</option>`).join('');
  },

  async salvarLivro(e) {
    e.preventDefault();
    const id = document.getElementById('livro-id').value;
    const titulo = document.getElementById('livro-titulo').value;
    const subtitulo = document.getElementById('livro-subtitulo').value;
    const autorId = document.getElementById('livro-autor-id').value || null;
    const categoriaId = document.getElementById('livro-categoria-id').value || null;
    const formato = document.getElementById('livro-formato').value;
    const ano = document.getElementById('livro-ano').value;
    const arquivoUrl = document.getElementById('livro-arquivo-url').value;
    const capaUrl = document.getElementById('livro-capa-url').value;
    const sinopse = document.getElementById('livro-sinopse').value;
    const conteudoTexto = document.getElementById('livro-conteudo-texto').value;

    const payload = {
      titulo,
      subtitulo: subtitulo || null,
      autor_id: autorId,
      categoria_id: categoriaId,
      formato,
      ano_publicacao: ano ? parseInt(ano, 10) : null,
      arquivo_url: arquivoUrl || null,
      capa_url: capaUrl || null,
      sinopse: sinopse || null,
      conteudo_texto: conteudoTexto || null
    };

    try {
      const url = id ? `/api/livros/${id}` : '/api/livros';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar obra digital');

      this.mostrarToast(`Livro digital "${titulo}" salvo com sucesso!`, 'success');
      this.fecharModais();
      this.carregarCatalogo();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  async removerLivro(id) {
    if (!confirm('Deseja realmente remover esta obra digital do catálogo escolar?')) return;
    try {
      const res = await fetch(`/api/livros/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao remover');

      this.mostrarToast('Livro digital removido do catálogo!', 'success');
      this.carregarCatalogo();
      if (this.tabAtual === 'dashboard') this.carregarDashboard();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Autores
  // ----------------------------------------------------
  async carregarAutores() {
    try {
      const res = await fetch('/api/autores');
      const autores = await res.json();
      this.cache.autores = autores;

      const selFiltro = document.getElementById('filtro-autor-livro');
      const valAtual = selFiltro.value;
      selFiltro.innerHTML = '<option value="">Todos os Autores</option>' + 
        autores.map(a => `<option value="${a.id}" ${a.id == valAtual ? 'selected' : ''}>${this.escapeHtml(a.nome)}</option>`).join('');

      const tbody = document.getElementById('tabela-autores');
      if (autores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Nenhum autor cadastrado</td></tr>';
        return;
      }

      tbody.innerHTML = autores.map(a => `
        <tr>
          <td><strong>${this.escapeHtml(a.nome)}</strong></td>
          <td>${this.escapeHtml(a.nacionalidade || '—')}</td>
          <td><span class="text-muted" style="font-size:0.85rem">${this.escapeHtml(a.biografia || '—')}</span></td>
          <td><span class="badge" style="background:#e0f2fe; color:#0369a1">${a.total_livros || 0} obras digitais</span></td>
          <td>
            <div class="book-edit-actions">
              <button class="btn btn-sm btn-secondary" onclick="app.abrirModalEditarAutor(${a.id})">Editar</button>
              <button class="btn btn-sm btn-danger-outline" onclick="app.removerAutor(${a.id})">Excluir</button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      this.mostrarToast('Erro ao carregar autores: ' + err.message, 'error');
    }
  },

  abrirModalNovoAutor() {
    this.fecharModais();
    document.getElementById('modal-autor-titulo').textContent = 'Cadastrar Autor';
    document.getElementById('autor-id').value = '';
    document.getElementById('autor-nome').value = '';
    document.getElementById('autor-nacionalidade').value = '';
    document.getElementById('autor-biografia').value = '';
    document.getElementById('modal-autor').classList.remove('hidden');
  },

  abrirModalEditarAutor(id) {
    const autor = this.cache.autores.find(a => a.id === id);
    if (!autor) return;
    this.fecharModais();
    document.getElementById('modal-autor-titulo').textContent = 'Editar Autor';
    document.getElementById('autor-id').value = autor.id;
    document.getElementById('autor-nome').value = autor.nome;
    document.getElementById('autor-nacionalidade').value = autor.nacionalidade || '';
    document.getElementById('autor-biografia').value = autor.biografia || '';
    document.getElementById('modal-autor').classList.remove('hidden');
  },

  async salvarAutor(e) {
    e.preventDefault();
    const id = document.getElementById('autor-id').value;
    const nome = document.getElementById('autor-nome').value;
    const nacionalidade = document.getElementById('autor-nacionalidade').value;
    const biografia = document.getElementById('autor-biografia').value;

    const payload = { nome, nacionalidade: nacionalidade || null, biografia: biografia || null };

    try {
      const url = id ? `/api/autores/${id}` : '/api/autores';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar autor');

      this.mostrarToast(`Autor "${nome}" salvo!`, 'success');
      this.fecharModais();
      this.carregarAutores();
      this.carregarCatalogo();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  async removerAutor(id) {
    if (!confirm('Deseja excluir este autor? As obras digitais permanecerão no catálogo.')) return;
    try {
      const res = await fetch(`/api/autores/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao remover autor');

      this.mostrarToast('Autor removido com sucesso!', 'success');
      this.carregarAutores();
      this.carregarCatalogo();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Categorias
  // ----------------------------------------------------
  async carregarCategorias() {
    try {
      const res = await fetch('/api/categorias');
      const categorias = await res.json();
      this.cache.categorias = categorias;

      const selFiltro = document.getElementById('filtro-categoria-livro');
      const valAtual = selFiltro.value;
      selFiltro.innerHTML = '<option value="">Todas as Categorias</option>' + 
        categorias.map(c => `<option value="${c.id}" ${c.id == valAtual ? 'selected' : ''}>${this.escapeHtml(c.nome)}</option>`).join('');

      const tbody = document.getElementById('tabela-categorias');
      if (categorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">Nenhuma categoria cadastrada</td></tr>';
        return;
      }

      tbody.innerHTML = categorias.map(c => `
        <tr>
          <td><strong>${this.escapeHtml(c.nome)}</strong></td>
          <td><span class="text-muted" style="font-size:0.85rem">${this.escapeHtml(c.descricao || '—')}</span></td>
          <td><span class="badge" style="background:#f3e8ff; color:#7e22ce">${c.total_livros || 0} e-books</span></td>
          <td>
            <div class="book-edit-actions">
              <button class="btn btn-sm btn-secondary" onclick="app.abrirModalEditarCategoria(${c.id})">Editar</button>
              <button class="btn btn-sm btn-danger-outline" onclick="app.removerCategoria(${c.id})">Excluir</button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      this.mostrarToast('Erro ao carregar categorias: ' + err.message, 'error');
    }
  },

  abrirModalNovaCategoria() {
    this.fecharModais();
    document.getElementById('modal-cat-titulo').textContent = 'Cadastrar Nova Categoria';
    document.getElementById('categoria-id').value = '';
    document.getElementById('categoria-nome').value = '';
    document.getElementById('categoria-descricao').value = '';
    document.getElementById('modal-categoria').classList.remove('hidden');
  },

  abrirModalEditarCategoria(id) {
    const cat = this.cache.categorias.find(c => c.id === id);
    if (!cat) return;
    this.fecharModais();
    document.getElementById('modal-cat-titulo').textContent = 'Editar Categoria';
    document.getElementById('categoria-id').value = cat.id;
    document.getElementById('categoria-nome').value = cat.nome;
    document.getElementById('categoria-descricao').value = cat.descricao || '';
    document.getElementById('modal-categoria').classList.remove('hidden');
  },

  async salvarCategoria(e) {
    e.preventDefault();
    const id = document.getElementById('categoria-id').value;
    const nome = document.getElementById('categoria-nome').value;
    const descricao = document.getElementById('categoria-descricao').value;

    const payload = { nome, descricao: descricao || null };

    try {
      const url = id ? `/api/categorias/${id}` : '/api/categorias';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar categoria');

      this.mostrarToast(`Categoria "${nome}" salva!`, 'success');
      this.fecharModais();
      this.carregarCategorias();
      this.carregarCatalogo();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  async removerCategoria(id) {
    if (!confirm('Deseja excluir esta categoria? Os livros digitais permanecerão no catálogo.')) return;
    try {
      const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao remover categoria');

      this.mostrarToast('Categoria removida com sucesso!', 'success');
      this.carregarCategorias();
      this.carregarCatalogo();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Utilitários de Interface
  // ----------------------------------------------------
  fecharModais() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
  },

  mostrarToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensagem;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  },

  formatarDataHora(str) {
    if (!str) return '—';
    try {
      const d = new Date(str.replace(' ', 'T'));
      if (isNaN(d.getTime())) return str;
      return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch (_) {
      return str;
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
