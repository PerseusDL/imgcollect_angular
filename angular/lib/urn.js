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
				callback( false, urn );
				return;
			}
			callback( true, urn );
			return;
		});
	}
	
	// Grab a fresh urn with an 11 digit ID
	function fresh( templ, callback ) {
		var urn = templ.replace( '{{ id }}', id( 11,'#aA') );
		return check( urn, function( bool, urn ){
			( bool == true ) ? callback( urn ) : fresh( templ, callback )
		})
	}
	
	// Generate an ID
	function id( n, chars ) {
		var mask = '';
		if ( chars.indexOf('a') > -1 ) mask += 'abcdefghijklmnopqrstuvwxyz';
		if ( chars.indexOf('A') > -1 ) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		if ( chars.indexOf('#') > -1 ) mask += '0123456789';
		var out = '';
		while ( n > 0 ) {
			out += mask[ 
				Math.round( Math.random() * ( mask.length-1 ) ) 
			];
			n--;
		}
		return out
	}
});