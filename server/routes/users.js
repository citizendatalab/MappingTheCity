var mongoose = require("mongoose");
var User = require('../models/user');

var bcrypt = require('bcryptjs');

var users = {
  //Retrieve info from user
  getUserInfo: function(req, res) {
		var username = req.kijkDataUser;
		User.findOne({'email':username},{'password': 0, '__v': 0}).populate('startedTasks.task completedTasks markers routeMarkers').exec(function (err, user) { 
      user['active'] = true;
      user.save();
      res.json(user);
		});
  },
  updateUserInfo: function(req, res) {
		var username = req.kijkDataUser;
		var bodyData = req.body;
    if(bodyData.hasOwnProperty("userFirstTime") == false){
      bodyData['userFirstTime'] = false;
    }
   

    User.findOne({'email':username}, function (err, user) {

      if(bodyData['name'] != user['userInfo']['name']) {
        user['userInfo']['name'] = bodyData['name'];
      }
      if(bodyData['userFirstTime'] != user['userInfo']['userFirstTime']){
        user['userInfo']['userFirstTime'] = bodyData['userFirstTime'];
      }
      if(bodyData['ageClass'] != user['userInfo']['ageClass']){
        user['userInfo']['ageClass'] = bodyData['ageClass'];
      }
      if(bodyData['gender'] != user['userInfo']['gender']) {
        user['userInfo']['gender'] = bodyData['gender'];
      }
      if(bodyData['workStatus'] != user['userInfo']['workStatus']){
        user['userInfo']['workStatus'] = bodyData['workStatus'];
      }
      if(bodyData['zipcode'] != user['userInfo']['zipcode']){
        user['userInfo']['zipcode'] = bodyData['zipcode'];
      }
      if(bodyData['yearsInNeigbourhood'] != user['userInfo']['yearsInNeigbourhood']){
        user['userInfo']['yearsInNeigbourhood'] = bodyData['yearsInNeigbourhood'];
      }

      if (user['userInfo']['gender'] !== null && user['userInfo']['ageClass'] !== null && user['userInfo']['workStatus'] !== null && user['userInfo']['zipcode'] !== null && user['userInfo']['yearsInNeigbourhood'] !== null) {
        user['userInfo']['complete'] = true;
      } else {
        user['userInfo']['complete'] = false;
      }
      user.save();
      res.status(200).end();
    });
  },

  updatePassword: function(req, res) {
		var username = req.kijkDataUser;
		var bodyData = req.body;

    User.findById(bodyData.id, function(err, user) {
      if (err) console.log(err);
      var dbUserObj = user;
      bcrypt.compare(bodyData['currentPassword'], dbUserObj['password'], function(err, cryres) {
        if(cryres == true){
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(bodyData['newPassword'], salt, function(err, hash) {
              if(hash && hash != user['password']){
                user['password'] = hash;
              }
              user.save();
              res.status(200).end();
            });
          });
        } else {
          res.status(401).json({
          "status": 401,
          "message": "Invalid credentials"
          });
          return;
        }
      });
    });
  },
  getAll: function(req, res) {
    console.log('test')
	  User.find({},{'password': 0, '__v': 0}, function(err, users){
		    res.json(users);
	  });
  },

  create: function(req, res) {
	var reqData = req.body;

	User.findOne({'username':reqData['username']} ,function(err, user) {
		if(user){
			  res.status(409).json({
				"status": 409,
				"message": "Username already exists"
			  });
		}else{
			bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(reqData['password'], salt, function(err, hash) {
				var newuser = new User({'email':reqData['email'], 'username':reqData['username'], 'password': hash, 'role':'admin', 'startedTasks': [mongoose.Types.ObjectId('5641ea70c5a091d01dc4071b')]});
				newuser.save();
				res.json(newuser);
			});
		});
		}
	});
  },
  //Retrieve info from user
  getWinners: function(req, res) {
    dailyWinners.find({}).sort('-date').exec(function (err, winners) {
      res.json(winners);
    });
  },
  getSatWinners: function(req, res) {
    satWinners.find({}).exec(function (err, satwinners) {
      res.json(satwinners);
    });
  },
};



module.exports = users;
