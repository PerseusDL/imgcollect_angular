app.service( 'json', ['$http', '$q', 'config', 'user', function( $http, $q, config, user ) {
	
	// output
	
	this.msg = ">>";
	var events = [];
	function on_change( event ){ events.push( event ) }
	function run_events() {
		angular.forEach( events, function( event ){
			event( this.msg );
		});
	}
	
	// Avoid typos with constants
	
	var GET = 'GET';
	var POST = 'POST';
	var PUT = 'PUT';
	
	// Publicly accessible methods
	
	return ({
		post: post,
		put: put,
		get: get,
		ls: ls,
		urn: urn,
		disp: disp,
		msg: this.msg,
		on_change: on_change
	});
	
	// Retrieve a JSON file by URN
	
	function urn( urn ){
		var request = api( GET, config.xhr.json.url+'/src?urn='+urn );
		return( request.then( 
			success, 
			error 
		));
	}
	
	
	// Turn JSON into pretty-printed string
	
	function disp( data ) {
		var json = {};
		var out = [];
		for ( var key in data ){
			if ( key == '@context' ){ 
				out[0] = angular.toJson( data[key], true );
				continue;
			}
			json[key] = data[key];
		}
		out[1] = angular.toJson( json, true );
		return out;
	}
	
	
	// Create a new JSON file if it doesn't already exist.
	
	function post( url, data ){
		var request = api( POST, rel(url), data );
		return( request.then(
			success, 
			function( r ){ return put( rel(url), data ) } 
		));
	}
	
	
	// Update data on server
	
	function put( url, data ){
		var request = api( PUT, rel(url), data );
		return( request.then( 
			success, 
			error 
		));
	}
	
	
	// GET the JSON
	
	function get( url ){
		var request = api( GET, rel(url) );
		return( request.then( 
			success, 
			error 
		));
	}
	
	
	// Run the ls command
	
	function ls( url ){
		var request = api( GET, rel(url)+"?cmd=ls" );
		return( request.then(
			success,
			error
		));
	}
	
	
	// Add 'user' field potentially.
	// Others in the future.
	
	function tack_on( data ){
		if ( tack('user') ){
			data['user'] = { '@id': user.url() }
		}
		return data;
	}
	
	function tack( key ){
		var tacks = config.xhr.json.tack_on;
		if ( tacks.indexOf( key ) == -1 ){
			return false;
		}
		return true;
	}
	
	
	// API
	
	function api( method, url, data ){
		
		// tack on standard data fields
		
		if ( data != undefined ){
			data = tack_on( data );
		}
		
		return $http({
			method: method.toUpperCase(),
			url: url,
		    headers: {
		        'Content-Type': 'application/json'
		    },
			data: wrap( data )
		});
	}
	
	
	// Properly resolve relative URLs
	
	function rel( url ){
		if ( url.indexOf('http://') == 0 ){
			return url;
		}
		return config.xhr.json.url+'/data/'+url;
	}
	
	
	// JackSON formatted json
	
	function wrap( json ){
		return { data: json }
	}
	
	
	// Error handler
	
	function error( r ){
		this.msg = angular.fromJson( r.data );
		run_events();
		if (
			! angular.isObject( r.data ) ||
			! r.data.error
		){
			var unknown = "An unknown error occurred."
			return( $q.reject( unknown ) );
		}
		return( r.data );
	}
	
	
	// Success handler
	
	function success( r ){
		this.msg = angular.fromJson( r.data );
		run_events();
		return( r.data );
	}
}]);