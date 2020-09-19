'use strict'
// crear ruta 
var exppress =require('express');
//CARGAR METODO DE USER.JS DE CONTROLADORES 
var UserController = require('../controllers/user');
const { get } = require('mongoose');
//cargar router 
var api = exppress.Router();
//v54 cargar ruta del middleware
var md_auth = require('../middlewares/authenticaded')
//v55 cargar libreria middleware que nos perminte cargar archivos 
var multipart = require('connect-multiparty');
//v55 crera ruta donde se guardara las imagenes
var md_upload = multipart({uploadDir:'./uploads/users'});
//crear ruta 
//v54 para agregar la propiedad middleeare la agregamos con lavariable y 
//el metoto creado ejemplo md_auth.ensureAuth
api.get('/pruebas-del-controlador',md_auth.ensureAuth, UserController.pruebas);
//ruta guardar usuario
api.post('/register',UserController.saveUser);
//v50 ruta login 
api.post('/login',UserController.login);
//v54 update user
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updadateUser);
 //v55 uploadImage
 api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);


//exportar objeto de rutas 

module.exports = api;
