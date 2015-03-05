// item/:urn

appControllers.controller( 'ItemCtrl', [
'$scope',
'$injector',
'onto',
'item',
function( $scope, $injector, onto, item ){
	
  $scope.title = "Item";
	
  var label = onto.pre('label');  
  var desc = onto.pre('description');
  var rep = onto.pre('represents');
  var license = onto.pre('rights');
  var keyword = onto.pre('subject');
	
  $scope.form = {};
  $scope.form[label] = "";
  $scope.form[desc] = "";
  $scope.form[rep] = "";
  $scope.form[license] = "";
  $scope.form[keyword] = [];
  $injector.invoke( EditCtrl, this, { $scope: $scope } );
  $scope.init([label,desc,rep,license]);
  
  // Collection URN
  
  var collection = {}
  collection.urn = $scope.urn.substring( 0, $scope.urn.indexOf('.') )
  $scope.collections = [];
  $scope.collections[0] = collection;
	
	// ROIS
	
	var rois = {}
	item.rois( $scope.urn ).then( function( data ){
		$scope.rois = data;
	})
	
	// Upload thumb
	
	item.thumb( $scope.urn ).then(
	function( data ){
		$scope.upload = data;
	});
	
	// Upload src
	item.upload_src( $scope.urn ).then(
	function( data )	{
		$scope.img_src = data[0]['img'];
	});
	
	
}]);