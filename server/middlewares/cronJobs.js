var jwt = require('jwt-simple');
var mongoose   = require('mongoose');
var User = require('../models/user');
var Task = require('../models/task');
var cron = require('node-cron');
var tasks = require('../routes/tasks.js')
var async           = require('async');



/*
exports.saveEndWeek = function () {
  cron.schedule('0 17 25 11 *', function(){
        User.find({}).select('-password').sort('-points.weekly').exec(function(err, allusers) {
          var currentDate = new Date()
          var winners = [allusers[0], allusers[1],allusers[2]];
          var satWinner = new satWinners({'type': 'finalResult', 'date':currentDate, 'topUsers': allusers, 'satWinners':winners})
          satWinner.save()
          console.log('winners selected');
        });
  });
};*/
