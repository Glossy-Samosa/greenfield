var chai = require('chai');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var expect = chai.expect;
var request = require('supertest');
var app = require('../server/server.js');

var Station = require('../db/models/stations.js').Station;
var User = require('../db/models/users.js').User;

chai.use(require('chai-things'));

var dbURI = 'mongodb://localhost/uberEco';

// HAVE MONGOD RUNNING IN TERMINAL READY TO ACCEPT CONNECTIONS
// BEFORE RUNNING TESTS

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

  describe('/api/user', function() {
    it('should be able to redirect a user trying to log in', function(done) {
      request(app)
        .post('/api/user/login')
        .send({username: 'testUser', password: 'bestPWever'})
        .end(function(err, res) {
          expect(res.body.location).to.equal('/');
          done();
        });
    });

    it('should redirect a logged in user', function(done) {
      request(app)
        .post('/api/user/login')
        .send({username: 'testUser', password: 'bestPWever'})
        // test to see that the user is sent to the /
        .end(function(err, res) {
          expect(res.body.location).to.equal('/');
          done();
        });
    });

    it('should not login a non-existing user', function(done) {
      request(app)
        .post('api/user/login')
        .send( {username: 'asfljksajlkagjlg', password: 'oijawgoijwegjiwef' })
        .end(function(err, res) {
          expect(err).to.exist;
          done();
        });
    });

    it('should sign up a new user', function(done) {
      request(app)
        .post('/api/user/signup')
        .send({username: 'testUser2', password: 'nyanCat'})
        .end(function(err, res) {
          expect(res.body.location).to.equal('/');
          done();
        });
    });

    it('should redirect a user once they are logged out', function(done) {
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

  describe('/api/navigation/', function() {
    it('should return the closest bike station to the destination', function(done) {
      request(app)
        .post('/api/navigation/')
        // lat and lon correspond with where HR is
        .send({
          // current location is hack reactor
          // destination is cable museum
          currentLocation: { lat: 37.783490, lon: -122.409005 },
          destination: { lat: 37.794557, lon: -122.411916 }
        })
        .end(function(err, res) {
          expect(res.body.stationB.name).to.not.equal('San Francisco City Hall');
          done();
        });

    });

    it('should return the closest bike station to the user', function(done) {
      request(app)
        .post('/api/navigation/')
        .send({
          currentLocation: { lat: 37.783490, lon: -122.409005 },
          destination: { lat: 37.794557, lon: -122.411916 }
        })
        .end(function(err, res) {
          // this may fail if num bikes available at powell is 0
          expect(res.body.stationA.name).to.equal('Powell Street BART');
          done();
        });
    });
  });

  describe('/api/region/', function() {
    it('should return 200 status for a serviceable area', function(done) {
      request(app)
        .post('/api/region/')
        .send({
          // service at hack reactor
          latitude: 37.783490,
          longitude: -122.409005
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should return false for a unserviced area', function(done) {
      request(app)
        .post('/api/region/')
        .send({
          // we dont service alcatraz
          latitude: 37.825970,
          longitude: -122.422071
        })
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });  
});