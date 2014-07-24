var express           = require('express');
var app               = express();
var port              = process.env.PORT || 3000;
var jwt               = require('express-jwt');
var bodyParser        = require('body-parser');
var morgan            = require('morgan');
var tokenManager      = require('./config/token_manager');
var secret            = require('./config/secret');
var server            = require('http').Server(app);
var io                = require('socket.io')(server);

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


/*
io.on('connection', function(socket){
  socket.emit('connected', { status: 'Hi there' });
  socket.on('spacebar', function (data) {
    console.log(data);
  });
});
server.listen(3000);
*/


// CALLS
app.post('/user', routes.users.register);                                                                           // Creates a new user
app.put('/user', routes.users.update);                                                                              // Update the user
app.delete('/user', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.remove);              // Remove that user from the db
app.get('/user', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.status);                 // Returns the information about the current user

app.put('/user/online', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.onlineUpdate);     // Will put the user as online / offline
app.get('/user/preferences', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.preferences); // Returns the information about the current user
app.post('/user/reftoken', routes.users.refresh_token);                                                               // Returns the information about the current user

app.post('/user/merge', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.merge);           // Marge accounts with current account
app.post('/user/logout', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.logout);         // Logout the user

app.get('/users/all/:numpage', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.listAll);  // Return the users connected separated by pages
app.get('/users/number', routes.users.listAllNumber);                                                               // Return the number of users connected

app.post('/shoutout', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.send_shoutout);  
app.get('/shoutout', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.shoutouts);  
