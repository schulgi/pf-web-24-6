const mongoose = require('mongoose');

const ConsultaGrupoSchema = new mongoose.Schema({    
    
    motivo: String,  
    textoConsulta : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consulta' }],
    id_cli :  {type: mongoose.Schema.Types.ObjectId},  
    id_abo :  {type: mongoose.Schema.Types.ObjectId},
    estado : String,
    created: { type: Date, default: Date.now },
    id_files: [{type: mongoose.Schema.Types.ObjectId , ref: '' }] 
});

module.exports = mongoose.model('ConsultaGrupo', ConsultaGrupoSchema);

