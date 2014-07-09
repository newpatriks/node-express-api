if (process.env.REDISTOGO_URL) {
    var url   = require("url").parse(process.env.OPENREDIS_URL);
    var redis = require("redis").createClient(url.port, url.hostname);
    redis.auth(url.auth.split(":")[1]);
}else{
    var redis       = require('redis');
    var url         = require('url');
    var port = 6379; 
    var host = '127.0.0.1';
    var redisClient         = redis.createClient(port, host);

    redisClient.on('error', function (err) {
        console.log('Error ' + err);
    });

    redisClient.on('connect', function () {
        console.log('----------------------------------------------');
        console.log('Redis is ready ');
        console.log("host : "+host+" @ "+port);
        console.log('----------------------------------------------');
    });
    exports.redisClient = redisClient;
}

exports.redis       = redis;
