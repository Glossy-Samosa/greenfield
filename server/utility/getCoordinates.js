var mongoose = require('mongoose');
var Station = require('../../db/models/stations').Station;
// var getDistance = require('./distance');
var s2 = require('./s2');
var inRegion = require('./inRegion');
// var getBikeStationData = require('./getBikeStationData');

// ==========================================================================================
// Make sure req.body.currentLocation and req.body.destination are appropriately named below.
// ==========================================================================================
function deg2rad(deg) {
  return deg * (Math.PI/180)
};

var getDistance = function(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
};

exports.getCoordinates = function(req, res) {
  var currentLat = req.body.currentLocation.lat;
  var currentLon = req.body.currentLocation.lon;
  var destinationLat = req.body.destination.lat;
  var destinationLon = req.body.destination.lon;

  if ( !inRegion.inRegion(destinationLat, destinationLon) ) {
    
    console.alert( 'This is awkward. Looks like you\'re a teapot.' );

  } else {

    var data = {
      currentLocation: {
        lat: currentLat,
        lon: currentLon,
      },
      stationA: { // Powell St. BART
        lat: 37.783871,
        lon: -122.408433,
      },
      stationB: { // City Hall
        lat: 37.778744,
        lon: -122.418104,
      },
      destination: {
        lat: destinationLat,
        lon: destinationLon,
      },
    }
    var distance1 = getDistance(data.currentLocation.lat, data.currentLocation.lon, data.stationA.lat, data.stationA.lon);
    var distance2 = getDistance(data.stationB.lat, data.stationB.lon, data.destination.lat, data.destination.lon);

    // getBikeStationData();
      
    // iterate over each station document in the Station model
      // if the station has bikes available AND if the distance is less than previous bike station distance
        // get station A (B) to that station

    Station.find({}, function(err, stations) {
      
      if (err) throw err;

      stations.each(function(err, station) {
        if (station.availableBikes > 0) {
          if ( getDistance(currentLat, currentLon, station.latitude, station.longitude) < distance1 ) {
            data.stationA.lat = station.latitude;
            data.stationA.lon = station.longitude;
          }

          if ( getDistance(station.latitude, station.longitude, data.destination.lat, data.destination.lon) < distance2 ) {
            data.stationB.lat = station.latitude;
            data.stationB.lon = station.longitude;
          }
        }        
      })
    
    })

  return res.json(data);
  
  }
};