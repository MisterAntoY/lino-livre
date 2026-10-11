const ICONS = {
  python: `
    <g transform="translate(160, 160) scale(2.5)" fill="none">
      <path d="M15.9 0c-4.4 0-7.9.8-7.9 3.5v3.6h8v1.2H4.8C1.5 8.3 0 10.3 0 14.7c0 4.3 2.1 6.3 5.4 6.3h2.6v-3.7c0-2.8 2.4-5.3 5.3-5.3h7.9c2.4 0 4.3-1.9 4.3-4.3V3.5C25.5.9 22-.01 15.9 0zm-4.3 2.3c.7 0 1.3.6 1.3 1.3 0 .7-.6 1.3-1.3 1.3-.7 0-1.3-.6-1.3-1.3 0-.7.6-1.3 1.3-1.3z" fill="#38bdf8"/>
      <path d="M16.1 32c4.4 0 7.9-.8 7.9-3.5v-3.6h-8v-1.2h11.2c3.3 0 4.8-2 4.8-6.4 0-4.3-2.1-6.3-5.4-6.3H24v3.7c0 2.8-2.4 5.3-5.3 5.3h-7.9c-2.4 0-4.3 1.9-4.3 4.3v4.2c0 2.6 3.5 3.5 9.6 3.5zm4.3-2.3c-.7 0-1.3-.6-1.3-1.3 0-.7.6-1.3 1.3-1.3.7 0 1.3.6 1.3 1.3 0 .7-.6 1.3-1.3 1.3z" fill="#facc15"/>
    </g>
  `,
  javascript: `
    <g transform="translate(160, 160) scale(2.5)">
      <rect width="32" height="32" rx="4" fill="#facc15"/>
      <path d="M18.5 24.5c.9 1.5 2.1 2.5 4.3 2.5 1.8 0 3-.9 3-2.2 0-1.5-1.2-2.1-3.3-3l-1.1-.5c-3.2-1.4-5.3-3.1-5.3-6.9 0-3.5 2.7-6.2 6.9-6.2 3 0 5.1 1.1 6.5 3.6l-2.7 1.8c-.8-1.3-1.8-1.9-3.7-1.9-1.7 0-2.8.9-2.8 2 0 1.4 1 1.9 3.2 2.9l1.1.5c3.8 1.6 5.6 3.3 5.6 7.2 0 4.1-3.2 6.5-7.6 6.5-4.2 0-6.9-2-8.1-4.5l3-1.8zm-9.3 2.3c.7.4 1.7.8 2.7.8 1.5 0 2.4-.7 2.4-2.4V8.5H18v16.7c0 3.3-1.9 4.8-4.9 4.8-1.7 0-3.1-.5-3.9-1.2l0-2.3z" fill="#0f172a"/>
    </g>
  `,
  react: `
    <g transform="translate(200, 200)" stroke="#38bdf8" stroke-width="2.2" fill="none">
      <ellipse rx="38" ry="14"/>
      <ellipse rx="38" ry="14" transform="rotate(60)"/>
      <ellipse rx="38" ry="14" transform="rotate(120)"/>
      <circle r="6" fill="#38bdf8" stroke="none"/>
    </g>
  `,
  rust: `
    <g transform="translate(160, 160) scale(2.5)" fill="#f97316">
      <circle cx="16" cy="16" r="14" stroke="#f97316" stroke-width="2" fill="none"/>
      <path d="M12 10h6c2.5 0 4 1.2 4 3.2 0 1.6-1 2.6-2.4 3l3 5.8h-3l-2.6-5.2h-2.5V22H12V10zm2.5 4.6h3.2c1.2 0 1.8-.6 1.8-1.5s-.6-1.5-1.8-1.5h-3.2v3z"/>
    </g>
  `,
  go: `
    <g transform="translate(155, 175) scale(2.8)" fill="#00add8">
      <path d="M4 12c0-4.4 3.6-8 8-8 3.5 0 6.5 2.3 7.5 5.5h-3.3C15.4 8 13.8 7 12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5c1.8 0 3.4-1 4.2-2.5H12v-3h7.9c.1.5.1 1 .1 1.5 0 4.4-3.6 8-8 8-4.4 0-8-3.6-8-8z"/>
      <path d="M26 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm13 0c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z"/>
    </g>
  `,
  linux: `
    <g transform="translate(165, 160) scale(2.3)">
      <circle cx="16" cy="16" r="14" fill="#334155"/>
      <path d="M16 6c-3 0-5 2.5-5 5.5 0 1.5.5 3 1.5 4l-1.5 4c-.5 1.5.5 3.5 2.5 3.5h5c2 0 3-2 2.5-3.5l-1.5-4c1-1 1.5-2.5 1.5-4 0-3-2-5.5-5-5.5z" fill="#f8fafc"/>
      <ellipse cx="16" cy="13" rx="2" ry="1" fill="#f59e0b"/>
      <circle cx="14" cy="10" r="1" fill="#0f172a"/>
      <circle cx="18" cy="10" r="1" fill="#0f172a"/>
    </g>
  `,
  git: `
    <g transform="translate(160, 160) scale(2.5)" fill="none" stroke="#f97316" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10" cy="8" r="3" fill="#f97316"/>
      <circle cx="10" cy="24" r="3" fill="#f97316"/>
      <circle cx="22" cy="14" r="3" fill="#f97316"/>
      <path d="M10 11v10M10 16a6 6 0 0 1 6-4h3"/>
    </g>
  `,
  cpp: `
    <g transform="translate(155, 175) scale(2.6)" fill="#6366f1">
      <path d="M10 6c-4.4 0-8 3.6-8 8s3.6 8 8 8c3.5 0 6.5-2.3 7.5-5.5h-3.3C13.4 18 11.8 19 10 19c-2.8 0-5-2.2-5-5s2.2-5 5-5c1.8 0 3.4 1 4.2 2.5h3.3C16.5 8.3 13.5 6 10 6z"/>
      <path d="M21 11h2v2h2v2h-2v2h-2v-2h-2v-2h2v-2zm8 0h2v2h2v2h-2v2h-2v-2h-2v-2h2v-2z"/>
    </g>
  `,
  java: `
    <g transform="translate(160, 160) scale(2.5)" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round">
      <path d="M10 22c5 2 9 0 12-1M8 25c7 2 13 0 16-1M13 18c3 1 6 1 8 0M11 14c3-1 7-1 9 1M16 6c-2 2-2 4 0 6"/>
      <path d="M13 8c-2 2-2 4 0 5M19 8c-2 2-2 4 0 5"/>
    </g>
  `,
  cloud: `
    <g transform="translate(160, 160) scale(2.5)" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 22h16a5 5 0 0 0 1-9.9 7 7 0 0 0-13.6-2.1A5.5 5.5 0 0 0 8 22z" fill="#0284c7" fill-opacity="0.15"/>
      <path d="M16 14v5m-2.5-2.5l2.5 2.5 2.5-2.5"/>
    </g>
  `,
  security: `
    <g transform="translate(160, 160) scale(2.5)" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 4l10 4v7c0 6-4.5 11-10 13-5.5-2-10-7-10-13V8l10-4z" fill="#10b981" fill-opacity="0.15"/>
      <circle cx="16" cy="14" r="2" fill="#10b981"/>
      <path d="M16 16v3"/>
    </g>
  `,
  ai: `
    <g transform="translate(160, 160) scale(2.5)" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round">
      <circle cx="8" cy="10" r="3" fill="#a855f7"/>
      <circle cx="8" cy="22" r="3" fill="#a855f7"/>
      <circle cx="24" cy="8" r="3" fill="#a855f7"/>
      <circle cx="24" cy="16" r="3" fill="#a855f7"/>
      <circle cx="24" cy="24" r="3" fill="#a855f7"/>
      <path d="M11 10l10-2M11 10l10 6M11 10l10 14M11 22l10-14M11 22l10-6M11 22l10 2"/>
    </g>
  `,
  system: `
    <g transform="translate(160, 160) scale(2.5)" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="5" width="8" height="6" rx="1" fill="#3b82f6" fill-opacity="0.2"/>
      <rect x="20" y="5" width="8" height="6" rx="1" fill="#3b82f6" fill-opacity="0.2"/>
      <rect x="12" y="21" width="8" height="6" rx="1" fill="#3b82f6" fill-opacity="0.2"/>
      <path d="M8 11v4h16v-4M16 15v6"/>
    </g>
  `,
  code: `
    <g transform="translate(160, 160) scale(2.5)" fill="none" stroke="#8b5cf6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 10L5 16l6 6M21 10l6 6-6 6M18 7l-4 18"/>
    </g>
  `
};

const THEMES = {
  python:   { bg1: '#091e3a', bg2: '#030712', accent: '#38bdf8', secondary: '#fbbf24', icon: 'python' },
  js:       { bg1: '#262006', bg2: '#0a0a0c', accent: '#facc15', secondary: '#fef08a', icon: 'javascript' },
  react:    { bg1: '#082f49', bg2: '#020617', accent: '#38bdf8', secondary: '#bae6fd', icon: 'react' },
  rust:     { bg1: '#331505', bg2: '#09090b', accent: '#f97316', secondary: '#fdba74', icon: 'rust' },
  go:       { bg1: '#082f49', bg2: '#020617', accent: '#00add8', secondary: '#7dd3fc', icon: 'go' },
  linux:    { bg1: '#1e293b', bg2: '#020617', accent: '#e2e8f0', secondary: '#f59e0b', icon: 'linux' },
  git:      { bg1: '#311408', bg2: '#0c0a09', accent: '#f97316', secondary: '#fed7aa', icon: 'git' },
  cpp:      { bg1: '#1e1b4b', bg2: '#09090b', accent: '#818cf8', secondary: '#c7d2fe', icon: 'cpp' },
  java:     { bg1: '#2e1005', bg2: '#0a0a0c', accent: '#ea580c', secondary: '#ffedd5', icon: 'java' },
  cloud:    { bg1: '#072e42', bg2: '#020617', accent: '#0284c7', secondary: '#38bdf8', icon: 'cloud' },
  security: { bg1: '#06281e', bg2: '#030712', accent: '#10b981', secondary: '#6ee7b7', icon: 'security' },
  ai:       { bg1: '#280c42', bg2: '#05020a', accent: '#c084fc', secondary: '#e9d5ff', icon: 'ai' },
  system:   { bg1: '#0d1f3d', bg2: '#020617', accent: '#3b82f6', secondary: '#93c5fd', icon: 'system' },
  code:     { bg1: '#1f1338', bg2: '#030712', accent: '#a855f7', secondary: '#d8b4fe', icon: 'code' }
};

function detectTheme(titulo) {
  const t = (titulo || '').toLowerCase();
  if (t.includes('python')) return THEMES.python;
  if (t.includes('react')) return THEMES.react;
  if (t.includes('rust')) return THEMES.rust;
  if (t.includes('javascript') || t.includes('node') || t.includes('vue')) return THEMES.js;
  if (t.includes('go ') || t.includes('go-') || t.includes('go —') || t.includes('golang')) return THEMES.go;
  if (t.includes('linux') || t.includes('debian') || t.includes('bash') || t.includes('shell')) return THEMES.linux;
  if (t.includes('git ') || t.includes('git(') || t.includes('pro git') || t.includes('github')) return THEMES.git;
  if (t.includes('c++') || t.includes('c von a') || t.includes('c-programm') || t.includes('c / linux') || t.includes(' c ')) return THEMES.cpp;
  if (t.includes('java ') || t.includes('java:')) return THEMES.java;
  if (t.includes('devops') || t.includes('cloud') || t.includes('kubernetes') || t.includes('terraform') || t.includes('docker')) return THEMES.cloud;
  if (t.includes('segurança') || t.includes('cyber') || t.includes('hacking') || t.includes('privacy') || t.includes('security')) return THEMES.security;
  if (t.includes('ai') || t.includes('ia ') || t.includes('machine learning') || t.includes('nlp')) return THEMES.ai;
  if (t.includes('system design') || t.includes('cs-notes') || t.includes('arquitetura') || t.includes('roadmap') || t.includes('computer science')) return THEMES.system;
  return THEMES.code;
}

function wrapLines(text, maxChars = 24) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const w of words) {
    if ((current + ' ' + w).trim().length <= maxChars) {
      current = (current + ' ' + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSvg({ id, titulo, autor, idioma }) {
  const theme = detectTheme(titulo);
  const iconSvg = ICONS[theme.icon] || ICONS.code;
  const lines = wrapLines(titulo);

  const langLabels = {
    fr: 'FR • GUIDE LIBRE',
    zh: 'ZH • 开源教材',
    de: 'DE • FREIES BUCH',
    en: 'EN • OPEN RESOURCE',
    pt: 'PT • LIVRO ABERTO',
    es: 'ES • LIBRO ABIERTO'
  };
  const langBadge = langLabels[idioma] || `${(idioma || 'TECH').toUpperCase()} • LIVRE`;

  const titleLinesSvg = lines.map((l, i) => {
    const y = 370 + (i * 32);
    return `<text x="40" y="${y}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f8fafc" letter-spacing="-0.5">${escapeXml(l)}</text>`;
  }).join('\n');

  const authorSafe = escapeXml(autor ? (autor.length > 36 ? autor.substring(0, 36) + '...' : autor) : 'Comunidade Open Source');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Fundo principal com degradê -->
  <rect width="400" height="600" fill="url(#bgGrad)"/>
  <rect width="400" height="600" fill="url(#gridPattern)"/>

  <!-- Halo sutil atrás do ícone -->
  <circle cx="200" cy="200" r="100" fill="url(#glowGrad)"/>

  <!-- Sombra lateral simulando lombada do livro -->
  <rect x="0" y="0" width="14" height="600" fill="rgba(0,0,0,0.4)"/>
  <line x1="14" y1="0" x2="14" y2="600" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- Badge de Idioma e Licença Aberta (Topo) -->
  <g transform="translate(40, 42)">
    <rect width="170" height="26" rx="13" fill="rgba(255,255,255,0.06)" stroke="${theme.accent}" stroke-opacity="0.4" stroke-width="1"/>
    <circle cx="15" cy="13" r="4" fill="${theme.accent}"/>
    <text x="28" y="17" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="${theme.secondary}" letter-spacing="0.5">${langBadge}</text>
  </g>

  <!-- Ícone Central da Tecnologia -->
  ${iconSvg}

  <!-- Linha divisória de acento -->
  <rect x="40" y="325" width="48" height="4" rx="2" fill="${theme.accent}"/>

  <!-- Título do Livro -->
  ${titleLinesSvg}

  <!-- Autor / Curadoria -->
  <text x="40" y="490" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">Por ${authorSafe}</text>

  <!-- Rodapé Lino Livre Oficial -->
  <line x1="40" y1="535" x2="360" y2="535" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <g transform="translate(40, 555)">
    <circle cx="6" cy="6" r="3" fill="#38bdf8"/>
    <text x="16" y="9" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700" fill="#cbd5e1" letter-spacing="1">LINO LIVRE</text>
    <text x="96" y="9" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="400" fill="#64748b">• Acervo Digital Aberto</text>
  </g>
</svg>`;
}

module.exports = { generateSvg, detectTheme };
