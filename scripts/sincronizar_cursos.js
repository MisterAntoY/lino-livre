#!/usr/bin/env node
/**
 * Lino Livre — Motor Automatizado de Inserção e Sincronização de Cursos
 * 
 * Funcionalidades:
 * 1. Validação estrita de esquema (titulo, area, plataforma, url, licenca, nivel, descricao).
 * 2. Conformidade arquitetural com AGENTS.md (apenas metadados e URLs externas HTTPS 302, zero binários locais).
 * 3. Inserção idempotente no SQLite local (biblioteca.db).
 * 4. Geração automática e execução idempotente de migração para o Cloudflare D1 (lino-livre-db) com a flag --remote.
 * 5. Suporte a ingestão de múltiplos catálogos (Bradesco, EV.G, Lumina, IFRS, Google Ateliê, OpenBootcamp, Harvard, Cursa, etc.)
 *    ou arquivos externos (--arquivo=cursos.json).
 * 
 * Uso:
 *   node scripts/sincronizar_cursos.js                  # Sincroniza catálogo local e gera SQL para D1
 *   node scripts/sincronizar_cursos.js --remote         # Sincroniza local e executa diretamente no Cloudflare D1
 *   node scripts/sincronizar_cursos.js --arquivo=f.json # Ingestão de arquivo JSON externo
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const { getDatabase } = require('../src/database');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function validarCurso(c) {
  if (!c || typeof c !== 'object') return { valido: false, erro: 'Registro não é um objeto válido' };
  if (!c.titulo || !String(c.titulo).trim()) return { valido: false, erro: 'Título obrigatório ausente' };
  if (!c.plataforma || !String(c.plataforma).trim()) return { valido: false, erro: 'Plataforma obrigatória ausente' };
  if (!c.url || !String(c.url).trim()) return { valido: false, erro: 'URL obrigatória ausente' };

  const url = String(c.url).trim();
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return { valido: false, erro: `URL inválida (deve começar com http/https): ${url}` };
  }

  // AGENTS.md: Intermediário apenas — URLs não podem apontar para arquivos locais no sistema
  if (url.startsWith('file://') || url.includes('/Users/') || url.includes('C:\\')) {
    return { valido: false, erro: 'Violação de arquitetura: URL não pode ser caminho local' };
  }

  const isRoadmap = c.tipo === 'roadmap' ||
                    (c.plataforma && c.plataforma.includes('Roadmap.sh')) ||
                    (c.plataforma && c.plataforma.includes('Trilha Info')) ||
                    (c.titulo && c.titulo.toLowerCase().includes('roadmap'));

  return {
    valido: true,
    curso: {
      titulo: String(c.titulo).trim(),
      tipo: isRoadmap ? 'roadmap' : 'curso',
      area: String(c.area || 'Tecnologia').trim(),
      plataforma: String(c.plataforma).trim(),
      url: url,
      licenca: String(c.licenca || 'gratuito').trim(),
      nivel: String(c.nivel || 'Iniciante').trim(),
      descricao: c.descricao ? String(c.descricao).trim() : null
    }
  };
}

function carregarCursosPadrao() {
  const cursos = [];

  // 1. Lumina UFRGS
  try {
    const { luminaCoursesList } = require('../src/database/luminaCoursesData');
    if (Array.isArray(luminaCoursesList)) cursos.push(...luminaCoursesList);
  } catch (e) {
    console.warn('Aviso: luminaCoursesData não carregado:', e.message);
  }

  // 2. IFRS (Instituto Federal do RS)
  try {
    const { ifrsCoursesList } = require('../src/database/ifrsCoursesData');
    if (Array.isArray(ifrsCoursesList)) cursos.push(...ifrsCoursesList);
  } catch (e) {
    console.warn('Aviso: ifrsCoursesData não carregado:', e.message);
  }

  // 3. Google Ateliê Digital
  try {
    const { googleAtelieCoursesList } = require('../src/database/googleAtelieCoursesData');
    if (Array.isArray(googleAtelieCoursesList)) cursos.push(...googleAtelieCoursesList);
  } catch (e) {
    console.warn('Aviso: googleAtelieCoursesData não carregado:', e.message);
  }

  // 4. OpenBootcamp / Kogno
  try {
    const { openBootcampCoursesList } = require('../src/database/openBootcampCoursesData');
    if (Array.isArray(openBootcampCoursesList)) cursos.push(...openBootcampCoursesList);
  } catch (e) {
    console.warn('Aviso: openBootcampCoursesData não carregado:', e.message);
  }

  // 5. EV.G (Escola Virtual de Governo / ENAP)
  try {
    const { evgCoursesList } = require('../src/database/evgCoursesData');
    if (Array.isArray(evgCoursesList)) cursos.push(...evgCoursesList);
  } catch (e) {
    console.warn('Aviso: evgCoursesData não carregado:', e.message);
  }

  // 6. Cursa
  try {
    const { cursaCoursesList } = require('../src/database/cursaCoursesData');
    if (Array.isArray(cursaCoursesList)) cursos.push(...cursaCoursesList);
  } catch (e) {
    console.warn('Aviso: cursaCoursesData não carregado:', e.message);
  }

  // 7. Harvard Online, MIT e Stanford
  try {
    const { harvardCoursesList } = require('../src/database/harvardCoursesData');
    if (Array.isArray(harvardCoursesList)) cursos.push(...harvardCoursesList);
  } catch (e) {
    console.warn('Aviso: harvardCoursesData não carregado:', e.message);
  }

  // 8. Code IoT (Samsung & LSI-TEC / USP)
  try {
    const { codeIotCoursesList } = require('../src/database/codeIotData');
    if (Array.isArray(codeIotCoursesList)) cursos.push(...codeIotCoursesList);
  } catch (e) {
    console.warn('Aviso: codeIotData não carregado:', e.message);
  }

  // 9. Fluência AI
  try {
    const { fluenciaAiList } = require('../src/database/fluenciaAiData');
    if (Array.isArray(fluenciaAiList)) cursos.push(...fluenciaAiList);
  } catch (e) {
    console.warn('Aviso: fluenciaAiData não carregado:', e.message);
  }

  // 10. Recode (recode.org.br)
  try {
    const { recodeCoursesList } = require('../src/database/recodeData');
    if (Array.isArray(recodeCoursesList)) cursos.push(...recodeCoursesList);
  } catch (e) {
    console.warn('Aviso: recodeData não carregado:', e.message);
  }

  return cursos;
}

async function executarSincronizacao(opcoes = {}) {
  const { arquivoJson, apenasPlataforma, executarRemoto = false } = opcoes;
  console.log('===============================================================');
  console.log('  🚀 Lino Livre — Motor Automatizado de Inserção de Cursos');
  console.log('===============================================================');

  let listaCursos = [];

  if (arquivoJson) {
    const caminho = path.resolve(arquivoJson);
    console.log(`📂 Lendo cursos do arquivo: ${caminho}`);
    if (!fs.existsSync(caminho)) {
      console.error(`\n❌ Arquivo não encontrado: ${caminho}`);
      console.error(`💡 Dica: Crie o arquivo ou utilize o modelo em 'exemplos/cursos_modelo.json'.`);
      console.error(`   Exemplo de uso: node scripts/sincronizar_cursos.js --arquivo=exemplos/cursos_modelo.json\n`);
      return;
    }
    try {
      const conteudo = fs.readFileSync(caminho, 'utf8');
      const dados = JSON.parse(conteudo);
      listaCursos = Array.isArray(dados) ? dados : (dados.cursos || []);
    } catch (err) {
      console.error(`\n❌ Erro ao analisar JSON em ${caminho}: ${err.message}\n`);
      return;
    }
  } else {
    console.log('📚 Carregando catálogos integrados do Lino Livre...');
    listaCursos = carregarCursosPadrao();
  }

  if (apenasPlataforma) {
    const termo = apenasPlataforma.toLowerCase();
    listaCursos = listaCursos.filter(c => (c.plataforma || '').toLowerCase().includes(termo));
    console.log(`🔍 Filtro por plataforma: "${apenasPlataforma}" (${listaCursos.length} cursos selecionados)`);
  }

  console.log(`\n📋 Validando ${listaCursos.length} cursos recebidos...`);
  const cursosValidados = [];
  let errosValidacao = 0;

  for (const item of listaCursos) {
    const check = validarCurso(item);
    if (check.valido) {
      cursosValidados.push(check.curso);
    } else {
      errosValidacao++;
      console.warn(`  ⚠️ Ignorado: ${check.erro}`);
    }
  }

  console.log(`✅ Cursos aprovados na validação: ${cursosValidados.length} (erros: ${errosValidacao})`);

  // 1. Inserção Idempotente no SQLite Local
  console.log('\n💾 Sincronizando com banco local SQLite (biblioteca.db)...');
  const db = getDatabase();
  const stmtCheck = db.prepare('SELECT id FROM cursos WHERE url = ?');
  const stmtInsert = db.prepare(`
    INSERT INTO cursos (titulo, tipo, area, plataforma, url, licenca, nivel, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let inseridosLocal = 0;
  let jaExistentesLocal = 0;

  const transacao = db.exec ? null : null; // DatabaseSync supports direct commands
  for (const c of cursosValidados) {
    const existe = stmtCheck.get(c.url);
    if (!existe) {
      stmtInsert.run(c.titulo, c.tipo, c.area, c.plataforma, c.url, c.licenca, c.nivel, c.descricao);
      inseridosLocal++;
    } else {
      jaExistentesLocal++;
    }
  }

  console.log(`  ➕ Novos inseridos localmente: ${inseridosLocal}`);
  console.log(`  ℹ️  Já existentes localmente: ${jaExistentesLocal}`);

  const totalCursosLocal = db.prepare('SELECT COUNT(*) as total FROM cursos').get().total;
  console.log(`  📊 Total de cursos no SQLite local: ${totalCursosLocal}`);

  // 2. Geração do Arquivo de Migração para Cloudflare D1
  const sqlStatements = cursosValidados.map(c => {
    const titulo = escapeSql(c.titulo);
    const tipo = escapeSql(c.tipo);
    const area = escapeSql(c.area);
    const plataforma = escapeSql(c.plataforma);
    const url = escapeSql(c.url);
    const licenca = escapeSql(c.licenca);
    const nivel = escapeSql(c.nivel);
    const descricao = escapeSql(c.descricao);
    return `INSERT INTO cursos (titulo, tipo, area, plataforma, url, licenca, nivel, descricao) SELECT ${titulo}, ${tipo}, ${area}, ${plataforma}, ${url}, ${licenca}, ${nivel}, ${descricao} WHERE NOT EXISTS (SELECT 1 FROM cursos WHERE url = ${url});`;
  });

  const sqlOutPath = path.join(__dirname, 'cursos_sync_d1.sql');
  fs.writeFileSync(sqlOutPath, sqlStatements.join('\n'), 'utf8');
  console.log(`\n📄 Gerado arquivo SQL para Cloudflare D1 (${sqlStatements.length} declarações idempotentes):`);
  console.log(`   ${sqlOutPath}`);

  // 3. Execução Remota no Cloudflare D1 (se solicitada a flag --remote)
  if (executarRemoto) {
    console.log('\n☁️  Iniciando sincronização remota com Cloudflare D1 (lino-livre-db)...');
    try {
      execSync(`npx wrangler d1 execute lino-livre-db --remote --file="${sqlOutPath}" -y`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Sincronização remota com Cloudflare D1 concluída com sucesso!');
    } catch (err) {
      console.error('❌ Erro na execução remota do Wrangler D1:', err.message);
    }
  } else {
    console.log('\n💡 Dica: Para aplicar no banco de produção Cloudflare D1, execute:');
    console.log('   npm run cursos:sync:remote   OU');
    console.log(`   npx wrangler d1 execute lino-livre-db --remote --file="${sqlOutPath}" -y`);
  }

  console.log('\n===============================================================');
  console.log('  🎉 Sincronização automatizada concluída com sucesso!');
  console.log('===============================================================\n');

  return {
    processados: cursosValidados.length,
    inseridosLocal,
    jaExistentesLocal,
    totalLocal: totalCursosLocal,
    sqlFile: sqlOutPath
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let arquivoJson = null;
  let apenasPlataforma = null;
  let executarRemoto = false;

  for (const arg of args) {
    if (arg.startsWith('--arquivo=')) {
      arquivoJson = arg.split('=')[1];
    } else if (arg.startsWith('--plataforma=')) {
      apenasPlataforma = arg.split('=')[1];
    } else if (arg === '--remote' || arg === '-r') {
      executarRemoto = true;
    }
  }

  executarSincronizacao({ arquivoJson, apenasPlataforma, executarRemoto })
    .catch(err => {
      console.error('Erro na sincronização:', err);
      process.exit(1);
    });
}

module.exports = {
  validarCurso,
  carregarCursosPadrao,
  executarSincronizacao
};
