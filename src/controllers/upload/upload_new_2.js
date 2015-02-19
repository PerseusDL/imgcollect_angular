appControllers.controller( 'UploadNew2', [
'$scope',
'config',
'json',
'tmpl',
'resizer',
'$upload',
function( $scope, config, json, tmpl, resizer, $upload ){
	
	$scope.title = "Upload New 2";
	
	$scope.progress = {
		total: null,
		now: null,
		done: false,
		error: false
	};
	$scope.default = angular.copy( $scope.progress );
	
	var pbar = $( '#progressbar' );
	var plabel = $( '.progress-label' );
	
	$scope.upload = function( file ){
		$scope.progress = angular.copy( $scope.default );
		pbar.progressbar({
			value: false,
			change: function(){
				plabel.text( pbar.progressbar( "value" ) + "%" );
			}
		});
		
		$upload.upload({
			url:config.imgup.url+'/upload',
			method: 'POST',
			file: $scope.file
		})
		.progress( function(r){
			$scope.progress.total = r.total;
			$scope.progress.now = r.loaded;
			pbar.progressbar( "value", (r.loaded/r.total)*100 );
		})
		.error( function(r){
			$scope.progress.error = true;
		})
		.success( function(r){
			$scope.progress.orig = r.orig;
			$scope.progress.src = r.src;
			$scope.progress.done = true;
		})
	}
	
	
}]);