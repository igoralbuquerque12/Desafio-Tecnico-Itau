const memoriaModel = require('../models/transacao.model');
const logger = require('./../logger');

exports.adicionarTransacao = async (req, res) => {
    try {
        logger.http(`Requisição recebida: ${req.method} ${req.originalUrl}`);

        const dataAtual = new Date();
        // console.log('O valor que chega: ', req.body.valor, ' A hora: ', req.body.dataHora)
        if (!req.body.valor || !req.body.dataHora) {
            logger.error(`Erro na requisição: valor ou dataHora ausentes - Body recebido: ${JSON.stringify(req.body)}`);
            return res.status(422).end(); 
        }

        const dataTransacao = new Date(req.body.dataHora);
        
        if (dataAtual < dataTransacao) {
            logger.error(`Erro na data da requisição: ${dataTransacao} é uma data futura.`);
            return res.status(422).end();
        }

        if (typeof req.body.valor === 'number') {
            if (req.body.valor < 0) {
                logger.error(`Erro com relação ao tipo de valor: ${req.body.valor} é menor que zero`);
                return res.status(422).end();
            }
        } else {
            logger.error(`Erro com relação ao tipo de valor: ${req.body.valor} não é um número`);
            return res.status(422).end();
        }

        await memoriaModel.criarTransacao(req.body);
        logger.info(`Transação adicionada: Valor=${req.body.valor}, Data=${req.body.dataHora}`);

        return res.status(201).end();

    } catch (error) {
        logger.error(`Erro ao adicionar transação: ${error.message}`, { stack: error.stack });
        return res.status(400).end();
    }
};

exports.deletarTransacao = async (req, res) => {
    try { 
        logger.http(`Requisição recebida: ${req.method} ${req.originalUrl}`);
        
        await memoriaModel.deletarTransacoes();
        logger.info('Todas as transações foram deletadas')

        return res.status(200).end();

    } catch(error) {
        logger.error(`Erro ao deletar transação: ${error.message}`, { stack: error.stack });
        return res.status(400).end();
    }
};

