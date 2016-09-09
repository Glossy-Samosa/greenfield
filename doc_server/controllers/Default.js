'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.apiUserLogoutGET = function apiUserLogoutGET (req, res, next) {
  Default.apiUserLogoutGET(req.swagger.params, res, next);
};
