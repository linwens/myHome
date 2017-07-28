var Html5 = require('./mongoose').Html5;
var uuid = require('node-uuid');
//作品发布
exports.subH5 = function(req, res, next){
	var html5 = new Html5({
	    time: Math.round(Date.parse(new Date())/1000),
	    name: req.query.name,
	    desc:req.query.desc,
	    hid:uuid.v1()
	});
	//判断是修改还是新加
	if(req.query.option&&req.query.option=='modify'){
		Html5.update({hid:req.query.hid}, {name: req.query.name,desc:req.query.desc},function(err, data){
			if(err){
			    console.log(err);
			}else{
			    console.log('Updated:', data);
			    res.json({
			        res_code:1,
			        res_msg:'作品修改成功'
			    })
			}
		})
	}else{
		html5.save(function(err, data){
		    if(err){
		        console.log(err);
		    }else{
		        console.log('Saved:', data);
		        res.json({
		            res_code:1,
		            res_msg:'作品保存成功'
		        })
		    }
		})
	}
};
//作品删除
exports.RemoveH5 = function(req, res, next){
	console.log('query==getArticle=='+JSON.stringify(req.query));
	Html5.remove({hid:req.query.hid},function(err, data){
		if(err){
		    console.log(err);
		}else{
			if(data&&data!=''){
				res.json({
				    res_code:1,
				    res_msg:'作品删除成功'
				})
			}else{
				res.json({
					res_code:2,
					res_msg:'作品不存在'
				})
			}
		}
	});
};
//作品列表获取
exports.Geth5list = function(req, res, next){
	console.log('query==getH5=='+JSON.stringify(req.query));
	//查询条件
	var schWord = req.query.schWord?req.query.schWord:null,
		curPage = req.query.curPage?parseInt(req.query.curPage):1,
		pageSize = req.query.pageSize?parseInt(req.query.pageSize):5,
		findParams = {};//筛选
	if(schWord){//标题，正文，标签内包含关键字(js的RegExp对象)
		var schRegExp = new RegExp(schWord,"i");
		findParams = {"$or":[{'name':schRegExp}, {'desc':schRegExp}]};
	}
	Html5.count(findParams,function(err, total){//为了获取总条数
		Html5.find(findParams).skip((curPage-1)*pageSize).limit(pageSize).sort({time:-1}).exec(function(err, data){
		    if(err){
		        console.log(err);
		        res.json({
		            res_code:4,
		            res_msg:'h5列表数据出错'
		        })
		    }else{
		    	console.log('find:',data);
		    	if(data&&data!=''){
		    		res.json({
		    		    res_code:1,
		    		    dataList:data,
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
		    		    total:total,
		    			res_msg:'暂无相关作品'
		    		})
		    		return
		    	}
		    };
		});
	});
};
//作品详情获取
exports.GetH5 = function(req, res, next){
	Html5.find({hid:req.query.hid},function(err, data){
		console.log('data===='+data);
	    if(err){
	        console.log(err);
	        res.json({
	        	res_code:4,
	        	res_msg:'获取作品详情错误'
	        })
	    }else{
	    	if(data&&data!=''){
	    		res.json({
	    		    res_code:1,
	    		    H5Detail:{
	    		        name:data[0].name,
	    		        time:data[0].time,
	    		        desc:data[0].desc?data[0].desc:'获取的作品没有描述'
	    		    }
	    		})
	    	}else{
	    		res.json({
	    			res_code:2,
	    			res_msg:'作品不存在'
	    		})
	    	}
	    };
	});
};