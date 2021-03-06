'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app =express();

//caragar rutas 
//rutas user.js

var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');
const animal = require('./controllers/animal');

//middlewares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//congifuras cabeceras y cors 

//rutas body-parser
//usar ruta user.js
app.use('/api',user_routes);
//usar ruta animal.js
app.use('/api',animal_routes);

app.get('/probando', (req,res) =>{
    res.status(200).send({message: 'Este es el metodo probando'
});

});
module.exports = app;