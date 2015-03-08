var db              = require('../config/mongo_db');
var jwt             = require('jsonwebtoken');
var secret          = require('../config/secret');
var redisClient     = require('../config/redis_db').redisClient;
var tokenManager    = require('../config/token_manager');

var app             = require('../app');

exports.register = function(req, res) {
    console.log(" - Register ");    
    // GET THE INFORMATION
    var sn = req.body.social;
    switch(sn) {
        case 'instagram':
            console.log("   · Using INSTAGRAM LOGIN");
            var info    = req.body[sn];
            // 1. CHECK DE [EMAIL] AND [SOCIAL]
            if (info) {
                db.userModel.findOne({ 'instagram.screen_name' : info.screen_name}, function(err, user) {
                    if (err)
                        return res.send(401, {message : err});
                    if (!user) {
                        // 2.1. IF !EXIST (IT'S NEW)
                        // 2.1.1. REGISTER
                        var user = new db.userModel();
                        var seen = [];
                        JSON.stringify(info, function(key, val) {
                            if (val != null && typeof val == "object") {
                                if (seen.indexOf(val) >= 0)
                                    return
                                seen.push(val)
                            }
                            return val;
                        });
                        user[sn] = seen[0];

                        user.preferences.image          = user[sn].profile_image_url;
                        user.preferences.description    = user[sn].description;
                        user.preferences.name           = user[sn].name;

                        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                        user.access_token = token;
                        user.save();
                        // 2.1.2. CREATE & RETURN TOKEN
                        return res.send(200, { token : token });
                    }
                    if (user) {
                        console.log(".........This user already exist");
                        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                        db.userModel.update({ 'instagram.screen_name' : info.screen_name }, {'access_token' : token, 'online' : true}, function(err, result) {
                            if (err) {
                                console.log('Error updating: ' + err);
                                //res.send({'error':'An error has occurred'});
                            } else {
                                console.log('' + result + ' document(s) updated');
                                //res.send(user);
                            }
                        });
                        return res.send(200, { token : token });
                    }
                });
            }else{
                return res.send(400, { message : "The information needs to be in a proper scheme" });
            }
            break;

        default:
            return res.send(400, { message : "You need to log in with some social network" });
    }
}

exports.update = function(req, res) {
    db.userModel.update({ '_id' : req.body._id }, { 'preferences' : req.body.preferences } , function(err, result) {
        if (err)
           return res.send(401, { message : err }); 

        return res.send(200, {message : result});
    });
}

exports.refresh_token = function(req, res) {
    if (tokenManager.getToken(req.headers)) {
        db.userModel.findOne({ 'access_token' : tokenManager.getToken(req.headers) }, function(err, user) {
            if (err)
                return res.send(401, { message : err });
            if (!user) {
                return res.send(400, { message : "This user doesn't exist" });
            }

            var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
            db.userModel.update({ '_id' : user._id},  { 'access_token' : token } , function(err, result) {
                if (err)
                    return res.send(401, { message : err });

                return res.send(200, { token : token });
            });
        });
    }else{
        return res.send(401, { message : err });        
    }
}

exports.preferences = function(req, res) {
    db.userModel.findOne({ 'access_token' : tokenManager.getToken(req.headers)}, function(err, user) {
        if (err)
            return res.send(401, {message : err});
        
        if (!user) {
            return res.send(400, { message : "You need to log in first" });
        }

        return res.send(200, { data : user.preferences });
    });
}

exports.onlineUpdate = function(req, res) {
    var value = req.body.online; // Bolean
    db.userModel.update({ 'access_token' : tokenManager.getToken(req.headers)}, { 'online' : value } , function(err, result) {
        if (err)
           return res.send(401, { message : err }); 

        return res.send(200, {message : result});
    });   
}

exports.merge = function(req, res) {
    console.log("Merge...");
    console.log("------------------------------------------------");
    var sn      = req.body.social;
    var info    = req.body[sn];
    db.userModel.findOne({ 'access_token' : tokenManager.getToken(req.headers)}, function(err, user) {
        if (err)
            return res.send(401, {message : err});
        
        if (!user) {
            return res.send(400, { message : "You need to log in first" });
        }
        
        if (user) {
            var seen = [];
            JSON.stringify(info, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0)
                        return
                    seen.push(val)
                }
                return val;
            });
            user[sn] = seen[0];
            user.save();
            return res.send(200, { data : user });
        }
    });    

}

exports.status = function(req, res) {
    db.userModel.findOne({ 'access_token' : tokenManager.getToken(req.headers) }, function(err, user) {
        if (err) {
            console.log();
            return res.send(401, { message : err });
        }
        if (!user) {
            return res.send(400, { message : "You've to be logged in" });
        }
        if (user) {
            return res.send(200, { data : user });
        }
    }); 
}

exports.logout = function(req, res) {
    db.userModel.update({ 'access_token' : tokenManager.getToken(req.headers) }, {'online' : false}, function(err, result) { 
        if (err)
           return res.send(401, { message : err }); 

        tokenManager.expireToken(req.headers);
        return res.send(200);
    });
}

exports.remove = function(req, res) {
    db.userModel.remove({ 'access_token' : tokenManager.getToken(req.headers)}, function(err, result) {
        if (err)
            return res.send(401, { message : err });
        
        tokenManager.expireToken(req.headers);
        return res.send(200);
    });    
}

exports.listAll = function(req, res) {
    var nPerPage = 3;
    var pageNumber = req.params.numpage;

    if (!req.user) 
        return res.send(401, { message : "You need to be Logged to do call this petition" });

    var query = db.userModel.find({ 'online' : true }).skip( (pageNumber-1)*nPerPage ).limit(nPerPage);
    //query.sort('-created');
    
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

        if (results)         
            return res.json(200, { data : results });
    });
};

exports.listAllNumber = function(req, res) {
    var query = db.userModel.find({ 'online' : true }).count();
    query.exec(function(err, results) {
        if (err) {
            console.log(err);
            return res.send(400, { message : "Seems to be something wrong in the information" });
        }
        return res.json(200, { data : results });
    });
};