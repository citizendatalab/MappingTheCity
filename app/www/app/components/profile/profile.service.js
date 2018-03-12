angular.module('app.services')

.factory('ProfileService', function($rootScope, $http, $state, AuthService) {
  var factory = {};

  factory.updateUser = function(data) {
    return $http
      .post($rootScope.baseUrl + '/api/v1/updateUser/', data)
      .then(function(response) {
        return response;
      })
  };

  factory.updatePassword = function(data) {
    return $http
      .post($rootScope.baseUrl + '/api/v1/updatePassword/', data)
      .then(function(response) {
        return response;
      })
  };

  return factory;
})
