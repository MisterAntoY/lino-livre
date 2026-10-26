import { RepoSupabase, obterConfigSupabase, backendSupabase } from '../supabase';

export function ehErroDeCota(err: any): boolean {
  return /exceeded D1|free tier daily row read|row read limit|daily row read limit|7500|no such table: (estatisticas|contadores)/i
    .test(String(err?.message || ''));
}

export function respostaDegradada(c: any, vazio: any = []) {
  c.header('Cache-Control', 'public, max-age=60');
  c.header('X-Data-Status', 'degraded');
  return c.json(vazio);
}

export function obterRepo(c: any): {
  d1: any | null;
  supabase: RepoSupabase | null;
  backendMode: 'd1' | 'supabase' | 'auto';
} {
  const env = c.env || {};
  const db = env.DB || null;
  const cfg = obterConfigSupabase(env);
  const supa = cfg ? new RepoSupabase(cfg) : null;
  const rawMode = String(env.DB_BACKEND || 'd1').toLowerCase();
  const backendMode = (rawMode === 'supabase' ? 'supabase' : rawMode === 'auto' ? 'auto' : 'd1') as 'd1' | 'supabase' | 'auto';
  return { d1: db, supabase: supa, backendMode };
}

export function repoSupabase(c: any): RepoSupabase | null {
  if (!backendSupabase(c.env)) return null;
  const cfg = obterConfigSupabase(c.env);
  return cfg ? new RepoSupabase(cfg) : null;
}

export function obterRepoSupabase(env: any): RepoSupabase | null {
  const cfg = obterConfigSupabase(env);
  return cfg ? new RepoSupabase(cfg) : null;
}
