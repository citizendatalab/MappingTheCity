angular.module('app.controllers')

.controller('HomeController', function($http, $scope,$rootScope, $filter, $timeout, $uibModal, markersData, routesData, HomeService) {
  

  $scope.search = {category:['showAdded']};
  $scope.geojson = '';
  $scope.routes = routesData;

  $scope.markers = markersData;



  //Map
  $scope.map = function (map, markers) {
    map.setView([52.378, 4.812], 14);
    //map.addControl(lc);

    $scope.markersLayer = L.layerGroup();
    $scope.markersLayer.addTo(map);


    $scope.routesLayer = L.geoJson();
    $scope.routesLayer.addTo(map)

    map.on('ready', function(e) {
      $scope.showMarkers();
       $scope.showroutes();
    });
  };
    $scope.showFilters = true;

    $rootScope.showMarkers = function() {
      $scope.markersLayer.clearLayers();
      var clusterGroup = new L.MarkerClusterGroup({
        maxClusterRadius: 30,
        zoomToBoundsOnClick: false
      }).addTo($scope.markersLayer);

      var markers = [];
      for (i = 0; i <$scope.markers.length; i++) {
      var markerString = '';

        if($scope.markers[i].answers.length == $scope.markers[i].task[0].questions.length){


          for(k = 0; k<$scope.markers[i].answers.length; k++){
            
            var markerAnswer = $scope.markers[i].answers[k];
            
            if(markerAnswer != null){
              var markerQuestion = $scope.markers[i].task[0].questions[k].text;
              var qNr = k+1
              markerString += "<p class='markerQ'>Vraag "+qNr+" :"+markerQuestion+": </p><p class='markerA'>";
              if(typeof(markerAnswer) === 'string'){
                markerString += 'Antwoord: '+markerAnswer;
              }
              else{
                answerText = '';
                for (var j = 0; j < markerAnswer.length; j++) {
                  
                  if (answerText === '') {
                    var str = '\'' + markerAnswer[j] + '\'';
                    answerText += 'Antwoord: '+str;
                  } else if (j + 1 === markerAnswer.length) {
                    var str = ' en \'' + markerAnswer[j] + '\'';
                    answerText += str;
                  } else {
                    var str = ', \'' + markerAnswer[j] + '\'';
                    answerText += str;
                  }
                }
                markerString += answerText
              }
              markerString += "</p>"
          }
        }
        }
      

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
            "answers": $scope.markers[i].answers,
            "markerString": markerString
          }
        }

        markers.push(marker)

      }



      var markerIcon = L.divIcon({
        className: 'report',
        iconSize: new L.Point(20, 20),
      });

      L.geoJson(markers, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: markerIcon})
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup( '<div class="markers-title"><p>'+feature.properties.task +'</p></div>' +
              '<div class="markers-body">' +
                //'<div class="markers-text">' + $scope.markers[i].task[0].markerDescription + ' '+ markerString +'</br> Toegevoegd door: '+$scope.markers[i].addedBy[0]['email']+'</div>' +
               '<div class="markers-text">' + feature.properties.markerString+'</br></div>' +
                //'<div class="markers-answer">'  '</div>' +
              '</div>')
        }
      }).addTo(clusterGroup);

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

      L.geoJson(route, {
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
            "name": $scope.routes[i].locations[j].name
          }
        }

        locations.push(location);
      }
    }

    var locationIcon = L.divIcon({
      className: 'route-location',
      iconSize: new L.Point(15, 15),
    });

    L.geoJson(locations, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: locationIcon})
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup("Loading...")
        layer.on('click', function (e) {
                var locId = feature.properties.id;
                var popup = e.target.getPopup();
                  
                HomeService.getLocationData(locId).then( function(data) {
                      dataLength = data.length;
                      if (dataLength == 1){
                        popup.setContent('Op deze plek is ' + dataLength + ' persoon geweest');
                      }
                      else{
                        popup.setContent('Op deze plek zijn ' + dataLength + ' personen geweest');
                      }
                      
                      popup.update();
                       
                });
            })
        }
      
    }).addTo($scope.routesLayer);

  };

    $scope.getCsv = function() {

        HomeService.getCsv($scope.search).then( function(csvdata) {
            //console.log(csvdata)
            filename = 'export.csv';
            csv = 'data:text/csv;charset=utf-8,' + csvdata;
            data = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename);
            link.click();
        });
    };

})

angular.module('app.controllers')
.controller('HomeModalCtrl', function ($scope, $uibModalInstance, HomeService) {

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
