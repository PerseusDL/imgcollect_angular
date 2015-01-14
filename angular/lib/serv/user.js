app.service( 'user', [ '$http', '$q', 'config', function( $http, $q, config ) {
  
  // Event namespace
  
  var ns = 'SERVICE.USER.';
  
  // Variables
  
  var data = null;
  var error = null;
  
  
  // What gets made available?
  
  return({
    data: function(){ 
      return ( data != null ) ? data : null 
    },
    dir: function(){ 
      return ( data != null ) ? data.uri.dirname() : null 
    },
    id: function(){ 
      return ( data != null ) ? data.uri : null 
    },
    url: function(){ 
      return ( data != null ) ? data.uri : null 
    },
    events: {
      ok: ns+'OK',
      error: ns+'ERROR'
    },
    error: function(){ return error },
    check: check,
    only: false
  });
  
  
  // Make sure user exists
  // see app.js/
  
  function check(){
    var def = $q.defer();
    
    // If you already have user data
    // don't request new user data
    
    if ( data != null ){
      def.resolve();
      return def.promise
    }
    
    // Ping Perseids to get user data
    
    $http.get(config.serv.user.ping, { withCredentials: true} ).then( 
      function( res ){
        data = res.data.user;
        def.resolve();
      },
      function( err ){
        error = err;
        def.reject();
      }
    )
    return def.promise;
  }
}]);
