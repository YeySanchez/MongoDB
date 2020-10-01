'use strict'
//cargar modulo de usuario
//cargar libreri bcrypt 
var bcrypt = require('bcrypt-nodejs');
//v55 modulo carcar imagen
var fs = require('fs');
//v56 modulo subir foto para cargar la libreria
var path = require('path');

//modelos 
var User = require('../models/user');
const { param, use } = require('../routes/user');
const user = require('../models/user');
// servicios 
//v53 servicio token jwt
var jwt = require('../services/jwt');
const { update, exists } = require('../models/user');

//metodo acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de ususuarios y la accion de prueba',
        //añadir el usuario que se esta autenticando en el token v54
        user: req.user

    });
}
//metodo guardar usuaruo 
function saveUser(req, res) {
    //crear objeto de usuario 
    var user = new User();

    //recoger los parametros de la peticion registar usuario 
    var params = req.body;
    //console.log(params);
    //asignar valores a usuario
    if (params.password && params.name && params.surname && params.email) {

        //asignar valores a usuario  
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        //V50 controlar usuarios duplicados 

        User.findOne({ email: user.email.toLowerCase() }, (err, issetUser) => {
            if (err) {
                res.status(500).send({ message: 'Error al comprobar el usuario' });

            } else {
                if (!issetUser) {

                    //encriptar password
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        user.password = hash;
                        //guardar usuario en base de datos 
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: 'ERRORO AL GUARDAR USUARIO' });
                            } else {
                                if (!userStored) {
                                    res.status(400).send({ message: 'No se ha registrado el usuario' });
                                } else {
                                    res.status(200).send({ user: userStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({
                        message: 'El usuario no puede registrate'
                    });
                }
            }
        });

    } else {
        res.status(200).send({
            message: 'Introduce los datos correctamente para poder registar el usuario'
        });
    }

}
// v50  metodo login 
function login(req, res) {
    //v50 comprobar los datos del usuario o si existe 
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'error al comprobar el usuario' });
        } else {
            if (user) {
                //comprobar contraseña 
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        //v53 traer el metodo token para cuando el usuario se loguee correctamente genere el token
                        //generar y comprobar token
                        if (params.gettoken) {
                            //v53 devolver token jwt
                            res.status(200).send({
                                token: jwt.crearToken(user)
                            });
                        } else {
                            res.status(200).send({ user });
                        }
                        //fin de validacion y geracion del token

                    } else {
                        res.status(404).send({
                            message: 'el usuario no ha podido loguearse correctamente'
                        });
                    }
                });

            } else {
                res.status(404).send({
                    message: 'El usuario no existe por lo cual no ha podido ingresar'
                });
            }
        }
    });


}

//v54 actualizar usuario crear netodo 
function updadateUser(req, res) {
    // recoger los datos para poder validar 
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'no tienes permiso para actualizar el usuario' })
    }
    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: "error al actualizar usuario"
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });

}
//v55 crear metodo cargar imagen del usuario 
function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'no subido...';
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            if (userId != req.user.sub) {
                return res.status(500).send({ message: 'no tienes permiso para actualizar el usuario' })
            }
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: "error al actualizar usuario"
                    });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({ user: userUpdated, image: file_name });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({ message: 'la estension no es vAlida y el fichero' });
                } else {
                    res.status(200).send({ message: 'la estension no es valida' });
                }
            });

        }
    } else {
        res.status(200).send({ message: 'No se ha subido archivos' });
    }
}

//v56 metodo devolve foto de usuario v56

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = 'uploads/users/' + imageFile;
    fs.access(path_file, (err) => {
        if (!err) {
            res.status(200).sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'File do not exists' });
        }
    });
}
function getKeepers(req, res) {
    User.find({ role:'ROLE_ADMIN' }).exec((err, users) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion' });
        } else {
            if (!users) {
                res.status(404).send({ message: 'no hay cuidadores' });
            } else {
                res.status(200).send({users});
            }
        }
    });

}
module.exports = {
    pruebas,
    saveUser,
    login,
    updadateUser,
    uploadImage,
    getImageFile,
    getKeepers
};