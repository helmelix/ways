#!/usr/bin/env node
var debug = require('debug')('restapi');

var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');
var log = require(libs + 'log')(module);
var app = require(libs + 'app');

app.set('port', process.env.PORT || config.get('port') || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + app.get('port'));
  log.info('Express server listening on port ' + app.get('port'));
});

var register = require(libs + 'servise-register/servise-register');
/*
register.getMongoServiseIp().then(function(response) {
	console.log("Address  =========  " + response );
});;
*/
//register.registerServiceInstance;

register.registerServiceInstance.then(function(response) {
	//var res = JSON.parse(response);
	console.log("registration  sucess ------------  " + response);
}, function(error) {
  console.error("registration failed ", error);
})

process.on('SIGINT', function() {
	console.log("process.on('SIGINT' deregisterService     ");
	register.deregisterService();
	setTimeout(function(){
		console.log("process.exit(0);");
		process.exit(0);
	},5000);
});
/*
process.on('SIGINT', function() {
	console.log("process.on('SIGINT' deregisterService     ");
	register.deregisterService().then(function(response) {
		console.log("deregistration  sucess ------------  " + response);
	}, function(error) {
		console.error("deregistration failed ", error);
	});
	process.exit(0);
});
*/