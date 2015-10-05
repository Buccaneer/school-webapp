var app = angular.module('flapperNews', [ 'ui.router' ]);

app.controller('MainCtrl', [
  '$scope',
  'posts',
  function($scope, posts){
    $scope.posts = posts.posts;

    $scope.addPost = function () {
      if (!$scope.title || $scope.title === '') return;
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          {author: 'God', body: 'That\'s what she said', upvotes: 2},
          {author: 'Jesus', body: 'Vader, ben jij dat?', upvotes: 1}
        ]
      });
      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    }

    $scope.decrementUpvotes = function(post) {
      post.upvotes -= 1;
    }

    $scope.incrementCommentUpvotes = function(comment) {
      comment.upvotes += 1;
    }

    $scope.decrementCommentUpvotes = function(comment) {
      comment.upvotes -= 1;
    }

  }
]);

app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts){
    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = function() {
      $scope.post.comments.push({
        author: 'user',
        body: $scope.body,
        upvotes: 0
      });
      scope.body = '';
    }

  }

]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state(
      'home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      })
      .state(
        'posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
          controller: 'PostsCtrl'
        }
      );
    $urlRouterProvider.otherwise("home");
}]);

app.factory('posts', [ function(){
  var postFactory = {
    posts: [
      {title: 'Pieter-Jan kan goed programmeren', link: 'http://www.google.be', upvotes: 9999, comments: [
        {author: 'God', body: 'That\'s what she said', upvotes: 2},
        {author: 'Jesus', body: 'Vader, ben jij dat?', upvotes: 1}
      ]},
      {title: 'Maar niet heus', link: 'http://www.google.be', upvotes: 500},
      {title: 'Toch wel', link: 'http://www.google.be', upvotes: 40},
      {title: 'Ok dan', link: 'http://www.google.be', upvotes: 17},
      {title: 'Ik heb het laatste woord', link: 'http://www.google.be', upvotes: -20}
    ]
  }
  return postFactory;
}]);
