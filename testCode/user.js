var mongoose = require('mongoose');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

User.prototype.get = function(){
	
};

module.export = User;



// var mongoose = require('mongoose');

// var Schema = mongoose.Schema;
// var userSchema = new Schema({
// 	name: String,
// 	age: Number,
// 	DOB: Date,
// 	isAlive:Boolean
// });

// var User = mongoose.model('User', userSchema);
// var arvind = new User({
// 	name:'Arvind',
// 	age:99,
// 	DOB:'01/01/1915',
// 	isAlive:true
// });

// arvind.save(function(err, data){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log('Saved:', data);
// 	}
// })