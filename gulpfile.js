'use strict';
var gulp = require('gulp'),
  connect = require('gulp-connect'),
  port = 3333;
var rename = require('gulp-rename');
var plumber = require('gulp-plumber'); // 错误处理插件
var notify = require('gulp-notify'); // 消息插件
var autoprefixer = require('gulp-autoprefixer'); // 自动添加前缀
var minifycss = require('gulp-clean-css');
var minifyhtml = require('gulp-html-minifier');
var minifyjs = require('gulp-uglify');
var del = require('del');
var proxy = require('http-proxy-middleware');
var less = require('gulp-less');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

gulp.task('Less', function () {
  gulp.src('./less/pc.less')
    .pipe(less())
    .pipe(gulp.dest('./css'));
});
gulp.task('server', function () {
  connect.server({
    root: [__dirname],
    port: port,
    livereload: true,
    middleware: function (connect, opt) {
      return [
        proxy(['/getDiscount', '/getVista', '/getCommodity', '/getSuggestion'], {// configure proxy middleware
          // context: '/' will proxy all requests
          // use: '/api' to proxy request when path starts with '/api'
          target: 'http://localhost:3000',
          changeOrigin: true    // for vhosted sites, changes host header to match to target's host
        }),
        proxy(['/infoline', '/search'], {// configure proxy middleware
          // context: '/' will proxy all requests
          // use: '/api' to proxy request when path starts with '/api'
          target: 'http://dict.youdao.com',
          changeOrigin: true    // for vhosted sites, changes host header to match to target's host
        }),
        proxy(['/deals'], {
          target: 'http://www.huihui.cn',
          changeOrigin: true
        })
      ]
    }
  });
});
gulp.task('reload', function () {
  gulp.src(['./pc.html'])
    .pipe(connect.reload());
});
gulp.task('concatJS', function(){
  gulp.src(['./src/global.js','./src/pullcontent.js'])
    .pipe(concat('pc.js'))
    .pipe(gulp.dest('./src/'));
});
gulp.task('default', ['server'], function () {
  gulp.watch(['less/**/*.less'], ['Less']);
  gulp.watch(['src/global.js','src/pullcontent.js'],['concatJS']);
  gulp.watch(['*.html', 'css/**/*.css', 'src/pc.js', 'src/autocomplete_json.js', 'libs/**/*.js'], ['reload']);
});
gulp.task('clean',function(){
  return del(["./build/**/*"]);
});
gulp.task('minifycss',['clean'],function(){
  return gulp.src("./css/**/*.css")
    .pipe(minifycss())
    //.pipe(rev())
    .pipe(gulp.dest("./build/css"))
    //.pipe(rev.manifest())
    //.pipe(gulp.dest('rev/css'));
});
gulp.task('minifyLibjs',['clean'],function(){
  return gulp.src("./libs/**/*.js")
    .pipe(minifyjs())
    .pipe(gulp.dest("./build/libs"));
});
gulp.task('minifySrcjs',['clean','concatJS'],function(){
  return gulp.src(['!./src/global.js','!./src/pullcontent.js',"./src/**/*.js"])
    .pipe(minifyjs())
    //.pipe(rev())
    .pipe(gulp.dest("./build/src"))
    //.pipe(rev.manifest())
    //.pipe(gulp.dest('rev/js'));
});
gulp.task('minifyhtml',['clean'],function(){
  return gulp.src("./*.html")
    .pipe(minifyhtml({collapseWhitespace : true,removeComments: true}))
    .pipe(gulp.dest("./build"));
});
gulp.task('build',['minifycss','minifyLibjs','minifySrcjs','minifyhtml'],function(){
  return gulp.src("./imgs/**/*")
    .pipe(gulp.dest("./build/imgs"));
});

gulp.task('rev', function () {
    return gulp.src(["./rev/**/*.json","build/pc.html","build/css/pc.css"])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                './css': 'http://shared.ydstatic.com/dict/v2016',
                'libs' : 'http://shared.ydstatic.com/js/jquery',
                'src': 'http://shared.ydstatic.com/dict/v2016',
                './imgs' : 'http://shared.ydstatic.com/dict/v2016',
                '../imgs' : 'http://shared.ydstatic.com/dict/v2016'
                }
            }
        ))
        .pipe( gulp.dest('build/rev') );
});