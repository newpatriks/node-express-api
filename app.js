var express           = require('express');
var app               = express();
var port              = process.env.PORT || 5000;
var jwt               = require('express-jwt');
var bodyParser        = require('body-parser');
var morgan            = require('morgan');
var tokenManager      = require('./config/token_manager');
var secret            = require('./config/secret');

var allowCrossDomain  = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

if ('development' == app.get('env')) {
  app.use(allowCrossDomain);
  app.use(bodyParser());
  app.use(morgan());
}

// STARTUP SERVER
app.listen(port);  
var routes      = {};
routes.users    = require('./route/users.js');


// CALLS
app.post('/user', routes.users.register);
app.delete('/user', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.remove);
app.get('/user', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.status);

app.post('/user/merge', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.merge);
app.post('/user/logout', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.logout);

app.get('/users/all', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.listAll);
