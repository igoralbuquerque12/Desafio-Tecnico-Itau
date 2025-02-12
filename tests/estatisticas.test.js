const { imprimirEstatisticas } = require('./../controllers/estatisticas.controller');
const memoriaModel = require('./../models/transacao.model');

jest.mock('./../models/transacao.model', () => ({
    getMemoria: jest.fn()
}));

describe('Teste no método de imprimir estátisticas', () => {

    let req, res;

    beforeEach(() => {
        req = { query: {}, method: 'GET', originalUrl: '/Estatisticas' };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    test('Gerando estatísticas com memória válida e tempo padrão', async () => {
            memoriaModel.getMemoria.mockResolvedValue([
                { valor: 50, dataHora: (new Date(Date.now() - 70000)) }, // Inválido (+60 segundos)
                { valor: 100, dataHora: (new Date(Date.now() - 50000)) }, // Válido
                { valor: 200, dataHora: (new Date(Date.now() - 30000)) }  // Válido
            ]);

            await imprimirEstatisticas(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                count: 2,
                sum: 300,
                avg: 150,
                min: 100,
                max: 200
            });
    });

    test('Gerando estatísticas com memória válida e tempo personalizado', async() => {
        memoriaModel.getMemoria.mockResolvedValue([
            { valor: 50, dataHora: (new Date(Date.now() - 130000)) }, // Inválido (+120 segundos)
            { valor: 100, dataHora: (new Date(Date.now() - 70000)) }, // Válido
            { valor: 150, dataHora: (new Date(Date.now() - 30000)) }  // Válido
        ]);

        req.query.tempo = 120;

        await imprimirEstatisticas(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            count: 2,
            sum: 250,
            avg: 125,
            min: 100,
            max: 150
        });

    });

    test('Gerando estatísticas com memória vazia', async () => {
        memoriaModel.getMemoria.mockResolvedValue([]);

        await imprimirEstatisticas(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            count: 0,
            sum: 0,
            avg: 0,
            min: 0,
            max: 0
        });
    });

    test('Chamada falha: erro 500', async() => {
        memoriaModel.getMemoria.mockImplementationOnce(() => { throw new Error(); });
        await imprimirEstatisticas(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

});