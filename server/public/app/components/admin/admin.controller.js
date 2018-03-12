angular.module('app.controllers')

.controller('AdminController', function($scope, $location, $uibModal, routeData, userData, taskData,catData, AdminService) {
  $scope.users = userData;
  $scope.tasks = taskData;
  $scope.routes = routeData;
  $scope.categories = catData;


  $scope.search = {startDate:new Date("7-1-2016"), endDate:new Date("12-31-2016")};

  $scope.isActive = function(data) {
    if ($location.path().substr(0, data.length) === data) {
      return true;
    }
    return false;
  };
  

  $scope.categoryTasks = catData
  for(let theme of $scope.categoryTasks){
    theme['tasks'] = [];
  }
  
  $scope.nestTasks = function () {
    for (let i = 0; i < taskData.length; i++) {
        for(let theme of $scope.categoryTasks){
          if(taskData[i]['category']['label'] == theme['label']){ 
              theme['tasks'].push(taskData[i])
          }
        } 
    }
  }


  $scope.nestTasks();
  console.log($scope.categoryTasks);

  $scope.manageCategories = function () {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: '/app/components/admin/modals/manage.categories.html',
      controller: 'ManageCategoriesCtrl',
      size: 'lg',
      resolve: {
        catData: function () {
          return $scope.categories;
        }
      }
    });

    modalInstance.result.then(function () {
      return
    });
  };

  $scope.openNewTask = function () {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: '/app/components/admin/modals/add.modal.task.html',
      controller: 'AddModalTaskCtrl',
      size: 'lg',
      resolve: {
        catData: function () {
          return $scope.categories;
        }
      }
    });

    modalInstance.result.then(function () {
      return
    });
  };

  $scope.openNewRoute = function () {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: '/app/components/admin/modals/add.modal.routes.html',
      controller: 'AddModalRouteCtrl',
      size: 'lg',
      resolve: {
        taskData: function () {
          return $scope.tasks;
        }
      }
    });

    modalInstance.result.then(function () {
      return
    });
  };

  $scope.openEditTask = function (data) {
    console.log(data);
    console.log($scope.categories);
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: '/app/components/admin/modals/edit.modal.task.html',
      controller: 'EditModalTaskCtrl',
      size: 'lg',
      resolve: {
        taskInfo: function () {
          return data;
        },
        catData: function () {
          return $scope.categories;
        }
      }
    });

    modalInstance.result.then(function () {
      return
    });
  };
  $scope.openEditRoute = function (data) {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: '/app/components/admin/modals/edit.modal.routes.html',
      controller: 'EditModalCtrlRoutes',
      size: 'lg',
      backdrop : 'static',
      resolve: {
        routeInfo: function () {
          return data;
        },
        taskData: function () {
          return $scope.tasks;
        }
      }
    });

    modalInstance.result.then(function () {
      return
    });
  };


  $scope.getCsv = function() {
        AdminService.getCsv($scope.search).then( function(csvdata) {
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

.controller('ManageCategoriesCtrl', function ($scope, $uibModalInstance, AdminService, catData) {
  $scope.categories = catData;
  $scope.newCategory = {
   'name':'',
   'label': '',
   'color':''
  }

  $scope.editCategory = function(category){
      $scope.newCategory = category;
  }

  $scope.createCategory = function(data) {
      if(data.hasOwnProperty('_id')){
          AdminService.updateCategory(data).then( function() {
            AdminService.getCategories();
            //$rootScope.nestTasks();
        });
      }else{
        AdminService.createCategory(data).then( function() {
          AdminService.getCategories()
        });
      }
      
    
    $uibModalInstance.close();
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

})

angular.module('app.controllers')

.controller('AddModalTaskCtrl', function ($scope, $uibModalInstance, AdminService, catData) {
  $scope.categories = catData;
  $scope.newTask = {
    title: '', category: '', scavengerQText: '', normalQText: '', markerDescription: '', withPicture:'', questions: [{ type: 'instruction', text: '', answers: [{'value': '', 'code':''}] }], points: '', active:false, partOf:{'route': false, 'direct':false}
  }
  $scope.addQuestion = function() {
    $scope.newTask.questions.push({ type: 'instruction', text: '', answers: [{'value': '', 'code':''}] });
    console.log($scope.newTask);
  }

  $scope.addAnswer = function(index) {
    $scope.newTask.questions[index].answers.push({'value': '', 'code':''});
  }

  $scope.createTask = function(data) {
    console.log(data);

      AdminService.createTask(data).then( function() {
        AdminService.getTasks()
      });
    
    $uibModalInstance.close();
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

})



angular.module('app.controllers')
.controller('EditModalTaskCtrl', function ($scope, $uibModalInstance, taskInfo, catData, AdminService) {
  $scope.taskInfo = taskInfo;
  $scope.categories = catData
  $scope.addQuestion = function() {
    $scope.taskInfo.questions.push({ type: 'instruction', text: '', answers: [{'value': '', 'code':1}] });
  }

  $scope.addAnswer = function(index) {
    $scope.taskInfo.questions[index].answers.push({'value': '', 'code':1});
  }

  $scope.createTask = function(data) {

       AdminService.updateTask(data).then( function() {
        AdminService.getTasks()
      });
   
    $uibModalInstance.close();
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})


angular.module('app.controllers')
.controller('AddModalRouteCtrl', function ($scope, $uibModalInstance, AdminService, taskData) {
  $scope.allTasks = taskData

  $scope.selectedTask = {};
  $scope.allselectedTasks = [];


  $scope.newRoute = {
    title: '', locations:[], points: '', active: true
  }

  $scope.map = function (map) {
    map.setView([52.378, 4.812], 14);
    var featureGroup = L.featureGroup().addTo(map);
    var drawControl = new L.Control.Draw({
        draw : {
          polygon : false,
          rectangle : false,
          circle : false
      },
        edit: {
          featureGroup: featureGroup
        }
      }).addTo(map);


    var editControl = new L.Control.Draw({
        draw : {
          polygon : false,
          rectangle : false,
          circle : false,
          polyline:false
      },
        edit: {
          featureGroup: featureGroup
        }
      });


    map.on('draw:created', function(e) {
        featureGroup.addLayer(e.layer);
        if(e.layerType == 'marker'){
          coordsInfo = e.layer.getLatLng();
          $scope.newRoute.locations.push({ 'name': '', 'lat':coordsInfo.lat, 'lng': coordsInfo.lng, 'leafletId': e.layer._leaflet_id, 'tasks':[]});
        }
        if(e.layerType == 'polyline'){
          coordsInfo = e.layer.getLatLngs();
          console.log(coordsInfo)
          var reformattedcoordsInfo = coordsInfo.map(function(obj) { 
             var nArr = [obj['lng'],obj['lat']];
             return nArr;
          });  
          $scope.newRoute.lineString = reformattedcoordsInfo;
          drawControl.removeFrom(map);
          editControl.addTo(map);
        }
        $scope.$apply();
    });

    map.on('draw:deleted', function(e) {
      console.log(e);
      var layers = e.layers;
        layers.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                layerId = layer._leaflet_id;
                console.log(layerId);
                index = $scope.newRoute.locations.findIndex(x => x.leafletId==layerId);
                $scope.newRoute.locations.splice(index,1);
                $scope.$apply();
            }
            else if(layer instanceof L.Polyline) {
              $scope.newRoute.route = [];
              editControl.removeFrom(map);
              drawControl.addTo(map);

            }
  
        });
        //console.log(leafletId)
    });

    map.on('ready', function(e) {
      map.invalidateSize();

     console.log('ready')
    });
  };

  $scope.taskSelected = function(index){
    console.log($scope.newRoute);
    //retrieve id from selected task
    //check if id exists in array already
    if($scope.newRoute.locations[index].tasks.indexOf($scope.newRoute.selectedTask[index]) == -1){
      //$scope.allselectedTasks.push($scope.selectedTask)
      $scope.newRoute.locations[index].tasks.push($scope.newRoute.selectedTask[index])
      console.log($scope.newRoute)
    }
  }

   $scope.removeTask = function(task, locationIndex){

    var index = $scope.newRoute.locations[locationIndex].tasks.indexOf(task);
    $scope.newRoute.locations[locationIndex].tasks.splice(index, 1);   
    
   }

  $scope.createRoute = function(data) {
    AdminService.createRoute(data).then( function() {
        AdminService.getRoutes()
    });
    
    $uibModalInstance.close();
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

})

angular.module('app.controllers')
.controller('EditModalCtrlRoutes', function ($scope, $uibModalInstance, routeInfo, AdminService, taskData) {
  $scope.allTasks = taskData
  $scope.selectedTask = {};
  $scope.routeInfo = routeInfo;
  console.log(routeInfo)

  //$scope.allselectedTasks = routeInfo.tasks;

  $scope.map = function (map) {
    map.setView([52.378, 4.812], 14);
    var featureGroup = L.featureGroup().addTo(map);
    var drawControl = new L.Control.Draw({
        draw : {
          polygon : false,
          rectangle : false,
          circle : false
      },
        edit: {
          featureGroup: featureGroup
        }
      });

    var editControl = new L.Control.Draw({
        draw : {
          polygon : false,
          rectangle : false,
          circle : false,
          polyline: false
      },
        edit: {
          featureGroup: featureGroup
        }
      }).addTo(map);

    for(var value in $scope.routeInfo.locations){
      markerLat = $scope.routeInfo.locations[value]['lat'];
      markerLng = $scope.routeInfo.locations[value]['lng'];
      var marker = L.marker([markerLat, markerLng]).addTo(featureGroup);
      $scope.routeInfo.locations[value]['leafletId'] = marker._leaflet_id;
    }

    var reformattedRouteArray = routeInfo.lineString.map(function(arr) { 
             var nArr = [arr[1],arr[0]];
             return nArr;
    });  
    var polyLine = L.polyline(reformattedRouteArray).addTo(featureGroup);


    map.on('draw:created', function(e) {
      console.log(e)
         featureGroup.addLayer(e.layer);
        if(e.layerType == 'marker'){
          coordsInfo = e.layer.getLatLng();
          $scope.routeInfo.locations.push({ 'name': '', 'lat':coordsInfo.lat, 'lng': coordsInfo.lng, 'leafletId': e.layer._leaflet_id, 'tasks':[]});
        }
        if(e.layerType == 'polyline'){
          coordsInfo = e.layer.getLatLngs();
          var reformattedcoordsInfo = coordsInfo.map(function(obj) { 
             var nArr = [obj['lng'],obj['lat']];
             return nArr;
          });  
          $scope.routeInfo.lineString = reformattedcoordsInfo;
          drawControl.removeFrom(map);
          editControl.addTo(map);
        }
        
        $scope.$apply();
    });

    map.on('draw:deleted', function(e) {
      console.log(e);
      console.log($scope.routeInfo)
      var layers = e.layers;
        layers.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                layerId = layer._leaflet_id;
                console.log(layerId);
                index = $scope.routeInfo.locations.findIndex(x => x.leafletId==layerId);
                $scope.routeInfo.locations.splice(index,1);
                $scope.$apply();
            }
            else if(layer instanceof L.Polyline) {
              $scope.routeInfo.route = [];
              editControl.removeFrom(map);
              drawControl.addTo(map);
            }
  
        });
    });
  
    map.on('ready', function(e) {
      map.invalidateSize();

     console.log('ready')
    });
  };

  $scope.createRoute = function(data) {
    console.log(data);
        AdminService.updateRoute(data).then( function() {
          AdminService.getRoutes()
          $uibModalInstance.close();
        });
  }


  $scope.taskSelected = function(index){
    console.log($scope.routeInfo);
    console.log(index);

    if($scope.routeInfo.locations[index].tasks.indexOf($scope.routeInfo.selectedTask[index]) == -1){
      //$scope.allselectedTasks.push($scope.selectedTask)
      $scope.routeInfo.locations[index].tasks.push($scope.routeInfo.selectedTask[index])
      console.log($scope.routeInfo)
    }
  }

   $scope.removeTask = function(task, locationIndex){
     var index = $scope.routeInfo.locations[locationIndex].tasks.indexOf(task);
    $scope.routeInfo.locations[locationIndex].tasks.splice(index, 1);  
   }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});