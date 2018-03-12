angular.module('app', [
  'app.routes',
  'app.controllers',
  'app.services',
  'app.directives',

  'ngMaterial',
  'ngSanitize',
  'ngTouch',
  'ngCordova',
  'ngStorage'
]).run(function(
    $rootScope, $state, $timeout,
    $cordovaDevice, $cordovaStatusbar, $cordovaNetwork, $cordovaGeolocation
  ) {
  //$rootScope.baseUrl = "http://10.0.2.2:3000";
   //$rootScope.baseUrl = "http://127.0.0.1:3000";
  $rootScope.baseUrl = "http://149.210.239.143:3000";

  document.addEventListener("deviceready", function () {
    $cordovaStatusbar.overlaysWebView(false); // Always Show Status Bar
    $cordovaStatusbar.styleHex('#ffc107'); // Status Bar With Red Color, Using Angular-Material Style

    // ===================== BACKBUTTON ROUTING =====================
    document.addEventListener("backbutton", function onBackKeyDown(e) {
      var currentState = $state.current.name;
      if (currentState == 'profile' || currentState == 'info' || currentState == 'help' || currentState == 'route.slect' || currentState == 'report.select') {
        $state.go('main.home');
      }

      if (currentState == 'route.complete') {
        if ($rootScope.activeView == 'route') {
          $state.go('route.select');
        }

        if ($rootScope.activeView == 'location') {
          $timeout(function() {
            $scope.submitData = {};
            $scope.currentData = {};
            $rootScope.activeView = 'route';
          });
        }
      }

      if (currentState == 'report.complete') {
        $state.go('report.select');
      }
      // e.preventDefault();
    });

    // ======================== OFFLINE WATCH =======================
    $rootScope.networkState = $cordovaNetwork.getNetwork();

    // Watch for changes in networkState
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      $rootScope.networkState = networkState;
    });

    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      $rootScope.networkState = networkState;
    });

    $rootScope.$watch(function() {
      return $state.current.name;
    }, function(value) {
      if (value != 'route.complete') {
        $cordovaGeolocation.clearWatch($rootScope.watch);
      }
    })

  }, false);
})

.config(function($mdThemingProvider, $mdGestureProvider) { // Angular-Material Color Theming
  $mdGestureProvider.skipClickHijack();

  $mdThemingProvider.theme('default')
    .primaryPalette('amber')
    .accentPalette('amber');
});

angular.module('app.routes', [
  'ui.router'
]);

angular.module('app.controllers', [
  'duScroll'
]);

angular.module('app.services', []);

angular.module('app.directives', []);
