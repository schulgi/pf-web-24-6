const express = require('express'); //Express Framework
const app = express(); //Saving Framework on Variable App
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');



//DB Config Connection String File
const db = require('./config/keys').MongoURI;

//CORS 
app.use(cors({origin: 'http://localhost:3000'})); 
//Hacer Cors Para Android 

//Connect to Mongo
mongoose.connect(db,{useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// BodyParser
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

//Routes
app.use('/',require('./routes/api/methods'));

//Middleware
app.use(morgan('dev'));


//App Listening Selected Port
const port = process.env.PORT || 5000; //Selected Port Number
app.listen(port,console.log(`Server Running ${port}`));