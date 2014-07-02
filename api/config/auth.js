// expose our config directly to our application using module.exports
module.exports = function(url){

    return {
        'facebookAuth' : {
            'clientID'      : '244491825745560', // your App ID
            'clientSecret'  : '99c59bac87376b2e32048ccdd69d7e98', // your App Secret
            'callbackURL'   : url+'/api/auth/facebook/callback'
        },

        'twitterAuth' : {
            'consumerKey'   : 'XU0grp4YAhriQikdLk6nfL4qs',
            'consumerSecret': 'XiKiOtGgCYN5mHgC9vVrozq6A2383pzETCcLaWLos7TfKrljUw',
            'callbackURL'   : url+'/api/auth/twitter/callback'
        },

        'googleAuth' : {
            'clientID'      : 'your-secret-clientID-here',
            'clientSecret'  : 'your-client-secret-here',
            'callbackURL'   : url+'/api/auth/google/callback'
        }
    }
};

