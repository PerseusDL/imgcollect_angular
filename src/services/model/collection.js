app.service( 'collection', [
'sparql',
'results',
'onto',
'query',
function( sparql, results, onto, query ) {
	
  return({
    get:get,
    search:search,
		items:items
  })
  
  function prefix(){
    return onto.prefixes();
  }
  
  
  // Get all collections
  
  function get(){
    return sparql.search( get_query() ).then( 
    function( data ){
      return results.list( data );
    });
  }
  
  function get_query(){
  return "\
  "+prefix()+"\
  SELECT ?urn\
  WHERE {\
    ?urn " + onto.with_prefix('type') + " 'collection'\
  }"
  }
  
  
  // Search for a specific collection
  
  function search( str ){
    return sparql.search( search_query( str ) ).then( 
    function( data ){
      return results.list( data );
    });
  }
  
  function search_query( str ){
  return "\
  "+prefix()+"\
  SELECT ?urn\
  WHERE {\
    ?urn " + onto.with_prefix('type') +" 'collection'\
    FILTER regex( str(?urn), \""+str+"\" )\
  }"
  }
	
	
	// Find collection items
	
	function items( urn ){
		var q = {
			where:[
				[ '?urn', 'memberOf', '<'+urn+'>' ],
				[ '?urn', 'label', '?label', { optional:true } ],
				[ '?urn', 'description', '?desc', { optional:true } ],
				[ '?urn', 'created', '?time', { optional:true } ],
				[ '?urn', 'represents', '?rep', { optional:true } ],
				[ '?urn', 'creator', '?user', { optional:true } ],
				[
					[ '?urn', 'src', '?up'],
					[ '?res', 'memberOf', '?up' ],
					[ '?res', 'src', '?thumb' ],
					{ optional:true }
				],
			]
		}
		return query.get( q ).then(
		function( data ){
			return data;
		});
	}
  
}]);
/*

var c = tserv('collection');
c.items('urn:cite:perseus:crystals');

*/