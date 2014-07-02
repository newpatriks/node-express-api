var express     = require('express');
var app         = express();
var port        = process.env.PORT || 5000;
var mongoose    = require('mongoose');
var passport    = require('passport');
var router      = express.Router();
var flash       = require('connect-flash');

var morgan      = require('morgan');
var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var session     = require('express-session');

var uristring   = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/lockedin';
mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log("ERROR MONGODB");
    }else{
        console.log("SUCCEEDED CONNECTING MONGODB");
    }
});
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.set('view engine', 'ejs');

app.use(session({ secret : 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// ROUTES
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
require('./app/routes.js')(router, passport);


// STARTUP SERVER
app.use('/', router);
app.listen(port, function() {
    console.log("Listening on port number: ", port);
});