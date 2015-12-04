var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var args = require('yargs').argv;
var del = require('del');
var $ = require('gulp-load-plugins')({
  lazy: true
});
var port = process.env.PORT || config.defaultPort;

gulp.task('default', ['help']);

gulp.task('help', $.taskListing);

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

gulp.task('optimize', ['inject', 'images', 'clean-maps'], function() {
  log('Optimizing the javascript, css & html.');

  var templateCache = config.temp + config.templateCache.file;
  var cssFilter = $.filter('**/*.css', {
    restore: true
  });
  var jsFilter = $.filter(['**/*.js'], {
    restore: true
  });

  return gulp.src(config.index)
    .pipe($.plumber())
    .pipe($.inject(gulp.src(templateCache, {
      read: false
    }), {
      starttag: '<!-- inject:templates:js -->'
    }))
    .pipe($.useref({
      searchPath: './'
    }))
    .pipe($.sourcemaps.init())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore)
    .pipe($.sourcemaps.write(config.sourcemaps))
    .pipe(gulp.dest(config.build));
});

gulp.task('test', function() {
  log('Running tests');
  return gulp.src(config.tests)
    .pipe($.mocha());
});

/*gulp.task('build', function() {
  return gulp.src([config.clientjs])
    .pipe($.sourcemaps.init())
    .pipe($.concat('concat.js'))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});*/

gulp.task('images', ['clean-images'], function() {
  log('Copying and compressing images');

  return gulp.src(config.images)
    .pipe($.imagemin({
      optimizationLevel: 4
    }))
    .pipe(gulp.dest(config.build + 'images'));
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

gulp.task('clean', function() {
  var delconfig = [].concat(config.build, config.temp);
  log('Cleaning: ' + $.util.colors.blue(delconfig));
  del(delconfig);
});

gulp.task('clean-css', function() {
  clean(config.temp + '**/*.css');
});

gulp.task('clean-images', function() {
  clean(config.build + 'images/**/*.*');
});

gulp.task('clean-code', function() {
  var files = [].concat(
    config.temp + '**/*.js',
    config.build + '**/*.html',
    config.build + 'js/**/*.js'
  );
  clean(files);
});

gulp.task('clean-maps', function() {
  clean(config.build + 'maps/**/*.*');
});

gulp.task('templatecache', ['clean-code'], function() {
  log('Creating AngularJS $templateCache');

  return gulp.src(config.htmltemplates)
    //It appears minifying is now done by default by templateCache?
    /*.pipe($.minifyHtml({
      empty: true
    }))*/
    .pipe($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.temp));
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

gulp.task('inject', ['wiredep', 'sass', 'templatecache'], function() {
  log('Wiring up own css into html and calling wiredep');
  return gulp
    .src(config.index)
    .pipe($.inject(gulp.src(config.css)))
    .pipe(gulp.dest(config.client));
});

gulp.task('serve-build', ['optimize'], function() {
  serve(false);
});

gulp.task('serve-dev', ['inject'], function() {
  serve(true);
});

function serve(isDev) {
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
      log('Files changed on restart:\n' + ev);
      setTimeout(function() {
        browserSync.notify('Reloading...');
        browserSync.reload({
          stream: false
        });
      }, config.browserReloadDelay);
    })
    .on('exit', function() {
      log('*** nodemon crashed: monkeys have been dispatched to clean up your mess ***');
    })
    .on('crash', function() {
      log('*** nodemon exited ***');
    });
}

function startBrowserSync(isDev) {
  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting browser-sync on port: ' + port);

  if (isDev) {
    gulp.watch([config.sass], ['sass'])
      .on('change', function(event) {
        changeEvent(event);
      });
  } else {
    gulp.watch([config.sass, config.clientjs, config.html], ['optimize', browserSync.reload])
      .on('change', function(event) {
        changeEvent(event);
      });
  }

  var options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: isDev ? [
      config.client + '**/*.*',
      '!' + config.sass,
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
    reloadDelay: 100
  };

  browserSync(options);
}

function changeEvent(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
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

function clean(path) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path);
}
