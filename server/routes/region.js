var express = require('express');
var router = express.Router();
var s2 = require('../utility/s2');

var Station = require('../../db/models/stations').Station;

router.post('/', function(req, res) {
  var lat = req.body.latitude;
  var lng = req.body.longitude;

  var token = s2.cellToken(lat, lng);

  res.json(token);
});

module.exports = router;