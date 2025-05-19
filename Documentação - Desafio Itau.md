1. # **Introdução**

## **1.1  Objetivo**

Esta API foi desenvolvida como solução para o desafio de programação do Itaú Unibanco, com o propósito principal de aprimorar as habilidades técnicas em desenvolvimento back-end. O projeto envolve a implementação de três endpoints, a aplicação de testes unitários, a conteinerização utilizando Docker, uso de logs e a realização de testes de desempenho para avaliar a performance da aplicação.

## **1.2. Tecnologias Utilizadas**

O desenvolvimento da API foi realizado utilizando a linguagem **JavaScript** com o **Node.js**. 

As principais bibliotecas empregadas incluem:

* **Express** – Framework para criação de APIs e servidores HTTP.  
* **Nodemon** – Ferramenta para reinicialização automática do servidor durante o desenvolvimento.  
* **Dotenv** – Gerenciamento de variáveis de ambiente.  
* **Jest** – Framework para testes unitários.  
* **Artillery** – Ferramenta para testes de carga e desempenho.  
* **Winston** – Biblioteca para geração e gerenciamento de logs.

A implementação foi realizada na **IDE Visual Studio Code (VS Code)**.

## **1.3 Como utilizar a aplicação**

### **1.3.1 Pré-requisitos**

Antes de executar a API, certifique-se de ter instalado:

* **Node.js**   
* **Docker** (não obrigatório)


### **1.3.2 Instalação**

1. **Clone o repositório:**  
   1. git clone [https://github.com/igoralbuquerque12/Desafio-Tecnico-Itau.git](https://github.com/igoralbuquerque12/Desafio-Tecnico-Itau.git)  
   2. git cd Desafio-Tecnico-Itau  
        
2. **Instalar as dependencias:**  
   1. npm install   
        
3. **Executar:**  
   1. npm start (Execução da aplicação)  
   2. npm test (Execução dos testes)  
        
4. **Execução Docker (Opcional):**  
   1. docker build \-t \<nome-api\> .  
   2. docker run \-p 3000:3000 \-d \<nome-api\>

      

2. # **Funcionamento**

**2.1 Funcionamento Básico**

A API armazena as transações em memória utilizando uma estrutura de dados otimizada para consultas rápidas. Cada transação contém um valor e um timestamp, e, ao longo do tempo, são salvas. 

**2.2 Salvamento de Dados**

Conforme solicitado no desafio, não foi utilizado um banco de dados. Em vez disso, foi implementado um model que instancia um array vazio na memória para armazenar as transações. Cada transação é salva como um objeto contendo as chaves valor e timestamp. Além disso, o model possui uma função para retornar todas as transações armazenadas e outra para limpá-las, reinicializando o array.

**2.3 Criar transações e limpar a memória**

Quando a requisição chega com o corpo contendo os valores ou solicitando limpar a memória, o controller de transações invoca a respectiva função do model responsável por realizar a operação.

**2.4 Geração de estatísticas**

Quando a requisição é recebida pelo controller de estatísticas, ele chama a função do model que retorna a memória. A memória é percorrida até a transação cujo tempo ultrapasse o limite predefinido. O tempo, por padrão, é configurado para 60 segundos, mas caso a transação contenha um valor diferente no req.query, esse valor será utilizado no lugar do padrão.

3. #  **Estrutura das Requisições e Respostas**

   

## **3.1 Formato das Requisições**

A API segue os padrões REST e aceita requisições nos seguintes formatos:

* **Métodos HTTP utilizados:**  
  * `POST` para adicionar uma nova transação.  
  * `DELETE` para remover uma transação.  
  * `GET` para obter estatísticas das transações.


* **Cabeçalhos esperados:**  
  * **`Content-Type: application/json`** (para requisições que enviam um corpo).

**Formato das Respostas**: Somente o status code, sem corpo. Conforme solicitado no desafio.

## **3.2 Formato das Respostas**

Seguindo as orientações propostas pelo desafio:

* Respostas sem corpo.  
* Campos da resposta:  
  * Status: define o status HTTP da resposta  
  * End: finaliza a resposta, para suprir o JSON do corpo da resposta que não foi utilizado.

* **Códigos de status HTTP**: 


| Código | Significado | Contexto |
| :---: | ----- | ----- |
| 200 | Requisição bem-sucedida | Usado nos endpoints de limpar a memória e gerar estatísticas. |
| 201 | Recurso criado com sucesso | Utilizado quando uma transação é incrementada na memória. |
| 400 | Requisição inválida | Erros genéricos, normalmente atrelado com problemas provenientes da entidade da memória (model). |
| 422 | Dados inválidos da transação | Retornado quando a transação enviada possui valores inválidos, como: \- Valor negativo \- Valor não numérico \- Data futura \- Campos vazios |
| 500 | Erro interno no servidor | Indica falhas inesperadas dentro da API. |


# 

4. # **Endpoints da API**

   

## **4.1 Criar Transação (`POST /Transacao`)**

**Descrição:** Adiciona uma nova transação ao sistema.  
A API deve receber uma requisição contendo um JSON com os seguintes campos:

* **`valor`**: Um valor numérico que deve ser maior que zero. Caso contrário, a requisição deverá retornar um erro.  
* **`data`**: Uma data no formato ISO 8601 (ISOString). A data não pode ser uma data futura, ou seja, a data recebida deve ser menor ou igual à data e hora atual no momento da requisição. Se for uma data futura, a requisição deverá retornar um erro.

**Exemplo do corpo da requisição:**

*`{`*  
  *`"valor": 100.50,`*  
  *`"data": "2025-02-13T12:00:00Z"`*  
*`}`*

**Respostas possíveis:**

* `201 Created` – Transação adicionada com sucesso.  
* `400 Bad Request` – Requisição inválida.  
* `422 Unprocessable Entity` – Erro na validação dos dados (exemplo: valor negativo, data futura ou campo ausente).  
* `500 Internal Server Error` – Erro inesperado no servidor.

## **4.2 Remover Transações (DELETE /Transacao)**

**Descrição:** Remove todas as transações registradas na memória do sistema.

**Requisição:**

* **Cabeçalhos:** Nenhum obrigatório.  
* **Corpo da requisição:** Não aplicável.

**Respostas possíveis:**

* `200 OK` – Todas as transações foram removidas.  
* `400 Internal Server Error` – Erro inesperado no servidor.


## **4.3 Obter Estatísticas (`GET /Estatisticas`)**

**Descrição:** Retorna estatísticas das transações realizadas nos últimos 60 segundos. Esse período pode ser ajustado através do parâmetro opcional tempo na query string. Por exemplo, ao chamar /Estatistica?tempo=120, as estatísticas irão considerar as transações dos últimos 120 segundos, em vez do padrão de 60 segundos.

**Requisição:**

* **Cabeçalhos:** Nenhum obrigatório.  
* **Corpo da requisição:** Não aplicável.


**Respostas possíveis:**

* `200 OK` – Estatísticas retornadas com sucesso.  
* `500 Internal Server Error` – Erro inesperado no servidor.


**Corpo da resposta:**

**count:** Número total de transações registradas no período.  
**sum:** Soma dos valores de todas as transações no período.  
**avg:** Média dos valores das transações registradas.  
**min:** Menor valor de transação registrada.  
**max:** Maior valor de transação registrada.

**Exemplo de corpo da resposta 200:**

*`{`*  
    *`"count": 2,`*  
    *`"sum": 300,`*  
    *`"avg": 150,`*  
    *`"min": 100,`*  
    *`"max": 200`*  
*`}`*

5. # **Relatório de Testes de Carga da API**

   

## **5.1 Objetivo**

Foram realizados dois tipos de testes de carga na API para avaliar seu desempenho em diferentes cenários:

* **Teste de Carga Mais Dinâmico:** simula um ambiente realista com variação na quantidade de requisições ao longo do tempo.  
* **Teste Bruto:** avalia a capacidade da API sob uma carga elevada e constante.


## **5.2 Implementação**

### **5.2.1 Configuração**

Foi utilizado o framework Artillery para a implementação dos testes de carga.

Cada Virtual User (VU) executa um fluxo (flow), que, por sua vez, representa uma requisição para um dos três endpoints. Foi atribuída uma distribuição de peso de 75% para o POST /Transacao, 25% para o GET /Estatisticas e 5% para o DELETE /Transacao. Essa distribuição foi definida com o objetivo de simular um cenário mais próximo de um ambiente real.

**5.2.2 Problemas**

Para implementar o JSON com o valor e a dataHora na requisição de adicionar transação, o Artillery não suporta o uso direto de variáveis JavaScript. Para contornar isso, o valor foi padronizado para 10 e, para cada teste, foi gerado um arquivo CSV contendo cerca de 40 datas no formato ISOString. Essas datas são passadas de maneira aleatória para uma variável chamada ‘data’ nos arquivos de teste.

## **5.3 Teste de Carga Mais Dinâmico**

### **5.3.1 Configuração**

* **Aquecimento (Ramp-up):** 20 requisições/seg por 30 segundos.  
* **Platô Moderado:** 100 requisições/seg por 60 segundos.  
* **Pico de Carga:** 200 requisições/seg por 60 segundos.  
* **Ramp-down:** 100 requisições/seg por 60 segundos.

### **5.3.2 Resultados**

* Total de requisições: **18.900**  
* Sucessos (código 200/201): **16.381**  
* Falhas (EADDRINUSE): **2.519**  
* Tempo médio de resposta: **1 ms**  
* P95: **2 ms** | P99: **3 ms**

### **5.3.3 Análise**

Os tempos de resposta se mantiveram baixos e consistentes, demonstrando que a API respondeu bem às requisições, com um tempo de resposta médio de 1 ms.   
No entanto, o erro EADDRINUSE sugere que houve uma tentativa de reutilização de uma porta já em uso. Esse erro ocorre quando a aplicação tenta estabelecer uma nova conexão em uma porta que já está ocupada, o que pode indicar um problema no gerenciamento de conexões. Isso sugere que a infraestrutura da aplicação pode não estar totalmente preparada para lidar com uma grande quantidade de conexões simultâneas, necessitando de melhorias para garantir um gerenciamento eficiente das portas e conexões.

## **5.4 Teste Bruto**

### **5.4.1 Configuração**

* 300 requisições/seg por 60 segundos.

### **5.4.2 Resultados**

* Total de requisições: **18.000**  
* Sucessos (código 200/201): **15.661**  
* Falhas (EADDRINUSE): **2.339**  
* Tempo médio de resposta: **1.5 ms**  
* P95: **3 ms** | P99: **5 ms**

### **5.4.3 Análise**

A API continuou apresentando bons tempos de resposta, mesmo sob carga mais intensa. Com um número semelhante de requisições totais ao teste anterior, o tempo médio de resposta aumentou em apenas 0,5 ms.   
O erro EADDRINUSE permaneceu, confirmando a dificuldade da aplicação no gerenciamento de conexões. Apesar disso, o teste demonstrou que a API consegue suportar um número significativo de requisições sem sofrer uma degradação severa no tempo de resposta.

## **5.5 Conclusão**

Ambos os testes confirmam que a API tem bom desempenho e baixa latência sob diferentes cenários de carga. O erro EADDRINUSE indica possíveis limitações na configuração do servidor ou no gerenciamento de conexões, sendo um ponto a ser melhorado.

Importante destacar que não houve ocorrência de:

* **ECONNREFUSED** (Conexão recusada): indica que o servidor sempre esteve ativo e aceitando conexões.  
* **ETIMEDOUT** (Tempo limite excedido): sugere que a API manteve respostas rápidas sem bloqueios excessivos.


Ajustes na infraestrutura podem minimizar os erros remanescentes e melhorar ainda mais a resiliência da API sob alta carga.  
