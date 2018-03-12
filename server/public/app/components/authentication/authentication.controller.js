angular.module('app.controllers')

.controller('AuthenticationController', function($scope, AuthenticationService) {

  $scope.signin = function(data) {
    var formData = {
      email: data.username.toLowerCase(),
      password: data.password
    };
    AuthenticationService.signin(formData);
  }
});
