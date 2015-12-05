angular.module("flapperNews.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("app/authentication/auth.login.html","<div ng-show=\"error\" class=\"alert alert-danger row\">\r\n  <span>{{ error.message }}</span>\r\n</div>\r\n\r\n<form ng-submit=\"logIn()\" style=\"margin-top:30px;\">\r\n  <h1 class=\"page-header\">Log In</h1>\r\n\r\n  <div class=\"form-group\">\r\n    <input type=\"text\" class=\"form-control\" placeholder=\"Username\" ng-model=\"user.username\"></input>\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"user.password\"></input>\r\n  </div>\r\n  <button type=\"submit\" class=\"btn btn-primary\">Log In</button>\r\n</form>\r\n");
$templateCache.put("app/authentication/auth.register.html","<div ng-show=\"error\" class=\"alert alert-danger row\">\r\n  <span>{{ error.message }}</span>\r\n</div>\r\n\r\n<form ng-submit=\"register()\" style=\"margin-top:30px;\">\r\n  <h1 class=\"page-header\">Register</h1>\r\n\r\n  <div class=\"form-group\">\r\n    <input type=\"text\" class=\"form-control\" placeholder=\"Username\" ng-model=\"user.username\"></input>\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"user.password\"></input>\r\n  </div>\r\n  <button type=\"submit\" class=\"btn btn-primary\">Register</button>\r\n</form>\r\n");
$templateCache.put("app/home/home.template.html","<div class=\"page-header\">\r\n  <h1>Posts</h1>\r\n</div>\r\n<div ng-repeat=\"post in posts | orderBy: \'-upvotes\'\">\r\n  <p>\r\n    {{$index+1}}.\r\n    <span class=\"glyphicon glyphicon-thumbs-up\" ng-click=\"incrementUpvotes(post)\"></span>\r\n    <span class=\"glyphicon glyphicon-thumbs-down\" ng-click=\"decrementUpvotes(post)\"></span>\r\n    <a href={{post.link}} ng-show=\'post.link\'>{{post.title}}</a>\r\n    <span ng-hide=\'post.link\'>{{post.title}}</span>\r\n    <span ng-show=\"post.author\">\r\n      posted by <a>{{post.author}}</a>\r\n    </span>\r\n    | votes: {{post.upvotes}}\r\n    <span> <a href=\"#/posts/{{post._id}}\">Comments</a></span>\r\n  </p>\r\n</div>\r\n<form ng-submit=\"addPost()\" ng-show=\"isLoggedIn()\">\r\n  <div class=\"form-group\">\r\n    <input class=\"form-control\" placeholder=\"Title\" type=\"text\" ng-model=\"title\" />\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <input class=\"form-control\" placeholder=\"Link\" type=\"text\" ng-model=\"link\" />\r\n  </div>\r\n  <button type=\"submit\">Post</button>\r\n</form>\r\n<div ng-hide=\"isLoggedIn()\">\r\n  <h3>You need to <a href=\"/#/login\">Log In</a> or <a href=\"/#/register\">Register</a> before you can add a post.</h3>\r\n</div>\r\n");
$templateCache.put("app/posts/posts.template.html","<div class=\"page-header\">\r\n  <h3>\r\n    <a href={{post.link}} ng-show=\'post.link\'>{{post.title}}</a>\r\n    <span ng-hide=\'post.link\'>{{post.title}}</span>\r\n  </h3>\r\n</div>\r\n<div ng-repeat=\"comment in post.comments | orderBy:\'-upvotes\'\">\r\n  <span class=\"glyphicon glyphicon-thumbs-up\" ng-click=\"incrementCommentUpvotes(comment)\"></span>\r\n  <span class=\"glyphicon glyphicon-thumbs-down\" ng-click=\"decrementCommentUpvotes(comment)\"></span>\r\n  {{comment.body}} - by {{comment.author}} | votes: {{comment.upvotes}}\r\n</div>\r\n\r\n<form ng-submit=\"addComment()\" ng-show=\"isLoggedIn()\" style=\"margin-top:30px\">\r\n  <h3>Add a new comment</h3>\r\n  <div class=\"form-group\">\r\n    <input type=\"text\" class=\"form-control\" ng-model=\"body\" placeholder=\"Comment\" </div>\r\n    <br/>\r\n    <button class=\"btn btn-primary\" type=\"submit\">Add</button>\r\n</form>\r\n<div ng-hide=\"isLoggedIn()\">\r\n  <h3>You need to <a href=\"/#/login\">Log In</a> or <a href=\"/#/register\">Register</a> before you can comment.</h3>\r\n</div>\r\n");
$templateCache.put("app/slider/slider.template.html","<div class=\"slider\">\r\n  <div class=\"slide\" ng-repeat=\"image in images\" ng-show=\"image.visible\">\r\n    <img ng-src=\"img/{{image.src}}\" />\r\n  </div>\r\n  <div class=\"arrows\">\r\n    <a href=\"#\" ng-click=\"prev()\">\r\n      <img src=\"img/left-arrow.png\" />\r\n    </a>\r\n    <a href=\"#\" ng-click=\"next()\">\r\n      <img src=\"img/right-arrow.png\" />\r\n    </a>\r\n  </div>\r\n</div>\r\n");}]);