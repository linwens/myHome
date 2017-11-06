var WechatAPI = require('wechat-api');//WeChatapi封装模块
var config = require('./config');//配置参数

//设置所属行业
var industryIds = {
	"industry_id1":'39'
}
api.setIndustry(industryIds,function(err, rslt, next){
	console.log('设置所属行业回调');
})
//获取模板id
var templateIdShort = 'TM00015';
api.addTemplate(templateIdShort, function(err, rslt, next){
	console.log('获取模板id');
});
//获取关注者列表
api.getFollowers(function(err, rslt, next){
	console.log('获取关注者列表');
});
//发送模板消息
var templateId: '模板id';
// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
var url: '';
var data = {
   "first": {
     "value":"恭喜你购买成功！",
     "color":"#173177"
   },
   "keyword1":{
     "value":"巧克力",
     "color":"#173177"
   },
   "keyword2": {
     "value":"39.8元",
     "color":"#173177"
   },
   "keyword3": {
     "value":"2014年9月22日",
     "color":"#173177"
   },
   "remark":{
     "value":"欢迎再次购买！",
     "color":"#173177"
   }
};
api.sendTemplate('openid', templateId, url, data, function(err, rslt, next){
	console.log('消息已发出');
});
