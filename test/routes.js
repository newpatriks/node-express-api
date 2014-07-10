var should      = require('should');
var assert      = require('assert');
var request     = require('supertest');
var mongoose    = require('mongoose');
var db          = require('../config/mongo_db');

describe('Routing', function() {
    var url     = 'http://localhost:5000';
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
                .get('/users/all')
                .send(profile)
                .end(function (req,res) {
                    response = res;
                    done();
                });
        });
        it('Should return a 401 http code', function(done) {
            (response.status).should.be.exactly(401); 
            done();
        });
    });
    describe('Register', function() {
        it('Should return 200 when we create a user with facebook information', function(done) {
            var profile = {
                social : 'facebook',
                token : '',
                facebook : {
                    name: 'test',
                    email: 'test@lockedin.com'
                },
                twitter : {},
                instagram : {}
            };
        request(url)
            .post('/user/register')
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
                social : 'facebook',
                token : '',
                facebook : {
                    name: 'test',
                    email: 'test@lockedin.com'
                },
                twitter : {},
                instagram : {}
            };
        request(url)
            .post('/user/register')
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
                .get('/users/all')
                .set('Authorization', 'Bearer ' + token)
                .send(profile)
                .end(function (req,res) {
                    response = res;
                    done();
                });
        });
        it('Should return a 200 http code trying to get all users', function(done) {
            (response.status).should.be.exactly(200); 
            done();
        });
    });
});



