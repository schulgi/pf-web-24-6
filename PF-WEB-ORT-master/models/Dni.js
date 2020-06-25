const mongoose = require('mongoose');

const DNISchema = new mongoose.Schema({    
    id_foto : String,
    nrodni : String
});

module.exports = mongoose.model('DNI', DNISchema);



