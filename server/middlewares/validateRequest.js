var jwt = require('jwt-simple');
var mongoose   = require('mongoose');
var User = require('../models/user');
var config = require('../config/config');

module.exports = function(req, res, next) {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe.

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();

  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];



  if (token !== 'null' && typeof token !== 'undefined') {

    try {

      var decoded = jwt.decode(token, config.secret);
      if (decoded.exp <= Date.now()) {
        res.status(400).json({
          "status": 400,
          "message": "Token Expired"
        });
        return;
      }

      // Authorize the user to see if s/he can access our resources
	  req.kijkDataUser = decoded.user.email;
	  User.findOne({'email': decoded.user.email},function(err, user) {
		  if (user) {
        req.kijkDataUserId = user['_id'];
  			if ((req.url.indexOf('admin') >= 0 && user.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {

  			  next(); // To move to next middleware
  			} else {
  			  res.status(403).json({
  				"status": 403,
  				"message": "Not Authorized"
  			  });
  			  return;
  			}
		  } else {
			// No user with this name exists, respond back with a 401
			res.status(401).json({
			  "status": 401,
			  "message": "Invalid User"
			});
			return;
		  }
	  });
    } catch (err) {
      res.status(500).json({
        "status": 500,
        "message": "Oops something went wrong",
        "error": err
      });
    }
  } else {
    res.status(401).json({
      "status": 401,
      "message": "Invalid Token or Key"
    });
    return;
  }
};
