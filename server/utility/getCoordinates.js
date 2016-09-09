var getDistance = require('./distance');
var s2 = require('./s2');
var inRegion = require ('./inRegion');
var getBikeStationData = require ('./getBikeStationData');

// ==========================================================================================
// Make sure req.body.currentLocation and req.body.destination are appropriately named below.
// ==========================================================================================


var getCoordinates = function(req, res) {
  var currentLat = req.body.currentLocation.lat;
  var currentLon = req.body.currentLocation.lon;
  var destinationLat = req.body.destination.lat;
  var destinationLon = req.body.destination.lon;

  if ( !inRegion(destinationLat, destinationLon) ) {
    
    console.alert( 'This is embarrassing. We don\'t have any bikes near your destination. Better just hoof it.' );

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
      distance1: getDistance(res.data.currentLocation.lat, res.data.currentLocation.lon, res.data.stationA.lat, res.data.stationA.lon),
      distance2: getDistance(res.data.stationB.lat, res.data.stationB.lon, res.data.destination.lat, res.data.destination.lon)
    }

    getBikeStationData(function(bikeStations) {
      
      bikeStations.forEach(function(station) {
        
        if (station.availableBikes > 0) {
          if ( getDistance(currentLat, currentLon, station.latitude, station.longitude) < distance1 ) {
            res.data.stationA.lat = station.latitude;
            res.data.stationA.lon = station.longitude;
          }

          if ( getDistance(station.latitude, station.longitude, res.data.destination.lat, res.data.destination.lon) < distance2 ) {
            res.data.stationB.lat = station.latitude;
            res.data.stationB.lon = station.longitude;
          }
        }
      })
    });

  return res.json(data);
  
  }
};


exports.getCoordinates = getCoordinates;