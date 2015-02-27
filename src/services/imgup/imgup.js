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
		crop: crop,
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
	
	function resize( src, width, height, send_to, json ){
		var body = { 
			src: src,
			max_width: width,
			max_height: height,
			send_to: send_to,
			json: json
		};
		
		return $http({
			method: 'POST',
			url: config.imgup.url+'/resize',
		  headers: { 
				'Content-Type': 'application/json'
			},
			data: body
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
	
	
	// Crop an image
	
	function crop( src, x, y, width, height, send_to, json ){
		var body = {
			src: src,
			x: x,
			y: y,
			width: width,
			height: height,
			send_to: send_to,
			json: json
		};
		
		return $http({
			method: 'POST',
			url: config.imgup.url+'/crop',
		  headers: { 
				'Content-Type': 'application/json'
			},
			data: body
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