const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const categoriasController = require('../controllers/categoriasController');
const autoresController = require('../controllers/autoresController');
const livrosController = require('../controllers/livrosController');
const fontesController = require('../controllers/fontesController');
const cursosController = require('../controllers/cursosController');
const comunidadeController = require('../controllers/comunidadeController');

// 1. Dashboard de Acervo e Leituras
router.get('/dashboard', dashboardController.metricas);

// 2. Categorias / Áreas do Conhecimento
router.get('/categorias', categoriasController.listar);
router.get('/categorias/:id', categoriasController.obterPorId);
router.post('/categorias', categoriasController.criar);
router.put('/categorias/:id', categoriasController.atualizar);
router.delete('/categorias/:id', categoriasController.remover);

// 3. Autores
router.get('/autores', autoresController.listar);
router.get('/autores/:id', autoresController.obterPorId);
router.post('/autores', autoresController.criar);
router.put('/autores/:id', autoresController.atualizar);
router.delete('/autores/:id', autoresController.remover);

// 4. Livros Digitais (Catálogo, FTS5, Leitura com Redirect 302, CRUD)
router.get('/livros', livrosController.listar);
router.get('/livros/:id', livrosController.obterPorId);
router.get('/livros/:id/ler/:linkId', livrosController.lerRedirect);
router.post('/livros', livrosController.criar);
router.put('/livros/:id', livrosController.atualizar);
router.delete('/livros/:id', livrosController.remover);

// 5. Fontes Abertas & Importações Assíncronas
router.get('/fontes', fontesController.listar);
router.post('/import', fontesController.iniciarImportacao);
router.get('/import/:id', fontesController.obterStatusImportacao);

// 6. Cursos Livres e Gratuitos
router.get('/cursos', cursosController.listar);
router.get('/cursos/:id', cursosController.obterPorId);
router.get('/cursos/:id/acessar', cursosController.acessarRedirect);
router.post('/cursos', cursosController.criar);
router.delete('/cursos/:id', cursosController.remover);

// 6.1 Roadmaps & Trilhas de Carreira
router.get('/roadmaps', cursosController.listarRoadmaps);

// 6.2 Dicas & Ferramentas de Estudo
const dicasController = require('../controllers/dicasController');
router.get('/dicas', dicasController.listar);
router.get('/dicas/:id', dicasController.obterPorId);

// 7. Comunidade e Canal WhatsApp (Links diretos e QR Codes SVG)
router.get('/comunidade', comunidadeController.getComunidade);
router.get('/comunidade/qrcode.svg', comunidadeController.getComunidadeQrCode);
router.get('/canal', comunidadeController.getCanal);
router.get('/canal/qrcode.svg', comunidadeController.getCanalQrCode);

module.exports = router;
