app.service( 'user', [ '$http', '$q', function( $http, $q ) {
	
	var data = null;
	var error = null;
	var ping = 'http://sosol.perseids.org/sosol/dmm_api/ping';
	var ping = 'conf/ping.js';
	var ns = 'USER-';
	
	
	// What gets made available?
	
	return({
		data: function(){ 
			return ( data != null ) ? data : null 
		},
		dir: function(){ 
			return ( data != null ) ? data.uri.dirname() : null 
		},
		id: function(){ 
			return ( data != null ) ? data.uri.basename() : null 
		},
		url: function(){ 
			return ( data != null ) ? data.uri : null 
		},
		events: {
			ok: ns+"OK"
		},
		error: function(){ return error },
		check: check,
		only: false
	});
	
	
	// Make sure user exists
	// see app.js/
	
	function check(){
		var def = $q.defer();
		
		// If you already have user data
		// don't request new user data
		
		if ( data != null ){
			def.resolve();
			return def.promise
		}
		
		// Ping Perseids to get user data
		
		$http.get( ping ).then( 
			function( res ){
				data = res.data.user;
				def.resolve();
			},
			function( err ){
				error = err;
				def.reject();
			}
		)
		return def.promise;
	}
}]);