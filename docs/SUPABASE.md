# Supabase — backend alternativo de metadados

O Lino Livre continua a ser **apenas um intermediário**: o Supabase guarda
metadados (título, autor, licença, categoria, idioma) e **URLs externas**.
Não existem buckets de Storage para livros e nenhuma rota serve ficheiros do
servidor. A leitura continua a ser um **redirecionamento HTTP 302** para o
provedor original.

```
Frontend ──► Worker (Hono)
                │
                ├─ DB_BACKEND=supabase ──► Supabase PostgREST (Postgres)
                │        └─ erro/timeout ─► D1 (fallback)
                └─ DB_BACKEND=d1 ────────► D1 (padrão)
```

As **escritas** (criar/editar/apagar livros, importações, agregados) continuam
na D1. O Supabase é usado para leitura pública do catálogo.

---

## 1. Aplicar o schema

1. Abra o **SQL Editor** do projeto Supabase.
2. Cole o conteúdo de [`supabase/schema.sql`](../supabase/schema.sql) e execute.

O script cria: tabelas, índices (incluindo trigramas para busca), views
(`livros_api`, `cursos_api`, `podcasts_api`), funções RPC
(`buscar_livros`, `contar_livros`, `incrementar_leitura`,
`incrementar_reproducao`, `recalcular_estatisticas`) e políticas RLS de
leitura pública.

> O schema é idempotente (`if not exists` / `create or replace`), pode ser
> executado novamente após atualizações.

## 2. Configurar o Worker

```bash
npx wrangler secret put SUPABASE_URL
# https://SEU_PROJETO.supabase.co

npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# sb_secret_... ou a service_role key (JWT)

# Ativar o backend (wrangler.jsonc → vars.DB_BACKEND = "supabase")
npx wrangler deploy
```

Sem `DB_BACKEND=supabase`, nada muda: a D1 continua a ser usada e as
credenciais ficam inertes.

### Segurança

- A chave `service_role`/`sb_secret_*` **nunca** vai para o frontend. Só existe
  como secret do Worker.
- As views usam `security_invoker = true`, pelo que a RLS das tabelas base é
  aplicada a `anon`/`authenticated`.
- `anon`/`authenticated` têm apenas `SELECT` nas tabelas do catálogo.
- `recalcular_estatisticas()` só pode ser executada por `service_role`.
- `incrementar_leitura`/`incrementar_reproducao` são `SECURITY DEFINER` mas
  apenas incrementam contadores — não expõem nem alteram outros dados.

## 3. Migrar os dados

Pré-requisitos: schema aplicado e `.env` com `SUPABASE_URL` +
`SUPABASE_SERVICE_ROLE_KEY` (o script também aceita `DATA_API` e
`Secret_keys`).

```bash
# Testar leitura sem escrever (recomendado)
node scripts/migrar_d1_para_supabase.js --dry-run --tabela=fontes

# Migração completa a partir da D1 remota
npm run supabase:migrar

# Apenas uma tabela / retomar
node scripts/migrar_d1_para_supabase.js --tabela=livros
```

O script é **idempotente** (upsert por `id`) e **retomável**: guarda o último
`id` de cada tabela em `.scratch/supabase-migracao.json`. Usa paginação por
keyset (`WHERE id > ?`), não `OFFSET`.

Opções:

| Opção | Efeito |
| --- | --- |
| `--local` | Lê de `biblioteca.db` em vez da D1 remota |
| `--tabela=nome` | Migra apenas uma tabela |
| `--lote=500` | Linhas por pedido (livros usa 200 por omissão) |
| `--com-conteudo` | Inclui `livros.conteudo_texto` |
| `--reiniciar` | Ignora o checkpoint |
| `--dry-run` | Lê e conta, sem escrever no Supabase |

Por omissão, `conteudo_texto` **não** é migrado (mantém a base leve e o modelo
de intermediação). Se precisar do texto integral no Supabase, use
`--com-conteudo` e confirme o espaço disponível no plano.

### Cota da D1

A migração lê cada linha uma vez. Com a cota gratuita da D1 (5M linhas/dia) é
possível migrar ~104k livros + ~200k links, mas **não** repetir a migração no
mesmo dia. O script pode ser retomado no dia seguinte a partir do checkpoint.

## 4. Verificar

```bash
SITE=https://lino-livre.linolivre.workers.dev

curl -s "$SITE/api/dashboard" | head -c 300
curl -s "$SITE/api/livros?limit=2" | head -c 300
curl -s "$SITE/api/categorias" | head -c 200
curl -s "$SITE/api/fontes" | head -c 200
curl -s "$SITE/api/cursos?limit=2" | head -c 200
curl -s "$SITE/api/roadmaps" | head -c 200
```

Sinais de sucesso:

- `X-Data-Status` ausente (sem degradação).
- `resumo.total_livros` > 0 no dashboard.
- `total` correto em `/api/livros` e `links` preenchidos no detalhe.
- Redirecionamento 302 em `/api/livros/:id/ler/:linkId`.

## 5. Voltar para a D1

Altere `DB_BACKEND` para `"d1"` (ou remova a variável) e faça deploy. Não é
necessário apagar nada no Supabase.

## 6. Notas de desempenho

- **Agregados**: `estatisticas` e `contadores` evitam varrer 104k linhas. São
  recalculados pela função `recalcular_estatisticas()` (chamada no fim da
  migração). O cron do Worker (`10 0 * * *`) também a invoca quando
  `DB_BACKEND=supabase`, pelo que não é necessário `pg_cron`.

  Alternativa com `pg_cron` (planos pagos):

  ```sql
  select cron.schedule(
    'recalcular-estatisticas',
    '10 0 * * *',
    $$select public.recalcular_estatisticas()$$
  );
  ```

- **Busca**: `ILIKE '%termo%'` usa índices GIN de trigramas em
  `livros.titulo`, `livros.sinopse`, `autores.nome`.
- **Paginação**: o PostgREST limita cada resposta a 1000 linhas; o cliente do
  Worker pagina automaticamente (`getTodos`) para listas como cursos.
- **Contagens**: sem filtros, o total vem de `estatisticas`; com filtros, de
  `contar_livros(...)`.
- **Cache**: as mesmas respostas do Worker são cacheadas na edge (1h para
  dimensões, 10min para listagens), independentemente do backend.

## 7. Limitações conhecidas

- Escritas e importações continuam a usar a D1. Após escritas administrativas,
  sincronize com `node scripts/migrar_d1_para_supabase.js --reiniciar`
  (relê tudo e faz upsert por `id`).
- `conteudo_texto` é omitido por omissão na migração.
- A ordenação de cursos no Supabase é `area, titulo` (a D1 coloca primeiro o
  Guia de TI).
