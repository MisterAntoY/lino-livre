const express = require('express');
const router = express.Router();

const categoriasController = require('../controllers/categoriasController');
const autoresController = require('../controllers/autoresController');
const livrosController = require('../controllers/livrosController');
const emprestimosController = require('../controllers/emprestimosController');
const dashboardController = require('../controllers/dashboardController');

// Dashboard
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

// Livros
router.get('/livros', livrosController.listar);
router.get('/livros/:id', livrosController.obterPorId);
router.post('/livros', livrosController.criar);
router.put('/livros/:id', livrosController.atualizar);
router.delete('/livros/:id', livrosController.remover);

// Empréstimos
router.get('/emprestimos', emprestimosController.listar);
router.get('/emprestimos/:id', emprestimosController.obterPorId);
router.post('/emprestimos', emprestimosController.criar);
router.post('/emprestimos/:id/devolver', emprestimosController.devolver);
router.post('/emprestimos/:id/renovar', emprestimosController.renovar);

module.exports = router;
