var mongoose = require('mongoose');
var Station = require('../../db/models/stations').Station;
var getDistance = require('./distance');
var s2 = require('./s2');
var inRegion = require('./inRegion');
var getBikeStationData = require('./getBikeStationData');

// ==========================================================================================
// Make sure req.body.currentLocation and req.body.destination are appropriately named below.
// ==========================================================================================

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
      stationA: { // defaults to Powell St. BART: lat: 37.783871, lon: -122.408433
        lat: null,
        lon: null,
      },
      stationB: { // defaults to City Hall: lat: 37.778744, lon: -122.418104
        lat: null,
        lon: null,
      },
      destination: {
        lat: destinationLat,
        lon: destinationLon,
      },
    }
    var distance1 = getDistance.getDistance(data.currentLocation.lat, data.currentLocation.lon, data.stationA.lat, data.stationA.lon);
    var distance2 = getDistance.getDistance(data.stationB.lat, data.stationB.lon, data.destination.lat, data.destination.lon);

    // update bike station data
    getBikeStationData.getBikeStationData();

    Station.find({}, function(err, stations) {
      
      if (err) throw err;

      stations.each(function(err, station) {
        if (station.availableBikes > 0) {
          if ( getDistance.getDistance(currentLat, currentLon, station.latitude, station.longitude) < distance1 ) {
            data.stationA.lat = station.latitude;
            data.stationA.lon = station.longitude;
          }

          if ( getDistance.getDistance(station.latitude, station.longitude, data.destination.lat, data.destination.lon) < distance2 ) {
            data.stationB.lat = station.latitude;
            data.stationB.lon = station.longitude;
          }
        }        
      })
    
    })

  return res.json(data);
  
  }
};