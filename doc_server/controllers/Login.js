'use strict';

var url = require('url');


var Login = require('./LoginService');


module.exports.apiUserLoginPOST = function apiUserLoginPOST (req, res, next) {
  Login.apiUserLoginPOST(req.swagger.params, res, next);
};
