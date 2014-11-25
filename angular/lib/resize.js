app.service( 'resize', ['sparql', function( sparql ) {
	return ({
		get:get
	})
	
	function prefix() {
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
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
	
	function get( urn ) {
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