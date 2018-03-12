angular.module('app')
.filter('renderHTMLCorrectly', function($sce)
{
  return function(stringToParse)
  {
    return $sce.trustAsHtml(stringToParse);
  }
})
.filter('filterMap', [function() {
    return function(markers, searchProperties, searchValues) {
        // Declare empty GeoJSON object to store found matches
        var matches = [];

        // Loop over source features
        angular.forEach(markers, function(featureObject, featureKey) {
  

            // Make sure that the assigned searchproperty exists
            /*if (featureObject.task[0].hasOwnProperty(searchProperty)) {
  
                // Source propertyvalue as lowercase;
                var property = featureObject.task[0][searchProperty].toLowerCase();
                // Search propertyvalue as lowercase;
                var search = searchValue.toLowerCase();
                // Check if searchvalue exists in sourcevalue
                if (property.indexOf(search) > -1) {
                    // Found match, push to new GeoJSON object
                    matches.push(featureObject);
                }
            }*/
            var markerDate = featureObject['date'];
            var parsedDate = new Date(markerDate).getTime()/1000;
            var property = featureObject.task[0]['category'];
            var searchVar = searchValues['category'];

             var startDate = new Date(searchValues['startDate']).getTime()/1000;
             var endDate = new Date(searchValues['endDate']).getTime()/1000;

            // Check if searchvalue exists in sourcevalue
            if (parsedDate >= startDate && parsedDate <= endDate && property.indexOf(searchVar) > -1) {
                // Found match, push to new GeoJSON object
                matches.push({
                   lat: featureObject.lat,
                   lng: featureObject.lng,
                   category: featureObject['task'][0]['category'],
                   message: featureObject['task'][0]['markerDescription'] +' '+ featureObject['answers']});
            }
           
             
             
            
        });
        
        return matches;
    };
}])
.filter('unique', ['$parse', function ($parse) {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [],
        get = angular.isString(filterOn) ? $parse(filterOn) : function (item) { return item; };

      var extractValueToCompare = function (item) {
        return angular.isObject(item) ? get(item) : item;
      };

      angular.forEach(items, function (item) {
        var isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
}]);