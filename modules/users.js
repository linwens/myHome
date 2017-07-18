var User = require('./mongoose').User;
//登录
exports.Login = function(req, res, next){
	var users = new User({//针对vue本地调试，改为body=>query
        username: decodeURI(req.query.username),
        password: decodeURI(req.query.password)
    });
    User.find({username:users.username}, function(err, data){
        if(err){
            console.log(err);
        }else{
            if(data&&data!=''){
                console.log('find:', data);
                if(data[0].password == users.password){//验证密码
                    res.json({
                        res_code:'1',
                        res_msg:'登录成功',
                        data:{
                            uid:data[0]._id
                        }
                    })
                }else{
                    res.json({
                        res_code:'2',
                        res_msg:'密码错误'
                    })
                }
            }else{
                res.json({
                    res_code:'-1',
                    res_msg:'用户不存在'
                });
            }
        }
    })
};
//注册
exports.Regist = function(req, res, next){
	console.log('body==regist=='+JSON.stringify(req.body));
    var users = new User({
        username: req.body.username,
        password: req.body.password
    });
    User.find({username:users.username}, function(err, data){//mongoose里model的实例不存在find方法，用users.find()会报错，所以用User.find()
        if(err){
            console.log(err);
        }else{
            console.log('find:', data);
            if(data&&data!=''){
                res.json({
                    res_code:'0',
                    res_msg:'用户已经存在'
                });
                return;
            }else{
                users.save(function(err, data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Saved:', data);
                        //返回前端一个唯一id
                        res.json({
                            res_code:'1',
                            res_msg:'注册成功',
                            data:{
                                uid:data[0]._id
                            }
                        })
                    }
                })
            }
        }
    })
}