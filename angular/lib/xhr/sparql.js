app.service( 'sparql', ['$http', '$q', 'config', function( $http, $q, config ) {

  // Publicly accessible methods
  
  return ({
    search: search
  });
  
  
  // SPARQL search
  
  function search( search ) {
    var request = get( search );
    return( request.then( 
      function( r ){ return r.data.results.bindings  },
      function( r ){ return r }
    ));
  }
  
  
  // JackSON wrapper
  
  function get( search ) {
  
                // we add the request for json output explicitly to the query
                // because if fuseki is deployed behind a proxy the content-type
                // header in the request may not get forwarded and fuseki will
                // return text - better safe than sorry here
    var query = config.xhr.sparql.url+'?query='+encodeURIComponent( search )+"&output=json";
    return $http({
      method: 'GET',
      url: query,
        headers: {
            'Content-Type': 'application/json'
        }
    });
  }
}]);
