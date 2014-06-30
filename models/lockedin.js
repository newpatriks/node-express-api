var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var ObjectId    = Schema.ObjectId;

var userSchema = new Schema({
    name            : {type: String, 'default' : ''},
    creationDate    : {type: Date, 'default':Date.now}
});

module.exports = mongoose.model( 'User', userSchema );