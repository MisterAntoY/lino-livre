const fs = require('fs');
const path = require('path');
const { livrosAfricaData } = require('../src/database/livrosAfricaData');

const capasDir = path.join(__dirname, '..', 'public', 'capas');
if (!fs.existsSync(capasDir)) {
  fs.mkdirSync(capasDir, { recursive: true });
}

// Map languages to distinct African theme color palettes
const colorPalettes = {
  pt: { bg1: '#7c2d12', bg2: '#b45309', border: '#f59e0b', tag: '#fef3c7', tagText: '#78350f', flag: '🇲🇿 / 🇦🇴' },
  en: { bg1: '#14532d', bg2: '#047857', border: '#10b981', tag: '#d1fae5', tagText: '#064e3b', flag: '🇳🇬 / 🇿🇦' },
  fr: { bg1: '#1e3a8a', bg2: '#0284c7', border: '#38bdf8', tag: '#e0f2fe', tagText: '#0c4a6e', flag: '🇸🇳 / 🇲🇱' },
  de: { bg1: '#78350f', bg2: '#d97706', border: '#fbbf24', tag: '#fef3c7', tagText: '#451a03', flag: '🇩🇪 / 🌍' },
  zh: { bg1: '#831843', bg2: '#be185d', border: '#f472b6', tag: '#fce7f3', tagText: '#70072b', flag: '🇨🇳 / 🌍' }
};

for (const book of livrosAfricaData) {
  if (!book.capaUrl || !book.capaUrl.startsWith('/capas/')) continue;
  const filename = path.basename(book.capaUrl);
  const targetPath = path.join(capasDir, filename);

  const pal = colorPalettes[book.idioma] || colorPalettes.pt;
  const langLabel = book.idioma.toUpperCase();

  // Escape XML characters
  const escapeXml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const titleEsc = escapeXml(book.titulo);
  const authorEsc = escapeXml(book.autor);
  const yearEsc = escapeXml(book.ano || '');

  // Truncate title for cover display if too long
  let displayTitle = titleEsc;
  if (displayTitle.length > 42) {
    displayTitle = displayTitle.slice(0, 39) + '...';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="grad_${book.idioma}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${pal.bg1}"/>
      <stop offset="50%" stop-color="${pal.bg2}"/>
      <stop offset="100%" stop-color="${pal.bg1}"/>
    </linearGradient>
    <pattern id="pattern_kente" width="40" height="40" patternUnits="userSpaceOnUse" opacity="0.08">
      <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#ffffff" stroke-width="2"/>
      <circle cx="20" cy="20" r="4" fill="#ffffff"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="400" height="580" fill="url(#grad_${book.idioma})"/>
  <rect width="400" height="580" fill="url(#pattern_kente)"/>

  <!-- Ornate Border Frame -->
  <rect x="18" y="18" width="364" height="544" rx="8" fill="none" stroke="${pal.border}" stroke-width="2" opacity="0.6"/>
  <rect x="26" y="26" width="348" height="528" rx="6" fill="none" stroke="${pal.border}" stroke-width="1" opacity="0.4"/>

  <!-- Top Ribbon Badge -->
  <rect x="40" y="44" width="320" height="34" rx="17" fill="${pal.tag}"/>
  <text x="200" y="66" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="${pal.tagText}" text-anchor="middle" letter-spacing="1">
    COLEÇÃO ÁFRICA • ${langLabel} (${pal.flag})
  </text>

  <!-- Emblem Icon -->
  <g transform="translate(160, 110)">
    <circle cx="40" cy="40" r="36" fill="${pal.border}" opacity="0.2"/>
    <circle cx="40" cy="40" r="30" fill="none" stroke="${pal.border}" stroke-width="2"/>
    <text x="40" y="48" font-size="28" text-anchor="middle">🌍</text>
  </g>

  <!-- Title Area -->
  <foreignObject x="36" y="210" width="328" height="190">
    <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center; padding: 0 10px;">
      <h1 style="color:#ffffff; font-family:Georgia, serif; font-size:24px; line-height:1.25; margin:0; font-weight:700; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
        ${displayTitle}
      </h1>
      <div style="width: 60px; height: 3px; background-color: ${pal.border}; margin: 16px auto 0 auto; border-radius: 2px;"></div>
    </div>
  </foreignObject>

  <!-- Author Area -->
  <text x="200" y="450" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#f8fafc" text-anchor="middle" letter-spacing="0.5">
    ${authorEsc}
  </text>

  <text x="200" y="480" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#cbd5e1" text-anchor="middle">
    ${yearEsc ? 'Edição • ' + yearEsc : 'Clássico Africano'}
  </text>

  <!-- Bottom Open Library Tag -->
  <rect x="80" y="515" width="240" height="24" rx="12" fill="rgba(0,0,0,0.3)"/>
  <text x="200" y="531" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#e2e8f0" text-anchor="middle">
    Lino Livre • Acervo Digital Aberto
  </text>
</svg>`;

  fs.writeFileSync(targetPath, svg, 'utf8');
}

console.log('Todas as capas SVG da Coleção Africana foram geradas com sucesso!');
