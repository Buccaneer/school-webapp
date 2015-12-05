angular
  .module('flapperNews')
  .controller('NavCtrl', ['$scope', 'auth', NavCtrl]);

function NavCtrl($scope, auth) {
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}
