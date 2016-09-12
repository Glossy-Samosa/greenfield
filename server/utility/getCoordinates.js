var mongoose = require('mongoose');
var Station = require('../../db/models/stations').Station;
var db = mongoose.connection;
var getDistance = require('./distance');
var s2 = require('./s2');
var inRegion = require('./inRegion');
var getBikeStationData = require('./getBikeStationData');

// ==========================================================================================
// Returns JSON of user location, destination, and nearest bike stations to both.
// ==========================================================================================

exports.getCoordinates = function(req, res) {
  var currentLat = req.body.currentLocation.lat;
  var currentLon = req.body.currentLocation.lon;
  var destinationLat = req.body.destination.lat;
  var destinationLon = req.body.destination.lon;

  if ( !inRegion.inRegion(destinationLat, destinationLon) ) {
    
    res.sendStatus(404);

  } else {

    var data = {
      currentLocation: {
        lat: currentLat,
        lon: currentLon,
      },
      stationA: { // defaults to Powell St. BART: lat: 37.783871, lon: -122.408433
        name: 'Powell Street BART',
        lat: 37.783871,
        lon: -122.408433,
      },
      stationB: { // defaults to City Hall: lat: 37.778744, lon: -122.418104
        name: 'San Francisco City Hall',
        lat: 37.778744,
        lon: -122.418104,
      },
      destination: {
        lat: destinationLat,
        lon: destinationLon,
      },
    };

    var distance1 = getDistance.getDistance(data.currentLocation.lat, data.currentLocation.lon, data.stationA.lat, data.stationA.lon);
    var distance2 = getDistance.getDistance(data.stationB.lat, data.stationB.lon, data.destination.lat, data.destination.lon);

    // update bike station data
    getBikeStationData.getBikeStationData();

    // search db
    Station.find(function(err, stations) {
      if (err) { throw err; }

      stations.forEach(function(station) {
        if (station.availableBikes > 0) {
          if ( getDistance.getDistance(currentLat, currentLon, station.latitude, station.longitude) < distance1 ) {
            data.stationA.name = station.stationName;
            data.stationA.lat = station.latitude;
            data.stationA.lon = station.longitude;
            distance1 = getDistance.getDistance(currentLat, currentLon, station.latitude, station.longitude);
          }

          if ( getDistance.getDistance( data.destination.lat, data.destination.lon, station.latitude, station.longitude ) < distance2 ) {
            data.stationB.name = station.stationName;
            data.stationB.lat = station.latitude;
            data.stationB.lon = station.longitude;
            distance2 = getDistance.getDistance(data.destination.lat, data.destination.lon, station.latitude, station.longitude);
          }
        }        
      });
      
      return res.json(data);
    });
  
  }
};