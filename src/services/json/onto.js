app.service( 'onto', [ 
'onto_config',
function( onto_config ) {
	
	return({
		short: short,
		with_prefix: with_prefix,
		prefix: with_prefix,
		pre: with_prefix,
		with_ns: with_ns,
		default_value: default_value,
		prefixes: prefixes,
		prefix_array: prefix_array
	});


	// precheck

  function precheck( a_term ){
    return angular.isDefined( onto_config[a_term] );
  } 
	
	
	// Get the prefix form from a url
	
	function short( url ){
    for ( var key in onto_config ) {
			var item = onto_config[ key ];
			var verb = item['ns']+item['term'];
			if ( url == verb ) {
				return item['prefix']+":"+item['term'];
			}
    }
		return url
	}
	
	
	// Get ontology term with a prefix

	function with_prefix( a_term ){
    if ( precheck( a_term ) ){
      return onto_config[a_term].prefix + ":" + onto_config[a_term].term;
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }

	
	// Get the ontology term with a name space
	
	function with_ns( a_term ){
    if ( precheck( a_term ) ){
      return onto_config[a_term].ns + onto_config[a_term].term;
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }


	function default_value( a_term ){
    if ( precheck( a_term ) ){
		  
      // TODO we should allow the onto_config to specify the type as well
		  
      return onto_config[a_term].default_value || "";
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }
	
	
	// Build all the prefixes

  function prefixes() {
    var pfx_query = "";
    var seen = {};
	  
    angular.forEach( 
		Object.keys( onto_config ), 
		function( term, i ) {
		  if ( ! seen[ onto_config[term].prefix ] ){
			  pfx_query = pfx_query + " PREFIX " + onto_config[term].prefix + ": <" + onto_config[term].ns + ">";
		  }
		  seen[ onto_config[term].prefix ] = 1;
    });
		  
    // backwards compatibility
		  
    pfx_query = pfx_query + " PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
    return pfx_query;
  }
	
	
	// Build the prefix as an array
	
	function prefix_array(){
		var arr = [];
		var seen = {};
    for ( var key in onto_config ) {
			var item = onto_config[ key ];
			if ( ! seen[ item.prefix ] ){
				arr.push( "PREFIX " + item.prefix + ": <" + item.ns + ">" );
				seen[ item.prefix ] = 1;
			}
    }
		return arr;
	}
  
}]);
