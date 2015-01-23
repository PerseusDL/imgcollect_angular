// annotations

appControllers.controller( 'AnnotationListCtrl', [
'$scope',
'$injector',
'user',
'$rootScope',
'onto',
function( $scope, $injector, user, $rootScope, onto ){
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, function(){ go() });
  
  function go(){
    $scope.type = "annotation";
    $scope.title = "Annotation List";
    $scope.keys = [ 'urn','label','desc','user','time' ];
	  
	  var label = onto.with_prefix('label');  
	  var desc = onto.with_prefix('description');
				  
    $injector.invoke( ListCtrl, this, { $scope: $scope } );
    $scope.init([label,desc]);
    
    // The fields you allow users to filter
    // are set with object keys in $scope.filter
    //
    // See lib/list_ctr.js: filter()
    
    $scope.filter = {};
    $scope.filter[label] = null;
    $scope.filter[desc] = null;
    
    // Applying the filter is the same as initializing..
    
    $scope.apply_filter = function(){
      $injector.invoke( ListCtrl, this, { $scope: $scope } );
      $scope.init([label,desc]);
    }
  }
  
}]);