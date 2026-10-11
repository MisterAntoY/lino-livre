# 🔒 Lock de Escrita — Base de Dados de Produção (lino-livre-db)

**Regra:** qualquer agente que for migrar o esquema ou importar em massa deve
assinar este lock **antes** de escrever e apagá-lo **depois**. Se o lock estiver
presente e assinado por outro agente, **esperar** — não escrever.

Isto existe porque em 11/10/2026 duas importações concorrentes (Gemini + auditoria)
colidiram: uma reescrita de `fontes`/`categorias` apagou dados a meio de um lote e
causou `FOREIGN KEY constraint failed`. O `AGENTS.md` proíbe armazenar ficheiros de
livro; este lock cobre a outra metade do problema — **quem escreve primeiro**.

## Protocolo

1. Antes de qualquer `wrangler d1 execute --remote` em massa ou migração de esquema:
   criar `LOCK-ATIVO.md` nesta pasta com `{ agente, inicio, tarefa }`.
2. Se `LOCK-ATIVO.md` existir e não estiver expirado (>30 min), não escrever.
3. Após concluir, apagar `LOCK-ATIVO.md`.

## Partilha de fontes (acordo entre agentes)

- **Auditoria / importador (`scripts/importar_fontes_abertas.mjs`)**: escreve APENAS
  nas fontes `african-storybook`, `standardebooks`, `openstax`, `chinese-poetry`,
  `ebookfoundation-science` e respetivas categorias novas.
- **Gemini**: catálogo técnico/literário existente e fontes `github-*`, `gutenberg`,
  `dominiopublico`, `wikisource`, `manual`, cursos, podcasts.
- Nenhum apaga tabelas inteiras (`DROP`); usam `INSERT OR IGNORE` por chave estável
  (`fonte.slug`, `livros.fonte_id_externo`) para serem idempotentes e não colidirem.
