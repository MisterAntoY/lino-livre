/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FASE 4 — FEDERAÇÃO GLOBAL DE BUSCA COM MOTOR DISTRIBUÍDO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Motor de busca federado que interroga múltiplos catálogos abertos em
 * paralelo e funde os resultados num único ranking.
 *
 * ARQUITETURA (motor distribuído)
 *
 *        ┌──────────────────────┐
 *        │  COORDENADOR (este)  │
 *        │  RRF + dedupe + rank │
 *        └───┬───┬───┬───┬──────┘
 *            │   │   │   │        fan-out paralelo
 *      ┌─────┘   │   │   └─────┐
 *      ▼         ▼   ▼         ▼
 *   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
 *   │ NÓ A │ │ NÓ B │ │ NÓ C │ │ NÓ D │   ← nós de busca (shards)
 *   │OL/IA │ │Gut/DB│ │Wik/CR│ │DOAB/…│
 *   └──────┘ └──────┘ └──────┘ └──────┘
 *
 * Fusão: Reciprocal Rank Fusion (RRF) — score = Σ 1/(k + rank), k = 60
 *   (técnica standard de busca federada; robusta a escalas diferentes
 *    de scoring entre catálogos)
 *
 * Robustez:
 *   • Timeout independente por upstream (um lento não bloqueia o resto)
 *   • Circuit breaker: upstream com falhas repetidas é posto de lado
 *   • Degradação graciosa: devolve resultados parciais + diagnóstico
 *   • Cache local com TTL para não repetir consultas
 *
 * AGENTS.md: apenas METADADOS. Nenhum ficheiro de obra é transferido.
 */

const CACHE_TTL_MS = 5 * 60 * 1000;   // 5 min
const RRF_K = 60;
const TIMEOUT_PADRAO_MS = 6000;

// ── Cache LRU simples (in-memory) ─────────────────────────────────────────
class CacheLRU {
  constructor(max = 500) { this.max = max; this.mapa = new Map(); }
  get(chave) {
    const e = this.mapa.get(chave);
    if (!e) return null;
    if (Date.now() > e.expira) { this.mapa.delete(chave); return null; }
    this.mapa.delete(chave); this.mapa.set(chave, e); // move para o fim (LRU)
    return e.valor;
  }
  set(chave, valor, ttl = CACHE_TTL_MS) {
    if (this.mapa.size >= this.max) this.mapa.delete(this.mapa.keys().next().value);
    this.mapa.set(chave, { valor, expira: Date.now() + ttl });
  }
}

// ── Circuit breaker por upstream ───────────────────────────────────────────
class CircuitBreaker {
  constructor(limiteFalhas = 2, cooldownMs = 120_000) {
    this.limite = limiteFalhas; this.cooldown = cooldownMs; this.estados = new Map();
  }
  permite(id) {
    const e = this.estados.get(id);
    if (!e) return true;
    if (e.aberto && Date.now() > e.abreAte) { this.estados.set(id, { falhas: 0, aberto: false }); return true; }
    return !e.aberto;
  }
  registarFalha(id) {
    const e = this.estados.get(id) || { falhas: 0, aberto: false };
    e.falhas++;
    if (e.falhas >= this.limite) { e.aberto = true; e.abreAte = Date.now() + this.cooldown; }
    this.estados.set(id, e);
  }
  registarSucesso(id) { this.estados.set(id, { falhas: 0, aberto: false }); }
  estado(id) { return this.estados.get(id) || { falhas: 0, aberto: false }; }
}

// ── Upstreams (catálogos abertos) ──────────────────────────────────────────
/**
 * Cada upstream define:
 *   id, nome, peso, timeout, url(termo, limite), normalizar(doc) → resultado
 */
const UPSTREAMS = [
  {
    id: 'openlibrary',
    nome: 'Open Library',
    peso: 1.15,
    url: (q, lim) => `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${lim}&fields=title,author_name,first_publish_year,key,cover_i,ia,language,subject`,
    normalizar: (d) => ({
      id: `ol:${d.key}`,
      titulo: d.title,
      autor: Array.isArray(d.author_name) ? d.author_name[0] : d.author_name,
      ano: d.first_publish_year,
      idioma: Array.isArray(d.language) ? d.language[0] : d.language,
      fonte: 'Open Library',
      url: d.ia && d.ia.length
        ? `https://archive.org/details/${d.ia[0]}`
        : `https://openlibrary.org${d.key}`,
      capa: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : null,
      sinopse: Array.isArray(d.subject) && d.subject.length ? d.subject.slice(0, 3).join(', ') : null,
      licenca: 'dominio-publico'
    })
  },
  {
    id: 'gutenberg',
    nome: 'Project Gutenberg',
    peso: 1.10,
    // gutendex é a API JSON comunitária recomendada pelo Project Gutenberg.
    // NOTA: a página de pesquisa HTML do Gutenberg proíbe explicitamente scraping
    // ("DON'T USE THIS PAGE FOR SCRAPING"), por isso NÃO é consultada.
    timeoutMult: 2.2,
    url: (q, lim) => `https://gutendex.com/books?search=${encodeURIComponent(q)}&page=1`,
    normalizar: (d) => ({
      id: `pg:${d.id}`,
      titulo: d.title,
      autor: d.authors && d.authors.length ? d.authors.map(a => a.name).join(', ') : null,
      ano: null,
      idioma: Array.isArray(d.languages) ? d.languages[0] : null,
      fonte: 'Project Gutenberg',
      url: d.formats && d.formats['text/html'] ? d.formats['text/html'] : `https://www.gutenberg.org/ebooks/${d.id}`,
      capa: d.formats && d.formats['image/jpeg'] ? d.formats['image/jpeg'] : null,
      sinopse: d.subjects ? d.subjects.subjects.slice(0, 3).join(', ') : null,
      licenca: 'dominio-publico'
    })
  },
  {
    id: 'internetarchive',
    nome: 'Internet Archive',
    peso: 1.05,
    url: (q, lim) => `https://archive.org/advancedsearch.php?q=${encodeURIComponent(`(${q}) AND mediatype:texts`)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=year&fl[]=language&rows=${lim}&page=1&output=json`,
    normalizar: (d) => ({
      id: `ia:${d.identifier}`,
      titulo: d.title,
      autor: Array.isArray(d.creator) ? d.creator[0] : d.creator,
      ano: d.year ? parseInt(d.year, 10) : null,
      idioma: Array.isArray(d.language) ? d.language[0] : d.language,
      fonte: 'Internet Archive',
      url: `https://archive.org/details/${d.identifier}`,
      capa: null,
      sinopse: null,
      licenca: 'dominio-publico'
    })
  },
  {
    id: 'wikidata',
    nome: 'Wikidata',
    peso: 0.85,
    url: (q, lim) => `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=pt&uselang=pt&type=item&format=json&limit=${lim}&origin=*`,
    normalizar: (d) => ({
      id: `wd:${d.id}`,
      titulo: d.label,
      autor: d.description || null,
      ano: null,
      idioma: null,
      fonte: 'Wikidata',
      url: `https://www.wikidata.org/wiki/${d.id}`,
      capa: null,
      sinopse: d.description,
      licenca: 'cc-by-sa'
    })
  },
  {
    id: 'crossref',
    nome: 'Crossref',
    peso: 0.80,
    url: (q, lim) => `https://api.crossref.org/works?query=${encodeURIComponent(q)}&rows=${lim}&select=title,author,issued,URL,subject,type&mailto=contato@linolivre.org`,
    normalizar: (d) => ({
      id: `cr:${d.DOI || d.URL}`,
      titulo: Array.isArray(d.title) ? d.title[0] : d.title,
      autor: d.author && d.author.length
        ? [d.author[0].given, d.author[0].family].filter(Boolean).join(' ')
        : null,
      ano: d.issued && d.issued['date-parts'] ? d.issued['date-parts'][0][0] : null,
      idioma: null,
      fonte: 'Crossref',
      url: d.URL,
      capa: null,
      sinopse: Array.isArray(d.subject) ? d.subject.slice(0, 3).join(', ') : null,
      licenca: 'outro'
    })
  },
  {
    // OpenAIRE — Graph de.publicações europeias (inclui livros/monografias OAPEN)
    id: 'openaire',
    nome: 'OpenAIRE (Graph Europeu)',
    peso: 0.90,
    url: (q, lim) => `https://api.openaire.eu/search/publications?keywords=${encodeURIComponent(q)}&size=${lim}&format=json`,
    normalizar: (d) => {
      // o OpenAIRE envolve o resultado em metadata['oaf:entity']['oaf:result']
      const ent = d?.metadata?.['oaf:entity']?.['oaf:result']
        || d?.metadata?.['oaf:entity']?.result
        || d?.metadata?.result
        || d
        || {};
      const txt = (v) => (v && typeof v === 'object') ? (v.$ ?? v['#text'] ?? null) : (v ?? null);
      const desc = txt(ent.description);
      // URL: children.instance.webresource.url
      const inst = ent?.children?.instance;
      const insts = Array.isArray(inst) ? inst : (inst ? [inst] : []);
      let url = null;
      for (const i of insts) {
        const u = i?.webresource?.url;
        const cand = Array.isArray(u) ? u[0] : u;
        const s = txt(cand);
        if (s) { url = s; break; }
      }
      if (!url && d?.children?.[0]?.url?.[0]?.['$']) url = d.children[0].url[0]['$'];
      if (!url) {
        const pid = txt(ent?.pid);
        url = pid && /^https?:/i.test(pid) ? pid : (pid ? `https://doi.org/${pid}` : null);
      }
      return {
        id: `oa:${txt(ent?.pid) || ent?.originalId?.[0]?.['$'] || d?.id || ''}`,
        titulo: txt(ent.title),
        autor: txt(ent.creator),
        ano: ent.dateofacceptance ? parseInt(String(ent.dateofacceptance).slice(0, 4), 10) : null,
        idioma: txt(ent.language),
        fonte: 'OpenAIRE',
        url,
        capa: null,
        sinopse: desc,
        licenca: 'cc-by'
      };
    }
  },
  {
    id: 'openalex',
    nome: 'OpenAlex',
    peso: 0.75,
    url: (q, lim) => `https://api.openalex.org/works?search=${encodeURIComponent(q)}&per-page=${lim}&mailto=contato@linolivre.org`,
    normalizar: (d) => ({
      id: `oa:${d.id}`,
      titulo: d.title || d.display_name,
      autor: d.authorships && d.authorships.length
        ? d.authorships.map(a => a.author?.display_name).filter(Boolean).slice(0, 2).join(', ')
        : null,
      ano: d.publication_year,
      idioma: d.language,
      fonte: 'OpenAlex',
      url: d.primary_location && d.primary_location.landing_page_url
        ? d.primary_location.landing_page_url
        : `https://openalex.org/${d.id}`,
      capa: null,
      sinopse: null,
      licenca: 'outro'
    })
  }
];

// ── Normalização para chaves de dedupe ────────────────────────────────────
/** Remove acentos, normaliza espaços e pontuação para deduplicar obras. */
function chaveNormalizada(texto) {
  if (!texto) return '';
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // remove diacríticos combinantes
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')  // só letras, números e espaços
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Motor federado ─────────────────────────────────────────────────────────
class MotorFederado {
  constructor(opcoes = {}) {
    this.timeoutMs = opcoes.timeoutMs ?? TIMEOUT_PADRAO_MS;
    this.limitePorUpstream = opcoes.limitePorUpstream ?? 20;
    this.limiteFinal = opcoes.limiteFinal ?? 50;
    this.cache = new CacheLRU(opcoes.cacheMax ?? 500);
    this.cb = new CircuitBreaker();
    this.upstreams = UPSTREAMS;
    this.ultimaConsulta = new Map(); // rate-limit por upstream
    this.minIntervaloMs = opcoes.minIntervaloMs ?? 250;
  }

  _upstreamPermitido(u) {
    if (!this.cb.permite(u.id)) return false;
    const ultimo = this.ultimaConsulta.get(u.id) || 0;
    return (Date.now() - ultimo) >= this.minIntervaloMs;
  }

  async _consultar(upstream, termo, timeoutMs) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const url = upstream.url(termo, this.limitePorUpstream);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          'User-Agent': 'LinoLivre-Fase4-Federacao/4.0 (biblioteca digital aberta; educacional)',
          'Accept': 'application/json'
        }
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      this.cb.registarSucesso(upstream.id);
      this.ultimaConsulta.set(upstream.id, Date.now());
      return json;
    } catch (err) {
      clearTimeout(timer);
      this.cb.registarFalha(upstream.id);
      this.ultimaConsulta.set(upstream.id, Date.now());
      throw err;
    }
  }

  /** Extrai o array de documentos da resposta de cada upstream. */
  _extrairDocs(upstream, json) {
    switch (upstream.id) {
      case 'openlibrary': return json.docs || [];
      case 'gutenberg': return json.results || [];
      case 'internetarchive': return json.response?.docs || [];
      case 'wikidata': return json.search || [];
      case 'crossref': return json.message?.items || [];
      case 'openaire': return json.response?.results?.result || json.result || [];
      case 'openalex': return json.results || [];
      default: return [];
    }
  }

  /**
   * Executa uma consulta federada.
   * @returns {{total, resultados, upstreams, duracao_ms, degradado}}
   */
  async buscar(termo, opcoes = {}) {
    const inicio = Date.now();
    const q = String(termo || '').trim();
    if (!q) {
      return { total: 0, resultados: [], upstreams: [], duracao_ms: 0, degradado: false };
    }

    const cacheKey = `${q}|${this.limitePorUpstream}|${this.limiteFinal}`;
    const emCache = this.cache.get(cacheKey);
    if (emCache) {
      return { ...emCache, cache: true };
    }

    // Fan-out paralelo — o nó de coordination distribui pelos upstreams
    const tarefas = this.upstreams.map(async (u) => {
      if (!this._upstreamPermitido(u)) {
        const st = this.cb.estado(u.id);
        return {
          upstream: u.id, nome: u.nome,
          estado: st.aberto ? 'ignorado (breaker aberto)' : 'ignorado (rate-limit)',
          total: 0, ms: 0, erro: null,
          resultados: []
        };
      }
      const t0 = Date.now();
      try {
        const timeout = Math.round((opcoes.timeoutMs ?? this.timeoutMs) * (u.timeoutMult || 1));
        const json = await this._consultar(u, q, timeout);
        const docs = this._extrairDocs(u, json);
        const resultados = [];
        for (const d of docs) {
          try {
            const n = u.normalizar(d);
            if (n && n.titulo) resultados.push({ ...n, upstream: u.id, upstreamNome: u.nome, peso: u.peso });
          } catch (_) {}
        }
        return {
          upstream: u.id, nome: u.nome, estado: 'ok',
          total: resultados.length, ms: Date.now() - t0, erro: null,
          resultados
        };
      } catch (err) {
        return {
          upstream: u.id, nome: u.nome,
          estado: err.name === 'AbortError' ? 'timeout' : 'erro',
          total: 0, ms: Date.now() - t0,
          erro: String(err.message).slice(0, 120),
          resultados: []
        };
      }
    });

    const relatorios = await Promise.all(tarefas);

    // ── Fusão por Reciprocal Rank Fusion (RRF) ──
    const fusao = new Map();
    for (const rel of relatorios) {
      for (let i = 0; i < rel.resultados.length; i++) {
        const r = rel.resultados[i];
        const rank = i + 1;
        const pontos = (1 / (RRF_K + rank)) * (r.peso || 1);

        // Chave de dedupe: título normalizado + autor normalizado
        const chave = `${chaveNormalizada(r.titulo).slice(0, 90)}|${chaveNormalizada(r.autor).slice(0, 60)}`;

        const existente = fusao.get(chave);
        if (existente) {
          existente.score += pontos;
          existente.fontes.push(r.upstream);
          if (!existente.capa && r.capa) existente.capa = r.capa;
          if (!existente.ano && r.ano) existente.ano = r.ano;
          if (!existente.sinopse && r.sinopse) existente.sinopse = r.sinopse;
          if (!existente.idioma && r.idioma) existente.idioma = r.idioma;
        } else {
          fusao.set(chave, {
            id: r.id,
            titulo: r.titulo,
            autor: r.autor,
            ano: r.ano,
            idioma: r.idioma,
            fonte: r.fonte,
            fontes: [r.upstream],
            url: r.url,
            capa: r.capa,
            sinopse: r.sinopse,
            licenca: r.licenca,
            score: pontos
          });
        }
      }
    }

    // ── Segunda passagem: fusão por título equivalente (edições distintas) ──
    //  Ex.: "Os Lusíadas" (com autor) e "Os Lusiadas" (sem autor) → mesma obra
    const porTitulo = new Map();
    for (const r of fusao.values()) {
      const k = chaveNormalizada(r.titulo);
      if (!k) continue;
      const atual = porTitulo.get(k);
      if (!atual) { porTitulo.set(k, r); continue; }
      // une o de maior score e absorve o outro
      const [principal, secundario] = atual.score >= r.score ? [atual, r] : [r, atual];
      principal.score += secundario.score * 0.5;
      principal.fontes = [...new Set([...principal.fontes, ...secundario.fontes])];
      if (!principal.capa && secundario.capa) principal.capa = secundario.capa;
      if (!principal.ano && secundario.ano) principal.ano = secundario.ano;
      if (!principal.sinopse && secundario.sinopse) principal.sinopse = secundario.sinopse;
      if (!principal.idioma && secundario.idioma) principal.idioma = secundario.idioma;
      if (!principal.autor && secundario.autor) principal.autor = secundario.autor;
      porTitulo.set(k, principal);
      fusao.delete([...fusao.keys()].find(kk => fusao.get(kk) === secundario));
    }

    const resultados = [...porTitulo.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, this.limiteFinal)
      .map(r => ({ ...r, score: Number(r.score.toFixed(6)) }));

    const degradado = relatorios.some(r => r.estado !== 'ok');
    const resposta = {
      total: resultados.length,
      resultados,
      upstreams: relatorios.map(({ resultados: _r, ...resto }) => resto),
      duracao_ms: Date.now() - inicio,
      degradado
    };

    this.cache.set(cacheKey, resposta);
    return resposta;
  }

  /** Diagnóstico do estado de cada upstream. */
  diagnostico() {
    return this.upstreams.map(u => ({
      id: u.id,
      nome: u.nome,
      peso: u.peso,
      estado: this.cb.estado(u.id).aberto ? 'aberto (breaker)' : 'fechado',
      falhas: this.cb.estado(u.id).falhas
    }));
  }
}

module.exports = {
  MotorFederado,
  UPSTREAMS,
  CacheLRU,
  CircuitBreaker,
  RRF_K
};
