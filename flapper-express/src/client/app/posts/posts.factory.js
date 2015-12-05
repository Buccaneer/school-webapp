angular
  .module('flapperNews.posts')
  .factory('posts', ['$http', 'auth', factory]);

function factory($http, auth) {
  var postFactory = {
    posts: []
  };

  postFactory.getAll = getAll;
  postFactory.create = create;
  postFactory.upvote = upvote;
  postFactory.downvote = downvote;
  postFactory.get = get;
  postFactory.addComment = addComment;
  postFactory.upvoteComment = upvoteComment;
  postFactory.downvoteComment = downvoteComment;

  function getAll() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, postFactory.posts);
    });
  }

  function create(post) {
    return $http.post('/posts', post, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      postFactory.posts.push(data);
    });
  }

  function upvote(post) {
    return $http.put('/posts/' + post._id + '/upvote', null, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      post.upvotes += 1;
    });
  }

  function downvote(post) {
    return $http.put('/posts/' + post._id + '/downvote', null, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      post.upvotes -= 1;
    });
  }

  function get(id) {
    return $http.get('/posts/' + id).then(function(res) {
      return res.data;
    });
  }

  function addComment(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    });
  }

  function upvoteComment(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      comment.upvotes += 1;
    });
  }

  function downvoteComment(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote', null, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      comment.upvotes -= 1;
    });
  }

  return postFactory;
}
