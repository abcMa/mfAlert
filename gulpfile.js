/**
 * Created by sks on 2017/8/15.
 */
var gulp = require('gulp');
gulp.src('js/testGulp.js')         // 获取流的api
    .pipe(gulp.dest('dist/foo.js')); // 写放文件的api