var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var driveRoute = new mongoose.Schema({
	
	"driver_id" :{ type: String, 
					required: true },
	"stored-path": { type: String },
	"stored-description": { type: String },
	"stored-phone": { type: String },
	"stored-name": { type: String },
	"stored-start-city": { type: String },
	"stored-end-city": { type: String },
	"stored-inter-city": { type: String },
	"stored-directions": { type: String },
	"stored-start-id": { type: String },
	"stored-end-id": { type: String },
	"stored-date": { type: String },
	"stored-is-one-date": { type: String },
	"stored-middle-countries": { type: String }


});

mongoose.model('DriveRoute',driveRoute,'driveRoute');

module.exports = mongoose.model('DriveRoute',driveRoute,'driveRoute');;

exports.DriveRoute = function(db) {
  return db.model('DriveRoute');
};