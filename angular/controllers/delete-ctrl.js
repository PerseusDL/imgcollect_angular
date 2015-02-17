// Delete things
// delete/:urn

appControllers.controller( 'DeleteCtrl', [
'$scope',
'$injector',
'json',
'$routeParams',
'deleter',
function( $scope, $injector, json, $routeParams, deleter, urn_serv ){
  
  // URNs
  
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  $scope.refs = []
  
  // UI messaging switches
  
  $scope.urn_invalid = false;
  $scope.deleted = false;
  $scope.ref_checked = false;
  
  
  // UI messaging checks
  // Keep template display logic simple.
  
  $scope.ui_no_record = function(){
    return $scope.urn_invalid;
  }
  
  $scope.ui_success = function(){
    return $scope.deleted;
  }
  
  $scope.ui_delete_safe = function(){
    if ( $scope.ref_checked && 
         $scope.deleted == false &&
         $scope.refs.length == 0 ){
      return true;
    }
  }
  
  $scope.ui_ref_found = function(){
    if ( $scope.ref_checked &&
         $scope.deleted == false &&
         $scope.refs.length > 0 ){
      return true;
    }
  }
    
  $scope.ui_ref_check = function(){
    if ( $scope.ref_checked == false &&
         $scope.deleted == false &&
         $scope.urn_invalid == false ){
      return true;
    }
  }
  
  $scope.ui_ref_table = function(){
    if ( $scope.refs.length > 0 &&
         $scope.deleted == false ){
      return true;
    }
  }
  
  $scope.ui_del_button = function(){
    if ( $scope.urn_invalid == false &&
         $scope.deleted == false &&
         $scope.ref_checked ){
      return true;
    }
  }
  
  
  // Check if URN is valid
  
  urn_valid();
  function urn_valid(){
    json.urn( $scope.urn ).then( 
    function( data ){
      if ( 'error' in data ){
        $scope.urn_invalid = true;
      }
    });
  }
  
  
  // Find all references to the URN
  
  $scope.get_refs = function(){
    deleter.refs( $scope.urn ).then( 
    function( data ){
      $scope.refs = data;
      $scope.ref_checked = true;
    });
  }
  
  
  // Delete
  
  $scope.delete = function(){
    deleter.urn( $scope.urn ).then( 
    function( data ){
      $scope.deleted = true;
    });
  }
}]);