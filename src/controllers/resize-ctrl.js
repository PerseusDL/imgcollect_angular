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
    var label = onto.pre('label');
    var desc = onto.pre('description');
    var keyword = onto.pre('subject');
    $scope.title = "Resize";
    $scope.form = {};
    $scope.form[label] = "";
    $scope.form[desc] = "";
    $scope.form[subject] = [];
    $injector.invoke( EditCtrl, this, { $scope: $scope } );
    
    $scope.run = function() {
      $scope.uploads = [];
      $scope.uploads[0] = { 
        urn: $scope.json[onto.pre('src')]['@id'] 
      };
    }
    
    $scope.init();
  }
}]);