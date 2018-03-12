angular.module('app.controllers')

.controller('AuthController', function($scope, $rootScope, $state, $mdToast, AuthService) {
  $scope.user = {};
  $scope.data = {
    email: '',
    password: ''
  }

  var passRegex = /^.{7,}$/;

  $scope.signup = function(data) {
    if (data.password.match(passRegex) === null) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Het wachtwoord voldoet niet aan de veiligheidseisen. De minimale lengte is 7 karakters.')
          .hideDelay(3000)
      );
    }
    else {
      var formData = {
        email: data.email.toLowerCase(),
        password: data.password
      };
      AuthService.signup(formData).then(function(response) {
        if (response.data.message === 'Invalid credentials') {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Je hebt onjuiste inloggegevens ingevuld, probeer het opnieuw.')
              .hideDelay(3000)
          );
        }
      });
    }
  };

  $scope.signin = function(data) {
    var formData = {
      email: data.email.toLowerCase(),
      password: data.password
    };
    AuthService.signin(formData).then(function(response) {
      if (response.data) {
        if (response.data.message === 'Invalid credentials') {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Je hebt onjuiste inloggegevens ingevuld, probeer het opnieuw.')
              .hideDelay(3000)
          );
        }
      }
    });
  };

  $scope.transitionToForgot = function() {
    $scope.data = {
      email: '',
      password: ''
    }
    $state.go('auth.forgot')
  }

  $scope.forgot = function(data) {
    var formData = {
      email: data.email.toLowerCase(),
    };

    AuthService.forgot(formData);

    $state.go('auth.login');
    $mdToast.show(
      $mdToast.simple()
        .textContent('Er is een email verstuurd naar ' + formData.email +' met je nieuwe tijdelijke wachwoord. Dit kan enkele minuten duren. Vergeet het wachtwoord niet te wijzigen nadat je inlogd bent!')
        .hideDelay(7500)
    );

    $scope.data = {
      email: '',
      password: ''
    };

  }

  $scope.return = function() {
    $state.go('auth.login')
  };

});
