app.service( 'json', [
'$http',
'$q',
'config',
'user',
function( $http, $q, config, user ) {
	
	
	// output
	
	this.msg = "";
	this.method = "";
	this.status = "";
	this.url = "";
	
	function state(){
		return {
			wait: 'WAIT',
			success: 'SUCCESS',
			error: 'ERROR'
		}
	};
	
	var events = [];
	function on_change( event ){ events.push( event ) }
	function run_events(){
		angular.forEach( events, function( event ){
			event( this.method, this.url, this.status, this.msg );
		});
	}
	
	
	// Avoid typos with constants
	
	var GET = 'GET';
	var POST = 'POST';
	var PUT = 'PUT';
	var DELETE = 'DELETE';
	
	
	// Publicly accessible methods
	
	return ({
		post: post,
		put: put,
		get: get,
		delete: del,
		del: del,
		ls: ls,
		urn: urn,
		disp: disp,
		on_change: on_change,
		msg: this.msg,
		method: this.method,
		status: this.status,
		state: state,
		url: this.url
	});
	
	
	// Retrieve a JSON file path by URN
	
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
	
	
	// DELETE the JSON
	
	function del( url ){
		var request = api( DELETE, rel(url) );
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
		if ( tacks == undefined || tacks.indexOf( key ) == -1 ){
			return false;
		}
		return true;
	}
	
	
	// API
	
	function api( method, url, data ){
		
		// tack on standard data fields
		this.method = method;
		this.url = url;
		this.status = state().wait;
		run_events();
		
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
		this.status = state().error;
		this.msg = angular.toJson( r.data, true );
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
		this.status = state().success;
		this.msg = angular.toJson( r.data, true );
		run_events();
		return( r.data );
	}
}]);