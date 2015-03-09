var mongoose            = require('mongoose');
var bcrypt              = require('bcrypt');
var SALT_WORK_FACTOR    = 10;
var mongodbURL          = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/instagraph';
var mongodbOptions      = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('...Mongo is ready');
    }
});

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
    access_token    : String,
    online          : { type: Boolean, default: true },
    advice_accepted : { type: Boolean, default: false },
    info       : Object,
    preferences     : {
        image           : String,
        description     : String,
        name            : String,
        is_dj           : { type: Boolean,'default': false },
        initials        : String,
        latitude        : { type: String, 'default': ''},
        longitude       : { type: String, 'default': ''}
    },
    creationDate    : { type: Date, 'default':Date.now }
});

//Define Models
var userModel = mongoose.model('User', User);

// Export Models
exports.userModel = userModel;