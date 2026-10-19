const fs = require('node:fs');
const path = require('node:path');
const { cursaCoursesList } = require('../src/database/cursaCoursesData');
const { harvardCoursesList } = require('../src/database/harvardCoursesData');

const allCourses = [...cursaCoursesList, ...harvardCoursesList];

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

const statements = allCourses.map(c => {
  const titulo = escapeSql(c.titulo);
  const tipo = escapeSql(c.tipo || 'curso');
  const area = escapeSql(c.area || 'Tecnologia');
  const plataforma = escapeSql(c.plataforma);
  const url = escapeSql(c.url);
  const licenca = escapeSql(c.licenca || 'gratuito');
  const nivel = escapeSql(c.nivel || 'Iniciante');
  const descricao = escapeSql(c.descricao || '');

  return `INSERT INTO cursos (titulo, tipo, area, plataforma, url, licenca, nivel, descricao) SELECT ${titulo}, ${tipo}, ${area}, ${plataforma}, ${url}, ${licenca}, ${nivel}, ${descricao} WHERE NOT EXISTS (SELECT 1 FROM cursos WHERE url = ${url});`;
});

const sqlContent = statements.join('\n');
const outputPath = path.join(__dirname, 'cursa_harvard_d1.sql');
fs.writeFileSync(outputPath, sqlContent, 'utf8');

console.log(`Gerado arquivo SQL com ${statements.length} declarações INSERT idempotentes em: ${outputPath}`);
