var NewCtrl = [
'$scope',
'urnServ',
'json',
'stdout',
'user',
'onto',
'tmpl',
function( $scope, urnServ, json, stdout, user, onto, tmpl ){
  
  // Update data
  
  $scope.json = {};
  $scope.ready = false;
  
  // Build CITE URN 
  
  $scope.id = null;
  $scope.urn = '';
  $scope.base_urn = urnServ.base;
  $scope.urn_build = function(){
    $scope.urn = $scope.base_urn+$scope.clean_id()
  }
  $scope.clean_id = function(){ 
		return $scope.id.alphaOnly().toLowerCase() 
	};

  // Run when controller is initialized
  // @param [Array] editable fields for this item
	
  $scope.init = function( edit_fields ){ 
		init( edit_fields )
	}
  function init( edit_fields ) {
    $scope.edit_text_fields = edit_fields;
  }
  
  // Output messages
  
  $scope.stdout = "";
  
  
  // Claim JackSON data url and CITE URN
  
  $scope.claim = function( urn ){
    urnServ.claim( $scope.data_path( urn ), urn ).then(
		function( data ){ 
		  stdout.log( data );
		  default_json();
		});
  }
  
  
  // Build the data path URL
  
  $scope.data_path = function( urn ){
    return $scope.type+'/'+urn
  }
  
  
  // Save the default after writing the most basic values
  
  var save = function(){
    touch();
    json.put( $scope.data_path( $scope.urn ), $scope.json ).then(
    function( data ){
      stdout.log( data );
      $scope.ready = true;
    });
  }
  
  
  // Set basic values
  
  var touch = function(){
    $scope.json['@id'] = $scope.urn;
    var creator = onto.pre('creator');
    var created = onto.pre('created');
    $scope.json[creator]['@id'] = user.id();
    $scope.json[created] = ( new TimeStamp ).xsd();
  }
  
  
  // Load the default JSON data
  
  var default_json = function(){
    tmpl.get( $scope.type ).then(
    function( data ){
      $scope.json = data;
      stdout.log( "Default "+$scope.type+" JSON loaded" );
      save();
    });
  }

}];