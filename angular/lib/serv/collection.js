app.service( 'collection', ['sparql', function( sparql ) {
	return({
		get:get
	})
	
	function prefix() {
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
	}
	
	function query() {
	return "\
	"+prefix()+"\
	SELECT ?urn\
	WHERE {\
		?urn this:type 'collection'\
	}"
	}
	
	function get() {
		return sparql.search( query() ).then( 
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