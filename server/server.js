var express = require('express');
var mongoose = require('mongoose');

var app = express();

// open mongoose connection
mongoose.connect('mongodb://localhost/uberEco');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Databases connected');
});



//routing here