app.service( 'host', function( $http, $q ) {
	// Publicly accessible methods
	return({
		url: location.protocol+'//'+location.hostname+( location.port ? ':' + location.port : '' )
	});	
});