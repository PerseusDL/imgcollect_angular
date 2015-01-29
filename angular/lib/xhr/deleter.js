app.service( 'deleter', [
'json',
function( json ) {
	
	this.log = {};
	
	return ({
		urn: urn,
		log: this.log
	});
	
	
	// Delete by URN
	
	function urn( urn ){
		path( urn )
	}
	
	// Get the the path to the JSON files
	
	function path( urn ){
		json.urn( urn ).then(
		function( data ){
			var path = data.src[0];
			// src( path )
			del( path );
		});
	}
	
	function del( path ){
		json.del( path ).then(
		function( data ){
			console.log( data );
		});
	}
	
	function src( path ){
		json.get( path ).then(
		function( data ){
			console.log( data );
		});
	}
	
}]);