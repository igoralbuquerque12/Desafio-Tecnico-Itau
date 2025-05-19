const memoriaModel = require('./../models/transacao.model');
const logger = require('./../logger')

exports.imprimirEstatisticas = async (req, res) => {
    try {
        logger.http(`Requisição recebida: ${req.method} ${req.originalUrl}`);

        const memoria = await memoriaModel.getMemoria();
        logger.info(`Dados carregados da memória: ${memoria.length} registros`);

        let tempo = process.env.TEMPO;

        if (req.query.tempo) {
            tempo = req.query.tempo;
        }

        const tempoLimite = new Date(Date.now() - tempo * 1000);

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
            console.log(`Estatísticas calculadas: count=${count}, sum=${sum}, avg=${avg}, min=${min}, max=${max}`)
        }

        logger.info(`Estatísticas calculadas: count=${count}, sum=${sum}, avg=${avg}, min=${min}, max=${max}`);
        
        res.status(200).json({
            count: count,
            sum: sum,
            avg: avg,
            min: min,
            max: max
        });

    } catch (error) {
        logger.error(`Erro ao calcular estatísticas: ${error.message}`, { stack: error.stack });
        res.status(400);
    }
}