// Pre-delete

appControllers.controller( 'PreDeleteCtrl', [
'$scope',
'$window',
function( $scope, $window ){
	$scope.urn = null;
	$scope.go = function(){
		$window.location.href ="#/delete/"+$scope.urn;
	}
}]);