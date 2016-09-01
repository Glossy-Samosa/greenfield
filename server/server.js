var express = require('express');
var mongoose = require('mongoose');
var request = require('request');

var app = express();

// open mongoose connection
mongoose.connect('mongodb://localhost/uberEco');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Database connected');
});


//routing here


// initialize our server
app.listen(3000, function() {
  console.log('Listening on port 3000...');
});