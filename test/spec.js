var chai = require('chai');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var expect = chai.expect;
var request = require('supertest');
var app = require('../server/server.js');

var Station = require('../db/models/stations.js').Station;
var User = require('../db/models/users.js').User;

chai.use(require('chai-things'));

var dbURI = 'mongodb://localhost/pokemontest';

var getBody = function (res) {
  return JSON.parse(res.text);
};

var clearDB = function (done) {
  // clears out our users collection portion of the db
  mongoose.connection.collections['users'].remove(done);
};



describe('UberEco', function () {

  before(function(done) {
    mongoose.createConnection(dbURI);
    done();
  });

  beforeEach(function (done) {
    var newUser = new User({
      username: 'testUser',
      password: 'bestPWever'
    });
    newUser.save();

    done();
  });

  afterEach(function (done) {
    mongoose.connection.collections['users'].remove(done);
  });





  describe('Database Functionality', function() {
    // Write your tests here!
    it('should be able to access the database', function() {
      expect(mongoose.connection).to.exist;
    });

    it('should not store duplicate stations', function(done) {
      var fn = require('../server/utility/getBikeStationData.js');
      fn.getBikeStationData();
      var numStations;
      var numStations2;
      Station.find(function(error, data) {
        numStations = data.length;
        fn.getBikeStationData();
        Station.find(function(error, data) {
          numStations2 = data.length;
          expect(numStations).to.equal(numStations2);
          done();
        });
      });
    });

    it('should store new users', function(done) {
      var newUser = new User({
        username: 'dead',
        password: 'mau5'
      });
      newUser.save(function(error, res) {
        User.find({
          username: 'dead'
        }, function(error, data) {
          expect(data.length).to.be.above(0);
          done();
        });
      });
    });

    it ('should not store duplicate users', function(done) {
      var newUser = new User({
        username: 'dead',
        password: 'mau5'
      });
      newUser.save();

      var newUser2 = new User({
        username: 'dead',
        password: 'horse'
      });

      newUser2.save(function(error) {
        expect(error).to.exist;
        done();
      });
    });
    
  });

  describe('Utility Functions', function() {
    it('should be able to get bike station data', function(done) {
      var fn = require('../server/utility/getBikeStationData.js');
      fn.getBikeStationData(function() {
        Station.find(function(error, data) {
          expect(Object.keys(data).length).to.be.above(0);
          done();
        });  
      });
    });
  });

  describe('Authorization/Login/Signup Services', function() {
    it('should be able to redirect a user trying to log in', function(done) {
      request(app)
        .post('/api/user/login')
        .send({username: 'testUser', password: 'bestPWever'})
        .end(function(err, res) {
          expect(res.body.location).to.equal('/');
          done();
        });
    });

    it('should be able to login an existing user', function(done) {
      request(app)
        .post('/api/user/login')
        .send({username: 'testUser', password: 'bestPWever'})
        // test to see that the user is sent to the /
        .end(function(err, res) {
          expect(res.body.location).to.equal('/');
          done();
        });
    });

    it('should sign up a new user', function(done) {
      request(app)
        .post('/api/user/signup')
        .send({username: 'testUser2', password: 'nyanCat'});
      done();
    });

    // not sure if this test is 100% functional
    it('should be able to log out an existing user', function(done) {
      request(app)
        .post('/api/user/signup')
        .send({ username: 'testUser3', password: 'godzillaaaa' })
        .end(function() {
          request(app)
          .get('/api/user/logout')
          .end(function(err, res) {
            expect(res.body.location).to.equal('/api/userlogin');
            done();
          });
        });
    });
  });
});