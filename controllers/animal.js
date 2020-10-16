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
module.exports = {
    pruebas,
    SaveAnimal,
    getAnimals,
    getAnimal
}