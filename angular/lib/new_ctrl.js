var NewCtrl = ['$scope','urnServ','json', 'stdout', function( $scope, urnServ, json, stdout ){
	
	// Update data
	
	$scope.json = {};
	$scope.form = {};
	
	// Build CITE URN 
	
	$scope.id = null;
	$scope.urn = '';
	$scope.base_urn = urnServ.base;
	$scope.urn_build = function(){
		$scope.urn = $scope.base_urn+$scope.clean_id()
	}
	$scope.clean_id = function(){ return $scope.id.alphaOnly().toLowerCase() };
	
	// Output messages
	
	$scope.stdout = "";
	
	// Path to default JSON
	
	$scope.default_url = 'default/'+$scope.type+'.json';
	
	
	// Claim JackSON data url and CITE URN
	
	$scope.claim = function( urn ){
		urnServ.claim( data_path(urn), urn ).then(
			function( data ){ 
 				stdout.log( data );
				default_json()
			}
		);
	}
	
	
	// Build the data path URL
	
	var data_path = function( urn ){
		return $scope.type+'/'+urn
	}
	
	
	// Load the default JSON data
	
	var default_json = function(){
		json.get( $scope.default_url ).then(
		function( data ){
			$scope.json = data;
			stdout.log( "Default JSON loaded from: "+$scope.default_url );
		});
	}
}];