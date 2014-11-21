var NewCtrl = 	['$scope', 'urnServ', 'json', function( $scope, urnServ, json ){
	
	// Update data
	
	$scope.json = {};
	$scope.form = {};
	
	// Build CITE URN 
	
	$scope.id = null;
	$scope.urn = '';
	$scope.base_urn = urnServ.base;
	$scope.urn_build = function(){
		$scope.urn = $scope.base_urn+$scope.id.alphaOnly();
	}
	
	// Output messages
	
	$scope.stdout = "";
	
	// Path to default JSON
	
	$scope.default_url = 'default/'+$scope.type+'.json';
	
	
	// Claim JackSON data url and CITE URN
	
	$scope.claim = function( urn ){
		urnServ.claim( data_path(urn), urn ).then(
			function( data ){ 
				$scope.stdout = data;
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
			$scope.stdout = "Default JSON loaded from: "+$scope.default_url;
		});
	}
}];