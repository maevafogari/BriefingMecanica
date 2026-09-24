import express from "express";
import sql from "./database.js";
const routes = express.Router();

//USUÁRIO
routes.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body;
    const resposta = await sql`select * from clientes where nome = ${user}`;

    if (resposta.length === 0) {
      return res.status(401).json("erro ao logar");
    }

    if (password == resposta[0].senha) {
      return res.status(200).json(resposta[0]);
    }
    return res.status(401).json("erro ao logar");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro interno ao logar" });
  }
});
routes.get("/usuarios", async (req, res) => {
  const resposta = await sql`select * from clientes`;
  return res.status(200).json(resposta);
});
routes.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const resposta = await sql`select * from clientes where id_cliente= ${id}`;
  return res.status(200).json(resposta[0]);
});


routes.post("/cadastro", async (req, res) => {
  try {
    const { user, password, cpf, telefone, endereco } = req.body;
    await sql`INSERT INTO clientes(nome, senha, cpf, telefone, endereco) 
    VALUES (${user}, ${password}, ${cpf}, ${telefone}, ${endereco})`;
    return res.status(201).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar usuário",
    });
  }
});
routes.delete("/deletar/:id", async (req, res) => {
  const { id } = req.params;
  await sql`delete from usuario where id_user = ${id}`;
  return res.status(200).json("Deletado");
});
routes.put("/editarUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_p } = req.body;
    const resposta = await sql`UPDATE usuario
	SET usuario=${nome_p}	WHERE id_user=${id} RETURNING *;`;
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

//PRODUTOS
routes.get("/manutencao", async (req, res) => {
  try {
    const resposta = await sql`select * from manutencao`;
    return res.status(200).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar manutenção" });
  }
});

routes.get("/manutencao/:id", async (req, res) => {
  const { id } = req.params;
  const resposta =
    await sql`select * from manutencao where id_manutencao=${id}`;
  return res.status(200).json(resposta[0]);
});

routes.get("/veiculos", async (req, res) => {
  try {
    const resposta = await sql`select * from veiculos`;
    return res.status(200).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar veículos" });
  }
});

routes.post("/cadVeiculo", async (req, res) => {
  try {
    const { marca, modelo, cor, placa, ano, id_cliente } = req.body;
    const resposta =
      await sql`INSERT INTO veiculos(marca, modelo, cor, placa, ano, id_cliente) VALUES (${marca}, ${modelo}, ${cor}, ${placa}, ${ano}, ${id_cliente}) RETURNING *`;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar veiculo",
    });
  }
});

routes.post("/cadmanutencao", async (req, res) => {
  try {
    const { data_entrada, data_saida, descricao, tipo, id_veiculo } = req.body;
    const resposta = await sql`
      INSERT INTO manutencao(data_entrada, data_saida, descricao, tipo, situacao, valor, id_veiculo)
      VALUES (${data_entrada}, ${data_saida || null}, ${descricao}, ${tipo}, 'pendente', ${valor}, ${id_veiculo})
      RETURNING *`;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao cadastrar manutenção" });
  }
});

routes.put("/concluir/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = new Date();
    await sql` UPDATE manutencao set data_saida=${data}, situacao='concluido' where id_manutencao = ${id}`;
    return res.status(200).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao concluir" });
  }
});

routes.put("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, tipo, valor } = req.body;
    const resposta = await sql`
      UPDATE manutencao
      SET descricao = ${descricao}, tipo = ${tipo}, valor = ${valor}
      WHERE id_manutencao = ${id}
      RETURNING *`;
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao editar manutenção" });
  }
}); 

export default routes;
