var mongoose            = require('mongoose');
var bcrypt              = require('bcrypt');
var SALT_WORK_FACTOR    = 10;
var mongodbURL          = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/lockedin';
var mongodbOptions      = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('----------------------------------------------');
        console.log('MongoDB is ready');
        console.log("host : "+mongodbURL);
        console.log('----------------------------------------------');
    }
});

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
    local       : {
        name        : String,
        email       : String,
        password    : String
    },
    facebook    : {
        id          : String,
        token       : String,
        email       : String,
        name        : String
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
    is_dj           : { type: Boolean, default: false },
    access_token    : String,
    creationDate    : { type: Date, 'default':Date.now }
});

//Define Models
var userModel = mongoose.model('User', User);

// Export Models
exports.userModel = userModel;