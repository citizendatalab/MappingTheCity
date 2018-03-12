var mongoose = require("mongoose");
var Task = require('../models/task');
var User = require('../models/user');
var Category = require('../models/category')
var tasks = {

  getAll: function(req, res) {
    Task.find({},{'startedBy': 0, '__v': 0, 'completedBy': 0}).populate({'path': 'category'}).exec(function(err, tasks){
		    res.json(tasks);
	  });
  },

  getTaskList: function(req, res) {

    Task.find({'active':true, 'partOf.direct': true},{'startedBy': 0, '__v': 0, 'completedBy': 0, 'archive': 0}).populate({'path': 'category'}).exec(function(err, tasks){
        res.json(tasks);
    });
    
  },

  getOne: function(req, res) {
    var id = req.params.id;
  	if (id) {
  		Task.find({'_id': id}).populate({'path': 'category'}).exec(function(err, task){
  			res.json(task);
  		});
  	}
  	else {
  	  res.status(401).json({
  		"status": 401,
  		"message": "Data format is wrong. Please include a task id"
  	  });
  	}
  },

  create: function(req, res) {
    var newTask = req.body;
  	if(newTask.hasOwnProperty('title') && newTask.hasOwnProperty('category') && newTask.hasOwnProperty('markerDescription') && newTask.hasOwnProperty('points')){
  		var addTask = new Task({'title':newTask['title'], 'markerDescription': newTask['markerDescription'],'category':mongoose.Types.ObjectId(newTask['category']['_id']), 'partOf': newTask['partOf'], 'scavengerQText':newTask['scavengerQText'],'normalQText':newTask['normalQText'], 'questions':newTask['questions'],'points':newTask['points'],'withPicture':newTask['withPicture'], 'active':newTask['active'] });
  		console.log(addTask);
  		 addTask.save();
      res.json(addTask);
  	}
  	else {
  		res.status(401).json({
  			"status": 401,
  			"message": "Data format is wrong. Not all required properties are included"
		  });
    }
  },
	update: function(req, res) {
    var updatedTask = req.body;
  	if(updatedTask.hasOwnProperty('title') && updatedTask.hasOwnProperty('category') && updatedTask.hasOwnProperty('markerDescription') && updatedTask.hasOwnProperty('points')){
  		id = updatedTask['_id']
  		Task.findOne({'_id': id}, function(err, task){
  			
  			task['title'] = updatedTask['title']; 
  			task['markerDescription'] = updatedTask['markerDescription'];
  			task['category'] = updatedTask['category'];
  			task['scavengerQText'] = updatedTask['scavengerQText'];
  			task['normalQText'] = updatedTask['normalQText'];
  			task['questions'] = updatedTask['questions'];
  			task['points'] = updatedTask['points'];
  			task['withPicture'] = updatedTask['withPicture'];
        task['active'] = updatedTask['active'];
        task['partOf'] = updatedTask['partOf'];
			task.save();
			res.json(task);
		});
  	}
  	else {
  		res.status(401).json({
  			"status": 401,
  			"message": "Data format is wrong. Not all required properties are included"
		  });
    }
  }
};


module.exports = tasks;
