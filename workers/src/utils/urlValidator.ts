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

  const hostname = parsed.hostname.toLowerCase();

  // Bloqueio de IPs privados / rede local (Prevenção SSRF e redirecionamentos internos)
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '169.254.169.254' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.local')
  ) {
    throw new Error('Redirecionamento para endereços de rede interna/local é estritamente proibido');
  }

  // Verificação contra lista negra de compliance
  verificarUrlConformidade(trimmed);

  return parsed.href;
}
