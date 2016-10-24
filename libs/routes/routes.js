var express = require('express');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');
var DriveRoute = require(libs + 'model/driveroute');
var User = require(libs + 'model/user');
var outData = require(libs + 'handle/data');
var util = require('util');
var http = require('http');
var config = require(libs + 'config');
var querystring = require('querystring');
var register = require(libs + 'servise-register/servise-register');
register.renewMicroServiseIp('auth');
	
var checkToken = function (req, res, next) {
  	console.log("get users/  Authorization   " + req.headers['authorization']);
	var authIp = register.getAuthServiseIp();
	var options = {

			hostname: authIp.ip,
            path: '/api/autorize',
			  //forever : true,
              port: authIp.port,
              method: 'GET',
                headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'authorization': req.headers['authorization']
				//'Content-Length': postData.length
			  }
	}
	console.log(util.inspect(options, {showHidden: false, depth: null}));
	var authRequest = http.request(options, function(response) {
	  console.log('STATUS: ' + response.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(response.headers));
	  //res.setEncoding('utf8');

		response.on('data', function (chunk) {

			if(response.statusCode===200){
				//var data = JSON.stringify(chunk);
				var data = JSON.parse(chunk);
				//console.log('BODY: ' + data);
				//console.log('response on data' + chunk);
				//req.user = chunk.user;
				req.user = data.user;
				next();
			}else{
				console.log('unautorize !');
				res.status(401).end();
				if (response.statusCode===404){
					console.log('authRequest STATUS: ' + response.statusCode);
					register.renewMicroServiseIp('auth');
				}
			};
		
		
		});
		
		res.on('end', () => {
			console.log('----------No more data in response.')
		})
	});
	
	authRequest.setTimeout(5000, function() {  
		console.log('timed out, trying renew auth address');
		register.renewMicroServiseIp('auth');
		res.status(401).end();
		authRequest.abort();
	});
	
	authRequest.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		register.renewMicroServiseIp('auth');
		res.status(401).end();
	});
	
	authRequest.end();
};	
///////////////////////
router.get('/test',  function(req, res) {
	console.log('get /test');
	var ip = register.getAuthServiseIp();
	console.log(ip);
	res.json({ 
		'ip': ip
	});
	res.end();
	register.renewMicroServiseIp('auth');
	register.deregisterService();
});
////////////////////
router.get('/',  function(req, res) {
	console.log('GET request to api/routes/      ' );
	DriveRoute.find({}, function (err, route) {
		
		if(!route) {
			res.statusCode = 404;
			res.end();
			//return res.json({ 
			//	error: 'Not found' 
			//});
		}
		
		if (!err) {
			


			
			return res.json({ 
				'data': outData.routesToJsonV_1(route) 
			});
		} else {
			res.statusCode = 500;
			res.end();
			log.error('Internal error(%d): %s',res.statusCode,err.message);
			
			//return res.json({ 
			//	error: 'Server error' 
			//});
		}
	});
});


router.get('/:id',  function(req, res) {
	
	DriveRoute.findById(req.params.id, function (err, route) {
		console.log('route   ' + route);
		
		if (err) {
			console.log('err   ' + err);
			res.statusCode = 404;
			res.end();
		} else {
					
			if(!route) {
			console.log('no route');
			res.statusCode = 404;
			res.end();
			} else{
				res.statusCode = 200;
				res.json({ 
					'data': outData.routesToJsonV_1(route)
				});
				
				//log.error('Internal error(%d): %s',res.statusCode,err.message);
			}
		}
	});
});


/*
router.get('/', passport.authenticate('bearer', { session: false }), function(req, res) {
	
	DriveRoute.find(function (err, articles) {
		if (!err) {
			return res.json(articles);
		} else {
			res.statusCode = 500;
			
			log.error('Internal error(%d): %s',res.statusCode,err.message);
			
			return res.json({ 
				error: 'Server error' 
			});
		}
	});
});
*/
/*      ////////////////
router.post('/',function(req, res, next) {
 passport.authenticate('bearer',{session: false}, function(err, user, info){
	console.log('own cb was called  err    ' + err);
	console.log('user    ' + user);
	console.log('info      ' + info);
    //if (err) { return next(err); }
  //  if (!user) { return res.redirect('/'); }

    // req / res held in closure

  })(req, res, next);
});
*/


router.post('/', checkToken,

//passport.authenticate('bearer', { session: false })

function(req, res) {
//router.post('/', function(req, res) {
	console.log('routes post called');
	//console.log(util.inspect(req.body.data, {showHidden: false, depth: null}));
	//console.log('attributes' + attributes['stored-start-city);
		
	User.findById(req.user['_id'], function(err, user) {
		if(err){
			res.statusCode = 500;
			res.end();
			//res.json({ 
			//		error: 'No User' 
			//});
		}
		else {
			
			try {
				var attributes = req.body.data.attributes;
				console.log('req.body.data:        ', util.inspect(req.body.data, {showHidden: false, depth: null}));
				var driveRoute = new DriveRoute({ 
				"driver_id": req.user['_id'] ,
				"stored-path": attributes['stored-path'],
				"stored-description": attributes['stored-description'],
				"stored-phone": attributes['stored-phone'],
				"stored-name": attributes['stored-name'],
				"stored-start-city": attributes['stored-start-city'],
				"stored-end-city": attributes['stored-end-city'],
				"stored-inter-city": attributes['stored-inter-city'],
				"stored-directions": attributes['stored-directions'],
				"stored-start-id": attributes['stored-start-id'],
				"stored-end-id": attributes['stored-end-id'],
				"stored-date": attributes['stored-date'],
				"stored-is-one-date": attributes['stored-is-one-date'],
				"stored-length":attributes['stored-length'],
				"stored-middle-countries": attributes['stored-middle-countries']
				});
			} catch(e) {
				console.log('error parsing route data ' + e);
				if (e.name == "TypeError") {
					res.statusCode = 400;
					res.end();
				} else {
					res.statusCode = 500;
					res.end();
				}
				return
			}
	
			console.log('storedStartCity        ' + driveRoute['storedStartCity']);

			driveRoute.save(function (err,savedRoute) {
				if (!err) {
					log.info("New route created with id: %s", savedRoute.id);
					
					var driveRouteUpdated = user.driveRoute.push(savedRoute.id);
					user.save({driveRoute: driveRouteUpdated }, function (err, post) {
						if (err) { 
						console.log('save user relation to driveRoute fail:' + err);
						}
						else {
							console.log('save user relation to driveRoute ok:');
						};

					});
					
					return res.json({ 
						'data': outData.routesToJsonV_1(savedRoute)
					});				
					
				} else {
					if(err.name === 'ValidationError') {////////////delete   !!!!!
						res.statusCode = 400;
						res.end();
						//res.json({ 
						//	error: 'Validation error' 
						//});
					} else {
						res.statusCode = 500;
						res.end();
						//res.json({ 
						//	error: 'Server error' 
						//});
					}
					log.error('Internal error(%d): %s', res.statusCode, err.message);
				}
			});
		}
	});
	
});

router.delete('/:id', checkToken,


//passport.authenticate('bearer', { session: false }), 

function(req, res) {
//router.delete('/:id',  function(req, res) {
console.log('access_token        ' + req.body.access_token);
//console.log('mydata        ' + req.body.mydata);
//console.log(util.inspect(req.body, {showHidden: false, depth: null}));



	console.log('routes DELETE was called');
	//var user = req.user;
	console.log(util.inspect(req.user, {showHidden: false, depth: null}));
	User.findById(req.user['_id'], function(err, user) {
		if (err){
			console.log(err);
			res.status(204).end();			
		}
		
		if(!user){
			console.log('No User');
			res.statusCode = 204;
			res.end();
			//res.json({ 
			//	error: 'No User' 
			//})
		}
		else {
			if(user.deleteRouteId(req.params.id)){
				console.log('delete route_id from User OK');
				
				DriveRoute.findById(req.params.id, function(err, route) {
					if(!route) {
						res.statusCode = 404;
						res.end();
						//return res.json({ 
						//	error: 'Route not found' 
						//});
					}
					if (!err) {
					
						route.remove({},function(err, user) {
							if(err){	
								res.statusCode = 500;
								res.end();						
								console.log('err removing driveRoute   ' + req.params.id +  +'  ' + err);
								//res.json({error :err});
							} else {
								res.statusCode = 200;
								res.end();
								console.log('driveRoute deleted  ok  ' + req.params.id);
							}	
						});	
						

					} else {
						res.statusCode = 500;
						res.end();
						log.error('Internal error(%d): %s',res.statusCode,err.message);
						
						//return res.json({ 
						//	error: 'Server error' 
						//});
					}

				});
			}
			else {
				console.log('delete route_id from User failed');
				res.statusCode = 204;
				res.end();
				//return res.json({ 
				//	error: 'User have no such route' 
				//});
			};		
		};
	
	});

});
/*
router.get('/:id', passport.authenticate('bearer', { session: false }), function(req, res) {
	
	Article.findById(req.params.id, function (err, article) {
		
		if(!article) {
			res.statusCode = 404;
			
			return res.json({ 
				error: 'Not found' 
			});
		}
		
		if (!err) {
			return res.json({ 
				status: 'OK', 
				article:article 
			});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s',res.statusCode,err.message);
			
			return res.json({ 
				error: 'Server error' 
			});
		}
	});
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	var articleId = req.params.id;

	Article.findById(articleId, function (err, article) {
		if(!article) {
			res.statusCode = 404;
			log.error('Article with id: %s Not Found', articleId);
			return res.json({ 
				error: 'Not found' 
			});
		}

		article.title = req.body.title;
		article.description = req.body.description;
		article.author = req.body.author;
		article.images = req.body.images;
		
		article.save(function (err) {
			if (!err) {
				log.info("Article with id: %s updated", article.id);
				return res.json({ 
					status: 'OK', 
					article:article 
				});
			} else {
				if(err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({ 
						error: 'Validation error' 
					});
				} else {
					res.statusCode = 500;
					
					return res.json({ 
						error: 'Server error' 
					});
				}
				log.error('Internal error (%d): %s', res.statusCode, err.message);
			}
		});
	});
});
*/
module.exports = router;