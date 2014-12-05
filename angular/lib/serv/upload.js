app.service( 'upload', ['sparql', function( sparql ){
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
			return results( data );
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