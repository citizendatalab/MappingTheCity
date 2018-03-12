angular.module('app.directives')

.directive('mapbox', [
  function () {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        callback: "="
      },
      template: '<div></div>',
      link: function (scope, element, attributes) {
        L.mapbox.accessToken = 'pk.eyJ1Ijoid291dGVybWUiLCJhIjoiMEhDeEx4OCJ9.3gsMweYcZWvuNHRaed2X8Q';

        var map = L.mapbox.map(element[0], 'mapbox.streets', {
          attributionControl: true,
          minZoom: 9,
  
        });

        scope.callback(map);
      }
    };
  }
]);
