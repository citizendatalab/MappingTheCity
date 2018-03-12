var mongoose = require("mongoose");
var Route = require('../models/route');
var Place = require('../models/location');
var User = require('../models/user');
var async  = require('async');


var routes = {
 //API call
  getAll: function(req, res) {
	Route.find({'active': true},{'completedBy':0, '__v':0}).sort({title: 1}).populate([{path:'locations', populate: {path:'tasks', model: 'Task'}}]).exec(function(err, allRoutes){
		res.json(allRoutes);
	 });
  },
  getAllAdmin: function(req, res) {
  Route.find({},{'completedBy':0, '__v':0}).sort({title: 1}).populate([{path:'locations', populate: {path:'tasks', model: 'Task'}}]).exec(function(err, allRoutes){
    res.json(allRoutes);
   });
  },
  getAllOpen: function(req, res) {
  Route.find({'active': true},{'completedBy':0, '__v':0}).populate({path:'locations'}).exec(function(err, allRoutes){
    
    res.json(allRoutes);
   });
  },


  //TODO -> Check error handling on this
  create: function(req, res) {
    var newRoute = req.body;

    activeRoute = (newRoute['active'] == "true");
    
  	var addRoute = new Route({ 'title':newRoute['title'], 'points':newRoute['points'],'lineString':newRoute['lineString'], 'locations': [], 'active': activeRoute});
    routeId = addRoute['_id'];
    console.log(routeId)
    locationList = [];
    for(i=0; i<newRoute['locations'].length; i++){
      taskList =  newRoute['locations'][i]['tasks'].map(j => mongoose.Types.ObjectId(j._id));
      var newPlace = new Place({'route': mongoose.Types.ObjectId(routeId), 'lat': newRoute['locations'][i]['lat'], 'lng':newRoute['locations'][i]['lng'], 'tasks':taskList, 'name':newRoute['locations'][i]['name']})
      locationList.push(mongoose.Types.ObjectId(newPlace['_id']));
      newPlace.save();
    }
    addRoute['locations'] = locationList;
    addRoute.save();

    res.json(addRoute);
  },

  update: function(req, res) {
    var updatedRoute = req.body;
    if(updatedRoute.hasOwnProperty('title')){
      id = updatedRoute['_id']
      
     
      Route.findOne({'_id': id}, function(err, route){
        route['title'] = updatedRoute['title']; 
        route['points'] = updatedRoute['points'];
        //route['tasks'] = taskList;
        route['lineString'] = updatedRoute['lineString'];
        //route['locations'] = updatedRoute['locations'];
        route['active'] = updatedRoute['active'];
        
        var locationList = [];

        async.each(updatedRoute['locations'], function(item, callback) {
          
          
          var newLat = item['lat'];
          var newLng = item['lng'];
          var newName = item['name'];
          var taskList =  item['tasks'].map(j => mongoose.Types.ObjectId(j._id));
          //console.log(taskList)
          if( '_id' in item){
            var locId = item['_id'];
            locationList.push(mongoose.Types.ObjectId(locId));
            Place.findOne({'_id': locId}, function(err, place){
               place['lat'] = newLat;
               place['lng'] = newLng;
               place['name'] = newName;
               place['tasks'] = taskList;
               //console.log(place);
               place.save();
              callback();
            }); 
          }
          else {
            var newPlace = new Place({'route': mongoose.Types.ObjectId(id), 'tasks':taskList, 'lat': item['lat'], 'lng':item['lng'], 'name':item['name']})
            locationList.push(mongoose.Types.ObjectId(newPlace['_id']));
            newPlace.save();
            callback();
          }
        }, function done() {
            route['locations'] = locationList;
            route.save();
            res.json(route);
        });

      });
    }
    else {
      res.status(401).json({
        "status": 401,
        "message": "Data format is wrong. Not all required properties are included"
      });
    }
  },


};

module.exports = routes;
