const descricao = document.querySelector("#descricao");
const data_entrada = document.querySelector("#data_entrada");
const data_saida = document.querySelector("#data_saida");
const tipo = document.querySelector("#tipo");
const valor = document.querySelector("#valor");
const id_fabric = document.querySelector("#id_fabric");
const tbody = document.querySelector("tbody");
const api = "http://localhost:3000";
const form = document.querySelector("form");

window.addEventListener("load", async () => {
  const respostaVeiculos = await fetch(`${api}/veiculos`);
  const veiculos = await respostaVeiculos.json();
  veiculos.forEach((v) => {
    id_fabric.innerHTML += `<option value="${v.id_veiculo}">${v.modelo} - ${v.placa}</option>`;
  });
  const respostaManutencao = await fetch(`${api}/manutencao`);
  const prods = await respostaManutencao.json();
  renderizar(prods);
});

function renderizar(prods) {
  prods.forEach((element) => {
    if (element.situacao == "concluido") { //style="background-color:green"//
      tbody.innerHTML += ` <tr > 
      <td>${element.id_manutencao}</td>
      <td>${element.descricao}</td>
      <td>${element.data_entrada}</td>
      <td>${element.data_saida}</td>
      <td>${element.tipo}</td>
      <td>${element.valor}</td>
      <td>${element.id_veiculo}</td>
      <td>
        <button onclick="concluir(${element.id_manutencao})">🗑️</button>
        <button onclick="editar(${element.id_manutencao})">✏️</button>
      </td>
    </tr>`;
    } else {
      tbody.innerHTML += `<tr>
        <td>${element.id_manutencao}</td>
        <td>${element.descricao}</td>
        <td>${element.data_entrada}</td>
        <td>${element.data_saida}</td>
        <td>${element.tipo}</td>
        <td>${element.valor}</td>
        <td>${element.id_veiculo}</td>
        <td>
          <button onclick="concluir(${element.id_manutencao})">🗑️</button>
          <button onclick="editar(${element.id_manutencao})">✏️</button>
        </td>
      </tr>`;
    }
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    descricao: descricao.value,
    data_entrada: data_entrada.value,
    data_saida: data_saida.value || null,
    tipo: tipo.value,
    situacao: situacao.value,
    valor: valor.value,
    id_veiculo: id_fabric.value,
  };
  const resposta = await fetch(`${api}/cadmanutencao`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (resposta.status == 201) {
    alert("cadastrado com sucesso");
    window.location.reload();
  } else {
    alert("erro ao cadastrar");
  }
});

async function concluir(id) {
  const resposta = await fetch(`http://localhost:3000/concluir/${id}`, {
    method: "PUT",
  });
  if (resposta.status == 200) {
    
    return window.location.reload();
  }
  return alert("erro ao concluir");
}

async function editar(id) {
  const produto = await fetch(`${api}/manutencao/${id}`);
  const prod = await produto.json();

  const descricao = prompt("Descrição do Problema", prod.descricao);
  if (descricao === null) return; // usuário cancelou

  const tipo = prompt("Tipo", prod.tipo);
  if (tipo === null) return;

  const valor = prompt("Valor", prod.valor);
  if (valor === null) return;

  const datas = { descricao, tipo, valor };

  const resposta = await fetch(`${api}/editar/${id}`, {
    method: "put",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(datas),
  });
  resposta.status == 200 ? window.location.reload() : alert("erro ao editar");
}
