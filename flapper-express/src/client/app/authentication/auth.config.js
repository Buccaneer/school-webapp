angular
  .module('flapperNews.authentication', ['ui.router'])
  .config(config);

function config($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/authentication/auth.login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', goHome]
    })
    .state('register', {
      url: '/register',
      templateUrl: 'app/authentication/auth.register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', goHome]
    });

  function goHome($state, auth) {
    if (auth.isLoggedIn()) {
      $state.go('home');
    }
  }
}
