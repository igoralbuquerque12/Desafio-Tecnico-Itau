const memoriaModel = require('./../models/transacao.model');

exports.imprimirEstatisticas = async (req, res) => {
    const memoria = await memoriaModel.getMemoria();
    const tempoLimite = new Date(Date.now() - 60 * 1000);

    let count = 0, sum = 0, avg = 0, max = 0, min = 0;

    for (let i = memoria.length - 1; i >= 0; i--) {
        const tempoMemoria = new Date(memoria[i].dataHora)
        if (tempoMemoria < tempoLimite) {
            break;
        }

        if (count == 0) {
            min = memoria[i].valor;
            max = memoria[i].valor;
        }

        count = count + 1;
        sum = sum + memoria[i].valor; 

        if (memoria[i].valor > max) {
            max = memoria[i].valor
        }
        if (memoria[i].valor < min) {
            min = memoria[i].valor
        }
    };

    if (count != 0) {
        avg = sum / count
    }

    res.status(201).json({
        count: count,
        sum: sum,
        avg: avg,
        min: min,
        max: max
    });

}