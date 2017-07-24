var express = require('express');
var router = express.Router();
//用户操作
var Login = require('../modules/users').Login;
var Regist = require('../modules/users').Regist;
//文章操作
var Subarticle = require('../modules/articles').Subarticle;
var Removearticle = require('../modules/articles').Removearticle;
var Getarticle = require('../modules/articles').Getarticle;
var Getlist = require('../modules/articles').Getlist;
var Gettags = require('../modules/articles').Gettags;
//图片操作
var ImgUpload = require('../modules/imgHandler').ImgUpload;
var ImgInfosave = require('../modules/imgHandler').ImgInfosave;
//html5相关操作----功能重复后期考虑优化
var subH5 = require('../modules/html5').subH5;
var RemoveH5 = require('../modules/html5').RemoveH5;
var Geth5list = require('../modules/html5').Geth5list;
var GetH5 = require('../modules/html5').GetH5;
//图片操作
var Getimglist = require('../modules/imgHandler').Getimglist;
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
//删除文章
router.post('/removeArticle', function(req, res, next){
    Removearticle(req, res, next);
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
//提交H5
router.post('/subH5', function(req, res, next){
    subH5(req, res, next);
});
//删除H5
router.post('/removeH5', function(req, res, next){
    RemoveH5(req, res, next);
});
router.get('/getH5', function(req, res, next){
    GetH5(req, res, next);
});
//获取H5列表
router.get('/getH5list',function(req, res, next){
    Geth5list(req, res, next);
});
//获取图片列表
router.get('/getImglist',function(req, res, next){
    Getimglist(req, res, next);
});
module.exports = router;
