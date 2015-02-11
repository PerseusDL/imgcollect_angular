app.service( 'item', [
'sparql',
'results',
'onto',
'query',
function( sparql, results, onto, query ) {
	
  return({
    by_upload:by_upload,
    by_collection:by_collection,
		thumb:thumb
  })
  
  function prefix() {
    return onto.prefixes();
  }
  
  function old_query( where ){
  return "\
  "+prefix()+"\
  SELECT ?urn\
  WHERE {\
    ?urn " + onto.with_prefix('type') +" 'item'.\
    "+where+"\
  }"
  }
  
  
  // Retrieve items associated with an upload
  
  function by_upload( urn ){
    return sparql.search( upload_query(urn) ).then( 
    function( data ){
      return results.list( data );
    });
  }

  function upload_query( urn ){
  return old_query( "?urn " + onto.with_prefix('src') + " <"+urn+">" );
  }
  
  
  // Retrieve items associated with a collection
  
  function by_collection( urn ){
    return sparql.search( collection_query(urn) ).then(
    function( data ){
      return results.list( data );
    });
  }
  
  function collection_query( urn ){
    return old_query( "?urn " + onto.with_prefix('memberOf') + " <"+urn+">" );    
  }
  
	function thumb( urn ){
		var q = {
			where:[
				[ '<'+urn+'>', 'src', '?up'],
				[ '?res', 'memberOf', '?up' ],
				[ '?res', 'src', '?thumb', { optional:true } ]
			]
		}
		return query.get( q ).then(
		function( data ){
			return data;
		});
	}
	
}]);
/*

var c = tserv('item');
c.thumb('urn:cite:perseus:crystals.APyNKeJBqXt');

*/