var mongoose = require('../linkMongo');
var Schema = mongoose.Schema;
var articlesSchema = new Schema({
	time: String,
    title: String,
    text:String,
    tags:Array
});
var articles = mongoose.model('articles', articlesSchema);

module.exports = articles;