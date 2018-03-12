angular.module('app.controllers')

.controller('ReportController', function(
  $scope, $rootScope, $http, $state, $timeout,
  $cordovaGeolocation, $cordovaKeyboard,
  taskData,catData, ReportService, MainService,
  $localStorage,
  $mdDialog, $cordovaCamera, $cordovaFileTransfer
) {

  var storage = $localStorage


  // ============================= VARS =============================
  $scope.tasks = taskData;
  $scope.catData = catData;
  console.log($scope.catData);

  // ============================ RETURN ============================

  $scope.return = function(state) {
    $state.go(state);
  };

  // =========================== COMPLETE ===========================

  $scope.complete = function(task) {
    $scope.selectedTask = task;
    $scope.selectedCheckboxes = [];
    console.log(task);
    $scope.submitData = {
      task: task._id,
      type: 'regular',
      addedBy: storage.kijkUser._id,
      answers: new Array($scope.selectedTask.questions.length),
      photoIncluded: false
    };

    // Wait 1000 ms for map to load
    $scope.mapOverlay = true;
    // $timeout(function() {
    //   var customMarker = new L.Icon({
    //     iconSize: [40, 40],
    //     iconAnchor: [20, 40],
    //     popupAnchor:  [0, -30],
    //     iconUrl: 'assets/img/icons/location_pin.svg',
    //   });
    //   var posOptions = {timeout: 10000, enableHighAccuracy: false, maximumAge: 60000};
    //   $cordovaGeolocation
    //   .getCurrentPosition(posOptions)
    //   .then(function (position) {
    //     $scope.leaflet.setView([position.coords.latitude, position.coords.longitude], 13);
    //
    //     $scope.mapOverlay = false;
    //     var offset = $scope.leaflet.getSize().y *0.25;
    //     $scope.leaflet.panBy([0, -offset], {animate: false});
    //
    //     $scope.markersLayer.clearLayers();
    //
    //     marker = new L.marker([position.coords.latitude, position.coords.longitude], { icon: customMarker, draggable: true });
    //     $scope.markersLayer.addLayer(marker);
    //
    //     $http
    //     .get('https://api.mapbox.com/v4/geocode/mapbox.places/' + position.coords.longitude + ',' + position.coords.latitude + '.json?types=address&access_token=pk.eyJ1IjoiZ3VpZG9hamFuc2VuIiwiYSI6IjE4MjJhOTFjMWY1ZjI0ZDkzZmE5NTAyN2VkMjQ4ZTRiIn0.NZA8lmmlvcQNOS-hLiGYJg')
    //     .then(function(response) {
    //       var popupContent = '<p>' + response.data.features[0].text + '</p>';
    //
    //       marker.bindPopup(popupContent, { closeButton: false });
    //       marker.openPopup();
    //
    //       marker.on('dragend', function(changedLocation) {
    //           $http
    //             .get("https://api.mapbox.com/v4/geocode/mapbox.places/" + changedLocation.target._latlng.lng + "," + changedLocation.target._latlng.lat + ".json?types=address&access_token=pk.eyJ1IjoiZ3VpZG9hamFuc2VuIiwiYSI6IjE4MjJhOTFjMWY1ZjI0ZDkzZmE5NTAyN2VkMjQ4ZTRiIn0.NZA8lmmlvcQNOS-hLiGYJg")
    //             .then(function(response) {
    //               var popupContent = '<p>' + response.data.features[0].text + '</p>';
    //
    //               marker.bindPopup(popupContent, { closeButton: false, maxWidth: 200 });
    //               marker.openPopup();
    //
    //               $scope.submitData.lat = marker._latlng.lat;
    //               $scope.submitData.lng = marker._latlng.lng;
    //               $scope.submitData.address = response.data.features[0].text
    //           })
    //         });
    //
    //         $scope.submitData.lat = marker._latlng.lat;
    //         $scope.submitData.lng = marker._latlng.lng;
    //         $scope.submitData.address = response.data.features[0].text
    //         return
    //     });
    //
    //   }, function(err) {
    //     $scope.locationError = true;
    //   });
    // }, 1000);

    $scope.submitData.answers.fill('')
    $state.go('report.complete')
  };

  for(let theme of $scope.catData){
    theme['tasks'] = [];
  }
  
  function nestTasks() {
    for (let i = 0; i < taskData.length; i++) {
        for(let theme of $scope.catData){
          if(taskData[i]['category']['label'] == theme['label']){ 
              theme['tasks'].push(taskData[i])
          }
        } 
    }
  }
  nestTasks();

  $scope.selectedCheckboxes = [];
  $scope.toggleCheckbox = function (answer, list, qIndex) {
    var idx = list.indexOf(answer);
    if (idx > -1) {
      list.splice(idx, 1);
      $scope.submitData.answers[qIndex] = list;
    }
    else {
      list.push(answer);
      $scope.submitData.answers[qIndex] = list;
    }

  };

  $scope.exists = function (answer, list) {
    return list.indexOf(answer) > -1;
  };

  $scope.submitTask = function(ev) {
    if (!$scope.submitData.lat || !$scope.submitData.lng) {
      $mdDialog.show(
        $mdDialog.alert({focusOnOpen: false})
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Locatie onbekend')
          .textContent('Je locatie kon niet bepaald worden. Controleer je GPS of selecteer een punt op de kaart.')
          .ariaLabel('Location unknown')
          .ok('Ok')
          .targetEvent(ev)
      );
    } else if (checkEmpty($scope.submitData.answers)) {
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
      MainService.add($scope.submitData);

      if ($cordovaKeyboard.isVisible()) {
        $timeout(function () {
          $scope.showCompleted(ev);
        }, 600);
      } else {
        $scope.showCompleted(ev)
      }
    }
  };

  $scope.showCompleted = function (ev) {
    $mdDialog.show(
      $mdDialog.alert({focusOnOpen: false})
        .parent(angular.element(document.body))
        .clickOutsideToClose(true)
        .title('Taak voltooid')
        .htmlContent('<h3>Gefeliciteerd je hebt '+$scope.selectedTask['points'].toString()+' punten verdiend!</h3><p>Ga zo door en maak Slotermeer een gezondere wijk!</p>')
        .ariaLabel('Task complete')
        .ok('Ok')
        .targetEvent(ev)
    ).then(function() {
      $state.go('main.home')
    });
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
          $scope.submitData.answers[index] = $scope.imgURI;
          $scope.submitData.photoIncluded = true;
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
          $scope.submitData.answers[index] = $scope.imgURI;
          $scope.submitData.photoIncluded = true;
      }, function (err) {
          // An error occured. Show a message to the user
      });
  }
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

  // ============================= MAP ==============================

  $scope.$watch(function() {
    return $state.current.name
  }, function(value) {
    if (value == 'report.select') {
      if (angular.isDefined($scope.leaflet)) {
        $scope.leaflet.off();
        $scope.leaflet.remove();
        delete $scope.leaflet;
      }
    }
  });


  $scope.$watch(function() {
    return angular.isDefined($scope.leaflet);
  }, function(value) {
    console.log(value);
    if (value == true) {
      var customMarker = new L.Icon({
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor:  [0, -30],
        iconUrl: 'assets/img/icons/location_pin.svg',
      });
      var posOptions = {timeout: 10000, enableHighAccuracy: false, maximumAge: 60000};
      $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $scope.leaflet.setView([position.coords.latitude, position.coords.longitude], 13);

        $scope.mapOverlay = false;
        var offset = $scope.leaflet.getSize().y *0.25;
        $scope.leaflet.panBy([0, -offset], {animate: false});

        $scope.markersLayer.clearLayers();

        marker = new L.marker([position.coords.latitude, position.coords.longitude], { icon: customMarker, draggable: true });
        $scope.markersLayer.addLayer(marker);

        $http
        .get('https://api.mapbox.com/v4/geocode/mapbox.places/' + position.coords.longitude + ',' + position.coords.latitude + '.json?types=address&access_token=pk.eyJ1IjoiZ3VpZG9hamFuc2VuIiwiYSI6IjE4MjJhOTFjMWY1ZjI0ZDkzZmE5NTAyN2VkMjQ4ZTRiIn0.NZA8lmmlvcQNOS-hLiGYJg')
        .then(function(response) {
          var popupContent = '<p>' + response.data.features[0].text + '</p>';

          marker.bindPopup(popupContent, { closeButton: false });
          marker.openPopup();

          marker.on('dragend', function(changedLocation) {
              $http
                .get("https://api.mapbox.com/v4/geocode/mapbox.places/" + changedLocation.target._latlng.lng + "," + changedLocation.target._latlng.lat + ".json?types=address&access_token=pk.eyJ1IjoiZ3VpZG9hamFuc2VuIiwiYSI6IjE4MjJhOTFjMWY1ZjI0ZDkzZmE5NTAyN2VkMjQ4ZTRiIn0.NZA8lmmlvcQNOS-hLiGYJg")
                .then(function(response) {
                  var popupContent = '<p>' + response.data.features[0].text + '</p>';

                  marker.bindPopup(popupContent, { closeButton: false, maxWidth: 200 });
                  marker.openPopup();

                  $scope.submitData.lat = marker._latlng.lat;
                  $scope.submitData.lng = marker._latlng.lng;
                  $scope.submitData.address = response.data.features[0].text
              })
            });

            $scope.submitData.lat = marker._latlng.lat;
            $scope.submitData.lng = marker._latlng.lng;
            $scope.submitData.address = response.data.features[0].text
            return
        });

      }, function(err) {
        $scope.locationError = true;
      });
    }
  });


  $scope.map = function(map) {
    if (angular.isDefined($scope.leaflet)) {
      delete $scope.leaflet;
    }
    map.setView([52.368, 4.812], 13);
    $scope.markersLayer = new L.layerGroup().addTo(map);

    $scope.leaflet = map;

  };

  $scope.locationError = false;

})
