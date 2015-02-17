// View

appControllers.controller( 'ViewCtrl', [
'$scope',
'$routeParams',
'json',
function( $scope, $routeParams, json ){
  
  // Get the URN
  
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  
  // Get the coords
  
  var urn = $scope.urn.split("@");
	if ( urn.length > 1 ){
  	$scope.coords = urn[1].split(',');
		get_src( urn[0] );
	}
  else {
  	get_src( urn );
  }
  $scope.max_width = 600;
  
  
  // What's the src JSON?
  
  function get_src( urn ){
    json.urn( urn ).then( function( data ){
      get_json( data['src'][0] );
    });
  }
  
  
  // Check the type
  
  function check_type( data ){
    var type = data['dct:type']
    switch( type ){
      case 'upload':
        $scope.src = data['dct:references']['@id']
      break;
      case 'item':
        get_src( data['dct:references']['@id'] )
      break;
    }
  }
  
  
  // Get the src JSON
  
  function get_json( src ){
    json.get( src ).then( function( data ){
      check_type( data );
    });
  }
  
}]);