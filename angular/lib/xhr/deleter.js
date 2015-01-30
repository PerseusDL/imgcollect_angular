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
		related: related,
		del: del,
		ref: ref
	});
	
	
	// Delete by URN
	
	function urn( urn ){
		path( urn )
	}
	
	
	// Add a log_item
	
	function log_item( urn, data ){
		log[ log.length-1 ] = {};
		log[ log.length-1 ][ urn ] = data;
	}
	
	
	// Get the the path to the JSON files
	
	function path( urn ){
		json.urn( urn )
		.then( function( data ){
			var path = data.src[0];
			src( path, urn )
		});
	}
	
	
	// Delete the JSON file
	
	function del( path, urn ){
		json.del( path ).then(
		function( data ){
			log_item( urn, data );
		});
	}
	
	
	// Get related URNs
	
	function related( src_urn ){
		
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
	
	
	// Remove references
	
	function ref( src_urn, prefix, rm_urn ){
		json.urn( src_urn )
		.then( function( data ){
			rm( src_urn, prefix, rm_urn, data.src[0] );
		});
	}
	
	function rm( src_urn, prefix, rm_urn, url ){
		json.get( url )
		.then( function( data ){
			console.log( data[ prefix ] );
			console.log( typeof data[ prefix ] );
		});
	}
	
	
	// Geth the JSON src file
	
	function src( path ){
		json.get( path )
		.then( function( data ){
			var type = data[ onto.with_prefix('type') ];
			
			// Sometimes many files need deleting
			// or modification
			
			switch( type ){
				case 'upload':
					console.log( 'delete upload' );
					break;
				case 'item':
					console.log( 'delete item' );
					break;
				case 'collection':
					console.log( 'collection item' );
					break;
			}
			
			// Delete the initial JSON src file
			
			del( path, urn );
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