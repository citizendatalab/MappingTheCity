angular.module('app.services')

.factory('AuthService', function(
    $rootScope, $http, $state, $mdToast, $localStorage
  ) {
    var factory = {
      profileData: {}
    };

    var storage = $localStorage

    factory.signin = function(data) {
      return $http
        .post($rootScope.baseUrl + '/login', data)
        .then(function(response) {
          storage.kijkToken = response.data.token;
          console.log(response);
          if (response.data.user.userInfo.userFirstTime === true) {
            return $state.go('welcome');
          } else {
            return $state.go('main.home');
          }
        }, function(err) {
          if (err) {
            return err;
          }
        })
    };

    factory.signup = function(data) {
      return $http
        .post($rootScope.baseUrl + '/register', data)
        .then(function(response) {
          storage.kijkToken = response.data.token;
          return $state.go('welcome');
        }, function(err) {
          if (err) {
            return err;
          }
        })
    };

    factory.forgot = function(data) {
      return $http
        .post($rootScope.baseUrl + '/forgot', data)
        .then(function(response) {
          return response
      })
    }

    factory.profile = function() {
      return $http
        .get($rootScope.baseUrl + '/api/v1/getUser/')
        .then(function(response) {
          storage.kijkUser = response.data;
          return angular.copy(response.data, factory.profileData);
      })
    };

    factory.logout = function() {
      delete storage.kijkToken;
      delete storage.kijkImage;
      return $state.go('auth.login');
    };

    return factory;

});
