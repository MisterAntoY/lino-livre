/**
 * Validador e Sanitizador de URLs — Cloudflare Worker (Lino Livre)
 * Prevenção de SSRF, redirecionamentos abertos, links maliciosos e fontes piratas.
 *
 * Endurecido contra as técnicas usuais de evasão de SSRF:
 *  - IPv4 em formas não canónicas (decimal, octal, hex) — normalizadas pelo parser WHATWG;
 *  - ponto final de FQDN (`localhost.`);
 *  - IPv6 mapeado em IPv4 (`::ffff:7f00:1`), IPv4-compat e NAT64;
 *  - ULA (`fc00::/7`), link-local (`fe80::/10`), multicast e documentação;
 *  - faixas RFC 1918, CGNAT, loopback, link-local e metadados de nuvem;
 *  - sufixos de domínio interno (`localhost`, `.local`, `.internal`, `.home.arpa`).
 */

export const DOMINIOS_PROIBIDOS = [
  'z-lib', 'zlibrary', 'z-library',
  'libgen', 'library.lol',
  'sci-hub', 'scihub',
  'annas-archive', 'anna-archive',
  'b-ok', 'bookfi', 'pdfdrive'
];

const SUFIXOS_INTERNOS = ['.localhost', '.local', '.internal', '.home.arpa', '.lan'];

export function verificarUrlConformidade(url: string | null | undefined): void {
  if (!url) return;
  const urlLower = String(url).toLowerCase();
  for (const dom of DOMINIOS_PROIBIDOS) {
    if (urlLower.includes(dom)) {
      throw new Error(`URL rejeitada por violar a política de compliance e legalidade (fonte não autorizada / lista negra de pirataria: ${dom}). O Lino Livre veda estritamente o uso de repositórios piratas.`);
    }
  }
}

export function normalizarHost(hostname: string | null | undefined): string {
  let h = String(hostname || '').toLowerCase().trim();
  if (h.startsWith('[') && h.endsWith(']')) h = h.slice(1, -1);
  const zona = h.indexOf('%');
  if (zona !== -1) h = h.slice(0, zona);
  while (h.endsWith('.')) h = h.slice(0, -1);
  return h;
}

function ehIPv4Interno(ip: string): boolean {
  const partes = ip.split('.');
  if (partes.length !== 4) return false;
  const nums = partes.map((n) => (/^\d{1,3}$/.test(n) ? Number(n) : NaN));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  const [a, b, c] = nums;

  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a === 198 && b === 51 && c === 100) return true;
  if (a === 203 && b === 0 && c === 113) return true;
  if (a >= 224) return true;
  return false;
}

function expandirIPv6(host: string): number[] | null {
  if (!host.includes(':')) return null;
  let s = host;

  const embutido = s.match(/^(.*:)(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (embutido) {
    const octetos = embutido.slice(2, 6).map(Number);
    if (octetos.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
    const alto = ((octetos[0] << 8) | octetos[1]).toString(16);
    const baixo = ((octetos[2] << 8) | octetos[3]).toString(16);
    s = `${embutido[1]}${alto}:${baixo}`;
  }

  const lados = s.split('::');
  if (lados.length > 2) return null;
  const esquerda = lados[0] ? lados[0].split(':') : [];
  const direita = lados.length === 2 && lados[1] ? lados[1].split(':') : [];
  const preenchimento = lados.length === 2 ? 8 - esquerda.length - direita.length : 0;
  if (preenchimento < 0) return null;

  const grupos = [...esquerda, ...Array(preenchimento).fill('0'), ...direita];
  if (grupos.length !== 8) return null;

  const nums = grupos.map((g) => (/^[0-9a-f]{1,4}$/i.test(g) ? parseInt(g, 16) : NaN));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 0xffff)) return null;
  return nums;
}

function ehIPv6Interno(host: string): boolean {
  const g = expandirIPv6(host);
  if (!g) return false;

  if (g.every((n) => n === 0)) return true;
  if (g.slice(0, 7).every((n) => n === 0) && g[7] === 1) return true;

  const cincoPrimeirosZero = g.slice(0, 5).every((n) => n === 0);
  if (cincoPrimeirosZero && g[5] === 0xffff) return true;
  if (g.slice(0, 6).every((n) => n === 0)) return true;
  if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((n) => n === 0)) return true;
  if ((g[0] & 0xfe00) === 0xfc00) return true;
  if ((g[0] & 0xffc0) === 0xfe80) return true;
  if ((g[0] & 0xff00) === 0xff00) return true;
  if (g[0] === 0x2001 && g[1] === 0x0db8) return true;
  return false;
}

export function hostInterno(hostname: string | null | undefined): boolean {
  const host = normalizarHost(hostname);
  if (!host) return true;

  if (host === 'localhost' || host === 'localhost.localdomain') return true;
  if (SUFIXOS_INTERNOS.some((sufixo) => host.endsWith(sufixo))) return true;

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return ehIPv4Interno(host);
  if (host.includes(':')) return ehIPv6Interno(host);

  return false;
}

export function validarUrlRedirecionamento(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    throw new Error('URL de destino inválida ou vazia');
  }

  const trimmed = url.trim();
  if (trimmed.length > 2048) {
    throw new Error('URL de destino demasiado longa');
  }

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

  if (parsed.username || parsed.password) {
    throw new Error('URL com credenciais embutidas não é permitida');
  }

  if (hostInterno(parsed.hostname)) {
    throw new Error('Redirecionamento para endereços de rede interna/local é estritamente proibido');
  }

  verificarUrlConformidade(trimmed);

  return parsed.href;
}
