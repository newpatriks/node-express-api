var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var ObjectId    = Schema.ObjectId;
var bcrypt      = require('bcrypt-nodejs');

var userSchema = new Schema({
    local       : {
        name        : String,
        email       : String,
        password    : String
    },
    facebook    : {
        id          : String,
        token       : String,
        email       : String,
        name        : String,
        likes       : [Schema.Types.ObjectId]
    },
    twitter     : {
        id          : String,
        token       : String,
        displayName : String,
        username    : String
    },
    google      : {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    },
    access_token    : String,
    creationDate    : { type: Date, 'default':Date.now }
});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);