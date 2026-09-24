const marca = document.querySelector('#marca')
const modelo = document.querySelector('#modelo')
const cor = document.querySelector('#cor')
const placa = document.querySelector('#placa')
const ano = document.querySelector('#ano')

const id_cliente = localStorage.getItem('id');
console.log(id_cliente)

const modal = document.querySelector('#cadCArro');

document.querySelector('#abrirModal').addEventListener('click', () => {
    modal.showModal();
});

document.querySelector('#fecharModal').addEventListener('click', () => {
    modal.close();
});

const formulario = document.querySelector("form");
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        marca: marca.value,
        modelo: modelo.value,
        cor: cor.value,
        placa: placa.value,
        ano: ano.value,
        id_cliente: id_cliente
    };
    console.log(dados)
    const resposta = await fetch('http://localhost:3000/cadVeiculo', {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(dados),
    });
    if (resposta.status == 201) {
        alert("Carro Cadastrado com sucesso");
        return window.location.reload()
    }
});

window.addEventListener('load', () => {
    if (!id_cliente) {
        window.location.replace('./login.html');
    }
});

function sair() {
    localStorage.clear();
    window.location.reload()
}

document.querySelector('#sair').addEventListener('click', sair);