if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]);
}else{
    var redis = require("redis").createClient();
}

redis.on('error', function (err) {
    console.log('Error ' + err);
});

redis.on('connect', function () {
    console.log('\n----------------------------------------------');
    console.log('Redis is ready ');
    //console.log("       host : "+host+" @ "+port);
    console.log('----------------------------------------------');
});

exports.redis       = redis;