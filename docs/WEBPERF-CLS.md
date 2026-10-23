# WebPerf — Eliminação de Layout Shifts (CLS) na Home
>Data: 2026-10-23 → Objectivo: CLS total < 0,1 (Google Page Experience na home `public/index.html`).
Relatório do Lighthouse do utilizador: **CLS ≈ 0,410** com dois deslocamentos (0,360 + 0,050) atribuídos a `#aba-livros` (o Placar "Rumo aos 10 Milhões").

## Causas-raiz identificadas (diagnóstico linha a linha)

| # | Causa | Ficheiro | Efeito no utilizador |
|---|-------|----------|----------------------|
| 1 | `style.css` carregado com o truque `media="print"` + `onload`: o CSS completo chegava depois da 1.ª pintura e reformatava o layout inteiro (Placar, banners, filtros) de uma vez | `public/index.html` | Salto gigante [0,36 est.] |
| 2 | Troca de opções do `<select id="seletor-idioma">` pelo `I18N.montarSeletor()` — as etiquetas HTML ("Português", "English"…) eram substituídas pelos endónimos do `LABELS_PADRAO` ("Português (Angola)"…) → o seletor tornava-se mais largo e **empurrava os botões "Apoiar Projeto" e "+ Adicionar Livro"** | `public/index.html` + `public/js/i18n.js` | Salto horizontal permanente no cabeçalho |
| 3 | Botões `#btn-header-comunidade` / `#btn-header-canal` declarados com `.hidden` (display:none) e revelados só depois de responderem `/api/comunidade` e `/api/canal` → o conteúdo do cabeçalho volta a deslocar-se; em janelas estreitas fazia a média do cabeçalho alterar-se e deslocava o `#aba-livros` verticalmente | `public/index.html` + `public/js/app.js` | Salto no cabeçalho + salto vertical possível [0,05 est.] |
| 4 | `milestone-tag` estático "Próximo" era reescrito para "Próximo marco" (pt) logo no arranque → a fila de marcos (com `justify-content:space-between`) redistribuía os pontos seguintes | `public/index.html` + pt.json | Salto pequeno no Placar |
| 5 | Fontes Lora/Noto via CDN do Google com `display=swap` chegavam em 2 eliminatórias → tornava-se possível trocar de fonte no leitor/web em rede lenta; nas visitas zh estava a descarregar ~50 KB de @font-face chinês em TODAS as visitas | `public/index.html` | Salto interno no leitor + desperdício de rede |

## Correções aplicadas

1. **CSS render-blocking** (`?v=20261023`): a página nunca é pintada sem os estilos finais → CLS de 1 é a zero. FCP mantém-se rápido (o gzip do style.css ~14 KB + CSS crítico embutido).
2. **Lora auto-hospedada**:
   - `public/fonts/lora-latin-var.woff2` (eixo 400–700) e `public/fonts/lora-italic-latin-var.woff2` — licença **SIL OFL** (sitio autêntico do Google Fonts, sub-conjunto latin);
   - `@font-face` com **`font-display: optional`** no CSS crítico e no `style.css` → a fonte só é usada se estiver pronta na 1.ª pintura; existem apenas **duas regras @font-face** para o leitor;
   - `<link rel="preload" as="font" crossorigin>` para os dois ficheiros de ~60 KB no total.
3. **Noto SC (chinês) conditional lazy-loading**: `I18N.garantirFontesZh()` (em `public/js/i18n.js`) injeta o CSS do Google apenas quando `lang === 'zh'`.
   Nas visitas pt/en/es/etc. deixa de haver qualquer descarga de han.
4. **Paridade de etiquetas no seletor de idioma**: o HTML estático vem com exatamente os 7 endónimos do `LABELS_PADRAO` → `montarSeletor()` reescreve as mesmas cadeias → a largura do seletor não muda nunca.
5. **Reserva anti-CLS dos botões WhatsApp**: nova classe CSS `.btn-agendado { visibility:hidden; pointer-events:none }`; os botões do cabeçalho já nascem com a largura final, e o `app.verificarComunidadeECanal()` troca a classe em vez de `.hidden`.
   Acessibilidade: a `visibility:hidden` retira-os da árvore de acessibilidade e da ocorrência de tab, e o JS remove `aria-hidden`/`tabindex` na ativação.
6. **Marco estático já com o texto final** ("Próximo marco" em vez de "Próximo") — pt.json fica igual.
7. **Service Worker**: os `.woff2` entram no `PRECACHE_ASSETS` (leitor offline mantém a Lora); estratégia de Fontes Cache-First mantém.
8. **Páginas institucionais** (credita/ter/comunidade/legal): remove-se a variante Lora do CSS CDN (agora só Plus Jakarta Sans) já que a Lora vem das regras de `@font-face` locais.

## Instrumentação de diagnóstico
Um bloco em `public/index.html` ativa o `document.querySelector('script[data-clsdebug]')` apenas com `?clsdebug`:
- expõe `window.__clsDebug = { total, shifts }` em consola — cada deslocamento com os fontes DOM, dx/dy e tempo.
Nota: em desktop a partir do terminal (`visibilityState: hidden`) o Chromium não gera nenhum `layout-shift`; na testa com a janela do browser visível.

## Como validar
```bash
npm start                                # Express, porta 3000
node .../cls_throttle_proxy.mjs          # throttle: atrasa o style.css 2.5s e as fontes para reproduzir o Fast 4G do Lighthouse
# abrir http://localhost:3001/?clsdebug e no console: __clsDebug
```
