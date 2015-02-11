// new/collection

appControllers.controller( 'CollectionNew', [
'$scope',
'$injector', 
'urnServ', 
'$rootScope',
'user', 
'onto',
function( $scope, $injector, urnServ, $rootScope, user, onto ){
  
  $scope.title = "Collection New";
  $scope.type = "collection";
  $scope.show_uniq = true;
	$scope.error = false;
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  $scope.form = {};
  $scope.form[label] = onto.default_value('label');
  $scope.form[desc] = onto.default_value('description');
  
  // Run after user has been authorized
  
  $rootScope.$on( user.events.ok, function(){ go() });
  function go(){
    
    // Inherit from parent
	
    $injector.invoke( NewCtrl, this, { $scope: $scope } );
    $scope.init([ label, desc ]);
  }


  // Check CITE URN for uniqueness
  
  $scope.urn_uniq = function(){
    urnServ.uniq( $scope.urn, uniq_callback );
  }
  

  // $scope.urn_uniq callback function
  
  var uniq_callback = function( bool, urn ){
    $scope.show_uniq = !bool;
		$scope.show_error = !bool;
    if ( bool == true ){
      
      // This next line claims a CITE URN and JackSON /data URL
      // AND it retrieves default JSON-LD template
      
      // See lib/new_ctrl.js: $scope.claim
      
      $scope.claim( urn );
      return;
    }
    else {
      $scope.stdout += 'That URN is taken. Choose another.'
    }
  }
}]);