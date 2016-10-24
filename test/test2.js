/*
var request = require('request');
var util = require('util');

var requestData = {
  request: {
	  "service":{
		"Name": "routes",
		"ID": "routes_instanse-12",
		"Tags": [
			"master",
		], 
		"Address": "54.191.88.188",
		"Port": 3005
		}
  }
};

request('http://54.191.88.188:8500/v1/agent/service/register',
        { json: true, body: requestData },
        function(err, res, body) {
		//console.log(util.inspect(res, {showHidden: false, depth: null}));
  console.log('body: ' +   body);
});
*/

var http = require('http');
var util = require('util');
//var querystring = require('querystring');	
	
	//var data = JSON.stringify
	var data = JSON.stringify({
		"ID": "routes_instanse-12",
		"Name": "routes",
		"Tags": [
			"master",
		], 
		"Address": "54.191.88.188",
		"Port": 3005
	});
	
	var options = {
            hostname: '54.191.88.188',
            path: '/v1/agent/service/register',
            port: 8500,
            method: 'PUT',
			json: data,
			headers: {
				'Content-Type': 'application/json'
				//'Content-Length': Buffer.byteLength(data)
			}
	};
	 
	console.log('data:    ' + data);
var req =	http.request(options, function(response) {
	  console.log('STATUS: ' + response.statusCode);
	//console.log(util.inspect(response, {showHidden: false, depth: null}));
		response.on('data', function (chunk) {

			if(response.statusCode===200){
			//	var data = JSON.parse(chunk);
				console.log('response on data' + chunk);

			}else{
				console.log('unautori1212ze !');
			}
		
		
		});
		
	});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.write(data);
req.end();