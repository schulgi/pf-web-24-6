
/*----------------------Declaracion Variables/Archivos-------------------------*/

const Notification = require("./notification.js");
const User = require('../../models/User');
const Dni = require('../../models/Dni');
const Especialidad = require('../../models/Especialidad');
const ConsultaGrupo = require('../../models/ConsultaGrupo');
const Documento = require('../../models/Documento');
const Consulta = require('../../models/Consulta');
const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const secret = require('../../config/secret');
const verifyToken = require('./verifyToken');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const mongoURI = require('../../config/keys').MongoURI;
const mongoose =  require('mongoose');
const Grid = require('gridfs-stream');
var fs = require('fs');

/*----------------------GFS Config-------------------------*/


//Connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

//Objeto Storage Manipulacion De Subida Del File
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
    });
  }
});

//Middleware Multipart/Upload
const upload = multer({ storage });

/*----------------------API GET Methods-------------------------*/

/*Download Archivo*/
app.get("/api/file/:id", (req, res) => {
    
    const fileId = new mongoose.mongo.ObjectId(req.params.id);

    gfs.find({
        _id: fileId             
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist"
          });
        }else{
        console.log(files[0].filename);
        gfs.openDownloadStream(fileId).pipe(fs.createWriteStream('./'+files[0].filename)).
        on('error', function(error) {
          assert.ifError(error);
        }).
        on('finish', function() {
          console.log('done!');
          process.exit(0);
        });
    }
      });
      
});

/*List Especialidades*/ 
app.get("/api/list/especialidades", (req,res) => {
    
    Especialidad.find({}, function(err, especialidades) {
        res.json(especialidades);  
      });
   
});

/*List TODOS los abogados! */
app.get("/api/list/abogados", (req,res) => {
    
    User.find({tipo :'A'}, function(err, abogados) {
        res.json(abogados); 
      });
   
});

/*List TODOS los clientes! */
app.get("/api/list/clientes", (req,res) => {
    
    User.find({tipo :'C'}, function(err, clientes) {
        res.json(clientes);  
      });
   
});

/*Muestra Partido*/
app.get('/api/ubicaciones/:zona', async (req,res,) => {
    
    const { zona } = req.params;
    console.log(zona);
    
        Ubicacion.find({numero_zona : zona},(err, partidos) => {
            res.json(partidos);  
    });
});   

/*Listado Consulta Abogados*/
app.get('/api/listab_all',verifyToken,  (req,res,next) => { 
    //vicky: cambié de GET a POST por los param que van al body, queda muy feo mandarlo en la URL?
    //vicky: arreglado el populate para que complete AMBOS, ver que campos faltarian para armar la tabla
    /*const { body } = req;

    const { id } = body;*/

    var id = req.query.id;
    
    User
      .findById({_id : id})
      .select('consultaGrupo')
      .populate({
          path: 'consultaGrupo',        
        // ,populate: { path: 'textoConsulta', model: 'Consulta'}
        // ,populate : {path: 'id_cli', model: 'user', select: ['nombre','apellido']}

        populate : [{ path: 'textoConsulta', model: 'Consulta' },
        {path: 'id_cli', model: 'user', select: ['nombre','apellido']} ] 
        })   
      
      .exec(function(err,user){
          if(!user){
              return res.status(404).end();
          }else{
              return res.status(200).json(user);
          }
      })
      //console.log(req);
});  

app.get('/api/consultagrupo', (req,res,next) => { 
 
    var id = req.query.id;
    
    ConsultaGrupo
      .findById({_id : id})
      .select('textoConsulta')
      .populate({
          path : 'textoConsulta',     
         // populate : { path: 'emisor', model: 'user', select: ['nombre','apellido'] }
          
        populate : [{ path: 'emisor', model: 'user', select: ['nombre','apellido'] },  
          { path: 'receptor', model: 'user', select: ['nombre','apellido'] } ]  

      })
      
      .exec(function(err,user){
          if(!user){
              return res.status(404).end();
          }else{
              return res.status(200).json(user);
          }
      })
      
}); 

/*Listado Consulta Clientes*/
app.get('/api/listcli_all',verifyToken,(req,res,next) => { 
    
    /*const { body } = req;

    const { id } = body;*/

    var id = req.query.id;
    
    User
      .findById({_id : id})
      .select('consultaGrupo')
      .populate({
          path: 'consultaGrupo',
         /* populate: { path: 'textoConsulta', model: 'Consulta' },
          populate: { path: 'id_abo', model: 'user', select: ['nombre','apellido']}*/
          
          populate : [{ path: 'textoConsulta', model: 'Consulta' },
          {path: 'id_abo', model: 'user', select: ['nombre','apellido']} ] 

      })
           
      .exec(function(err,user){
          if(!user){
              return res.status(404).end();
          }else{
              return res.status(200).json(user);
          }
      })

});  

/*Listado Consulta Abogados Nuevo*/
app.get('/api/listab_pending',verifyToken, (req,res,next) => { 
    
    /*const { body } = req;
    const { id } = body;*/

    var id = req.query.id;
    
    User
      .findById({_id : id})
      .select('consultaGrupo')
      .populate({
          path: 'consultaGrupo',
          match: { estado: ['NUEVA']},
          populate: [{ path: 'textoConsulta', model: 'Consulta' },
          { path: 'id_cli', model: 'user', select: ['nombre','apellido']}]

        })
      .exec(function(err,user){
          if(!user){
              return res.status(404).end();
          }else{
              return res.status(200).json(user);
          }
      })

});  

/*Listado Consulta Abogados Aceptadas*/
app.get('/api/listab_true', verifyToken, (req,res,next) => { 
    
    /*const { body } = req;

    const { id } = body;*/

    var id = req.query.id;
    
    User
      .findById({_id : id})
      .select('consultaGrupo')
      .populate({
          path: 'consultaGrupo',
          match: { estado: ['APROBADO']},
          populate: [{ path: 'textoConsulta', model: 'Consulta' },
           { path: 'id_cli', model: 'user', select: ['nombre','apellido']}]

        })
      .exec(function(err,user){
          if(!user){
              return res.status(404).end();
          }else{
              return res.status(200).json(user);
          }
      })

});  

/*Verificar JWT Front-End, se envia token*/
app.get('/api/verify', verifyToken, async (req,res,next) => {

    /*Verifico que exista el token , que no esté caducado*/
    /*Le pasamos el token del User y el SECRET de la app*/

    const user = await User.findById(req.usuarioId, { password: 0 });
    if (user) {
        return res.json(user); 
    } 

    //No tiene response por falla , para no pisar el header exitoso de la api signin
 
});

/*Listado Consulta Abogados Aceptada*/
app.get('/api/listab_aceptado',verifyToken, (req,res,next) => { 
    
    /*const { body } = req;
    const { id } = body;*/

    var id = req.query.id;
    
    User
      .findById({_id : id})
      .select('consultaGrupo')
      .populate({
          path: 'consultaGrupo',
          match: { estado: ['ACEPTADO']},
          populate: [{ path: 'textoConsulta', model: 'Consulta' },
           { path: 'id_cli', model: 'user', select: ['nombre','apellido']}]

        })
      .exec(function(err,user){
          if(!user){
              return res.status(404).end();
          }else{
              return res.status(200).json(user);
          }
      })

});  

/*Listado Consulta Abogados Activa*/
app.get('/api/listab_activo', verifyToken, (req,res,next) => { 
    
    /*const { body } = req;
    const { id } = body;*/

    var id = req.query.id;
    
    User
      .findById({_id : id})
      .select('consultaGrupo')
      .populate({
          path: 'consultaGrupo',
          match: { estado: ['PAGADA','ACTIVA']},
          populate: [{ path: 'textoConsulta', model: 'Consulta' },
           { path: 'id_cli', model: 'user', select: ['nombre','apellido']}]

        })
      .exec(function(err,user){
          if(!user){
              return res.status(404).end();
          }else{
              return res.status(200).json(user);
          }
      })

});  

/*Listado Consulta Abogados Rechazadas*/
app.get('/api/listab_rechazado', verifyToken, (req,res,next) => { 
    
    /*const { body } = req;
    const { id } = body;*/

    var id = req.query.id;
    
    User
      .findById({_id : id})
      .select('consultaGrupo')
      .populate({
          path: 'consultaGrupo',
          match: { estado: ['RECHAZADO']},
          populate: [{ path: 'textoConsulta', model: 'Consulta' },
           { path: 'id_cli', model: 'user', select: ['nombre','apellido']}]

        })
      .exec(function(err,user){
          if(!user){
              return res.status(404).end();
          }else{
              return res.status(200).json(user);
          }
      })

});

/* Traer los documents a partir de un ID */
app.get('/api/listfiles', (req,res,next) => {

   const id = req.query.id;

   ConsultaGrupo.findById({_id : id })
    .select('id_files')
    .populate({
        path: 'id_files',
        populate: [{path: 'id_upload', model: 'GFS' ,select: ['filename']}]
    })
    .exec(function(err,list){
        if(err){
            return res.status(404).end('Error');
        }else{
            return res.status(200).json(list);
        }
    })
});

/*----------------------API POST Methods-------------------------*/

/*Registrar Cliente JWT*/
app.post('/api/signup', async (req,res,next) => {
    
    /*Recibo parametros del body html*/ 
    const { body } = req;

    const {nombre,apellido,password,tipo,dni_,partido,zona} = body;

    /*no es const ya que lo modifico con toLowerCase*/
    let { email } = body;

    /*siempre hacerle lower*/
    /*email = email.toLowerCase();*/

    /*Validar entradas*/
    if(!nombre){
        return res.send({
            success:false,
            message: 'Nombre Sin Datos/Error'
     });
    }
    if(!apellido){
        return res.send({
            success:false,
            message: 'Apellido Sin Datos/Error'
     });
    }
    if(!email){
        return res.send({
            success:false,
            message: 'Email Sin Datos/Error'
     });
    }
    if(!password){
        return res.send({
            success:false,
            message: 'Password Sin Datos/Error'
     });
    }
    if(!tipo){
        return res.send({
            success:false,
            message: 'Sin Tipo'
     });
    }
    if(!dni_){
        return res.send({
            success:false,
            message: 'Sin D.N.I'
     });
    }

    /*OJO VALIDAR ENTRADA DE OTROS DATOS*/ 
    /*Busco que el user no este repetido*/    
    await User.find({email: email.toLowerCase()}, (err, searchrepeat) => {
        if(err){
                res.send({
                success:false,
                message: 'Error Finding User'
         });
        } else if (searchrepeat.length > 0){
                res.send({
                success:false,
                message: 'Cuenta Existente'
         });
        } 
    });

    const _dni = new Dni();
    _dni.nrodni = dni_;
    _dni.save((err) => {
        if(err){
                res.send({
                success:false,
                message: 'Objeto DNI Error'
            });
        }
    });
     
    /*Creo un usuario de entrada*/

    const user = new User({   
        nombre : nombre,
        apellido : apellido,
        password : password,
        email : email,
        tipo : tipo,
        dni : _dni._id,
        partido : partido,
        zona: zona
    });

    /*setDefaultsOnInsert Upsert Reemplazar esta logica
    no debe estar atado al endpoint*/
    
    /*if(tipo === 'A'){}          Crear EndPoint*/ 
  
    user.password = user.generateHash(password);
    //No esta funcionando el metodo desde el schema.
    user.email = user.emailCase(email);
    user.save((err) => {
        if(err){
                res.send({
                success:false,
                message: 'Error Saving'
            });
        }

    });

     res.json({message: 'Registro Exitoso'});


});

/*Logiar Cliente JWT*/ /*PASO 1 ANDROID LOGIARSE DEVUELVE TOKEN SIN EXPIRACION*/
app.post('/api/signin_mobile', async (req,res,next) => {
    
    /*Consumo Body HTML*/ 
    const{ body } = req;
        
    const { password, deviceToken } = body;
    
    /*No es una const*/
    let{ email } = body;


    /*Validaciones*/
    if(!email){
        return res.send({
            success:false,
            message: 'Email Vacio'
     });
    }
    if(!password){
        return res.send({
            success:false,
            message: 'Password Vacio'
     });
    }

    /*LowerCase Mail*/
    email = email.toLowerCase();

    /*Si existe error de Headers quitar returns*/

    await User.find({email: email},(err,user) =>{
        if(err){
            return res.send({
                success:false,
                message: 'Error Servidor'
            });
        }
        if(user.length != 1){
            return res.send({
                success:false,
                message: 'Datos Erroneos Mail Inexistente'
            });
        }

        const user_ = user[0];
        if(!user_.validPassword(password)){
            return res.send({
                success:false,
                message: 'Contraseña/Mail Incorrectos'
            });
        }

        User.findOneAndUpdate({email: email},
            { $set: { deviceToken: deviceToken } }
            , function (err, user) {
            if(err){
                res.send({
                success:false,
                message: 'Error' 
                }); 
            }
        });
    
        const token = jwt.sign({id: user_._id}, secret.secret);
        
       res.json({success:true,token}); 

    });

});

/*Traigo User ID*/ /*PASO 2 ANDROID UNA VEZ TENIENDO TOKEN PREGUNTO POR UN USER Y CARGO LA SESION*/
app.post("/api/userbytoken",verifyToken, (req,res) => {
    
    /*EL PARAMETRO VERIFYTOKEN HACE UN DECODE DEL TOKEN Y DEVUELVE EL USUARIO, ESA LOGICA
    LA VA A BUSCAR A LA FUNCION VERIFYTOKEN QUE LA LLAMA ARRIBA*/

    console.log(req.usuarioId);

    const user = User.findById(req.usuarioId,{ password: 0 },(err,user) => {
        if(err){
            return res.status(401).send('Usuario No Encontrado')
        }else{
            return res.json(user);
        }
    });

});

/*TRAIGO UN USER ID POR UID*/
app.post("/api/user", function (req,res) {
    
    const { body } = req;

    const { id } = body;
  
    User.findById({_id : id})
        .exec(function(err,user){
            if(!user){
                return res.status(404).end();
            }else{
                return res.status(200).json(user);
            }
        })
});

/*Logiar Cliente JWT*/    
app.post('/api/signin', async (req,res,next) => {
    
    /*Consumo Body HTML*/ 
    const{ body } = req;
        
    const { password } = body;
    
    /*No es una const*/
    let{ email } = body;

    /*Validaciones*/
    if(!email){
        return res.send({
            success:false,
            message: 'Email Vacio'
     });
    }
    if(!password){
        return res.send({
            success:false,
            message: 'Password Vacio'
     });
    }

    /*LowerCase Mail*/
    email = email.toLowerCase();

    /*Si existe error de Headers quitar returns*/

    await User.find({email: email},(err,user) =>{
        if(err){
            return res.send({
                success:false,
                message: 'Error Servidor'
            });
        }
        if(user.length != 1){
            return res.send({
                success:false,
                message: 'Datos Erroneos Mail Inexistente'
            });
        }
        
        const user_ = user[0];
        if(!user_.validPassword(password)){
            return res.send({
                success: false,
                message: 'Contraseña/Mail Incorrectos'
            });
        }

        const token = jwt.sign({id: user_._id}, secret.secret,{
            expiresIn: '1h'
        });
        
       res.json({success:true,token}); /*DEVOLVER UID PARA MOBILE*/

    });
});

/*Upload Archivos (Documents) a la BD MongoDB*/
app.post('/api/upload',upload.single('file'), async (req,res) => {

    const { body } = req;

    const { id } = body;

    /*const documento = new Documento();
    documento.id_upload = req.file.id;
    console.log(documento);
    documento.save((err) => {
        if(err){
                res.send({ 
                success:false,
                message: 'Error'
            });
        }
    });*/

    User.findOneAndUpdate({_id: id},
        { $push: { documents: req.file.id  } }
        , function (err, user) {
        if(err){
            res.send({
            success:false,
            message: 'Error' 
            }); 
        }

        return res.status(200).json(req.file);
    
    });

    //res.json("Archivo Subido");

    /*

    El error de headers es porque hay dos res y se cumplen las dos
    entonces la respuesta tiene doble encabezado y no sabe que hacer y rompe
    https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
    
    */

});
    
/*Crea Consulta Y Canal*/
app.post('/api/crearconsulta', async (req,res,next) => { 
    
    const { body } = req;

    const { iduser,idabogado,cons,titulo } = body;

    //Objetos Consulta (Canal - Mensaje)
    const consulta = new Consulta();
    const consultaGrupo = new ConsultaGrupo();

    
    if(!iduser){
        return res.send({
            success:false,
            message: 'Error parametro emisor'
      });
     };
    
     if(!idabogado){
        return res.send({
            success:false,
            message: 'Error parametro destinatario'
     });
    };
    
    if(!cons){
        return res.send({
            success:false,
            message: 'Consulta vacia'
     });
    };
     
    consulta.emisor = iduser;

    consulta.receptor = idabogado;    
            
    consulta.texto = cons;

    consulta.save((err) => {
        if(err){
                return res.send({
                success:false,
                message: 'Imposible Crear Consulta'
            });  
        }
    });

    consultaGrupo.motivo = titulo;
    
    consultaGrupo.textoConsulta = consulta._id;

    consultaGrupo.id_cli = iduser;
    
    consultaGrupo.id_abo = idabogado;

    consultaGrupo.estado = 'NUEVA';
    

    consultaGrupo.save((err) => {
        if(err){
            
        Consulta.findByIdAndDelete(consulta._id);
                
        return res.send({
            success:false,
            message: 'Imposible Crear Consulta'
        });
                 
        }else{
            
        User.findOneAndUpdate({_id: iduser},  
            
        { $push: { consultaGrupo : consultaGrupo._id } },(err, user) => {
      
        if(err){

        Consulta.findByIdAndDelete(consulta._id);

        ConsultaGrupo.findByIdAndDelete(consultaGrupo._id);

        return res.send({
            success:false,
            message: 'Error Usuario Inexistente, Imposible Generar Pregunta'
            //Dificil que llegue a este punto de error 
            });
                
        }

        });

        User.findOneAndUpdate({_id: idabogado},  
            
            { $push: { consultaGrupo : consultaGrupo._id } },(err, user) => {
          
            if(err){
    
            Consulta.findByIdAndDelete(consulta._id);
    
            ConsultaGrupo.findByIdAndDelete(consultaGrupo._id);
    
            return res.send({
                success:false,
                message: 'Error Usuario Inexistente, Imposible Generar Pregunta'
                //Dificil que llegue a este punto de error 
                });
                    
            }
    
        });

        //Salida Exitosa Total Endpoint
        return res.json('Consulta Realizada');
        
        }
    });

});

/*Consulta*/
app.post('/api/consulta', async (req, res, next) => {

    const { body } = req;

    const { id, cons, tipo } = body;

    const consulta = new Consulta();

    consulta.texto = cons;

    console.log(id);

    ConsultaGrupo.findById({ _id: id }, (err, consultaGrupo) => {
        if (err) {
            console.log(err);
        } else {

            if (tipo == 'C') {

                consulta.emisor = consultaGrupo.id_cli;
                consulta.receptor = consultaGrupo.id_abo;

            }

            if (tipo == 'A') {

                consulta.emisor = consultaGrupo.id_abo;
                consulta.receptor = consultaGrupo.id_cli;

            }

            consulta.save((err) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Imposible Crear Consulta'
                    });
                } else {

                    ConsultaGrupo.findOneAndUpdate({ _id: id },
                        { $push: { textoConsulta: consulta._id } }
                        , function (err, consultaGrupo) {
                            if (err) {
                                return res.send({
                                    success: false,
                                    message: 'Error'
                                });
                            } else {
                                return res.json(cons);
                            }
                        }
                    );
                }
            });
        }
    })


}); 

/* Compartir Archivo Desde Cliente o Abogado */
app.post('/api/sharefile',upload.single('file'), async (req, res, next) => {

    const { body } = req;

    const { idconsulta, iduser, idabogado } = body;

    const documento = new Documento();

    documento.id_upload = req.file.id;

    if ((iduser == undefined && idabogado == undefined) || (iduser != undefined && idabogado != undefined)) {

        return res.send({
            success: false,
            message: 'Error Datos'
        });

    }

    ConsultaGrupo.findById({ _id: idconsulta }, (err, consulta) => {

        if (err) {

            return res.send({

                success: false,
                message: 'Error Consulta Inexistente'

            });

        } else {

            if (iduser != undefined && idabogado == undefined) {

                documento.id_user = iduser;
                documento.id_shared = consulta.id_abo;
            }
        
            if (iduser == undefined && idabogado != undefined) {
        
                documento.id_user = idabogado;
                documento.id_shared = consulta.id_cli;
            }
        
            documento.save((err,documento) => {
                if (err) {

                    return res.send({
                        success: false,
                        message: 'Error Documento'
                    });
                } else {


                    ConsultaGrupo.findOneAndUpdate({ _id: idconsulta },
                        { $push: { id_files: documento._id } }
                        , function (err, user) {
                            if (err) {
                                return res.send({
                                    success: false,
                                    message: 'Error'
                                });
                            }
                        });
                }
            });

           return res.json('Fin');
        }
    });

});

/*Rechazo Consulta*/
app.post('/api/rechazoservicio', async (req, res, next) => {

    const { body } = req;

    const { idconsulta, nombreAbo } = body;

    ConsultaGrupo.findOneAndUpdate({ _id: idconsulta },

        { $set: { estado: 'RECHAZADA' } }, (err, consulta) => {

            if (err) {

                return res.send({
                    success: false,
                    message: 'Error Usuario Inexistente'
                });

            } else {

                const userId = consulta.id_cli;

                User.findById({ _id: userId }, (err, user) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error'
                        });
                    } else {

                        if (user.deviceToken != undefined) {
                            if (user.deviceToken != '') {

                                const data = {

                                    tokenId: user.deviceToken,
                                    titulo: consulta.motivo,
                                    mensaje: user.nombre + ', tu consulta a ' + nombreAbo + ' ha sido rechazada'

                                }

                                Notification.sendPushToOneUser(data);

                                return res.send({
                                    success: true,
                                    message: idconsulta
                                });

                            }
                        }

                        return res.send({
                            success: true,
                            message: 'Usuario Sin Mobile'
                        });


                    }
                });
            }

        });

});

/*Termino Registro*/
app.post('/api/terminaregistro' ,async (req,res,next) => {

    const { body } = req;

    const { id, tomo, folio, colegio, especialidad, firmaDigital, cv} = body;

    await User.find({_id: id}, (err, user) => {
        if(err){
                return res.json({
                success:false,
                message: 'Error al encontrar ID'
         });
        } 

    
    if(user.tipo == 'A'){
        if(user.tomo == '' || user.folio == '' || user.colegio == '' || user.especialidad == ''){
            return res.json('Datos Incompletos');
        }
    }


    User.findOneAndUpdate({_id: id},
        { $set: { 
            matricula: {
            
            tomo : tomo,
            folio : folio,
            colegio : colegio
            
        },

        especialidad : especialidad,
        firmaDigital : firmaDigital,
        cv: cv
        
        } }
        , function (err, user) {
        if(err){
            return res.json({
            success:false,
            message: 'Error' 
            }); 
        }else{
            return res.json("Completado Exitosamente");
        }
    }); //OJO esto devuelve Completado Exitosamente aunque el registro no exista!!!!!! 
    
   });

});

/*Acepto Consulta*/
app.post('/api/aprueboservicio', async (req, res, next) => {

    const { body } = req;

    const { idconsulta, nombreAbo } = body;

    ConsultaGrupo.findOneAndUpdate({ _id: idconsulta },

        { $set: { estado: 'APROBADA' } }, (err, consulta) => {

            if (err) {

                return res.send({
                    success: false,
                    message: 'Error Usuario Inexistente, Imposible Generar Pregunta'
                    //Dificil que llegue a este punto de error 
                });

            } else {

                const userId = consulta.id_cli;

                User.findById({ _id: userId }, (err, user) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error'
                        });
                    } else {

                        if (user.deviceToken != undefined) {
                            if (user.deviceToken != '') {

                                const data = {

                                    tokenId: user.deviceToken,
                                    titulo: consulta.motivo,
                                    mensaje: user.nombre + ', tu consulta a ' + nombreAbo + ' ha sido aprobada'

                                }

                                Notification.sendPushToOneUser(data);

                                return res.send({
                                    success: true,
                                    message: idconsulta
                                });

                            }
                        }

                        return res.send({
                            success: true,
                            message: 'Usuario Sin Mobile'
                        });


                    }
                });
            }

        });

});

/*Cierro Consulta*/    /// VICKY VER 'Pendiente Cierre'
app.post('/api/cierroservicio', async (req,res,next) => { 
    
    const { body } = req;

    const { idconsulta,tipo } = body;

    ConsultaGrupo.findOneAndUpdate({_id: idconsulta},  
            
        { $set: { estado : 'CERRADA' } },(err, consulta) => {
      
        if(err){

        return res.send({
            success:false,
            message: 'Error Usuario Inexistente, Imposible Generar Pregunta'
        });
                
        } else {

            if(tipo == 'A'){
                var userId = consulta.id_cli;
            }else{
                var userId = consulta.id_abo;
            }

            User.findById({ _id: userId }, (err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error'
                    });
                } else {

                    if (user.deviceToken != undefined) {
                        if (user.deviceToken != '') {

                            const data = {

                                tokenId: user.deviceToken,
                                titulo: consulta.motivo,
                                mensaje: 'La consulta ha sido cerrada por '+ user.nombre + ' ' + user.apellido

                            }

                            Notification.sendPushToOneUser(data);

                            return res.send({
                                success: true,
                                message: idconsulta
                            });

                        }
                    }

                    return res.send({
                        success: true,
                        message: 'Usuario Sin Mobile'
                    });
                
                }
            
            });
        
        }

    });

});

/*Logout*/
app.post('/api/logout', async (req, res, next) => {

    const { body } = req;

    const { id } = body;

    User.findOneAndUpdate({ _id: id },

        //HAY VARIAS OPCIONES, '', NULL , O ELIMINAR EL DEVICETOKEN A NIVEL CAMPO
        //VALIDAR QUE NO ENVIE NOTIFICACIONES A USUARIOS QUE TIENEN DEVICETOKEN = ''
        { $set: { deviceToken: '' } }, (err, user) => {

            if (err) {

                return res.send({
                    success: false,
                    message: 'Error'
                });

            } else {

                return res.send({
                    success: true,
                    message: 'Logout'

                });

            }

        });

}); 

/*Export obligatorio del file Methods.Js*/
module.exports = app;
