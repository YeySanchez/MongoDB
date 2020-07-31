'use strict'

var mongoose = require('mongoose');
//configuracion del puerto y la conexion del modulo app.js
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/zoo', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()  => {
    
        console.log('La conexion con la base de datos zoo se ha realizado correctamente...');
        // app listen nos pertie crear un servidor web 
        app.listen(port, () => {
        console.log('el servidor local con Node y Exprees  esta corriendo correctamente ...')

        });
    
    })
    .catch(err => console.log(err));
