// annotations

appControllers.controller( 'AnnotationListCtrl', ['$scope','$injector', 'user', '$rootScope',
	function( $scope, $injector, user, $rootScope ){
		
		// Start once user event fires 
		
		$rootScope.$on( user.events.ok, function(){ go() });
		
		function go(){
			$scope.type = "annotation";
			$scope.title = "Annotation List";
			$scope.keys = [ 'urn','label','desc','user','time' ];
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
			
			// The fields you allow users to filter
			// are set with object keys in $scope.filter
			//
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
	}
]);


// annotation/:urn

appControllers.controller( 'AnnotationCtrl', ['$scope','$injector','annotation', 'user', '$rootScope',
	function( $scope, $injector, annotation, user, $rootScope ){
		
		// Start once user event fires 
		
		$rootScope.$on( user.events.ok, function(){ go() });
		
		function go(){
			$scope.title = "Annotation";
			$scope.form = {
				'rdf:label':"",
				'rdf:description':"",
				'this:keyword':[]
			};
			$injector.invoke( EditCtrl, this, { $scope: $scope } );
			
			
			// Run once data is retrieved
			
			$scope.run = function(){
				
				// Item URN
				
				$scope.items = [];
				$scope.items[0] = { urn: $scope.json['cite:belongsTo']['@id'] };
				
				// Get the upload
				
				annotation.upload_src( $scope.urn ).then(
					function( data ){
						$scope.src = data[0].src;
					}
				);
			}
		}
		
		$scope.init();
	}
]);