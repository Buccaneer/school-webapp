angular
  .module('flapperNews.posts')
  .controller('PostsCtrl', ['$scope', 'posts', 'post', PostsCtrl]);

function PostsCtrl($scope, posts, post) {
  $scope.post = post;
  $scope.addComment = addComment;
  $scope.incrementCommentUpvotes = incrementCommentUpvotes;
  $scope.decrementCommentUpvotes = decrementCommentUpvotes;

  function addComment() {
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
  }

  function incrementCommentUpvotes(comment) {
    posts.upvoteComment(post, comment);
  }

  function decrementCommentUpvotes(comment) {
    posts.downvoteComment(post, comment);
  }
}
