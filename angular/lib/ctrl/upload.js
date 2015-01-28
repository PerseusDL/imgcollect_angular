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
function( $scope, $injector, urnServ, json, stdout, user, $upload, config, $http, onto ){
  $scope.title = "Upload New";
  $scope.stdout = "";
  
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var src = onto.with_prefix('src');
  var rights = onto.with_prefix('rights');
  var owner = onto.with_prefix('owner');
  
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
    var creator = onto.with_prefix('creator');
    var created = onto.with_prefix('created');
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
	  if ( $scope.form[ src_field ] ){
	    $scope.cp_http();
	  }
    }
  }
  
  	
  // Load the default JSON
  
  function default_json(){
    json.get( $scope.src ).then(
    function( data ){
      $scope.json = data;
      json_to_str( $scope.json );
      stdout.log( "Default JSON loaded from: "+$scope.src );
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
  		url: config.imgup.url, 
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
      url: config.imgup.url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: { src: $scope.form[ src_field ] }
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
  	$scope.json[ onto.with_prefix('src') ]['@id'] = data.src.replace(' ', "%20");
  	$scope.json[ onto.with_prefix('orig') ] = data.orig;
  	json_to_str( $scope.json );
  	urnServ.fresh( urnServ.base+"upload.{{ id }}", fresh_callback );
  }
	
  // Once you have a fresh item URN
  
  var fresh_callback = function( urn ){
    $scope.urn = urn;
    touch();
    json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
		function( data ){
			setTimeout( function(){
				$scope.saving = false;
			}, 5000 );
			stdout.log( data );
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


// uploads

appControllers.controller( 'UploadListCtrl', [
'$scope',
'$injector',
'$rootScope',
'user',
'onto',
function( $scope, $injector, $rootScope, user, onto ){
  $scope.type = "upload";
  $scope.title = "Upload List";
  $scope.keys = [ 'urn','label','desc','user','time' ];
  
  // The fields you allow users to filter
  // are set with object keys in $scope.filter
  
  // See lib/list_ctr.js: filter()
  
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  $scope.filter = {};
  $scope.filter[label] = null;
  $scope.filter[desc] = null;
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, 
    function(){ $scope.apply_filter() 
  });
  
  
  // Applying the filter is the same as initializing..
  
  $scope.apply_filter = function(){
    $injector.invoke( ListCtrl, this, { $scope: $scope } );
    $scope.init([label,desc]);
  }
  
  $scope.apply_filter();
}]);


// upload/:urn

appControllers.controller( 'UploadCtrl', [
'$scope',
'$injector',
'resize',
'item',
'onto',
function( $scope, $injector, resize, item, onto ){
  $scope.title = "Upload";
	
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var keyword = onto.with_prefix('subject');
  var rights = onto.with_prefix('rights');
  var owner = onto.with_prefix('owner');
	
  $scope.form = {};
  $scope.form[label] = null;
  $scope.form[desc] = null;
  $scope.form[owner] = null;
  $scope.form[rights] = onto.default_value('rights');
  $scope.form[keyword] = [];
  
  $injector.invoke( EditCtrl, this, { $scope: $scope } );
  $scope.init([label,desc,owner,rights]);
  
  // Resize
  
  $scope.resize = [];
  resize.get( $scope.urn ).then(
    function( data ){ $scope.resize = data }
  );
  
  // Items
  
  $scope.items = [];
  item.by_upload( $scope.urn ).then(
    function( data ){ $scope.items = data }
  );
  
}
]);