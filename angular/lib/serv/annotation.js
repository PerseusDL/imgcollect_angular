app.service( 'annotation', ['sparql', function( sparql ){
	return({
		by_item:by_item
	})
	
	function prefix() {
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
	PREFIX cite: <http://www.homermultitext.org/cite/rdf/>";
	}
	
	function query( where ) {
	return "\
	"+prefix()+"\
	SELECT ?urn\
	WHERE {\
		?urn this:type 'annotation'.\
		"+where+"\
	}"
	}
	
	function item_query( urn ){
		return query( "?urn cite:belongsTo <"+urn+">" );
	}
	
	function by_item( urn ) {
		return sparql.search( item_query( urn ) ).then(
		function( data ){
			return results( data );
		});
	}
	
	
	// Process results
	
	function results( data ){
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