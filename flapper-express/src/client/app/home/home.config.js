angular
  .module('flapperNews.home', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', config]);

function config($stateProvider, $urlRouterProvider) {
  $stateProvider.state(
    'home', {
      url: '/home',
      templateUrl: 'app/home/home.template.html',
      controller: 'HomeCtrl',
      resolve: {
        postPromise: ['posts', function(postFactory) {
          return postFactory.getAll();
        }]
      }
    });
  $urlRouterProvider.otherwise('home');
}
