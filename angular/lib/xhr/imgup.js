app.service( 'imgup', [
'$http',
'$q',
'$upload',
'config',
'user',
function( $http, $q, $upload, config, user ) {
	
	// Output
	
	this.msg = "";
	
	return ({
		upload: upload,
		cp_url: cp_url,
		msg: this.msg
	});
	
	
	// Copy a URL path
	
	function cp_url( src, success, error ){
		$http({
		  method: 'POST',
		  url: config.imgup.url,
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  data: { src: src }
		})
		.error( function( r ){
			update_msg( r );
			error( r.data );
		})
		.success( function( r ){
			update_msg( r );
			success( r.data );
		})
	}
	
	
	// Upload a file to an imgup server
	
	function upload( file, success, error ){	
  	$upload.upload({
  		url: config.imgup.url, 
  		method: 'POST',
  		file: file
   	})
  	.error( function( r ){
			update_msg( r );
  		error( r.data );
   	})
  	.success( function( r ){
			update_msg( r );
  		success( r.data );
   	})
  }
	
	
	// Update message
	
	function update_msg( r ){
		this.msg = r.data;
	}
	
}]);