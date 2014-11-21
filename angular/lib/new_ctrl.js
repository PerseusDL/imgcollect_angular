var NewCtrl = ['$scope','urnServ','json', 'stdout', function( $scope, urnServ, json, stdout ){
	
	// Update data
	
	$scope.json = {};
	$scope.form = {};
	$scope.ready = false;
	
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
	
	$scope.src = 'default/'+$scope.type+'.json';
	
	
	// Claim JackSON data url and CITE URN
	
	$scope.claim = function( urn ){
		urnServ.claim( data_path( urn ), urn ).then(
			function( data ){ 
 				stdout.log( data );
				default_json();
			}
		);
	}
	
	
	// Build the data path URL
	
	var data_path = function( urn ){
		return $scope.type+'/'+urn
	}
	
	// Save the default after writing the most basic values
	
	var save = function(){
		$scope.json['@id'] = $scope.urn;
		json.put( data_path( $scope.urn ), $scope.json ).then(
		function( data ){
			stdout.log( data );
			$scope.ready = true;
		});
	}
	
	
	// Load the default JSON data
	
	var default_json = function(){
		json.get( $scope.src ).then(
		function( data ){
			$scope.json = data;
			stdout.log( "Default JSON loaded from: "+$scope.src );
			save();
		});
	}
}];