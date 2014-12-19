app.service( 'urnServ', ['sparql', 'json', 'host', 'config', function( sparql, json, host, config ) {
	
	return ({
		uniq: uniq,
		fresh: fresh,
		claim: claim,
		base: config.serv.urn_serv.base
	})
	
	function query( urn ) {
	return "\
	SELECT count( distinct ?o )\
	WHERE { <"+urn+"> ?p ?o }"
	}
	
	function uniq( urn, callback ) {
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
	
	
	// Grab a fresh URN with an 11 digit id
	
	function fresh( templ, callback ) {
		var urn = templ.replace( '{{ id }}', id( 11,'#aA') );
		return uniq( urn, function( bool, urn ){
			( bool == true ) ? callback( urn ) : fresh( templ, callback )
		})
	}
	
	
	// Generate an id
	
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
	
	
	// Claim a URN and JackSON data location
	
	function claim( url, urn ) {
		var base = {
			'@context': {
				"urn": "http://data.perseus.org/collections/urn:"
			},
			"@id": urn
		}
		return json.post( url, base );
	}
	
}]);