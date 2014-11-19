// Base controller
// http://blog.omkarpatil.com/2013/02/controller-inheritance-in-angularjs.html

var EditCtrl = ['$scope', 'json', '$routeParams', function( $scope, json, $routeParams ){
	$scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
	$scope.stdout = "";
	$scope.context = null;
	
	// JSON and HTML form
	$scope.src = null;
	$scope.json = {};
	$scope.json_string = '';
	$scope.save = function(){ save() }
	$scope.change = function( key ){ change(key) }
	$scope.init = function(){ init() }
	
	// Update JSON when form changes
	function change( key ) {
		if ( key in $scope.json ) {
			$scope.json[key] = $scope.form[key];
			json_to_str( $scope.json );
		}
	}
	
	// Update the form with JSON data
	function form() {
		for ( var key in $scope.json ) {
			if ( key in $scope.form ) {
				$scope.form[key] = $scope.json[key];
			}
		}
	}
	
	// Save JSON
	function save() {
		json.put( $scope.src[0], $scope.json ).then(
			function(msg){ $scope.stdout = msg }
		);
	}
	
	// Retrieve JSON src url
	function src() {
		json.urn( $scope.urn ).then( function( data ){
			$scope.src = data.src;
			get();
		});
	}
	
	// Get JSON
	function get() {
		json.get( $scope.src[0] ).then( function( data ){
			$scope.json = data;
			json_to_str( data );
			form();
		});
	}
	
	// Turn JSON into pretty-printed string
	function json_to_str( data ) {
		var json = {};
		for ( var key in data ) {
			if ( key == '@context' ){ 
				$scope.context = angular.toJson( data[key], true );
				continue;
			}
			json[key] = data[key];
		}
		$scope.json_string = angular.toJson( json, true );
	}
	
	// Run when controller is initialized
	function init() {
		src();
	}
}];