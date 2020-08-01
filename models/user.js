'user strict'
var moongose = require('mongoose');
var Schema = moongose.Schema;

var UserSchema = Schema({

});

module.exports = moongose.model (User, UserSchema);