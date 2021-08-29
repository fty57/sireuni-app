const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Receita = new Schema({
    nome: {
        type: String,
        required: true
    },
    ingredientes : {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    rendimento : {
        type: String,
        required: true
    },
    avaliacao : {
        type: String,
        required: false
    }
});

mongoose.model("receitas", Receita);