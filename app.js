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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'carqi.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser('signLwscookies'));//处理每一个请求的cookie,里面的字符串用于cookie签名

//session设置
app.use(cookieParser());
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

app.use(express.static(path.join(__dirname, 'public')));//主页面获取静态资源路径
app.use('/h5static', express.static(path.join(__dirname, 'views/h5Demo')));//H5宣传页获取静态资源路径

app.use('/', index);
app.use('/ajax', ajaxHandler);
app.use('/wechat',wechat);

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
