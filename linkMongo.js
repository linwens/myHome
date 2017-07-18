//链接数据库
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27018/mongodbTest');

mongoose.connection.on('error', function cb(){
	console.log("connection error");
});
mongoose.connection.once('open', function cb(){
	console.log("mongo working!");
});
module.exports =  mongoose;