// JsonMsg
// Makes communication with JackSON server more transparent
// to the user.

appControllers.controller( 'JsonMsg', [
'$scope',
'json',
function( $scope, json ){
  
  var update = function( method, url, stat, msg ){
    $scope.method = method;
    $scope.url = url;
    $scope.status = stat;
    $scope.msg = msg;
    $scope.hide = false;
    switch( $scope.status ){
      case json.state().success:
        $scope.mode = 'success'
        break;
      case json.state().error:
        $scope.mode = 'alert'
        break;
      default:
        $scope.mode = 'secondary'
    }
  }
  
  json.on_change( update );
}]);