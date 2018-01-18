var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('./config');

console.log(process.env.NODE_ENV);
var bs = browserSync.create();
// 静态服务器
gulp.task('browser-sync', function() {
    bs.init({
        proxy: "http://localhost:8488",
        browser: "chrome",
        port: 3001
    });
});
//监听静态资源变化，热更新
gulp.task('default',['browser-sync'], function(){
	gulp.watch(['views/**/*.html', 'public/javascripts/**/*.js', 'public/stylesheets/**/*.css', 'public/images/**/*.{png,jpg,gif,ico}'])
	.on("change",bs.reload);
});