var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../db/models/users.js').User;
var bcrypt = require('bcrypt');


// this is our signup fn, basically when you call passport.authenticate()
// in server.js, it'll do some magic and run this stuff
passport.use('signup', new LocalStrategy(
  function(username, password, cb) {
    console.log('Authenticating .... ' + username);
    // look up to see if user exists already
    User.findOne({ username: username }, function (err, user) {
      if (err) { return cb(err); }
      if (user) { return cb(null, false); }
      if (!user) {
        bcrypt.hash(password, 8, function(err, hash) {
          var newUser = new User({
            username: username,
            password: hash, 
          });

          newUser.save(function(err, results) {
            console.log('Saving new user...');
            return cb(null, results);
          });
        });        
      }
    });
  }
));
