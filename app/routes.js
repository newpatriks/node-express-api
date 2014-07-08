module.exports = function(router, passport) {

    var User = require('./models/user');

    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });   
    });

    router.get('/status', function(req,res) {
        if (!req.user) {
            notAuthenticated(res,'/status');
        }else{
            res.json(req.user);
        }
    })

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    router.get('/login', function(req, res) {
        
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function(req, res) {
        if (!req.user) {
            notAuthenticated(res,'/logout');
        }else{
            req.logout();
            res.redirect('/');
        }
    });

    router.route('/users/:id_user')
        .get(function(req,res) {
            if (!req.user) {
                notAuthenticated(res,'/users/:id_user');
            }else{
                User.findById(req.params.id_user, function(err, user) {
                    if (err)
                        res.send(err);
                    res.json(user);
                });
            }
        })
        .put(function(req,res) {
            // UPDATE A USER
        })
        .delete(function(req,res) {
            if (!req.user) {
                notAuthenticated(res,'/users/:id_user');
            }else{
                User.remove({
                    _id : req.params.id_user
                }, function(err,user) {
                    if (err)
                        res.send(err);
                    res.json({ message : 'User deleted '});
                });
            }
        });


    router.route('/users')
        .post(function(req, res) {
            var user = new User();
            user.local.name       = req.body.name;
            user.local.email      = req.body.email;
            var password    = req.body.password;
            user.local.password   = user.generateHash(password);
            
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User created!' });
            });
        })
        
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err)
                    res.send(err);

                res.json(users);
            });
        });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email, user_likes' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/api/status',
            failureRedirect : '/'
        })
    );

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    router.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/api/status',
            failureRedirect : '/'
        }));

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // facebook -------------------------------

    // send to facebook to do the authentication
    router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email, user_likes' }));

    // handle the callback after facebook has authorized the user
    router.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/api/status',
            failureRedirect : '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    router.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/status',
            failureRedirect : '/'
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // facebook -------------------------------
    router.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/status');
        });
    });

    // twitter --------------------------------
    router.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/status');
        });
    });


    function notAuthenticated(res,action) {
        res.statusCode = 403;
        //res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"'); 
        res.json({ "code":403, "status":"error", "message":"Invalid user", "data":"" });
    }
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}