app.service( 'sparql', function( $http, $q ) {

	// Publicly accessible methods
	return ({
		search: search
	});
	
	function query_url() {
		return location.protocol+'//'+location.hostname+(location.port ? ':' + location.port: '' )+'/query';
	}
	
	// Update data on server
	function search( search ) {
		var request = get( query_url(), search );
		return( request.then( 
			function( r ) { return r.data.results.bindings  },
			function( r ){ return r }
		));
	}
	
	// JackSON wrapper
	function get( url, search ) {
		var query = url+'?query='+encodeURIComponent( search );
		return $http({
			method: 'GET',
			url: query,
		    headers: {
		        'Content-Type': 'application/json'
		    }
		});
	}
});
