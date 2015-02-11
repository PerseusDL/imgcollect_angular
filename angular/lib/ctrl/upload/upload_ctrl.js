// upload/:urn

appControllers.controller( 'UploadCtrl', [
'$scope',
'$injector',
'resize',
'item',
'onto',
function( $scope, $injector, resize, item, onto ){
  $scope.title = "Upload";
	
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var keyword = onto.with_prefix('subject');
  var rights = onto.with_prefix('rights');
  var owner = onto.with_prefix('owner');
	
  $scope.form = {};
  $scope.form[label] = null;
  $scope.form[desc] = null;
  $scope.form[owner] = null;
  $scope.form[rights] = onto.default_value('rights');
  $scope.form[keyword] = [];
  
  $injector.invoke( EditCtrl, this, { $scope: $scope } );
  $scope.init([label,desc,owner,rights]);
  
  // Resize
  
  $scope.resize = [];
  resize.get( $scope.urn ).then(
    function( data ){ $scope.resize = data }
  );
  
  // Items
  
  $scope.items = [];
  item.by_upload( $scope.urn ).then(
    function( data ){ $scope.items = data }
  );
  
}]);