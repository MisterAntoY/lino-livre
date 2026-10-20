/**
 * Script one-shot: adiciona as novas chaves de métricas do dashboard a todos os locales.
 * Execução: node scripts/addDashboardMetrics.js
 */
const fs = require('node:fs');
const path = require('node:path');

const LOCALES = path.join(__dirname, '..', 'public', 'locales');

const NOVAS_CHAVES = {
  pt: {
    links: 'Links Externos',
    languages: 'Idiomas',
    avgPages: 'Média de Páginas',
    quality: 'Integridade do Acervo',
    withCover: 'Com capa',
    withSynopsis: 'Com sinopse',
    withLink: 'Com link de leitura',
    withAuthor: 'Com autor',
    withCategory: 'Com categoria',
    completeness: 'Completude dos metadados',
    courseTypes: 'Tipos de Curso',
    withCertificate: 'Com certificado',
    topPlatforms: 'Top Plataformas'
  },
  en: {
    links: 'External Links',
    languages: 'Languages',
    avgPages: 'Average Pages',
    quality: 'Collection Integrity',
    withCover: 'With cover',
    withSynopsis: 'With synopsis',
    withLink: 'With reading link',
    withAuthor: 'With author',
    withCategory: 'With category',
    completeness: 'Metadata completeness',
    courseTypes: 'Course Types',
    withCertificate: 'With certificate',
    topPlatforms: 'Top Platforms'
  },
  es: {
    links: 'Enlaces Externos',
    languages: 'Idiomas',
    avgPages: 'Promedio de Páginas',
    quality: 'Integridad de la Colección',
    withCover: 'Con portada',
    withSynopsis: 'Con sinopsis',
    withLink: 'Con enlace de lectura',
    withAuthor: 'Con autor',
    withCategory: 'Con categoría',
    completeness: 'Completitud de metadatos',
    courseTypes: 'Tipos de Curso',
    withCertificate: 'Con certificado',
    topPlatforms: 'Top Plataformas'
  },
  fr: {
    links: 'Liens Externes',
    languages: 'Langues',
    avgPages: 'Pages Moyennes',
    quality: 'Intégrité de la Collection',
    withCover: 'Avec couverture',
    withSynopsis: 'Avec synopsis',
    withLink: 'Avec lien de lecture',
    withAuthor: 'Avec auteur',
    withCategory: 'Avec catégorie',
    completeness: 'Complétude des métadonnées',
    courseTypes: 'Types de Cours',
    withCertificate: 'Avec certificat',
    topPlatforms: 'Top Plateformes'
  },
  de: {
    links: 'Externe Links',
    languages: 'Sprachen',
    avgPages: 'Ø Seiten',
    quality: 'Integrität der Sammlung',
    withCover: 'Mit Cover',
    withSynopsis: 'Mit Synopsis',
    withLink: 'Mit Lese-Link',
    withAuthor: 'Mit Autor',
    withCategory: 'Mit Kategorie',
    completeness: 'Metadaten-Vollständigkeit',
    courseTypes: 'Kurstypen',
    withCertificate: 'Mit Zertifikat',
    topPlatforms: 'Top-Plattformen'
  },
  zh: {
    links: '外部链接',
    languages: '语言',
    avgPages: '平均页数',
    quality: '书库完整性',
    withCover: '有封面',
    withSynopsis: '有简介',
    withLink: '有阅读链接',
    withAuthor: '有作者',
    withCategory: '有分类',
    completeness: '元数据完整度',
    courseTypes: '课程类型',
    withCertificate: '有证书',
    topPlatforms: '热门平台'
  }
};

for (const [locale, chaves] of Object.entries(NOVAS_CHAVES)) {
  const file = path.join(LOCALES, `${locale}.json`);
  if (!fs.existsSync(file)) {
    console.log(`[skip] ${locale}.json não existe`);
    continue;
  }

  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!json.ui) json.ui = {};
  if (!json.ui.dashboard) json.ui.dashboard = {};

  let adicionadas = 0;
  for (const [chave, valor] of Object.entries(chaves)) {
    if (json.ui.dashboard[chave] === undefined) {
      json.ui.dashboard[chave] = valor;
      adicionadas++;
    }
  }

  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log(`[ok] ${locale}.json → +${adicionadas} chaves (total dashboard: ${Object.keys(json.ui.dashboard).length})`);
}

console.log('\nChaves de métricas do dashboard actualizadas em todos os locales.');
