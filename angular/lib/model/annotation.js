app.service( 'annotation', [ 'sparql', 'results', 'json', function( sparql, results, json ){
  
  return({
    by_item:by_item,
    by_item_more:by_item_more,
    upload_src:upload_src
  });
  
  function config() {
    return {
    'this': 'https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#',
    cite: 'http://www.homermultitext.org/cite/rdf/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    user: 'http://data.perseus.org/sosol/users/'
    };
  }
  
  function prefix(){
    var pre = [];
    var conf = config();
    for ( var key in conf ){
      pre.push( 'PREFIX '+key+': <'+conf[key]+'>' );
    }
    return pre.join(" ");
  }
  
  
  function query( where ){
  return "\
  "+prefix()+"\
  SELECT ?urn ?p ?o\
  WHERE {\
    ?urn this:type 'annotation'.\
    "+where+"\
  }"
  }
  
  // Retrieve list of annotations related to item
  
  function by_item( urn ){
    return sparql.search( item_query( urn ) ).then(
    function( data ){
      return results.list( data );
    });
  }
  
  function item_query( urn ){
    return query( "?urn cite:belongsTo <"+urn+">" );
  }
  
  // Retrieve more annotation data
  
  function by_item_more( urn ){
    return sparql.search( more_query( urn ) ).then(
    function( data ){
      return results.more( data, config() );
    });
  }
  
  function more_query( urn ){
    var where = "?urn cite:belongsTo <"+urn+">.\
             ?urn ?p ?o";
    return query( where );
  }
  
  // Find upload_src
  
  function upload_src( urn ){
    return sparql.search( upload_src_query( urn ) ).then(
    function( data ){
      return results.list( data );
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
}]);