import { MiddlewareHandler } from 'hono';
import { Bindings } from '../types';
import { ORIGENS_PERMITIDAS } from '../data/constants';

/**
 * CORS: leitura pública abrangente, mutações restritas.
 * A API de leitura é pública (metadados abertos), mas operações de escrita só
 * aceitam origens conhecidas. Pedidos sem Origin (curl, server-to-server,
 * cron) continuam permitidos — a autorização real é a chave administrativa.
 */
export const corsMiddleware: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  const origin = c.req.header('origin');
  const metodo = c.req.method.toUpperCase();
  const mutacao = !['GET', 'HEAD', 'OPTIONS'].includes(metodo);
  const origemConhecida = !!origin && ORIGENS_PERMITIDAS.has(origin);

  if (origin && mutacao && !origemConhecida) {
    return c.json({ erro: 'Origem não autorizada para operações de escrita' }, 403);
  }

  if (origemConhecida) {
    c.header('Access-Control-Allow-Origin', origin!);
    c.header('Vary', 'Origin');
  } else if (!mutacao) {
    // Só a leitura pública é exposta a qualquer origem. Escritas sem Origin
    // (curl, cron, server-to-server) não recebem ACAO — não há browser envolvido.
    c.header('Access-Control-Allow-Origin', '*');
  }

  if (metodo === 'OPTIONS') {
    const pedido = (c.req.header('access-control-request-method') || '').toUpperCase();
    const pedidoMutacao = !!pedido && !['GET', 'HEAD'].includes(pedido);
    if (pedidoMutacao && !origemConhecida) {
      return c.body(null, 403);
    }
    c.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
    const cabecalhos = ['Content-Type', 'Cache-Control', 'Pragma'];
    if (origemConhecida) {
      cabecalhos.push('x-admin-key', 'Authorization');
    }
    c.header('Access-Control-Allow-Headers', cabecalhos.join(', '));
    c.header('Access-Control-Max-Age', '86400');
    return c.body(null, 204);
  }

  await next();
};
