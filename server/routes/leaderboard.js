
var mongoose = require("mongoose");
var User = require('../models/user');

//EXCLUDE THESE USERS
var userExclusion = [mongoose.Types.ObjectId("59061b5fc954178d112a0ecc")];

var leaderboard = {
  //Retrieve info user without populating any other fields
  getRankings: function(req, res) {
  		var returnJson = {'daily': [], 'total':[]}
		User.find({'active': true, '_id': {'$nin': userExclusion}}, 'points.total userInfo.name _id', {sort:{'points.total':-1}}, function (err, totallead) {
			returnJson['total'] = totallead
			User.find({'active': true, '_id': {'$nin': userExclusion}}, 'points.daily userInfo.name _id', {sort:{'points.daily':-1}}, function (err, dailylead) {
				returnJson['daily'] = dailylead
				res.json(returnJson);
			});
	
		});
  }
};

module.exports = leaderboard;
