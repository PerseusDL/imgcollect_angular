// new/collection

appControllers.controller( 'CollectionNew', ['$scope','$injector', 'urnServ', '$rootScope', 'user',
	function( $scope, $injector, urnServ, $rootScope, user ){
		
		$scope.title = "Collection New";
		$scope.type = "collection";
		$scope.show_uniq = true;
		
		
		// Run after user has been authorized
		
		$rootScope.$on( user.events.ok, function(){ go() });
		function go(){
			
			// Inherit from parent

			$injector.invoke( NewCtrl, this, { $scope: $scope } );
		}


		// Check CITE URN for uniqueness
		
		$scope.urn_uniq = function(){
			urnServ.uniq( $scope.urn, uniq_callback );
		}
		

		// $scope.urn_uniq callback function
		
		var uniq_callback = function( bool, urn ){
			$scope.show_uniq = !bool;
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
	}
]);


// collections

appControllers.controller( 'CollectionListCtrl', ['$scope','$injector','user','$rootScope',
	function( $scope, $injector, user, $rootScope ){
		
		$scope.type = "collection";
		$scope.title = "Collection List";
		$scope.keys = [ 'urn','label','desc','user','time' ];

		
		// Run after user has been authorized
		
		$rootScope.$on( user.events.ok, function(){ go() });
		function go(){
			
			// Inherit from parent

			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
		}
		
		// The fields you allow users to filter
		// are set with object keys in $scope.filter
		
		// See lib/list_ctr.js: filter()
		
		$scope.filter = {
			"rdf:label": null,
			"rdf:description": null
		}
		
		
		// Applying the filter is the same as initializing..
		
		$scope.apply_filter = function(){
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
		}
	}
]);


// collection/:urn

appControllers.controller( 'CollectionCtrl', [ '$scope','$injector','item', 'user', '$rootScope',
	function( $scope, $injector, item, user, $rootScope ){
		
		$scope.title = "Collection";
		$scope.form = {
			'rdf:label':'',
			'rdf:description':'',
			'this:keyword':[]
		};
		
		// Run after user has been authorized
		
		$rootScope.$on( user.events.ok, function(){ go() });
		function go(){
			$injector.invoke( EditCtrl, this, { $scope: $scope } );
			$scope.init();
			
			// Retrieve Collection Items
		
			item.by_collection( $scope.urn ).then(
				function( data ){ $scope.items = data }
			);
		}
	}
]);
