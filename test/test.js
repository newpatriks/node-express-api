var request = require("supertest"),
    express = require("express");

var app = require("../app.js");

describe('POST', function() {
    if ("responds with a json success message", function(done) {
        request(app)
            .post('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({'action' : 'write post on TDD with mongoDB, nodeJS and Wercker', 'name':'newpatriks'})
            .expect(200, done);
    });
});


describe('GET', function() {
    if ('responds with a list of users in JSON', function(done) {
        request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET', function() {
    if ('responds with a single user in JSON based on the name', function(done) {
        request(app)
            .get('users/newpatriks')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});