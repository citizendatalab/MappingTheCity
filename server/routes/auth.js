var jwt = require('jwt-simple');
var mongoose   = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var Task = require('../models/task');
var tasks = require('./tasks.js');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var config = require('../config/config');

var auth = {

  login: function(req, res) {

    var email = req.body.email || '';
    var password = req.body.password || '';

    if (email == '' || password == '') {
      res.status(401).json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid

  	User.findOne({'email': email},function(err, user) {
  		if (err) console.log(err);

      var dbUserObj = user;
  		if (dbUserObj) {
  			bcrypt.compare(password, dbUserObj['password'], function(err, cryres) {
  				if(cryres == true){
  					  // If authentication is success, we will generate a token
  					  // and dispatch it to the client
  					  dbUserObj = dbUserObj.toObject();
  					  delete dbUserObj['password'];
  					  delete dbUserObj['__v'];
  					  res.json(genToken(dbUserObj));
  				} else {
  				  res.status(401).json({
  					"status": 401,
  					"message": "Invalid credentials"
  				  });
  				  return;
  				}
  			});
  		}
  		else{
  			res.status(401).json({
  				"status": 401,
  				"message": "Invalid credentials"
  			});
  			return;
  		}
  	});
  },

  register: function(req, res) {
	 var reqData = req.body;

  	User.findOne({'email':reqData['email']} ,function(err, user) {
  		if(user){
  			  res.status(401).json({
  				"status": 401,
  				"message": "Email-address already exists"
  			  });
  		}else{
  			bcrypt.genSalt(10, function(err, salt) {
  			// check if username exists already in db
    			bcrypt.hash(reqData['password'], salt, function(err, hash) {
    				var newuser = new User({'email':reqData['email'], 'username':reqData['username'], 'password': hash, 'role':'normal','active':true,'startedTasks': []});
    				newuser.save();
            newuser = newuser.toObject();
      			delete newuser['password'];
      			delete newuser['__v'];
      			res.json(genToken(newuser));
    			});
  		  });
  		}
  	});
  },

  forgot: function(req, res) {
    var reqData = req.body;
    var token = '';
    crypto.randomBytes(5, function(err, buf) { // Generate a reset token
      token = buf.toString('hex');
    });
    // Find the user who requested a reset
    console.log(reqData['email']);
    User.findOne({'email':reqData['email']}, function(err, user) {
      if (!user) {
        return res.status(404).json({
          "status": 404,
          "message": "Emailaddress does not exist"
          });
      }

    	bcrypt.genSalt(10, function(err, salt) {
      	bcrypt.hash(token, salt, function(err, hash) {
          user.password = hash;
          user.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        });
      });

      var mailCredentials = config.emailDetails
      console.log(mailCredentials)

      var transporter = nodemailer.createTransport({
        host: 'smtp.transip.email',
        port: 465,
        secure: true, // use SSL
        auth: mailCredentials
      });

      // Set up options reset email
      var mailOptions = {
        from: 'Password Reset <info@kijkeengezondewijk.nl>',
        to: user.email,
        subject: 'Password Reset',
        text: 'Je hebt een verzoek ingediend om je wachtwoord te resetten.\n\n' +
        'Je nieuwe wachtwoord is: ' + token + '\n\n' +
        'Nadat je hiermee hebt ingelogd kan je bij Profiel een nieuw wachtwoord instellen.\n\n\n\n' +
        'Met vriendelijke groet,\n\n' +
        'Het Kijk! team'
      };

      // Send the email
      transporter.sendMail(mailOptions, function(err, info) {
        if(err) { console.log(err); }
        else {
          console.log('success');
          // Send success if mail has been sent
          res.json({ success: 'An email has been sent to: ' + user.email +
          '. Click <a href="/login"><strong>here</strong></a> to return to login.'});
        }
      });
    });
  }
}

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires,
	user: user
  }, config.secret);

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  //return dateObj.setMinutes(dateObj.getMinutes() + 5);
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
