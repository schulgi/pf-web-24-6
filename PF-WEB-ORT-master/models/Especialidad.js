const mongoose = require('mongoose');
//Ver que es mas simple para la API!

//UN document con un Array de especialidades
const EspecialidadSchema = new mongoose.Schema({   
    nombre_especialidad: [{
        type:String
    }]
});

//Un document por CADA especialidad
/*
const EspecialidadSchema = new mongoose.Schema({
    nombre_especialidad:{
        type: String,
        required: true
    }
})   */

module.exports = mongoose.model('especialidad', EspecialidadSchema);

//Crear otro Schema que diferencie el array de E
