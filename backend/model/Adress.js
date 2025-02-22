const mongoose = require("mongoose")

// Define o modelo
const addressSchema = mongoose.Schema({
    cep: {
        type: String,
        required: true,
        unique: true, // Garante que o Cep seja unico registro
    },
    logradouro: {
        type: String,
        required: true,
    },
    bairro: {
        type: String,
        required: true,
    },
    cidade: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
        MaxLengh: 2, // Estado deve ter no máximo 2 caracter ex: SP
    },
}, {
    timeStamp: true // Adiciona hora da criação e edição
}
);

//  Cria o modelo
const Address = mongoose.model("Address", addressSchema);

//  Exporta o modelo para ser usado
module.exports = Address;

