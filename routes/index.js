import express from 'express'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '我的首页' });
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
module.exports = router;
