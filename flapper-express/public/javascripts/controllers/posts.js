angular.module('flapperNews.controllers').controller('PostsCtrl', [
  '$scope',
  'posts',
  'post',
  function($scope, posts /*$stateParams*/ , /*posts*/ post) {
    $scope.post = post;
    //$scope.post = posts.posts[$stateParams.id];
    $scope.addComment = function() {
      if ($scope.body === '') {
        return;
      }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.incrementCommentUpvotes = function(comment) {
      posts.upvoteComment(post, comment);
    }

    $scope.decrementCommentUpvotes = function(comment) {
      posts.downvoteComment(post, comment);
    }

  }
]);
