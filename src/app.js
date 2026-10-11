const express = require('express');
const path = require('node:path');
const compression = require('compression');

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (_) {}
}

const apiRoutes = require('./routes/api');
const { getDatabase } = require('./database');

const app = express();

// Compressão HTTP (Gzip/Deflate) para economizar dados móveis
app.use(compression());

// Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend com cache HTTP para reduzir consumo de rede
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (/\.(jpg|jpeg|png|svg|webp|woff2|woff|ttf)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    } else if (/\.(js|css|html|json)$/i.test(filePath)) {
      // revalida sempre (ETag) para nunca servir código/idioma desatualizado
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Rotas da API
app.use('/api', apiRoutes);

// Tratamento de rotas não encontradas para API
app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Endpoint da API não encontrado' });
});

// Fallback para SPA/Frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
