var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var markerSchema 	  = new Schema({
  task            : [ { type: Schema.Types.ObjectId, ref: 'Task' } ],
  lat             : Number,
  lng             : Number,
  address         : String,
  type 			  : String,
  answers         : Array,
  date            : Date,
  photo			      : Boolean,
  addedBy         : [ { type: Schema.Types.ObjectId, ref: 'User' } ]
},{collection:'markerList'});

module.exports = mongoose.model('Marker', markerSchema);
