var s2 = require('s2geometry-node')

// cell level
var level = 14;

exports.cellToken = function(lat, lng) {
	
	// convert latitude and longitude to radians
  var ll = new s2.S2LatLng(lat, lng);
  
  // create unique identifier in S2 cell decomposition
  var cell = new s2.S2CellId(ll);
  
  // convert cell id to compact text string suitable for indexing
  var token = cell.parent(level).toToken();
  
  return token;
};