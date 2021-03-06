var mongoose = require('mongoose');
var util = require('util');
var libs = process.cwd() + '/libs/';

var log = require(libs + 'log')(module);
var config = require(libs + 'config');
var register = require(libs + 'servise-register/servise-register');

function getMongoConnectIp(){
	console.log('getMongoConnectIp -----------   ');
	return register.getMicroServiseData('mongo').then(function(response) {
	var res = JSON.parse(response);
	console.log("Address  ------------  " + res[0].ServiceAddress );
	return res[0].ServiceAddress;
	}).catch(function(err) {
		console.log('getMongo -> err getting host ip');
		return config.get('default:mongoose:ip');
	});
}

/*
register.getMongoServiseIp.then(function(response) {
	var res = JSON.parse(response);
	console.log("Address  ------------  " + res[0].ServiceAddress );
	return res[0].ServiceAddress;
}).catch(function(err) {
	console.log('getMongo -> err getting host ip');
	return config.get('mongoose:ip');
}).then(function(response) {
*/	

getMongoConnectIp().then(function(response) {
	var isConnectedBefore = false;
	var mongoConnectRetries = 0;
	var isAttempingConnect = false;
	var connect = function(mongoIp) {
		console.log('try connect : ' + "mongodb://" +mongoIp + ":27017/roadsDb");
		mongoose.connect("mongodb://" +mongoIp + ":27017/roadsDb", {server: { auto_reconnect: true, reconnectTries: Number.MAX_VALUE  }});
		//mongoose.connect("mongodb://" +mongoIp + ":27017/roadsDb");
		isAttempingConnect = false;
		//console.log('-+++++++++---mongoose  :' , mongoose);
	};

	connect(response);
	
	var db = mongoose.connection;
	
	db.on('error', function (err) {
		isAttempingConnect = true;
		setTimeout(function(){
		//console.log('---------mongoose  :' , mongoose);
			console.log('---------mongoose  error ');
			if ( 2 === mongoose.connection.readyState){
				console.log('---------allready connecting  :');
			} 
			else {
				console.log('mongoose.connection.readyState  :', mongoose.connection.readyState);
			db.close(function () {
				log.error('Connection error:', err.message);
				
				//isAttempingConnect = true;
				//mongoose.disconnect();
				if (mongoConnectRetries >= 5){
					console.log('mongoConnectRetries exhaust');
					mongoConnectRetries = 0;
					//db.close();
					//mongoose.disconnect();
					getMongoConnectIp().then(function(response) {
						//isAttempingConnect = false;
						connect(response);
					});
				} else {
					console.log('--------try reconnect...');
					//setTimeout(function(){
						console.log('try reconnect...');
						mongoConnectRetries++;
						//isAttempingConnect = false;
						return connect(response);
						//db = mongoose.connection;
					//}, 5000);
				}
				
			});
			}
		},5000);
	});
	
	db.on('disconnected', function(){
		console.log('Lost MongoDB connection... disconnected');
		/*
		console.log('mongoose.connection.readyState', mongoose.connection.readyState);
		if (mongoose.Connection.STATES.connecting === mongoose.connection.readyState){
			console.log("db.on'disconnected'.. isAttempingConnect:", isAttempingConnect);
		} 
		else {
			console.log("db.on'disconnected'.. isAttempingConnect:", isAttempingConnect)
			
		isAttempingConnect = true;
		setTimeout(function(){
			
			if (mongoose.Connection.STATES.connected === mongoose.connection.readyState){
			console.log('auto reconnect MongoDB sucess ');	
			}
			else {
				console.log('Lost MongoDB connection -> get servise ip & connect');
				db.close(function () {
					//mongoose.disconnect();
					getMongoConnectIp().then(function(response) {
						//isAttempingConnect = false;
						connect(response);
						//db = mongoose.connection;
					});
				});
			}
		}, 25000);
		
		}
		*/
	});
	
	db.on('reconnected', function() {
		console.log('Reconnected to MongoDB');
	});
	
	db.once('open', function callback () {
		mongoConnectRetries = 0;
		isConnectedBefore = true;
		log.info("Connected to DB!   " + "mongodb://" +response + ":27017/roadsDb");
	});
	
	
	
	process.on('SIGINT', function() {
		db.close(function () {
			console.log('Force to close the MongoDB conection');
			//process.exit(0);
		});
	});
	
	//return db;
	//}; //function connect
	
	
	//connect(response);
	/*
	mongoose.connect("mongodb://" +response + ":27017/roadsDb");

	var db = mongoose.connection;

	db.on('error', function (err) {
		log.error('Connection error:', err.message);
	});

	db.once('open', function callback () {
	log.info("Connected to DB!   " + "mongodb://" +response + ":27017/roadsDb");
	
	});
	*/
	
})



module.exports = mongoose;