app.service( 'host', [ function() {
	
	return({
		url: location.protocol+'//'+location.hostname+( location.port ? ':' + location.port : '' )
	});
	
}]);