import express from 'express'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.users) {//测试session
    if(req.session.isVisit){
      req.session.isVisit++;
    }else{
      req.session.isVisit = 1;
    }
    console.log(req.sessionID);
    console.log('<p>第 ' + req.session.isVisit + '次来到此页面</p>');
  }

	if(req&&req.signedCookies){
		console.log('signedCookie:',req.signedCookies);//{ uid: '594cd242f4b9451d70f9924c' },而不是签名后的字符串
	}
  res.render('index', { title: 'Express' });
});
//H5宣传
router.get('/h5Demo', function(req, res, next) {
    res.render('h5Demo/index', { title: 'h5Demo' });
});
router.get('/h5Demo/:name', function(req, res, next) {
  	res.render('h5Demo/'+req.params.name+'/index', { title: req.params.name });
});
//个人摄影作品
router.get('/gallery', function(req, res, next) {
  res.render('gallery', { title: 'gallery' });
});
//博客
router.get('/blog', function(req, res, next) {
  res.render('blog/index', { title: '我的博客', type:'blog' });//type用于区别渲染
});
router.get('/blog/detail', function(req, res, next) {
  res.render('blog/index', { title: '文章详情页面', type:'detail' });
});
//后台页面
router.get('/admin', function(req, res, next) {
  res.render('vue', { title: '后台系统' });
});
//以下是测试页面
router.get('/test', function(req, res, next) {
  	res.render('test', { title: '测试' });
});
router.get('/testLogin', function(req, res, next) {
    res.render('testLogin', { title: '测试登录' });
});
router.get('/b_index', function(req, res, next) {
    res.render('b_index', { title: '新首页' });
});
router.get('/b_gallery', function(req, res, next) {
    res.render('b_gallery', { title: '新照片页' });
});
router.get('/b_blog', function(req, res, next) {
    res.render('blog/b_blog', { title: '新blog页' });
});
module.exports = router;
