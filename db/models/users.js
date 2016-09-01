// mongoose Schema for all our users: username, password, etc.
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

exports.User = mongoose.model('User', userSchema);