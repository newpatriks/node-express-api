var express     = require('express');
var app         = express();
var port        = process.env.PORT || 5000;
var jwt         = require('express-jwt');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

// STARTUP SERVER
app.listen(port);
app.use(bodyParser());
app.use(morgan());

var routes      = {};
routes.users    = require('./app/routes.js');


app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost');
  res.set('Access-Control-Allow-Origin', 'http://jsfiddle.net/');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

app.post('/user/register', routes.users.register);

/*
var express     = require('express');
var app         = express();
var port        = process.env.PORT || 5000;
var mongoose    = require('mongoose');
var passport    = require('passport');
var flash       = require('connect-flash');
var jwt         = require('jwt-simple');
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
//require('./config/passport')(passport, router, app, jwt);

var routes = {};
routes.users = requre('./route/users.')


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.set('jwtTokenSecret', 'k3ntly0n5rulz');
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


app.post('/user/register', routes.users.register); 


// STARTUP SERVER
app.use('/api', router);
app.listen(port, function() {
    console.log("Listening on port number: ", port);
});
*/