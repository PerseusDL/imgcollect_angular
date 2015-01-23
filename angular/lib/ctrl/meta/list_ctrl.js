var ListCtrl = [
'$scope',
'sparql',
'user',
'$routeParams',
'onto',
function( $scope, sparql, user, $routeParams, onto ){
  
  // Actual list data
  
  $scope.json = {};
  
  
  // SPARQL prefixes
  
  $scope.prefix = onto.prefixes();
  
  
  // Needed for pagination
  
  $scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );
  $scope.order = "?time";
  $scope.limit = "10";
  $scope.pages = null;
  $scope.paginate = "\
  ORDER BY DESC( "+$scope.order+" )\
  LIMIT "+$scope.limit+"\
  OFFSET "+$scope.limit*($scope.page-1)+"\
  ";
  
  
  // Needed to build SPARQL SELECT query
  // that will populate $scope.json.
  // See optionals() and handles()

  var label = onto.with_prefix('label');
  var desc = onto.with_prefix('description');
  var created = onto.with_prefix('created');
  var represents = onto.with_prefix('represents');
 
  // TODO these fields should be driven from the config
  // and the query fields independent from how they are
  // set on the filter
  $scope.items = {};
  $scope.items[label] = "?label";
  $scope.items[desc] = "?desc";
  $scope.items[created] = "?time";
  $scope.items[represents] = "?rep";
  $scope.items["<"+onto.with_ns('creator')+">"] = "?user";
  
  
  // Build the SPARQL SELECT query
  
  $scope.select = "\
  SELECT ?urn "+handles()+"\
  WHERE {\
    "+where()+"\
    "+filter()+"\
    "+optionals()+"\
  }";
  $scope.query = "";
  
  
  // Get record count
  
  $scope.number = "\
  SELECT count( distinct ?urn )\
  WHERE {\
    "+where()+"\
    "+filter()+"\
  }";
  
  $scope.init = function(){ init() }
  
  
  // Clear the filter
  
  $scope.clear_filter = function(){
    for ( var key in $scope.filter ){
      $scope.filter[key] = null;
    }
    $scope.apply_filter();
  }
  
  
  // Filtering changes if user.only changes

  $scope.$watch( function(){ return user.only },
    function( newVal, oldVal ){
      if ( newVal != oldVal ){
        $scope.apply_filter();
      }
    }
  );

  
  
  // Only your data or everyones?
  
  function where() {
    if ( user.only == true ){
      return "?urn <" + onto.with_ns('type') +"> '"+$scope.type+"'.\
      ?urn <"+ onto.with_ns('creator') +"> <"+user.url()+">;";
    }
    return "?urn <" + onto.with_ns('type') + "> '"+$scope.type+"';";
  }
  
  
  // Build a SPARQL filter clause
  
  function filter() {
    var items = [];
    var regex = [];
    var out = '';
    for ( var key in $scope.filter ){
      var check = $scope.filter[key];
      if ( check == null ) continue;
      var item = $scope.items[key];
      items.push( key+' '+item );
      regex.push( 'regex( '+item+', "'+check+'", "i" )' );
    }
    if ( items.length > 0 ){
      out = items.join(";\n")+"\nFILTER ( "+regex.join(" && ")+" )";
    }
    return out;
  }
  
  function handles() {
    var out = [];
    for ( var key in $scope.items ){
      out.push( $scope.items[key] );
    }
    return out.join(' ');
  }
  
  function optionals() {
    var out = [];
    for ( var key in $scope.items ){
      var obj = $scope.items[key];
                        out.push( "OPTIONAL { ?urn "+key+" "+obj+" . }" );
    }
    return out.join("\n");
  }
  
  function list() {
    $scope.query = $scope.prefix + $scope.select + $scope.paginate;
    return sparql.search( $scope.query ).then( 
      function( data ){
        $scope.json = data;
      }
    );
  }
  
  function count() {
    var count = $scope.prefix + $scope.number;
    return sparql.search( count ).then(
      function( data ){
        $scope.count = data[0]['.1'].value;
        $scope.pages = Math.ceil( $scope.count / $scope.limit );
        $scope.prev = ( $scope.page > 1 ) ? true : false;
        $scope.next = ( $scope.page < $scope.pages ) ? true : false;
      }
    )
  }
  
  function init() {
    if ( !('type' in $scope) ){
      throw "$scope.type is not defined.";
    }
    count();
    list();
  }
}];
