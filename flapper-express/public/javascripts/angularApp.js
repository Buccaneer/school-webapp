var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
  '$scope',
  'posts',
  'auth',
  function($scope, posts, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.posts = posts.posts;

    $scope.addPost = function() {
      if (!$scope.title || $scope.title === '') return;
      posts.create({
        title: $scope.title,
        link: $scope.link
      });
      /*$scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [{
          author: 'God',
          body: 'That\'s what she said',
          upvotes: 2
        }, {
          author: 'Jesus',
          body: 'Vader, ben jij dat?',
          upvotes: 1
        }]
      });*/
      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post) {
      posts.upvote(post);
    }

    $scope.decrementUpvotes = function(post) {
      posts.downvote(post);
    }

  }
]);

app.controller('PostsCtrl', [
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

app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  function($scope, $state, auth) {
    $scope.user = {};

    $scope.register = function() {
      auth.register($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };

    $scope.logIn = function() {
      auth.logIn($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };
  }
])

app.controller('NavCtrl', [
  '$scope',
  'auth',
  function($scope, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
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
          controller: 'MainCtrl',
          resolve: {
            postPromise: ['posts', function(postFactory) {
              return postFactory.getAll();
            }]
          }
        })
      .state(
        'posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
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
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
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

app.factory('posts', ['$http', 'auth', function($http, auth) {
  var postFactory = {
    posts: []
      /*posts: [{
        title: 'Pieter-Jan kan goed programmeren',
        link: 'http://www.google.be',
        upvotes: 9999,
        comments: [{
          author: 'God',
          body: 'That\'s what she said',
          upvotes: 2
        }, {
          author: 'Jesus',
          body: 'Vader, ben jij dat?',
          upvotes: 1
        }]
      }, {
        title: 'Maar niet heus',
        link: 'http://www.google.be',
        upvotes: 500
      }, {
        title: 'Toch wel',
        link: 'http://www.google.be',
        upvotes: 40
      }, {
        title: 'Ok dan',
        link: 'http://www.google.be',
        upvotes: 17
      }, {
        title: 'Ik heb het laatste woord',
        link: 'http://www.google.be',
        upvotes: -20
      }]*/
  };

  postFactory.getAll = function() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, postFactory.posts);
    });
  };

  postFactory.create = function(post) {
    return $http.post('/posts', post, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      postFactory.posts.push(data);
    });
  };

  postFactory.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote', null, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      post.upvotes += 1;
    });
  };

  postFactory.downvote = function(post) {
    return $http.put('/posts/' + post._id + '/downvote', null, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      post.upvotes -= 1;
    });
  };

  postFactory.get = function(id) {
    return $http.get('/posts/' + id).then(function(res) {
      return res.data;
    });
  }

  postFactory.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    });
  };

  postFactory.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      comment.upvotes += 1;
    });
  };

  postFactory.downvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote', null, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      comment.upvotes -= 1;
    });
  };

  return postFactory;
}]);

app.factory('auth', ['$http', '$window', function($http, $window) {
  var auth = {};

  auth.saveToken = function(token) {
    $window.localStorage['flapper-news-token'] = token;
  };

  auth.getToken = function() {
    return $window.localStorage['flapper-news-token'];
  }

  auth.isLoggedIn = function() {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function() {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user) {
    return $http.post('/register', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user) {
    return $http.post('/login', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function() {
    $window.localStorage.removeItem('flapper-news-token');
  };

  return auth;
}]);
