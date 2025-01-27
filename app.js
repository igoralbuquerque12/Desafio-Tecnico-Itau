const express = require('express');
const app = express();

app.use(express.json());

const transacaoRouter = require('./routes/transacao.route')
const estatisticasRouter = require('./routes/estatisticas.route')

app.use(transacaoRouter)
app.use(estatisticasRouter)

module.exports = app