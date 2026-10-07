// Aplicação Biblioteca Digital - Versão Simplificada

const app = {
  livros: [],
  categoriaAtiva: '',
  tamanhoFonte: 18,
  livroAtual: null,

  async init() {
    await this.carregarLivros();
  },

  async carregarLivros() {
    try {
      const res = await fetch('/api/livros');
      this.livros = await res.json();
      this.filtrar();
    } catch (err) {
      document.getElementById('grade-livros').innerHTML = 
        `<div class="loading" style="color:#b91c1c">Erro ao carregar acervo: ${err.message}</div>`;
    }
  },

  filtrar() {
    const termo = (document.getElementById('filtro-busca').value || '').toLowerCase().trim();
    
    const filtrados = this.livros.filter(livro => {
      const matchTexto = !termo || 
        livro.titulo.toLowerCase().includes(termo) || 
        (livro.autor_nome && livro.autor_nome.toLowerCase().includes(termo)) ||
        (livro.sinopse && livro.sinopse.toLowerCase().includes(termo));

      const matchCat = !this.categoriaAtiva || (livro.categoria_nome === this.categoriaAtiva);

      return matchTexto && matchCat;
    });

    this.renderizar(filtrados);
  },

  filtrarPorCategoria(categoria) {
    this.categoriaAtiva = categoria;
    
    // Atualiza pílulas visuais
    document.querySelectorAll('.pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-categoria') === categoria);
    });

    this.filtrar();
  },

  renderizar(lista) {
    const grid = document.getElementById('grade-livros');

    if (lista.length === 0) {
      grid.innerHTML = `<div class="loading">Nenhum livro encontrado para os filtros selecionados.</div>`;
      return;
    }

    grid.innerHTML = lista.map(l => {
      const capaUrl = l.capa_url || '/capas/dom_casmurro.jpg';

      return `
        <article class="book-card">
          <div class="book-cover-container">
            <img src="${capaUrl}" alt="Capa original de ${this.escape(l.titulo)}" class="book-cover" onerror="this.src='/capas/dom_casmurro.jpg'">
            <span class="badge-format">${l.formato}</span>
          </div>

          <div class="book-details">
            <h3 class="book-title">${this.escape(l.titulo)}</h3>
            <p class="book-author">${this.escape(l.autor_nome || 'Autor Clássico')} ${l.ano_publicacao ? `• ${l.ano_publicacao}` : ''}</p>
            
            <p class="book-synopsis">${this.escape(l.sinopse || 'Disponível para leitura online e download gratuito.')}</p>

            <div class="book-stats">
              <span>⬇ <strong id="dl-${l.id}">${l.downloads_count}</strong> downloads</span>
              <span>📖 <strong id="lt-${l.id}">${l.leituras_count}</strong> leituras</span>
            </div>

            <div class="book-actions">
              <button class="btn btn-primary" onclick="app.lerLivro(${l.id})">
                📖 Ler Online
              </button>
              <button class="btn btn-secondary" onclick="app.baixarLivro(${l.id})">
                ⬇ Baixar
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  async lerLivro(id) {
    try {
      const res = await fetch(`/api/livros/${id}/ler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aluno_nome: 'Leitor Online' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      const livro = data.livro;
      this.livroAtual = livro;

      document.getElementById('leitor-titulo').textContent = livro.titulo;
      document.getElementById('leitor-autor').textContent = `${livro.autor_nome || 'Autor'} (${livro.formato})`;
      
      const textoEl = document.getElementById('leitor-texto');
      textoEl.textContent = livro.conteudo_texto || 'Texto da obra disponível para leitura.';
      textoEl.style.fontSize = `${this.tamanhoFonte}px`;

      const btnDl = document.getElementById('btn-leitor-download');
      btnDl.onclick = () => this.baixarLivro(id);

      // Atualiza contador em tela
      const elCont = document.getElementById(`lt-${id}`);
      if (elCont) elCont.textContent = livro.leituras_count;

      document.getElementById('modal-leitor').classList.remove('hidden');
    } catch (err) {
      this.mostrarToast('Erro ao abrir obra: ' + err.message);
    }
  },

  alterarFonte(delta) {
    this.tamanhoFonte = Math.min(28, Math.max(14, this.tamanhoFonte + delta));
    const textoEl = document.getElementById('leitor-texto');
    if (textoEl) textoEl.style.fontSize = `${this.tamanhoFonte}px`;
  },

  async baixarLivro(id) {
    try {
      const res = await fetch(`/api/livros/${id}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aluno_nome: 'Leitor Online' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      this.mostrarToast(`Download de "${data.titulo}" iniciado!`);

      // Atualiza contador na tela
      const elCont = document.getElementById(`dl-${id}`);
      if (elCont) elCont.textContent = data.total_downloads;

      // Inicia download
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
      this.mostrarToast('Erro no download: ' + err.message);
    }
  },

  abrirModalNovoLivro() {
    this.fecharModais();
    document.getElementById('modal-novo-livro').classList.remove('hidden');
  },

  async salvarNovoLivro(e) {
    e.preventDefault();
    const titulo = document.getElementById('novo-titulo').value.trim();
    const autor = document.getElementById('novo-autor').value.trim();
    const formato = document.getElementById('novo-formato').value;
    const ano = document.getElementById('novo-ano').value;
    const arquivoUrl = document.getElementById('novo-arquivo-url').value.trim();
    const sinopse = document.getElementById('novo-sinopse').value.trim();
    const conteudo = document.getElementById('novo-conteudo').value.trim();

    try {
      // Cadastra ou reutiliza autor
      let autorId = null;
      if (autor) {
        const resAutores = await fetch('/api/autores');
        const autores = await resAutores.json();
        const autExistente = autores.find(a => a.nome.toLowerCase() === autor.toLowerCase());
        if (autExistente) {
          autorId = autExistente.id;
        } else {
          const resNovoAutor = await fetch('/api/autores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: autor })
          });
          const novoAut = await resNovoAutor.json();
          autorId = novoAut.id;
        }
      }

      const res = await fetch('/api/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          autor_id: autorId,
          formato,
          ano_publicacao: ano ? parseInt(ano, 10) : null,
          arquivo_url: arquivoUrl || null,
          capa_url: '/capas/dom_casmurro.jpg',
          sinopse: sinopse || null,
          conteudo_texto: conteudo || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      this.mostrarToast(`Livro "${titulo}" adicionado com sucesso!`);
      this.fecharModais();
      await this.carregarLivros();
    } catch (err) {
      this.mostrarToast(err.message);
    }
  },

  fecharModais() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
  },

  mostrarToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3500);
  },

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
