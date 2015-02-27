// collection/:urn

appControllers.controller( 'RoiSearch', [ 
'$scope',
'user',
'roi',
function( $scope, user, roi ){
  
  $scope.search_for = null;
	
	$scope.search = function(){
		roi.by_label( $scope.search_for ).then( 
		function( r ){
			$scope.rois = r;
			console.log( $scope.rois );
		});
	}

}]);