'use strict';

var url = require('url');


var User = require('./UserService');


module.exports.apiUserSignupPOST = function apiUserSignupPOST (req, res, next) {
  User.apiUserSignupPOST(req.swagger.params, res, next);
};
