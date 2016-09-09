var express = require('express');
var router = express.Router();
var destination = require('../utility/getCoordinates');
var region = require('../utility/inRegion');


router.post('/', function(req, res) {

// =========================================
// hard-coded req.body for Postman testing
// =========================================

// // Test One
//   // Hack Reactor
//   req.body.currentLocation = {
//     lat: 37.783759,
//     lon: -122.402712
//   }
//   // Ferry Building
//   req.body.destination = {
//     lat: 37.795581, 
//     lon: -122.393411
//   }

// Test Two
  // SF Conservatory of Music
  req.body.currentLocation = {
    lat: 37.774929,
    lon: -122.419416
  }
  // Ferry Building
  req.body.destination = {
    lat: 37.776687, 
    lon: -122.394857
  }

 var destLat = req.body.destination.lat;
 var destLon = req.body.destination.lon;

  if ( region.inRegion(destLat, destLon) ) {
    res.send( destination.getCoordinates(req, res) );
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;