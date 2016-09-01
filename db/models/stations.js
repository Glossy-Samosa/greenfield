// mongoose Schema to store the bike share station data
var mongoose = require('mongoose');

var stationSchema = mongoose.Schema({
  stationName: String,
  latitude: Number,
  longitude: Number,
  s2: String
})