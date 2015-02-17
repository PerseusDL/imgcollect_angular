// Builds a box for checking URN uniqueness
// You must implement a $scope.urn_uniq function
// in your controller.

// see controllers.js: CollectionNew

appDirectives.directive('urnUniqBox', 
function(){
  return {
    templateUrl: 'partials/share/urn-uniq-box.html'
  }
});