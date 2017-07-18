var mongoose = require('../linkMongo');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	username: String,
    password: String
	// age: Number,
	// DOB: Date,
	// isAlive:Boolean
});
var User = mongoose.model('users', userSchema);

module.exports = User;
