var appControllers = angular.module('appControllers',[]);


// home

appControllers.controller( 'HomeCtrl', ['$scope','$injector','user',
	function( $scope, $injector, user ){
		$scope.title = "Home";
		$scope.type = "home";
		$scope.keys = [ 'urn', 'type', 'label', 'desc', 'time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		
		$scope.number = "\
		SELECT count( distinct ?urn )\
		WHERE {\
			?urn <http://data.perseus.org/sosol/users/> <http://data.perseus.org/sosol/users/"+user.id+">\
		}";
		
		$scope.select = "\
		SELECT ?urn ?type ?label ?desc ?time\
		WHERE {\
			?urn <http://data.perseus.org/sosol/users/> <http://data.perseus.org/sosol/users/"+user.id+">\
			OPTIONAL { ?urn this:type ?type . }\
			OPTIONAL { ?urn rdf:label ?label . }\
			OPTIONAL { ?urn rdf:description ?desc . }\
			OPTIONAL { ?urn xml:dateTime ?time . }\
		}";
		
		$scope.init();
	}
]);

// new/collection

appControllers.controller( 'CollectionNew', ['$scope','urnServ', function( $scope, urnServ ){
	
		$scope.title = "Collection New";
		$scope.stdout = "";
		
		
		// Needed to build a valid CITE
		
		$scope.id = null;
		$scope.urn = '';
		$scope.base_urn = urnServ.base;
				

		// Claim JackSON data url and CITE URN
		
		var is_uniq = function( bool, urn ){
			if ( bool == true ) {
				urnServ.claim( 'collection/'+urn, urn ).then(
					function( data ){ 
						$scope.stdout = data;
						default_json()
					}
				);
			}
		}
		
		
		// Load the default JSON data
		
		var default_json = function(){
			console.log( 'load_default json')
		}
		
		// Check CITE URN for uniqueness
		
		$scope.urn_uniq = function(){
			urnServ.uniq( $scope.urn, is_uniq );
		}
		
		// Build CITE URN
		$scope.urn_build = function(){
			$scope.urn = $scope.base_urn+$scope.id;
		}
	}
]);


// collections

appControllers.controller( 'CollectionListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "collection";
		$scope.title = "Collection List";
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


// collection/:urn

appControllers.controller( 'CollectionCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Collection";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);


// new/upload

appControllers.controller( 'UploadNew', ['$scope','urnServ',
	function( $scope, urnServ ){
		$scope.title = "Upload New";
		$scope.stdout = "";

		var after_fresh = function( urn ){
			urnServ.claim( 'upload/'+urn, urn ).then(
				function( data ){ $scope.stdout = data }
			);
		}
		urnServ.fresh( "urn:cite:perseus:uploads.{{ id }}", after_fresh );
	}
]);


// uploads

appControllers.controller( 'UploadListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "upload";
		$scope.title = "Upload List";
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


// upload/:urn

appControllers.controller( 'UploadCtrl', ['$scope','$injector','resize',
	function( $scope, $injector, resize ){
		$scope.title = "Upload";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
		$scope.resize = [];
		resize.in_upload( $scope.urn ).then(
			function( data ) { $scope.resize = data }
		);
	}
]);


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

appControllers.controller( 'ItemCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Item";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);


// annotations

appControllers.controller( 'AnnotationListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
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
]);


// annotation/:urn

appControllers.controller( 'AnnotationCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Annotation";
	}
]);


// User

appControllers.controller( 'UserCtrl', ['$scope','$injector','user',
	function( $scope, $injector, user ){
		$scope.user = user.id;
		$scope.switch = function( bool ){
			user.only = bool;
			init();
		}
		function init(){
			$scope.only = user.only;
		}
		init();
	}
]);