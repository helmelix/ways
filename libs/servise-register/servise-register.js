var http = require('http');
var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');
//var querystring = require('querystring');
var Promise = require("bluebird");
var util = require('util');

var getIpPromise;


function getHostPublicIp() {
	console.log('getHostPublicIp called');
	getIpPromise = getIpPromise || new Promise(function(resolve, reject) {

		var options = {
            hostname:  '169.254.169.254',
            path: '/latest/meta-data/public-ipv4',
            port: 80,
            method: 'GET',
			    headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}

		};

		var req = http.request(options, function(response) {
			console.log('STATUS: ' + response.statusCode);

			response.on('data', function (chunk) {

				if(response.statusCode===200){
					//console.log('BODY: ' + chunk);
					resolve(chunk);
				}else{
					console.log('getHostPublicIp statusCode :' + response.statusCode);
					reject(Error(response.statusCode));
				};
			
			
			});
		});
		
		req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		reject(Error(e.message));
		});

		req.end();	
		
	});
	return getIpPromise;
};






function registerService(hostIp, instansePort) {
	console.log('registerService called');	
	return new Promise(function(resolve, reject) {
		
		var data = JSON.stringify({
			"ID": config.get('default:servise:ID'),
			"Name": config.get('default:servise:name'),
			"Tags": [
				"test & check"
			], 
			"Address": hostIp,
			"Port": instansePort,
			"Check": {
				"HTTP": "http://" + hostIp + ":" + instansePort + "/health",
				"Interval": "30s"
			}
		});
		
		var options = {
				hostname: hostIp,
				path: '/v1/agent/service/register',
				port: '8500',
				method: 'PUT',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(data)
					//'Content-Length': '103'
				}
		}
		//console.log('Register send options:   ', util.inspect(options, {showHidden: false, depth: null}));
		//console.log('send data :   ' + data);	
		var req = http.request(options, function(response) {
			
			response.on('end', () => {
				console.log('res.on  end');
				if(response.statusCode===200){
					console.log('registerService STATUS: ' + response.statusCode);
					resolve(response.statusCode);
				}else{
					reject(Error(response.statusCode));
				};
			})
			//console.log('registerService STATUS: ' + response.statusCode);
			response.on('data', function (chunk) {
				console.log('response.on data : ');
			//	if(response.statusCode===200){
			//		console.log('registerService STATUS: ' + response.statusCode);
			//		resolve(response.statusCode);
			//	}else{
			//		reject(Error(response.statusCode));
			//	};
			});
		});
		
		//req.setTimeout(5000, function() {  
		//	//console.log('timed out, trying register servise');
		//	reject(Error('timed out, trying register servise'));
		//	req.abort();
		//});
		
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			reject(Error(e.message));
		});
		
		req.write(data);
		req.end();	
		
	});		
	
};

var deregisterService = function(){	
	console.log('deregisterService send request  ');
	
		var options = {
				hostname: '54.191.88.188',
				path: '/v1/agent/service/deregister/' + config.get('default:servise:ID') ,
				port: '8500',
				method: 'PUT',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				}
		}
		console.log('deregisterService send options:   ', util.inspect(options, {showHidden: false, depth: null}));
		var req = http.request(options, function(response) {
			
			response.on('end', () => {
				console.log('res.on  end');
				if(response.statusCode===200){
					console.log('end servise deregister status: ' + response.statusCode);
				}else{
					console.log('end servise deregister status fail: ' + response.statusCode);
				};
			})
			response.on('data', function (chunk) {
				if(response.statusCode===200){
					console.log('servise deregister status: ' + response.statusCode);
				}else{
					console.log('servise deregister status fail: ' + response.statusCode);
				};
			
			});
		});
		
		req.on('error', function(e) {
		console.log('servise deregister status error: ' + e.message);
		});

		req.end();	
	
};
/*
//function deregisterService() {
var deregisterService = function(){	
console.log('deregisterService called  ');
	return getHostPublicIp().catch(function(err) {
		console.log('err getting host ip:  ' + err);
		return config.get('default:servise:ip');
	}).then(function(response) {
		console.log('deregisterService send request  ');
		var options = {
				hostname: response.toString(),
				path: '/v1/agent/service/deregister/' + config.get('default:servise:ID') ,
				port: '8500',
				method: 'PUT',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(data)
				}
		}
		console.log('deregisterService send options:   ', util.inspect(options, {showHidden: false, depth: null}));
		var req = http.request(options, function(response) {
			
			response.on('end', () => {
				console.log('res.on  end');
				if(response.statusCode===200){
					console.log('end servise deregister status: ' + response.statusCode);
				}else{
					console.log('end servise deregister status fail: ' + response.statusCode);
				};
			})
			response.on('data', function (chunk) {
				if(response.statusCode===200){
					console.log('servise deregister status: ' + response.statusCode);
				}else{
					console.log('servise deregister status fail: ' + response.statusCode);
				};
			
			});
		});
		
		req.on('error', function(e) {
		console.log('servise deregister status error: ' + e.message);
		});
		
		req.write(data);
		req.end();	
	});
	
	
};
*/
function registerServiceInstance() {
	
	return getHostPublicIp().catch(function(err) {
		console.log('err getting host ip:  ' + err);
		return config.get('default:servise:ip');
	}).then(function(response) {
	  console.log("get ip sucess : ", response.toString());
	  return  registerService(response.toString(), config.get('port'));
	}).then(function(response) {
	  console.log("registration pass   " + response);
	}, function(error) {
	  console.error("registration failed ", error);
})
};
////////////////////////////////

function getMongoServiseIp() {
//exports.getMongoServiseIp = function(){
	console.log('getMongoServiseIp called');
	
	return getHostPublicIp().catch(
			function(err) {
				console.log('err getting host ip');
				return config.get('default:mongoose:ip');
		}).then(function(response) {
		
		return new Promise(function(resolve, reject) {
			var options = {
				hostname:  response.toString(),
				path: '/v1/catalog/service/mongo',
				port: '8500',
				method: 'GET'
			};
			var req = http.request(options, function(response) {
				console.log('STATUS: ' + response.statusCode);

				response.on('data', function (chunk) {

					if(response.statusCode===200){
						//console.log('BODY: ' + chunk);
						
						resolve(chunk);
					}else{
						console.log('unautorize !');
						reject(Error(response.statusCode));
					};
				
				
				});
			});
			
			req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			reject(Error(e.message));
			});

			req.end();
		});
	});
	


};


function getMicroServiseData(serviseName) {
//exports.getMongoServiseIp = function(){
	console.log('getMicroServiseData called');
	
	return getHostPublicIp().catch(
			function(err) {
				console.log('err getting host ip');
				return '54.191.88.188';
		}).then(function(response) {
		
		return new Promise(function(resolve, reject) {
			var options = {
				hostname:  response.toString(),
				path: '/v1/catalog/service/' + serviseName,
				port: '8500',
				method: 'GET'
			};
			var req = http.request(options, function(response) {
				console.log('STATUS: ' + response.statusCode);

				response.on('data', function (chunk) {

					if(response.statusCode===200){
						//console.log('BODY: ' + chunk);
						
						resolve(chunk);
					}else{
						console.log('unautorize !');
						reject(Error(response.statusCode));
					};
				
				
				});
			});
			
			req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			reject(Error(e.message));
			});

			req.end();
		});
	});
};

var getHealthMicroServiseData = function (serviseName) {
//exports.getMongoServiseIp = function(){
	console.log('getHealthMicroServiseData called');
	
	return getHostPublicIp().catch(
			function(err) {
				console.log('err getting host ip');
				return config.get('default:servise:ip');
		}).then(function(response) {
		
		return new Promise(function(resolve, reject) {
			var options = {
				hostname:  response.toString(),
				path: '/v1/health/service/' + serviseName,
				port: '8500',
				method: 'GET'
			};
			var req = http.request(options, function(response) {
				console.log('STATUS: ' + response.statusCode);

				response.on('data', function (chunk) {

					if(response.statusCode===200){
						//console.log('BODY: ' + chunk);
						resolve(chunk);
					}else{
						console.log('unautorize !');
						reject(Error(response.statusCode));
					};
				
				
				});
			});
			
			req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			reject(Error(e.message));
			});

			req.end();
		});
	});
	


};



config.set('auth:serviseAddressNum', 0);
function getAuthServiseIp() {
	var serviseAddressNum = config.get('auth:serviseAddressNum');
	//console.log("getAuthServiseIp called  ");
	console.log("----------------serviseAddressNum :  " + serviseAddressNum);
	var address = config.get('auth:address');
	if (address){ 
		//console.log("-----------address[serviseAddressNum] :  " + address[serviseAddressNum]);
		if(address[serviseAddressNum]){
			console.log("+++++++++++++++address[serviseAddressNum] :  " + address[serviseAddressNum]);
			//var ind = serviseAddressNum;
			//serviseAddressNum++;
			config.set('auth:serviseAddressNum', serviseAddressNum + 1);
			return address[serviseAddressNum];
		} else if(address[0]){
			console.log("-----------address[0] :  " + address[0]);
			config.set('auth:serviseAddressNum', 1);
			return address[0];
		}
	};
	
	return config.get('default:auth');
};


function renewMicroServiseIp(servise) {
	getHealthMicroServiseData(servise).then(
		function(response) {
			var serviseAddress = [];
			var res = JSON.parse(response);
			
			if (typeof res[0] != 'undefined'){

				res.forEach(function(item, i, arr) {
					item.Checks.forEach(function(checks, i, arr) {
						if (checks.ServiceName === servise && checks.Status === "passing"){
						serviseAddress.push({"ip" : item.Service.Address,"port" : item.Service.Port});
						}
					});
						
				});
					
			} 
			if (serviseAddress[0]){
				console.log("renew Auth port :  " + serviseAddress );
				config.set('auth:address', serviseAddress );
			} else {
				console.log('no healthy services registered');
				config.set('auth:address', '');
			}	
		}, function(error) {
			console.error("error getting Auth port ", error);
			config.set('auth:address', '');
	})
};

	
module.exports.getHostPublicIp = getHostPublicIp();
module.exports.registerServiceInstance = registerServiceInstance();
module.exports.deregisterService = deregisterService;
//module.exports.getMongoServiseIp = getMongoServiseIp();
module.exports.getMicroServiseData = getMicroServiseData;
module.exports.renewMicroServiseIp = renewMicroServiseIp;
module.exports.getAuthServiseIp = getAuthServiseIp;
//exports.getMicroServiseIp = getMicroServiseIp;
