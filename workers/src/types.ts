export interface Bindings {
  DB: D1Database;
  ASSETS?: Fetcher;
  ASSETS_BUCKET?: R2Bucket;
  ENVIRONMENT?: string;
  ADMIN_API_KEY?: string;
  SITE_NAME?: string;
  SITE_SLOGAN?: string;
  SUPPORT_EMAIL?: string;
  WHATSAPP_COMMUNITY_URL?: string;
  WHATSAPP_CHANNEL_URL?: string;
  /** 'd1' (padrão) ou 'supabase'. */
  DB_BACKEND?: string;
  /** URL do projeto Supabase, ex.: https://xxxx.supabase.co */
  SUPABASE_URL?: string;
  /** Chave service_role — apenas no servidor/Worker, nunca no frontend. */
  SUPABASE_SERVICE_ROLE_KEY?: string;
  /** Turnstile (opcional): só há verificação anti-bot se o segredo existir. */
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  /**
   * Rate Limiting binding da Cloudflare (opcional). Quando presente, o limite
   * é aplicado de forma distribuída em vez de ser só por isolate.
   */
  RATE_LIMITER?: { limit: (opcoes: { key: string }) => Promise<{ success: boolean }> };
}
