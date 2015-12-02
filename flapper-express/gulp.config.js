module.exports = function() {
  var client = './src/client/';
  var server = './src/server/';
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
    clientjs: [client + '**/*.js', client + '**/*.module.js'],
    index: client + 'index.ejs',
    sass: client + 'stylesheets/*.scss',

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
    defaultPort: 3000,
    nodeServer: server + 'app.js',
    server: server
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
