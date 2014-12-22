app.service( 'sparql', ['$http', '$q', 'config', function( $http, $q, config ) {

	// Publicly accessible methods
	
	return ({
		search: search
	});
	
	
	// SPARQL search
	
	function search( search ) {
		var request = get( search );
		return( request.then( 
			function( r ){ return r.data.results.bindings  },
			function( r ){ return r }
		));
	}
	
	
	// JackSON wrapper
	
	function get( search ) {
		
		var query = config.xhr.sparql.url+'?query='+encodeURIComponent( search );
		return $http({
			method: 'GET',
			url: query,
		    headers: {
		        'Content-Type': 'application/json'
		    }
		});
	}
}]);