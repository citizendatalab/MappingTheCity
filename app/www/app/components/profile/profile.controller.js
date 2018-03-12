angular.module('app.controllers')

.controller('ProfileController', function(
  $rootScope, $scope, $state,
  ProfileService, AuthService,
  $localStorage,
  $mdDialog, $mdToast
) {

  // ============================= VARS =============================
  var storage = $localStorage;
  $scope.profile = storage.kijkUser;

  // ========================= EDIT DETAILS =========================
  $scope.editDetails = function(ev) {
    $mdDialog.show({
      controller: DetailsController,
      templateUrl: 'app/components/profile/templates/details.template.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullscreen
    })
    .then(function(response) {
      AuthService.profile().then(function(response) {
        storage.kijkUser = response;
        $scope.profile = response;
      });
    }, function() {
      console.log('cancelled');
    });
  };

  function DetailsController($scope, $mdDialog) {
    $scope.details = {
      name: storage.kijkUser.userInfo.name,
      ageClass: storage.kijkUser.userInfo.ageClass,
      gender: storage.kijkUser.userInfo.gender,
      workStatus: storage.kijkUser.userInfo.workStatus,
      zipcode: storage.kijkUser.userInfo.zipcode,
      yearsInNeigbourhood: storage.kijkUser.userInfo.yearsInNeigbourhood
    }

    $scope.ageClasses = [
      '0-17', '18-29', '30-39', '40-49', '50-64', '65+'
    ];

    $scope.workStatus = [
      { name: 'Werkzaam', value: 'employed'},
      { name: 'Werkzoekend', value: 'unemployed'},
      { name: 'Student / Schoolgaand', value: 'student'},
      { name: 'Pensioen', value: 'retired'}
    ]

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    // After confirming the location create checkin
    $scope.confirmEditDetails = function(details) {

      ProfileService.updateUser(details).then(function() {
        $mdDialog.hide();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Gegevens gewijzigd')
            .position('bottom')
            .hideDelay(3000)
        );
      });
    };
  };

  // ======================== EDIT PASSWORD =========================
  $scope.editPassword = function(ev) {
    $mdDialog.show({
      controller: PasswordController,
      templateUrl: 'app/components/profile/templates/password.template.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullscreen
    })
    .then(function(response) {
      console.log('edited');
    }, function() {
      console.log('cancelled');
    });
  };

  function PasswordController($scope, $mdDialog) {
    $scope.password = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    // After confirming the location create checkin
    $scope.confirmEditPassword = function(password) {

      var passRegex = /^.{7,}$/;

      if (password.newPassword !== password.confirmPassword) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('De bevestiging van het wachtwoord komt niet overeen met het nieuwe wachtwoord, probeer het opnieuw.')
            .hideDelay(3000)
        );
      }
      else if (password.newPassword.match(passRegex) === null) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Het wachtwoord voldoet niet aan de veiligheidseisen. De minimale lengte is 7 karakters.')
            .hideDelay(3000)
        );
      }
      else {
        var storage = $localStorage;

        console.log(storage.kijkUser);

        password.id = storage.kijkUser._id;
        ProfileService.updatePassword(password).then(function(response) {
          console.log(response);
          // if (response.status == 401) {
          //   correctPass = false;
          // }
          $mdDialog.hide();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Wachtwoord gewijzigd')
              .hideDelay(3000)
          );
        });
      }
    };
  }

  $scope.return = function() {
    $state.go('main.home');
  };

});
