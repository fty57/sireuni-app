const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Forum = new Schema({
    nome: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("forums", Forum);