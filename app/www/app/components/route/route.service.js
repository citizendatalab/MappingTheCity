angular.module('app.services')

.factory('RouteService', function($rootScope, $http, AuthService, MainService) {
  var factory = {
    taskData: {}
  };

  factory.getRouteList = function(data) {
    return $http
      .get($rootScope.baseUrl + '/api/v1/routeList')
      .then(function(response) {
        return response.data
      })
  }

  factory.createMarkerRoute = function(data) {
    console.log(data)
    return $http
      .post($rootScope.baseUrl + '/api/v1/addMarkerRoute', data)
      .then(function(response) {
        AuthService.profile();
        MainService.getRankings();
        MainService.getMarkers();
        
        return;
      })
  };

  return factory;
});
