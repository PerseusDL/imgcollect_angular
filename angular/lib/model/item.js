app.service( 'item', ['sparql', 'results', 'onto', function( sparql, results, onto ) {
	return({
		by_upload:by_upload,
		by_collection:by_collection
	})
	
	function prefix() {
	  return onto.prefixes();
	}
	
	function query( where ){
	return "\
	"+prefix()+"\
	SELECT ?urn\
	WHERE {\
		?urn " + onto.with_prefix('type') +" 'item'.\
		"+where+"\
	}"
	}
	
	
	// Retrieve items associated with an upload
	
	function by_upload( urn ){
		return sparql.search( upload_query(urn) ).then( 
		function( data ){
			return results.list( data );
		});
	}

	function upload_query( urn ){
	return query( "?urn " + onto.with_prefix('src') + " <"+urn+">" );
	}
	
	
	// Retrieve items associated with a collection
	
	function by_collection( urn ){
		return sparql.search( collection_query(urn) ).then(
		function( data ){
			return results.list( data );
		});
	}
	
	function collection_query( urn ){
		return query( "?urn " + onto.with_prefix('memberOf') + " <"+urn+">" );		
	}
		
}]);
