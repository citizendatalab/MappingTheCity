angular.module('app.services')

.factory('LocalStorage', function() {
  var factory = {};

  factory.set = function(item, value) {
    return window.localStorage.setItem(item, value);
  };
  factory.get = function(item) {
    return window.localStorage.getItem(item);
  };
  factory.delete = function(item) {
    return window.localStorage.removeItem(item);
  };

  return factory;
})
