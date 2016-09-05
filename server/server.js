var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var bodyParser = require('body-parser');
// var GoogleMapsLoader = require('google-maps');

var app = express();

// // load google maps stuffs
// GoogleMapsLoader.load(function(google) {
//   new google.maps.Map(el, options);
// });

// GoogleMapsLoader.onLoad(function() {
//   console.log('We just loaded Google Maps API!');
// });
// GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

// GoogleMapsLoader.KEY = window.google_maps_API_KEY;

// open mongoose connection
mongoose.connect('mongodb://localhost/uberEco');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Database connected');
});

// middleware
app.use(bodyParser.json());

//routing here


// initialize our server
exports.app = app.listen(3000, function() {
  console.log('Listening on port 3000...');
});

