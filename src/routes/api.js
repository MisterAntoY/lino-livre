const express = require('express');
const router = express.Router();

const categoriasController = require('../controllers/categoriasController');
const autoresController = require('../controllers/autoresController');
const livrosController = require('../controllers/livrosController');
const dashboardController = require('../controllers/dashboardController');

// Dashboard de Distribuição Digital
router.get('/dashboard', dashboardController.metricas);

// Categorias
router.get('/categorias', categoriasController.listar);
router.get('/categorias/:id', categoriasController.obterPorId);
router.post('/categorias', categoriasController.criar);
router.put('/categorias/:id', categoriasController.atualizar);
router.delete('/categorias/:id', categoriasController.remover);

// Autores
router.get('/autores', autoresController.listar);
router.get('/autores/:id', autoresController.obterPorId);
router.post('/autores', autoresController.criar);
router.put('/autores/:id', autoresController.atualizar);
router.delete('/autores/:id', autoresController.remover);

// Livros Digitais (Catálogo, Download e Leitura Online)
router.get('/livros', livrosController.listar);
router.get('/livros/:id', livrosController.obterPorId);
router.post('/livros', livrosController.criar);
router.put('/livros/:id', livrosController.atualizar);
router.delete('/livros/:id', livrosController.remover);
router.post('/livros/:id/download', livrosController.registrarDownload);
router.post('/livros/:id/ler', livrosController.lerOnline);

module.exports = router;
