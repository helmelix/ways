var http = require('http');
//var querystring = require('querystring');



function getHostPublicIp() {
	console.log('getHostPublicIp called');
	return new Promise(function(resolve, reject) {
		var http = require('http');

		var options = {
            hostname:  '169.254.169.254',
            path: '/latest/meta-data/public-ipv4',
            port: 80,
            method: 'GET',
			    headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}

		};

		http.request(options, function(response) {
			console.log('STATUS: ' + response.statusCode);

			response.on('data', function (chunk) {

				if(response.statusCode===200){
					console.log('BODY: ' + chunk);
					resolve(chunk);
				}else{
					console.log('unautorize !');
					reject(Error(response.statusCode));
				};
			
			
			});
		}).end();		
	
	});

};






function registerService(hostIp, instansePort) {
	console.log('registerService called');	
	return new Promise(function(resolve, reject) {
		
		var data = querystring.stringify({
			"ID": "routes_instanse_37",
			"Name": "routes",
			"Tags": [
				"14141414"
			], 
			"Address": hostIp,
			"Port": instansePort,
			//"Check": {
			//	//"Script": "/usr/local/bin/check_redis.py",
			//	"HTTP": "http://localhost:5000/health",
			//	"Interval": "10s",
			//	"TTL": "15s"
			//}
		});
		
		var options = {
				hostname: hostIp,
				path: '/v1/agent/service/register',
				port: 8500,
				method: 'PUT',
					headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(data)
				}
		}
		
		http.request(options, function(response) {
			
			console.log('STATUS: ' + response.statusCode);
			response.on('data', function (chunk) {

				if(response.statusCode===200){
					console.log('BODY: ' + data);
					console.log('response on data' + chunk);
					resolve(response.statusCode);
				}else{
					console.log('status code  !' + response.statusCode);
					reject(Error(response.statusCode));
				};
			
			
			});
		}).end();
		
	});		
	
};


getHostPublicIp().then(function(response) {
  console.log("123! ip : ", response.toString());
  return  registerService('54.191.88.188', 3511)
}, function(error) {
  console.error("124! :   ", error);
}).then(function(response) {
  console.log("registration pass   " + response);
}, function(error) {
  console.error("registration failed ", error);
})

	//var consulAgent= process.env.CONSUL;


/*
	
	console.log('process.env.consul ' + consulAgent);
	// console.log('process.env.consul ' + process.env);
	var data = querystring.stringify({
		"ID": "redis1",
		"Name": "redis",
		"Tags": [
			"master",
			"v1"
		], 
		"Address": "127.0.0.1",
		"Port": 8000,
		"Check": {
			//"Script": "/usr/local/bin/check_redis.py",
			"HTTP": "http://localhost:5000/health",
			"Interval": "10s",
			"TTL": "15s"
		}
	});
	
	var options = {
            hostname: '54.191.88.188',
            path: '/v1/agent/service/register',
            port: 5800,
            method: 'PUT',
			    headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(data)
			}
	}
	
	http.request(options, function(response) {
	  console.log('STATUS: ' + response.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(response.headers));
	  //res.setEncoding('utf8');

		response.on('data', function (chunk) {

			if(response.statusCode===200){
				//var data = JSON.stringify(chunk);
				var data = JSON.parse(chunk);
				console.log('BODY: ' + data);
				console.log('response on data' + chunk);
				//req.user = chunk.user;
				req.user = data.user;
				next();
			}else{
				console.log('unautorize !');
				res.status(401).end();
			};
		
		
		});
	}).end();
	
};
*/
