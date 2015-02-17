app.service( 'deleter', [
'json',
'onto',
'user',
'sparql',
function( json, onto, user, sparql ) {
	
	// Delete log 
	// [ { urn: server_output } ... ]
	
	var log = [{}];
	
	return ({
		urn: urn,
		log: log,
		refs: refs
	});
	
	
	// Delete by URN
	
	function urn( urn ){
		return path( urn );
	}
	
	
	// Add a log_item
	
	function log_item( urn, data ){
		log[ log.length-1 ] = {};
		log[ log.length-1 ][ urn ] = data;
	}
	
	
	// Get the the path to the JSON files
	
	function path( urn ){
		return json.urn( urn )
		.then( function( data ){
			var path = data.src[0];
			return src( path, urn )
		});
	}
	
	
	// Delete the JSON file
	
	function del( path, urn ){
		return json.del( path ).then(
		function( data ){
			log_item( urn, data );
		});
	}
	
	
	// Get related URNs
	
	function refs( src_urn ){
		
		var query = [
		onto.prefixes(),
		"SELECT ?urn ?verb",
		"WHERE {",
			"?urn ?verb <"+src_urn+">", 
		"}" ];
		
		var output = [];
		return sparql.search( query.join(' ') ).then(
		function( data ){
			for ( var i=0; i<data.length; i++ ) {
				var urn = data[i].urn.value;
				var verb = data[i].verb.value;
				if ( urn == src_urn ){ continue }
				output.push({ urn: urn, verb: onto.short( verb ) });
			}
			return output;
		});
	}
	
	
	// Remove reference
	
	function ghost( src_urn, prefix, rm_urn ){
		json.urn( src_urn )
		.then( function( data ){
			ghost_json( src_urn, prefix, rm_urn, data.src[0] );
		});
	}
	
	
	// So far all URN references use '@id'.
	// This may not be true.
	// It would be better to walk the JSON
	
	function ghost_json( src_urn, prefix, rm_urn, url ){
		json.get( url )
		.then( function( data ){
			var item = data[ prefix ];
			if( item['@id'] == rm_urn ){
				item['@id'] = '';
			}
			json.put( url, data )
		});
	}
	
	
	// Geth the JSON src file
	
	function src( path ){
		return json.get( path )
		.then( function( data ){
			
			// TODO: Check the user...
			
			// Delete the initial JSON src file
			return del( path, urn );
		});
	}
	
}]);

/*

Getting the deleter service working well.

It's probably impossible to have a totally generic deleter service.
I'd have to look at types.

Move data in and out for testing...

rm -rf /var/www/JackSON/data/*
cp -R ~/Desktop/JackSON.data.bkup/* /var/www/JackSON/data/

t = tserv('deleter');

*/