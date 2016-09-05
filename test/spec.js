var chai = require('chai');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var expect = chai.expect;
var request = require('supertest');
var app = require('../server/server.js');

var Station = require('../db/models/stations.js').Station;

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
  });

  describe('Database Functionality', function () {
    // Write your tests here!
    it('should be able to access the database', function() {
      expect(mongoose.connection).to.exist;
    });

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