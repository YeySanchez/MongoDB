'use strict'
var express = require('express');
var AnimalController = require('../controllers/animal');

//cargar api angular 
var api = express.Router();
var md_auth = require('../middlewares/authenticaded');


api.get('/pruebas-animales',md_auth.ensureAuth, AnimalController.pruebas);
//metodo guardar animal 
api.post('/animal',md_auth.ensureAuth, AnimalController.SaveAnimal);
//metodo listar animal
api.get('/animals',AnimalController.getAnimals);


module.exports = api;
