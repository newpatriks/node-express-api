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
            var info    = req.body[sn];
            // 1. CHECK DE [EMAIL] AND [SOCIAL]
            if (info) {
                db.userModel.findOne({ 'facebook.email' : info.email}, function(err, user) {
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

                        user.preferences.image = user[sn].picture;
                        user.preferences.description = '';

                        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                        user.access_token = token;
                        user.save();
                        // 2.1.2. CREATE & RETURN TOKEN
                        
                        return res.send(200, { token : token });
                    }
                    if (user) {
                        console.log(".........This user already exist");
                        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                        db.userModel.update({ 'facebook.email' : info.email }, {'access_token' : token}, function(err, result) {
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

        case 'twitter':
            console.log("TW Login");
            var info    = req.body[sn];
            // 1. CHECK DE [EMAIL] AND [SOCIAL]
            if (info) {
                db.userModel.findOne({ 'twitter.email' : info.email}, function(err, user) {
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

                        user.preferences.image = user[sn].profile_img_url;
                        user.preferences.description = user[sn].description;
                        
                        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                        user.access_token = token;
                        user.save();
                        // 2.1.2. CREATE & RETURN TOKEN
                        return res.send(200, { token : token });
                    }
                    if (user) {
                        console.log(".........This user already exist");
                        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                        db.userModel.update({ 'twitter.email' : info.email }, {'access_token' : token, 'twitter.status.text' : info.status.text }, function(err, result) {
                            if (err) {
                                console.log('Error updating: ' + err);
                                //res.send({'error':'An error has occurred'});
                            } else {
                                console.log('' + result + ' document(s) updated');
                                //res.send(user);
                            }
                        });
                        res.status(200);
                        res.send({ token : token });
                        return res;
                    }
                });
            }else{
                return res.send(400, { message : "The information needs to be in a proper scheme" });
            }
            break;

        case 'g+':
            console.log("G+ Login");
            break;

        case 'instagram':

            console.log("Instagram Login");
            var info    = req.body[sn];
            // 1. CHECK DE [EMAIL] AND [SOCIAL]
            if (info) {
                db.userModel.findOne({ 'instagram.email' : info.email}, function(err, user) {
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
                        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                        user.access_token = token;
                        user.save();
                        // 2.1.2. CREATE & RETURN TOKEN
                        return res.send(200, { token : token });
                    }
                    if (user) {
                        console.log(".........This user already exist");
                        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                        db.userModel.update({ 'instagram.email' : info.email }, {'access_token' : token}, function(err, result) {
                            if (err) {
                                console.log('Error updating: ' + err);
                                //res.send({'error':'An error has occurred'});
                            } else {
                                console.log('' + result + ' document(s) updated');
                                //res.send(user);
                            }
                        });
                        res.status(200);
                        res.send({ token : token });
                        return res;
                    }
                });
            }else{
                return res.send(400, { message : "The information needs to be in a proper scheme" });
            }
            break;

        case 'bbc':
            console.log("BBC Login");
            break;

        default:
            return res.send(400, { message : "You need to log in with some social network" });
    }
}

exports.update = function(req, res) {
    db.userModel.update({ '_id' : req.body._id }, { 'preferences' : req.preferences } , function(err, result) {
        if (err)
           return res.send(401, { message : err }); 

        return res.send(200, {message : result});
    });
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

        return res.send(200);
    });
}

exports.remove = function(req, res) {
    db.userModel.remove({ 'access_token' : tokenManager.getToken(req.headers)}, function(err, result) {
        if (err)
            return res.send(401, { message : err });
        
        return res.send(200);
    });    
}

exports.listAll = function(req, res) {
    var nPerPage = 15;
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

exports.send_shoutout = function(req, res) {
    // Save at receiver of the shout out
    var id_r = req.body.id;
    var id_s;

    // Save at the emiter of the shout out.
    db.userModel.update({ 'access_token' : tokenManager.getToken(req.headers)}, { $addToSet: { 'shoutouts_s': id_r }}, function(err, result) {
        if (err) {
            console.log(err);
            return res.send(400, { message : "Some error occurred updating the shout outs." });  
        }

        db.userModel.findOne({ 'access_token' : tokenManager.getToken(req.headers) }, function(err, result) {
            id_s = result._id;
            
            db.userModel.update({ _id : id_r }, { $addToSet: { 'shoutouts_r': id_s }}, function(err, result) {
                if (err) {
                    console.log(err);
                    return res.send(400, { message : "Some error occurred updating the shout outs." });
                }
                return res.json(200);
            });    
        });
    });
};

exports.shoutouts = function(req, res) {
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
};