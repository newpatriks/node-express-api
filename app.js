var express     = require('express');
var app         = express();
var port        = process.env.PORT || 5000;
var jwt         = require('express-jwt');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var tokenManager= require('./config/token_manager');
var secret      = require('./config/secret');


// STARTUP SERVER
app.listen(port);
app.use(bodyParser());
app.use(morgan());

var routes      = {};
routes.users    = require('./route/users.js');


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  next();
});


app.post('/user/register', routes.users.register);
app.get('/users/all', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.listAll);