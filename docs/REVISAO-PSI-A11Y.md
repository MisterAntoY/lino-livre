# Revisão de Qualidade Web — PageSpeed Insights & Lighthouse (2026-10-23)

> **Fontes oficiais lidas e aplicadas nesta revisão:**
> 1. <https://developers.google.com/speed/docs/insights/languages> — disponibilidade do PSI em português
> 2. <https://developers.google.com/speed/docs/insights/v5/about> — metodologia lab vs. field (PSI v5)
> 3. <https://developer.chrome.com/docs/lighthouse/best-practices/doctype> — auditoria `doctype`
> 4. <https://web.dev/articles/how-to-review> — "Como revisar a acessibilidade" (Rob Dodson)
> 5. <https://developer.chrome.com/docs/lighthouse/accessibility/scoring> — pontuação de acessibilidade (axe-core 4.11)

---

## 1. Metodologia PSI v5 (doc 1 e 2): dados de field vs. dados de lab

O PageSpeed Insights combina **duas fontes de dados** e elas não são intercambiáveis:

| Dados | Origem | Zona | Uso correto |
| --- | --- | --- | --- |
| **Field (real)** | Relatório de UX do Chrome (CrUX), rolling de 28 dias, **percentil 75** | Real, por URL/origem | **É o número da verdade** para os Core Web Vitals; só existe quando há tráfego CrUX suficiente |
| **Lab (sintético)** | Lighthouse em ambiente simulado | Laboratório | Depuração diagnostica (primeiro paint, TBT, detalhes de rede) |

**Regras adotadas neste projeto:**

- O alvo de qualidade é definido no **percentil 75** do tráfego real — não na média, não na experiência de um único usuário.
- Thresholds dos Core Web Vitals (classificação "Bom"):

| Métrica | Limite "Bom" | Observação |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | ≤ 2,5 s | No Lino Livre: carta nº 1 das Obras em Destaque / título do placar |
| INP (Interaction to Next Paint) | ≤ 200 ms | Substitui o FID (migrado em março 2024) |
| CLS (Cumulative Layout Shift) | ≤ 0,1 | O nosso marco interno é **≤ 0,010** após `docs/WEBPERF-CLS.md` (medido 0,00107) |
| FCP | ≤ 1,8 s | Metrica lab |
| TTFB | ≤ 800 ms | Pré-requisito do LCP —dominado pelo cache de borda do Worker |

- **O site é novo (`workers.dev`) e pode ainda não ter dados CrUX.** Enquanto isso, as decisões se baseiam no **lab** (Lighthouse + o instrumento `?clsdebug`), com a obrigatoriedade de revalidação em PSI/field após acumular tráfego.
- A interface do PSI está disponível em **pt-BR e pt-PT** — os relatórios passados ao usuário devem ser sempre em português.

**Como medir (rotina de cada release relevante):**

```bash
# 1) PSI (field+lab) em português:
open "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Flino-livre.linolivre.workers.dev%2F&hl=pt-BR"

# 2) Lighthouse lab local (a11y + best-practices), Chromium "Chrome for Testing" do Playwright:
CHROME="$HOME/Library/Caches/ms-playwright/chromium-1223/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
npx lighthouse "https://lino-livre.linolivre.workers.dev/" \
  --chrome-path="$CHROME" --chrome-flags="--headless=new" \
  --only-categories="performance,accessibility,best-practices" \
  --output=json --output-path=/tmp/lino-lh.json
```

---

## 2. Auditoria `doctype` (doc 3): o 1.º byte decide o modo de renderização

Sem `<!DOCTYPE html>` **no primeiro byte** (sem BOM, espaços ou comentários antes), o navegador cai em *quirks mode* — CSS Box Model quirks, medições de scroll erradas e **CLS instável**. Foi auditado byte-a-byte nas 6 páginas (`index`, `comunidade`, `creditos`, `legal`, `termos`, `offline`): **100% conforme** (95% conformidade verificada por `head -c 16`).

- Proteção regressiva: Teste 1 de `test/lighthouse_static_best_practices.test.js`.

---

## 3. Protocolo de revisão manual de acessibilidade (doc 4 — Rob Dodson)

A revisão de um site existente segue a ordem: **teclado → leitor de tela → affordances → títulos e marcos → automatizar**. Aplicado hoje ao Lino Livre:

### 3.1. Teclado primeiro
- ✅ **Link de salto** ("skip link") `<a class="skip-link" href="#conteudo-principal">` como primeiro elemento focalizável do `<body>` — fora da vista (CLS zero por construção), visível no 1.º Tab. (axe `bypass`, peso 7; `skip-link`, peso 3.)
- ✅ **Anel de foco global `:focus-visible`** (`outline: 3px solid #1d4ed8`) — a guia é explícita: *"evite usar `outline: none` para desativar estilos de foco; se não oferecer alternativa, usuários de teclado não sabem qual elemento está em foco"*. O `style.css` tinha 5 resetes `outline: none` sem alternativa; o anel `:focus-visible` preserva o design do rato e devolve o indicador **somente** para teclado.
- ✅ Nenhum `tabindex` maior que 0 em nenhuma página (auditoria de peso 7).

### 3.2. Marcos semânticos
- ✅ **Um único `<main>`** por documento: a home tinha **4 `<main>`** (um por aba oculta), o que viola o HTML5 e a regra `landmark-one-main` (peso 3) — os marcos das abas `cursos`, `roadmaps`, `dicas` foram rebaixados para `<section>`.
- ℹ️ `lang="pt-AO"` no `<html>` de todas as páginas — BCP-47 válido, correto para o principal público do acervo (auditorias `html-has-lang` + `html-lang-valid`, peso 7).

### 3.3. Leitor de tela e affordances (estado existente, já coberto por revisões anteriores)
- `aria-label` descritivos em todos os controles de leitura/download com o título da obra (§2.18/2.21); `progressbar` do placar com `aria-valuenow`/`aria-valuetext` (peso 7 na regra `aria-progressbar-name`); cabeçalhos HTTP e CSP não afetam a11y; contraste do rodapé corrigido (§2.21).
- ⏳ **Pendências manuais periódicas** (não automatizáveis por Lighthouse, conforme doc 5): navegar a home só com Tab; abrir o modal do Leitor e validar foco preso + `Esc`; leitor de tela (VoiceOver/NVDA — navegar por headings e marcos); zoom a 200% sem colisões.

### 3.4. Movimento reduzido
- ✅ `@media (prefers-reduced-motion: reduce)` no estilo **global** (`style.css`) — anteriormente existia apenas no CSS crítico inline da home; páginas institucionais ficavam sem proteção.

---

## 4. Pontuação de acessibilidade do Lighthouse (doc 5): o que ela realmente mede

- Cada auditoria axe-core é **binária** (pass/fail — sem meio-ponto) e adiciona um **peso** ao score final. Peso máximo (10): `button-name`, `image-alt`, `label`, `select-name`, `meta-viewport`, `aria-*` (estrutura/validade), `meta-refresh`, `video-caption`, campos de formulário sem múltiplos rótulos.
- A nota de acessibilidade **não inclui** auditorias manuais. **Score 100 no Lighthouse ⇏ site acessível.** O checklist manual obrigatório (doc 5): foco preso, tab-order lógico, conteúdo fora de tela ocultado de AT, gestão de foco quando conteúdo novo entra na página, affordance de controles interativos, ordem visual = ordem DOM.

---

## 5. Ciclo de revisão contínua adotado

1. **Antes do merge** de qualquer PR com frontend: rodar `npm test` (inclui a suíte estática nova — Testes 1-10 de `test/lighthouse_static_best_practices.test.js`).
2. **Depois do deploy**: rodar Lighthouse lab (comando da Sec. 1) e registar os scores na linha de baixo.
3. **Com tráfego mensal suficiente** (site nas CrUX): comparar os **percentis 75** de LCP/INP/CLS no PSI e abrir item de correção para qualquer métrica fora de "Bom".
4. Re-validação específica pendente: **CLS/LCP de produção depois do merge do PR #1** (`perf/lcp-fontes-animacoes`) — a crítica inline muda com ele.

---

## 6. Registro da revisão aplicada nesta data

| Achado | Guia de origem | Correção | Teste |
| --- | --- | --- | --- |
| Doctype 1.º byte (6/6 páginas) | doc 3 | Já conforme | Teste 1 |
| `lang` presente e válido BCP-47 | doc 5 (peso 7) | Já conforme (`pt-AO`) | Teste 2 |
| Viewport sem restrições de zoom | doc 5 (peso 10) | Já conforme | Teste 3 |
| Títulos/charset presentes | doc 5 (peso 7) | Já conforme | Testes 4-5 |
| **4× `<main>` na home** | doc 4/5 (`landmark-one-main`, peso 3) | 1× `<main>`; demais → `<section>` | Teste 6 |
| **Sem linha de salto** | doc 4 ("bypass", peso 7) | `a.skip-link` + âncora no `<main>` | Testes 7, 9 |
| **5× `outline:none` sem alternativa** | doc 4 ("evite outline: none") | `:focus-visible` global (3px #1d4ed8) | Teste 8 |
| `prefers-reduced-motion` só na home | doc 4 | Bloco global no `style.css` | Teste 10 |
| Sem `tabindex` > 0; sem iframes sem título | doc 5 | Já conforme | — |

> **Regra do repositório mantida:** nenhum ficheiro da obra é armazenado; todas as adições são estáticas de front-end e documentação, zero armazenamento de livros.
