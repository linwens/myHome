var express = require('express'); 
var router = express.Router(); 
var wechat = require('wechat');//引入微信模块
var config = require('./config');//配置参数
var wcNotice = require('./sendMsg').wcNotice;//发送模板通知模块
var wcSet = require('./set');//公众号基本配置

router.use(express.query());
//发送模板通知接口
router.post('/notice',function(req, res, next){
	var type = req.body.type?String(req.body.type):1;
	wcSet(type,function(wc_info){
		var opt = {
			data:{}
		};
		for(var key in wc_info){
			opt[key] = wc_info[key];
		}
		opt.openid = req.body.openid?req.body.openid:'omclkxIWNZj5KiIkj3jorwTMT5sE';
		opt.redUrl = 'https://www.shy-u.xyz';//通知信息点击重定向地址
		opt.type = type;
		opt.data.first = req.body.first?req.body.first:'first';
		opt.data.keyword1 = req.body.keyword1?req.body.keyword1:'keyword1';
		opt.data.keyword2 = req.body.keyword2?req.body.keyword2:'keyword2';
		opt.data.keyword3 = req.body.keyword3?req.body.keyword3:'keyword3';
		opt.data.keyword4 = req.body.keyword4?req.body.keyword4:'keyword4';
		opt.data.remark = req.body.remark?req.body.remark:'remark';
		console.log(opt);
		wcNotice(opt, function(err, rslt){
			if(err){
			    res.json({
			        code:1,
			        msg:'消息发送失败'
			    })
			}else{
			    res.json({
			        code:0,
			        msg:'消息已发出'
			    })
			}
		});
	});
});
router.use('/',wechat(config, function(req, res, next){
	// 微信输入信息都在req.weixin上 
	var wcMsg = req.weixin;
	//关注公众号时回复
	if(wcMsg.Event ==='subscribe'){
		res.reply('感谢你的关注~~');
	};
	//自动回复文字消息模板
	if(wcMsg.MsgType==='text'){
		switch(wcMsg.Content){
			case '1': res.reply('看照片');
				break;
			case '2': res.reply('看文章');
				break;
			case '3': res.reply([
  						{
						    title: '这是一个小游戏',
						    description: '这个游戏是用js写的',
						    picurl: 'https://www.shy-u.xyz/h5static/third/img/data/intro.jpg',
						    url: 'https://www.shy-u.xyz/h5Demo/third'
  						}
					]);
				break;
			default: res.reply('亲爱的，发送1 可以查看照片;</br>发送2 可以查看文章;</br>发送3 可以玩游戏;');
		}
	}
}));

module.exports = router;
