const express = require('express');
const transacaoController = require('./../controllers/transacao.controller');

const router = express.Router();

router
    .route('/Transacao')
    .post(transacaoController.adicionarTransacao)
    .delete(transacaoController.deletarTransacao)

module.exports = router;