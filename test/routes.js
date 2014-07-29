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
});

describe('Testing Login /w TWITTER', function() {
    var token = '';

    describe('Register / Login user using TWITTER', function() {
        var profile = {
            social : 'twitter',
            "facebook" : {},
            "twitter": {
                "thumbnail": "http://pbs.twimg.com/profile_images/472342968087891968/36Nn8n0__normal.jpeg",
                "last_name": "Smith",
                "first_name": "Ellie",
                "notifications": false,
                "follow_request_sent": false,
                "following": false,
                "default_profile_image": false,
                "default_profile": false,
                "profile_use_background_image": true,
                "profile_text_color": "333333",
                "profile_sidebar_fill_color": "F6F6F6",
                "profile_sidebar_border_color": "FFFFFF",
                "profile_link_color": "2D2E2C",
                "profile_banner_url": "https://pbs.twimg.com/profile_banners/112172098/1380204762",
                "profile_image_url_https": "https://pbs.twimg.com/profile_images/472342968087891968/36Nn8n0__normal.jpeg",
                "profile_image_url": "http://pbs.twimg.com/profile_images/472342968087891968/36Nn8n0__normal.jpeg",
                "profile_background_tile": true,
                "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/378800000082813912/bb74483ee0dc978018ccaed7df19ed39.jpeg",
                "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/378800000082813912/bb74483ee0dc978018ccaed7df19ed39.jpeg",
                "profile_background_color": "B8CBD6",
                "is_translation_enabled": false,
                "is_translator": false,
                "contributors_enabled": false,
                "status": {
                    "lang": "en",
                    "possibly_sensitive": false,
                    "retweeted": false,
                    "favorited": false,
                    "entities": {
                        "user_mentions": [
                            {
                                "indices": [
                                    13,
                                    25
                                ],
                                "id_str": "262189907",
                                "id": 262189907,
                                "name": "Suzie Howell Photo",
                                "screen_name": "suziehowell"
                            },
                            {
                                "indices": [
                                    29,
                                    41
                                ],
                                "id_str": "17896874",
                                "id": 17896874,
                                "name": "It's Nice That",
                                "screen_name": "itsnicethat"
                            }
                        ],
                        "urls": [
                            {
                                "indices": [
                                    42,
                                    64
                                ],
                                "display_url": "itsnicethat.com/articles/thing…",
                                "expanded_url": "http://www.itsnicethat.com/articles/things-62-2",
                                "url": "http://t.co/7ynlBVhHiH"
                            }
                        ],
                        "symbols": [],
                        "hashtags": []
                    },
                    "favorite_count": 0,
                    "retweet_count": 0,
                    "contributors": null,
                    "place": null,
                    "coordinates": null,
                    "geo": null,
                    "in_reply_to_screen_name": null,
                    "in_reply_to_user_id_str": null,
                    "in_reply_to_user_id": null,
                    "in_reply_to_status_id_str": null,
                    "in_reply_to_status_id": null,
                    "truncated": false,
                    "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
                    "text": "Oh hey there @suziehowell on @itsnicethat http://t.co/7ynlBVhHiH",
                    "id_str": "492629773475401728",
                    "id": 492629773475401700,
                    "created_at": "Fri Jul 25 11:17:45 +0000 2014"
                },
                "lang": "en",
                "statuses_count": 860,
                "verified": false,
                "geo_enabled": false,
                "time_zone": "Amsterdam",
                "utc_offset": 7200,
                "favourites_count": 64,
                "created_at": "Sun Feb 07 13:56:00 +0000 2010",
                "listed_count": 8,
                "friends_count": 853,
                "followers_count": 363,
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
                                "display_url": "elliesmithphotography.co.uk",
                                "expanded_url": "http://www.elliesmithphotography.co.uk",
                                "url": "http://t.co/pBeWhKx6vd"
                            }
                        ]
                    }
                },
                "url": "http://t.co/pBeWhKx6vd",
                "description": "Photographer. Raised in Birmingham, living in London. info@elliesmithphotography.co.uk",
                "location": "",
                "screen_name": "elliesmithphoto",
                "name": "Ellie Smith",
                "id_str": "112172098",
                "id": 112172098
            },
            instagram : {}
        };
        
        it('Should return http response 200', function(done) {
            request(url)
                .post('/user')
                .send(profile)
                .end(function (req,res) {
                    (res.status).should.be.exactly(200);
                    res.text.should.be.json;
                    token = JSON.parse(res.text)['token'];
                    (token).should.be.a.String;
                    (token).should.not.be.empty;
                    done();
                });
        });
    });
    describe('Logout', function() {
        it('Should return http response 200', function(done) {
            request(url)
                .post('/user/logout')
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    (res.status).should.be.exactly(200);
                    done();
                });
            
        });

    });
    describe('Register / Login user using FACEBOOK', function() {
        var profile = {
            social : 'facebook',
            "facebook": {
                "music": {
                    "paging": {
                        "next": "https://graph.facebook.com/v2.0/10152282493886909/music?access_token=CAADeXTBsjpgBAOScDfxnIbUuszeQA7UqYgapeVvoddQeeQ49ZBy7jblZAd2cZCEW02SCXqseJO5AZCD0Ld3cnSrFB1BkX7Nrtszx2fvZCtcJrVIZCOXx7PcCFhqHZCdhGWuBsR5HXRBQY5w0MJbBxU0KBBImDOxLQjh4i5xaf6dVZB7SZC4pEeCgWy2mJe7OlSID5rGzX1IFMUhBTdzjPeZBWD&limit=25&offset=25&__after_id=enc_AeyHhxb4F_3IM5NRUKPtD041YGMv9PzCygMs2RtpjdPGsJYyALo-xMMGD0Bg31ZEPtI"
                    },
                    "data": [
                        {
                            "id": "36646107889",
                            "created_time": "2014-02-08T16:34:34+0000",
                            "name": "Sum 41",
                            "category": "Musician/band"
                        },
                        {
                            "id": "19855571496",
                            "created_time": "2014-02-08T16:32:45+0000",
                            "name": "LMFAO",
                            "category": "Musician/band"
                        },
                        {
                            "id": "9748517548",
                            "created_time": "2014-02-08T16:32:04+0000",
                            "name": "Franz Ferdinand",
                            "category": "Musician/band"
                        },
                        {
                            "id": "6267905926",
                            "created_time": "2014-02-08T16:31:56+0000",
                            "name": "Lil' Mama",
                            "category": "Musician/band"
                        },
                        {
                            "id": "5204238009",
                            "created_time": "2014-02-08T16:31:35+0000",
                            "name": "Norah Jones",
                            "category": "Musician/band"
                        },
                        {
                            "id": "6404768717",
                            "created_time": "2014-02-08T16:31:28+0000",
                            "name": "Keane",
                            "category": "Musician/band"
                        },
                        {
                            "id": "9770929278",
                            "created_time": "2014-02-08T16:31:20+0000",
                            "name": "Adele",
                            "category": "Musician/band"
                        },
                        {
                            "id": "5618127822",
                            "created_time": "2014-02-08T16:31:12+0000",
                            "name": "Thirty Seconds to Mars",
                            "category": "Musician/band"
                        },
                        {
                            "id": "5544067490",
                            "created_time": "2014-02-08T16:30:52+0000",
                            "name": "Deftones",
                            "category": "Musician/band"
                        },
                        {
                            "id": "18279403944",
                            "created_time": "2014-02-08T16:30:40+0000",
                            "name": "Beastie Boys",
                            "category": "Musician/band"
                        },
                        {
                            "id": "5718732097",
                            "created_time": "2014-02-08T16:30:27+0000",
                            "name": "Justin Timberlake",
                            "category": "Musician/band"
                        },
                        {
                            "id": "111074255594682",
                            "created_time": "2014-02-08T16:29:56+0000",
                            "name": "RUSSIAN RED (OFICIAL)",
                            "category": "Musician/band"
                        },
                        {
                            "id": "6885814958",
                            "created_time": "2014-02-08T16:29:53+0000",
                            "name": "Lil Wayne",
                            "category": "Musician/band"
                        },
                        {
                            "id": "8651510029",
                            "created_time": "2014-02-08T16:29:49+0000",
                            "name": "Johnny Cash",
                            "category": "Musician/band"
                        },
                        {
                            "id": "7401700249",
                            "created_time": "2014-02-08T16:29:43+0000",
                            "name": "Bruce Springsteen",
                            "category": "Musician/band"
                        },
                        {
                            "id": "329386304007",
                            "created_time": "2014-02-08T16:29:34+0000",
                            "name": "Marco Carola",
                            "category": "Musician/band"
                        },
                        {
                            "id": "10787376253",
                            "created_time": "2014-02-08T16:29:26+0000",
                            "name": "La Mala Rodriguez",
                            "category": "Musician/band"
                        },
                        {
                            "id": "22330837712",
                            "created_time": "2014-02-08T16:29:10+0000",
                            "name": "Rammstein",
                            "category": "Musician/band"
                        },
                        {
                            "id": "5769333796",
                            "created_time": "2014-02-08T16:28:59+0000",
                            "name": "50 Cent",
                            "category": "Musician/band"
                        },
                        {
                            "id": "25209381460",
                            "created_time": "2014-02-08T16:28:57+0000",
                            "name": "Wally Lopez",
                            "category": "Musician/band"
                        },
                        {
                            "id": "7284978791",
                            "created_time": "2014-02-08T16:28:50+0000",
                            "name": "ELVIS PRESLEY",
                            "category": "Musician/band"
                        },
                        {
                            "id": "6558867050",
                            "created_time": "2014-02-08T16:28:46+0000",
                            "name": "Alicia Keys",
                            "category": "Musician/band"
                        },
                        {
                            "id": "11455644806",
                            "created_time": "2014-02-08T16:28:38+0000",
                            "name": "Snoop Dogg",
                            "category": "Musician/band"
                        },
                        {
                            "id": "16929140023",
                            "created_time": "2014-02-08T16:28:36+0000",
                            "name": "AKON",
                            "category": "Musician/band"
                        },
                        {
                            "id": "25098475544",
                            "created_time": "2014-02-08T16:28:26+0000",
                            "name": "Foo Fighters",
                            "category": "Musician/band"
                        }
                    ]
                },
                "thumbnail": "http://graph.facebook.com/10152282493886909/picture",
                "picture": "http://graph.facebook.com/10152282493886909/picture?type=large",
                "verified": true,
                "updated_time": "2014-05-22T12:47:45+0000",
                "timezone": 1,
                "name": "Jordi Llobet Torrens",
                "locale": "es_ES",
                "link": "https://www.facebook.com/app_scoped_user_id/10152282493886909/",
                "last_name": "Llobet Torrens",
                "inspirational_people": [
                    {
                        "name": "Pep Guardiola",
                        "id": "110088699020288"
                    },
                    {
                        "name": "EDUARD PUNSET",
                        "id": "34418786533"
                    },
                    {
                        "name": "Steve Jobs",
                        "id": "113529011990795"
                    },
                    {
                        "name": "Barney Stinson",
                        "id": "68816265924"
                    },
                    {
                        "name": "Tony Montana (SCARFACE)",
                        "id": "34883224097"
                    },
                    {
                        "name": "Martin Scorsese",
                        "id": "469644786438842"
                    }
                ],
                "gender": "male",
                "first_name": "Jordi",
                "favorite_teams": [
                    {
                        "name": "Barça",
                        "id": "114991068515354"
                    },
                    {
                        "name": "Bàsquet Manresa",
                        "id": "112907918723902"
                    },
                    {
                        "name": "FC Bayern München",
                        "id": "141973839152649"
                    },
                    {
                        "name": "Arsenal",
                        "id": "20669912712"
                    }
                ],
                "favorite_athletes": [
                    {
                        "name": "Carles Puyol",
                        "id": "127670413978306"
                    },
                    {
                        "name": "Xavi",
                        "id": "109648175728358"
                    },
                    {
                        "name": "Leo Messi",
                        "id": "176063032413299"
                    },
                    {
                        "name": "Pau Gasol",
                        "id": "49824215862"
                    },
                    {
                        "name": "Ronaldinho",
                        "id": "112658518746675"
                    },
                    {
                        "name": "SALVA ARCO FRIAS",
                        "id": "177639969104402"
                    }
                ],
                "email": "newpatriks@hotmail.com",
                "id": "10152282493886909"
            },
            instagram : {}
        };
    
        it('Should return http response 200', function(done) {
            request(url)
                .post('/user')
                .send(profile)
                .end(function (req,res) {
                    token = JSON.parse(res.text)['token'];
                    (res.status).should.be.exactly(200);
                    done();
                });
        });
    });
});