const mongoose = require('mongoose');

const UbicacionSchema = new mongoose.Schema({    
    nombre_zona : String,
    numero_zona : String,
    partidos : [{type: String}]
});

module.exports = mongoose.model('Ubicacion', UbicacionSchema);
