app.service( 'collection', [
'sparql',
'results',
'onto', 
function( sparql, results, onto ) {
	
  return({
    get:get,
    search:search
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
  
}]);
