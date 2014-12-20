// items

appControllers.controller( 'ItemListCtrl', ['$scope','$injector', 
	function( $scope, $injector ){
		$scope.type = "item";	
		$scope.title = "Item List";
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
]);


// item/:urn

appControllers.controller( 'ItemCtrl', ['$scope','$injector','annotation',
	function( $scope, $injector, annotation ){
		$scope.title = "Item";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
		
		// Collection URN
		
		var collection = {}
		collection.urn = $scope.urn.substring( 0, $scope.urn.indexOf('.') )
		$scope.collections = [];
		$scope.collections[0] = collection;
		
		// Annotation URNs
		
		$scope.annotations = [];
		annotation.by_item( $scope.urn ).then(
			function( data ){ $scope.annotations = data }
		);
	}
]);


// new/item/:urn

appControllers.controller( 'ItemNew', ['$scope','urnServ','$routeParams','collection',
	'$location','json','stdout','user',
	function( $scope, urnServ, $routeParams, collection, $location, json, stdout,user ){
		$scope.upload_urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
		$scope.type = "item";
		$scope.title = "Item New";
		$scope.urn = null;
		$scope.ready = false;
		$scope.collection = null;
		$scope.form = {};
		
		// Path to default item JSON
		
		$scope.src = 'default/'+$scope.type+'.json';		
		
		
		// User clicks collection to add upload
		
		$scope.add_to = function( urn ){
			$scope.collection = urn;
			
			// Create a new item URN
			
			urnServ.fresh( urn+".{{ id }}", fresh_callback );
		}
		
		
		// Get collections for the collection selector
		
		$scope.search = function(){
			var str = $scope.form.search;
			$scope.collections = [];
			collection.search( str ).then(
				function( data ){ $scope.collections = data }
			);
		}
		
		
		// Once you have a fresh item URN
		
		var fresh_callback = function( urn ){
			$scope.urn = urn;
			$scope.ready = true;
		}
		
		
		// User clicks edit item URN button
		
		$scope.create_item = function(){ default_json() }
		
		
		// Build the data path URL
	
		$scope.data_path = function( urn ){
			return $scope.type+'/'+urn
		}
		
		
		// Save the default after writing the most basic values
	
		var save = function(){
			touch();
			json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
			function( data ){
				
				// Congratulations!
				// You've added an upload to a collection
				// Go to Edit item view
				
				$location.path('item/'+$scope.urn );	
			});
		}
	
	
		// Set basic values
	
		var touch = function(){
			$scope.json['@id'] = $scope.urn;
			$scope.json['this:upload']['@id'] = $scope.upload_urn;
			$scope.json['user']['@id'] = 'user:'+user.id();
			$scope.json['cite:belongsTo']['@id'] = $scope.collection;
			$scope.json['dateTime'] = ( new TimeStamp ).xsd();
		}
	
	
		// Load the default JSON data
	
		var default_json = function(){
			json.get( $scope.src ).then(
			function( data ){
				$scope.json = data;
				stdout.log( "Default JSON loaded from: "+$scope.src );
				save();
			});
		}
	}
]);