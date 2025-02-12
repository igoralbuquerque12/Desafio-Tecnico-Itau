const app = require('./app');
require('dotenv').config({ path: './.env' })
const logger = require('./logger')

const porta = process.env.PORTA

app.listen(porta, () => {
    console.log(`Servidor rodando na porta: ${porta}`)
    logger.info(`Servidor rodando na porta: ${porta}`);
});

process.on('uncaughtException', (error) => {
    logger.error(`Erro não tratado: ${error.message}`, { stack: error.stack });
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Rejeição não tratada em: ${promise}, motivo: ${reason}`);
});