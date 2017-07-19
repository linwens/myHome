var Articles = require('./mongoose').Articles;
var marked = require('marked');
var uuid = require('node-uuid');
marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false,
	highlight: function (code) {
		return require('highlight.js').highlightAuto(code).value;
	}
});
//文章发布
exports.Subarticle = function(req, res, next){
	var tags = [];//针对vue本地调试，改为body=>query
	for(var key in JSON.parse(req.query.tags)){
	    tags.push(JSON.parse(req.query.tags)[key])
	}
	var articles = new Articles({
	    time: Math.round(Date.parse(new Date())/1000),
	    title: req.query.title,
	    text:req.query.text,
	    tags:tags,//req.query.tags?Object.values(req.query.tags):[]//遍历对象生成数组
	    aid:uuid.v1(),
	    pv:0
	});
	//判断是修改还是新加
	if(req.query.option&&req.query.option=='modify'){//文章修改返回原markdown
		Articles.update({aid:req.query.aid}, {title: req.query.title,text:req.query.text,tags:tags},function(err, data){
			if(err){
			    console.log(err);
			}else{
			    console.log('Updated:', data);
			    res.json({
			        res_code:1,
			        res_msg:'文章修改成功'
			    })
			}
		})
	}else{
		articles.save(function(err, data){
		    if(err){
		        console.log(err);
		    }else{
		        console.log('Saved:', data);
		        res.json({
		            res_code:1,
		            res_msg:'文章保存成功'
		        })
		    }
		})
	}
};
//文章删除
exports.Removearticle = function(req, res, next){
	console.log('query==getArticle=='+JSON.stringify(req.query));
	Articles.remove({aid:req.query.aid},function(err, data){
		if(err){
		    console.log(err);
		}else{
			if(data&&data!=''){
				res.json({
				    res_code:1,
				    res_msg:'文章删除成功'
				})
			}else{
				res.json({
					res_code:2,
					res_msg:'文章不存在'
				})
			}
		}
	});
};
//文章详情获取
exports.Getarticle = function(req, res, next){
	console.log('query==getArticle=='+JSON.stringify(req.query));
	Articles.find({aid:req.query.aid},function(err, data){
		console.log('data===='+data);
	    if(err){
	        console.log(err);
	    }else{
	    	if(data&&data!=''){
	    		//data[0].text代表第一条，所以是针对具体id查询一篇文章
	    		console.log('find:',data);
	    		var artText = data[0].text?data[0].text:'获取文章了，但是没有正文';
	    		if(!(req.query.option&&req.query.option=='modify')){//文章修改返回原markdown
	    			artText = marked(artText)
	    		}
	    		res.json({
	    		    res_code:1,
	    		    articleDetail:{
	    		        title:data[0].title,
	    		        time:data[0].time,
	    		        tags:data[0].tags.length>0?data[0].tags:null,
	    		        text:artText,
	    		        pv:data[0].pv+1
	    		    }
	    		})
	    		//更新阅读量
	    		Articles.update({aid:req.query.aid}, {$inc:{pv:1}},function(err, data){
	    			if(err){//必须要传回调，否则不更新
	    			    console.log(err);
	    			}
	    		});
	    	}else{
	    		res.json({
	    			res_code:2,
	    			res_msg:'文章不存在'
	    		})
	    	}
	    };
	});
};
//文章列表获取
exports.Getlist = function(req, res, next){
	console.log('query==getArticle=='+JSON.stringify(req.query));
	//查询条件
	var schWord = req.query.schWord?req.query.schWord:null,
		curPage = req.query.curPage?parseInt(req.query.curPage):1,
		pageSize = req.query.pageSize?parseInt(req.query.pageSize):5,
		findParams = {};//筛选
	if(schWord){//标题，正文，标签内包含关键字(js的RegExp对象)
		var schRegExp = new RegExp(schWord,"i");
		findParams = {"$or":[{'title':schRegExp}, {'text':schRegExp}, {'tags':schRegExp}]};
	}
	Articles.count(findParams,function(err, total){//为了获取总条数
		Articles.find(findParams).skip((curPage-1)*pageSize).limit(pageSize).sort({time:-1}).exec(function(err, data){
			//console.log('data===='+data);
		    if(err){
		        console.log(err);
		    }else{
		    	if(data&&data!=''){
		    		console.log('find:',data);
		    		for(var i = 0;i<data.length;i++){
		    			data[i].text = marked(data[i].text);
		    		}
		    		res.json({
		    		    res_code:1,
		    		    articleList:data,
		    		    page:curPage,
		    		    page_size:pageSize,
		    		    total:total
		    		})
		    	}else{
		    		res.json({
		    			res_code:2,
		    			res_msg:'暂无文章'
		    		})
		    	}
		    };
		});
	});
	//find(多个对象传参)这样的写法会报错
	// Articles.find({"$or":[{'title':schWork}, {'text':schWork}]}, function(err, data){
	// 		console.log('data===='+data);
	// 	    if(err){
	// 	        console.log(err);
	// 	    }else{
	// 	    	if(data&&data!=''){
	// 	    		console.log('find:',data);
	// 	    		for(var i = 0;i<data.length;i++){
	// 	    			data[i].text = marked(data[i].text);
	// 	    		}
	// 	    		res.json({
	// 	    		    res_code:1,
	// 	    		    articleList:data,
	// 	    		    page:curPage
	// 	    		})
	// 	    	}else{
	// 	    		res.json({
	// 	    			res_code:2,
	// 	    			res_msg:'暂无文章'
	// 	    		})
	// 	    	}
	// 	    };
	// });
}
//全部标签
exports.Gettags = function(req, res, next){
	Articles.find({}).sort({time:-1}).exec(function(err, data){
		if(err){
		    console.log(err);
		}else{
			if(data&&data!=''){//(js的concat()方法)
				//console.log('data:'+data);
				//筛选出标签
				var tagsArr = [];
				var tags = [];
				for(var i=0;i<data.length;i++){
					tagsArr = tagsArr.concat(data[i].tags)
				}
				//console.log('tagsArr:'+tagsArr);
				for(var j = 0;j<tagsArr.length;j++){
					if(tags.indexOf(tagsArr[j])===-1){
						tags.push(tagsArr[j]);
					};
				}
				//console.log('tags:'+tags);
				res.json({
				    res_code:1,
				    tags:tags
				})
			}else{
				res.json({
					res_code:2,
					res_msg:'无任何标签'
				})
			}
		};
	});
}