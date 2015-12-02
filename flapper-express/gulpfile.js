var gulp = require('gulp');
var config = require('./gulp.config')();
var args = require('yargs').argv;
var del = require('del');
var $ = require('gulp-load-plugins')({
  lazy: true
});

gulp.task('default', ['vet']);

gulp.task('tests', function() {
  log('Runnings tests');
  return gulp.src([config.tests]).pipe($.mocha());
});

gulp.task('vet', function() {
  log('Analyzing client-side source code with JSHint and JSCS');
  return gulp.src(config.clientjs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'), {
      verbose: true
    })
    .pipe($.jshint.reporter('fail'));
});

gulp.task('build', function() {
  return gulp.src([config.clientjs])
    .pipe($.sourcemaps.init())
    .pipe($.concat('concat.js'))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sass', ['clean-css'], function() {
  log('Compiling Sass ==> CSS');
  return gulp.src(config.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', '> 5%']
    }))
    .pipe(gulp.dest(config.temp));
});

gulp.task('sass-watch', function() {
  return gulp.watch(config.sass, ['sass']);
});

gulp.task('clean-css', function() {
  var files = config.temp + '**/*.css';
  clean(files);
});

gulp.task('wiredep', function() {
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream;
  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.clientjs)))
    .pipe(gulp.destination(config.client));
});

function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

function clean(path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path);
}
