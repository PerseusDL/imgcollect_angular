app.service( 'query', [
'sparql',
'config',
'onto',
'results',
function( sparql, config, onto, results ) {
	
	
	// Public methods
	
	return {
		get: get,
		count: count,
		build: query
	}
	
	
	// Get count
	// Ignores offset, limit, and order by
	
	function count( json ){
		var b = construct( json );
		var q = onto.prefix_array();
		q = q.concat([ 
			'SELECT count( distinct ?urn )',
			'WHERE {',
		]);
		q = q.concat( b.where );
		q = q.concat([
			'}'
		]);
		return sparql.search( q.join("\n") ).then( 
		function( data ){
			return data[0]['.1']['value'];
		});
	}
	
	
	// Get the triples
	
	function get( json ){
    return sparql.search( query( json )  ).then(
    function( data ){
      return results.list( data );
    });
	}
	
	
	// Build the WHERE clause
	
	function get_where( json ){
		var where = [];
		for ( var i=0; i<json.where.length; i++ ){
			
			var tri = json.where[i];
			if ( tri == null ) continue;
			
			
			// Get options
			
			var opt = {};
			var last = tri[tri.length-1];
			if ( last instanceof Object ){
				opt = last;
			}
			
			// Create optional clauses
			
			if ( "optional" in opt ){
				if ( Array.isArray( tri[0] ) ){
					var sub = [];
					for ( var j=0; j<tri.length-1; j++ ){
						sub.push( line( tri[j] ) );
					}
					where.push( "OPTIONAL { " );
					where = where.concat( sub );
					where.push( "}" );
				}
				else {
					where.push( "OPTIONAL { "+ line( tri ) +" }" );
				}
			}
			else {
				where.push( line( tri ) );
			}
			
			// Build a filter
			
			if ( "filter" in opt ){
				where.push( "FILTER ( "+ opt.filter +" )" );
			}
			
		}
		return where;
	}
	
	
	// Construct the main body of the query
	
	function construct( json ){
		var where = get_where( json );		
		var handles = {};
		handles = get_handles( json.where, handles );
		var sel = [];
		for ( var key in handles ){
			sel.push( key );
		}
		return { where: where, selectors: sel }
	}
	
	
	// Build the query
	
	function query( json ){
		
		// Construct the main body of the query
		
		var b = construct( json );
		
		var q = onto.prefix_array();
		q = q.concat([ 
			'SELECT '+b.selectors.join(' '),
			'WHERE {',
		]);
		q = q.concat( b.where );
		q = q.concat([
			'}'
		]);
		
		// order by clause
		
		if ( 'order_by' in json ){
			q = q.concat([
				'ORDER BY '+json.order_by
			]);
		}
			
		// limit clause
		
		if ( 'limit' in json ){
			q = q.concat([
				'LIMIT '+json.limit
			]);
		}
		
		// offset clause
		
		if ( 'offset' in json ){
			q = q.concat([
				'OFFSET '+json.offset
			]);
		}
		
		// Return the query
		
		return q.join("\n");
	}
	
	
	// Get the SPARQL handles from WHERE
	
	function get_handles( search, handles ){
		for ( var i=0; i<search.length; i++ ){
			var tri = search[i];
			if ( tri == null ) continue;
			
			if ( Array.isArray( tri[0] ) ){
				get_handles( tri, handles )
			}
			
			var n = [0,2]
			for ( var j in n ){
				var index = n[j];
				if ( typeof tri[ index ] == "string" &&
						 tri[ index ].indexOf("?") == 0 ){
					handles[ tri[ index ] ] = 1;
				}
			}
		}
		return handles
	}
	
	
	// Build a triple line
	
	function line( tri ){
		var sub = tri[0];
		var obj = tri[2];
		return sub+" "+onto.pre( tri[1] )+" "+obj+" .";
	}
	
}]);
/*

// Test

var t = tserv('query');
t.query();


// Samples

var json = {
	where: [
		[ '?urn', 'type', 'upload' ],
		[ '?urn', 'label', '?label', { filter:'regex( ?label, "space", "i" )' } ],
		[
			[ '?res', 'memberOf', '?urn'],
			[ '?res', 'src', '?thumb' ],
			{ optional:true }
		],
		[ '?urn', 'description', '?desc', { optional:true } ],
		[ '?urn', 'created', '?time', { optional:true } ],
		[ '?urn', 'represents', '?rep', { optional:true } ],
		[ '?urn', 'creator', '?user', { optional:true } ],
	],
	order_by: 'desc( ?time )',
	limit: 10,
	offset: 0
}  

*/