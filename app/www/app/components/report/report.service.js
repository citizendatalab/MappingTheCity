angular.module('app.services')

.factory('ReportService', function($rootScope, $http) {
  var factory = {
    taskData: {},
    catData:[]
  };

  factory.getTask = function(task) {
    return $http
      .get($rootScope.baseUrl + '/api/v1/tasks/' + task)
      .then(function(response) {
        return angular.copy(response.data[0], factory.taskData);
      })
  };

  factory.getTaskList = function(data) {
    return $http
      .get($rootScope.baseUrl + '/api/v1/taskList')
      .then(function(response) {
        return response.data
      })
  };

  factory.getCategories = function() {
    console.log('test');
    return $http
      .get($rootScope.baseUrl + '/api/v1/getCategories/')
      .then(function(response) {
        return angular.copy(response.data, factory.catData);
      })
  }

  return factory;


});
