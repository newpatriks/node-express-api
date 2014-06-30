var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var mongodbURL  = "mongodb://localhost/lockedin";
var port        = process.env.PORT || 5000;
var app         = express();
var router      = express.Router();
var uristring   = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/lockedin';

var User = require('./models/lockedin');

mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log("ERROR MONGODB");
    }else{
        console.log("SUCCEEDED CONNECTING MONGODB");
    }
});

// ROUTES
router.use(function(req,res,next) {
    // Before the post/get call always will run this way
    next();
})

router.get('/', function(req,res) {
    res.send({ 'version' : '0.0.1' });
});


router.route('/users')
    .post(function(req,res) {
        var user = new User();
        user.name = req.body.name;
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message : 'User created' });
        });
    })
    .get(function(req,res) {
        User.find(function(err,users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

// STARTUP SERVER
app.use('/api', router);
app.listen(port, function() {
    console.log("Listening on port number: ", port);
});