var express = require('express');
var router = express.Router();
var region = require('../utility/inRegion');

router.post('/', function(req, res) {
  var lat = req.body.latitude;
  var lng = req.body.longitude;

  if (region.inRegion(lat, lng)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;