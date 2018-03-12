angular.module('app', [
  'app.routes',
  'app.controllers',
  'app.services',
  'app.directives',
  'nemLogging',
  'ui.bootstrap'
]);

angular.module('app.routes', [
  'ui.router'
]);

angular.module('app.controllers', [])

angular.module('app.services', [])

angular.module('app.directives', [])

.run(function($rootScope) {


  $rootScope.baseUrl = "http://127.0.0.1:3000"


});
