app.service( 'sparql', ['$http', '$q', 'host', function( $http, $q, host ) {

	// Publicly accessible methods
	
	return ({
		search: search
	});
	
	function url() {
		return host.url+'/query';
	}
	
	
	// SPARQL search
	
	function search( search ) {
		var request = get( search );
		return( request.then( 
			function( r ) { return r.data.results.bindings  },
			function( r ){ return r }
		));
	}
	
	
	// JackSON wrapper
	
	function get( search ) {
		var query = url()+'?query='+encodeURIComponent( search );
		return $http({
			method: 'GET',
			url: query,
		    headers: {
		        'Content-Type': 'application/json'
		    }
		});
	}
}]);