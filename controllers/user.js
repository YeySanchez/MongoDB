'use strict'
//metodo 
function pruebas (req, res){
    res.status(200).send({
        message: 'Probando el controlador de ususuarios y la accion de prueba'

    });
} module.exports= {
    pruebas
};