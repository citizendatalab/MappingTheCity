var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var categorySchema 	  = new Schema({
  name 				: String,
  label				: String,
  color          : String
},{collection:'categoryList'});

module.exports = mongoose.model('Category', categorySchema);
