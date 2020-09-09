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
//crear ruta 
//v54 para agregar la propiedad middleeare la agregamos con lavariable y 
//el metoto creado ejemplo md_auth.ensureAuth
api.get('/pruebas-del-controlador',md_auth.ensureAuth, UserController.pruebas);
//ruta guardar usuario
api.post('/register',UserController.saveUser);
//v50 ruta login 
api.post('/login',UserController.login);

//exportar objeto de rutas 

module.exports = api;
