var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

var testFolder = './test';
var javascriptFolder = './public/javascripts';

gulp.task('default', ['build']);

gulp.task('tests', function() {
  return gulp.src([testFolder + '/*.js']).pipe(plugins.mocha());
});

gulp.task('build', function() {
  return gulp.src([javascriptFolder + '/**/*.js'])
  .pipe(sourcemaps.init())
  .pipe(concat('concat.js'))
  //.pipe(gulp.dest('dist'))
  //.pipe(rename('uglify.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./build/'));
});

/*gulp.task('concat', function() {
  return gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('uglify', function() {
  return gulp.src(javascriptFolder + '/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});*/

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
