/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Lino Livre — Edge Load Balancer & Circuit Breaker (Custo Zero Perpétuo)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Implementa padrões avançados de Engenharia de Software na borda (Cloudflare):
 *  1. Padrão Circuit Breaker (Martin Fowler): Estados CLOSED, OPEN, HALF_OPEN.
 *  2. Balanceamento de Carga Ativo-Ativo / Ativo-Passivo (D1 + Supabase).
 *  3. Divisão de Cotas: divide o tráfego de leitura entre múltiplos provedores
 *     gratuitos, dobrando a capacidade diária sem nenhum custo ($0.00).
 *  4. Proteção contra Falhas em Cascata e Thundering Herd.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type BackendId = 'd1' | 'supabase';
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface BackendStats {
  id: BackendId;
  state: CircuitState;
  consecutiveFailures: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  totalRequests: number;
  totalFailures: number;
  lastLatencyMs: number;
  lastErrorReason?: string;
}

export interface LoadBalancerConfig {
  /** Falhas consecutivas para abrir o circuito (default: 3) */
  failureThreshold: number;
  /** Tempo de espera em OPEN antes de tentar HALF_OPEN em ms (default: 60.000ms = 1min) */
  cooldownPeriodMs: number;
  /** Modo de balanceamento: 'd1_priority' | 'supabase_priority' | 'weighted_hybrid' | 'auto' */
  mode: 'd1_priority' | 'supabase_priority' | 'weighted_hybrid' | 'auto';
  /** Peso para D1 no modo híbrido (0.0 a 1.0, default: 0.6 = 60% D1, 40% Supabase) */
  d1Weight: number;
}

const DEFAULT_CONFIG: LoadBalancerConfig = {
  failureThreshold: 3,
  cooldownPeriodMs: 60 * 1000,
  mode: 'auto',
  d1Weight: 0.6
};

class EdgeLoadBalancer {
  private config: LoadBalancerConfig;
  private stats: Record<BackendId, BackendStats>;
  private requestCounter: number = 0;

  constructor(config: Partial<LoadBalancerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.stats = {
      d1: {
        id: 'd1',
        state: 'CLOSED',
        consecutiveFailures: 0,
        lastFailureTime: 0,
        lastSuccessTime: Date.now(),
        totalRequests: 0,
        totalFailures: 0,
        lastLatencyMs: 0
      },
      supabase: {
        id: 'supabase',
        state: 'CLOSED',
        consecutiveFailures: 0,
        lastFailureTime: 0,
        lastSuccessTime: Date.now(),
        totalRequests: 0,
        totalFailures: 0,
        lastLatencyMs: 0
      }
    };
  }

  /**
   * Determina o estado atual do circuito para um backend (gerencia transição para HALF_OPEN).
   */
  public getState(backend: BackendId): CircuitState {
    const s = this.stats[backend];
    if (s.state === 'OPEN') {
      const now = Date.now();
      if (now - s.lastFailureTime > this.config.cooldownPeriodMs) {
        s.state = 'HALF_OPEN';
      }
    }
    return s.state;
  }

  /**
   * Decide qual backend primário deve processar a requisição atual.
   */
  public pickBackend(supabaseConfigured: boolean): { primary: BackendId; fallback: BackendId | null } {
    if (!supabaseConfigured) {
      return { primary: 'd1', fallback: null };
    }

    const d1State = this.getState('d1');
    const supaState = this.getState('supabase');

    // Se um dos circuitos estiver OPEN, direciona 100% para o saudável
    if (d1State === 'OPEN' && supaState !== 'OPEN') {
      return { primary: 'supabase', fallback: 'd1' };
    }
    if (supaState === 'OPEN' && d1State !== 'OPEN') {
      return { primary: 'd1', fallback: 'supabase' };
    }

    // Ambos saudáveis (ou ambos em HALF_OPEN)
    this.requestCounter++;

    if (this.config.mode === 'supabase_priority') {
      return { primary: 'supabase', fallback: 'd1' };
    }

    if (this.config.mode === 'd1_priority') {
      return { primary: 'd1', fallback: 'supabase' };
    }

    // Modo auto / weighted_hybrid:
    // Distribui as consultas de leitura proporcionalmente entre D1 e Supabase.
    // Isso evita estourar o limite de 5M reads/dia da D1 e divide o consumo de forma equilibrada.
    const threshold = Math.floor(this.config.d1Weight * 10);
    const mod = this.requestCounter % 10;
    if (mod < threshold) {
      return { primary: 'd1', fallback: 'supabase' };
    } else {
      return { primary: 'supabase', fallback: 'd1' };
    }
  }

  /**
   * Registra sucesso na execução de uma consulta.
   */
  public recordSuccess(backend: BackendId, latencyMs: number) {
    const s = this.stats[backend];
    s.totalRequests++;
    s.consecutiveFailures = 0;
    s.lastSuccessTime = Date.now();
    s.lastLatencyMs = latencyMs;
    if (s.state === 'HALF_OPEN') {
      s.state = 'CLOSED';
    }
  }

  /**
   * Registra falha de execução e avalia se o circuito deve abrir.
   */
  public recordFailure(backend: BackendId, error: any) {
    const s = this.stats[backend];
    const errMsg = String(error?.message || error || '');
    s.totalRequests++;
    s.totalFailures++;
    s.consecutiveFailures++;
    s.lastFailureTime = Date.now();
    s.lastErrorReason = errMsg.slice(0, 200);

    // Erros críticos de cota (ex: D1 code 7500 ou Supabase 429) abrem o circuito IMEDIATAMENTE
    const ehErroDeCota = /exceeded D1|free tier daily row read|cota|429|quota/i.test(errMsg);

    if (ehErroDeCota || s.consecutiveFailures >= this.config.failureThreshold) {
      s.state = 'OPEN';
    }
  }

  /**
   * Retorna snapshot de métricas do balanceador para a rota de diagnóstico.
   */
  public getSnapshot() {
    return {
      config: this.config,
      totalRouted: this.requestCounter,
      backends: {
        d1: { ...this.stats.d1, state: this.getState('d1') },
        supabase: { ...this.stats.supabase, state: this.getState('supabase') }
      }
    };
  }
}

// Instância singleton do balanceador de carga de borda
export const edgeLoadBalancer = new EdgeLoadBalancer();
