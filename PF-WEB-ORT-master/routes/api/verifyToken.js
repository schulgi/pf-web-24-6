const secret = require('../../config/secret');
const jwt = require('jsonwebtoken');

function verifyToken (req,res,next) {
    /*Busco token en los headers del front*/
    const token = req.headers['x-access-token'];
    if(!token){
        return  res.status(200).json({
            success: false,
            message: 'No token provided'
        });
    }
    
    jwt.verify(token, secret.secret, (err, decoded) => {
        if (err) {
            res.status(200).send({ err: 'Token Invalido/Expirado', success: false });
            next();
        } else {
            req.usuarioId = decoded.id;
            next();
        }

    });


}

module.exports = verifyToken;