app.service( 'annotation', ['sparql', function( sparql ){
	return({
		by_item:by_item,
		upload_src:upload_src
	})
	
	function prefix(){
	return "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
	PREFIX cite: <http://www.homermultitext.org/cite/rdf/>";
	}
	
	function query( where ){
	return "\
	"+prefix()+"\
	SELECT ?urn\
	WHERE {\
		?urn this:type 'annotation'.\
		"+where+"\
	}"
	}
	
	// Retrieve annotations related to item
	
	function by_item( urn ){
		return sparql.search( item_query( urn ) ).then(
		function( data ){
			return results( data );
		});
	}
	
	function item_query( urn ){
		return query( "?urn cite:belongsTo <"+urn+">" );
	}
	
	// Find upload_src
	
	function upload_src( urn ){
		return sparql.search( upload_src_query( urn ) ).then(
		function( data ){
			return results( data );
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