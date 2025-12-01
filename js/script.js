
// Versão limpa do script: formata, valida e busca CEP usando ViaCEP
const $ = selector => document.querySelector(selector);
const inputCep = $('#cep');
const buscarBtn = $('#buscarBtn');
const loading = $('#loading');
const erro = $('#erro');
const resultado = $('#resultado');
const mensagemErro = $('#mensagemErro');

function formatarCep(valor) {
  valor = (valor || '').replace(/\D/g, '');
  if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
  return valor;
}

if (inputCep) inputCep.addEventListener('input', e => { e.target.value = formatarCep(e.target.value); });

function validarCep(cep) {
  const ceplimpo = (cep || '').replace(/\D/g, '');
  return ceplimpo.length === 8;
}

async function buscarCep(cep) {
  const cepLimpo = (cep || '').replace(/\D/g, '');
  if (!cepLimpo) throw new Error('CEP vazio');
  const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro na requisição');
  const data = await res.json();
  if (data.erro) throw new Error('CEP não encontrado');
  return data;
}

function mostrarLoading(on) { if (!loading) return; loading.classList.toggle('hidden', !on); }
function mostrarErro(msg) { if (!erro || !mensagemErro) return; mensagemErro.textContent = msg; erro.classList.remove('hidden'); if (resultado) resultado.classList.add('hidden'); }
function limparErro() { if (!erro || !mensagemErro) return; mensagemErro.textContent = ''; erro.classList.add('hidden'); }
function mostrarResultado(data) {
  if (!resultado) return;
  $('#resultado-cep').textContent = data.cep || '';
  $('#resultado-logradouro').textContent = data.logradouro || '';
  $('#resultado-bairro').textContent = data.bairro || '';
  $('#resultado-localidade').textContent = data.localidade || '';
  $('#resultado-uf').textContent = data.uf || '';
  resultado.classList.remove('hidden');
}

if (buscarBtn) {
  buscarBtn.addEventListener('click', async () => {
    const cep = inputCep ? inputCep.value.trim() : '';
    limparErro();
    if (!validarCep(cep)) { mostrarErro('Formato de CEP inválido. Use 12345-678 ou 12345678.'); return; }
    mostrarLoading(true);
    buscarBtn.disabled = true;
    try {
      const data = await buscarCep(cep);
      mostrarResultado(data);
    } catch (err) {
      mostrarErro(err.message || 'Erro ao buscar o CEP');
    } finally {
      mostrarLoading(false);
      buscarBtn.disabled = false;
    }
  });
}