// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '244491825745560', // your App ID
        'clientSecret'  : '99c59bac87376b2e32048ccdd69d7e98', // your App Secret
        'callbackURL'   : 'http://localhost:5000/api/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:5000/api/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:5000/api/auth/google/callback'
    }

};

