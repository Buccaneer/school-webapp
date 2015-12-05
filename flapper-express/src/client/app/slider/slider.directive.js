angular
  .module('flapperNews.slider')
  .directive('slider', slider);

function slider() {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      images: '='
    },
    link: link,
    templateUrl: 'app/slider/slider.template.html'
  };

  function link(scope, elem, attrs) {
    scope.currentIndex = 0;
    scope.next = next;
    scope.prev = prev;
    scope.$watch('currentIndex', render);

    function next() {
      if (scope.currentIndex < scope.images.length - 1) {
        scope.currentIndex++;
      } else {
        scope.currentIndex = 0;
      }
    }

    function prev() {
      if (scope.currentIndex > 0) {
        scope.currentIndex--;
      } else {
        scope.currentIndex = scope.images.length - 1;
      }
    }

    function render() {
      scope.images.forEach(function(image) {
        image.visible = false;
      });
      scope.images[scope.currentIndex].visible = true;
    }
  }
}
