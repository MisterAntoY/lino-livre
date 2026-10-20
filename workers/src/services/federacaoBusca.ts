/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FASE 4 — FEDERAÇÃO GLOBAL DE BUSCA (Cloudflare Worker / Hono)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Motor de busca federado executado na borda (edge) do Cloudflare.
 * Interroga múltiplos catálogos abertos em paralelo e funde os resultados
 * num ranking único por Reciprocal Rank Fusion (RRF).
 *
 *        ┌──────────────────────┐
 *        │  COORDENADOR (edge)  │
 *        │  RRF + dedupe + rank │
 *        └───┬───┬───┬───┬──────┘
 *            │   │   │   │        fan-out paralelo (Promise.all)
 *      ┌─────┘   │   │   └─────┐
 *      ▼         ▼   ▼         ▼
 *   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
 *   │ NÓ A │ │ NÓ B │ │ NÓ C │ │ NÓ D │
 *   │OL/IA │ │Gut/DB│ │Wik/CR│ │OA/OAx│
 *   └──────┘ └──────┘ └──────┘ └──────┘
 *
 * Notas:
 *  • RRF (k=60) é robusto a escalas de scoring diferentes entre catálogos
 *  • Timeout independente por upstream: um lento não bloqueia o resto
 *  • Degradação graciosa: devolve resultados parciais + diagnóstico
 *  • AGENTS.md: apenas METADADOS — nenhum ficheiro de obra é transferido
 */

import { DOMINIOS_PROIBIDOS } from '../utils/urlValidator';

// ── Tipos ──────────────────────────────────────────────────────────────────
export interface ResultadoFederado {
  id: string;
  titulo: string;
  autor: string | null;
  ano: number | null;
  idioma: string | null;
  fonte: string;
  fontes: string[];
  url: string | null;
  capa: string | null;
  sinopse: string | null;
  licenca: string;
  score: number;
}

export interface RelatorioUpstream {
  upstream: string;
  nome: string;
  estado: string;
  total: number;
  ms: number;
  erro: string | null;
}

interface Upstream {
  id: string;
  nome: string;
  peso: number;
  timeoutMult?: number;
  url: (q: string, lim: number) => string;
  normalizar: (d: any) => Partial<ResultadoFederado> | null;
}

const RRF_K = 60;
const TIMEOUT_PADRAO_MS = 5000;
const USER_AGENT = 'LinoLivre-Fase4-Federacao/4.0 (biblioteca digital aberta; educacional)';

// ── Utilitários ────────────────────────────────────────────────────────────
function chaveNormalizada(texto: string | null | undefined): string {
  if (!texto) return '';
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function txt(v: any): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'object') return v['$'] ?? v['#text'] ?? null;
  return String(v);
}

function limitar<T>(itens: T[], n: number): T[] {
  return itens.slice(0, n);
}

// ── Upstreams (catálogos abertos) ──────────────────────────────────────────
const UPSTREAMS: Upstream[] = [
  {
    id: 'openlibrary',
    nome: 'Open Library',
    peso: 1.15,
    url: (q, lim) =>
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${lim}` +
      `&fields=title,author_name,first_publish_year,key,cover_i,ia,language,subject`,
    normalizar: (d: any) => ({
      id: `ol:${d.key}`,
      titulo: d.title,
      autor: Array.isArray(d.author_name) ? d.author_name[0] : d.author_name ?? null,
      ano: d.first_publish_year ?? null,
      idioma: Array.isArray(d.language) ? d.language[0] : d.language ?? null,
      fonte: 'Open Library',
      url: d.ia && d.ia.length ? `https://archive.org/details/${d.ia[0]}` : `https://openlibrary.org${d.key}`,
      capa: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : null,
      sinopse: Array.isArray(d.subject) && d.subject.length ? d.subject.slice(0, 3).join(', ') : null,
      licenca: 'dominio-publico'
    })
  },
  {
    id: 'gutenberg',
    nome: 'Project Gutenberg',
    peso: 1.10,
    // A página HTML de pesquisa do Gutenberg proíbe scraping → usa-se a API
    // JSON comunitária gutendex, que é a via recomendada oficialmente.
    timeoutMult: 2.0,
    url: (q) => `https://gutendex.com/books?search=${encodeURIComponent(q)}&page=1`,
    normalizar: (d: any) => ({
      id: `pg:${d.id}`,
      titulo: d.title,
      autor: d.authors && d.authors.length ? d.authors.map((a: any) => a.name).join(', ') : null,
      ano: null,
      idioma: Array.isArray(d.languages) ? d.languages[0] : null,
      fonte: 'Project Gutenberg',
      url: d.formats?.['text/html'] ?? `https://www.gutenberg.org/ebooks/${d.id}`,
      capa: d.formats?.['image/jpeg'] ?? null,
      sinopse: d.subjects?.subjects?.slice(0, 3).join(', ') ?? null,
      licenca: 'dominio-publico'
    })
  },
  {
    id: 'internetarchive',
    nome: 'Internet Archive',
    peso: 1.05,
    url: (q, lim) =>
      `https://archive.org/advancedsearch.php?q=${encodeURIComponent(`(${q}) AND mediatype:texts`)}` +
      `&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=year&fl[]=language&rows=${lim}&page=1&output=json`,
    normalizar: (d: any) => ({
      id: `ia:${d.identifier}`,
      titulo: d.title,
      autor: Array.isArray(d.creator) ? d.creator[0] : d.creator ?? null,
      ano: d.year ? parseInt(d.year, 10) : null,
      idioma: Array.isArray(d.language) ? d.language[0] : d.language ?? null,
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
    url: (q, lim) =>
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}` +
      `&language=pt&uselang=pt&type=item&format=json&limit=${lim}&origin=*`,
    normalizar: (d: any) => ({
      id: `wd:${d.id}`,
      titulo: d.label,
      autor: d.description ?? null,
      ano: null,
      idioma: null,
      fonte: 'Wikidata',
      url: `https://www.wikidata.org/wiki/${d.id}`,
      capa: null,
      sinopse: d.description ?? null,
      licenca: 'cc-by-sa'
    })
  },
  {
    id: 'crossref',
    nome: 'Crossref',
    peso: 0.80,
    url: (q, lim) =>
      `https://api.crossref.org/works?query=${encodeURIComponent(q)}&rows=${lim}` +
      `&select=title,author,issued,URL,subject,type&mailto=contato@linolivre.org`,
    normalizar: (d: any) => ({
      id: `cr:${d.DOI || d.URL}`,
      titulo: Array.isArray(d.title) ? d.title[0] : d.title,
      autor: d.author?.length ? [d.author[0].given, d.author[0].family].filter(Boolean).join(' ') : null,
      ano: d.issued?.['date-parts']?.[0]?.[0] ?? null,
      idioma: null,
      fonte: 'Crossref',
      url: d.URL,
      capa: null,
      sinopse: Array.isArray(d.subject) ? d.subject.slice(0, 3).join(', ') : null,
      licenca: 'outro'
    })
  },
  {
    id: 'openaire',
    nome: 'OpenAIRE (Graph Europeu)',
    peso: 0.90,
    url: (q, lim) =>
      `https://api.openaire.eu/search/publications?keywords=${encodeURIComponent(q)}&size=${lim}&format=json`,
    normalizar: (d: any) => {
      const ent = d?.metadata?.['oaf:entity']?.['oaf:result']
        ?? d?.metadata?.['oaf:entity']?.result
        ?? d?.metadata?.result
        ?? d
        ?? {};
      const desc = txt(ent.description);
      const inst = ent?.children?.instance;
      const insts = Array.isArray(inst) ? inst : (inst ? [inst] : []);
      let url: string | null = null;
      for (const i of insts) {
        const u = i?.webresource?.url;
        const cand = Array.isArray(u) ? u[0] : u;
        const s = txt(cand);
        if (s) { url = s; break; }
      }
      if (!url) {
        const pid = txt(ent?.pid);
        url = pid ? (pid.startsWith('http') ? pid : `https://doi.org/${pid}`) : null;
      }
      return {
        id: `oa:${txt(ent?.pid) || ent?.originalId?.[0]?.['$'] || d?.id || ''}`,
        titulo: txt(ent.title) || 'Sem título',
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
    url: (q, lim) =>
      `https://api.openalex.org/works?search=${encodeURIComponent(q)}&per-page=${lim}&mailto=contato@linolivre.org`,
    normalizar: (d: any) => ({
      id: `oa:${d.id}`,
      titulo: d.title || d.display_name,
      autor: d.authorships?.length
        ? d.authorships.map((a: any) => a.author?.display_name).filter(Boolean).slice(0, 2).join(', ')
        : null,
      ano: d.publication_year ?? null,
      idioma: d.language ?? null,
      fonte: 'OpenAlex',
      url: d.primary_location?.landing_page_url ?? `https://openalex.org/${d.id}`,
      capa: null,
      sinopse: null,
      licenca: 'outro'
    })
  }
];

// ── Extracção de documentos por formato de resposta ───────────────────────
function extrairDocs(upstreamId: string, json: any): any[] {
  switch (upstreamId) {
    case 'openlibrary': return json?.docs ?? [];
    case 'gutenberg': return json?.results ?? [];
    case 'internetarchive': return json?.response?.docs ?? [];
    case 'wikidata': return json?.search ?? [];
    case 'crossref': return json?.message?.items ?? [];
    case 'openaire': return json?.response?.results?.result ?? json?.result ?? [];
    case 'openalex': return json?.results ?? [];
    default: return [];
  }
}

// ── Motor federado ─────────────────────────────────────────────────────────
export class MotorFederado {
  private timeoutMs: number;
  private limitePorUpstream: number;
  private limiteFinal: number;
  private cache = new Map<string, { valor: any; expira: number }>();
  private falhas = new Map<string, { n: number; abertoAte: number }>();
  private ultimaConsulta = new Map<string, number>();
  private readonly maxCache = 300;
  private readonly limiteFalhas = 2;
  private readonly cooldownMs = 120_000;
  private readonly minIntervaloMs = 250;

  constructor(opcoes: { timeoutMs?: number; limitePorUpstream?: number; limiteFinal?: number } = {}) {
    this.timeoutMs = opcoes.timeoutMs ?? TIMEOUT_PADRAO_MS;
    this.limitePorUpstream = opcoes.limitePorUpstream ?? 20;
    this.limiteFinal = opcoes.limiteFinal ?? 50;
  }

  private breakerPermite(id: string): boolean {
    const e = this.falhas.get(id);
    if (!e) return true;
    if (e.abertoAte && Date.now() > e.abertoAte) {
      this.falhas.set(id, { n: 0, abertoAte: 0 });
      return true;
    }
    return !e.abertoAte;
  }

  private registarFalha(id: string) {
    const e = this.falhas.get(id) ?? { n: 0, abertoAte: 0 };
    e.n++;
    if (e.n >= this.limiteFalhas) e.abertoAte = Date.now() + this.cooldownMs;
    this.falhas.set(id, e);
  }

  private registarSucesso(id: string) {
    this.falhas.set(id, { n: 0, abertoAte: 0 });
  }

  async buscar(termo: string, opcoes: { limite?: number } = {}) {
    const inicio = Date.now();
    const q = String(termo ?? '').trim();
    if (!q) {
      return { total: 0, resultados: [], upstreams: [], duracao_ms: 0, degradado: false, cache: false };
    }

    const limiteFinal = opcoes.limite ?? this.limiteFinal;
    const cacheKey = `${q}|${this.limitePorUpstream}|${limiteFinal}`;

    const emCache = this.cache.get(cacheKey);
    if (emCache && Date.now() < emCache.expira) {
      return { ...emCache.valor, cache: true };
    }

    // ── Fan-out paralelo (motor distribuído) ──
    const tarefas = UPSTREAMS.map(async (u): Promise<{ rel: RelatorioUpstream; resultados: ResultadoFederado[] }> => {
      const ultimo = this.ultimaConsulta.get(u.id) ?? 0;
      if (!this.breakerPermite(u.id) || (Date.now() - ultimo) < this.minIntervaloMs) {
        const e = this.falhas.get(u.id);
        return {
          rel: {
            upstream: u.id, nome: u.nome,
            estado: e?.abertoAte ? 'ignorado (breaker aberto)' : 'ignorado (rate-limit)',
            total: 0, ms: 0, erro: null
          },
          resultados: []
        };
      }

      const t0 = Date.now();
      const ctrl = new AbortController();
      const timer = setTimeout(
        () => ctrl.abort(),
        Math.round(this.timeoutMs * (u.timeoutMult ?? 1))
      );
      try {
        const res = await fetch(u.url(q, this.limitePorUpstream), {
          signal: ctrl.signal,
          headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' }
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        this.registarSucesso(u.id);
        this.ultimaConsulta.set(u.id, Date.now());

        const docs = extrairDocs(u.id, json);
        const resultados: ResultadoFederado[] = [];
        for (const d of docs) {
          try {
            const n = u.normalizar(d);
            if (n && n.titulo) {
              resultados.push({
                id: n.id ?? '',
                titulo: n.titulo!,
                autor: n.autor ?? null,
                ano: n.ano ?? null,
                idioma: n.idioma ?? null,
                fonte: n.fonte ?? u.nome,
                fontes: [u.id],
                url: n.url ?? null,
                capa: n.capa ?? null,
                sinopse: n.sinopse ?? null,
                licenca: n.licenca ?? 'outro',
                score: 0
              });
            }
          } catch { /* documento inválido — ignora */ }
        }
        return {
          rel: { upstream: u.id, nome: u.nome, estado: 'ok', total: resultados.length, ms: Date.now() - t0, erro: null },
          resultados
        };
      } catch (err: any) {
        clearTimeout(timer);
        this.registarFalha(u.id);
        this.ultimaConsulta.set(u.id, Date.now());
        const timeout = err?.name === 'AbortError';
        return {
          rel: {
            upstream: u.id, nome: u.nome,
            estado: timeout ? 'timeout' : 'erro',
            total: 0, ms: Date.now() - t0,
            erro: String(err?.message ?? err).slice(0, 120)
          },
          resultados: []
        };
      }
    });

    const saidas = await Promise.all(tarefas);
    const relatorios = saidas.map(s => s.rel);

    // ── Fusão RRF ──
    const fusao = new Map<string, ResultadoFederado & { score: number }>();
    for (const { rel, resultados } of saidas) {
      const u = UPSTREAMS.find(x => x.id === rel.upstream)!;
      for (let i = 0; i < resultados.length; i++) {
        const r = resultados[i];
        const pontos = (1 / (RRF_K + (i + 1))) * (u.peso || 1);
        const chave = `${chaveNormalizada(r.titulo).slice(0, 90)}|${chaveNormalizada(r.autor).slice(0, 60)}`;

        const existente = fusao.get(chave);
        if (existente) {
          existente.score += pontos;
          existente.fontes.push(rel.upstream);
          if (!existente.capa && r.capa) existente.capa = r.capa;
          if (!existente.ano && r.ano) existente.ano = r.ano;
          if (!existente.sinopse && r.sinopse) existente.sinopse = r.sinopse;
          if (!existente.idioma && r.idioma) existente.idioma = r.idioma;
        } else {
          fusao.set(chave, { ...r, score: pontos });
        }
      }
    }

    // ── Segunda passagem: fusão por título equivalente ──
    const porTitulo = new Map<string, ResultadoFederado & { score: number }>();
    for (const r of fusao.values()) {
      const k = chaveNormalizada(r.titulo);
      if (!k) continue;
      const atual = porTitulo.get(k);
      if (!atual) { porTitulo.set(k, r); continue; }
      const [principal, secundario] = atual.score >= r.score ? [atual, r] : [r, atual];
      principal.score += secundario.score * 0.5;
      principal.fontes = [...new Set([...principal.fontes, ...secundario.fontes])];
      if (!principal.capa && secundario.capa) principal.capa = secundario.capa;
      if (!principal.ano && secundario.ano) principal.ano = secundario.ano;
      if (!principal.sinopse && secundario.sinopse) principal.sinopse = secundario.sinopse;
      if (!principal.idioma && secundario.idioma) principal.idioma = secundario.idioma;
      if (!principal.autor && secundario.autor) principal.autor = secundario.autor;
      porTitulo.set(k, principal);
      const chaveSecundaria = [...fusao.keys()].find(kk => fusao.get(kk) === secundario);
      if (chaveSecundaria) fusao.delete(chaveSecundaria);
    }

    const resultados = [...porTitulo.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limiteFinal)
      .map(r => ({ ...r, score: Number(r.score.toFixed(6)) }));

    const degradado = relatorios.some(r => r.estado !== 'ok');
    const resposta = {
      total: resultados.length,
      resultados,
      upstreams: relatorios,
      duracao_ms: Date.now() - inicio,
      degradado
    };

    if (this.cache.size >= this.maxCache) this.cache.delete(this.cache.keys().next().value!);
    this.cache.set(cacheKey, { valor: resposta, expira: Date.now() + 5 * 60 * 1000 });

    return { ...resposta, cache: false };
  }

  diagnostico() {
    return UPSTREAMS.map(u => {
      const e = this.falhas.get(u.id);
      return {
        id: u.id, nome: u.nome, peso: u.peso,
        estado: e?.abertoAte ? 'aberto (breaker)' : 'fechado',
        falhas: e?.n ?? 0
      };
    });
  }
}

// Instância partilhada (a borda mantém o isolate quente)
let motorGlobal: MotorFederado | null = null;
export function obterMotor(): MotorFederado {
  if (!motorGlobal) motorGlobal = new MotorFederado();
  return motorGlobal;
}
