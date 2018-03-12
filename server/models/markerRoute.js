var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var markerRouteSchema 	  = new Schema({
  route             : { type: Schema.Types.ObjectId, ref: 'Route' },
  location	        : { type: Schema.Types.ObjectId, ref: 'Location' },
  answers           : [{'task': { type: Schema.Types.ObjectId, ref: 'Task' }, 'answers': Array}],
  date              : Date,
  distance			: Number,
  accuracy			: Number, 
  addedBy           : { type: Schema.Types.ObjectId, ref: 'User' }
},{collection:'markerRouteList'});

module.exports = mongoose.model('MarkerRoute', markerRouteSchema);
