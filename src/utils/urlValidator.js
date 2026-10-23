/**
 * Validador e Sanitizador de URLs — Lino Livre
 * Prevenção de SSRF, redirecionamentos abertos, links maliciosos e fontes piratas.
 *
 * Endurecido contra as técnicas usuais de evasão de SSRF:
 *  - IPv4 em formas não canónicas (decimal, octal, hex) — normalizadas pelo parser WHATWG;
 *  - ponto final de FQDN (`localhost.`);
 *  - IPv6 mapeado em IPv4 (`::ffff:7f00:1`), IPv4-compat e NAT64;
 *  - ULA (`fc00::/7`), link-local (`fe80::/10`), multicast, documentação;
 *  - faixas RFC 1918, CGNAT, loopback, link-local e metadados de nuvem;
 *  - sufixos de domínio interno (`localhost`, `.local`, `.internal`, `.home.arpa`).
 */

const DOMINIOS_PROIBIDOS = [
  'z-lib', 'zlibrary', 'z-library',
  'libgen', 'library.lol',
  'sci-hub', 'scihub',
  'annas-archive', 'anna-archive',
  'b-ok', 'bookfi', 'pdfdrive'
];

// Sufixos de domínio que nunca podem ser destino de redirecionamento.
const SUFIXOS_INTERNOS = ['.localhost', '.local', '.internal', '.home.arpa', '.lan'];

function verificarUrlConformidade(url) {
  if (!url) return;
  const urlLower = String(url).toLowerCase();
  for (const dom of DOMINIOS_PROIBIDOS) {
    if (urlLower.includes(dom)) {
      throw new Error(`URL rejeitada por violar a política de compliance e legalidade (fonte não autorizada / lista negra de pirataria: ${dom}). O Lino Livre veda estritamente o uso de repositórios piratas (ver /legal e docs/FONTES-E-COMPLIANCE.md).`);
    }
  }
}

/** Remove ponto final de FQDN, colchetes de IPv6 e zone-id (`%eth0`). */
function normalizarHost(hostname) {
  let h = String(hostname || '').toLowerCase().trim();
  if (h.startsWith('[') && h.endsWith(']')) h = h.slice(1, -1);
  const zona = h.indexOf('%');
  if (zona !== -1) h = h.slice(0, zona);
  while (h.endsWith('.')) h = h.slice(0, -1);
  return h;
}

function ehIPv4Interno(ip) {
  const partes = ip.split('.');
  if (partes.length !== 4) return false;
  const nums = partes.map((n) => (/^\d{1,3}$/.test(n) ? Number(n) : NaN));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  const [a, b, c] = nums;

  if (a === 0 || a === 10 || a === 127) return true;              // this-net, RFC1918, loopback
  if (a === 100 && b >= 64 && b <= 127) return true;              // CGNAT 100.64/10
  if (a === 169 && b === 254) return true;                        // link-local + metadados cloud
  if (a === 172 && b >= 16 && b <= 31) return true;               // RFC1918
  if (a === 192 && b === 168) return true;                        // RFC1918
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return true;  // IETF protocol assignments
  if (a === 198 && (b === 18 || b === 19)) return true;           // benchmarking
  if (a === 198 && b === 51 && c === 100) return true;            // TEST-NET-2
  if (a === 203 && b === 0 && c === 113) return true;             // TEST-NET-3
  if (a >= 224) return true;                                      // multicast + reservado + broadcast
  return false;
}

/** Expande um IPv6 para 8 grupos de 16 bits. Devolve null se não for IPv6 válido. */
function expandirIPv6(host) {
  if (!host.includes(':')) return null;
  let s = host;

  // IPv4 embutido no fim (ex.: ::ffff:127.0.0.1)
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

function ehIPv6Interno(host) {
  const g = expandirIPv6(host);
  if (!g) return false;

  // :: e ::1
  if (g.every((n) => n === 0)) return true;
  if (g.slice(0, 7).every((n) => n === 0) && g[7] === 1) return true;

  const cincoPrimeirosZero = g.slice(0, 5).every((n) => n === 0);
  if (cincoPrimeirosZero && g[5] === 0xffff) return true;         // IPv4 mapeado (::ffff:0:0/96)
  if (g.slice(0, 6).every((n) => n === 0)) return true;           // IPv4-compat (::/96)
  if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((n) => n === 0)) return true; // NAT64
  if ((g[0] & 0xfe00) === 0xfc00) return true;                    // ULA fc00::/7
  if ((g[0] & 0xffc0) === 0xfe80) return true;                    // link-local fe80::/10
  if ((g[0] & 0xff00) === 0xff00) return true;                    // multicast ff00::/8
  if (g[0] === 0x2001 && g[1] === 0x0db8) return true;            // documentação 2001:db8::/32
  return false;
}

/** Devolve true quando o host é local, privado, link-local ou de metadados. */
function hostInterno(hostname) {
  const host = normalizarHost(hostname);
  if (!host) return true;

  if (host === 'localhost' || host === 'localhost.localdomain') return true;
  if (SUFIXOS_INTERNOS.some((sufixo) => host.endsWith(sufixo))) return true;

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return ehIPv4Interno(host);
  if (host.includes(':')) return ehIPv6Interno(host);

  return false;
}

function validarUrlRedirecionamento(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL de destino inválida ou vazia');
  }

  const trimmed = url.trim();
  if (trimmed.length > 2048) {
    throw new Error('URL de destino demasiado longa');
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Formato de URL inválido');
  }

  // Apenas HTTP e HTTPS são permitidos (bloqueia javascript:, data:, file:, etc.)
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Protocolo '${parsed.protocol}' não permitido para redirecionamento`);
  }

  // Credenciais embutidas (http://user:pass@host) facilitam confusão de host.
  if (parsed.username || parsed.password) {
    throw new Error('URL com credenciais embutidas não é permitida');
  }

  if (hostInterno(parsed.hostname)) {
    throw new Error('Redirecionamento para endereços de rede interna/local é estritamente proibido');
  }

  // Verificação contra lista negra de compliance
  verificarUrlConformidade(trimmed);

  return parsed.href;
}

module.exports = {
  DOMINIOS_PROIBIDOS,
  verificarUrlConformidade,
  validarUrlRedirecionamento,
  hostInterno,
  normalizarHost
};
