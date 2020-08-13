'use strict'
// crear ruta 
var exppress =require('express');
//CARGAR METODO DE USER.JS DE CONTROLADORES 
var UserController = require('../controllers/user');
const { get } = require('mongoose');
//cargar router 
var api = exppress.Router();

//crear ruta 
api.get('/pruebas-del-controlador', UserController.pruebas);
//ruta guardar usuario
api.post('/register',UserController.saveUser);

//exportar objeto de rutas 

module.exports = api;
