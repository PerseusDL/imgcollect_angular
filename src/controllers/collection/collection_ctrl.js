// collection/:urn

appControllers.controller( 'CollectionCtrl', [ 
'$scope',
'$injector',
'user',
'$rootScope',
'onto',
'collection',
function( $scope, $injector, user, $rootScope, onto, collection ){
  
  $scope.title = "Collection";
	$scope.keys = [ 'urn','label','desc','user','time' ];

  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var keyword = onto.with_prefix('subject');
  var imgViewer = onto.with_prefix('imgViewer');
  var imgServer = onto.with_prefix('imgServer');

  $scope.form = {};
  $scope.form[label] = '';
  $scope.form[desc] = '';
  $scope.form[keyword] = [];
  $scope.form[imgServer] = '';
  $scope.form[imgViewer] = '';
  
  // Run after user has been authorized
  
  $rootScope.$on( user.events.ok, function(){ go() });
  function go(){
    $injector.invoke( EditCtrl, this, { $scope: $scope } );
    $scope.init([ label, desc, imgServer,imgViewer ]);
    
    // Retrieve Collection Items
  
    collection.items( $scope.urn ).then(
    function( data ){ 
			$scope.items = data;
		});
  }
	
}]);