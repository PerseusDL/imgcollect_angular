// User

appControllers.controller( 'UserCtrl', [
'$scope',
'$injector',
'user',
'$rootScope',
function( $scope, $injector, user, $rootScope ){    
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, function(){ go() });
  
  function go(){
    $scope.only = user.only;
    $scope.user = user.id();
    $scope.username = user.name();
  }
  
  $scope.switch = function( bool ){
    user.only = bool;
    go();
  }
}]);