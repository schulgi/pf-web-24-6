const mongoose = require('mongoose');
var GFS = mongoose.model("GFS", new mongoose.Schema({}, {strict: false}), "uploads.files" );

const DocumentoSchema = new mongoose.Schema({   
    
    filename: String,  
    id_upload :  { type: mongoose.Schema.Types.ObjectId, ref : 'GFS' }, 
    id_shared :  { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, 
    id_user :  { type: mongoose.Schema.Types.ObjectId },
    id_consultaGrupo : {type: mongoose.Schema.Types.ObjectId, ref: 'ConsultaGrupo'} 
    
});

module.exports = mongoose.model('Documento', DocumentoSchema);
