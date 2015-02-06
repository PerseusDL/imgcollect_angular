app.service( 'sparql', [
'$http', 
'$q',
'config', 
function( $http, $q, config ) {
	
	this.query = "";
	
	
	// Service states
	
	function state(){
		return {
			wait: 'WAIT',
			success: 'SUCCESS',
			error: 'ERROR'
		}
	};
	
	
	// Run events on success
	
	var events = [];
	function on_change( event ){ events.push( event ) }
	function run_events(){
		angular.forEach( events, function( event ){
			event( 'whoa', this.query );
		});
	}
	
	
	// SPARQL search
	
	function search( search ) {
		var request = get( search );
		return( request.then( 
			success,
			error
		));
	}
	
	function success( r ){
		run_events()
		return r.data.results.bindings
	}
	
	function error( r ){
		run_events()
		return r
	}
	
	
	// JackSON wrapper
	
	function get( search ) {
		this.query = search.smoosh();
	  var url = config.xhr.sparql.url+'?query='+encodeURIComponent( search )+"&output=json";
		return $http({
			method: 'GET',
			url: url,
		    headers: {
		        'Content-Type': 'application/json'
		    }
		});
	}
	
	
	// Publicly accessible methods
	
	return ({
		search: search,
		on_change: on_change
	});
}]);