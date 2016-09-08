var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../db/models/users.js').User;


// this is our login fn, basically when you call passport.authenticate()
// in server.js, it'll do some magic and run this stuff
passport.use('login', new LocalStrategy(
  function(username, password, cb) {
    console.log('Authenticating .... ' + username);
    // look up our user
    User.findOne({ username: username }, function (err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password !== password) { return cb(null, false); }
      return cb(null, user);
    });
  }
));


passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});


passport.deserializeUser(function(id, cb) {
  console.log(id);
  Users.findOne({ username: id }, function(err, user) {
    if (err) { return cb (err); }
    cb (null, user);
  });
});  

