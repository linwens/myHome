var Img = require('./mongoose').Img;
var multer = require('multer');
var qiniu = require('qiniu');
var uuid = require('node-uuid');
//multer配置
//直接存本地磁盘
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images/gallery')
//   },
//   filename: function (req, file, cb) {
//      console.log(file);
//     cb(null, file.originalname)
//   }
// })
// var multerConf = multer({ storage: storage }).single('imgFiles');
//存为buffer
var storage = multer.memoryStorage();
var multerConf = multer({
    storage: storage,
    limits:{
        fileSize:2097152 //2M
    },
    fileFilter:function(req, file, cb){
        var type = '|' + file.mimetype.slice(file.mimetype.lastIndexOf('/') + 1) + '|';
        var fileTypeValid = '|jpg|png|jpeg|'.indexOf(type) !== -1;
        cb(null, !!fileTypeValid);
    }
}).single('imgFiles');
//图片上传
exports.ImgUpload = function(req, res, next){
    console.log('=======');
    //本地存储
    // multerConf(req, res, function(err){
    //     if(err){
    //         console.log('errrr');
    //     }else{
    //         console.log(req.file);
    //         res.json({
    //             res_code:'0',
    //             res_msg:'上传成功'
    //         })
    //     }
    // });
    //传七牛
    multerConf(req, res, function(err){
        //req.body.bucketType
        //七牛配置---生成token
        var accessKey = 'Y_k8Ymui6QCIKcg_dENCZR3TGgZ_aP65jwnj3KCU';
        var secretKey = 'oWRin6KjO5dD1SGmjT9jIRaBG0d02lX5AdFwWpqn';
        //var bucket = 'linwens-img';
        var bucket = req.body.bucketType === 'galleryImg'?'linwens-img':'blog-img';//配置上传不同传出空间
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var options = {
            scope: bucket,
            returnBody: '{"key":"$(key)","hash":"$(etag)","width":"$(imageInfo.width)","height":"$(imageInfo.height)","model":"$(exif.Model.val)","iso":"$(exif.ISOSpeedRatings.val)","shutter":"$(exif.ExposureTime.val)","aperture":"$(exif.FNumber.val)","Flength":"$(exif.FocalLength.val)"}'
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken=putPolicy.uploadToken(mac);
        //----找到七牛机房
        var config = new qiniu.conf.Config();
        config.zone = qiniu.zone.Zone_z0;

        var formUploader = new qiniu.form_up.FormUploader(config);
        var putExtra = new qiniu.form_up.PutExtra();
        var key = req.file.originalname;

        if(err){
            console.log(err);
        }else{
            if(req.file&&req.file.buffer){
                formUploader.put(uploadToken, key, req.file.buffer, putExtra, function(respErr,
                  respBody, respInfo) {
                    if (respErr) {
                        throw respErr;
                    }
                    if (respInfo.statusCode == 200) {
                        console.log(respBody);
                        var exifObj = {};
                            exifObj.model = respBody.model;
                            exifObj.iso = respBody.iso;
                            exifObj.shutter = respBody.shutter;
                            exifObj.aperture = respBody.aperture;
                            exifObj.Flength = respBody.Flength;
                        //{ hash: 'FvGzDnfjqLmcB6AF2EV1hhQvzcrd', key: 'cogis.jpg' }
                        res.json({//返回前端外链地址，前端再提交放入数据库
                            res_code:'0',
                            res_msg:'上传成功',
                            size:respBody.width+'x'+respBody.height,
                            exif:exifObj,
                            backUrl:'http://osurqoqxj.bkt.clouddn.com/'+respBody.key
                        })
                    } else {
                        console.log(respInfo.statusCode);
                        console.log(respBody);
                    }
                });
            }
        }
    }) 
};
//图片信息存入数据库
exports.ImgInfosave = function(req, res, next){
    var img = new Img({
        time: Math.round(Date.parse(new Date())/1000),
        title:req.query.title,
        desc: req.query.desc,
        size: req.query.size,
        url: req.query.url,
        exif:JSON.parse(req.query.exif),
        type:req.query.type,
        gid:uuid.v1()
    });
    //判断是修改还是新加
    if(req.query.option&&req.query.option=='modify'){
        Img.update({gid:req.query.gid}, {title: req.query.title,desc:req.query.desc},function(err, data){
            if(err){
                console.log(err);
            }else{
                console.log('Updated:', data);
                res.json({
                    res_code:1,
                    res_msg:'图片信息修改成功'
                })
            }
        })
    }else{
        img.save(function(err, data){
            if(err){
                console.log(err);
            }else{
                console.log('Saved:', data);
                res.json({
                    res_code:1,
                    res_msg:'图片信息保存成功'
                })
            }
        })
    }
}
//获取图片列表(需要做缓存处理)
exports.Getimglist = function(req, res, next){
    var schWord = req.query.schWord?req.query.schWord:null,
        curPage = req.query.curPage?parseInt(req.query.curPage):1,
        pageSize = req.query.pageSize?parseInt(req.query.pageSize):10,
        findParams = {'type':'galleryImg'};//只筛选摄影作品 add by lws 2017.9.28
    if(schWord){//标题，正文，标签内包含关键字(js的RegExp对象)
        var schRegExp = new RegExp(schWord,"i");
        findParams = {"$or":[{'title':schRegExp}, {'desc':schRegExp}, {'type':'galleryImg'}]};
    }
    Img.count(findParams,function(err, total){//为了获取总条数
        Img.find(findParams).skip((curPage-1)*pageSize).limit(pageSize).sort({time:-1}).exec(function(err, data){
            if(err){
                console.log(err);
                res.json({
                    res_code:4,
                    res_msg:'图片列表数据出错'
                })
            }else{
                console.log('find:',data);
                if(data&&data!=''){
                    var galleryImglist = [];
                    for(var i = 0;i<data.length;i++){
                        if(data[i].type ==='galleryImg'){
                            galleryImglist.push(data[i]);
                        }
                    }
                    console.log(galleryImglist);
                    res.json({
                        res_code:1,
                        dataList:galleryImglist,
                        page:curPage,
                        page_size:pageSize,
                        total:total
                    })
                    return
                }else{
                    res.json({
                        res_code:2,
                        dataList:data,
                        page:curPage,
                        page_size:pageSize,
                        total:0,
                        res_msg:'没有更多！'
                    })
                    return
                }
            };
        });
    });
}
//图片删除
exports.RemoveImg = function(req, res, next){
    Img.remove({gid:req.query.gid},function(err, data){
        if(err){
            console.log(err);
        }else{
            if(data&&data!=''){
                res.json({
                    res_code:1,
                    res_msg:'图片删除成功'
                })
            }else{
                res.json({
                    res_code:2,
                    res_msg:'图片不存在'
                })
            }
        }
    });
};
//图片详情获取
exports.Getimginfo = function(req, res, next){
    Img.find({gid:req.query.gid},function(err, data){
        if(err){
            console.log(err);
            res.json({
                res_code:4,
                res_msg:'获取图片详情错误'
            })
        }else{
            if(data&&data!=''){
                res.json({
                    res_code:1,
                    imgInfo:{
                        time:data[0].time,
                        title:data[0].title,
                        desc:data[0].desc?data[0].desc:'获取的图片没有描述',
                        size: data[0].size,
                        url:data[0].url,
                        exif:data[0].exif,
                        type:data[0].type
                    }
                })
            }else{
                res.json({
                    res_code:2,
                    res_msg:'图片不存在'
                })
            }
        };
    });
};