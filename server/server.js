var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');
var bodyParser = require('body-parser');
var region = require('./routes/region');

// auth
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../db/models/users.js').User;
var login = require('./auth/loginAuth.js');
var signUp = require('./auth/signUpAuth.js');
var authenticateUser = require('./auth/authUser.js');

var app = express();


// open mongoose connection
mongoose.connect('mongodb://localhost/uberEco');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Database connected');
});

// middleware
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


//routing here
app.use('/api/region', region);

app.post('/auth/signup', passport.authenticate('signup', {failureRedirect: '/signupFailure'}),
  function(req, res) {
    console.log('Signup successful!');
    res.redirect('/');
  });

app.post('/auth/login', passport.authenticate('login', { failureRedirect: '/loginFailure' }),
  function(req, res) {
    console.log('Login successful!');
    // redirect here when auth is successful
    res.redirect('/');
  });

app.get('/auth/logout', function(req, res) {
  // destroy user session on logout
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});



// initialize our server
module.exports = app.listen(3000, function() {
  console.log('Listening on port 3000...');
});

