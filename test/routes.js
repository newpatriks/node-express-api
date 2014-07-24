var should      = require('should');
var assert      = require('assert');
var request     = require('supertest');
var mongoose    = require('mongoose');
var db          = require('../config/mongo_db');

var url     = 'http://localhost:5000';
//var url     = 'http://lockedin.kentlyons.com/';

describe('User system', function() {
    var token   = '';
    before(function(done) {
        while (!db.userModel) {

        }
        done();
    });
    describe('When no-Authorized', function() {
        var response;
        beforeEach(function (done) {
            var profile = {
                social : 'facebook',
                token : token,
                facebook : {
                    name: 'test',
                    email: 'test@lockedin.com'
                },
                twitter : {},
                instagram : {}
            };
            request(url)
                .get('/users/all/1')
                .send(profile)
                .end(function (req,res) {
                    response = res;
                    done();
                });
        });
        it('Should return a 401 http code to the "protected" calls', function(done) {
            (response.status).should.be.exactly(401);
            done();
        });
    });
    describe('Register', function() {
        it('Should return 200 when we create a user | Facebook profile', function(done) {
            var profile = {
                social : 'facebook',
                token : '',
                facebook: {
                    "email": "test@lockedin.com",
                    "first_name": "Test",
                    "gender": "male",
                    "id": "10154355075120086",
                    "last_name": "Test",
                    "link": "https://www.facebook.com/app_scoped_user_id/id_test/",
                    "locale": "en_UK",
                    "name": "Test Lockedin",
                    "picture": "http://graph.facebook.com/id_test/picture",
                    "thumbnail": "http://graph.facebook.com/id_test/picture",
                    "timezone": "1",
                    "updated_time": "2014-02-08T16:31:07+0000",
                    "verified": "true",
                    "music": {
                        "data": [
                            {
                                "category": "Musician/band",
                                "created_time" : "2013-03-25T18:02:40+0000",
                                "id": "99636325744",
                                "name": "Django Django"
                            },
                            {
                                "category": "Musician/band",
                                "created_time" : "2014-07-25T18:02:40+0000",
                                "id": "99636325744",
                                "name": "Django Django"
                            }
                        ]
                    }
                },
                twitter : {},
                instagram : {}
            };
        request(url)
            .post('/user')
            .send(profile)
            .end(function(err, res) {
                if (err)
                    throw err;
                // The method [res.should.have.status(200)] doesn't work properly
                (res.status).should.be.exactly(200);
                done();
            });
        });
        it('Should return a token with JSON format after login', function(done) {
            var profile = {
                social: 'facebook',
                token: '',
                "facebook": {
                    "id": "10154355075120094",
                    "email": "test@lockedin.com",
                    "first_name": "Craig",
                    "gender": "male",
                    "last_name": "Doyle",
                    "link": "https://www.facebook.com/app_scoped_user_id/10154355075120094/",
                    "locale": "en_GB",
                    "name": "Test Lockedin",
                    "timezone": 1,
                    "updated_time": "2014-02-08T16:31:07+0000",
                    "verified": true,
                    "picture": "http://graph.facebook.com/10154355075120094/picture?type=large",
                    "thumbnail": "http://graph.facebook.com/10154355075120094/picture",
                    "music": {
                        "data": [{
                            "category": "Musician/band",
                            "name": "Django Django",
                            "created_time": "2013-03-25T18:02:40+0000",
                            "id": "99636325744"
                        }, {
                            "category": "Musician/band",
                            "name": "Patti Smith",
                            "created_time": "2013-03-21T18:39:08+0000",
                            "id": "105547869479786"
                        }, {
                            "category": "Musician/band",
                            "name": "Devendra Banhart",
                            "created_time": "2013-01-03T18:36:25+0000",
                            "id": "333475043434718"
                        }, {
                            "category": "Musician/band",
                            "name": "Tales",
                            "created_time": "2012-12-01T20:27:13+0000",
                            "id": "265622170140510"
                        }, {
                            "category": "Musician/band",
                            "name": "The Family Rain",
                            "created_time": "2012-10-10T19:27:06+0000",
                            "id": "166544990057119"
                        }],
                        "paging": {
                            "next": "https://graph.facebook.com/v2.0/10154355075120094/music?access_token=CAADeXTBsjpgBAJzMn4WG9gZBrSRrd4TVz9xKUHt4wvDkXZCU6FMZAl18O0Ts4Ng7eFAumRP8fEZAVbNSvlJLGsILZATbwZAFVyylydgAnxF0EbqUJRtKdMprKn37ZCSgxrIyZBqZCBTLSc6kWMLJK2PZCIOweBLoZBkBs4EWXIIh6UWaSy1StoXbQ9OrhEhrlyjPa99mLwEI4KBNgZDZD&limit=25&offset=25&__after_id=enc_AeyJjxBMdYtyupQF6WTWPHFCsqZGHm8BqVWvotUBO3UK6VPV-VEwO8UU74cJ1wIn-oEVg-9c5asSufto3CZmYw6w"
                        }
                    }
                },
                twitter: {},
                instagram: {}
            };
        request(url)
            .post('/user')
            .send(profile)
            .end(function(err, res) {
                if (err)
                    throw err;
                token = JSON.parse(res.text)['token'];
                res.text.should.be.json;
                (token).should.be.a.String;
                (token).should.not.be.empty;
                done();
            });
        });
    });
    describe('When Authorized', function() {
        var response,
            user_profile;
        before(function (done) {
            request(url)
                .get('/user')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    response = res;
                    done();
                });
        });
        it('Should return a 200 http code calling to a required authentication call', function(done) {
            (response.status).should.be.exactly(200);
            done();
        });
        it('Should return the information about the user calling /user [get]', function(done) {
            (response.body.data.facebook['name']).should.be.eql('Test Lockedin');
            (response.body.data.facebook['email']).should.be.eql('test@lockedin.com');
            (response.body.data.facebook['music'].data[0].category).should.be.eql('Musician/band');
            done();
        });
        it('Should update the information of the user calling user/merge | Twitter profile', function(done) {
            var profile = {
                social : 'twitter',
                token : token,
                facebook    : {},
                twitter     : {
                    "lang": "es",
                    "statuses_count": 2625,
                    "verified": false,
                    "geo_enabled": true,
                    "time_zone": "Madrid",
                    "utc_offset": 7200,
                    "favourites_count": 22,
                    "created_at": "Thu Dec 20 13:11:11 +0000 2007",
                    "listed_count": 15,
                    "friends_count": 324,
                    "followers_count": 391,
                    "protected": false,
                    "entities": {
                        "description": {
                            "urls": []
                        },
                        "url": {
                            "urls": [
                                {
                                    "indices": [
                                        0,
                                        22
                                    ],
                                    "display_url": "jordillobet.es",
                                    "expanded_url": "http://jordillobet.es",
                                    "url": "http://t.co/iAoBPlTwc4"
                                }
                            ]
                        }
                    },
                    "url": "http://t.co/iAoBPlTwc4",
                    "description": "Developer lover. Barcelona.",
                    "location": "Barcelona",
                    "screen_name": "newpatriks",
                    "name": "newpatriks",
                    "id_str": "11370712",
                    "id": 11370712
                },
                instagram : {}
            };
            request(url)
                .post('/user/merge')
                .set('Authorization', 'Bearer ' + token)
                .send(profile)
                .end(function (req,res) {
                    (res.body.data.twitter['screen_name']).should.be.eql('newpatriks');
                    (res.body.data.twitter['location']).should.be.eql('Barcelona');
                    done();
                });
        });
        it('Should update the information of the user calling user/merge | Instagram profile', function(done) {
            var profile = {
                social : 'instagram',
                token : token,
                facebook    : {},
                twitter     : {},
                instagram   : {
                    "data": {
                        "id": "1574083",
                        "username": "snoopdogg",
                        "full_name": "Snoop Dogg",
                        "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg",
                        "bio": "This is my bio",
                        "website": "http://snoopdogg.com",
                        "counts": {
                            "media": 1320,
                            "follows": 420,
                            "followed_by": 3410
                        }
                    }
                }
            };
            request(url)
                .post('/user/merge')
                .set('Authorization', 'Bearer ' + token)
                .send(profile)
                .end(function (req,res) {
                    (res.body.data.instagram.data['id']).should.be.eql('1574083');
                    (res.body.data.instagram.data['username']).should.be.eql('snoopdogg');
                    (res.body.data.instagram.data['website']).should.be.eql('http://snoopdogg.com');
                    done();
                });
        });
        it('Should return the information with instagram and twitter', function(done) {
            request(url)
                .get('/user')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    user_profile = res.body.data;
                    user_profile.should.not.be.eql('');
                    (res.status).should.be.exactly(200);
                    done();
                });
        });
        describe('Modifying user before PUT', function() {
            before(function (done) {
                user_profile.preferences.description = user_profile.twitter.description;
                done();
            });
            it('Should return 200 after PUT /user', function(done) {
                request(url)
                    .put('/user')
                    .set('Authorization', 'Bearer ' + token)
                    .send(user_profile)
                    .end(function (req,res) {
                        (res.status).should.be.exactly(200);
                        done();
                    });
            });
        });
        it('Should list the users that are online', function(done) {
            request(url)
                .get('/users/all/1')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    var data = JSON.parse(res.text)['data'];
                    (data.length).should.be.above(0);
                    done();
                });
        });
        it('Should return code 200 after logout this session', function(done) {
            request(url)
                .post('/user/logout')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    (res.status).should.be.exactly(200);
                    done();
                });
        });
        it('Should be possible remove the user we created', function(done) {
            request(url)
                .delete('/user')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    (res.status).should.be.exactly(200);
                    done();
                });
        });

    });
});

describe('Interaction Between Users', function() {
    var token = '';
    var id_user2 = '';
    
    describe('Creating User 1', function() { 
        it('POST /user Should return 200 code', function(done) {
            var user = {
                social : 'facebook',
                token : '',
                facebook: {
                    "email": "user_1@lockedin.com",
                    "first_name": "User 1",
                    "gender": "male",
                    "id": "10154355075120086",
                    "last_name": "Test",
                    "verified": "true",
                    "music": {
                        "data": [
                            {
                                "category": "Musician/band",
                                "created_time" : "2013-03-25T18:02:40+0000",
                                "id": "99636325744",
                                "name": "Django Django"
                            },
                            {
                                "category": "Musician/band",
                                "created_time" : "2014-07-25T18:02:40+0000",
                                "id": "99636325744",
                                "name": "Django Django"
                            }
                        ]
                    }
                },
                twitter : {},
                instagram : {}
            };
            request(url)
                .post('/user')
                .send(user)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    // The method [res.should.have.status(200)] doesn't work properly
                    (res.status).should.be.exactly(200);
                    done();
                });
        });
    });
    describe('Creating User 2', function() { 
        it('POST /user Should return 200 code', function(done) {
            var user = {
                social : 'facebook',
                token : '',
                facebook: {
                    "email": "user_2@lockedin.com",
                    "first_name": "User 2",
                    "gender": "male",
                    "id": "10154355075120086",
                    "last_name": "Test",
                    "verified": "true",
                    "music": {
                        "data": [
                            {
                                "category": "Musician/band",
                                "created_time" : "2013-03-25T18:02:40+0000",
                                "id": "99636325744",
                                "name": "Django Django"
                            },
                            {
                                "category": "Musician/band",
                                "created_time" : "2014-07-25T18:02:40+0000",
                                "id": "99636325744",
                                "name": "Django Django"
                            }
                        ]
                    }
                },
                twitter : {},
                instagram : {}
            };
            request(url)
                .post('/user')
                .send(user)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    // The method [res.should.have.status(200)] doesn't work properly
                    (res.status).should.be.exactly(200);
                    done();
                });
        });
    });
    describe('Creating User 3', function() { 
        it('POST /user Should return 200 code', function(done) {
            var user = {
                social : 'twitter',
                token : '',
                twitter     : {
                    "lang": "es",
                    "statuses_count": 2625,
                    "verified": false,
                    "geo_enabled": true,
                    "time_zone": "Madrid",
                    "utc_offset": 7200,
                    "favourites_count": 22,
                    "created_at": "Thu Dec 20 13:11:11 +0000 2007",
                    "listed_count": 15,
                    "friends_count": 324,
                    "followers_count": 391,
                    "protected": false,
                    "entities": {
                        "description": {
                            "urls": []
                        },
                        "url": {
                            "urls": [
                                {
                                    "indices": [
                                        0,
                                        22
                                    ],
                                    "display_url": "jordillobet.es",
                                    "expanded_url": "http://jordillobet.es",
                                    "url": "http://t.co/iAoBPlTwc4"
                                }
                            ]
                        }
                    },
                    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1215859364/charles_normal.jpg",
                    "profile_image_url": "http://pbs.twimg.com/profile_images/1215859364/charles_normal.jpg",
                    "url": "http://t.co/iAoBPlTwc4",
                    "description": "Developer lover. Barcelona.",
                    "location": "Barcelona",
                    "screen_name": "user_3",
                    "name": "newpatriks",
                    "id_str": "11370712",
                    "id": 11370712
                },
                instagram : {}
            };
            request(url)
                .post('/user')
                .send(user)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    // The method [res.should.have.status(200)] doesn't work properly
                    (res.status).should.be.exactly(200);
                    token = JSON.parse(res.text)['token'];
                    done();
                });
        });
    });
    

    describe('Signed in as a user 3', function() { 

        it('GET /user Should return "User 3" as a first_name', function(done) {
            request(url)
                .get('/user')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    (res.body.data.twitter.screen_name).should.be.eql('user_3');
                    done();
                });
        });

        it('Should be 3 users LockedIn', function(done) {
            request(url)
                .get('/users/number')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    (res.body.data).should.be.exactly(3);
                    done();
                });
        });

        it('GET /users/all/1 Should return the information of the users LockedIn', function(done) {
            request(url)
                .get('/users/all/1')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    (res.body.data[0].facebook.email).should.be.eql('user_1@lockedin.com');
                    (res.body.data[0].facebook.first_name).should.be.eql('User 1');

                    id_user2 = res.body.data[1]._id;
                    (res.body.data[1].facebook.email).should.be.eql('user_2@lockedin.com');
                    (res.body.data[1].facebook.first_name).should.be.eql('User 2');

                    (res.body.data[2].twitter.screen_name).should.be.eql('user_3');
                    (res.body.data[2].twitter.location).should.be.eql('Barcelona');

                    done();
                });
        });

        it('Should return a number of Shouted outs of 0', function(done) {
            request(url)
                .get('/shoutout')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    data = JSON.parse(res.text)['data'];
                    (data.shoutouts_s.length).should.be.eql(0);
                    (data.shoutouts_r.length).should.be.eql(0);
                    done();
                });
        });
        
        it('POST /shoutout to User-2 Should return 200 code', function(done) {
            var data = {
                'id' : id_user2
            }
            request(url)
                .post('/shoutout')
                .set('Authorization', 'Bearer ' + token)
                .send(data)
                .end(function (req,res) {
                    (res.status).should.be.exactly(200);
                    done();
                });
        });
        
        it('Should return a number of Shouted outs sended above 0', function(done) {
            request(url)
                .get('/shoutout')
                .set('Authorization', 'Bearer ' + token)
                .end(function (req,res) {
                    data = JSON.parse(res.text)['data'];
                    (data.shoutouts_s.length).should.be.above(0);
                    (res.status).should.be.exactly(200);
                    done();
                });
        });
    });
/*

    it('Should return 200 http code after Shouted out one of them', function() {
        
    });

    it('Should return a number of Shouted outs equal or more than 1', function() {
        
    });
*/
});
