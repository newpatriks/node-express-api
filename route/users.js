var db              = require('../config/mongo_db');
var jwt             = require('jsonwebtoken');
var secret          = require('../config/secret');
var redisClient     = require('../config/redis_db').redisClient;
var tokenManager    = require('../config/token_manager');


exports.register = function(req, res) {
    console.log("Register...");
    console.log("------------------------------------------------");
    
    // GET THE INFORMATION
    var sn      = req.body.social || '';

    /*
    console.log("info ------------------");
    console.log(info);

    console.log("sn --------------------");
    console.log(sn);
    */

    var info    = req.body[sn] || '';
    if (info.token) {
        // RECEIVING [ACCESS_TOKEN] => MERGE ACCOUNTS [EMAIL] [SOCIAL]
    }else{
        // !RECEIVING [ACCESS_TOKEN] 

        if (existIn(sn, info.email)) {
            // USER ALREADY EXISTS

        }else{
            // USER DOESN'T EXISTS

        }
    }



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
                            // 2.2. IF EXIST
                            if (info.token) {
                                // 2.2.1. RECEIVING [ACCESS_TOKEN] => MERGE ACCOUNTS [EMAIL] [SOCIAL]

                            }else{
                                
                            }
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

    existIn : function(sn, email) {
        switch(sn) {
            case 'facebook':
                db.userModel.findOne({ 'facebook.email' : email}, function(err, user) {
                    if (user)
                        return true
                    if (!user)
                        return false
                    if (err)
                        return false
                }
                break;
            case 'twitter':
                db.userModel.findOne({ 'twitter.email' : email}, function(err, user) {
                    if (user)
                        return true
                    if (!user)
                        return false
                    if (err)
                        return false
                }
                break;
            case 'instagram':
                db.userModel.findOne({ 'instagram.email' : email}, function(err, user) {
                    if (user)
                        return true
                    if (!user)
                        return false
                    if (err)
                        return false
                }
                break;
            case 'google':
                db.userModel.findOne({ 'google.email' : email}, function(err, user) {
                    if (user)
                        return true
                    if (!user)
                        return false
                    if (err)
                        return false
                }
                break;

        }   
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