const express = require('express');
const router = express.Router();

const { verificarAdmin } = require('../middlewares/auth');

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
router.post('/categorias', verificarAdmin, categoriasController.criar);
router.put('/categorias/:id', verificarAdmin, categoriasController.atualizar);
router.delete('/categorias/:id', verificarAdmin, categoriasController.remover);

// 3. Autores
router.get('/autores', autoresController.listar);
router.get('/autores/:id', autoresController.obterPorId);
router.post('/autores', verificarAdmin, autoresController.criar);
router.put('/autores/:id', verificarAdmin, autoresController.atualizar);
router.delete('/autores/:id', verificarAdmin, autoresController.remover);

// 4. Livros Digitais (Catálogo, FTS5, Leitura com Redirect 302, CRUD)
router.get('/livros', livrosController.listar);
router.get('/livros/:id', livrosController.obterPorId);
router.get('/livros/:id/ler/:linkId', livrosController.lerRedirect);
router.post('/livros', verificarAdmin, livrosController.criar);
router.put('/livros/:id', verificarAdmin, livrosController.atualizar);
router.delete('/livros/:id', verificarAdmin, livrosController.remover);

// 5. Fontes Abertas & Importações Assíncronas
router.get('/fontes', fontesController.listar);
router.post('/import', verificarAdmin, fontesController.iniciarImportacao);
router.get('/import/:id', fontesController.obterStatusImportacao);

// 6. Cursos Livres e Gratuitos
router.get('/cursos', cursosController.listar);
router.get('/cursos/:id', cursosController.obterPorId);
router.get('/cursos/:id/acessar', cursosController.acessarRedirect);
router.post('/cursos', verificarAdmin, cursosController.criar);
router.delete('/cursos/:id', verificarAdmin, cursosController.remover);

// 6.1 Roadmaps & Trilhas de Carreira
router.get('/roadmaps', cursosController.listarRoadmaps);

// 6.2 Dicas & Ferramentas de Estudo
const dicasController = require('../controllers/dicasController');
router.get('/dicas', dicasController.listar);
router.get('/dicas/:id', dicasController.obterPorId);

// 6.3 Proxy de Capas Externas (streaming com Cache-Control eficiente)
const capasController = require('../controllers/capasController');
router.get('/capas', capasController.proxy);

// 7. Comunidade e Canal WhatsApp (Links diretos e QR Codes SVG)
router.get('/comunidade', comunidadeController.getComunidade);
router.get('/comunidade/qrcode.svg', comunidadeController.getComunidadeQrCode);
router.get('/canal', comunidadeController.getCanal);
router.get('/canal/qrcode.svg', comunidadeController.getCanalQrCode);

// 8. Podcasts & Audiolivros (Spotify for Creators)
const podcastsController = require('../controllers/podcastsController');
router.get('/podcasts', podcastsController.listarShows);
router.get('/podcasts/episodios/recentes', podcastsController.listarEpisodiosRecentes);
router.get('/podcasts/:slugOuId', podcastsController.obterShow);
router.post('/podcasts/episodios/:id/ouvir', podcastsController.ouvirEpisodio);

// 9. Diretrizes Legais, Intermediação, DMCA / Takedown e Privacidade
const legalController = require('../controllers/legalController');
router.get('/legal', legalController.obterDiretrizesLegais);
router.get('/creditos', legalController.obterCreditos);

// 10. Sugestões da Comunidade (Fila de Moderação)
const sugestoesController = require('../controllers/sugestoesController');
router.post('/sugestoes', sugestoesController.criar);
router.get('/sugestoes', verificarAdmin, sugestoesController.listar);

// 11. Busca Federada Global (Fase 4 — motor distribuído com RRF)
const buscaFederadaController = require('../controllers/buscaFederadaController');
router.get('/busca/federada', buscaFederadaController.buscar);
router.get('/busca/federada/diagnostico', buscaFederadaController.diagnostico);

module.exports = router;


