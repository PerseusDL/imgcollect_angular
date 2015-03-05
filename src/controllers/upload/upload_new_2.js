appControllers.controller( 'UploadNew2', [
'$scope',
'config',
'json',
'tmpl',
'resizer',
'$upload',
'onto',
'urnServ',
'user',
'resizer',
function( $scope, config, json, tmpl, resizer, $upload, onto, urnServ, user, resizer ){
	
	$scope.type = 'upload';
	
	// UPLOAD
	
	$scope.progress = {
		total: null,
		now: null,
		done: false,
		error: false
	};
	
	$scope.default = angular.copy( $scope.progress );
	
	var pbar = $( '#progressbar' );
	var plabel = $( '.progress-label' );
	
	$scope.upload = function( file ){
		$scope.progress = angular.copy( $scope.default );
		pbar.progressbar({
			value: false,
			change: function(){
				plabel.text( pbar.progressbar( "value" ) + "%" );
			}
		});
		
		$upload.upload({
			url:config.imgup.url+'/upload',
			method: 'POST',
			file: $scope.file
		})
		.progress( function(r){
			$scope.progress.total = r.total;
			$scope.progress.now = r.loaded;
			pbar.progressbar( "value", (r.loaded/r.total)*100 );
		})
		.error( function(r){
			$scope.progress.error = true;
			$scope.error_output = json.disp( r );
		})
		.success( function(r){
			$scope.progress.orig = r.orig;
			$scope.progress.src = r.src;
			$scope.progress.done = true;
	  	urnServ.fresh( urnServ.base+"upload.{{ id }}", fresh_callback );
		})
	}
	
  var fresh_callback = function( urn ){
    $scope.urn = urn;
		load_tmpl();
	}
	
	// METATADATA
	
	$scope.tmpl = {
		loaded: null,
		error: null,
		saving: false,
		saved: false
	};
	
	function load_tmpl(){
		tmpl.get( $scope.type ).then(
		function( r ){
			$scope.json = r;
			$scope.tmpl.loaded = true;
		}),
		function( err ){
			$scope.tmpl.error = err;
		};
	}
	
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
	
	$scope.edit_fields = [ label, desc, rights, owner ];
	
  // Update the form with JSON data
  
  function form() {
  	for ( var key in $scope.json ) {
      if ( key in $scope.form ) {
        $scope.form[key] = $scope.json[key];
      }
  	}
  }
	
  // Update JSON when form changes
  
  $scope.change = function( key ) {
    if ( key in $scope.json ) {
      if ( angular.isDefined( $scope.json[key]['@id'] ) ){
        $scope.json[key]['@id'] = $scope.form[key];
      } 
			else {
        $scope.json[key] = $scope.form[key];
      }
    }
  }
	
  // Build the data path URL
  
  $scope.data_path = function( urn ){
    return $scope.type+'/'+urn
  }
  
  
  // Save the default after writing the most basic values
  
	$scope.save = function(){
		$scope.tmpl.saving = true;
    touch();
    json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
    function( data ){
			if ( 'error' in data ){
				$scope.tmpl.error = data;
				$scope.error_out = json.disp( $scope.json );
			}
			else {
				$scope.tmpl.saved = true;
				resizer.add( $scope.urn, 200, 200 );
			}
    });
  }
  
  // Set basic values
  
	function touch(){
    $scope.json['@id'] = $scope.urn;
    var creator = onto.pre('creator');
    var created = onto.pre('created');
		var orig = onto.pre('orig');
    $scope.json[creator]['@id'] = user.id();
    $scope.json[created] = ( new TimeStamp ).xsd();
		$scope.json[src]['@id'] = $scope.progress.src.replace(' ', "%20");
		$scope.json[orig] = $scope.progress.orig;
  }
	
	
}]);