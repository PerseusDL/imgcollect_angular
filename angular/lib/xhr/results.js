app.service( 'results', [ function( sparql ) {
  
  return({
    list:list,
    more:more
  });
  
  // Process results returned from SPARQL query
  
  // URN list
  
  function list( data ){
    var out = [];
    for ( var i=0; i<data.length; i++ ){
      var item = {};
      for ( var key in data[i] ){
        item[key] = data[i][key].value;
      }
      out.push( item );
    }
    return out;
  }
  
  function key_swap( swap, config ){
    for ( var key in config ){
      if ( swap.indexOf( config[key] ) == 0 ) {
        return swap.replace( config[key], key+":" );
      }
    }
    return swap;
  }
  
  // More than the URN list
  
  function more( data, config ){
    var out = [];
    var urns = {};
    for ( var i=0; i<data.length; i++ ){
      var urn = data[i].urn.value;
      var p = key_swap( data[i].p.value, config );
      var o = data[i].o.value;
      if ( ! ( urn in urns ) ){
        urns[ urn ] = {};
      }
      urns[ urn ][ 'urn' ] = urn;
      urns[ urn ][ p ] = o;
    }
    for ( var key in urns ){
      out.push( urns[key] );
    }
    return out;
  }

  
}]);