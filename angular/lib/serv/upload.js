app.service( 'upload', ['sparql', 'results', function( sparql, results ){
	return({
		by_annotation:by_annotation
	})
	
	function prefix() {
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
	PREFIX cite: <http://www.homermultitext.org/cite/rdf/>";
	}
	
	function by_annotation( urn ) {
		return sparql.search( annotation_query( urn ) ).then(
		function( data ){
			return results.list( data );
		});
	}
	
	function annotation_query( urn ) {
	return "\
	"+prefix()+"\
	SELECT ?urn\
	WHERE {\
		<"+urn+"> cite:belongsTo ?item .\
		?item this:upload ?urn\
	}"
	}
}]);