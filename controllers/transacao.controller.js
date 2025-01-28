const memoriaModel = require('../models/transacao.model');

exports.adicionarTransacao = async (req, res) => {
    try {
        const dataAtual = new Date();

        if (!req.body.valor || !req.body.dataHora) {
            return res.status(422).end(); 
        }

        const dataTransacao = new Date(req.body.dataHora);
        
        if (dataAtual < dataTransacao) {
            return res.status(422).end();
        }
        console.log(typeof req.body.valor)
        if (typeof req.body.valor === 'number') {
            if (req.body.valor < 0) {
                return res.status(422).end();
            }
        } else {
            return res.status(422).end();
        }

        await memoriaModel.criarTransacao(req.body);
        console.log('tamanho :', memoriaModel.getMemoria())
        return res.status(201).end();

    } catch (error) {
        return res.status(400).end();
    }
};

exports.deletarTransacao = async (req, res) => {
    await memoriaModel.deletarTransacoes()
    return res.status(200).end();
}

