app.service( 'resize', ['sparql', function( sparql ) {
	return ({
		in_upload: in_upload
	})
	
	function prefix() {
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
	PREFIX xml: <http://www.w3.org/TR/xmlschema11-2/#>";
	}
	
	function query( urn ) {
	return "\
	"+prefix()+"\
	SELECT ?urn ?width ?height\
	WHERE {\
		?urn this:type 'resize'.\
		?urn this:upload <"+urn+">\
		OPTIONAL { ?urn this:width ?width . }\
		OPTIONAL { ?urn this:height ?height . }\
	}"
	}
	
	function in_upload( urn ) {
		return sparql.search( query(urn) ).then( 
		function( data ){
			var out = []
			for ( var i=0; i<data.length; i++ ){
				var item = {}
				for ( var key in data[i] ){
					item[key] = data[i][key].value;
				}
				out.push( item );
			}
			return out;
		});
	}
}]);