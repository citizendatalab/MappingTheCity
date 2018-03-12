var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var userSchema   = new Schema({
	email			: String,
	username		: String,
	role			: String,
	password      	: String,
	userInfo		: {
		complete: {type: Boolean, default: false},
		name:{type: String, default: 'Anoniem' },
		gender: {type: String, default: null },
		ageClass:{type: String, default: null },
		workStatus: {type: String, default: null },
		zipcode: {type: String, default: null },
		userFirstTime 	: {type: Boolean, default: true},
		yearsInNeigbourhood: {type: Number, default: null }
	},
	markers			: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Marker' } ],
	routeMarkers : [ { type: mongoose.Schema.Types.ObjectId, ref: 'MarkerRoute' } ],
	completedRoutes :[ { type: mongoose.Schema.Types.ObjectId, ref: 'Route' }],
	points			: {total:{type: Number, default: 0 }, weekly:{type: Number, default: 0 }, daily:{type: Number, default: 0 }},
	token			: String,
	active			: {type: Boolean, default: false},
	dailyCount		: {type: Number, default: 0 }
},{collection:'authColl'});

module.exports = mongoose.model('User', userSchema);
