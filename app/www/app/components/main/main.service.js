angular.module('app.services')

.factory('MainService', function($rootScope, $http, AuthService) {
  var factory = {
    markerData: [],
    rankingData: [],
  };

  //  =========================== MARKERS ===========================

  factory.add = function(data) {
    return $http
      .post($rootScope.baseUrl + '/api/v1/addMarker', data)
      .then(function(response) {
        AuthService.profile();
        factory.getRankings();
        factory.getMarkers();
        return;
      })
  };

  factory.getMarkers = function() {
    return $http
      .get($rootScope.baseUrl + '/markers')
      .then(function(response) {
        return angular.copy(response.data, factory.markerData);
      })
  };

  //  ========================== LOCATION ===========================

  factory.getLocation = function(id) {
    return $http
      .get($rootScope.baseUrl + '/api/v1/location/'+ id )
      .then(function(response) {
        return response.data
      })
  };


  //  =========================== RANKING ===========================

  factory.getRankings = function() {
    return $http
      .get($rootScope.baseUrl + '/api/v1/getRankings/')
      .then(function(response) {
        return angular.copy(response.data, factory.rankingData);
      })
  };


  return factory;
})
