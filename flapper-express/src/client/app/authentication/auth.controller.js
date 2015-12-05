angular
.module('flapperNews.authentication')
.controller('AuthCtrl', ['$scope','$state','auth',AuthCtrl]);

function AuthCtrl($scope, $state, auth) {
  $scope.user = {};

  $scope.register = register;
  $scope.logIn = logIn;

  function register() {
    auth.register($scope.user).error(handleError).then(goHome);
  }

  function logIn() {
    auth.logIn($scope.user).error(handleError).then(goHome);
  }

  function handleError(error) {
    $scope.error = error;
  }

  function goHome() {
    $state.go('home');
  }
}
