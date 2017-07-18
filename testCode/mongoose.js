var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27018/mongodbTest');

var db = mongoose.connection;
db.on('error', function cb(){
	console.log("connection error");
});
db.once('open', function cb(){
	console.log("mongo working!");
});

var Schema = mongoose.Schema;
var userSchema = new Schema({
	name: String,
	age: Number,
	DOB: Date,
	isAlive:Boolean
});

var User = mongoose.model('User', userSchema);
var arvind = new User({
	name:'Arfdsfsafssafvind',
	age:12354,
	DOB:'01/01/1915',
	isAlive:false
});
console.log('arvind==='+arvind);
arvind.save(function(err, data){
	if(err){
		console.log(err);
	}else{
		console.log('Saved:', data);
	}
})