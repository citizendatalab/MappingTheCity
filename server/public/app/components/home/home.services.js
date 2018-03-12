angular.module('app.services')

.factory('HomeService', function($rootScope, $http, $state) {

  var factory = {
    markers: [],
    geojson: {},
    news: [],
    routes:[],
    locData:[],
    csvdata:''
  };
  
  factory.getGeoJson = function(dataUrl) {

    return $http
       //.get('http://127.0.0.1:3000/' + dataUrl)
     .get('http://www.kijkeengezondewijk.nl/'+ dataUrl)
      .then(function(response) {
        angular.copy(response.data, factory.geojson);
        return factory.geojson;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }
  factory.getLocationData = function(locId) {
    var url = '/location/'+locId;

    return $http
      //.get('http://127.0.0.1:3000' + url)
      .get($rootScope.baseUrl + '/location/'+locId)
      .then(function(response) {
        angular.copy(response.data, factory.locData);
        return factory.locData;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }

  
  factory.getMarkers = function() {
    return $http
      .get($rootScope.baseUrl + '/markers')
      .then(function(response) {
				angular.copy(response.data, factory.markers);
        return factory.markers;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }

  factory.getRoutes = function() {
    return $http
      .get($rootScope.baseUrl + '/routes')
      .then(function(response) {
        angular.copy(response.data, factory.routes);
        return factory.routes;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }

  factory.getNews = function() {
    return $http
      .get($rootScope.baseUrl + '/allnews')
      .then(function(response) {
        angular.copy(response.data, factory.news);
        return factory.news;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }

  factory.getCsv = function(filters) {
    var queryFilter = filters;


    var categoryString = '';
    for(i=0; i < queryFilter['category'].length; i++){
      if(i == queryFilter['category'].length-1){
        categoryString += queryFilter['category'][i];
      } else {
        categoryString += queryFilter['category'][i]+',';
      }
      
    }
    queryFilter['categoryString'] = categoryString
    console.log(queryFilter);
    return $http
      .get($rootScope.baseUrl + '/markersCsv', {params:queryFilter})
      .then(function(response) {

        //angular.copy(response.data, csvdata);
        return response.data;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }
  return factory;
});
