console.log('process.env.consul ' + process.env);

set vlan 899 add port 16 untag+
set port 16 pvid 899



curl http://169.254.169.254/latest/meta-data/public-ipv4   

var http = require('http');

var options = {
            hostname:  '169.254.169.254',
            path: 'latest/meta-data/public-ipv4',
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
			//	var data = JSON.parse(chunk);
				console.log('BODY: ' + chunk);
			//	console.log('response on data' + chunk);
			}else{
				console.log('unautorize !');
				res.status(401).end();
			};
		
		
		});
	}).end();
	
///////////////////////////	

var http = require('http');
var querystring = require('querystring');	
	
	var data = querystring.stringify({
		"ID": "routes_instanse-12",
		"Name": "routes",
		"Tags": [
			"master",
			"v1"
		], 
		"Address": "54.191.88.188",
		"Port": "3005"
	});
	
	var options = {
            hostname: '172.17.0.3',
            path: 'v1/agent/service/register',
            port: 8500,
            method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(data)
			}
	}
	
	http.request(options, function(response) {
	  console.log('STATUS: ' + response.statusCode);

		response.on('data', function (chunk) {

			if(response.statusCode===200){
				var data = JSON.parse(chunk);
				console.log('BODY: ' + data);
				console.log('response on data' + chunk);

			}else{
				console.log('unautori1212ze !');
			};
		
		
		});
	}).end();
	
///////////////////// 54.191.88.188:8500/v1/catalog/services

var http = require('http');
//var querystring = require('querystring');	
	
	//var data = JSON.stringify
	var data = {
		"ID": "routes_instanse-12",
		"Name": "routes",
		"Tags": [
			"master",
		], 
		"Address": "54.191.88.188",
		"Port": 3005
	};
	
	var options = {
            hostname: '54.191.88.188',
            path: 'v1/agent/service/register',
            port: 8500,
            method: 'PUT',
			json: data,
			headers: {
				'Content-Type': 'application/json'
				//'Content-Length': Buffer.byteLength(data)
			}
	};
	 
	console.log('data:    ' + data);
	http.request(options, function(response) {
	  console.log('STATUS: ' + response.statusCode);

		response.on('data', function (chunk) {

			if(response.statusCode===200){
				var data = JSON.parse(chunk);
				console.log('response on data' + chunk);

			}else{
				console.log('unautori1212ze !');
			}
		
		
		});
	}).end();