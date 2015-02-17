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