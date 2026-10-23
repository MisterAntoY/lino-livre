// Lino Livre — Sistema de internacionalização (i18n)
// Idiomas disponíveis: pt (pt-AO, base), pt-br (pt-BR), en, de, zh, fr
//
// Uso:
//   t('books.readOnline')            → texto estático
//   t('books.pageOf', {p: 1, t: 5})  → com placeholders {p} {t}
//   traduzirCategoria('Clássicos Brasileiros')
//   I18N.setLang('de')               → troca o idioma em tempo real

(function () {
  'use strict';

  const IDIOMAS = ['pt', 'pt-br', 'en', 'es', 'de', 'zh', 'fr'];
  const CHAVE_LS = 'lino_lang';

  const I18N = {
    lang: 'pt',
    dict: null,      // idioma ativo (com fallback para pt)
    base: null,      // dicionário pt (sempre carregado)
    carregado: false,
    ouvintes: [],

    idiomas() {
      // labels nos próprios idiomas (endônimos) — adicionar um idioma = novo arquivo em /locales
      return IDIOMAS.map(code => ({ code, label: LABELS_PADRAO[code] }));
    },

    async init() {
      // 1. dicionário base (pt) — garante fallback total
      this.base = await this.carregar('pt');

      // 2. idioma preferido
      const alvo = this.detectarIdioma();

      // 3. Português: o HTML já está escrito em pt. NÃO reescrever o DOM.
      //    Cada innerHTML em [data-i18n] força um novo paint e reinicia o LCP
      //    (o <p class="goal-subtitle"> era repintado ~530 ms depois do TTFB).
      if (alvo === 'pt') {
        this.lang = 'pt';
        this.dict = this.base;
        this.carregado = !!this.base;
        if (this.base) {
          this.montarSeletor();
          this.sincronizarSeletor();
        }
        return this.lang;
      }

      // 4. Outro idioma: carrega e aplica as traduções
      await this.carregarEAplicar(alvo);
      return this.lang;
    },

    // Noto Sans/Serif SC só é necessário em chinês. Carregá-lo no <head>
    // custava ~150 KiB de CSS não usado em 100% das visitas em pt/en/etc.
    garantirFontesIdioma(code) {
      if (code !== 'zh') return;
      if (document.getElementById('i18n-fontes-cjk')) return;

      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.gstatic.com';
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);

      const link = document.createElement('link');
      link.id = 'i18n-fontes-cjk';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;600&display=swap';
      document.head.appendChild(link);
    },

    detectarIdioma() {
      // 1. ?lang= na URL tem prioridade (links compartilhados por idioma)
      try {
        const url = new URL(window.location.href);
        const q = (url.searchParams.get('lang') || '').toLowerCase();
        if (IDIOMAS.includes(q)) {
          localStorage.setItem(CHAVE_LS, q);
          return q;
        }
      } catch (_) {}

      // 2. escolha salva pelo visitante
      try {
        const salvo = (localStorage.getItem(CHAVE_LS) || '').toLowerCase();
        if (IDIOMAS.includes(salvo)) return salvo;
      } catch (_) {}

      // 3. idioma do navegador — desligado por padrão (o site abre em português).
      //    Para ativar a detecção automática, descomente as linhas abaixo.
      // const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'pt';
      // const curto = String(nav).toLowerCase();
      // if (IDIOMAS.includes(curto)) return curto;
      // // fallback para prefixo de 2 letras (ex: pt-BR -> pt)
      // if (IDIOMAS.includes(curto.slice(0, 2))) return curto.slice(0, 2);

      return 'pt';
    },

    async carregar(code) {
      try {
        const res = await fetch(`/locales/${code}.json`, { cache: 'no-cache' });
        if (!res.ok) throw new Error(res.status);
        return await res.json();
      } catch (err) {
        console.warn(`[i18n] Falha ao carregar /locales/${code}.json:`, err.message);
        return null;
      }
    },

    async carregarEAplicar(code) {
      let d = code === 'pt' ? this.base : await this.carregar(code);
      if (!d) d = this.base;          // fallback
      if (!d) return;                 // nem pt carregou: nada a fazer

      this.lang = (d.meta && d.meta.code) || code;
      this.dict = d;
      this.carregado = true;

      this.garantirFontesIdioma(this.lang);
      this.aplicarDocumento();
      this.notificar();
    },

    async setLang(code) {
      if (!IDIOMAS.includes(code)) return;
      try { localStorage.setItem(CHAVE_LS, code); } catch (_) {}
      this.manterURL(code);
      await this.carregarEAplicar(code);
    },

    // mantém ?lang= na URL para que links compartilhados abram no idioma certo
    manterURL(code) {
      try {
        const url = new URL(window.location.href);
        if (code === 'pt') url.searchParams.delete('lang');
        else url.searchParams.set('lang', code);
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (_) {}
    },

    // ---------- consulta ----------
    // aceita tanto "books.error" (app.js) quanto "ui.books.error" (data-i18n)
    t(path, vars) {
      const d = this.dict || this.base;
      if (!d) return path;
      let s = this.buscarChave(d, path);
      if (typeof s !== 'string' && this.base) s = this.buscarChave(this.base, path);
      return typeof s === 'string' ? limparEmojis(interpolar(s, vars)) : path;
    },

    buscarChave(dicionario, path) {
      if (!dicionario) return undefined;
      let s = buscar(dicionario, path);
      if (typeof s !== 'string' && dicionario.ui) s = buscar(dicionario.ui, path);
      return s;
    },

    titulo() {
      const d = this.dict || this.base;
      return (d && d.title) || 'Lino Livre';
    },

    // sinopse do livro traduzida (chave = id do livro); cai para o texto do banco
    sinopse(id, padrao) {
      const d = this.dict || this.base;
      const mapa = d && d.synopses;
      if (mapa && mapa[String(id)]) return limparEmojis(mapa[String(id)]);
      if (this.base && this.base.synopses && this.base.synopses[String(id)]) return limparEmojis(this.base.synopses[String(id)]);
      return limparEmojis(padrao || '');
    },

    mapa(secao, chave, padrao) {
      const d = this.dict || this.base;
      const m = d && d.ui && d.ui[secao];
      if (m && Object.prototype.hasOwnProperty.call(m, chave)) return limparEmojis(m[chave]);
      if (this.base && this.base.ui && this.base.ui[secao] && this.base.ui[secao][chave] !== undefined) return limparEmojis(this.base.ui[secao][chave]);
      return limparEmojis(padrao !== undefined ? padrao : chave);
    },

    // ---------- aplicação no DOM ----------
    aplicarDocumento() {
      const d = this.dict || this.base;
      if (!d) return;

      const langHtml = (d.meta && d.meta.htmlLang) || this.lang;
      document.documentElement.setAttribute('lang', langHtml);
      document.title = this.titulo();

      // data-i18n="chave"          → textContent
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const txt = this.t(el.getAttribute('data-i18n'));
        // textos com placeholders dinâmicos ({p}, {a}...) são preenchidos pelo app.js
        if (/\{[a-zA-Z_]+\}/.test(txt)) return;
        // Não reescrever se o conteúdo já é idêntico: innerHTML igual gera
        // mutação de DOM + repaint, atrasando o LCP sem qualquer ganho visual.
        if (el.textContent === txt) return;
        el.innerHTML = txt;
      });

      // data-i18n-html="chave"     → innerHTML preservando marcação interna
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const html = this.t(el.getAttribute('data-i18n-html'));
        if (el.innerHTML === html) return;
        el.innerHTML = html;
      });

      // data-i18n-ph="chave"       → placeholder
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const v = this.t(el.getAttribute('data-i18n-ph'));
        if (el.getAttribute('placeholder') !== v) el.setAttribute('placeholder', v);
      });

      // data-i18n-title="chave"    → atributo title
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const v = this.t(el.getAttribute('data-i18n-title'));
        if (el.getAttribute('title') !== v) el.setAttribute('title', v);
      });

      // data-i18n-alt="chave"      → atributo alt
      document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const v = this.t(el.getAttribute('data-i18n-alt'));
        if (el.getAttribute('alt') !== v) el.setAttribute('alt', v);
      });

      // data-i18n-aria="chave"     → atributo aria-label
      document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const v = this.t(el.getAttribute('data-i18n-aria'));
        if (el.getAttribute('aria-label') !== v) el.setAttribute('aria-label', v);
      });

      this.montarSeletor();
      this.sincronizarSeletor();
    },

    // monta as opções do seletor a partir de IDIOMAS (adicionar idioma = só criar o JSON)
    montarSeletor() {
      const sel = document.getElementById('seletor-idioma');
      if (!sel || sel.dataset.montado === '1') return;
      sel.innerHTML = this.idiomas()
        .map(i => `<option value="${i.code}">${i.label}</option>`)
        .join('');
      sel.dataset.montado = '1';
    },

    sincronizarSeletor() {
      const sel = document.getElementById('seletor-idioma');
      if (sel) sel.value = this.lang;
    },

    // ---------- notificação ----------
    aoTrocar(fn) { this.ouvintes.push(fn); },
    notificar() { this.ouvintes.forEach(fn => { try { fn(this.lang); } catch (e) { console.error(e); } }); }
  };

  // ---------- helpers ----------
  function buscar(obj, path) {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, k) => (acc && typeof acc === 'object') ? acc[k] : undefined, obj);
  }

  function interpolar(s, vars) {
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
  }

  function limparEmojis(texto) {
    return String(texto).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{FE0E}\u{FE0F}\u{200D}]/gu, '');
  }

  const LABELS_PADRAO = { pt: 'Português (Angola)', 'pt-br': 'Português (Brasil)', en: 'English', es: 'Español', de: 'Deutsch', zh: '中文', fr: 'Français' };

  window.I18N = I18N;

  // atalho global — usado por index.html e por app.js
  window.t = function (path, vars) { return I18N.t(path, vars); };

  const LICENCAS_PADRAO = {
    'dominio-publico': 'Domínio Público',
    'cc0': 'CC0 (Dedicação Pública)',
    'cc-by': 'CC BY (Atribuição)',
    'cc-by-sa': 'CC BY-SA (Compartilha Igual)',
    'cc-by-nc': 'CC BY-NC (Não Comercial)',
    'outro': 'Acesso Externo Aberto'
  };

  window.traduzirCategoria = nome => I18N.mapa('categories', nome, nome);
  window.traduzirArea = nome => I18N.mapa('areas', nome, nome);
  window.traduzirNivel = nome => I18N.mapa('levels', nome, I18N.t('courses.levelDefault'));
  window.traduzirLicenca = chave => I18N.mapa('licenses', chave, LICENCAS_PADRAO[chave] || chave);
})();
