const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Address = require("..//backend//model//Adress");

// Carrega as variáveis de ambiente do arquivo .ENV
dotenv.config();

// Cria uma instância do Express -> Servidor
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite qualquer origem para req.
  res.header("Access-Control-Allow-Methods", "GET", "POST"); // Permite apenas métodos GET e POST
  res.header("Access-Control-Allow-Headers", "Content-Type"); // Permite o cabeçalho nas req.
  next();
});

// JSON nas requisições / Config do Express
app.use(express.json());

// no navegador copiar o link do localhost abaixo
//localhost:3000/api/cep/13090730
app.get("/api/cep/:cep", async (req, res) => {
  const { cep } = req.params; // Extrai o Cep

  try {
    // Requisição GET para a API ViaCep, passando um Cep
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    res.json(response.data); // Retorna da API a resposta com o CEP
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o CEP!" }); // Em caso de erro
  }
});

app.post("/api/address", async (req, res) => {
  const { cep, logradouro, bairro, cidade, estado } = req.body;

  try {
    const newAddress = new Address({ cep, logradouro, bairro, cidade, estado });
    await newAddress.save(); // Salva o endereço no banco de dados
    // Retorna sucesso com os dados salvos
    res
      .status(201)
      .json({ message: "Endereço salvo com sucesso!", data: newAddress });
  } catch (error) {
    //Retorna erro se não salvar
    res.status(500).json({ error: "Error ao salvar o endereço!" });
  }
});

// Obtem as variáveis do .ENV
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Define o Link de conexão com o MongoDb Atlas
const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@clusterapi.28dvo.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPI`;

// POrta que roda o servidor
const port = 4000;

mongoose
  .connect(mongoURI) // Conecta ao Banco de dados com o Link gerado
  .then(() => {
    // Quando for conexão bem sucedida
    console.log("Conectou ao Banco");
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("Erro ao conectar ao MongoDB", err));
