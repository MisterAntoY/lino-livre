# 🏛️ Diretrizes de Compliance, Fontes Autorizadas e Licenciamento — Lino Livre

> **Documento Oficial de Governança, Legalidade e Política Anti-Pirataria**  
> *Versão 1.0 — Atualizado em Outubro de 2026*  
> *Plataforma Educacional Sem Fins Lucrativos*

---

## 1. Princípio Fundamental de Arquitetura: Servidor Intermediário (Zero Armazenamento Local)

Em estrito cumprimento das diretrizes de arquitetura e legalidade registradas em [`AGENTS.md`](../AGENTS.md):

1. **Sem Armazenamento de Arquivos:**  
   O servidor web, a API de borda (Cloudflare Workers) e os bancos de dados (SQLite / Cloudflare D1 / Supabase) **NUNCA** armazenam, hospedam, comprimem ou guardam arquivos de obras intelectuais (PDFs, EPUBs, MOBIs, TXTs ou áudios).
2. **Banco de Dados Exclusivamente de Metadados:**  
   Armazenamos unicamente dados bibliográficos públicos: título, autor, categoria, idioma, licença declarada e hiperligações para as URLs externas oficiais.
3. **Redirecionamento de Protocolo (HTTP 302):**  
   Toda leitura ou download ocorre através de redirecionamento HTTP 302 direto para o provedor original ou biblioteca digital onde o arquivo está efetivamente hospedado.
4. **Fundamento da Defesa Legal:**  
   A aplicação atua estritamente como ponte/redirecionador para links públicos disponíveis na internet sob o abrigo dos artigos 32.º e 42.º a 45.º da Lei n.º 15/14 de Angola, dos princípios de porto seguro da DMCA (17 U.S.C. § 512), do artigo 19 do Marco Civil da Internet (Lei 12.965/2014) e da Diretiva 2000/31/CE da União Europeia.

---

## 2. Lista Branca de Fontes Aprovadas (Whitelist)

O Lino Livre apenas indexa conteúdos oriundos de plataformas auditadas, acadêmicas, institucionais ou sob licenças abertas expressas:

| Fonte | Tipo de Acesso | Licença Predominante | URL Base / Repositório Oficial |
|---|---|---|---|
| **Project Gutenberg** | API (Gutendex) | Domínio Público | https://www.gutenberg.org |
| **Open Library / Internet Archive** | API / Busca Filtrada | Domínio Público / Acesso Aberto | https://openlibrary.org / https://archive.org |
| **Wikisource (MediaWiki)** | API | Domínio Público / CC BY-SA | https://pt.wikisource.org |
| **LibriVox** | API Feed | Domínio Público (100% audiolivros) | https://librivox.org |
| **Standard Ebooks** | OPDS / Atom XML | CC0 1.0 Universal | https://standardebooks.org |
| **Europeana Open Data** | API de Busca | Domínio Público / CC BY / CC0 | https://www.europeana.eu |
| **Portal Domínio Público (MEC)** | Curadoria Governamental | Domínio Público | http://www.dominiopublico.gov.br |
| **Guia de TI** | RSS Oficial | Acesso Livre Comunitário / Aberto | https://guiadeti.com.br |
| **MIT OpenCourseWare (OCW)** | Catálogo Institucional | CC BY-NC-SA / Acesso Aberto | https://ocw.mit.edu |
| **Harvard PLL & Stanford Online** | Catálogo Universitário | Cursos Gratuitos / Acesso Aberto | https://pll.harvard.edu |
| **Cursa App** | Catálogo Aberto | Cursos Livres Gratuitos | https://cursa.app |
| **Universidade Agostinho Neto (UAN)** | Repositório TFC | Trabalhos Universitários Abertos | https://uan.ao |
| **EbookFoundation (Free Books)** | Repositórios GitHub | Licenças Open Source e Acesso Livre | https://github.com/EbookFoundation |
| **Trilha Info / Flávio Mendes** | Comunidade Open Source | Licença Aberta (MIT / CC) | https://trilha.info |

---

## 3. Lista Negra de Fontes Proibidas (Blacklist Anti-Pirataria)

> [!CAUTION]
> **Tolerância Zero com Pirataria:**  
> O Lino Livre veda peremptoriamente e rejeita em nível de código (camadas de validação da API e do Worker) qualquer tentativa de cadastro ou redirecionamento para repositórios não autorizados, shadow libraries ou que distribuam obras sob reserva de direitos sem autorização do titular.

### Domínios e Plataformas Expressamente Banidos:
- **Z-Library** (`z-lib.*`, `zlibrary.*`, `z-library.*`, etc.)
- **Library Genesis** (`libgen.*`, `library.lol`, `gen.lib.rus.ec`, etc.)
- **Sci-Hub** (`sci-hub.*`, `scihub.*`)
- **Anna's Archive** (`annas-archive.*`, `anna-archive.*`)
- **B-OK / BookFi** (`b-ok.*`, `bookfi.*`)
- **PDF Drive** (`pdfdrive.*`)
- Qualquer site que utilize quebra de DRM ou distribuição não autorizada de obras protegidas.

**Mecanismo de Bloqueio em Código:**  
Todas as rotas de cadastro e atualização (`POST /api/livros`, `PUT /api/livros/:id`, `POST /api/import`) executam a função `verificarUrlConformidade(url)`. Se qualquer link contiver fragmentos desses domínios, a operação é rejeitada com código `400 Bad Request`.

---

## 4. Prazos de Domínio Público e Territorialidade

As legislações de direitos autorais variam de acordo com o país. O Lino Livre observa o **Princípio da Territorialidade** e a **Regra do Prazo Mais Curto** (*Rule of the Shorter Term*, art. 7(8) da Convenção de Berna):

| Jurisdição | Legislação de Regência | Prazo Padrão post-mortem |
|---|---|---|
| **Angola** | Lei n.º 15/14, de 31 de Julho | Vida do autor + 70 anos |
| **Moçambique** | Lei n.º 4/2001, de 27 de Fevereiro | Vida do autor + 70 anos |
| **Cabo Verde** | Decreto-Legislativo n.º 1/2009 | Vida do autor + 50 anos |
| **Portugal e União Europeia** | Diretiva 2006/116/CE / CDADC | Vida do autor + 70 anos |
| **Brasil** | Lei n.º 9.610/98 (art. 41) | Vida do autor + 70 anos (início em 1º de jan. do ano subsequente) |
| **Estados Unidos** | U.S. Copyright Act (Title 17) | Obras publicadas antes de 1929 já em domínio público |

### Diretriz para Obras em Situação Divergente:
Quando uma obra está em domínio público no país onde o servidor de origem se localiza (exemplo: uma obra publicada em 1928 hospedada nos Estados Unidos pelo Project Gutenberg ou Internet Archive), mas ainda protegida em outra jurisdição:
- O Lino Livre **NÃO** armazena o arquivo;
- Mantém estritamente o **hiperlink para o repositório original** com aviso de responsabilidade territorial;
- Cabe ao leitor certificar-se de que a consulta atende às leis de seu país de residência.

---

## 5. Taxonomia e Validação de Licenças no Catálogo

100% dos itens cadastrados no Lino Livre devem obrigatoriamente possuir o campo `licenca` preenchido com um dos seguintes valores aprovados pelo banco de dados:

1. `dominio-publico`: Obra em domínio público por expiração do prazo de proteção patrimonial.
2. `cc0`: Creative Commons Zero (dedicação irrevogável ao domínio público pelo criador).
3. `cc-by`: Creative Commons Atribuição (permite redistribuição e adaptação com créditos).
4. `cc-by-sa`: Creative Commons Atribuição-CompartilhaIgual (obras derivadas mantêm mesma licença).
5. `cc-by-nc`: Creative Commons Atribuição-NãoComercial (apenas finalidades não comerciais/educativas).
6. `outro`: Recursos educacionais abertos com licença permissiva própria documentada (ex: MIT, Apache, GNU FDL, documentações abertas comunitárias).

Qualquer requisição que tente omitir ou enviar uma licença fora desse padrão é rejeitada pelo banco (`CHECK (licenca IN (...))`) e pela validação HTTP 400 da API.

---

## 6. Respeito a Robôs (`robots.txt`) e User-Agent Identificável

Todas as requisições automatizadas do Lino Livre respeitam os arquivos `robots.txt` e termos de uso dos servidores remotos:
- **User-Agent Padrão Auditável:**
  ```http
  User-Agent: LinoLivre/2.0 (+https://lino-livre.linolivre.workers.dev; contato@linolivre.workers.dev; biblioteca digital aberta educacional)
  ```
- **Rate-Limiting:** Máximo de 2 requisições por segundo por fonte com pausas de cortesia.
- **Backoff Exponencial:** Pausa automática em respostas `429 Too Many Requests`.
- **Cache Local:** Respostas mantidas em cache por 24 horas para evitar sobrecarga em APIs externas.

---

## 7. Privacidade de Dados (Zero Coleta e Zero Rastreamento)

O Lino Livre adota uma postura estrita de respeito à privacidade (em conformidade com a LGPD brasileira — Lei 13.709/2018 e o RGPD europeu — Regulamento 2016/679):

1. **Sem Cadastro de Usuários:** Não solicitamos nome, e-mail, telefone, CPF ou senha para acesso às obras.
2. **Sem Coleta de Telefones do WhatsApp:** A integração da Comunidade e Canal WhatsApp é um hiperlink direto e estático (ou QR Code SVG). A aplicação **NÃO** recolhe números de telefone, não processa mensagens, não utiliza webhooks e não possui bot de rastreio.
3. **Preferências 100% no Navegador (`localStorage`):** Preferências de tema, tamanho de letra e cor de papel ficam guardadas unicamente no dispositivo do leitor.
4. **Zero Cookies Publicitários:** A plataforma não comercializa dados nem exibe anúncios comportamentais.

---

## 8. Canal Expresso de Notificação e Desindexação (DMCA / Takedown)

Qualquer autor ou titular que identifique hiperligação no Lino Livre para conteúdo que alegue violar seus direitos autorais pode solicitar a desindexação imediata:

- **E-mail de Notificação:** `bv6alblu6@mozmail.com`
- **Assunto:** `[NOTIFICAÇÃO DE DIREITOS AUTORAIS / TAKEDOWN] - Lino Livre`
- **Prazo de Atendimento:** 24 a 48 horas úteis para remoção voluntária do link do índice de busca.
