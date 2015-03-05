// new/upload

appControllers.controller( 'UploadNew', [
'$scope',
'$injector',
'urnServ',
'json',
'stdout',
'user',
'$upload',
'config',
'$http',
'onto',
'resizer',
'tmpl',
function( $scope, $injector, urnServ, json, stdout, user, $upload, config, $http, onto, resizer, tmpl ){
  $scope.title = "Upload New";
  $scope.stdout = "";
  
  var label = onto.pre('label');  
  var desc = onto.pre('description');
  var src = onto.pre('src');
  var rights = onto.pre('rights');
  var owner = onto.pre('owner');
  
  $scope.form = {};
  $scope.form[ label ] = "";
  $scope.form[ desc ] = "";
  $scope.form[ owner ] = "";
  $scope.form[ rights ] = "";
  $scope.form[ src ] = "";
  $scope.src_field = src;
  $scope.type = 'upload';
  
  // Initialize everything...
  // Pass along the form fields to edit in the init
  // function.
  
  // It's not dry.
  // Existence in $scope.form should be enough...
  
  // TODO Fix this mess.
  
  $injector.invoke( NewCtrl, this, { $scope: $scope } );
  $scope.init([ label, desc, rights, owner ]);
  $scope.saving = false;
  
  // Show disk
  
  $scope.show_disk = false;
  $scope.disk = function( show ){
    $scope.show_disk = show;
  }
  
  $scope.change = function(key){ change(key) }
  
  
  function set_form_default( form_key, data_key ) {
    $scope.form[ form_key ] = onto.default_value( data_key );
    $scope.change( form_key );
  }
  
  
  function touch (){
    var creator = onto.pre('creator');
    var created = onto.pre('created');
    $scope.json['@id'] = $scope.urn;
    $scope.json[creator]['@id'] = user.id();
    $scope.json[created] = ( new TimeStamp ).xsd();
    json_to_str( $scope.json );
  }
  
  
  // Update JSON when form changes
  
  function change( key ) {
    if ( key in $scope.json ) {
      if ( angular.isDefined( $scope.json[key]['@id'] ) ){
        $scope.json[key]['@id'] = $scope.form[key];
      } 
  	else {
        $scope.json[key] = $scope.form[key];
      }
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
  
  
  // Turn JSON into pretty-printed string
  
  function json_to_str( data ) {
  	var disp = json.disp( data );
  	$scope.context = disp[0];
  	$scope.json_string = disp[1];
  }
  
  
  // Save your new upload
  
  $scope.save = function(){
    $scope.saving = true;
    
    // Disk or URL?
    
    if ( $scope.show_disk == true ){
      if ( $scope.file ){
        $scope.upload();
      }
    }
    else {
	  	if ( $scope.form[ src ] ){
	  	  $scope.cp_http();
	  	}
    }
  }
  
  	
  // Load the default JSON
  
  function default_json(){
    tmpl.get( $scope.type ).then(
    function( data ){
      $scope.json = data;
      json_to_str( $scope.json );
      stdout.log( "Default "+$scope.type+" JSON loaded" );
      $scope.ready = true;
      
      // TODO we should loop through the 
      // ontology to see what has defaults 
      // rather than hard-coding the fields 
      // we want to set defaults for
      
      set_form_default(rights,'rights');
    });
  }
  default_json();
  
  
  // Image Uploader
  
  $scope.file = '';
  $scope.upload_out = false;
  $scope.upload = function(){
  	$upload.upload({
  		url: config.imgup.url+'/upload', 
  		method: 'POST',
  		file: $scope.file
   	})
  	.error( function(){
  		$scope.upload_out = "There was an error upload";
   	})
  	.success( function( data ){
  		upload_success( data );
   	});
  }
  
  $scope.cp_http = function(){
  	$http({
      method: 'POST',
      url: config.imgup.url+'/upload',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { src: $scope.form[ src ] }
  	})
  	.error( function(){
			$scope.upload_out = "There was an error upload";
  	})
  	.success( function( data ){
      upload_success( data );
  	})
  }
  
  function upload_success( data ){
		$scope.upload_out = "Uploaded successfully";
  	exif_json( data );
  	$scope.json[ onto.pre('src') ]['@id'] = data.src.replace(' ', "%20");
  	$scope.json[ onto.pre('orig') ] = data.orig;
  	json_to_str( $scope.json );
  	urnServ.fresh( urnServ.base+"upload.{{ id }}", fresh_callback );
  }
	
  // Once you have a fresh URN
  
  var fresh_callback = function( urn ){
    $scope.urn = urn;
    touch();
    json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
		function( data ){
			setTimeout( function(){
				$scope.saving = false;
			}, 5000 );
			
			// resize upload
			
			resizer.add( $scope.urn, 200, 200 );
			
		});
	}
  
  // TODO externalize exif ontology
  
  function exif_json( data ){
  	var exif = data.exif;
  	for ( var key in exif ) {
      $scope.json[ 'exif:'+key.toCamel() ] = exif[key];
  	}
  }
}]);