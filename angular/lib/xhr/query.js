app.service( 'query', [
'sparql',
'config',
'onto',
function( sparql, config, onto ) {
	
	// Public methods
	
	var json = {
		optionals: null,
		order_by: '?time',
		limit: 10,
		offset: 0
	}
	
	return {
		items: items,
		get: get,
		count: count
	}
	
	function items(){
		return 'items'
	}
	
	function get(){
		return 'get'
	}
	
}]);

/*

 	 "PREFIX citex: <http://data.perseus.org/rdfvocab/cite/>",
 	 "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>",
 	 "PREFIX dct: <http://purl.org/dc/terms/>",
 	 "PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>",
 	 "PREFIX cite: <http://www.homermultitext.org/cite/rdf/> ",
 	 "PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/> ",
 	 "PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>  ",
 	 "SELECT ?urn ?label ?desc ?time ?rep ?user ?thumb",
 	 "WHERE {",
 	 "		?urn <http://purl.org/dc/terms/type> 'upload' .",
 	 "		OPTIONAL { ?res cite:belongsTo ?urn .",
 	 "							 ?res dct:references ?thumb }",
 	 "	  OPTIONAL { ?urn rdf:label ?label . }",
 	 "   OPTIONAL { ?urn rdf:description ?desc . }",
 	 "   OPTIONAL { ?urn dct:created ?time . }",
 	 "   OPTIONAL { ?urn crm:P138_represents ?rep . }",
 	 "   OPTIONAL { ?urn <http://purl.org/dc/terms/creator> ?user . }  ",
 	 "}",
 	 "ORDER BY DESC( ?time ) ",
 	 "LIMIT 10",
 	 "OFFSET 0"


	 PREFIX citex: <http://data.perseus.org/rdfvocab/cite/> 
	 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
   PREFIX dct: <http://purl.org/dc/terms/> 
   PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#> 
   PREFIX cite: <http://www.homermultitext.org/cite/rdf/> 
   PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/> 
   PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>  
   SELECT ?urn ?label ?desc ?time ?rep ?user  
   WHERE {    
				?urn <http://purl.org/dc/terms/type> 'upload';
        OPTIONAL { ?urn rdf:label ?label . }
        OPTIONAL { ?urn rdf:description ?desc . }
        OPTIONAL { ?urn dct:created ?time . }
        OPTIONAL { ?urn crm:P138_represents ?rep . }
        OPTIONAL { ?urn <http://purl.org/dc/terms/creator> ?user . }  
   }  
   ORDER BY DESC( ?time )  
   LIMIT 10  
   OFFSET 0  


	 PREFIX citex: <http://data.perseus.org/rdfvocab/cite/> 
   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
   PREFIX dct: <http://purl.org/dc/terms/> 
   PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#> 
   PREFIX cite: <http://www.homermultitext.org/cite/rdf/> 
   PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/> 
   PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>  
   SELECT ?urn ?label ?desc ?time ?rep ?user  
   WHERE {    
				?urn <http://purl.org/dc/terms/type> 'upload'.
        ?urn <http://purl.org/dc/terms/creator> <http://data.perseus.org/sosol/users/adamt>;        
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