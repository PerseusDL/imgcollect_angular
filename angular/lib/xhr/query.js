app.service( 'query', [
'sparql',
'config',
'onto',
function( sparql, config, onto ) {
	
	// Public methods
	
	var json = {
		array: [ '?urn', 'belongsTo', 'upload'],
		order_by: '?time',
		limit: 10,
		offset: 0
	}
	
	return {
		items: items,
		get: get
	}
	
	function items(){
		return 'items'
	}
	
	function get(){
		return 'get'
	}
	
	/*
	
	 SELECT ?urn ?label ?desc ?time ?rep ?user ?thumb
	 WHERE {    
	 		?urn <http://purl.org/dc/terms/type> 'upload' .
			OPTIONAL { ?res cite:belongsTo ?urn .
								 ?res dct:references ?thumb }
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
	
	
	
}]);