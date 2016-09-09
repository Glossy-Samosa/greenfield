var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../db/models/users.js').User;
var bcrypt = require('bcrypt');


// this is our login fn, basically when you call passport.authenticate()
// in server.js, it'll do some magic and run this stuff
passport.use('login', new LocalStrategy(
  function(username, password, cb) {
    console.log('Authenticating .... ' + username);
    // look up our user
    User.findOne({ username: username }, function (err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      // compare passwords
      bcrypt.compare(password, user.password, function(error, response) {
        if (error) {
          return cb(error);
        } else {
          return cb(null, user);
        }
      });
    });
  }
));

// this is called automatically by passport (?)
// and gives our user his/her session
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

// this does the reverse of serializeUser...
passport.deserializeUser(function(id, cb) {
  User.findOne({ username: id }, function(err, user) {
    if (err) { return cb (err); }
    cb (null, user);
  });
});  

