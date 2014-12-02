app.service( 'item', ['sparql', function( sparql ) {
	return({
		by_upload:by_upload,
		by_collection:by_collection
	})
	
	function prefix() {
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
	PREFIX cite: <http://www.homermultitext.org/cite/rdf/>";
	}
	
	function query( where ){
	return "\
	"+prefix()+"\
	SELECT ?urn\
	WHERE {\
		?urn this:type 'item'.\
		"+where+"\
	}"
	}
	
	
	// Retrieve items associated with an upload
	
	function by_upload( urn ){
		return sparql.search( upload_query(urn) ).then( 
		function( data ){
			return results( data );
		});
	}

	function upload_query( urn ){
	return query( "?urn this:upload <"+urn+">" );
	}
	
	
	// Retrieve items associated with a collection
	
	function by_collection( urn ){
		return sparql.search( collection_query(urn) ).then(
		function( data ){
			return results( data );
		});
	}
	
	function collection_query( urn ){
		return query( "?urn cite:belongsTo <"+urn+">" );		
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