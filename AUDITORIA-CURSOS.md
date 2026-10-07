# Auditoria — Diretório de Cursos Gratuitos (Fase 7)

**Auditado:** `src/database/seed.js` (linhas 225–268), commit `5785489` do agente Gemini.
**Data:** 7 de outubro de 2026.
**Pedido do responsável:** incluir DIO e Alura, **sem focar apenas no mercado tech**.

---

## 1. Resultado geral

| Afirmação do Gemini | Verificado | Estado |
|---|---|---|
| 32 cursos | 32 registos no seed | ✅ |
| 8 plataformas | **9** (Sebrae não foi contado) | ⚠️ |
| "Cursos" | Vários são **livros** (OpenStax) ou **simulações** (PhET), não cursos | ⚠️ |
| Todos com link próprio | **14 de 32** apontam para a página inicial da plataforma | ❌ |
| Cursos reais | Pelo menos **2 a 6 parecem inventados** (ver secção 3) | ❌ |

## 2. Distribuição por área

| Área | Nº | % |
|---|---|---|
| Ciências Humanas | 7 | 22% |
| Tecnologia | 6 | 19% |
| Ciências Exatas | 6 | 19% |
| Ciências Biológicas | 5 | 16% |
| Matemática | 4 | 13% |
| Linguagens | 3 | 9% |
| Gestão | 1 | 3% |

Tecnologia sozinha não domina (19%), mas o conjunto é **muito centrado em ciências e matemática (66%)**.
**Áreas em falta:** saúde, artes e música, cultura e audiovisual, agricultura e ambiente, línguas estrangeiras (além do inglês), formação de professores, profissões técnicas (alimentação, turismo, segurança), desporto, direito e cidadania.

## 3. Problemas encontrados

### 3.1 Links genéricos (14 de 32)
| URL | Vezes | Cursos afetados |
|---|---|---|
| `https://www.oercommons.org` | 5 | Astronomia, Ecologia, Filosofia, Geografia, Robótica |
| `https://www.ev.org.br` | 5 | Fund. Programação, Literatura e Redação, Inglês Instrumental, Gestão de Projetos, Educação Financeira |
| `https://phet.colorado.edu/pt_BR/` | 2 | Física Geral, Química Orgânica |
| `https://pt.khanacademy.org` | 1 | Gramática |
| `https://ocw.mit.edu` | 1 | Cálculo e Álgebra Linear |

O título promete um curso específico, mas o link leva só à página inicial, e o aluno não encontra o curso.

### 3.2 Cursos provavelmente inventados
- **"Literatura Brasileira e Redação Escolar"** e **"Inglês Instrumental"** (Fundação Bradesco): as áreas oficiais da Escola Virtual são Análise de Dados, Desenvolvimento Pessoal e Profissional, Educação e Tecnologia, IA, Negócios e Inovação, Produtividade, Programação e TI. Estes cursos não aparecem nessas áreas.
- **5 cursos "OER Commons"** com títulos genéricos e o mesmo link: o OER Commons é um repositório, não tem um curso com esse nome. Cada entrada tem de apontar para um recurso concreto.
- **"Química Orgânica e Ligações Moleculares" (PhET)**: o PhET tem simulações de moléculas, mas não de química orgânica. A descrição não corresponde ao conteúdo.

### 3.3 Links com problemas
| Link | Resultado |
|---|---|
| Sebrae `.../cursosonline` | Redireciona para `loja.sebrae.com.br`, a **loja**. Há cursos gratuitos, mas o link deve abrir a lista dos gratuitos. |
| OER Commons e CK-12 (4 links) | Responderam **403** a pedidos automáticos (proteção anti-robô). Confirmar num navegador. |
| Khan Academy | Responde com página de proteção. Confirmar num navegador. |
| CS50, MIT OCW, OpenStax, PhET (circuitos), Bradesco | ✅ 200 |

### 3.4 Outros
- **Idioma:** 13 cursos são **só em inglês** (MIT, OpenStax, CK-12, CS50, OER). Isso não aparece no site e é importante para alunos de língua portuguesa.
- **Elegibilidade:** a Fundação Bradesco exige **CPF** (só Brasil). O mesmo acontece com as plataformas do governo brasileiro (login gov.br). Se o público estiver em Portugal ou em Angola, esses cursos não servem.
- **Licença:** o campo mistura licença (`cc-by`) com preço (`gratuito`). Faltam campos para **idioma**, **certificado** e **tipo**.
- **Fontes do relatório anterior não usadas:** NAU (Portugal), que estava em `FONTES-CONTEUDO-GRATUITO.md`.

## 4. DIO e Alura (pedido do responsável)

| Plataforma | O que é gratuito | Cuidado |
|---|---|---|
| **DIO**: dio.me/bootcamp | **Bootcamps gratuitos patrocinados** por empresas (ex.: Microsoft, Santander, iFood, Carrefour), com certificado | 100% tecnologia; o site tem muita publicidade a planos pagos. Ligar **só** à página de bootcamps gratuitos. |
| **Alura**: alura.com.br/imersao | **Imersões gratuitas** (5 aulas, com certificado) em edições periódicas; existe também uma página de conteúdos gratuitos | O catálogo principal é **pago** (cerca de R$ 1.200/ano). As imersões têm datas: quando não houver edição aberta, mostrar "inscrições em breve". |

Ambas são **só tecnologia**. Para cumprir o pedido de não focar apenas no tech, entram como **2 de muitas** plataformas, compensadas com as da secção 5.

## 5. Plataformas para equilibrar as áreas (verificadas em 07/10/2026)

| Plataforma | Áreas | País / requisito | Link |
|---|---|---|---|
| **NAU (FCT)** | Saúde, desporto, sustentabilidade, literatura (Eça, Saramago), IA | Portugal; aberta a todos | nau.edu.pt/pt/cursos |
| **Aprenda Mais (MEC)** | Ambiente e Saúde, Humanas, Educação, Idiomas e Literatura, Produção Alimentícia, Recursos Naturais, Turismo, Produção Cultural e Design, Segurança. Com certificado | Brasil | aprendamais.mec.gov.br |
| **Lúmina (UFRGS)** | Mais de 100 MOOCs: Saúde e Biológicas (39), Humanas e Sociais (33), Letras e Artes (11), Tecnologia (28). Certificado UFRGS | Brasil; aberta | lumina.ufrgs.br |
| **Escult (Ministério da Cultura)** | Audiovisual, fotografia, animação, música, gestão cultural; com Libras e audiodescrição | Brasil; login gov.br; a partir de 14 anos | escult.cultura.gov.br |
| **Embrapa e-Campo** | Agricultura, pecuária, apicultura, hortas, ambiente, alimentação (193 cursos gratuitos) | Brasil; aberta | e-campo.sede.embrapa.br |
| **OpenWHO (OMS)** | Saúde pública, primeiros socorros, saúde mental (há cursos em português) | Internacional; aberta | openwho.org/courses |
| **Fundação Bradesco**, cursos não-tech reais | Ex.: "Regulação da Preocupação e da Ansiedade" (4h), "LGPD" (2h), "Liderança Lean" (4h) | Brasil; CPF | ev.org.br/cursos/... |

**Evitar:** sites do tipo "curso grátis com certificado" (Prime Cursos, Elevo, Gama e semelhantes). O curso é grátis, mas **o certificado é pago**, o que engana os alunos.

## 6. Correções pedidas ao Gemini

1. **Remover ou substituir** os cursos inventados da secção 3.2.
2. **Cada entrada aponta para um curso concreto**, nunca para a página inicial. Se for uma plataforma inteira, marcar `tipo = 'catalogo'` e usar o nome da plataforma como título (ex.: "Embrapa e-Campo — catálogo de cursos").
3. **Novos campos** na tabela `cursos`:
   - `idioma` (`pt`, `en`, ...)
   - `tipo` (`curso`, `bootcamp`, `simulacao`, `livro-texto`, `catalogo`)
   - `certificado` (`gratuito`, `pago`, `sem`)
   - `requisito` (ex.: `CPF`, `gov.br`, `nenhum`)
   - `verificado_em` (data da última verificação do link)
4. **Equilíbrio de áreas:** pelo menos 3 cursos por área, e **tecnologia no máximo 20%** do total (incluindo DIO e Alura).
5. **Novas áreas:** Saúde, Artes e Cultura, Agricultura e Ambiente, Línguas, Formação de Professores, Profissões Técnicas, Desporto.
6. **Mostrar no site** o idioma e o requisito (ex.: "🇬🇧 Em inglês", "Requer CPF").
7. **Corrigir o Sebrae** para a lista de cursos gratuitos e confirmar num navegador os links do OER Commons, CK-12 e Khan Academy.
8. Corrigir o README: "8 plataformas" passa a "9".

## 7. Pergunta em aberto para o responsável

**Onde estão os alunos?** No Brasil, em Portugal, em Angola ou noutro país? A resposta decide se entram as plataformas que exigem CPF ou gov.br (Bradesco, Escult) ou se é melhor dar prioridade às abertas a todos (NAU, OpenWHO, Khan Academy, Lúmina, Embrapa).
