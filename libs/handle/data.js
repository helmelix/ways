exports.toJsonDeletePass = 	function (user) {
	
	var data = user.driveRoute.map(function(driveRoute) {
	return { "type": "routes", "id": driveRoute };
	});
	
	var userJson = {
		'type' : "users",
		'id' : user.id,
		'relationships' : {"routes": {
               "data": data
        }}
	};
	return userJson;
	
};

exports.routesToJsonV_1 = 	function (routes) {

	if(Array.isArray(routes)){	
		console.log('routesToJsonV_1 get many rotes');
		routes.forEach(function(item, i, arr) {
			var item = item.toObject();
			var item1= {};
			item1.id = item._id;
			item1.type = "routes";
			item1.relationships = { "user": {"data": { "type": "user", "id": item.driver_id }  }} 
			delete item._id;
			delete item.driver_id;
			item1.attributes = item;
			arr[i] = item1;
			});
		return routes;
	} else{
		console.log('routesToJsonV_1 get one rote');
		var item = routes.toObject();
		var item1= {};
		item1.id = item._id;
		item1.type = "routes";
		item1.relationships = { "user": {"data": { "type": "user", "id": item.driver_id }  }} 
		delete item._id;
		delete item.driver_id;
		item1.attributes = item;
		return item1;
	}
	
};


exports.routesToJson = 	function (routes) {
	//var routes1 = routes.toArray();
	//var routes1 = JSON.stringify(routes);
		
	routes.forEach(function(item, i, arr) {
		var item = item.toObject();
		//var item = JSON.stringify(item);
		var item1= {};
		item1.id = item._id;
		item1.type = "routes";
		item1.relationships = { "user": {"data": { "type": "user", "id": item.driver_id }  }} 
		delete item._id;
		delete item.driver_id;
		item1.attributes = item;
		arr[i] = item1;
		});
	return routes;
	
};

exports.routeToJson = 	function (route) {
	//var routes1 = routes.toArray();
	//var routes1 = JSON.stringify(routes);
		
		var item = route.toObject();
		//var item = JSON.stringify(item);
		var item1= {};
		item1.id = item._id;
		item1.type = "routes";
		item1.relationships = { "user": {"data": { "type": "user", "id": item.driver_id }  }} 
		delete item._id;
		delete item.driver_id;
		item1.attributes = item;
		
	return item1;
	
};