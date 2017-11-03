var express = require('express');
var router = express.Router();
var wechat = require('wechat');//引入微信模块
var config = {
	token: 'lwswc',
	appid: 'wx60feb6101192d655',
	encodingAESKey: 'HGSxcjUaE6TeWz64o2jHxOXt66z9wBFTlrmwG0dK1Mz',
	checkSignature: false // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

router.use(express.query());//
router.use('',wechat(config, function(req, res, next){

	// 微信输入信息都在req.weixin上 
	var message = req.weixin;
	console.log(message);
	res.reply('Hello world!');
}))
module.exports = router;
