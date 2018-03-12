  angular.module('app.routes')

  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push(function($q, $injector, $localStorage) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          config.headers['x-access-token'] = $localStorage.kijkToken;
          return config;
        },
        responseError: function(response) {
          console.log(response);

          if(response.status === 500 || response.status === 401 || response.status === 403 || response.status === 400) {
            var stateService = $injector.get('$state');
            stateService.go('auth.login');
          }
          return $q.reject(response);
        }
      };
    });

    $stateProvider

    // ======================= AUTHENTICATION =======================

    .state('auth', {
      abstract: true,
      url: '/auth',
      templateUrl: 'app/components/auth/auth.view.html',
      controller: 'AuthController',
    })

    .state('auth.login', {
      url: '/login',
      templateUrl: 'app/components/auth/views/login.auth.html'
    })

    .state('auth.forgot', {
      url: '/forgot',
      templateUrl: 'app/components/auth/views/forgot.auth.html'
    })

    // ========================== WELCOME ===========================

    .state('welcome', {
      url: '/welcome',
      templateUrl: 'app/components/welcome/welcome.view.html',
      controller: 'WelcomeController'
    })

    // ============================ INFO ============================

    .state('info', {
      url: '/info',
      templateUrl: 'app/components/info/info.view.html',
      controller: 'InfoController'
    })

    // ============================ HELP ============================

    .state('help', {
      url: '/help',
      templateUrl: 'app/components/help/help.view.html',
      controller: 'InfoController'
    })

    // ============================ MAIN ============================

    .state('main', {
      abstract: true,
      url: '/main',
      templateUrl: 'app/components/main/main.view.html',
      controller: 'MainController',
      resolve: {
        profileData: function(AuthService) {
          return AuthService.profile();
        },
        markerData: function(MainService) {
          return MainService.getMarkers();
        },
        routeData: function(RouteService) {
          return RouteService.getRouteList();
        },
        overallRankData: function(MainService) {
          return MainService.getRankings();
        }
      }
    })
    .state('main.home', {
      url: '/home',
      templateUrl: 'app/components/main/views/main.home.html',
    })

    .state('main.map', {
      url: '/map',
      templateUrl: 'app/components/main/views/main.map.html',
    })

    .state('main.stats', {
      url: '/stats',
      templateUrl: 'app/components/main/views/main.stats.html',
    })

    // ========================== PROFILE ===========================

    .state('profile',{
      url: '/profile',
      templateUrl: 'app/components/profile/profile.view.html',
      controller: 'ProfileController'
    })

    // ========================= REPORTING ==========================

    .state('report', {
      abstract: true,
      url: '/report',
      templateUrl: 'app/components/report/report.view.html',
      controller: 'ReportController',
      resolve: {
        taskData: function(ReportService) {
          return ReportService.getTaskList();
        },
        catData: function(ReportService) {
          return ReportService.getCategories();
        }
      }
    })

    .state('report.select', {
      url: '/select',
      templateUrl: 'app/components/report/views/report.select.html'
    })

    .state('report.complete', {
      url: '/complete',
      templateUrl: 'app/components/report/views/report.complete.html'
    })

    // =========================== ROUTE ============================

    .state('route', {
      abstract: true,
      url: '/route',
      templateUrl: 'app/components/route/route.view.html',
      controller: 'RouteController',
      resolve: {
        routeData: function(RouteService) {
          return RouteService.getRouteList();
        }
      }
    })

    .state('route.select', {
      url: '/select',
      templateUrl: 'app/components/route/views/route.select.html'
    })

    .state('route.complete', {
      url: '/complete',
      templateUrl: 'app/components/route/views/route.complete.html'
    });

    $urlRouterProvider.otherwise('/main/home');
    // $urlRouterProvider.otherwise('/welcome');

    $urlRouterProvider.when('/auth', '/auth/login');
    $urlRouterProvider.when('/main', '/main/home');

  });
