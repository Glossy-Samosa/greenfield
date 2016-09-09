// middleware to ensure that our user is authenticated

exports.authenticateUser = function(req, res, next) {
  if (!req.user) {
    // if the user doesn't have a session, gtfo
    return res.redirect('/');
  } else {
    next();
  }
};