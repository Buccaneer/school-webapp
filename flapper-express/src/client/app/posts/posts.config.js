angular.module('flapperNews.posts', ['ui.router']).config([
  '$stateProvider',
  function($stateProvider) {
    $stateProvider.state(
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
    );
  }
]);
