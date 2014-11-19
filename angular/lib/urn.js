app.service( 'urn', function( sparql ) {
	return ({
		check: check,
		fresh: fresh
	})
	
	function query( urn ) {
	return "\
	SELECT count( distinct ?o )\
	WHERE { <"+urn+"> ?p ?o }"
	}
	
	function check( urn, callback ) {
		return sparql.search( query(urn) ).then(
		function( data ){
			var check = data[0]['.1']['value'];
			// urn already exists
			if ( check > 0 ) {
				callback( false );
				return;
			}
			callback( true );
			return;
		});
	}
	
	function fresh( urn ) {
		
	}
});
