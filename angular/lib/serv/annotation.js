app.service( 'annotation', [ 'sparql', 'results', function( sparql, results ){
	
	return({
		by_item:by_item,
		by_item_more:by_item_more,
		upload_src:upload_src
	});
	
	var config = {}
	
	function prefix(){
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
	PREFIX cite: <http://www.homermultitext.org/cite/rdf/>\
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
	PREFIX user: <http://data.perseus.org/sosol/users/>";
	}
	
	
	function query( where ){
	return "\
	"+prefix()+"\
	SELECT ?urn ?p ?o\
	WHERE {\
		?urn this:type 'annotation'.\
		"+where+"\
	}"
	}
	
	// Retrieve list of annotations related to item
	
	function by_item( urn ){
		return sparql.search( item_query( urn ) ).then(
		function( data ){
			return results.list( data );
		});
	}
	
	function item_query( urn ){
		return query( "?urn cite:belongsTo <"+urn+">" );
	}
	
	// Retrieve more annotation data
	
	function by_item_more( urn ){
		return sparql.search( more_query( urn ) ).then(
		function( data ){
			return results.more( data );
		});
	}
	
	function more_query( urn ){
		var where = "?urn cite:belongsTo <"+urn+">.\
				     ?urn ?p ?o";
		return query( where );
	}
	
	// Find upload_src
	
	function upload_src( urn ){
		return sparql.search( upload_src_query( urn ) ).then(
		function( data ){
			return results.list( data );
		});
	}
	
	function upload_src_query( urn ){
	return "\
	"+prefix()+"\
	SELECT ?src\
	WHERE {\
		<"+urn+"> cite:belongsTo ?item .\
		?item this:upload ?upl .\
		?upl this:src ?src\
	}"
	}
}]);