app.service( 'resize', ['sparql','results', 'onto', function( sparql, results, onto ) {
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
    ?urn " + onto.with_prefix('type') +" 'resize'.\
    ?urn " + onto.with_prefix('src') + " <"+urn+">\
    OPTIONAL { ?urn " + onto.with_prefix('width') + " ?width . }\
    OPTIONAL { ?urn " + onto.with_prefix('height') +" ?height . }\
  }"
  }
  
  function get( urn ) {
    return sparql.search( query(urn) ).then( 
    function( data ){
      return results.list( data );
    });
  }
}]);
