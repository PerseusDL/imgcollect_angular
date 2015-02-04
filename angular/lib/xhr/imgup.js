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
		resize: resize,
		msg: this.msg
	});
	
	
	// Copy a URL path
	
	function cp_url( src, success, error ){
		return $http({
		  method: 'POST',
		  url: config.imgup.url+'/upload',
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  data: { src: src }
		})
		.error( function( r ){
			update_msg( r );
			return r.data;
		})
		.success( function( r ){
			update_msg( r );
			return r.data;
		})
	}
	
	
	// Resize an image
	
	function resize( src, width, height ){
		return $http({
			method: 'POST',
			url: config.imgup.url+'/resize',
		  headers: { 
				'Content-Type': 'application/json'
			},
			data: { 
				src: src,
				max_width: width,
				max_height: height
			}
		})
		.error( function( r ){
			update_msg( r );
			return r.data;
		})
		.success( function( r ){
			update_msg( r );
			return r.data;
		})
	}
	
	
	// Upload a file to an imgup server
	
	function upload( file, success, error ){	
  	return $upload.upload({
  		url: config.imgup.url+'/upload',
  		method: 'POST',
  		file: file
   	})
  	.error( function( r ){
			update_msg( r );
  		return r.data;
   	})
  	.success( function( r ){
			update_msg( r );
  		return r.data;
   	})
  }
	
	
	// Update message
	
	function update_msg( r ){
		this.msg = r.data;
	}
	
}]);