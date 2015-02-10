app.service( 'onto', [ 
'config',
function( config ) {
  var self = this;  

  function precheck( a_term ){
    return angular.isDefined( config.ontology[a_term] );
  } 
	
	
	// Get the prefix form from a url
	
	this.short = function( url ){
    for ( var key in config.ontology ) {
			var item = config.ontology[ key ];
			var verb = item['ns']+item['term'];
			if ( url == verb ) {
				return item['prefix']+":"+item['term'];
			}
    }
		return url
	}
	
	
	// Get ontology term with a prefix

  this.with_prefix = function( a_term ){
    if ( precheck( a_term ) ){
      return config.ontology[a_term].prefix + ":" + config.ontology[a_term].term;
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }

	
	// Get the ontology term with a name space
	
  this.with_ns = function( a_term ){
    if ( precheck( a_term ) ){
      return config.ontology[a_term].ns + config.ontology[a_term].term;
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }

  this.default_value = function( a_term ){
    if ( precheck( a_term ) ){
		  
      // TODO we should allow the config to specify the type as well
		  
      return config.ontology[a_term].default_value || "";
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }
	
	
	// Build all the prefixes

  this.prefixes = function() {
    var pfx_query = "";
    var seen = {};
	  
    angular.forEach( 
		Object.keys( config.ontology ), 
		function( term, i ) {
		  if ( ! seen[ config.ontology[term].prefix ] ){
			  pfx_query = pfx_query + " PREFIX " + config.ontology[term].prefix + ": <" + config.ontology[term].ns + ">";
		  }
		  seen[ config.ontology[term].prefix ] = 1;
    });
		  
    // backwards compatibility
		  
    pfx_query = pfx_query + " PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
    return pfx_query;
  }
	
	
	// Build the prefix as an array
	
	this.prefix_array = function(){
		var arr = [];
		var seen = {};
    for ( var key in config.ontology ) {
			var item = config.ontology[ key ];
			if ( ! seen[ item.prefix ] ){
				arr.push( "PREFIX " + item.prefix + ": <" + item.ns + ">" );
				seen[ item.prefix ] = 1;
			}
    }
		return arr;
	}
  
}]);
