var jwt = require('jwt-simple');
var mongoose   = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');



defaultAdmin = {'email': 'admin@test.com', 'password': 'letmein'}
User.findOne({'email':defaultAdmin['email']} ,function(err, user) {
	if(!user){
		bcrypt.genSalt(10, function(err, salt) {

			bcrypt.hash(defaultAdmin['password'], salt, function(err, hash) {
				var newuser = new User({'email':defaultAdmin['email'], 'password': hash, 'role':'admin','active':true,'startedTasks': []});
				newuser.save();
			});
	  });
	}
});

