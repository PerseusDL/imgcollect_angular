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
			[ '?res', 'memberOf', '?urn', { optional:true } ],
			[ '?res', 'src', '?thumb', { optional:true } ],
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
	
	function query(){
		
		// Build the WHERE clause
		
		var where = [];
		for ( var i=0; i<json.where.length; i++ ){
			var tri = json.where[i];
			var opt = {};
			
			if ( tri.length == 4 ){
				opt = tri[3];
			}
				
			if ( "optional" in opt ){
				where.push( "OPTIONAL { "+ line( tri ) +" }" );
			}
			else {
				where.push( line( tri ) );
			}
			
			if ( "filter" in opt ){
				where.push( "FILTER { "+ opt.filter +" }" );
			}
		}
		
		
		// Get the handles
		
		var handles = {};
		for ( var i=0; i<json.where.length; i++ ){
			var tri = json.where[i];
			( tri[0].indexOf("?") == 0 ) ? handles[ tri[0] ]=1 : null;
			( tri[2].indexOf("?") == 0 ) ? handles[ tri[2] ]=1 : null;
		}
		var sel = [];
		for ( var key in handles ){
			sel.push( key );
		}
		
		var q = 
		
		console.log( sel );
		console.log( where );
		
	}
	
	function line( tri ){
		return tri[0]+" "+onto.with_prefix( tri[1] )+" "+tri[2]+" .";
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