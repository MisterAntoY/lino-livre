# ⚖️ Conformidade Legal, Direitos de Autor e Diretrizes Jurídicas — LinoDigital · Lino Livre

**Data de Atualização:** 20 de Outubro de 2026  
**Versão:** 2.0 (Marco Jurídico e Internacional)  
**Canal Oficial de Notificações Legais e Takedown:** [bv6alblu6@mozmail.com](mailto:bv6alblu6@mozmail.com)  
**Jurisdição de Referência Principal:** República de Angola e Tratados Internacionais da OMPI (WIPO)

---

## 1. Missão Educacional, Natureza Comunitária e Zero Monetização

O **Lino Livre**, biblioteca digital da **LinoDigital**, é uma plataforma comunitária, cívica e educacional sem fins lucrativos desenvolvida prioritariamente para estudantes, investigadores, docentes e autodidatas nos **Países Africanos de Língua Oficial Portuguesa (PALOP)** — com foco primário em **Angola**, e extensão a Moçambique, Cabo Verde, Guiné-Bissau e São Tomé e Príncipe — além de toda a comunidade lusófona do Sul Global.

### 1.1. Princípio da Zero Monetização
- **100% Gratuito:** O Lino Livre não cobra qualquer taxa, mensalidade, anuidade ou assinatura dos seus utilizadores.
- **Isento de Publicidade:** A plataforma não veicula banners comerciais, anúncios de redes de terceiros, links patrocinados ou rastreadores de publicidade comportamental.
- **Não Comercialização de Dados:** Nenhum dado pessoal, histórico de navegação ou perfil de usuário é coletado para fins comerciais, alugado, vendido ou transferido a corretores de dados (data brokers).
- **Finalidade Exclusiva:** Todos os recursos catalogados destinam-se exclusivamente à promoção da literacia, democratização do saber técnico e científico e inclusão digital em regiões com carência extrema de bibliotecas físicas acessíveis.

---

## 2. Enquadramento Legal em Angola: Lei n.º 15/14, de 31 de Julho

A operação, curadoria e arquitetura tecnológica do Lino Livre fundamentam-se expressamente no ordenamento jurídico da República de Angola, com destaque para a **Lei n.º 15/14, de 31 de Julho (Lei sobre os Direitos de Autor e Conexos)**, publicada no *Diário da República*, I Série — N.º 133:

### 2.1. Duração dos Direitos Patrimoniais e Domínio Público (Artigo 32.º)
Nos termos do **Artigo 32.º (Duração Geral)** da Lei n.º 15/14 de Angola:
> *"Os direitos patrimoniais de autor extinguem-se 70 anos após a morte do criador intelectual, mesmo que se trate de obra divulgada ou publicada postumamente."* (calculados a partir do dia 1 de Janeiro do ano subsequente ao do falecimento).

- O acervo do Lino Livre respeita integralmente este limite: todas as obras integrais clássicas disponibilizadas para leitura textual rápida no navegador pertencem comprovadamente ao **Domínio Público Universal**, tendo todos os seus autores falecido há mais de 70 anos (com lapsos temporais que superam amplamente os 90 a 490 anos post mortem).
- Uma vez expirado o prazo de proteção patrimonial, as obras passam a integrar o patrimônio cultural comum da humanidade, sendo de livre acesso, leitura, estudo e reprodução por qualquer cidadão, assegurada a salvaguarda dos direitos morais de integridade e paternidade da obra (Artigo 17.º da Lei 15/14).

### 2.2. Utilizações Livres para Ensino, Estudo e Investigação Científica (Artigos 42.º a 45.º e 47.º)
A Lei n.º 15/14 de Angola consagra o instituto das **Utilizações Livres**, que autorizam o uso de obras protegidas sem necessidade de consentimento prévio do autor nem pagamento de remuneração, desde que observadas as condições legais:
1. **Fins Educativos e de Investigação (Artigo 43.º e 45.º):** É plenamente lícita a citação, a reprodução parcial de pequenos excertos e a utilização ilustrativa de textos para fins exclusivos de ensino, formação profissional e investigação científica, sem intuito comercial, mencionando-se sempre o nome do autor e a fonte.
2. **Função Social das Bibliotecas e Centros de Documentação (Artigo 44.º e 47.º):** Reconhece-se a legitimidade da atuação de repositórios, arquivos e centros de documentação acessíveis ao público que atuem sem objetivo de vantagem econômica direta ou indireta, visando a preservação e a difusão do saber.
3. **Disposições Constitucionais:** Amparado pelos Artigos 40.º (Liberdade de Expressão e Informação), 79.º (Cultura e Criação Intelectual) e 21.º (Promoção da Educação) da Constituição da República de Angola (CRA).

---

## 3. Conformidade com Tratados Internacionais (OMPI / WIPO)

O Lino Livre pauta a sua governança pelos tratados multilaterais de propriedade intelectual administrados pela Organização Mundial da Propriedade Intelectual (OMPI / WIPO), dos quais Angola e os países da comunidade internacional são signatários ou aderentes:

1. **Convenção de Berna para a Protecção das Obras Literárias e Artísticas:**
   - Observância estrita da *Regra dos Três Passos* (*Three-Step Test*): as limitações e utilizações livres aplicadas limitam-se a casos especiais estritamente educativos, não conflitam com a exploração normal da obra e não causam prejuízo injustificado aos interesses legítimos dos autores.
2. **Tratado da OMPI sobre o Direito de Autor (WCT - WIPO Copyright Treaty):**
   - Respeito à gestão de direitos no ambiente digital e salvaguarda de metadados de autoria e licença.
3. **Tratado de Marraquexe (2013):**
   - Princípios de facilitação do acesso a obras publicadas para pessoas com deficiência visual ou outras dificuldades de acesso a materiais impressos, viabilizados pela interface de acessibilidade e pelo módulo integrado de síntese vocal (Web Speech API).

---

## 4. Arquitetura de Servidor Intermediário: Zero Armazenamento de Arquivos Protegidos

Conforme estabelecido na diretriz estrutural inviolável da plataforma ([`/AGENTS.md`](../AGENTS.md)):

### 4.1. Princípio do Intermediário Tecnológico (*Mere Conduit / Search Provider*)
1. **Zero Hospedagem Binária:** O servidor web, a API e as bases de dados do Lino Livre **NUNCA** hospedam, armazenam ou transferem arquivos binários pesados de livros (tais como PDFs, EPUBs ou MOBIs) sujeitos a direitos patrimoniais de terceiros.
2. **Banco de Dados Exclusivamente de Metadados:** O banco armazena unicamente metadados públicos descritivos (título, autor, sinopse, ano, licença atribuída, categoria) e hiperligações para servidores públicos externos na Internet.
3. **Redirecionamento de Protocolo (HTTP 302):** Toda ação de leitura em leitor externo ou download é processada via redirecionamento de protocolo padrão (HTTP 302 Foundation Redirect), encaminhando o usuário diretamente para os repositórios públicos oficiais (ex.: Project Gutenberg, Wikisource, Portal Domínio Público MEC, Repositórios Universitários da UAN, OAPEN, RCAAP, etc.).
4. **Isenção de Responsabilidade sobre Terceiros:** O Lino Livre não exerce controle prévio nem responde pela integridade física ou alterações ocorridas em servidores externos para onde os links públicos apontam.

---

## 5. Política de Remoção e Notificação Legal (*Notice & Takedown* / DMCA)

O Lino Livre opera sob a doutrina de boa-fé (*Safe Harbor*), garantindo a todos os titulares de direitos de autor, editores e seus representantes legais um canal direto, transparente e ágil para a notificação de conteúdos ou links indevidamente catalogados.

### 5.1. Canal Oficial de Atendimento
As notificações de infração ou pedidos de desindexação devem ser dirigidos ao encarregado de conformidade:
- **E-mail:** [bv6alblu6@mozmail.com](mailto:bv6alblu6@mozmail.com)
- **Assunto Obrigatório:** `[NOTIFICAÇÃO DE DIREITOS AUTORAIS / TAKEDOWN] - LinoDigital · Lino Livre`

### 5.2. Compromisso de Resolução em até 48 Horas Úteis
O Lino Livre compromete-se formalmente a:
- Analisar com prioridade qualquer notificação fundamentada;
- **Desindexar cautelarmente a hiperligação apontada no prazo máximo de 48 horas úteis** após a recepção do pedido acompanhado dos requisitos mínimos de verificação;
- Confirmar formalmente por correio eletrônico ao titular requerente a remoção do link do catálogo de buscas.

### 5.3. Requisitos Mínimos da Notificação Fundamentada
Para assegurar a celeridade do procedimento, a notificação deve conter:
1. Identificação inequívoca da obra protegida (título, autor, edição, ISBN se aplicável);
2. Link ou identificador (ID) correspondente no catálogo do Lino Livre;
3. Link externo de destino para o qual o redirecionamento aponta;
4. Comprovação sumária da titularidade dos direitos autorais ou procuração válida de representação;
5. Declaração de boa-fé de que o uso do material não foi autorizado pelo titular nem decorre de exceção legal (como domínio público comprovado);
6. Dados de contato do requerente (nome, instituição/editora, endereço eletrônico).

---

## 6. Categorias e Rótulos de Licença Aceitos no Catálogo

Para garantir clareza e credibilidade jurídica inequívoca aos utilizadores e à comunidade jurídica, o Lino Livre opera estritamente com os seguintes rótulos formais de licença:

| Código Técnico | Rótulo no Catálogo | Descrição e Validação Jurídica |
|:---|:---|:---|
| `dominio-publico` | **Domínio Público** | Obras cujos direitos patrimoniais caducaram pelo decurso do prazo legal de 70 anos post mortem (Artigo 32.º da Lei 15/14 de Angola). |
| `cc0` | **CC0 (Dedicação Pública)** | Obras voluntariamente dedicadas ao patrimônio público comum pelos próprios autores, sem reserva de direitos patrimoniais. |
| `cc-by` | **CC BY (Atribuição)** | Licença aberta internacional Creative Commons autorizando distribuição e estudo mediante atribuição do autor original. |
| `cc-by-sa` | **CC BY-SA (Compartilha Igual)** | Licença Creative Commons permitindo redistribuição sob os mesmos termos de liberdade. |
| `cc-by-nc` | **CC BY-NC (Não Comercial)** | Licença Creative Commons permitindo redistribuição e estudo estritamente não comerciais. |
| `outro` | **Acesso Externo Aberto** | Documentações abertas, tutoriais e manuais de código aberto (ex.: GitHub, MDN, Wikibooks, materiais comunitários) disponibilizados publicamente pelos seus criadores na web aberta. |

---

## 7. Responsabilidade e Governança Contínua

A curadoria do Lino Livre realiza auditorias periódicas e automatizadas sobre a integridade dos links externos, a consistência dos metadados e o cumprimento dos prazos legais de domínio público. Caso seja detetada qualquer incongruência em obras indexadas, a equipa técnica procede à correção imediata ou desindexação preventiva.

*Para esclarecimentos adicionais sobre as diretrizes legais ou sugestões institucionais de cooperação educativa, entre em contacto através do canal oficial: [bv6alblu6@mozmail.com](mailto:bv6alblu6@mozmail.com).*
