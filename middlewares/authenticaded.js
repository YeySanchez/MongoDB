//v54 
'use strict'        
var jwt = require('jwt-simple');
var moment = require('moment');
var secret ='claves_secreta_del_curso_de_angular4avanzado';

exports.ensureAuth = function(req,res,next){
//comprobar si llega la cabecera de autenticacion
if(!req.headers.authorization){
return res.status(403).send({message: 'la peticion no tiene la cabecera de autenticacion'})
}
var token = req.headers.authorization.replace(/[''"]+/g,'');
try{
    var payload = jwt.decode(token, secret);
    //v54 validar si el token aun esta vigente con la fecha 
    if(payload.exp <= moment().unix()){
        return res.status(401).send({
            message: 'el token ha expirado'
        });

    }

}catch(ex){
    return res.status(404).send({
        message: 'El token no es valido'
    });

}
//para que el token no se quede en bucle selccionamos la propiedad next para que avance
req.user = payload;

next();

}