angular.module('flapperNews.authentication', []);
angular.module('flapperNews.slider', ['ngAnimate']);
angular.module('flapperNews.posts', []);
angular.module('flapperNews.home', []);
var app = angular.module('flapperNews',
['ui.router',
 'flapperNews.authentication',
 'flapperNews.slider',
 'flapperNews.posts',
 'flapperNews.home'
]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
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
        })
      .state(
        'posts', {
          url: '/posts/{id}',
          templateUrl: 'app/posts/posts.template.html',
          controller: 'PostsCtrl',
          resolve: {
            post: ['$stateParams', 'posts', function($stateParams, posts) {
              return posts.get($stateParams.id);
            }]
          }
        }
      )
      .state('login', {
        url: '/login',
        templateUrl: 'app/authentication/auth.login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/authentication/auth.register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      });
    $urlRouterProvider.otherwise("home");
  }
]);
