var Img = require('./mongoose').Img;
var multer = require('multer');
var qiniu = require('qiniu');
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
//图片上传本地
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
        //七牛配置---生成token
        var accessKey = 'Y_k8Ymui6QCIKcg_dENCZR3TGgZ_aP65jwnj3KCU';
        var secretKey = 'oWRin6KjO5dD1SGmjT9jIRaBG0d02lX5AdFwWpqn';
        var bucket = 'linwens-img';
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var options = {
            scope: bucket
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
                        //{ hash: 'FvGzDnfjqLmcB6AF2EV1hhQvzcrd', key: 'cogis.jpg' }
                        res.json({//返回前端外链地址，前端再提交放入数据库
                            res_code:'0',
                            res_msg:'上传成功',
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
        desc: req.query.desc,
        url:req.query.url
    });
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