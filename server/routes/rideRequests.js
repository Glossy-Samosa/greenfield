var express = require('express');
var router = express.Router();
var navigation = require('../utility/getCoordinates');
var region = require('../utility/inRegion');


router.post('/api/navigation', function(req, res) {

  // Test origin: SF Conservatory of Music
  req.body.currentLocation = req.body.currentLocation || {
    lat: 37.774929,
    lon: -122.419416
  };
  // Test destination: Caltrain Station
  req.body.destination = req.body.destination || {
    lat: 37.776687, 
    lon: -122.394857
  };

  navigation.getCoordinates(req, res);

});

module.exports = router;