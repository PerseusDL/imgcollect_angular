// Sparql Msg
// Makes communcation with SPARQL endpoint more transparent

appControllers.controller( 'SparqlMsg', [
'$scope',
'sparql',
function( $scope, sparql ){
  
  $scope.query = '';
  var update = function( status, query ){
    $scope.query = query;
  }
  sparql.on_change( update );
  
}]);