//获取应用配置文件信息
import config from './config';
//链接数据库
var mongoose = require('mongoose');

mongoose.connect(config.mongoUrl);

mongoose.connection.on('error', function cb(){
	console.log("connection error");
});
mongoose.connection.once('open', function cb(){
	console.log("mongo working!");
});
module.exports =  mongoose;