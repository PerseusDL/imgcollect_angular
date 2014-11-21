app.service( 'stdout', [ function() {
	
	this.msg = ">>\n";
	
	// Write output message
	
	function log( str ) {
		if ( typeof str == 'object' ){
			str = angular.toJson( str, true );
		}
		this.msg += str+"\n";
	}
	
	return ({
		log: log,
		msg: this.msg
	})
}]);