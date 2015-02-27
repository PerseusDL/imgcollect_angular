app.service( 'roi', [
'query',
'onto',
'user',
function( query, onto, user ){
  
  return({
    by_label:by_label
  })
  
  
  // Get the ROIs by label
  
  function by_label( filter ){
    var q = {
      where:[
        [ '?urn', 'type', '"roi"'],
        [ '?urn', 'label', '?label', 
          { filter:'regex( ?label, "'+ filter +'", "i" )' }
        ],
				[ '?urn', 'description', '?description', { optional: true } ],
        [
          [ '?crop', 'represents', '?urn' ],
          [ '?crop', 'type', '"crop"' ],
          [ '?crop', 'src', '?src' ],
          { optional: true }
        ] 
      ]
    }
    return query.get( q ).then(
    function( r ){
      return r
    });
  }
  
}
  
]);