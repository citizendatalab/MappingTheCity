var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var taskSchema 	  = new Schema({
  title           : String,
  markerDescription  : String,
  category         : { type: Schema.Types.ObjectId, ref: 'Category' },
  scavengerQText   : String,
  normalQText      : String,
  questions        :Array,
  points          : Number,
  active   : {type: Boolean, default: true},
  withPicture   : {type: Boolean, default: false},
  partOf    : {'route':{type: Boolean, default:false},'direct':{type: Boolean, default:false}},
  archive         : [ { type: Schema.Types.ObjectId, ref: 'User' } ],
},{collection:'taskList'});

module.exports = mongoose.model('Task', taskSchema);
