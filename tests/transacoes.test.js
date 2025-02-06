const { adicionarTransacao, deletarTransacao } = require('../controllers/transacao.controller');
const memoriaModel = require('../models/transacao.model');

jest.mock('./../models/transacao.model', () => ({
    criarTransacao: jest.fn(),
    getMemoria: jest.fn(() => []),
    deletarTransacoes: jest.fn()
}));

describe('Testes no adicionarTransacao', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), end: jest.fn() };
    });

    test('Chamada correta da função', async () => {
        req.body = { valor: 100, dataHora: '2020-08-07T12:34:56.789-03:00' };
        await adicionarTransacao(req, res);
        expect(memoriaModel.criarTransacao).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('Chamada falha: data futura', async () => {
        dataFutura = new Date(Date.now() + 100000);
        req.body = { valor: 100, dataHora: dataFutura };
        await adicionarTransacao(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
    });

    test('Chamada falha: valor menor que zero', async () => {
        req.body = { valor: -100, dataHora: '2020-08-07T12:34:56.789-03:00' };
        await adicionarTransacao(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
    });

    test('Chamada falha: dados faltantes', async () => {
        await adicionarTransacao(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
    });

    test('Chamada falha: valor não sendo number', async () => {
        req.body = { valor: '100', dataHora: '2020-08-07T12:34:56.789-03:00' };
        await adicionarTransacao(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
    });

    test('Chamada falha: erro 400', async () => {
        memoriaModel.criarTransacao.mockImplementationOnce(() => { throw new Error(); });
        req.body = { valor: 100, dataHora: '2020-08-07T12:34:56.789-03:00' };
        await adicionarTransacao(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

});

describe('Testes no deletarTransacao', () => {
    let req, res;

    test('Chamada correta da função', async () => {
       res = { status: jest.fn().mockReturnThis(), end: jest.fn() };
       await deletarTransacao(req, res);
       expect(res.status).toHaveBeenCalledWith(200);
    });
});

