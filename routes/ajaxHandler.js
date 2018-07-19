'use strict'
import express from 'express';
const router = express.Router();
//用户操作
import {Login, Regist} from '../modules/users'
//文章操作
import {Subarticle, Removearticle, Getarticle, Getlist, Gettags} from '../modules/articles'
//html5相关操作----功能重复后期考虑优化
import {subH5, RemoveH5, Geth5list, GetH5} from '../modules/html5'
//图片操作
import {ImgUpload, ImgInfosave, Getimglist, RemoveImg, Getimginfo} from '../modules/imgHandler'
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
//图片上传
router.post('/uploadImg', function(req, res, next){
    ImgUpload(req, res, next);
});
//图片信息存储
router.post('/saveImg', function(req, res, next){
    ImgInfosave(req, res, next);
});
//获取图片列表
router.get('/getImglist',function(req, res, next){
    Getimglist(req, res, next);
});
//删除图片
router.post('/removeImg', function(req, res, next){
    RemoveImg(req, res, next);
});
//获取图片信息
router.get('/getImginfo',function(req, res, next){
    Getimginfo(req, res, next);
});
//获取IP
var request = require('request');
router.get('/getIP',function(req, res, next){
    request({
        method:'get',
        url:'http://ip.chinaz.com/getip.aspx'//站长之家的IP查询工具
    }, function (error, response, body) {
        if(error){
            res.render('error');
        }else{
            var data=body.replace(/'/g,'"');
            var reg = /(^\{|\,)\w+:/g;
            var aa = body.match(reg);
            var bb = [];
            for(var i=0;i<aa.length;i++){
                bb.push(aa[i].slice(1,aa[i].length-1))
            }
            var j = 0;
            var sss = '';
            function addKey(str,arr){
                if(arr.length==j){
                    sss = str;
                    return false;
                }
                var regExp = new RegExp(arr[j]+':','gi');
                var newStr = str.replace(regExp,'"'+arr[j]+'":');
                j++;
                addKey(newStr,arr);
            }
            addKey(data,bb);
            res.send(sss);
        }
    });
});
module.exports = router;
