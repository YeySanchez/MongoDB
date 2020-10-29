'use strict'
//modelos
var fs = require('fs');
var path = require('path');
//modelos 
var User = require('../models/user');
var Animal = require('../models/animal');
const animal = require('../models/animal');

//acciones 
function pruebas(req, res) {
    res.status(200).send({
        message: 'probando el contolador de animales y la accion de pruebas ',
        user: req.user
    });
}

function SaveAnimal(req, res) {
    //v59 inicio metodo guardar aninal 
    var animal = new Animal();

    var params = req.body;
    if (params.name) {
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;
        //metodo save de mongodb
        animal.save((err, AnimalStored) => {
            if (err) {
                res.status(500).send({ message: 'error en el servidor' }); 0
            } else {
                if (!AnimalStored) {
                    res.status(404).send({ message: 'No se ha guardado animal ' });

                } else {
                    res.status(200).send({ animal: AnimalStored });
                }
            }

        });

    } else {
        res.status(200).send({
            message: 'el nombre del animal es obligatorio'
        })
    }
}
//v59 fin metodo guardar animal 
function getAnimals(req, res) {
    Animal.find({}).populate({ path: 'user' }).exec((err, animals) => {
        if (err) {
            res.status(500).send({
                message: 'error en la peticion'
            });
        }else{
            if(!animals){
                res.status(404).send({
                    message:'No hay animales'
                });
            }else{
                res.status(200).send({
                    animals
                });
            }
        }
    });
}
function getAnimal(req,res){
    var animalid =req.params.id;
    Animal.findById(animalid).populate({path:'user'}).exec((err,animal)=>{
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!animal){
                res.status(404).send({
                    message:'el animal no existe'
                });
            }else{
                res.status(200).send({
                    animal
                });
            }
        }

    });
}
function updateAnimal(req, res){
    var animalId = req.params.id;
    var update = req.body;
Animal.findByIdAndUpdate(animalId,update,{new:true},(err, animalUpdated) =>{
if(err){
    res.status(500).send({
        message: 'Error en la peticion'
    });
}else{
    if(!animalUpdated){
        res.status(404).send({
            message:'No se ha actualizado animal'
        });
    }else{
        res.status(200).send({
            animal: animalUpdated
        });
    }
}

});


}
function uploadImage(req, res) {
    var animalId = req.params.id;
    var file_name = 'no subido...';
    if (req.files.image) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            
            Animal.findByIdAndUpdate(animalId, { image: file_name }, { new: true }, (err, animalUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: "error al actualizar usuario"
                    });
                } else {
                    if (!animalUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar el animal' });
                    } else {
                        res.status(200).send({ animal:animalUpdated, image: file_name });
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
    var path_file = 'uploads/animal/' + imageFile;
    fs.access(path_file, (err) => {
        if (!err) {
            res.status(200).sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'File do not exists' });
        }
    });
}

module.exports = {
    pruebas,
    SaveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    getImageFile,
    uploadImage
}