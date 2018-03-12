var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var routeSchema 	  = new Schema({
  title           : String,
  category         : String,
  locations        :[{ type: Schema.Types.ObjectId, ref: 'Location' }],
  tasks          : [{ type: Schema.Types.ObjectId, ref: 'Task' }], //HAS TO BE REMOVED!
  active   : {type: Boolean, default: true},
  points          : Number,
  lineString		: Array,
  completedBy     : [ {'user': { type: Schema.Types.ObjectId, ref: 'User' }, 'date': { type: Date, default: Date.now }, _id:false} ],
  archive         : [ { type: Schema.Types.ObjectId, ref: 'User' } ],
},{collection:'routeList'});

module.exports = mongoose.model('Route', routeSchema);
