var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
chai.use(chaiHttp);

describe('users api', function() {
    var userID;
    var validEmail;

    describe('/users POST endpoint', function() {
        it('should add a user with valid data', function(done) {
            validEmail = new Date().getTime();
            var validUser = {firstName: 'validName', lastName: 'validLastName', email: validEmail, password: 'validPassword'};
            chai.request(server)
                .post('/users')
                .send(validUser)
                .end(function(err, res){
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('email');
                    res.body.should.have.property('password');
                    // password should be encrypted
                    res.body.password.should.not.equal('validPassword');
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('should NOT add a user with invalid data', function(done) {
            var inValidUser = {password: 'derp'};
            chai.request(server)
                .post('/users')
                .send(inValidUser)
                .end(function(err, res){
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('should NOT hash an invalid password', function(done) {
            var inValidUser = {};
            chai.request(server)
                .post('/users')
                .send(inValidUser)
                .end(function(err, res){
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('should NOT add a user with an existing email address', function(done) {
            var uniqueEmail = new Date().getTime();
            var user = {firstName: 'validName', lastName: 'validLastName', email: uniqueEmail, password: 'validPassword'};
            chai.request(server)
                .post('/users')
                .send(user)
                .end(function(err, res){
                     chai.request(server)
                    .post('/users')
                    .send(user)
                    .end(function(err, res){
                        res.should.have.status(400);
                        res.error.text.should.be.a('string');
                        res.error.text.should.equal('A user with that email already exists.');
                        done();
                    });
                });
        });
    });

    describe('/users GET endpoint', function() {
        it('should list ALL users', function(done) {
            chai.request(server)
                .get('/users')
                .send()
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    userID = res.body[0]._id;
                    done();
                });
        });
    });

    describe('/users/:id GET endpoint', function() {
        it('should return a user with a valid ID', function(done) {
            chai.request(server)
                .get('/users/' + userID)
                .send()
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('should NOT return a user with an invalid ID', function(done) {
            chai.request(server)
                .get('/users/thisisabadid')
                .send()
                .end(function(err, res){
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe('/users/:id PUT endpoint', function() {
        it('should update a user with valid data and id', function(done) {
            chai.request(server)
                .put('/users/' + userID)
                .send({firstName: 'validName', lastName: 'validLastName', email: validEmail, password: 'validPassword'})
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('should NOT update a user with invalid data', function(done) {
            chai.request(server)
                .put('/users/' + userID)
                .send({password: null})
                .end(function(err, res){
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });


        it('should NOT update a user with an invalid id', function(done) {
            chai.request(server)
                .put('/users/123invalidid')
                .send()
                .end(function(err, res){
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });

    });

    describe('/users/:id DELETE endpoint', function () {
        it('should delete a user with a valid ID', function(done){
            chai.request(server)
                .delete('/users/' + userID)
                .send()
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('should NOT delete a user with an invalid ID', function(done){
            chai.request(server)
                .delete('/users/invalidid123')
                .send()
                .end(function(err, res){
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});
