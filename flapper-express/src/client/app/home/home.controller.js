angular
  .module('flapperNews.home')
  .controller('HomeCtrl', ['$scope', 'posts', 'auth', HomeCtrl]);

function HomeCtrl($scope, posts, auth) {
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.posts = posts.posts;
  $scope.addPost = addPost;
  $scope.incrementUpvotes = incrementUpvotes;
  $scope.decrementUpvotes = decrementUpvotes;

  function addPost() {
    if (!$scope.title || $scope.title === '') {
      return;
    }
    posts.create({
      title: $scope.title,
      link: $scope.link
    });
    $scope.title = '';
    $scope.link = '';
  }

  function incrementUpvotes(post) {
    posts.upvote(post);
  }

  function decrementUpvotes(post) {
    posts.downvote(post);
  }

}
