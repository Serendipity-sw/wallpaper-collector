const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const zip = require('gulp-zip');
const moment = require('moment-kirk');
const packageInfo = require('./package.json');

gulp.task('buildTime', done => {
        fs.writeFile(path.resolve('./dist') + '/buildTime.txt', moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + packageInfo.version, function (err) {
            if (err) {
                return console.log(err);
            }
        });
        done();
    }
);
gulp.task('zip', done => {
        gulp.src(path.resolve('./dist/**'))
            .pipe(zip('pc-[' + packageInfo.version + ']-[' + moment(new Date()).format('YYYY-MM-DD HH-mm-ss') + '].zip'))
            .pipe(gulp.dest('backup'));
        done();
    }
);
