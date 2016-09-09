// middleware to ensure that our user is authenticated

var authenticateUser = function(req, res, next) {
  if (!req.user) {
    // if the user doesn't have a session, gtfo
    return res.redirect('/login');
  } else {
    next();
  }
};

module.exports = authenticateUser;