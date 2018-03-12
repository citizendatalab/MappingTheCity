  angular.module('app.routes')

  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/components/home/home.view.html',
      controller: 'HomeController',
      resolve: {
       routesData: function(HomeService) {
          return HomeService.getRoutes();
        },
       markersData: function(HomeService) {
          return HomeService.getMarkers();
        }
      }
    })
    .state('authentication', {
      url: '/authentication',
      templateUrl: 'app/components/authentication/authentication.view.html',
      controller: 'AuthenticationController'
    })
    .state('admin', {
      url: '/admin',
      abstract: true,
      templateUrl: 'app/components/admin/admin.view.html',
      controller: 'AdminController',
      resolve: {
        userData: function(AdminService) {
          return AdminService.getUsers();
        },
        taskData: function(AdminService) {
          return AdminService.getTasks();
        },
        routeData: function(AdminService) {
          return AdminService.getRoutes();
        },
        catData: function(AdminService) {
          return AdminService.getCategories();
        },
      }
    })
    .state('admin.users', {
      url: '/users',
      templateUrl: 'app/components/admin/views/admin.users.html',
    })
    .state('admin.tasks', {
      url: '/tasks',
      templateUrl: 'app/components/admin/views/admin.tasks.html',
    })
    .state('admin.routes', {
      url: '/routes',
      templateUrl: 'app/components/admin/views/admin.routes.html',
    })
    .state('admin.data', {
      url: '/data',
      templateUrl: 'app/components/admin/views/admin.data.html',
    })
    $urlRouterProvider.when('/admin', '/admin/users');
    $urlRouterProvider.otherwise('/');

  })
