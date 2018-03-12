angular.module('app.controllers')

.controller('RouteController', function(
  $scope, $rootScope, $http, $state, $timeout, $window,
  $cordovaKeyboard, $cordovaGeolocation,
  routeData, RouteService, MainService,
  $localStorage,
  $mdDialog,$cordovaCamera, $cordovaFileTransfer
) {

  var storage = $localStorage

  // ============================= VARS =============================
  $scope.routes = routeData;
  $scope.routes.forEach(function(route) {
    if (storage.kijkUser.completedRoutes.indexOf(route._id) != -1) {
      route.completed = true;
    };
  });

  $rootScope.activeView = 'route';

  // ============================ RETURN ============================

  $scope.return = function(state) {
    if ($rootScope.activeView == 'route') {
      $state.go(state);
    }

    if ($rootScope.activeView == 'location') {
      $timeout(function() {
        $scope.submitData = {};
        $scope.currentData = {};
        $rootScope.activeView = 'route';
      });
    }
  };

  // =========================== COMPLETE ===========================

  $scope.complete = function(route) {
    $scope.gettingLocation = true;
    $scope.selectedRoute = route;

    $scope.submitData = {
      route: route._id,
      addedBy: storage.kijkUser._id,
      answers: [],
      accuracy: -1,
      distance: -1
    };
    $state.go('route.complete');

    for (var i = 0; i < $scope.selectedRoute.locations.length; i++) {
      $scope.selectedRoute.locations[i].completed = false;

      for (var j = 0; j < storage.kijkUser.routeMarkers.length; j++) {
        if ($scope.selectedRoute.locations[i]._id == storage.kijkUser.routeMarkers[j].location) {
          $scope.selectedRoute.locations[i].completed = true;
        }
      }
    }
  };

  $scope.completeLocation = function(location) {
    console.log(location);
    if (location.completed) {
      return
    }

    $rootScope.activeView = 'location';
    $scope.selectedLocation = location;
    $scope.submitData.location = location._id;

    $scope.currentQuestion = 0;
    $scope.currentData = {
      task: $scope.selectedLocation.tasks[0]._id,
      answers: new Array($scope.selectedLocation.tasks[0].questions.length),
      photoIncluded: false
    }
    $scope.currentData.answers.fill('')
    $state.go('route.complete');
  };

  function checkEmpty(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == '') {
        return true;
      }

      if (i == array.length - 1) {
        return false;
      }
    }
  }

  $scope.$watch(function() {
    return $cordovaKeyboard.isVisible();
  }, function(open) {
    if (open) {
      setTimeout(function() {
        var element = document.getElementById("location-scroll");
        element.scrollTop = element.scrollHeight;
      }, 100);

    }
  })

  $scope.nextQuestion = function(ev) {
    if (checkEmpty($scope.currentData.answers)) {
      $mdDialog.show(
        $mdDialog.alert({focusOnOpen: false})
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Onvolledig formulier')
          .textContent('Je hebt niet alle vragen beantwoord.')
          .ariaLabel('Incomplete form')
          .ok('Ok')
          .targetEvent(ev)
      );
    } else {
      $scope.tempData = angular.copy($scope.currentData);
      $scope.submitData.answers.push($scope.tempData);
      $scope.currentQuestion++;
      $scope.currentData.task = $scope.selectedLocation.tasks[$scope.currentQuestion]._id,
      $scope.currentData.answers = new Array($scope.selectedLocation.tasks[$scope.currentQuestion].questions.length);
      $scope.currentData.answers.fill('')
      $scope.selectedCheckboxes = [];
    }

    $timeout(function () {
      var container = angular.element(document.getElementById('location-scroll'));
      container.scrollTop(0, 0)
    }, 10);
  }


   $scope.takePhoto = function (index) {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
          $scope.currentData.answers[index] = $scope.imgURI;
          $scope.currentData.photoIncluded = true;
      }, function (err) {
          // An error occured. Show a message to the user
      });
    }
                
  $scope.choosePhoto = function (index) {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
         
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
          $scope.currentData.answers[index] = $scope.imgURI;
          $scope.currentData.photoIncluded = true;
      }, function (err) {
          // An error occured. Show a message to the user
      });
  }


  $scope.submitLocation = function(ev) {
    $scope.submitData.answers.push($scope.currentData);
    console.log($scope.submitData);
    RouteService.createMarkerRoute($scope.submitData);

    for (var i = 0; i < $scope.selectedRoute.locations.length; i++) {
      if ($scope.selectedRoute.locations[i]._id == $scope.submitData.location) {
        $scope.selectedRoute.locations[i].completed = true;
      }
    }


    if ($cordovaKeyboard.isVisible()) {
      $timeout(function () {
        $scope.showCompleted(ev);
      }, 600);
    } else {
      $scope.showCompleted(ev)
    }
  };

  $scope.showCompleted = function (ev) {
    var routeComplete = $scope.selectedRoute.locations.every(function(location) {
      return location.completed == true
    });

    console.log($scope.selectedRoute);
    if (routeComplete) {
      $scope.routes.forEach(function(route) {
        if (route._id == $scope.selectedRoute._id) {
          $timeout(function() {
            route.completed = true;
          });
        }
      });

      $mdDialog.show(
        $mdDialog.alert({focusOnOpen: false})
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Route voltooid')
          .htmlContent('<h3>Route voltooid, je hebt 100 bonus punten verdiend!</h3>')
          .ariaLabel('Route complete')
          .ok('Ok')
          .targetEvent(ev)
      ).then(function() {
        $scope.drawRoute();
        $scope.selectedCheckboxes = [];
        $scope.routes.forEach(function(route) {
          if (storage.kijkUser.completedRoutes.indexOf(route._id) != -1) {
            route.completed = true;
          };
        });
        $state.go('route.select');
      });
    } else {
      $mdDialog.show(
        $mdDialog.alert({focusOnOpen: false})
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Locatie voltooid')
          .htmlContent('<h3>Gefeliciteerd je hebt 50 punten verdiend!</h3><p>Ga door naar de volgende locatie om meer punten te verdienen.</p>')
          .ariaLabel('Location complete')
          .ok('Ok')
          .targetEvent(ev)
      ).then(function() {
        $scope.drawRoute();
        $scope.selectedCheckboxes = [];
        $scope.submitData.answers = [];
        $rootScope.activeView = 'route';

      });
    }
  }

  $scope.selectedCheckboxes = [];
  $scope.toggleCheckbox = function (answer, list, qIndex) {
    var idx = list.indexOf(answer);
    if (idx > -1) {
      list.splice(idx, 1);
      $scope.currentData.answers[qIndex] = list;
    } else {
      list.push(answer);
      $scope.currentData.answers[qIndex] = list;
    }
  };

  $scope.exists = function (answer, list) {
    return list.indexOf(answer) > -1;
  };

  // // $scope.share = function() {
  // //   $cordovaSocialSharing
  // //     .share('Ik help om Slotermeer een gezondere buurt te maken. Help jij ook?!', 'Kijk! Een gezonde wijk', null, 'http://www.kijkeengezondewijk.nl')
  // //     .then(function(result) {
  // //       $state.go('main.home')
  // //     }, function(err) {
  // //       console.log('err');
  // //     });
  // // }

  // ============================= MAP ==============================
  $scope.map = function(map) {
    $scope.locationLayer = L.geoJSON().addTo(map);
    $scope.routeLayer = L.geoJSON().addTo(map);

    map.on('ready', function(e) {
      map.invalidateSize();
      $scope.drawRoute();

      map.fitBounds($scope.routeLayer.getBounds());
    });
  };

  $scope.drawRoute = function() {
    $scope.locationLayer.clearLayers();
    $scope.routeLayer.clearLayers();

    var route = {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": $scope.selectedRoute.lineString
      }
    }

    L.geoJSON(route, {
      color: '#d1007f',
      weight: 3,
      opacity: 0.7,
      smoothFactor: 1
    }).addTo($scope.routeLayer);

    var locations = [];
    for (var i = 0; i < $scope.selectedRoute.locations.length; i++) {
      var location = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [$scope.selectedRoute.locations[i].lng, $scope.selectedRoute.locations[i].lat]
        },
        "properties": {
          "name": $scope.selectedRoute.locations[i].name,
          "route": $scope.selectedRoute.locations[i].route,
          "index": i,
          "completed": $scope.selectedRoute.locations[i].completed
        }
      }

      locations.push(location);
    }

    var myIcon = function(index, completed) {
      if (completed) {
        return L.divIcon({
          className: 'route-location-completed',
          iconSize: new L.Point(20, 20),
          html: index + 1
        });
      } else {
        return L.divIcon({
          className: 'route-location',
          iconSize: new L.Point(20, 20),
          html: index + 1
        });
      }
    };

    L.geoJSON(locations, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: myIcon(feature.properties.index, feature.properties.completed)})
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          click: function() {

            $timeout(function() {
              console.log($scope.selectedRoute);
              console.log(feature.properties.index);
              $scope.completeLocation($scope.selectedRoute.locations[feature.properties.index])
            });
          }
        });
      }
    }).addTo($scope.routeLayer);
  };

  $rootScope.$watch(function() {
    return $state.current.name;
  }, function(value) {
    if (value == 'route.complete') {

      var watchOptions = {
        maximumAge: 15000,
        timeout : 5000,
        enableHighAccuracy: true // may cause errors if true
      };

      if ($rootScope.watch !== null) {
        $cordovaGeolocation.clearWatch($rootScope.watch);
      }

      $rootScope.watch = $cordovaGeolocation.watchPosition(watchOptions);
      $rootScope.watch.then(
        null,
        function(err) {
          console.log(err);
          console.log('error');
        },
        function(position) {
          $scope.gettingLocation = false;
          $scope.locationLayer.clearLayers();

          var location = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [position.coords.longitude, position.coords.latitude]
            },
          }

          L.geoJSON(location, {
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
                radius: 10,
                fillColor: "#ffc107",
                color: "#ffc107",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
              });
            }
          }).addTo($scope.locationLayer);

          if ($scope.selectedLocation) {
            $scope.submitData.accuracy = position.coords.accuracy;
            $scope.submitData.distance = turf.distance({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [position.coords.longitude, position.coords.latitude]
              }
            }, {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [$scope.selectedLocation.lng, $scope.selectedLocation.lat]
              }
            }, 'meters');
          }
      });
    } else {
      $cordovaGeolocation.clearWatch($rootScope.watch);
    }
  })

})
