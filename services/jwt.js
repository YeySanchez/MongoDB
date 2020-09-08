'user strict'
//v53 creando metodo para gerenera token cuando el usuario se loguee//

var jwt = require('jwt-simple');
var moment = require('moment');
var secret ='claves_secreta_del_curso_de_angular4avanzado';
exports.crearToken = function(user){
 var payload ={
     sub: user._id,
     name: user.name,
     surname: user.email,
     role: user.role,
     image: user.image,
     iat: moment().unix(),
     exp: moment().add(30, 'days').unix
 };
 return jwt.encode(payload, secret);
};