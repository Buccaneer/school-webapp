var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var port = process.env.PORT || 8000;

var environment = process.env.NODE_ENV;

// require models
require('./models');

// require passport config
require('./config/passport');

// init database
mongoose.connect('mongodb://localhost/news');

var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(passport.initialize());

var routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function(req, res, next) {
  console.log(req.body);
  res.send('pong');
});

switch (environment) {
  case 'build':
    console.log('** BUILD **');
    app.set('views', path.join(__dirname, '../../build'));
    app.use(express.static('./build'));
    app.use('/*', express.static('./build/index.ejs'));
    break;
  default:
    console.log('** DEV **');
    app.set('views', path.join(__dirname, '../client'));
    app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    //app.use(express.static('./tmp'));
    app.use('/*', express.static('./src/client/index.ejs'));
    break;
}

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});

module.exports = app;
