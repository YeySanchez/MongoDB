'use strict'
var moongose = require('mongoose');
var Schema = moongose.Schema;

var AnimalShema =Schema({
    name: String,
    description: String,
    year: Number,
    image: String,
    user: {type: Schema.ObjectId, ref: 'User'}

});

module.exports =moongose.model('Animal',AnimalShema);