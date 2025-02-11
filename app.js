const express = require('express');
const app = express();
const logger = require('./logger')

logger.log('info', 'Aplicação iniciada.')

app.use(express.json());

const transacaoRouter = require('./routes/transacao.route')
const estatisticasRouter = require('./routes/estatisticas.route')

app.use(transacaoRouter)
app.use(estatisticasRouter)

module.exports = app