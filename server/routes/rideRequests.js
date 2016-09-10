var express = require('express');
var router = express.Router();
var destination = require('../utility/getCoordinates');
var region = require('../utility/inRegion');


router.post('/', function(req, res) {

// Test One
  // SF Conservatory of Music
  req.body.currentLocation = req.body.currentLocation || {
    lat: 37.774929,
    lon: -122.419416
  }
  // Caltrain Station
  req.body.destination = req.body.destination || {
    lat: 37.776687, 
    lon: -122.394857
  }

  destination.getCoordinates(req, res);

});

module.exports = router;