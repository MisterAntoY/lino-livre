# 🎓 Plataformas Educacionais e Recursos Gratuitos — Lino Livre

Compilação condensada dos relatórios de integração de cursos e trilhas de aprendizagem:
1. `docs/plataformas/DIRETRIZES-LEGAIS.md`
2. `docs/plataformas/FONTES-CONTEUDO-GRATUITO.md`
3. `docs/plataformas/CATALOGO-RECURSOS-GRATUITOS.md`
4. `docs/plataformas/BOOTCAMPS-DIO-STATUS.md`
5. `docs/plataformas/CURSA-STATUS.md`
6. `docs/plataformas/CURSOEMVIDEO-STATUS.md`
7. `docs/plataformas/DATA-SCIENCE-ACADEMY-STATUS.md`
8. `docs/plataformas/MICROSOFT-LEARN-STATUS.md`
9. `docs/plataformas/PLATAFORMAS-TECH-STATUS.md`
10. `docs/plataformas/SAMSUNG-OCEAN-STATUS.md`
11. `docs/plataformas/SANTANDER-ACADEMY-STATUS.md`

---

## 1. Diretrizes de Curadoria e Compliance
- **Critério de Inclusão:** Apenas capacitações, módulos e cursos 100% gratuitos oferecidos por instituições oficiais ou plataformas abertas com termos permissivos.
- **Intermediação Estrita:** Redirecionamento HTTP 302 direto para a URL oficial do curso na plataforma parceira. O Lino Livre não armazena vídeos, avaliações ou binários.
- **Certificação:** Indicação explícita quando a plataforma concede certificado gratuito comprovado sem custos de emissão.

---

## 2. Plataformas Integradas no Catálogo Oficial

| Plataforma | Área Principal | Idiomas | Certificado | Modelo de Integração |
| :--- | :--- | :--- | :--- | :--- |
| **Cursa** | Tecnologia, Idiomas, Gestão, Ensino | PT, EN, ES, FR, DE | Sim (gratuito) | Feed multi-idioma (8.500+ cursos catalogados) |
| **Samsung Ocean Brasil** | Android, Python, IoT, IA, UX/UI, Cloud | PT | Sim (gratuito) | Cron semanal (`scripts/sync_ocean_brasil.js`) |
| **Microsoft Learn** | Azure, DevOps, C#, Power BI, Segurança | PT-PT, PT-BR, EN | Sim (conquistas/troféus) | Cron semanal (`scripts/sync_ms_learn.js`) |
| **Santander Open Academy** | Liderança, Negócios, Tech, Soft Skills | PT, ES, EN | Sim (bolsas/acesso) | Sincronizador de bootcamps e bolsas abertas |
| **DIO (Digital Innovation One)** | Bootcamps Frontend, Backend, Cloud | PT | Sim (gratuito) | Sincronizador de bootcamps comunitários ativos |
| **Curso em Vídeo (Gustavo Guanabara)** | Programação, Python, JS, Redes, Hardware | PT | Opcional | Catalogação de trilhas e módulos YouTube |
| **Data Science Academy (DSA)** | IA, Python, Machine Learning, Big Data | PT | Sim (cursos gratuitos) | Catalogação curada de módulos abertos de entrada |
| **Roadmap.sh & Trilha Info** | Trilhas visuais de carreira em TI | PT, EN | Guia de estudo | Catalogação de mapas de estudo para desenvolvedores |
| **OpenStax & OER Commons** | Livros-texto universitários, ciências exatas | EN, ES | Aberto (CC BY) | OER para ensino superior e médio |
