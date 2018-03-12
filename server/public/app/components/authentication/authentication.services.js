angular.module('app.services')

.factory('AuthenticationService', function($rootScope, $http, $state, LocalStorage) {

  var factory = { };

  factory.signin = function(data) {
    return $http
      .post($rootScope.baseUrl + '/login', data)
      .then(function(response) {
        
        if(response.data.user.role == 'admin'){
            LocalStorage.set('token', response.data.token);
            return $state.go('admin.users');
 
        }
        else{
          alert('Not authorized!')
          LocalStorage.set('token', response.data.token);
          return $state.go('authentication');
        }
        
      }, function(err) {
        console.log(err);
        alert(err.data.message)
        
      })
  };

  return factory;
});
