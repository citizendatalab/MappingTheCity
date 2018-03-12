var mongoose = require("mongoose");
var Marker = require('../models/marker');
var MarkerRoute = require('../models/markerRoute');
var User = require('../models/user');
var Task = require('../models/task');
var tasks = require('./tasks.js');
var Route = require('../models/route');
var json2csv = require('json2csv');
var shortid = require('shortid');
//EXCLUDE THESE USERS
var userExclusion = [mongoose.Types.ObjectId("59061b5fc954178d112a0ecc")];


var markers = {
 //API call
  getAll: function(req, res) {

  	//Marker.find({'task':{'$in': taskInclusion}, 'addedBy': {'$nin':userExclusion}},{'addedBy':0, '__v':0}).populate('task', '-__v -completedBy -startedBy -archive').exec(function(err, markers){
  	Marker.find({'addedBy': {'$nin':userExclusion}},{'addedBy':0,'__v':0}).populate([{path:'task'}]).exec(function(err, markers){

  		res.json(markers);
  	});
  },

   getLocationDataOpen: function(req, res) {	
  	var locationid = req.params.id;
  	//Marker.find({'task':{'$in': taskInclusion}, 'addedBy': {'$nin':userExclusion}},{'addedBy':0, '__v':0}).populate('task', '-__v -completedBy -startedBy -archive').exec(function(err, markers){
  	MarkerRoute.find({'location': locationid, 'addedBy': {'$nin':userExclusion}},{'__v':0, 'addedBy':0}).populate([{path:'answers.task'}]).exec(function(err, markers){
  		res.json(markers);
  	});
  },

  getLocationData: function(req, res) {	
  	var locationid = req.params.id;
  	//Marker.find({'task':{'$in': taskInclusion}, 'addedBy': {'$nin':userExclusion}},{'addedBy':0, '__v':0}).populate('task', '-__v -completedBy -startedBy -archive').exec(function(err, markers){
  	MarkerRoute.find({'location': locationid, 'addedBy': {'$nin':userExclusion}},{'__v':0, 'addedBy':0}).exec(function(err, markers){
  		res.json(markers);
  	});
  },
  getCsvUser: function(req, res) {

  	var fromDate = req.query['startDate'];
  	var endDate = req.query['endDate'];
  	var category = req.query['categoryString'].split(',');


  	//QUERY ON DATA + Category
  	Marker.find({"date": {'$gte': fromDate, '$lt': endDate}, 'addedBy': {'$nin':userExclusion}}).populate([{path:'task', match:{'category':{'$in':category}}},{path:'addedBy'}]).exec(function(err, markers){
  		markers = markers.filter(function(marker){
            return marker.task.length;
        });

  		allMarkers = []
  		markers.forEach(function(marker) {
		    var markerObject = marker;
		    if(marker.answers.length == 1){
		    	markerObject['answer'] = marker.answers[0]['value']
		    	markerObject['code'] = marker.answers[0]['code']
		    	allMarkers.push(markerObject);
		    }else if(marker.answers.length > 1){
		    	for(i=0; i<marker.answers.length; i++){
		    		var extraObject = {}
		    		extraObject['type'] = marker['type'];
		    		extraObject['lat'] = marker['lat'];
		    		extraObject['lng'] = marker['lng'];
		    		extraObject['address'] = marker['address'];
		    		extraObject['date'] = marker['date'];
		    		extraObject['task'] = marker['task'];
		    		extraObject['addedBy'] = marker['addedBy'];
		    		extraObject['answer'] = marker.answers[i]['value'];
		    		extraObject['code'] = marker.answers[i]['code'];
		    		allMarkers.push(extraObject);
		    	}
		    }else if(marker.answers.length == 0){
		    	markerObject['answer'] = ''
		    	markerObject['code'] = ''
		    	allMarkers.push(markerObject);
		    }
		});

  		var fields = ['type', 'lat', 'lng', 'address', 'answer', 'code', 'date', 'addedBy[0]._id', 'addedBy[0].userInfo.name', 'addedBy[0].userInfo.gender', 'addedBy[0].userInfo.ageClass', 'addedBy[0].userInfo.workStatus', 'addedBy[0].userInfo.zipcode','addedBy[0].userInfo.yearsInNeigbourhood','task[0].title', 'task[0].category', 'task[0].points'];
  		var fieldNames = ['Type','Latitude', 'Longitude', 'Address', 'Answer', 'Code' ,'Date', 'User id', 'User name', 'User gender', 'User age', 'User workstatus', 'User zipcode', 'User YearsInNeighbourhood', 'Task name', 'Task category', 'Task points']
  		try {
		  var result = json2csv({ data: allMarkers, fields: fields, fieldNames:fieldNames });
		  res.set('Content-Type', 'application/octet-stream');
		  res.send(result);
		} catch (err) {
		  // Errors are thrown for bad options, or if the data is empty and no fields are provided.
		  // Be sure to provide fields if it is possible that your data array will be empty.
		  console.error(err);
		}
  	});
  },

  getCsv: function(req, res) {

  	var fromDate = req.query['startDate'];
  	var endDate = req.query['endDate'];
  	var category = req.query['categoryString'].split(',');

  	//QUERY ON DATE + Category
  	Marker.find({"date": {'$gte': fromDate, '$lt': endDate}},{'addedBy':0, '__v':0}).populate({path:'task', match:{'category':{'$in':category}}}).exec(function(err, markers){

  		markers = markers.filter(function(marker){
            return marker.task.length;
        });
        allMarkers = []
  		markers.forEach(function(marker) {
		    var markerObject = marker;
		    if(marker.answers.length == 1){
		    	markerObject['answer'] = marker.answers[0]['value']
		    	markerObject['code'] = marker.answers[0]['code']
		    	allMarkers.push(markerObject);
		    }else if(marker.answers.length > 1){
		    	for(i=0; i<marker.answers.length; i++){
		    		var extraObject = {}
		    		extraObject['type'] = marker['type'];
		    		extraObject['lat'] = marker['lat'];
		    		extraObject['lng'] = marker['lng'];
		    		extraObject['address'] = marker['address'];
		    		extraObject['date'] = marker['date'];
		    		extraObject['task'] = marker['task'];
		    		extraObject['answer'] = marker.answers[i]['value'];
		    		extraObject['code'] = marker.answers[i]['code'];
		    		allMarkers.push(extraObject);
		    	}
		    }else if(marker.answers.length == 0){
		    	markerObject['answer'] = ''
		    	markerObject['code'] = ''
		    	allMarkers.push(markerObject);
		    }
		});
  		var fields = ['type', 'lat', 'lng', 'address', 'answer', 'code', 'date', 'task[0].title', 'task[0].category', 'task[0].points'];
  		var fieldNames = ['Type', 'Latitude', 'Longitude', 'Address', 'Answer', 'Code', 'Date', 'Task name', 'Task category', 'Task points']

  		try {

		  var result = json2csv({ data: allMarkers, fields: fields, fieldNames:fieldNames });
		  res.set('Content-Type', 'application/octet-stream');
		  res.send(result);
		} catch (err) {
		  // Errors are thrown for bad options, or if the data is empty and no fields are provided.
		  // Be sure to provide fields if it is possible that your data array will be empty.
		  console.error(err);
		}
  	});
  },


  //TODO -> Check error handling on this
  create: function(req, res) {
  	var userId = req.kijkDataUserId
    var newMarker = req.body;
  	newMarker.date = new Date();
    if(newMarker.photoIncluded == true){
      for(answer in newMarker['answers']){
        if(typeof(newMarker['answers'][answer]) == 'string'){
          if(newMarker['answers'][answer].startsWith('data:image/jpeg;base64')){
            var base64Data = newMarker['answers'][answer].replace(/^data:image\/jpeg;base64,/, "");
            var imageName = shortid.generate() + '.jpg';
            require("fs").writeFile('public/assets/img/upload/'+imageName, base64Data, 'base64', function(err) {
              console.log(err);
            });
            newMarker['answers'][answer] = imageName;
          } 
        } 
      }
    }

  	var addMarker = new Marker({'task':mongoose.Types.ObjectId(newMarker['task']),'type':newMarker['type'], 'lat': newMarker['lat'], 'lng': newMarker['lng'], 'address': newMarker['address'], 'answers': newMarker['answers'], 'date': newMarker['date'], 'addedBy':mongoose.Types.ObjectId(userId)});
    addMarker.save();
    var markerId = addMarker['_id'];

    Task.find({'_id':mongoose.Types.ObjectId(newMarker['task'])}, function(err, task){
      var addPoints = task[0]['points'];
       User.update({'_id':userId}, {$push: {markers: mongoose.Types.ObjectId(markerId)}, $inc:{'dailyCount': 1, 'points.total': addPoints, 'points.weekly': addPoints, 'points.daily': addPoints}}, function(err, docs){
        res.json(newMarker);
      });
    });

   
  },
  routeCreate: function(req, res) {
    var userId = req.kijkDataUserId
    var newMarkerRoute = req.body;
    newMarkerRoute.date = new Date();
    for(task in newMarkerRoute['answers']){
      if(newMarkerRoute['answers'][task].photoIncluded == true){
        for(answer in newMarkerRoute['answers'][task]['answers']){
          if(typeof(newMarkerRoute['answers'][task]['answers'][answer]) == 'string'){
            if(newMarkerRoute['answers'][task]['answers'][answer].startsWith('data:image/jpeg;base64')){
              newMarkerRoute['answers'][task]['answers'][answer];
              var base64Data = newMarkerRoute['answers'][task]['answers'][answer].replace(/^data:image\/jpeg;base64,/, "");
              var imageName = shortid.generate() + '.jpg';
              require("fs").writeFile('public/assets/img/upload/'+imageName, base64Data, 'base64', function(err) {
                console.log(err);
              });
              newMarkerRoute['answers'][task]['answers'][answer] = imageName;
            } 
          } 
        }
      }
    };
    //50punten per locatie
    //100 punten bij afronden route

    var addMarkerRoute = new MarkerRoute({
      'answers': newMarkerRoute['answers'],
      'date': newMarkerRoute['date'],
      'route': newMarkerRoute['route'],
      'location': newMarkerRoute['location'],
      'distance': newMarkerRoute['distance'],
      'accuracy': newMarkerRoute['accuracy'],
      'addedBy':mongoose.Types.ObjectId(userId)});

    addMarkerRoute.save(function() {
    var markerRouteId = addMarkerRoute['_id'];
	  var addPoints = 50;
	  MarkerRoute.find({'addedBy': userId, 'route': newMarkerRoute['route']},{'__v':0}).populate({path:'route'}).exec(function(err, markersRoute){
	    	userUpdateObject = {'$push': {'routeMarkers': mongoose.Types.ObjectId(markerRouteId)}}
	    
	    	if(markersRoute.length == markersRoute[0]['route']['locations'].length){

	    		addPoints += markersRoute[0]['route']['points'];
	    		userUpdateObject['$push']['completedRoutes'] = newMarkerRoute['route'];
	    	}
	    	userUpdateObject['$inc'] ={'dailyCount': 1, 'points.total': addPoints, 'points.weekly': addPoints, 'points.daily': addPoints}

	    	User.update({'_id':userId}, userUpdateObject, function(err, docs){
	    		res.json(newMarkerRoute);
	    	});

	    });
    });
  }
};

module.exports = markers;
