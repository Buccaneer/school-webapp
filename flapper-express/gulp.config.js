module.exports = function() {
  var client = './src/client/';
  var config = {
    /**
     *   Dev directories
     */
    temp: './.tmp/',
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
    }
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
