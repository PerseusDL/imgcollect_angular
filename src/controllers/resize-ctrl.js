// resize/:urn

appControllers.controller( 'ResizeCtrl', [
'$scope',
'$injector',
'user',
'$rootScope',
'onto',
function( $scope, $injector, user, $rootScope, onto ){
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, function(){ go() });
  
  function go(){
    var label = onto.with_prefix('label');
    var desc = onto.with_prefix('description');
    var keyword = onto.with_prefix('subject');
    $scope.title = "Resize";
    $scope.form = {};
    $scope.form[label] = "";
    $scope.form[desc] = "";
    $scope.form[subject] = [];
    $injector.invoke( EditCtrl, this, { $scope: $scope } );
    
    $scope.run = function() {
      $scope.uploads = [];
      $scope.uploads[0] = { 
        urn: $scope.json[onto.with_prefix('src')]['@id'] 
      };
    }
    
    $scope.init();
  }
}]);