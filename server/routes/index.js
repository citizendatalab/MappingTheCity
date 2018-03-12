var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/kijk_open');
//mongoose.connect('mongodb://localhost/mylocaldb');
//mongoose.connect('mongodb://localhost:4321/kijk');
var express = require('express');
var router = express.Router();
var path = require('path');

var auth = require('./auth.js');
var tasks = require('./tasks.js');
var category = require('./category.js');
var route = require('./routes.js');
var markers = require('./markers.js');
var user = require('./users.js');
var leaderboard = require('./leaderboard.js');

//require('../boot/seed.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/forgot', auth.forgot);

//Get all markers(public api) and corresponding tasks
router.get('/markers', markers.getAll);
router.get('/markersCsv', markers.getCsv);

router.get('/routes', route.getAllOpen);
router.get('/location/:id', markers.getLocationDataOpen);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/tasks/:id', tasks.getOne);
router.get('/api/v1/tasklist', tasks.getTaskList);
router.get('/api/v1/routeList', route.getAll);

//Get data from location
router.get('/api/v1/location/:id', markers.getLocationData);
//Add new markers
router.post('/api/v1/addMarker', markers.create);
router.post('/api/v1/addMarkerRoute', markers.routeCreate);

//This call can be used to retrieve general userinfo, and the list of ongoing and completed tasks
router.get('/api/v1/getUser/', user.getUserInfo);
router.post('/api/v1/updateUser/', user.updateUserInfo);
router.post('/api/v1/updatePassword/', user.updatePassword);

//Retrieve leaderboard  (all time)
router.get('/api/v1/getRankings/', leaderboard.getRankings);


//Categories 
router.get('/api/v1/getCategories/', category.getAllPublic);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */

 //Get all users info
router.get('/api/v1/admin/users', user.getAll);

//Create a new user as admin
router.post('/api/v1/admin/user/', user.create);

//Categories
router.get('/api/v1/admin/categories', category.getAll);
router.post('/api/v1/admin/updateCategory/', category.update);
//router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/category/', category.create);
//Retrieve all tasks for adminstrative purposes
router.get('/api/v1/admin/tasks', tasks.getAll);
router.post('/api/v1/admin/updateTask/', tasks.update);
//router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/task/', tasks.create);



//Routes
router.post('/api/v1/admin/routes/', route.create);
router.get('/api/v1/admin/routeList/', route.getAllAdmin);
router.post('/api/v1/admin/updateRoute/', route.update);

//Give tasks to users, wlll reset everything
router.get('/api/v1/admin/markers', markers.getCsvUser);

router.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


module.exports = router;
