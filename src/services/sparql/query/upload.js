app.service( 'upload', [
'sparql',
'results',
'onto',
function( sparql, results, onto ){
	
  return({
    by_annotation:by_annotation
  })
  
  function prefix() {
    return onto.prefixes();
  }
  
  function by_annotation( urn ) {
    return sparql.search( annotation_query( urn ) ).then(
    function( data ){
      return results.list( data );
    });
  }
  
  function annotation_query( urn ) {
  return "\
  "+prefix()+"\
  SELECT ?urn\
  WHERE {\
    <"+urn+"> " + onto.pre('memberOf') + " ?item .\
    ?item " + onto.pre('src') + " ?urn\
  }"
  }
}]);
