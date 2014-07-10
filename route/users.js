var db              = require('../config/mongo_db');
var jwt             = require('jsonwebtoken');
var secret          = require('../config/secret');
var redisClient     = require('../config/redis_db').redisClient;
var tokenManager    = require('../config/token_manager');


exports.register = function(req, res) {
    console.log("Register...");
    console.log("------------------------------------------------");
    
    // GET THE INFORMATION
    var sn = req.body.social || '';
    switch(sn) {

        case 'facebook':
            console.log("FB Login");
            var info    = req.body[sn] || '';
            // 1. CHECK DE [EMAIL] AND [SOCIAL]
                if (info) {
                    db.userModel.findOne({ 'facebook.email' : info.email}, function(err, user) {
                        if (err)
                            return res.send(401, {message : err});
                        if (!user) {
                        // 2.1. IF !EXIST (IT'S NEW)
                            // 2.1.1. REGISTER
                            var user = new db.userModel();
                            var seen = {};
                            JSON.stringify(info, function(key, val) {
                                if (val != null && typeof val == "object") {
                                    if (seen.indexOf(val) >= 0)
                                        return
                                    seen.push(val)
                                }
                                return val;
                            });
                            user[sn] = seen;
                            var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                            user.access_token = token;
                            user.save();
                            // 2.1.2. CREATE & RETURN TOKEN
                            return res.send(200, { token : token });
                        }
                        if (user) {
                            console.log(".........This userr already exist");
                            var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                            user.access_token = token;
                            user.save();
                            return res.send(200, { token : token });
                        }
                    });
                }else{
                    return res.send(400, { message : "The information needs to be in a proper scheme" });
                }
            break;

        case 'tw':
            console.log("TW Login");
            break;

        case 'g+':
            console.log("G+ Login");
            break;

        case 'bbc':
            console.log("BBC Login");
            break;
    }
}



exports.listAll = function(req, res) {
    console.log("List All --------------");
    if (!req.user) 
        return res.send(401, { message : "You need to be Logged to do call this petition" });

    var query = db.userModel.find();
    query.sort('-created');
    query.exec(function(err, results) {
        if (err) {
            console.log(err);
            return res.send(400, { message : "Seems to be something wrong in the information" });
        }
        /*
        for (var postKey in results) {
            results[postKey].content = results[postKey].content.substr(0, 400);
        }
        */
        return res.json(200, results);
    });
};