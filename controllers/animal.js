'use strict'
//modelos
var fs = require('fs');
var path = require('path');
//modelos 
var User = require ('../models/user');
var Animal = require('../models/animal');

//acciones 
function pruebas (req,res){
    res.status(200).send({
        message:'probando el contolador de animales y la accion de pruebas ',
        user: req.user
    })
}
module.exports={
    pruebas
}