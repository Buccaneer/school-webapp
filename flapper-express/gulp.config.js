module.exports = function() {
  var client = './src/client/';
  var server = './src/server/';
  var build = './build/';
  var temp = './.tmp/';
  var config = {
    /**
     *   Dev directories
     */
    temp: temp,
    css: temp + 'styles.css',
    tests: ['./test/**/*.js'],

    /**
     *   Client directories
     */
    client: client,
    clientjs: [client + '**/*.js', client + '**/*.module.js', client + '**/*.config.js'],
    index: client + 'index.ejs',
    sass: client + 'stylesheets/*.scss',
    images: client + 'img/**/*.*',
    htmltemplates: client + 'app/**/*.html',
    html: client + 'app/**/*.html',

    /**
     *  Build directories
     */
    build: build,
    sourcemaps: './maps',
    optimized: {
      app: 'app.js',
      lib: 'lib.js'
    },

    /**
     *  Bower and NPM directories
     */
    bower: {
      json: require('./bower.json'),
      directory: './bower_components/',
      ignorePath: '../..'
    },

    /**
     *  Server directories and settings
     */
    defaultPort: 8000,
    nodeServer: server + 'app.js',
    server: server,

    /**
     *  Template cache
     */
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'flapperNews.templates',
        standalone: true,
        root: 'app/'
      }
    },

    /**
     *  Browser sync
     */
    browserReloadDelay: 1000
  };

  config.getWiredepDefaultOptions = function() {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  return config;
};
