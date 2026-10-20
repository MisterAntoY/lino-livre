/**
 * Validador e Sanitizador de URLs — Cloudflare Worker (Lino Livre)
 * Prevenção de SSRF, redirecionamentos abertos, links maliciosos e fontes piratas.
 */

export const DOMINIOS_PROIBIDOS = [
  'z-lib', 'zlibrary', 'z-library',
  'libgen', 'library.lol',
  'sci-hub', 'scihub',
  'annas-archive', 'anna-archive',
  'b-ok', 'bookfi', 'pdfdrive'
];

export function verificarUrlConformidade(url: string | null | undefined): void {
  if (!url) return;
  const urlLower = String(url).toLowerCase();
  for (const dom of DOMINIOS_PROIBIDOS) {
    if (urlLower.includes(dom)) {
      throw new Error(`URL rejeitada por violar a política de compliance e legalidade (fonte não autorizada / lista negra de pirataria: ${dom}). O Lino Livre veda estritamente o uso de repositórios piratas.`);
    }
  }
}

export function validarUrlRedirecionamento(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    throw new Error('URL de destino inválida ou vazia');
  }

  const trimmed = url.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Formato de URL inválido');
  }

  // Apenas HTTP e HTTPS são permitidos (bloqueia javascript:, data:, file:, etc.)
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Protocolo '${parsed.protocol}' não permitido para redirecionamento`);
  }

  const rawHost = parsed.hostname.toLowerCase();
  const cleanHost = rawHost.replace(/^\[|\]$/g, '');

  // Bloqueio abrangente de loopback, IPv6 local, redes privadas (RFC 1918) e metadados de nuvem (SSRF)
  const isLoopbackOrPrivate = (
    cleanHost === 'localhost' ||
    cleanHost === '0.0.0.0' ||
    cleanHost === '::1' ||
    cleanHost === '::' ||
    cleanHost.startsWith('127.') ||
    cleanHost.startsWith('0.') ||
    cleanHost.startsWith('10.') ||
    cleanHost.startsWith('192.168.') ||
    cleanHost.startsWith('169.254.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanHost) ||
    cleanHost.startsWith('fe80:') ||
    cleanHost.startsWith('fe80::') ||
    cleanHost.startsWith('fc') ||
    cleanHost.startsWith('fd') ||
    cleanHost.includes('::ffff:127.') ||
    cleanHost.endsWith('.internal') ||
    cleanHost.endsWith('.local')
  );

  if (isLoopbackOrPrivate) {
    throw new Error('Redirecionamento para endereços de rede interna/local é estritamente proibido');
  }

  // Verificação contra lista negra de compliance
  verificarUrlConformidade(trimmed);

  return parsed.href;
}
