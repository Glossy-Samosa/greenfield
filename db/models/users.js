// mongoose Schema for all our users: username, password, etc.
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
});

exports.User = mongoose.model('User', userSchema);