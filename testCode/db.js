var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url='mongodb://localhost:27018/mongodbTest';
MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	// insertDocument(db, function(){
	// 	db.close();
	// });
	// findRestaurants(db, function(){
	// 	db.close();
	// });
	updateRestaurants(db, function(){
		db.close();
	});
	// removeRestaurants(db, function(){
	// 	db.close();
	// });
	// console.log('Connected correctly to server.');
	// db.close();
});
//插入
var insertDocument = function(db, cb){
	db.collection('restaurants').insertOne({
		"address" : {
			"street" : "2 Avenue",
			"zipcode" : "10075",
			"building" : "1480",
			"coord" : [ -73.9557413, 40.7720266 ]
		},
		"borough" : "Manhattan",
		"cuisine" : "Italian",
		"grades" : [
			{
				"date" : new Date("2014-10-01T00:00:00Z"),
				"grade" : "A",
				"score" : 11
			},
			{
				"date" : new Date("2014-01-16T00:00:00Z"),
				"grade" : "B",
				"score" : 17
			}
		],
		"name" : "Vella",
		"restaurant_id" : "41704620"
	}, function(err, result){
		assert.equal(err,null);
		console.log("Inserted a document into the restaurants collection.");
		cb();
	})
}
//查询
var findRestaurants = function(db, cb){
	var cursor = db.collection('restaurants').find({ "grades.score": { $lt: 30 }});
	cursor.each(function(err, doc){
		assert.equal(err, null);
		if(doc !== null){
			console.dir(doc);
		}else{
			cb();
		}
	})
}
//更新
var updateRestaurants = function(db, cb){
	db.collection('restaurants').updateOne(
		{ "restaurant_id" : "41704620" },
      	{
	        "name" : "Vella 2",
	        "address" : {
	        	"coord" : [ -73.9557413, 40.7720266 ],
	        	"building" : "1480",
	        	"street" : "2 Avenue",
	        	"zipcode" : "10075"
	        }
      	},
      	function(err, results) {
        	console.log(results);
        	cb();
      	}
	)
}
//删除
var removeRestaurants = function(db, cb){
	db.collection('restaurants').deleteMany(
		{ "borough": "Manhattan" },
		function(err, results) {
			console.log(results);
			cb();
		}
	)
}