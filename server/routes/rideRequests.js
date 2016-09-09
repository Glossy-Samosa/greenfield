var express = require('express');
var router = express.Router();
var getCoordinates = require('../utility/getCoordinates');

// // hard-coded for Postman testing
//   // Hack Reactor
//   req.body.currentLocation.lat = 37.783759;
//   req.body.currentLocation.lon = -122.402712;
  
//   // Ferry Building
//   req.body.destination.lat = 37.795581;
//   req.body.destination.lon = -122.393411;

router.post('/', function(req, res) {

  if (req.body.destination.lat === 37.795581) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;