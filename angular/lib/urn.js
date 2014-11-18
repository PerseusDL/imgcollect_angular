app.service( 'urn', function( sparql ) {
	return ({
		fresh: fresh
	})
	
	function query( urn ) {
	return "\
	SELECT count( distinct ?o )\
	WHERE { <"+urn+"> ?p ?o }"
	}
	
	function fresh( urn, callback ) {
		return sparql.search( query(urn) ).then(
		function( data ){
			var check = data[0]['.1']['value'];
			if ( check > 0 ) {
				// urn already exists
				// therefore it is not fresh!
				callback( false );
				return;
			}
			callback( true );
			return;
		});
	}
});
