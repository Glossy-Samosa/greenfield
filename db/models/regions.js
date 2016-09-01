// mongoose Schema to store s2 codes of san francisco so we can
// quickly determine whether a user is in our serviceable area
var mongoose = require('mongoose');

var regions = mongoose.Schema({
  name: String,
  
})