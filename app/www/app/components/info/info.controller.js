angular.module('app.controllers')

.controller('InfoController', function(
  $scope, $state
) {

  $scope.return = function() {
    $state.go('main.home');
  };

});
