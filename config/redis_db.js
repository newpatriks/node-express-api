var redis       = require('redis');
var redisPort   = 10118;
var heroku = [];

if (process.env.REDISTOGO_URL) {
    // use production (Heroku) redis configuration
    // overwrite config to keep it simple
    var rtg             = require('url').parse(process.env.REDISTOGO_URL);
    heroku.port         = rtg.port;
    heroku.host         = rtg.hostname;
    heroku.password     = rtg.auth.split(':')[1];
}

var port = heroku.port || ''; 
var host = heroku.host || '';
var redisClient = redis.createClient(port, host);

redisClient.on('error', function (err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready');
});

