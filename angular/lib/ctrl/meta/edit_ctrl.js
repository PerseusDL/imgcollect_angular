// Base controller
// http://blog.omkarpatil.com/2013/02/controller-inheritance-in-angularjs.html

var EditCtrl = ['$scope', 
'json',
'$routeParams',
'onto',
function( $scope, json, $routeParams, onto ){
	
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  $scope.stdout = "";
  $scope.context = null;
  
  
  // JSON and HTML form
  
  $scope.src = null;
  $scope.json = {};
  $scope.json_string = '';
  $scope.upload_ref = onto.with_prefix('src');
      
  $scope.save = function(){ save() }
  $scope.change = function( key ){ change(key) }
  $scope.init = function(edit_fields){ init(edit_fields) }
  
  
  // Update JSON when form changes
  
  function change( key ) {
    if ( key in $scope.json ) {
      if (angular.isDefined($scope.json[key]['@id'])) {
        $scope.json[key]['@id'] = $scope.form[key];
      } else {
        $scope.json[key] = $scope.form[key];
      }
      json_to_str( $scope.json );
    }
  }
  
  
  // Update the form with JSON data
  
  function form() {
    for ( var key in $scope.json ) {
      if ( key in $scope.form ) {
        if (angular.isDefined($scope.json[key]['@id'])) {
          $scope.form[key] = $scope.json[key]['@id'];
        } else {
          $scope.form[key] = $scope.json[key];
        }
      }
    }
  }
  
  
  // Save JSON
  
  function save() {
  	$scope.saving = true;
  	json.put( $scope.src[0], $scope.json ).then(
  	function( msg ){ 
  	  output( msg );
  	  setTimeout( function(){
  	    $scope.saving = false;
  	  }, 5000 );
  	});
  }
  
  
  // Write output
  
  function output( msg ) {
  	$scope.stdout += msg+"\n";
  }
  
  
  // Retrieve JSON src url
  
  function src() {
  	json.urn( $scope.urn ).then( 
  	function( data ){
      $scope.src = data.src;
  	  get();
  	});
  }
  
  
  // Get JSON
  
  function get() {
  	json.get( $scope.src[0] ).then( 
		function( data ){
	  	$scope.json = data;
	  	json_to_str( $scope.json );
	  	form();
	  	
	  	// Run code after receiving JSON
	  	
	  	if ( $scope.run != undefined ){
	  	  $scope.run();
	  	}
  	});
  }
  
  
  // Turn JSON into pretty-printed string
  
  function json_to_str( data ) {
  	var disp = json.disp( data );
  	$scope.context = disp[0];
  	$scope.json_string = disp[1];
  }
  
  
  // Run when controller is initialized
  // @param [Array] edit_fields array of editable fields for this item
  
  function init( edit_fields ) {
    src();
    $scope.edit_text_fields = edit_fields;
  }
	
}];