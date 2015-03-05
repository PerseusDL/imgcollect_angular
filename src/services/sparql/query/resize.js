app.service( 'resize', [
'sparql',
'results',
'onto', 
function( sparql, results, onto ) {
	
  return ({
    get:get
  })
  
  function prefix() {
    return onto.prefixes();
  }
  
  function query( urn ) {
  return "\
  "+prefix()+"\
  SELECT ?urn ?width ?height\
  WHERE {\
    ?urn " + onto.pre('type') +" 'resize'.\
    ?urn " + onto.pre('memberOf') + " <"+urn+">\
    OPTIONAL { ?urn " + onto.pre('width') + " ?width . }\
    OPTIONAL { ?urn " + onto.pre('height') +" ?height . }\
  }"
  }
  
  function get( urn ) {
    return sparql.search( query(urn) ).then( 
    function( data ){
      return results.list( data );
    });
  }
}]);
