var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});

module.exports = function(app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  /* Preloading objects */
  app.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
      if (err) {
        return next(err);
      }
      if (!post) {
        return next(new Error('Can\t find post'));
      }

      req.post = post;
      return next();
    });
  });

  app.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, comment) {
      if (err) {
        return next(err);
      }
      if (!comment) {
        return next(new Error('Can\t find comment'));
      }

      req.comment = comment;
      return next();
    });
  });

  /* Posts */
  app.get('/posts', function(req, res, next) {
    Post.find(function(err, posts) {
      if (err) {
        next(err);
      }
      res.json(posts);
    });
  });

  app.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
      if (err) {
        return next(err);
      }
      res.json(post);
    });
  });

  app.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;

    post.save(function(err, post) {
      if (err) {
        next(err);
      }
      res.json(post);
    });
  });

  app.put('/posts/:post/upvote', auth, function(req, res, next) {
    req.post.upvote(function(err, post) {
      if (err) {
        return next(err);
      }

      res.json(post);
    });
  });

  app.put('/posts/:post/downvote', auth, function(req, res, next) {
    req.post.downvote(function(err, post) {
      if (err) {
        return next(err);
      }

      res.json(post);
    });
  });

  /* Comments */
  app.post('/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function(err, comment) {
      if (err) {
        return next(err);
      }

      req.post.comments.push(comment);
      req.post.save(function(err, post) {
        if (err) {
          return next(err);
        }

        res.json(comment);
      });
    });
  });

  app.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    req.comment.upvote(function(err, comment) {
      if (err) {
        return next(err);
      }

      res.json(comment);
    });
  });

  app.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
    req.comment.downvote(function(err, comment) {
      if (err) {
        return next(err);
      }

      res.json(comment);
    });
  });

  /* User and login*/
  app.post('/register', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: 'Please fill out all fields'
      });
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      return res.json({
        token: user.generateJWT()
      });
    });
  });

  app.post('/login', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: 'Please fill out all fields'
      });
    }

    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (user) {
        return res.json({
          token: user.generateJWT()
        });
      } else {
        return res.status(401).json(info);
      }
    })(req, res, next);
  });
};
