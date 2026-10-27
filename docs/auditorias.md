# 🛡️ Auditorias Consolidadas — Lino Livre

Compilação condensada dos relatórios técnicos de segurança, conformidade e produção:
1. `docs/auditorias/AUDITORIA_SEGURANCA_ARQUITETURA.md`
2. `docs/auditorias/AUDITORIA-ATAQUES-2026-10-23.md`
3. `docs/auditorias/DOMINIO-PUBLICO-VERIFICACAO.md`
4. `docs/auditorias/AUDITORIA-CURSOS.md`
5. `docs/auditorias/AUDITORIA-PRODUCAO-11-10.md`
6. `docs/auditorias/DECISAO-RESPONSAVEL-11-10.md`

---

## 1. Segurança e Arquitetura Defensiva

### 1.1 Veredito e Postura
- **Intermediário Legal Estrito:** Zero armazenamento físico/local de arquivos de livros (PDF, EPUB, binários). Redirecionamento seguro HTTP 302 para fontes originais públicas.
- **Fail-Closed Administrativo:** Mutações de dados (`POST/PUT/DELETE`) exigem chave administrativa com comparação em tempo constante (`crypto.timingSafeEqual` / `timingSafeEqualStr`). Sem chave configurada, recusa imediata (HTTP 503 Express / HTTP 401 Worker).
- **WAF de Borda Anti-Scanners:** Bloqueio HTTP 403 para scanners ofensivos (`sqlmap`, `nikto`, `nuclei`, etc.) e HTTP 404 estrito para caminhos sensíveis (`/.env`, `/.git`, `/wp-admin`).
- **Defesa Anti-SSRF:** Bloqueio de loopback (`127.0.0.0/8`, `::1`), link-local, RFC 1918 e metadados de nuvem (`169.254.169.254`).
- **Sanitização FTS5:** Entrada de busca sanitizada para evitar quebras de sintaxe SQLite ou DoS por operadores booleanos.

### 1.2 Auditoria de Ataques e OWASP Top 10 (2026-10-23)
- **A01: Quebra de Controle de Acesso:** Rotas de administração blindadas fail-closed; mitigação de IDOR cross-resource em `/api/livros/:id/ler/:linkId` garantindo que o link pertence ao livro correto.
- **A02: Falhas Criptográficas:** HTTPS forçado (HSTS `max-age=31536000`), segredos via variáveis de ambiente seguras, sem credenciais em repositório.
- **A03: Injeção:** Prepared statements parametrizados com `?` em 100% das consultas dinâmicas.
- **A04: Design Inseguro / DoS:** Rate limiting ativo; bounded subqueries limitadas a 500 em contagens multi-filtro.
- **A05: Configuração Incorreta:** Cabeçalhos defensivos rigorosos (`CSP`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `COOP`).
- **A08: Integridade de Software:** `conteudo_texto` restrito estritamente a autores clássicos em domínio público universal falecidos há mais de 70 anos.

---

## 2. Conformidade de Domínio Público Universal
- **Regra da Coluna `conteudo_texto`:** Apenas obras de autores falecidos há mais de 70 anos comprovados possuem texto integral (Machado de Assis, José de Alencar, Camões, Aluísio Azevedo, Lima Barreto, Eça de Queirós, Fernando Pessoa).
- **Obras Contemporâneas / Acadêmicas:** Teses UAN, monografias DOAB e manuais técnicos mantêm `conteudo_texto = NULL`, acessíveis estritamente via redirecionamento 302.

---

## 3. Auditoria de Cursos e Recursos Abertos (OER)
- **Critérios de Catalogação:** Catálogo auditado cobrindo Cursa, OER Commons, OpenStax, MIT OpenCourseWare, CK-12, PhET e Khan Academy.
- **Licenciamento:** Ingestão restrita a licenças abertas (`CC BY`, `CC BY-NC-SA`, `CC BY-NC`, `Public Domain`).
- **Acesso:** Redirecionamento HTTP 302 seguro e contador atômico em `/api/cursos/:id/acessar`.

---

## 4. Auditoria de Produção e Registro de Decisões
- **Estabilidade do Worker e D1:** Implementação de fallback para agregados consolidados sob esgotamento da cota diária gratuita (5M leituras/dia), garantindo zero downtime.
- **Dual Engine (D1 + Supabase):** EdgeLoadBalancer orquestra consultas prioritárias e abre circuito de contingência automaticamente ao detectar códigos de limite de cota.
- **Compromisso Comunitário:** Plataforma 100% gratuita, sem fins lucrativos, canal direto de desindexação ágil (DMCA em até 48h úteis).
