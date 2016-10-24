var mongoose = require('mongoose');

var libs = process.cwd() + '/libs/';

var log = require(libs + 'log')(module);
var config = require(libs + 'config');
var register = require(libs + 'servise-register/servise-register');


register.getMongoServiseIp.then(function(response) {
	var res = JSON.parse(response);
	console.log("Address  ------------  " + res[0].Address );
	return res[0].Address;
}).catch(function(err) {
	console.log('err getting host ip');
	return config.get('mongoose:uri');
}).then(function(response) {
	
	mongoose.connect(response);

	var db = mongoose.connection;

	db.on('error', function (err) {
		log.error('Connection error:', err.message);
	});

	db.once('open', function callback () {
	log.info("Connected to DB!");
	
});
	
	
})



module.exports = mongoose;