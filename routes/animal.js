'use strict'
var express = require('express');
var AnimalController = require('../controllers/animal');

//cargar api angular 
var api = express.Router();
var md_auth = require('../middlewares/authenticaded');
var multipart = require('connect-multiparty');
//v55 crera ruta donde se guardara las imagenes
var md_upload = multipart({uploadDir:'./uploads/animal'});


api.get('/pruebas-animales',md_auth.ensureAuth, AnimalController.pruebas);
//metodo guardar animal 
api.post('/animal',md_auth.ensureAuth, AnimalController.SaveAnimal);
//metodo listar animal
api.get('/animals',AnimalController.getAnimals);
//metodo listar animal unico 
api.get('/animal/:id',AnimalController.getAnimal);
//metodo actualizar animal 
api.put('/animal/:id',md_auth.ensureAuth,AnimalController.updateAnimal);

api.post('/upload-image-animal/:id',[md_auth.ensureAuth,md_upload],AnimalController.uploadImage);
//v56 ruta devolver imagen usuario 
api.get('/get-image-animal/:imageFile',AnimalController.getImageFile);


module.exports = api;
