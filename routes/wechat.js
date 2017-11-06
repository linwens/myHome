var express = require('express'); 
var router = express.Router(); 
var wechat = require('wechat');//引入微信模块 
var WechatAPI = require('wechat-api');//WeChatapi封装模块
var config = require('./config');//配置参数
var menus = require('./menus');//菜单json

var api = new WechatAPI(config.appid, config.appsecret);
//生成自定义菜单
api.createMenu(menus,function(err, rslt, next){
	if(err){
		console.log(err);
	}else{
		console.log(rslt);
	}
});
router.use(express.query());//
router.use('/',wechat(config, function(req, res, next){
	// 微信输入信息都在req.weixin上 
	var wcMsg = req.weixin;
	console.log(wcMsg);
	console.log(wcMsg.MsgType);
	console.log(wcMsg.MsgType==='text');
	//res.reply('Hello world!');
	//关注公众号时回复
	if(wcMsg.Event ==='subscribe'){
		res.reply('感谢亲爱的关注~~');
	};
	//自动回复文字消息模板
	if(wcMsg.MsgType==='text'){
		switch(wcMsg.Content){
			case '1': res.reply('看照片');
				break;
			case '2': res.reply('看文章');
				break;
			case '3': res.reply('玩游戏');
				break;
				break;
			default: res.reply('亲爱的，发送1 可以查看照片;</br>发送2 可以查看文章;</br>发送3 可以玩游戏;');
		}
	}
}))
module.exports = router;
