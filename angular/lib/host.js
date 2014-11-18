app.service( 'host', function() {
	// Publicly accessible methods
	return({
		url: location.protocol+'//'+location.hostname+( location.port ? ':' + location.port : '' )
	});	
});