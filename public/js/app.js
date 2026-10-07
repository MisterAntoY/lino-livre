// Aplicação Frontend - Gestão de Biblioteca Escolar

const app = {
  tabAtual: 'dashboard',
  cache: {
    categorias: [],
    autores: [],
    livros: [],
    emprestimos: []
  },

  async init() {
    this.configurarNavegacao();
    this.configurarFiltros();
    await this.carregarCategorias();
    await this.carregarAutores();
    await this.carregarDashboard();
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

    document.getElementById('btn-novo-emprestimo-topo').addEventListener('click', () => {
      this.abrirModalNovoEmprestimo();
    });
  },

  navegarParaTab(tab) {
    this.tabAtual = tab;

    // Atualiza botões
    document.querySelectorAll('.nav-item').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });

    // Atualiza painéis
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tab}`);
    });

    // Títulos da barra superior
    const titulos = {
      dashboard: { titulo: 'Painel de Controle', sub: 'Visão geral do acervo e movimentações' },
      emprestimos: { titulo: 'Controle de Empréstimos', sub: 'Histórico de empréstimos, devoluções e pendências' },
      livros: { titulo: 'Acervo de Livros', sub: 'Catálogo de obras escolares e controle de estoque' },
      autores: { titulo: 'Autores', sub: 'Gestão de autores de obras literárias' },
      categorias: { titulo: 'Categorias e Gêneros', sub: 'Classificação temática do acervo' }
    };

    if (titulos[tab]) {
      document.getElementById('page-title').textContent = titulos[tab].titulo;
      document.getElementById('page-desc').textContent = titulos[tab].sub;
    }

    // Carregar dados da aba selecionada
    if (tab === 'dashboard') this.carregarDashboard();
    if (tab === 'emprestimos') this.carregarEmprestimos();
    if (tab === 'livros') this.carregarLivros();
    if (tab === 'autores') this.carregarAutores();
    if (tab === 'categorias') this.carregarCategorias();
  },

  // ----------------------------------------------------
  // Filtros e Buscas
  // ----------------------------------------------------
  configurarFiltros() {
    // Filtro de empréstimos
    const buscaEmp = document.getElementById('filtro-busca-emp');
    buscaEmp.addEventListener('input', () => this.debounce(() => this.carregarEmprestimos(), 300)());

    document.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.carregarEmprestimos();
      });
    });

    // Filtros de livros
    const buscaLivro = document.getElementById('filtro-busca-livro');
    buscaLivro.addEventListener('input', () => this.debounce(() => this.carregarLivros(), 300)());

    document.getElementById('filtro-categoria-livro').addEventListener('change', () => this.carregarLivros());
    document.getElementById('filtro-autor-livro').addEventListener('change', () => this.carregarLivros());
    document.getElementById('filtro-apenas-disponiveis').addEventListener('change', () => this.carregarLivros());

    // Atualização de data estimada no modal de empréstimo
    document.getElementById('emp-dias-prazo').addEventListener('change', (e) => {
      const dias = parseInt(e.target.value, 10);
      const data = new Date();
      data.setDate(data.getDate() + dias);
      document.getElementById('emp-data-prevista').value = data.toISOString().split('T')[0];
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

  // ----------------------------------------------------
  // Dashboard
  // ----------------------------------------------------
  async carregarDashboard() {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();

      document.getElementById('stat-titulos').textContent = data.acervo.total_titulos;
      document.getElementById('stat-exemplares').textContent = `${data.acervo.total_exemplares} exemplares no acervo`;
      document.getElementById('stat-disponiveis').textContent = data.acervo.total_disponiveis;
      document.getElementById('stat-ativos').textContent = data.emprestimos.ativos;
      document.getElementById('stat-emprestados').textContent = `${data.acervo.total_emprestados} livros emprestados`;
      document.getElementById('stat-atrasados').textContent = data.emprestimos.atrasados;

      // Badge no menu lateral
      const badgeAtrasados = document.getElementById('badge-atrasados-sidebar');
      if (data.emprestimos.atrasados > 0) {
        badgeAtrasados.textContent = data.emprestimos.atrasados;
        badgeAtrasados.classList.remove('hidden');
      } else {
        badgeAtrasados.classList.add('hidden');
      }

      // Tabela de últimas movimentações
      const tabelaUltimos = document.getElementById('lista-ultimos-emprestimos');
      if (data.ultimos_emprestimos.length === 0) {
        tabelaUltimos.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">Nenhum empréstimo registrado</td></tr>';
      } else {
        tabelaUltimos.innerHTML = data.ultimos_emprestimos.map(e => `
          <tr>
            <td><strong>${this.escapeHtml(e.livro_titulo)}</strong></td>
            <td>${this.escapeHtml(e.aluno_nome)}</td>
            <td>${this.formatarData(e.data_devolucao_prevista)}</td>
            <td><span class="badge badge-${e.status}">${e.status}</span></td>
          </tr>
        `).join('');
      }

      // Lista de mais emprestados
      const listaMais = document.getElementById('lista-mais-emprestados');
      if (data.mais_emprestados.length === 0) {
        listaMais.innerHTML = '<p class="text-muted">Ainda não há dados suficientes.</p>';
      } else {
        listaMais.innerHTML = data.mais_emprestados.map(l => `
          <div class="top-book-item">
            <span class="top-book-title">${this.escapeHtml(l.titulo)}</span>
            <span class="top-book-count">${l.total_emprestimos} ${l.total_emprestimos === 1 ? 'empréstimo' : 'empréstimos'}</span>
          </div>
        `).join('');
      }
    } catch (err) {
      this.mostrarToast('Erro ao carregar dashboard: ' + err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Empréstimos
  // ----------------------------------------------------
  async carregarEmprestimos() {
    try {
      const busca = document.getElementById('filtro-busca-emp').value;
      const statusBtn = document.querySelector('.seg-btn.active');
      const status = statusBtn ? statusBtn.getAttribute('data-status-filter') : '';

      let url = '/api/emprestimos?';
      if (status) url += `status=${encodeURIComponent(status)}&`;
      if (busca) url += `busca=${encodeURIComponent(busca)}&`;

      const res = await fetch(url);
      const emprestimos = await res.json();
      this.cache.emprestimos = emprestimos;

      const tbody = document.getElementById('tabela-emprestimos');
      if (emprestimos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Nenhum empréstimo encontrado</td></tr>';
        return;
      }

      tbody.innerHTML = emprestimos.map(e => `
        <tr>
          <td><span class="text-muted">#${e.id}</span></td>
          <td>
            <strong>${this.escapeHtml(e.livro_titulo)}</strong>
            ${e.livro_isbn ? `<div class="text-muted" style="font-size:0.75rem">ISBN: ${this.escapeHtml(e.livro_isbn)}</div>` : ''}
          </td>
          <td>
            ${this.escapeHtml(e.aluno_nome)}
            <div class="text-muted" style="font-size:0.75rem">Mat: ${this.escapeHtml(e.aluno_matricula)}</div>
          </td>
          <td>${this.formatarData(e.data_emprestimo)}</td>
          <td>
            ${this.formatarData(e.data_devolucao_prevista)}
            ${e.data_devolucao_real ? `<div class="text-muted" style="font-size:0.75rem">Devolvido: ${this.formatarData(e.data_devolucao_real)}</div>` : ''}
          </td>
          <td><span class="badge badge-${e.status}">${e.status}</span></td>
          <td>
            <div class="action-buttons">
              ${e.status !== 'devolvido' ? `
                <button class="btn btn-sm btn-success" onclick="app.devolverLivro(${e.id})">Devolver</button>
                <button class="btn btn-sm btn-secondary" onclick="app.renovarEmprestimo(${e.id})">+7 Dias</button>
              ` : `
                <span class="text-muted" style="font-size:0.8rem">Concluído</span>
              `}
            </div>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      this.mostrarToast('Erro ao carregar empréstimos: ' + err.message, 'error');
    }
  },

  abrirModalNovoEmprestimo() {
    this.fecharModais();
    const select = document.getElementById('emp-livro-id');
    select.innerHTML = '<option value="">Carregando livros disponíveis...</option>';

    // Buscar livros com estoque
    fetch('/api/livros?apenas_disponiveis=true')
      .then(res => res.json())
      .then(livros => {
        if (livros.length === 0) {
          select.innerHTML = '<option value="">Nenhum livro disponível em estoque</option>';
          return;
        }
        select.innerHTML = '<option value="">Selecione um livro...</option>' + 
          livros.map(l => `<option value="${l.id}">${this.escapeHtml(l.titulo)} (${l.quantidade_disponivel} disponíveis)</option>`).join('');
      });

    // Calcular data estimada inicial (+14 dias)
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 14);
    document.getElementById('emp-data-prevista').value = hoje.toISOString().split('T')[0];

    document.getElementById('emp-aluno-nome').value = '';
    document.getElementById('emp-aluno-matricula').value = '';
    document.getElementById('emp-observacoes').value = '';

    document.getElementById('modal-emprestimo').classList.remove('hidden');
  },

  async salvarEmprestimo(e) {
    e.preventDefault();
    const livroId = document.getElementById('emp-livro-id').value;
    const alunoNome = document.getElementById('emp-aluno-nome').value;
    const alunoMatricula = document.getElementById('emp-aluno-matricula').value;
    const dataPrevista = document.getElementById('emp-data-prevista').value;
    const observacoes = document.getElementById('emp-observacoes').value;

    try {
      const res = await fetch('/api/emprestimos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          livro_id: livroId,
          aluno_nome: alunoNome,
          aluno_matricula: alunoMatricula,
          data_devolucao_prevista: dataPrevista || null,
          observacoes: observacoes || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao realizar empréstimo');

      this.mostrarToast('Empréstimo registrado com sucesso!', 'success');
      this.fecharModais();
      this.carregarDashboard();
      if (this.tabAtual === 'emprestimos') this.carregarEmprestimos();
      if (this.tabAtual === 'livros') this.carregarLivros();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  async devolverLivro(id) {
    if (!confirm('Deseja confirmar a devolução deste livro e retornar o exemplar ao estoque?')) return;
    try {
      const res = await fetch(`/api/emprestimos/${id}/devolver`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao devolver');

      this.mostrarToast(data.mensagem || 'Livro devolvido com sucesso!', 'success');
      this.carregarDashboard();
      this.carregarEmprestimos();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  async renovarEmprestimo(id) {
    try {
      const res = await fetch(`/api/emprestimos/${id}/renovar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dias_extras: 7 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao renovar');

      this.mostrarToast(data.mensagem || 'Empréstimo renovado!', 'success');
      this.carregarDashboard();
      this.carregarEmprestimos();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Livros
  // ----------------------------------------------------
  async carregarLivros() {
    try {
      const busca = document.getElementById('filtro-busca-livro').value;
      const categoriaId = document.getElementById('filtro-categoria-livro').value;
      const autorId = document.getElementById('filtro-autor-livro').value;
      const apenasDisponiveis = document.getElementById('filtro-apenas-disponiveis').checked;

      let url = '/api/livros?';
      if (busca) url += `busca=${encodeURIComponent(busca)}&`;
      if (categoriaId) url += `categoria_id=${encodeURIComponent(categoriaId)}&`;
      if (autorId) url += `autor_id=${encodeURIComponent(autorId)}&`;
      if (apenasDisponiveis) url += `apenas_disponiveis=true&`;

      const res = await fetch(url);
      const livros = await res.json();
      this.cache.livros = livros;

      const tbody = document.getElementById('tabela-livros');
      if (livros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Nenhum livro encontrado</td></tr>';
        return;
      }

      tbody.innerHTML = livros.map(l => {
        const disponivel = l.quantidade_disponivel > 0;
        return `
          <tr>
            <td><strong>${this.escapeHtml(l.titulo)}</strong></td>
            <td>${this.escapeHtml(l.autor_nome || 'Não informado')}</td>
            <td>${this.escapeHtml(l.categoria_nome || 'Geral')}</td>
            <td>${l.ano_publicacao || '—'}</td>
            <td><code style="font-size:0.8rem">${this.escapeHtml(l.isbn || '—')}</code></td>
            <td>
              <span class="stock-tag ${disponivel ? 'available' : 'depleted'}">
                ● ${l.quantidade_disponivel} / ${l.quantidade_total}
                ${!disponivel ? '(Esgotado)' : ''}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-secondary" onclick="app.abrirModalEditarLivro(${l.id})">Editar</button>
                <button class="btn btn-sm btn-danger-outline" onclick="app.removerLivro(${l.id})">Excluir</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      this.mostrarToast('Erro ao carregar livros: ' + err.message, 'error');
    }
  },

  abrirModalNovoLivro() {
    this.fecharModais();
    document.getElementById('modal-livro-titulo').textContent = 'Cadastrar Novo Livro';
    document.getElementById('livro-id').value = '';
    document.getElementById('livro-titulo').value = '';
    document.getElementById('livro-isbn').value = '';
    document.getElementById('livro-ano').value = '';
    document.getElementById('livro-quantidade').value = '1';

    this.popularSelectAutoresECategorias();
    document.getElementById('modal-livro').classList.remove('hidden');
  },

  abrirModalEditarLivro(id) {
    const livro = this.cache.livros.find(l => l.id === id);
    if (!livro) return;

    this.fecharModais();
    document.getElementById('modal-livro-titulo').textContent = 'Editar Livro';
    document.getElementById('livro-id').value = livro.id;
    document.getElementById('livro-titulo').value = livro.titulo;
    document.getElementById('livro-isbn').value = livro.isbn || '';
    document.getElementById('livro-ano').value = livro.ano_publicacao || '';
    document.getElementById('livro-quantidade').value = livro.quantidade_total;

    this.popularSelectAutoresECategorias(livro.autor_id, livro.categoria_id);
    document.getElementById('modal-livro').classList.remove('hidden');
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
    const autorId = document.getElementById('livro-autor-id').value || null;
    const categoriaId = document.getElementById('livro-categoria-id').value || null;
    const isbn = document.getElementById('livro-isbn').value;
    const ano = document.getElementById('livro-ano').value;
    const quantidade = document.getElementById('livro-quantidade').value;

    const payload = {
      titulo,
      autor_id: autorId,
      categoria_id: categoriaId,
      isbn: isbn || null,
      ano_publicacao: ano || null,
      quantidade_total: parseInt(quantidade, 10)
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
      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar livro');

      this.mostrarToast(`Livro "${titulo}" salvo com sucesso!`, 'success');
      this.fecharModais();
      this.carregarLivros();
      this.carregarDashboard();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  async removerLivro(id) {
    if (!confirm('Deseja realmente excluir este livro do catálogo?')) return;
    try {
      const res = await fetch(`/api/livros/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao remover livro');

      this.mostrarToast('Livro removido do catálogo com sucesso!', 'success');
      this.carregarLivros();
      this.carregarDashboard();
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

      // Atualiza dropdown nos filtros de livros
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
          <td><span class="badge" style="background:#e0f2fe; color:#0369a1">${a.total_livros || 0} obras</span></td>
          <td>
            <div class="action-buttons">
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
    document.getElementById('modal-autor-titulo').textContent = 'Cadastrar Novo Autor';
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
      this.carregarDashboard();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  async removerAutor(id) {
    if (!confirm('Deseja excluir este autor? Os livros dele permanecerão no catálogo.')) return;
    try {
      const res = await fetch(`/api/autores/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao remover autor');

      this.mostrarToast('Autor removido com sucesso!', 'success');
      this.carregarAutores();
      this.carregarLivros();
      this.carregarDashboard();
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

      // Atualiza dropdown de categorias no filtro de livros
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
          <td><span class="badge" style="background:#f3e8ff; color:#7e22ce">${c.total_livros || 0} livros</span></td>
          <td>
            <div class="action-buttons">
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
      this.carregarDashboard();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  async removerCategoria(id) {
    if (!confirm('Deseja excluir esta categoria? Os livros continuarão no catálogo.')) return;
    try {
      const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao remover categoria');

      this.mostrarToast('Categoria removida com sucesso!', 'success');
      this.carregarCategorias();
      this.carregarLivros();
      this.carregarDashboard();
    } catch (err) {
      this.mostrarToast(err.message, 'error');
    }
  },

  // ----------------------------------------------------
  // Utilitários de Interface e Toasts
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
    }, 3800);
  },

  formatarData(str) {
    if (!str) return '—';
    const partes = str.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return str;
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
