/**
 * Created by sks on 2017/8/15.
 */
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');//js压缩插件

gulp.task('default', function() {
    gulp.src('js/testGulp.js')// 获取流的入口，也就是源文件
        .pipe(uglify())//压缩
        .pipe(rename('testGulp.min.js'))
        .pipe(gulp.dest('build/js')); // 写放文件的api
});
