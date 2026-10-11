# 📌 Decisão do Responsável — Manutenção do Acervo com Livros Comerciais

**Data:** 11/10/2026
**Destinatário:** agente implementador
**Contexto:** `AUDITORIA-PRODUCAO-11-10.md` (auditoria técnica ao site em produção)

---

## 1. O que a auditoria apontou

A auditoria confirmou que **294 dos 367 livros** do site provêm de dois repositórios
GitHub (`KAYOKG/BibliotecaDev` — 109 livros, `italocamil0/books` — 185 livros)
com PDFs de **livros comerciais editados** (Casa do Código, Novatec, Elsevier,
guias de certificação AWS, títulos HBR), sem licença de redistribuição.

Riscos identificados e registados:
- Reclamação de editora → possibilidade de desativação do Worker pela Cloudflare;
- Responsabilização legal da escola (Lei 9.610/98 / Código do Direito de Autor);
- Recomendação da auditoria: remover as duas fontes e substituir por conteúdo
  aberto (OpenStax, Gutenberg, Domínio Público, LibreTexts, etc.).

## 2. Decisão do responsável

Depois de **plenamente informado** dos riscos acima, o responsável pelo projeto
decidiu, em 11/10/2026, **manter os livros no acervo e assumir o risco**.

A razão dada pelo responsável, que fica registada nesta íntegra:

> *"Prefiro correr o risco, pois igual a milhares de crianças e jovens — eu já
> tive dificuldade de ter acesso ao livro que custa 1$ em África. A escolha era
> simples: entre comer ou comprar o livro."*

Princípio invocado: o conhecimento deve ser **livre, aberto e acessível para
todos**. O projeto serve alunos sem condições financeiras; para muitos deles, a
alternativa a estes livros não é "outra fonte melhor", é **não ter o livro nenhum**.

A auditoria mantém-se integralmente no seu ficheiro como **registo formal de que
o risco foi apontado e conhecido** — a decisão é informada e consciente.
Esta decisão é **do responsável pelo projeto** e vale para este projeto.

## 3. Instruções para o agente implementador

### ❌ NÃO fazer
1. **Não remover** as fontes `github-bibliotecadev` nem `github-italocamilo`.
2. **Não apagar** a secção de livros técnicos do acervo.
3. Não alterar esta decisão sem nova instrução explícita do responsável.

### ✅ SIM fazer (por prioridade)

| # | Tarefa | Detalhe |
|---|---|---|
| 1 | **Configurar o WhatsApp** | Passar `WHATSAPP_COMMUNITY_URL` e `WHATSAPP_CHANNEL_URL` (do `.env`) para as variáveis do Worker; desocultar botões e cards; os endpoints `/api/comunidade/qrcode.svg` e `/api/canal/qrcode.svg` devolvem hoje 404 "não configurado". |
| 2 | **Corrigir a paginação** | `/api/livros?pagina=N` devolve sempre os mesmos 24 registos (o parâmetro `pagina` está ignorado; `limite` funciona). |
| 3 | **Zerar contadores de leituras** | Valores atuais (990, 950, 940…) são sintéticos; todos os registos foram criados em 2026-10-10. Esconder a métrica até haver tráfego real. |
| 4 | **Ko-fi** | Renomear "Lino Live" → **"Lino Livre"**, confirmar o email da conta (em falta), colocar foto e texto próprios. |
| 5 | **Coleção África: remover links mortos** | Os PDFs `archive.org/details/mandela-long-walk-chinese`, `things-fall-apart-chinua-achebe` e equivalentes devolvem **404**; vários "livros" são artigos da Wikipédia com capa. Substituir os links mortos por obras reais e apagar entradas sem conteúdo verdadeiro. |
| 6 | **Acrescentar acervo africano legal** | Integrar de `CATALOGO-RECURSOS-GRATUITOS.md` as secções 🦁 Acervo de África, 🌍 Línguas africanas, 🇬🇧 literatura africana em inglês, 🇫🇷 em francês (~350 entradas verificadas). Isto **não substitui** os livros mantidos — **acrescenta** e dá verdade ao cartaz "Coleção Monumental de África". |
| 7 | **PDFs do Domínio Público** | Todos os `dominiopublico.gov.br/download/...` devolvem 403. Preferir o EPUB do Gutenberg e o HTML da Wikisource (ambos 200 confirmados). |
| 8 | **Reduzir exposição jurídica** | Trocar "em parceria com Guia de TI / Roadmap.sh / Trilha Info" por "recursos de" (não há acordo de parceria). Incluir no rodapé contacto para pedidos de remoção de conteúdo e responder prontamente a esses pedidos. |

### ℹ️ Recomendação da auditoria (mantida, opcional)

O acervo legal testado (2.891 recursos) deve continuar a ser alimentado ao site
em paralelo. Serve de **rede de segurança**: se um dia os links comerciais
caírem por remoção ou denúncia, o site continua de pé com conteúdo que não pode
ser retirado. Quanto mais legal acervo houver, mais duradouro é o projeto.

---

### 🛡️ Princípio Arquitetónico e Jurídico de Defesa (Adicionado em 11/10/2026):
> **Posição do Responsável:** A infraestrutura e o banco de dados da aplicação **não armazenam nem guardam nenhum arquivo/livro**. O servidor atua unicamente como **intermediário e indexador de links**, apontando para URLs externas. Esta separação é a linha de defesa técnica e jurídica estabelecida caso ocorra qualquer processo ou disputa legal.

---

*Ficheiro emitido pela equipa de auditoria a pedido do responsável.
A implementação segue a ordem da tabela do ponto 3.*
