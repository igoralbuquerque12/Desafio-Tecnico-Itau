const express = require('express');
const router = express.Router();

const estatisticasController = require('./../controllers/estatisticas.controller');

router
    .route('/Estatisticas')
    .get(estatisticasController.imprimirEstatisticas)

module.exports = router