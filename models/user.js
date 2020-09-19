'user strict'
var moongose = require('mongoose');
var Schema = moongose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    image:String,
    password: String,
    role: String,


});

module.exports = moongose.model ('User', UserSchema);