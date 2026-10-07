const app = require('./app');
const { getDatabase } = require('./database');

const PORT = process.env.PORT || 3000;

// Inicializa banco de dados ao iniciar servidor
getDatabase();

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Sistema de Biblioteca Escolar em execução!`);
  console.log(`  Acesse no navegador: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
