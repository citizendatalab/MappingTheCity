angular.module('app.controllers')

.controller('MainController', function(
  $rootScope, $scope, $state, $location,
  markerData, profileData, routeData, overallRankData,
  AuthService,
  $mdComponentRegistry, $mdSidenav, $mdDialog
) {

  // ============================= VARS =============================

  $scope.markers = markerData;
  $scope.routes = routeData;
  $rootScope.profile = profileData;


  // =========================== SIDEMENU ===========================
  $scope.isOpen = function() { return false };

  $mdComponentRegistry
  .when("left")
  .then(function(sideNav) {
    $scope.isOpen = angular.bind( sideNav, sideNav.isOpen );
    $scope.toggle = angular.bind( sideNav, sideNav.toggle );
  });

  $scope.toggle = function() {
    $mdSidenav("left").toggle()
  };

  $scope.transition = function(state) {
    $state.go(state);
  }

  $scope.logout = function(ev) {
    var confirm = $mdDialog.confirm({focusOnOpen: false})
      .title('Uitloggen')
      .textContent('Weet u zeker dat u uit wil loggen?')
      .ariaLabel('Logout')
      .targetEvent(ev)
      .ok('Uitloggen')
      .cancel('Annuleren');

    $mdDialog.show(confirm).then(function() {
      $rootScope.imgURI = '';
      AuthService.logout();
    }, function() {
      console.log('cancelled');
    });
  };

  // ========================== MAIN MENU ===========================
  var currentState = $state.current.name.split('.')[1];
  if (currentState == 'home') {
    $scope.currentNavItem = 'Home';
  } else if (currentState == 'map') {
    $scope.currentNavItem = 'Kaart';
  } else {
    $scope.currentNavItem = 'Ranglijst';
  }

  // ============================= HOME =============================
  $scope.activeList = 'current';
  $scope.toggleGroup = function(item) {
    item.show = !item.show;
  };

  $scope.isGroupShown = function(item) {
    return item.show;
  };

  $scope.activateList = function(data) {
    $scope.activeList = data;
  };

  $scope.isActiveList = function(data) {
    if (data == $scope.activeList) {
      return true;
    }
    return false;
  };


  // ============================= MAP ==============================

  $scope.$watch(function() {
    return $state.current.name !== 'main.map'
  }, function(value) {
    if (value == true) {
      // lc.stop();
    }
  });

  var lc = (L.control.locate({
    position: 'bottomright',
    icon: 'locate-icon',
    iconLoading: 'locate-icon',
    iconElementTag: 'div',
    drawCircle: false,
    markerStyle: {
      color: "#ffffff",
      opacity: 1,
      fillColor: "#FFC107",
      fillOpacity: 1,
    },
    locateOptions: {
      maxZoom: 16,
      watch: false
    },
    showPopup: false,
  }));

  //Map
  $scope.mapcallback = function (map, markers) {
    map.setView([52.368, 4.812], 13);
    map.addControl(lc);

    $scope.markersLayer = L.layerGroup();
    $scope.markersLayer.addTo(map);

    $scope.routesLayer = L.geoJSON();
    $scope.routesLayer.addTo(map)

    map.on('ready', function(e) {
      map.invalidateSize();
      $scope.showMarkers();
      $scope.showroutes();
    });
  };

  $rootScope.showMarkers = function() {
    $scope.markersLayer.clearLayers();
    var clusterGroup = new L.MarkerClusterGroup({
      maxClusterRadius: 30,
      zoomToBoundsOnClick: false
    }).addTo($scope.markersLayer);

    var markers = [];
    for (i = 0; i <$scope.markers.length; i++) {
      var marker = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [$scope.markers[i].lng, $scope.markers[i].lat]
        },
        "properties": {
          "address": $scope.markers[i].address,
          "date": $scope.markers[i].date,
          "task": $scope.markers[i].task[0].title,
          "questions": $scope.markers[i].task[0].questions,
          "answers": $scope.markers[i].answers
        }
      }

      markers.push(marker)
    }

    var markerIcon = L.divIcon({
      className: 'report',
      iconSize: new L.Point(20, 20),
    });

    L.geoJSON(markers, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: markerIcon})
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          click: function(ev) {
            $mdDialog.show({
              controller: MarkerController,
              templateUrl: 'app/components/main/templates/marker.template.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false,
              fullscreen: $scope.customFullscreen,
              locals: {
                feature: feature
              }
            });
          }
        });
      }
    }).addTo(clusterGroup);

    function MarkerController($scope, $mdDialog, feature) {
      $scope.marker = feature;

      $scope.type = function(answer) {
        return typeof answer
      }

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }
  };

  $rootScope.showroutes = function() {
    $scope.routesLayer.clearLayers();

    var locations = [];
    for (i = 0; i <$scope.routes.length; i++) {
      var route = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": $scope.routes[i].lineString
        }
      }

      L.geoJSON(route, {
        color: '#d1007f',
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1
      }).addTo($scope.routesLayer);

      for (var j = 0; j < $scope.routes[i].locations.length; j++) {
        var location = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [$scope.routes[i].locations[j].lng, $scope.routes[i].locations[j].lat]
          },
          "properties": {
            "id": $scope.routes[i].locations[j]._id,
            "name": $scope.routes[i].locations[j].name,
            "tasks": $scope.routes[i].locations[j].tasks
          }
        }

        locations.push(location);
      }
    }

    var locationIcon = L.divIcon({
      className: 'route-location',
      iconSize: new L.Point(20, 20),
    });

    L.geoJSON(locations, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: locationIcon})
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          click: function(ev) {
            $mdDialog.show({
              controller: LocationController,
              templateUrl: 'app/components/main/templates/location.template.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false,
              fullscreen: $scope.customFullscreen,
              locals: {
                feature: feature
              }
            });
          }
        });
      }
    }).addTo($scope.routesLayer);

    function LocationController($scope, $mdDialog, feature, MainService) {
      $scope.location = feature;
      $scope.loading = true;

      $scope.tasks = []
      console.log(feature);

      for (var i = 0; i < feature.properties.tasks.length; i++) {
        var taskData = {
          id: feature.properties.tasks[i]._id,
          title: feature.properties.tasks[i].title,
          questions: []
        }

        for (var j = 0; j < feature.properties.tasks[i].questions.length; j++) {
          var questionData = {
            text: feature.properties.tasks[i].questions[j].text,
            answers: []
          }

          for (var k = 0; k < feature.properties.tasks[i].questions[j].answers.length; k++) {
            var answerData = {
              answer: feature.properties.tasks[i].questions[j].answers[k].value,
              count: 0
            }
            questionData.answers.push(answerData);
          }
          taskData.questions.push(questionData);
        }
        $scope.tasks.push(taskData);
      }


      MainService.getLocation(feature.properties.id).then(function(response) {
        $scope.loading = false;
        $scope.locationData = response;
        console.log($scope.tasks);
        console.log(response)

        for (var i = 0; i < response.length; i++) {
          for (var j = 0; j < response[i].answers.length; j++) {
            var taskIndex = $scope.tasks.map(function(d) {
              return d['id'];
            }).indexOf(response[i].answers[j].task);

            for (var k = 0; k < response[i].answers[j].answers.length; k++) {
              var type = typeof response[i].answers[j].answers[k];

              if (type == 'string') {
                var answerIndex = $scope.tasks[taskIndex].questions[k].answers.map(function(d) {
                  return d['answer'];
                }).indexOf(response[i].answers[j].answers[k]);

                if (answerIndex != -1) {
                  $scope.tasks[taskIndex].questions[k].answers[answerIndex].count++;
                  $scope.tasks[taskIndex].questions[k].answers.sort(function(a, b) {
                    if (a.count < b.count)
                        return -1;
                      if (a.count > b.count)
                        return 1;
                      return 0;
                  });
                }
              }

              if (type == 'object') {
                for (var l = 0; l < response[i].answers[j].answers[k].length; l++) {
                  var answerIndex = $scope.tasks[taskIndex].questions[k].answers.map(function(d) {
                    return d['answer'];
                  }).indexOf(response[i].answers[j].answers[k][l]);

                  if (answerIndex != -1) {
                    $scope.tasks[taskIndex].questions[k].answers[answerIndex].count++;
                    $scope.tasks[taskIndex].questions[k].answers.sort(function(a, b) {
                      if (a.count > b.count)
                          return -1;
                        if (a.count < b.count)
                          return 1;
                        return 0;
                    });
                  }

                }
              }
            }
          }
        }
      });

      $scope.type = function(answer) {
        return typeof answer
      }

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }
  };

  // ============================ STATS =============================
  $scope.overallRank = overallRankData;

  $scope.selectedStat = 'daily';

  $scope.ownRank= function(user) {
    if (user._id == $scope.profile._id) {
      return  {'color': 'rgba(255, 193, 7, 1)', 'font-weight': 'bold'};
    }
  }
})
