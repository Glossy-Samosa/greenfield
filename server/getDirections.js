var GoogleMapsLoader = require('google-maps'); 

// this fn will take two points and spit out google directions
 
// To use directions in the Google Maps JavaScript API, create an object of
// type DirectionsService and call DirectionsService.route() to initiate a request
// to the Directions service, passing it a DirectionsRequest object literal 
// containing the input terms and a callback method to execute upon receipt of the response.

// DirectionsRequest example:
// {
//   origin: LatLng | String | google.maps.Place,
//   destination: LatLng | String | google.maps.Place,
//   travelMode: TravelMode,
//   transitOptions: TransitOptions,
//   drivingOptions: DrivingOptions,
//   unitSystem: UnitSystem,
//   waypoints[]: DirectionsWaypoint,
//   optimizeWaypoints: Boolean,
//   provideRouteAlternatives: Boolean,
//   avoidHighways: Boolean,
//   avoidTolls: Boolean,
//   region: String
// }

var directionsService = new google.maps.DirectionsService();

// userlocation will be an object with a latitude and longitude property (can change later)
// destination will be an object with a latitude and longitude property (can change later)
// closestStation is an object from our db containing the bike station that is cloest to the user
  // for MVP, we are taking only the CLOSEST station to the user, and the CLOSEST
  // station to the destination and assuming those as our bike stations
// destClosestStation is an object from our db that represents the closest station 
// to the user's destination
var getDirections = function (userLocation, destination, userClosestStation, destClosestStation) {
  var userLocation = new google.maps.LatLng(userLocation.latitude, userLocation.longitude);
  var destination = new google.maps.LatLng(destination.latitude, destination.longitude);

  // we are going to send this waypts array with our request so that the route that
  // google gives us will go through these areas. this way, we make sure the bike
  // stations are included in the directions that we're giving to the user
  var waypts = [];
  // google says the waypoints have to be addresses
  // but we can use the google.maps.LatLng() instead
  waypts.push(new googlemaps.LatLng(userClosestStation.latitude, userClosestStation.longitude));
  waypts.push(new googlemaps.LatLng(destClosestStation.latitude, destClosestStation.longitude));

  var request = {
    origin: userLocation,
    destination: destination,
    // can we change this travelMode halfway during the trip?
    travelMode: 'WALKING',
    // google will take our waypoints and calculate
    // our userLocation -> destination INCLUDING
    // passage through the waypoints in the given order
    waypoints: waypts
  };

  directionsService.route(request, function(result, status) {
    // do something with the results here
  });
};