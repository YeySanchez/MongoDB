'use strict'
//cargar modulo de usuario
//cargar libreri bcrypt 
var bcrypt = require ('bcrypt-nodejs');

//modelos 
var User = require('../models/user');
const { param, use } = require('../routes/user');
const user = require('../models/user');
// servicios 
//v53 servicio token jwt
var jwt = require('../services/jwt');

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
// v50  metodo login 
function login (req,res){
    //v50 comprobar los datos del usuario o si existe 
    var params =req.body;

    var email =params.email;
    var password =params.password;

    User.findOne({email: email.toLowerCase()},(err, user) => {
        if(err){
            res.status(500).send({message: 'error al comprobar el usuario'});
        }else{
            if(user){
                //comprobar contraseña 
                bcrypt.compare(password, user.password,(err, check) =>{
                    if(check){
                        //v53 traer el metodo token para cuando el usuario se loguee correctamente genere el token
                        //generar y comprobar token
                        if(params.gettoken){
                        //v53 devolver token jwt
                        res.status(200).send({
                        token: jwt.crearToken(user)
                        });
                        }else 
                        {
                            res.status(200).send({user});
                        }
                        //fin de validacion y geracion del token
                        
                    }else{
                        res.status(404).send({
                            message: 'el usuario no ha podido loguearse correctamente'
                        });
                    }
                });
            
            }else{
                res.status(404).send({
                    message: 'El usuario no existe por lo cual no ha podido ingresar'
                });
            }
        }
    });

    
}
module.exports= {
    pruebas,
    saveUser,
    login
};