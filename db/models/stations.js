// mongoose Schema to store the bike share station data
var mongoose = require('mongoose');

var stationSchema = mongoose.Schema({
  stationName: String,
  latitude: Number,
  longitude: Number,
  statusValue: String,
  availableBikes: Number,
  totalDocks: Number,
  s2: { type: String, default: '' }

});

exports.Station = mongoose.model('Station', stationSchema);