var express = require('express');
var router = express.Router();
//用户操作
var Login = require('../modules/users').Login;
var Regist = require('../modules/users').Regist;
//文章操作
var Subarticle = require('../modules/articles').Subarticle;
var Getarticle = require('../modules/articles').Getarticle;
var Getlist = require('../modules/articles').Getlist;
var Gettags = require('../modules/articles').Gettags;
//图片操作
var ImgUpload = require('../modules/imgHandler').ImgUpload;
var ImgInfosave = require('../modules/imgHandler').ImgInfosave;
/* GET home page. */
router.get('/getData', function(req, res, next) {
	console.log('query==='+JSON.stringify(req.query));
  	res.json(['success', "get的数据"]);
});
router.post('/postData', function(req, res, next){
    /* req.body对象
       包含POST请求参数。
       这样命名是因为POST请求参数在REQUEST正文中传递，而不是像查询字符串在URL中传递。
       要使req.body可用，可使用中间件body-parser
    */
    console.log('body=fdsafsfsf=='+JSON.stringify(req.body));
    res.json(['success', "post的数据"]);
});

//登录
router.post('/login',function(req, res, next){
    Login(req, res, next);
});
//注册,暂不开放
router.post('/regist', function(req, res, next){
    Regist(req, res, next);
});
//提交文章
router.post('/subArticle', function(req, res, next){
    Subarticle(req, res, next);
});
//获取文章
router.get('/getArticle',function(req, res, next){
    Getarticle(req, res, next);
});
//获取文章列表
router.get('/getList',function(req, res, next){
    Getlist(req, res, next);
});
//获取标签
router.get('/getTags',function(req, res, next){
    Gettags(req, res, next);
});
//图片上传
router.post('/uploadImg', function(req, res, next){
    ImgUpload(req, res, next);
});
//图片信息存储
router.post('/saveImg', function(req, res, next){
    ImgInfosave(req, res, next);
});
module.exports = router;
