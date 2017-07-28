var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
  res.render('blog/index', { title: 'Blog' });
});
router.get('/blog/detail', function(req, res, next) {
  res.render('blog/detail', { title: 'Blog详情页' });
});
//后台页面
router.get('/admin', function(req, res, next) {
  res.render('vue', { title: '后台系统' });
});
//测试页面
router.get('/test', function(req, res, next) {
  res.render('test', { title: '测试' });
});
module.exports = router;
