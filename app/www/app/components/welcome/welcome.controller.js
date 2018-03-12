angular.module('app.controllers')

.controller('WelcomeController', function(
  $scope, $state, $timeout,
  ProfileService,
  $localStorage
) {

  var storage = $localStorage;

  $scope.details = {}

  $scope.skip = function() {
    $scope.details.userFirstTime = false;
    ProfileService.updateUser($scope.details).then(function() {
      $state.go('main.home');
    });
  };

  $scope.update = function(details) {
    $scope.details.userFirstTime = false;
    ProfileService.updateUser(details).then(function(response) {
      $state.go('main.home');
    });
  };

  $scope.ageClasses = [
    '0-17', '18-29', '30-39', '40-49', '50-64', '65+'
  ];

  $scope.workStatus = [
    { name: 'Werkzaam', value: 'employed'},
    { name: 'Werkzoekend', value: 'unemployed'},
    { name: 'Student / Schoolgaand', value: 'student'},
    { name: 'Pensioen', value: 'retired'}
  ]

  // =========================== CAROUSEL ===========================

  $scope.slideNumber = '1';
  $scope.slideClass = 'carousel-slide-left';
  $scope.noPages = 4;

  $scope.nextSlide = function() {
    $scope.slideClass = 'carousel-slide-left';
    $timeout(function() {
      if (parseInt($scope.slideNumber) == $scope.noPages) {
        return
      } else {
        var pageNo = parseInt($scope.slideNumber);
            pageNo++;
        $scope.slideNumber = pageNo.toString();
      }
    }, 20);
  };

  $scope.prevSlide = function() {
    $scope.slideClass = 'carousel-slide-right';
    $timeout(function() {
      if (parseInt($scope.slideNumber) == 1) {
        return
      } else {
        var pageNo = parseInt($scope.slideNumber);
            pageNo--;
        $scope.slideNumber = pageNo.toString();
      }
    }, 20);
  };

  $scope.adjustSlide = function(num) {
    if (parseInt($scope.slideNumber) < num) {
      $scope.slideClass = 'carousel-slide-left';
      $timeout(function() {
        $scope.slideNumber = num.toString();
      }, 20);
    } else if(parseInt($scope.slideNumber) > num) {
      $scope.slideClass = 'carousel-slide-right';
      $timeout(function() {
        $scope.slideNumber = num.toString();
      }, 20);
    }
  };

  $scope.activeSlide = function(num) {
    if (num === parseInt($scope.slideNumber)) {
      return true;
    }
    return false;
  };

});
