'use strict'
var express = require('express');
var AnimalController = require('../controllers/animal');

//cargar api angular 
var api = express.Router();
var md_auth = require('../middlewares/authenticaded');
//v63 ruta devolver imagen animal 
var multipart = require('connect-multiparty');
//v63 cargar imagenb  imagen animal 
var md_upload = multipart({uploadDir:'./uploads/animal'});
//64 middleware animal
var md_admin = require('../middlewares/is_admin');

api.get('/pruebas-animales',md_auth.ensureAuth, AnimalController.pruebas);
//metodo guardar animal 
api.post('/animal',[md_auth.ensureAuth,md_admin.isAdmin], AnimalController.SaveAnimal);
//metodo listar animal
api.get('/animals',AnimalController.getAnimals);
//metodo listar animal unico 
api.get('/animal/:id',AnimalController.getAnimal);
//metodo actualizar animal 
api.put('/animal/:id',[md_auth.ensureAuth,md_admin.isAdmin],AnimalController.updateAnimal);
//v63 ruta devolver imagen animal 
api.post('/upload-image-animal/:id',[md_auth.ensureAuth,md_admin.isAdmin,md_upload],AnimalController.uploadImage);
//v63 cargar imagenb  imagen animal 
api.get('/get-image-animal/:imageFile',AnimalController.getImageFile);
//v64 eliminar animal
api.delete('/animal/:id',[md_auth.ensureAuth,md_admin.isAdmin], AnimalController.deleteAnimal);

module.exports = api;
