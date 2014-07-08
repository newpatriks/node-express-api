// load all the things we need
var fbStrategy      = require("passport-facebook").Strategy;
var twStrategy      = require('passport-twitter').Strategy;
var BearerStrategy  = require('passport-http-bearer').Strategy;
var moment          = require('moment');

// load up the user model
var User            = require('../app/models/user');

// load the auth variables
var url             = process.env.APP_URI || 'http://localhost:5000';
var configAuth      = require('./auth')(url);

// expose this function to our app using module.exports
module.exports = function(passport, router, app, jwt) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(token, done) {
        User.findOne( {access_token : token}, function(err, user) {
            done(err, user);
        });
    });


    passport.use('bearer',new BearerStrategy(function(token, done) {
        process.nextTick(function() {
            User.findOne({ 'access_token' : token }, function(err, user) {
                if(err) {
                    return done(err);
                }
                if(!user) {
                    return done(null, false);
                }

                return done(null, token);
            });
        });
    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new fbStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true

    },

    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return res.send(401);

                    // if the user is found, then log them in
                    if (user) {
                        user.access_token = token;
                        user.save(function(err,doc) {
                            done(err, doc);
                        });
                        
                        //return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // Copy all the attributes to the model
                        var seen = [];
                        JSON.stringify(profile, function(key, val) {
                            if (val != null && typeof val == "object") {
                                if (seen.indexOf(val) >= 0)
                                    return
                                seen.push(val)
                            }
                            return val
                        });
                        newUser.facebook = seen;
                        newUser.access_token = token;

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });

            }else{
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                // update the current users facebook credentials
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));


    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new twStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true

    },
    function(req, token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();

                        // set all of the user data that we need
                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        // save our user into the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            }else{
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                // set all of the user data that we need
                user.twitter.id          = profile.id;
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.twitter.displayName = profile.displayName;

                // save our user into the database
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });

    }));
};