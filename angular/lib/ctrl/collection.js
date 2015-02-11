// new/collection

appControllers.controller( 'CollectionNew', [
'$scope',
'$injector', 
'urnServ', 
'$rootScope',
'user', 
'onto',
function( $scope, $injector, urnServ, $rootScope, user, onto ){
  
  $scope.title = "Collection New";
  $scope.type = "collection";
  $scope.show_uniq = true;
	$scope.error = false;
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  $scope.form = {};
  $scope.form[label] = onto.default_value('label');
  $scope.form[desc] = onto.default_value('description');
  
  // Run after user has been authorized
  
  $rootScope.$on( user.events.ok, function(){ go() });
  function go(){
    
    // Inherit from parent
	
    $injector.invoke( NewCtrl, this, { $scope: $scope } );
    $scope.init([ label, desc ]);
  }


  // Check CITE URN for uniqueness
  
  $scope.urn_uniq = function(){
    urnServ.uniq( $scope.urn, uniq_callback );
  }
  

  // $scope.urn_uniq callback function
  
  var uniq_callback = function( bool, urn ){
    $scope.show_uniq = !bool;
		$scope.show_error = !bool;
    if ( bool == true ){
      
      // This next line claims a CITE URN and JackSON /data URL
      // AND it retrieves default JSON-LD template
      
      // See lib/new_ctrl.js: $scope.claim
      
      $scope.claim( urn );
      return;
    }
    else {
      $scope.stdout += 'That URN is taken. Choose another.'
    }
  }
}]);


// collections

appControllers.controller( 'CollectionListCtrl', [
'$scope',
'$injector',
'$rootScope',
'$routeParams',
'user',
'onto',
'query',
function( $scope, $injector, $rootScope, $routeParams, user, onto, query ){
  $scope.type = "collection";
  $scope.keys = [ 'urn','label','desc','user','time' ];
	$scope.limit = 10;
  $scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );

  // The fields you allow users to filter
  // are set with object keys in $scope.filter

  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  $scope.filter = {};
  $scope.filter[label] = null;
  $scope.filter[desc] = null;

	$scope.query = function(){
		return {
			where: [
				[ '?urn', 'type', '"collection"' ],
				user_check(),
				[ '?urn', 'label', '?label', build_filter( '?label', label ) ],
				[ '?urn', 'description', '?desc', build_filter( '?desc', desc ) ],
				[ '?urn', 'created', '?time', { optional:true } ],
				[ '?urn', 'represents', '?rep', { optional:true } ],
				[ '?urn', 'creator', '?user', { optional:true } ],
			],
			order_by: 'desc( ?time )',
			limit: $scope.limit,
			offset: $scope.limit * ( $scope.page-1 )
		}
	}

	function user_check(){
		if ( user.only ) {
			return [ '?urn', 'creator', "<"+user.url()+">" ];
		}
		return null;
	}

	// Build a filter clause

	function build_filter( key, handle ){
		var filter = $scope.filter[ handle ]
		if ( filter == null ){
			return angular.copy( { optional:true } );
		}
		return angular.copy({ filter:'regex( '+key+', "'+ filter +'", "i" )' });
	}

  // Start once user event fires 

  $rootScope.$on( user.events.ok, 
    function(){ $scope.apply_filter() }
	);

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

  // Applying the filter is the same as initializing..

  $scope.apply_filter = function(){
	
		// Get count
	
		query.count( $scope.query() ).then(
		function( data ){
			$scope.count = data;
      $scope.pages = Math.ceil( $scope.count / $scope.limit );
      $scope.prev = ( $scope.page > 1 ) ? true : false;
      $scope.next = ( $scope.page < $scope.pages ) ? true : false;
		});
	
		// Get the data
	
    query.get( $scope.query() ).then( 
		function( data ){
			$scope.json = data;
		});
  }
	
}]);


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
			console.log( data );
		});
  }
	
}]);
