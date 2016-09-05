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

// var clearDB = function (done) {
//   // Mongoose doesn't know how to pluralize 'pokemon'
//   mongoose.connection.collections['pokemons'].remove(done);
// };



describe('UberEco', function () {

  before(function(done) {
    // if (mongoose.connection.db) {
    //   return done();
    // }
    mongoose.createConnection(dbURI);
    done();
  });

  beforeEach(function (done) {
    server = app;
    done();
  });

  afterEach(function () {
    // there is no close() method for express anymore
    // apparently
    // server.close();
    //remove our dummy user
    User.findOneAndRemove({
      username: 'dead'
    });
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
      newUser.save();
      User.find({
        username: 'dead'
      }, function(error, data) {
        if (error) {
          console.log(error);
        } else {
          expect(data.length).to.be.above(0);
        }
        done();
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
        console.log(error);
        expect(error).to.exist;
        done();
      });
    });
    
  });

  describe('Utility Functions', function() {
    it('should be able to get bike station data', function(done) {
      var fn = require('../server/utility/getBikeStationData.js');
      fn.getBikeStationData();
      Station.find(function(error, data) {
        expect(Object.keys(data).length).to.be.above(0);
        done();
      });
    });
  });
});