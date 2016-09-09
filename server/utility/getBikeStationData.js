var request = require('request');
var mongoose = require('mongoose');
var Station = require('../../db/models/stations').Station;

// this fn will get bike station data for the stations...
// should be run periodically to get fresh data for the user

// url to send the get request for bike station data
var bikeStationUrl = 'http://feeds.bayareabikeshare.com/stations/stations.json';

// get request for the bike station data
var getBikeStationData = function (callback) {
  request(bikeStationUrl, function(error, response, body) {
    // body should be the json text that you see at the website's url
      // body is a json stringified object that has a stationBeanList property
      // the stationBeanList property is an array of objects
      // each object represents a station and has relevant properties

    // parse the body so we know what's going on
    body = JSON.parse(body);

    // loop through stations and save each station to our database
    // we're basically going to store the data from the server,
    // and then we're going to add the google s2 code to them later
    body.stationBeanList.forEach(function(station) {
      var newStation = new Station({
        stationName: station.stationName,
        latitude: station.latitude,
        longitude: station.longitude,
        statusValue: station.statusValue,
        availableBikes: station.availableBikes,
        totalDocks: station.totalDocks,
      });

      // save the station to our db
      newStation.save(function(error) {
        if (error) {
          // do something on error
        }
      });
    });
  });

  if (callback) {
    callback();
  }
};

exports.getBikeStationData = getBikeStationData;