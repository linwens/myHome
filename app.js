import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import wechat from './routes/wechat';//引入微信模块

import db from './linkMongo';
import index from './routes/index';
import ajaxHandler from './routes/ajaxHandler';

let app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'carqi.ico')));//设置页面标签图标
app.use(logger('dev'));//设置日志文件格式https://github.com/expressjs/morgan/#predefined-formats
//对post请求的请求体进行解析的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//处理每一个请求的cookie,里面的字符串用于cookie签名
app.use(cookieParser());
//session设置
app.use(session({
	name:'xuxuweb',
	secret:'signSessionid',
	saveUninitialized: false,
	resave: true,
	cookie:{
	    secure: false,
	    httpOnly: true,
	    maxAge: null
	}
}))
//静态资源处理
app.use(express.static(path.join(__dirname, 'public')));//主页面获取静态资源路径
app.use('/h5static', express.static(path.join(__dirname, 'views/h5Demo')));//H5宣传页获取静态资源路径

//页面路由处理
app.use('/', index);
//请求处理
app.use('/ajax', ajaxHandler);
//微信请求处理
app.use('/wechat',wechat);

//在 Express 中，404 并不是一个错误（error）。因此，错误处理器中间件并不捕获 404。
//Express 执行了所有中间件、路由之后还是没有获取到任何输出，就会走到这里
app.use((req, res, next)=>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next)=>{
	console.log('进入错误处理');
	console.log(req.app);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 设置响应头状态值
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
