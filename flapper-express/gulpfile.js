var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

var testFolder = './test';
var javascriptFolder = './public/javascripts';

gulp.task('runTests', function() {
  return gulp.src(testFolder + '/*.js').pipe(plugins.mocha());
});

gulp.task('compress', function() {
  return gulp.src(javascriptFolder + '/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
