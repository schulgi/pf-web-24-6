const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConsultaSchema = new Schema({

    texto: String,
    created: { type: Date, default: Date.now },
    emisor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receptor:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}

});



module.exports = mongoose.model('Consulta', ConsultaSchema);


  