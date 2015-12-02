var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var args = require('yargs').argv;
var del = require('del');
var $ = require('gulp-load-plugins')({
  lazy: true
});
var port = process.env.PORT || config.defaultPort;

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
  log('Compiling sass ==> css');
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
  log('Wiring up the bower css, js and own js into html');
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream;
  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.clientjs)))
    .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'sass'], function() {
  log('Wiring up own css into html and calling wiredep');
  return gulp
    .src(config.index)
    .pipe($.inject(gulp.src(config.css)))
    .pipe(gulp.dest(config.client));
});

gulp.task('serve-dev', ['inject'], function() {
  var isDev = true;

  var nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.server]
  };

  return $.nodemon(nodeOptions)
    .on('start', function() {
      log('*** nodemon started ***');
      startBrowserSync(isDev);
    })
    .on('restart', function(ev) {
      log('*** nodemon restarted ***');
      log('files changed on restart:\n' + ev);
    })
    .on('exit', function() {
      log('*** nodemon crashed: monkeys have been dispatched to clean up your mess ***');
    })
    .on('crash', function() {
      log('*** nodemon exited ***');
    });
});

function startBrowserSync(isDev) {
  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting browser-sync on port: ' + port);

  /*if (isDev) {
    gulp.watch([config.sass], ['sass'])
      .on('change', function(event) {
        changeEvent(event);
      });
  } else {
    gulp.watch([config.sass, config.clientjs, config.html], ['optimize', browserSync.reload])
      .on('change', function(event) {
        changeEvent(event);
      });
  }*/

  var options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: isDev ? [
      config.client + '**/*.*',
      '!' + config.less,
      config.temp + '**/*.css'
    ] : [],
    ghostMode: {
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectchanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 1000
  };

  browserSync(options);
}

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
