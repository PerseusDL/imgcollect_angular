app.service( 'collection', [
'sparql',
'results',
'onto',
'query',
'user',
function( sparql, results, onto, query, user ) {
	
  return({
    get:get,
    search:search,
		items:items,
		belonging_to:belonging_to,
		mine:mine
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
    ?urn " + onto.pre('type') + " 'collection'\
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
    ?urn " + onto.pre('type') +" 'collection'\
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
	
	
	// Get a user's collections
	
	function belonging_to( user_url ){
		if ( user_url == null ) {
			throw 'belonging_to() requires user_url'
		}
		var q = {
			where:[
				[ '?urn', 'type', '"collection"' ],
				[ '?urn', 'label', '?label' ],
				[ '?urn', 'creator', '<'+ user_url +'>' ]
			]
		}
		return query.get( q ).then(
		function( data ){
			return data;
		});
	}
	
	
	// Get the current user's collections
	
	function mine(){
		return belonging_to( user.url() );
	}
  
}]);

/*

var c = tserv('collection');
c.items('urn:cite:perseus:crystals');

*/