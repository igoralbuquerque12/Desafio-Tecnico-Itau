let memoria = []

exports.getMemoria = async () => {
    return memoria; 
}

exports.criarTransacao = async (transacao) => {
    memoria.push(transacao)
    return transacao // Retornar a transação que foi inserida é uma boa prática, pois permite confirmar o que foi realmente adicionado ao array.
};

// Não expor diretamente a variável (module.exports = memoria) para garantir que somente essas funções acima possam edita-las. 

exports.deletarTransacoes = async () => {
    memoria.length = 0;
    return
} 