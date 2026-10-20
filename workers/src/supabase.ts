// ============================================================
// Supabase (PostgREST) — backend alternativo de leitura.
//
// Ativação: DB_BACKEND=supabase + SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// (secrets do Worker). Se o Supabase falhar, as rotas caem para a D1.
//
// ⚠️  Apenas metadados e URLs externas. Nenhum ficheiro é armazenado.
// ============================================================

export interface SupabaseConfig {
  url: string;
  key: string;
}

type Params = Record<string, string | number | boolean | undefined | null>;

export function obterConfigSupabase(env: any): SupabaseConfig | null {
  const url = env?.SUPABASE_URL;
  const key = env?.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: String(url).replace(/\/+$/, ''), key: String(key) };
}

/** Só usa Supabase quando explicitamente configurado. */
export function backendSupabase(env: any): boolean {
  return String(env?.DB_BACKEND || 'd1').toLowerCase() === 'supabase' && !!obterConfigSupabase(env);
}

function limparTermo(termo?: string): string | null {
  if (!termo) return null;
  const t = String(termo).trim().replace(/[%_,()*'"\\]/g, '');
  return t || null;
}

/** Valores com vírgulas/parênteses precisam de aspas no filtro do PostgREST. */
function valorEq(valor: string): string {
  const s = String(valor);
  return /[,()]/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s;
}

class Rest {
  constructor(private cfg: SupabaseConfig) {}

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    return {
      apikey: this.cfg.key,
      Authorization: `Bearer ${this.cfg.key}`,
      'Content-Type': 'application/json',
      ...extra
    };
  }

  async get<T = any>(
    tabela: string,
    params: Params = {},
    comContagem = false
  ): Promise<{ data: T[]; total: number | null }> {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    }
    const res = await fetch(`${this.cfg.url}/rest/v1/${tabela}?${qs.toString()}`, {
      headers: this.headers(comContagem ? { Prefer: 'count=exact' } : {})
    });
    if (!res.ok) throw new Error(`Supabase ${tabela}: ${res.status} ${await res.text()}`);

    const data = (await res.json()) as T[];
    let total: number | null = null;
    if (comContagem) {
      const cr = res.headers.get('content-range');
      if (cr && cr.includes('/')) {
        const t = cr.split('/')[1];
        total = t === '*' ? null : Number(t);
      }
    }
    return { data, total };
  }

  /** Percorre todas as páginas (PostgREST limita a 1000 linhas por pedido). */
  async getTodos<T = any>(tabela: string, params: Params = {}, pagina = 1000, max = 50000): Promise<T[]> {
    const todos: T[] = [];
    for (let offset = 0; offset < max; offset += pagina) {
      const { data } = await this.get<T>(tabela, { ...params, limit: pagina, offset });
      todos.push(...data);
      if (data.length < pagina) break;
    }
    return todos;
  }

  async primeira<T = any>(tabela: string, params: Params = {}): Promise<T | null> {
    const { data } = await this.get<T>(tabela, { ...params, limit: 1 });
    return data[0] ?? null;
  }

  async rpc<T = any>(fn: string, args: Record<string, any> = {}): Promise<T> {
    const res = await fetch(`${this.cfg.url}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(args)
    });
    if (!res.ok) throw new Error(`Supabase rpc ${fn}: ${res.status} ${await res.text()}`);
    const txt = await res.text();
    return (txt ? JSON.parse(txt) : null) as T;
  }
}

export interface FiltrosLivros {
  page: number;
  limit: number;
  busca?: string;
  categoria?: string;
  autor?: string;
  idioma?: string;
  licenca?: string;
  fonte?: string;
  formato?: string;
}

export class RepoSupabase {
  private api: Rest;

  constructor(cfg: SupabaseConfig) {
    this.api = new Rest(cfg);
  }

  // ── Dashboard ─────────────────────────────────────────────
  async dashboard() {
    const [stats, contadores, maisLidos, fontes] = await Promise.all([
      this.api.get('estatisticas', { select: 'chave,valor' }),
      this.api.get('contadores', { select: 'dimensao,chave,rotulo,total', order: 'total.desc' }),
      this.api.get('livros_api', {
        select: 'id,titulo,leituras,licenca,capa_url,autor_nome,categoria_nome',
        order: 'leituras.desc,titulo.asc',
        limit: 5
      }),
      this.api.get('fontes', { select: 'id,slug,nome,url_base', ativa: 'eq.1' })
    ]);

    const mapa: Record<string, number> = {};
    for (const r of stats.data as any[]) mapa[r.chave] = Number(r.valor);

    // Projeto criado mas ainda sem migração: deixar a rota cair para a D1.
    if (!stats.data.length) throw new Error('Supabase sem agregados (migração não executada)');

    const cs = contadores.data as any[];
    const grupo = (dim: string) => cs.filter((r) => r.dimensao === dim);

    const listaFontes = (fontes.data as any[])
      .map((f) => {
        const c = cs.find((r) => r.dimensao === 'fonte' && r.chave === String(f.id));
        return { ...f, total_livros: c ? Number(c.total) : 0 };
      })
      .sort((a, b) => b.total_livros - a.total_livros || String(a.nome).localeCompare(String(b.nome)));

    return {
      resumo: {
        total_livros: mapa.total_livros ?? 0,
        total_leituras: mapa.total_leituras ?? 0,
        total_autores: mapa.total_autores ?? 0,
        total_categorias: mapa.total_categorias ?? 0,
        total_cursos: mapa.total_cursos ?? 0,
        total_fontes: mapa.total_fontes ?? 0
      },
      formatos: grupo('formato').map((r) => ({ formato: r.chave, total: Number(r.total) })),
      licencas: grupo('licenca').map((r) => ({ licenca: r.chave, total: Number(r.total) })),
      idiomas: grupo('idioma').map((r) => ({ idioma: r.chave, total: Number(r.total) })),
      areas: grupo('categoria').map((r) => ({ area: r.rotulo || r.chave, total: Number(r.total) })),
      fontes: listaFontes,
      mais_lidos: maisLidos.data
    };
  }

  // ── Livros ────────────────────────────────────────────────
  private async resolverCategoria(valor?: string): Promise<{ id: number | null; inexistente: boolean }> {
    if (!valor) return { id: null, inexistente: false };
    if (/^\d+$/.test(valor)) return { id: Number(valor), inexistente: false };
    const cat = await this.api.primeira('categorias', { select: 'id', nome: `eq.${valorEq(valor)}` });
    return cat ? { id: Number(cat.id), inexistente: false } : { id: null, inexistente: true };
  }

  private async totalLivros(args: Record<string, any>, semFiltros: boolean): Promise<number> {
    if (semFiltros) {
      const row = await this.api.primeira('estatisticas', { select: 'valor', chave: 'eq.total_livros' });
      if (row) return Number(row.valor);
      throw new Error('Supabase sem agregados (migração não executada)');
    }
    const n = await this.api.rpc<number>('contar_livros', args);
    return Number(n) || 0;
  }

  async livros(op: FiltrosLivros) {
    const offset = (op.page - 1) * op.limit;
    const busca = limparTermo(op.busca);

    const cat = await this.resolverCategoria(op.categoria);
    if (cat.inexistente) return this.paginaVazia(op);

    const args = {
      p_busca: busca,
      p_categoria: cat.id,
      p_autor: op.autor && /^\d+$/.test(op.autor) ? Number(op.autor) : null,
      p_idioma: op.idioma || null,
      p_licenca: op.licenca || null,
      p_fonte: limparTermo(op.fonte)?.toLowerCase() ?? null,
      p_formato: op.formato ? op.formato.toLowerCase() : null
    };

    const semFiltros = !busca && !cat.id && !args.p_autor && !args.p_idioma &&
      !args.p_licenca && !args.p_fonte && !args.p_formato;

    const [linhas, total] = await Promise.all([
      this.api.rpc<any[]>('buscar_livros', { ...args, p_limit: op.limit, p_offset: offset }),
      this.totalLivros(args, semFiltros)
    ]);

    const mapa = await this.linksDe((linhas || []).map((l) => l.id));
    for (const l of linhas || []) l.links = mapa[l.id] || [];

    return {
      page: op.page,
      pagina: op.page,
      limit: op.limit,
      limite: op.limit,
      total,
      total_pages: Math.ceil(total / op.limit),
      total_paginas: Math.ceil(total / op.limit),
      data: linhas || []
    };
  }

  private paginaVazia(op: FiltrosLivros) {
    return {
      page: op.page, pagina: op.page,
      limit: op.limit, limite: op.limit,
      total: 0, total_pages: 0, total_paginas: 0,
      data: []
    };
  }

  private async linksDe(ids: number[]): Promise<Record<number, any[]>> {
    if (!ids.length) return {};
    const { data } = await this.api.get('links_livros', {
      select: 'livro_id,id,formato,url,tamanho_bytes,link_externo',
      livro_id: `in.(${ids.join(',')})`,
      order: 'id.asc'
    });
    const mapa: Record<number, any[]> = {};
    for (const l of data as any[]) {
      if (!mapa[l.livro_id]) mapa[l.livro_id] = [];
      mapa[l.livro_id].push(l);
    }
    return mapa;
  }

  async livro(id: string | number) {
    const livro = await this.api.primeira<any>('livros_api', { id: `eq.${id}` });
    if (!livro) return null;
    const mapa = await this.linksDe([Number(livro.id)]);
    const conteudo = await this.api.primeira<any>('livros', {
      select: 'conteudo_texto',
      id: `eq.${id}`
    });
    return {
      ...livro,
      conteudo_texto: conteudo?.conteudo_texto ?? null,
      links: mapa[Number(livro.id)] || []
    };
  }

  async link(livroId: string | number, linkId: string | number) {
    return this.api.primeira('links_livros', {
      select: 'url,formato',
      id: `eq.${linkId}`,
      livro_id: `eq.${livroId}`
    });
  }

  /** Recalcula estatisticas/contadores no Postgres (service_role). */
  async recalcularEstatisticas() {
    await this.api.rpc('recalcular_estatisticas');
  }

  /** Incremento atómico no Postgres (sem read-modify-write). */
  async registrarLeitura(id: string | number) {
    await this.api.rpc('incrementar_leitura', { p_id: Number(id) });
  }

  async conteudoTexto(id: string | number): Promise<string | null> {
    const row = await this.api.primeira<any>('livros', { select: 'conteudo_texto', id: `eq.${id}` });
    return row?.conteudo_texto ?? null;
  }

  // ── Dimensões ─────────────────────────────────────────────
  async categorias() {
    const [cats, cont] = await Promise.all([
      this.api.getTodos('categorias', { select: 'id,nome,descricao,criado_em', order: 'nome.asc' }),
      this.api.getTodos('contadores', { select: 'chave,total', dimensao: 'eq.categoria' })
    ]);
    if (!cats.length) throw new Error('Supabase sem categorias (migração não executada)');
    const mapa = new Map((cont as any[]).map((c) => [String(c.chave), Number(c.total)]));
    return (cats as any[]).map((c) => ({ ...c, total_livros: mapa.get(String(c.id)) ?? 0 }));
  }

  async fontes() {
    const [fontes, cont] = await Promise.all([
      this.api.getTodos('fontes', { select: 'id,slug,nome,tipo,url_base,ativa', ativa: 'eq.1', order: 'id.asc' }),
      this.api.getTodos('contadores', { select: 'chave,total', dimensao: 'eq.fonte' })
    ]);
    if (!fontes.length) throw new Error('Supabase sem fontes (migração não executada)');
    const mapa = new Map((cont as any[]).map((c) => [String(c.chave), Number(c.total)]));
    return (fontes as any[]).map((f) => ({ ...f, total_livros: mapa.get(String(f.id)) ?? 0 }));
  }

  // ── Cursos ────────────────────────────────────────────────
  private filtrosCursos(q: Record<string, string | undefined>, somenteRoadmap = false): { params: Params; grupos: string[] } {
    const params: Params = { select: '*', order: 'area.asc,titulo.asc' };
    const grupos: string[] = [];

    if (somenteRoadmap) params.tipo = 'eq.roadmap';
    else if (q.tipo) params.tipo = `eq.${valorEq(q.tipo)}`;

    if (q.area) params.area = `eq.${valorEq(q.area)}`;
    if (q.nivel) params.nivel = `eq.${valorEq(q.nivel)}`;
    if (q.licenca) params.licenca = `eq.${valorEq(q.licenca)}`;

    const plataforma = q.plataforma?.trim();
    if (plataforma) params.plataforma = `ilike.*${limparTermo(plataforma)}*`;
    else if (q.fonte && /guiadeti|guia de ti/i.test(q.fonte)) params.plataforma = 'ilike.*Guia de TI*';

    if (q.youtube === '1' || q.youtube === 'true' ||
        (plataforma && plataforma.toLowerCase() === 'youtube')) {
      params.plataforma = 'ilike.*YouTube*';
    }

    if (q.certificado === 'gratuito' || q.certificado === '1' || q.certificado === 'true') {
      grupos.push('descricao.ilike.*certifica*,plataforma.ilike.*certifica*');
    }

    const termo = limparTermo(q.busca);
    if (termo) {
      grupos.push(`titulo.ilike.*${termo}*,descricao.ilike.*${termo}*,plataforma.ilike.*${termo}*`);
    }

    if (q.excluir_roadmaps === '1' || q.excluir_roadmaps === 'true') {
      grupos.push('tipo.neq.roadmap,tipo.is.null');
    }

    return { params, grupos };
  }

  private aplicarGrupos(params: Params, grupos: string[]): Params {
    if (grupos.length === 1) {
      params.or = `(${grupos[0]})`;
    } else if (grupos.length > 1) {
      params.and = `(${grupos.map((g) => `or(${g})`).join(',')})`;
    }
    return params;
  }

  async cursos(q: Record<string, string | undefined>) {
    const { params, grupos } = this.filtrosCursos(q);
    return this.api.getTodos('cursos', this.aplicarGrupos(params, grupos));
  }

  async roadmaps(q: Record<string, string | undefined>) {
    const { params, grupos } = this.filtrosCursos(q, true);
    return this.api.getTodos('cursos', this.aplicarGrupos(params, grupos));
  }

  async curso(id: string | number) {
    return this.api.primeira('cursos', { id: `eq.${id}` });
  }

  // ── Podcasts ──────────────────────────────────────────────
  async podcasts(q: Record<string, string | undefined> = {}) {
    const params: Params = { select: '*', ativo: 'eq.1', order: 'id.asc' };
    const categoria = limparTermo(q.categoria);
    if (categoria) params.categoria = `ilike.*${categoria}*`;
    const busca = limparTermo(q.busca);
    if (busca) params.or = `(titulo.ilike.*${busca}*,descricao.ilike.*${busca}*)`;
    return this.api.getTodos('podcasts_api', params);
  }

  async podcast(slugOuId: string) {
    const filtro = /^\d+$/.test(slugOuId) ? { id: `eq.${slugOuId}` } : { slug: `eq.${slugOuId}` };
    const show = await this.api.primeira<any>('podcasts_shows', {
      select: '*',
      ...filtro,
      ativo: 'eq.1'
    });
    if (!show) return null;
    const { data: episodios } = await this.api.get('podcasts_episodios', {
      select: '*',
      show_id: `eq.${show.id}`,
      order: 'numero.asc,publicado_em.desc'
    });
    return { ...show, episodios: episodios || [] };
  }

  async episodiosRecentes() {
    const { data } = await this.api.get('podcasts_episodios', {
      select: '*,show:podcasts_shows!inner(titulo,capa_url,slug,ativo)',
      'show.ativo': 'eq.1',
      order: 'publicado_em.desc,id.desc',
      limit: 20
    });
    return (data as any[]).map((e) => {
      const { show, ...resto } = e;
      return {
        ...resto,
        show_titulo: show?.titulo,
        show_capa_url: show?.capa_url,
        show_slug: show?.slug
      };
    });
  }

  async registrarReproducao(id: string | number) {
    await this.api.rpc('incrementar_reproducao', { p_id: Number(id) });
  }
}
