module.exports = function(router, passport) {

    var User = require('./models/user');

    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });   
    });

    router.get('/status', function(req,res) {
        res.json(req.user);
    })

    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.route('/users/:id_user')
        .get(function(req,res) {
            User.findById(req.params.id_user, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })
        .put(function(req,res) {
            // UPDATE A USER
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
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/api/status',
            failureRedirect : '/'
        })
    );

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
