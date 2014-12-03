app.service( 'collection', ['sparql', function( sparql ) {
	return({
		get:get,
		search:search
	})
	
	function prefix(){
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
	}
	
	
	// Get all collections
	
	function get(){
		return sparql.search( get_query() ).then( 
		function( data ){
			return process( data );
		});
	}
	
	function get_query(){
	return "\
	"+prefix()+"\
	SELECT ?urn\
	WHERE {\
		?urn this:type 'collection'\
	}"
	}
	
	
	// Search for a specific collection
	
	function search( str ){
		return sparql.search( search_query( str ) ).then( 
		function( data ){
			return process( data );
		});
	}
	
	function search_query( str ){
	return "\
	"+prefix()+"\
	SELECT ?urn\
	WHERE {\
		?urn this:type 'collection'\
		FILTER regex( str(?urn), \""+str+"\" )\
	}"
	}
	
	function process( data ){
		var out = []
		for ( var i=0; i<data.length; i++ ){
			var item = {}
			for ( var key in data[i] ){
				item[key] = data[i][key].value;
			}
			out.push( item );
		}
		return out;
	}
}]);