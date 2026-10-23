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
}
