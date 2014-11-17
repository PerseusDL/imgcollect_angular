app.service( 'json', function( $http, $q ) {
	
	// Publicly accessible methods
	return ({
		post: post,
		put: put,
		get: get,
		ls: ls,
		urn: urn
	});
	
	function host(){
		return location.protocol+'//'+location.hostname+(location.port ? ':' + location.port: '' );
	}
	
	// Retrieve a JSON file by URN
	function urn( urn ){
		var request = api( 'GET', host()+'/src?urn='+urn );
		return( request.then( 
			success, 
			error 
		));
	}
	
	// Create a new JSON file if it doesn't already exist.
	function post( url, data ){
		var request = api( 'POST', rel(url), data );
		return( request.then(
			success, 
			function( r ){ return put( rel(url), data ) } 
		));
	}
	
	// Update data on server
	function put( url, data ){
		var request = api( 'PUT', rel(url), data );
		return( request.then( 
			success, 
			error 
		));
	}
	
	// GET the JSON
	function get( url ){
		var request = api( 'GET', rel(url) );
		return( request.then( 
			success, 
			error 
		));
	}
	
	// Run the ls command
	function ls( url ){
		var request = api( 'GET', rel(url)+"?cmd=ls" );
		return( request.then(
			success,
			error
		));
	}
	
	// API
	function api( method, url, data ){
		return $http({
			method: method.toUpperCase(),
			url: url,
		    headers: {
		        'Content-Type': 'application/json'
		    },
			data: wrap( data )
		});
	}
	
	function rel( url ){
		if ( url.indexOf('http://') == 0 ){
			return url;
		}
		return host()+'/data/'+url;
	}
	
	// JackSON formatted json
	function wrap( json ){
		return { data: json }
	}
	
	// Error handler
	function error( r ){
		if (
			! angular.isObject( r.data ) ||
			! r.data.error
		) {
			var unknown = "An unknown error occurred."
			return( $q.reject( unknown ) );
		}
		return( r.data );
	}

	// Success handler	
	function success( r ){
		return( r.data );
	}
});
