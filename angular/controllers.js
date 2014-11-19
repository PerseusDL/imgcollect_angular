var appControllers = angular.module('appControllers',[]);

appControllers.controller('HomeCtrl', ['$scope','$injector','user',
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

// Collection List
appControllers.controller('CollectionListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "collection";
		$scope.title = "Collection List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Collection
appControllers.controller('CollectionCtrl', ['$scope','$injector',
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

// Upload new
appControllers.controller('UploadNew', ['$scope','urn',
	function( $scope, urn ){
		$scope.title = "Upload New";
		$scope.urn = "urn:cite:perseus:uploads.OKeTDxLa9eO";
		$scope.go = function( fresh ){
			switch ( fresh ) {
				case true:
					console.log('good to go!');
					break;
				case false:
					console.log('wait a minute!');
					break;
				default:
					throw "Something is seriously wrong with your urn.fresh() callback!"
					break;
			}
		}
		urn.check( $scope.urn, $scope.go );
	}
]);

// Upload list
appControllers.controller('UploadListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "upload";
		$scope.title = "Upload List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Upload
appControllers.controller('UploadCtrl', ['$scope','$injector','resize',
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

// Image List
appControllers.controller('ItemListCtrl', ['$scope','$injector', 
	function( $scope, $injector ){
		$scope.type = "item";	
		$scope.title = "Item List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Image
appControllers.controller('ItemCtrl', ['$scope','$injector',
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

// Annotation List
appControllers.controller('AnnotationListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "annotation";
		$scope.title = "Annotation List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Annotation
appControllers.controller('AnnotationCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Annotation";
	}
]);

// User
appControllers.controller('UserCtrl', ['$scope','$injector','user',
	function( $scope, $injector, user ){
		$scope.user = user.id;
		function init() {
			$scope.only = user.only;
		}
		init();
	}
]);