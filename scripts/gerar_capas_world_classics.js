/**
 * Gerador de Capas Vetoriais SVG — Os 100 Livros Mais Lidos do Mundo
 * 
 * Cria 105 capas vetoriais SVG locais, autônomas e de alta resolução
 * em public/capas/world/, eliminando dependências de CDNs externas,
 * bloqueios de taxa (HTTP 502 da Open Library) e atrasos de download
 * que causavam fallback para Dom Casmurro.
 */

const fs = require('fs');
const path = require('path');
const { worldClassicsList } = require('../src/database/worldClassicsSeedData');

const OUTPUT_DIR = path.join(__dirname, '../public/capas/world');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function xmlEscape(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function quebrarTexto(texto, maxCharsPorLinha = 22) {
  const palavras = String(texto || '').trim().split(/\s+/);
  const linhas = [];
  let linhaAtual = '';

  for (const palavra of palavras) {
    if ((linhaAtual + ' ' + palavra).trim().length <= maxCharsPorLinha) {
      linhaAtual = (linhaAtual + ' ' + palavra).trim();
    } else {
      if (linhaAtual) linhas.push(linhaAtual);
      linhaAtual = palavra;
    }
  }
  if (linhaAtual) linhas.push(linhaAtual);
  return linhas;
}

const PALETAS = [
  { bg1: '#0f172a', bg2: '#020617', accent: '#f59e0b', light: '#fef3c7', tagBg: 'rgba(245,158,11,0.15)', name: 'midnight-gold' },
  { bg1: '#064e3b', bg2: '#022c22', accent: '#10b981', light: '#d1fae5', tagBg: 'rgba(16,185,129,0.15)', name: 'emerald' },
  { bg1: '#450a0a', bg2: '#1c0404', accent: '#f43f5e', light: '#ffe4e6', tagBg: 'rgba(244,63,94,0.15)', name: 'crimson' },
  { bg1: '#172554', bg2: '#0b1329', accent: '#38bdf8', light: '#e0f2fe', tagBg: 'rgba(56,189,248,0.15)', name: 'sapphire' },
  { bg1: '#3b0764', bg2: '#19032b', accent: '#c084fc', light: '#f3e8ff', tagBg: 'rgba(192,132,252,0.15)', name: 'amethyst' },
  { bg1: '#451a03', bg2: '#1c0901', accent: '#fb923c', light: '#ffedd5', tagBg: 'rgba(251,146,60,0.15)', name: 'amber-leather' },
  { bg1: '#042f2e', bg2: '#011716', accent: '#2dd4bf', light: '#ccfbf1', tagBg: 'rgba(45,212,191,0.15)', name: 'teal-ocean' },
  { bg1: '#4a044e', bg2: '#1f0121', accent: '#f472b6', light: '#fce7f3', tagBg: 'rgba(244,114,182,0.15)', name: 'magenta-rose' },
  { bg1: '#1e1b4b', bg2: '#0a0822', accent: '#818cf8', light: '#e0e7ff', tagBg: 'rgba(129,140,248,0.15)', name: 'indigo-twilight' },
  { bg1: '#262626', bg2: '#0a0a0a', accent: '#e2e8f0', light: '#ffffff', tagBg: 'rgba(226,232,240,0.15)', name: 'classic-slate' }
];

const ICONES = [
  // Livro aberto
  `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
   <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 24.5v-20A2.5 2.5 0 0 1 6.5 2z"/>`,
  // Estrela / Laurel
  `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  // Bússola
  `<circle cx="12" cy="12" r="10"/>
   <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>`,
  // Pena de escrever
  `<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
   <line x1="16" y1="8" x2="2" y2="22"/>
   <line x1="17.5" y1="15" x2="9" y2="15"/>`,
  // Globo
  `<circle cx="12" cy="12" r="10"/>
   <line x1="2" y1="12" x2="22" y2="12"/>
   <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  // Coroa de louros / Glória
  `<path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
   <circle cx="12" cy="19" r="2"/>`
];

function gerarSvgCapa(obra, index) {
  const paleta = PALETAS[index % PALETAS.length];
  const iconeSvg = ICONES[index % ICONES.length];
  const isHist = obra.fonteIdExterno.startsWith('world-hist-');
  const rankNum = isHist ? '' : obra.fonteIdExterno.replace('world-top100-', '');
  
  const badgeTexto = isHist 
    ? 'CLÁSSICO HISTÓRICO UNIVERSAL'
    : `#${rankNum} MAIS LIDO DO MUNDO`;

  const linhasTitulo = quebrarTexto(obra.titulo, 20);
  const fontSizeTitulo = linhasTitulo.length > 3 ? 24 : (linhasTitulo.length > 2 ? 26 : 29);
  const lineHeightTitulo = fontSizeTitulo * 1.25;

  const subtituloCurto = (obra.subtitulo || '')
    .split('•')[0]
    .replace(/\(.*?\)/g, '')
    .trim();
  const linhasSubtitulo = quebrarTexto(subtituloCurto, 32).slice(0, 2);

  const startYTitulo = 345 - (linhasTitulo.length - 1) * (lineHeightTitulo / 2);

  let xmlLinhasTitulo = '';
  linhasTitulo.forEach((linha, i) => {
    xmlLinhasTitulo += `<text x="40" y="${startYTitulo + i * lineHeightTitulo}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSizeTitulo}" font-weight="700" fill="#f8fafc">${xmlEscape(linha)}</text>\n`;
  });

  let xmlLinhasSubtitulo = '';
  const startYSub = startYTitulo + (linhasTitulo.length) * lineHeightTitulo + 8;
  linhasSubtitulo.forEach((linha, i) => {
    xmlLinhasSubtitulo += `<text x="40" y="${startYSub + i * 18}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="${paleta.accent}">${xmlEscape(linha)}</text>\n`;
  });

  const autorY = Math.max(startYSub + linhasSubtitulo.length * 18 + 24, 465);

  const gradId = `bgGrad_${obra.fonteIdExterno.replace(/[^a-zA-Z0-9]/g, '_')}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${paleta.bg1}"/>
      <stop offset="100%" stop-color="${paleta.bg2}"/>
    </linearGradient>
    <pattern id="pat_${gradId}" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Fundo com gradiente e textura sutil -->
  <rect width="400" height="600" fill="url(#${gradId})"/>
  <rect width="400" height="600" fill="url(#pat_${gradId})"/>

  <!-- Brilho radial focal atrás do emblema -->
  <circle cx="200" cy="180" r="110" fill="${paleta.accent}" opacity="0.12"/>

  <!-- Efeito de lombada / relevo editorial clássico -->
  <rect x="0" y="0" width="16" height="600" fill="rgba(0,0,0,0.45)"/>
  <line x1="16" y1="0" x2="16" y2="600" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <rect x="390" y="0" width="10" height="600" fill="rgba(0,0,0,0.2)"/>

  <!-- Badge Superior: Ranking Oficial / Clássico Universal -->
  <g transform="translate(40, 36)">
    <rect width="250" height="26" rx="13" fill="${paleta.tagBg}" stroke="${paleta.accent}" stroke-opacity="0.5" stroke-width="1"/>
    <circle cx="14" cy="13" r="4" fill="${paleta.accent}"/>
    <text x="26" y="17" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700" fill="${paleta.light}" letter-spacing="0.8">🌟 ${badgeTexto}</text>
  </g>

  <!-- Emblema Central Temático -->
  <g transform="translate(200, 180)">
    <circle r="60" fill="rgba(0,0,0,0.3)" stroke="${paleta.accent}" stroke-opacity="0.4" stroke-width="1.5"/>
    <circle r="52" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3,3"/>
    <g transform="translate(-18, -18) scale(1.5)" fill="none" stroke="${paleta.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      ${iconeSvg}
    </g>
  </g>

  <!-- Barra divisória de destaque -->
  <rect x="40" y="${startYTitulo - 28}" width="48" height="4" rx="2" fill="${paleta.accent}"/>

  <!-- Título da Obra -->
  ${xmlLinhasTitulo}

  <!-- Subtítulo / Título Original -->
  ${xmlLinhasSubtitulo}

  <!-- Nome do Autor e Ano -->
  <text x="40" y="${autorY}" font-family="Georgia, 'Times New Roman', serif" font-size="17" font-style="italic" fill="#cbd5e1">${xmlEscape(obra.autor)}</text>
  ${obra.ano ? `<text x="40" y="${autorY + 22}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#94a3b8">Publicação Original: ${obra.ano}</text>` : ''}

  <!-- Rodapé Institucional LinoDigital · Lino Livre -->
  <line x1="40" y1="545" x2="360" y2="545" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <g transform="translate(40, 563)">
    <circle cx="5" cy="5" r="3" fill="${paleta.accent}"/>
    <text x="14" y="9" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="#e2e8f0" letter-spacing="1">LINODIGITAL · LINO LIVRE</text>
    <text x="175" y="9" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="400" fill="#64748b">Cânone Mundial Aberto</text>
  </g>
</svg>`;
}

function executar() {
  console.log(`Gerando ${worldClassicsList.length} capas vetoriais em ${OUTPUT_DIR}...`);
  
  let gerados = 0;
  worldClassicsList.forEach((obra, idx) => {
    const slug = obra.fonteIdExterno.replace(/-/g, '_');
    const filename = `${slug}.svg`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const svgContent = gerarSvgCapa(obra, idx);
    fs.writeFileSync(filepath, svgContent, 'utf8');
    gerados++;
  });

  console.log(`Sucesso: ${gerados} capas geradas em public/capas/world/`);
}

executar();
