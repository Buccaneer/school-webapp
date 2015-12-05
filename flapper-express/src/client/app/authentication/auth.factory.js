angular
  .module('flapperNews.authentication')
  .factory('auth', ['$http', '$window', factory]);

function factory($http, $window) {
  var auth = {};

  auth.saveToken = saveToken;
  auth.getToken = getToken;
  auth.isLoggedIn = isLoggedIn;
  auth.currentUser = currentUser;
  auth.register = register;
  auth.logIn = logIn;
  auth.logOut = logOut;

  function saveToken(token) {
    $window.localStorage['flapper-news-token'] = token;
  }

  function getToken() {
    return $window.localStorage['flapper-news-token'];
  }

  function isLoggedIn() {
    var token = auth.getToken();
    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  function currentUser() {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.username;
    }
  }

  function register(user) {
    return $http.post('/register', user).success(function(data) {
      auth.saveToken(data.token);
    });
  }

  function logIn(user) {
    return $http.post('/login', user).success(function(data) {
      auth.saveToken(data.token);
    });
  }

  function logOut() {
    $window.localStorage.removeItem('flapper-news-token');
  }

  return auth;
}
