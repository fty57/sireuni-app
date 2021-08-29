const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Evento = new Schema({
    nome: {
        type: String,
        required: true
    },
    descricao : {
        type: String,
        required: true
    },
    data : {
        type: Date,
        default: Date.now()                             // Você envia uma informação padrão - Date.now()
    }
});


mongoose.model("eventos", Evento);