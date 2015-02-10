app.service( 'query', [
'sparql',
'config',
'onto',
function( sparql, config, onto ) {
	
	// Public methods
	
	var json = {
		where: [
			[ '?urn', 'type', 'upload' ],
			[ '?urn', 'label', '?label', { filter:'regex( ?label, "g", "i" )' } ],
			[
				[ '?res', 'memberOf', '?urn'],
				[ '?res', 'src', '?thumb' ],
				{ optional:true }
			],
			[ '?urn', 'label', '?label', { optional:true } ],
			[ '?urn', 'description', '?desc', { optional:true } ],
			[ '?urn', 'created', '?time', { optional:true } ],
			[ '?urn', 'represents', '?rep', { optional:true } ],
			[ '?urn', 'creator', '?user', { optional:true } ],
		],
		order_by: 'desc( ?time )',
		limit: 10,
		offset: 0
	}
	
	return {
		items: items,
		get: get,
		count: count,
		query: query
	}
	
	function items(){
		return 'items'
	}
	
	function count(){}
	
	function get(){
		return 'get'
	}
	
	// Build the query
	
	function query(){
		
		// Build the WHERE clause
		
		var where = [];
		for ( var i=0; i<json.where.length; i++ ){
			var tri = json.where[i];
			var opt = {};
			
			var last = tri[tri.length-1];
			if ( last instanceof Object ){
				opt = last;
			}
				
			if ( "optional" in opt ){
				if ( Array.isArray( tri[0] ) ){
					var sub = [];
					for ( var i=0; i<tri.length-1; i++ ){
						sub.push( line( tri[i] ) );
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
			
			if ( "filter" in opt ){
				where.push( "FILTER ( "+ opt.filter +" )" );
			}
		}
		
		
		// Get the handles
		
		var handles = {};
		handles = get_handles( json.where, handles );
		var sel = [];
		for ( var key in handles ){
			sel.push( key );
		}
		
		// Build the SPARQL query
		
		var q = onto.prefix_array();
		q = q.concat([ 
			'SELECT '+sel.join(' '),
			'WHERE {',
		]);
		q = q.concat( where );
		q = q.concat([
			'}'
		]);
		console.log( q.join("\n") );
	}
	
	
	// Get the SPARQL handles from WHERE
	
	function get_handles( search, handles ){
		for ( var i=0; i<search.length; i++ ){
			var tri = search[i];
			
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
		sub = ( sub.indexOf("?") == 0 ) ? sub : '"'+sub+'"';
		obj = ( obj.indexOf("?") == 0 ) ? obj : '"'+obj+'"'
		return sub+" "+onto.with_prefix( tri[1] )+" "+obj+" .";
	}
	
}]);

/*

	var t = tserv('query');
	t.query();

	PREFIX citex: <http://data.perseus.org/rdfvocab/cite/> 
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
	PREFIX dct: <http://purl.org/dc/terms/> 
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#> 
	PREFIX cite: <http://www.homermultitext.org/cite/rdf/> 
	PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/> 
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>  
	SELECT ?urn ?label ?desc ?time ?rep ?user ?thumb  
	WHERE {    
		?urn <http://purl.org/dc/terms/type> 'upload' .
		?urn rdf:label ?label .
		FILTER ( regex( ?label, "g", "i" ) ) 
		OPTIONAL { ?res cite:belongsTo ?urn . }
		OPTIONAL { ?res dct:references ?thumb . }
		OPTIONAL { ?urn rdf:label ?label . }
		OPTIONAL { ?urn rdf:description ?desc . }
		OPTIONAL { ?urn dct:created ?time . }
		OPTIONAL { ?urn crm:P138_represents ?rep . }
		OPTIONAL { ?urn <http://purl.org/dc/terms/creator> ?user . }  
	}  
	ORDER BY DESC( ?time )  
	LIMIT 10  
	OFFSET 0 

*/