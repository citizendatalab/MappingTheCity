var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var locationSchema 	  = new Schema({
  route            : [ { type: Schema.Types.ObjectId, ref: 'Route' } ],
  lat			  : Number,
  lng		: Number,
  name 				: String,
  tasks          : [{ type: Schema.Types.ObjectId, ref: 'Task' }]
},{collection:'locationList'});

module.exports = mongoose.model('Location', locationSchema);
