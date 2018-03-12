angular.module('app.services')

.factory('AdminService', function($rootScope, $http, $state, LocalStorage) {

  var factory = {
    users: [],
    tasks: [],
    categories: []
  };


  factory.getUsers = function() {
      var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .get($rootScope.baseUrl + '/api/v1/admin/users', config)
      .then(function(response) {
				angular.copy(response.data, factory.users);
        return factory.users;
      }, function(err) {

        //console.log(err);
        console.log('Not authorized');
        //Change to a token checker, if accepted go to admin. Now all calls system want to do are shown
        return $state.go('authentication');
      })
  }

  factory.getCategories = function() {
    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .get($rootScope.baseUrl + '/api/v1/admin/categories', config)
      .then(function(response) {
        console.log(response);
        angular.copy(response.data, factory.categories);
        return factory.categories;
      }, function(err) {
        console.log('Not authorized');
      })
  }
  factory.createCategory = function(data) {
    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .post($rootScope.baseUrl + '/api/v1/admin/category/', data, config)
      .then(function(response) {
        return response.data;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }
  factory.updateCategory = function(data) {
    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .post($rootScope.baseUrl + '/api/v1/admin/updateCategory/', data, config)
      .then(function(response) {
        return response.data;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }


  factory.getTasks = function() {
    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .get($rootScope.baseUrl + '/api/v1/admin/tasks', config)
      .then(function(response) {
				angular.copy(response.data, factory.tasks);
        return factory.tasks;
      }, function(err) {
        console.log('Not authorized');
      })
  }

  factory.saveTask = function(task) {
    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
      var id = task['_id']
    return $http
      .get($rootScope.baseUrl + '/api/v1/tasks/'+id, config)
      .then(function(response) {
        angular.copy(response.data, factory.tasks);
        return factory.tasks;
      }, function(err) {
        console.log('Not authorized');
      })
  }

  factory.createTask = function(data) {
    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .post($rootScope.baseUrl + '/api/v1/admin/task/', data, config)
      .then(function(response) {
        return response.data;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }
   factory.updateTask = function(data) {
    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .post($rootScope.baseUrl + '/api/v1/admin/updateTask/', data, config)
      .then(function(response) {
        return response.data;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
  }
  factory.getRoutes = function() {

    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .get($rootScope.baseUrl + '/api/v1/admin/routeList', config)
      .then(function(response) {

        return response.data;
      }, function(err) {
        console.log('Not authorized');
      })
  }
  factory.createRoute = function(data) {
    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .post($rootScope.baseUrl + '/api/v1/admin/routes/', data, config)
      .then(function(response) {
        return response.data;
      }, function(err) {
        console.log(err);
        alert(err.data.message)
      })
    }

  factory.updateRoute = function(data) {

    var config = {headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .post($rootScope.baseUrl + '/api/v1/admin/updateRoute/', data, config)
      .then(function(response) {
        return response.data;
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
    var config = {params:queryFilter, headers: {
        'x-access-token': LocalStorage.get('token')
          }
      }
    return $http
      .get($rootScope.baseUrl + '/api/v1/admin/markers',config=config)
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
