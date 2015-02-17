// StdOut

appControllers.controller( 'StdOut', [
'$scope',
'stdout',
function( $scope, stdout ){
  $scope.stdout = stdout;
  $scope.$watch('stdout.msg', function(){
    $scope.msg = stdout.msg;
  });
}]);