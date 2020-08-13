'use strict'
//cargar modulo de usuario
//cargar libreri bcrypt 
var bcrypt = require ('bcrypt-nodejs');

//modelos 
var User = require('../models/user');
const { param, use } = require('../routes/user');

//metodo acciones
function pruebas (req, res){
    res.status(200).send({
        message: 'Probando el controlador de ususuarios y la accion de prueba'

    });
} 
//metodo guardar usuaruo 
function saveUser (req,res){
    //crear objeto de usuario 
    var user = new User();

    //recoger los parametros de la peticion registar usuario 
    var params = req.body;
    //console.log(params);
    //asignar valores a usuario
if(params.password && params.name && params.surname && params.email){

    //asignar valores a usuario  
    user.name = params.name;
    user.surname =params.surname;
    user.email =params.email;
    user.role = 'ROLE_USER';
    user.image = null;
    //V50 controlar usuarios duplicados 

    User.findOne({email: user.email.toLowerCase()},(err, issetUser) => {
        if(err){
            res.status(500).send({message:'Error al comprobar el usuario'});

        }else{
            if(!issetUser){

            //encriptar password
            bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            //guardar usuario en base de datos 
            user.save((err, userStored) => {
                if (err){
                    res.status(500).send({message: 'ERRORO AL GUARDAR USUARIO'});
                } else{
                    if(!userStored){
                        res.status(400).send({message: 'No se ha registrado el usuario'});
                    }else {
                        res.status(200).send({user: userStored});
                    }
                }
            });
        });
            }else{
                res.status(200).send({
                    message: 'El usuario no puede registrate'
                });
            }
        }
    });



    
}else{
    res.status(200).send({
        message: 'Introduce los datos correctamente para poder registar el usuario' 
     });
}

}
module.exports= {
    pruebas,
    saveUser
};