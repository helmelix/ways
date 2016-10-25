var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var methodOverride = require('method-override');

var libs = process.cwd() + '/libs/';


var config = require('./config');
var log = require('./log')(module);

var routes = require('./routes/routes');
var util = require('util');

var app = express();
////////////////////////////////////

app.use(function(req, res, next) {
	method = req.method;
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	console.log(req.headers['access-control-request-headers']);
    res.setHeader('Access-Control-Allow-Origin', '*');

  	res.setHeader("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Content-Range, Accept");
 
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time, X-Uid, X-Authentication');
	if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());


app.use('/api/routes', routes);
app.get('/health', function(req, res){
	console.log('get health check');
	res.send(200);

});

app.use(function(req, res, next){
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({ 
    	error: 'Not found' 
    });
    return;
});


app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({ 
    	error: err.message 
    });
    return;
});

module.exports = app;