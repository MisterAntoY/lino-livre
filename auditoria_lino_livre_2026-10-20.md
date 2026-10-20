# Auditoria técnica aprofundada — Lino Livre

**Data:** 20 de outubro de 2026  
**Repositório:** [MisterAntoY/lino-livre](https://github.com/MisterAntoY/lino-livre)  
**Branch analisado:** `main`  
**Commit observado no topo durante a revisão:** `370f79bb` (`chore: adicionar pasta .scratch ao .gitignore para manter o repositório limpo`)  
**Tipo:** revisão estática de código, arquitetura, testes, migrações, pipeline e conteúdo de catálogo.

## Limites desta auditoria

O repositório contém mais de 13 mil caminhos, incluindo muitos ficheiros de capas e dados gerados. Revisei os caminhos de execução principais e os pontos críticos do frontend, Worker, importadores, esquema, seed, testes e workflows. Não seria correto afirmar que cada linha de cada ficheiro de dados e imagem foi validada individualmente. Também não consegui consultar a API do domínio publicado diretamente neste ambiente; as observações sobre produção são, por isso, distinguidas das conclusões confirmadas pelo código de `main`.

As classificações abaixo significam: **Crítica** = expõe a aplicação/dados a abuso ou torna uma parte importante do produto não fiável; **Alta** = pode corromper dados, publicar informação enganadora ou quebrar o funcionamento; **Média** = problema de manutenção, qualidade, desempenho ou experiência; **Baixa** = melhoria recomendada.

---

# 1. Conclusões mais urgentes

## 1.1. Crítica — endpoints de escrita sem autenticação no Worker

**Referências:** [livros e links](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L643-L766), [autores](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L278-L335), [categorias](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L198-L245), [cursos](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L941-L974), [importação](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L779-L815), [CORS](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L8-L14).

O Worker expõe operações `POST`, `PUT` e `DELETE` de livros, autores, categorias e cursos, além de permitir criar trabalhos de importação. No middleware visível, só encontrei CORS; não encontrei autenticação, autorização de administrador, limite de pedidos ou fila de moderação. O formulário público “Adicionar Livro” chama estas rotas diretamente.

CORS não é controlo de acesso. Com as rotas acessíveis pela Internet, alguém pode inserir lixo, alterar ou eliminar registos, criar links enganadores, gerar trabalhos de importação em massa e aumentar consumo da D1. Como há também sinks HTML não seguros no frontend, os dados inseridos podem desencadear um problema de XSS persistente.

**Correção:** colocar todas as mutações atrás de autenticação de administrador; remover do público `DELETE`, `PUT` e importação; se quiseres aceitar contribuições, aceitar submissões numa tabela/fila separada que exija aprovação. Adicionar rate limiting, limites de tamanho do corpo, validação de esquema e logs de auditoria.

## 1.2. Crítica — provável XSS persistente através de dados do catálogo

**Referências:** [renderização de livros](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L330-L390), [renderização de cursos](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L1045-L1080), [episódios de podcasts](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L1585-L1625), [formulário público](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L1960-L2045).

Há vários casos em que metadados vindos do backend são inseridos em `innerHTML` sem escapar ou validar adequadamente o contexto:

- `capa_url` é interpolado diretamente em `img src="${capaUrl}"`.
- `idioma` é usado para formar classes HTML e `flagLabel`; o fallback `l.idioma.toUpperCase()` é inserido sem escape.
- Em `renderizarCursos`, a variável `prazo`, extraída de `c.descricao`, é inserida sem escape em `deadlineBadge`.
- Em episódios, `spotify_embed_url`, `spotify_url` e valores colocados em handlers `onclick` são interpolados diretamente. O helper não escapa apóstrofos, o que é perigoso dentro de strings JavaScript delimitadas por apóstrofos.

Estes caminhos tornam-se especialmente sérios porque as APIs de escrita estão públicas no código. Um atacante poderia tentar guardar HTML/JavaScript nos metadados e fazê-lo executar nos navegadores de visitantes.

**Correção:** corrigir primeiro a ausência de autenticação; validar cada campo no servidor; validar URLs com `new URL()` e uma allowlist de protocolos/domínios; construir cartões com `document.createElement` e `textContent`, evitando `innerHTML` para dados; remover handlers inline e usar `addEventListener`. Em HTML, texto e atributos são contextos diferentes: um único `escape()` genérico não resolve todos.

## 1.3. Crítica — dashboard usa valores estáticos como se fossem atuais

**Referências:** [dashboard e fallback](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L20-L168), [migração de estatísticas](https://github.com/MisterAntoY/lino-livre/blob/main/migrations/0003_estatisticas.sql), [configuração do cron](https://github.com/MisterAntoY/lino-livre/blob/main/wrangler.jsonc#L15-L30), [fim do Worker](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L1188-L1206).

O dashboard devolve valores pré-definidos — por exemplo, 104.848 livros, 37.919 autores e 7.501 cursos — quando não consegue ler ou calcular os dados. A migração `0003_estatisticas.sql` também semeia esses totais estáticos.

A configuração agenda um cron diário, e os comentários dizem que esse cron recalculará `estatisticas` e `contadores`. Porém, no código de Worker revisto, o módulo termina com `export default app` e não contém um handler `scheduled()` que faça esse cálculo. A árvore tem um único ficheiro de migração em `workers/migrations`, enquanto as migrações de produção estão na pasta raiz, o que aumenta a confusão; o pipeline aplica o diretório de migrações por defeito da raiz.

**Impacto:** se as tabelas de agregados estiverem vazias/desatualizadas, o dashboard pode apresentar números históricos ou inventados, em vez de indicar indisponibilidade. Não consegui confirmar o estado real das tabelas D1 ao vivo; a ausência do handler no código é o problema confirmado.

**Correção:** implementar e testar o cálculo em `scheduled()` ou usar um workflow/serviço real para atualizar agregados; guardar timestamp de atualização; se os dados falharem, devolver uma resposta marcada como degradada e não números apresentados como atuais.

## 1.4. Alta — o fallback da API de livros devolve amostras fixas para qualquer pesquisa

**Referência:** [paginação e fallback de `/api/livros`](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L371-L640).

Quando a consulta falha, a API devolve cinco obras fixas e `total: 104848`, com totais de páginas baseados nesse número, sem respeitar pesquisa, idioma, categoria ou página solicitada. O frontend não trata de forma visível o cabeçalho `X-Data-Status: degraded` que o Worker coloca em alguns casos.

Alguns links/IDs neste conjunto de contingência são estáticos e não necessariamente correspondem às relações `livros`/`links_livros` da D1; o botão pode abrir uma rota inexistente ou uma relação diferente da esperada.

**Correção:** em erro de base de dados, devolver `503` com uma mensagem clara ou servir uma cache persistida de resultados reais, identificada como antiga. Não simular uma pesquisa bem-sucedida com registos e totais que não correspondem à consulta.

## 1.5. Alta — o importador Open Library rotula obras como domínio público sem verificar direitos

**Referência:** [importador do Worker](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/services/importer.ts#L125-L170), [importador Express](https://github.com/MisterAntoY/lino-livre/blob/main/src/services/importer.js).

A função `buscarOpenLibrary()` usa `has_fulltext=true`, mas não valida uma licença de redistribuição nem o estatuto de domínio público de cada obra. A própria função atribui `licenca: 'dominio-publico'` aos resultados. A pesquisa da Open Library e a presença de texto integral não demonstram, por si só, que a obra possa ser redistribuída livremente. A rota registada para cada resultado é, muitas vezes, uma página de metadados `/works/...`, não um ficheiro de livro diretamente disponível.

Além disso, o importador genérico usa `item.licenca || 'dominio-publico'`, transformando licença desconhecida numa afirmação positiva de domínio público.

**Correção:** nunca atribuir domínio público por defeito. Usar um estado explícito `não verificada`; importar licença e URL de evidência da fonte; exigir decisão de curadoria antes de publicar; distinguir página de metadados de link de leitura integral.

## 1.6. Alta — redirecionamentos para URLs arbitrárias

**Referências:** [redirecionamento de livros](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L610-L640), [redirecionamento de cursos](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L929-L939).

O redirecionamento de livros só verifica se a URL começa por `http`; o redirecionamento de cursos usa diretamente `curso.url`. Não há validação central para HTTPS, formato da URL, host ou fonte autorizada. Com a escrita pública descrita acima, alguém poderia inserir links de phishing apresentados como livros/cursos do Lino Livre.

**Correção:** permitir apenas URLs HTTPS válidas e exigir aprovação de domínios/fontes reconhecidos; mostrar o domínio de destino ao utilizador; registar a fonte autorizada para cada link.

---

# 2. Problemas adicionais de implementação

## 2.1. Alta — sincronização de cursos não demonstra atualização da D1 de produção

**Referências:** [workflow do Microsoft Learn](https://github.com/MisterAntoY/lino-livre/blob/main/.github/workflows/sync-ms-learn.yml), [sincronizador](https://github.com/MisterAntoY/lino-livre/blob/main/scripts/sync_ms_learn.js), [rota de cursos que lê D1](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L836-L888), [workflow de deploy](https://github.com/MisterAntoY/lino-livre/blob/main/.github/workflows/deploy.yml).

O sincronizador do Microsoft Learn atualiza ficheiros locais `src/database/msLearnData.json` e `msLearnData.js`, e chama `atualizarBancoLocal()` sobre SQLite local. O workflow depois faz commit dos ficheiros de catálogo e do relatório para `main`, com `[skip ci]`. Não vi nesse fluxo um passo que grave os dados sincronizados na D1 remota. Entretanto, a rota publicada `/api/cursos` lê a tabela `cursos` da D1; não lê aqueles ficheiros JSON.

**Impacto provável:** uma sincronização pode passar, gerar commit e relatório, sem que os cursos novos apareçam no site publicado. O mesmo padrão deve ser verificado nos workflows dos outros fornecedores. É necessário provar o caminho de ponta a ponta para cada sincronizador, não apenas confirmar que o ficheiro JSON mudou.

**Correção:** definir uma única fonte de verdade. Após validar o catálogo, executar uma carga idempotente na D1 remota (ou publicar uma versão que realmente o use), aguardar sucesso e fazer smoke test da API publicada. Evitar `skip ci` quando a alteração exige publicação; se for intencional, criar um workflow separado de importação remota com status observável.

## 2.2. Alta — deploy pode continuar mesmo com migrações D1 falhadas

**Referência:** [workflow CI/CD](https://github.com/MisterAntoY/lino-livre/blob/main/.github/workflows/deploy.yml#L35-L125).

Os passos de diagnóstico e migração usam `continue-on-error: true`; em caso de falha, o workflow emite aviso e ainda executa `wrangler deploy`. Isso permite publicar código que depende de tabelas/colunas que não existem na D1 remota. Há uma repetição, mas a segunda falha também não impede o deploy. Não existe smoke test posterior que verifique endpoints e esquema no ambiente publicado.

**Correção:** separar deploy de infraestrutura; migrar primeiro e abortar a publicação se uma migração obrigatória falhar. Depois da publicação, fazer testes simples às rotas de saúde, dashboard, livros, cursos e comunidade. Só permitir continuação em migrações verdadeiramente opcionais e comprovadamente compatíveis.

## 2.3. Alta — os testes exercitam Express local, não o Worker em produção

**Referências:** [testes](https://github.com/MisterAntoY/lino-livre/blob/main/test/api.test.js#L1-L25), [app Express](https://github.com/MisterAntoY/lino-livre/blob/main/src/app.js), [Worker Hono](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts), [configuração TypeScript](https://github.com/MisterAntoY/lino-livre/blob/main/tsconfig.json).

`test/api.test.js` importa `../src/app`, que é a implementação Express/SQLite. A aplicação publicada usa Hono/Cloudflare Workers/D1. O pipeline executa testes e `tsc`, mas os testes funcionais do Worker não estão presentes no conjunto observado. Por isso, CI verde demonstra que o backend local passa os testes, não que os handlers Hono e a D1 estão corretos.

**Correção:** testar o Worker com `wrangler dev`/ambiente de teste e D1 de teste; criar testes dos handlers e das migrações; manter os testes Express apenas se o backend local continuar a ser uma implementação suportada.

## 2.4. Alta — dois backends e vários esquemas podem divergir

**Referências:** [package.json](https://github.com/MisterAntoY/lino-livre/blob/main/package.json), [backend local](https://github.com/MisterAntoY/lino-livre/blob/main/src/server.js), [schema local](https://github.com/MisterAntoY/lino-livre/blob/main/src/database/schema.sql), [migrações raiz](https://github.com/MisterAntoY/lino-livre/tree/main/migrations), [migração em `workers/migrations`](https://github.com/MisterAntoY/lino-livre/blob/main/workers/migrations/0001_initial_schema.sql), [configuração Cloudflare](https://github.com/MisterAntoY/lino-livre/blob/main/wrangler.jsonc).

O projeto mantém Express + SQLite para execução local e Hono + D1 para produção, além de esquemas SQL no código local, migrações na raiz e uma migração adicional em `workers/migrations`. Há risco de alguém corrigir uma versão e esquecer as outras. O `tsconfig.json` só abrange `workers/**/*.ts`, por isso não apanha erros de frontend JS, scripts ou controllers Express.

**Correção:** documentar explicitamente que backend é a fonte de verdade; gerar/verificar o esquema a partir de uma única definição; retirar duplicados não usados ou automatizar teste que compara o esquema; adicionar lint/type checking para JavaScript e scripts essenciais.

## 2.5. Alta — `npm run seed` apaga e recria o banco local

**Referência:** [seed da base de dados](https://github.com/MisterAntoY/lino-livre/blob/main/src/database/seed.js#L80-L120).

A função `seed()` abre uma transação, apaga links, episódios, podcasts, trabalhos de importação, cursos, livros, autores, categorias, fontes e sequência de IDs, e depois volta a inserir os dados de seed. Isto não é uma sincronização incremental: é um reset destrutivo da base SQLite local. Pode apagar contagens de leitura e dados criados manualmente se alguém repetir o comando na base usada no dia a dia.

**Correção:** chamar a operação `reset-seed` ou `seed --reset`, pedir confirmação em ambiente local e abortar se houver dados não descartáveis; ter um comando separado de seed idempotente que não apague dados existentes. Nunca executar isto implicitamente contra produção.

## 2.6. Média — escape HTML tem erro de dupla codificação e não protege todos os contextos

**Referência:** [helper `escape`](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L2180-L2210).

O helper substitui `<` por `&amp;lt;`, `>` por `&amp;gt;` e `"` por `&amp;quot;`. Quando o navegador processa a entidade, o texto resultante contém `&lt;`/`&quot;` visíveis em vez dos caracteres originais. Ao mesmo tempo, não escapa apóstrofos em strings JavaScript e não valida URLs. Assim, a função prejudica a apresentação sem oferecer uma defesa universal contra XSS.

**Correção:** usar `textContent` para texto simples, `setAttribute` com validação para atributos e APIs/estratégias adequadas para cada contexto; se for necessário escapar HTML, escapar `&` primeiro e depois usar `&lt;`, `&gt;`, `&quot;` e `&#39;`. Não tentar corrigir XSS apenas acrescentando mais substituições a este helper.

## 2.7. Média — os filtros de idioma prometem Português do Brasil sem ficheiro correspondente

**Referências:** [i18n](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/i18n.js#L10-L45), [ficheiros de idioma](https://github.com/MisterAntoY/lino-livre/tree/main/public/locales), [seletor HTML](https://github.com/MisterAntoY/lino-livre/blob/main/public/index.html#L120-L145).

`IDIOMAS` inclui `pt-br`, mas a pasta de idiomas contém `pt.json`, `en.json`, `es.json`, `de.json`, `fr.json` e `zh.json` — não há `pt-br.json`. Como o seletor é reconstruído pelo código i18n, pode oferecer uma opção que não carrega uma tradução própria e apenas recua para português base. Também há diferenças entre o conjunto de opções declarado inicialmente no HTML e o gerado pelo i18n.

**Correção:** ou criar e manter `pt-br.json`, ou retirar `pt-br` da lista. Validar automaticamente que cada código declarado tem um ficheiro e que as chaves mínimas existem em todas as línguas.

## 2.8. Média — conteúdo dinâmico não é integralmente traduzido e metadados SEO são estáticos

**Referências:** [metadados do HTML](https://github.com/MisterAntoY/lino-livre/blob/main/public/index.html#L1-L75), [i18n de DOM](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/i18n.js#L90-L175), [renderização de cursos](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L1045-L1375).

A troca de idioma atualiza o título e o atributo `lang`, mas os metadados `description`, Open Graph, Twitter e o bloco Schema.org continuam essencialmente estáticos em português. A interface dos cursos contém muitos textos de botões, badges e mensagens escritos diretamente em português. O Schema.org declara mais variantes de idioma do que os ficheiros de tradução realmente disponíveis.

**Impacto:** a experiência não é verdadeiramente multilingue em todo o percurso; pré-visualizações de links e motores de busca podem ver a descrição em português mesmo quando a página é aberta noutro idioma.

**Correção:** internacionalizar todo o texto da UI e atualizar `description`, OG/Twitter e JSON-LD de forma coerente; adicionar `hreflang` apenas para versões reais e acessíveis.

## 2.9. Média — Service Worker pode mostrar dados da API antigos sem avisar

**Referência:** [Service Worker](https://github.com/MisterAntoY/lino-livre/blob/main/public/sw.js#L42-L135).

O handler `fetch` trata genericamente pedidos GET da mesma origem, incluindo respostas JSON de `/api/*`, e guarda respostas `200` em cache. Se a rede falhar, `caches.match(request)` pode devolver a resposta da API guardada anteriormente. Isso é útil offline, mas a UI não distingue claramente dados antigos de dados atuais. O cache de API também não é invalidado quando o catálogo é alterado.

**Correção:** excluir rotas que não devem ser persistidas, ou criar estratégia específica para cada endpoint; colocar timestamp/estado offline na interface e invalidar caches quando a versão dos dados muda. Manter offline-first para conteúdo estático, não para estatísticas que aparentem ser “ao vivo”.

## 2.10. Média — caches de borda não são invalidados nas operações de escrita

**Referência:** [middleware e cache de borda](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L330-L372), [mutação de livros](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L643-L766), [cursos](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L836-L974).

As rotas GET armazenam respostas na Cache API e emitem TTLs de minutos a horas, mas os handlers de criação, alteração e remoção não invalidam as URLs correspondentes. Assim, o catálogo pode continuar a mostrar a versão antiga depois de uma alteração, até ao vencimento do cache. O Service Worker no browser acrescenta outra camada de cache.

**Correção:** invalidar explicitamente caches após mutações, usar cache tags/versões ou reduzir os TTLs de endpoints sujeitos a alterações frequentes.

## 2.11. Média — API de cursos, roadmaps e autores sem paginação explícita

**Referências:** [autores](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L248-L277), [cursos](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L836-L888), [roadmaps](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L888-L929), [frontend cursos](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L1030-L1230).

Ao contrário da API de livros, cursos e roadmaps executam `SELECT *` com os filtros mas sem `LIMIT`/`OFFSET`. A rota de autores também devolve todos os autores. O frontend tenta renderizar todos os cartões recebidos de uma vez. À medida que o acervo cresce, isto aumenta leituras/bytes transferidos, consumo de memória, tempo de renderização e lentidão em dispositivos móveis.

**Correção:** implementar paginação estável no servidor, ordenar por coluna estável, impor limites máximos e renderizar incrementalmente no frontend. Aplicar limites para respostas de autores e episódios também.

## 2.12. Média — `outro` é apresentado como “livre acesso” sem provar licença

**Referências:** [enum de licenças](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L13-L14), [schema dos livros](https://github.com/MisterAntoY/lino-livre/blob/main/migrations/0001_initial_schema.sql#L25-L48), [dropdown do formulário](https://github.com/MisterAntoY/lino-livre/blob/main/public/index.html#L940-L985), [seed e fontes](https://github.com/MisterAntoY/lino-livre/blob/main/src/database/seed.js#L95-L140).

O enum contém `outro`; a interface traduz esse valor como uma opção de “Outro (Livre Acesso)”. Isto mistura três conceitos diferentes: licença de direitos de autor, custo gratuito e disponibilidade online. Um recurso pode estar disponível num URL e ainda assim não estar autorizado para redistribuição.

**Correção:** trocar `outro` por estado honesto como `licenca_nao_verificada`; separar preço de acesso (`gratuito/pago`) da licença legal; manter URL de evidência e data da verificação para cada obra. Só mostrar “domínio público” ou Creative Commons quando existir base para tal.

## 2.13. Média — modelo de dados guarda texto da obra apesar da promessa de “apenas metadados e links”

**Referências:** [esquema](https://github.com/MisterAntoY/lino-livre/blob/main/migrations/0001_initial_schema.sql#L25-L48), [leitor frontend](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L390-L610), [seed de textos](https://github.com/MisterAntoY/lino-livre/blob/main/src/database/seed.js).

A tabela `livros` tem `conteudo_texto`; a aplicação tem leitor de texto com capítulos; e o seed local importa textos completos de várias obras. Por isso, a declaração de que o sistema guarda exclusivamente metadados e links não descreve completamente o backend local. Mesmo quando a obra é de domínio público, o texto local deve estar coberto pela política de conteúdo/armazenamento; para materiais protegidos, a diferença é importante.

**Correção:** documentar exatamente que conteúdo é guardado e em que condições; aplicar validação de licença também ao `conteudo_texto`; separar `texto_autorizado` de metadados; impedir que o formulário público introduza conteúdo arbitrário sem revisão.

## 2.14. Média — FTS5 tem desenho de conteúdo externo potencialmente inconsistente

**Referências:** [schema raiz](https://github.com/MisterAntoY/lino-livre/blob/main/migrations/0001_initial_schema.sql#L82-L103), [schema local](https://github.com/MisterAntoY/lino-livre/blob/main/src/database/schema.sql#L80-L112).

A tabela FTS5 declara `content='livros'`, mas inclui a coluna `autor_nome`, que não é uma coluna física da tabela `livros`; o nome do autor é calculado por consulta à tabela `autores` nos triggers. Além disso, atualizar um autor não dispara os triggers `AFTER UPDATE ON livros`, logo os termos antigos do autor podem continuar no índice. Isto pode não afetar todas as consultas por título, mas cria uma divergência entre o índice e as tabelas relacionais, sobretudo em rebuild/integrity-check e pesquisa por autores.

**Correção:** usar tabela FTS normal/materializada ou redefinir o content table para conter as colunas indexadas; adicionar triggers para alterações de autores e testes para renomeação de autor, rebuild e consistência do índice.

## 2.15. Média — deduplicação insuficiente para autores e livros adicionados manualmente

**Referências:** [schema](https://github.com/MisterAntoY/lino-livre/blob/main/migrations/0001_initial_schema.sql#L19-L56), [criação manual de livro](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L643-L705), [importador](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/services/importer.ts#L15-L80).

A unicidade de livro depende de `(fonte_id, fonte_id_externo)`. Quando esses campos são `NULL` (possível no formulário manual, que não os envia), essa restrição não impede duplicados. Autores também não têm uma restrição única normalizada; diferenças de capitalização, espaços ou ordem do nome podem produzir registos duplicados. O importador resolve autor por igualdade exata do nome.

**Correção:** validar/normalizar ISBN e URL canónica, deduplicar por uma chave de negócio com revisão humana e normalizar nomes de autores. Não usar unicidade por título isoladamente, porque pode haver edições diferentes.

## 2.16. Média — importador pode manter links antigos e cria dados incompletos

**Referência:** [importador D1](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/services/importer.ts#L15-L88).

O importador atualiza os links recebidos via `ON CONFLICT ... DO UPDATE`, mas não remove links antigos que deixaram de existir na fonte. O esquema só permite um link por formato (`UNIQUE(livro_id, formato)`), e não há campo de última validação/estado do link. Um catálogo sincronizado pode então continuar a mostrar um formato que já não é suportado pela fonte. Em caso de falha no meio do loop, ficam escritas parciais e o job termina como `erro`.

**Correção:** sincronizar o conjunto completo de links por item, marcar links verificados/inativos, guardar última verificação e fazer a operação por lotes/transação quando possível. Mostrar claramente se existe apenas uma página bibliográfica, e não um livro integral.

## 2.17. Média — consultas FTS aceitam sintaxe além de palavras normais e podem disparar fallback

**Referência:** [pesquisa de livros](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L371-L455).

A consulta remove aspas simples/duplas e `*`, mas passa o resto ao operador `MATCH` do FTS5, juntando `*` no fim. Operadores ou expressões especiais podem gerar erros de sintaxe; a consulta SQL está parametrizada, portanto não é uma injeção SQL clássica, mas pode provocar uma pesquisa falhada e ativar o fallback de resultados fixos. Também não encontrei limites de comprimento para a pesquisa.

**Correção:** normalizar o termo por tokens, limitar o comprimento e tratar sintaxe FTS inválida com um erro de pesquisa específico, não com uma lista fictícia.

## 2.18. Média — algumas métricas de cursos são heurísticas e badges fazem alegações fortes

**Referências:** [filtro `certificado`](https://github.com/MisterAntoY/lino-livre/blob/main/workers/src/index.ts#L836-L880), [badges frontend](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L1045-L1375), [sincronizador Microsoft Learn](https://github.com/MisterAntoY/lino-livre/blob/main/scripts/sync_ms_learn.js#L115-L210), [sincronizador Samsung Ocean](https://github.com/MisterAntoY/lino-livre/blob/main/scripts/sync_ocean_brasil.js#L105-L205).

O filtro de certificado procura a palavra `certifica` na descrição ou plataforma, não num campo estruturado verificado. Os sincronizadores geram descrições como “certificado gratuito/oficial” ou duração estimada mesmo quando o campo de origem pode não garantir a afirmação. As condições no frontend também atribuem badges por `includes()` no nome do fornecedor, não por dados confirmados de cada curso.

**Correção:** criar campos estruturados `certificado_disponivel`, `certificado_pago`, `preco`, `duracao`, `prazo_inscricao`, `tipo` e `ultima_verificacao`; preencher apenas quando a API fonte indicar a informação. Não inferir que todos os cursos do fornecedor têm certificado gratuito.

## 2.19. Baixa/Média — Service Worker e armazenamento local precisam de comportamento defensivo

**Referências:** [Service Worker](https://github.com/MisterAntoY/lino-livre/blob/main/public/sw.js), [preferências do leitor](https://github.com/MisterAntoY/lino-livre/blob/main/public/js/app.js#L625-L760).

Algumas leituras/escritas a `localStorage` no leitor ocorrem diretamente, sem `try/catch`, ao contrário de partes do módulo i18n. Se o armazenamento estiver bloqueado ou indisponível, certas preferências podem lançar exceção. O Service Worker também usa `FONT_CACHE` para imagens externas, mantém APIs no cache genérico e faz cache sem um estado de “dados offline/antigos”.

**Correção:** proteger `localStorage` com wrappers e defaults; separar cache de imagens/fonts/API; indicar quando uma resposta é servida offline; não mostrar estatísticas antigas como atuais.

## 2.20. Baixa/Média — SEO não tem evidência visível de sitemap/robots e tem alegações que precisam de prova

**Referências:** [metadados e Schema.org](https://github.com/MisterAntoY/lino-livre/blob/main/public/index.html#L1-L75), [árvore `public`](https://github.com/MisterAntoY/lino-livre/tree/main/public).

O HTML promete “mais de 100 mil livros gratuitos e legais” e descreve o site como acervo legal. A contagem estática de fallback não comprova a contagem atual e não valida as licenças. Na árvore `public` que examinei, não encontrei `robots.txt` nem `sitemap.xml`. A página principal contém muito conteúdo que só é renderizado por JavaScript, o que reduz a qualidade de indexação se os motores não executarem ou não processarem todo esse código.

**Correção:** só publicar números sustentados por consulta real e revisão de licença; criar/validar `robots.txt` e sitemap XML se forem necessários; ter URLs estáveis para páginas de obras; garantir títulos, descrições, dados estruturados e idioma por página. Não alegar “legal” apenas porque o link é público.

---

# 3. Problemas nos scripts, catálogo e processo de sincronização

## 3.1. O seed é um reset, não uma operação incremental

`src/database/seed.js` começa por eliminar tabelas de catálogo e sequências de IDs, depois recria fontes, autores, categorias, livros, cursos e podcasts numa transação. Se for executado novamente contra uma base com contribuições manuais ou contagens reais, esses dados são apagados/resetados. O README apresenta `npm run seed` como parte do arranque, mas o risco destrutivo deveria estar destacado antes do comando.

## 3.2. Fallback do importador de Guia de TI pode devolver todos os itens quando a pesquisa não encontra correspondências

Em `src/services/importer.js`, depois de filtrar os resultados por consulta, a função retorna `filtrados.length > 0 ? filtrados : normalizados`. Uma consulta sem correspondências devolve, portanto, a lista inteira em vez de uma lista vazia. Isto contradiz a expectativa de pesquisa e pode fazer uma importação inesperada.

## 3.3. Identificadores aleatórios na Open Library dificultam importações repetidas

Quando falta `doc.key`, o importador usa `Math.random()` para compor `idExterno`, tanto no código local como no Worker. O mesmo registo pode receber IDs diferentes em execuções diferentes, derrotando a deduplicação e criando duplicados. Usar um identificador determinístico ou rejeitar registos sem chave estável.

## 3.4. As datas e durações estimadas precisam de rótulo de estimativa

Os sincronizadores usam defaults como `24h`, `60 min` ou `4h` quando faltam dados da API. Algumas descrições geradas depois são apresentadas como dados do curso. Defaults de preenchimento devem ser identificados como estimativas ou deixados em branco; não devem parecer valores declarados pela instituição.

## 3.5. CI das atualizações de catálogo não é validação de dados em produção

Os workflows de fornecedores executam sincronizadores e `npm test`, e vários commits usam `[skip ci]`. Os testes executados são focados no backend Express/SQLite. A aprovação de um workflow destes não prova que links são válidos, que as licenças foram verificadas ou que a D1 de produção recebeu a atualização. É preciso uma fase de validação sem publicação, relatório de diferenças e teste de links/licenças, seguida de importação remota explícita e smoke test.

---

# 4. Pontos da auditoria anterior que parecem ter mudado no código atual

A auditoria de produção existente em `docs/auditorias/AUDITORIA-PRODUCAO-11-10.md` é útil, mas parte das suas observações era uma fotografia de 11 de outubro. Não deve ser reutilizada sem rever o código atual:

- **Paginação de livros:** o código atual lê `pagina` ou `page`, aplica `OFFSET` e devolve `total_pages` em `workers/src/index.ts`. A falha repetida das páginas relatada na auditoria antiga parece ter sido corrigida no código, embora não tenha conseguido confirmar o endpoint publicado ao vivo.
- **WhatsApp:** o código atual define URLs padrão e os endpoints `/api/comunidade` e `/api/canal` devolvem essas URLs se as variáveis não forem definidas. O problema de 404 documentado anteriormente pode estar resolvido no código, mas a produção não pôde ser testada diretamente aqui.
- **Contagens/dashboard e licença:** continuam a existir fallbacks de números estáticos e a importação Open Library ainda classifica resultados como domínio público sem verificar a licença; estes merecem nova correção.
- **Fontes de livros comerciais:** o seed atual continua a definir fontes `github-bibliotecadev` e `github-italocamilo`. A decisão de manter esse catálogo apesar do risco está registada em `docs/auditorias/DECISAO-RESPONSAVEL-11-10.md`; é uma decisão de produto/conformidade que o código não elimina.

---

# 5. Plano de correção recomendado

## P0 — antes de promover o site ou aceitar contribuições públicas

1. Proteger endpoints de escrita e importação com autenticação/autorização; colocar submissões públicas em moderação.
2. Fechar os sinks de XSS: `capa_url`, `idioma`, `prazo` de curso e handlers inline de episódios; remover `innerHTML` para conteúdo de dados quando possível.
3. Validar todas as URLs externas e bloquear hosts/protocolos não autorizados.
4. Remover o default de licença `dominio-publico`; adicionar estado de licença não verificada e fonte de evidência.
5. Substituir os números estáticos do dashboard e o fallback de livros por erros/snapshots genuínos identificados como antigos.

## P1 — para consistência e fiabilidade de produção

6. Implementar e testar o handler cron que calcula `estatisticas` e `contadores`, ou remover a configuração/comentários do cron até existir.
7. Fazer o deploy abortar quando uma migração necessária falhar; executar smoke tests sobre o Worker publicado.
8. Criar testes de integração do Worker/Hono/D1; não considerar os testes Express como cobertura do backend publicado.
9. Fechar o ciclo dos sincronizadores: validar, atualizar D1 remota de forma idempotente, confirmar a atualização e publicar status verdadeiro.
10. Tornar as importações transacionais/loteadas e reconciliar/remover links antigos; registar datas de verificação e erros.

## P2 — para escalar sem degradar a experiência

11. Implementar paginação de cursos, roadmaps, autores e episódios; limitar resultados por defeito.
12. Resolver FTS5/autores e adicionar testes de rebuild, alteração de autor e pesquisa por termos.
13. Unificar esquemas/migrações e a arquitetura local/produção, eliminando migrações duplicadas ou documentando o papel de cada uma.
14. Corrigir o helper de escape, as traduções incompletas, o seletor `pt-br` e as meta tags multilíngues.
15. Separar métricas verificadas de estimativas, licença de acesso gratuito, livros de páginas de metadados e livros integrais; expor datas de atualização.
16. Criar validação automática de URLs, duplicados, licenças, datas de inscrição e badges; incluir acessibilidade e performance móvel no CI.

---

# 6. Veredicto

O Lino Livre já tem uma quantidade considerável de código, catálogo, integrações e automação. O maior problema não é falta de funcionalidades: é a distância entre a promessa de uma biblioteca legal, confiável e atualizada e os mecanismos atuais para garantir segurança, licença, autenticidade das métricas e consistência entre SQLite local, ficheiros gerados e D1 publicada.

A sequência certa é: **segurança de escrita/XSS → proveniência e licença → dados/métricas verídicos → pipeline de produção → paginação/qualidade de experiência → expansão do catálogo**. Acrescentar mais registos antes destas correções aumenta o volume do problema, não necessariamente o valor da plataforma.
