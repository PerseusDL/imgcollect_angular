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
function( $scope, $injector, urnServ, json, stdout, user, $upload, config, $http, onto, resizer ){
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
	  	if ( $scope.form[ src ] ){
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
  	$scope.json[ onto.with_prefix('src') ]['@id'] = data.src.replace(' ', "%20");
  	$scope.json[ onto.with_prefix('orig') ] = data.orig;
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


// uploads

appControllers.controller( 'UploadListCtrl', [
'$scope',
'$injector',
'$rootScope',
'$routeParams',
'user',
'onto',
'query',
function( $scope, $injector, $rootScope, $routeParams, user, onto, query ){
  $scope.type = "upload";
  $scope.keys = [ 'urn','label','desc','user','time' ];
	$scope.limit = 10;
  $scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );
	
  // The fields you allow users to filter
  // are set with object keys in $scope.filter
  
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  $scope.filter = {};
  $scope.filter[label] = null;
  $scope.filter[desc] = null;
	
	$scope.query = function(){
		return {
			where: [
				[ '?urn', 'type', '"upload"' ],
				user_check(),
				[ '?urn', 'label', '?label', build_filter( '?label', label ) ],
				[ '?urn', 'description', '?desc', build_filter( '?desc', desc ) ],
				[
					[ '?res', 'memberOf', '?urn'],
					[ '?res', 'src', '?thumb' ],
					{ optional:true }
				],
				[ '?urn', 'created', '?time', { optional:true } ],
				[ '?urn', 'represents', '?rep', { optional:true } ],
				[ '?urn', 'creator', '?user', { optional:true } ],
			],
			order_by: 'desc( ?time )',
			limit: $scope.limit,
			offset: $scope.limit * ( $scope.page-1 )
		}
	}
	
	function user_check(){
		if ( user.only ) {
			return [ '?urn', 'creator', "<"+user.url()+">" ];
		}
		return null;
	}
	
	// Build a filter clause
	
	function build_filter( key, handle ){
		var filter = $scope.filter[ handle ]
		if ( filter == null ){
			return angular.copy( { optional:true } );
		}
		return angular.copy({ filter:'regex( '+key+', "'+ filter +'", "i" )' });
	}
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, 
    function(){ $scope.apply_filter() }
	);
	
  // Clear the filter
  
  $scope.clear_filter = function(){
    for ( var key in $scope.filter ){
      $scope.filter[key] = null;
    }
    $scope.apply_filter();
  }
  
  
  // Filtering changes if user.only changes

  $scope.$watch( function(){ return user.only },
    function( newVal, oldVal ){
      if ( newVal != oldVal ){
        $scope.apply_filter();
      }
    }
  );
	
  // Applying the filter is the same as initializing..
  
  $scope.apply_filter = function(){
		
		// Get count
		
		query.count( $scope.query() ).then(
		function( data ){
			$scope.count = data;
      $scope.pages = Math.ceil( $scope.count / $scope.limit );
      $scope.prev = ( $scope.page > 1 ) ? true : false;
      $scope.next = ( $scope.page < $scope.pages ) ? true : false;
		});
		
		// Get the data
		
    query.get( $scope.query() ).then( 
		function( data ){
			$scope.json = data;
		});
		
  }
	
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
  
}]);