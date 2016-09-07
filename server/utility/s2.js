var s2 = require('s2geometry-node')

// earth circumference in meters
var kEarthCircumferenceMeters = 1000 * 40075.017;

// cell level
var level = 14;

// search radius
var radius = 1500;

exports.cellToken = function(lat, lng) {
	// convert latitude and longitude to radians
  var ll = new s2.S2LatLng(lat, lng);
  // create unique identifier in S2 cell decomposition
  var cell = new s2.S2CellId(ll);
  // convert cell id to compact text string suitable for indexing
  var token = cell.parent(level).toToken();
  return token;
};

var earthMetersToRadians = function(meters) {
  return (2 * Math.PI) * (meters / kEarthCircumferenceMeters);
};

var cellToString = function(cellId) {

};

exports.searchCells = function(lat, lng) {
  var radiusRadians = earthMetersToRadians(radius);
  
  var point = new s2.S2LatLng(lat, lng).normalized().toPoint();
  var height = (radiusRadians * radiusRadians) / 2;
  
  var region = new s2.S2Cap(point, height);
  
  // FINDING OUT HOW TO IMPLEMENT .getCovering()
  // var covering = s2.getCovering();
};