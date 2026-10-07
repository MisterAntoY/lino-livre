const express = require('express');
const path = require('node:path');
const apiRoutes = require('./routes/api');
const { getDatabase } = require('./database');

const app = express();

// Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../public')));

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
