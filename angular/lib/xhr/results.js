app.service( 'results', [ function( sparql ) {
	
	return({
		list:list,
		more:more
	});
	
	// Process results returned from SPARQL query
	
	// URN list
	
	function list( data ){
		var out = [];
		for ( var i=0; i<data.length; i++ ){
			var item = {};
			for ( var key in data[i] ){
				item[key] = data[i][key].value;
			}
			out.push( item );
		}
		return out;
	}
	
	// More than the URN list
	
	function more( data ){
		var out = [];
		var urns = {};
		for ( var i=0; i<data.length; i++ ){
			var urn = data[i].urn.value;
			var p = data[i].p.value;
			var o = data[i].o.value;
			if ( ! ( urn in urns ) ){
				urns[ urn ] = {};
			}
			urns[ urn ][ 'urn' ] = urn;
			urns[ urn ][ p ] = o;
		}
		for ( var key in urns ){
			out.push( urns[key] );
		}
		return out;
	}

	
}]);