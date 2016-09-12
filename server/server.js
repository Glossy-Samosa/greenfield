var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');
var bodyParser = require('body-parser');
var region = require('./routes/region');
var navigation = require('./routes/rideRequests');

// auth
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../db/models/users.js').User;
var login = require('./auth/loginAuth.js');
var signUp = require('./auth/signupAuth.js');
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
app.use(session({ secret: 'glossy-samosa' }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


//routing here
app.use('/api/region', region);
app.use('/api/navigation', navigation);

app.get('/', authenticateUser, function(req, res) {
  // if it reaches this point, we redirect them to user homepage
  // this isn't strictly necessary, just trying to protect homepage...
  res.status(200).send({ location: '/' });
});

// passport will automatically return 401 unauthorized status code on failed authentications
app.post('/api/user/signup', passport.authenticate('signup'),
  function(req, res) {
    console.log('Signup successful!');
    res.status(200).send({ location: '/' });
  });

app.post('/api/user/login', passport.authenticate('login'),
  function(req, res) {
    console.log('Login successful!');
    // redirect here when auth is successful
    res.status(200).send({ location: '/' });
  });

app.get('/api/user/logout', function(req, res) {
  // destroy user session on logout
  console.log(req.user);
  req.logout();
  res.status(200).send({ location: '/api/userlogin' });
});


// initialize our server
module.exports = app.listen(3000, function() {
  console.log('Listening on port 3000 ...');
});

