
const InputCep = document.getElementById('cep');
const buscarBtn = document.getElementById('buscarBtn');
const loading = document.getElementById('loading');
const erro = document.getElementById('erro');
const resultado = document.getElementById('resultado');
const mensagemErro = document.getElementById('mensagemErro');

function formatarCep(valor) {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 5 ){
valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return valor;
}

InputCep.addEventListener('input', (e) => {
    e.target.value = formatarCep(e.target.value);

});


function validarCep(cep){
    const ceplimpo = cep.replace(/\D/g, '');
    return ceplimpo.length === 8;
}

async function buscarCep(cep){
    const cepLimpo = cep.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
    try{
        const response = await fetch(url);
        
        if (!response.ok){
            throw new Error('Erro na requisição');
        }
        const dados = await response.json();
       if (dados.erro){
        throw new Error('CEP nao encontrado');
       }

    }catch (erro) {
        throw new Error('Erro ao buscar CEP');
    }
}